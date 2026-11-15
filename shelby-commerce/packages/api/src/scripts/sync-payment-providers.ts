// Makes every region's payment providers match the configuration, on every boot:
//   Stripe configured (STRIPE_SECRET_KEY + both webhook secrets) -> Stripe only (pp_stripe-connector_stripe)
//   not set                -> the system test provider only (pp_system_default)
// Never both: with the free system provider still enabled, anyone could complete a cart through
// the Store API without paying.
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows";

export const STRIPE_PROVIDER = "pp_stripe-connector_stripe";
export const SYSTEM_PROVIDER = "pp_system_default";

export default async function syncPaymentProviders({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const env = process.env;
  const want = env.STRIPE_SECRET_KEY && env.STRIPE_OPERATOR_WEBHOOK_SECRET && env.STRIPE_SELLERS_WEBHOOK_SECRET ? STRIPE_PROVIDER : SYSTEM_PROVIDER;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "name", "payment_providers.id"] });
  for (const region of regions as { id: string; name: string; payment_providers?: { id: string }[] }[]) {
    const have = (region.payment_providers ?? []).map((p) => p.id).sort();
    if (have.length === 1 && have[0] === want) continue;
    await updateRegionsWorkflow(container).run({ input: { selector: { id: region.id }, update: { payment_providers: [want] } } });
    logger.info(`Region "${region.name}": payment providers ${JSON.stringify(have)} -> ["${want}"]`);
  }
  logger.info(`Payment providers in sync (${want}).`);
}
