"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdjustCredits({ userId }: { userId: number }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: Number(amount), note: Number(amount) > 0 ? "Credits added" : "Credits removed" }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Failed");
    setAmount("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
      <input
        aria-label="Credits to add or remove" placeholder="+100 / -20" value={amount} onChange={(e) => setAmount(e.target.value)}
        style={{ width: 90, padding: ".3rem .5rem", borderRadius: 6, border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)", font: "inherit" }}
      />
      <button className="btn" disabled={busy || !amount} style={{ padding: ".3rem .6rem" }}>Apply</button>
      {error && <span className="error" style={{ fontSize: ".8rem" }}>{error}</span>}
    </form>
  );
}
