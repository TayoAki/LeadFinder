// Ready-made catalogue for the app's first open (conversion plan R1).
// Without it, every new phone pages through Mercur itself: regions, payment providers, sellers,
// products and offers, 6+ requests. Here the Shelby server does that once, keeps only the
// fields the app reads, gzips it and serves the cached copy to everyone. It is refreshed in the
// background every minute (stale-while-revalidate); stock is re-checked by Mercur at add to cart
// and at checkout anyway, so a minute-old count can't oversell.
import { gzipSync } from 'node:zlib';

const TTL = 60_000;
export const supplierFilter = () => {
  const list = (process.env.STORE_SUPPLIERS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  return list.length ? list : null;
};
let cache = null; // { at, gz, etag }
let inflight = null;

// Demo seed data carries invented popularity numbers; never let them reach a shopper.
const SEEDED = ['sold', 'rating', 'reviews', 'followers'];
const stripSeeded = m => (m ? Object.fromEntries(Object.entries(m).filter(([k]) => !SEEDED.includes(k))) : m);
const pick = (o, keys) => Object.fromEntries(keys.filter(k => o?.[k] !== undefined).map(k => [k, o[k]]));

async function fetchAll(url, key, pk, path) {
  const out = [];
  for (let offset = 0; ; offset += 100) {
    const r = await fetch(`${url}${path}${path.includes('?') ? '&' : '?'}limit=100&offset=${offset}`, { headers: { 'x-publishable-api-key': pk } });
    if (!r.ok) throw new Error(`${path} ${r.status}`);
    const j = await r.json();
    out.push(...j[key]);
    if (out.length >= j.count || !j[key].length) return out;
  }
}

async function build(url, pk, stats) {
  const get = async p => { const r = await fetch(url + p, { headers: { 'x-publishable-api-key': pk } }); if (!r.ok) throw new Error(`${p} ${r.status}`); return r.json(); };
  const { regions } = await get('/store/regions');
  const region = regions.find(r => r.currency_code === 'usd') ?? regions[0];
  const { payment_providers } = await get(`/store/payment-providers?region_id=${region.id}`);
  const [sellers, products, offers] = await Promise.all([
    fetchAll(url, 'sellers', pk, '/store/sellers'),
    fetchAll(url, 'products', pk, `/store/products?region_id=${region.id}&fields=id,title,description,thumbnail,metadata,*images,*categories,*variants`),
    fetchAll(url, 'offers', pk, `/store/offers?region_id=${region.id}`),
  ]);
  // STORE_SUPPLIERS (e.g. "printify") limits the store to products from those suppliers
  // (product.metadata.supplier). Everything else stays in Mercur, just hidden; unset shows all.
  const allow = supplierFilter();
  if (allow) {
    const keep = new Set(products.filter(p => allow.includes(String(p.metadata?.supplier || '').toLowerCase())).map(p => p.id));
    products.splice(0, products.length, ...products.filter(p => keep.has(p.id)));
    offers.splice(0, offers.length, ...offers.filter(o => keep.has(o.product_id)));
    const sellerIds = new Set(offers.map(o => o.seller_id));
    sellers.splice(0, sellers.length, ...sellers.filter(s => sellerIds.has(s.id)));
  }
  // Same shapes the app's mapper reads (src/lib/commerce.ts), minus everything it ignores.
  const real = stats ? stats() : {};
  const body = {
    at: Date.now(),
    region: { id: region.id, currency_code: region.currency_code },
    payment_providers: payment_providers.map(p => ({ id: p.id })),
    sellers: sellers.map(s => ({ ...pick(s, ['id', 'name', 'description', 'logo', 'banner']), metadata: stripSeeded(s.metadata) })),
    // Seeded sold/rating/reviews numbers are dropped; only Shelby's real counts go out (as `real`).
    products: products.map(p => ({ ...pick(p, ['id', 'title', 'description', 'thumbnail']), metadata: stripSeeded(p.metadata), real: real[p.id] ?? {}, images: (p.images ?? []).map(i => ({ url: i.url })), categories: (p.categories ?? []).slice(0, 1).map(c => ({ name: c.name })) })),
    offers: offers.map(o => ({
      id: o.id, product_id: o.product_id, seller_id: o.seller_id,
      product_variant: { title: o.product_variant?.title },
      calculated_price: { calculated_amount: o.calculated_price?.calculated_amount },
      inventory_item_link: (o.inventory_item_link ?? []).map(l => ({ inventory_item: { location_levels: (l.inventory_item?.location_levels ?? []).map(lv => ({ stocked_quantity: lv.stocked_quantity, reserved_quantity: lv.reserved_quantity })) } })),
    })),
  };
  const gz = gzipSync(JSON.stringify(body));
  return { at: body.at, gz, etag: `"${body.at.toString(36)}"` };
}

function refresh(url, pk, stats) {
  inflight ??= build(url, pk, stats).then(c => (cache = c)).finally(() => { inflight = null; });
  return inflight;
}

// Returns the gzipped catalogue, building it on the very first request only.
export async function catalogSnapshot(url, pk, stats) {
  if (!cache) return refresh(url, pk, stats);
  if (Date.now() - cache.at > TTL) refresh(url, pk, stats).catch(() => {}); // serve stale, refresh behind
  return cache;
}
export const warmCatalog = (url, pk, stats) => refresh(url, pk, stats).catch(e => console.warn('[catalog] warm-up failed:', e.message));
