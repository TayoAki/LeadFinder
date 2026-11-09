// Turn a finished ad into a short vertical video (1080×1920, Reels / Stories / TikTok).
//
// Two modes:
//   motion  The real ad, pixel for pixel, with a slow push-in. Words stay exactly as approved. ffmpeg only, no AI.
//   ai      Real movement. Video models garble text and drift from the source when the frame is full of words,
//           so we never animate the ad itself:
//             1. clean plate: the ad with every word removed (image engine)
//             2. animate the clean plate (Seedance: FAL_KEY in production, treg locally)
//             3. burn the ad's own lines back on as captions with ffmpeg, so the words are exact
// ffmpeg (and a font) must be installed; the Dockerfile adds both.
import { execFile } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { getDb, DATA_DIR } from './db.mjs';
import { REBUILD_DIR } from './rebuild.mjs';
import { renderImage } from './providers.mjs';
import { treg, tregAvailable, costOf } from './treg.mjs';

export const VIDEO_DIR = resolve(DATA_DIR, 'videos');
export const VIDEO_MODES = {
  motion: { label: 'Motion', note: 'Your ad exactly as approved, with a slow camera push. Instant.' },
  ai: { label: 'AI video', note: 'Real movement in the scene, with your lines as captions. 1 to 3 minutes.' },
};
const W = 1080, H = 1920, FPS = 30;
const FONT = process.env.KEEPWATCH_FONT || ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'].find(existsSync);

const run = (cmd, args, opts = {}) => new Promise((ok, bad) => execFile(cmd, args, { maxBuffer: 32 * 1024 * 1024, timeout: 10 * 60 * 1000, ...opts },
  (err, stdout, stderr) => (err ? bad(new Error(`${cmd} failed: ${String(stderr || err.message).split('\n').filter(Boolean).slice(-3).join(' ')}`)) : ok(stdout))));

let ffmpegOk;
export async function videoStatus() {
  if (ffmpegOk === undefined) ffmpegOk = await run('ffmpeg', ['-version']).then(() => true, () => false);
  return { motion: ffmpegOk, ai: ffmpegOk && Boolean(process.env.FAL_KEY || await tregAvailable()) };
}

/** Wrap a caption to lines of about `max` characters. */
export function wrap(text, max = 26) {
  const lines = [];
  let cur = '';
  for (const w of String(text).trim().split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Caption timeline for the AI mode. The first line is the hook and stays up top the whole time;
 * the rest take turns in the lower third. Short neutral labels ("DAY 1") are dropped: they only made
 * sense as part of a layout. The badge, if any, closes the video.
 */
export function captionPlan(texts = [], badge = '', seconds = 6) {
  const lines = texts.map(t => String(t).replace(/^"|"$/g, '').trim()).filter(t => t.length > 6);
  if (!lines.length) return [];
  const [hook, ...rest] = lines;
  const out = [{ text: hook, from: 0, to: seconds, at: 'top' }];
  const tail = badge ? 1.6 : 0;
  const slot = rest.length ? (seconds - 1 - tail) / rest.length : 0;
  rest.forEach((t, i) => out.push({ text: t, from: +(1 + i * slot).toFixed(2), to: +(1 + (i + 1) * slot).toFixed(2), at: 'bottom' }));
  if (badge) out.push({ text: badge, from: +(seconds - tail).toFixed(2), to: seconds, at: 'bottom' });
  return out;
}

/** ffmpeg drawtext filters for a caption plan. Text goes through files, so nothing in it needs escaping. */
function captionFilters(plan, dir) {
  const filters = [];
  let k = 0;
  for (const c of plan) {
    const big = c.at === 'top';
    const long = c.text.length > 70;
    const size = big ? (long ? 46 : 58) : 50;
    const lines = wrap(c.text, big ? (long ? 32 : 24) : 28);
    const lh = Math.round(size * 1.5);
    const y0 = big ? 170 : H - 470 - (lines.length - 1) * lh;
    lines.forEach((line, i) => {
      const f = join(dir, `cap${k++}.txt`);
      writeFileSync(f, line);
      filters.push(`drawtext=fontfile='${FONT}':textfile='${f}':fontsize=${size}:fontcolor=white:box=1:boxcolor=black@0.62:boxborderw=18:x=(w-text_w)/2:y=${y0 + i * lh}:enable='between(t,${c.from},${c.to})'`);
    });
  }
  return filters;
}

/** Fit any image or clip into 1080×1920: the frame on a blurred copy of itself, never cropped. */
const FIT = `split[a][b];[a]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=30:2,eq=brightness=-0.08[bg];[b]scale=${W}:${H}:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2`;
const ENCODE = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '64k', '-shortest', '-movflags', '+faststart'];

/** motion: the exact ad with a slow push-in and a soft fade at both ends. */
export async function motionVideo(imagePath, outPath, seconds = 6) {
  const frames = seconds * FPS;
  const vf = `[0:v]${FIT},scale=${W * 2}:${H * 2},zoompan=z='1+0.07*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${FPS},fade=t=in:d=0.3,fade=t=out:st=${seconds - 0.4}:d=0.4[v]`;
  await run('ffmpeg', ['-y', '-v', 'error', '-loop', '1', '-i', imagePath, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-filter_complex', vf, '-map', '[v]', '-map', '1:a', '-t', String(seconds), ...ENCODE, outPath]);
}

/** Public URL (or data URI) an image engine can read. */
async function shareable(path) {
  if (process.env.FAL_KEY || process.env.GEMINI_API_KEY) return `data:image/png;base64,${readFileSync(path).toString('base64')}`;
  const out = await run('treg', ['host', path, '--json']);
  return JSON.parse(out).url;
}

const CLEAN_PROMPT = `Remove every piece of text from this image: captions, headlines, labels, numbers, badges, stickers and buttons.
Fill each area naturally with what would be behind it. Change nothing else: the same people, objects, scene, colours, lighting, framing and composition.
The result must contain no letters or numbers at all.`;

export function motionPrompt(plan = {}) {
  const scene = plan.setting ? `Scene: ${plan.setting}. ` : '';
  return `${scene}Natural, handheld phone footage that starts exactly on this frame and stays in this same scene. Gentle, realistic motion: small movements of people and objects, a slow camera push-in.
Keep every person's face and identity the same. Do not cut to another shot. Do not add any text, letters, numbers, logos or graphics.`;
}

/** Image → video clip bytes. Seedance 1 Lite via Fal (production) or treg/Replicate (local). */
async function animate(imageUrl, prompt, seconds) {
  if (process.env.FAL_KEY) {
    const res = await fetch('https://fal.run/fal-ai/bytedance/seedance/v1/lite/image-to-video', {
      method: 'POST', headers: { authorization: `Key ${process.env.FAL_KEY}`, 'content-type': 'application/json' }, signal: AbortSignal.timeout(600000),
      body: JSON.stringify({ prompt, image_url: imageUrl, duration: String(seconds), resolution: '720p', camera_fixed: false }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.video?.url) throw new Error(`Video engine: HTTP ${res.status} ${JSON.stringify(body.detail || body.error || '').slice(0, 200)}`);
    return { bytes: Buffer.from(await (await fetch(body.video.url)).arrayBuffer()), cost: 0.036 * seconds, engine: 'seedance-1-lite' };
  }
  if (await tregAvailable()) {
    const { result, meta } = await treg('replicate.video-gen.seedance-1-lite', {
      body: { input: { prompt, image: imageUrl, duration: seconds, resolution: '720p', aspect_ratio: '9:16' } }, wait: 900,
    });
    const url = Array.isArray(result?.output) ? result.output[0] : result?.output;
    if (!url) throw new Error('The video engine returned no clip.');
    return { bytes: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: 0.036 * seconds, engine: 'seedance-1-lite' }; // 720p list price
  }
  throw new Error('No video engine: set FAL_KEY.');
}

/** ai: clean plate → animate → burn the ad's own lines on as captions. */
export async function aiVideo(imagePath, plan, outPath, seconds = 6, work) {
  const clean = await renderImage(CLEAN_PROMPT, [await shareable(imagePath)], { size: plan.size || 'story', prefer: 'gpt' }); // GPT Image 2 removes text reliably; Gemini tends to keep it
  const cleanPath = join(work, 'clean.png');
  writeFileSync(cleanPath, clean.bytes);
  const clip = await animate(await shareable(cleanPath), motionPrompt(plan), seconds);
  const clipPath = join(work, 'clip.mp4');
  writeFileSync(clipPath, clip.bytes);
  const caps = captionFilters(captionPlan(plan.texts, plan.badge, seconds), work);
  const vf = [`[0:v]${FIT}`, ...caps].join(',') + `,fade=t=out:st=${seconds - 0.3}:d=0.3[v]`;
  await run('ffmpeg', ['-y', '-v', 'error', '-i', clipPath, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-filter_complex', vf, '-map', '[v]', '-map', '1:a', '-t', String(seconds), ...ENCODE, outPath]);
  return { cost: clean.cost + clip.cost, engine: `${clean.engine} + ${clip.engine}` };
}

/** Make a video for one finished ad. Returns the saved row. */
export async function makeVideo(wsId, rebuild, { mode = 'motion', seconds = 6, db = getDb() } = {}) {
  if (!VIDEO_MODES[mode]) throw new Error('Unknown video mode.');
  seconds = Math.max(4, Math.min(10, Math.round(Number(seconds) || 6)));
  const imagePath = resolve(REBUILD_DIR, rebuild.image_path || '');
  if (!rebuild.image_path || !existsSync(imagePath)) throw new Error('That ad has no image yet.');
  const plan = (() => { try { return JSON.parse(rebuild.why || '{}'); } catch { return {}; } })();
  const id = db.prepare('INSERT INTO videos (workspace_id, rebuild_id, mode, seconds, status) VALUES (?,?,?,?,?)').run(wsId, rebuild.id, mode, seconds, 'running').lastInsertRowid;
  const file = `video-${rebuild.id}-${id}-${Date.now().toString(36)}.mp4`;
  const work = mkdtempSync(join(tmpdir(), 'kw-video-'));
  try {
    mkdirSync(VIDEO_DIR, { recursive: true });
    const out = join(VIDEO_DIR, file);
    let meta = { cost: 0, engine: 'ffmpeg' };
    if (mode === 'motion') await motionVideo(imagePath, out, seconds);
    else meta = await aiVideo(imagePath, plan, out, seconds, work);
    db.prepare('UPDATE videos SET status = ?, path = ?, cost_usd = ?, engine = ? WHERE id = ?').run('done', file, meta.cost, meta.engine, id);
  } catch (e) {
    db.prepare('UPDATE videos SET status = ? WHERE id = ?').run(`failed: ${e.message}`.slice(0, 500), id);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  return db.prepare('SELECT * FROM videos WHERE id = ?').get(id);
}

export const videoUrl = v => (v.path ? `/media/videos/${v.path}` : null);
export function videosFor(db, wsId, rebuildId) {
  return db.prepare("SELECT id, mode, seconds, status, path, engine, created_at FROM videos WHERE workspace_id = ? AND rebuild_id = ? AND status = 'done' ORDER BY id DESC")
    .all(wsId, rebuildId).map(v => ({ ...v, url: videoUrl(v) }));
}
