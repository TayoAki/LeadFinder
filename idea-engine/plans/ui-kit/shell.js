// Shared behaviour: tabs, sidebar selection, drawers, toasts, rail views. No backend.
(function(){
  const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
  window.UI = { $, $$ };
  function selectTab(id){
    $$('.tabs [role="tab"]').forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    $$('.panel').forEach(p => p.hidden = p.id !== 'panel-' + id);
    try { localStorage.setItem(document.title + ':tab', id); } catch(e) {}
  }
  window.UI.selectTab = selectTab;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab]'); if (t) { selectTab(t.dataset.tab); }
    const goto = e.target.closest('[data-goto]'); if (goto) { selectTab(goto.dataset.goto); }
    const it = e.target.closest('.side .item[data-select]');
    if (it) { $$('.side .item[data-select]').forEach(x => x.removeAttribute('aria-current')); it.setAttribute('aria-current', 'true');
      if (window.onSelect) window.onSelect(it.dataset.select); $('.side').classList.remove('open'); }
    const r = e.target.closest('.rail button[data-view]');
    if (r) { $$('.rail button[data-view]').forEach(x => x.removeAttribute('aria-current')); r.setAttribute('aria-current', 'page');
      if (r.dataset.tabTarget) selectTab(r.dataset.tabTarget); if (window.onRail) window.onRail(r.dataset.view); }
    if (e.target.closest('.toggle-side')) $('.side').classList.toggle('open');
    if (e.target.closest('.toggle-right')) $('.right').classList.toggle('open');
    const a = e.target.closest('[data-toast]'); if (a) toast(a.dataset.toast);
  });
  document.addEventListener('keydown', e => {
    const tab = e.target.closest('.tabs [role="tab"]'); if (!tab) return;
    const tabs = $$('.tabs [role="tab"]'), i = tabs.indexOf(tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); selectTab(n.dataset.tab); }
    if (e.key === 'Escape') { $('.side').classList.remove('open'); $('.right').classList.remove('open'); }
  });
  function toast(msg){ let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200); }
  window.UI.toast = toast;
  window.addEventListener('DOMContentLoaded', () => {
    let start = $('.tabs [role="tab"]')?.dataset.tab;
    const h = location.hash.replace('#', ''); if (h && $('#panel-' + h)) start = h;
    if (start) selectTab(start);
  });
})();
