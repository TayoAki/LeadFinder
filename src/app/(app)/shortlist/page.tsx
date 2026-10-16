import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance } from "@/lib/credits.ts";
import { MAX_SHORTLIST_ENRICH_CREDITS } from "@/lib/finder.ts";
import Shortlist from "@/components/Shortlist";

export const dynamic = "force-dynamic";

export default async function ShortlistPage() {
  const user = await requireUser();
  return <><h1>Shortlist</h1><Shortlist maxCredits={MAX_SHORTLIST_ENRICH_CREDITS} balance={balance(db(), user.id)} /></>;
}
