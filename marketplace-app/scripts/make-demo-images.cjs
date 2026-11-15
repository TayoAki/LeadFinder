// Renders simple, generic packshots for the synthetic demo products (no brands, no photos of
// real products) into public/demo/<slug>.png. Run: node scripts/make-demo-images.cjs
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const data = require('./demo-niche-products.json');
const out = path.join(__dirname, '..', 'public', 'demo');
fs.mkdirSync(out, { recursive: true });

const shape = (p) => {
  const supp = p.category === 'Supplements';
  const body = supp
    ? `<div class="cap" style="background:${p.color}"></div><div class="bottle"><div class="label" style="border-color:${p.color}">`
    : `<div class="pump" style="background:${p.color}"></div><div class="tube"><div class="label" style="border-color:${p.color}">`;
  return `${body}<small style="color:${p.color}">DAILY RITUAL · DEMO</small><b>${p.title}</b><i>${supp ? (p.details.servings + ' servings') : p.details.skin_type.split(',')[0] + ' skin'}</i></div></div>`;
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
  for (const p of data.products) {
    await page.setContent(`<html><body style="margin:0;width:800px;height:800px;display:flex;align-items:center;justify-content:center;flex-direction:column;
      background:radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F1ECE4 70%);font-family:Helvetica,Arial,sans-serif">
      <style>
        .cap{width:200px;height:70px;border-radius:14px 14px 4px 4px}
        .bottle{width:300px;height:430px;background:#FBF8F3;border-radius:40px;box-shadow:0 30px 60px rgba(43,6,39,.18), inset -18px 0 30px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:center}
        .pump{width:60px;height:90px;border-radius:10px 10px 0 0}
        .tube{width:240px;height:470px;background:#FFFFFF;border-radius:28px 28px 60px 60px;box-shadow:0 30px 60px rgba(43,6,39,.18), inset -16px 0 26px rgba(0,0,0,.05);display:flex;align-items:center;justify-content:center}
        .label{width:82%;border-top:10px solid;padding:22px 14px;background:#fff;text-align:center;display:flex;flex-direction:column;gap:10px}
        .label small{font-size:14px;letter-spacing:3px;font-weight:700}
        .label b{font-size:30px;line-height:1.1;color:#2B0627}
        .label i{font-size:17px;color:#5E4B5B;font-style:normal}
      </style>${shape(p)}</body></html>`);
    await page.screenshot({ path: path.join(out, `${p.slug}.png`) });
  }
  await browser.close();
  console.log(`${data.products.length} images -> ${out}`);
})();
