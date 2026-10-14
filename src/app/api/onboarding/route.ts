import { NextResponse } from "next/server";
import { db } from "@/lib/db.ts";
import { withUser } from "@/lib/api.ts";
import { freeCounts, normalizeWebsite, readSite, writeIcp, type OnboardingInput } from "@/lib/icp.ts";

export const maxDuration = 120;

// Reads the site, writes the ICP with Claude, then takes free counts. Paid by the operator, free to the customer.
export async function POST(req: Request) {
  return withUser(async (user) => {
    const b = await req.json();
    const input: OnboardingInput = {
      website: normalizeWebsite(String(b.website ?? "")),
      sells: String(b.sells ?? "").slice(0, 1000),
      pricePoint: String(b.pricePoint ?? "").slice(0, 200),
      buyers: String(b.buyers ?? "").slice(0, 1000),
      geography: String(b.geography ?? "").slice(0, 200),
      companySize: String(b.companySize ?? "").slice(0, 100),
    };
    if (!input.sells) throw new Error("Tell us what you sell");
    const d = db();
    const businessId = Number(
      d.prepare("INSERT INTO businesses (user_id, website, sells, price_point, buyers, geography, company_size) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(user.id, input.website, input.sells, input.pricePoint, input.buyers, input.geography, input.companySize).lastInsertRowid,
    );
    const icpId = Number(d.prepare("INSERT INTO icps (business_id) VALUES (?)").run(businessId).lastInsertRowid);
    try {
      const site = await readSite(d, user.id, input.website);
      d.prepare("UPDATE businesses SET crawl_json = ?, brand_json = ? WHERE id = ?").run(
        JSON.stringify({ chars: site.siteText.length }), JSON.stringify(site.brand), businessId,
      );
      const icp = await writeIcp(input, site.siteText, site.brand);
      const counts = await freeCounts(d, user.id, icp);
      d.prepare("UPDATE icps SET status = 'ready', icp_json = ?, counts_json = ? WHERE id = ?").run(JSON.stringify(icp), JSON.stringify(counts), icpId);
      return NextResponse.json({ id: icpId, icp, counts, siteRead: site.siteText.length > 0 });
    } catch (e) {
      d.prepare("UPDATE icps SET status = 'failed' WHERE id = ?").run(icpId);
      throw e;
    }
  });
}
