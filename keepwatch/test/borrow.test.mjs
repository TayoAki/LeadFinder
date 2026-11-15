import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openMemoryDb } from '../lib/db.mjs';
import { conventions, stanceCheck, matchDonors, ruleBrief, jobsFor } from '../lib/borrow.mjs';
import { DONORS } from '../lib/donors.mjs';

function seed() {
  const db = openMemoryDb();
  db.exec(`INSERT INTO kv (k, v) VALUES ('today', '2026-11-15')`);
  const r = (name) => Number(db.prepare('INSERT INTO rivals (name, page_id) VALUES (?, ?)').run(name, name).lastInsertRowid);
  const a = db.prepare('INSERT INTO ads (id, rival_id, is_active, start_date, format, hook, title, angle) VALUES (?,?,?,?,?,?,?,?)');
  const ids = [r('Fizzco'), r('Gutly'), r('Pop Ltd')];
  let n = 0;
  for (const id of ids) for (let i = 0; i < 4; i++) a.run(String(n++), id, 1, '2026-09-01', 'static', 'Fiber that tastes great, healthy soda', 'Healthy soda with prebiotic fiber', 'science');
  return { db, ids };
}

test('conventions find the habits every rival shares', () => {
  const { db, ids } = seed();
  const c = conventions(db, ids);
  assert.equal(c.brands.length, 3);
  assert.ok(c.rules.some(r => r.key === 'static' && r.share === 1), 'all static');
  assert.ok(c.rules.some(r => r.key === 'science'), 'all lead with science');
  assert.ok(c.gaps.length > 0);
});

test('swap test: generic or rival-like stances fail, a specific stance with a side passes', () => {
  const { db, ids } = seed();
  const bad = stanceCheck('Healthy soda with prebiotic fiber that tastes great', { brand_name: 'Orchard Hour' }, db, ids);
  assert.notEqual(bad.verdict, 'yours');
  assert.ok(bad.closest, 'finds the rival line');
  const good = stanceCheck('We will never sell a fiber drink that tastes like homework: 9g per can, no grit.', { brand_name: 'Orchard Hour' }, db, ids);
  assert.equal(good.verdict, 'yours');
});

test('donors rank by fit and broken habits; briefs fill brand facts and never leave placeholders', () => {
  const { db, ids } = seed();
  const ws = { brand_name: 'Orchard Hour', brand_product: 'Sparkling prebiotic fiber drink, 9g fiber per can', audience: 'Adults who drink soda at 3pm', category: 'Fiber drinks' };
  assert.ok(jobsFor(ws).includes('sensory'));
  const ranked = matchDonors(ws, conventions(db, ids));
  assert.equal(ranked.length, DONORS.length);
  assert.ok(ranked[0].reasons.length > 0);
  for (const d of DONORS) {
    const b = ruleBrief(d, ws, '', conventions(db, ids));
    const all = JSON.stringify(b);
    assert.ok(!/\{(brand|product|audience|detail)\}/.test(all), `${d.id} left a placeholder`);
    assert.ok(all.includes('Orchard Hour'), `${d.id} uses the brand`);
    assert.ok(!/[—–]/.test(all), `${d.id} has a dash`);
  }
});
