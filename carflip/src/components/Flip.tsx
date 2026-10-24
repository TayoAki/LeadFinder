"use client";

import { useState } from "react";
import Icon from "./Icon.tsx";

type Row = Record<string, any>;
const money = (n: number | null | undefined) => (n === null || n === undefined ? "—" : `$${Math.round(n).toLocaleString()}`);
const short = (t: string) => t.split("·")[0].trim();

const STEPS = [
  { key: "find", t: "Find", h: "Private-seller listings", p: "Facebook Marketplace cars near you, with dealers, bikes and new-car listings filtered out." },
  { key: "value", t: "Value", h: "KBB values and discounts", p: "KBB fair purchase price for the closest trim, adjusted for mileage, ranked by how far each ask sits below value." },
  { key: "inspect", t: "Inspect", h: "Photos and descriptions", p: "The top 10 by discount get a photo and description review. The best four go on the shortlist." },
  { key: "buy", t: "Buy", h: "Offers and negotiation", p: "Low opening offers with a walk-away price. Drafts only: you send them, then log replies here for the next counter." },
  { key: "sell", t: "Sell", h: "Photos, listing and profit", p: "Honest photo clean-up, a repair list, ad copy and hypothetical profit after tax and fees." },
] as const;
type Step = (typeof STEPS)[number]["key"];
type View = "pipeline" | "negotiations" | "report" | "settings";

async function tool(name: string, args: Row = {}) {
  const res = await fetch(`/api/tools/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

export default function Flip({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [view, setView] = useState<View>("pipeline");
  const [step, setStep] = useState<Step>(initial.some((r) => r.shortlisted) ? "buy" : initial.length ? "value" : "find");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);
  const [search, setSearch] = useState({ city: "atlanta", radiusMiles: 60, target: 40, minPrice: 1500, maxPrice: 25000 });

  const refresh = async () => setRows(await tool("pipeline"));
  const run = async (label: string, fn: () => Promise<string | void>) => {
    setBusy(label); setError(null); setNote(null);
    try { const msg = await fn(); if (msg) setNote(msg); await refresh(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  };
  const open = async (id: string) => {
    const [car, thread] = await Promise.all([tool("get_car", { id }), tool("offer_thread", { id })]);
    setDetail({ car, thread, row: rows.find((r) => r.id === id) });
  };

  const valued = rows.filter((r) => r.value !== null);
  const inspected = rows.filter((r) => r.score !== null);
  const shortlisted = rows.filter((r) => r.shortlisted);
  const list: Record<Step, Row[]> = { find: rows, value: valued, inspect: inspected, buy: shortlisted, sell: shortlisted };
  const done: Record<Step, boolean> = {
    find: rows.length > 0, value: valued.length > 0, inspect: inspected.length > 0,
    buy: shortlisted.some((r) => r.last_offer), sell: shortlisted.some((r) => r.profit !== null),
  };
  const meta = STEPS.find((s) => s.key === step)!;
  const nextStep = STEPS[STEPS.findIndex((s) => s.key === step) + 1];

  const actions: Record<Step, { label: string; run: () => Promise<string | void> }> = {
    find: { label: "Find cars", run: async () => {
      const r = await tool("find_cars", search);
      return `Saved ${r.saved} new cars (${r.total} total). Skipped ${r.dealersOrOther} dealer or non-car listings.`;
    } },
    value: { label: "Look up KBB values", run: async () => {
      const r = await tool("value_cars");
      return `Valued ${r.valued}. ${r.classics.length} classics (pre-1990) need a collector guide; ${r.missing.length} had no KBB match.`;
    } },
    inspect: { label: "Inspect top 10", run: async () => {
      const r = await tool("inspect_top", { top: 10, keep: 4 });
      return `Inspected ${r.inspected.length}; shortlisted ${r.shortlisted.length}.`;
    } },
    buy: { label: "Draft offers", run: async () => `Drafted ${(await tool("draft_offers")).length} opening offers. Send them yourself, then log replies.` },
    sell: { label: "Plan resale", run: async () => {
      for (const r of shortlisted) await tool("plan_resale", { id: r.id });
      return `Planned resale for ${shortlisted.length} cars. Figures are hypothetical.`;
    } },
  };

  const negotiations = rows.filter((r) => r.last_offer !== null);
  const panel = detail
    ? <CarPanel d={detail} step={step} onChange={async () => { await refresh(); await open(detail.car.id); }} />
    : <Summary rows={rows} shortlisted={shortlisted} />;

  return (
    <div className={`app ${busy ? "cf-busy" : ""}`}>
      {/* Left rail */}
      <nav className="rail" aria-label="Sections">
        <span className="rail-logo">CF</span>
        {([["pipeline", "home", "Pipeline"], ["negotiations", "bell", "Offers"], ["report", "doc", "Report"], ["settings", "gear", "Settings"]] as const).map(([v, icon, label]) => (
          <button key={v} className={`rail-item cf-railbtn ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
            <Icon name={icon} /><span className="rail-label">{label}</span>
            {v === "negotiations" && negotiations.some((r) => r.last_counter) && <span className="cf-badge" />}
          </button>
        ))}
        <span className="rail-avatar"><Icon name="user" size={18} /></span>
      </nav>

      {/* Sidebar: every car */}
      <aside className="side">
        <button className="side-cta cf-sidebtn" onClick={() => { setView("pipeline"); setStep("find"); }}>
          <Icon name="plus" size={18} /> New search <span style={{ marginLeft: "auto" }}>›</span>
        </button>
        <div className="side-heading">Cars ({rows.length})</div>
        {!rows.length && <p className="side-empty muted">Run a search to fill this list.</p>}
        <ul className="side-list">
          {rows.map((r) => (
            <li key={r.id}>
              <button className={`side-item cf-sideitem ${detail?.car.id === r.id ? "active" : ""}`} onClick={() => open(r.id)}>
                {r.photos[0] ? <img className="cf-avatar" src={r.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-avatar" />}
                <span className="side-text">
                  <span>{short(r.title)}</span>
                  <span className="side-sub muted">{money(r.price)}{r.discount_pct !== null && ` · ${r.discount_pct > 0 ? "+" : ""}${Math.round(r.discount_pct)}%`}{r.shortlisted ? " · ★" : ""}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="content">
        {view === "pipeline" && <>
          <nav className="tabs" aria-label="Steps">
            {STEPS.map((s, i) => (
              <button key={s.key} className={`tab cf-tab ${step === s.key ? "active" : ""}`} onClick={() => setStep(s.key)}>
                {i + 1}. {s.t}{done[s.key] && <span className="pos"> ✓</span>}
              </button>
            ))}
          </nav>
          <div className="content-body">
            <h1 className="cf-h1">{meta.h}</h1>
            <p className="muted cf-lead">{meta.p}</p>
            {busy && <p className="muted">{busy}… scrapes can take a few minutes.</p>}
            {error && <p className="error">{error}</p>}
            {note && <p className="pos">{note}</p>}

            {/* Three highlight cards */}
            <div className="cf-cards">
              {list[step].slice(0, 3).map((r) => (
                <button key={r.id} className="card cf-carcard" onClick={() => open(r.id)}>
                  {r.photos[0] ? <img src={r.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-ph"><Icon name="image" size={32} /></span>}
                  <strong>{short(r.title)}</strong>
                  <span className="muted">{money(r.price)}{r.value !== null && <> · value {money(r.value)}</>}</span>
                  {r.verdict && <span className={`v-${r.verdict}`}>{r.verdict}{r.score !== null && ` · ${r.score}`}</span>}
                </button>
              ))}
              {!list[step].length && [0, 1, 2].map((i) => <div key={i} className="card cf-carcard cf-empty"><span className="cf-ph"><Icon name="image" size={32} /></span><span className="muted">Run this step to fill these cards</span></div>)}
            </div>

            {step === "find" && (
              <div className="cf-bar">
                {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
                  <label key={k} className="field"><span className="cf-note">{k}</span>
                    <input value={search[k]} onChange={(e) => setSearch({ ...search, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
                  </label>
                ))}
              </div>
            )}

            {/* Action card for this step */}
            <div className="card cf-action">
              <span className="cf-actionicon"><Icon name={done[step] ? "arrow" : "search"} /></span>
              <div>
                <strong>{done[step] ? `${meta.t} is done${nextStep ? `. Next: ${nextStep.t}` : ""}` : `Run step ${STEPS.indexOf(meta) + 1}: ${meta.t}`}</strong>
                <div className="muted cf-note">{list[step].length} cars at this step{step === "buy" ? " · drafts only, nothing is sent automatically" : ""}</div>
              </div>
              <div className="cf-actionbtns">
                <button className={`btn ${done[step] ? "" : "primary"}`} onClick={() => run(meta.t, actions[step].run)}>{done[step] ? "Run again" : actions[step].label}</button>
                {done[step] && nextStep && <button className="btn primary" onClick={() => setStep(nextStep.key)}>Go to {nextStep.t}</button>}
              </div>
            </div>

            <h2 className="cf-h2">All cars at this step</h2>
            <CarTable rows={list[step]} step={step} onOpen={open} selected={detail?.car.id} />

            {/* Below the side panel's breakpoint, the selected car shows here instead */}
            <div className="card cf-inline">{panel}</div>
          </div>
        </>}

        {view === "negotiations" && (
          <div className="content-body">
            <h1 className="cf-h1">Negotiations</h1>
            <p className="muted cf-lead">Every car with a drafted offer. Open one to copy the message, log the seller's reply and get the next counter.</p>
            <CarTable rows={negotiations} step="buy" onOpen={open} selected={detail?.car.id} />
            <div className="card cf-inline">{panel}</div>
          </div>
        )}

        {view === "report" && (
          <div className="content-body">
            <h1 className="cf-h1">Resale report</h1>
            <p className="muted cf-lead">Hypothetical: list at value, sell about 5% below, minus Georgia 7% TAVT, title and tag, reconditioning and detailing.</p>
            <div className="cf-cards">
              <Stat label="Shortlisted" value={String(shortlisted.length)} />
              <Stat label="Total hypothetical profit" value={money(shortlisted.reduce((a, r) => a + (r.profit ?? 0), 0))} />
              <Stat label="Average discount" value={valued.length ? `${Math.round(valued.reduce((a, r) => a + r.discount_pct, 0) / valued.length)}%` : "—"} />
            </div>
            <CarTable rows={shortlisted} step="sell" onOpen={open} selected={detail?.car.id} />
            <div className="card cf-inline">{panel}</div>
          </div>
        )}

        {view === "settings" && (
          <div className="content-body">
            <h1 className="cf-h1">Settings</h1>
            <p className="muted cf-lead">Search defaults for step 1. Keys are read from the server's environment (.env), never from the browser.</p>
            <div className="card cf-settings">
              {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
                <label key={k} className="field"><span>{k}</span>
                  <input value={search[k]} onChange={(e) => setSearch({ ...search, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
                </label>
              ))}
              <p className="cf-note">MCP: connect any MCP client to <code>bin/mcp.ts</code> for headless runs. See README.</p>
            </div>
          </div>
        )}
      </main>

      {/* Right side bar */}
      <aside className="aside">{panel}</aside>

      {/* Bottom bar */}
      <footer className="bottombar">
        <span className="muted">{search.city} · {search.radiusMiles} mi · {rows.length} cars · {valued.length} valued · {shortlisted.length} shortlisted</span>
        <span className="bottombar-right muted">{busy ? `${busy}…` : "Ready"} · Offers are drafts only</span>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="muted cf-note">{label}</div><div className="aside-big">{value}</div></div>;
}

function CarTable({ rows, step, onOpen, selected }: { rows: Row[]; step: Step; onOpen: (id: string) => void; selected?: string }) {
  return (
    <div className="card cf-scroll">
      <table>
        <thead><tr>
          <th>Car</th><th className="num">Ask</th><th className="num">Miles</th>
          {step !== "find" && <><th className="num">Value</th><th className="num">Discount</th></>}
          {(step === "inspect" || step === "buy" || step === "sell") && <th>Inspection</th>}
          {step === "buy" && <><th className="num">Offer</th><th className="num">Counter</th></>}
          {step === "sell" && <><th className="num">List</th><th className="num">Profit*</th></>}
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`cf-row ${selected === r.id ? "sel" : ""}`} onClick={() => onOpen(r.id)}>
              <td>{short(r.title)}<div className="cf-note">{r.city}</div></td>
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
          {!rows.length && <tr><td colSpan={9} className="muted">Nothing here yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Summary({ rows, shortlisted }: { rows: Row[]; shortlisted: Row[] }) {
  const best = rows.find((r) => r.value !== null);
  return (
    <div className="cf-summary">
      <div>
        <div className="aside-heading">Pipeline</div>
        <div className="card aside-card">
          <ul className="cf-dotlist">
            <li><span className="dot dot-completed" /> {rows.length} cars found</li>
            <li><span className="dot dot-completed" /> {rows.filter((r) => r.value !== null).length} valued</li>
            <li><span className="dot dot-running" /> {shortlisted.length} shortlisted</li>
          </ul>
        </div>
      </div>
      {best && <div>
        <div className="aside-heading">Biggest discount</div>
        {best.photos[0] ? <img className="cf-asideimg" src={best.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-ph cf-asideimg"><Icon name="image" /></span>}
        <p style={{ margin: ".4rem 0 0" }}><strong>{short(best.title)}</strong></p>
        <p className="muted cf-note">{money(best.price)} vs {money(best.value)}{best.verdict && <> · <span className={`v-${best.verdict}`}>{best.verdict}</span></>}</p>
      </div>}
      <div>
        <div className="aside-heading">Shortlist</div>
        <ul className="cf-dotlist">
          {shortlisted.map((r) => <li key={r.id}><span className="dot dot-completed" /> {short(r.title)} · {money(r.price)}</li>)}
          {!shortlisted.length && <li className="muted">Inspect the top 10 to build a shortlist.</li>}
        </ul>
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
    <div className="cf-panelbody">
      <div>
        <div className="aside-heading">Selected car</div>
        <h3 style={{ margin: 0 }}>{short(car.title)}</h3>
        <a className="cf-note" href={car.url} target="_blank" rel="noreferrer">Open listing ↗</a>
      </div>
      <div className="card aside-card">
        <dl className="aside-dl">
          <dt>Asking</dt><dd>{money(car.price)}</dd>
          <dt>Miles</dt><dd>{car.miles?.toLocaleString() ?? "—"}</dd>
          <dt>Value</dt><dd>{money(d.row?.value)}</dd>
          <dt>Inspection</dt><dd className={`v-${d.row?.verdict}`}>{d.row?.verdict ?? "—"} {d.row?.score ?? ""}</dd>
        </dl>
      </div>
      <div className="cf-photos">{car.photos.slice(0, 6).map((p: string) => <img key={p} src={p} alt="" referrerPolicy="no-referrer" />)}</div>
      {d.row?.red_flags?.length > 0 && <div><div className="aside-heading">Flags</div><ul className="cf-dotlist">{d.row.red_flags.map((f: string) => <li key={f}><span className="dot dot-failed" /> {f}</li>)}</ul></div>}
      <details><summary className="cf-note">Seller's description</summary><p className="cf-note">{car.description}</p></details>

      {thread.length > 0 && (
        <div>
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

      {(step === "sell" || d.row?.profit !== null) && d.row?.value !== null && (
        <div>
          <div className="aside-heading">Resale</div>
          <button className="btn" onClick={async () => setPlan(await tool("plan_resale", { id: car.id }))}>Resale plan</button>{" "}
          <button className="btn" onClick={async () => setPhotos((await tool("enhance_photos", { id: car.id })).written)}>Enhance photos</button>
          {photos && <p className="cf-note">Saved {photos.length} enhanced photos to {photos[0]?.replace(/[^/]+$/, "")}</p>}
          {plan && <>
            <dl className="aside-dl" style={{ marginTop: ".6rem" }}>
              <dt>Buy (assumed)</dt><dd>{money(plan.costs.buy)}</dd><dt>GA tax</dt><dd>{money(plan.costs.tax)}</dd>
              <dt>Recon + detail</dt><dd>{money(plan.costs.recon + plan.costs.detail)}</dd><dt>List / expect</dt><dd>{money(plan.listPrice)} / {money(plan.expectedSale)}</dd>
              <dt>Profit (hypothetical)</dt><dd className="pos">{money(plan.profit)}</dd>
            </dl>
            <div className="cf-msg">{plan.listing}</div>
            <ul className="cf-dotlist" style={{ marginTop: ".5rem" }}>{[...plan.photos.repairsBeforeListing.map((r: string) => `Repair: ${r}`), ...plan.photos.prep].map((p: string) => <li key={p}><span className="dot" /> {p}</li>)}</ul>
          </>}
        </div>
      )}
    </div>
  );
}
