// Load public Meta Ad Library pages (logged out) and pull the ads embedded in the page HTML.
// Usage: node fbal.cjs <outdir> <mode:find|page> <arg>...   find: keyword queries; page: page ids
const { chromium } = require('playwright'); const fs = require('fs');
const [out, mode, ...args] = process.argv.slice(2);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
function adsIn(html) {
  const found = []; const re = /"collated_results":\[/g; let m;
  while ((m = re.exec(html))) { // walk the bracketed array
    let i = m.index + m[0].length - 1, depth = 0, inStr = false;
    for (let j = i; j < html.length; j++) { const c = html[j];
      if (inStr) { if (c === '\\') j++; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true; else if (c === '[' || c === '{') depth++; else if (c === ']' || c === '}') { depth--; if (!depth) { try { found.push(...JSON.parse(html.slice(i, j + 1))); } catch {} break; } } }
  }
  return found;
}
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ userAgent: UA, locale: 'en-US' });
  for (const a of args) {
    const p = await ctx.newPage(); const extra = [];
    p.on('response', async r => { if (r.url().includes('/api/graphql')) { try { const t = await r.text(); if (t.includes('collated_results')) extra.push(...adsIn(t)); } catch {} } });
    const url = mode === 'find'
      ? `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${encodeURIComponent(a)}&search_type=keyword_unordered&media_type=all`
      : `https://www.facebook.com/ads/library/?active_status=${mode === 'active' ? 'active' : 'all'}&ad_type=all&country=US&view_all_page_id=${a}&search_type=page&media_type=all`;
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(5000);
      for (let k = 0; k < 4; k++) { await p.mouse.wheel(0, 15000); await p.waitForTimeout(6000); }
      const ads = [...adsIn(await p.content()), ...extra];
      const uniq = Object.values(Object.fromEntries(ads.map(x => [x.ad_archive_id, x])));
      fs.writeFileSync(`${out}/${mode}-${a.replace(/\W+/g, '_')}.json`, JSON.stringify(uniq));
      console.log(mode, a, 'ads', uniq.length, mode === 'find' ? JSON.stringify(Object.entries(uniq.reduce((m, x) => (m[x.page_id + ' ' + x.page_name] = (m[x.page_id + ' ' + x.page_name] || 0) + 1, m), {})).sort((x, y) => y[1] - x[1]).slice(0, 4)) : '');
    } catch (e) { console.log(mode, a, 'error', e.message.slice(0, 120)); }
    await p.close(); await new Promise(r => setTimeout(r, 12000));
  }
  await b.close();
})();
