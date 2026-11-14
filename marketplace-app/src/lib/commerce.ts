// Mercur (Medusa v2 marketplace) adapter. The app keeps its own Shop/Product shapes; this module
// fills them from Mercur's Store API and runs the multi-seller checkout (one cart -> one order
// group with one order per seller). Enabled when the Shelby server's /api/config returns a
// `commerce` block; otherwise the app falls back to the built-in backend.
import type { Product, Shop } from './data';

export type CommerceConfig = { url: string; publishableKey: string; sellerUrl?: string };
let cfg: CommerceConfig | null = null;
let regionId = '';
// productId -> size ('' for one-size) -> offer id; the offer decides the seller at checkout.
const offerFor = new Map<string, Map<string, string>>();

export const commerce = () => cfg;

async function store<T>(path: string, body?: unknown, timeoutMs = 15000): Promise<T> {
  if (!cfg) throw new Error('Commerce is not configured');
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${cfg.url}${path}`, {
      method: body ? 'POST' : 'GET', signal: ctl.signal,
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

const num = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

// Load Mercur's catalogue and map it to the app's shapes.
export async function loadMercurCatalog(c: CommerceConfig): Promise<{ shops: Shop[]; products: Product[] }> {
  cfg = c;
  const { regions } = await store<{ regions: { id: string; currency_code: string }[] }>('/store/regions');
  regionId = (regions.find(r => r.currency_code === 'usd') ?? regions[0]).id;
  const [sellers, products, offers] = await Promise.all([
    all<any>('/store/sellers', 'sellers'),
    all<any>(`/store/products?region_id=${regionId}&fields=id,title,description,thumbnail,metadata,*images,*categories,*variants`, 'products'),
    all<any>(`/store/offers?region_id=${regionId}`, 'offers'),
  ]);

  const shops: Shop[] = sellers.map(s => ({
    id: s.id, name: s.name, tagline: s.metadata?.tagline ?? s.description ?? '', category: s.metadata?.category ?? 'Home',
    followers: num(s.metadata?.followers), rating: num(s.metadata?.rating), logo: s.logo ?? '', banner: s.banner ?? s.logo ?? '',
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
      rating: num(p.metadata?.rating), reviews: num(p.metadata?.reviews), sold: num(p.metadata?.sold),
      stock: [...sizes.values()].reduce((n, o) => n + Math.max(0, stockOf(o)), 0),
      sizes: [...sizes.keys()].filter(Boolean), description: p.description ?? '',
    });
  }
  return { shops: shops.filter(s => out.some(p => p.shopId === s.id)), products: out };
}

export type CheckoutLine = { productId: string; size: string | null; qty: number };
export type CheckoutResult = { id: string; total: number; tax: number; shipping: number; sellers: number };

// One Mercur cart for every line, one shipping method per seller, then complete: Mercur splits it
// into one order per seller under an order group. Payment uses the system provider until Stripe
// Connect is configured.
export async function checkoutWithMercur(lines: CheckoutLine[], who: { email: string; name: string }, address: { address_1: string; city: string; province: string; postal_code: string }): Promise<CheckoutResult> {
  let { cart } = await store<any>('/store/carts', { region_id: regionId, email: who.email });
  for (const l of lines) {
    const offerId = offerFor.get(l.productId)?.get(l.size ?? '');
    if (!offerId) throw new Error('One of your items is no longer available.');
    await store(`/store/carts/${cart.id}/line-items`, { offer_id: offerId, quantity: l.qty });
  }
  const [first, ...rest] = (who.name || 'Shelby Shopper').split(' ');
  await store(`/store/carts/${cart.id}`, { shipping_address: { first_name: first, last_name: rest.join(' ') || '-', country_code: 'us', ...address } });
  const { shipping_options } = await store<{ shipping_options: Record<string, { id: string }[]> }>(`/store/shipping-options?cart_id=${cart.id}`);
  for (const options of Object.values(shipping_options)) if (options[0]) await store(`/store/carts/${cart.id}/shipping-methods`, { option_id: options[0].id });
  ({ cart } = await store<any>(`/store/carts/${cart.id}`));
  const { payment_collection } = await store<any>('/store/payment-collections', { cart_id: cart.id });
  await store(`/store/payment-collections/${payment_collection.id}/payment-sessions`, { provider_id: 'pp_system_default' });
  const done = await store<any>(`/store/carts/${cart.id}/complete`, {}, 30000);
  if (done.type !== 'order_group') throw new Error(done.error?.message ?? 'Payment needs another try.');
  return { id: done.order_group.id, total: num(done.order_group.total, cart.total), tax: num(cart.tax_total), shipping: num(cart.shipping_total), sellers: num(done.order_group.seller_count, 1) };
}
