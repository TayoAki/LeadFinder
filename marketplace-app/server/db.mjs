// Shelby API store: SQLite (node:sqlite) on a Railway volume. v0 choice for speed; the PRD's
// target is Postgres, and these tables map 1:1 to that schema (users, shops, products,
// purchases -> seller_orders -> order_lines).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = resolve(process.env.DATA_DIR || resolve(here, '..', '.data'));
export const UPLOAD_DIR = resolve(DATA_DIR, 'uploads');
mkdirSync(UPLOAD_DIR, { recursive: true });

export const id = (p = '') => p + randomBytes(6).toString('hex');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT, pass TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'seller', created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY, owner_id TEXT REFERENCES users(id), name TEXT NOT NULL, tagline TEXT,
  category TEXT, logo TEXT, banner TEXT, ships_in TEXT DEFAULT '2–3 days', shipping REAL DEFAULT 5.95,
  free_over REAL DEFAULT 50, return_days INTEGER DEFAULT 30, links TEXT,
  status TEXT NOT NULL DEFAULT 'pending', followers INTEGER DEFAULT 0, rating REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, category TEXT, price REAL NOT NULL, compare_at REAL,
  images TEXT NOT NULL DEFAULT '[]', sizes TEXT NOT NULL DEFAULT '[]', stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', sold INTEGER DEFAULT 0, rating REAL DEFAULT 0, reviews INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY, buyer_email TEXT, buyer_name TEXT, address TEXT, total REAL, discount REAL DEFAULT 0,
  tax REAL DEFAULT 0, ref TEXT, created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS seller_orders (
  id TEXT PRIMARY KEY, purchase_id TEXT NOT NULL REFERENCES purchases(id), shop_id TEXT NOT NULL REFERENCES shops(id),
  subtotal REAL, shipping REAL, status TEXT NOT NULL DEFAULT 'Paid', carrier TEXT, tracking TEXT,
  shipped_at TEXT, created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_lines (
  seller_order_id TEXT NOT NULL REFERENCES seller_orders(id), product_id TEXT, title TEXT, image TEXT,
  price REAL, size TEXT, qty INTEGER
);
CREATE INDEX IF NOT EXISTS products_shop ON products(shop_id);
CREATE INDEX IF NOT EXISTS so_shop ON seller_orders(shop_id);
`;

let db;
export function getDb() {
  if (db) return db;
  db = new DatabaseSync(resolve(DATA_DIR, 'shelby.db'));
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA);
  seed(db);
  return db;
}

// First boot: load the sample catalogue as approved demo shops so the app is never empty.
function seed(d) {
  if (d.prepare('SELECT COUNT(*) n FROM shops').get().n) return;
  const cat = JSON.parse(readFileSync(resolve(here, '..', 'src', 'data', 'catalog.json'), 'utf8'));
  const insS = d.prepare(`INSERT INTO shops (id, name, tagline, category, logo, banner, ships_in, shipping, free_over, status, followers, rating)
    VALUES (?,?,?,?,?,?,?,?,?,'approved',?,?)`);
  const insP = d.prepare(`INSERT INTO products (id, shop_id, title, description, category, price, compare_at, images, sizes, stock, status, sold, rating, reviews)
    VALUES (?,?,?,?,?,?,?,?,?,?,'live',?,?,?)`);
  d.exec('BEGIN');
  for (const s of cat.shops) insS.run(s.id, s.name, s.tagline, s.category, s.logo, s.banner, s.shipsIn, s.shipping, s.freeOver, s.followers, s.id === 's7' ? 0 : s.rating);
  for (const p of cat.products) insP.run(p.id, p.shopId, p.title, p.description, p.category, p.price, p.compareAt, JSON.stringify(p.images), JSON.stringify(p.sizes), p.stock, p.sold, p.rating, p.reviews);
  d.exec('COMMIT');
}

// Rows -> the app's shapes (see src/lib/data.ts).
export const shopOut = s => ({
  id: s.id, name: s.name, tagline: s.tagline ?? '', category: s.category ?? 'Home', followers: s.followers ?? 0, rating: s.rating ?? 0,
  logo: s.logo ?? '', banner: s.banner ?? s.logo ?? '', shipsIn: s.ships_in, freeOver: s.free_over, shipping: s.shipping,
  returnDays: s.return_days, status: s.status, links: s.links ?? '',
});
export const productOut = p => {
  const images = JSON.parse(p.images || '[]');
  return {
    id: p.id, title: p.title, price: p.price, compareAt: p.compare_at ?? null, category: p.category ?? 'Home', shopId: p.shop_id,
    image: images[0] ?? '', images, rating: p.rating ?? 0, reviews: p.reviews ?? 0, stock: p.stock, sold: p.sold ?? 0,
    sizes: JSON.parse(p.sizes || '[]'), description: p.description ?? '', status: p.status, updatedAt: p.updated_at,
  };
};
