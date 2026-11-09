// The Monday drop, on a schedule: every Monday at the workspace's chosen hour (default 7am) in its own
// time zone, make this week's drop and leave an in-app notification. A skipped week says why.
import { getDb, rivalIdsFor } from './db.mjs';
import { mondayDrop } from './rebuild.mjs';
import { usage, spend, refund, COST } from './plans.mjs';
import { providerStatus } from './providers.mjs';
import { randomUUID } from 'node:crypto';

export const DROP_SIZE = 4;

/** Local weekday, hour and date for a time zone (falls back to UTC for an unknown zone). */
export function localNow(tz, now = new Date()) {
  let parts;
  try { parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz || 'UTC', weekday: 'short', hour: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(p => [p.type, p.value])); }
  catch { return localNow('UTC', now); }
  return { weekday: parts.weekday, hour: Number(parts.hour), date: `${parts.year}-${parts.month}-${parts.day}` };
}

/** The drop week a local date belongs to: the Monday on or before it (YYYY-MM-DD). */
export function dropWeekOf(localDate) {
  const d = new Date(`${localDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export function notify(wsId, { kind, title, body = null, link = null, ref = null }, db = getDb()) {
  db.prepare('INSERT OR IGNORE INTO notifications (workspace_id, kind, title, body, link, ref) VALUES (?,?,?,?,?,?)').run(wsId, kind, title, body, link, ref);
}

/** Is this workspace's drop due right now, and for which week? */
export function dropDue(ws, now = new Date(), db = getDb()) {
  if (ws.drop_enabled === 0) return null;
  const { weekday, hour, date } = localNow(ws.drop_tz, now);
  if (weekday !== 'Mon' || hour < (ws.drop_hour ?? 7)) return null;
  const week = dropWeekOf(date);
  if (db.prepare('SELECT 1 FROM notifications WHERE ref = ?').get(`drop:${ws.id}:${week}`)) return null; // already done or skipped
  return week;
}

/** Make one workspace's drop for a week, spending credits per ad and refunding failures. Always leaves a notification. */
export async function runDrop(ws, week, db = getDb()) {
  const ref = `drop:${ws.id}:${week}`;
  const skip = (title, body) => { notify(ws.id, { kind: 'drop_skipped', title, body, link: '#/settings', ref }, db); return { skipped: body }; };
  if (!rivalIdsFor(ws.id, db).length) return skip('No Monday drop this week', 'Track at least one rival so there are ads to learn from.');
  if (!ws.brand_name) return skip('No Monday drop this week', 'Add your brand name and product in Settings first.');
  if (!(await providerStatus()).images) return skip('No Monday drop this week', 'Ad images are not switched on for this server yet.');
  const u = usage(ws, db);
  if (u.credits.balance < DROP_SIZE * COST.ad) return skip('No Monday drop this week', `A drop is ${DROP_SIZE} ads (${DROP_SIZE * COST.ad} credits) and you had ${u.credits.balance} left. Your pool refills ${u.resets}.`);
  const refs = [];
  const r = await mondayDrop(ws, { count: DROP_SIZE, week, onEach: () => refs.push(spend(ws, 'ad', `ad:${randomUUID()}`, db)) });
  r.rebuilds.forEach((rb, i) => { if (rb.status !== 'done' && refs[i]) refund(ws, refs[i], db); });
  const made = r.rebuilds.filter(x => x.status === 'done');
  if (!made.length) return skip('No Monday drop this week', 'None of this week\'s picks could be made. Credits were refunded.');
  notify(ws.id, { kind: 'drop_ready', title: 'Your Monday drop is ready', link: '#/rebuild',
    body: `${made.length} new ad${made.length === 1 ? '' : 's'}, rebuilt from what ${[...new Set(made.map(x => x.ad?.rival_name).filter(Boolean))].join(', ')} keep${made.length === 1 ? 's' : ''} running.`, ref }, db);
  return { made: made.length };
}

let running = false;
/** Called every few minutes: makes any drop that's due. One at a time, so a slow week can't pile up. */
export async function dropTick(now = new Date()) {
  if (running) return;
  running = true;
  try {
    const db = getDb();
    for (const ws of db.prepare('SELECT * FROM workspaces WHERE COALESCE(drop_enabled, 1) = 1').all()) {
      const week = dropDue(ws, now, db);
      if (!week) continue;
      try { const r = await runDrop(ws, week, db); console.log(`drop ${ws.id} ${week}:`, JSON.stringify(r)); }
      catch (e) { console.warn(`drop ${ws.id} failed:`, e.message); notify(ws.id, { kind: 'drop_skipped', title: 'No Monday drop this week', body: 'Something went wrong making it. Try "Make this week\'s drop" in the app.', ref: `drop:${ws.id}:${week}` }, db); }
    }
  } finally { running = false; }
}
