"use client";

import { useState } from "react";

type Row = Record<string, any>;
const money = (n: number | null | undefined) => (n === null || n === undefined ? "—" : `$${Math.round(n).toLocaleString()}`);
const STEPS = [
  { key: "find", t: "Find", s: "Private-seller listings" },
  { key: "value", t: "Value", s: "KBB values & discounts" },
  { key: "inspect", t: "Inspect", s: "Photos & descriptions" },
  { key: "buy", t: "Buy", s: "Offers & negotiation" },
  { key: "sell", t: "Sell", s: "Photos, listing, profit" },
] as const;
type Step = (typeof STEPS)[number]["key"];

async function tool(name: string, args: Row = {}) {
  const res = await fetch(`/api/tools/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

export default function Flip({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [step, setStep] = useState<Step>("find");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);
  const [find, setFind] = useState({ city: "atlanta", radiusMiles: 60, target: 40, minPrice: 1500, maxPrice: 25000 });

  const refresh = async () => setRows(await tool("pipeline"));
  const run = async (label: string, fn: () => Promise<string | void>) => {
    setBusy(label); setError(null); setNote(null);
    try { const msg = await fn(); if (msg) setNote(msg); await refresh(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  };
  const open = async (id: string) => {
    setSel(id);
    const [car, thread] = await Promise.all([tool("get_car", { id }), tool("offer_thread", { id })]);
    setDetail({ car, thread, row: rows.find((r) => r.id === id) });
  };

  const valued = rows.filter((r) => r.value !== null);
  const inspected = rows.filter((r) => r.score !== null);
  const shortlisted = rows.filter((r) => r.shortlisted);
  const done: Record<Step, boolean> = {
    find: rows.length > 0, value: valued.length > 0, inspect: inspected.length > 0,
    buy: shortlisted.some((r) => r.last_offer), sell: shortlisted.some((r) => r.profit !== null),
  };
  const view = step === "find" ? rows : step === "value" ? valued : step === "inspect" ? inspected : shortlisted;

  return (
    <div className={`cf ${busy ? "cf-busy" : ""}`}>
      <div className="cf-top">
        <div className="cf-brand"><span className="cf-logo">CF</span> CarFlip</div>
        <span className="muted">{rows.length} cars · {valued.length} valued · {shortlisted.length} shortlisted</span>
      </div>

      <nav className="cf-steps" aria-label="Steps">
        {STEPS.map((s, i) => (
          <button key={s.key} className={`cf-step ${step === s.key ? "active" : ""} ${done[s.key] ? "done" : ""}`} onClick={() => setStep(s.key)}>
            <span className="n">Step {i + 1}</span><span className="t">{s.t}</span><span className="s">{s.s}</span>
          </button>
        ))}
      </nav>

      {busy && <p className="muted">{busy}… scrapes can take a few minutes.</p>}
      {error && <p className="error">{error}</p>}
      {note && <p className="pos">{note}</p>}

      <div className="cf-grid">
        <section className="card">
          {step === "find" && (
            <div className="cf-bar">
              {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
                <label key={k} className="field"><span className="cf-note">{k}</span>
                  <input value={find[k]} onChange={(e) => setFind({ ...find, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
                </label>
              ))}
              <button className="btn primary" onClick={() => run("Scraping Marketplace", async () => {
                const r = await tool("find_cars", find);
                return `Saved ${r.saved} new cars (${r.total} total). Skipped ${r.dealersOrOther} dealer or non-car listings.`;
              })}>Find cars</button>
            </div>
          )}
          {step === "value" && (
            <div className="cf-bar">
              <button className="btn primary" onClick={() => run("Looking up KBB values", async () => {
                const r = await tool("value_cars");
                return `Valued ${r.valued}. ${r.classics.length} classics (pre-1990) need a collector guide; ${r.missing.length} had no KBB match.`;
              })}>Look up KBB values</button>
              <span className="cf-note">KBB fair purchase price for the closest trim, adjusted $0.05/mile against 12k miles/year (capped ±25%).</span>
            </div>
          )}
          {step === "inspect" && (
            <div className="cf-bar">
              <button className="btn primary" onClick={() => run("Inspecting the top 10", async () => {
                const r = await tool("inspect_top", { top: 10, keep: 4 });
                return `Inspected ${r.inspected.length}; shortlisted ${r.shortlisted.length}.`;
              })}>Inspect top 10</button>
              <span className="cf-note">Uses AI vision when OPENROUTER_API_KEY is set, otherwise rules. Agents can record their own review over MCP.</span>
            </div>
          )}
          {step === "buy" && (
            <div className="cf-bar">
              <button className="btn primary" onClick={() => run("Drafting offers", async () => {
                const r = await tool("draft_offers");
                return `Drafted ${r.length} opening offers. Send them yourself from Facebook, then log replies here.`;
              })}>Draft offers</button>
              <span className="cf-note">Drafts only. Nothing is sent to sellers automatically.</span>
            </div>
          )}
          {step === "sell" && (
            <div className="cf-bar">
              <button className="btn primary" onClick={() => run("Planning resale", async () => {
                for (const r of shortlisted) await tool("plan_resale", { id: r.id });
                return `Planned resale for ${shortlisted.length} cars. Figures are hypothetical.`;
              })}>Plan resale for shortlist</button>
            </div>
          )}

          <div className="cf-scroll">
            <table>
              <thead><tr>
                <th></th><th>Car</th><th className="num">Ask</th><th className="num">Miles</th>
                {step !== "find" && <><th className="num">Value</th><th className="num">Discount</th></>}
                {(step === "inspect" || step === "buy" || step === "sell") && <th>Inspection</th>}
                {step === "buy" && <><th className="num">Offer</th><th className="num">Counter</th></>}
                {step === "sell" && <><th className="num">List</th><th className="num">Profit*</th></>}
              </tr></thead>
              <tbody>
                {view.map((r) => (
                  <tr key={r.id} className={`cf-row ${sel === r.id ? "sel" : ""}`} onClick={() => open(r.id)}>
                    <td>{r.photos[0] ? <img className="cf-thumb" src={r.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-thumb" />}</td>
                    <td>{r.title.split("·")[0]}<div className="cf-note">{r.city}</div></td>
                    <td className="num">{money(r.price)}</td>
                    <td className="num">{r.miles ? `${Math.round(r.miles / 1000)}k` : "—"}</td>
                    {step !== "find" && <>
                      <td className="num">{money(r.value)}</td>
                      <td className={`num ${r.discount > 0 ? "pos" : "neg"}`}>{r.discount_pct === null ? "—" : `${r.discount_pct > 0 ? "+" : ""}${Math.round(r.discount_pct)}%`}</td>
                    </>}
                    {(step === "inspect" || step === "buy" || step === "sell") &&
                      <td><span className={`v-${r.verdict}`}>{r.verdict ?? "—"}</span>{r.score !== null && ` · ${r.score}`}{r.shortlisted ? " ★" : ""}</td>}
                    {step === "buy" && <><td className="num">{money(r.last_offer)}</td><td className="num">{money(r.last_counter)}</td></>}
                    {step === "sell" && <><td className="num">{money(r.list_price)}</td><td className={`num ${r.profit > 0 ? "pos" : ""}`}>{money(r.profit)}</td></>}
                  </tr>
                ))}
                {!view.length && <tr><td colSpan={9} className="muted">Nothing here yet. Run the step above.</td></tr>}
              </tbody>
            </table>
          </div>
          {step === "sell" && <p className="cf-note">*Hypothetical: list at value, sell ~5% below, minus Georgia 7% TAVT, title/tag, reconditioning and detailing.</p>}
        </section>

        <aside className="card cf-panel">
          {!detail ? <p className="muted">Select a car to see photos, inspection notes and the offer thread.</p> : (
            <CarPanel d={detail} onChange={async () => { await refresh(); await open(detail.car.id); }} step={step} />
          )}
        </aside>
      </div>
    </div>
  );
}

function CarPanel({ d, onChange, step }: { d: Row; onChange: () => Promise<void>; step: Step }) {
  const { car, thread } = d;
  const [reply, setReply] = useState("");
  const [counter, setCounter] = useState("");
  const [plan, setPlan] = useState<Row | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);
  const lastOut = [...thread].reverse().find((t: Row) => t.direction === "out");
  return (
    <div>
      <h3>{car.title.split("·")[0]}</h3>
      <a className="cf-note" href={car.url} target="_blank" rel="noreferrer">Open listing ↗</a>
      <div className="cf-photos">{car.photos.slice(0, 6).map((p: string) => <img key={p} src={p} alt="" referrerPolicy="no-referrer" />)}</div>
      <dl className="cf-kv">
        <dt>Asking</dt><dd>{money(car.price)}</dd>
        <dt>Miles</dt><dd>{car.miles?.toLocaleString() ?? "—"}</dd>
        <dt>Value</dt><dd>{money(d.row?.value)}</dd>
        <dt>Inspection</dt><dd className={`v-${d.row?.verdict}`}>{d.row?.verdict ?? "—"} {d.row?.score ?? ""}</dd>
      </dl>
      {d.row?.red_flags?.length > 0 && <ul className="cf-flags">{d.row.red_flags.map((f: string) => <li key={f}>{f}</li>)}</ul>}
      <details style={{ marginTop: ".6rem" }}><summary className="cf-note">Seller's description</summary><p className="cf-note">{car.description}</p></details>

      {thread.length > 0 && (
        <div style={{ marginTop: ".8rem" }}>
          <div className="aside-heading">Negotiation</div>
          {thread.map((t: Row, i: number) => (
            <div key={i} style={{ marginBottom: ".5rem" }}>
              <div className="cf-note">{t.direction === "out" ? "You (draft)" : "Seller"} {t.amount ? `· ${money(t.amount)}` : ""}</div>
              <div className="cf-msg">{t.message}</div>
              {t.direction === "out" && t === lastOut && <button className="btn" style={{ marginTop: ".3rem" }} onClick={() => navigator.clipboard.writeText(t.message)}>Copy</button>}
            </div>
          ))}
          <label className="field"><span className="cf-note">Seller's reply</span><input value={reply} onChange={(e) => setReply(e.target.value)} /></label>
          <label className="field"><span className="cf-note">Their counter ($)</span><input value={counter} onChange={(e) => setCounter(e.target.value)} /></label>
          <button className="btn" disabled={!reply} onClick={async () => {
            await tool("log_seller_reply", { id: car.id, reply, counter: counter ? Number(counter) : undefined });
            setReply(""); setCounter(""); await onChange();
          }}>Log reply & draft next</button>
        </div>
      )}

      {step === "sell" && (
        <div style={{ marginTop: ".8rem" }}>
          <button className="btn" onClick={async () => setPlan(await tool("plan_resale", { id: car.id }))}>Resale plan</button>{" "}
          <button className="btn" onClick={async () => setPhotos((await tool("enhance_photos", { id: car.id })).written)}>Enhance photos</button>
          {photos && <p className="cf-note">Saved {photos.length} enhanced photos to {photos[0]?.replace(/[^/]+$/, "")}</p>}
          {plan && <>
            <dl className="cf-kv" style={{ marginTop: ".6rem" }}>
              <dt>Buy (assumed)</dt><dd>{money(plan.costs.buy)}</dd><dt>GA tax</dt><dd>{money(plan.costs.tax)}</dd>
              <dt>Recon + detail</dt><dd>{money(plan.costs.recon + plan.costs.detail)}</dd><dt>List / expect</dt><dd>{money(plan.listPrice)} / {money(plan.expectedSale)}</dd>
              <dt>Profit (hypothetical)</dt><dd className="pos">{money(plan.profit)}</dd>
            </dl>
            <div className="aside-heading" style={{ marginTop: ".6rem" }}>Listing copy</div>
            <div className="cf-msg">{plan.listing}</div>
            <div className="aside-heading" style={{ marginTop: ".6rem" }}>Before relisting</div>
            <ul className="cf-flags">{[...plan.photos.repairsBeforeListing.map((r: string) => `Repair: ${r}`), ...plan.photos.prep].map((p: string) => <li key={p}>{p}</li>)}</ul>
          </>}
        </div>
      )}
    </div>
  );
}
