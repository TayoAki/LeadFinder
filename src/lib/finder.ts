import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { InsufficientCredits, balance, chargeFromHold, placeHold, settleHold } from "./credits.ts";
import { emailFrom, personFrom, pickList, verifyStatusFrom } from "./normalize.ts";
import { logActivity, upsertBusiness, websiteDomain } from "./crm.ts";

// Credits for finding businesses to buy. A Maps search costs us $0.00015 for up to 20 listings.
export const FINDER_PRICES = {
  businessSaved: 1, // each new business added to your list
  ownerFound: 1, // a named owner or senior decision maker found
  verifiedEmail: 4,
  unconfirmedEmail: 2,
} as const;
export const MAX_ENRICH_CREDITS = FINDER_PRICES.ownerFound + FINDER_PRICES.verifiedEmail;

type FetchLike = typeof fetch;

export interface MapsRow {
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
  category: string | null;
  placeId: string;
  url: string | null;
}

/** Pull "City, ST 12345" out of a US Google Maps address. */
export function parseUsAddress(address: string) {
  const m = address.match(/,\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?\s*(?:,\s*(?:USA|United States))?\s*$/);
  return m ? { city: m[1].trim(), state: m[2], zip: m[3], street: address.slice(0, address.indexOf(`, ${m[1]}`)).trim() } : null;
}

/** Same-name companies elsewhere are common, so a listing only counts if it's in the state that was searched. */
export function inArea(row: MapsRow, location: string) {
  const want = location.match(/\b([A-Z]{2})\b\s*$/)?.[1];
  const got = parseUsAddress(row.address);
  return !want || (got !== null && got.state === want);
}

export async function searchBusinesses(
  db: DB, userId: number, opts: { query: string; location: string; limit?: number }, fetchImpl?: FetchLike,
) {
  const query = opts.query.trim().slice(0, 120);
  const location = opts.location.trim().slice(0, 120);
  if (!query || !location) throw new Error("Enter what kind of business and where");
  const limit = Math.min(Math.max(1, Math.floor(opts.limit ?? 20)), 20);
  const res = await tregCall(db, "crawl4ai.google.serp.maps", {
    body: { query, location, limit },
    userId,
    idempotencyKey: `maps:${userId}:${query}:${location}:${limit}:${new Date().toISOString().slice(0, 10)}`,
    maxCostUsd: 0.01,
  }, fetchImpl);
  if (!res.ok) throw new Error(`Search failed: ${res.error}`);
  const rows = pickList(res.data)
    .map((r): MapsRow | null => {
      if (!r.name || !r.address) return null;
      return {
        name: String(r.name), address: String(r.address), phone: r.phone ?? null, website: r.website ?? null,
        rating: typeof r.rating === "number" ? r.rating : null, reviews: typeof r.review_count === "number" ? r.review_count : null,
        category: r.category ?? null, placeId: String(r.place_id ?? r.cid ?? `${r.name}|${r.address}`), url: r.url ?? null,
      };
    })
    .filter((r): r is MapsRow => r !== null && inArea(r, location));
  const already = new Set(
    (db.prepare("SELECT external_id FROM businesses_crm WHERE user_id = ? AND source = 'maps'").all(userId) as { external_id: string }[]).map((r) => r.external_id),
  );
  return { rows: rows.map((r) => ({ ...r, saved: already.has(r.placeId) })), costMicro: res.costMicro };
}

/** Save chosen listings to the CRM, charging per new business. Re-saving an existing one is free. */
export function saveListings(db: DB, userId: number, rows: MapsRow[], query: string) {
  const fresh = rows.filter((r) => !db.prepare("SELECT 1 FROM businesses_crm WHERE user_id = ? AND source = 'maps' AND external_id = ?").get(userId, r.placeId));
  const cost = fresh.length * FINDER_PRICES.businessSaved;
  return db.transaction(() => {
    if (cost > 0) {
      const hold = placeHold(db, userId, cost, null, `Saved ${fresh.length} business${fresh.length === 1 ? "" : "es"} from search`);
      chargeFromHold(db, hold, cost);
      settleHold(db, hold);
    }
    const ids: number[] = [];
    for (const r of rows) {
      const where = parseUsAddress(r.address);
      const { id, created } = upsertBusiness(db, userId, {
        source: "maps", externalId: r.placeId, name: r.name, industry: r.category ?? query, address: where?.street ?? r.address,
        city: where?.city ?? null, state: where?.state ?? null, zip: where?.zip ?? null, website: r.website, phone: r.phone,
        rating: r.rating, reviews: r.reviews, mapsUrl: r.url, raw: r,
      });
      if (created) logActivity(db, id, userId, "import", `Found on Google Maps searching "${query}"`);
      ids.push(id);
    }
    return { saved: ids.length, charged: cost, ids };
  })();
}

const OWNER_TITLES = ["Owner", "Founder", "President", "CEO", "Managing Director", "Principal", "General Manager"];

/**
 * Find the owner (if not already known) and their work email for one business.
 * Holds the most it could cost, charges per result, refunds the rest.
 */
export async function enrichBusiness(db: DB, userId: number, businessId: number, fetchImpl?: FetchLike) {
  const b = db.prepare("SELECT * FROM businesses_crm WHERE id = ? AND user_id = ?").get(businessId, userId) as Record<string, any> | undefined;
  if (!b) throw new Error("Business not found");
  const domain = websiteDomain(b.website);
  if (!domain) throw new Error("This business has no website, so there's no email domain to search");
  const hold = placeHold(db, userId, MAX_ENRICH_CREDITS, null, `Owner and email lookup: ${b.name}`);
  const call = (endpoint: string, opts: Parameters<typeof tregCall>[2]) => tregCall(db, endpoint, { userId, ...opts }, fetchImpl);
  const result: { owner: string | null; email: string | null; status: string | null; charged: number } = { owner: b.owner_name, email: null, status: null, charged: 0 };
  try {
    let owner = b.owner_name as string | null;
    let linkedin: string | null = null;
    if (!owner) {
      const res = await call("treg.people.search", {
        body: { company_domain: domain, limit: 10 },
        idempotencyKey: `owner:${businessId}:${domain}`, maxCostUsd: 0.02,
      });
      const people = res.ok ? pickList(res.data).map(personFrom).filter((p) => p !== null) : [];
      const rank = (t: string | null) => { const i = OWNER_TITLES.findIndex((x) => (t ?? "").toLowerCase().includes(x.toLowerCase())); return i < 0 ? 99 : i; };
      const best = people.sort((x, y) => rank(x!.title) - rank(y!.title))[0];
      if (best && rank(best.title) < 99) {
        owner = best.fullName;
        linkedin = best.linkedinUrl;
        db.prepare("UPDATE businesses_crm SET owner_name = ?, owner_title = ? WHERE id = ?").run(best.fullName, best.title, businessId);
        if (chargeFromHold(db, hold, FINDER_PRICES.ownerFound)) result.charged += FINDER_PRICES.ownerFound;
        logActivity(db, businessId, userId, "enrich", `Owner found: ${best.fullName}${best.title ? `, ${best.title}` : ""}`);
      } else {
        logActivity(db, businessId, userId, "enrich", "No owner found in company databases");
      }
    }
    result.owner = owner;
    if (owner) {
      const parts = owner.replace(/[.,]/g, " ").split(/\s+/).filter((w) => !/^(sr|jr|ii|iii|iv)$/i.test(w));
      const body: Record<string, string> = { full_name: parts.join(" "), domain };
      if (parts.length >= 2) { body.first_name = parts[0]; body.last_name = parts[parts.length - 1]; }
      if (linkedin) body.linkedin_url = linkedin;
      const found = await call("treg.people.email.find", { body, idempotencyKey: `owner-email:${businessId}:${domain}:${body.full_name}`, maxCostUsd: 0.05 });
      const email = found.ok ? emailFrom(found.data) : null;
      if (email) {
        const v = await call("treg.people.email.verify", { body: { email }, idempotencyKey: `owner-verify:${email}` });
        const status = v.ok ? verifyStatusFrom(v.data) : "risky";
        const price = status === "verified" ? FINDER_PRICES.verifiedEmail : status === "invalid" ? 0 : FINDER_PRICES.unconfirmedEmail;
        db.prepare("UPDATE businesses_crm SET owner_email = ?, email_status = ?, email_provider = ? WHERE id = ?").run(
          status === "invalid" ? null : email, status, found.servedBy, businessId,
        );
        if (price && chargeFromHold(db, hold, price)) result.charged += price;
        result.email = status === "invalid" ? null : email;
        result.status = status;
        logActivity(db, businessId, userId, "enrich", status === "invalid" ? "Email found but invalid; not saved" : `Owner email found (${status.replace("_", "-")})`);
      } else {
        db.prepare("UPDATE businesses_crm SET email_status = 'not_found' WHERE id = ?").run(businessId);
        result.status = "not_found";
        logActivity(db, businessId, userId, "enrich", "No email found for the owner");
      }
    }
  } finally {
    settleHold(db, hold);
  }
  return result;
}

// ---------- Enriching a shortlisted directory business ----------

export const LISTING_CREDITS = 1; // website + phone found on Google Maps
export const MAX_SHORTLIST_ENRICH_CREDITS = LISTING_CREDITS + MAX_ENRICH_CREDITS;

const STOP = new Set(["INC", "LLC", "CO", "COMPANY", "THE", "AND", "OF", "LTD", "CORP", "SERVICE", "SERVICES", "&"]);
const words = (s: string) => new Set((s.toUpperCase().match(/[A-Z0-9]+/g) ?? []).filter((w) => !STOP.has(w)));
export function nameOverlap(a: string, b: string) {
  const x = words(a), y = words(b);
  let n = 0;
  for (const w of x) if (y.has(w)) n++;
  return n / Math.max(1, Math.min(x.size, y.size));
}

/** A Maps listing counts only if its address has the business's ZIP, or its street number and city. */
export function samePlace(listingAddress: string, b: { zip?: string | null; address?: string | null; city?: string | null }) {
  const addr = listingAddress.toUpperCase();
  if (b.zip && addr.includes(b.zip)) return true;
  const num = b.address?.match(/^\s*(\d+)/)?.[1];
  return Boolean(num && addr.includes(num) && b.city && addr.includes(b.city.toUpperCase()));
}

/**
 * Website and phone for a business that has none, from Google Maps, checked against its address.
 * Same-name companies elsewhere are common, so an unmatched listing is never used.
 */
export async function findListing(db: DB, userId: number, businessId: number, fetchImpl?: FetchLike) {
  const b = db.prepare("SELECT * FROM businesses_crm WHERE id = ? AND user_id = ?").get(businessId, userId) as Record<string, any> | undefined;
  if (!b) throw new Error("Business not found");
  if (b.website) return { found: true, charged: 0 };
  const res = await tregCall(db, "crawl4ai.google.serp.maps", {
    body: { query: b.name, location: [b.city, b.state].filter(Boolean).join(", "), limit: 5 },
    userId, idempotencyKey: `listing:${businessId}`, maxCostUsd: 0.01,
  }, fetchImpl);
  const rows = res.ok ? pickList(res.data) : [];
  const best = rows
    .filter((r) => r.name && r.address && samePlace(String(r.address), b))
    .map((r) => ({ r, score: nameOverlap(String(r.name), b.name) }))
    .sort((x, y) => y.score - x.score)[0]?.r;
  if (!best) {
    logActivity(db, businessId, userId, "enrich", "No matching Google listing found at this address");
    return { found: false, charged: 0 };
  }
  return db.transaction(() => {
    db.prepare("UPDATE businesses_crm SET website = ?, phone = COALESCE(phone, ?), rating = ?, reviews = ?, maps_url = ? WHERE id = ?").run(
      best.website ?? null, best.phone ?? null, typeof best.rating === "number" ? best.rating : null,
      typeof best.review_count === "number" ? best.review_count : null, best.url ?? null, businessId,
    );
    let charged = 0;
    if (best.website || best.phone) {
      const hold = placeHold(db, userId, LISTING_CREDITS, null, `Website and phone: ${b.name}`);
      if (chargeFromHold(db, hold, LISTING_CREDITS)) charged = LISTING_CREDITS;
      settleHold(db, hold);
    }
    logActivity(db, businessId, userId, "enrich", `Google listing matched: ${best.name}${best.website ? "" : " (no website listed)"}`);
    return { found: Boolean(best.website), charged };
  })();
}

/** Shortlist → enrich: listing, then owner email; the business then moves into the pipeline. */
export async function enrichShortlisted(db: DB, userId: number, businessId: number, fetchImpl?: FetchLike) {
  const have = balance(db, userId);
  if (have < MAX_SHORTLIST_ENRICH_CREDITS) throw new InsufficientCredits(MAX_SHORTLIST_ENRICH_CREDITS, have);
  const listing = await findListing(db, userId, businessId, fetchImpl);
  let contact = { owner: null as string | null, email: null as string | null, status: null as string | null, charged: 0 };
  const b = db.prepare("SELECT website, owner_email FROM businesses_crm WHERE id = ?").get(businessId) as { website: string | null; owner_email: string | null };
  if (b.website && !b.owner_email) contact = await enrichBusiness(db, userId, businessId, fetchImpl);
  const stage = (db.prepare("SELECT stage FROM deals WHERE business_id = ?").get(businessId) as { stage: string }).stage;
  if (stage === "shortlist") {
    db.prepare("UPDATE deals SET stage = 'identified', updated_at = datetime('now') WHERE business_id = ?").run(businessId);
    logActivity(db, businessId, userId, "stage", "Enriched and moved from Shortlist to Identified");
  }
  return { listing: listing.found, ...contact, charged: listing.charged + contact.charged };
}
