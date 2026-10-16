import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { DD_SECTIONS, getBuyBox, ownsBusiness } from "@/lib/crm.ts";
import Detail from "@/components/deals/Detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  if (!ownsBusiness(db(), user.id, id)) notFound();
  return <Detail id={id} ddSections={DD_SECTIONS} buyBox={getBuyBox(db(), user.id)} />;
}
