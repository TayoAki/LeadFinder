import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-plans-'));
const { getDb, workspaceForUser, trackRival } = await import('../lib/db.mjs');
const { PLANS, COST, usage, spend, refund, assertRivalRoom, chargeRivals } = await import('../lib/plans.mjs');
const { safeUrl } = await import('../lib/brandkit.mjs');
const db = getDb();

test('plan math matches the published "about N ads a month"', () => {
  assert.equal(PLANS.growth.ads, 40);
  assert.equal(PLANS.scale.ads, 140);
  assert.equal(PLANS.agency.ads, 530);
});

test('new accounts start on a trial; rivals are charged once per period; ads spend and refund', () => {
  const ws = workspaceForUser('u-credits', db);
  assert.equal(ws.plan, 'trial');
  for (let i = 0; i < 3; i++) {
    const r = db.prepare('INSERT INTO rivals (name, page_id) VALUES (?, ?)').run(`R${i}`, `p-${i}`);
    trackRival(ws.id, Number(r.lastInsertRowid), db);
  }
  chargeRivals(ws, db); chargeRivals(ws, db); // idempotent
  let u = usage(ws, db);
  assert.equal(u.credits.spent, 3 * COST.rival);
  spend(ws, 'ad', 'ad:test-1', db);
  u = usage(ws, db);
  assert.equal(u.credits.balance, PLANS.trial.credits - 3 * COST.rival - COST.ad);
  refund(ws, 'ad:test-1', db); refund(ws, 'ad:test-1', db); // idempotent
  assert.equal(usage(ws, db).credits.balance, PLANS.trial.credits - 3 * COST.rival);
});

test('spending past the pool is refused with a 402', () => {
  const ws = workspaceForUser('u-broke', db);
  for (let i = 0; i < 20; i++) { try { spend(ws, 'ad', `ad:b-${i}`, db); } catch { break; } }
  assert.throws(() => spend(ws, 'ad', 'ad:b-over', db), e => e.status === 402);
});

test('rival slots are capped by plan', () => {
  const ws = workspaceForUser('u-slots', db);
  for (let i = 0; i < PLANS.trial.rivals; i++) {
    const r = db.prepare('INSERT INTO rivals (name, page_id) VALUES (?, ?)').run(`S${i}`, `s-${i}`);
    trackRival(ws.id, Number(r.lastInsertRowid), db);
  }
  assert.throws(() => assertRivalRoom(ws, db), e => e.status === 402);
});

test('brand-kit fetches refuse private and local addresses', () => {
  for (const bad of ['localhost:3000', '127.0.0.1', 'http://169.254.169.254/latest', 'intranet', 'ftp://x.com']) assert.equal(safeUrl(bad), null, bad);
  assert.equal(safeUrl('shop.example.com').hostname, 'shop.example.com');
});
