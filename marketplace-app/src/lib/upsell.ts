// Order value (conversion plan §4 Phase 2): bundles that make sense for the niche, and
// "unlock free shipping" suggestions in the cart. In-stock items only; prices are real.
import { getShop, Product, products } from './data';
import { nicheOf } from './niches';

const LABEL = { fashion: 'Complete the look', beauty: 'Build the routine', supplements: 'Pairs well with', home: 'Goes well with', outdoors: 'Pack it with' } as const;

// One anchor + two companions: same niche, different category where possible, sensible price band.
export function bundleFor(p: Product): { title: string; items: Product[] } | null {
  const niche = nicheOf(p);
  const pool = products.filter(x => x.id !== p.id && x.stock > 0 && !x.sizes.length && nicheOf(x) === niche && x.price <= p.price * 1.5 + 20);
  const otherCat = pool.filter(x => x.category !== p.category).sort((a, b) => b.sold - a.sold);
  const sameCat = pool.filter(x => x.category === p.category).sort((a, b) => b.sold - a.sold);
  const items = [...otherCat, ...sameCat].reduce<Product[]>((acc, x) => (acc.length < 2 && !acc.some(a => a.category === x.category && otherCat.length > 1) ? [...acc, x] : acc), []);
  return items.length ? { title: LABEL[niche], items } : null;
}

// Items from this shop that would carry the cart over its free-shipping line.
export function unlockShipping(shopId: string, remaining: number, exclude: string[]): Product[] {
  if (remaining <= 0) return [];
  return products.filter(x => x.shopId === shopId && x.stock > 0 && !x.sizes.length && !exclude.includes(x.id) && x.price >= remaining && x.price <= remaining + 25)
    .sort((a, b) => a.price - b.price).slice(0, 3);
}
export const shopFreeOver = (shopId: string) => getShop(shopId)?.freeOver ?? 0;
