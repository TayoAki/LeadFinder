import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { icpForUser } from "@/lib/icp.ts";
import { balance } from "@/lib/credits.ts";
import Onboarding from "@/components/Onboarding";
import IcpEditor from "@/components/IcpEditor";

export default async function IcpPage() {
  const user = await requireUser();
  const d = db();
  const current = icpForUser(d, user.id);
  return (
    <>
      <h1>Ideal customer profile</h1>
      {current?.icp ? (
        <IcpEditor id={current.id} website={current.website} initial={current.icp} initialCounts={current.counts} balance={balance(d, user.id)} />
      ) : (
        <>
          {current?.status === "failed" && <p className="error">The last attempt didn&apos;t finish. Please try again.</p>}
          <Onboarding />
        </>
      )}
    </>
  );
}
