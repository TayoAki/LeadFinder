import type { DB } from "./db.ts";

const TABLES = ["cars", "valuations", "inspections", "offers", "resale", "runs"] as const;

export function exportSnapshot(db: DB) {
  return Object.fromEntries(TABLES.map((t) => [t, db.prepare(`SELECT * FROM ${t}`).all()]));
}

/** Replace all data with a snapshot. Columns are taken from the target schema, so older snapshots still load. */
export function importSnapshot(db: DB, snap: Record<string, Array<Record<string, unknown>>>) {
  const counts: Record<string, number> = {};
  db.transaction(() => {
    for (const t of [...TABLES].reverse()) db.prepare(`DELETE FROM ${t}`).run();
    for (const t of TABLES) {
      const cols = (db.prepare(`PRAGMA table_info(${t})`).all() as Array<{ name: string }>).map((c) => c.name);
      const rows = snap[t] ?? [];
      for (const r of rows) {
        const keys = cols.filter((c) => c in r);
        db.prepare(`INSERT INTO ${t} (${keys.join(",")}) VALUES (${keys.map(() => "?").join(",")})`).run(...keys.map((k) => r[k] as any));
      }
      counts[t] = rows.length;
    }
  })();
  return counts;
}
