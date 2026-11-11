// Persona walkthrough: runs every persona's tasks in a real browser and scores the UI.
// Usage: node simulate.js <app_dir>   -> <app>/ui/sim/report.json, report.md, screenshots
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const app = process.argv[2]; const ui = path.join(app, 'ui'); const out = path.join(ui, 'sim'); fs.mkdirSync(out, { recursive: true });
  const P = JSON.parse(fs.readFileSync(path.join(ui, 'personas.json'), 'utf8'));
  const url = 'file://' + path.resolve(ui, 'index.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const results = []; const global = [];
  async function fresh(viewport) { const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 }); const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(url); await page.waitForTimeout(150); return { ctx, page, errors }; }
  for (const vp of [{ name: 'desktop', viewport: { width: 1440, height: 900 } }, { name: 'phone', viewport: { width: 390, height: 844 } }]) {
    for (const p of P.personas) {
      const { ctx, page, errors } = await fresh(vp.viewport);
      const tasks = [];
      for (const t of p.tasks) {
        let ok = true, why = '';
        try {
          for (const s of t.steps) {
            if (vp.name === 'phone') { // on phones, open drawers when the target lives in them
              const sel = s.click || s.select;
              const inSide = await page.locator('.side').locator(sel).count();
              if (inSide && !(await page.locator('.side.open').count())) await page.click('.toggle-side');
            }
            if (s.click) await page.locator(s.click).first().click({ timeout: 2500 });
            if (s.select) await page.selectOption(s.select, s.value, { timeout: 2500 });
            await page.waitForTimeout(80);
          }
          for (const e of t.expect) {
            const loc = page.locator(e).first();
            let vis = await loc.isVisible().catch(() => false);
            if (!vis && vp.name === 'phone' && (await page.locator('.right').locator(e).count())) { await page.click('.toggle-right'); await page.waitForTimeout(250); vis = await loc.isVisible().catch(() => false); }
            if (!vis) { ok = false; why = 'not visible: ' + e; break; }
          }
        } catch (err) { ok = false; why = String(err).split('\n')[0].slice(0, 160); }
        tasks.push({ name: t.name, ok, why });
      }
      await page.screenshot({ path: path.join(out, `${vp.name}-${p.id}.png`) });
      if (vp.name === 'phone') { await page.locator('.toggle-right').click().catch(() => {}); }
      results.push({ viewport: vp.name, persona: p.id, department: p.department, tasks, errors: [...errors] });
      await ctx.close();
    }
    // global checks
    const { ctx, page, errors } = await fresh(vp.viewport);
    const regions = vp.name === 'desktop' ? ['.rail', '.side', '.tabs', '.content', '.right', '.bottombar'] : ['.rail', '.tabs', '.content', '.bottombar'];
    for (const r of regions) global.push({ viewport: vp.name, check: 'wireframe region visible: ' + r, ok: await page.locator(r).first().isVisible() });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    global.push({ viewport: vp.name, check: 'no horizontal page scroll', ok: !overflow });
    const tabs = await page.locator('.tabs [role="tab"]').count();
    let tabsOk = true;
    for (let i = 0; i < tabs; i++) { await page.locator('.tabs [role="tab"]').nth(i).click(); const id = await page.locator('.tabs [role="tab"]').nth(i).getAttribute('data-tab');
      const panelVisible = await page.locator('#panel-' + id).isVisible(); const text = (await page.locator('#panel-' + id).innerText()).trim();
      if (!panelVisible || text.length < 40) tabsOk = false;
      await page.screenshot({ path: path.join(out, `${vp.name}-tab-${id}.png`) }); }
    global.push({ viewport: vp.name, check: `every tab (${tabs}) opens a filled panel`, ok: tabsOk });
    await page.locator('.tabs [role="tab"]').first().focus(); await page.keyboard.press('ArrowRight');
    const kb = await page.locator('.tabs [role="tab"]').nth(1).getAttribute('aria-selected');
    global.push({ viewport: vp.name, check: 'tabs work from the keyboard', ok: kb === 'true' });
    const unlabeled = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && !(b.textContent.trim() || b.getAttribute('aria-label'))).length);
    global.push({ viewport: vp.name, check: 'every visible button has a label', ok: unlabeled === 0 });
    global.push({ viewport: vp.name, check: 'no JavaScript errors', ok: errors.length === 0, why: errors.join(' | ') });
    await ctx.close();
  }
  await browser.close();
  const allTasks = results.flatMap(r => r.tasks.map(t => ({ ...t, persona: r.persona, viewport: r.viewport })));
  const per = {};
  for (const r of results) { per[r.persona] ??= { department: r.department, pass: 0, total: 0 }; for (const t of r.tasks) { per[r.persona].total++; if (t.ok) per[r.persona].pass++; } }
  for (const k in per) per[k].score = Math.round(100 * per[k].pass / per[k].total) / 10;
  const gpass = global.filter(g => g.ok).length;
  const score = Math.round(10 * (allTasks.filter(t => t.ok).length + gpass) / (allTasks.length + global.length) * 10) / 10;
  const report = { app: P.app, score, personas: per, failures: allTasks.filter(t => !t.ok), global };
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
  const md = [`# Persona walkthrough: ${P.app}`, '', `**Automated score: ${score}/10** (persona tasks on desktop and phone + global checks)`, '',
    '| Persona | Department | Tasks passed | Score |', '|---|---|---|---|',
    ...Object.entries(per).map(([k, v]) => `| ${k} | ${v.department} | ${v.pass}/${v.total} | ${v.score}/10 |`), '',
    '## Global checks', '', ...global.map(g => `- ${g.ok ? '✅' : '❌'} ${g.viewport}: ${g.check}${g.ok ? '' : ' ' + (g.why || '')}`), '',
    '## Failures', '', ...(report.failures.length ? report.failures.map(f => `- ${f.viewport} · ${f.persona} · ${f.name}: ${f.why}`) : ['None.'])];
  fs.writeFileSync(path.join(out, 'report.md'), md.join('\n') + '\n');
  console.log(md.join('\n'));
})();
