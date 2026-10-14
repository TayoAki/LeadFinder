import { requireAdmin } from "@/lib/session.ts";
import { LAB_PROVIDERS } from "@/lib/lab.ts";
import ProviderLab from "@/components/ProviderLab";

export default async function LabPage() {
  await requireAdmin();
  return (
    <>
      <h1>Provider lab</h1>
      <ProviderLab providers={LAB_PROVIDERS.map((p) => ({ ...p }))} />
    </>
  );
}
