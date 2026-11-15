// Manual Printify sync, run inside the live server so the store index picks changes up at once:
//   curl -X POST <api>/hooks/printify/sync -H "x-printify-secret: $PRINTIFY_WEBHOOK_SECRET"
// 1) imports every product published in the Printify store; 2) registers (or re-registers) the
// webhooks Printify uses to tell us about new publishes and order updates.
// For a local test: ?webhooks=0 skips webhook registration, ?report=0 skips telling Printify.
// ?recreate=1 rebuilds every product from scratch (after changing how categories or variants map).
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";
import { printify, printifyConfig, printifyEnabled, shopPath } from "../../../../lib/printify";
import { syncAllPrintifyProducts } from "../../../../lib/printify-sync";

const TOPICS = ["product:publish:started", "product:deleted", "order:updated", "order:sent-to-production", "order:shipment:created", "order:shipment:delivered"];

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const c = printifyConfig();
  const given = String(req.headers["x-printify-secret"] || "");
  if (!c.secret || given.length !== c.secret.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(c.secret))) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (!printifyEnabled()) { res.status(400).json({ message: "Set PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID" }); return; }

  const base = (process.env.MERCUR_BACKEND_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  const url = `${base}/hooks/printify`;
  const existing = await printify<any[]>(shopPath("/webhooks.json"));
  const webhooks: string[] = [];
  const register = req.query.webhooks !== "0";
  for (const topic of register ? TOPICS : []) {
    const mine = existing.find((w) => w.topic === topic && w.url === url);
    if (mine) await printify(shopPath(`/webhooks/${mine.id}.json`), { method: "PUT", body: { url, secret: c.secret } });
    else await printify(shopPath("/webhooks.json"), { body: { topic, url, secret: c.secret } });
    webhooks.push(topic);
  }
  const products = await syncAllPrintifyProducts(req.scope, { report: req.query.report !== "0", recreate: req.query.recreate === "1" });
  res.json({ webhook_url: url, webhooks, ...products });
}
