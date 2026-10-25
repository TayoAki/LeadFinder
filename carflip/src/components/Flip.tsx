"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon.tsx";

type Row = Record<string, any>;
const money = (n: number | null | undefined) => (n === null || n === undefined ? "—" : `$${Math.round(n).toLocaleString()}`);
const short = (t: string) => t.split("·")[0].trim();
const label = (v: string | null | undefined) => (v ? v.replace(/_/g, " ") : "—");
const gap = (n: number | null | undefined) => (n === null || n === undefined ? "—" : `${n > 0 ? "+" : "−"}$${Math.abs(Math.round(n)).toLocaleString()}`);
const reviewed = (r: Row) => (r.photo_count_available ? `${r.photo_count_reviewed ?? 0}/${r.photo_count_available} photos` : "");

const STEPS = [
  { key: "find", t: "Find", h: "Private-seller listings", p: "Facebook Marketplace cars near you, with dealers, bikes and new-car listings filtered out." },
  { key: "value", t: "Value", h: "KBB values and discounts", p: "KBB fair purchase price for the closest trim, unadjusted, ranked by dollar gap (value minus asking). Every value keeps its source, capture time and assumptions." },
  { key: "inspect", t: "Inspect", h: "Photos and descriptions", p: "The top 10 by dollar gap get a review of every photo and the description. Only complete, evidence-backed \"promising\" reviews survive; there is no fixed count." },
  { key: "buy", t: "Buy", h: "Offers and negotiation", p: "Opening offers at 80% of asking (policy, not a guess). With no ceiling set, counters are recorded and never accepted. Drafts only: you send them." },
  { key: "sell", t: "Sell", h: "Photos, listing and profit", p: "Hypothetical profit = resale − purchase − supplied repairs − 6.25% tax on purchase. Costs nobody supplied are listed, not counted as zero." },
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
  const [picked, setPicked] = useState<string[]>([]);
  const [search, setSearch] = useState({ city: "atlanta", radiusMiles: 60, target: 40, minPrice: 1500, maxPrice: 25000 });

  const refresh = async () => setRows(await tool("pipeline"));
  const run = async (label: string, fn: () => Promise<string | void>) => {
    setBusy(label); setError(null); setNote(null);
    try { const msg = await fn(); if (msg) setNote(msg); await refresh(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  };
  useEffect(() => { if (!detail && rows[0]) open(rows[0].id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
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

  const ids = picked.length ? { ids: picked } : {};
  const changeStep = (s: Step) => { setStep(s); setPicked([]); };
  const actions: Record<Step, { label: string; run: () => Promise<string | void> }> = {
    find: { label: "Find cars", run: async () => {
      const r = await tool("find_cars", search);
      return `Saved ${r.saved} new cars (${r.total} total). Skipped ${r.dealersOrOther} dealer or non-car listings.`;
    } },
    value: { label: "Look up KBB values", run: async () => {
      const r = await tool("value_cars", ids);
      return `Valued ${r.valued}. ${r.classics.length} classics (pre-1990) need a collector guide; ${r.missing.length} had no KBB match.`;
    } },
    inspect: { label: "Inspect top 10", run: async () => {
      const r = await tool("inspect_top", { top: 10, ...ids });
      return `Reviewed ${r.reviewed}; ${r.incomplete.length} still need a full photo review; ${r.survivors} survivors. ${r.note}`;
    } },
    buy: { label: "Draft offers", run: async () => {
      const drafted = await tool("draft_offers", ids);
      const skipped = picked.filter((id) => !shortlisted.some((r) => r.id === id)).length;
      return `Drafted ${drafted.length} opening offers${skipped ? `; ${skipped} selected cars aren't shortlisted, so no offer` : ""}. Send them yourself, then log replies.`;
    } },
    sell: { label: "Plan resale", run: async () => {
      const targets = picked.length ? picked : shortlisted.map((r) => r.id);
      for (const id of targets) await tool("plan_resale", { id });
      return `Planned resale for ${targets.length} cars. Figures are hypothetical.`;
    } },
  };

  const negotiations = rows.filter((r) => r.last_offer !== null);
  const panel = detail
    ? <CarPanel d={detail} step={step} onChange={async () => { await refresh(); await open(detail.car.id); }} />
    : <Summary rows={rows} shortlisted={shortlisted} />;

  // The step workflow: tabs, what the step does, its action and the cars at this step.
  const workflow = (
    <div className="cf-flow">
      <p className="cf-note" style={{ margin: 0 }}>Tick cars to run a step on just those, or run it on all. Open a car to move it forward on its own.</p>
      <nav className="cf-steps" aria-label="Steps">
        {STEPS.map((s, i) => (
          <button key={s.key} className={`cf-stepbtn ${step === s.key ? "active" : ""}`} onClick={() => changeStep(s.key)}>
            <span className="cf-stepnum">{done[s.key] ? "✓" : i + 1}</span>{s.t}
          </button>
        ))}
      </nav>
      <div>
        <h2 className="cf-h1" style={{ margin: "0 0 .3rem" }}>{meta.h}</h2>
        <p className="cf-note" style={{ margin: 0 }}>{meta.p}</p>
      </div>
      {busy && <p className="muted cf-note">{busy}… scrapes can take a few minutes.</p>}
      {error && <p className="error">{error}</p>}
      {note && <p className="pos cf-note">{note}</p>}
      {step === "find" && (
        <div className="cf-bar">
          {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
            <label key={k} className="field"><span className="cf-note">{k}</span>
              <input value={search[k]} onChange={(e) => setSearch({ ...search, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
            </label>
          ))}
        </div>
      )}
      <div className="card cf-action">
        <div>
          <strong>{done[step] ? `${meta.t} is done${nextStep ? `. Next: ${nextStep.t}` : ""}` : `Run step ${STEPS.indexOf(meta) + 1}: ${meta.t}`}</strong>
          <div className="muted cf-note">{list[step].length} cars at this step{step === "buy" ? " · drafts only, nothing is sent automatically" : ""}</div>
        </div>
        <div className="cf-actionbtns">
          <button className={`btn ${done[step] && !picked.length ? "" : "primary"}`} onClick={() => run(meta.t, actions[step].run)}>
            {picked.length && step !== "find" ? `${meta.t} ${picked.length} selected` : done[step] ? `${meta.t} all again` : actions[step].label}
          </button>
          {done[step] && nextStep && <button className="btn" onClick={() => changeStep(nextStep.key)}>Go to {nextStep.t}</button>}
        </div>
      </div>
      <CarList rows={list[step === "value" ? "find" : step === "inspect" ? "value" : step]} step={step} onOpen={open} selected={detail?.car.id}
        picked={picked} setPicked={step === "find" ? undefined : setPicked} />
    </div>
  );

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
                  <span className="side-sub muted">{money(r.price)}{r.discount !== null && ` · ${gap(r.discount)}`}{r.shortlisted ? " · ★" : ""}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="content">
        {view === "pipeline" && (
          <div className="content-body cf-center">
            {detail ? panel : <Summary rows={rows} shortlisted={shortlisted} />}
            {/* Below the right panel's breakpoint, the step workflow shows here instead */}
            <div className="cf-inline">{workflow}</div>
          </div>
        )}

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
            <p className="muted cf-lead">Hypothetical, using the article's method: resale (KBB value) − purchase − supplied repairs − 6.25% of purchase. Unprovided costs are listed per car, not assumed.</p>
            <div className="cf-cards">
              <Stat label="Shortlisted" value={String(shortlisted.length)} />
              <Stat label="Profit before unprovided costs" value={money(shortlisted.reduce((a, r) => a + (r.profit ?? 0), 0))} />
              <Stat label="Largest dollar gap" value={valued.length ? gap(Math.max(...valued.map((r) => r.discount))) : "—"} />
            </div>
            <CarTable rows={shortlisted} step="sell" onOpen={open} selected={detail?.car.id} />
            <RunLog />
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
      <aside className="aside cf-aside">{view === "pipeline" ? workflow : panel}</aside>

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
          {step !== "find" && <><th className="num">Value</th><th className="num">Gap</th></>}
          {(step === "inspect" || step === "buy" || step === "sell") && <th>Inspection</th>}
          {step === "buy" && <><th className="num">Offer</th><th className="num">Counter</th></>}
          {step === "sell" && <><th className="num">Resale</th><th className="num">Profit*</th></>}
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`cf-row ${selected === r.id ? "sel" : ""}`} onClick={() => onOpen(r.id)}>
              <td>{short(r.title)}<div className="cf-note">{r.city}</div></td>
              <td className="num">{money(r.price)}</td>
              <td className="num">{r.miles ? `${Math.round(r.miles / 1000)}k` : "—"}</td>
              {step !== "find" && <>
                <td className="num">{money(r.value)}</td>
                <td className={`num ${r.discount > 0 ? "pos" : "neg"}`}>{gap(r.discount)}</td>
              </>}
              {(step === "inspect" || step === "buy" || step === "sell") &&
                <td><span className={`v-${r.verdict}`}>{label(r.verdict)}</span>{r.shortlisted ? " ★" : ""}<div className="cf-note">{reviewed(r)}{r.review_method ? ` · ${r.review_method}` : ""}</div></td>}
              {step === "buy" && <><td className="num">{money(r.last_offer)}</td><td className="num">{money(r.last_counter)}</td></>}
              {step === "sell" && <><td className="num">{money(r.list_price)}</td><td className={`num ${r.profit > 0 ? "pos" : ""}`}>{money(r.profit)}</td></>}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={9} className="muted">Nothing here yet.</td></tr>}
        </tbody>
      </table>
      {step === "sell" && <p className="cf-note">* Profit before unprovided costs, at the latest counter or else the opening offer. Hypothetical.</p>}
    </div>
  );
}

function CarList({ rows, step, onOpen, selected, picked = [], setPicked }: { rows: Row[]; step: Step; onOpen: (id: string) => void; selected?: string;
  picked?: string[]; setPicked?: (ids: string[]) => void }) {
  const all = rows.length > 0 && rows.every((r) => picked.includes(r.id));
  return (
    <ul className="cf-carlist">
      {setPicked && rows.length > 0 && (
        <li className="cf-pickall">
          <label><input type="checkbox" checked={all} onChange={() => setPicked(all ? [] : rows.map((r) => r.id))} /> Select all ({rows.length})</label>
          {picked.length > 0 && <button className="btn" onClick={() => setPicked([])}>Clear {picked.length}</button>}
        </li>
      )}
      {rows.map((r) => (
        <li key={r.id} className="cf-carli">
          {setPicked && <input type="checkbox" aria-label={`Select ${short(r.title)}`} checked={picked.includes(r.id)}
            onChange={() => setPicked(picked.includes(r.id) ? picked.filter((x) => x !== r.id) : [...picked, r.id])} />}
          <button className={`cf-carrow ${selected === r.id ? "sel" : ""}`} onClick={() => onOpen(r.id)}>
            {r.photos[0] ? <img src={r.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-ph"><Icon name="image" size={18} /></span>}
            <span className="cf-carrowtext">
              <strong>{short(r.title)}{r.shortlisted ? " ★" : ""}</strong>
              <span className="cf-note">{money(r.price)}{r.value !== null && <> · value {money(r.value)} · <span className={r.discount > 0 ? "pos" : "neg"}>{gap(r.discount)}</span></>}</span>
              {step !== "find" && step !== "value" && r.verdict && <span className="cf-note"><span className={`v-${r.verdict}`}>{label(r.verdict)}</span>{r.photo_count_available ? ` · ${reviewed(r)}` : ""}</span>}
              {step === "buy" && <span className="cf-note">Offer {money(r.last_offer)} · counter {money(r.last_counter)}</span>}
              {step === "sell" && <span className="cf-note">Profit* {money(r.profit)} (before unprovided costs)</span>}
              {step === "find" && <span className="cf-note">{r.city}{r.miles ? ` · ${Math.round(r.miles / 1000)}k mi` : ""}</span>}
            </span>
          </button>
        </li>
      ))}
      {!rows.length && <li className="muted cf-note">Nothing here yet. Run this step.</li>}
    </ul>
  );
}

function RunLog() {
  const [runs, setRuns] = useState<Row[] | null>(null);
  return (
    <div>
      <h2 className="cf-h2">Run log</h2>
      <p className="muted cf-note">Every step: source, capture time and coverage. <button className="btn" onClick={async () => setRuns(await tool("run_log", { limit: 30 }))}>{runs ? "Refresh" : "Load"}</button></p>
      {runs && <div className="card cf-scroll"><table>
        <thead><tr><th>Step</th><th>Source</th><th>Finished</th><th>Report</th></tr></thead>
        <tbody>{runs.map((r) => (
          <tr key={r.id}><td>{r.step}</td><td>{r.source ?? "—"}</td><td className="cf-note">{r.finished_at ?? r.started_at}</td>
            <td className="cf-note">{Object.entries(r.report ?? {}).filter(([, v]) => typeof v !== "object").map(([k, v]) => `${k}: ${v}`).join(" · ")}</td></tr>
        ))}</tbody>
      </table></div>}
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
            <li><span className="dot dot-completed" /> {rows.filter((r) => r.photo_review_complete).length} fully reviewed</li>
            <li><span className="dot dot-running" /> {shortlisted.length} shortlisted</li>
          </ul>
        </div>
      </div>
      {best && <div>
        <div className="aside-heading">Biggest dollar gap</div>
        {best.photos[0] ? <img className="cf-asideimg" src={best.photos[0]} alt="" referrerPolicy="no-referrer" /> : <span className="cf-ph cf-asideimg"><Icon name="image" /></span>}
        <p style={{ margin: ".4rem 0 0" }}><strong>{short(best.title)}</strong></p>
        <p className="muted cf-note">{money(best.price)} vs {money(best.value)} ({gap(best.discount)}){best.verdict && <> · <span className={`v-${best.verdict}`}>{label(best.verdict)}</span></>}</p>
      </div>}
      <div>
        <div className="aside-heading">Shortlist</div>
        <ul className="cf-dotlist">
          {shortlisted.map((r) => <li key={r.id}><span className="dot dot-completed" /> {short(r.title)} · {money(r.price)}</li>)}
          {!shortlisted.length && <li className="muted">No complete promising review yet. Review every photo of the top 10.</li>}
        </ul>
      </div>
    </div>
  );
}

function CarPanel({ d, onChange, step }: { d: Row; onChange: () => Promise<void>; step: Step }) {
  const { car, thread } = d;
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const act = async (label: string, fn: () => Promise<string>) => {
    setBusy(label); setMsg(null);
    try { setMsg(await fn()); await onChange(); } catch (e) { setMsg(`Error: ${(e as Error).message}`); } finally { setBusy(null); }
  };
  const [reply, setReply] = useState("");
  const [counter, setCounter] = useState("");
  const [plan, setPlan] = useState<Row | null>(null);
  const [photos, setPhotos] = useState<string[] | null>(null);
  const lastOut = [...thread].reverse().find((t: Row) => t.direction === "out");
  return (
    <div className="cf-panelbody">
      <div>
        <div className="aside-heading">Selected car</div>
        <h1 className="cf-h1" style={{ margin: 0 }}>{short(car.title)}</h1>
        <span className="cf-note">{car.title.split("·")[1]?.trim()}{car.city ? ` · ${car.city}` : ""} · </span>
        <a className="cf-note" href={car.url} target="_blank" rel="noreferrer">Open listing ↗</a>
      </div>
      <div className="cf-photos">{car.photos.map((p: string, i: number) => (
        <a key={p} href={p} target="_blank" rel="noreferrer" className="cf-photo"><img src={p} alt={`Photo ${i + 1}`} referrerPolicy="no-referrer" /><span>#{i + 1}</span></a>
      ))}</div>
      <NextStep row={d.row ?? {}} car={car} thread={thread} busy={busy} msg={msg} act={act} />
      <div className="card aside-card">
        <dl className="aside-dl">
          <dt>Asking</dt><dd>{money(car.price)}</dd>
          <dt>Miles</dt><dd>{car.miles?.toLocaleString() ?? "—"}</dd>
          <dt>Value</dt><dd>{money(d.row?.value)}</dd>
          <dt>Gap</dt><dd>{gap(d.row?.discount)}</dd>
          <dt>Inspection</dt><dd className={`v-${d.row?.verdict}`}>{label(d.row?.verdict)}</dd>
          <dt>Reviewed</dt><dd>{d.row?.photo_count_available ? `${reviewed(d.row)}${d.row.description_reviewed ? " + description" : ""}` : "—"}</dd>
          <dt>Seller</dt><dd>{label(car.seller_type)}</dd>
          <dt>Captured</dt><dd className="cf-note">{car.captured_at ?? "—"}</dd>
        </dl>
      </div>
      {d.row?.value !== null && d.row?.value !== undefined && <details>
        <summary className="cf-note">Valuation source and assumptions</summary>
        <p className="cf-note">{label(d.row.value_type)} · captured {d.row.valued_at ?? "—"}{d.row.value_source && <> · <a href={d.row.value_source} target="_blank" rel="noreferrer">KBB ↗</a></>}{d.row.conditional ? " · conditional" : ""}</p>
        <ul className="cf-dotlist">{d.row.assumptions.map((a: string) => <li key={a}><span className="dot" /> {a}</li>)}</ul>
      </details>}
      {d.row?.evidence?.length > 0 && <div><div className="aside-heading">Evidence</div>
        <ul className="cf-dotlist">{d.row.evidence.map((e: Row, i: number) => <li key={i}><span className="dot" /> <span><strong>{e.source}</strong>: {e.note}</span></li>)}</ul></div>}
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
            {plan.scenarios.map((sc: Row) => (
              <dl key={sc.label} className="aside-dl" style={{ marginTop: ".6rem" }}>
                <dt><strong>{sc.label}</strong></dt><dd />
                <dt>Resale</dt><dd>{money(sc.resale)}</dd>
                <dt>Repairs</dt><dd>{sc.repairs === null ? "not supplied" : money(sc.repairs)}</dd>
                <dt>Tax 6.25%</dt><dd>${sc.tax.toFixed(2)}</dd>
                <dt>Profit before unprovided</dt><dd className={sc.profitBeforeUnprovided > 0 ? "pos" : "neg"}>${sc.profitBeforeUnprovided.toLocaleString(undefined, { minimumFractionDigits: 2 })}</dd>
              </dl>
            ))}
            <div className="aside-heading" style={{ marginTop: ".6rem" }}>Unprovided costs (not counted)</div>
            <ul className="cf-dotlist">{plan.unprovidedCosts.map((c: string) => <li key={c}><span className="dot dot-failed" /> {c}</li>)}</ul>
            <ul className="cf-dotlist">{plan.assumptions.map((a: string) => <li key={a} className="cf-note"><span className="dot" /> {a}</li>)}</ul>
            <div className="cf-msg">{plan.listing}</div>
            <ul className="cf-dotlist" style={{ marginTop: ".5rem" }}>{plan.photos.prep.map((p: string) => <li key={p}><span className="dot" /> {p}</li>)}</ul>
          </>}
        </div>
      )}
    </div>
  );
}

/** Where this one car is in the pipeline, and the button (or review form) that moves it to the next step. */
function NextStep({ row, car, thread, busy, msg, act }: { row: Row; car: Row; thread: Row[]; busy: string | null; msg: string | null;
  act: (label: string, fn: () => Promise<string>) => Promise<void> }) {
  const [verdict, setVerdict] = useState("promising");
  const [allPhotos, setAllPhotos] = useState(false);
  const [readDesc, setReadDesc] = useState(false);
  const [notes, setNotes] = useState("");
  const n = car.photos.length;
  const stage = row.value === null || row.value === undefined ? "value"
    : !row.photo_review_complete ? "inspect"
    : !row.shortlisted ? "held"
    : !thread.length ? "buy" : "sell";
  const track = ["Find", "Value", "Inspect", "Buy", "Sell"];
  const at = { value: 1, inspect: 2, held: 2, buy: 3, sell: 4 }[stage];
  const review = (
    <div className="cf-review">
      <div className="cf-note">Your review. It only counts if you looked at all {n} photos and read the description; only "promising" goes to the shortlist.</div>
      <label className="field"><span className="cf-note">Verdict</span>
        <select value={verdict} onChange={(e) => setVerdict(e.target.value)}>
          {["promising", "needs_review", "cheap_for_reason", "sold"].map((v) => <option key={v} value={v}>{label(v)}</option>)}
        </select>
      </label>
      <label className="cf-check"><input type="checkbox" checked={allPhotos} onChange={(e) => setAllPhotos(e.target.checked)} /> I looked at all {n} photos</label>
      <label className="cf-check"><input type="checkbox" checked={readDesc} onChange={(e) => setReadDesc(e.target.checked)} /> I read the description</label>
      <label className="field"><span className="cf-note">What you saw, one per line (e.g. "#6: VIN label matches")</span>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <button className="btn primary" disabled={!notes.trim() || !!busy} onClick={() => act("Saving review", async () => {
        const lines = notes.split("\n").map((l) => l.trim()).filter(Boolean);
        const r = await tool("record_inspection", { id: car.id, verdict, photo_count_reviewed: allPhotos ? n : 0, description_reviewed: readDesc,
          evidence: lines.map((l) => { const m = l.match(/^(#[\d\-, #]+|description)\s*:\s*(.+)$/i);
            return m ? { source: m[1].startsWith("#") ? `photo ${m[1]}` : "description", note: m[2] } : { source: "manual review", note: l }; }) });
        setNotes("");
        return r.shortlisted.includes(car.id) ? "Saved. On the shortlist; next: draft an offer."
          : r.complete ? `Saved as ${label(r.verdict)}. Not shortlisted (only promising goes forward).`
          : "Saved, but incomplete: tick both boxes once you've seen every photo and the description.";
      })}>Save review</button>
    </div>
  );
  return (
    <div className="card cf-next">
      <div className="aside-heading">Move this car forward</div>
      <ol className="cf-track">{track.map((t, i) => <li key={t} className={i < at ? "done" : i === at ? "now" : ""}>{t}</li>)}</ol>
      {stage === "value" && <button className="btn primary" disabled={!!busy} onClick={() => act("Valuing", async () => {
        const r = await tool("value_cars", { ids: [car.id] });
        return r.valued ? "Valued. Next: review its photos." : `No value: ${r.missing[0]?.reason ?? "no KBB match"}`;
      })}>Look up KBB value (about $0.20)</button>}
      {stage === "inspect" && <>
        <button className="btn" disabled={!!busy} onClick={() => act("Checking", async () => {
          const r = await tool("inspect_top", { ids: [car.id] });
          return `Automatic check: ${r.note}`;
        })}>Run automatic check</button>
        {review}
      </>}
      {stage === "held" && <>
        <p className="cf-note">Reviewed as <span className={`v-${row.verdict}`}>{label(row.verdict)}</span>, so it stays out of the shortlist. Change your review to move it on.</p>
        {review}
      </>}
      {stage === "buy" && <button className="btn primary" disabled={!!busy} onClick={() => act("Drafting", async () => {
        const [o] = await tool("draft_offers", { ids: [car.id] });
        return o ? `Drafted: "${o.message}" Copy it below and send it yourself.` : "Not drafted.";
      })}>Draft opening offer (80% of asking)</button>}
      {stage === "sell" && <p className="cf-note">Offer drafted. Log the seller's reply below, then use Resale plan.</p>}
      {busy && <p className="cf-note">{busy}…</p>}
      {msg && <p className={`cf-note ${msg.startsWith("Error") ? "neg" : "pos"}`}>{msg}</p>}
    </div>
  );
}
