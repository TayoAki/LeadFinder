// Seeds the Shelby marketplace: US store and region, a publishable key for the app, Shelby's
// categories, the 10 sample shops as approved sellers (each with a warehouse and shipping), and
// the 88 sample products as master products, each with one offer from its own shop.
// Adapted from the Mercur starter seed (./seed.ts). Idempotent: skips if the sellers exist.
//
//   SHELBY_SELLER_PASSWORD=... bun run seed:shelby
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { AttributeType, ProductStatus, type CreateOfferDTO, type CreateProductDTO } from "@mercurjs/types";
import {
  approveSellerWorkflow, createOffersWorkflow, createProductAttributesWorkflow, createProductsWorkflow,
  createSellerAccountWorkflow, createSellerShippingOptionsWorkflow, createSellerStockLocationsWorkflow,
} from "@mercurjs/core/workflows";
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow, createLocationFulfillmentSetWorkflow, createProductCategoriesWorkflow, createRegionsWorkflow,
  createSalesChannelsWorkflow, createServiceZonesWorkflow, createShippingProfilesWorkflow, createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow, linkSalesChannelsToStockLocationWorkflow, updateStoresStep, updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { randomBytes } from "crypto";
import catalog from "./data/shelby-catalog.json";

type Shop = (typeof catalog.shops)[number];
type Item = (typeof catalog.products)[number];

const COUNTRIES = ["us"];
const ONE_SIZE = "One size";
// Fictional warehouse cities so each seller has a distinct US location.
const CITIES = ["Austin, TX", "Portland, OR", "Denver, CO", "Asheville, NC", "Brooklyn, NY", "Santa Fe, NM", "Madison, WI", "Savannah, GA", "Boise, ID", "Providence, RI"];

const slug = (v: string) => v.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const setCurrencies = createWorkflow("shelby-set-store-currencies", (input: { store_id: string }) => {
  const data = transform({ input }, ({ input }) => ({
    selector: { id: input.store_id },
    update: { supported_currencies: [{ currency_code: "usd", is_default: true }] },
  }));
  return new WorkflowResponse(updateStoresStep(data));
});

export default async function seedShelby({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const password = process.env.SHELBY_SELLER_PASSWORD || randomBytes(18).toString("base64url");

  // ---------- store, sales channel, region, tax, publishable key ----------
  const [store] = await container.resolve(Modules.STORE).listStores();
  const channels = container.resolve(Modules.SALES_CHANNEL);
  let [channel] = await channels.listSalesChannels({ name: "Shelby App" });
  if (!channel) {
    const { result } = await createSalesChannelsWorkflow(container).run({ input: { salesChannelsData: [{ name: "Shelby App" }] } });
    channel = result[0];
  }
  await setCurrencies(container).run({ input: { store_id: store.id } });
  await updateStoresWorkflow(container).run({ input: { selector: { id: store.id }, update: { name: "Shelby", default_sales_channel_id: channel.id } } });

  const regions = await container.resolve(Modules.REGION).listRegions({}, { relations: ["countries"] });
  let region = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us"));
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: { regions: [{ name: "United States", currency_code: "usd", countries: COUNTRIES, payment_providers: ["pp_system_default"] }] },
    });
    region = result[0];
  }
  const taxRegions = await container.resolve(Modules.TAX).listTaxRegions({ country_code: "us" });
  if (!taxRegions.length) await createTaxRegionsWorkflow(container).run({ input: [{ country_code: "us", provider_id: "tp_system" }] });

  let { data: [key] } = await query.graph({ entity: "api_key", fields: ["id", "token"], filters: { type: "publishable", title: "Shelby app" } });
  if (!key) {
    const { result } = await createApiKeysWorkflow(container).run({ input: { api_keys: [{ title: "Shelby app", type: "publishable", created_by: "" }] } });
    key = result[0];
  }
  try {
    await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: key.id, add: [channel.id] } });
  } catch (e) {
    if (!(e instanceof Error && e.message.includes("already"))) throw e;
  }
  logger.info(`Publishable key for the app: ${key.token}`);

  // ---------- categories and the Size variant axis ----------
  const productModule = container.resolve(Modules.PRODUCT);
  const categoryNames = [...new Set(catalog.products.map((p) => p.category))];
  const existingCats = await productModule.listProductCategories({ name: categoryNames });
  const catByName = new Map(existingCats.map((c) => [c.name, c.id]));
  const missingCats = categoryNames.filter((n) => !catByName.has(n));
  if (missingCats.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: missingCats.map((name, rank) => ({ name, handle: slug(name), is_active: true, rank })) },
    });
    result.forEach((c) => catByName.set(c.name, c.id));
  }

  const sizes = [...new Set(catalog.products.flatMap((p) => p.sizes)), ONE_SIZE];
  const loadSize = async () =>
    (await query.graph({ entity: "product_attribute", fields: ["id", "values.id", "values.name"], filters: { handle: "size", product_id: null } })).data[0] as
      | { id: string; values: { id: string; name: string }[] }
      | undefined;
  let sizeAttr = await loadSize();
  if (!sizeAttr) {
    await createProductAttributesWorkflow(container).run({
      input: { attributes: [{ name: "Size", handle: "size", type: AttributeType.MULTI_SELECT, is_variant_axis: true, is_filterable: true, rank: 0, values: sizes.map((name, rank) => ({ name, rank })) }] },
    });
    sizeAttr = (await loadSize())!;
  }
  const sizeValueId = (name: string) => sizeAttr!.values.find((v) => v.name === name)?.id;

  // ---------- sellers ----------
  const { data: already } = await query.graph({ entity: "seller", fields: ["id"], filters: { email: `${slug(catalog.shops[0].name)}@example.com` } });
  if (already[0]) {
    logger.info("Shelby sellers already exist; skipping sellers, products and offers.");
    return;
  }
  const { data: profiles } = await query.graph({ entity: "shipping_profile", fields: ["id"], filters: { name: "Marketplace Shipping" } });
  const shippingProfileId: string = profiles[0]?.id ??
    (await createShippingProfilesWorkflow(container).run({ input: { data: [{ name: "Marketplace Shipping", type: "default" }] } })).result[0].id;

  const auth = container.resolve(Modules.AUTH);
  const sellers = new Map<string, { id: string; memberId: string; locationId: string }>();
  for (const [i, shop] of (catalog.shops as Shop[]).entries()) {
    const email = `${slug(shop.name)}@example.com`; // placeholder addresses: real sellers register themselves
    const reg = await auth.register("emailpass", { body: { email, password } });
    const authIdentityId = reg.success && reg.authIdentity ? reg.authIdentity.id
      : (await auth.listProviderIdentities({ entity_id: email, provider: "emailpass" }))[0].auth_identity_id!;
    const { result: seller } = await createSellerAccountWorkflow(container).run({
      input: {
        auth_identity_id: authIdentityId, member_email: email, first_name: shop.name.split(" ")[0], last_name: "Owner",
        seller: {
          name: shop.name, handle: slug(shop.name), email, currency_code: "usd", description: shop.tagline, logo: shop.logo, banner: shop.banner,
          metadata: { shelby_id: shop.id, tagline: shop.tagline, category: shop.category, followers: shop.followers, rating: shop.id === "s7" ? 0 : shop.rating, ships_in: shop.shipsIn, free_over: shop.freeOver, shipping: shop.shipping },
        },
      },
    });
    await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } });
    const { data: [member] } = await query.graph({ entity: "member", fields: ["id"], filters: { email } });

    const [city, state] = CITIES[i % CITIES.length].split(", ");
    const { result: [location] } = await createSellerStockLocationsWorkflow(container).run({
      input: { seller_id: seller.id, locations: [{ name: `${shop.name} studio`, address: { city, province: state, country_code: "US", address_1: "1 Maker Lane" } }] },
    });
    await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } });
    await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });
    if (i === 0) await updateStoresWorkflow(container).run({ input: { selector: { id: store.id }, update: { default_location_id: location.id } } });
    await createLocationFulfillmentSetWorkflow(container).run({ input: { location_id: location.id, fulfillment_set_data: { name: `${shop.name} delivery`, type: "shipping" } } });
    const { data: [withSet] } = await query.graph({ entity: "stock_location", fields: ["fulfillment_sets.id"], filters: { id: location.id } });
    const { result: [zone] } = await createServiceZonesWorkflow(container).run({
      input: { data: [{ fulfillment_set_id: withSet.fulfillment_sets[0].id, name: `${shop.name} US`, geo_zones: COUNTRIES.map((country_code) => ({ country_code, type: "country" as const })) }] },
    });
    const rules = [{ attribute: "enabled_in_store", value: "true", operator: "eq" as const }, { attribute: "is_return", value: "false", operator: "eq" as const }];
    await createSellerShippingOptionsWorkflow(container).run({
      input: {
        seller_id: seller.id,
        shipping_options: [{
          name: "Standard Shipping", price_type: "flat", provider_id: "manual_manual", service_zone_id: zone.id, shipping_profile_id: shippingProfileId,
          type: { label: "Standard", description: `Ships in ${shop.shipsIn}.`, code: "standard" },
          prices: [{ currency_code: "usd", amount: shop.shipping }, { region_id: region.id, amount: shop.shipping }], rules,
        }],
      },
    });
    sellers.set(shop.id, { id: seller.id, memberId: member.id, locationId: location.id });
    logger.info(`Seller "${shop.name}" ready.`);
  }

  // ---------- products (per seller, so each seller authored its own) ----------
  const items = catalog.products as Item[];
  const handleOf = (p: Item) => `${slug(p.title)}-${p.id}`;
  for (const [shopId, seller] of sellers) {
    const mine = items.filter((p) => p.shopId === shopId);
    if (!mine.length) continue;
    const products: CreateProductDTO[] = mine.map((p) => {
      const sizesFor = p.sizes.length ? p.sizes : [ONE_SIZE];
      return {
        title: p.title, handle: handleOf(p), description: p.description, status: ProductStatus.PUBLISHED,
        thumbnail: p.image, images: p.images.map((url) => ({ url })), category_ids: [catByName.get(p.category)!],
        attributes: [{ id: sizeAttr!.id, value_ids: sizesFor.map(sizeValueId).filter((x): x is string => !!x) }],
        variants: sizesFor.map((s) => ({ title: s, sku: `SH-${p.id}-${slug(s).toUpperCase()}`, options: { Size: s } })),
        metadata: { shelby_id: p.id, compare_at: p.compareAt, rating: p.rating, reviews: p.reviews, sold: p.sold },
      };
    });
    await createProductsWorkflow(container).run({ input: { created_by: seller.memberId, products } });
  }
  logger.info(`Created ${items.length} products.`);

  // ---------- offers: the owning shop sells every variant at the listed price ----------
  const { data: created } = await query.graph({ entity: "product", fields: ["handle", "variants.id", "variants.sku"], filters: { handle: items.map(handleOf) } });
  const byHandle = new Map(items.map((p) => [handleOf(p), p]));
  const offers: CreateOfferDTO[] = [];
  for (const prod of created as { handle: string; variants: { id: string; sku: string }[] }[]) {
    const p = byHandle.get(prod.handle)!; const seller = sellers.get(p.shopId)!;
    for (const v of prod.variants) {
      const sku = `OF-${v.sku}`;
      offers.push({
        seller_id: seller.id, created_by: seller.memberId, sku, variant_id: v.id, shipping_profile_id: shippingProfileId,
        inventory_items: [{ sku, stock_levels: [{ location_id: seller.locationId, stocked_quantity: p.stock }] }],
        prices: [{ amount: p.price, currency_code: "usd" }],
        metadata: { compare_at: p.compareAt },
      });
    }
  }
  await createOffersWorkflow(container).run({ input: { offers } });
  logger.info(`Created ${offers.length} offers across ${sellers.size} sellers. Done.`);
}
