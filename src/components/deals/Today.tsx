"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { api } from "./shared";

type Task = { id: number; title: string; channel: string | null; due_date: string; business_id: number; name: string; owner_name: string | null; phone: string | null; owner_email: string | null; city: string | null; tier: string | null };

const CHANNEL: Record<string, string> = { letter: "Letter", call: "Call", email: "Email" };

export default function Today() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const load = useCallback(() => api<Task[]>("/api/deals/today").then(setTasks), []);
  useEffect(() => { load(); }, [load]);

  async function done(id: number) {
    setTasks((t) => t?.filter((x) => x.id !== id) ?? null);
    await api(`/api/deals/tasks/${id}`, { method: "PATCH", json: { done: true } });
  }

  if (!tasks) return <p className="muted">Loading…</p>;
  const today = new Date().toISOString().slice(0, 10);
  const groups: [string, Task[]][] = [
    ["Overdue", tasks.filter((t) => t.due_date < today)],
    ["Today", tasks.filter((t) => t.due_date === today)],
    ["Next 7 days", tasks.filter((t) => t.due_date > today)],
  ];
  if (!tasks.length) {
    return <div className="card empty"><h2>Nothing due</h2><p className="muted">Start an outreach cadence on a business and its letters, calls and emails show up here on the day they're due.</p><Link className="btn" href="/deals">Open pipeline</Link></div>;
  }
  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {groups.filter(([, g]) => g.length).map(([label, g]) => (
        <section key={label}>
          <h3>{label} <span className="muted">({g.length})</span></h3>
          <div className="card" style={{ padding: 0 }}>
            {g.map((t) => (
              <div key={t.id} className="task-row">
                <input type="checkbox" aria-label={`Mark done: ${t.title}`} onChange={() => done(t.id)} />
                <span className="pill">{CHANNEL[t.channel ?? ""] ?? "Task"}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div>{t.title}</div>
                  <div className="muted" style={{ fontSize: ".85rem" }}>
                    <Link href={`/deals/b/${t.business_id}`}>{t.name}</Link>
                    {t.owner_name ? ` · ${t.owner_name}` : ""}{t.city ? ` · ${t.city}` : ""}
                    {t.channel === "call" && t.phone ? ` · ${t.phone}` : ""}{t.channel === "email" && t.owner_email ? ` · ${t.owner_email}` : ""}
                  </div>
                </div>
                <span className="muted" style={{ fontSize: ".85rem", whiteSpace: "nowrap" }}>{t.due_date}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
