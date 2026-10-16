import Link from "next/link";
import { Fragment } from "react";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance, CREDIT_PRICES } from "@/lib/credits.ts";
import { aiConfigured } from "@/lib/claude.ts";
import { STAGES, dueTasks, stageCounts, today } from "@/lib/crm.ts";
import { LISTING_CREDITS, FINDER_PRICES } from "@/lib/finder.ts";
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
  const latest = user.role === "admin" ? runs[0] : undefined;
  const shortlist = d
    .prepare(`SELECT b.id, b.name, b.city, b.score FROM businesses_crm b JOIN deals dl ON dl.business_id = b.id
              WHERE b.user_id = ? AND dl.stage = 'shortlist' ORDER BY b.score DESC LIMIT 12`)
    .all(user.id) as { id: number; name: string; city: string | null; score: number | null }[];
  const stages = stageCounts(d, user.id);
  const activeDeals = STAGES.filter((st) => st.id !== "closed" && st.id !== "passed").reduce((n, st) => n + stages[st.id], 0);
  const due = dueTasks(d, user.id, 0);
  const overdue = due.filter((t) => t.due_date < today()).length;
  const initials = user.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
  const tregOk = Boolean(process.env.TREG_TOKEN);
  const aiOk = aiConfigured();

  return (
    <div className="app">
      <Rail isAdmin={user.role === "admin"} initials={initials} />

      <aside className="side" aria-label="Shortlist">
        <Link href="/start" className="side-cta"><Icon name="find" size={16} /> Edit buy box</Link>
        <div className="side-heading">Shortlist</div>
        {shortlist.length === 0 ? (
          <p className="muted side-empty">Star businesses on your Matches page and they'll appear here.</p>
        ) : (
          <ul className="side-list">
            {shortlist.map((b) => (
              <li key={b.id}>
                <Link href={`/deals/b/${b.id}`} className="side-item">
                  <span className="side-score">{b.score !== null ? Math.round(b.score) : "–"}</span>
                  <span className="side-text">
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                    <span className="muted side-sub">{b.city}</span>
                  </span>
                </Link>
              </li>
            ))}
            <li><Link href="/shortlist" className="muted" style={{ fontSize: ".85rem", padding: ".4rem .5rem", display: "block" }}>Open shortlist →</Link></li>
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
        {activeDeals + stages.closed + stages.passed > 0 && (
          <section className="card aside-card">
            <div className="aside-heading">Deals</div>
            <dl className="aside-dl">
              <dt>Active</dt><dd>{activeDeals}</dd>
              {STAGES.filter((st) => stages[st.id] > 0).map((st) => <Fragment key={st.id}><dt>{st.label}</dt><dd>{stages[st.id]}</dd></Fragment>)}
            </dl>
            <Link href="/deals/today" className="aside-link">
              {due.length ? `${due.length} task${due.length === 1 ? "" : "s"} due${overdue ? `, ${overdue} overdue` : ""}` : "Nothing due today"}
            </Link>
          </section>
        )}
        {user.role === "admin" && <section className="card aside-card">
          <div className="aside-heading">All your leads</div>
          <dl className="aside-dl">
            <dt>Leads</dt><dd>{totals.leads.toLocaleString()}</dd>
            <dt>Verified emails</dt><dd>{totals.verified.toLocaleString()}</dd>
            <dt>Runs</dt><dd>{runs.length}{runs.length === 12 ? "+" : ""}</dd>
          </dl>
        </section>}
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
            <li>Matches and AI ranking <span>free</span></li>
            <li>Shortlisting <span>free</span></li>
            <li>Website and phone <span>{LISTING_CREDITS}</span></li>
            <li>Owner found <span>{FINDER_PRICES.ownerFound}</span></li>
            <li>Verified owner email <span>{FINDER_PRICES.verifiedEmail}</span></li>
            <li>Nothing found <span>free</span></li>
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
