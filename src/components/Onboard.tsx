"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./deals/shared";

type Box = {
  naics: string[]; states: string[]; metro: string; minAgeYears: number; ebitdaMin: number; ebitdaMax: number;
  familyOnly: boolean; priorities: string[]; thesis: string;
};

const SIZES: [string, number, number][] = [
  ["Under $500k EBITDA (owner-operator)", 0, 500_000],
  ["$500k–$1.5M EBITDA", 500_000, 1_500_000],
  ["$1M–$3M EBITDA (first platform)", 1_000_000, 3_000_000],
  ["$3M+ EBITDA", 3_000_000, 50_000_000],
  ["Any size", 0, 50_000_000],
];
const PRIORITIES = [
  "Founder or family run", "Owner nearing retirement", "Residential service", "Commercial service",
  "Recurring maintenance revenue", "A team we can keep", "Room to grow with add-ons",
];

export default function Onboard({ industries, metros, initial }: {
  industries: { naics: string; name: string; n: number }[]; metros: { metro: string; n: number }[]; initial: Box;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [box, setBox] = useState<Box>({ ...initial, naics: initial.naics.length ? initial.naics : industries.map((i) => i.naics) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Box>(k: K, v: Box[K]) => setBox({ ...box, [k]: v });
  const toggle = (k: "naics" | "priorities", v: string) => set(k, box[k].includes(v) ? box[k].filter((x) => x !== v) : [...box[k], v]);

  const steps = [
    {
      title: "What kind of business do you want to buy?",
      ok: box.naics.length > 0,
      body: (
        <div className="choices">
          {industries.map((i) => (
            <label key={i.naics} className={`choice${box.naics.includes(i.naics) ? " on" : ""}`}>
              <input type="checkbox" checked={box.naics.includes(i.naics)} onChange={() => toggle("naics", i.naics)} />
              <span>{i.name}</span><span className="muted">{i.n.toLocaleString()} businesses</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Where?",
      ok: true,
      body: (
        <div className="choices">
          <label className={`choice${box.metro === "" ? " on" : ""}`}>
            <input type="radio" name="metro" checked={box.metro === ""} onChange={() => set("metro", "")} /><span>Anywhere we have data</span>
          </label>
          {metros.map((m) => {
            const short = m.metro.split(/[-,]/)[0];
            return (
              <label key={m.metro} className={`choice${box.metro === short ? " on" : ""}`}>
                <input type="radio" name="metro" checked={box.metro === short} onChange={() => set("metro", short)} />
                <span>{m.metro.replace(/, [A-Z]{2}$/, "")}</span><span className="muted">{m.n.toLocaleString()}</span>
              </label>
            );
          })}
        </div>
      ),
    },
    {
      title: "How big, and how established?",
      ok: true,
      body: (
        <>
          <div className="choices">
            {SIZES.map(([label, lo, hi]) => (
              <label key={label} className={`choice${box.ebitdaMin === lo && box.ebitdaMax === hi ? " on" : ""}`}>
                <input type="radio" name="size" checked={box.ebitdaMin === lo && box.ebitdaMax === hi} onChange={() => setBox({ ...box, ebitdaMin: lo, ebitdaMax: hi })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <label className="field" style={{ marginTop: "1rem", maxWidth: 260 }}>In business at least (years)
            <input type="number" min={0} max={80} value={box.minAgeYears} onChange={(e) => set("minAgeYears", Number(e.target.value))} />
          </label>
        </>
      ),
    },
    {
      title: "What matters most to you?",
      ok: true,
      body: (
        <>
          <div className="choices">
            {PRIORITIES.map((p) => (
              <label key={p} className={`choice${box.priorities.includes(p) ? " on" : ""}`}>
                <input type="checkbox" checked={box.priorities.includes(p)} onChange={() => toggle("priorities", p)} /><span>{p}</span>
              </label>
            ))}
          </div>
          <label style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
            <input type="checkbox" checked={box.familyOnly} onChange={(e) => set("familyOnly", e.target.checked)} />
            Only show founder or family-run businesses
          </label>
        </>
      ),
    },
    {
      title: "Anything else, in your own words?",
      ok: true,
      body: (
        <>
          <textarea className="search" rows={5} style={{ width: "100%" }} value={box.thesis} onChange={(e) => set("thesis", e.target.value)}
            placeholder="e.g. We want a residential HVAC company with a strong reputation whose owner wants to retire in the next two years. We'd keep the name and the team. Avoid new-construction-only shops." />
          <p className="muted" style={{ fontSize: ".85rem" }}>Our AI reads this, with your answers, to rank every business for you. You can change it any time.</p>
        </>
      ),
    },
  ];

  async function finish() {
    setBusy(true); setError(null);
    try {
      await api("/api/buybox", { method: "PUT", json: { ...box, onboarded: true } });
      router.push("/matches?fresh=1");
      router.refresh();
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }

  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <div className="onboard card">
      <div className="onboard-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((_, i) => <span key={i} className={i <= step ? "on" : ""} />)}
      </div>
      <h2>{s.title}</h2>
      {s.body}
      {error && <p className="error">{error}</p>}
      <div className="onboard-nav">
        <button className="btn" onClick={() => setStep(step - 1)} disabled={step === 0 || busy}>Back</button>
        {last
          ? <button className="btn primary" onClick={finish} disabled={busy}>{busy ? "Saving…" : "Show my matches"}</button>
          : <button className="btn primary" onClick={() => setStep(step + 1)} disabled={!s.ok}>Next</button>}
      </div>
    </div>
  );
}
