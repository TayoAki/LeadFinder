// Shelby API + seller dashboard + the app's web build, in one Node process (no dependencies).
//   /api/*      JSON API (public catalogue, orders, seller and admin endpoints)
//   /seller/*   seller dashboard (server/web)
//   /uploads/*  product photos stored on the volume
//   /*          the Expo web export (dist/), single-page fallback
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync, writeFileSync } from 'node:fs';
import { extname, resolve, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { getDb, id, shopOut, productOut, UPLOAD_DIR } from './db.mjs';
import { EVENTS_SCHEMA, ingest, report } from './analytics.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const WEB = resolve(here, 'web');
const APP = resolve(here, '..', 'dist');
const PORT = Number(process.env.PORT || 3200);
const SETUP_CODE = process.env.ADMIN_SETUP_CODE || ''; // entering it at sign-up makes that account a platform admin
const PROD = process.env.NODE_ENV === 'production';
const db = getDb();
db.exec(EVENTS_SCHEMA);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.map': 'application/json' };
const CATEGORIES = ['Home', 'Beauty', 'Women', 'Men', 'Shoes', 'Bags', 'Jewelry', 'Accessories', 'Outdoors'];

const send = (res, code, body, headers = {}) => {
  const json = typeof body !== 'string';
  res.writeHead(code, { 'content-type': json ? 'application/json' : 'text/plain; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(json ? JSON.stringify(body) : body);
};
class HttpError extends Error { constructor(code, msg) { super(msg); this.code = code; } }
const fail = (code, msg) => { throw new HttpError(code, msg); };

function serveFile(res, root, path, cache = 'public, max-age=300') {
  const file = normalize(resolve(root, '.' + decodeURIComponent(path)));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) return false;
  res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': cache });
  createReadStream(file).pipe(res);
  return true;
}

const readBody = (req, max = 12 * 1024 * 1024) => new Promise((ok, bad) => {
  const parts = []; let n = 0;
  req.on('data', c => { n += c.length; if (n > max) { bad(new HttpError(413, 'Too large')); req.destroy(); } else parts.push(c); });
  req.on('end', () => { try { ok(parts.length ? JSON.parse(Buffer.concat(parts).toString()) : {}); } catch { bad(new HttpError(400, 'Bad JSON')); } });
  req.on('error', bad);
});

// ---------- auth: scrypt passwords + opaque session tokens in an httpOnly cookie ----------
const hash = pw => { const salt = randomBytes(16); return `${salt.toString('hex')}:${scryptSync(pw, salt, 32).toString('hex')}`; };
const verify = (pw, stored) => { const [s, h] = stored.split(':'); const a = scryptSync(pw, Buffer.from(s, 'hex'), 32); return timingSafeEqual(a, Buffer.from(h, 'hex')); };
const cookie = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(x => x[0]));
function startSession(res, userId) {
  const token = randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)').run(token, userId, Date.now() + 30 * 864e5);
  res.setHeader('set-cookie', `shelby_s=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 86400}${PROD ? '; Secure' : ''}`);
}
function currentUser(req) {
  const t = cookie(req).shelby_s; if (!t) return null;
  const row = db.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > ?').get(t, Date.now());
  return row || null;
}
const me = u => ({ id: u.id, email: u.email, name: u.name, role: u.role });
const myShop = u => db.prepare('SELECT * FROM shops WHERE owner_id = ?').get(u.id);

// ---------- validation ----------
const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v, lo = 0, hi = 1e6) => { const n = Number(v); return Number.isFinite(n) && n >= lo && n <= hi ? Math.round(n * 100) / 100 : null; };
const imgUrl = v => (typeof v === 'string' && (v.startsWith('/uploads/') || /^https:\/\//.test(v)) ? v.slice(0, 500) : null);

function productInput(b) {
  const title = str(b.title, 120); if (!title) fail(400, 'Add a title');
  const price = num(b.price, 0.5, 100000); if (price == null) fail(400, 'Price must be at least $0.50');
  const compare = b.compareAt === '' || b.compareAt == null ? null : num(b.compareAt, 0, 100000);
  if (compare != null && compare <= price) fail(400, 'Compare-at price must be higher than the price');
  const stock = Math.max(0, Math.min(100000, Math.floor(Number(b.stock) || 0)));
  const images = (Array.isArray(b.images) ? b.images : []).map(imgUrl).filter(Boolean).slice(0, 8);
  const sizes = (Array.isArray(b.sizes) ? b.sizes : []).map(s => str(s, 12)).filter(Boolean).slice(0, 12);
  const category = CATEGORIES.includes(b.category) ? b.category : 'Home';
  const status = b.status === 'live' ? 'live' : 'draft';
  if (status === 'live' && !images.length) fail(400, 'Add at least one photo before publishing');
  return { title, description: str(b.description, 4000), category, price, compare, stock, images: JSON.stringify(images), sizes: JSON.stringify(sizes), status };
}

// Data-URL image upload (the dashboard resizes in the browser first). Checks magic bytes, max 6 MB.
function saveImage(dataUrl) {
  const m = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(dataUrl || ''); if (!m) fail(400, 'Use a PNG, JPEG or WebP image');
  const buf = Buffer.from(m[2], 'base64'); if (buf.length > 6 * 1024 * 1024) fail(413, 'Image over 6 MB');
  const sig = buf.subarray(0, 12).toString('hex');
  const ok = sig.startsWith('89504e47') || sig.startsWith('ffd8ff') || (sig.startsWith('52494646') && buf.subarray(8, 12).toString() === 'WEBP');
  if (!ok) fail(400, 'That file is not an image');
  const name = `${id()}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
  writeFileSync(resolve(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}

// ---------- order placement: server recomputes prices, shipping and stock ----------
function placeOrder(b) {
  const lines = Array.isArray(b.lines) ? b.lines.slice(0, 50) : [];
  if (!lines.length) fail(400, 'Cart is empty');
  const getP = db.prepare("SELECT p.*, s.shipping s_ship, s.free_over s_free, s.status s_status FROM products p JOIN shops s ON s.id = p.shop_id WHERE p.id = ?");
  const byShop = {};
  for (const l of lines) {
    const p = getP.get(String(l.productId)); const qty = Math.max(1, Math.floor(Number(l.qty) || 1));
    if (!p || p.status !== 'live' || p.s_status !== 'approved') fail(409, 'An item in your cart is no longer available');
    if (p.stock < qty) fail(409, `Only ${p.stock} left of ${p.title}`);
    (byShop[p.shop_id] ||= { lines: [], ship: p.s_ship, free: p.s_free }).lines.push({ p, qty, size: str(l.size, 12) || null });
  }
  const purchaseId = String(Math.floor(100000 + Math.random() * 899999));
  let items = 0, shipping = 0;
  db.exec('BEGIN');
  try {
    const sos = [];
    for (const [shopId, g] of Object.entries(byShop)) {
      const subtotal = g.lines.reduce((n, x) => n + x.p.price * x.qty, 0);
      const ship = subtotal >= g.free ? 0 : g.ship;
      items += subtotal; shipping += ship;
      sos.push({ soId: id('so_'), shopId, subtotal, ship, lines: g.lines });
    }
    const tax = Math.round(items * 0.0725 * 100) / 100;
    const discount = Math.min(num(b.discount, 0, 1000) ?? 0, items + shipping);
    const total = Math.round((items + shipping + tax - discount) * 100) / 100;
    db.prepare('INSERT INTO purchases (id, buyer_email, buyer_name, address, total, discount, tax, ref) VALUES (?,?,?,?,?,?,?,?)')
      .run(purchaseId, str(b.email, 200), str(b.name, 100), str(b.address, 300), total, discount, tax, str(b.ref, 40));
    const insSO = db.prepare('INSERT INTO seller_orders (id, purchase_id, shop_id, subtotal, shipping) VALUES (?,?,?,?,?)');
    const insL = db.prepare('INSERT INTO order_lines (seller_order_id, product_id, title, image, price, size, qty) VALUES (?,?,?,?,?,?,?)');
    const dec = db.prepare('UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ? AND stock >= ?');
    for (const so of sos) {
      insSO.run(so.soId, purchaseId, so.shopId, so.subtotal, so.ship);
      for (const x of so.lines) {
        if (!dec.run(x.qty, x.qty, x.p.id, x.qty).changes) fail(409, `Only ${x.p.stock} left of ${x.p.title}`);
        insL.run(so.soId, x.p.id, x.p.title, JSON.parse(x.p.images)[0] ?? '', x.p.price, x.size, x.qty);
      }
    }
    db.exec('COMMIT');
    return { id: purchaseId, total, tax, discount, sellerOrders: sos.map(s => ({ id: s.soId, shopId: s.shopId, subtotal: s.subtotal, shipping: s.ship })) };
  } catch (e) { db.exec('ROLLBACK'); throw e; }
}

function sellerOrders(shopId) {
  const sos = db.prepare(`SELECT so.*, p.buyer_name, p.buyer_email, p.address, p.created_at placed FROM seller_orders so JOIN purchases p ON p.id = so.purchase_id
    WHERE so.shop_id = ? ORDER BY so.created_at DESC LIMIT 200`).all(shopId);
  const ln = db.prepare('SELECT * FROM order_lines WHERE seller_order_id = ?');
  return sos.map(o => ({ ...o, lines: ln.all(o.id) }));
}

// ---------- routes ----------
const routes = {
  'GET /api/health': () => ({ ok: true }),
  'GET /api/catalog': () => ({
    shops: db.prepare("SELECT * FROM shops WHERE status = 'approved' ORDER BY created_at").all().map(shopOut),
    products: db.prepare("SELECT p.* FROM products p JOIN shops s ON s.id = p.shop_id WHERE p.status = 'live' AND s.status = 'approved' ORDER BY p.created_at DESC").all().map(productOut),
  }),
  'POST /api/orders': ({ body, req }) => {
    const r = placeOrder(body);
    // Server-side truth for the funnel, even if the client's own event is lost.
    ingest(db, req, { events: [{ name: 'order_confirmed', anon: String(body.anon || ''), session: String(body.session || ''), platform: String(body.platform || ''), path: '/checkout', props: { order_id: r.id, total: r.total, sellers: r.sellerOrders.length, ref: body.ref ? 'yes' : 'no' } }] });
    return r;
  },
  'POST /api/events': ({ body, req }) => ingest(db, req, body),

  'POST /api/auth/signup': ({ body, res }) => {
    const email = str(body.email, 200).toLowerCase(); const pw = typeof body.password === 'string' ? body.password : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid email');
    if (pw.length < 8) fail(400, 'Use at least 8 characters for your password');
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) fail(409, 'That email already has an account. Log in instead.');
    const role = SETUP_CODE && body.setupCode && body.setupCode === SETUP_CODE ? 'admin' : 'seller';
    const uid = id('u_');
    db.prepare('INSERT INTO users (id, email, name, pass, role) VALUES (?,?,?,?,?)').run(uid, email, str(body.name, 100), hash(pw), role);
    startSession(res, uid);
    return { user: me(db.prepare('SELECT * FROM users WHERE id = ?').get(uid)) };
  },
  'POST /api/auth/login': ({ body, res }) => {
    const u = db.prepare('SELECT * FROM users WHERE email = ?').get(str(body.email, 200).toLowerCase());
    if (!u || !verify(String(body.password || ''), u.pass)) fail(401, 'Email or password is wrong');
    startSession(res, u.id);
    return { user: me(u) };
  },
  'POST /api/auth/logout': ({ req, res }) => {
    const t = cookie(req).shelby_s; if (t) db.prepare('DELETE FROM sessions WHERE token = ?').run(t);
    res.setHeader('set-cookie', 'shelby_s=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return { ok: true };
  },
  'GET /api/me': ({ user }) => ({ user: user && me(user), shop: user && myShop(user) ? shopOut(myShop(user)) : null }),

  // seller
  'POST /api/seller/shop': ({ user, body }) => {
    const name = str(body.name, 60); if (!name) fail(400, 'Give your shop a name');
    const f = { name, tagline: str(body.tagline, 120), category: CATEGORIES.includes(body.category) ? body.category : 'Home', logo: imgUrl(body.logo), banner: imgUrl(body.banner),
      ships_in: str(body.shipsIn, 30) || '2–3 days', shipping: num(body.shipping, 0, 500) ?? 5.95, free_over: num(body.freeOver, 0, 10000) ?? 50,
      return_days: Math.max(0, Math.min(365, Math.floor(Number(body.returnDays) || 30))), links: str(body.links, 300) };
    const s = myShop(user);
    if (s) db.prepare('UPDATE shops SET name=?, tagline=?, category=?, logo=COALESCE(?, logo), banner=COALESCE(?, banner), ships_in=?, shipping=?, free_over=?, return_days=?, links=? WHERE id=?')
      .run(f.name, f.tagline, f.category, f.logo, f.banner, f.ships_in, f.shipping, f.free_over, f.return_days, f.links, s.id);
    else db.prepare('INSERT INTO shops (id, owner_id, name, tagline, category, logo, banner, ships_in, shipping, free_over, return_days, links, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .run(id('shop_'), user.id, f.name, f.tagline, f.category, f.logo, f.banner, f.ships_in, f.shipping, f.free_over, f.return_days, f.links, user.role === 'admin' ? 'approved' : 'pending');
    return { shop: shopOut(myShop(user)) };
  },
  'GET /api/seller/products': ({ shop }) => db.prepare('SELECT * FROM products WHERE shop_id = ? ORDER BY updated_at DESC').all(shop.id).map(productOut),
  'POST /api/seller/products': ({ shop, body }) => {
    const v = productInput(body); const pid = id('p_');
    db.prepare('INSERT INTO products (id, shop_id, title, description, category, price, compare_at, images, sizes, stock, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
      .run(pid, shop.id, v.title, v.description, v.category, v.price, v.compare, v.images, v.sizes, v.stock, v.status);
    return productOut(db.prepare('SELECT * FROM products WHERE id = ?').get(pid));
  },
  'PUT /api/seller/products/:id': ({ shop, body, params }) => {
    const v = productInput(body);
    const r = db.prepare("UPDATE products SET title=?, description=?, category=?, price=?, compare_at=?, images=?, sizes=?, stock=?, status=?, updated_at=datetime('now') WHERE id=? AND shop_id=?")
      .run(v.title, v.description, v.category, v.price, v.compare, v.images, v.sizes, v.stock, v.status, params.id, shop.id);
    if (!r.changes) fail(404, 'Product not found');
    return productOut(db.prepare('SELECT * FROM products WHERE id = ?').get(params.id));
  },
  'DELETE /api/seller/products/:id': ({ shop, params }) => {
    const r = db.prepare("UPDATE products SET status='archived', updated_at=datetime('now') WHERE id=? AND shop_id=?").run(params.id, shop.id);
    if (!r.changes) fail(404, 'Product not found');
    return { ok: true };
  },
  'POST /api/seller/upload': ({ user, body }) => ({ url: saveImage(body.dataUrl) }),
  'GET /api/seller/orders': ({ shop }) => sellerOrders(shop.id),
  'POST /api/seller/orders/:id/ship': ({ shop, body, params }) => {
    const tracking = str(body.tracking, 60); if (!tracking) fail(400, 'Add a tracking number');
    const r = db.prepare("UPDATE seller_orders SET status='Shipped', carrier=?, tracking=?, shipped_at=datetime('now') WHERE id=? AND shop_id=? AND status='Paid'")
      .run(str(body.carrier, 30) || 'USPS', tracking, params.id, shop.id);
    if (!r.changes) fail(404, 'Order not found or already shipped');
    return { ok: true };
  },
  'GET /api/seller/stats': ({ shop }) => {
    const q = (sql, ...a) => db.prepare(sql).get(shop.id, ...a);
    return {
      toShip: q("SELECT COUNT(*) n FROM seller_orders WHERE shop_id = ? AND status = 'Paid'").n,
      orders30: q("SELECT COUNT(*) n FROM seller_orders WHERE shop_id = ? AND created_at > datetime('now','-30 days')").n,
      sales30: q("SELECT COALESCE(SUM(subtotal),0) v FROM seller_orders WHERE shop_id = ? AND created_at > datetime('now','-30 days')").v,
      live: q("SELECT COUNT(*) n FROM products WHERE shop_id = ? AND status = 'live'").n,
      drafts: q("SELECT COUNT(*) n FROM products WHERE shop_id = ? AND status = 'draft'").n,
      lowStock: q("SELECT COUNT(*) n FROM products WHERE shop_id = ? AND status = 'live' AND stock <= 3").n,
    };
  },

  // platform admin
  'GET /api/admin/shops': () => db.prepare(`SELECT s.*, u.email owner_email, (SELECT COUNT(*) FROM products p WHERE p.shop_id = s.id AND p.status != 'archived') products
    FROM shops s LEFT JOIN users u ON u.id = s.owner_id ORDER BY CASE s.status WHEN 'pending' THEN 0 ELSE 1 END, s.created_at DESC`).all()
    .map(s => ({ ...shopOut(s), ownerEmail: s.owner_email, products: s.products, createdAt: s.created_at })),
  'GET /api/admin/analytics': ({ req }) => report(db, Math.min(90, Math.max(1, Number(new URL(req.url, 'http://x').searchParams.get('days')) || 7))),
  'POST /api/admin/shops/:id/status': ({ body, params }) => {
    if (!['approved', 'pending', 'suspended'].includes(body.status)) fail(400, 'Bad status');
    db.prepare('UPDATE shops SET status = ? WHERE id = ?').run(body.status, params.id);
    return { ok: true };
  },
};

function match(method, path) {
  for (const [key, fn] of Object.entries(routes)) {
    const [m, pattern] = key.split(' '); if (m !== method) continue;
    const a = pattern.split('/'), b = path.split('/'); if (a.length !== b.length) continue;
    const params = {}; let ok = true;
    a.forEach((seg, i) => { if (seg.startsWith(':')) params[seg.slice(1)] = decodeURIComponent(b[i]); else if (seg !== b[i]) ok = false; });
    if (ok) return { fn, params, pattern };
  }
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'); const path = url.pathname;
  try {
    if (path.startsWith('/api/')) {
      // CORS for the native app and Expo dev server (no cookies cross-origin: seller endpoints are same-origin only)
      res.setHeader('access-control-allow-origin', '*'); res.setHeader('access-control-allow-headers', 'content-type');
      if (req.method === 'OPTIONS') return send(res, 204, '');
      const m = match(req.method, path); if (!m) return send(res, 404, { error: 'Not found' });
      const user = currentUser(req);
      const ctx = { req, res, user, params: m.params, body: ['POST', 'PUT'].includes(req.method) ? await readBody(req) : {} };
      if (m.pattern.startsWith('/api/seller') || m.pattern.startsWith('/api/admin')) {
        if (!user) fail(401, 'Log in first');
        if (m.pattern.startsWith('/api/admin') && user.role !== 'admin') fail(403, 'Admins only');
        // Same-origin check for cookie-authenticated writes (CSRF guard on top of SameSite=Lax).
        if (req.method !== 'GET' && req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) fail(403, 'Cross-site request blocked');
        if (m.pattern.startsWith('/api/seller') && !['/api/seller/shop', '/api/seller/upload'].includes(m.pattern)) {
          ctx.shop = myShop(user); if (!ctx.shop) fail(400, 'Set up your shop first');
        }
      }
      return send(res, 200, await m.fn(ctx));
    }
    if (path.startsWith('/uploads/') && serveFile(res, UPLOAD_DIR, path.slice('/uploads'.length), 'public, max-age=31536000, immutable')) return;
    if (path === '/seller' || path.startsWith('/seller/')) {
      const sub = path.slice('/seller'.length) || '/';
      if (sub !== '/' && serveFile(res, WEB, sub, 'no-cache')) return;
      return serveFile(res, WEB, '/index.html', 'no-cache');
    }
    if (existsSync(APP)) {
      if (path !== '/' && serveFile(res, APP, path, path.startsWith('/_expo/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300')) return;
      if (serveFile(res, APP, '/index.html', 'no-cache')) return;
    }
    send(res, 404, 'Not found');
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.code, { error: e.message });
    console.error(e); send(res, 500, { error: 'Something went wrong' });
  }
});
server.listen(PORT, '0.0.0.0', () => console.log(`Shelby on :${PORT}`));
