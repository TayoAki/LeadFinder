// Plans and the credit pool. One monthly pool pays for everything:
//   tracking a rival = 30 credits a month (its Read and Playbook included) · one finished ad = 10 · one buyer panel = 5
//   a motion video (the exact ad with a camera push) = 2 · an AI video (real movement, captions burned on) = 30
// Growth: 550 credits − 5 rivals × 30 = 400 → about 40 ads. Scale: 2,000 − 600 → 140. Agency: 6,500 − 1,200 → 530.
// New accounts get a 14-day trial; Stripe (later) sets workspaces.plan to a paid plan.
import { getDb, rivalIdsFor, rootWorkspace, familyIds } from './db.mjs';

export const COST = { rival: 30, ad: 10, panel: 5, motion: 2, video: 30 };

export const PLANS = {
  trial: { name: 'Trial', price: 0, rivals: 5, credits: 200, workspaces: 1, tagline: '14 days to try everything. No card needed.' },
  growth: { name: 'Growth', price: 149, annual: 1490, rivals: 5, credits: 550, workspaces: 1, tagline: 'For founders testing paid ads.' },
  scale: { name: 'Scale', price: 299, annual: 2990, rivals: 20, credits: 2000, workspaces: 3, tagline: 'For brands scaling their paid media.', popular: true },
  agency: { name: 'Agency', price: 599, annual: 5990, rivals: 40, credits: 6500, workspaces: 10, tagline: 'For agencies managing multiple brands.' },
};
for (const p of Object.values(PLANS)) p.ads = Math.floor((p.credits - p.rivals * COST.rival) / COST.ad);

const month = () => new Date().toISOString().slice(0, 7);
// Plan, trial and credits live on a login's first workspace; its other workspaces share them.
const isTrial = (ws, db = getDb()) => rootWorkspace(ws, db).plan === 'trial';
export const trialOver = (ws, db = getDb()) => { const r = rootWorkspace(ws, db); return r.plan === 'trial' && r.trial_ends_at && Date.parse(r.trial_ends_at + 'Z') < Date.now(); };

/** Ledger rows in the current pool window (the trial so far, or this calendar month), across the login's workspaces. */
function windowSql(ws, db = getDb()) {
  const ids = familyIds(ws, db);
  const inList = `workspace_id IN (${ids.map(() => '?').join(',')})`;
  return isTrial(ws, db) ? [inList, ids] : [`${inList} AND strftime('%Y-%m', created_at) = ?`, [...ids, month()]];
}

/** Charge this month's 30 credits for every tracked rival not yet charged, in each of the login's workspaces (idempotent). */
export function chargeRivals(ws, db = getDb()) {
  const key = isTrial(ws, db) ? 'trial' : month();
  const ins = db.prepare('INSERT OR IGNORE INTO credit_ledger (workspace_id, delta, reason, ref) VALUES (?, ?, ?, ?)');
  for (const id of familyIds(ws, db)) for (const rid of rivalIdsFor(id, db)) ins.run(id, -COST.rival, 'rival', `rival:${id}:${rid}:${key}`);
}

export function usage(ws, db = getDb()) {
  chargeRivals(ws, db);
  const root = rootWorkspace(ws, db);
  const plan = PLANS[root.plan] || PLANS.trial;
  const [where, args] = windowSql(ws, db);
  const family = familyIds(ws, db);
  const spent = -db.prepare(`SELECT COALESCE(SUM(delta), 0) n FROM credit_ledger WHERE ${where}`).get(...args).n;
  const by = Object.fromEntries(db.prepare(`SELECT reason, -SUM(delta) n FROM credit_ledger WHERE ${where} GROUP BY reason`).all(...args).map(r => [r.reason, r.n]));
  const balance = trialOver(ws, db) ? 0 : Math.max(0, plan.credits - spent);
  return {
    plan: root.plan, plan_name: plan.name, limits: plan, cost: COST, trial_ends_at: root.trial_ends_at || null, trial_over: trialOver(ws, db),
    credits: { pool: plan.credits, spent, balance, ads_left: Math.floor(balance / COST.ad), by_reason: by },
    used: { rivals: family.reduce((n, id) => n + rivalIdsFor(id, db).length, 0), workspaces: family.length, rivals_here: rivalIdsFor(ws.id, db).length },
    resets: isTrial(ws, db) ? 'when your trial ends' : 'on the 1st of each month',
  };
}

const err402 = msg => Object.assign(new Error(msg), { status: 402 });

/** Spend credits (throws 402 if the pool can't cover it). Returns the ledger ref so a failure can be refunded. */
export function spend(ws, what, ref, db = getDb()) {
  const u = usage(ws, db);
  if (u.trial_over) throw err402('Your trial has ended. Paid plans are coming soon; reply to your welcome email to keep going.');
  const n = COST[what];
  if (u.credits.balance < n) throw err402(`That needs ${n} credits and you have ${u.credits.balance} left. Your pool refills ${u.resets}.`);
  db.prepare('INSERT INTO credit_ledger (workspace_id, delta, reason, ref) VALUES (?, ?, ?, ?)').run(ws.id, -n, what, ref);
  return ref;
}

export function refund(ws, ref, db = getDb()) {
  const row = db.prepare('SELECT delta, reason FROM credit_ledger WHERE ref = ? AND workspace_id = ?').get(ref, ws.id);
  if (row && row.delta < 0) db.prepare('INSERT OR IGNORE INTO credit_ledger (workspace_id, delta, reason, ref) VALUES (?, ?, ?, ?)').run(ws.id, -row.delta, 'refund', `refund:${ref}`);
}

/** Room to track one more rival: a free slot on the plan and 30 credits for this month. */
export function assertRivalRoom(ws, db = getDb()) {
  const u = usage(ws, db);
  if (u.trial_over) throw err402('Your trial has ended. Paid plans are coming soon.');
  if (u.used.rivals >= u.limits.rivals) throw err402(`Your ${u.plan_name} plan tracks up to ${u.limits.rivals} rivals. Remove one first, or move up a plan when upgrades open.`);
  if (u.credits.balance < COST.rival) throw err402(`Tracking a rival uses ${COST.rival} credits a month and you have ${u.credits.balance} left.`);
}
