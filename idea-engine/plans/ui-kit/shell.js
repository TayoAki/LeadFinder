// Shared behaviour for the three mockups. No backend.
// Hooks an app can define: window.onTab(id), window.onSelect(id), window.onRail(view), window.onRole(role), window.onReady().
(function(){
  const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
  window.UI = { $, $$ };
  let lastFocus = null;
  function selectTab(id){
    const panel = $('#panel-' + id); if (!panel) return;
    $$('.tabs [role="tab"]').forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    $$('.panel').forEach(p => p.hidden = p !== panel);
    // keep the rail in sync: highlight the rail button that targets this tab, if any
    const railBtn = $$('.rail button[data-tab-target]').find(b => b.dataset.tabTarget.split(' ').includes(id));
    $$('.rail button[data-view]').forEach(x => x.removeAttribute('aria-current'));
    if (railBtn) railBtn.setAttribute('aria-current', 'page');
    document.body.dataset.tab = id;
    if (window.onTab) window.onTab(id);
    try { localStorage.setItem(document.title + ':tab', id); } catch(e) {}
  }
  function openDrawer(which){
    const el = $(which === 'side' ? '.side' : '.right'); if (!el) return;
    lastFocus = document.activeElement; el.classList.add('open'); document.body.classList.add('drawer-open');
    const close = el.querySelector('.drawer-close') || el.querySelector('button,select,a,[tabindex]'); close && close.focus();
  }
  function closeDrawers(){
    $$('.side.open,.right.open').forEach(e => e.classList.remove('open')); document.body.classList.remove('drawer-open');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); lastFocus = null;
  }
  window.UI.selectTab = selectTab; window.UI.closeDrawers = closeDrawers; window.UI.openDrawer = openDrawer;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]'); if (t) selectTab(t.dataset.tab);
    const goto = e.target.closest('[data-goto]'); if (goto) selectTab(goto.dataset.goto);
    const it = e.target.closest('.side .item[data-select]');
    if (it) { $$('.side .item[data-select]').forEach(x => x.removeAttribute('aria-current')); it.setAttribute('aria-current', 'true');
      if (window.onSelect) window.onSelect(it.dataset.select); if (window.matchMedia('(max-width:760px)').matches) closeDrawers(); }
    const r = e.target.closest('.rail button[data-view]');
    if (r) { if (r.dataset.tabTarget) selectTab(r.dataset.tabTarget.split(' ')[0]);
      $$('.rail button[data-view]').forEach(x => x.removeAttribute('aria-current')); r.setAttribute('aria-current', 'page');
      if (window.onRail) window.onRail(r.dataset.view); }
    if (e.target.closest('.toggle-side')) { $('.side').classList.contains('open') ? closeDrawers() : openDrawer('side'); }
    if (e.target.closest('.toggle-right')) { $('.right').classList.contains('open') ? closeDrawers() : openDrawer('right'); }
    if (e.target.closest('.drawer-close') || e.target.closest('.backdrop')) closeDrawers();
    const a = e.target.closest('[data-toast]'); if (a) toast(a.dataset.toast);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawers(); return; }
    const tab = e.target.closest && e.target.closest('.tabs [role="tab"]'); if (!tab) return;
    const tabs = $$('.tabs [role="tab"]').filter(t => !t.hidden), i = tabs.indexOf(tab);
    let n = null;
    if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') n = tabs[(i + tabs.length - 1) % tabs.length];
    if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); n.focus(); selectTab(n.dataset.tab); }
  });
  document.addEventListener('change', e => { if (e.target.id === 'role' && window.onRole) { document.body.dataset.role = e.target.value; window.onRole(e.target.value); } });
  function toast(msg){ let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600); }
  window.UI.toast = toast;
  window.addEventListener('DOMContentLoaded', () => {
    if (!$('.backdrop')) { const b = document.createElement('div'); b.className = 'backdrop'; b.setAttribute('aria-hidden', 'true'); document.body.appendChild(b); }
    const role = $('#role'); if (role) document.body.dataset.role = role.value;
    if (window.onReady) window.onReady();
    let start = $('.tabs [role="tab"]:not([hidden])')?.dataset.tab;
    const h = location.hash.replace('#', ''); if (h && $('#panel-' + h)) start = h;
    if (start) selectTab(start);
  });
})();
