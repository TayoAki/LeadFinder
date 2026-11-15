// Shared by the demo seed and remove scripts (src/scripts/seed-demo-niches.ts, remove-demo-niches.ts).
// Everything synthetic carries one of these markers, so it can be found and removed in one step:
//   seller.metadata.demo = true           the "Daily Ritual (demo)" shop
//   product.metadata.demo = true          its 14 products (and their offers)
//   product.metadata.demo_details = true  synthetic `details` added to the real sample products
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";

export const DEMO_SHOP_HANDLE = "daily-ritual-demo";
export const DEMO_SHOP_EMAIL = `${DEMO_SHOP_HANDLE}@example.com`; // placeholder address, never mailed
export const DEMO_CATEGORIES = ["Supplements", "Skincare"];

// The store lists offers from Medusa's index engine, which syncs from events on the running
// server. These scripts run in their own process, so: drop index rows for anything deleted, and
// mark every indexed entity pending so the next `medusa start` re-syncs it from the database.
export async function resetStoreIndex(container: MedusaContainer, deletedIds: string[] = []) {
  const pg = container.resolve(ContainerRegistrationKeys.PG_CONNECTION) as any;
  if (deletedIds.length) {
    await pg("index_relation").whereIn("parent_id", deletedIds).orWhereIn("child_id", deletedIds).delete();
    await pg("index_data").whereIn("id", deletedIds).delete();
  }
  await pg("index_metadata").update({ status: "pending", fields_hash: "reindex" });
}
