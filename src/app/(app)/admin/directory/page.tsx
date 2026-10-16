import { requireAdmin } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { directoryStats } from "@/lib/directory.ts";
import AdminDirectory from "@/components/AdminDirectory";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const s = directoryStats(db());
  return (
    <>
      <h1>Business directory</h1>
      <div style={{ display: "grid", gap: "1rem" }}>
        <AdminDirectory />
        <div className="card" style={{ overflowX: "auto" }}>
          <h3>{s.total.toLocaleString()} businesses</h3>
          <table>
            <thead><tr><th>Industry</th><th>State</th><th style={{ textAlign: "right" }}>Businesses</th></tr></thead>
            <tbody>{s.byIndustry.map((r) => <tr key={`${r.industry}${r.state}`}><td>{r.industry}</td><td>{r.state}</td><td style={{ textAlign: "right" }}>{r.n.toLocaleString()}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="card" style={{ overflowX: "auto" }}>
          <h3>Uploads</h3>
          {s.uploads.length === 0 ? <p className="muted">None yet.</p> : (
            <table>
              <thead><tr><th>When</th><th>File</th><th style={{ textAlign: "right" }}>Added</th><th style={{ textAlign: "right" }}>Updated</th><th style={{ textAlign: "right" }}>Skipped</th></tr></thead>
              <tbody>{s.uploads.map((u, i) => <tr key={i}><td className="muted">{u.created_at}</td><td>{u.filename}</td><td style={{ textAlign: "right" }}>{u.rows_added}</td><td style={{ textAlign: "right" }}>{u.rows_updated}</td><td style={{ textAlign: "right" }}>{u.rows_skipped}</td></tr>)}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
