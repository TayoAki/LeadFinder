import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { getBuyBox } from "@/lib/crm.ts";

export const dynamic = "force-dynamic";

// Home: new accounts go through onboarding first, everyone else lands on their matches.
export default async function Dashboard() {
  const user = await requireUser();
  redirect(getBuyBox(db(), user.id).onboarded ? "/matches" : "/start");
}
