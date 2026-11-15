// Mercur (Medusa v2 marketplace) adapter. The app keeps its own Shop/Product shapes; this module
// fills them from Mercur's Store API and runs the multi-seller checkout (one cart -> one order
// group with one order per seller). Enabled when the Shelby server's /api/config returns a
// `commerce` block; otherwise the app falls back to the built-in backend.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product, Shop } from './data';
import { API_URL } from './api';

export type CommerceConfig = { url: string; publishableKey: string; sellerUrl?: string; stripePublishableKey?: string | null; suppliers?: string[] | null };
let cfg: CommerceConfig | null = null;
let regionId = '';
let paymentProvider = 'pp_system_default'; // the region's provider; Stripe when the server has it on
export const STRIPE_PROVIDER = 'pp_stripe-connector_stripe';
// Card payments need both: Stripe on the server (region provider) and a publishable key for the app.
export const stripeEnabled = () => paymentProvider === STRIPE_PROVIDER && !!cfg?.stripePublishableKey;
// productId -> size ('' for one-size) -> offer id; the offer decides the seller at checkout.
const offerFor = new Map<string, Map<string, string>>();

export const commerce = () => cfg;

// Snapshot of everything a relaunch needs, so the app can open from the device cache instantly
// and refresh in the background (stale-while-revalidate).
export type CatalogSnapshot = { at: number; shops: Shop[]; products: Product[]; regionId: string; paymentProvider: string; offers: [string, [string, string][]][] };
export function snapshot(c: { shops: Shop[]; products: Product[] }): CatalogSnapshot {
  return { at: Date.now(), ...c, regionId, paymentProvider, offers: [...offerFor].map(([k, m]) => [k, [...m]]) };
}
export function restore(c: CommerceConfig, snap: CatalogSnapshot) {
  cfg = c; regionId = snap.regionId; paymentProvider = snap.paymentProvider;
  offerFor.clear(); for (const [k, m] of snap.offers) offerFor.set(k, new Map(m));
  return { shops: snap.shops, products: snap.products };
}

async function store<T>(path: string, body?: unknown, timeoutMs = 15000, method?: 'DELETE'): Promise<T> {
  if (!cfg) throw new Error('Commerce is not configured');
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${cfg.url}${path}`, {
      method: method ?? (body ? 'POST' : 'GET'), signal: ctl.signal,
      headers: { 'x-publishable-api-key': cfg.publishableKey, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any).message || `Request failed (${res.status})`);
    return data as T;
  } finally { clearTimeout(t); }
}

// Page through a list endpoint (Medusa caps `limit`).
async function all<T>(path: string, key: string): Promise<T[]> {
  const out: T[] = [];
  for (let offset = 0; ; offset += 100) {
    const r = await store<any>(`${path}${path.includes('?') ? '&' : '?'}limit=100&offset=${offset}`);
    out.push(...r[key]);
    if (out.length >= r.count || !r[key].length) return out;
  }
}

// Sizes in shopping order (XS … 5XL, then shoe sizes by number); anything else keeps its place.
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL'];
const sizeRank = (s: string) => { const t = s.split(' / ').pop()!.toUpperCase(); const i = SIZE_ORDER.indexOf(t); return i >= 0 ? i : Number.isFinite(parseFloat(t)) ? 100 + parseFloat(t) : 1000; };
const bySize = (a: string, b: string) => sizeRank(a) - sizeRank(b) || a.localeCompare(b);
const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

type RawCatalog = { region: { id: string }; payment_providers: { id: string }[]; sellers: any[]; products: any[]; offers: any[] };

// Straight from Mercur: 6+ requests. Used when the Shelby server's ready-made copy is unavailable,
// and after a stock error, when only the live numbers will do.
async function rawFromMercur(): Promise<RawCatalog> {
  const { regions } = await store<{ regions: { id: string; currency_code: string }[] }>('/store/regions');
  const region = regions.find(r => r.currency_code === 'usd') ?? regions[0];
  const { payment_providers } = await store<{ payment_providers: { id: string }[] }>(`/store/payment-providers?region_id=${region.id}`);
  const [sellers, products, offers] = await Promise.all([
    all<any>('/store/sellers', 'sellers'),
    all<any>(`/store/products?region_id=${region.id}&fields=id,title,description,thumbnail,metadata,*images,*categories,*variants`, 'products'),
    all<any>(`/store/offers?region_id=${region.id}`, 'offers'),
  ]);
  return { region, payment_providers, sellers, products, offers };
}

// The Shelby server's cached, trimmed copy (server/catalog.mjs): one small gzipped request.
let early: Promise<RawCatalog> | null = null;
// Start the download before /api/config answers (first open: the two run side by side).
export const prefetchCatalog = () => { early ??= rawFromShelbyNow(); early.catch(() => {}); };
const rawFromShelby = () => { const p = early ?? rawFromShelbyNow(); early = null; return p; };
async function rawFromShelbyNow(): Promise<RawCatalog> {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000);
  try {
    const r = await fetch(`${API_URL}/api/commerce/catalog`, { signal: ctl.signal });
    if (!r.ok) throw new Error(`catalog ${r.status}`);
    return await r.json();
  } finally { clearTimeout(t); }
}

// Load the catalogue and map it to the app's shapes. `live` skips the server's copy.
export async function loadMercurCatalog(c: CommerceConfig, opts: { live?: boolean } = {}): Promise<{ shops: Shop[]; products: Product[] }> {
  cfg = c;
  const raw = opts.live ? await rawFromMercur() : await rawFromShelby().catch(() => rawFromMercur());
  const { payment_providers } = raw;
  // Same supplier filter as the server's copy (STORE_SUPPLIERS), for the direct-from-Mercur fallback.
  const allow = c.suppliers?.length ? c.suppliers : null;
  const products = allow ? raw.products.filter(p => allow.includes(String(p.metadata?.supplier ?? '').toLowerCase())) : raw.products;
  const keep = new Set(products.map((p: any) => p.id));
  const offers = allow ? raw.offers.filter(o => keep.has(o.product_id)) : raw.offers;
  const sellers = allow ? raw.sellers.filter(s => offers.some((o: any) => o.seller_id === s.id)) : raw.sellers;
  regionId = raw.region.id;
  paymentProvider = payment_providers.some(p => p.id === STRIPE_PROVIDER) ? STRIPE_PROVIDER : payment_providers[0]?.id ?? 'pp_system_default';

  const shops: Shop[] = sellers.map(s => ({
    id: s.id, name: s.name, tagline: s.metadata?.tagline ?? s.description ?? '', category: s.metadata?.category ?? 'Home',
    followers: 0, rating: 0, /* seeded numbers are never shown */ logo: s.logo ?? '', banner: s.banner ?? s.logo ?? '',
    shipsIn: s.metadata?.ships_in ?? '2–3 days', freeOver: num(s.metadata?.free_over, 50), shipping: num(s.metadata?.shipping, 5.95),
  }));

  offerFor.clear();
  const byProduct = new Map<string, any[]>();
  for (const o of offers) { if (!byProduct.has(o.product_id)) byProduct.set(o.product_id, []); byProduct.get(o.product_id)!.push(o); }
  const stockOf = (o: any) => (o.inventory_item_link ?? []).reduce((n: number, l: any) =>
    n + (l.inventory_item?.location_levels ?? []).reduce((m: number, lv: any) => m + num(lv.stocked_quantity) - num(lv.reserved_quantity), 0), 0);

  const out: Product[] = [];
  for (const p of products) {
    const offs = byProduct.get(p.id) ?? [];
    if (!offs.length) continue; // nothing to buy
    // Cheapest offer per size wins the buy box; Shelby shops list one offer each today.
    const sizes = new Map<string, any>();
    for (const o of offs) {
      const size = o.product_variant?.title === 'One size' ? '' : o.product_variant?.title ?? '';
      const cur = sizes.get(size);
      if (!cur || num(o.calculated_price?.calculated_amount, Infinity) < num(cur.calculated_price?.calculated_amount, Infinity)) sizes.set(size, o);
    }
    offerFor.set(p.id, new Map([...sizes].map(([s, o]) => [s, o.id])));
    const best = [...sizes.values()].sort((a, b) => num(a.calculated_price?.calculated_amount) - num(b.calculated_price?.calculated_amount))[0];
    const images = (p.images ?? []).map((i: any) => i.url).filter(Boolean);
    out.push({
      id: p.id, title: p.title, price: num(best.calculated_price?.calculated_amount),
      compareAt: typeof p.metadata?.compare_at === 'number' ? p.metadata.compare_at : null,
      category: p.categories?.[0]?.name ?? 'Home', shopId: best.seller_id,
      image: p.thumbnail ?? images[0] ?? '', images: images.length ? images : [p.thumbnail].filter(Boolean),
      // Real numbers only (from the Shelby server's events and reviews); 0 when unknown.
      rating: num(p.real?.rating), reviews: num(p.real?.reviews), sold: num(p.real?.sold30),
      stock: [...sizes.values()].reduce((n, o) => n + Math.max(0, stockOf(o)), 0),
      sizes: [...sizes.keys()].filter(Boolean).sort(bySize), description: p.description ?? '',
      sizeStock: Object.fromEntries([...sizes].filter(([s]) => s).map(([s, o]) => [s, Math.max(0, stockOf(o))])),
      details: p.metadata?.details && typeof p.metadata.details === 'object' ? Object.fromEntries(Object.entries(p.metadata.details).filter(([, v]) => typeof v === 'string' && v).map(([k, v]) => [k, String(v)])) : undefined,
    });
  }
  return { shops: shops.filter(s => out.some(p => p.shopId === s.id)), products: out };
}

export type CheckoutLine = { productId: string; size: string | null; qty: number };
export type CheckoutResult = { id: string; total: number; tax: number; shipping: number; sellers: number };
export type PreparedCheckout = { cartId: string; total: number; tax: number; shipping: number; clientSecret: string | null };

// ---------- live cart ----------
// The Mercur cart is kept in step with the app's cart in the background (optimistic UI: the app's
// cart updates instantly, the server catches up). Opening checkout attaches the address, each
// seller's shipping and the payment collection, so Pay is only: email, payment session, complete.
const CART_KEY = 'shelby_live_cart';
let liveCartId: string | null = null;
let queue: Promise<unknown> = Promise.resolve();
let lastSync = '';
const serial = <T,>(fn: () => Promise<T>) => { const run = queue.then(fn, fn); queue = run.catch(() => {}); return run; };

async function ensureCart(): Promise<string> {
  if (!liveCartId) liveCartId = await AsyncStorage.getItem(CART_KEY).catch(() => null);
  if (liveCartId) {
    const ok = await store<any>(`/store/carts/${liveCartId}?fields=id,completed_at,region_id`).then(r => !r.cart.completed_at && r.cart.region_id === regionId).catch(() => false);
    if (ok) return liveCartId;
  }
  const { cart } = await store<any>('/store/carts', { region_id: regionId });
  liveCartId = cart.id; AsyncStorage.setItem(CART_KEY, cart.id).catch(() => {}); lastSync = '';
  return cart.id;
}

async function reconcile(lines: CheckoutLine[]) {
  const key = JSON.stringify(lines);
  const id = await ensureCart();
  if (key === lastSync) return id;
  const want = new Map<string, number>();
  for (const l of lines) {
    const offer = offerFor.get(l.productId)?.get(l.size ?? '');
    if (!offer) throw new Error('One of your items is no longer available.');
    want.set(offer, (want.get(offer) ?? 0) + l.qty);
  }
  const { cart } = await store<any>(`/store/carts/${id}?fields=*items`);
  const have = new Map<string, any>((cart.items ?? []).map((i: any) => [i.metadata?.offer_id, i]));
  for (const [offer, qty] of want) {
    const it = have.get(offer);
    if (!it) await store(`/store/carts/${id}/line-items`, { offer_id: offer, quantity: qty });
    else if (it.quantity !== qty) await store(`/store/carts/${id}/line-items/${it.id}`, { quantity: qty });
  }
  for (const [offer, it] of have) if (!want.has(offer)) await store(`/store/carts/${id}/line-items/${it.id}`, undefined, 15000, 'DELETE');
  lastSync = key;
  return id;
}

export const isStockError = (e: unknown) => /sufficient stock|enough stock|out of stock|inventory/i.test(String((e as any)?.message ?? e));
// Called on every cart change (debounced by the store). A stock refusal is reported straight away
// (the shopper hears it at add time, not at Pay); other failures are retried at checkout.
export const syncCart = (lines: CheckoutLine[], onStockError?: () => void) =>
  serial(() => (lines.length || liveCartId ? reconcile(lines) : Promise.resolve(''))).catch(e => { lastSync = ''; if (isStockError(e)) onStockError?.(); });

type Prepared = { cartId: string; collectionId: string; clientSecret: string | null; total: number; tax: number; shipping: number };
let primed: { key: string; at: number; p: Promise<Prepared> } | null = null;

async function attachShippingAndPayment(id: string, address: Address): Promise<Prepared> {
  const [first, ...rest] = (address.name || 'Shelby Shopper').split(' ');
  await store(`/store/carts/${id}`, { shipping_address: { first_name: first, last_name: rest.join(' ') || '-', country_code: 'us', address_1: address.address_1, city: address.city, province: address.province, postal_code: address.postal_code } });
  const [{ shipping_options }, { cart }] = await Promise.all([
    store<{ shipping_options: Record<string, { id: string }[]> }>(`/store/shipping-options?cart_id=${id}`),
    store<any>(`/store/carts/${id}?fields=*shipping_methods`),
  ]);
  const chosen = new Set((cart.shipping_methods ?? []).map((m: any) => m.shipping_option_id));
  for (const options of Object.values(shipping_options)) if (options[0] && !options.some(o => chosen.has(o.id))) await store(`/store/carts/${id}/shipping-methods`, { option_id: options[0].id });
  const { payment_collection } = await store<any>('/store/payment-collections', { cart_id: id });
  // The payment session and the final totals, too, so Pay doesn't wait on them.
  const r = await store<any>(`/store/payment-collections/${payment_collection.id}/payment-sessions`, { provider_id: paymentProvider })
    .catch(() => { throw new Error("Payments are unavailable right now, so you haven't been charged. Please try again in a minute."); });
  const session = (r.payment_collection?.payment_sessions ?? []).find((x: any) => x.provider_id === paymentProvider);
  const clientSecret = paymentProvider === STRIPE_PROVIDER ? session?.data?.client_secret ?? null : null;
  const { cart: t } = await store<any>(`/store/carts/${id}?fields=total,tax_total,shipping_total`);
  return { cartId: id, collectionId: payment_collection.id, clientSecret, total: num(t.total), tax: num(t.tax_total), shipping: num(t.shipping_total) };
}
type Address = { name: string; address_1: string; city: string; province: string; postal_code: string };

// Cart or checkout opened: do the slow work now, while the shopper reads the summary.
export function primeCheckout(lines: CheckoutLine[], address: Address) {
  const key = JSON.stringify([lines, address]);
  if (primed && primed.key === key && Date.now() - primed.at < 10 * 60e3) return primed.p;
  const p = serial(async () => attachShippingAndPayment(await reconcile(lines), address));
  p.catch(() => { if (primed?.p === p) primed = null; });
  primed = { key, at: Date.now(), p };
  return p;
}

// Pay tapped: the cart is already prepared, so only the email is left to save.
export async function prepareCheckout(lines: CheckoutLine[], who: { email: string; name: string }, address: Address): Promise<PreparedCheckout> {
  const prep = await primeCheckout(lines, address);
  if (paymentProvider === STRIPE_PROVIDER && !prep.clientSecret) throw new Error('Card payments are unavailable right now. Please try again.');
  await store(`/store/carts/${prep.cartId}`, { email: who.email });
  return { cartId: prep.cartId, total: prep.total, tax: prep.tax, shipping: prep.shipping, clientSecret: prep.clientSecret };
}

// Step 2: complete. Mercur authorizes the payment and splits the cart into one order per seller.
export async function completeCheckout(p: PreparedCheckout): Promise<CheckoutResult> {
  const done = await store<any>(`/store/carts/${p.cartId}/complete`, {}, 30000);
  if (done.type !== 'order_group') throw new Error(done.error?.message ?? 'Your payment needs another try.');
  liveCartId = null; lastSync = ''; primed = null; AsyncStorage.removeItem(CART_KEY).catch(() => {});
  return { id: done.order_group.id, total: num(done.order_group.total, p.total), tax: p.tax, shipping: p.shipping, sellers: num(done.order_group.seller_count, 1) };
}
