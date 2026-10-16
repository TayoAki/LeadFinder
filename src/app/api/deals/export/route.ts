import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { listBusinesses, STAGES, type BusinessQuery } from "@/lib/crm.ts";
import { csvCell } from "@/lib/leads.ts";

export async function GET(req: Request) {
  return withUser(async (user) => {
    const u = new URL(req.url);
    const rows = listBusinesses(db(), user.id, {
      q: u.searchParams.get("q") ?? undefined, stage: u.searchParams.get("stage") ?? undefined,
      tier: u.searchParams.get("tier") ?? undefined, source: u.searchParams.get("source") ?? undefined,
      sort: (u.searchParams.get("sort") as BusinessQuery["sort"]) ?? undefined,
    });
    const head = ["Business", "Industry", "City", "State", "Metro", "Owner", "Owner email", "Email status", "Phone", "Website",
      "Tier", "Score", "Years", "EBITDA low", "EBITDA high", "Stage", "Assignee", "Next step", "Due"];
    const stage = (s: string) => STAGES.find((x) => x.id === s)?.label ?? s;
    const lines = rows.map((r) => [r.name, r.industry, r.city, r.state, r.metro, r.owner_name, r.owner_email, r.email_status, r.phone, r.website,
      r.tier, r.score, r.age_years, r.ebitda_lo, r.ebitda_hi, stage(r.stage), r.assignee, r.next_step, r.due_date].map(csvCell).join(","));
    return new Response([head.join(","), ...lines].join("\r\n") + "\r\n", {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leadfinder-deals-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
    });
  });
}
