"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Reading your site", "Pulling your brand record", "Writing your ideal customer profile", "Counting matching companies and people"];

export default function Onboarding() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setTick(0);
    const timer = setInterval(() => setTick((t) => Math.min(t + 1, STEPS.length - 1)), 6000);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    clearInterval(timer);
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    router.refresh();
  }

  const field = (name: string, label: string, placeholder: string, required = true) => (
    <label className="field">{label}<input name={name} placeholder={placeholder} required={required} disabled={busy} /></label>
  );

  return (
    <form className="card" onSubmit={onSubmit} style={{ maxWidth: 640 }}>
      <h2>Tell us about your business</h2>
      <p className="muted">We read your site and write who should buy from you. This is free.</p>
      {field("website", "Your website", "example.com")}
      {field("sells", "What do you sell?", "An AI receptionist for small trade businesses")}
      {field("pricePoint", "Price point", "£50–500 a month", false)}
      {field("buyers", "Who do you think buys it?", "Plumbers, roofers, electricians who miss calls on the job")}
      {field("geography", "Where are they?", "United Kingdom")}
      {field("companySize", "Typical company size (employees)", "1–50", false)}
      {busy && (
        <ul className="muted" style={{ paddingLeft: "1.2rem" }}>
          {STEPS.map((s, i) => <li key={s} style={{ opacity: i <= tick ? 1 : 0.4 }}>{i < tick ? "✓ " : ""}{s}</li>)}
        </ul>
      )}
      {error && <p className="error">{error}</p>}
      <button className="btn primary" disabled={busy}>{busy ? "Working… (about 30 seconds)" : "Write my ICP"}</button>
    </form>
  );
}
