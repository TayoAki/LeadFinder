// Turn a finished ad into a short vertical video (1080×1920, Reels / Stories / TikTok).
//
// Two modes:
//   motion  The real ad, pixel for pixel, with a slow push-in. Words stay exactly as approved. ffmpeg only, no AI.
//   ai      Rebuilds the rival's original video shot for shot (shots.mjs): the same number of shots, the same
//           length, camera and movement beats, in our scene. Scene shots are animated from our ad with its words
//           removed (video models garble text); app shots scroll the brand's real App Store screens; the end card
//           uses the brand's icon; captions are burned on with ffmpeg in the original's caption style.
// ffmpeg (and a font) must be installed; the Dockerfile adds both.
import { execFile } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { getDb, getWorkspace, DATA_DIR } from './db.mjs';
import { getAd } from './analytics.mjs';
import { hasLLM, describeShots, planVideoShots } from './llm.mjs';
import { appAssets } from './appstore.mjs';
import { breakdownOriginal, rulePlan, renderVideoPlan } from './shots.mjs';
import { REBUILD_DIR } from './rebuild.mjs';
import { tregAvailable } from './treg.mjs';

export const VIDEO_DIR = resolve(DATA_DIR, 'videos');
export const VIDEO_MODES = {
  motion: { label: 'Motion', note: 'Your ad exactly as approved, with a slow camera push. Instant.' },
  ai: { label: 'AI video', note: 'Rebuilds the original video shot for shot: same timing, camera and movement, in your scene, with your app and your lines. 2 to 6 minutes.' },
};
const W = 1080, H = 1920, FPS = 30;

const run = (cmd, args, opts = {}) => new Promise((ok, bad) => execFile(cmd, args, { maxBuffer: 32 * 1024 * 1024, timeout: 10 * 60 * 1000, ...opts },
  (err, stdout, stderr) => (err ? bad(new Error(`${cmd} failed: ${String(stderr || err.message).split('\n').filter(Boolean).slice(-3).join(' ')}`)) : ok(stdout))));

let ffmpegOk;
export async function videoStatus() {
  if (ffmpegOk === undefined) ffmpegOk = await run('ffmpeg', ['-version']).then(() => true, () => false);
  return { motion: ffmpegOk, ai: ffmpegOk && Boolean(process.env.FAL_KEY || await tregAvailable()) };
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

/**
 * ai: match the rival's video shot for shot (see shots.mjs). The plan is kept on the ad (plan.video_plan),
 * so a second render, or a hand-edited plan, reuses it instead of planning again.
 */
export async function aiVideo(rebuild, plan, ws, outPath, work, db) {
  const assets = await appAssets(ws).catch(() => null);
  let videoPlan = plan.video_plan;
  if (!videoPlan) {
    const ad = getAd(db, rebuild.ad_id);
    const breakdown = await breakdownOriginal(ad, { work, describe: hasLLM() ? describeShots : null }).catch(() => null);
    videoPlan = hasLLM() && breakdown
      ? await planVideoShots({ breakdown, plan, ws, screens: (assets?.screens || []).map(s => s.name) })
      : rulePlan({ breakdown, plan, assets });
    db.prepare('UPDATE rebuilds SET why = ? WHERE id = ?').run(JSON.stringify({ ...plan, video_plan: videoPlan }), rebuild.id);
  }
  const r = await renderVideoPlan(structuredClone(videoPlan), { rebuild, ws, assets, outPath });
  return { cost: r.cost, engine: `matched ${videoPlan.shots.length} shot${videoPlan.shots.length === 1 ? '' : 's'} (${videoPlan.source})`, seconds: Math.round(videoPlan.shots.reduce((t, x) => t + x.seconds, 0)) };
}

/** Make a video for one finished ad. Returns the saved row. */
export async function makeVideo(wsId, rebuild, { mode = 'motion', seconds = 6, db = getDb(), ws = getWorkspace(wsId, db) } = {}) {
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
    else meta = await aiVideo(rebuild, plan, ws, out, work, db);
    db.prepare('UPDATE videos SET status = ?, path = ?, cost_usd = ?, engine = ?, seconds = ? WHERE id = ?').run('done', file, meta.cost, meta.engine, meta.seconds ?? seconds, id);
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
