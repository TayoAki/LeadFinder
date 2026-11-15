// Forgiving product search: filler words ignored, plurals and synonyms folded, one-letter typos
// tolerated on longer words. Used by the Search tab; zero-result queries are tracked.
import { Product, shops } from './data';

const STOP = new Set(['a', 'an', 'the', 'for', 'my', 'to', 'of', 'and', 'with', 'in', 'on', 'gift', 'gifts', 'present', 'ideas', 'idea', 'something', 'some', 'under', 'over', 'dad', 'mum', 'mom', 'him', 'her', 'cheap', 'best', 'new']);
const SYNONYMS: Record<string, string> = {
  sneakers: 'shoes', trainers: 'shoes', sneaker: 'shoes', boots: 'shoes', heels: 'shoes', sandals: 'shoes',
  tee: 'shirt', tshirt: 'shirt', top: 'shirt', blouse: 'shirt', purse: 'bag', handbag: 'bag', tote: 'bag', backpack: 'bag',
  sunglasses: 'glasses', shades: 'glasses', earrings: 'earring', necklace: 'jewelry', ring: 'jewelry',
  moisturizer: 'cream', moisturiser: 'cream', lotion: 'cream', makeup: 'beauty', lipstick: 'lip', perfume: 'fragrance',
  vitamins: 'supplement', vitamin: 'supplement', mug: 'cup', couch: 'sofa', lamp: 'light', pan: 'pot',
};
const norm = (w: string) => { const s = SYNONYMS[w] ?? w; return s.length > 3 && s.endsWith('s') && !s.endsWith('ss') ? s.slice(0, -1) : s; };

function within1(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export const queryWords = (q: string) => q.toLowerCase().replace(/[^\w\s$-]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w) && !/^\$?\d+$/.test(w)).map(norm);

const tokensCache = new Map<string, string[]>();
function tokens(p: Product) {
  let t = tokensCache.get(p.id);
  if (!t) { t = `${p.title} ${p.category} ${p.description} ${shops.find(s => s.id === p.shopId)?.name ?? ''}`.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean).map(norm); tokensCache.set(p.id, t); }
  return t;
}

export function matches(p: Product, words: string[]) {
  if (!words.length) return true;
  const t = tokens(p); const text = t.join(' ');
  return words.every(w => text.includes(w) || (w.length >= 4 && t.some(x => x.length >= 4 && within1(w, x))));
}
