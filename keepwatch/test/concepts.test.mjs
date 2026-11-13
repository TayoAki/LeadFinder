import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enrich } from '../lib/analytics.mjs';
import { conceptsFor, normalize, similarity, structureOf, signature } from '../lib/concepts.mjs';

const T = '2026-11-08';
let n = 0;
const ad = (o) => enrich({ id: String(++n), rival_id: o.rival_id || 1, rival_name: o.rival_name || 'Acme', format: 'video', angle: 'other', is_active: 1, end_date: T, ...o }, T);

test('brand names and numbers are stripped before comparing', () => {
  assert.equal(normalize('Acme lets you build 3 apps', ['acme']), normalize('Zeta lets you build 12 apps', ['zeta']));
  assert.ok(similarity(normalize('With Acme, you just describe what you want.', ['acme']), normalize('With Zeta you just describe what you want', ['zeta'])) >= 0.5);
  assert.ok(similarity('cats like milk', 'tax returns due friday') < 0.2);
});

test('versions of one idea group together; a proven idea with a fresh version is scaling', () => {
  const ads = [
    ad({ hook: 'Turn your idea into a real app in minutes.', start_date: '2026-08-01' }),
    ad({ hook: 'Turn your idea into a real app, in minutes', start_date: '2026-11-01' }),
    ad({ hook: 'Turn your idea into a real app in minutes!', start_date: '2026-09-01', is_active: 0, end_date: '2026-10-01' }),
    ad({ hook: 'Our winter sale ends Friday', start_date: '2026-11-05' }),
  ];
  const cs = conceptsFor(ads, T, ['acme']);
  const big = cs.find(c => c.versions === 3);
  assert.ok(big, 'three phrasings form one concept');
  assert.equal(big.status, 'scaling');
  assert.equal(big.live, 2);
  assert.equal(big.fresh, 1);
  assert.equal(cs.find(c => c.versions === 1).status, 'one_off');
});

test('same Meta creative group joins even when the copy differs', () => {
  const ads = [ad({ hook: 'Alpha line', collation_id: 'g1', start_date: '2026-10-01' }), ad({ hook: 'Totally other words', collation_id: 'g1', start_date: '2026-10-02' })];
  assert.equal(conceptsFor(ads, T).length, 1);
});

test('structure and medium make the format signature', () => {
  assert.equal(structureOf({ hook: 'Is your website costing you customers?' }), 'question');
  assert.equal(structureOf({ hook: 'Get 30% off your first month' }), 'offer');
  assert.equal(structureOf({ hook: 'An app built with it is on pace for $500K a year.' }), 'statement', 'revenue claim is not an offer');
  assert.equal(structureOf({ hook: 'If you can describe it, you can build it.' }), 'promise');
  assert.equal(signature({ display_format: 'DCO', format: 'image', hook: 'If you can describe it, you can build it.' }), 'dynamic:promise');
});
