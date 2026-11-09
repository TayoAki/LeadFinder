// Reads over the ads table. Definitions (see README "How we count"):
//   run days   = (end date, or today if still live) − start date. Ads with no start date are left out.
//   kept       = still running and live 30+ days         testing = still running, under 30 days
//   killed     = stopped inside 30 days                  retired = ran 30+ days, then stopped
//   new        = start date inside the window (the Ad Library start date, so it is a real launch date)
// Run length shows an ad lasted, not that it made money. Results are a sample of each rival's ads.
import { getDb } from './db.mjs';
import { FORMAT_LABEL, ANGLES, angleLabel } from './classify.mjs';

export const KEPT_DAYS = 30;
const DAY = 86400000;
const iso = d => d.toISOString().slice(0, 10);

export function today(db = getDb()) {
  // Anchor "today" to the newest date in the data so a stale snapshot still reads sensibly.
  const r = db.prepare("SELECT MAX(COALESCE(end_date, start_date)) AS d FROM ads").get();
  const now = iso(new Date());
  return r?.d && r.d < now ? r.d : now;
}

const daysBetween = (a, b) => Math.max(0, Math.round((Date.parse(b) - Date.parse(a)) / DAY));

export function enrich(ad, t) {
  if (!ad.start_date) return { ...ad, run_days: null, pile: null };
  const end = ad.is_active ? t : (ad.end_date || t);
  const run_days = daysBetween(ad.start_date, end);
  const pile = ad.is_active ? (run_days >= KEPT_DAYS ? 'kept' : 'testing') : (run_days >= KEPT_DAYS ? 'retired' : 'killed');
  return { ...ad, run_days, pile, format_label: FORMAT_LABEL[ad.format] || ad.format, angle_label: angleLabel(ad.angle) };
}

export function loadAds(db = getDb(), { rivalId } = {}) {
  const t = today(db);
  const rows = db.prepare(`SELECT a.*, r.name AS rival_name, r.avatar_url AS rival_avatar FROM ads a JOIN rivals r ON r.id = a.rival_id
    ${rivalId ? 'WHERE a.rival_id = ?' : ''}`).all(...(rivalId ? [rivalId] : []));
  return { t, ads: rows.map(a => enrich(a, t)).filter(a => a.run_days !== null) };
}

const within = (date, t, days) => date && Date.parse(t) - Date.parse(date) <= days * DAY && Date.parse(date) <= Date.parse(t);
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const median = xs => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
const confidence = n => (n < 3 ? 'describe-only' : n < 10 ? 'thin' : 'ok');

/** Kaplan–Meier survival. Still-running ads are censored (we know they lasted at least this long). */
export function survival(ads, checkpoints = [1, 7, 30, 90, 180]) {
  const n = ads.length;
  if (!n) return { n: 0, curve: [], median: null, at: {} };
  const times = [...new Set(ads.filter(a => !a.is_active).map(a => a.run_days))].sort((a, b) => a - b);
  let s = 1;
  const steps = [{ day: 0, s: 1 }];
  for (const tm of times) {
    const atRisk = ads.filter(a => a.run_days >= tm).length;
    const died = ads.filter(a => !a.is_active && a.run_days === tm).length;
    if (atRisk) { s *= 1 - died / atRisk; steps.push({ day: tm, s }); }
  }
  const sAt = d => { let v = 1; for (const st of steps) { if (st.day <= d) v = st.s; else break; } return v; };
  const med = steps.find(st => st.s <= 0.5)?.day ?? null;
  const maxDay = Math.max(...ads.map(a => a.run_days), 1);
  const grid = [0, 1, 3, 7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 240, 300, 365].filter(d => d <= Math.max(maxDay, 30));
  return {
    n, median: med,
    curve: grid.map(d => ({ day: d, pct: Math.round(sAt(d) * 100) })),
    at: Object.fromEntries(checkpoints.map(d => [d, Math.round(sAt(d) * 100)])),
    confidence: confidence(n),
  };
}

export function overview(db = getDb()) {
  const { t, ads } = loadAds(db);
  const rivals = db.prepare('SELECT * FROM rivals ORDER BY name').all();
  const run = db.prepare('SELECT * FROM runs WHERE finished_at IS NOT NULL ORDER BY id DESC LIMIT 1').get();
  const killed7 = ads.filter(a => !a.is_active && within(a.end_date, t, 7));
  return {
    today: t,
    rivals: rivals.length,
    counted: ads.length,
    running: ads.filter(a => a.is_active).length,
    killed7: killed7.filter(a => a.pile === 'killed').length,
    retired7: killed7.filter(a => a.pile === 'retired').length,
    new7: ads.filter(a => within(a.start_date, t, 7)).length,
    kept: ads.filter(a => a.pile === 'kept').length,
    last_run: run || null,
  };
}

/** Per rival: their longest-running live ad, and the format their kept ads bet on. */
export function rivalKeeps(db = getDb()) {
  const { ads } = loadAds(db);
  const rivals = db.prepare('SELECT * FROM rivals ORDER BY name').all();
  return rivals.map(r => {
    const mine = ads.filter(a => a.rival_id === r.id);
    const live = mine.filter(a => a.is_active).sort((a, b) => b.run_days - a.run_days);
    const longest = live[0] || [...mine].sort((a, b) => b.run_days - a.run_days)[0] || null;
    const kept = mine.filter(a => a.pile === 'kept');
    const byFmt = countBy(kept, a => a.format);
    const bet = Object.entries(byFmt).sort((a, b) => b[1] - a[1])[0];
    return {
      rival: r, counted: mine.length, running: live.length, kept: kept.length,
      longest, keeps_format: bet ? bet[0] : null, keeps_format_label: bet ? FORMAT_LABEL[bet[0]] : null,
      keeps_share: bet ? pct(bet[1], kept.length) : 0,
    };
  });
}

/** Which formats rivals keep paying for, and which they kill, over the last 4 weeks. */
export function formatLeague(db = getDb(), windowDays = 28) {
  const { t, ads } = loadAds(db);
  const inWindow = ads.filter(a => a.is_active || within(a.end_date, t, windowDays) || within(a.start_date, t, windowDays));
  const overall = pct(inWindow.filter(a => a.is_active).length, inWindow.length);
  const rows = Object.entries(groupBy(inWindow, a => a.format)).map(([fmt, list]) => {
    const running = list.filter(a => a.is_active).length;
    const share = pct(running, list.length);
    const surv = survival(ads.filter(a => a.format === fmt));
    return {
      format: fmt, label: FORMAT_LABEL[fmt] || fmt, n: list.length, running, share,
      killed: list.filter(a => !a.is_active && within(a.end_date, t, windowDays) && a.pile === 'killed').length,
      retired: list.filter(a => !a.is_active && within(a.end_date, t, windowDays) && a.pile === 'retired').length,
      new: list.filter(a => within(a.start_date, t, windowDays)).length,
      temp: share >= overall ? 'hot' : 'cold',
      median_days: surv.median, top_runs: list.filter(a => a.is_active).map(a => a.run_days).sort((a, b) => b - a).slice(0, 3),
      confidence: confidence(list.length),
    };
  }).sort((a, b) => b.share - a.share || b.n - a.n);
  return { window_days: windowDays, counted: inWindow.length, overall_share: overall, rows, ranked: inWindow.length >= 10 };
}

export function formatSurvival(db = getDb()) {
  const { ads } = loadAds(db);
  return Object.entries(groupBy(ads, a => a.format)).map(([fmt, list]) => ({ format: fmt, label: FORMAT_LABEL[fmt] || fmt, ...survival(list) }))
    .sort((a, b) => b.n - a.n);
}

const normHook = h => (h || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 8).join(' ');

/** Opening lines ranked by how long the ad they open has run. Patterns = the same opening across 2+ brands. */
export function hooksThatLasted(db = getDb(), { limit = 12, rivalId, perRival = 2 } = {}) {
  const { ads } = loadAds(db, { rivalId });
  const seen = new Set();
  const out = [];
  const perR = {};
  for (const a of ads.filter(a => a.hook && a.run_days >= KEPT_DAYS).sort((x, y) => y.run_days - x.run_days)) {
    const k = normHook(a.hook);
    if (seen.has(k)) continue;
    if (!rivalId && (perR[a.rival_id] || 0) >= perRival) continue;
    seen.add(k);
    perR[a.rival_id] = (perR[a.rival_id] || 0) + 1;
    out.push({ ad: a, hook: a.hook, source: a.hook_source, run_days: a.run_days, still_running: !!a.is_active, rival: a.rival_name, angle: a.angle, angle_label: a.angle_label, format_label: a.format_label });
    if (out.length >= limit) break;
  }
  return out;
}

/** Angles by temperature: how many rivals run each angle right now. Cold/open = say it first. */
export function angleTemperature(db = getDb()) {
  const { t, ads } = loadAds(db);
  const recent = ads.filter(a => a.is_active || within(a.end_date, t, 90));
  return [...ANGLES.map(a => a.key), 'other'].map(key => {
    const list = recent.filter(a => a.angle === key);
    const live = list.filter(a => a.is_active);
    const rivalsRunning = new Set(live.map(a => a.rival_id)).size;
    const tried = list.filter(a => !a.is_active).length;
    let temp, label;
    if (!live.length && !tried) { temp = 'open'; label = 'Open ground'; }
    else if (!live.length) { temp = 'cooling'; label = 'Burning out'; }
    else if (rivalsRunning >= 3) { temp = 'crowded'; label = 'Crowded'; }
    else { temp = 'warm'; label = 'Warm'; }
    const best = [...list].sort((a, b) => b.run_days - a.run_days)[0] || null;
    return { angle: key, label: angleLabel(key), temp, temp_label: label, running: live.length, rivals_running: rivalsRunning, tried, kept: list.filter(a => a.pile === 'kept').length, best };
  }).filter(r => r.angle !== 'other');
}

/** One rival's playbook: what they keep, what they tested and dropped, what they're testing now. */
export function playbook(db = getDb(), rivalId) {
  const rival = db.prepare('SELECT * FROM rivals WHERE id = ?').get(rivalId);
  if (!rival) return null;
  const { t, ads } = loadAds(db, { rivalId });
  const by = p => ads.filter(a => a.pile === p).sort((a, b) => b.run_days - a.run_days);
  const kept = by('kept'), retired = by('retired'), killed = by('killed');
  const testing = ads.filter(a => a.pile === 'testing').sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''));
  const signature = kept[0] || retired[0] || null;
  const formats = Object.entries(groupBy(ads, a => a.format)).map(([fmt, list]) => ({
    format: fmt, label: FORMAT_LABEL[fmt] || fmt, n: list.length,
    kept: list.filter(a => a.pile === 'kept').length, killed: list.filter(a => a.pile === 'killed').length,
    ...(s => ({ median_days: s.median, live_at_30: s.at[30], live_at_90: s.at[90] }))(survival(list)), confidence: confidence(list.length),
  })).sort((a, b) => b.n - a.n);
  const angles = Object.entries(countBy(kept, a => a.angle)).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ angle: k, label: angleLabel(k), n }));
  return {
    rival, today: t, counted: ads.length, signature, kept: kept.slice(0, 12), retired: retired.slice(0, 8), killed: killed.slice(0, 8),
    testing: testing.slice(0, 8), formats, angles, summary: summarise(rival, { kept, killed, formats, angles, ads }),
    hooks: hooksThatLasted(db, { rivalId, limit: 6 }),
  };
}

function summarise(rival, { kept, killed, formats, angles, ads }) {
  if (ads.length < 3) return `Only ${ads.length} ads counted for ${rival.name}, too few to read a pattern.`;
  const parts = [];
  const topAngle = angles[0];
  if (topAngle && kept.length) parts.push(`${rival.name} keeps leaning on ${topAngle.label.toLowerCase()} (${topAngle.n} of ${kept.length} kept ads).`);
  const bet = [...formats].filter(f => f.n >= 3).sort((a, b) => b.live_at_30 - a.live_at_30)[0];
  if (bet && formats.filter(f => f.n >= 3).length > 1) parts.push(`${bet.label} ads last longest for them: ${bet.live_at_30}% are still live at day 30.`);
  else if (bet) parts.push(`${bet.live_at_30}% of their ${bet.label.toLowerCase()} ads are still live at day 30.`);
  const cut = formats.filter(f => f.n >= 3 && f.killed / f.n >= 0.4)[0];
  if (cut) parts.push(`They test and cut a lot of ${cut.label.toLowerCase()} ads (${cut.killed} of ${cut.n} stopped inside 30 days).`);
  if (!parts.length) parts.push(`${rival.name}: ${kept.length} ads kept past 30 days out of ${ads.length} counted.`);
  return parts.join(' ');
}

export function listAds(db = getDb(), { rivalId, format, pile, angle, minDays, q, limit = 60, sort = 'run' } = {}) {
  let { ads } = loadAds(db, { rivalId });
  if (format) ads = ads.filter(a => a.format === format);
  if (pile) ads = ads.filter(a => a.pile === pile);
  if (angle) ads = ads.filter(a => a.angle === angle);
  if (minDays) ads = ads.filter(a => a.run_days >= Number(minDays));
  if (q) { const s = q.toLowerCase(); ads = ads.filter(a => [a.hook, a.body, a.title, a.rival_name].join(' ').toLowerCase().includes(s)); }
  ads.sort(sort === 'new' ? (a, b) => (b.start_date || '').localeCompare(a.start_date || '') : (a, b) => b.run_days - a.run_days);
  return ads.slice(0, Number(limit));
}

export function getAd(db = getDb(), id) {
  const t = today(db);
  const a = db.prepare('SELECT a.*, r.name AS rival_name, r.avatar_url AS rival_avatar FROM ads a JOIN rivals r ON r.id = a.rival_id WHERE a.id = ?').get(String(id));
  return a ? enrich(a, t) : null;
}

function groupBy(xs, f) { const m = {}; for (const x of xs) (m[f(x)] ||= []).push(x); return m; }
function countBy(xs, f) { const m = {}; for (const x of xs) m[f(x)] = (m[f(x)] || 0) + 1; return m; }
