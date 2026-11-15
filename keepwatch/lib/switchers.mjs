// Switchers: people angry at a company's decision AND asking what to buy instead.
// The Black Rifle Coffee playbook without the grift: find real switching demand before building,
// launch the alternative (often white-label), and partner with creators already talking about it.
//
// Data comes from the connected AI or the user (forum and social research): each signal is one public
// post with its link and a short verbatim quote. We keep the post URL, never the author's personal
// details. Creators ("voices") are public accounts with an audience, saved separately.
// Political or culture-war anger is flagged and left out of the ranking unless asked for.
import { createHash } from 'node:crypto';
import { getDb } from './db.mjs';

export const ANGER = /\b(furious|pissed|angry|mad at|livid|disgusted|fed up|sick of|done with|hate|boycott\w*|cancell?(ed|ing)? my|unsubscrib\w*|never buying|never again|last straw|ruined|betray\w*|rip-?off|scam\w*|greed\w*|downgrade\w*|enshittif\w*|not worth it anymore|what happened to|garbage|awful|terrible|worst|disgusting|gross|disappoint\w*|vote with (our|my) wallets?)\b/i;
export const ALT = /\b(alternatives?|instead|switch(ing|ed)?( up| over| away)?( from now on)? to|different brand|rather buy|dupe|another (brand|vegan|protein)|find (a |another )?new|stopped (buying|purchasing)|leaving|left the|deleted my account|replacement|what (do|should|can) i (buy|use|get|try)|recommend\w*|anyone (know|tried|using)|moved to|my go-to now|dupes?|similar to|better option|other brands?|where (else|can i))\b/i;
export const DECISIONS = [
  { key: 'political', label: 'Politics or culture war', rx: /politic\w*|woke|maga|trump|biden|democrat|republican|left-?wing|right-?wing|pride month|spokes(person|model)|endorse\w*|campaign donation/i },
  { key: 'price', label: 'Price rise or fees', rx: /price|pricing|cost|expensive|increase|hike|subscription|fee|shrinkflation|smaller (size|bag|box)|paywall/i },
  { key: 'quality', label: 'Quality or recipe change', rx: /recipe|formula|quality|taste|tastes|cheap(er)? material|falling apart|reformulat\w*|ingredients?/i },
  { key: 'feature', label: 'Removed feature or product', rx: /removed|feature|update|discontinu\w*|no longer|killed off|got rid|sunset\w*|stopped making/i },
  { key: 'service', label: 'Service, shipping or support', rx: /support|customer service|shipping|delivery|refund|warranty|account|banned|wait time/i },
  { key: 'ethics', label: 'Ethics: labour, privacy, environment', rx: /layoffs?|labou?r|union|environment\w*|privacy|data|ai training|sweatshop/i },
];
const WANT = /\b(?:i (?:just )?want|looking for|i need|wish (?:there was|someone made)|give me)\s+([^.!?\n]{6,90})/i;
const clip = (s, n) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const https = v => (typeof v === 'string' && /^https:\/\//.test(v) ? v.slice(0, 600) : null);
const day = v => (v && /^\d{4}-\d{2}-\d{2}/.test(String(v)) ? String(v).slice(0, 10) : null);
const norm = s => clip(s, 80).toLowerCase().replace(/[^a-z0-9& ]+/g, '').replace(/\s+/g, ' ').trim();

export function classify(text) {
  const t = String(text || '');
  const d = DECISIONS.find(x => x.rx.test(t));
  return { anger: ANGER.test(t), wants_alt: ALT.test(t), decision: d?.key || 'other', want: (WANT.exec(t) || [])[1]?.trim() || null };
}

/** Save public posts about one company. Each needs a https url and a short verbatim quote. */
export function addSignals(wsId, { company, signals = [] } = {}, db = getDb()) {
  const name = clip(company, 80);
  if (!name) throw Object.assign(new Error('Name the company people are angry at.'), { status: 400 });
  if (!Array.isArray(signals) || !signals.length || signals.length > 200) throw Object.assign(new Error('Give 1 to 200 posts.'), { status: 400 });
  const ins = db.prepare(`INSERT INTO switch_signals (workspace_id, company, company_key, url, quote, source, posted_at, engagement, anger, wants_alt, decision, want)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(workspace_id, url) DO UPDATE SET quote = excluded.quote, engagement = excluded.engagement`);
  let added = 0, skipped = 0;
  for (const s of signals) {
    const url = https(s.url), quote = clip(s.quote, 500);
    if (!url || quote.length < 8) { skipped++; continue; }
    const c = classify(`${quote} ${s.context || ''}`);
    // Several quotes can come from one thread: key each by link + quote (the #kw fragment is ignored by browsers).
    const key = `${url.split('#kw-')[0]}#kw-${createHash('sha1').update(quote).digest('hex').slice(0, 8)}`;
    db.prepare('DELETE FROM switch_signals WHERE workspace_id = ? AND url = ? AND quote = ?').run(wsId, url.split('#kw-')[0], quote); // rows saved before quote keys
    ins.run(wsId, name, norm(name), key, quote, clip(s.source, 40) || new URL(url).hostname.replace(/^www\./, ''), day(s.posted_at),
      Math.max(0, Math.round(Number(s.engagement) || 0)), c.anger ? 1 : 0, c.wants_alt ? 1 : 0, c.decision, c.want);
    added++;
  }
  return { company: name, added, skipped };
}

/** Save public creators posting about the company (handle, platform, link, what they said). */
export function addVoices(wsId, { company, voices = [] } = {}, db = getDb()) {
  const name = clip(company, 80);
  if (!name || !Array.isArray(voices) || !voices.length || voices.length > 100) throw Object.assign(new Error('Give the company and 1 to 100 creators.'), { status: 400 });
  const ins = db.prepare(`INSERT INTO switch_voices (workspace_id, company_key, name, platform, url, audience, quote)
    VALUES (?,?,?,?,?,?,?) ON CONFLICT(workspace_id, url) DO UPDATE SET audience = excluded.audience, quote = excluded.quote`);
  let added = 0;
  for (const v of voices) {
    const url = https(v.url);
    if (!url || !clip(v.name, 80)) continue;
    ins.run(wsId, norm(name), clip(v.name, 80), clip(v.platform, 30) || new URL(url).hostname.replace(/^www\./, ''), url, clip(v.audience, 40), clip(v.quote, 400));
    added++;
  }
  return { company: name, added };
}

const DAY = 864e5;
/** Companies ranked by switching demand: anger plus "what do I buy instead", across sources, recently. */
export function opportunities(wsId, { includePolitical = false, now = Date.now() } = {}, db = getDb()) {
  const rows = db.prepare('SELECT * FROM switch_signals WHERE workspace_id = ? ORDER BY engagement DESC').all(wsId);
  const voices = db.prepare('SELECT * FROM switch_voices WHERE workspace_id = ?').all(wsId);
  const by = new Map();
  for (const r of rows) { if (!by.has(r.company_key)) by.set(r.company_key, []); by.get(r.company_key).push(r); }
  const out = [];
  for (const [key, list] of by) {
    const switching = list.filter(r => r.anger && r.wants_alt), angry = list.filter(r => r.anger);
    const decisions = {}; for (const r of angry.length ? angry : list) decisions[r.decision] = (decisions[r.decision] || 0) + 1;
    const top = Object.entries(decisions).sort((a, b) => b[1] - a[1]);
    const political = top[0]?.[0] === 'political';
    const recent = list.filter(r => r.posted_at && now - Date.parse(r.posted_at) <= 180 * DAY).length;
    const sources = new Set(list.map(r => r.source)).size;
    const score = switching.length * 3 + angry.length + sources * 2 + Math.round(5 * recent / list.length) + Math.min(5, Math.log10(1 + list.reduce((n, r) => n + r.engagement, 0)));
    // Switch demand: 5+ posts that are both angry and asking for an alternative, OR the company-level
    // version of the same thing (3+ angry posts and 3+ posts asking or naming where to go). Either way
    // from 2+ sources with 3+ in the last 6 months.
    const seeking = list.filter(r => r.wants_alt);
    const spread = switching.length >= 5 || (angry.length >= 3 && seeking.length >= 3);
    const verdict = spread && sources >= 2 && recent >= 3 ? 'switch_demand' : angry.length >= 5 && seeking.length < 2 ? 'anger_only' : 'thin';
    out.push({
      company: list[0].company, key, score: Math.round(score), verdict, political,
      label: { switch_demand: 'People are leaving and asking where to go', anger_only: 'Angry, but not asking for an alternative (yet)', thin: 'Not enough evidence yet' }[verdict],
      posts: list.length, switching: switching.length, angry: angry.length, seeking: seeking.length, sources, recent_180d: recent,
      decisions: top.map(([k, n]) => ({ key: k, label: DECISIONS.find(d => d.key === k)?.label || 'Other', n })),
      wants: [...new Set(list.map(r => r.want).filter(Boolean))].slice(0, 6),
      quotes: (switching.length ? switching : list).slice(0, 5).map(r => ({ quote: r.quote, url: r.url, source: r.source, engagement: r.engagement, posted_at: r.posted_at })),
      voices: voices.filter(v => v.company_key === key).map(v => ({ id: v.id, name: v.name, platform: v.platform, url: v.url, audience: v.audience, quote: v.quote })),
    });
  }
  const ranked = out.sort((a, b) => b.score - a.score);
  return { opportunities: includePolitical ? ranked : ranked.filter(o => !o.political), hidden_political: ranked.filter(o => o.political).map(o => o.company),
    note: 'A post is "switching" when it shows anger at a decision AND asks what to use instead. Switch demand needs 5+ such posts from 2+ sources, 3+ in the last 6 months. Posts show interest, not purchases.' };
}

/** The launch plan for one opportunity, from its own evidence. */
export function launchPlan(opp, ws = {}) {
  const top = opp.decisions.find(x => x.key !== 'other');
  const d = top ? `the ${top.label.toLowerCase()}` : 'a recent change';
  const want = opp.wants[0] || `what ${opp.company} used to be`;
  return {
    company: opp.company, verdict: opp.verdict,
    positioning: `For people who left ${opp.company} after ${d}. We make ${want}.`,
    enemy: `The enemy is the decision (${d}), never the people who still buy ${opp.company}, and never a person.`,
    product_path: [
      `Match what they say they want: ${opp.wants.length ? opp.wants.slice(0, 3).join('; ') : 'collect more "I just want..." quotes first'}.`,
      'Find a white-label or private-label maker for the category; order samples before taking any money.',
      `Write down the one thing yours does that ${opp.company}'s decision took away, and prove it with the sample.`,
    ],
    smoke_test: [
      `A waitlist page: "Left ${opp.company}? We are building ${want}." Show the price you intend to charge.`,
      'Post where the angry threads are, as the founder, disclosing who you are. Never astroturf (no fake customer accounts).',
      'Pass: 100 waitlist sign-ups or 10 pre-orders in 14 days. Kill: under 20 sign-ups. Decide the numbers before posting.',
    ],
    legal: [
      `Comparisons must be true and sourced (link the change). Don't use ${opp.company}'s logo or anything that implies you are them.`,
      'Creator partners must disclose the relationship (#ad or a paid-partnership label) in every post, equity included.',
    ],
    brand: ws.brand_name || null,
  };
}

/** An honest first message to a creator already talking about it. A draft: the user sends it, not us. */
export function voiceDM(voice, opp, ws = {}) {
  const top = opp.decisions.find(x => x.key !== 'other');
  const d = top ? `the ${top.label.toLowerCase()}` : 'the recent change';
  const brand = ws.brand_name || '[your brand]';
  const product = ws.brand_product ? ws.brand_product.split(/[,.]/)[0].trim().toLowerCase() : '[what you make]';
  return {
    to: voice.name, platform: voice.platform, about: voice.url,
    message: `Hi ${voice.name}, I saw your post about ${opp.company} and ${d} (${voice.url}). I run ${brand}. We make ${product} for people who felt the same way. `
      + 'No ask to pile on anyone. If you want to try it, I\'ll send one free, no strings. If you like it, I\'d love to talk about a proper partnership: paid, affiliate or a small equity stake. '
      + 'Anything you post about us would carry a clear #ad or partner label. Either way, thanks for saying it out loud.',
    notes: ['Send it yourself from your own account, once. No follow-up spam.', 'Equity or payment is a material connection: they must disclose it in every post.', 'Don\'t send to accounts whose anger is about a person, or about politics, unless that is truly your brand.'],
  };
}
