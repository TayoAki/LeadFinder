import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openMemoryDb } from '../lib/db.mjs';
import { addManualAds, isManual } from '../lib/manual.mjs';

test('manual ads stay inside one workspace and never overwrite shared ads', () => {
  const db = openMemoryDb();
  db.prepare("INSERT INTO workspaces (user_id) VALUES ('u1'), ('u2')").run();
  db.prepare("INSERT INTO rivals (name, page_id) VALUES ('Shared', '123')").run();
  db.prepare("INSERT INTO ads (id, rival_id, is_active, body) VALUES ('999', 1, 1, 'original')").run();
  const r = addManualAds(1, { rival: 'Shared', ads: [{ id: '999', body: 'injected', start_date: '2026-10-01' }, { title: '' }] }, db);
  assert.equal(r.added, 1); assert.equal(r.skipped, 1);
  assert.equal(db.prepare("SELECT body FROM ads WHERE id = '999'").get().body, 'original');
  const rv = db.prepare('SELECT * FROM rivals WHERE id = ?').get(r.rival.id);
  assert.ok(isManual(rv.page_id) && rv.page_id.startsWith('manual-1-'));
  const r2 = addManualAds(2, { rival: 'Shared', ads: [{ body: 'other workspace' }] }, db);
  assert.notEqual(r2.rival.id, r.rival.id);
  const ad = db.prepare("SELECT * FROM ads WHERE id = 'm1-999'").get();
  assert.equal(ad.hook, 'injected'); assert.ok(ad.angle);
});

test('rejects bad input and drops non-https urls', () => {
  const db = openMemoryDb();
  db.prepare("INSERT INTO workspaces (user_id) VALUES ('u1')").run();
  assert.throws(() => addManualAds(1, { rival: '', ads: [{ body: 'x' }] }, db));
  assert.throws(() => addManualAds(1, { rival: 'A', ads: [] }, db));
  addManualAds(1, { rival: 'A', ads: [{ body: 'hi there', image_url: 'javascript:alert(1)', link_url: 'http://x.com' }] }, db);
  const ad = db.prepare('SELECT * FROM ads').get();
  assert.equal(ad.image_url, null); assert.equal(ad.link_url, null);
});
