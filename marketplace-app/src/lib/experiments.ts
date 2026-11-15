// Experiments: stable assignment per shopper, exposure events, and permanent holdouts.
// Every analytics event carries the shopper's assignments as `exp_<key>` props, so any funnel in
// Admin → Analytics can be broken down by variant (Funnels → "Break down by" → exp_<key>).
// The log of hypotheses and results lives in docs/experiments.md (one variable per test).
import { ids, setGlobalProps, track } from './analytics';

type Experiment = { key: string; variants: string[]; weights?: number[]; active: boolean };

// Keys match docs/conversion-plan.md §5.1.
export const EXPERIMENTS: Experiment[] = [
  { key: 'e3_saved_size', variants: ['preselect', 'none'], active: true },
  { key: 'e7_bundle_pdp', variants: ['on', 'off'], active: true },
  { key: 'e8_proof_near_price', variants: ['near', 'below'], active: true },
  { key: 'e16_campaign_landing', variants: ['matched', 'generic'], active: true },
  // Permanent holdouts (5%): never get discounts / marketing pushes, to measure true lift.
  { key: 'holdout_discounts', variants: ['holdout', 'eligible'], weights: [5, 95], active: true },
  { key: 'holdout_push', variants: ['holdout', 'eligible'], weights: [5, 95], active: true },
];

// FNV-1a: the same shopper always lands in the same variant.
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };

const assignments: Record<string, string> = {};
for (const e of EXPERIMENTS.filter(e => e.active)) {
  const w = e.weights ?? e.variants.map(() => 1); const total = w.reduce((a, b) => a + b, 0);
  let x = hash(`${ids().anon}:${e.key}`) * total;
  assignments[e.key] = e.variants.find((_, i) => (x -= w[i]) < 0) ?? e.variants[0];
}

// Props merged into every event (see analytics.ts).
export const experimentProps = () => Object.fromEntries(Object.entries(assignments).map(([k, v]) => [`exp_${k}`, v]));
setGlobalProps(experimentProps);

const exposed = new Set<string>();
// Read a variant where it changes what the shopper sees; logs one exposure per session.
export function variant(key: string): string {
  const v = assignments[key] ?? EXPERIMENTS.find(e => e.key === key)?.variants[0] ?? '';
  if (!exposed.has(key)) { exposed.add(key); track('experiment_exposure', { experiment: key, variant: v }); }
  return v;
}
export const inHoldout = (key: 'holdout_discounts' | 'holdout_push') => assignments[key] === 'holdout';
