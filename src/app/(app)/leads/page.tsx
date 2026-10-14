import Link from "next/link";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import Empty from "@/components/Empty";
import RunView from "@/components/RunView";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const user = await requireUser();
  const runs = db().prepare("SELECT id, status, target, created_at FROM runs WHERE user_id = ? ORDER BY id DESC LIMIT 20").all(user.id) as {
    id: number; status: string; target: number; created_at: string;
  }[];
  if (!runs.length) return <><h1>Leads</h1><Empty title="No leads yet" body="Once your ICP is ready, press Find leads and each row will fill in here as the waterfall works." cta={["/icp", "Go to ICP"]} /></>;
  const { run } = await searchParams;
  const selected = runs.find((r) => r.id === Number(run)) ?? runs[0];
  return (
    <>
      <h1>Leads</h1>
      <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {runs.map((r) => (
          <Link key={r.id} href={`/leads?run=${r.id}`} className="pill" style={{ textDecoration: "none", fontWeight: r.id === selected.id ? 600 : 400 }}>
            Run #{r.id} · {r.target} · {r.status}
          </Link>
        ))}
      </div>
      <RunView key={selected.id} runId={selected.id} isAdmin={user.role === "admin"} />
    </>
  );
}
