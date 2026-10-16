import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { getBuyBox } from "@/lib/crm.ts";
import Onboard from "@/components/Onboard";
import Empty from "@/components/Empty";

export const dynamic = "force-dynamic";

export default async function StartPage() {
  const user = await requireUser();
  const d = db();
  const industries = d.prepare("SELECT naics, industry AS name, COUNT(*) AS n FROM directory WHERE naics IS NOT NULL GROUP BY naics ORDER BY n DESC").all() as { naics: string; name: string; n: number }[];
  const metros = d.prepare("SELECT metro, COUNT(*) AS n FROM directory WHERE metro IS NOT NULL AND metro NOT LIKE 'Rural%' GROUP BY metro ORDER BY n DESC LIMIT 8").all() as { metro: string; n: number }[];
  if (!industries.length) {
    return <Empty title="We're loading businesses" body="The business directory is being set up. Please check back shortly." />;
  }
  const box = getBuyBox(d, user.id);
  return (
    <>
      <h1>{box.onboarded ? "Your buy box" : `Welcome, ${user.name.split(" ")[0]}`}</h1>
      <p className="muted" style={{ marginTop: 0 }}>Five quick questions, then we'll rank businesses that fit.</p>
      <Onboard industries={industries} metros={metros}
        initial={{ naics: box.naics, states: box.states, metro: box.metro, minAgeYears: box.minAgeYears, ebitdaMin: box.ebitdaMin,
          ebitdaMax: box.ebitdaMax, familyOnly: box.familyOnly, priorities: box.priorities, thesis: box.thesis }} />
    </>
  );
}
