// SYNTHETIC DEMO DATA for the niches the sample catalogue lacks (supplements, skincare), plus
// product details (fit, fabric, dimensions, skin type, goal...) on every existing product, so the
// app's niche product pages, goal/skin-type filters and quiz can be exercised end to end.
//
// Everything written here is marked `metadata.demo = true` (new products) or
// `metadata.demo_details = true` (details added to existing products). No review, rating or sales
// numbers are created. Replace with seller-entered data before a real launch.
//
//   DEMO_IMAGE_BASE=https://<shelby web host> bun run seed:demo-niches
// Images are served by the Shelby app at <DEMO_IMAGE_BASE>/demo/<slug>.webp (marketplace-app/public/demo).
// Idempotent: skips the shop and products if they exist, and re-applies details.
// Undo it all with remove-demo-niches.ts. On Railway: SHELBY_DEMO=seed or SHELBY_DEMO=remove (boot.sh).
import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { AttributeType, ProductStatus, type CreateOfferDTO, type CreateProductDTO } from "@mercurjs/types";
import {
  approveSellerWorkflow, createOffersWorkflow, createProductsWorkflow, createSellerAccountWorkflow,
  createSellerShippingOptionsWorkflow, createSellerStockLocationsWorkflow,
} from "@mercurjs/core/workflows";
import {
  createLocationFulfillmentSetWorkflow, createProductCategoriesWorkflow, createServiceZonesWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";
import { randomBytes } from "crypto";
import demoJson from "./data/demo-niche-products.json";
import { DEMO_SHOP_EMAIL, DEMO_SHOP_HANDLE, resetStoreIndex } from "../lib/demo-content";

type DemoProduct = { slug: string; title: string; category: string; price: number; compareAt: number | null; color: string; description: string; details: Record<string, string> };
const demo = demoJson as unknown as { shop: { name: string; tagline: string; category: string; shipsIn: string; freeOver: number; shipping: number }; products: DemoProduct[] };

const ONE_SIZE = "One size";
const STOCK = 40;
const slug = (v: string) => v.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Plausible, clearly synthetic details for the existing sample products, by category and title.
function detailsFor(title: string, category: string): Record<string, string> | null {
  const t = title.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  switch (category) {
    case "Women": case "Men":
      return {
        fit: has("corset", "gown") ? "Fitted; size up if between sizes" : has("frock", "summer", "short") ? "Relaxed" : "True to size",
        fabric: has("leather") ? "Faux leather, polyester lining" : has("check", "plaid", "tartan") ? "Brushed cotton" : "Cotton blend",
        care: has("leather") ? "Wipe clean" : "Machine wash cold, hang dry",
        model: category === "Women" ? "Model is 5'8\" and wears S" : "Model is 6'0\" and wears M",
      };
    case "Shoes":
      return { fit: has("slipper") ? "Runs large; size down" : "True to size", fabric: has("golden", "red") ? "Synthetic upper, rubber sole" : "Textile upper, rubber sole", care: "Wipe clean" };
    case "Bags":
      return { fabric: has("faux") ? "Faux leather" : "Vegan leather", care: "Wipe clean", fit: has("backpack") ? "Fits a 13\" laptop" : "Fits a phone, wallet and keys" };
    case "Jewelry":
      return { fabric: "Gold-tone brass, glass stones", care: "Keep dry; store in the pouch", fit: "Hook fastening" };
    case "Accessories":
      return has("watch")
        ? { fabric: "Stainless steel case, alloy strap", fit: "Adjustable strap", care: "Splash resistant, not for swimming" }
        : { fabric: "Acetate frame, UV400 lenses", fit: "Medium width", care: "Clean with the cloth provided" };
    case "Beauty":
      return has("lip")
        ? { skin_type: "All skin types", concern: "Colour", shades: "Classic red", key_ingredients: "Shea butter, vitamin E", free_from: "Parabens", how_to_use: "Apply from the centre of the lip outwards." }
        : has("nail")
          ? { skin_type: "All skin types", concern: "Colour", shades: "Red", key_ingredients: "Quick-dry formula", free_from: "Formaldehyde, toluene, DBP", how_to_use: "Two thin coats; top coat for shine." }
          : has("eyeshadow")
            ? { skin_type: "All skin types", concern: "Colour", shades: "12 shades, matte and shimmer", key_ingredients: "Mica, talc-free base", free_from: "Talc, parabens", how_to_use: "Prime lids, then build colour with a brush." }
            : { skin_type: "Oily, Combination", concern: "Shine", shades: "Translucent", key_ingredients: "Silica, rice powder", free_from: "Fragrance", how_to_use: "Press lightly over foundation to set." };
    case "Home":
      return {
        dimensions: has("table", "stove", "oven", "sink") ? "Approx. 45 × 40 × 55 cm" : has("lamp", "pot", "plant", "frame", "swing") ? "Approx. 25 × 25 × 35 cm" : "Approx. 20 × 8 × 3 cm",
        materials: has("wood", "bamboo", "rolling", "chopping", "cherry") ? "Solid wood" : has("steel", "knife", "fork", "spoon", "wok", "pan", "pot", "tongs", "whisk", "grater", "strainer", "sieve") ? "Stainless or carbon steel" : has("glass") ? "Glass" : "Mixed materials",
        care: has("wood", "bamboo", "rolling", "chopping") ? "Hand wash, oil occasionally" : "Dishwasher safe where applicable",
      };
    case "Outdoors":
      return {
        materials: has("bat", "wicket") ? "Willow or aluminium" : has("helmet") ? "ABS shell, foam liner" : has("racket") ? "Graphite frame" : has("glove") ? "Leather" : "Rubber and synthetic leather",
        weight: has("bat", "racket", "helmet") ? "Approx. 0.9–1.2 kg" : "Under 0.5 kg",
        care: "Wipe clean; store dry",
      };
    default:
      return null;
  }
}

export default async function seedDemoNiches({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const productModule = container.resolve(Modules.PRODUCT);
  const imageBase = (process.env.DEMO_IMAGE_BASE || "").replace(/\/$/, "");
  if (!imageBase) throw new Error("Set DEMO_IMAGE_BASE to the Shelby app's URL (it serves /demo/*.webp).");

  // ---------- 1. synthetic details on every existing product ----------
  const existing = await productModule.listProducts({}, { relations: ["categories"], take: 1000 });
  let detailed = 0;
  for (const p of existing) {
    if ((p.metadata as any)?.demo) continue;
    const d = detailsFor(p.title, p.categories?.[0]?.name ?? "");
    if (!d) continue;
    await productModule.updateProducts(p.id, { metadata: { ...(p.metadata ?? {}), details: d, demo_details: true } });
    detailed++;
  }
  logger.info(`Added synthetic details to ${detailed} existing products (metadata.demo_details = true).`);

  // ---------- 2. the demo shop ----------
  const shop = demo.shop;
  const email = DEMO_SHOP_EMAIL;
  const { data: found } = await query.graph({ entity: "seller", fields: ["id"], filters: { handle: DEMO_SHOP_HANDLE } });
  if (found[0]) { await resetStoreIndex(container); logger.info("Demo shop already exists; details refreshed, products unchanged."); return; }

  const { data: [channel] } = await query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Shelby App" } });
  const regions = await container.resolve(Modules.REGION).listRegions({}, { relations: ["countries"] });
  const region = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us"));
  const { data: [profile] } = await query.graph({ entity: "shipping_profile", fields: ["id"], filters: { name: "Marketplace Shipping" } });
  if (!channel || !region || !profile) throw new Error("Run seed:shelby first (sales channel, region and shipping profile are missing).");

  const auth = container.resolve(Modules.AUTH);
  const reg = await auth.register("emailpass", { body: { email, password: process.env.SHELBY_SELLER_PASSWORD || randomBytes(18).toString("base64url") } });
  const authIdentityId = reg.success && reg.authIdentity ? reg.authIdentity.id
    : (await auth.listProviderIdentities({ entity_id: email, provider: "emailpass" }))[0].auth_identity_id!;
  const { result: seller } = await createSellerAccountWorkflow(container).run({
    input: {
      auth_identity_id: authIdentityId, member_email: email, first_name: "Daily", last_name: "Ritual",
      seller: {
        name: shop.name, handle: DEMO_SHOP_HANDLE, email, currency_code: "usd", description: shop.tagline,
        logo: `${imageBase}/demo/${demo.products[0].slug}.webp`, banner: `${imageBase}/demo/${demo.products[8].slug}.webp`,
        metadata: { tagline: shop.tagline, category: shop.category, ships_in: shop.shipsIn, free_over: shop.freeOver, shipping: shop.shipping, demo: true },
      },
    },
  });
  await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } });
  const { data: [member] } = await query.graph({ entity: "member", fields: ["id"], filters: { email } });

  const { result: [location] } = await createSellerStockLocationsWorkflow(container).run({
    input: { seller_id: seller.id, locations: [{ name: `${shop.name} warehouse`, address: { city: "Austin", province: "TX", country_code: "US", address_1: "1 Maker Lane" } }] },
  });
  await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } });
  await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });
  await createLocationFulfillmentSetWorkflow(container).run({ input: { location_id: location.id, fulfillment_set_data: { name: `${shop.name} delivery`, type: "shipping" } } });
  const { data: [withSet] } = await query.graph({ entity: "stock_location", fields: ["fulfillment_sets.id"], filters: { id: location.id } });
  const { result: [zone] } = await createServiceZonesWorkflow(container).run({
    input: { data: [{ fulfillment_set_id: (withSet as any).fulfillment_sets[0].id, name: `${shop.name} US`, geo_zones: [{ country_code: "us", type: "country" as const }] }] },
  });
  await createSellerShippingOptionsWorkflow(container).run({
    input: {
      seller_id: seller.id,
      shipping_options: [{
        name: "Standard Shipping", price_type: "flat", provider_id: "manual_manual", service_zone_id: zone.id, shipping_profile_id: profile.id,
        type: { label: "Standard", description: `Ships in ${shop.shipsIn}.`, code: "standard" },
        prices: [{ currency_code: "usd", amount: shop.shipping }, { region_id: region.id, amount: shop.shipping }],
        rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" as const }, { attribute: "is_return", value: "false", operator: "eq" as const }],
      }],
    },
  });

  // ---------- 3. categories, products, offers ----------
  const names = [...new Set(demo.products.map((p) => p.category))];
  const cats = await productModule.listProductCategories({ name: names });
  const catByName = new Map(cats.map((c) => [c.name, c.id]));
  const missing = names.filter((n) => !catByName.has(n));
  if (missing.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({ input: { product_categories: missing.map((name, rank) => ({ name, handle: slug(name), is_active: true, rank: 20 + rank })) } });
    result.forEach((c) => catByName.set(c.name, c.id));
  }
  const { data: [sizeAttr] } = await query.graph({ entity: "product_attribute", fields: ["id", "values.id", "values.name"], filters: { handle: "size", product_id: null } });
  const oneSize = (sizeAttr as any)?.values?.find((v: any) => v.name === ONE_SIZE)?.id;

  const products: CreateProductDTO[] = demo.products.map((p) => ({
    title: p.title, handle: `demo-${p.slug}`, description: p.description, status: ProductStatus.PUBLISHED,
    thumbnail: `${imageBase}/demo/${p.slug}.webp`, images: [{ url: `${imageBase}/demo/${p.slug}.webp` }], category_ids: [catByName.get(p.category)!],
    ...(sizeAttr && oneSize ? { attributes: [{ id: (sizeAttr as any).id, value_ids: [oneSize] }] } : {}),
    variants: [{ title: ONE_SIZE, sku: `DEMO-${p.slug.toUpperCase()}`, options: { Size: ONE_SIZE } }],
    metadata: { demo: true, compare_at: p.compareAt, details: p.details },
  }));
  await createProductsWorkflow(container).run({ input: { created_by: member.id, products } });

  const { data: created } = await query.graph({ entity: "product", fields: ["handle", "variants.id", "variants.sku"], filters: { handle: demo.products.map((p) => `demo-${p.slug}`) } });
  const bySlug = new Map(demo.products.map((p) => [`demo-${p.slug}`, p]));
  const offers: CreateOfferDTO[] = (created as any[]).map((prod) => {
    const p = bySlug.get(prod.handle)!; const v = prod.variants[0]; const sku = `OF-${v.sku}`;
    return {
      seller_id: seller.id, created_by: member.id, sku, variant_id: v.id, shipping_profile_id: profile.id,
      inventory_items: [{ sku, stock_levels: [{ location_id: location.id, stocked_quantity: STOCK }] }],
      prices: [{ amount: p.price, currency_code: "usd" }], metadata: { compare_at: p.compareAt, demo: true },
    };
  });
  await createOffersWorkflow(container).run({ input: { offers } });
  await resetStoreIndex(container); // the running store re-indexes on its next start
  logger.info(`Demo shop "${shop.name}": ${products.length} products, ${offers.length} offers. All marked metadata.demo = true.`);
}
