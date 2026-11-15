// Printify → Mercur product sync. Printify products live in Mercur under one supplier seller,
// "Shelby Studio" (handle shelby-studio), each with one offer per enabled Printify variant.
// Links back to Printify are kept in metadata, never in ids:
//   product.metadata.printify_product_id      variant.metadata.printify_variant_id
// Print on demand has no real stock limit, so offers carry PRINTIFY_STOCK units (default 999) while
// Printify reports the variant available, and 0 when it doesn't.
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";
import { ProductStatus, type CreateOfferDTO, type CreateProductDTO } from "@mercurjs/types";
import {
  approveSellerWorkflow, createOffersWorkflow, createProductsWorkflow, createSellerAccountWorkflow,
  createSellerShippingOptionsWorkflow, createSellerStockLocationsWorkflow, deleteOffersWorkflow, upsertOfferPricesWorkflow,
} from "@mercurjs/core/workflows";
import {
  createLocationFulfillmentSetWorkflow, createProductCategoriesWorkflow, createServiceZonesWorkflow, deleteProductsWorkflow,
  linkSalesChannelsToStockLocationWorkflow, updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { randomBytes } from "crypto";
import { printify, shopPath, type PrintifyProduct } from "./printify";

export const STUDIO_HANDLE = "shelby-studio";
const STUDIO_EMAIL = `${STUDIO_HANDLE}@example.com`; // placeholder login, never mailed
const STOCK = Number(process.env.PRINTIFY_STOCK || 999);
const FLAT_SHIPPING = Number(process.env.PRINTIFY_FLAT_SHIPPING || 6.99);
const handleOf = (id: string) => `pfy-${id}`;
const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const plain = (html: string) => (html || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();

// Which Shelby category a Printify product belongs in (matched on its title and tags).
function categoryFor(p: PrintifyProduct) {
  // The title decides first (tags are noisy: most Printify products are tagged "print").
  const title = p.title.toLowerCase(), all = `${title} ${(p.tags || []).join(" ")}`.toLowerCase();
  const apparel = /shirt|tee\b|t-shirt|hoodie|sweat|crewneck|tank|jacket|jogger|legging|dress|onesie|polo/;
  const home = /mug|poster|canvas|pillow|blanket|towel|candle|frame|coaster|tumbler|bottle/;
  const accessories = /phone case|tote|bag|hat|cap\b|beanie|sock|sticker|keychain/;
  for (const t of [title, all]) {
    if (apparel.test(t)) return "Apparel";
    if (home.test(t)) return "Home";
    if (accessories.test(t)) return "Accessories";
  }
  return "Apparel";
}

type Studio = { sellerId: string; memberId: string; locationId: string; profileId: string };

// The supplier seller Printify products sit under (created once, with a warehouse and flat shipping).
export async function ensureStudio(container: MedusaContainer): Promise<Studio> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const { data: [profile] } = await query.graph({ entity: "shipping_profile", fields: ["id"], filters: { name: "Marketplace Shipping" } });
  const { data: [found] } = await query.graph({ entity: "seller", fields: ["id"], filters: { handle: STUDIO_HANDLE } });
  if (found) {
    const { data: [member] } = await query.graph({ entity: "member", fields: ["id"], filters: { email: STUDIO_EMAIL } });
    const { data: locs } = await query.graph({ entity: "stock_location", fields: ["id", "name"], filters: { name: "Shelby Studio (Printify)" } });
    return { sellerId: found.id, memberId: member.id, locationId: locs[0].id, profileId: profile.id };
  }
  const { data: [channel] } = await query.graph({ entity: "sales_channel", fields: ["id"], filters: { name: "Shelby App" } });
  const regions = await container.resolve(Modules.REGION).listRegions({}, { relations: ["countries"] });
  const region = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us"));
  if (!channel || !region || !profile) throw new Error("Store setup missing (sales channel, US region or shipping profile)");

  const auth = container.resolve(Modules.AUTH);
  const reg = await auth.register("emailpass", { body: { email: STUDIO_EMAIL, password: randomBytes(18).toString("base64url") } });
  const authIdentityId = reg.success && reg.authIdentity ? reg.authIdentity.id
    : (await auth.listProviderIdentities({ entity_id: STUDIO_EMAIL, provider: "emailpass" }))[0].auth_identity_id!;
  const { result: seller } = await createSellerAccountWorkflow(container).run({
    input: {
      auth_identity_id: authIdentityId, member_email: STUDIO_EMAIL, first_name: "Shelby", last_name: "Studio",
      seller: { name: "Shelby Studio", handle: STUDIO_HANDLE, email: STUDIO_EMAIL, currency_code: "usd", description: "Printed on demand by Printify",
        metadata: { tagline: "Printed on demand, shipped by Printify", category: "Apparel", ships_in: "2–5 days", free_over: 0, shipping: FLAT_SHIPPING, supplier: "printify" } },
    },
  });
  await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } });
  const { data: [member] } = await query.graph({ entity: "member", fields: ["id"], filters: { email: STUDIO_EMAIL } });
  const { result: [location] } = await createSellerStockLocationsWorkflow(container).run({
    input: { seller_id: seller.id, locations: [{ name: "Shelby Studio (Printify)", address: { city: "Columbus", province: "OH", country_code: "US", address_1: "Printify print partner" } }] },
  });
  await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } });
  await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });
  await createLocationFulfillmentSetWorkflow(container).run({ input: { location_id: location.id, fulfillment_set_data: { name: "Shelby Studio delivery", type: "shipping" } } });
  const { data: [withSet] } = await query.graph({ entity: "stock_location", fields: ["fulfillment_sets.id"], filters: { id: location.id } });
  const { result: [zone] } = await createServiceZonesWorkflow(container).run({
    input: { data: [{ fulfillment_set_id: (withSet as any).fulfillment_sets[0].id, name: "Shelby Studio US", geo_zones: [{ country_code: "us", type: "country" as const }] }] },
  });
  await createSellerShippingOptionsWorkflow(container).run({
    input: {
      seller_id: seller.id,
      shipping_options: [{
        name: "Standard Shipping", price_type: "flat", provider_id: "manual_manual", service_zone_id: zone.id, shipping_profile_id: profile.id,
        type: { label: "Standard", description: "Printed and shipped in 2–5 business days.", code: "standard" },
        prices: [{ currency_code: "usd", amount: FLAT_SHIPPING }, { region_id: region.id, amount: FLAT_SHIPPING }],
        rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" as const }, { attribute: "is_return", value: "false", operator: "eq" as const }],
      }],
    },
  });
  return { sellerId: seller.id, memberId: member.id, locationId: location.id, profileId: profile.id };
}

async function categoryId(container: MedusaContainer, name: string) {
  const productModule = container.resolve(Modules.PRODUCT);
  const [cat] = await productModule.listProductCategories({ name });
  if (cat) return cat.id;
  const { result } = await createProductCategoriesWorkflow(container).run({ input: { product_categories: [{ name, handle: slug(name), is_active: true }] } });
  return result[0].id;
}

// Variant titles shoppers pick from: drop any option that has a single value (e.g. one colour).
function variantTitles(p: PrintifyProduct) {
  const enabled = p.variants.filter((v) => v.is_enabled);
  // A variant's option ids are not always in the product's option order, so place each id by
  // the option it belongs to; then order as colour first, size last ("Black / M").
  const valueTitle = new Map<number, string>(), optionOf = new Map<number, number>();
  p.options.forEach((o, i) => o.values.forEach((v) => { valueTitle.set(v.id, v.title); optionOf.set(v.id, i); }));
  const order = p.options.map((o, i) => ({ i, rank: /size/i.test(o.name) || o.type === "size" ? 1 : 0 })).sort((a, b) => a.rank - b.rank).map((x) => x.i);
  const valuesFor = (v: { options: number[] }) => { const by: Record<number, number> = {}; for (const id of v.options) by[optionOf.get(id) ?? -1] = id; return by; };
  const keep = p.options.map((_, i) => new Set(enabled.map((v) => valuesFor(v)[i])).size > 1);
  return new Map(enabled.map((v) => {
    const by = valuesFor(v);
    const t = order.filter((i) => keep[i]).map((i) => valueTitle.get(by[i])).filter(Boolean).join(" / ");
    return [v.id, t || "One size"];
  }));
}

async function findProduct(container: MedusaContainer, printifyId: string) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: "product", fields: ["id", "variants.id", "variants.metadata"], filters: { handle: handleOf(printifyId) } });
  return data[0] as { id: string; variants: { id: string; metadata: Record<string, unknown> | null }[] } | undefined;
}

// Create or update one Printify product in Mercur. Returns the Mercur product id.
export async function upsertPrintifyProduct(container: MedusaContainer, p: PrintifyProduct): Promise<string> {
  const studio = await ensureStudio(container);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const titles = variantTitles(p);
  // Sizes in shopping order (XS … 5XL), not Printify's listing order.
  const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "4XL", "5XL"];
  const rank = (t: string) => { const s = t.split(" / ").pop() || ""; const i = SIZES.indexOf(s.toUpperCase()); return i < 0 ? 99 : i; };
  const enabled = p.variants.filter((v) => v.is_enabled)
    .sort((a, b) => rank(titles.get(a.id)!) - rank(titles.get(b.id)!) || titles.get(a.id)!.localeCompare(titles.get(b.id)!));
  if (!enabled.length) throw new Error("No enabled variants to sell");
  const images = [...p.images].sort((a, b) => Number(b.is_default) - Number(a.is_default)).map((i) => i.src).filter((s, i, a) => a.indexOf(s) === i).slice(0, 8);
  const compareAt = null;
  const existing = await findProduct(container, p.id);

  // Same variants as before: update in place (text, photos, prices, availability).
  const sameVariants = existing && existing.variants.length === enabled.length && enabled.every((v) => existing.variants.some((x) => Number(x.metadata?.printify_variant_id) === v.id));
  if (existing && sameVariants) {
    await updateProductsWorkflow(container).run({ input: { selector: { id: existing.id }, update: {
      title: p.title, description: plain(p.description), thumbnail: images[0], images: images.map((url) => ({ url })),
      metadata: { printify_product_id: p.id, supplier: "printify", compare_at: compareAt },
    } } });
    const { data: offers } = await query.graph({ entity: "offer", fields: ["id", "variant_id"], filters: { product_id: existing.id } });
    const byVariant = new Map(existing.variants.map((x) => [x.id, Number(x.metadata?.printify_variant_id)]));
    await upsertOfferPricesWorkflow(container).run({ input: { offers: (offers as any[]).map((o) => {
      const v = enabled.find((e) => e.id === byVariant.get(o.variant_id));
      return { id: o.id, prices: [{ amount: (v?.price ?? 0) / 100, currency_code: "usd" }] };
    }) } });
    return existing.id;
  }
  // New, or the variant set changed: (re)create it.
  if (existing) await removePrintifyProduct(container, p.id);

  const titleList = enabled.map((v) => titles.get(v.id)!);
  const product: CreateProductDTO = {
    title: p.title, handle: handleOf(p.id), description: plain(p.description), status: ProductStatus.PUBLISHED,
    thumbnail: images[0], images: images.map((url) => ({ url })), category_ids: [await categoryId(container, categoryFor(p))],
    attributes: [{ title: "Option", is_variant_axis: true, values: titleList }],
    variants: enabled.map((v) => ({ title: titles.get(v.id)!, sku: `PFY-${v.id}-${p.id.slice(-6)}`, options: { Option: titles.get(v.id)! }, metadata: { printify_variant_id: v.id, printify_sku: v.sku } })),
    metadata: { printify_product_id: p.id, supplier: "printify", compare_at: compareAt, printify_blueprint_id: p.blueprint_id, printify_print_provider_id: p.print_provider_id },
  } as CreateProductDTO;
  await createProductsWorkflow(container).run({ input: { created_by: studio.memberId, products: [product] } });

  const { data: [created] } = await query.graph({ entity: "product", fields: ["id", "variants.id", "variants.sku", "variants.metadata"], filters: { handle: handleOf(p.id) } });
  const offers: CreateOfferDTO[] = (created as any).variants.map((mv: any) => {
    const v = enabled.find((e) => e.id === Number(mv.metadata?.printify_variant_id))!;
    const sku = `OF-${mv.sku}`;
    return {
      seller_id: studio.sellerId, created_by: studio.memberId, sku, variant_id: mv.id, shipping_profile_id: studio.profileId,
      inventory_items: [{ sku, stock_levels: [{ location_id: studio.locationId, stocked_quantity: v.is_available === false ? 0 : STOCK }] }],
      prices: [{ amount: v.price / 100, currency_code: "usd" }], metadata: { supplier: "printify" },
    };
  });
  await createOffersWorkflow(container).run({ input: { offers } });
  return (created as any).id;
}

export async function removePrintifyProduct(container: MedusaContainer, printifyId: string) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const existing = await findProduct(container, printifyId);
  if (!existing) return false;
  const { data: offers } = await query.graph({ entity: "offer", fields: ["id"], filters: { product_id: existing.id } });
  if (offers.length) await deleteOffersWorkflow(container).run({ input: { ids: (offers as any[]).map((o) => o.id) } });
  const inventory = container.resolve(Modules.INVENTORY);
  const items = (await inventory.listInventoryItems({}, { take: 10000 })).filter((i) => i.sku?.startsWith("OF-PFY-") && i.sku.endsWith(printifyId.slice(-6)));
  if (items.length) await inventory.deleteInventoryItems(items.map((i) => i.id));
  await deleteProductsWorkflow(container).run({ input: { ids: [existing.id] } });
  return true;
}

// Tell Printify the publish finished (unlocks the product there) and where it lives.
export async function reportPublished(printifyId: string, mercurId: string) {
  const store = (process.env.SHELBY_STORE_URL || "https://web-production-444e2901.up.railway.app").replace(/\/$/, "");
  await printify(shopPath(`/products/${printifyId}/publishing_succeeded.json`), { body: { external: { id: mercurId, handle: `${store}/product/${mercurId}` } } });
}
export async function reportPublishFailed(printifyId: string, reason: string) {
  await printify(shopPath(`/products/${printifyId}/publishing_failed.json`), { body: { reason: reason.slice(0, 250) } }).catch(() => {});
}

// Full sync: every product in the Printify store that is published there (or waiting to be).
export async function syncAllPrintifyProducts(container: MedusaContainer, opts: { report?: boolean; recreate?: boolean } = {}) {
  const report = opts.report !== false;
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const out = { imported: 0, failed: [] as string[] };
  for (let page = 1; ; page++) {
    const r = await printify<{ data: (PrintifyProduct & { external?: { id?: string } })[]; last_page: number }>(shopPath(`/products.json?limit=50&page=${page}`));
    for (const p of r.data) {
      if (!p.visible || (!p.is_locked && !p.external?.id)) continue; // drafts never published from Printify
      try { if (opts.recreate) await removePrintifyProduct(container, p.id); const id = await upsertPrintifyProduct(container, p); if (report) await reportPublished(p.id, id); out.imported++; }
      catch (e) { out.failed.push(`${p.title}: ${(e as Error).message}`); logger.warn(`[printify] ${p.title}: ${(e as Error).message}`); if (report && p.is_locked) await reportPublishFailed(p.id, (e as Error).message); }
    }
    if (page >= r.last_page) break;
  }
  return out;
}
