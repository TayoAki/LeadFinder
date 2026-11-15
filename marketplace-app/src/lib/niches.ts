// Niches: one store, different reasons to hesitate. Each niche gets its own proof on the product
// page and its own promise next to the buy button (docs/conversion-plan.md §3).
// Product facts (fit, ingredients, shades, doses) come only from the product's own `details`
// (seller-entered metadata in Mercur); nothing here invents a claim about a product.
import type { Product } from './data';

export type Niche = 'fashion' | 'beauty' | 'supplements' | 'home' | 'outdoors';
const BY_CATEGORY: Record<string, Niche> = {
  Apparel: 'fashion', Women: 'fashion', Men: 'fashion', Shoes: 'fashion', Bags: 'fashion', Jewelry: 'fashion', Accessories: 'fashion',
  Beauty: 'beauty', Skincare: 'beauty', Supplements: 'supplements', Wellness: 'supplements', Home: 'home', Outdoors: 'outdoors',
};
export const nicheOf = (p: Product): Niche => BY_CATEGORY[p.category] ?? 'home';

export type NicheConfig = {
  label: string;
  hesitation: string; // the question this niche's page must answer first
  promise: { icon: string; text: string }; // shown at the buy button
  proofTitle: string;
  detailKeys: [string, string][]; // product.details keys to show, with labels
  disclaimer?: string;
  replenishDays?: number[]; // offer reorder reminders for things that run out
};

export const NICHES: Record<Niche, NicheConfig> = {
  fashion: {
    label: 'Fashion', hesitation: 'Will it fit?',
    promise: { icon: 'swap-horizontal', text: 'Free size exchanges within 30 days' },
    proofTitle: 'Fit and feel',
    detailKeys: [['fit', 'Fit'], ['model', 'Model wears'], ['fabric', 'Fabric'], ['care', 'Care']],
  },
  beauty: {
    label: 'Beauty', hesitation: 'Is it right for my skin?',
    promise: { icon: 'color-palette-outline', text: 'Wrong shade? Free exchange within 30 days' },
    proofTitle: 'Made for',
    detailKeys: [['skin_type', 'Skin type'], ['concern', 'Helps with'], ['shades', 'Shades'], ['key_ingredients', 'Key ingredients'], ['free_from', 'Free from'], ['how_to_use', 'How to use']],
    replenishDays: [30, 60, 90],
  },
  supplements: {
    label: 'Supplements', hesitation: 'Will it work, and is it safe?',
    promise: { icon: 'shield-checkmark-outline', text: '30-day money-back guarantee' },
    proofTitle: "What's inside",
    detailKeys: [['goal', 'Good for'], ['dose', 'Per serving'], ['servings', 'Servings'], ['ingredients', 'Ingredients'], ['tested', 'Testing'], ['not_for', 'Not suitable for']],
    disclaimer: 'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.',
    replenishDays: [30, 60, 90],
  },
  home: {
    label: 'Home', hesitation: 'Will it fit my space?',
    promise: { icon: 'refresh-outline', text: 'Free returns within 30 days' },
    proofTitle: 'Details',
    detailKeys: [['dimensions', 'Dimensions'], ['materials', 'Materials'], ['care', 'Care']],
  },
  outdoors: {
    label: 'Outdoors', hesitation: 'Will it hold up?',
    promise: { icon: 'refresh-outline', text: 'Free returns within 30 days' },
    proofTitle: 'Details',
    detailKeys: [['materials', 'Materials'], ['weight', 'Weight'], ['care', 'Care']],
  },
};

// Standard US size charts (generic reference, not a claim about a specific item's cut).
export const SIZE_GUIDES: Record<'clothing' | 'shoes', { head: string[]; rows: string[][] }> = {
  clothing: { head: ['Size', 'US', 'Chest (in)', 'Waist (in)'], rows: [['XS', '0–2', '31–33', '24–26'], ['S', '4–6', '33–35', '26–28'], ['M', '8–10', '35–37', '28–30'], ['L', '12–14', '37–40', '30–33'], ['XL', '16–18', '40–43', '33–36'], ['XXL', '20', '43–46', '36–39']] },
  shoes: { head: ['US', 'UK', 'EU', 'Foot (in)'], rows: [['6', '5.5', '39', '9.3'], ['7', '6.5', '40', '9.6'], ['8', '7.5', '41', '9.9'], ['9', '8.5', '42', '10.3'], ['10', '9.5', '43', '10.6'], ['11', '10.5', '44', '10.9']] },
};

// "Arrives Thu 21 Nov – Sat 23 Nov": handling time from the shop plus 2–4 days in transit.
export function deliveryWindow(shipsIn: string, from = new Date()) {
  const nums = (shipsIn.match(/\d+/g) || ['2', '3']).map(Number);
  const lo = (shipsIn.toLowerCase().includes('same') ? 0 : nums[0]) + 2, hi = (nums[1] ?? nums[0]) + 4;
  const fmt = (d: number) => new Date(from.getTime() + d * 864e5).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return `${fmt(lo)} – ${fmt(hi)}`;
}
