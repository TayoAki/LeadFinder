import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance } from "@/lib/credits.ts";
import { microToUsd, tregCostTotals } from "@/lib/treg.ts";
import Empty from "@/components/Empty";

export default async function Dashboard() {
  const user = await requireUser();
  const d = db();
  const treg = tregCostTotals(d);
  return (
    <>
      <h1>Welcome, {user.name.split(" ")[0]}</h1>
      <p className="muted">You have {balance(d, user.id)} credits.</p>
      {user.role === "admin" && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3>Operator</h3>
          <p className="muted" style={{ margin: 0 }}>
            {treg.calls} Treg calls · ${microToUsd(treg.cost_micro).toFixed(4)} spent ·{" "}
            Treg token {process.env.TREG_TOKEN ? "set" : "missing"} · AI {process.env.OPENROUTER_API_KEY ? "OpenRouter" : process.env.ANTHROPIC_API_KEY ? "Anthropic" : "missing"}
          </p>
        </div>
      )}
      <Empty title="Find your first leads" body="Start with your website and what you sell. Onboarding arrives in the next build phase." cta={["/icp", "Set up your ICP"]} />
    </>
  );
}
