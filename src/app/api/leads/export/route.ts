import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { queryLeads, toCsv } from "@/lib/leads.ts";
import { leadQueryFrom } from "../params.ts";

// Exports exactly what the table shows (same filters), or only the selected ids when ?ids= is given.
export async function GET(req: Request) {
  return withUser(async (user) => {
    const url = new URL(req.url);
    let rows = queryLeads(db(), user.id, leadQueryFrom(url));
    const ids = url.searchParams.get("ids");
    if (ids) {
      const keep = new Set(ids.split(",").map(Number));
      rows = rows.filter((r) => keep.has(r.id));
    }
    const date = new Date().toISOString().slice(0, 10);
    return new Response(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leadfinder-leads-${date}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  });
}
