// First-party event pipeline. The app and the seller dashboard POST batches to /api/events;
// each event is stored in SQLite (so the Admin tab always has numbers) and forwarded to:
//   - Umami   (UMAMI_URL + UMAMI_WEBSITE_ID): page views and named events, privacy-friendly traffic
//   - PostHog (POSTHOG_KEY [+ POSTHOG_HOST]): every event with its properties, for funnels,
//     retention, paths and per-user timelines
// Either can be left unset; nothing breaks. Changing them needs no app rebuild.

const POSTHOG_KEY = process.env.POSTHOG_KEY || '';
const POSTHOG_HOST = (process.env.POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');
const UMAMI_URL = (process.env.UMAMI_URL || '').replace(/\/$/, '');
const UMAMI_SITE = process.env.UMAMI_WEBSITE_ID || '';

export const analyticsStatus = () => ({ posthog: !!POSTHOG_KEY, umami: !!(UMAMI_URL && UMAMI_SITE), posthogHost: POSTHOG_KEY ? POSTHOG_HOST : null, umamiUrl: UMAMI_URL || null });

export const EVENTS_SCHEMA = `
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, name TEXT NOT NULL, anon TEXT, session TEXT,
  source TEXT, platform TEXT, path TEXT, props TEXT
);
CREATE INDEX IF NOT EXISTS events_ts ON events(ts);
CREATE INDEX IF NOT EXISTS events_name_ts ON events(name, ts);
CREATE INDEX IF NOT EXISTS events_anon_ts ON events(anon, ts);
`;

const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
const NAME = /^[a-z][a-z0-9_]{1,47}$/;

// Keep props small and flat: strings, numbers, booleans only. Drop anything that looks like an email.
function cleanProps(p) {
  const out = {};
  if (!p || typeof p !== 'object') return out;
  for (const [k, v] of Object.entries(p).slice(0, 25)) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(k)) continue;
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (typeof v === 'string' && !/@[^\s@]+\.[^\s@]+/.test(v)) out[k] = v.slice(0, 200);
  }
  return out;
}

// Crude per-IP limit so one client can't flood the table: 600 events a minute.
const buckets = new Map();
function allow(ip, n) {
  const now = Date.now(); const b = buckets.get(ip) ?? { at: now, n: 0 };
  if (now - b.at > 60_000) { b.at = now; b.n = 0; }
  b.n += n; buckets.set(ip, b);
  if (buckets.size > 5000) buckets.clear();
  return b.n <= 600;
}

const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

export function ingest(db, req, body) {
  const list = Array.isArray(body?.events) ? body.events.slice(0, 50) : [];
  const ip = clientIp(req);
  if (!list.length || !allow(ip, list.length)) return { ok: true, stored: 0 };
  const now = Date.now();
  const rows = [];
  for (const e of list) {
    if (!NAME.test(e?.name ?? '')) continue;
    const ts = Number.isFinite(e.ts) && Math.abs(now - e.ts) < 7 * 864e5 ? Math.round(e.ts) : now;
    rows.push({
      ts, name: e.name, anon: clip(e.anon, 64), session: clip(e.session, 64),
      source: e.source === 'seller' ? 'seller' : 'app', platform: clip(e.platform, 16), path: clip(e.path, 300),
      props: cleanProps(e.props), title: clip(e.title, 120), referrer: clip(e.referrer, 300), screen: clip(e.screen, 20), language: clip(e.language, 20),
    });
  }
  const ins = db.prepare('INSERT INTO events (ts, name, anon, session, source, platform, path, props) VALUES (?,?,?,?,?,?,?,?)');
  db.exec('BEGIN');
  for (const r of rows) ins.run(r.ts, r.name, r.anon, r.session, r.source, r.platform, r.path, JSON.stringify(r.props));
  db.exec('COMMIT');
  forward(rows, req, ip); // fire and forget
  return { ok: true, stored: rows.length };
}

function forward(rows, req, ip) {
  if (!rows.length) return;
  const ua = String(req.headers['user-agent'] || 'Shelby');
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'shelby');
  const origin = `https://${host}`;
  if (POSTHOG_KEY) {
    const batch = rows.map(r => ({
      event: r.name === 'screen_view' ? (r.platform === 'web' || r.source === 'seller' ? '$pageview' : '$screen') : r.name,
      distinct_id: r.anon || 'anonymous', timestamp: new Date(r.ts).toISOString(),
      properties: {
        ...r.props, $session_id: r.session || undefined, $current_url: origin + r.path, $pathname: r.path, $screen_name: r.path,
        $referrer: r.referrer || undefined, $ip: ip, $lib: `shelby-${r.source}`, platform: r.platform, source: r.source,
        $raw_user_agent: ua,
      },
    }));
    fetch(`${POSTHOG_HOST}/batch/`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ api_key: POSTHOG_KEY, batch }) })
      .catch(e => console.warn('posthog forward failed', e.message));
  }
  if (UMAMI_URL && UMAMI_SITE) {
    for (const r of rows) {
      const isView = r.name === 'screen_view';
      const payload = {
        website: UMAMI_SITE, hostname: host, url: r.path || '/', title: r.title || undefined, referrer: r.referrer || undefined,
        language: r.language || undefined, screen: r.screen || undefined, ...(isView ? {} : { name: r.name, data: r.props }),
      };
      fetch(`${UMAMI_URL}/api/send`, {
        method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': ua, 'x-forwarded-for': ip },
        body: JSON.stringify({ type: 'event', payload }),
      }).catch(e => console.warn('umami forward failed', e.message));
    }
  }
}

// Admin report: what people did over the last N days.
export function report(db, days = 7) {
  const since = Date.now() - days * 864e5;
  const one = (sql, ...a) => db.prepare(sql).get(since, ...a);
  const all = (sql, ...a) => db.prepare(sql).all(since, ...a);
  const users = name => one('SELECT COUNT(DISTINCT anon) n FROM events WHERE ts > ? AND name = ? AND source = \'app\'', name).n;
  return {
    days, connected: analyticsStatus(),
    totals: one("SELECT COUNT(*) events, COUNT(DISTINCT anon) visitors, COUNT(DISTINCT session) sessions FROM events WHERE ts > ? AND source = 'app'"),
    // Shopper funnel, counted as unique visitors who reached each step.
    funnel: [
      ['Opened the app', users('app_open')], ['Viewed a product', users('product_view')], ['Added to cart', users('add_to_cart')],
      ['Started checkout', users('checkout_start')], ['Placed an order', users('order_placed')],
    ].map(([step, n]) => ({ step, n })),
    daily: all("SELECT strftime('%Y-%m-%d', ts / 1000, 'unixepoch') day, COUNT(DISTINCT anon) visitors, COUNT(*) events FROM events WHERE ts > ? AND source = 'app' GROUP BY day ORDER BY day"),
    topEvents: all('SELECT name, source, COUNT(*) n, COUNT(DISTINCT anon) people FROM events WHERE ts > ? GROUP BY name, source ORDER BY n DESC LIMIT 25'),
    topScreens: all("SELECT path, COUNT(*) n FROM events WHERE ts > ? AND name = 'screen_view' AND source = 'app' GROUP BY path ORDER BY n DESC LIMIT 15"),
    topSearches: all("SELECT LOWER(json_extract(props, '$.query')) q, COUNT(*) n FROM events WHERE ts > ? AND name IN ('search', 'ask_shelby') GROUP BY q ORDER BY n DESC LIMIT 15"),
    topProducts: all("SELECT json_extract(props, '$.product_id') pid, MAX(json_extract(props, '$.title')) title, COUNT(*) views FROM events WHERE ts > ? AND name = 'product_view' GROUP BY pid ORDER BY views DESC LIMIT 10"),
    platforms: all("SELECT platform, COUNT(DISTINCT anon) people FROM events WHERE ts > ? AND source = 'app' GROUP BY platform"),
    recent: db.prepare("SELECT ts, name, source, platform, path, props, substr(anon, 1, 8) anon FROM events ORDER BY id DESC LIMIT 40").all(),
  };
}

// ---------- real social proof and verified reviews ----------
// Every number a shopper sees comes from here: counted from real events, never generated.
export const PROOF_SCHEMA = `
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL, rating INTEGER NOT NULL, text TEXT, name TEXT,
  order_id TEXT, anon TEXT, verified INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS reviews_product ON reviews(product_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS reviews_once ON reviews(product_id, anon);
`;

const DAY = 864e5;
export function productProof(db, productId) {
  const now = Date.now();
  const q = (sql, ...a) => db.prepare(sql).get(...a).n;
  return {
    addedToday: q("SELECT COUNT(DISTINCT anon) n FROM events WHERE name = 'add_to_cart' AND source = 'app' AND ts > ? AND json_extract(props, '$.product_id') = ?", now - DAY, productId),
    ordered30: q("SELECT COALESCE(SUM(json_extract(props, '$.qty')), 0) n FROM events WHERE name = 'purchase_item' AND source = 'app' AND ts > ? AND json_extract(props, '$.product_id') = ?", now - 30 * DAY, productId),
  };
}
// People whose latest reminder action for a drop is "on".
export function dropReminders(db) {
  const rows = db.prepare(`SELECT json_extract(props, '$.drop_id') drop_id, anon, json_extract(props, '$.on') on_ FROM events
    WHERE name = 'drop_reminder_toggle' AND source = 'app' ORDER BY ts`).all();
  const last = new Map(); for (const r of rows) last.set(`${r.drop_id}|${r.anon}`, r);
  const out = {}; for (const r of last.values()) if (r.on_) out[r.drop_id] = (out[r.drop_id] || 0) + 1;
  return out;
}
export function listReviews(db, productId) {
  const rows = db.prepare('SELECT rating, text, name, verified, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 50').all(productId);
  const agg = db.prepare('SELECT COUNT(*) n, AVG(rating) avg FROM reviews WHERE product_id = ?').get(productId);
  return { count: agg.n, average: agg.n ? Math.round(agg.avg * 10) / 10 : null, reviews: rows.map(r => ({ ...r, verified: !!r.verified })) };
}
// A review is "verified" when this device placed an order that included the product.
export function addReview(db, b) {
  const rating = Math.round(Number(b.rating));
  if (!(rating >= 1 && rating <= 5)) throw Object.assign(new Error('Pick 1 to 5 stars'), { code: 400 });
  const productId = String(b.productId || '').slice(0, 80), anon = String(b.anon || '').slice(0, 64), orderId = String(b.orderId || '').slice(0, 80);
  if (!productId || !anon) throw Object.assign(new Error('Missing product'), { code: 400 });
  const verified = !!db.prepare("SELECT 1 FROM events WHERE name = 'purchase_item' AND anon = ? AND json_extract(props, '$.product_id') = ? LIMIT 1").get(anon, productId);
  const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 600);
  const name = String(b.name || '').replace(/@/g, '').trim().slice(0, 40) || 'Shelby shopper';
  db.prepare(`INSERT INTO reviews (product_id, rating, text, name, order_id, anon, verified, created_at) VALUES (?,?,?,?,?,?,?,?)
    ON CONFLICT(product_id, anon) DO UPDATE SET rating = excluded.rating, text = excluded.text, name = excluded.name, created_at = excluded.created_at`)
    .run(productId, rating, text, name, orderId, anon, verified ? 1 : 0, Date.now());
  return { ok: true, verified };
}
