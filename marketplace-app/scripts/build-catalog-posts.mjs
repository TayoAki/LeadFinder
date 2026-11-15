// Builds server/content/catalog-posts.json.gz from Printify catalogue facts (one JSON per blueprint,
// pulled by pfy-catalog-pull.cjs). Run after a fresh pull:
//   node scripts/build-catalog-posts.mjs <factsDir>
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { buildPosts } from '../server/blog/generate.mjs';

const dir = process.argv[2];
if (!dir) { console.error('usage: node scripts/build-catalog-posts.mjs <factsDir>'); process.exit(1); }
const raws = readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const posts = buildPosts(raws);
const out = new URL('../server/content/catalog-posts.json.gz', import.meta.url);
const body = JSON.stringify({ built_at: new Date().toISOString(), blueprints: raws.length, posts });
writeFileSync(out, gzipSync(body, { level: 9 }));
const cats = {}; for (const p of posts) cats[p.category] = (cats[p.category] || 0) + 1;
console.log(`${raws.length} blueprints -> ${posts.length} posts, ${(body.length / 1e6).toFixed(1)} MB raw`, cats);
