// Shopper's order → Printify. When an order group is placed, the items that came from Printify
// products (variant.metadata.printify_variant_id) are submitted to the Printify store as one order
// per Mercur order, with the Mercur order id as Printify's external_id (so webhooks map back).
//
// PRINTIFY_ORDERS controls it (Printify charges the merchant account for every order it produces):
//   off        (default) nothing is sent; the Mercur order is marked metadata.printify.skipped
//   create     the order is created in Printify; the store's own approval setting decides when it
//              goes to production (set it to Manual in Printify while testing)
//   production created and sent to production immediately
// Test orders (an @example.com email) are never sent.
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { printify, printifyConfig, printifyEnabled, shopPath } from "../lib/printify";

export default async function printifyOrder({ event, container }: SubscriberArgs<{ id: string }>) {
  if (!printifyEnabled()) return;
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const orderModule = container.resolve(Modules.ORDER);
  const mode = printifyConfig().orders;

  const { data: [group] } = await query.graph({
    entity: "order_group",
    fields: ["id", "orders.id", "orders.display_id", "orders.email", "orders.metadata", "orders.items.quantity", "orders.items.variant_id", "orders.items.product_id",
      "orders.shipping_address.first_name", "orders.shipping_address.last_name", "orders.shipping_address.address_1", "orders.shipping_address.address_2",
      "orders.shipping_address.city", "orders.shipping_address.province", "orders.shipping_address.postal_code", "orders.shipping_address.country_code", "orders.shipping_address.phone"],
    filters: { id: event.data.id },
  });
  if (!group) return;

  for (const order of (group as any).orders ?? []) {
    const variantIds = (order.items ?? []).map((i: any) => i.variant_id).filter(Boolean);
    if (!variantIds.length) continue;
    const { data: variants } = await query.graph({ entity: "product_variant", fields: ["id", "metadata", "product.metadata"], filters: { id: variantIds } });
    const lines = (order.items ?? []).flatMap((i: any) => {
      const v = (variants as any[]).find((x) => x.id === i.variant_id);
      const pv = v?.metadata?.printify_variant_id, pp = v?.product?.metadata?.printify_product_id;
      return pv && pp ? [{ product_id: String(pp), variant_id: Number(pv), quantity: i.quantity, external_id: `${order.id}:${i.variant_id}` }] : [];
    });
    if (!lines.length) continue; // not a Printify order

    const mark = (printify: Record<string, unknown>) =>
      orderModule.updateOrders(order.id, { metadata: { ...(order.metadata ?? {}), printify: { ...(order.metadata?.printify ?? {}), ...printify, updated_at: new Date().toISOString() } } });
    if (mode === "off") { await mark({ skipped: "PRINTIFY_ORDERS is off" }); logger.info(`[printify] order ${order.id} not sent (PRINTIFY_ORDERS=off)`); continue; }
    if (/@example\.com$/i.test(order.email || "")) { await mark({ skipped: "test order" }); continue; }

    const a = order.shipping_address ?? {};
    try {
      const created = await printify<{ id: string }>(shopPath("/orders.json"), { body: {
        external_id: order.id, label: String(order.display_id ?? order.id), line_items: lines, shipping_method: 1, send_shipping_notification: false,
        address_to: { first_name: a.first_name || "Shelby", last_name: a.last_name || "Customer", email: order.email, phone: a.phone || "",
          country: (a.country_code || "us").toUpperCase(), region: a.province || "", address1: a.address_1 || "", address2: a.address_2 || "", city: a.city || "", zip: a.postal_code || "" },
      } });
      if (mode === "production") await printify(shopPath(`/orders/${created.id}/send_to_production.json`), { body: {} });
      await mark({ order_id: created.id, status: mode === "production" ? "sending-to-production" : "pending", sent_at: new Date().toISOString() });
      logger.info(`[printify] order ${order.id} → Printify ${created.id} (${mode})`);
    } catch (e) {
      await mark({ error: (e as Error).message.slice(0, 500) });
      logger.error(`[printify] order ${order.id} failed: ${(e as Error).message}`);
    }
  }
}

export const config: SubscriberConfig = { event: "order_group.created" };
