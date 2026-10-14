"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Preview = {
  usable: number; withEmail: number; skipped: { line: number; reason: string }[]; skippedCount: number;
  columns: string[]; maxCredits: number; balance: number;
};
const COLUMN_LABELS: Record<string, string> = {
  fullName: "name", firstName: "first name", lastName: "last name", title: "title", company: "company", domain: "website", linkedin: "LinkedIn", email: "email",
};

export default function CleanList() {
  const router = useRouter();
  const [file, setFile] = useState<{ name: string; csv: string } | null>(null);
  const [wantMobile, setWantMobile] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const post = (start: boolean) =>
    fetch("/api/lists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file?.name, csv: file?.csv, wantMobile, start }) });

  useEffect(() => {
    if (!file) return;
    setError(null);
    setPreview(null);
    post(false).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (res.ok) setPreview(data);
      else setError(data.error ?? "Couldn't read that file");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, wantMobile]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2_000_000) return setError("That file is over 2 MB. Split it into smaller lists.");
    setFile({ name: f.name, csv: await f.text() });
  }

  async function start() {
    setBusy(true);
    setError(null);
    const res = await post(true);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Couldn't start");
    router.push(`/leads?run=${data.id}`);
  }

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
      <div className="card">
        <p className="muted" style={{ marginTop: 0 }}>
          Upload a CSV with a header row. Each row needs an <strong>email</strong> (we verify it), a <strong>LinkedIn URL</strong>, or a
          <strong> name and company website</strong> (we find the email). Up to 1,000 rows.
        </p>
        <input type="file" accept=".csv,text/csv" onChange={onPick} />
        <label style={{ display: "flex", gap: ".4rem", alignItems: "center", marginTop: ".8rem" }}>
          <input type="checkbox" checked={wantMobile} onChange={(e) => setWantMobile(e.target.checked)} /> Also find mobile numbers
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      {preview && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{file?.name}</h3>
          <p>
            <strong>{preview.usable.toLocaleString()}</strong> usable rows ({preview.withEmail} with an email to verify, {preview.usable - preview.withEmail} to find)
            {preview.skippedCount > 0 && <> · <span className="neg">{preview.skippedCount} skipped</span></>}
          </p>
          <p className="muted">Columns found: {preview.columns.map((c) => COLUMN_LABELS[c] ?? c).join(", ") || "none"}</p>
          {preview.skippedCount > 0 && (
            <details style={{ marginBottom: "1rem" }}>
              <summary className="muted">Why rows were skipped</summary>
              <ul className="muted" style={{ fontSize: ".9rem" }}>
                {preview.skipped.map((s) => <li key={s.line}>Row {s.line}: {s.reason}</li>)}
                {preview.skippedCount > preview.skipped.length && <li>…and {preview.skippedCount - preview.skipped.length} more</li>}
              </ul>
            </details>
          )}
          <p className="muted">
            Holds up to <strong>{preview.maxCredits.toLocaleString()} credits</strong> (you have {preview.balance.toLocaleString()}).
            1 credit per uploaded email we verify, 4 per verified email we find (2 if catch-all or risky){wantMobile ? ", 10 per mobile" : ""}.
            Invalid emails and misses are free. Unused credits come back when it finishes.
          </p>
          <button className="btn primary" onClick={start} disabled={busy || preview.usable === 0 || preview.maxCredits > preview.balance}>
            {busy ? "Starting…" : `Clean ${preview.usable.toLocaleString()} rows`}
          </button>
        </div>
      )}
    </div>
  );
}
