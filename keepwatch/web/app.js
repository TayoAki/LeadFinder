// Keepwatch UI. Plain ES modules, no build step. Hash routes:
//   #/overview  #/rival/:id  #/hooks  #/rebuild[/:adId]  #/test  #/search  #/alerts  #/library  #/settings
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtNum = n => (n ?? 0).toLocaleString();
const SERIES = { video: 'var(--s1)', static: 'var(--s2)', carousel: 'var(--s3)' }; // fixed by entity, never by rank
const FORMAT_NAME = { video: 'Video', static: 'Static image', carousel: 'Carousel' };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked: fine */ } },
};

const state = { me: null, status: {}, ws: {}, rivals: [], overview: null, videos: {}, workspaces: [] };

// ---------- API ----------
async function api(path, opts = {}) {
  const res = await fetch(path, { ...opts, headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (res.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.hash); return new Promise(() => {}); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

/** Start a server job and poll it to completion. */
async function runJob(path, body, label) {
  toast(`${label}…`);
  const job = await api(path, { method: 'POST', body });
  return pollJob(job.id);
}
async function pollJob(jobId) {
  const job = { id: jobId };
  for (;;) {
    await new Promise(r => setTimeout(r, 2000));
    const j = await api(`/api/jobs/${job.id}`);
    if (j.status === 'done') return j.result;
    if (j.status === 'failed') throw new Error(j.error);
  }
}

function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms);
}

// ---------- shared pieces ----------
const initials = name => esc((name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase());
const avatar = r => r?.avatar_url
  ? `<img class="avatar" src="${esc(r.avatar_url)}" alt="" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'avatar',textContent:'${initials(r.name)}'}))">`
  : `<span class="avatar">${initials(r?.name)}</span>`;

const runLabel = a => a.is_active ? `Live ${a.run_days} days` : `Ran ${a.run_days} days`;
const pileText = a => ({ kept: 'Kept', testing: 'Testing', killed: 'Killed', retired: 'Retired' }[a.pile] || '');

function thumb(a, { badge = true } = {}) {
  const src = a.image_url || a.thumb_url;
  return `<div class="ad-thumb">
    ${src ? `<img src="${esc(src)}" alt="${esc(a.rival_name)} ad" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}
    <div class="ph" ${src ? 'style="z-index:-1"' : ''}>${esc(a.title || a.hook || 'No preview')}</div>
    ${badge ? `<span class="badge">${esc(runLabel(a))}</span><span class="badge fmt">${esc(a.format_label)}</span>` : ''}
  </div>`;
}

function adCard(a, { cta = 'Steal this ad' } = {}) {
  return `<article class="card ad">
    <button class="ad-open" data-ad="${esc(a.id)}" style="all:unset;cursor:pointer;display:block" aria-label="Open ad">${thumb(a)}</button>
    <div class="ad-body">
      <span class="who">${esc(a.rival_name)} · ${esc(pileText(a))}${a.angle_label ? ` · ${esc(a.angle_label)}` : ''}</span>
      <span class="hook">${esc(a.hook || a.title || '—')}</span>
      <div class="actions row"><button class="btn sm primary" data-steal="${esc(a.id)}">${esc(cta)}</button></div>
    </div>
  </article>`;
}

const sectionHead = (title, sub, right = '') => `<div class="section-head"><div><h2>${esc(title)}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${right}</div>`;
const empty = msg => `<div class="card empty">${msg}</div>`;
const longDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

// ---------- survival chart (inline SVG, sqrt day axis so early drop-offs are visible) ----------
function survivalChart(series) {
  const W = 640, H = 260, L = 40, R = 70, T = 14, B = 30;
  const maxDay = Math.max(30, ...series.map(s => s.curve.at(-1)?.day || 0));
  const x = d => L + Math.sqrt(d / maxDay) * (W - L - R);
  const y = p => T + (1 - p / 100) * (H - T - B);
  const ticks = [1, 7, 30, 90, 180, 365].filter(d => d <= maxDay);
  const tickName = d => ({ 1: '1d', 7: '1w', 30: '30d', 90: '90d', 180: '180d', 365: '1y' }[d]);
  const step = c => c.map((p, i) => (i ? `H${x(p.day).toFixed(1)}V${y(p.pct).toFixed(1)}` : `M${x(p.day).toFixed(1)},${y(p.pct).toFixed(1)}`)).join('');
  const sAt = (s, d) => { let v = 100; for (const p of s.curve) { if (p.day <= d) v = p.pct; else break; } return v; };
  // Direct labels at the right end, nudged apart so they never collide.
  const ends = series.map(s => ({ s, y: y(s.curve.at(-1).pct) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
  const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of ads still live by day, per format">
    <g class="grid">${[0, 50, 100].map(p => `<line x1="${L}" x2="${W - R}" y1="${y(p)}" y2="${y(p)}"/>`).join('')}</g>
    <g class="axis">${[0, 50, 100].map(p => `<text x="${L - 8}" y="${y(p) + 4}" text-anchor="end">${p}%</text>`).join('')}
      ${ticks.map(d => `<text x="${x(d)}" y="${H - 8}" text-anchor="middle">${tickName(d)}</text>`).join('')}</g>
    <g class="marker"><line x1="${x(30)}" x2="${x(30)}" y1="${T}" y2="${H - B}"/><text x="${x(30) + 5}" y="${T + 10}">Day 30</text></g>
    <g class="series">${series.map(s => `<path d="${step(s.curve)}" stroke="${SERIES[s.format] || 'var(--ink-3)'}"/>`).join('')}</g>
    <g class="axis">${ends.map(e => `<text x="${W - R + 6}" y="${e.y + 4}" style="fill:var(--ink-2);font-weight:600">${esc(e.s.label)}</text>`).join('')}</g>
    <line class="xh" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="var(--ink-3)" visibility="hidden"/>
    <rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent" class="hit"/>
  </svg>`;
  const id = 'c' + Math.random().toString(36).slice(2, 8);
  queueMicrotask(() => {
    const wrap = document.getElementById(id); if (!wrap) return;
    const svgEl = $('svg', wrap), hit = $('.hit', wrap), xh = $('.xh', wrap), tip = $('.tip', wrap);
    hit.addEventListener('pointermove', e => {
      const box = svgEl.getBoundingClientRect();
      const px = (e.clientX - box.left) * (W / box.width);
      const d = Math.round(Math.pow(Math.max(0, (px - L) / (W - L - R)), 2) * maxDay);
      xh.setAttribute('x1', x(d)); xh.setAttribute('x2', x(d)); xh.setAttribute('visibility', 'visible');
      tip.hidden = false;
      tip.style.left = `${(x(d) / W) * box.width}px`; tip.style.top = `${(T / H) * box.height + 8}px`;
      tip.innerHTML = `Day ${d}: ` + series.map(s => `${esc(s.label)} ${sAt(s, d)}%`).join(' · ');
    });
    hit.addEventListener('pointerleave', () => { xh.setAttribute('visibility', 'hidden'); tip.hidden = true; });
  });
  return `<div class="chart-wrap chart" id="${id}">${svg}<div class="tip" hidden></div>
    <div class="legend">${series.map(s => `<span><i style="background:${SERIES[s.format]}"></i>${esc(s.label)} (n=${s.n})</span>`).join('')}</div></div>`;
}

function survivalSentence(s) {
  if (s.n < 3) return `${s.label}: only ${s.n} ads, too few to read.`;
  const half = s.median != null ? `Half are turned off by day ${s.median}.` : `More than half are still live at the end of the sample.`;
  return `${s.label}: ${half} ${s.at[90]}% make it to day 90.${s.confidence === 'thin' ? ' (Thin sample.)' : ''}`;
}

// ---------- views ----------
async function viewOverview() {
  const [ov, rivals, formats] = await Promise.all([api('/api/overview'), api('/api/rivals'), api('/api/formats')]);
  if (!state.rivals.length) return onboarding();
  if (!ov.counted) return empty(`Collecting your rivals' ads. This takes a minute or two; refresh shortly.`);
  const surv = formats.survival.filter(s => s.n >= 3);
  const lg = formats.league;
  return `
  <section class="section">
    ${sectionHead('Kept, killed and launched this week', `${ov.rivals} rivals, ${fmtNum(ov.counted)} creatives counted. ${esc(longDate(ov.today))}.`)}
    <div class="kpis">
      <div class="card kpi"><div class="label">Running</div><div class="value">${fmtNum(ov.running)}</div><div class="note">creatives live right now · ${fmtNum(ov.kept)} past 30 days</div></div>
      <div class="card kpi"><div class="label">Killed</div><div class="value">${fmtNum(ov.killed7)}</div><div class="note">stopped inside 30 days, in the last 7 days${ov.retired7 ? ` · ${ov.retired7} long-runners retired` : ''}</div></div>
      <div class="card kpi"><div class="label">New</div><div class="value">${fmtNum(ov.new7)}</div><div class="note">launched in the last 7 days</div></div>
    </div>
  </section>
  <section class="section">
    ${sectionHead('What each rival keeps', 'Their longest-running ad, and the format they bet on.')}
    <div class="grid-auto">${rivals.filter(r => r.longest).map(r => `
      <article class="card ad">
        <button class="ad-open" data-ad="${esc(r.longest.id)}" style="all:unset;cursor:pointer;display:block">${thumb(r.longest)}</button>
        <div class="ad-body"><span class="row">${avatar(r.rival)}<strong>${esc(r.rival.name)}</strong></span>
          <span class="muted">${r.keeps_format_label ? `Keeps ${esc(r.keeps_format_label.toLowerCase())}s` : 'Nothing kept past 30 days yet'}</span>
          <div class="actions row"><a class="btn sm" href="#/rival/${r.rival.id}">Playbook</a><button class="btn sm primary" data-steal="${esc(r.longest.id)}">Steal this ad</button></div></div>
      </article>`).join('')}</div>
  </section>
  <section class="section">
    ${sectionHead('The format league', `Which formats rivals keep paying for, and which they kill. Last ${lg.window_days} days, ${fmtNum(lg.counted)} creatives.`)}
    ${!lg.ranked ? `<div class="callout">Under 10 ads in the window: read this as a description, not a ranking.</div>` : ''}
    <div class="league">${lg.rows.map((r, i) => `
      <div class="card league-row">
        <span class="rank">${i + 1}</span>
        <div><div class="row"><strong>${esc(r.label)}</strong><span class="pill ${r.temp}">${r.temp === 'hot' ? 'Hot' : 'Cold'}</span>${r.confidence !== 'ok' ? `<span class="pill">thin sample</span>` : ''}</div>
          <div class="bar" title="${r.share}% still running"><span style="width:${r.share}%"></span></div>
          <span class="small muted">${r.share}% of ${fmtNum(r.n)} creatives still running · ${fmtNum(r.running)} running · ${fmtNum(r.killed)} killed · ${fmtNum(r.new)} new in 4 weeks</span></div>
        <div class="runs" title="Longest current runs">${r.top_runs.map(d => `<span>${d}d</span>`).join('')}</div>
      </div>`).join('')}</div>
  </section>
  <section class="section">
    ${sectionHead('How long each format lasts', 'Share of ads still live by day. Ads still running count as "at least this long".')}
    <div class="card pad">${surv.length ? survivalChart(surv) + `<ul class="list-plain" style="margin-top:12px">${surv.map(s => `<li>${esc(survivalSentence(s))}</li>`).join('')}</ul>` : 'Not enough ads yet.'}</div>
    <details style="margin-top:8px"><summary class="small muted">Table view</summary>
      <table class="table"><thead><tr><th>Format</th><th class="num">Ads</th><th class="num">Day 7</th><th class="num">Day 30</th><th class="num">Day 90</th><th class="num">Half off by</th></tr></thead>
      <tbody>${formats.survival.map(s => `<tr><td>${esc(s.label)}</td><td class="num">${s.n}</td><td class="num">${s.at[7]}%</td><td class="num">${s.at[30]}%</td><td class="num">${s.at[90]}%</td><td class="num">${s.median ?? '—'}</td></tr>`).join('')}</tbody></table></details>
  </section>`;
}

async function viewPlaybook(rivalId) {
  if (!rivalId) {
    const first = state.rivals[0]?.rival?.id;
    if (!first) return empty('Track a rival first.');
    location.hash = `#/rival/${first}`; return '';
  }
  const p = await api(`/api/rivals/${rivalId}/playbook`);
  if (p.error) return empty('Rival not found.');
  const sig = p.signature;
  const timeline = list => list.length ? `<div class="grid-auto">${list.map(a => adCard(a)).join('')}</div>` : `<p class="muted">None in this sample.</p>`;
  return `
  <section class="section">
    ${sectionHead(`${p.rival.name}'s playbook`, `${fmtNum(p.counted)} ads counted · tracked weekly`, `<a class="btn sm" href="https://www.facebook.com/ads/library/?view_all_page_id=${esc(p.rival.page_id)}" target="_blank" rel="noopener">Ad Library ↗</a>`)}
    <div class="card playbook-hero">
      ${sig ? `<button class="ad-open" data-ad="${esc(sig.id)}" style="all:unset;cursor:pointer">${thumb(sig)}</button>` : '<div></div>'}
      <div style="display:grid;gap:10px;align-content:start">
        <span class="eyebrow">Their read</span>
        <h3 style="font-size:20px">${esc(p.summary)}</h3>
        ${sig ? `<p class="sub">Signature ad: <q>${esc(sig.hook || sig.title)}</q> · ${esc(runLabel(sig))}</p>
        <div class="row"><button class="btn primary" data-steal="${esc(sig.id)}">Steal this ad</button><button class="btn" data-ad="${esc(sig.id)}">Read it</button></div>` : ''}
        <div class="tags">${p.angles.slice(0, 4).map(a => `<span class="pill">${esc(a.label)} · ${a.n}</span>`).join('')}</div>
      </div>
    </div>
  </section>
  <section class="section">${sectionHead('Kept: live 30+ days', 'Winners they keep paying for.')}${timeline(p.kept)}</section>
  <section class="section">${sectionHead('Tested and dropped', 'Stopped inside 30 days.')}${timeline(p.killed)}</section>
  <section class="section">${sectionHead('Ran for months, then rotated out', 'Ran 30+ days, then stopped. Often seasonal.')}${timeline(p.retired)}</section>
  <section class="section">${sectionHead('Testing now', 'Started recently, not yet judged.')}${timeline(p.testing)}</section>
  <section class="section">${sectionHead('How long each format lasts for them')}
    <div class="card pad"><table class="table"><thead><tr><th>Format</th><th class="num">Ads</th><th class="num">Kept</th><th class="num">Killed fast</th><th class="num">Live at day 30</th><th class="num">Half off by</th></tr></thead>
    <tbody>${p.formats.map(f => `<tr><td>${esc(f.label)}${f.confidence !== 'ok' ? ' <span class="pill">thin</span>' : ''}</td><td class="num">${f.n}</td><td class="num">${f.kept}</td><td class="num">${f.killed}</td><td class="num">${f.live_at_30}%</td><td class="num">${f.median_days ?? 'past sample'}</td></tr>`).join('')}</tbody></table></div>
  </section>`;
}

async function viewHooks() {
  const [hooks, angles] = await Promise.all([api('/api/hooks?limit=12'), api('/api/angles')]);
  const order = { open: 0, cooling: 1, warm: 2, crowded: 3 };
  angles.sort((a, b) => order[a.temp] - order[b.temp] || a.rivals_running - b.rivals_running);
  return `
  <section class="section">
    ${sectionHead('Hooks that lasted', 'Every opening line from an ad that ran 30+ days, with the ad it opens and how long it ran.')}
    <div style="display:grid;gap:10px">${hooks.length ? hooks.map(h => `
      <div class="card hook-row">
        <div class="days"><b>${h.run_days}</b><small>days${h.still_running ? ' and still running' : ' live'}</small></div>
        <div>${/^["“']/.test(h.hook) ? `<b>${esc(h.hook)}</b>` : `<q>${esc(h.hook)}</q>`}<div class="small muted" style="margin-top:4px">${esc(h.rival)} · ${esc(h.format_label)} · ${esc(h.angle_label)}${h.source === 'spoken' ? ' · spoken' : ''}</div></div>
        <div class="row"><button class="btn sm" data-ad="${esc(h.ad.id)}">See ad</button><button class="btn sm primary" data-steal="${esc(h.ad.id)}">Steal this hook</button></div>
      </div>`).join('') : empty('No ads past 30 days yet.')}</div>
  </section>
  <section class="section">
    ${sectionHead('Angles, by temperature', `Open ground means none of your ${state.rivals.length} rivals runs it. Say it first. These are hypotheses to test, not proof.`)}
    <div class="grid-auto">${angles.map(a => `
      <div class="card angle">
        <div class="row" style="justify-content:space-between"><h3>${esc(a.label)}</h3><span class="pill ${a.temp}">${esc(a.temp_label)}</span></div>
        <span class="small muted">${a.running} running across ${a.rivals_running} rival${a.rivals_running === 1 ? '' : 's'} · ${a.tried} tried and stopped</span>
        ${a.best ? `<span class="small">Longest: ${esc(a.best.rival_name)}, ${esc(runLabel(a.best).toLowerCase())}</span>` : ''}
        ${a.best ? `<button class="btn sm ${a.temp === 'open' ? '' : 'primary'}" data-steal="${esc(a.best.id)}">Make a ${esc(a.label.toLowerCase())} ad</button>`
          : `<span class="small muted">No rival example to adapt. Brief it from scratch.</span>`}
      </div>`).join('')}</div>
  </section>`;
}

const STATUS_PILL = { scaling: 'hot', refreshed: 'warm', testing: 'cold', retired: '', one_off: '' };
const miniStrip = list => `<div class="row" style="gap:6px;flex-wrap:wrap">${list.slice(0, 6).map(a => `
  <button class="btn sm" data-ad="${esc(a.id)}" title="${esc(a.hook || '')}">${a.is_active ? '● ' : ''}${esc(a.rival_name)} · ${a.run_days}d</button>`).join('')}</div>`;

async function viewPatterns() {
  const p = await api('/api/patterns');
  if (!p.counted) return empty('No ads collected yet. Track a few rivals first.');
  const best = r => [...r.examples].sort((a, b) => b.is_active - a.is_active || b.run_days - a.run_days)[0];
  return `
  <section class="section">
    ${sectionHead('What to make next', `Ranked by how many brands run the same thing, whether anyone keeps refreshing it, and how long it has lasted. From ${p.live} live ads of ${p.counted}.`)}
    <div style="display:grid;gap:10px">${p.recommendations.length ? p.recommendations.map((r, i) => `
      <div class="card pad" style="display:grid;gap:8px">
        <div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><h3>${i + 1}. ${r.kind === 'line' ? `<q>${esc(r.title)}</q>` : esc(r.title)}</h3>
          <span class="pill ${r.iterating.length ? 'hot' : ''}">${r.kind === 'line' ? 'Same line' : 'Same format'} · ${r.brands.length} brands</span></div>
        ${r.kind === 'format' && r.line ? `<span>Line brands share here: <q>${esc(r.line)}</q></span>` : ''}
        <span class="small muted">${esc(r.why)}</span>
        <span><b>Make:</b> ${esc(r.make)}</span>
        ${miniStrip(r.examples)}
        <div class="row"><button class="btn sm primary" data-steal="${esc(best(r).id)}">Make this</button><button class="btn sm" data-ad="${esc(best(r).id)}">See the best example</button></div>
      </div>`).join('') : empty('No pattern shared by two or more brands yet.')}</div>
  </section>
  <section class="section">
    ${sectionHead('Ideas each brand keeps refreshing', 'Ads grouped into one idea when Meta groups them or the copy says the same thing. Scaling means a version has lasted 14+ days and new versions launched in the last 14.')}
    <div style="display:grid;gap:10px">${p.iterating.length ? p.iterating.map(g => `
      <div class="card pad" style="display:grid;gap:10px"><h3>${esc(g.rival)} <span class="small muted">${g.concepts.length} idea${g.concepts.length === 1 ? '' : 's'} in rotation</span></h3>
        ${g.concepts.slice(0, 5).map(c => `<div style="display:grid;gap:6px;border-top:1px solid var(--line);padding-top:8px">
          <div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><q>${esc(c.hook)}</q><span class="pill ${STATUS_PILL[c.status]}">${esc(c.status === 'scaling' ? 'Scaling' : 'Refreshed')}</span></div>
          <span class="small muted">${c.versions} versions · ${c.live} live · ${c.fresh} new in 14 days · ${c.stopped} stopped · longest ${c.longest} days · first ${esc(c.first_launch || '?')}, latest ${esc(c.last_launch || '?')}</span>
          ${miniStrip(c.examples)}
          <div class="row"><button class="btn sm primary" data-steal="${esc(c.exemplar.id)}">Make my version</button></div>
        </div>`).join('')}
      </div>`).join('') : empty('No brand is running several versions of one idea right now.')}</div>
  </section>
  <section class="section">
    ${sectionHead('Same line, several brands', 'Live hooks that say nearly the same thing across different rivals.')}
    <div style="display:grid;gap:10px">${p.shared_hooks.length ? p.shared_hooks.map(h => `
      <div class="card hook-row"><div class="days"><b>${h.brands.length}</b><small>brands</small></div>
        <div><q>${esc(h.line)}</q><div class="small muted" style="margin-top:4px">${esc(h.brands.join(', '))} · ${h.live} live · longest ${h.longest} days</div></div>
        <div class="row"><button class="btn sm primary" data-steal="${esc(best(h).id)}">Make this</button></div></div>`).join('') : empty('No two brands share a line right now.')}</div>
  </section>
  <section class="section">
    ${sectionHead('Same format, several brands', 'Live ads by medium and structure. "Statement" is the catch-all for copy that fits no clearer structure.')}
    <div class="card pad"><table class="table"><thead><tr><th>Format</th><th>Brands</th><th class="num">Live</th><th class="num">Past 30 days</th><th class="num">Longest</th><th></th></tr></thead>
    <tbody>${p.shared_formats.map(f => `<tr><td>${esc(f.label)}</td><td>${esc(f.brands.join(', '))}</td><td class="num">${f.live}</td><td class="num">${f.kept}</td><td class="num">${f.longest}d</td>
      <td><button class="btn sm" data-steal="${esc(best(f).id)}">Make one</button></td></tr>`).join('')}</tbody></table></div>
    <p class="small muted">${esc(p.note)}</p>
  </section>`;
}

function makeForm() {
  const kit = state.ws.brand_kit, me = state.me;
  const products = kit?.products || [];
  const cur = state.ws.product_image;
  return `<form id="make-form" class="card pad" style="display:grid;gap:10px">
    <span class="eyebrow">Make your version</span>
    <label class="small">Size <select name="size">${Object.entries(me.sizes).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select></label>
    ${products.length ? `<div class="small">Product to feature <span class="muted">(your real photo, kept exact)</span></div>
      <div class="pick-grid">${products.slice(0, 8).map((p, i) => `<label class="pick"><input type="radio" name="product" value="${esc(p.url)}" data-name="${esc(p.name)}" ${(cur ? p.url === cur : i === 0) ? 'checked' : ''}><img src="${esc(p.url)}" alt="${esc(p.name)}" loading="lazy"><span>${esc(p.name)}</span></label>`).join('')}
        <label class="pick"><input type="radio" name="product" value="" ${products.length ? '' : 'checked'}><div class="ph-pick">No photo</div><span>Describe it instead</span></label></div>`
      : `<p class="small muted" style="margin:0">Tip: <a href="#/settings">import your website</a> so ads use your real product photos.</p>`}
    <button class="btn primary" id="make">Make it · ${me.cost.ad} credits</button>
    <span class="small muted">${me.usage.credits.balance} credits left. About a minute.</span>
  </form>`;
}

async function viewRebuild(adId) {
  const rebuilds = await api('/api/rebuilds');
  for (const r of rebuilds) state.videos[r.id] = { list: r.videos || [], poster: r.image, title: r.headline };
  let head = '';
  if (adId) {
    const ad = await api(`/api/ads/${adId}`);
    const mine = rebuilds.filter(r => r.ad_id === String(adId) && r.status === 'done');
    const existing = mine[0];
    head = `<section class="section">
      ${sectionHead('Their winner, rebuilt as your ad', 'Keeps what makes it work. Swaps in your product, your offer and your colour. Never their name, logo, claims or wording.')}
      <div class="vs">
        <div><span class="eyebrow">Theirs · ${esc(ad.rival_name)}</span><button class="ad-open" data-ad="${esc(ad.id)}" style="all:unset;cursor:pointer;display:block" aria-label="Open the original ad">${thumb(ad)}</button>
          <p class="small muted">${esc(runLabel(ad))} · ${esc(ad.format_label)} · <button class="linklike" data-ad="${esc(ad.id)}">Open original</button> · <a href="${libUrl(ad.id)}" target="_blank" rel="noopener">Meta Ad Library ↗</a></p></div>
        <div id="ours"><span class="eyebrow">Yours · ${esc(state.ws.brand_name || 'your brand')}</span>
          ${existing ? rebuildFigure(existing) : makeForm()}
        </div>
      </div>
      ${existing ? planBlock(existing) + videoBlock(existing) + `<details style="margin-top:12px"><summary class="btn sm">Make another version</summary><div style="margin-top:10px;max-width:520px">${makeForm()}</div></details>` : ''}
      ${mine.length > 1 ? `<div class="grid-auto" style="margin-top:12px">${mine.slice(1).map(r => `<div class="card ad"><div class="ad-thumb"><img src="${esc(r.image)}" alt="Earlier version"></div><div class="ad-body"><span class="hook">${esc(r.headline)}</span><a class="btn sm" href="${esc(r.image)}" download>Download</a></div></div>`).join('')}</div>` : ''}
    </section>`;
    queueMicrotask(() => $('#make-form')?.addEventListener('submit', async e => {
      e.preventDefault(); e.stopPropagation();
      const f = e.target, btn = $('#make', f), pick = $('input[name=product]:checked', f);
      btn.disabled = true; btn.textContent = 'Making it… about a minute';
      try {
        await runJob('/api/rebuild', { ad_id: adId, size: f.size.value, product_image: pick?.value || undefined, product_name: pick?.dataset.name || undefined }, 'Making your ad');
        await refreshChrome(); route();
      } catch (err) { toast(err.message, 7000); btn.disabled = false; btn.textContent = 'Try again'; }
    }));
  }
  return head + `<section class="section">
    ${sectionHead('Your ads', 'Every ad you have made, newest first.', `<button class="btn" id="drop-now">Make this week's drop</button>`)}
    ${rebuilds.length ? `<div class="grid-auto">${rebuilds.map(r => `<article class="card ad">
        <a href="#/rebuild/${esc(r.ad_id)}" style="color:inherit;text-decoration:none">${r.image ? `<div class="ad-thumb"><img src="${esc(r.image)}" alt="Your ad"></div>` : `<div class="ad-thumb"><div class="ph">${esc(r.status)}</div></div>`}</a>
        <div class="ad-body"><span class="who">${r.drop_week ? `Drop ${esc(r.drop_week)}` : 'Remake'}${r.size && r.size !== 'feed' ? ` · ${esc(r.size)}` : ''}</span><span class="hook">${esc(r.headline || '')}</span>${sourceLink(r.ad)}
        ${r.image ? `<div class="actions row"><a class="btn sm" href="${esc(r.image)}" download>Download</a><a class="btn sm" href="#/test/${r.id}">Test it</a>${r.videos?.length ? `<button class="btn sm primary" data-play="${r.id}">▶ Play video</button>` : ''}</div>` : ''}</div></article>`).join('')}</div>`
      : empty('No ads yet. Pick any rival ad and press "Steal this ad".')}
  </section>`;
}

function rebuildFigure(r) {
  return r.image ? `<div class="ad-thumb" style="aspect-ratio:auto"><img src="${esc(r.image)}" alt="Your version"></div>
    <div class="row" style="margin-top:8px"><a class="btn sm primary" href="${esc(r.image)}" download>Download</a><a class="btn sm" href="#/test/${r.id}">Test vs theirs</a></div>`
    : `<div class="ad-thumb"><div class="ph">${esc(r.status)}</div></div>`;
}

/** Videos of a finished ad, plus buttons to make one. Motion keeps the ad exact; AI video adds real movement. */
function videoBlock(r) {
  const vids = r.videos || [];
  return `<div class="card pad" style="margin-top:14px;display:grid;gap:12px">
    <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><span class="eyebrow">Video for Reels, Stories and TikTok · 9:16</span>
      <span class="row" style="gap:6px"><button class="btn sm" data-video="${r.id}" data-mode="motion" title="Your ad exactly as approved, with a slow camera push. 2 credits.">Make motion video · 2</button>
      <button class="btn sm primary" data-video="${r.id}" data-mode="ai" title="Real movement in the scene, your lines burned on as captions. 30 credits, 1 to 3 minutes.">Make AI video · 30</button></span></div>
    ${vids.length ? `<div class="video-grid">${vids.map((v, i) => `<figure class="video-card"><button class="vthumb" data-play="${r.id}" data-idx="${i}" aria-label="Play ${v.mode === 'ai' ? 'AI video' : 'motion video'}"><img src="${esc(r.image)}" alt=""><span class="vplay" aria-hidden="true">▶</span><span class="vlen">${v.seconds}s</span></button>
      <figcaption class="row small" style="justify-content:space-between"><span>${v.mode === 'ai' ? 'AI video' : 'Motion'}</span><a class="btn sm" href="${esc(v.url)}" download>Download</a></figcaption></figure>`).join('')}</div>`
      : '<p class="small muted" style="margin:0">No video yet. Motion keeps every word exactly as approved. AI video moves the scene and puts your lines back on as captions.</p>'}
  </div>`;
}

/** Full-screen player for an ad's videos. Starts playing on open; tabs switch between versions. */
function openVideos(rbId, idx = 0) {
  const v = state.videos[rbId];
  if (!v?.list.length) return;
  const cur = v.list[idx];
  $('#modal-body').innerHTML = `<div class="player">
    <div class="row" style="justify-content:space-between;gap:8px"><strong class="small">${esc(v.title || 'Your video')}</strong><button class="btn sm" id="modal-close" aria-label="Close">✕</button></div>
    <video id="player-video" src="${esc(cur.url)}" poster="${esc(v.poster || '')}" controls autoplay playsinline loop></video>
    <p id="player-error" class="small muted" hidden>This browser can't play the video here. <a href="${esc(cur.url)}" download>Download it</a> to watch.</p>
    <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
      <span class="row" style="gap:6px">${v.list.map((x, i) => `<button class="btn sm ${i === idx ? 'primary' : ''}" data-play="${rbId}" data-idx="${i}">${x.mode === 'ai' ? 'AI video' : 'Motion'} · ${x.seconds}s</button>`).join('')}</span>
      <a class="btn sm" href="${esc(cur.url)}" download>Download</a></div></div>`;
  if (!$('#modal').open) $('#modal').showModal();
  $('#modal-close').onclick = () => $('#modal').close();
  const el = $('#player-video');
  el.addEventListener('error', () => { $('#player-error').hidden = false; });
  el.play().catch(() => {}); // a blocked autoplay still leaves the controls to press
}

const libUrl = id => `https://www.facebook.com/ads/library/?id=${encodeURIComponent(id)}`;
/** "Inspired by" link to the original rival ad: opens it in the app; the ↗ opens Meta's Ad Library. */
const sourceLink = ad => ad ? `<span class="small">Inspired by <button class="linklike" data-ad="${esc(ad.id)}">${esc(ad.rival_name)} · ${esc(runLabel(ad).toLowerCase())}</button> <a href="${libUrl(ad.id)}" target="_blank" rel="noopener" title="Open in Meta Ad Library">↗</a></span>` : '';

const copyBtn = text => `<button class="btn sm" type="button" data-copy="${esc(text)}">Copy</button>`;
function planBlock(r) {
  const p = r.plan || {};
  return `<div class="split" style="margin-top:14px">
    <div class="card pad" style="display:grid;gap:10px;align-content:start">
      <span class="eyebrow">Ad copy, ready to paste into Ads Manager</span>
      ${p.primary_text ? `<div><div class="row" style="justify-content:space-between"><b class="small">Primary text</b>${copyBtn(p.primary_text)}</div><p style="margin:4px 0 0">${esc(p.primary_text)}</p></div>` : ''}
      <div><div class="row" style="justify-content:space-between"><b class="small">Headline</b>${copyBtn(p.meta_headline || p.headline)}</div><p style="margin:4px 0 0">${esc(p.meta_headline || p.headline)}</p></div>
      <div><b class="small">Call to action</b><p style="margin:4px 0 0">${esc(p.cta)}</p></div>
    </div>
    <div class="card pad" style="display:grid;gap:10px;align-content:start">
      <span class="eyebrow">Why this works</span>
      <div class="tags">${(p.why_it_works || []).map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div>
      <ul class="list-plain"><li><b>Scene</b>: ${esc(p.keep_scene)}</li><li><b>Layout</b>: ${esc(p.keep_layout)}</li><li><b>Swapped</b>: ${p.product_image ? 'your real product photo' : 'your product'}, your offer, your colour.</li></ul>
      <span class="small muted">Copy by ${p.source === 'claude' ? 'Claude' : p.source === 'custom' ? 'you' : 'templates'}${p.engine ? ` · image by ${esc(p.engine)}` : ''}</span>
    </div></div>`;
}

async function viewTest(rebuildId) {
  const rebuilds = (await api('/api/rebuilds')).filter(r => r.image);
  const panels = await api('/api/panels');
  const llm = state.status.llm;
  const tested = panels.map(p => ({ p, r: rebuilds.find(x => x.id === p.ours_rebuild_id) })).filter(x => x.r)
    .sort((a, b) => (b.p.result.tally.ours - b.p.result.tally.theirs) - (a.p.result.tally.ours - a.p.result.tally.theirs));
  const pick = rebuilds.find(r => String(r.id) === String(rebuildId)) || tested[0]?.r || rebuilds[0];
  const last = pick ? panels.find(p => p.ours_rebuild_id === pick.id) : null;
  const board = tested.length ? `<section class="section">${sectionHead('Scoreboard', `${tested.length} of your ads tested. Best margin first.`)}
    <div class="card pad"><table class="table"><thead><tr><th>Your ad</th><th>Against</th><th class="num">Yours</th><th class="num">Theirs</th><th class="num">Ties</th><th>Top reason</th></tr></thead><tbody>
    ${tested.map(({ p, r }) => { const t = p.result.tally; const win = t.ours > t.theirs ? 'pill open' : t.ours < t.theirs ? 'pill crowded' : 'pill';
      return `<tr><td><a href="#/test/${r.id}">${esc(r.headline)}</a></td><td>${r.ad ? `<button class="linklike" data-ad="${esc(r.ad.id)}">${esc(r.ad.rival_name)}, ${esc(String(r.ad.run_days))}d</button> <a href="${libUrl(r.ad.id)}" target="_blank" rel="noopener" title="Open in Meta Ad Library">↗</a>` : ''}</td><td class="num"><b>${t.ours}</b></td><td class="num">${t.theirs}</td><td class="num">${t.tie}</td><td><span class="${win}">${t.ours > t.theirs ? 'Yours wins' : t.ours < t.theirs ? 'Theirs wins' : 'Draw'}</span> <span class="small muted">${esc(p.result.top_reason || '')}</span></td></tr>`; }).join('')}
    </tbody></table></div></section>` : '';
  return board + `<section class="section">
    ${sectionHead('Know which ad wins before you spend a cent', 'Put your ad against theirs. Simulated buyers built from your audience pick the one they would stop for, twice each with the order swapped.')}
    ${!llm ? `<div class="callout">The buyer panel needs a Claude API key on the server (<code>ANTHROPIC_API_KEY</code>). Everything else works without it.</div>` : ''}
    ${!pick ? empty('Make a rebuild first, then test it against the ad it came from.') : `
    <div class="filters"><select id="test-pick">${rebuilds.map(r => `<option value="${r.id}" ${r.id === pick.id ? 'selected' : ''}>${esc(r.headline)} (from ${esc(r.ad?.rival_name)})</option>`).join('')}</select>
      <button class="btn primary" id="run-panel" ${llm ? '' : 'disabled'}>Run the panel</button></div>
    <div class="vs"><div><span class="eyebrow">Yours</span><div class="ad-thumb"><img src="${esc(pick.image)}" alt="Your ad"></div></div>
      <div><span class="eyebrow">Theirs · ${esc(pick.ad?.rival_name)}</span>${pick.ad ? `<button class="ad-open" data-ad="${esc(pick.ad.id)}" style="all:unset;cursor:pointer;display:block" aria-label="Open the original ad">${thumb(pick.ad, { badge: false })}</button><p class="small muted">${sourceLink(pick.ad)}</p>` : ''}</div></div>
    <div id="panel-out" style="margin-top:14px">${last ? panelResult(last.result) : ''}</div>`}
  </section>`;
}

function panelResult(r) {
  const n = r.tally.ours + r.tally.theirs + r.tally.tie;
  const verdict = r.tally.ours > r.tally.theirs ? `You won, ${r.tally.ours} to ${r.tally.theirs}.` : r.tally.ours < r.tally.theirs ? `They won, ${r.tally.theirs} to ${r.tally.ours}.` : `A draw, ${r.tally.ours} each.`;
  return `<div class="card pad" style="display:grid;gap:12px">
    <div class="score"><span class="big">${r.tally.ours}</span><span>yours<br><small class="muted">of ${n} buyers</small></span><span class="big" style="margin-left:auto">${r.tally.theirs}</span><span>theirs</span></div>
    <div class="votebar" role="img" aria-label="${r.tally.ours} yours, ${r.tally.tie} ties, ${r.tally.theirs} theirs">
      <span style="width:${(100 * r.tally.ours) / n}%;background:var(--s1)"></span><span style="width:${(100 * r.tally.tie) / n}%;background:var(--line)"></span><span style="width:${(100 * r.tally.theirs) / n}%;background:var(--s2)"></span></div>
    <strong>${esc(verdict)}${r.top_reason ? ` Top reason: ${esc(r.top_reason.toLowerCase())}.` : ''}</strong>
    <div>${r.votes.map(v => `<div class="persona"><span class="avatar">${initials(v.persona.name)}</span><div><b>${esc(v.persona.name)}</b> <span class="pill ${v.persona.temperature === 'hot' ? 'hot' : v.persona.temperature === 'warm' ? 'warm' : 'cold'}">${esc(v.persona.temperature)}</span> picked <b>${v.pick === 'tie' ? 'neither consistently' : v.pick}</b>
      <div class="small muted">${esc(v.persona.who)}</div><div class="small">Stopped by: “${esc(v.stopped_by)}” · Still unsure: ${esc(v.objection)}</div></div></div>`).join('')}</div>
    <span class="small muted">Simulated buyers (${esc(r.model)}). Directional only: test with real spend before you scale.</span>
  </div>`;
}

async function viewSearch() {
  const q = new URLSearchParams(location.hash.split('?')[1] || '');
  const ads = await api(`/api/ads?${q}&limit=60`);
  const sel = (name, opts) => `<select name="${name}"><option value="">${name === 'pile' ? 'Any status' : name === 'format' ? 'Any format' : name === 'rivalId' ? 'All rivals' : 'Any angle'}</option>${opts.map(([v, l]) => `<option value="${esc(v)}" ${q.get(name) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  return `<section class="section">${sectionHead('Search every rival ad', `${ads.length} shown, longest-running first.`)}
    <form class="filters" id="search-form">
      <input name="q" placeholder="Search copy and hooks" value="${esc(q.get('q') || '')}">
      ${sel('rivalId', state.rivals.map(r => [r.rival.id, r.rival.name]))}
      ${sel('format', Object.entries(FORMAT_NAME))}
      ${sel('pile', [['kept', 'Kept (30+ days)'], ['testing', 'Testing'], ['killed', 'Killed'], ['retired', 'Retired']])}
      <input name="minDays" type="number" min="0" placeholder="Min days" value="${esc(q.get('minDays') || '')}" style="width:110px">
      <button class="btn primary">Search</button>
    </form>
    ${ads.length ? `<div class="grid-auto">${ads.map(a => adCard(a)).join('')}</div>` : empty('Nothing matches.')}</section>`;
}

async function viewAlerts() {
  const [fresh, killed, notes] = await Promise.all([api('/api/ads?sort=new&limit=24&pile=testing'), api('/api/ads?pile=killed&limit=60'), api('/api/notifications')]);
  if (notes.unread) api('/api/notifications/read', { method: 'POST' }).then(() => { $('#alert-dot').hidden = true; });
  const noteList = notes.items.length ? `<section class="section">${sectionHead('Notifications')}
    <div style="display:grid;gap:8px">${notes.items.slice(0, 8).map(n => `<a class="card pad notif-row${n.read_at ? '' : ' unread'}" href="${esc(n.link || '#/alerts')}">
      <span class="avatar" style="background:${n.kind === 'drop_ready' ? 'var(--accent)' : 'var(--line)'};color:${n.kind === 'drop_ready' ? 'var(--accent-ink)' : 'var(--ink-2)'}">${n.kind === 'drop_ready' ? '✓' : '!'}</span>
      <span><b>${esc(n.title)}</b><span class="small muted" style="display:block">${esc(n.body || '')}</span></span>
      <span class="small muted">${esc((n.created_at || '').slice(0, 16).replace('T', ' '))}</span></a>`).join('')}</div></section>` : '';
  const ov = state.overview;
  const wk = d => d && (Date.parse(ov.today) - Date.parse(d)) / 864e5 <= 7;
  const launched = fresh.filter(a => wk(a.start_date));
  const stopped = killed.filter(a => wk(a.end_date));
  return noteList + `<section class="section">${sectionHead('Launched this week', `${launched.length} new ads started in the last 7 days.`)}
    ${launched.length ? `<div class="grid-auto">${launched.map(a => adCard(a)).join('')}</div>` : empty('No launches in the last 7 days.')}</section>
    <section class="section">${sectionHead('Killed this week', 'Stopped inside 30 days. These are tests that did not make it.')}
    ${stopped.length ? `<div class="grid-auto">${stopped.map(a => adCard(a, { cta: 'Steal anyway' })).join('')}</div>` : empty('Nothing killed in the last 7 days.')}</section>`;
}

async function viewSettings() {
  const ws = state.ws, me = state.me, u = me.usage;
  const origin = location.origin;
  return `<section class="section">${sectionHead('Rivals', `${u.used.rivals} of ${u.limits.rivals} on the ${esc(u.plan_name)} plan. Search the Meta Ad Library by brand name, then pick the right page.`)}
    <div class="card pad" style="display:grid;gap:12px">
      ${state.rivals.length ? `<table class="table"><tbody>${state.rivals.map(r => `<tr><td><span class="row">${avatar(r.rival)}<b>${esc(r.rival.name)}</b></span></td><td class="muted">${fmtNum(r.counted)} ads · ${r.running} running</td><td class="num"><button class="btn sm" data-untrack="${r.rival.id}">Remove</button></td></tr>`).join('')}</tbody></table>` : ''}
      <form class="filters" id="rival-search" style="margin:0"><input name="q" placeholder="Brand name, e.g. Olipop" required minlength="2" style="min-width:240px;flex:1"><button class="btn primary" ${me.providers.adData ? '' : 'disabled'}>Search</button></form>
      ${me.providers.adData ? '' : '<span class="small muted">Adding new rivals is switched off on this server for now. Use "Try the demo" on the overview.</span>'}
      <div id="rival-results" class="grid-auto"></div>
    </div></section>
  <section class="section">${sectionHead('Brand kit', 'Paste your website. We pull your colours, font and real product photos so every ad shows your actual product.')}
    <div class="card pad" style="display:grid;gap:12px">
      <form class="filters" id="kit-form" style="margin:0"><input name="url" placeholder="yourbrand.com" value="${esc(ws.brand_url || '')}" required style="min-width:240px;flex:1"><button class="btn primary">${ws.brand_kit ? 'Re-import' : 'Import from website'}</button></form>
      ${kitBlock(ws.brand_kit, ws.product_image)}
    </div></section>
  <section class="section">${sectionHead('Your brand', 'Ads, copy and the buyer panel use these.')}
    <form class="form card pad" id="ws-form">
      <label>Brand name<input name="brand_name" value="${esc(ws.brand_name)}" required></label>
      <label>Product <span class="hint">One line: what it is and the facts you can claim.</span><input name="brand_product" value="${esc(ws.brand_product)}"></label>
      <label>Offer<input name="brand_offer" value="${esc(ws.brand_offer)}"></label>
      <label>Brand colour<input name="brand_color" type="color" value="${esc(ws.brand_color || '#c8553d')}"></label>
      <label>Voice<textarea name="brand_voice">${esc(ws.brand_voice)}</textarea></label>
      <label>Audience<textarea name="audience">${esc(ws.audience)}</textarea></label>
      <label>Category<input name="category" value="${esc(ws.category)}"></label>
      <div><button class="btn primary">Save</button></div>
    </form></section>
  <section class="section">${sectionHead('Monday drop', 'Every week, Keepwatch rebuilds the ads your rivals keep running, for your brand, and lets you know when they are ready.')}
    <form class="form card pad" id="drop-form" style="max-width:none">
      <label class="row" style="font-weight:550"><input type="checkbox" name="drop_enabled" ${ws.drop_enabled === 0 ? '' : 'checked'} style="width:auto"> Make my drop automatically every Monday</label>
      <div class="row">
        <label>Time <select name="drop_hour">${Array.from({ length: 24 }, (_, h) => `<option value="${h}" ${(ws.drop_hour ?? 7) === h ? 'selected' : ''}>${hourLabel(h)}</option>`).join('')}</select></label>
        <label>Time zone <input name="drop_tz" value="${esc(ws.drop_tz || Intl.DateTimeFormat().resolvedOptions().timeZone)}" style="min-width:220px"></label>
      </div>
      <span class="small muted">${4} ads, ${4 * me.cost.ad} credits a week. A week is skipped (and you're told why) if credits run low or ad images aren't switched on.</span>
      <div><button class="btn primary">Save</button></div>
    </form></section>
  <section class="section">${sectionHead('Plan and credits', `One pool pays for everything: tracking a rival is ${me.cost.rival} credits a month, an ad is ${me.cost.ad}, a buyer panel is ${me.cost.panel}.`)}
    <div class="card pad" style="display:grid;gap:10px">
      <div class="row" style="justify-content:space-between"><span><b>${esc(u.plan_name)}</b>${u.trial_ends_at && u.plan === 'trial' ? ` · ${u.trial_over ? 'ended' : 'ends'} ${esc(u.trial_ends_at.slice(0, 10))}` : ''}</span><span><b>${fmtNum(u.credits.balance)}</b> of ${fmtNum(u.credits.pool)} credits left · about ${u.credits.ads_left} ads</span></div>
      <div class="bar"><span style="width:${Math.min(100, (100 * u.credits.spent) / Math.max(1, u.credits.pool))}%"></span></div>
      <span class="small muted">Spent: ${Object.entries(u.credits.by_reason).map(([k, v]) => `${esc(k)} ${v}`).join(' · ') || 'nothing yet'}. Refills ${esc(u.resets)}.</span>
    </div>
    <div class="grid-3" style="margin-top:12px">${['growth', 'scale', 'agency'].map(k => { const p = me.plans[k]; return `<div class="card pad" style="display:grid;gap:6px;align-content:start;${p.popular ? 'border-color:var(--accent)' : ''}">
      <div class="row" style="justify-content:space-between"><b>${esc(p.name)}</b>${p.popular ? '<span class="pill hot">Most popular</span>' : ''}</div>
      <span class="small muted">${esc(p.tagline)}</span>
      <span style="font-size:24px;font-weight:750">$${p.price}<small class="muted" style="font-size:13px;font-weight:500">/mo</small></span>
      <span class="small muted">or $${fmtNum(p.annual)} a year (2 months free)</span>
      <span>${p.rivals} tracked rivals · about ${p.ads} ads a month</span>
      <span class="small muted">${fmtNum(p.credits)} credits a month</span>
      <button class="btn sm" disabled>${u.plan === k ? 'Current plan' : 'Upgrades open soon'}</button></div>`; }).join('')}</div>
  </section>
  <section class="section">${sectionHead('Connect your AI', 'Keepwatch is also an MCP server. Ask Claude, ChatGPT or Cursor what your rivals keep running.')}
    <pre id="mcp-cmd">claude mcp add --transport http keepwatch ${esc(origin)}/mcp --header "Authorization: Bearer ${esc(ws.api_key)}"</pre>
    <div class="row"><button class="btn sm" id="copy-mcp">Copy</button><button class="btn sm" id="rotate-key">New key</button><span class="small muted">Keep this key private. "New key" disconnects the old one.</span></div></section>
  <section class="section">${sectionHead('Account')}
    <div class="card pad row" style="justify-content:space-between"><span>Signed in as <b>${esc(me.user.email)}</b></span><button class="btn" id="sign-out">Sign out</button></div></section>
  <section class="section">${sectionHead('How we count')}
    <div class="card pad"><ul class="list-plain">
      <li><b>Run days</b>: from the ad's Ad Library start date to its end date, or to today if it is still live.</li>
      <li><b>Kept</b>: still running after 30+ days. <b>Testing</b>: running, under 30 days. <b>Killed</b>: stopped inside 30 days. <b>Retired</b>: ran 30+ days, then stopped.</li>
      <li><b>New</b>: start date in the last 7 days.</li>
      <li>Every number is from a sample of each rival's public ads (English-language), not their whole library. Run length shows an ad lasted, not that it made money.</li>
      <li>Under 10 ads we describe instead of ranking; under 3 we just show the ads.</li>
    </ul></div></section>`;
}

const hourLabel = h => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'am' : 'pm'}`;

function kitBlock(kit, current) {
  if (!kit) return '<p class="small muted" style="margin:0">Works best with Shopify stores; other sites work too.</p>';
  return `<div class="row">${kit.colors.map(c => `<span title="${esc(c)}" style="width:26px;height:26px;border-radius:6px;background:${esc(c)};border:1px solid var(--line)"></span>`).join('')}
      ${kit.font ? `<span class="pill">Font: ${esc(kit.font)}</span>` : ''}<span class="pill">${esc(kit.domain)}</span></div>
    ${kit.products.length ? `<div class="small">Default product for ads</div><div class="pick-grid">${kit.products.map(p => `<label class="pick"><input type="radio" name="default-product" value="${esc(p.url)}" ${p.url === current ? 'checked' : ''}><img src="${esc(p.url)}" alt="${esc(p.name)}" loading="lazy"><span>${esc(p.name)}</span></label>`).join('')}</div>`
      : '<p class="small muted">No product photos found on that page.</p>'}`;
}

function onboarding() {
  return `<section class="section"><div class="card pad" style="display:grid;gap:14px;max-width:720px">
    <span class="eyebrow">Welcome${state.me.user.name ? `, ${esc(state.me.user.name.split(' ')[0])}` : ''}</span>
    <h2 style="font-size:24px">See what your rivals keep paying to run.</h2>
    <p class="sub">Add the brands you compete with. Keepwatch pulls their Meta ads, counts what they keep, kill and launch, and rebuilds their winners for your brand.</p>
    <div class="row"><a class="btn primary" href="#/settings">Add your rivals</a><button class="btn" id="try-demo">Try the demo (fiber drinks)</button></div>
    <span class="small muted">The demo fills in a sample brand and five real rivals so you can look around. You can change everything later.</span>
  </div></section>`;
}

// ---------- right sidebar + footer ----------
async function renderRight() {
  if (!state.rivals.length) { $('#rightbar').innerHTML = `<div class="card rb-card"><h3>This week</h3><p class="small muted">Add rivals and their weekly numbers show up here.</p><a class="btn sm primary" href="#/settings">Add rivals</a></div>`; return; }
  const [ov, angles, rebuilds, st] = [state.overview, await api('/api/angles'), await api(`/api/rebuilds?week=${state.status.week}`), state.status];
  const open = angles.filter(a => a.temp === 'open' || a.temp === 'cooling').slice(0, 4);
  const crowded = angles.filter(a => a.temp === 'crowded').slice(0, 3);
  $('#rightbar').innerHTML = `
    <div class="card rb-card"><h3>This week</h3>
      <div class="rb-stat"><span>Running</span><b>${fmtNum(ov?.running)}</b></div>
      <div class="rb-stat"><span>Killed (7 days)</span><b>${fmtNum(ov?.killed7)}</b></div>
      <div class="rb-stat"><span>New (7 days)</span><b>${fmtNum(ov?.new7)}</b></div>
      <div class="rb-stat"><span>Kept past 30 days</span><b>${fmtNum(ov?.kept)}</b></div></div>
    <div class="card rb-card"><h3>Monday drop</h3>
      <div class="notif"><span class="avatar">K</span><div><b>${rebuilds.length ? 'Your Monday drop is ready' : state.ws.drop_enabled === 0 ? 'Monday drop is off' : 'Next drop: Monday ' + esc(hourLabel(state.ws.drop_hour ?? 7))}</b><div class="small muted">Week of ${esc(st.week)} · ${rebuilds.length} new ads</div></div></div>
      <div class="drop-thumbs">${rebuilds.slice(0, 4).map(r => r.image ? `<a href="#/rebuild/${esc(r.ad_id)}"><img src="${esc(r.image)}" alt="Drop ad"></a>` : '<div></div>').join('') || '<div></div><div></div><div></div><div></div>'}</div>
      <button class="btn sm primary" id="drop-btn" ${st.images ? '' : 'disabled'}>${rebuilds.length ? 'Make more' : 'Make this week\'s drop'}</button>
      <p class="small muted" style="margin:8px 0 0">Built from what rivals keep running. Made for your brand. 10 credits per ad. <a href="#/settings">Schedule</a></p></div>
    <div class="card rb-card"><h3>Open ground</h3>
      ${open.length ? open.map(a => `<div class="rb-stat"><span>${esc(a.label)}</span><span class="pill ${a.temp}">${esc(a.temp_label)}</span></div>`).join('') : '<p class="small muted">Every angle has a rival on it.</p>'}
      ${crowded.length ? `<p class="small muted" style="margin:8px 0 0">Crowded: ${crowded.map(a => esc(a.label)).join(', ')}.</p>` : ''}
      <a class="btn sm" href="#/hooks" style="margin-top:8px">All angles</a></div>`;
  $('#drop-btn')?.addEventListener('click', makeDrop);
}

async function makeDrop(e) {
  e.target.disabled = true;
  try { const r = await runJob('/api/drop', { count: 4 }, 'Making this week\'s drop (about 4 minutes)'); toast(`Drop ready: ${r.rebuilds.length} ads`); location.hash = '#/rebuild'; refreshChrome(); route(); }
  catch (err) { toast(err.message, 6000); } finally { e.target.disabled = false; }
}

function renderFooter() {
  const ov = state.overview, me = state.me, u = me.usage;
  $('#foot-left').textContent = `${ov?.last_collected ? `Updated ${ov.last_collected.slice(0, 10)}` : 'Not collected yet'} · ${fmtNum(ov?.counted)} ads counted · ${u.plan_name}: ${fmtNum(u.credits.balance)} credits left`;
  $('#foot-right').innerHTML = `Source: public Meta Ad Library sample. Run length ≠ sales.<span class="status-dot ${me.providers.adData ? 'on' : ''}"></span>Ad data<span class="status-dot ${me.providers.images ? 'on' : ''}"></span>Images<span class="status-dot ${me.providers.llm ? 'on' : ''}"></span>Claude`;
}

function renderSidebar() {
  const cur = location.hash;
  // one login can hold several workspaces (one per brand); the picker switches between them
  const canAdd = state.workspaces.length < (state.me.usage.limits.workspaces || 1);
  $('#ws-select').innerHTML = state.workspaces.map(w => `<option value="${w.id}" ${w.current ? 'selected' : ''}>${esc(w.name)}</option>`).join('')
    + `<option value="new" ${canAdd ? '' : 'disabled'}>+ New workspace${canAdd ? '…' : ' (Agency plan)'}</option>`;
  $('#category-name').textContent = state.ws.category || 'Your category';
  $('#rival-count').textContent = `(${state.rivals.length})`;
  $('#side-category').setAttribute('aria-current', String(cur === '' || cur.startsWith('#/overview')));
  $('#rival-list').innerHTML = state.rivals.map(r => `<li><button class="rival-item" data-rival="${r.rival.id}" aria-current="${cur.startsWith(`#/rival/${r.rival.id}`)}">
    ${avatar(r.rival)}<span class="meta"><strong>${esc(r.rival.name)}</strong><small>${r.running} running${r.keeps_format_label ? ` · keeps ${esc(r.keeps_format_label.toLowerCase())}` : ''}</small></span></button></li>`).join('');
  const b = $('#brand-avatar'); b.textContent = (state.ws.brand_name || '?')[0].toUpperCase(); b.style.background = state.ws.brand_color || '';
}

// ---------- modal ----------
async function openAd(id) {
  const a = await api(`/api/ads/${id}`);
  $('#modal-body').innerHTML = `<div class="modal-grid">${thumb(a)}
    <div style="display:grid;gap:10px;align-content:start">
      <div class="row" style="justify-content:space-between"><strong>${esc(a.rival_name)}</strong><button class="btn sm" id="modal-close" aria-label="Close">✕</button></div>
      <div class="row"><span class="pill ${a.is_active ? 'live' : ''}">${esc(runLabel(a))}</span><span class="pill">${esc(pileText(a))}</span><span class="pill">${esc(a.angle_label)}</span></div>
      ${a.hook ? `<div><span class="eyebrow">Hook (${esc(a.hook_source)})</span><p style="margin:4px 0 0;font-weight:600">${esc(a.hook)}</p></div>` : ''}
      ${a.title ? `<div><span class="eyebrow">Headline</span><p style="margin:4px 0 0">${esc(a.title)}</p></div>` : ''}
      ${a.body ? `<div><span class="eyebrow">Copy</span><p style="margin:4px 0 0;white-space:pre-wrap">${esc(a.body)}</p></div>` : ''}
      ${a.transcript ? `<details><summary class="eyebrow">Transcript</summary><p class="small" style="white-space:pre-wrap">${esc(a.transcript)}</p></details>` : ''}
      <p class="small muted">Started ${esc(a.start_date)}${a.is_active ? '' : ` · stopped ${esc(a.end_date)}`} · CTA: ${esc(a.cta || '—')}</p>
      <div class="row"><button class="btn primary" data-steal="${esc(a.id)}">Steal this ad</button><a class="btn" target="_blank" rel="noopener" href="https://www.facebook.com/ads/library/?id=${esc(a.id)}">View in Ad Library ↗</a></div>
      <p class="small muted">Ad text belongs to ${esc(a.rival_name)}. Rebuilds keep the structure, never their name, logo, claims or wording.</p>
    </div></div>`;
  $('#modal').showModal();
  $('#modal-close').onclick = () => $('#modal').close();
}

// ---------- routing ----------
const VIEW_OF = { overview: 'home', rival: 'home', hooks: 'home', patterns: 'home', rebuild: 'home', test: 'home', search: 'search', alerts: 'alerts', library: 'library', settings: 'settings' };
async function route() {
  const [, page = 'overview', arg] = (location.hash.split('?')[0] || '').split('/');
  const view = VIEW_OF[page] || 'home';
  document.querySelectorAll('.rail-btn').forEach(b => b.setAttribute('aria-current', String(b.dataset.view === view)));
  const tab = { overview: 'overview', rival: 'playbook', hooks: 'hooks', patterns: 'patterns', rebuild: 'rebuild', test: 'test' }[page];
  $('#tabs').hidden = view !== 'home';
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  renderSidebar();
  const el = $('#content');
  el.innerHTML = '<div class="skeleton"></div>';
  try {
    const html = await ({ overview: viewOverview, rival: () => viewPlaybook(arg), hooks: viewHooks, patterns: viewPatterns, rebuild: () => viewRebuild(arg), test: () => viewTest(arg),
      search: viewSearch, alerts: viewAlerts, library: () => viewRebuild(), settings: viewSettings }[page] || viewOverview)();
    el.innerHTML = html;
    el.scrollTop = 0;
  } catch (e) { el.innerHTML = empty(`Something went wrong: ${esc(e.message)}`); }
}

async function refreshChrome() {
  [state.me, state.rivals, state.overview, state.workspaces] = await Promise.all([api('/api/me'), api('/api/rivals'), api('/api/overview'), api('/api/workspaces')]);
  state.ws = state.me.workspace;
  state.status = { treg: state.me.providers.adData, images: state.me.providers.images, llm: state.me.providers.llm, week: state.me.week };
  document.documentElement.style.setProperty('--accent', state.ws.brand_color || '');
  api('/api/notifications').then(n => { $('#alert-dot').hidden = !n.unread; if (n.unread && n.items[0] && !n.items[0].read_at && store.get('kw-toast') !== String(n.items[0].id)) { store.set('kw-toast', String(n.items[0].id)); toast(n.items[0].title, 5000); } }).catch(() => {});
  // First visit: remember this browser's time zone so the Monday drop lands at 7am local time.
  if (!state.ws.drop_tz) { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (tz) api('/api/workspace', { method: 'POST', body: { drop_tz: tz } }).then(w => { state.ws.drop_tz = w.drop_tz; }).catch(() => {}); }
  renderSidebar(); renderFooter(); renderRight().catch(() => {});
}

// ---------- events ----------
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-view],[data-tab],[data-rival],[data-steal],[data-ad],[data-untrack],[data-pick],[data-play],[data-video],#side-category,#collect,#drop-now,#run-panel,#try-demo,#sign-out,#copy-mcp,#rotate-key');
  if (!t) return;
  if (t.dataset.view) { location.hash = { home: '#/overview', search: '#/search', alerts: '#/alerts', library: '#/library', settings: '#/settings' }[t.dataset.view]; return; }
  if (t.dataset.tab) { const cur = location.hash.match(/#\/rival\/(\d+)/)?.[1]; location.hash = { overview: '#/overview', playbook: `#/rival/${cur || ''}`, hooks: '#/hooks', patterns: '#/patterns', rebuild: '#/rebuild', test: '#/test' }[t.dataset.tab]; return; }
  if (t.dataset.rival) { location.hash = `#/rival/${t.dataset.rival}`; return; }
  if (t.dataset.steal) { $('#modal').open && $('#modal').close();
    if (t.dataset.again) { t.disabled = true; try { await runJob('/api/rebuild', { ad_id: t.dataset.steal }, 'Making another version'); route(); } catch (err) { toast(err.message, 6000); } return; }
    location.hash = `#/rebuild/${t.dataset.steal}`; return; }
  if (t.dataset.ad) { openAd(t.dataset.ad); return; }
  if (t.id === 'side-category') { location.hash = '#/overview'; return; }
  if (t.id === 'try-demo') { t.disabled = true; try { await api('/api/demo', { method: 'POST' }); await refreshChrome(); route(); } catch (err) { toast(err.message, 6000); t.disabled = false; } return; }
  if (t.id === 'sign-out') { await fetch('/api/auth/sign-out', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); location.href = '/'; return; }
  if (t.id === 'copy-mcp') { try { await navigator.clipboard.writeText($('#mcp-cmd').textContent); toast('Copied'); } catch { toast('Select the text and copy it'); } return; }
  if (t.id === 'rotate-key') { if (!confirm('Make a new key? Apps using the old one will stop working.')) return; await api('/api/workspace/rotate-key', { method: 'POST' }); await refreshChrome(); route(); return; }
  if (t.dataset.untrack) { if (!confirm('Stop tracking this rival?')) return; await api(`/api/rivals/${t.dataset.untrack}`, { method: 'DELETE' }); await refreshChrome(); route(); return; }
  if (t.dataset.pick) {
    t.disabled = true;
    try { const r = await api('/api/rivals', { method: 'POST', body: JSON.parse(t.dataset.pick) }); toast(r.job ? `Tracking ${r.rival.name}. Collecting their ads…` : `Tracking ${r.rival.name}`, 4000);
      await refreshChrome(); route();
      if (r.job) { runJob.poll = (async () => { try { await pollJob(r.job.id); await refreshChrome(); route(); toast(`${r.rival.name}'s ads are in`); } catch (err) { toast(err.message, 6000); } })(); } }
    catch (err) { toast(err.message, 6000); t.disabled = false; }
    return;
  }
  if (t.id === 'collect') { t.disabled = true; try { const r = await runJob('/api/collect', {}, 'Collecting rival ads (a few minutes)'); toast(`Collected ${r.ads} ads for $${r.cost.toFixed(3)}`); await refreshChrome(); route(); } catch (err) { toast(err.message, 6000); } t.disabled = false; return; }
  if (t.id === 'drop-now') { makeDrop(e); return; }
  if (t.dataset.play) { openVideos(Number(t.dataset.play), Number(t.dataset.idx || 0)); return; }
  if (t.dataset.video) {
    const ai = t.dataset.mode === 'ai';
    const btns = [...document.querySelectorAll('[data-video]')];
    btns.forEach(b => { b.disabled = true; });
    t.textContent = ai ? 'Making the video… 1 to 3 minutes' : 'Making the video…';
    try { await runJob('/api/video', { rebuild_id: Number(t.dataset.video), mode: t.dataset.mode }, ai ? 'Making your AI video' : 'Making your video'); toast('Your video is ready'); await refreshChrome(); route(); }
    catch (err) { toast(err.message, 7000); btns.forEach(b => { b.disabled = false; }); t.textContent = 'Try again'; }
    return;
  }
  if (t.id === 'run-panel') {
    t.disabled = true; t.textContent = 'Asking the panel…';
    try { const r = await runJob('/api/panel', { rebuild_id: Number($('#test-pick').value) }, 'Running the buyer panel'); $('#panel-out').innerHTML = panelResult(r); }
    catch (err) { toast(err.message, 6000); } t.disabled = false; t.textContent = 'Run the panel';
  }
});

document.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, data = Object.fromEntries(new FormData(f));
  if (f.id === 'ws-form') { try { await api('/api/workspace', { method: 'POST', body: data }); toast('Saved'); await refreshChrome(); } catch (err) { toast(err.message); } }
  if (f.id === 'rival-search') {
    const out = $('#rival-results'); out.innerHTML = '<div class="skeleton"></div>';
    try {
      const hits = await api(`/api/rivals/search?q=${encodeURIComponent(data.q)}`);
      out.innerHTML = hits.length ? hits.map(h => `<div class="card pad" style="display:grid;gap:8px"><span class="row">${avatar({ name: h.name, avatar_url: h.avatar_url })}<b>${esc(h.name)}</b></span>
        <span class="small muted">${esc(h.category || '')}${h.ig_username ? ` · @${esc(h.ig_username)}` : ''} · ${fmtNum(h.likes)} likes</span>
        <button class="btn sm primary" data-pick='${esc(JSON.stringify(h))}'>Track this page</button></div>`).join('') : '<p class="muted">No advertisers found. Try the exact brand name.</p>';
    } catch (err) { out.innerHTML = `<p class="muted">${esc(err.message)}</p>`; }
  }
  if (f.id === 'drop-form') {
    try { await api('/api/workspace', { method: 'POST', body: { drop_enabled: f.drop_enabled.checked ? 1 : 0, drop_hour: Number(f.drop_hour.value), drop_tz: f.drop_tz.value.trim() } }); toast('Drop schedule saved'); await refreshChrome(); route(); }
    catch (err) { toast(err.message, 6000); }
  }
  if (f.id === 'kit-form') {
    const btn = $('button', f); btn.disabled = true; btn.textContent = 'Reading your site…';
    try { await api('/api/brand/scrape', { method: 'POST', body: data }); toast('Brand kit imported'); await refreshChrome(); route(); }
    catch (err) { toast(err.message, 7000); btn.disabled = false; btn.textContent = 'Try again'; }
  }
  if (f.id === 'search-form') { const q = new URLSearchParams([...new FormData(f)].filter(([, v]) => v)); location.hash = `#/search?${q}`; }
});
document.addEventListener('change', async e => {
  if (e.target.id === 'ws-select') {
    const sel = e.target, back = state.workspaces.find(w => w.current)?.id;
    try {
      if (sel.value === 'new') {
        const name = prompt('Name the new workspace (the brand it tracks):');
        if (!name?.trim()) { sel.value = back; return; }
        const w = await api('/api/workspaces', { method: 'POST', body: { name: name.trim() } });
        toast(`Created ${w.name}. Add its rivals in Settings.`, 4000);
      } else {
        await api('/api/workspaces/switch', { method: 'POST', body: { id: Number(sel.value) } });
      }
      location.hash = '#/overview';
      await refreshChrome(); route();
    } catch (err) { toast(err.message, 6000); sel.value = back; }
    return;
  }
  if (e.target.id === 'test-pick') location.hash = `#/test/${e.target.value}`;
  if (e.target.name === 'default-product') { await api('/api/workspace', { method: 'POST', body: { product_image: e.target.value } }); state.ws.product_image = e.target.value; toast('Default product saved'); }
});
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  try { await navigator.clipboard.writeText(b.dataset.copy); toast('Copied'); } catch { toast('Select the text and copy it'); }
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') e.target.close(); });
$('#modal').addEventListener('close', () => { $('#player-video')?.pause(); });
window.addEventListener('hashchange', route);

await refreshChrome();
route();
