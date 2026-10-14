import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance, ledgerFor } from "@/lib/credits.ts";

export default async function Billing() {
  const user = await requireUser();
  const d = db();
  const rows = ledgerFor(d, user.id);
  return (
    <>
      <h1>Billing</h1>
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="muted">Balance</div>
        <div style={{ fontSize: "2rem", fontWeight: 600 }}>{balance(d, user.id).toLocaleString()} credits</div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Runs hold the most they could cost, pay each result from the hold, and return the rest when they finish.
        </p>
      </div>
      <div className="card" style={{ overflowX: "auto" }}>
        <h3>Ledger</h3>
        <table>
          <thead><tr><th>When</th><th>Type</th><th>Note</th><th style={{ textAlign: "right" }}>Credits</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="muted">{r.created_at}</td>
                <td><span className="pill">{r.kind}</span></td>
                <td>{r.note}</td>
                <td style={{ textAlign: "right" }} className={r.delta >= 0 ? "pos" : "neg"}>{r.delta > 0 ? "+" : ""}{r.delta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
