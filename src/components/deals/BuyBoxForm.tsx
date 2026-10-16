"use client";
import { useState } from "react";
import { api } from "./shared";

type Box = { thesis: string; industries: string; geography: string; minAgeYears: number; ebitdaMin: number; ebitdaMax: number; priceMultiple: string; structure: string; dealBreakers: string };

export default function BuyBoxForm({ initial }: { initial: Box }) {
  const [box, setBox] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof Box) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setBox({ ...box, [k]: typeof initial[k] === "number" ? Number(e.target.value) : e.target.value });
  };
  async function save(e: React.FormEvent) {
    e.preventDefault();
    try { setBox(await api<Box>("/api/buybox", { method: "PUT", json: box })); setSaved(true); setError(null); }
    catch (err) { setError((err as Error).message); }
  }
  return (
    <form className="card" onSubmit={save} style={{ maxWidth: 720 }}>
      <p className="muted" style={{ marginTop: 0 }}>Write down exactly what you'll buy, so you can say no fast. It's shown beside every business you review.</p>
      <label className="field">Your thesis, in your own words
        <textarea rows={4} value={box.thesis} onChange={set("thesis")}
          placeholder="e.g. Residential HVAC and plumbing in Dallas or Houston, founder-run for 20+ years, owner ready to retire, strong team we can keep. Avoid new-construction-only shops." />
      </label>
      <p className="muted" style={{ marginTop: "-.4rem", fontSize: ".85rem" }}>The AI reads this and the fields below when it scores businesses from the directory.</p>
      <label className="field">Industries<input value={box.industries} onChange={set("industries")} /></label>
      <label className="field">Geography<input value={box.geography} onChange={set("geography")} placeholder="e.g. Dallas–Fort Worth and Houston" /></label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0 1rem" }}>
        <label className="field">Minimum years in business<input type="number" min={0} value={box.minAgeYears} onChange={set("minAgeYears")} /></label>
        <label className="field">EBITDA from ($)<input type="number" min={0} step={50000} value={box.ebitdaMin} onChange={set("ebitdaMin")} /></label>
        <label className="field">EBITDA to ($)<input type="number" min={0} step={50000} value={box.ebitdaMax} onChange={set("ebitdaMax")} /></label>
      </div>
      <label className="field">Price<input value={box.priceMultiple} onChange={set("priceMultiple")} /></label>
      <label className="field">Structure<input value={box.structure} onChange={set("structure")} /></label>
      <label className="field">Deal-breakers<textarea rows={3} value={box.dealBreakers} onChange={set("dealBreakers")} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn primary">Save buy box</button>{saved && <span className="muted" style={{ marginLeft: ".75rem" }}>Saved</span>}
    </form>
  );
}
