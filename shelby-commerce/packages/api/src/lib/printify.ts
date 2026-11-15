// Printify API client (https://developers.printify.com). Server-side only: the token never reaches
// the app. Settings (Railway, `commerce` service):
//   PRINTIFY_API_TOKEN       personal access token (Printify → My Profile → Connections)
//   PRINTIFY_SHOP_ID         the "API" store that Shelby fulfils through (e.g. 29759065, "Medusa")
//   PRINTIFY_WEBHOOK_SECRET  signs Printify's webhooks to us (and guards the manual sync route)
//   PRINTIFY_ORDERS          off (default) | create | production — see subscribers/printify-order.ts
//   PRINTIFY_BASE_URL        optional; https://enterprise.printful.com/api/pfy/public/v1 for Printful Enterprise
import crypto from "crypto";

export const printifyConfig = () => ({
  token: process.env.PRINTIFY_API_TOKEN || "",
  shopId: process.env.PRINTIFY_SHOP_ID || "",
  secret: process.env.PRINTIFY_WEBHOOK_SECRET || "",
  orders: (process.env.PRINTIFY_ORDERS || "off") as "off" | "create" | "production",
  base: (process.env.PRINTIFY_BASE_URL || "https://api.printify.com/v1").replace(/\/$/, ""),
});
export const printifyEnabled = () => { const c = printifyConfig(); return !!(c.token && c.shopId); };

export async function printify<T = any>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const c = printifyConfig();
  if (!c.token) throw new Error("PRINTIFY_API_TOKEN is not set");
  const res = await fetch(`${c.base}${path}`, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: { Authorization: `Bearer ${c.token}`, "User-Agent": "Shelby-Mercur", "Content-Type": "application/json;charset=utf-8" },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : {};
  if (!res.ok) throw new Error(`Printify ${init.method ?? "GET"} ${path} → ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data).slice(0, 400)}`);
  return data as T;
}
export const shopPath = (p: string) => `/shops/${printifyConfig().shopId}${p}`;

// Printify signs each webhook body: header `x-pfy-signature: sha256=<hex hmac of the raw body>`.
export function verifyPrintifySignature(raw: Buffer | string | undefined, header: string | undefined) {
  const secret = printifyConfig().secret;
  if (!secret || !raw || !header) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(String(header));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export type PrintifyVariant = { id: number; sku: string; price: number; title: string; is_enabled: boolean; is_available: boolean; options: number[] };
export type PrintifyProduct = {
  id: string; title: string; description: string; tags: string[]; visible: boolean; is_locked: boolean;
  options: { name: string; type: string; values: { id: number; title: string }[] }[];
  variants: PrintifyVariant[];
  images: { src: string; variant_ids: number[]; position: string; is_default: boolean }[];
  blueprint_id: number; print_provider_id: number;
};
