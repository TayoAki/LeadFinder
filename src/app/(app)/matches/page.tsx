import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { getBuyBox } from "@/lib/crm.ts";
import Matches from "@/components/Matches";

export const dynamic = "force-dynamic";

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ fresh?: string }> }) {
  const user = await requireUser();
  if (!getBuyBox(db(), user.id).onboarded) redirect("/start");
  const { fresh } = await searchParams;
  return <><h1>Your matches</h1><Matches autoScore={fresh === "1"} /></>;
}
