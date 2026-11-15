// Catalogue blog: serves the generated listicle + advertorial posts (server/content/catalog-posts.json.gz)
// to the app as JSON, and to search engines as crawlable HTML inside the app shell.
//   GET /api/blog/posts?category=&q=&type=&page=  summaries (20 per page) + category counts
//   GET /api/blog/post/<slug>                       one post with its related posts' summaries
//   GET /sitemap.xml, /robots.txt
// For /list/<slug> and /story/<slug>, injectSeo() writes the title, description, canonical, Open Graph,
// JSON-LD (Article or ItemList + FAQPage + BreadcrumbList) and the article itself into index.html, so
// crawlers and link previews see the full page before the app's JavaScript loads.
import { existsSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const FILE = new URL('../content/catalog-posts.json.gz', import.meta.url);
let posts = [], bySlug = new Map(), aliasOf = new Map(), builtAt = null;
export const canonicalSlug = (slug) => bySlug.has(slug) ? slug : aliasOf.get(slug) || null;
export function loadBlog() {
  if (!existsSync(FILE)) return 0;
  const data = JSON.parse(gunzipSync(readFileSync(FILE)).toString());
  posts = data.posts; builtAt = data.built_at; bySlug = new Map(posts.map(p => [p.slug, p]));
  // Old addresses (brand + model slugs) resolve to the renamed post.
  aliasOf = new Map(posts.flatMap(p => (p.aliases || []).map(a => [a, p.slug])));
  return posts.length;
}

const summary = (p) => ({ type: p.type, slug: p.slug, category: p.category, title: p.title, image: p.image, description: p.description, product_name: p.product_name, blueprint_id: p.blueprint_id, href: `/${p.type === 'listicle' ? 'list' : 'story'}/${p.slug}` });
const words = (p) => [p.title, p.description, ...(p.intro || []), p.dek, ...(p.items || p.sections || []).flatMap(s => [s.h, s.p, ...(s.bullets || [])])].filter(Boolean).join(' ').split(/\s+/).length;

export function listPosts({ category = '', q = '', type = '', page = 1 }) {
  const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean);
  const hits = posts.filter(p => (!category || p.category === category) && (!type || p.type === type)
    && (!terms.length || terms.every(t => `${p.title} ${p.product_name} ${p.category} ${p.search_terms || ''}`.toLowerCase().includes(t))));
  // Best match first: exact brand + model, then a model that starts with the query, then the rest.
  if (terms.length) {
    const q0 = terms.join(' ');
    const score = (p) => { const n = `${p.search_terms || p.product_name}`.toLowerCase(); return n === q0 ? 0 : n.startsWith(q0) || n.split(' ').some(w => terms.includes(w)) && terms.every(t => n.split(/\s+/).includes(t)) ? 1 : 2; };
    hits.sort((a, b) => score(a) - score(b) || (a.type === 'listicle' ? -1 : 1));
  }
  const per = 20, n = Math.max(1, Number(page) || 1);
  const counts = {}; for (const p of posts) counts[p.category] = (counts[p.category] || 0) + 1;
  return { total: hits.length, page: n, pages: Math.ceil(hits.length / per), posts: hits.slice((n - 1) * per, n * per).map(summary), categories: Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })), built_at: builtAt };
}

export function getPost(slug) {
  const p = bySlug.get(canonicalSlug(slug));
  if (!p) return null;
  return { ...p, mins: Math.max(1, Math.round(words(p) / 200)), related: (p.related || []).map(s => bySlug.get(s)).filter(Boolean).map(summary), sibling: p.sibling && bySlug.get(p.sibling) ? summary(bySlug.get(p.sibling)) : null };
}

// ---------- SEO ----------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function articleHtml(p) {
  const blocks = (p.items || p.sections || []).map((s, i) => `<section><h2>${p.type === 'listicle' ? `${i + 1}. ` : ''}${esc(s.h)}</h2>${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.bullets ? `<ul>${s.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${s.table ? `<table><thead><tr>${s.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}</section>`).join('');
  const faq = p.faq?.length ? `<section><h2>Frequently asked questions</h2>${p.faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>` : '';
  const related = (p.related || []).map(s => bySlug.get(s)).filter(Boolean).map(r => `<li><a href="/${r.type === 'listicle' ? 'list' : 'story'}/${r.slug}">${esc(r.title)}</a></li>`).join('');
  const sib = p.sibling && bySlug.get(p.sibling);
  return `<article>${p.type === 'advertorial' ? '<p>Advertisement</p>' : ''}<h1>${esc(p.title)}</h1>${(p.intro || [p.dek]).map(x => `<p>${esc(x)}</p>`).join('')}${blocks}${faq}`
    + `${sib ? `<p><a href="/${sib.type === 'listicle' ? 'list' : 'story'}/${sib.slug}">${esc(sib.title)}</a></p>` : ''}${related ? `<h2>Related</h2><ul>${related}</ul>` : ''}<p><a href="/blog">More guides and stories</a> · <a href="/">Shop Shelby</a></p></article>`;
}

export function injectSeo(html, path, origin) {
  const m = /^\/(list|story)\/([^/?#]+)/.exec(path);
  const p = m && bySlug.get(decodeURIComponent(m[2]));
  if (!p) return null;
  const url = `${origin}/${m[1]}/${p.slug}`;
  const ld = [
    p.type === 'listicle'
      ? { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, image: p.image ? [p.image] : undefined, author: { '@type': 'Organization', name: 'Shelby' }, publisher: { '@type': 'Organization', name: 'Shelby' }, mainEntityOfPage: url, dateModified: builtAt, about: { '@type': 'Product', name: p.product_title } }
      : { '@context': 'https://schema.org', '@type': 'AdvertiserContentArticle', headline: p.title, description: p.description, image: p.image ? [p.image] : undefined, author: { '@type': 'Organization', name: 'Shelby' }, mainEntityOfPage: url, dateModified: builtAt },
    p.faq?.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null,
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Blog', item: `${origin}/blog` }, { '@type': 'ListItem', position: 2, name: p.category, item: `${origin}/blog?category=${encodeURIComponent(p.category)}` }, { '@type': 'ListItem', position: 3, name: p.title, item: url }] },
  ].filter(Boolean);
  const head = `<title>${esc(p.seo_title)} | Shelby</title><meta name="description" content="${esc(p.description)}"><link rel="canonical" href="${esc(url)}">`
    + `<meta property="og:type" content="article"><meta property="og:title" content="${esc(p.seo_title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${esc(url)}">${p.image ? `<meta property="og:image" content="${esc(p.image)}">` : ''}<meta name="twitter:card" content="summary_large_image">`
    + ld.map(x => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`).join('');
  // The article sits in the HTML for crawlers and no-JS readers; the app replaces it once it loads.
  const body = `<div id="seo-article" style="max-width:720px;margin:0 auto;padding:16px;font-family:system-ui,sans-serif;line-height:1.5">${articleHtml(p)}</div><script>document.getElementById('seo-article').style.display='none'</script>`;
  return html.replace(/<title>[^<]*<\/title>/, '').replace('</head>', `${head}</head>`).replace(/<body([^>]*)>/, `<body$1>${body}`);
}

export function sitemapXml(origin) {
  const urls = [`${origin}/`, `${origin}/blog`, ...posts.map(p => `${origin}/${p.type === 'listicle' ? 'list' : 'story'}/${p.slug}`)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${esc(u)}</loc>${builtAt ? `<lastmod>${builtAt.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
}
