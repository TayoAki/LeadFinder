import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openMemoryDb } from '../lib/db.mjs';
import { addSignals, addVoices, opportunities, launchPlan, voiceDM, classify } from '../lib/switchers.mjs';
import { addOverlap, partners, collabPitch } from '../lib/collabs.mjs';

const ws1 = db => db.prepare("INSERT INTO workspaces (user_id, brand_name, brand_product, category) VALUES ('u1', 'Hearth Coffee', 'Small-batch whole bean coffee, roasted weekly', 'Coffee roasters')").run();
const now = Date.parse('2026-11-15');

test('classify finds anger, the alternative ask, the decision and the want', () => {
  const c = classify('So sick of the price hike, what should I buy instead? I just want a dark roast that is not burnt');
  assert.ok(c.anger && c.wants_alt); assert.equal(c.decision, 'price'); assert.match(c.want, /dark roast/);
});

test('switch demand needs anger + alternative asks across sources; political anger is hidden by default', () => {
  const db = openMemoryDb(); ws1(db);
  const sig = (i, src, text) => ({ url: `https://${src}.com/p/${i}`, quote: text, posted_at: '2026-10-0' + (1 + (i % 8)), engagement: 10 * i });
  addSignals(1, { company: 'BigBean', signals: [0, 1, 2, 3, 4, 5].map(i => sig(i, i % 2 ? 'reddit' : 'x', 'Fed up with the new recipe, tastes burnt. Any alternatives? I just want a smooth medium roast')) }, db);
  addSignals(1, { company: 'PoliCola', signals: [0, 1, 2, 3, 4, 5].map(i => sig(10 + i, i % 2 ? 'reddit' : 'x', 'Boycott after their political endorsement, what should I buy instead?')) }, db);
  const bad = addSignals(1, { company: 'BigBean', signals: [{ url: 'http://insecure.com', quote: 'hate it' }, { url: 'https://a.com/x', quote: 'no' }] }, db);
  assert.equal(bad.added, 0);
  const r = opportunities(1, { now }, db);
  assert.deepEqual(r.opportunities.map(o => o.company), ['BigBean']);
  assert.deepEqual(r.hidden_political, ['PoliCola']);
  const o = r.opportunities[0];
  assert.equal(o.verdict, 'switch_demand'); assert.equal(o.decisions[0].key, 'quality'); assert.ok(o.wants[0].includes('medium roast'));
  assert.equal(opportunities(1, { includePolitical: true, now }, db).opportunities.length, 2);
  const plan = launchPlan(o, { brand_name: 'Hearth Coffee' });
  assert.ok(plan.smoke_test.some(s => /Pass:/.test(s))); assert.ok(plan.legal.some(s => /disclose/.test(s)));
});

test('creator DMs are honest drafts with disclosure', () => {
  const db = openMemoryDb(); ws1(db);
  addSignals(1, { company: 'BigBean', signals: [{ url: 'https://reddit.com/1', quote: 'Sick of the recipe change, alternatives?' }] }, db);
  addVoices(1, { company: 'BigBean', voices: [{ name: 'CoffeeCritic', platform: 'TikTok', url: 'https://tiktok.com/@cc/1', audience: '80k followers', quote: 'they ruined it' }] }, db);
  const o = opportunities(1, { now }, db).opportunities[0];
  const dm = voiceDM(o.voices[0], o, { brand_name: 'Hearth Coffee', brand_product: 'Small-batch whole bean coffee' });
  assert.match(dm.message, /#ad|partner label/); assert.match(dm.message, /Hearth Coffee/); assert.ok(!/\[your brand\]/.test(dm.message));
});

test('collabs: counts only, competitors filtered, survey weighted, pitch uses real counts', () => {
  const db = openMemoryDb(); ws1(db);
  const r = addOverlap(1, { source: 'reviews', people: [
    { also: [{ name: 'Rolling Pin Bakery', category: 'Bakery' }, { name: 'Bean There', category: 'Coffee roasters' }] },
    { also: [{ name: 'Rolling Pin Bakery', category: 'Bakery' }, { name: 'Rolling Pin Bakery', category: 'Bakery' }] },
    { also: [{ name: 'Page Turner Books', category: 'Bookshop' }] } ] }, db);
  assert.equal(r.stored, 'counts only');
  addOverlap(1, { source: 'survey', businesses: [{ name: 'Page Turner Books', category: 'Bookshop', shared: 2 }] }, db);
  const cols = db.prepare('PRAGMA table_info(collab_overlap)').all().map(c => c.name);
  assert.ok(!cols.some(c => /reviewer|person|author|profile/.test(c)), 'no reviewer columns');
  const p = partners(1, { brand_name: 'Hearth Coffee', category: 'Coffee roasters' }, {}, db);
  assert.deepEqual(p.filtered_competitors, ['Bean There']);
  assert.deepEqual(p.partners.map(x => [x.name, x.shared]), [['Page Turner Books', 3], ['Rolling Pin Bakery', 2]]);
  const pitch = collabPitch(p.partners[1], { brand_name: 'Hearth Coffee', brand_product: 'Small-batch whole bean coffee' });
  assert.match(pitch.email.body, /2 of our reviewers also reviewed you/);
  assert.equal(pitch.ideas.length, 5);
});

test('several quotes from one thread are all kept, and spread-out demand counts', () => {
  const db = openMemoryDb(); ws1(db);
  const u = 'https://forum.example.com/t/1';
  addSignals(1, { company: 'OldShake', signals: [
    { url: u, quote: 'This new formula is utter garbage', posted_at: '2026-10-01' },
    { url: u, quote: 'Hopefully they rethink it, I am done with them', posted_at: '2026-10-02' },
    { url: u, quote: 'Ruined. Never buying again.', posted_at: '2026-10-03' },
    { url: 'https://reviews.example.com/a', quote: 'I will be switching up from now on to a different brand', posted_at: '2026-10-04' },
    { url: 'https://reviews.example.com/b', quote: 'Now I will have to find another vegan protein powder', posted_at: '2026-10-05' },
    { url: 'https://reviews.example.com/c', quote: 'I would rather buy the supermarket one', posted_at: '2026-10-06' } ] }, db);
  const o = opportunities(1, { now }, db).opportunities[0];
  assert.equal(o.posts, 6); assert.ok(o.angry >= 3 && o.seeking >= 3); assert.equal(o.verdict, 'switch_demand');
});
