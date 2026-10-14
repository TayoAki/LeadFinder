"use client";
import { useState } from "react";

type Pack = { id: string; credits: number; cents: number; label?: string };

export default function BuyCredits({ packs }: { packs: Pack[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(id: string) {
    setBusy(id);
    setError(null);
    const res = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pack: id }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setBusy(null);
      return setError(data.error ?? "Couldn't open checkout");
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: ".75rem" }}>
        {packs.map((p) => (
          <div key={p.id} className="card" style={{ padding: "1rem" }}>
            <div className="muted" style={{ fontSize: ".85rem" }}>{p.label ?? p.id}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>{p.credits.toLocaleString()} credits</div>
            <div className="muted" style={{ fontSize: ".85rem", marginBottom: ".6rem" }}>
              ${(p.cents / 100).toFixed(2)} · ${(p.cents / 100 / p.credits).toFixed(3)} per credit
            </div>
            <button className="btn primary" onClick={() => buy(p.id)} disabled={busy !== null} style={{ width: "100%", justifyContent: "center" }}>
              {busy === p.id ? "Opening…" : "Buy"}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
