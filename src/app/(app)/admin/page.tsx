import Link from "next/link";
import { requireAdmin } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { accounts, costBreakdown, creditUsd, marginTotals, runMargins, usd } from "@/lib/margin.ts";
import Stat from "@/components/Stat";
import AdjustCredits from "@/components/AdjustCredits";

export const dynamic = "force-dynamic";

const RANGES: [string, number | null][] = [["7 days", 7], ["30 days", 30], ["All time", null]];
const pct = (n: number | null) => (n === null ? "—" : `${n.toFixed(0)}%`);
const num = { textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin();
  const d = db();
  const { days: daysParam } = await searchParams;
  const days = daysParam === "all" ? null : Number(daysParam) || 30;
  const t = marginTotals(d, days);
  const { byEndpoint, emailProviders } = costBreakdown(d, days);
  const runs = runMargins(d);
  const users = accounts(d);

  return (
    <>
      <h1>Admin</h1>
      <div style={{ display: "flex", gap: ".4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {RANGES.map(([label, n]) => (
          <Link key={label} href={`/admin?days=${n ?? "all"}`} className="pill"
            style={{ textDecoration: "none", fontWeight: n === days ? 600 : 400 }}>{label}</Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: ".75rem", marginBottom: "1rem" }}>
        <Stat label="Revenue (est.)" value={usd(t.revenueMicro)} sub={`${t.creditsCharged.toLocaleString()} credits × $${creditUsd()}`} />
        <Stat label="Treg cost" value={usd(t.costMicro)} sub={`${usd(t.runCostMicro)} runs · ${usd(t.overheadMicro)} site reads & counts`} />
        <Stat label="Gross margin" value={pct(t.marginPct)} sub={t.marginPct === null ? "No credits charged yet" : `${usd(t.revenueMicro - t.costMicro)} kept`} />
        <Stat label="Cost per verified email" value={t.costPerVerifiedMicro === null ? "—" : usd(t.costPerVerifiedMicro, 4)} sub={`${t.verified.toLocaleString()} verified of ${t.leads.toLocaleString()} leads`} />
      </div>
      <p className="muted" style={{ fontSize: ".85rem", marginTop: 0 }}>
        Revenue is credits charged × the credit price (LEADFINDER_CREDIT_USD, now ${creditUsd()}) until Stripe top-ups exist.
        AI (OpenRouter/Anthropic) cost isn&apos;t included.
      </p>

      <section className="card" style={{ overflowX: "auto", marginBottom: "1rem" }}>
        <h3>Runs</h3>
        {runs.length === 0 ? <p className="muted">No runs yet.</p> : (
          <table>
            <thead><tr>
              <th>Run</th><th>Account</th><th>Type</th><th>Status</th><th style={num}>Leads</th><th style={num}>Verified</th>
              <th style={num}>Credits</th><th style={num}>Revenue</th><th style={num}>Treg cost</th><th style={num}>Margin</th>
            </tr></thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}<div className="muted" style={{ fontSize: ".75rem" }}>{r.created_at}</div></td>
                  <td>{r.email}</td><td>{r.kind}</td><td>{r.status}</td>
                  <td style={num}>{r.leads}/{r.target}</td><td style={num}>{r.verified}</td>
                  <td style={num}>{r.charged}<span className="muted"> / {r.held}</span></td>
                  <td style={num}>{usd(r.revenue_micro)}</td><td style={num}>{usd(r.cost_micro, 4)}</td><td style={num}>{pct(r.margin_pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <section className="card" style={{ overflowX: "auto" }}>
          <h3>Treg spend by endpoint</h3>
          {byEndpoint.length === 0 ? <p className="muted">No Treg calls yet.</p> : (
            <table>
              <thead><tr><th>Endpoint</th><th style={num}>Calls</th><th style={num}>Errors</th><th style={num}>Avg ms</th><th style={num}>Cost</th></tr></thead>
              <tbody>
                {byEndpoint.map((e) => (
                  <tr key={e.endpoint}>
                    <td style={{ wordBreak: "break-all" }}>{e.endpoint}</td><td style={num}>{e.calls}</td><td style={num}>{e.errors}</td>
                    <td style={num}>{e.avg_ms}</td><td style={num}>{usd(e.cost_micro, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <section className="card" style={{ overflowX: "auto" }}>
          <h3>Email waterfall: who served</h3>
          {emailProviders.length === 0 ? <p className="muted">No email lookups yet.</p> : (
            <table>
              <thead><tr><th>Provider</th><th style={num}>Lookups</th><th style={num}>Cost</th><th style={num}>Per lookup</th></tr></thead>
              <tbody>
                {emailProviders.map((p) => (
                  <tr key={p.provider}>
                    <td>{p.provider}</td><td style={num}>{p.calls}</td><td style={num}>{usd(p.cost_micro, 4)}</td>
                    <td style={num}>{usd(p.calls ? p.cost_micro / p.calls : 0, 4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: 0 }}>&ldquo;(none)&rdquo; = every provider missed.</p>
        </section>
      </div>

      <section className="card" style={{ overflowX: "auto" }}>
        <h3>Accounts</h3>
        <table>
          <thead><tr><th>Account</th><th>Role</th><th style={num}>Runs</th><th style={num}>Spent</th><th style={num}>Balance</th><th>Adjust credits</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}<div className="muted" style={{ fontSize: ".8rem" }}>{u.email}</div></td>
                <td>{u.role}</td><td style={num}>{u.runs}</td><td style={num}>{u.spent.toLocaleString()}</td>
                <td style={num}>{u.balance.toLocaleString()}</td>
                <td><AdjustCredits userId={u.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
