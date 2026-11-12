// Seed the AI-app-builders Keepwatch workspace and collect each competitor's Meta ads.
// Usage: node --experimental-sqlite ab-seed.mjs <dataDir>
process.env.KEEPWATCH_DATA = process.argv[2];
const { getDb, workspaceForUser, saveWorkspace, trackRival } = await import('/home/user/LeadFinder/keepwatch/lib/db.mjs');
const { addRival, collectAll } = await import('/home/user/LeadFinder/keepwatch/collect.mjs');
const db = getDb();
const ws = workspaceForUser('local', db);
saveWorkspace(ws.id, {
  brand_name: 'AI mobile app builders',
  category: 'AI app builders for mobile (prompt to native iOS/Android app)',
  brand_product: 'An AI app builder that researches the idea, draws mockups for approval, then builds a React Native / Expo app with a backend, payments and App Store publishing.',
  audience: 'Non-technical founders, indie makers and small businesses who want a real native app in the App Store',
  brand_voice: 'plain, confident, no hype',
}, db);
const pages = [
  ['622763177594407', 'Rork'], ['812773578596476', 'Rork (native apps page)'], ['717447688112327', 'Vibecode'],
  ['1043431952188321', 'Newly (Natively)'], ['576758425523479', 'Bolt.new'], ['918361448197040', 'Replit'],
  ['544022015466938', 'Lovable'], ['101375281779992', 'FlutterFlow'], ['285179798962070', 'Draftbit'],
  ['1024705877730520', 'Adalo'], ['1730748713823692', 'Thunkable'], ['199102326883301', 'Bubble (candidate)'],
  ['764459050076762', 'Anything (candidate A)'], ['316899141514201', 'Anything (candidate B)'],
  ['585615734640190', 'Base44'], ['1014726931734980', 'Blink.new'], ['942431062292281', 'Superapp (candidate)'],
];
const ids = pages.map(([page_id, name]) => { const r = addRival({ page_id, name }, db); trackRival(ws.id, r.id, db); return r.id; });
console.log(`workspace ${ws.id}: tracking ${ids.length} rivals`);
const res = await collectAll({ ids });
console.log(`Done: ${res.ads} ads, ${res.calls} calls, $${res.cost.toFixed(3)}`);
