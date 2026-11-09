import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-sched-'));
const { getDb, workspaceForUser, saveWorkspace } = await import('../lib/db.mjs');
const { localNow, dropWeekOf, dropDue, notify, runDrop } = await import('../lib/schedule.mjs');
const db = getDb();

test('local time and drop week follow the workspace time zone', () => {
  const t = new Date('2026-11-09T12:30:00Z'); // Monday 7:30am in New York, 4:30am in Los Angeles
  assert.deepEqual(localNow('America/New_York', t), { weekday: 'Mon', hour: 7, date: '2026-11-09' });
  assert.equal(localNow('America/Los_Angeles', t).hour, 4);
  assert.equal(dropWeekOf('2026-11-09'), '2026-11-09');
  assert.equal(dropWeekOf('2026-11-15'), '2026-11-09'); // Sunday belongs to the week that started Monday
  assert.equal(localNow('Not/AZone', t).weekday, 'Mon'); // unknown zone falls back to UTC
});

test('a drop is due on Monday at or after the chosen hour, once per week, and not when switched off', () => {
  const ws = workspaceForUser('u-sched', db);
  saveWorkspace(ws.id, { drop_tz: 'America/New_York', drop_hour: 7 }, db);
  const w = () => db.prepare('SELECT * FROM workspaces WHERE id = ?').get(ws.id);
  assert.equal(dropDue(w(), new Date('2026-11-09T11:30:00Z')), null);          // 6:30am: too early
  assert.equal(dropDue(w(), new Date('2026-11-09T12:05:00Z')), '2026-11-09');  // 7:05am Monday
  assert.equal(dropDue(w(), new Date('2026-11-10T12:05:00Z')), null);          // Tuesday
  notify(ws.id, { kind: 'drop_ready', title: 'x', ref: `drop:${ws.id}:2026-11-09` }, db);
  assert.equal(dropDue(w(), new Date('2026-11-09T15:00:00Z')), null);          // already done this week
  saveWorkspace(ws.id, { drop_enabled: 0 }, db);
  assert.equal(dropDue(w(), new Date('2026-11-16T12:05:00Z')), null);          // switched off
});

test('a week with nothing to learn from is skipped with a reason, not silently', async () => {
  const ws = workspaceForUser('u-empty', db);
  const r = await runDrop(ws, '2026-11-09', db);
  assert.match(r.skipped, /Track at least one rival/);
  const n = db.prepare('SELECT * FROM notifications WHERE workspace_id = ?').get(ws.id);
  assert.equal(n.kind, 'drop_skipped');
});
