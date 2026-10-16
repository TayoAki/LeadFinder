// The app's sections (left rail) and the pages inside each one (tabs).
export interface Section {
  id: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
  tabs: { href: string; label: string }[];
}

export const SECTIONS: Section[] = [
  { id: "home", label: "Home", icon: "home", tabs: [{ href: "/dashboard", label: "Overview" }] },
  { id: "find", label: "Find", icon: "find", tabs: [{ href: "/icp", label: "Ideal customer" }, { href: "/clean", label: "Clean a list" }] },
  { id: "deals", label: "Deals", icon: "deals", tabs: [
    { href: "/deals", label: "Pipeline" },
    { href: "/deals/list", label: "Businesses" },
    { href: "/deals/today", label: "Today" },
    { href: "/deals/find", label: "Find businesses" },
    { href: "/deals/import", label: "Import" },
    { href: "/deals/buybox", label: "Buy box" },
  ] },
  { id: "leads", label: "Leads", icon: "leads", tabs: [{ href: "/leads", label: "Leads" }] },
  { id: "account", label: "Account", icon: "account", tabs: [{ href: "/billing", label: "Billing" }, { href: "/settings", label: "Settings" }] },
  { id: "admin", label: "Admin", icon: "admin", adminOnly: true, tabs: [{ href: "/admin", label: "Margin" }, { href: "/lab", label: "Provider lab" }] },
];

const matches = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export const sectionFor = (path: string) => SECTIONS.find((s) => s.tabs.some((t) => matches(path, t.href))) ?? SECTIONS[0];

/** The tab for a path: the longest matching href, so /deals/list picks "Businesses", not "Pipeline". */
export const activeTab = (path: string) =>
  sectionFor(path).tabs.filter((t) => matches(path, t.href)).sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;
