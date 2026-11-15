// Removes everything seed-demo-niches.ts added, and nothing else:
//   - the products marked metadata.demo (and their offers, inventory and prices)
//   - the "Daily Ritual (demo)" shop
//   - the synthetic `details` on sample products marked metadata.demo_details
//     (details a seller has since edited, i.e. without the marker, are left alone)
//   - the Supplements / Skincare categories, if no real product uses them
// Then it resets the store index so the next `medusa start` no longer lists the removed offers.
//
//   bun run remove:demo-niches             (local)
//   SHELBY_DEMO=remove  on Railway          (runs at boot via boot.sh; safe to leave on)
// Orders that included demo products are kept (order history is never deleted).
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { deleteOffersWorkflow, deleteSellersWorkflow } from "@mercurjs/core/workflows";
import { deleteProductCategoriesWorkflow, deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
import { MercurModules } from "@mercurjs/types";
import { DEMO_CATEGORIES, DEMO_SHOP_EMAIL, DEMO_SHOP_HANDLE, resetStoreIndex } from "../lib/demo-content";

export default async function removeDemoNiches({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const productModule = container.resolve(Modules.PRODUCT);
  const removed: string[] = [];

  // 1. Demo products and their offers.
  const all = await productModule.listProducts({}, { take: 5000, relations: ["categories"] });
  const demoProducts = all.filter((p) => (p.metadata as any)?.demo === true);
  if (demoProducts.length) {
    const { data: offers } = await query.graph({ entity: "offer", fields: ["id"], filters: { product_id: demoProducts.map((p) => p.id) } });
    const offerIds = (offers as { id: string }[]).map((o) => o.id);
    if (offerIds.length) await deleteOffersWorkflow(container).run({ input: { ids: offerIds } });
    await deleteProductsWorkflow(container).run({ input: { ids: demoProducts.map((p) => p.id) } });
    removed.push(...offerIds, ...demoProducts.map((p) => p.id));
  }
  // Offers leave their inventory items behind; the demo ones all have SKUs starting OF-DEMO-.
  const inventory = container.resolve(Modules.INVENTORY);
  const items = (await inventory.listInventoryItems({}, { take: 10000 })).filter((i) => i.sku?.startsWith("OF-DEMO-"));
  if (items.length) await inventory.deleteInventoryItems(items.map((i) => i.id));
  logger.info(`Removed ${demoProducts.length} demo products and ${items.length} inventory items.`);

  // 2. The demo shop.
  const { data: sellers } = await query.graph({ entity: "seller", fields: ["id"], filters: { handle: DEMO_SHOP_HANDLE } });
  if (sellers[0]) {
    await deleteSellersWorkflow(container).run({ input: { ids: [sellers[0].id] } });
    removed.push(sellers[0].id);
    logger.info("Removed the demo shop.");
  }
  // Its login too (team member + auth identity), so the shop can be seeded again cleanly.
  {
    const email = DEMO_SHOP_EMAIL;
    const { data: members } = await query.graph({ entity: "member", fields: ["id"], filters: { email } });
    if (members.length) await (container.resolve(MercurModules.SELLER) as any).deleteMembers(members.map((m: any) => m.id));
    const auth = container.resolve(Modules.AUTH);
    const identities = await auth.listProviderIdentities({ entity_id: email, provider: "emailpass" });
    const authIds = identities.map((i) => i.auth_identity_id).filter((x): x is string => !!x);
    if (authIds.length) await auth.deleteAuthIdentities(authIds);
  }

  // 3. Synthetic details on the sample products.
  let stripped = 0;
  for (const p of all) {
    const m = (p.metadata ?? {}) as Record<string, unknown>; // only details we added (marker still set)
    if (m.demo === true || m.demo_details !== true) continue;
    // Medusa merges metadata on update; an empty string deletes a key.
    await productModule.updateProducts(p.id, { metadata: { details: "", demo_details: "" } });
    stripped++;
  }
  logger.info(`Removed synthetic details from ${stripped} products.`);

  // 4. Demo-only categories.
  const cats = await productModule.listProductCategories({ name: DEMO_CATEGORIES }, { relations: ["products"] });
  const empty = cats.filter((c) => !(c.products ?? []).some((p) => !demoProducts.some((d) => d.id === p.id)));
  if (empty.length) await deleteProductCategoriesWorkflow(container).run({ input: empty.map((c) => c.id) });
  logger.info(`Removed ${empty.length} empty demo categories.`);

  await resetStoreIndex(container, removed);
  logger.info("Demo content removed. Restart the API so the store re-indexes.");
}
