import Flip from "@/components/Flip.tsx";
import { openDb } from "@/lib/db.ts";
import { pipeline } from "@/lib/cars.ts";

export const dynamic = "force-dynamic";

export default function Page() {
  return <Flip initial={pipeline(openDb())} />;
}
