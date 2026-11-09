// Thin wrapper around the treg CLI. treg injects provider keys server-side, so this
// process never holds an API key. Where treg is not installed, callers get a clear error.
import { execFile } from 'node:child_process';

let available;
export async function tregAvailable() {
  if (available !== undefined) return available;
  available = await new Promise(res => execFile('treg', ['--version'], err => res(!err)));
  return available;
}

/**
 * Call a treg catalog endpoint.
 * @param {string} endpoint  e.g. 'scrapecreators.x.v1-facebook-adlibrary-company-ads'
 * @param {{query?: Record<string,string|number|undefined>, body?: object, method?: string}} opts
 * @returns {Promise<{result:any, meta:any}>}
 */
export function treg(endpoint, { query = {}, body, method, wait } = {}) {
  const args = ['--json', 'call', endpoint];
  if (wait) args.push('--await', '--timeout', String(wait));
  for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== '') args.push('--query', `${k}=${v}`);
  if (body) args.push('--method', method || 'POST', '--data', JSON.stringify(body));
  else if (method) args.push('--method', method);
  return new Promise((resolveP, reject) => {
    execFile('treg', args, { maxBuffer: 64 * 1024 * 1024, timeout: 10 * 60 * 1000 }, (err, stdout, stderr) => {
      if (err && !stdout) return reject(new Error(`treg ${endpoint} failed: ${stderr || err.message}`));
      let parsed;
      try { parsed = JSON.parse(stdout); } catch {
        // With --await, treg prints progress lines and then the finished task object on one line.
        const line = String(stdout).split('\n').find(l => l.startsWith('{') && l.includes('"status"'));
        const obj = line && line.slice(0, line.lastIndexOf('}') + 1);
        try { parsed = { result: JSON.parse(obj), _treg: {} }; }
        catch { return reject(new Error(`treg ${endpoint}: unreadable reply: ${String(stdout).slice(0, 300)}`)); }
        if (parsed.result.status === 'failed') return reject(new Error(`treg ${endpoint}: task failed: ${JSON.stringify(parsed.result.error).slice(0, 300)}`));
      }
      if (wait && parsed.id && parsed.status && !('result' in parsed)) { // --await prints the bare finished task
        if (parsed.status === 'failed') return reject(new Error(`treg ${endpoint}: task failed: ${JSON.stringify(parsed.error).slice(0, 300)}`));
        parsed = { result: parsed, _treg: { charged_micro: 30000 } };
      }
      if (parsed.error && !parsed.result) return reject(new Error(`treg ${endpoint}: ${parsed.error.message || JSON.stringify(parsed.error).slice(0, 300)}`));
      const meta = parsed._treg || {};
      if (meta.http_status && meta.http_status >= 400) return reject(new Error(`treg ${endpoint}: HTTP ${meta.http_status} ${JSON.stringify(parsed.result).slice(0, 300)}`));
      resolveP({ result: parsed.result, meta });
    });
  });
}

export const costOf = meta => (meta?.charged_micro || 0) / 1e6;
