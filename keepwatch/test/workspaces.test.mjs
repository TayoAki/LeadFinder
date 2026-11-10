import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-ws-'));
const { getDb, workspaceForUser, listWorkspaces, createWorkspace, switchWorkspace, familyIds, trackRival } = await import('../lib/db.mjs');
const { usage, spend } = await import('../lib/plans.mjs');
const db = getDb();
const rival = name => db.prepare('INSERT INTO rivals (name, page_id) VALUES (?, ?)').run(name, `p-${name}`).lastInsertRowid;

test('a new login gets one workspace, and it is the open one', () => {
  const ws = workspaceForUser('alice');
  assert.equal(listWorkspaces('alice').length, 1);
  assert.equal(workspaceForUser('alice').id, ws.id);
});

test('a second workspace opens on switch and stays separate', () => {
  const first = workspaceForUser('bob');
  db.prepare("UPDATE workspaces SET plan = 'agency' WHERE id = ?").run(first.id);
  const second = createWorkspace('bob', 'Realtor videos');
  assert.equal(second.parent_id, first.id);
  assert.equal(second.plan, 'agency');
  assert.equal(workspaceForUser('bob').id, first.id, 'creating does not switch by itself');
  switchWorkspace('bob', second.id);
  assert.equal(workspaceForUser('bob').id, second.id);
  assert.deepEqual(listWorkspaces('bob').map(w => w.brand_name), [null, 'Realtor videos']);
  trackRival(second.id, rival('VideoTour'));
  assert.equal(db.prepare('SELECT COUNT(*) n FROM workspace_rivals WHERE workspace_id = ?').get(first.id).n, 0);
});

test('workspaces of one login share the plan, credits and rival limit', () => {
  const [first, second] = listWorkspaces('bob');
  spend(first, 'ad', 'ad:t1');
  const a = usage(first), b = usage(second);
  assert.equal(a.credits.spent, b.credits.spent, 'one pool');
  assert.equal(a.credits.spent, 30 + 10, 'one rival charged in the second workspace + one ad in the first');
  assert.equal(a.used.rivals, 1);
  assert.equal(a.used.workspaces, 2);
  assert.deepEqual(familyIds(second).sort(), [first.id, second.id].sort());
});

test("nobody can open another login's workspace", () => {
  const theirs = listWorkspaces('bob')[1];
  assert.equal(switchWorkspace('mallory', theirs.id), null);
  assert.notEqual(workspaceForUser('mallory').id, theirs.id);
});

test('a stale or foreign current workspace falls back to the first one', () => {
  db.prepare('INSERT OR REPLACE INTO user_prefs (user_id, current_ws) VALUES (?, ?)').run('alice', listWorkspaces('bob')[1].id);
  assert.equal(workspaceForUser('alice').id, listWorkspaces('alice')[0].id);
});
