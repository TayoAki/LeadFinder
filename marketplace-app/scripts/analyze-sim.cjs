// Summarise a simulate-users.cjs run: outcomes, step timings, slow endpoints, failures.
//   node scripts/analyze-sim.cjs results.json > report.md
const r = require(require('path').resolve(process.argv[2]));
const q = (xs, p) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const fmt = ms => (ms == null ? '–' : ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);
const users = r.results.filter(u => !u.crashed);
const out = [];
out.push(`# Simulation: ${r.users} shoppers, ${r.concurrency} at a time, ${fmt(r.wall_ms)} wall clock\n`);

// Outcomes by persona
const personas = [...new Set(users.map(u => u.persona))];
const outcomes = [...new Set(users.map(u => u.outcome))];
out.push('## Outcomes by persona\n', `| Persona | Users | ${outcomes.join(' | ')} |`, `|---|---|${outcomes.map(() => '---').join('|')}|`);
for (const p of personas) { const us = users.filter(u => u.persona === p); out.push(`| ${p} | ${us.length} | ${outcomes.map(o => us.filter(u => u.outcome === o).length).join(' | ')} |`); }
out.push(`| **all** | ${users.length} | ${outcomes.map(o => users.filter(u => u.outcome === o).length).join(' | ')} |`);
if (r.results.some(u => u.crashed)) out.push(`\nCrashed runs: ${r.results.filter(u => u.crashed).length}`);

// Steps
const steps = {};
for (const u of users) for (const s of u.steps) (steps[s.name] ??= { ok: [], fail: [] })[s.ok ? 'ok' : 'fail'].push(s);
out.push('\n## Steps\n', '| Step | Attempts | Failed | p50 | p95 | max |', '|---|---|---|---|---|---|');
for (const [name, v] of Object.entries(steps)) {
  const ms = v.ok.map(s => s.ms);
  out.push(`| ${name} | ${v.ok.length + v.fail.length} | ${v.fail.length} | ${fmt(q(ms, 0.5))} | ${fmt(q(ms, 0.95))} | ${fmt(ms.length ? Math.max(...ms) : null)} |`);
}

// Failures grouped
const fails = {};
for (const u of users) for (const s of u.steps.filter(s => !s.ok)) { const k = `${s.name} @ ${(s.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '')}: ${s.err}`; (fails[k] ??= []).push(u.persona); }
out.push('\n## Failures\n');
for (const [k, ps] of Object.entries(fails).sort((a, b) => b[1].length - a[1].length)) out.push(`- ${ps.length}× ${k} (${[...new Set(ps)].join(', ')})`);
if (!Object.keys(fails).length) out.push('- none');

// Network
const net = {};
for (const u of users) for (const n of u.net) (net[`${n.m} ${n.path}`] ??= []).push(n);
out.push('\n## API calls (slowest p95 first)\n', '| Call | Count | p50 | p95 | max | non-2xx |', '|---|---|---|---|---|---|');
for (const [k, ns] of Object.entries(net).sort((a, b) => q(b[1].map(n => n.ms), 0.95) - q(a[1].map(n => n.ms), 0.95)).slice(0, 20)) {
  const ms = ns.map(n => n.ms);
  out.push(`| ${k} | ${ns.length} | ${fmt(q(ms, 0.5))} | ${fmt(q(ms, 0.95))} | ${fmt(Math.max(...ms))} | ${ns.filter(n => n.status < 200 || n.status >= 300).length} |`);
}
const perUser = users.map(u => u.net.length);
out.push(`\nAPI calls per shopper: p50 ${q(perUser, 0.5)}, p95 ${q(perUser, 0.95)}, total ${perUser.reduce((a, b) => a + b, 0)}`);

// Errors
const errs = {};
for (const u of users) for (const e of u.errors) (errs[`${e.kind}: ${e.msg}`] ??= 0), errs[`${e.kind}: ${e.msg}`]++;
out.push('\n## Browser errors\n');
for (const [k, n] of Object.entries(errs).sort((a, b) => b[1] - a[1]).slice(0, 15)) out.push(`- ${n}× ${k}`);
if (!Object.keys(errs).length) out.push('- none');
console.log(out.join('\n'));
