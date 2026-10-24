import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { DB } from "./db.ts";
import { getCar } from "./cars.ts";
import type { Fetch } from "./apify.ts";

/**
 * Honest photo clean-up for relisting: auto-rotate, stretch exposure, gentle saturation and sharpening,
 * crop to 4:3 landscape. Nothing is painted out; damage stays visible.
 */
export async function enhancePhoto(input: Buffer): Promise<Buffer> {
  const img = sharp(input).rotate();
  const { width = 1200, height = 900 } = await img.metadata();
  const landscape = width >= height;
  return img
    .resize(landscape ? { width: 1600, height: 1200, fit: "cover", position: "attention" } : { width: 1200, height: 1600, fit: "cover" })
    .normalise({ lower: 1, upper: 99 })
    .modulate({ saturation: 1.12, brightness: 1.03 })
    .sharpen({ sigma: 0.8 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

/** Enhance up to `limit` of the listing's photos into `outDir`, returning the written file paths. */
export async function enhanceCarPhotos(db: DB, carId: string, outDir: string, o: { limit?: number; fetchImpl?: Fetch } = {}) {
  const car = getCar(db, carId);
  if (!car) throw new Error(`Unknown car ${carId}`);
  fs.mkdirSync(outDir, { recursive: true });
  const written: string[] = [];
  for (const [n, url] of car.photos.slice(0, o.limit ?? 8).entries()) {
    try {
      const res = await (o.fetchImpl ?? fetch)(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) continue;
      const out = path.join(outDir, `${carId.replace(/[^a-z0-9]+/gi, "_")}_${n + 1}.jpg`);
      fs.writeFileSync(out, await enhancePhoto(Buffer.from(await res.arrayBuffer())));
      written.push(out);
    } catch { /* skip unreadable photos (expired CDN links) */ }
  }
  return { carId, written };
}
