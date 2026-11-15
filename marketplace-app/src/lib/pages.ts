// Funnel and blog pages (the store's 7 page types): Home, Product, Offer, Listicle, Advertorial,
// Quiz result, Cart/Checkout. Offer, listicle and advertorial content lives in src/data/pages.json.
//
// A product slot in a page is either a fixed product (`product`: exact title) or a category pick
// (`pick`: n, the nth best product in the page's `category`, best = in stock, then most bought).
// Category posts therefore follow the live catalogue: publish a new product in Printify and the
// posts in its category start featuring it. A page whose slots are all empty is treated as not
// found and left off Home and /blog, so nothing ever links to an empty page.
import raw from '@/data/pages.json';
import { products, type Product } from './data';
import { NICHES, type Niche } from './niches';

type FAQ = { q: string; a: string };
type Slot = { product?: string; pick?: number };
export type OfferPage = { slug: string; niche: Niche; kicker: string; title: string; sub: string; image: string; products: string[]; bullets: string[]; guarantee: string; faq: FAQ[] };
export type ListiclePage = { slug: string; niche: Niche; category?: string; title: string; intro: string; items: ({ title: string; body: string } & Slot)[]; cta: { label: string; to: string } };
export type AdvertorialPage = { slug: string; niche: Niche; category?: string; kicker: string; title: string; dek: string; sections: ({ h?: string; p: string } & Slot)[]; cta: { label: string; to: string } };
export type PageType = 'offer' | 'listicle' | 'advertorial';

const data = raw as unknown as { offers: OfferPage[]; listicles: ListiclePage[]; advertorials: AdvertorialPage[] };

export const byTitle = (title?: string): Product | undefined => (title ? products.find(p => p.title === title) : undefined);
// Products in a category, best first: in stock, then most bought (real purchases), then newest.
export const inCategory = (category: string) =>
  products.filter(p => p.category === category).sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || b.sold - a.sold);
// A slot's product: the named one, or the category pick (no product shown twice on a page).
export function slotProduct(page: { category?: string }, slot: Slot): Product | undefined {
  if (slot.product) return byTitle(slot.product);
  if (page.category && slot.pick != null) return inCategory(page.category)[slot.pick];
  return undefined;
}
const anyLive = (page: { category?: string }, slots: Slot[]) => slots.some(s => slotProduct(page, s));

export const offerPage = (slug: string) => data.offers.find(o => o.slug === slug && o.products.some(t => byTitle(t)));
export const listiclePage = (slug: string) => data.listicles.find(l => l.slug === slug && anyLive(l, l.items));
export const advertorialPage = (slug: string) => data.advertorials.find(a => a.slug === slug && anyLive(a, a.sections));
export const offerProducts = (o: OfferPage) => o.products.map(byTitle).filter((p): p is Product => !!p);

// Rough reading time for the blog list (about 200 words a minute).
const minutes = (texts: string[]) => Math.max(1, Math.round(texts.join(' ').split(/\s+/).length / 200));

export type LivePage = { type: PageType; slug: string; niche: Niche; category?: string; title: string; kicker: string; image?: string; href: string; dek: string; mins: number };
// Everything currently live, for the Home "Sets and guides" rail and the /blog index.
export function livePages(): LivePage[] {
  const first = (page: { category?: string }, slots: Slot[]) => slots.map(s => slotProduct(page, s)).find(Boolean)?.image;
  return [
    ...data.offers.filter(o => o.products.some(t => byTitle(t))).map(o => ({ type: 'offer' as const, slug: o.slug, niche: o.niche, title: o.title, kicker: o.kicker, image: byTitle(o.image)?.image ?? offerProducts(o)[0]?.image, href: `/offer/${o.slug}`, dek: o.sub, mins: 1 })),
    ...data.listicles.filter(l => anyLive(l, l.items)).map(l => ({ type: 'listicle' as const, slug: l.slug, niche: l.niche, category: l.category, title: l.title, kicker: 'Guide', image: first(l, l.items), href: `/list/${l.slug}`, dek: l.intro, mins: minutes([l.intro, ...l.items.map(i => `${i.title} ${i.body}`)]) })),
    ...data.advertorials.filter(a => anyLive(a, a.sections)).map(a => ({ type: 'advertorial' as const, slug: a.slug, niche: a.niche, category: a.category, title: a.title, kicker: 'Story', image: first(a, a.sections), href: `/story/${a.slug}`, dek: a.dek, mins: minutes([a.dek, ...a.sections.map(s => `${s.h ?? ''} ${s.p}`)]) })),
  ];
}
// Blog posts only (guides and stories), newest content first as listed in pages.json.
export const blogPosts = () => livePages().filter(p => p.type !== 'offer');

export const disclaimerFor = (niche: Niche) => NICHES[niche]?.disclaimer;
