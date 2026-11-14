// Shelby for Sellers: shop owners set up their shop, upload products and ship orders.
// Vanilla JS, hash routes. Everything user-provided goes through esc() before it touches innerHTML.
const $ = s => document.querySelector(s);
const main = $('#main');
const CATS = ['Home', 'Beauty', 'Women', 'Men', 'Shoes', 'Bags', 'Jewelry', 'Accessories', 'Outdoors'];
const SIZE_SETS = { Clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], Shoes: ['6', '7', '8', '9', '10', '11', '12'], 'One size': [] };
const state = { user: null, shop: null };

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => `$${Number(n || 0).toFixed(2)}`;
const when = d => d ? new Date(d.replace(' ', 'T') + 'Z').toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2600); }
async function api(path, opts = {}) {
  const res = await fetch(path, { method: opts.method || 'GET', headers: opts.body ? { 'content-type': 'application/json' } : {}, body: opts.body ? JSON.stringify(opts.body) : undefined, credentials: 'same-origin' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// Resize in the browser before upload: long edge 1600px, JPEG 85%. Keeps uploads small on phones.
async function resize(file) {
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) throw new Error('Could not read that image');
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.85);
}
async function upload(file) { const { url } = await api('/api/seller/upload', { method: 'POST', body: { dataUrl: await resize(file) } }); return url; }

function chrome() {
  const signedIn = !!state.user;
  $('#nav').hidden = !signedIn || !state.shop;
  $('#nav-admin').hidden = state.user?.role !== 'admin';
  $('#who').innerHTML = signedIn ? `<span class="hide-sm">${esc(state.user.email)}</span><button class="btn sm" id="logout">Log out</button>` : '';
  $('#logout')?.addEventListener('click', async () => { await api('/api/auth/logout', { method: 'POST' }); state.user = null; state.shop = null; location.hash = '#/login'; });
  const page = (location.hash.split('/')[1] || 'dash').split('?')[0];
  document.querySelectorAll('[data-nav]').forEach(a => a.setAttribute('aria-current', a.dataset.nav === (page || 'dash') ? 'page' : 'false'));
}

// ---------- views ----------
function viewAuth(mode) {
  const signup = mode === 'signup';
  main.innerHTML = `<div class="auth card">
    <img src="/seller/mark.png" alt="" height="56" />
    <h1 style="margin-top:12px">${signup ? 'Open your shop on Shelby' : 'Welcome back'}</h1>
    <p class="sub">${signup ? 'Sell to people who love small shops. 0% commission for your first 60 days.' : 'Log in to manage your shop.'}</p>
    <form id="f" novalidate>
      ${signup ? '<label for="name">Your name</label><input id="name" autocomplete="name" required />' : ''}
      <label for="email">Email</label><input id="email" type="email" autocomplete="email" required />
      <label for="pw">Password</label><input id="pw" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="8" required />
      ${signup ? '<p class="help">At least 8 characters.</p><details style="margin-top:10px"><summary class="help">Platform admin? Enter your setup code</summary><label for="code">Admin setup code</label><input id="code" autocomplete="off" /></details>' : ''}
      <div class="err" id="err" role="alert"></div>
      <button class="btn primary" style="width:100%;justify-content:center;margin-top:6px">${signup ? 'Create account' : 'Log in'}</button>
    </form>
    <p class="help" style="text-align:center;margin-top:16px">${signup ? 'Already selling? <a href="#/login">Log in</a>' : 'New here? <a href="#/signup">Open a shop</a>'}</p>
  </div>`;
  $('#f').addEventListener('submit', async e => {
    e.preventDefault(); $('#err').textContent = '';
    try {
      const body = { email: $('#email').value, password: $('#pw').value, ...(signup ? { name: $('#name').value, setupCode: $('#code').value } : {}) };
      const { user } = await api(`/api/auth/${signup ? 'signup' : 'login'}`, { method: 'POST', body });
      state.user = user; await loadMe(); location.hash = state.shop ? '#/' : '#/shop';
    } catch (err) { $('#err').textContent = err.message; }
  });
  (signup ? $('#name') : $('#email')).focus();
}

function shopForm(s = {}) {
  return `<form id="shopf" class="grid g2" novalidate>
    <div class="card">
      <h2>About your shop</h2>
      <label for="s-name">Shop name</label><input id="s-name" value="${esc(s.name)}" maxlength="60" required />
      <label for="s-tag">One line about what you make</label><input id="s-tag" value="${esc(s.tagline)}" maxlength="120" placeholder="Hand-thrown mugs from Asheville, NC" />
      <label for="s-cat">Main category</label><select id="s-cat">${CATS.map(c => `<option ${c === s.category ? 'selected' : ''}>${c}</option>`).join('')}</select>
      <label for="s-links">Where you sell now (optional)</label><input id="s-links" value="${esc(s.links)}" placeholder="Instagram, Etsy or website" />
      <div class="row" style="margin-top:14px">
        <div style="flex:1"><label>Logo</label><div class="row"><img id="logo-img" class="thumb" src="${esc(s.logo || '/seller/mark.png')}" alt="Shop logo" /><button type="button" class="btn sm" id="logo-btn">Upload</button></div></div>
        <div style="flex:1"><label>Banner</label><div class="row"><img id="banner-img" class="thumb" style="width:90px" src="${esc(s.banner || s.logo || '/seller/mark.png')}" alt="Shop banner" /><button type="button" class="btn sm" id="banner-btn">Upload</button></div></div>
      </div>
      <input type="file" id="img-file" accept="image/png,image/jpeg,image/webp" hidden />
    </div>
    <div class="card">
      <h2>Shipping and returns</h2>
      <label for="s-ships">Ships in</label><select id="s-ships">${['Same day', '1–2 days', '2–3 days', '3–5 days', '1–2 weeks (made to order)'].map(v => `<option ${v === s.shipsIn ? 'selected' : ''}>${v}</option>`).join('')}</select>
      <label for="s-fee">Flat shipping fee (USD)</label><input id="s-fee" type="number" min="0" step="0.01" value="${esc(s.shipping ?? 5.95)}" />
      <label for="s-free">Free shipping on orders over (USD)</label><input id="s-free" type="number" min="0" step="1" value="${esc(s.freeOver ?? 50)}" />
      <p class="help">Shoppers see a progress bar toward your free-shipping amount in their cart.</p>
      <label for="s-ret">Returns window (days)</label><input id="s-ret" type="number" min="0" max="365" value="${esc(s.returnDays ?? 30)}" />
      <div class="err" id="err" role="alert"></div>
      <button class="btn primary" style="margin-top:8px">${s.id ? 'Save changes' : 'Create my shop'}</button>
    </div>
  </form>`;
}
function bindShopForm() {
  let logo = state.shop?.logo || '', banner = state.shop?.banner || '', target = null;
  const file = $('#img-file');
  $('#logo-btn').onclick = () => { target = 'logo'; file.click(); };
  $('#banner-btn').onclick = () => { target = 'banner'; file.click(); };
  file.onchange = async () => {
    const f = file.files[0]; file.value = ''; if (!f) return;
    try { const url = await upload(f); if (target === 'logo') { logo = url; $('#logo-img').src = url; } else { banner = url; $('#banner-img').src = url; } toast('Uploaded'); }
    catch (e) { toast(e.message); }
  };
  $('#shopf').addEventListener('submit', async e => {
    e.preventDefault(); $('#err').textContent = '';
    try {
      const { shop } = await api('/api/seller/shop', { method: 'POST', body: { name: $('#s-name').value, tagline: $('#s-tag').value, category: $('#s-cat').value, links: $('#s-links').value,
        logo, banner, shipsIn: $('#s-ships').value, shipping: $('#s-fee').value, freeOver: $('#s-free').value, returnDays: $('#s-ret').value } });
      const first = !state.shop; state.shop = shop; toast('Shop saved'); chrome();
      if (first) location.hash = '#/products/new';
    } catch (err) { $('#err').textContent = err.message; }
  });
}

function viewShop() {
  const s = state.shop;
  main.innerHTML = `<h1>${s ? 'Shop settings' : 'Set up your shop'}</h1>
    <p class="sub">${s ? 'This is what shoppers see on your shop page.' : 'Two minutes. You can change all of this later.'}</p>
    ${s?.status === 'pending' ? '<div class="banner">Your shop is in review. Add products now: they go live as soon as you’re approved, usually within a day.</div>' : ''}
    ${s?.status === 'suspended' ? '<div class="banner">Your shop is paused. Contact support to restore it.</div>' : ''}
    ${shopForm(s || {})}`;
  bindShopForm();
}

async function viewDash() {
  await loadMe(); chrome();
  const [st, orders] = await Promise.all([api('/api/seller/stats'), api('/api/seller/orders')]);
  const s = state.shop;
  main.innerHTML = `<div class="row spread"><div><h1>${esc(s.name)}</h1><p class="sub">${esc(s.tagline || 'Your shop on Shelby')} · <span class="pill ${esc(s.status)}">${esc(s.status)}</span></p></div>
      <a class="btn primary" href="#/products/new">+ Add product</a></div>
    ${s.status === 'pending' ? '<div class="banner">In review. Add products now; they go live when your shop is approved.</div>' : ''}
    <div class="grid g3">
      <a class="card stat" href="#/orders" style="text-decoration:none;${st.toShip ? 'border-color:var(--accent)' : ''}"><b style="color:${st.toShip ? 'var(--accent)' : 'inherit'}">${st.toShip}</b><span>Orders to ship</span></a>
      <div class="card stat"><b>${money(st.sales30)}</b><span>Sales, last 30 days (${st.orders30} orders)</span></div>
      <a class="card stat" href="#/products" style="text-decoration:none"><b>${st.live}</b><span>Live products${st.drafts ? ` · ${st.drafts} drafts` : ''}</span></a>
      <a class="card stat" href="#/products" style="text-decoration:none"><b style="color:${st.lowStock ? 'var(--warn)' : 'inherit'}">${st.lowStock}</b><span>Low on stock (3 or fewer)</span></a>
    </div>
    <div class="grid g2" style="margin-top:14px">
      <div class="card"><h2>Latest orders</h2>${orders.length ? orders.slice(0, 5).map(o => `<div class="row spread" style="padding:8px 0;border-bottom:1px solid var(--line)">
          <div class="row">${o.lines[0]?.image ? `<img class="thumb" src="${esc(o.lines[0].image)}" alt="" />` : ''}<div><b>${esc(o.buyer_name || o.buyer_email || 'Shopper')}</b><div class="help">${o.lines.reduce((n, l) => n + l.qty, 0)} item(s) · ${money(o.subtotal)} · ${when(o.placed)}</div></div></div>
          <span class="pill ${esc(o.status)}">${o.status === 'Paid' ? 'To ship' : esc(o.status)}</span></div>`).join('') : '<p class="help">No orders yet. Share your shop link to bring your first buyers.</p>'}</div>
      <div class="card"><h2>Bring your followers</h2><p class="help">Shoppers who arrive from your link check out with Apple Pay and auto-follow your shop.</p>
        <label>Your shop link</label><div class="row"><input id="shoplink" readonly value="${esc(location.origin)}/shop/${esc(s.id)}" /><button class="btn sm" id="copy">Copy</button></div></div>
    </div>`;
  $('#copy').onclick = () => { navigator.clipboard?.writeText($('#shoplink').value); toast('Link copied'); };
}

async function viewProducts() {
  const items = (await api('/api/seller/products')).filter(p => p.status !== 'archived');
  main.innerHTML = `<div class="row spread"><div><h1>Products</h1><p class="sub">${items.length} product${items.length === 1 ? '' : 's'}</p></div><a class="btn primary" href="#/products/new">+ Add product</a></div>
    ${items.length ? `<div class="card" style="padding:6px 12px"><table><thead><tr><th></th><th>Product</th><th class="hide-sm">Price</th><th>Stock</th><th>Status</th><th></th></tr></thead><tbody>
      ${items.map(p => `<tr><td><img class="thumb" src="${esc(p.image || '/seller/mark.png')}" alt="" /></td><td><b>${esc(p.title)}</b><div class="help">${esc(p.category)}${p.sizes.length ? ` · ${p.sizes.length} sizes` : ''}</div></td>
        <td class="hide-sm">${money(p.price)}</td><td style="color:${p.stock <= 3 ? 'var(--warn)' : 'inherit'};font-weight:700">${p.stock}</td><td><span class="pill ${esc(p.status)}">${esc(p.status)}</span></td>
        <td><a class="btn sm" href="#/products/${encodeURIComponent(p.id)}">Edit</a></td></tr>`).join('')}
    </tbody></table></div>` : `<div class="card empty"><img src="/seller/mark.png" alt="" height="64" style="margin:0 auto 12px" /><h2>Add your first product</h2><p>Shops with 10 or more products get featured in Shelby's new-shop spotlight.</p><a class="btn primary" href="#/products/new">+ Add product</a></div>`}`;
}

async function viewEditor(pid) {
  const existing = pid !== 'new' ? (await api('/api/seller/products')).find(p => p.id === pid) : null;
  if (pid !== 'new' && !existing) { main.innerHTML = '<div class="card empty">Product not found.</div>'; return; }
  const p = existing || { title: '', description: '', category: state.shop.category || 'Home', price: '', compareAt: '', stock: 10, images: [], sizes: [], status: 'draft' };
  let images = [...p.images]; let sizes = [...p.sizes];
  main.innerHTML = `<div class="row spread"><div><h1>${existing ? 'Edit product' : 'New product'}</h1><p class="sub">${existing ? `<span class="pill ${esc(p.status)}">${esc(p.status)}</span>` : 'Photos first: the first photo is the one shoppers see and share.'}</p></div>
      <a class="btn" href="#/products">Cancel</a></div>
    <form id="pf" class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr)" novalidate>
      <div class="grid">
        <div class="card"><h2>Photos <span class="help">(up to 8)</span></h2><div class="photos" id="photos"></div>
          <input type="file" id="pfile" accept="image/png,image/jpeg,image/webp" multiple hidden />
          <p class="help">Natural light and a plain background sell best. Drag photos onto the box, or tap it.</p></div>
        <div class="card"><h2>Details</h2>
          <label for="p-title">Title</label><input id="p-title" value="${esc(p.title)}" maxlength="120" placeholder="Speckled stoneware mug, 12 oz" />
          <label for="p-desc">Description</label><textarea id="p-desc" maxlength="4000" placeholder="What it's made of, size, care, why you made it.">${esc(p.description)}</textarea>
          <label for="p-cat">Category</label><select id="p-cat">${CATS.map(c => `<option ${c === p.category ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="card"><h2>Sizes</h2><p class="help" style="margin-top:-6px">Leave empty for one-size items.</p>
          <div class="row" style="margin:10px 0">${Object.keys(SIZE_SETS).map(k => `<button type="button" class="btn sm" data-set="${esc(k)}">${esc(k)}</button>`).join('')}</div>
          <div class="chips" id="sizes"></div>
          <div class="row" style="margin-top:10px"><input id="size-add" placeholder="Add a size (e.g. 8 oz)" style="max-width:220px" maxlength="12" /><button type="button" class="btn sm" id="size-btn">Add</button></div></div>
      </div>
      <div class="grid" style="align-content:start">
        <div class="card"><h2>Price and stock</h2>
          <label for="p-price">Price (USD)</label><input id="p-price" type="number" min="0.5" step="0.01" value="${esc(p.price)}" />
          <p class="help" id="keep"></p>
          <label for="p-compare">Compare-at price (optional)</label><input id="p-compare" type="number" min="0" step="0.01" value="${esc(p.compareAt ?? '')}" />
          <p class="help">Shows a "Save $X" badge when higher than the price.</p>
          <label for="p-stock">Stock</label><input id="p-stock" type="number" min="0" step="1" value="${esc(p.stock)}" />
          <p class="help">Shoppers see "Only N left" at 5 or fewer.</p></div>
        <div class="card"><h2>Preview</h2><div class="preview" id="preview"></div></div>
        <div class="card"><div class="err" id="err" role="alert"></div>
          <button type="button" class="btn primary" id="publish" style="width:100%;justify-content:center">${p.status === 'live' ? 'Save and keep live' : 'Publish'}</button>
          <button type="button" class="btn" id="draft" style="width:100%;justify-content:center;margin-top:8px">${p.status === 'live' ? 'Unpublish (save as draft)' : 'Save as draft'}</button>
          ${existing ? '<button type="button" class="btn" id="del" style="width:100%;justify-content:center;margin-top:8px;color:#B4231A">Archive product</button>' : ''}
          ${state.shop.status !== 'approved' ? '<p class="help">Your shop is in review, so published products appear once it’s approved.</p>' : ''}</div>
      </div>
    </form>`;
  if (innerWidth < 760) $('#pf').style.gridTemplateColumns = '1fr';

  const drawPhotos = () => {
    $('#photos').innerHTML = images.map((u, i) => `<div class="photo ${i === 0 ? 'cover' : ''}">${i === 0 ? '<span class="badge">COVER</span>' : ''}<img src="${esc(u)}" alt="Product photo ${i + 1}" />
      <div class="tools">${i ? `<button type="button" data-cover="${i}">Make cover</button>` : '<span></span>'}<button type="button" data-rm="${i}" aria-label="Remove photo ${i + 1}">✕</button></div></div>`).join('')
      + (images.length < 8 ? `<button type="button" class="drop" id="drop"><span style="font-size:26px">+</span>Add photos</button>` : '');
    $('#drop')?.addEventListener('click', () => $('#pfile').click());
    const d = $('#drop');
    if (d) {
      d.addEventListener('dragover', e => { e.preventDefault(); d.classList.add('over'); });
      d.addEventListener('dragleave', () => d.classList.remove('over'));
      d.addEventListener('drop', e => { e.preventDefault(); d.classList.remove('over'); addFiles([...e.dataTransfer.files]); });
    }
    document.querySelectorAll('[data-cover]').forEach(b => b.onclick = () => { const i = +b.dataset.cover; images.unshift(images.splice(i, 1)[0]); drawPhotos(); drawPreview(); });
    document.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { images.splice(+b.dataset.rm, 1); drawPhotos(); drawPreview(); });
  };
  const addFiles = async files => {
    for (const f of files.slice(0, 8 - images.length)) {
      try { toast('Uploading…'); images.push(await upload(f)); drawPhotos(); drawPreview(); } catch (e) { toast(e.message); }
    }
    toast('Photos added');
  };
  $('#pfile').onchange = () => { const fs = [...$('#pfile').files]; $('#pfile').value = ''; addFiles(fs); };

  const drawSizes = () => {
    $('#sizes').innerHTML = sizes.length ? sizes.map((s, i) => `<button type="button" class="chip" aria-pressed="true" data-size="${i}" aria-label="Remove size ${esc(s)}">${esc(s)} ✕</button>`).join('') : '<span class="help">One size</span>';
    document.querySelectorAll('[data-size]').forEach(b => b.onclick = () => { sizes.splice(+b.dataset.size, 1); drawSizes(); });
  };
  document.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { sizes = [...SIZE_SETS[b.dataset.set]]; drawSizes(); });
  $('#size-btn').onclick = () => { const v = $('#size-add').value.trim(); if (v && !sizes.includes(v) && sizes.length < 12) { sizes.push(v); $('#size-add').value = ''; drawSizes(); } };

  const drawPreview = () => {
    const price = Number($('#p-price').value) || 0, cmp = Number($('#p-compare').value) || 0;
    $('#keep').textContent = price ? `You keep ${money(price * 0.9)} after the 10% commission (0% during your first 60 days).` : '';
    $('#preview').innerHTML = `${images[0] ? `<img src="${esc(images[0])}" alt="" />` : '<div style="aspect-ratio:1/1.1;background:#EFE7DC"></div>'}
      <div><div class="help" style="margin:0">${esc(state.shop.name)}</div><b>${esc($('#p-title').value || 'Your product title')}</b>
      <div><b style="color:${cmp > price ? 'var(--accent)' : 'inherit'}">${money(price)}</b> ${cmp > price ? `<s class="help">${money(cmp)}</s>` : ''}</div>
      ${Number($('#p-stock').value) <= 5 ? `<span class="pill suspended">Only ${Number($('#p-stock').value) || 0} left</span>` : ''}</div>`;
  };
  ['#p-title', '#p-price', '#p-compare', '#p-stock'].forEach(s => $(s).addEventListener('input', drawPreview));

  const save = async status => {
    $('#err').textContent = '';
    const body = { title: $('#p-title').value, description: $('#p-desc').value, category: $('#p-cat').value, price: $('#p-price').value, compareAt: $('#p-compare').value, stock: $('#p-stock').value, images, sizes, status };
    try {
      await api(existing ? `/api/seller/products/${encodeURIComponent(existing.id)}` : '/api/seller/products', { method: existing ? 'PUT' : 'POST', body });
      toast(status === 'live' ? 'Published' : 'Saved as draft'); location.hash = '#/products';
    } catch (e) { $('#err').textContent = e.message; }
  };
  $('#publish').onclick = () => save('live');
  $('#draft').onclick = () => save('draft');
  $('#del')?.addEventListener('click', async () => { if (!confirm('Archive this product? It disappears from the app; past orders keep it.')) return; await api(`/api/seller/products/${encodeURIComponent(existing.id)}`, { method: 'DELETE' }); toast('Archived'); location.hash = '#/products'; });
  drawPhotos(); drawSizes(); drawPreview();
}

async function viewOrders() {
  const orders = await api('/api/seller/orders');
  const toShip = orders.filter(o => o.status === 'Paid');
  const done = orders.filter(o => o.status !== 'Paid');
  const card = o => `<div class="card" style="margin-bottom:12px">
    <div class="row spread"><div><b>Order ${esc(o.purchase_id)}</b> · <span class="help">${when(o.placed)}</span></div><span class="pill ${esc(o.status)}">${o.status === 'Paid' ? 'To ship' : esc(o.status)}</span></div>
    <div class="grid g2" style="margin-top:10px">
      <div>${o.lines.map(l => `<div class="row" style="margin-bottom:8px">${l.image ? `<img class="thumb" src="${esc(l.image)}" alt="" />` : ''}<div><b>${esc(l.title)}</b><div class="help">${l.size ? `Size ${esc(l.size)} · ` : ''}Qty ${l.qty} · ${money(l.price * l.qty)}</div></div></div>`).join('')}</div>
      <div><div class="help"><b style="color:var(--ink)">Ship to</b><br>${esc(o.buyer_name || '')}${o.buyer_name ? '<br>' : ''}${esc(o.address || 'Address on the packing slip')}<br>${esc(o.buyer_email || '')}</div>
        <div class="help" style="margin-top:6px">Items ${money(o.subtotal)} · Shipping charged ${o.shipping ? money(o.shipping) : 'free'}</div></div>
    </div>
    ${o.status === 'Paid' ? `<form class="row" data-ship="${esc(o.id)}" style="margin-top:12px">
        <label class="sr" for="c-${esc(o.id)}">Carrier</label><select id="c-${esc(o.id)}" style="max-width:130px">${['USPS', 'UPS', 'FedEx', 'DHL', 'Other'].map(c => `<option>${c}</option>`).join('')}</select>
        <label class="sr" for="t-${esc(o.id)}">Tracking number</label><input id="t-${esc(o.id)}" placeholder="Tracking number" style="flex:1;min-width:180px" />
        <button class="btn primary">Mark shipped</button></form><p class="help">The buyer gets a ping with tracking, and your payout for this order is released.</p>`
      : `<p class="help" style="margin-top:10px">${esc(o.carrier || '')} ${esc(o.tracking || '')} · shipped ${when(o.shipped_at)}</p>`}
  </div>`;
  main.innerHTML = `<h1>Orders</h1><p class="sub">${toShip.length} to ship · ${done.length} shipped</p>
    ${orders.length ? `${toShip.map(card).join('')}${done.length ? `<h2 style="margin-top:24px">Shipped</h2>${done.map(card).join('')}` : ''}` : '<div class="card empty"><h2>No orders yet</h2><p>When someone buys from your shop in the Shelby app, it shows up here.</p></div>'}`;
  document.querySelectorAll('[data-ship]').forEach(f => f.addEventListener('submit', async e => {
    e.preventDefault(); const oid = f.dataset.ship;
    try { await api(`/api/seller/orders/${encodeURIComponent(oid)}/ship`, { method: 'POST', body: { carrier: $(`#c-${CSS.escape(oid)}`).value, tracking: $(`#t-${CSS.escape(oid)}`).value } }); toast('Marked shipped'); viewOrders(); }
    catch (err) { toast(err.message); }
  }));
}

async function viewAdmin() {
  if (state.user.role !== 'admin') { main.innerHTML = '<div class="card empty">Admins only.</div>'; return; }
  const shops = await api('/api/admin/shops');
  const pending = shops.filter(s => s.status === 'pending');
  main.innerHTML = `<h1>Shop approvals</h1><p class="sub">${pending.length} waiting for review · ${shops.length} shops in total</p>
    <div class="card" style="padding:6px 12px"><table><thead><tr><th></th><th>Shop</th><th class="hide-sm">Owner</th><th>Products</th><th>Status</th><th></th></tr></thead><tbody>
    ${shops.map(s => `<tr><td><img class="thumb" src="${esc(s.logo || '/seller/mark.png')}" alt="" /></td><td><b>${esc(s.name)}</b><div class="help">${esc(s.tagline)}${s.links ? ` · ${esc(s.links)}` : ''}</div></td>
      <td class="hide-sm">${esc(s.ownerEmail || 'sample shop')}</td><td>${s.products}</td><td><span class="pill ${esc(s.status)}">${esc(s.status)}</span></td>
      <td><div class="row">${s.status !== 'approved' ? `<button class="btn sm primary" data-st="approved" data-id="${esc(s.id)}">Approve</button>` : ''}${s.status !== 'suspended' ? `<button class="btn sm" data-st="suspended" data-id="${esc(s.id)}">Suspend</button>` : ''}</div></td></tr>`).join('')}
    </tbody></table></div>`;
  document.querySelectorAll('[data-st]').forEach(b => b.onclick = async () => { await api(`/api/admin/shops/${encodeURIComponent(b.dataset.id)}/status`, { method: 'POST', body: { status: b.dataset.st } }); toast(`Shop ${b.dataset.st}`); viewAdmin(); });
}

// ---------- routing ----------
async function loadMe() { const r = await api('/api/me'); state.user = r.user; state.shop = r.shop; }
async function route() {
  const [, page = '', arg] = location.hash.split('/');
  chrome();
  try {
    if (!state.user) return viewAuth(page === 'signup' ? 'signup' : 'login');
    if (!state.shop && page !== 'admin') return viewShop();
    main.innerHTML = '<div class="skeleton"></div>';
    if (page === 'products' && arg) return await viewEditor(decodeURIComponent(arg));
    const view = { '': viewDash, products: viewProducts, orders: viewOrders, shop: viewShop, admin: viewAdmin }[page] || viewDash;
    await view();
  } catch (e) { main.innerHTML = `<div class="card empty">${esc(e.message)}</div>`; }
  main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route);
loadMe().catch(() => {}).finally(route);
