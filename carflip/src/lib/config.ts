// The method follows the reference car-flipping article. Every number here is an assumption or a
// policy, never a fact about a car, and each one is reported alongside the results it affects.

const num = (v: string | undefined, d: number) => (v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : d);

export const config = {
  /** Step 2: rank by raw dollar gap (KBB value - asking), as in the article. */
  rankBy: "dollar_gap" as const,
  /** Step 2: which KBB figure is used as "value". The actor returns KBB's Fair Purchase Price. */
  valueType: "kbb_fair_purchase_price",
  /** Step 3: how many of the ranked cars get a photo and description review. */
  topForReview: num(process.env.CARFLIP_TOP_REVIEW, 10),
  /**
   * Step 4: opening offer as a share of asking. The article's examples were $3,700 on $4,500 (82%) and
   * $5,200 on $6,500 (80%); they don't establish a universal rule, so this is a configurable policy.
   */
  openingOfferPct: num(process.env.CARFLIP_OPENING_PCT, 0.8),
  /** Step 4: optional ceiling as a share of KBB value. Unset means counters are recorded but never accepted. */
  offerCeilingPctOfValue: process.env.CARFLIP_CEILING_PCT ? num(process.env.CARFLIP_CEILING_PCT, 0) : null as number | null,
  /** Step 5: the article's simplified tax: 6.25% of purchase price. An example assumption, not a tax determination. */
  taxRate: num(process.env.CARFLIP_TAX_RATE, 0.0625),
  taxBase: "purchase_price" as const,
  /** Step 5: costs the model never assumes. They are listed as unprovided unless a figure is supplied. */
  unprovidedCostNames: ["title and registration fees", "detailing and reconditioning beyond supplied repairs", "listing or marketplace fees",
    "transport to and from the car", "pre-purchase mechanical inspection", "insurance while held"],
};

export type Config = typeof config;
