// Plans and monthly limits. Billing (Stripe) plugs in later by setting workspaces.plan.
import { getDb } from './db.mjs';

export const PLANS = {
  free: { name: 'Free', rivals: 5, rebuilds: 10, panels: 3 },
  pro: { name: 'Pro', rivals: 15, rebuilds: 200, panels: 60 },
};

const MONTH = "strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')";

export function usage(ws, db = getDb()) {
  const plan = PLANS[ws.plan] || PLANS.free;
  const used = {
    rivals: db.prepare('SELECT COUNT(*) n FROM workspace_rivals WHERE workspace_id = ?').get(ws.id).n,
    rebuilds: db.prepare(`SELECT COUNT(*) n FROM rebuilds WHERE workspace_id = ? AND ${MONTH} AND status NOT LIKE 'failed%'`).get(ws.id).n,
    panels: db.prepare(`SELECT COUNT(*) n FROM panels WHERE workspace_id = ? AND ${MONTH}`).get(ws.id).n,
  };
  return { plan: ws.plan, plan_name: plan.name, limits: plan, used };
}

/** Throws a 402 if the workspace has no room left for `n` more of `what` this month. */
export function assertRoom(ws, what, n = 1, db = getDb()) {
  const u = usage(ws, db);
  if (u.used[what] + n > u.limits[what]) {
    const label = { rivals: 'tracked rivals', rebuilds: 'ad rebuilds this month', panels: 'buyer panels this month' }[what];
    throw Object.assign(new Error(`Your ${u.plan_name} plan includes ${u.limits[what]} ${label}. Upgrades are coming soon.`), { status: 402 });
  }
}
