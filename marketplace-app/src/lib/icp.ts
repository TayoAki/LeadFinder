// "Find your match" quiz: a few questions sort a shopper into an ICP (ideal customer profile),
// then products are ranked by how well their tags fit (product.details: goal, skin_type, concern,
// fit) and the budget. The segment is attached to every later event as `icp`, so funnels,
// retention and experiments can be broken down by segment in Admin → Analytics.
// Scoring uses only real product data; when nothing is tagged, it falls back to niche + budget.
import { setGlobalProps } from './analytics';
import { products, type Product } from './data';
import { nicheOf, type Niche } from './niches';
import { tagsOf } from './facets';

export type Area = 'supplements' | 'skin' | 'style' | 'home' | 'outdoors' | 'gift';
export type QuizProfile = {
  icp: string; area: Area; goal?: string; skin_type?: string; concern?: string; size?: string;
  budget: number | null; at: number;
};

export type Question = { key: keyof QuizProfile; title: string; sub: string; options: { value: string; label: string; icon: string }[] };

export const AREAS: Question = {
  key: 'area', title: 'What are you shopping for?', sub: 'This decides the next question.',
  options: [
    { value: 'supplements', label: 'Feeling better', icon: 'leaf-outline' },
    { value: 'skin', label: 'My skin', icon: 'water-outline' },
    { value: 'style', label: 'My style', icon: 'shirt-outline' },
    { value: 'home', label: 'My home', icon: 'home-outline' },
    { value: 'outdoors', label: 'Sport and outdoors', icon: 'trail-sign-outline' },
    { value: 'gift', label: 'A gift', icon: 'gift-outline' },
  ],
};

const BUDGET: Question = {
  key: 'budget', title: 'What do you want to spend?', sub: "Picks over this won't show first.",
  options: [{ value: '25', label: 'Under $25', icon: 'cash-outline' }, { value: '50', label: 'Under $50', icon: 'cash-outline' }, { value: '100', label: 'Under $100', icon: 'cash-outline' }, { value: '', label: 'No limit', icon: 'infinite-outline' }],
};

// Follow-up questions per area. Option values match the tags sellers use in product details.
export function questionsFor(area: Area): Question[] {
  switch (area) {
    case 'supplements': return [{
      key: 'goal', title: 'What do you want help with?', sub: 'We match it to what each product is for.',
      options: ['Sleep', 'Stress', 'Energy', 'Focus', 'Gut health', 'Recovery', 'Immunity'].map(v => ({ value: v, label: v, icon: 'leaf-outline' })),
    }, BUDGET];
    case 'skin': return [{
      key: 'skin_type', title: "What's your skin like?", sub: 'By midday, without products.',
      options: [{ value: 'Dry', label: 'Dry or tight', icon: 'water-outline' }, { value: 'Oily', label: 'Shiny all over', icon: 'sunny-outline' }, { value: 'Combination', label: 'Oily T-zone, dry cheeks', icon: 'contrast-outline' }, { value: 'Normal', label: 'Comfortable', icon: 'happy-outline' }, { value: 'Sensitive', label: 'Easily red or irritated', icon: 'alert-circle-outline' }],
    }, {
      key: 'concern', title: 'What would you most like to fix?', sub: 'Pick the one that bothers you most.',
      options: ['Breakouts', 'Dryness', 'Fine lines', 'Redness', 'Uneven tone', 'Sun protection'].map(v => ({ value: v, label: v, icon: 'sparkles-outline' })),
    }, BUDGET];
    case 'style': return [{
      key: 'size', title: 'Your usual clothing size?', sub: "We'll pre-select it and hide what's sold out in it.",
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(v => ({ value: v, label: v, icon: 'resize-outline' })),
    }, BUDGET];
    default: return [BUDGET];
  }
}

// The segment name: a stable, readable key for analytics (and a friendly title for the result).
export function icpOf(p: Omit<QuizProfile, 'icp' | 'at'>): { key: string; title: string; line: string } {
  if (p.area === 'supplements') {
    const g = p.goal ?? '';
    if (['Sleep', 'Stress'].includes(g)) return { key: 'wellness_calm', title: 'The wind-down', line: 'Better sleep and calmer days.' };
    if (['Energy', 'Focus', 'Recovery'].includes(g)) return { key: 'wellness_performance', title: 'The performer', line: 'Energy, focus and recovery.' };
    return { key: 'wellness_foundations', title: 'The foundations', line: 'Daily basics: gut, immunity, bones.' };
  }
  if (p.area === 'skin') {
    if (p.skin_type === 'Sensitive' || p.skin_type === 'Dry' || p.concern === 'Redness') return { key: 'skin_barrier', title: 'Barrier first', line: 'Calm, hydrated, comfortable skin.' };
    if (p.concern === 'Breakouts' || p.skin_type === 'Oily') return { key: 'skin_clear', title: 'Clear and balanced', line: 'Less shine, fewer breakouts.' };
    return { key: 'skin_glow', title: 'Glow keeper', line: 'Even tone, fewer fine lines, daily SPF.' };
  }
  const map: Record<string, { key: string; title: string; line: string }> = {
    style: { key: 'style_refresh', title: 'Style refresh', line: 'New pieces in your size.' },
    home: { key: 'home_upgrade', title: 'Home upgrader', line: 'Useful things that look good.' },
    outdoors: { key: 'active_outdoors', title: 'Weekend athlete', line: 'Kit for the games you play.' },
    gift: { key: 'gift_hunter', title: 'Gift hunter', line: 'Well-reviewed picks that arrive on time.' },
  };
  return map[p.area];
}

const NICHE_FOR: Record<Area, Niche[] | null> = { supplements: ['supplements'], skin: ['beauty'], style: ['fashion'], home: ['home'], outdoors: ['outdoors'], gift: null };

// How well a product answers this shopper's answers (0 = not at all). Used for the routine.
export function matchScore(p: QuizProfile, x: Product) {
  const f = (key: 'goal' | 'skin_type' | 'concern', v?: string) => (v && tagsOf(x, key).includes(v) ? 1 : 0);
  return f('goal', p.goal) + f('skin_type', p.skin_type) + f('concern', p.concern);
}

// Score every in-stock product for this profile. Tag matches dominate; budget and stock break ties.
export function rankFor(p: QuizProfile, pool: Product[] = products): Product[] {
  const niches = NICHE_FOR[p.area];
  // An exact tag beats a generic "All skin types"; a product that answers the question beats one that doesn't.
  const fit = (x: Product, key: 'goal' | 'skin_type' | 'concern', v?: string) => (!v ? 0 : tagsOf(x, key).includes(v) ? 1 : tagsOf(x, key).some(t => /^all\b/i.test(t)) ? 0.2 : 0);
  const score = (x: Product) => {
    let s = 0;
    s += 50 * fit(x, 'goal', p.goal);
    s += 30 * fit(x, 'skin_type', p.skin_type);
    s += 40 * fit(x, 'concern', p.concern);
    if (p.size && x.sizes.includes(p.size) && (x.sizeStock?.[p.size] ?? 1) > 0) s += 20;
    if (p.budget && x.price <= p.budget) s += 15;
    if (x.compareAt) s += 3;
    return s + Math.min(x.sold, 50) / 10; // real purchases only (0 when unknown)
  };
  return pool
    .filter(x => x.stock > 0 && (!niches || niches.includes(nicheOf(x))) && (!p.size || !x.sizes.length || x.sizes.includes(p.size)))
    .filter(x => !p.budget || x.price <= p.budget * 1.25)
    .sort((a, b) => score(b) - score(a));
}

// Every event from now on carries the segment, so funnels can be split by ICP.
export function setProfileProps(p: QuizProfile | null) {
  setGlobalProps(() => (p ? { icp: p.icp, quiz_area: p.area } : {}), 'icp');
}

// Starting answers for each segment, so a result page can be opened directly (e.g. from an ad)
// before someone has taken the quiz.
const PRESETS: Record<string, Omit<QuizProfile, 'icp' | 'at'>> = {
  wellness_calm: { area: 'supplements', goal: 'Sleep', budget: null },
  wellness_performance: { area: 'supplements', goal: 'Energy', budget: null },
  wellness_foundations: { area: 'supplements', goal: 'Immunity', budget: null },
  skin_barrier: { area: 'skin', skin_type: 'Sensitive', concern: 'Redness', budget: null },
  skin_clear: { area: 'skin', skin_type: 'Oily', concern: 'Breakouts', budget: null },
  skin_glow: { area: 'skin', skin_type: 'Normal', concern: 'Fine lines', budget: null },
  style_refresh: { area: 'style', budget: null },
  home_upgrade: { area: 'home', budget: null },
  active_outdoors: { area: 'outdoors', budget: null },
  gift_hunter: { area: 'gift', budget: 50 },
};
export const presetFor = (icp: string): QuizProfile | null => (PRESETS[icp] ? { ...PRESETS[icp], icp, at: 0 } : null);

// The offer and guide that fit each segment (src/data/pages.json), shown on the result page.
export const pagesForIcp = (icp: string): { offer?: string; guide?: string; story?: string } =>
  icp.startsWith('skin_') ? { offer: 'barrier-repair-routine', guide: 'skin-barrier-signs', story: 'why-we-simplified-skincare' }
    : icp === 'wellness_calm' ? { offer: 'evening-wind-down', guide: 'magnesium-before-you-buy', story: 'evening-routine-that-stuck' }
    : icp.startsWith('wellness_') ? { guide: 'magnesium-before-you-buy' }
    : icp === 'style_refresh' ? { offer: 'joyful-script-sweatshirt', guide: 'style-a-statement-sweatshirt', story: 'why-we-print-on-demand' }
    : {};
