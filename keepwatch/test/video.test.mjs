import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-video-'));
const { motionVideo } = await import('../lib/video.mjs');
const { wrap, shotsFromCuts, rulePlan, scenePrompt, captionFilters } = await import('../lib/shots.mjs');
const { appStoreId } = await import('../lib/appstore.mjs');

const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version']); return true; } catch { return false; } })();

test('captions wrap on words, never mid-word', () => {
  assert.deepEqual(wrap('The free way to track your GLP-1 and your meals', 20), ['The free way to', 'track your GLP-1 and', 'your meals']);
});

test('cuts become shots; flash cuts merge', () => {
  assert.deepEqual(shotsFromCuts([2.96667, 3], 6.1), [{ start: 0, end: 2.97 }, { start: 2.97, end: 6.1 }]);
  assert.deepEqual(shotsFromCuts([], 9), [{ start: 0, end: 9 }]);
});

test('rule plan keeps the original timing: scene with our lines, app screen, end card', () => {
  const p = rulePlan({ breakdown: { shots: [{ start: 0, end: 5.7 }, { start: 5.7, end: 11 }, { start: 11, end: 12.2 }] },
    plan: { texts: ['Six months on Ozempic and I still forgot which side.', 'Logs every injection site.'] },
    assets: { name: 'Weight Class', price: 'Free', screens: [{ name: 'a' }, { name: 'b' }] } });
  assert.deepEqual(p.shots.map(s => s.kind), ['scene', 'app_screen', 'end_card']);
  assert.deepEqual(p.shots.map(s => s.seconds), [5.7, 5.3, 1.2]);
  assert.equal(p.shots[0].still, 'ad');
  assert.match(p.shots[0].captions[0].text, /Six months/);
});

test('scene prompt carries the timed beats and forbids text and cuts', () => {
  const p = scenePrompt({ camera: 'Locked-off phone on a tripod', motion: ['0-1.5s pours water; 1.5-3s drinks', 'second part'] }, 0);
  assert.match(p, /Locked-off/);
  assert.match(p, /0-1.5s pours water/);
  assert.match(p, /no cuts/);
  assert.match(p, /Do not add any text/);
  assert.match(scenePrompt({ motion: ['a', 'b'] }, 1), /\bb\b/);
});

test('word captions show one word at a time across the span', () => {
  const f = captionFilters([{ text: 'same calories', style: 'word', position: 0.1 }], 2, mkdtempSync(join(tmpdir(), 'kw-cap-')), 't');
  assert.equal(f.length, 2);
  assert.match(f[0], /between\(t,0\.00,0\.99\)/);
  assert.match(f[1], /between\(t,1\.00,1\.99\)/);
});

test('App Store id comes from the brand link', () => {
  assert.equal(appStoreId({ brand_domain: 'apps.apple.com/us/app/weight-class/id6816738487' }), '6816738487');
  assert.equal(appStoreId({ brand_domain: 'example.com' }), null);
});

test('motion video is a 9:16 mp4 of the requested length', { skip: !hasFfmpeg && 'ffmpeg not installed' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kw-mv-'));
  const img = join(dir, 'in.png'), out = join(dir, 'out.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=teal:s=544x680', '-frames:v', '1', img]);
  await motionVideo(img, out, 4);
  assert.ok(existsSync(out) && statSync(out).size > 1000);
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', out]).toString());
  assert.deepEqual([j.streams[0].width, j.streams[0].height], [1080, 1920]);
  assert.ok(Math.abs(Number(j.format.duration) - 4) < 0.2);
});
