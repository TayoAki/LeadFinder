// The app's sections (left rail) and the pages inside each one (tabs).
export interface Section {
  id: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
  tabs: { href: string; label: string }[];
}

export const SECTIONS: Section[] = [
  { id: "matches", label: "Matches", icon: "matches", tabs: [
    { href: "/matches", label: "Matches" },
    { href: "/start", label: "Buy box" },
    { href: "/deals/buybox", label: "Deal terms" },
  ] },
  { id: "shortlist", label: "Shortlist", icon: "star", tabs: [{ href: "/shortlist", label: "Shortlist" }] },
  { id: "deals", label: "Pipeline", icon: "deals", tabs: [
    { href: "/deals", label: "Board" },
    { href: "/deals/list", label: "All businesses" },
    { href: "/deals/today", label: "Today" },
    { href: "/deals/directory", label: "Browse directory" },
    { href: "/deals/find", label: "Search maps" },
    { href: "/deals/import", label: "Import" },
  ] },
  { id: "account", label: "Account", icon: "account", tabs: [{ href: "/billing", label: "Billing" }, { href: "/settings", label: "Settings" }] },
  { id: "admin", label: "Admin", icon: "admin", adminOnly: true, tabs: [
    { href: "/admin", label: "Margin" },
    { href: "/admin/directory", label: "Directory" },
    { href: "/lab", label: "Provider lab" },
  ] },
  // The original lead-selling product: hidden from customers, kept for admins.
  { id: "legacy", label: "Lead tools", icon: "leads", adminOnly: true, tabs: [
    { href: "/icp", label: "ICP" },
    { href: "/leads", label: "Lead runs" },
    { href: "/clean", label: "Clean a list" },
  ] },
];

const matches = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** The section owning a path: the one with the longest matching tab, so /deals/buybox belongs to Matches. */
export const sectionFor = (path: string) => {
  let best: { s: Section; len: number } | null = null;
  for (const s of SECTIONS) for (const t of s.tabs) if (matches(path, t.href) && (!best || t.href.length > best.len)) best = { s, len: t.href.length };
  return best?.s ?? SECTIONS[0];
};

/** The tab for a path: the longest matching href, so /deals/list picks "All businesses", not "Board". */
export const activeTab = (path: string) =>
  sectionFor(path).tabs.filter((t) => matches(path, t.href)).sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;
