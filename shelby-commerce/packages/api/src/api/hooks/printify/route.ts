// Printify → Shelby webhooks (registered by POST /hooks/printify/sync).
//   product:publish:started  "Publish" in Printify: create/update the product in Mercur, then report
//                            publishing_succeeded (or _failed) so Printify unlocks it. action=delete removes it.
//   product:deleted          remove it from Mercur.
//   order:updated, order:sent-to-production, order:shipment:created, order:shipment:delivered
//                            copy status and tracking onto the Mercur order (metadata.printify).
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { printify, shopPath, verifyPrintifySignature, type PrintifyProduct } from "../../../lib/printify";
import { removePrintifyProduct, reportPublished, reportPublishFailed, upsertPrintifyProduct } from "../../../lib/printify-sync";

type Event = { id: string; type: string; resource: { id: string; type: string; data: any } };

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
  if (!verifyPrintifySignature((req as any).rawBody, req.headers["x-pfy-signature"] as string | undefined)) {
    res.status(401).json({ message: "Bad signature" });
    return;
  }
  const event = req.body as Event;
  // Answer at once (Printify retries slow or failed deliveries); do the work after.
  res.status(200).json({ received: true });
  try {
    await handle(req.scope, event);
  } catch (e) {
    logger.error(`[printify] ${event.type} ${event.resource?.id}: ${(e as Error).message}`);
  }
}

async function handle(container: any, event: Event) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const id = event.resource.id;
  switch (event.type) {
    case "product:publish:started": {
      if (event.resource.data?.action === "delete") { await removePrintifyProduct(container, id); logger.info(`[printify] removed ${id}`); return; }
      try {
        const p = await printify<PrintifyProduct>(shopPath(`/products/${id}.json`));
        const mercurId = await upsertPrintifyProduct(container, p);
        await reportPublished(id, mercurId);
        logger.info(`[printify] published "${p.title}" as ${mercurId}`);
      } catch (e) {
        await reportPublishFailed(id, (e as Error).message);
        throw e;
      }
      return;
    }
    case "product:deleted":
      await removePrintifyProduct(container, id);
      return;
    case "order:updated":
    case "order:sent-to-production":
    case "order:shipment:created":
    case "order:shipment:delivered": {
      const o = await printify<any>(shopPath(`/orders/${id}.json`));
      const mercurOrderId = o.metadata?.shop_order_id; // we send the Mercur order id as external_id
      if (!mercurOrderId) return;
      const orderModule = container.resolve(Modules.ORDER);
      const [order] = await orderModule.listOrders({ id: mercurOrderId }, { select: ["id", "metadata"] });
      if (!order) return;
      await orderModule.updateOrders(mercurOrderId, { metadata: { ...(order.metadata ?? {}), printify: {
        ...((order.metadata as any)?.printify ?? {}), order_id: o.id, status: o.status,
        shipments: (o.shipments ?? []).map((s: any) => ({ carrier: s.carrier, number: s.number, url: s.url, delivered_at: s.delivered_at ?? null })),
        updated_at: new Date().toISOString(),
      } } });
      logger.info(`[printify] order ${mercurOrderId} → ${o.status}`);
      return;
    }
  }
}
