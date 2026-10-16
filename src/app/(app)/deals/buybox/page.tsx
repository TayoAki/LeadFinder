import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { getBuyBox } from "@/lib/crm.ts";
import BuyBoxForm from "@/components/deals/BuyBoxForm";

export default async function Page() {
  const user = await requireUser();
  return <><h1>Buy box</h1><BuyBoxForm initial={getBuyBox(db(), user.id)} /></>;
}
