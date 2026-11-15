import catalog from '@/data/catalog.json';

export type Shop = {
  id: string; name: string; tagline: string; category: string; followers: number; rating: number;
  logo: string; banner: string; shipsIn: string; freeOver: number; shipping: number;
};
export type Product = {
  id: string; title: string; price: number; compareAt: number | null; category: string; shopId: string;
  image: string; images: string[]; rating: number; reviews: number; stock: number; sold: number;
  sizes: string[]; description: string;
  details?: Record<string, string>; // seller-entered facts (fit, ingredients, shades…) from product metadata
  sizeStock?: Record<string, number>; // live stock per size
};

export const shops: Shop[] = (catalog.shops as Shop[]).map(s => (s.id === 's7' ? { ...s, rating: 0, followers: 212 } : s)); // s7 = a brand-new maker
export const shopSold = (id: string) => products.filter(p => p.shopId === id).reduce((n, p) => n + p.sold, 0);
export const isNewMaker = (s: Shop) => s.rating === 0;
export const products: Product[] = [...(catalog.products as Product[])];

// Swap the bundled sample for the live catalogue from the API (sellers' uploads included).
// Arrays are replaced in place so every screen that imported them sees the live data.
export function applyCatalog(remote: { shops: Shop[]; products: Product[] }, fix: (u: string) => string) {
  if (!remote?.shops?.length) return false;
  const firstImg = (id: string) => remote.products.find(p => p.shopId === id)?.image ?? '';
  shops.splice(0, shops.length, ...remote.shops.map(s => ({ ...s, logo: fix(s.logo || firstImg(s.id)), banner: fix(s.banner || s.logo || firstImg(s.id)) })));
  products.splice(0, products.length, ...remote.products.map(p => ({ ...p, image: fix(p.image), images: p.images.map(fix) })));
  for (let i = drops.length - 1; i >= 0; i--) if (!products.some(p => p.id === drops[i].productId)) drops.splice(i, 1);
  return true;
}
export const categories = ['All', 'Home', 'Beauty', 'Women', 'Men', 'Shoes', 'Bags', 'Jewelry', 'Accessories', 'Outdoors'];
export const categoryIcon: Record<string, string> = {
  All: 'apps', Home: 'home', Beauty: 'sparkles', Women: 'woman', Men: 'man', Shoes: 'footsteps',
  Bags: 'bag-handle', Jewelry: 'diamond', Accessories: 'glasses', Outdoors: 'trail-sign',
};

export const getProduct = (id: string) => products.find(p => p.id === id)!;
export const getShop = (id: string) => shops.find(s => s.id === id)!;
export const shopProducts = (id: string) => products.filter(p => p.shopId === id);
export const money = (n: number) => `$${n.toFixed(2)}`;
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);

// Drops: limited releases with a start time, the scarcity loop before live shopping exists.
const now = Date.now();
const byTitle = (t: string) => products.find(p => p.title === t) ?? products[0];
const drop = (id: string, title: string, edition: string, hours: number, qty: number) => {
  const p = byTitle(title);
  return { id, title: `${p.title}, ${edition}`, shopId: p.shopId, productId: p.id, at: now + hours * 3600 * 1000, qty };
};
export const drops = [
  drop('d1', 'Black Aluminium Cup', 'matte edition', 3.2, 40),
  drop('d2', 'Girl Summer Dress', 'linen run', 27, 120),
  drop('d3', 'White Faux Leather Backpack', 'batch 7', 52, 60),
];
