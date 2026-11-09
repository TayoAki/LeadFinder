import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-drop-'));
const { looksEnglish, pickForDrop, imagePrompt, rulePlan } = await import('../lib/rebuild.mjs');
const { brandFacts } = await import('../lib/llm.mjs');

const ad = (id, o = {}) => ({ id: String(id), rival_id: 1, angle: 'other', pile: 'kept', run_days: 40, is_active: 1, collation_count: 1,
  image_url: `https://x/${id}.jpg`, hook: 'I wish I knew this before my first week on this app', format_label: 'Video', ...o });

test('language check: English yes, Spanish/German no, too short unknown', () => {
  assert.equal(looksEnglish('I wish I knew this before starting my journey with the app'), true);
  assert.equal(looksEnglish('BitePal registra tu comida para que por fin veas resultados con tu mapache'), false);
  assert.equal(looksEnglish('Die Regeln für das Kaloriendefizit des Waschbären sind ganz einfach'), false);
  assert.equal(looksEnglish('Daydream'), null);
});

test('picker: kept only, best proven first, one per rival and angle, skips done, foreign and imageless ads', () => {
  const ads = [
    ad(1, { rival_id: 1, angle: 'demo', run_days: 300 }),
    ad(2, { rival_id: 1, angle: 'social_proof', run_days: 200 }),          // same rival as #1
    ad(3, { rival_id: 2, angle: 'demo', run_days: 250 }),                  // same angle as #1
    ad(4, { rival_id: 3, angle: 'problem', run_days: 60 }),
    ad(5, { rival_id: 4, angle: 'routine', run_days: 500, hook: 'Tu mapache no te deja aflojar con sarcasmo pero funciona' }), // Spanish
    ad(6, { rival_id: 5, angle: 'taste', run_days: 900, pile: 'testing' }), // not kept
    ad(7, { rival_id: 6, angle: 'urgency', run_days: 400, image_url: null, thumb_url: null }), // no image
    ad(8, { rival_id: 7, angle: 'expert', run_days: 999 }),                 // already rebuilt
    ad(9, { rival_id: 2, angle: 'curiosity', run_days: 100 }),
  ];
  const { picked } = pickForDrop(ads, { count: 4, done: new Set(['8']) });
  assert.deepEqual(picked.map(a => a.id), ['1', '9', '4', '3']);
});

test('image prompt: no button by default, new location keeps composition, text swapped one for one', () => {
  const p = imagePrompt({ headline: 'H', cta: 'Download', ws: { brand_name: 'B' }, hasProduct: false, texts: ['one', 'two'], setting: 'a pier by the sea' });
  assert.match(p, /Do not add any button/);
  assert.match(p, /new location: a pier by the sea/);
  assert.match(p, /\(1\) "one" \(2\) "two"/);
  assert.match(p, /clearly different one/);
  assert.match(p, /Do not add any product/);
});

test('rule fallback moves the scene and uses an app CTA for apps', () => {
  const plan = rulePlan(ad(1, { angle: 'other', cta: 'Learn more' }), { brand_name: 'Weight Class', brand_product: 'AI calorie counter app for iPhone', brand_domain: 'apps.apple.com/x' });
  assert.match(plan.setting, /different place of the same kind/);
  assert.equal(plan.cta, 'Download');
});

test('brand facts are only what the brand gave', () => {
  const f = brandFacts({ brand_product: 'P', brand_offer: 'O', brand_kit: JSON.stringify({ description: 'D', taglines: ['T'] }) });
  assert.deepEqual(f, ['Product: P', 'Offer: O', "From the brand's website: D", 'Website tagline: T']);
});
