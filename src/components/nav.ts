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
  { id: "leads", label: "Leads", icon: "leads", tabs: [{ href: "/leads", label: "Leads" }] },
  { id: "account", label: "Account", icon: "account", tabs: [{ href: "/billing", label: "Billing" }, { href: "/settings", label: "Settings" }] },
  { id: "admin", label: "Admin", icon: "admin", adminOnly: true, tabs: [{ href: "/admin", label: "Margin" }, { href: "/lab", label: "Provider lab" }] },
];

export const sectionFor = (path: string) =>
  SECTIONS.find((s) => s.tabs.some((t) => path === t.href || path.startsWith(`${t.href}/`))) ?? SECTIONS[0];
