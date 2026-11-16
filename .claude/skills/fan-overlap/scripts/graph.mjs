#!/usr/bin/env node
// Turn one or more fan-overlap results into an explorable graph (one self-contained HTML file).
//   node graph.mjs <overlap.json> [<overlap.json> ...] [--out fan-map.html] [--title "Fan map"]
// Brand A = dark hub. Brand B = circles sized by shared fans, coloured by whether people are leaving it.
// Rivals get a dashed ring. Several A's in one map show which B's their fans share.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argv = process.argv.slice(2); const files = [], opt = {};
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (opt[argv[i].slice(2)] = argv[++i]) : files.push(argv[i]);
if (!files.length) { console.error('usage: node graph.mjs <overlap.json> [...] [--out fan-map.html]'); process.exit(2); }

const nodes = new Map(), links = [];
const key = n => String(n).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const runs = [];
for (const f of files) {
  const r = JSON.parse(readFileSync(f, 'utf8'));
  const A = r.place_a?.name || r.brand_a; const ak = key(A);
  runs.push({ brand: A, city: r.city, coverage: r.coverage, checks: r.checks, opportunities: r.opportunities || [], spend: r.spend_usd, built: r.built_at });
  nodes.set(ak, { ...(nodes.get(ak) || {}), id: ak, name: A, kind: 'a', city: r.city, sample: r.coverage, locations: r.place_a?.locations });
  for (const b of [...(r.brand_b || []), ...(r.rivals || [])]) {
    const bk = key(b.name); if (bk === ak) continue;
    const prev = nodes.get(bk);
    if (!prev || prev.kind !== 'a') nodes.set(bk, { id: bk, name: b.name, kind: 'b', category: b.category, locations: b.locations, rival: !!b.competitor || prev?.rival,
      leaving: b.leaving || prev?.leaving, switch_search: b.switch_search || prev?.switch_search, opportunity: Math.max(b.opportunity || 0, prev?.opportunity || 0) });
    links.push({ source: ak, target: bk, shared: b.shared, share: b.share_of_fans, lift: b.lift, confidence: b.confidence, why: b.why, avg_stars: b.avg_stars_from_a_fans });
  }
}
const data = { nodes: [...nodes.values()], links, runs };
const title = opt.title || `Fan map: ${runs.map(r => r.brand).join(', ')}`;
const out = resolve(opt.out || 'fan-map.html');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

writeFileSync(out, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(runs.length > 1 ? 'Shared Fan Map' : `${runs[0].brand} Fan Map`)}</title>
<style>
:root{--bg:#f7f6f3;--panel:#fff;--ink:#1d1d1b;--muted:#6b6a66;--line:#e3e1db;--hub:#1d1d1b;--leave:#c8402e;--some:#d99a1e;--steady:#9a9893;--unk:#cfcdc7;--accent:#2f5bd3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#141413;--panel:#1d1d1b;--ink:#ecebe7;--muted:#a3a19b;--line:#33322f;--hub:#ecebe7;--leave:#e5644f;--some:#e6b04a;--steady:#7d7b76;--unk:#4a4945;--accent:#7c9cf0}}
:root[data-theme="dark"]{--bg:#141413;--panel:#1d1d1b;--ink:#ecebe7;--muted:#a3a19b;--line:#33322f;--hub:#ecebe7;--leave:#e5644f;--some:#e6b04a;--steady:#7d7b76;--unk:#4a4945;--accent:#7c9cf0}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}
header{padding:20px 16px 8px;max-width:1200px;margin:0 auto}h1{font-size:22px;margin:0 0 4px}header p{margin:0;color:var(--muted)}
.wrap{display:grid;grid-template-columns:1fr 340px;gap:16px;max-width:1200px;margin:0 auto;padding:8px 16px 24px}
@media (max-width:860px){.wrap{grid-template-columns:1fr}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px}
#graph{position:relative;min-height:560px;overflow:hidden}svg{display:block;width:100%;height:560px}
.controls{display:flex;flex-wrap:wrap;gap:8px;padding:12px;border-bottom:1px solid var(--line)}
.controls label{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:13px}
select,button{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:5px 8px}
.legend{display:flex;flex-wrap:wrap;gap:12px;padding:10px 12px;color:var(--muted);font-size:12px;border-top:1px solid var(--line)}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}
aside{padding:16px;max-height:680px;overflow:auto}aside h2{font-size:17px;margin:0 0 6px}aside h3{font-size:13px;margin:14px 0 6px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
.kv{display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font-size:13px}.kv span:nth-child(odd){color:var(--muted)}
blockquote{margin:6px 0;padding:6px 10px;border-left:3px solid var(--leave);background:var(--bg);border-radius:0 6px 6px 0;font-size:13px}
.pill{display:inline-block;padding:1px 8px;border-radius:99px;font-size:12px;border:1px solid var(--line);margin:2px 4px 2px 0}
.opps{max-width:1200px;margin:0 auto;padding:0 16px 32px}.opps ol{margin:8px 0 0;padding-left:20px}.opps li{margin:6px 0}
.warn{color:var(--some)}text{fill:var(--ink);font-size:11px;pointer-events:none}a{color:var(--accent)}
</style></head><body>
<header><h1>${esc(title)}</h1><p>If someone loves the dark hub, they probably also love the circles around it. Bigger circle = more shared fans; closer = higher lift. Colour shows whether people are leaving that brand. Click any circle.</p></header>
<div class="wrap">
 <div class="card" id="graph">
  <div class="controls">
   <label>Show <select id="f-show"><option value="all">all brands</option><option value="opp">only where people are leaving</option><option value="rival">rivals only</option><option value="norival">no rivals</option></select></label>
   <label>Confidence <select id="f-conf"><option value="low">any</option><option value="medium">medium+</option><option value="high">high</option></select></label>
   <button id="reset" type="button">Reset view</button>
  </div>
  <svg id="svg" role="img" aria-label="Network of brands that share fans"></svg>
  <div class="legend"><span><i class="dot" style="background:var(--hub)"></i>Brand A</span><span><i class="dot" style="background:var(--leave)"></i>People are leaving</span><span><i class="dot" style="background:var(--some)"></i>Some leaving</span><span><i class="dot" style="background:var(--steady)"></i>Steady</span><span><i class="dot" style="background:var(--unk)"></i>Not checked</span><span><i class="dot" style="border:2px dashed var(--muted)"></i>Rival</span></div>
 </div>
 <aside class="card" id="side"></aside>
</div>
<section class="opps" id="opps"></section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
<script>
const DATA = ${JSON.stringify(data).replace(/</g, '\\u003c')};
const $ = s => document.querySelector(s), h = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const colour = n => n.kind === 'a' ? 'var(--hub)' : ({'people are leaving':'var(--leave)','some leaving':'var(--some)','steady':'var(--steady)'})[n.leaving?.verdict] || 'var(--unk)';
const rank = {low:0,medium:1,high:2};
const svg = d3.select('#svg'), g = svg.append('g');
const zoom = d3.zoom().scaleExtent([.3, 4]).on('zoom', e => g.attr('transform', e.transform)); svg.call(zoom);
let sim;
function side(n) {
  const L = DATA.links.filter(l => (l.source.id ?? l.source) === n.id || (l.target.id ?? l.target) === n.id);
  if (n.kind === 'a') {
    const run = DATA.runs.find(r => r.brand === n.name) || {};
    $('#side').innerHTML = '<h2>' + h(n.name) + '</h2><div class="kv"><span>City</span><span>' + h(n.city || '-') + '</span><span>Locations</span><span>' + h(n.locations) + '</span><span>Reviews read</span><span>' + h(n.sample?.a_reviews) + '</span><span>Fan histories</span><span>' + h(n.sample?.histories_returned) + '</span><span>Stability</span><span>' + h(run.checks?.split_half_top10_in_both) + ' of top 10 in both halves</span></div>'
      + (run.checks?.warnings?.length ? '<h3>Data checks</h3>' + run.checks.warnings.map(w => '<p class="warn">⚠ ' + h(w) + '</p>').join('') : '')
      + '<h3>Fans also love</h3>' + L.sort((a, b) => b.shared - a.shared).map(l => '<span class="pill">' + h((l.target.name ?? l.target)) + ' · ' + l.shared + '</span>').join('');
    return;
  }
  const lv = n.leaving || {}, ss = n.switch_search || {};
  $('#side').innerHTML = '<h2>' + h(n.name) + (n.rival ? ' <span class="pill">rival</span>' : '') + '</h2><p style="margin:0;color:var(--muted)">' + h(n.category || '') + (n.locations > 1 ? ' · ' + n.locations + ' locations' : '') + '</p>'
    + L.map(l => '<h3>Fans of ' + h(l.source.name ?? l.source) + '</h3><div class="kv"><span>Shared fans</span><span>' + l.shared + ' (' + l.share + '% of sample)</span><span>Lift</span><span>' + h(l.lift ?? '-') + '</span><span>Confidence</span><span>' + h(l.confidence) + '</span><span>Their avg stars</span><span>' + h(l.avg_stars ?? '-') + '</span></div>').join('')
    + '<h3>Are people leaving?</h3><div class="kv"><span>Verdict</span><span><b>' + h(lv.verdict || 'not checked') + '</b></span><span>Leaving reviews</span><span>' + h(lv.leaving_reviews ?? '-') + ' of ' + h(lv.reviews_checked ?? '-') + ' newest</span><span>Rating 90d</span><span>' + h(lv.avg_last_90d ?? '-') + ' vs ' + h(lv.avg_before ?? '-') + ' before</span></div>'
    + (lv.quotes || []).map(q => '<blockquote>"' + h(q.quote) + '"<br><small>' + h(q.stars) + '★ · ' + h(q.date) + (q.url ? ' · <a href="' + h(q.url) + '" target="_blank" rel="noopener">review</a>' : '') + '</small></blockquote>').join('')
    + '<h3>Looking to switch?</h3><div class="kv"><span>Alt. searches/mo</span><span>' + h(ss.monthly_searches ?? 'unknown') + ' (' + h(ss.level || '-') + ')</span></div>'
    + (ss.terms || []).map(t => '<span class="pill">' + h(t.keyword) + ' · ' + t.monthly + '</span>').join('')
    + (ss.compared_with?.length ? '<p style="margin:8px 0 0;color:var(--muted)">People compare it with: ' + ss.compared_with.map(h).join(', ') + '</p>' : '');
}
function draw() {
  const show = $('#f-show').value, conf = rank[$('#f-conf').value];
  const keepB = n => n.kind === 'a' || ((show !== 'opp' || ['people are leaving','some leaving'].includes(n.leaving?.verdict)) && (show !== 'rival' || n.rival) && (show !== 'norival' || !n.rival));
  const links = DATA.links.map(l => ({...l, source: l.source.id ?? l.source, target: l.target.id ?? l.target})).filter(l => rank[l.confidence] >= conf);
  const ids = new Set(links.flatMap(l => [l.source, l.target]));
  const nodes = DATA.nodes.filter(n => keepB(n) && (n.kind === 'a' || ids.has(n.id))).map(n => ({...n}));
  const ok = new Set(nodes.map(n => n.id)); const ls = links.filter(l => ok.has(l.source) && ok.has(l.target));
  const W = $('#svg').clientWidth, H = 560, maxS = d3.max(ls, l => l.shared) || 1, maxLift = d3.max(ls, l => l.lift || 1) || 1;
  const r = n => n.kind === 'a' ? 26 : 6 + 20 * Math.sqrt((d3.max(ls.filter(l => l.target === n.id), l => l.shared) || 1) / maxS);
  g.selectAll('*').remove(); sim?.stop();
  const link = g.append('g').selectAll('line').data(ls).join('line').attr('stroke', 'var(--line)').attr('stroke-width', l => 1 + 5 * l.shared / maxS);
  const node = g.append('g').selectAll('g').data(nodes).join('g').style('cursor', 'pointer').on('click', (e, n) => side(n))
    .call(d3.drag().on('start', (e, d) => { if (!e.active) sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y; }).on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; }).on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = d.fy = null; }));
  node.append('circle').attr('r', r).attr('fill', colour).attr('stroke', n => n.rival ? 'var(--muted)' : 'var(--panel)').attr('stroke-width', n => n.rival ? 2 : 1.5).attr('stroke-dasharray', n => n.rival ? '3 2' : null);
  node.append('text').text(n => n.name.length > 22 ? n.name.slice(0, 21) + '…' : n.name).attr('text-anchor', 'middle').attr('dy', n => r(n) + 12).style('font-weight', n => n.kind === 'a' ? 700 : 400);
  node.append('title').text(n => n.name);
  sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(ls).id(n => n.id).distance(l => 70 + 170 * (1 - Math.min(1, (l.lift || .5) / maxLift))))
    .force('charge', d3.forceManyBody().strength(-220)).force('center', d3.forceCenter(W / 2, H / 2)).force('collide', d3.forceCollide(n => r(n) + 14))
    .on('tick', () => { link.attr('x1', l => l.source.x).attr('y1', l => l.source.y).attr('x2', l => l.target.x).attr('y2', l => l.target.y); node.attr('transform', n => 'translate(' + n.x + ',' + n.y + ')'); });
}
$('#f-show').onchange = $('#f-conf').onchange = draw; $('#reset').onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);
draw(); side(DATA.nodes.find(n => n.kind === 'a'));
$('#opps').innerHTML = DATA.runs.map(r => '<div class="card" style="padding:16px;margin-bottom:12px"><h2 style="margin:0 0 4px;font-size:17px">Where the opportunity is: fans of ' + h(r.brand) + '</h2>'
  + (r.opportunities.length ? '<ol>' + r.opportunities.map(o => '<li><b>' + h(o.name) + '</b>' + (o.competitor ? ' (rival)' : '') + ': ' + h(o.why) + '. <span style="color:var(--muted)">Confidence: ' + h(o.confidence) + '</span></li>').join('') + '</ol>' : '<p>No loved brand shows people leaving or searching for alternatives yet.</p>')
  + '<p style="color:var(--muted);margin:10px 0 0;font-size:12px">From public Google reviews (' + h(r.coverage?.histories_returned) + ' fan review histories). Totals only, no reviewer data kept. "Probably love" is an association, not proof of purchase. Spend ~$' + h(r.spend) + '.</p></div>').join('');
</script></body></html>`);
console.log(`Saved ${out} (${data.nodes.length} brands, ${links.length} links from ${runs.length} run(s))`);
