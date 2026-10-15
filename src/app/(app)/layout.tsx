import Link from "next/link";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance, CREDIT_PRICES } from "@/lib/credits.ts";
import { aiConfigured } from "@/lib/claude.ts";
import { Rail, SectionTabs } from "@/components/AppNav";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

type RunRow = { id: number; kind: string; status: string; target: number; created_at: string; leads: number; verified: number; charged: number; max_credits: number };

const STATUS_LABEL: Record<string, string> = { held: "starting", running: "running", completed: "done", failed: "failed", cancelled: "cancelled", quoted: "quoted" };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const d = db();
  const credits = balance(d, user.id);
  const runs = d
    .prepare(
      `SELECT r.id, r.kind, r.status, r.target, r.created_at, r.charged, r.max_credits,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id) AS leads,
              (SELECT COUNT(*) FROM leads WHERE run_id = r.id AND email_status = 'verified') AS verified
       FROM runs r WHERE r.user_id = ? ORDER BY r.id DESC LIMIT 12`,
    )
    .all(user.id) as RunRow[];
  const totals = d
    .prepare("SELECT COUNT(*) AS leads, COALESCE(SUM(email_status = 'verified'), 0) AS verified FROM leads WHERE user_id = ?")
    .get(user.id) as { leads: number; verified: number };
  const latest = runs[0];
  const initials = user.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
  const tregOk = Boolean(process.env.TREG_TOKEN);
  const aiOk = aiConfigured();

  return (
    <div className="app">
      <Rail isAdmin={user.role === "admin"} initials={initials} />

      <aside className="side" aria-label="Recent runs">
        <Link href="/icp" className="side-cta"><Icon name="plus" size={16} /> New search</Link>
        <div className="side-heading">Recent runs</div>
        {runs.length === 0 ? (
          <p className="muted side-empty">Your searches and cleaned lists will appear here.</p>
        ) : (
          <ul className="side-list">
            {runs.map((r) => (
              <li key={r.id}>
                <Link href={`/leads?run=${r.id}`} className="side-item">
                  <span className={`dot dot-${r.status}`} aria-hidden="true" />
                  <span className="side-text">
                    <span>{r.kind === "clean" ? "Cleaned list" : `${r.target} leads`} <span className="muted">#{r.id}</span></span>
                    <span className="muted side-sub">{r.verified} verified · {STATUS_LABEL[r.status] ?? r.status}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="content">
        <SectionTabs />
        <div className="content-body">{children}</div>
      </main>

      <aside className="aside" aria-label="Summary">
        <section>
          <div className="aside-heading">Credits</div>
          <div className="aside-big">{credits.toLocaleString()}</div>
          <Link href="/billing" className="muted aside-link">Billing and receipts</Link>
        </section>
        <section className="card aside-card">
          <div className="aside-heading">All your leads</div>
          <dl className="aside-dl">
            <dt>Leads</dt><dd>{totals.leads.toLocaleString()}</dd>
            <dt>Verified emails</dt><dd>{totals.verified.toLocaleString()}</dd>
            <dt>Runs</dt><dd>{runs.length}{runs.length === 12 ? "+" : ""}</dd>
          </dl>
        </section>
        {latest && (
          <section className="card aside-card">
            <div className="aside-heading">Latest run #{latest.id}</div>
            <dl className="aside-dl">
              <dt>Status</dt><dd>{STATUS_LABEL[latest.status] ?? latest.status}</dd>
              <dt>People</dt><dd>{latest.leads}/{latest.target}</dd>
              <dt>Verified</dt><dd>{latest.verified}</dd>
              <dt>Credits</dt><dd>{latest.charged} of {latest.max_credits}</dd>
            </dl>
            <Link href={`/leads?run=${latest.id}`} className="aside-link">Open run</Link>
          </section>
        )}
        <section>
          <div className="aside-heading">What things cost</div>
          <ul className="aside-prices muted">
            <li>Person found <span>{CREDIT_PRICES.person}</span></li>
            <li>Verified email <span>{CREDIT_PRICES.verifiedEmail}</span></li>
            <li>Catch-all or risky <span>{CREDIT_PRICES.unconfirmedEmail}</span></li>
            <li>Mobile (opt-in) <span>{CREDIT_PRICES.mobile}</span></li>
            <li>Misses, invalid emails <span>free</span></li>
          </ul>
        </section>
      </aside>

      <footer className="bottombar">
        <span className="muted">
          {user.name}{user.role === "admin" ? " · admin" : ""} · {credits.toLocaleString()} credits
        </span>
        <span className="bottombar-right">
          {user.role === "admin" && (
            <span className="muted">
              Data {tregOk ? "connected" : "not connected"} · AI {aiOk ? "connected" : "not connected"}
            </span>
          )}
          <form action="/api/auth/logout" method="post">
            <button className="linkbtn"><Icon name="logout" size={14} /> Log out</button>
          </form>
        </span>
      </footer>
    </div>
  );
}
