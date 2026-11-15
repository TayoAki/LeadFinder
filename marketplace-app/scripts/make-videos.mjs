// Sample shoppable videos, built from each product's own photos (slow zoom, crossfades) so the
// video feed has content before sellers upload real clips. Output:
//   public/videos/<shelby product id>.mp4 + .jpg (poster), and src/data/videos.json
// Usage: node scripts/make-videos.mjs   (needs ffmpeg; downloads the catalogue images)
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'));
const out = join(root, 'public/videos');
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'shelby-videos-'));

// One product per shop with at least three photos; a short line of seller-voice copy each.
const CAPTIONS = {
  s1: 'Made to order in solid wood. This one took us 3 weeks.',
  s5: 'Our everyday blender, unboxed.',
  s9: 'The check shirt, now in blue and black.',
  s3: 'Broken in by hand before it ships.',
  s10: 'Polarised, light, and built for long drives.',
  s4: 'Linen-soft, made for summer.',
  s6: 'Room for the essentials, nothing more.',
  s7: 'Hand-set green crystal, one pair at a time.',
  s8: 'House slippers you will want to wear out.',
};
const picks = {};
for (const p of catalog.products) if (p.images.length >= 3 && !picks[p.shopId] && CAPTIONS[p.shopId]) picks[p.shopId] = p;

const SEG = 2.2, FADE = 0.4, FPS = 30, FRAMES = Math.round(SEG * FPS);
const videos = [];
for (const [shopId, p] of Object.entries(picks)) {
  const imgs = p.images.slice(0, 4).map((url, i) => {
    const f = join(tmp, `${p.id}-${i}.webp`);
    execFileSync('curl', ['-sSfL', '-o', f, url]);
    return f;
  });
  const inputs = imgs.flatMap(f => ['-i', f]); // one frame each: zoompan expands it to SEG seconds
  // Each photo: centred on the app's warm neutral, slow zoom in (alternating out) at 2x then downscaled for smoothness.
  // Product photos are transparent WebP: flatten onto the warm neutral first, or transparency encodes as black.
  const parts = imgs.map((_, i) => `[${i}:v]format=rgba,split[a${i}][b${i}];[a${i}]drawbox=x=0:y=0:w=iw:h=ih:color=0xF1ECE4@1:t=fill[bg${i}];[bg${i}][b${i}]overlay=format=auto,scale=1440:2560:force_original_aspect_ratio=decrease,pad=1440:2560:(ow-iw)/2:(oh-ih)/2:color=0xF1ECE4,` +
    `zoompan=z='${i % 2 ? 'max(1.12-0.0018*on,1)' : 'min(1+0.0018*on,1.12)'}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${FRAMES}:s=720x1280:fps=${FPS},setsar=1,format=yuv420p[v${i}]`);
  let last = 'v0';
  for (let i = 1; i < imgs.length; i++) {
    const offset = (SEG - FADE) * i;
    parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[x${i}]`);
    last = `x${i}`;
  }
  parts.push(`[${last}]format=yuv420p[out]`); // xfade can output 4:4:4; players need 4:2:0
  const file = join(out, `${p.id}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '[out]',
    '-c:v', 'libx264', '-profile:v', 'main', '-crf', '27', '-preset', 'veryfast', '-movflags', '+faststart', '-an', file]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-frames:v', '1', '-q:v', '5', join(out, `${p.id}.jpg`)]);
  videos.push({ id: `v-${p.id}`, productId: p.id, title: p.title, shopId, caption: CAPTIONS[shopId], src: `/videos/${p.id}.mp4`, poster: `/videos/${p.id}.jpg` });
  console.log('made', p.id, p.title);
}
writeFileSync(join(root, 'src/data/videos.json'), JSON.stringify(videos, null, 2) + '\n');
console.log(`${videos.length} videos -> public/videos, src/data/videos.json`);
