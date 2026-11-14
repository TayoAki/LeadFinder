// Build the "Scroll The Bible" Keepwatch workspace from public Meta Ad Library pages saved by fbal.cjs,
// then write an admin import bundle. Usage: node --experimental-sqlite stb-build.mjs <rawDir> <dataDir> <out.json> <account email>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const [raw, dataDir, out, email] = process.argv.slice(2);  // email: the Keepwatch account to import into
process.env.KEEPWATCH_DATA = dataDir;
const { getDb, workspaceForUser, saveWorkspace, trackRival } = await import('/home/user/LeadFinder/keepwatch/lib/db.mjs');
const { addRival } = await import('/home/user/LeadFinder/keepwatch/collect.mjs');
const { normaliseAd, extractHook, angleFor } = await import('/home/user/LeadFinder/keepwatch/lib/classify.mjs');
const PAGES = [
  ['997476766771655', 'Scroll The Bible (your ads)'], ['999559203240253', 'BibleScroll: Christian Focus (Charles Winston page)'],
  ['1222219207650811', 'Bible Scroll: Daily Verse'], ['1240688732469807', 'BibleSwipe'], ['1130491770150525', 'BibleWatch App'],
  ['28948466501', 'YouVersion Bible App'], ['531203563996048', 'Hallow'], ['100547544858805', 'Glorify'], ['307447449626534', 'Pray.com'],
  ['715980578273114', 'Creed: Bible Chat'], ['798677566671876', 'Abide'], ['142979542221369', 'Bible Chat'],
  ['367227196481583', 'BiblePath: Chat with Bible'], ['101692722957338', 'Bible Daily'],
];
const all = readdirSync(raw).filter(f => f.endsWith('.json')).flatMap(f => JSON.parse(readFileSync(`${raw}/${f}`, 'utf8')));
const byId = {}; for (const a of all) byId[a.ad_archive_id] = { ...byId[a.ad_archive_id], ...a };
const db = getDb();
const ws = workspaceForUser('local', db);
const brand = {
  brand_name: 'Scroll The Bible', brand_domain: 'apps.apple.com/us/app/scroll-the-bible/id6756558351',
  category: 'Bible and Christian faith apps (iOS/Android)',
  brand_product: 'Scroll The Bible: a Bible app that reads like a social feed, verse by verse, Genesis to Revelation, with study tools one tap away. Turns the doomscrolling habit into Bible reading.',
  audience: 'Christians who want to read the Bible more but lose time scrolling social media',
  brand_voice: 'warm, direct, hopeful, no guilt',
};
saveWorkspace(ws.id, brand, db);
const ins = db.prepare(`INSERT OR REPLACE INTO ads (id, rival_id, collation_id, collation_count, is_active, start_date, end_date, format, display_format, body, title,
  link_desc, cta, link_url, image_url, video_url, thumb_url, hook, hook_source, angle) VALUES (:id,:rival_id,:collation_id,:collation_count,:is_active,:start_date,:end_date,
  :format,:display_format,:body,:title,:link_desc,:cta,:link_url,:image_url,:video_url,:thumb_url,:hook,:hook_source,:angle)`);
const today = new Date().toISOString().slice(0, 10);
for (const [page_id, name] of PAGES) {
  const ads = Object.values(byId).filter(a => String(a.page_id) === page_id);
  const s = ads[0]?.snapshot || {};
  const r = addRival({ page_id, name, avatar_url: s.page_profile_picture_url, likes: s.page_like_count, page_category: (s.page_categories || [])[0] }, db);
  db.prepare('UPDATE rivals SET last_collected_at = ? WHERE id = ?').run(today, r.id);
  trackRival(ws.id, r.id, db);
  for (const x of ads) { const a = normaliseAd(x); const { hook, source } = extractHook(a); ins.run({ ...a, rival_id: r.id, hook, hook_source: source, angle: angleFor(hook, a.body, a.title) }); }
  console.log(name.padEnd(52), ads.length, 'ads,', ads.filter(a => a.is_active).length, 'live');
}
const RIVAL_COLS = ['name', 'page_id', 'domain', 'avatar_url', 'ig_username', 'likes', 'page_category', 'last_collected_at'];
const AD_COLS = ['id', 'collation_id', 'collation_count', 'is_active', 'start_date', 'end_date', 'format', 'display_format', 'body', 'title',
  'link_desc', 'cta', 'link_url', 'image_url', 'video_url', 'thumb_url', 'transcript', 'hook', 'hook_source', 'angle'];
const pick = (o, cols) => Object.fromEntries(cols.map(c => [c, o[c] ?? null]));
const rivals = db.prepare('SELECT r.* FROM rivals r JOIN workspace_rivals w ON w.rival_id = r.id WHERE w.workspace_id = ?').all(ws.id)
  .map(r => ({ ...pick(r, RIVAL_COLS), tracked: true, ads: db.prepare('SELECT * FROM ads WHERE rival_id = ?').all(r.id).map(a => pick(a, AD_COLS)) }));
writeFileSync(out, JSON.stringify({ email, workspace_name: 'Scroll The Bible', rivals, rebuilds: [], workspace: brand }));
console.log(`bundle: ${rivals.length} pages, ${rivals.reduce((n, r) => n + r.ads.length, 0)} ads`);
