// Shot-matched video: rebuild a rival's video ad shot for shot, with the same timing, camera and movement.
//
//   1. breakdownOriginal  cut the rival's video into shots (ffmpeg scene detection) and describe each one:
//                         kind (scene / app screen / end card), camera, what moves and when, caption style.
//   2. planVideo          our version of every shot: same kind, same length, same camera and the same action
//                         beats, moved to our scene; our own caption lines in the original's caption style.
//   3. renderVideoPlan    scene shots are animated from our ad's still with the text removed (long takes are chained
//                         clip to clip from the last frame); app shots scroll the brand's real App Store screens;
//                         end cards are drawn from the brand's icon and screens; captions burned on with ffmpeg.
//
// A plan is plain JSON stored on the rebuild (plan.video_plan), so it can be reviewed or edited before rendering.
import { execFile } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { REBUILD_DIR } from './rebuild.mjs';
import { renderImage } from './providers.mjs';
import { treg, tregAvailable } from './treg.mjs';

export const W = 1080, H = 1920, FPS = 30;
const FONT = process.env.KEEPWATCH_FONT || ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'].find(existsSync);
const FONT_REG = ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'].find(existsSync) || FONT;
export const MAX_SECONDS = 30;

const run = (cmd, args) => new Promise((ok, bad) => execFile(cmd, args, { maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 },
  (err, stdout, stderr) => (err ? bad(new Error(`${cmd} failed: ${String(stderr || err.message).split('\n').filter(Boolean).slice(-3).join(' ')}`)) : ok(String(stdout) + String(stderr)))));
const VCODEC = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(FPS)];

// ---------------------------------------------------------------- 1. the original, shot by shot

/** Times where the picture cuts to a new shot. */
export async function cutsOf(videoPath, threshold = 0.25) {
  const log = await run('ffmpeg', ['-v', 'info', '-i', videoPath, '-vf', `select='gt(scene,${threshold})',showinfo`, '-f', 'null', '-']);
  return [...log.matchAll(/pts_time:([\d.]+)/g)].map(m => Number(m[1]));
}

/** Cut times → shots. Cuts closer than minLen seconds (a flash, a two-frame transition) count as one cut. */
export function shotsFromCuts(cuts, duration, minLen = 0.5) {
  const edges = [0];
  for (const c of [...cuts].sort((a, b) => a - b)) if (c - edges.at(-1) >= minLen && duration - c >= minLen) edges.push(c);
  edges.push(duration);
  return edges.slice(0, -1).map((s, i) => ({ start: +s.toFixed(2), end: +edges[i + 1].toFixed(2) }));
}

export const durationOf = async p => Number((await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p])).trim());

/**
 * Download the rival's video and cut it into shots, with three frames per shot (start, middle, end) for a model
 * to describe. `describe(shots)` (Claude, when switched on) fills in kind, camera, motion and caption style.
 */
export async function breakdownOriginal(ad, { describe, work } = {}) {
  if (!ad?.video_url) return null;
  const src = join(work, 'original.mp4');
  const res = await fetch(ad.video_url, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) return null; // Meta's signed links expire; a refresh of the rival's ads fixes it
  writeFileSync(src, Buffer.from(await res.arrayBuffer()));
  const duration = await durationOf(src);
  const shots = shotsFromCuts(await cutsOf(src), duration);
  for (const [i, s] of shots.entries()) {
    s.frames = [];
    for (const [k, t] of [s.start + 0.1, (s.start + s.end) / 2, Math.max(s.start, s.end - 0.15)].entries()) {
      const f = join(work, `orig-${i}-${k}.jpg`);
      await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', src, '-frames:v', '1', '-vf', 'scale=360:-2', f]);
      s.frames.push(f);
    }
  }
  const described = describe ? await describe({ duration, shots, transcript: ad.transcript }) : null;
  return { duration: +duration.toFixed(2), shots: described || shots.map(({ start, end }) => ({ start, end })), source: described ? 'claude' : 'cuts' };
}

// ---------------------------------------------------------------- 2. our plan

/**
 * Plan without a language model: keep the original's shot timing; first shot is our ad's scene with our lines,
 * a middle shot becomes an app screen and the last one an end card when the brand is an app.
 */
export function rulePlan({ breakdown, plan = {}, assets, seconds = 6 }) {
  const texts = (plan.texts || []).map(t => String(t).trim()).filter(t => t.length > 6);
  const shots = breakdown?.shots?.length ? breakdown.shots : [{ start: 0, end: seconds }];
  const n = shots.length;
  const out = shots.map((s, i) => {
    const len = +(s.end - s.start).toFixed(2);
    if (i > 0 && i === n - 1 && assets && len < 4) return { kind: 'end_card', seconds: len, title: assets.name, line: plan.badge || assets.price };
    if (i > 0 && assets) return { kind: 'app_screen', seconds: len, screens: [assets.screens[i % assets.screens.length]?.name].filter(Boolean), captions: texts[i] ? [{ text: texts[i], style: 'outline', position: 0.42 }] : [] };
    return { kind: 'scene', seconds: len, still: i === 0 ? 'ad' : 'continue', camera: s.camera || 'Phone camera, handheld but steady', motion: s.motion || 'Small, natural movements of the people and objects already in the frame.',
      captions: i === 0 ? texts.slice(0, n > 1 ? 1 : texts.length).map((t, k) => ({ text: t, style: 'outline', position: 0.5 + k * 0.12 })) : [] };
  });
  return { duration: +shots.at(-1).end.toFixed(2), shots: out, source: 'rules' };
}

// ---------------------------------------------------------------- 3. render

/** The instructions the video model gets for one scene clip. Timed beats keep the movement in the original's order. */
export function scenePrompt(shot, part = 0) {
  const motion = Array.isArray(shot.motion) ? shot.motion[Math.min(part, shot.motion.length - 1)] : shot.motion;
  return [
    shot.camera ? `${shot.camera}.` : '',
    motion,
    'The video starts exactly on this frame. Keep the same people, faces, hair, clothes, objects, place and lighting the whole time.',
    'One continuous shot: no cuts, no scene change, no new people, no zoom or camera move unless described above.',
    'Do not add any text, letters, numbers, logos, captions or graphics.',
  ].filter(Boolean).join('\n');
}

async function shareable(path) {
  if (process.env.FAL_KEY || process.env.GEMINI_API_KEY) return `data:image/${path.endsWith('.png') ? 'png' : 'jpeg'};base64,${readFileSync(path).toString('base64')}`;
  return JSON.parse(await run('treg', ['host', path, '--json'])).url;
}

const CLEAN_PROMPT = `Remove every piece of text from this image: captions, headlines, labels, numbers, badges, stickers and buttons.
Fill each area naturally with what would be behind it. Change nothing else: the same people, objects, scene, colours, lighting, framing and composition.
The result must contain no letters or numbers at all.`;

/** The ad's still with all words removed, made once and kept next to the ad. */
export async function cleanPlate(rebuild, size = 'story') {
  const file = resolve(REBUILD_DIR, `clean-${rebuild.image_path}`);
  if (existsSync(file)) return { path: file, cost: 0 };
  const r = await renderImage(CLEAN_PROMPT, [await shareable(resolve(REBUILD_DIR, rebuild.image_path))], { size, prefer: 'gpt' });
  writeFileSync(file, r.bytes);
  return { path: file, cost: r.cost };
}

/** One image → clip. Seedance 1 Lite: Fal in production, treg/Replicate locally. 4–12 s per clip. */
export async function animate(imagePath, prompt, seconds) {
  const dur = Math.max(4, Math.min(12, Math.ceil(seconds)));
  const image = await shareable(imagePath);
  let url;
  if (process.env.FAL_KEY) {
    const res = await fetch('https://fal.run/fal-ai/bytedance/seedance/v1/lite/image-to-video', {
      method: 'POST', headers: { authorization: `Key ${process.env.FAL_KEY}`, 'content-type': 'application/json' }, signal: AbortSignal.timeout(900000),
      body: JSON.stringify({ prompt, image_url: image, duration: String(dur), resolution: '720p', camera_fixed: /locked|tripod|does not move|static/i.test(prompt) }),
    });
    const body = await res.json().catch(() => ({}));
    url = body.video?.url;
    if (!res.ok || !url) throw new Error(`Video engine: HTTP ${res.status} ${JSON.stringify(body.detail || body.error || '').slice(0, 200)}`);
  } else if (await tregAvailable()) {
    const { result } = await treg('replicate.video-gen.seedance-1-lite', { body: { input: { prompt, image, duration: dur, resolution: '720p', aspect_ratio: '9:16' } }, wait: 900 });
    url = Array.isArray(result?.output) ? result.output[0] : result?.output;
    if (!url) throw new Error('The video engine returned no clip.');
  } else throw new Error('No video engine: set FAL_KEY.');
  return { bytes: Buffer.from(await (await fetch(url)).arrayBuffer()), cost: 0.036 * dur };
}

/** Wrap on words to lines of about `max` characters. */
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
 * Caption → drawtext filters, in the original's style:
 *   outline  white bold, black outline (the usual Reels/TikTok caption)
 *   shadow   white, soft drop shadow (calm, documentary look)
 *   dark     dark grey on a light background (app screens, end cards)
 *   box      white on a dark box
 *   light    dark text on a white panel (captions over an app screen)
 *   word     one big word at a time, timed across the caption's span
 * position: top of the caption block as a fraction of the height.
 */
export function captionFilters(caps, shotSeconds, dir, tag) {
  const out = [];
  let k = 0;
  const txt = s => { const f = join(dir, `${tag}-${k++}.txt`); writeFileSync(f, s); return f.replace(/'/g, "\\'").replace(/:/g, '\\:'); };
  for (const c of caps || []) {
    const from = c.from ?? 0, to = c.to ?? shotSeconds;
    const y0 = Math.round((c.position ?? 0.5) * H);
    if (c.style === 'word') {
      const words = String(c.text).split(/\s+/).filter(Boolean);
      const slot = (to - from) / words.length;
      words.forEach((w, i) => out.push(`drawtext=fontfile='${FONT}':textfile='${txt(w.toUpperCase())}':fontsize=${c.size || 96}:fontcolor=white:borderw=7:bordercolor=black:x=(w-text_w)/2:y=${y0}:enable='between(t,${(from + i * slot).toFixed(2)},${(from + (i + 1) * slot - 0.01).toFixed(2)})'`));
      continue;
    }
    const long = String(c.text).length > 80;
    const size = c.size || (['shadow', 'dark', 'light'].includes(c.style) ? (long ? 40 : 46) : long ? 44 : 54);
    const lines = String(c.text).split('\n').flatMap(p => (p.trim() ? wrap(p, Math.round(1250 / size)) : ['']));
    const lh = Math.round(size * 1.32);
    const style = {
      outline: `fontcolor=white:borderw=${Math.max(3, Math.round(size / 11))}:bordercolor=black`,
      shadow: 'fontcolor=white:shadowcolor=black@0.55:shadowx=2:shadowy=2',
      dark: 'fontcolor=0x1d1d1f',
      box: 'fontcolor=white:box=1:boxcolor=black@0.62:boxborderw=16',
      light: 'fontcolor=0x111111:box=1:boxcolor=white@0.88:boxborderw=14',
    }[c.style] || `fontcolor=white:borderw=5:bordercolor=black`;
    lines.forEach((line, i) => { if (line) out.push(`drawtext=fontfile='${c.style === 'dark' || c.style === 'shadow' || c.style === 'light' ? FONT_REG : FONT}':textfile='${txt(line)}':fontsize=${size}:${style}:x=(w-text_w)/2:y=${y0 + i * lh}:enable='between(t,${from},${to})'`); });
  }
  return out;
}

const FILL = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`;

/** Encode one segment to exactly `seconds`, 1080×1920, with its captions. */
async function encodeSegment(inputArgs, baseFilter, seconds, caps, out, work, tag) {
  const vf = [baseFilter, `fps=${FPS}`, `tpad=stop_mode=clone:stop_duration=${seconds}`, `trim=duration=${seconds}`, 'setpts=PTS-STARTPTS', ...captionFilters(caps, seconds, work, tag)].join(',');
  await run('ffmpeg', ['-y', '-v', 'error', ...inputArgs, '-vf', vf, '-an', ...VCODEC, '-t', String(seconds), out]);
}

/** The phone screen out of an App Store screenshot (marketing headline on top, phone below). */
const SCREEN_CROP = 'crop=iw*0.78:ih*0.715:iw*0.11:ih*0.285';

async function sceneSegment(shot, ctx, i, out) {
  // where the clip starts: our ad with words removed, the last frame of the previous scene, or a new still
  let still;
  if (shot.still === 'continue' && ctx.lastFrame) still = ctx.lastFrame;
  else if (shot.still && typeof shot.still === 'object' && shot.still.prompt) {
    const refs = [await shareable(ctx.clean)];
    const img = await renderImage(`${shot.still.prompt}\nPhotorealistic, the same people and place as the reference image. No text, letters or numbers anywhere.`, refs, { size: 'story', prefer: 'gpt' });
    still = join(ctx.work, `still-${i}.png`);
    writeFileSync(still, img.bytes);
    ctx.cost += img.cost;
  } else still = ctx.clean;
  // long takes: chained clips of up to 10 s, each starting on the last frame of the one before
  const parts = Math.ceil(shot.seconds / 10);
  const each = shot.seconds / parts;
  const clips = [];
  let from = still;
  for (let p = 0; p < parts; p++) {
    const clip = await animate(from, scenePrompt(shot, p), each);
    ctx.cost += clip.cost;
    const f = join(ctx.work, `clip-${i}-${p}.mp4`);
    writeFileSync(f, clip.bytes);
    clips.push(f);
    from = join(ctx.work, `last-${i}-${p}.png`);
    await run('ffmpeg', ['-v', 'error', '-y', '-sseof', '-0.1', '-i', f, '-frames:v', '1', from]);
  }
  ctx.lastFrame = from;
  const joined = join(ctx.work, `scene-${i}.mp4`);
  if (clips.length === 1) await run('ffmpeg', ['-v', 'error', '-y', '-i', clips[0], '-t', String(each), '-an', ...VCODEC, '-vf', FILL, joined]);
  else {
    const inputs = clips.flatMap(c => ['-i', c]);
    const fc = clips.map((_, k) => `[${k}:v]${FILL},fps=${FPS},trim=duration=${each.toFixed(3)},setpts=PTS-STARTPTS[v${k}]`).join(';') + ';' + clips.map((_, k) => `[v${k}]`).join('') + `concat=n=${clips.length}:v=1[v]`;
    await run('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', fc, '-map', '[v]', '-an', ...VCODEC, joined]);
  }
  await encodeSegment(['-i', joined], FILL, shot.seconds, shot.captions, out, ctx.work, `s${i}`);
}

/** App screens scrolled like a screen recording. Several screens share the shot's time. */
async function appSegment(shot, ctx, i, out) {
  const screens = (shot.screens || []).map(n => ctx.assets?.screens.find(s => s.name === n)).filter(Boolean);
  if (!screens.length) throw new Error('This shot needs the app\'s screens; add your App Store link in Settings.');
  const per = shot.seconds / screens.length;
  const parts = [];
  for (const [k, s] of screens.entries()) {
    const f = join(ctx.work, `app-${i}-${k}.mp4`);
    // fit the phone screen to the width, then scroll from top to bottom over the time on screen
    const vf = `${SCREEN_CROP},scale=${W}:-2,pad=${W}:'max(ih,${H})':0:0:white,crop=${W}:${H}:0:'(ih-${H})*min(1,t/${per.toFixed(2)})'`;
    await run('ffmpeg', ['-v', 'error', '-y', '-loop', '1', '-i', s.path, '-vf', vf, '-t', per.toFixed(3), '-an', ...VCODEC, f]);
    parts.push(f);
  }
  const list = join(ctx.work, `app-${i}.txt`);
  writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  const joined = join(ctx.work, `app-${i}.mp4`);
  await run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
  await encodeSegment(['-i', joined], 'null', shot.seconds, shot.captions, out, ctx.work, `a${i}`);
}

/** End card from the brand's own icon and screens: icon, name, one line, and the phone, settling in. */
async function endCardSegment(shot, ctx, i, out) {
  const a = ctx.assets;
  if (!a) throw new Error('The end card needs your app icon; add your App Store link in Settings.');
  const color = (ctx.ws.brand_color || '#2a78d6').replace('#', '0x');
  const tf = s => { const f = join(ctx.work, `end-${i}-${Math.random().toString(36).slice(2)}.txt`); writeFileSync(f, s); return f; };
  const R = 44;
  const round = `format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(abs(X-W/2),W/2-${R})*gt(abs(Y-H/2),H/2-${R})*gt(hypot(abs(X-W/2)-(W/2-${R}),abs(Y-H/2)-(H/2-${R})),${R}),0,255)'`;
  let fc;
  const inputs = ['-f', 'lavfi', '-i', `color=c=white:s=${W}x${H}:r=${FPS}`, '-f', 'lavfi', '-i', `color=c=${color}:s=${W}x${H}:r=${FPS}`, '-loop', '1', '-i', a.icon];
  if (shot.style === 'type_on') {
    // a plain white card where the name types itself out next to the icon
    const name = shot.title || a.name;
    const n = name.length, step = Math.min(0.12, (shot.seconds * 0.5) / n);
    const draws = [...name].map((_, k) => `drawtext=fontfile='${FONT}':textfile='${tf(name.slice(0, k + 1))}':fontsize=96:fontcolor=0x111111:x=330:y=(h-text_h)/2:enable='${k === n - 1 ? `gte(t,${(k * step).toFixed(2)})` : `between(t,${(k * step).toFixed(2)},${((k + 1) * step - 0.001).toFixed(2)})`}'`);
    fc = `[2:v]scale=170:170,${round}[ic];[0:v][ic]overlay=140:(H-h)/2,${draws.join(',')}[v]`;
  } else {
    const screen = a.screens.find(s => s.name === shot.screen) || a.screens[0];
    inputs.push('-loop', '1', '-i', screen.path);
    const z = `1+0.04*min(t/${shot.seconds},1)`;
    fc = [
      `[1:v][0:v]blend=all_mode=normal:all_opacity=0.12[bg]`,
      `[2:v]scale=200:200,${round}[ic]`,
      // the screenshot's own phone, without its marketing headline
      `[3:v]crop=iw:ih*0.74:0:ih*0.26,scale=720:-2[ph]`,
      `[bg][ic]overlay=(W-w)/2:150[b1]`,
      `[b1]drawtext=fontfile='${FONT}':textfile='${tf(shot.title || a.name)}':fontsize=76:fontcolor=0x111111:x=(w-text_w)/2:y=390,drawtext=fontfile='${FONT_REG}':textfile='${tf(shot.line || a.price)}':fontsize=42:fontcolor=0x444444:x=(w-text_w)/2:y=490[b2]`,
      `[b2][ph]overlay=(W-w)/2:620,scale=w='trunc(${W}*(${z})/2)*2':h=-2:eval=frame,crop=${W}:${H}[v]`,
    ].join(';');
  }
  const raw = join(ctx.work, `end-${i}-raw.mp4`);
  await run('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', fc, '-map', '[v]', '-t', String(shot.seconds), '-an', ...VCODEC, raw]);
  await encodeSegment(['-i', raw], 'null', shot.seconds, shot.captions, out, ctx.work, `e${i}`);
}

/** Render a plan to one MP4. Returns { cost }. */
export async function renderVideoPlan(videoPlan, { rebuild, ws, assets, outPath, onShot }) {
  const work = mkdtempSync(join(tmpdir(), 'kw-shots-'));
  const ctx = { ws, assets, work, cost: 0, lastFrame: null, clean: null };
  try {
    const shots = videoPlan.shots.filter(s => s.seconds > 0.2);
    let total = 0;
    for (const s of shots) { s.seconds = Math.min(s.seconds, MAX_SECONDS - total); total += s.seconds; }
    if (shots.some(s => s.kind === 'scene')) { const c = await cleanPlate(rebuild); ctx.clean = c.path; ctx.cost += c.cost; }
    const segs = [];
    for (const [i, shot] of shots.entries()) {
      if (shot.seconds <= 0.2) continue;
      const f = join(work, `seg-${i}.mp4`);
      if (shot.kind === 'app_screen') await appSegment(shot, ctx, i, f);
      else if (shot.kind === 'end_card') await endCardSegment(shot, ctx, i, f);
      else await sceneSegment(shot, ctx, i, f);
      segs.push(f);
      onShot?.(i, shots.length);
    }
    const list = join(work, 'list.txt');
    writeFileSync(list, segs.map(p => `file '${p}'`).join('\n'));
    await run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '64k', '-shortest', '-movflags', '+faststart', outPath]);
    return { cost: ctx.cost };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
