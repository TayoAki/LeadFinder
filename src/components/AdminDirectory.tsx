"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDirectory() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    setBusy(true); setError(null); setMsg(null);
    const lines: string[] = [];
    for (const f of files) {
      const res = await fetch("/api/admin/directory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: f.name, text: await f.text() }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setError(`${f.name}: ${d.error ?? "failed"}`); break; }
      lines.push(`${f.name}: ${d.added.toLocaleString()} added, ${d.updated.toLocaleString()} updated, ${d.skipped} skipped`);
    }
    setMsg(lines.join("\n") || null);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Upload SBA Search output</h3>
      <p className="muted">Pick one or more <code>sponsor_leads_&lt;state&gt;_&lt;naics&gt;.csv</code> files from <code>sponsor.py</code>. Uploading again refreshes the data; customers' pipelines keep their own copies.</p>
      <input type="file" accept=".csv,text/csv" multiple onChange={onPick} disabled={busy} />
      {busy && <p className="muted">Loading… a 7,000-row file takes a few seconds.</p>}
      {msg && <pre style={{ whiteSpace: "pre-wrap", font: "inherit" }}>{msg}</pre>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
