import { logRun, now, type DB } from "./db.ts";
import { runActor, type Fetch } from "./apify.ts";

export const FB_ACTOR = "apify/facebook-marketplace-scraper";

export interface Car {
  id: string; source: string; url: string; title: string;
  year: number | null; make: string | null; model: string | null; trim: string | null;
  price: number; miles: number | null; city: string | null; lat: number | null; lng: number | null;
  description: string; photos: string[]; dealer_score: number; posted_at: string | null;
  captured_at?: string | null; source_actor?: string | null; seller_type?: string;
}

export interface FindOptions {
  city?: string;          // Facebook Marketplace city slug, e.g. "atlanta"
  radiusMiles?: number;
  target?: number;        // private-seller cars to keep
  minPrice?: number;
  maxPrice?: number;
  query?: string;         // optional, e.g. "honda"
  sortBy?: "creation_time_descend" | "best_match" | "price_ascend" | "distance_ascend";
}

const MAKES = ["acura","alfa romeo","audi","bmw","buick","cadillac","chevrolet","chevy","chrysler","dodge","fiat","ford","genesis","gmc",
  "honda","hyundai","infiniti","jaguar","jeep","kia","land rover","lexus","lincoln","mazda","mercedes-benz","mercedes","mini","mitsubishi",
  "nissan","porsche","ram","scion","subaru","tesla","toyota","volkswagen","vw","volvo","pontiac","saturn","mercury"];
const ALIAS: Record<string, string> = { chevy: "chevrolet", vw: "volkswagen", mercedes: "mercedes-benz" };
const TWO_WORD_MODELS = new Set(["grand cherokee", "grand caravan", "santa fe", "town &", "land cruiser", "range rover", "grand marquis",
  "model 3", "model y", "model s", "model x", "monte carlo", "crown victoria", "transit connect", "grand prix", "grand vitara", "pt cruiser"]);

// Listings that are probably dealers or not ordinary cars. Each hit adds to dealer_score.
const DEALER_SIGNS = [/\bdealer(ship)?\b/i, /\bfinanc(e|ing)\b/i, /buy here,? pay here/i, /\$\s?\d[\d,]*\s*down\b/i, /\bstock\s*#/i,
  /\bwe (finance|accept|offer)\b/i, /\bcredit (approval|check)\b/i, /\bbad credit\b/i, /\bapply (now|online)\b/i, /\bwarranty included\b/i,
  /\bmonthly payments?\b/i, /\bbi-?weekly\b/i, /\bour (inventory|lot)\b/i];
const NOT_A_CAR = /\b(atv|utv|foreman|rancher|side[- ]by[- ]side|golf cart|dirt bike|motorcycle|scooter|trailer|boat|jet ?ski|camper|rv|parts? only|part out)\b/i;
// Motorcycle models that share a make with cars (Honda, BMW, Suzuki, Kawasaki...).
const BIKE = /\b(cbr\d*\w*|cb\d+\w*|cl\d*|crf\d*|grom|rebel|shadow|gold ?wing|ninja|vulcan|harley|sportster|r1200\w*|gs\d{3,4}\w*|vespa)\b/i;
const MODEL_FIX: Record<string, string> = { f150: "F-150", f250: "F-250", f350: "F-350", landcruiser: "Land Cruiser", "4 runner": "4Runner", crv: "CR-V", hrv: "HR-V", rav: "RAV4" };

export function fbVehiclesUrl(o: FindOptions = {}): string {
  const km = Math.round((o.radiusMiles ?? 60) * 1.609);
  const p = new URLSearchParams({ radius: String(km), topLevelVehicleType: "car_truck", sortBy: o.sortBy ?? "creation_time_descend" });
  if (o.minPrice) p.set("minPrice", String(o.minPrice));
  if (o.maxPrice) p.set("maxPrice", String(o.maxPrice));
  const base = `https://www.facebook.com/marketplace/${o.city ?? "atlanta"}`;
  return o.query ? `${base}/search?${p}&query=${encodeURIComponent(o.query)}` : `${base}/vehicles?${p}`;
}

/** "2011 Toyota Camry · LE Sedan 4D" -> { year, make, model, trim } */
export function parseTitle(title: string) {
  const [head, tail] = title.split("·").map((s) => s.trim());
  const m = head.match(/\b(19[5-9]\d|20[0-3]\d)\b/);
  const year = m ? Number(m[1]) : null;
  const rest = (m ? head.replace(m[0], "") : head).replace(/\s+/g, " ").trim();
  const lower = rest.toLowerCase();
  const make = [...MAKES].sort((a, b) => b.length - a.length).find((k) => lower.startsWith(k) || lower.includes(` ${k} `)) ?? null;
  let model: string | null = null;
  if (make) {
    const after = rest.slice(lower.indexOf(make) + make.length).trim().split(" ").filter(Boolean);
    const two = after.slice(0, 2).join(" ").toLowerCase();
    const takeTwo = TWO_WORD_MODELS.has(two) || (after[0]?.length <= 2 && after[1] !== undefined) || /^\d{3,4}(hd)?$/i.test(after[1] ?? "");
    model = after.slice(0, takeTwo ? 2 : 1).join(" ") || null;
  }
  const known = Object.keys(MODEL_FIX).find((k) => new RegExp(`\\b${k}\\b`, "i").test(rest));
  if (known) model = MODEL_FIX[known];
  return { year, make: make ? (ALIAS[make] ?? make) : null, model, trim: tail || null };
}

export function parseMiles(text: string | undefined): number | null {
  const m = text?.match(/([\d.,]+)\s*(k)?\s*miles/i);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Math.round(m[2] ? n * 1000 : n);
}

export function dealerScore(title: string, description: string): number {
  return DEALER_SIGNS.filter((re) => re.test(`${title}\n${description}`)).length;
}

type FbItem = Record<string, any>;

export function normalizeFb(x: FbItem): Car | null {
  const title: string = x.listingTitle ?? x.customTitle ?? "";
  const price = Math.round(Number(x.listingPrice?.amount ?? NaN));
  if (!x.id || !title || !Number.isFinite(price)) return null;
  const description: string = x.description?.text ?? "";
  const t = parseTitle(title);
  const subtitles: string[] = (x.customSubTitlesWithRenderingFlags ?? []).map((s: FbItem) => s.subtitle ?? "");
  const photos: string[] = (x.listingPhotos ?? []).map((p: FbItem) => p.image?.uri).filter(Boolean);
  if (!photos.length && x.primaryListingPhoto?.photo_image_url) photos.push(x.primaryListingPhoto.photo_image_url);
  return {
    id: `fb:${x.id}`, source: "facebook", url: x.itemUrl ?? `https://www.facebook.com/marketplace/item/${x.id}/`, title,
    ...t, price, miles: parseMiles(subtitles.join(" ")) ?? parseMiles(description),
    city: x.locationText?.text ?? null, lat: x.location?.latitude ?? null, lng: x.location?.longitude ?? null,
    description, photos, dealer_score: dealerScore(title, description), posted_at: x.timestamp ?? null,
  };
}

/** A private-seller car worth valuing: a real car, a plausible price, no dealer signs. */
/**
 * Why a listing is out of scope, or null if it stays. Marketplace has no seller-type field, so "private"
 * is inferred from the absence of dealer signals and recorded as seller_type = private_inferred.
 */
export function exclusionReason(c: Car, thisYear = new Date().getFullYear()): string | null {
  if (c.dealer_score > 0) return "dealer signals in listing";
  if (c.year !== null && c.year >= thisYear - 1 && (c.miles ?? 0) < 5000) return "new-car listing (almost always a dealer)";
  if (NOT_A_CAR.test(`${c.title} ${c.description}`) || BIKE.test(c.title)) return "not a car (bike, ATV, trailer, parts...)";
  if (c.year === null || c.make === null) return "year or make not identifiable";
  if (c.price < 1000) return "price under $1,000 (usually a placeholder)";
  return null;
}

export const isCandidate = (c: Car, thisYear?: number) => exclusionReason(c, thisYear) === null;

export function saveCar(db: DB, c: Car) {
  db.prepare(`INSERT INTO cars (id,source,url,title,year,make,model,trim,price,miles,city,lat,lng,description,photos,dealer_score,posted_at,
      captured_at,source_actor,seller_type)
    VALUES (@id,@source,@url,@title,@year,@make,@model,@trim,@price,@miles,@city,@lat,@lng,@description,@photos,@dealer_score,@posted_at,
      @captured_at,@source_actor,@seller_type)
    ON CONFLICT(id) DO UPDATE SET price=excluded.price, description=excluded.description, photos=excluded.photos, captured_at=excluded.captured_at`)
    .run({ captured_at: null, source_actor: null, seller_type: "private_inferred", ...c, photos: JSON.stringify(c.photos) });
}

/** Re-check saved cars against the current filters and drop the ones that no longer qualify. */
export function prune(db: DB): string[] {
  const rows = db.prepare("SELECT * FROM cars").all() as Array<Car & { photos: string }>;
  const drop = rows.filter((r) => !isCandidate({ ...r, ...parseTitle(r.title), photos: [] }));
  db.transaction(() => drop.forEach((r) => db.prepare("DELETE FROM cars WHERE id = ?").run(r.id)))();
  // Re-parse titles so model fixes apply to cars already saved.
  for (const r of rows.filter((r) => !drop.includes(r))) {
    const t = parseTitle(r.title);
    db.prepare("UPDATE cars SET year = ?, make = ?, model = ?, trim = ? WHERE id = ?").run(t.year, t.make, t.model, t.trim, r.id);
  }
  return drop.map((r) => r.title);
}

/**
 * Step 1: scrape Marketplace and keep private-seller cars until `target` are saved.
 * Tops up: cars already saved count toward the target, and only the shortfall is scraped (with headroom for filtered listings).
 */
export async function findCars(db: DB, o: FindOptions = {}, deps: { fetchImpl?: Fetch; token?: string } = {}) {
  const target = o.target ?? 40;
  const startedAt = now();
  const removed = prune(db);
  const have = (db.prepare("SELECT COUNT(*) n FROM cars").get() as { n: number }).n;
  const need = target - have;
  if (need <= 0) return { scraped: 0, excluded: [], dealersOrOther: 0, removed, saved: 0, total: have, cars: [] as Car[],
    limit: `Already have ${have} of ${target} cars; nothing scraped.` };
  const items = await runActor<FbItem>(FB_ACTOR, {
    startUrls: [{ url: fbVehiclesUrl(o) }],
    resultsLimit: Math.ceil(need * (have ? 2.5 : 1.8)), // top-ups see more duplicates; use a different sortBy to reach new listings
    includeListingDetails: true,
  }, deps);
  const capturedAt = now();
  const all = items.map(normalizeFb).filter((c): c is Car => c !== null)
    .map((c) => ({ ...c, captured_at: capturedAt, source_actor: FB_ACTOR, seller_type: "private_inferred" }));
  const known = new Set((db.prepare("SELECT id FROM cars").all() as Array<{ id: string }>).map((r) => r.id));
  const excluded = all.map((c) => ({ id: c.id, title: c.title, reason: exclusionReason(c) })).filter((x) => x.reason);
  const fresh = all.filter((c) => isCandidate(c) && !known.has(c.id)).slice(0, need);
  db.transaction(() => fresh.forEach((c) => saveCar(db, c)))();
  const resultsLimit = Math.ceil(need * (have ? 2.5 : 1.8));
  const coverage = {
    searchUrl: fbVehiclesUrl(o), capturedAt, scraped: items.length, unparseable: items.length - all.length,
    excluded, duplicates: all.filter((c) => known.has(c.id)).length, saved: fresh.length, total: have + fresh.length,
    limit: `Collection stopped at the ${resultsLimit}-result cap, so coverage of the area is partial, not exhaustive.`,
    sellerType: "Marketplace doesn't label sellers; private status is inferred from the absence of dealer signals.",
  };
  logRun(db, "find", startedAt, { source: FB_ACTOR, params: o, report: coverage });
  return { ...coverage, dealersOrOther: excluded.length, removed, cars: fresh };
}
