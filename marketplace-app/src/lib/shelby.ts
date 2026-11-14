import { products, Product } from './data';

// Shelby's picks for the prototype: a transparent rule-based matcher over the live catalogue.
// The real assistant would call an LLM with the same inputs and must return the same "based on"
// reasons, so users can see (and change) why an item was suggested.
export type Goal = 'gift' | 'treat' | 'find' | 'browse';
export type Ask = { categories: string[]; maxPrice?: number; goal?: Goal; words?: string[] };

const KEYWORDS: [RegExp, string][] = [
  [/hik|camp|outdoor|sport|ball|game|fitness|gym/i, 'Outdoors'],
  [/kitchen|cook|mug|cup|coffee|tea|bak|chef/i, 'Home'],
  [/home|decor|lamp|plant|frame|furniture|cozy/i, 'Home'],
  [/makeup|beauty|skin|lipstick|nail|self.?care|pamper/i, 'Beauty'],
  [/dress|top|skirt|women|her\b|sister|mom|wife|girlfriend/i, 'Women'],
  [/shirt|men\b|dad|brother|husband|boyfriend|him\b/i, 'Men'],
  [/shoe|sneaker|heel|slipper/i, 'Shoes'],
  [/bag|purse|backpack|tote/i, 'Bags'],
  [/jewel|earring|necklace|ring|bracelet/i, 'Jewelry'],
  [/sunglass|glasses|watch|accessor/i, 'Accessories'],
];

export function parse(text: string): Ask {
  const categories = [...new Set(KEYWORDS.filter(([re]) => re.test(text)).map(([, c]) => c))];
  const m = text.match(/(?:under|below|less than|max|up to)\s*\$?\s*(\d+)/i) ?? text.match(/\$(\d+)/);
  const goal: Goal | undefined = /gift|present|birthday|for my|for her|for him|anniversary/i.test(text) ? 'gift' : /me\b|myself|treat/i.test(text) ? 'treat' : undefined;
  return { categories, maxPrice: m ? Number(m[1]) : undefined, goal };
}

export function pick(a: Ask, n = 6): Product[] {
  let pool = products.filter(p => (!a.categories.length || a.categories.includes(p.category)) && (!a.maxPrice || p.price <= a.maxPrice));
  if (!pool.length) pool = products.filter(p => !a.maxPrice || p.price <= a.maxPrice);
  // Gifts favour well-reviewed items; treats favour what's selling now.
  const score = (p: Product) => (a.goal === 'gift' ? p.rating * 100 + Math.min(p.reviews, 300) : p.sold) + (p.compareAt ? 40 : 0);
  // Best first, but spread across shops and asked-for categories: no single shop fills the list.
  const ranked = [...pool].sort((x, y) => score(y) - score(x));
  const out: Product[] = []; const perShop: Record<string, number> = {}; const perCat: Record<string, number> = {};
  for (let cap = 1; out.length < n && cap <= n; cap++) {
    for (const p of ranked) {
      if (out.length >= n) break;
      if (out.includes(p) || (perShop[p.shopId] ?? 0) >= cap || (a.categories.length > 1 && (perCat[p.category] ?? 0) >= Math.ceil(n / a.categories.length) + cap - 1)) continue;
      out.push(p); perShop[p.shopId] = (perShop[p.shopId] ?? 0) + 1; perCat[p.category] = (perCat[p.category] ?? 0) + 1;
    }
  }
  return out;
}

export function reasons(a: Ask): string[] {
  const r: string[] = [];
  if (a.goal === 'gift') r.push('A gift');
  if (a.goal === 'treat') r.push('For you');
  a.categories.forEach(c => r.push(c));
  if (a.maxPrice) r.push(`Under $${a.maxPrice}`);
  if (!r.length) r.push('Popular this week');
  return r;
}
