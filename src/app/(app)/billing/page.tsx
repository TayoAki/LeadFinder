import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance, ledgerFor } from "@/lib/credits.ts";
import { runReceipts } from "@/lib/margin.ts";
import { packs, stripeConfigured } from "@/lib/stripe.ts";
import BuyCredits from "@/components/BuyCredits";

export default async function Billing({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const { paid } = await searchParams;
  const user = await requireUser();
  const d = db();
  const rows = ledgerFor(d, user.id);
  const receipts = runReceipts(d, user.id);
  const num = { textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };
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
      {paid && (
        <p className="card" style={{ marginBottom: "1rem" }}>
          Thanks, your payment went through. Credits appear here as soon as Stripe confirms it, usually within a few seconds; refresh if they&apos;re not showing yet.
        </p>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Buy credits</h3>
        {stripeConfigured() ? <BuyCredits packs={packs()} /> : (
          <p className="muted">Card payments aren&apos;t switched on yet. Ask the LeadFinder team to add credits.</p>
        )}
      </div>
      <div className="card" style={{ overflowX: "auto", marginBottom: "1rem" }}>
        <h3>Run receipts</h3>
        {receipts.length === 0 ? <p className="muted">No runs yet.</p> : (
          <table>
            <thead><tr>
              <th>Run</th><th>What</th><th>Status</th><th style={num}>Leads</th><th style={num}>Verified</th>
              <th style={num}>Held</th><th style={num}>Charged</th><th style={num}>Refunded</th>
            </tr></thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id}>
                  <td><a href={`/leads?run=${r.id}`}>#{r.id}</a><div className="muted" style={{ fontSize: ".75rem" }}>{r.created_at}</div></td>
                  <td>{r.kind === "clean" ? `Cleaned ${r.filename ?? "a list"}` : `Found ${r.target} leads`}</td>
                  <td>{r.status}</td><td style={num}>{r.leads}</td><td style={num}>{r.verified}</td>
                  <td style={num}>{r.held}</td><td style={num}>{r.charged}</td>
                  <td style={num}>{r.status === "held" || r.status === "running" ? "…" : r.refunded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
