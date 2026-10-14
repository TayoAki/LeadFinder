import Link from "next/link";
import { requireUser } from "@/lib/session.ts";
import { db } from "@/lib/db.ts";
import { balance } from "@/lib/credits.ts";

export const dynamic = "force-dynamic";

const nav = [
  ["/dashboard", "Home"],
  ["/icp", "ICP"],
  ["/leads", "Leads"],
  ["/clean", "Clean a list"],
  ["/lab", "Provider lab"],
  ["/billing", "Billing"],
  ["/settings", "Settings"],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const credits = balance(db(), user.id);
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">LeadFinder</div>
        {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </aside>
      <div>
        <header className="topbar">
          <Link href="/billing" className="pill" style={{ textDecoration: "none" }} title="Credit balance">
            {credits.toLocaleString()} credits
          </Link>
          <span className="muted">{user.name}{user.role === "admin" ? " · admin" : ""}</span>
          <form action="/api/auth/logout" method="post"><button className="btn">Log out</button></form>
        </header>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
