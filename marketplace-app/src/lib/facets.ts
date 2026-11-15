// Niche filters (conversion plan R3): goal for supplements, skin type and concern for beauty.
// Read from each product's `details` (seller-entered in Mercur, comma-separated values). A filter
// row only appears when at least two products in the current results carry that tag, so
// untagged catalogues show nothing and tagging a product is all it takes to switch one on.
import type { Product } from './data';

export const FACETS = [
  { key: 'goal', label: 'Goal' },
  { key: 'skin_type', label: 'Skin type' },
  { key: 'concern', label: 'Concern' },
] as const;
export type FacetKey = (typeof FACETS)[number]['key'];
export type FacetState = Partial<Record<FacetKey, string>>;

const split = (v?: string) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : []);
export const tagsOf = (p: Product, key: FacetKey) => split(p.details?.[key]);

// Facets worth showing for these products, with values ordered by how many products carry them.
export function facetsFor(items: Product[]) {
  return FACETS.map(f => {
    const counts = new Map<string, number>();
    for (const p of items) for (const v of tagsOf(p, f.key)) counts.set(v, (counts.get(v) ?? 0) + 1);
    const tagged = items.filter(p => tagsOf(p, f.key).length).length;
    return { ...f, tagged, values: [...counts].sort((a, b) => b[1] - a[1]).map(([v]) => v) };
  }).filter(f => f.tagged >= 2 && f.values.length >= 2);
}

// "All skin types" matches any skin type.
export const passes = (p: Product, state: FacetState) =>
  (Object.entries(state) as [FacetKey, string | undefined][]).every(([k, v]) => !v || tagsOf(p, k).some(t => t === v || /^all\b/i.test(t)));
