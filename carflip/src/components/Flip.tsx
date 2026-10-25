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
type View = "pipeline" | "chat" | "negotiations" | "report" | "settings";
type Filter = "all" | Step;

async function tool(name: string, args: Row = {}) {
  const res = await fetch(`/api/tools/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
  return body;
}

export default function Flip({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [view, setView] = useState<View>("pipeline");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [search, setSearch] = useState({ city: "atlanta", radiusMiles: 60, target: 40, minPrice: 1500, maxPrice: 25000 });

  const refresh = async () => {
    const next = await tool("pipeline");
    setRows(next);
    if (detail) setDetail({ ...detail, row: next.find((r: Row) => r.id === detail.car.id) });
  };
  const run = async (label: string, fn: () => Promise<string | void>) => {
    setBusy(label); setError(null); setNote(null);
    try { const msg = await fn(); if (msg) setNote(msg); await refresh(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(null); }
  };
  const open = async (id: string) => {
    const [car, thread, repairs] = await Promise.all([tool("get_car", { id }), tool("offer_thread", { id }), tool("get_repair_estimate", { id })]);
    setDetail({ car, thread, repairs, row: rows.find((r) => r.id === id) });
    setView("pipeline");
  };
  const reopen = async () => { const next = await tool("pipeline"); setRows(next); if (detail) {
    const [car, thread, repairs] = await Promise.all([tool("get_car", { id: detail.car.id }), tool("offer_thread", { id: detail.car.id }), tool("get_repair_estimate", { id: detail.car.id })]);
    setDetail({ car, thread, repairs, row: next.find((r: Row) => r.id === detail.car.id) });
  } };

  const valued = rows.filter((r) => r.value !== null);
  const shortlisted = rows.filter((r) => r.shortlisted);
  const count = (s: Step) => rows.filter((r) => r.stage === s).length;
  const visible = filter === "all" ? rows : rows.filter((r) => r.stage === filter);
  const meta = filter === "all" ? null : STEPS.find((s) => s.key === filter)!;
  const ids = picked.length ? { ids: picked } : {};

  const moveTo = (targets: string[], to: Step) => run(`Moving to ${to}`, async () => {
    const res: Row[] = await tool("move_to_stage", { ids: targets, to });
    const blocked = res.filter((r) => !r.ok);
    setPicked([]);
    return `Moved ${res.length - blocked.length} of ${res.length} to ${label(to)}.${blocked.length ? ` ${blocked.length} stayed put: ${blocked[0].note}` : ""}`;
  });
  const estimate = (targets: string[]) => run("Estimating repairs", async () => {
    const res: Row[] = await tool("estimate_repairs", { ids: targets });
    const failed = res.filter((r) => r.error);
    return `Estimated repairs for ${res.length - failed.length} cars.${failed.length ? ` ${failed.length} skipped: ${failed[0].error}` : ""}`;
  });

  // What each stage's main button does, on the ticked cars or on every car in that stage.
  const actions: Record<Step, { label: string; run: () => Promise<string | void> }> = {
    find: { label: "Find cars", run: async () => {
      const r = await tool("find_cars", search);
      return `Saved ${r.saved} new cars (${r.total} total). Skipped ${r.dealersOrOther} dealer or non-car listings.`;
    } },
    value: { label: "Look up KBB values", run: async () => {
      const r = await tool("value_cars", ids);
      return `Valued ${r.valued}. ${r.classics.length} classics (pre-1990) need a collector guide; ${r.missing.length} had no KBB match.`;
    } },
    inspect: { label: "Check top 10", run: async () => {
      const r = await tool("inspect_top", { top: 10, ...ids });
      return `Checked ${r.reviewed}; ${r.incomplete.length} still need a full photo review; ${r.survivors} on the shortlist. ${r.note}`;
    } },
    buy: { label: "Draft offers", run: async () => {
      const drafted = await tool("draft_offers", ids);
      return `Drafted ${drafted.length} opening offers. Send them yourself, then log replies.`;
    } },
    sell: { label: "Plan resale", run: async () => {
      const targets = picked.length ? picked : shortlisted.map((r) => r.id);
      for (const id of targets) await tool("plan_resale", { id });
      return `Planned resale for ${targets.length} cars. Figures are hypothetical.`;
    } },
  };

  const context = [
    detail ? `viewing ${detail.car.title} (id ${detail.car.id})` : "viewing the car list",
    `filter: ${filter}`,
    picked.length ? `ticked: ${picked.map((id) => `${short(rows.find((r) => r.id === id)?.title ?? id)} (${id})`).join(", ")}` : "",
  ].filter(Boolean).join("; ");
  const chat = <Chat context={context} onTools={reopen} />;

  const center = detail ? (
    <div className="content-body cf-center">
      <button className="btn cf-back" onClick={() => setDetail(null)}>← Back to list</button>
      <CarPanel d={detail} step={detail.row?.stage ?? "find"} onChange={reopen} onEstimate={() => estimate([detail.car.id])} />
    </div>
  ) : (
    <div className="content-body cf-center cf-listview">
      {/* Stage filter: what's in each stage */}
      <nav className="cf-filters" aria-label="Filter by stage">
        <button className={`cf-filter ${filter === "all" ? "active" : ""}`} onClick={() => { setFilter("all"); setPicked([]); }}>
          <span className="cf-filtercount">{rows.length}</span>All
        </button>
        {STEPS.map((s) => (
          <button key={s.key} className={`cf-filter ${filter === s.key ? "active" : ""}`} onClick={() => { setFilter(s.key); setPicked([]); }}>
            <span className="cf-filtercount">{count(s.key) ? `✓ ${count(s.key)}` : "0"}</span>{s.t}
          </button>
        ))}
      </nav>

      <div className="cf-stagehead">
        <div>
          <h1 className="cf-h1" style={{ margin: 0 }}>{meta ? meta.h : "All cars"}</h1>
          <p className="cf-note" style={{ margin: ".2rem 0 0" }}>{meta ? meta.p : "Ranked by dollar gap (KBB value − asking). Tick cars to move them, or use each car's Stage menu. Click a car for details."}</p>
        </div>
        {meta && <button className="btn primary" onClick={() => run(meta.t, actions[meta.key].run)}>
          {picked.length && meta.key !== "find" ? `${actions[meta.key].label}: ${picked.length} selected` : actions[meta.key].label}
        </button>}
      </div>
      {filter === "find" && (
        <div className="cf-bar">
          {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
            <label key={k} className="field"><span className="cf-note">{k}</span>
              <input value={search[k]} onChange={(e) => setSearch({ ...search, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
            </label>
          ))}
        </div>
      )}
      {busy && <p className="muted cf-note">{busy}… KBB lookups and scrapes can take a few minutes.</p>}
      {error && <p className="error">{error}</p>}
      {note && <p className="pos cf-note">{note}</p>}

      {picked.length > 0 && (
        <div className="card cf-bulk">
          <strong>{picked.length} selected</strong>
          <span className="cf-note">Move to</span>
          {STEPS.map((s) => <button key={s.key} className="btn" disabled={!!busy} onClick={() => moveTo(picked, s.key)}>{s.t}</button>)}
          <button className="btn" disabled={!!busy} onClick={() => estimate(picked)}>Estimate repairs (AI)</button>
          <button className="btn" onClick={() => setPicked([])}>Clear</button>
        </div>
      )}

      <CarTable rows={visible} picked={picked} setPicked={setPicked} onOpen={open} onMove={(id, to) => moveTo([id], to)} busy={!!busy} />
    </div>
  );

  return (
    <div className={`app ${busy ? "cf-busy" : ""}`}>
      {/* Left rail */}
      <nav className="rail" aria-label="Sections">
        <span className="rail-logo">CF</span>
        {([["pipeline", "home", "Pipeline"], ["chat", "search", "Chat"], ["negotiations", "bell", "Offers"], ["report", "doc", "Report"], ["settings", "gear", "Settings"]] as const).map(([v, icon, text]) => (
          <button key={v} className={`rail-item cf-railbtn ${v === "chat" ? "cf-chatrail" : ""} ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
            <Icon name={icon} /><span className="rail-label">{text}</span>
            {v === "negotiations" && rows.some((r) => r.last_counter) && <span className="cf-badge" />}
          </button>
        ))}
        <span className="rail-avatar"><Icon name="user" size={18} /></span>
      </nav>

      {/* Sidebar: every car */}
      <aside className="side">
        <button className="side-cta cf-sidebtn" onClick={() => { setView("pipeline"); setDetail(null); setFilter("find"); }}>
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
                  <span className="side-sub muted">{money(r.price)}{r.discount !== null && ` · ${gap(r.discount)}`} · {label(r.stage)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="content">
        {view === "pipeline" && center}
        {view === "chat" && <div className="content-body cf-center">{chat}</div>}

        {view === "negotiations" && (
          <div className="content-body">
            <h1 className="cf-h1">Negotiations</h1>
            <p className="muted cf-lead">Every car with a drafted offer. Open one to copy the message, log the seller's reply and get the next counter.</p>
            <CarTable rows={rows.filter((r) => r.last_offer !== null)} picked={[]} onOpen={open} busy={!!busy} />
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
            <CarTable rows={shortlisted} picked={[]} onOpen={open} busy={!!busy} />
            <RunLog />
          </div>
        )}

        {view === "settings" && (
          <div className="content-body">
            <h1 className="cf-h1">Settings</h1>
            <p className="muted cf-lead">Search defaults for step 1. Keys are read from the server's environment, never from the browser.</p>
            <div className="card cf-settings">
              {(["city", "radiusMiles", "target", "minPrice", "maxPrice"] as const).map((k) => (
                <label key={k} className="field"><span>{k}</span>
                  <input value={search[k]} onChange={(e) => setSearch({ ...search, [k]: k === "city" ? e.target.value : Number(e.target.value) })} />
                </label>
              ))}
              <p className="cf-note">Chat and AI repair estimates need <code>ANTHROPIC_API_KEY</code> on the server. MCP: connect any MCP client to <code>bin/mcp.ts</code>.</p>
            </div>
          </div>
        )}
      </main>

      {/* Right side bar: AI chat */}
      <aside className="aside cf-aside">{chat}</aside>

      {/* Bottom bar */}
      <footer className="bottombar">
        <span className="muted">{search.city} · {search.radiusMiles} mi · {STEPS.map((s) => `${count(s.key)} ${s.t.toLowerCase()}`).join(" · ")}</span>
        <span className="bottombar-right muted">{busy ? `${busy}…` : "Ready"} · Offers are drafts only</span>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card"><div className="muted cf-note">{label}</div><div className="aside-big">{value}</div></div>;
}

function CarTable({ rows, picked, setPicked, onOpen, onMove, busy }: { rows: Row[]; picked: string[]; setPicked?: (ids: string[]) => void;
  onOpen: (id: string) => void; onMove?: (id: string, to: Step) => void; busy: boolean }) {
  const all = rows.length > 0 && rows.every((r) => picked.includes(r.id));
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div className={`card cf-scroll cf-table ${setPicked ? "has-check" : ""}`}>
      <table>
        <thead><tr>
          {setPicked && <th className="cf-pin cf-pin-check"><input type="checkbox" aria-label="Select all" checked={all} onChange={() => setPicked(all ? [] : rows.map((r) => r.id))} /></th>}
          <th className="cf-pin cf-pin-car">Car</th><th className="cf-pin cf-pin-stage">Stage</th><th className="num">Ask</th><th className="num">Value</th><th className="num">Gap</th>
          <th className="num">Offer</th><th className="num">Est. repairs</th><th>Review</th><th className="num">Profit*</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`cf-row ${picked.includes(r.id) ? "sel" : ""}`} onClick={() => onOpen(r.id)}>
              {setPicked && <td className="cf-pin cf-pin-check" onClick={stop}><input type="checkbox" aria-label={`Select ${short(r.title)}`} checked={picked.includes(r.id)}
                onChange={() => setPicked(picked.includes(r.id) ? picked.filter((x) => x !== r.id) : [...picked, r.id])} /></td>}
              <td className="cf-pin cf-pin-car">
                <div className="cf-carcell"><strong>{short(r.title)}{r.shortlisted ? " ★" : ""}</strong>
                  <span className="cf-note">{r.city?.replace(/, GA$/, "")}{r.miles ? ` · ${Math.round(r.miles / 1000)}k mi` : ""}</span></div>
              </td>
              <td className="cf-pin cf-pin-stage" onClick={stop}>
                {onMove ? <select className="cf-stagesel" value={r.stage} disabled={busy} aria-label="Move to stage" onChange={(e) => onMove(r.id, e.target.value as Step)}>
                  {STEPS.map((s) => <option key={s.key} value={s.key}>{s.t}</option>)}
                </select> : label(r.stage)}
              </td>
              <td className="num">{money(r.price)}</td>
              <td className="num">{money(r.value)}</td>
              <td className={`num ${r.discount > 0 ? "pos" : "neg"}`}>{gap(r.discount)}</td>
              <td className="num">{money(r.last_offer)}{r.last_counter ? <div className="cf-note">counter {money(r.last_counter)}</div> : null}</td>
              <td className="num">{r.repair_high !== null && r.repair_high !== undefined
                ? <span title={`${r.repair_method} estimate, not a quote`}>{r.repair_high === 0 ? "none seen" : `${money(r.repair_low)}–${money(r.repair_high)}`}</span> : "—"}</td>
              <td className="cf-nowrap"><span className={`v-${r.verdict}`}>{label(r.verdict)}</span>
                {r.photo_count_available ? <div className="cf-note">{r.photo_count_reviewed ?? 0}/{r.photo_count_available} photos</div> : null}</td>
              <td className={`num ${r.profit > 0 ? "pos" : ""}`}>{money(r.profit)}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={10} className="muted">No cars in this stage.</td></tr>}
        </tbody>
      </table>
      <p className="cf-note">Gap = KBB value − asking. Est. repairs are estimates from the evidence, not quotes. * Profit before unprovided costs, hypothetical.</p>
    </div>
  );
}

function Chat({ context, onTools }: { context: string; onTools: () => Promise<void> }) {
  const [history, setHistory] = useState<unknown[]>([]);
  const [log, setLog] = useState<Array<{ who: "you" | "ai" | "error"; text: string; used?: Row[] }>>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async (msg: string) => {
    if (!msg.trim() || busy) return;
    setLog((l) => [...l, { who: "you", text: msg }]); setText(""); setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ history, text: msg, context }) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setHistory(body.messages);
      setLog((l) => [...l, { who: "ai", text: body.reply, used: body.used }]);
      if (body.used?.length) await onTools();
    } catch (e) { setLog((l) => [...l, { who: "error", text: (e as Error).message }]); }
    finally { setBusy(false); }
  };
  const suggestions = ["Which cars look worth buying, and why?", "Estimate repairs for the car I'm viewing", "Why isn't the Maxima shortlisted?", "Draft an offer for the Elantra"];
  return (
    <div className="cf-chat">
      <div className="aside-heading">Ask CarFlip</div>
      <div className="cf-chatlog">
        {!log.length && <>
          <p className="cf-note">Ask about any car or tell it to move cars along. It uses the same tools as the app, and it asks before spending Apify or API credit.</p>
          {suggestions.map((s) => <button key={s} className="cf-suggest" onClick={() => send(s)}>{s}</button>)}
        </>}
        {log.map((m, i) => (
          <div key={i} className={`cf-bubble cf-${m.who}`}>
            <div className="cf-msgtext">{m.text}</div>
            {m.used && m.used.length > 0 && <div className="cf-note">Used: {m.used.map((u) => `${u.name}${u.ok ? "" : " (failed)"}`).join(", ")}</div>}
          </div>
        ))}
        {busy && <div className="cf-bubble cf-ai cf-note">Thinking…</div>}
      </div>
      <form className="cf-chatform" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <textarea rows={2} value={text} placeholder="Ask about a car, or say “move the Elantra to Buy”" onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }} />
        <button className="btn primary" disabled={busy || !text.trim()}>Send</button>
      </form>
      <p className="cf-note" style={{ margin: 0 }}>Context sent: {context}</p>
    </div>
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

function CarPanel({ d, onChange, step, onEstimate }: { d: Row; onChange: () => Promise<void>; step: Step; onEstimate: () => Promise<void> }) {
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
      <RepairBox est={d.repairs} reviewed={!!d.row?.review_method} onEstimate={onEstimate} />
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

/** Repair estimate for one car: each item with the evidence it rests on, plus what the evidence can't show. */
function RepairBox({ est, reviewed, onEstimate }: { est: Row | null; reviewed: boolean; onEstimate: () => Promise<void> }) {
  return (
    <div className="card aside-card">
      <div className="aside-heading">Estimated repairs</div>
      {est ? <>
        <div className="aside-big" style={{ fontSize: "1.4rem" }}>{est.high === 0 ? "None evidenced" : `${money(est.low)} – ${money(est.high)}`}</div>
        <p className="cf-note">{est.method === "ai" ? `AI estimate (${est.model})` : `${label(est.method)} estimate`} from the inspection evidence, {est.estimated_at}. Not a quote.</p>
        {est.items.length > 0 && <table><tbody>{est.items.map((i: Row) => (
          <tr key={i.item}><td>{i.item}<div className="cf-note">{i.basis}</div></td><td className="num">{money(i.low)}–{money(i.high)}</td></tr>
        ))}</tbody></table>}
        {est.not_assessed.length > 0 && <p className="cf-note">Not assessed (not priced): {est.not_assessed.join(", ")}</p>}
        {est.assumptions.length > 0 && <p className="cf-note">Assumes: {est.assumptions.join("; ")}</p>}
      </> : <p className="cf-note">{reviewed ? "No estimate yet." : "Review the car first: estimates are built from its inspection evidence."}</p>}
      {reviewed && <button className="btn" onClick={onEstimate}>{est ? "Re-estimate with AI" : "Estimate with AI"}</button>}
    </div>
  );
}
