"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { SECTIONS, sectionFor } from "./nav";

/** Left rail: one icon per section, the current one highlighted. */
export function Rail({ isAdmin, initials }: { isAdmin: boolean; initials: string }) {
  const current = sectionFor(usePathname()).id;
  return (
    <nav className="rail" aria-label="Sections">
      <Link href="/dashboard" className="rail-logo" aria-label="LeadFinder home">LF</Link>
      {SECTIONS.filter((s) => !s.adminOnly || isAdmin).map((s) => (
        <Link key={s.id} href={s.tabs[0].href} className={`rail-item${s.id === current ? " active" : ""}`}
          aria-current={s.id === current ? "page" : undefined} title={s.label}>
          <Icon name={s.icon} />
          <span className="rail-label">{s.label}</span>
        </Link>
      ))}
      <Link href="/settings" className="rail-avatar" title="Your account" aria-label="Your account">{initials}</Link>
    </nav>
  );
}

/** Tabs across the top of the main area: the pages in the current section. */
export function SectionTabs() {
  const path = usePathname();
  const section = sectionFor(path);
  if (section.tabs.length < 2 && section.id !== "leads") {
    return <div className="tabs"><span className="tab active">{section.tabs[0].label}</span></div>;
  }
  return (
    <div className="tabs" role="tablist">
      {section.tabs.map((t) => {
        const active = path === t.href || path.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} role="tab" aria-selected={active} className={`tab${active ? " active" : ""}`}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
