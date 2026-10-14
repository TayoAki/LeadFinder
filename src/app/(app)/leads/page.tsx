import Link from "next/link";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import Empty from "@/components/Empty";
import RunView from "@/components/RunView";
import LeadsTable from "@/components/LeadsTable";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const user = await requireUser();
  const runs = db().prepare("SELECT id, status, target, created_at FROM runs WHERE user_id = ? ORDER BY id DESC LIMIT 20").all(user.id) as {
    id: number; status: string; target: number; created_at: string;
  }[];
  if (!runs.length) {
    return <><h1>Leads</h1><Empty title="No leads yet" body="Once your ICP is ready, press Find leads and each row will fill in here as the waterfall works." cta={["/icp", "Go to ICP"]} /></>;
  }
  const { run } = await searchParams;
  // Show a run's live view when one is picked or still going; otherwise go straight to the table.
  const shown = runs.find((r) => r.id === Number(run)) ?? runs.find((r) => ["held", "running"].includes(r.status));
  return (
    <>
      <h1>Leads</h1>
      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <Link href="/leads" className="pill" style={{ textDecoration: "none", fontWeight: shown ? 400 : 600 }}>All leads</Link>
        {runs.map((r) => (
          <Link key={r.id} href={`/leads?run=${r.id}`} className="pill" style={{ textDecoration: "none", fontWeight: r.id === shown?.id ? 600 : 400 }}>
            Run #{r.id} · {r.target} · {r.status}
          </Link>
        ))}
      </div>
      {shown ? (
        <RunView key={shown.id} runId={shown.id} isAdmin={user.role === "admin"} />
      ) : (
        <LeadsTable isAdmin={user.role === "admin"} />
      )}
    </>
  );
}
