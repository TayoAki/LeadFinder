// Shelby Insights: funnels, retention and shopper timelines over our own `events` table.
// Interface: plain options in, plain data out. Shopper events only (source = 'app', anon set).
// Spec: docs/specs/insights.md

const SHOPPER = "source = 'app' AND anon IS NOT NULL AND anon != ''";

// Rows of the given event names in range, ordered by shopper then time.
function stepRows(db, { from, to, names }) {
  const marks = names.map(() => '?').join(',');
  return db.prepare(`SELECT anon, name, ts, platform, props FROM events
    WHERE ${SHOPPER} AND ts >= ? AND ts <= ? AND name IN (${marks}) ORDER BY anon, ts, id`).all(from, to, ...names);
}

// For one shopper's rows, the timestamps at which each step was reached on their best attempt:
// every step-1 occurrence may start an attempt; later steps must follow in order and fall within
// windowMs of that start. Furthest attempt wins; ties go to the earliest. Attempts must start by
// `startBy` (the range end) but may finish after it.
function matchSteps(rows, steps, windowMs, startBy) {
  let best = [], bestStart = null;
  rows.forEach((start, i) => {
    if (start.name !== steps[0] || start.ts > startBy) return;
    const at = [start.ts];
    for (let j = i + 1; j < rows.length && at.length < steps.length; j++) {
      const r = rows[j];
      if (r.ts - start.ts > windowMs) break;
      if (r.name === steps[at.length] && r.ts >= at[at.length - 1]) at.push(r.ts);
    }
    if (at.length > best.length) { best = at; bestStart = start; }
  });
  return { at: best, start: bestStart };
}

const median = xs => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const byShopper = rows => {
  const m = new Map();
  for (const r of rows) { if (!m.has(r.anon)) m.set(r.anon, []); m.get(r.anon).push(r); }
  return m;
};

function summarise(steps, reached) {
  const people = steps.map((_, i) => reached.filter(at => at.length > i).length);
  return steps.map((name, i) => ({
    name, people: people[i],
    dropped: i === 0 ? 0 : people[i - 1] - people[i],
    fromPrev: i === 0 ? (people[0] ? 1 : 0) : people[i - 1] ? people[i] / people[i - 1] : 0,
    fromStart: people[0] ? people[i] / people[0] : 0,
    medianMsFromPrev: i === 0 ? null : median(reached.filter(at => at.length > i).map(at => at[i] - at[i - 1])),
  }));
}

// Each shopper's best attempt: { anon, at: [ts per reached step], start: the step-1 row }.
function attempts(db, { steps, from, to, windowMs = 7 * 864e5 }) {
  const groups = byShopper(stepRows(db, { from, to: to + windowMs, names: [...new Set(steps)] }));
  return [...groups].map(([anon, rows]) => ({ anon, ...matchSteps(rows, steps, windowMs, to) })).filter(a => a.at.length);
}

const breakdownKey = (start, by) => {
  if (by === 'platform') return start.platform || '(none)';
  const v = JSON.parse(start.props || '{}')[by];
  return v === undefined || v === null || v === '' ? '(none)' : String(v);
};

export function funnel(db, opts) {
  const all = attempts(db, opts);
  const out = { steps: summarise(opts.steps, all.map(a => a.at)) };
  if (opts.breakdown) {
    const groups = new Map();
    for (const a of all) {
      const k = breakdownKey(a.start, opts.breakdown);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(a.at);
    }
    out.breakdown = [...groups].map(([key, reached]) => ({ key, steps: summarise(opts.steps, reached) }))
      .sort((x, y) => y.steps[0].people - x.steps[0].people);
  }
  return out;
}

// Shoppers who reached step stepIndex - 1 but not step stepIndex.
export function dropoffs(db, opts, stepIndex) {
  return attempts(db, opts).filter(a => a.at.length === stepIndex).map(a => a.anon);
}

// ---------- retention ----------
const DAY_MS = 864e5;
// Start of the UTC day, or of the UTC week beginning Monday.
const periodStart = (ts, period) => {
  const day = Math.floor(ts / DAY_MS) * DAY_MS;
  if (period !== 'week') return day;
  const dow = (new Date(day).getUTCDay() + 6) % 7; // Monday = 0
  return day - dow * DAY_MS;
};
const isoDay = ts => new Date(ts).toISOString().slice(0, 10);

// Cohorts by first-ever activity; values[k] = members active (or doing returnEvent) in period k.
// Period 0 is the cohort's own period and always equals its size. Periods starting after `to` are null.
export function retention(db, { from, to, period = 'day', periods = 8, returnEvent }) {
  const len = (period === 'week' ? 7 : 1) * DAY_MS;
  const firsts = db.prepare(`SELECT anon, MIN(ts) first FROM events WHERE ${SHOPPER} GROUP BY anon HAVING first >= ? AND first <= ?`).all(from, to);
  const cohortOf = new Map(firsts.map(f => [f.anon, periodStart(f.first, period)]));
  const cohorts = new Map();
  for (const start of [...new Set(cohortOf.values())].sort((a, b) => a - b)) {
    cohorts.set(start, { start, members: new Set(), active: Array.from({ length: periods }, () => new Set()) });
  }
  for (const [anon, start] of cohortOf) cohorts.get(start).members.add(anon);
  const rows = db.prepare(`SELECT anon, ts FROM events WHERE ${SHOPPER} AND ts >= ? AND ts <= ?${returnEvent ? ' AND name = ?' : ''}`)
    .all(from, to + periods * len, ...(returnEvent ? [returnEvent] : []));
  for (const r of rows) {
    const start = cohortOf.get(r.anon); if (start === undefined) continue;
    const k = Math.round((periodStart(r.ts, period) - start) / len);
    if (k >= 1 && k < periods) cohorts.get(start).active[k].add(r.anon);
  }
  return {
    cohorts: [...cohorts.values()].map(c => ({
      start: isoDay(c.start), size: c.members.size,
      values: c.active.map((s, k) => (c.start + k * len > to ? null : k === 0 ? c.members.size : s.size)),
    })),
  };
}

// ---------- people and timelines ----------
// Orders and spend: each order counts once. The server's order_confirmed is the truth; an
// order_placed whose order_id was never confirmed (or has no id) still counts.
function ordersOf(db, anon, from, to) {
  const rows = db.prepare(`SELECT name, json_extract(props, '$.order_id') oid, json_extract(props, '$.total') total FROM events
    WHERE ${SHOPPER} AND anon = ? AND name IN ('order_confirmed', 'order_placed') AND ts >= ? AND ts <= ?`).all(anon, from, to);
  const confirmed = new Set(rows.filter(r => r.name === 'order_confirmed').map(r => String(r.oid)));
  const counted = rows.filter(r => r.name === 'order_confirmed' || r.oid == null || !confirmed.has(String(r.oid)));
  return { orders: counted.length, spend: Math.round(counted.reduce((n, r) => n + (Number(r.total) || 0), 0) * 100) / 100 };
}

function personRow(db, r, from, to) {
  const last = db.prepare(`SELECT platform, path FROM events WHERE ${SHOPPER} AND anon = ? AND ts <= ? ORDER BY ts DESC, id DESC LIMIT 1`).get(r.anon, to);
  return {
    anon: r.anon, firstSeen: r.firstSeen, lastSeen: r.lastSeen, sessions: r.sessions, events: r.events,
    ...ordersOf(db, r.anon, from, to), platform: last?.platform ?? '', lastPath: last?.path ?? '',
  };
}

const PERSON_SQL = `SELECT anon, MAX(ts) lastSeen, COUNT(*) events, COUNT(DISTINCT session) sessions,
  (SELECT MIN(ts) FROM events f WHERE f.anon = e.anon AND f.source = 'app') firstSeen
  FROM events e WHERE ${SHOPPER} AND ts >= ? AND ts <= ?`;

// Shoppers active in the range, most recently seen first. `did` keeps those who did that event in
// the range; `didNot` drops those who did that one (did checkout_start + didNot order_placed = abandoned).
export function people(db, { from, to, did, didNot, limit = 50 }) {
  const did_ = `SELECT anon FROM events WHERE ${SHOPPER} AND name = ? AND ts >= ? AND ts <= ?`;
  const rows = db.prepare(`${PERSON_SQL}${did ? ` AND anon IN (${did_})` : ''}${didNot ? ` AND anon NOT IN (${did_})` : ''}
    GROUP BY anon ORDER BY lastSeen DESC LIMIT ?`).all(from, to, ...(did ? [did, from, to] : []), ...(didNot ? [didNot, from, to] : []), Math.min(500, limit));
  return rows.map(r => personRow(db, r, from, to));
}

// One shopper's history: summary plus sessions (newest first), events in time order.
export function timeline(db, anon, { limit = 1000 } = {}) {
  const all = { from: 0, to: Number.MAX_SAFE_INTEGER };
  const head = db.prepare(`${PERSON_SQL} AND anon = ? GROUP BY anon`).get(all.from, all.to, anon);
  if (!head) return null;
  const rows = db.prepare(`SELECT ts, name, path, platform, props, session FROM events WHERE ${SHOPPER} AND anon = ? ORDER BY ts DESC, id DESC LIMIT ?`)
    .all(anon, limit).reverse();
  const sessions = new Map();
  for (const r of rows) {
    const id = r.session || '(no session)';
    if (!sessions.has(id)) sessions.set(id, { id, start: r.ts, end: r.ts, events: [] });
    const s = sessions.get(id);
    s.end = r.ts;
    s.events.push({ ts: r.ts, name: r.name, path: r.path, platform: r.platform, props: JSON.parse(r.props || '{}') });
  }
  return { summary: personRow(db, head, all.from, all.to), sessions: [...sessions.values()].sort((a, b) => b.start - a.start) };
}
