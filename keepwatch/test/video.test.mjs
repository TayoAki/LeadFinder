import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

process.env.KEEPWATCH_DATA = mkdtempSync(join(tmpdir(), 'kw-video-'));
const { wrap, captionPlan, motionVideo, motionPrompt } = await import('../lib/video.mjs');

const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version']); return true; } catch { return false; } })();

test('captions wrap on words, never mid-word', () => {
  assert.deepEqual(wrap('The free way to track your GLP-1 and your meals', 20), ['The free way to', 'track your GLP-1 and', 'your meals']);
});

test('caption plan: hook stays up, the rest take turns, labels dropped, badge closes', () => {
  const plan = captionPlan(['What nobody told me before my first week', 'DAY 1', 'DAY 2', 'Why day 3 can feel harder'], 'Free on iPhone', 6);
  assert.equal(plan[0].at, 'top');
  assert.deepEqual([plan[0].from, plan[0].to], [0, 6]);
  assert.equal(plan.length, 3); // hook, one line, badge
  assert.equal(plan[1].text, 'Why day 3 can feel harder');
  assert.equal(plan.at(-1).text, 'Free on iPhone');
  assert.equal(plan.at(-1).to, 6);
  assert.ok(plan[1].to <= plan.at(-1).from);
});

test('motion prompt forbids new text and cuts', () => {
  const p = motionPrompt({ setting: 'a pier by the sea' });
  assert.match(p, /a pier by the sea/);
  assert.match(p, /Do not add any text/);
  assert.match(p, /Do not cut/);
});

test('motion video is a 9:16 mp4 of the requested length', { skip: !hasFfmpeg && 'ffmpeg not installed' }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'kw-mv-'));
  const img = join(dir, 'in.png'), out = join(dir, 'out.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=teal:s=544x680', '-frames:v', '1', img]);
  await motionVideo(img, out, 4);
  assert.ok(existsSync(out) && statSync(out).size > 1000);
  const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', out]).toString();
  const j = JSON.parse(probe);
  assert.deepEqual([j.streams[0].width, j.streams[0].height], [1080, 1920]);
  assert.ok(Math.abs(Number(j.format.duration) - 4) < 0.2);
});
