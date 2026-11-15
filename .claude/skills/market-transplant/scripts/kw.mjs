#!/usr/bin/env node
// Call a Keepwatch MCP tool from the command line and print its JSON result.
//   node kw.mjs list                          list the tools
//   node kw.mjs <tool> '<json arguments>'     call one tool
//   node kw.mjs <tool> @args.json             arguments from a file
// Env:
//   KEEPWATCH_API_KEY        the workspace key (Keepwatch → Settings → Connect your AI), or
//   KEEPWATCH_API_KEY_FILE   a file holding it (keep keys out of shell history and the repo)
//   KEEPWATCH_URL            default https://web-production-04229.up.railway.app
import { readFileSync } from 'node:fs';

const base = (process.env.KEEPWATCH_URL || 'https://web-production-04229.up.railway.app').replace(/\/$/, '');
const key = (process.env.KEEPWATCH_API_KEY || (process.env.KEEPWATCH_API_KEY_FILE ? readFileSync(process.env.KEEPWATCH_API_KEY_FILE, 'utf8') : '')).trim();
const [tool, rawArgs = '{}'] = process.argv.slice(2);
if (!tool) { console.error('usage: node kw.mjs list | <tool> \'<json>\''); process.exit(2); }
if (!key) { console.error('Set KEEPWATCH_API_KEY or KEEPWATCH_API_KEY_FILE (Keepwatch → Settings → Connect your AI).'); process.exit(2); }

const args = rawArgs.startsWith('@') ? JSON.parse(readFileSync(rawArgs.slice(1), 'utf8')) : JSON.parse(rawArgs);
const body = tool === 'list'
  ? { jsonrpc: '2.0', id: 1, method: 'tools/list' }
  : { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } };
const res = await fetch(`${base}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify(body), signal: AbortSignal.timeout(180000) });
const out = await res.json().catch(() => ({}));
if (!res.ok || out.error) { console.error(JSON.stringify(out.error || out)); process.exit(1); }
if (tool === 'list') { for (const t of out.result.tools) console.log(`${t.name}: ${t.description}`); process.exit(0); }
const text = out.result?.content?.[0]?.text ?? '';
if (out.result?.isError) { console.error(text); process.exit(1); }
try { const j = JSON.parse(text); console.log(JSON.stringify(j.data ?? j, null, 2)); } catch { console.log(text); }
