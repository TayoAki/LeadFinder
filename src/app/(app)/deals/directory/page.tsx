import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { getBuyBox } from "@/lib/crm.ts";
import Directory from "@/components/deals/Directory";
import Empty from "@/components/Empty";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await requireUser();
  const d = db();
  const industries = d.prepare("SELECT naics, industry AS name, COUNT(*) AS n FROM directory WHERE naics IS NOT NULL GROUP BY naics ORDER BY n DESC").all() as { naics: string; name: string; n: number }[];
  if (!industries.length) {
    return <><h1>Directory</h1><Empty title="The directory is empty" body="Once businesses are loaded you can filter them by your buy box and have the AI rank them for you." /></>;
  }
  const box = getBuyBox(d, user.id);
  return (
    <>
      <h1>Directory</h1>
      <Directory industries={industries} hasThesis={Boolean(box.thesis.trim())}
        initial={{ industries: industries.map((i) => i.naics), metro: "", minAge: box.minAgeYears, ebitdaMin: box.ebitdaMin, ebitdaMax: box.ebitdaMax, familyOnly: false, q: "" }} />
    </>
  );
}
