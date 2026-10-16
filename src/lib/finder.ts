import type { DB } from "./db.ts";
import { tregCall } from "./treg.ts";
import { chargeFromHold, placeHold, settleHold } from "./credits.ts";
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
