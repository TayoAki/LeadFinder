// Simulate shoppers driving the real web app UI (taps, scrolls, typing; no API shortcuts) and
// record every step's time and outcome plus every network call, to find bottlenecks.
//   node scripts/simulate-users.cjs --users 100 --concurrency 10 --base http://localhost:3300 \
//        --api http://localhost:9000 --key <publishable key> --out results.json
// Run against a local or staging stack: real checkouts create real orders.
const { chromium } = require('playwright');
const fs = require('fs');

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const USERS = +arg('users', 100), CONC = +arg('concurrency', 10), BASE = arg('base', 'http://localhost:3300');
const API = arg('api', 'http://localhost:9000'), KEY = arg('key', ''), OUT = arg('out', 'sim-results.json'), SHOTS = arg('shots', '');

let seed = 42; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pick = a => a[Math.floor(rnd() * a.length)];
const chance = p => rnd() < p;
const think = (pg, lo = 250, hi = 900) => pg.waitForTimeout(lo + rnd() * (hi - lo));

// Persona mix (sums to 1) and how often each one tries to buy.
const PERSONAS = [
  { name: 'browser', share: 0.25, buy: 0 },
  { name: 'onboarder', share: 0.20, buy: 0.3 },
  { name: 'searcher', share: 0.15, buy: 0.4 },
  { name: 'video', share: 0.15, buy: 0.4 },
  { name: 'ask', share: 0.10, buy: 0.3 },
  { name: 'buyer', share: 0.15, buy: 1 },
];
const SEARCHES = ['mug', 'dress', 'earring', 'bag', 'lamp', 'shoes', 'gift for dad', 'blender', 'shirt', 'glasses'];
const UTM = ['tiktok', 'instagram', 'google', '', '', 'newsletter'];

function personaFor(i) {
  const x = (i + 0.5) / USERS; let acc = 0;
  for (const p of PERSONAS) { acc += p.share; if (x <= acc) return p; }
  return PERSONAS[PERSONAS.length - 1];
}

async function runUser(browser, i, shopNames) {
  const persona = personaFor(i);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 ShelbySim' });
  const pg = await ctx.newPage();
  const u = { id: i, persona: persona.name, steps: [], net: [], errors: [], outcome: 'left', reached: [] };
  pg.on('pageerror', e => u.errors.push({ kind: 'page', msg: e.message.slice(0, 200) }));
  pg.on('requestfailed', r => { if (!/videos\/.*\.mp4/.test(r.url())) u.errors.push({ kind: 'request', msg: `${r.method()} ${new URL(r.url()).pathname} ${r.failure()?.errorText}` }); });
  pg.on('requestfinished', async r => {
    const url = new URL(r.url()); if (!/^\/(store|api)\//.test(url.pathname)) return;
    const t = r.timing(); const res = await r.response().catch(() => null);
    u.net.push({ m: r.method(), path: url.pathname.replace(/\/(cart|prod|offer|variant|sel|pay|og|reg|order|ps|pset)_[A-Za-z0-9]+/g, '/:id'), ms: Math.round(t.responseEnd), status: res?.status() ?? 0 });
  });
  const step = async (name, fn) => {
    const t0 = Date.now();
    try { await fn(); u.steps.push({ name, ms: Date.now() - t0, ok: true }); u.reached.push(name); return true; }
    catch (e) {
      u.steps.push({ name, ms: Date.now() - t0, ok: false, err: String(e.message).split('\n')[0].slice(0, 160), url: pg.url() });
      if (SHOTS) await pg.screenshot({ path: `${SHOTS}/fail-u${i}-${name}.png` }).catch(() => {});
      return false;
    }
  };
  const visible = sel => pg.locator(sel).filter({ visible: true }).first();
  const cardSel = shopNames.map(n => `[aria-label$=", ${n}"]`).join(',');
  const go = async path => { await pg.evaluate(p => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')); }, path); await pg.waitForTimeout(400); };

  const openProduct = () => step('open_product', async () => {
    const cards = pg.locator(cardSel).filter({ visible: true });
    await cards.first().waitFor({ timeout: 8000 });
    const n = await cards.count(); await cards.nth(Math.floor(rnd() * Math.min(n, 6))).click();
    await visible('[aria-label="Add to cart"]').waitFor({ timeout: 10000 });
  });
  const addToCart = () => step('add_to_cart', async () => {
    await visible('[aria-label="Add to cart"]').click(); await pg.waitForTimeout(300);
    if (await pg.getByText(/pick a size|choose a size|select a size/i).first().isVisible().catch(() => false)) {
      u.steps.push({ name: 'size_prompt', ms: 0, ok: true });
      const sizes = pg.locator('[aria-label="S"],[aria-label="M"],[aria-label="L"],[aria-label="8"],[aria-label="9"],[aria-label="7"],[aria-label="10"]').filter({ visible: true });
      await sizes.first().click(); await visible('[aria-label="Add to cart"]').click();
    }
    await visible('[aria-label^="Cart"]').waitFor({ timeout: 4000 });
  });
  const checkout = () => step('checkout', async () => {
    await go('/cart'); // same route change as tapping the Cart tab
    await visible('[aria-label^="Check"]').click({ timeout: 8000 });
    const email = visible('input[aria-label="Email for receipt"]');
    if (await email.waitFor({ timeout: 5000 }).then(() => true).catch(() => false)) await email.fill(`sim${i}@example.com`);
    const t0 = Date.now();
    await visible('[aria-label^="Pay"], [aria-label^="Continue to payment"], [aria-label^="Place order"]').click();
    await pg.waitForURL(/order-success/, { timeout: 30000 });
    u.steps.push({ name: 'pay_to_success', ms: Date.now() - t0, ok: true });
    u.outcome = 'ordered';
  });

  const utm = pick(UTM);
  // Cold start: from first byte to the first usable screen (onboarding welcome or home).
  const loaded = await step('cold_start', async () => {
    await pg.goto(`${BASE}/${utm ? `?utm_source=${utm}` : ''}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await pg.locator('[data-testid="ob-start"]').or(pg.getByText('Shop small sellers')).first().waitFor({ timeout: 30000 });
  });
  if (!loaded) { u.outcome = 'bounced_on_load'; await ctx.close(); return u; }
  // Home renders first and onboarding slides over it shortly after; record how long that takes.
  const tOb = Date.now();
  const onOnboarding = await visible('[data-testid="ob-start"]').waitFor({ timeout: 4000 }).then(() => true).catch(() => false);
  if (onOnboarding) u.steps.push({ name: 'onboarding_appears_after_home', ms: Date.now() - tOb, ok: true });

  if (onOnboarding && persona.name === 'onboarder') {
    await step('onboarding', async () => {
      await visible('[data-testid="ob-start"]').click(); await think(pg);
      await pg.locator('[role="radio"]').filter({ visible: true }).nth(Math.floor(rnd() * 3)).click(); await visible('[data-testid="ob-next"]').click(); await think(pg);
      const goalText = visible('input');
      if (await goalText.isVisible().catch(() => false)) await goalText.fill(pick(SEARCHES));
      else await visible(`[aria-label="${pick(['Home', 'Beauty', 'Women', 'Bags', 'Jewelry'])}"]`).click().catch(() => {});
      await visible('[data-testid="ob-next"]').click(); await think(pg);
      await visible('[aria-label^="Save "]').click(); await think(pg);
      await visible('[data-testid="ob-finish"]').click(); await pg.waitForTimeout(400);
      if (await pg.getByText('Not now').first().isVisible().catch(() => false)) { await pg.getByText('Not now').first().click(); await visible('[data-testid="ob-finish"]').click(); }
      await pg.getByText('Shop small sellers').first().waitFor({ timeout: 8000 });
    });
  } else if (onOnboarding) {
    await step('skip_onboarding', async () => { await pg.getByText('Just browse').first().click(); await pg.getByText('Shop small sellers').first().waitFor({ timeout: 8000 }); });
  }

  if (persona.name === 'browser' || persona.name === 'onboarder') {
    for (let k = 0; k < 2 + Math.floor(rnd() * 3); k++) { await pg.mouse.wheel(0, 600 + rnd() * 500); await think(pg, 300, 700); }
    const views = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < views; k++) {
      if (!(await openProduct())) break;
      await think(pg, 600, 1500); await pg.mouse.wheel(0, 500); await think(pg);
      if (persona.buy && k === views - 1 && chance(0.6)) await addToCart();
      await pg.goBack().catch(() => {}); await think(pg);
    }
  }
  if (persona.name === 'searcher') {
    await step('search', async () => {
      await go('/search'); // same client-side route change as tapping the Search tab
      await visible('input[placeholder^="Search products"]').fill(pick(SEARCHES)); await pg.waitForTimeout(1200);
      await pg.locator(cardSel).filter({ visible: true }).first().waitFor({ timeout: 8000 });
    });
    if (await openProduct()) { await think(pg, 600, 1400); if (chance(0.7)) await addToCart(); }
  }
  if (persona.name === 'video') {
    const ok = await step('open_videos', async () => {
      const rail = visible('[aria-label^="Watch "]'); await rail.scrollIntoViewIfNeeded({ timeout: 8000 }); await rail.click();
      await pg.locator('video').first().waitFor({ timeout: 10000 });
      await pg.waitForFunction(() => [...document.querySelectorAll('video')].some(v => !v.paused && v.currentTime > 0.3), null, { timeout: 12000 });
    });
    if (ok) {
      for (let k = 0; k < 1 + Math.floor(rnd() * 3); k++) { await think(pg, 1200, 2500); await pg.mouse.move(195, 400); await pg.mouse.wheel(0, 760); await pg.waitForTimeout(900); }
      await step('video_shop', async () => {
        await visible('[aria-label^="Shop "]').click(); await visible('[data-testid="video-add"]').click(); await pg.waitForTimeout(300);
        if (await pg.getByText('Pick a size first').isVisible().catch(() => false)) {
          u.steps.push({ name: 'size_prompt', ms: 0, ok: true });
          await pg.locator('[aria-label="S"],[aria-label="M"],[aria-label="8"],[aria-label="9"]').filter({ visible: true }).first().click(); await visible('[data-testid="video-add"]').click();
        }
      });
    }
  }
  if (persona.name === 'ask') {
    await step('ask_shelby', async () => {
      await pg.getByText('Ask Shelby').first().click();
      await pg.locator('[role="button"]').filter({ hasText: /gift|under|\$/i }).filter({ visible: true }).first().click({ timeout: 8000 });
      await pg.locator(cardSel).filter({ visible: true }).first().waitFor({ timeout: 10000 });
    });
    if (await openProduct()) { await think(pg); if (chance(0.6)) await addToCart(); }
  }
  if (persona.name === 'buyer') {
    for (let k = 0; k < 2; k++) {
      if (await openProduct()) { await think(pg, 500, 1200); await addToCart(); await pg.goBack().catch(() => {}); await think(pg); }
    }
  }
  const hasCart = await pg.locator('[aria-label^="Cart, "]').first().getAttribute('aria-label').then(l => !/Cart, 0/.test(l || 'Cart, 0')).catch(() => false);
  if (hasCart && u.outcome !== 'ordered' && chance(persona.buy)) await checkout();
  else if (hasCart && u.outcome !== 'ordered') u.outcome = 'abandoned_cart';
  await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))).catch(() => {});
  await ctx.close();
  return u;
}

(async () => {
  const sellers = await (await fetch(`${API}/store/sellers?limit=100`, { headers: { 'x-publishable-api-key': KEY } })).json();
  const shopNames = sellers.sellers.map(s => s.name);
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const results = []; let next = 0; const t0 = Date.now();
  const worker = async () => { while (next < USERS) { const i = next++; const r = await runUser(browser, i, shopNames).catch(e => ({ id: i, crashed: String(e.message).slice(0, 200), steps: [], net: [], errors: [] })); results.push(r); process.stdout.write(`${results.length}/${USERS} ${r.persona || '?'} ${r.outcome || r.crashed}\n`); } };
  await Promise.all(Array.from({ length: CONC }, worker));
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify({ users: USERS, concurrency: CONC, wall_ms: Date.now() - t0, results }, null, 1));
  console.log(`done in ${Math.round((Date.now() - t0) / 1000)}s -> ${OUT}`);
})();
