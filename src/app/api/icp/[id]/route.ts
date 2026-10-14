import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { freeCounts, sanitizeIcp } from "@/lib/icp.ts";

// Save edited filters and refresh the free counts.
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return withUser(async (user) => {
    const { id } = await ctx.params;
    const d = db();
    const owned = d.prepare("SELECT 1 FROM icps i JOIN businesses b ON b.id = i.business_id WHERE i.id = ? AND b.user_id = ?").get(Number(id), user.id);
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const icp = sanitizeIcp(await req.json());
    const counts = await freeCounts(d, user.id, icp);
    d.prepare("UPDATE icps SET status = 'ready', icp_json = ?, counts_json = ? WHERE id = ?").run(JSON.stringify(icp), JSON.stringify(counts), Number(id));
    return NextResponse.json({ icp, counts });
  });
}
