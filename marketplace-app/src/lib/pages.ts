// Funnel pages (the store's 7 page types): Home, Product, Offer, Listicle, Advertorial, Quiz result,
// Cart/Checkout. Offer, listicle and advertorial content lives in src/data/pages.json and refers to
// products by title, so the pages follow the live catalogue: a missing product is skipped, and a
// page left with no products is treated as not found (e.g. after the demo content is removed).
import raw from '@/data/pages.json';
import { products, type Product } from './data';
import { NICHES, type Niche } from './niches';

type FAQ = { q: string; a: string };
export type OfferPage = { slug: string; niche: Niche; kicker: string; title: string; sub: string; image: string; products: string[]; bullets: string[]; guarantee: string; faq: FAQ[] };
export type ListiclePage = { slug: string; niche: Niche; title: string; intro: string; items: { title: string; body: string; product?: string }[]; cta: { label: string; to: string } };
export type AdvertorialPage = { slug: string; niche: Niche; kicker: string; title: string; dek: string; sections: { h?: string; p: string; product?: string }[]; cta: { label: string; to: string } };
export type PageType = 'offer' | 'listicle' | 'advertorial';

const data = raw as unknown as { offers: OfferPage[]; listicles: ListiclePage[]; advertorials: AdvertorialPage[] };

export const byTitle = (title?: string): Product | undefined => (title ? products.find(p => p.title === title) : undefined);
const anyLive = (titles: (string | undefined)[]) => titles.some(t => byTitle(t));

export const offerPage = (slug: string) => data.offers.find(o => o.slug === slug && anyLive(o.products));
export const listiclePage = (slug: string) => data.listicles.find(l => l.slug === slug && anyLive(l.items.map(i => i.product)));
export const advertorialPage = (slug: string) => data.advertorials.find(a => a.slug === slug && anyLive(a.sections.map(s => s.product)));
export const offerProducts = (o: OfferPage) => o.products.map(byTitle).filter((p): p is Product => !!p);

// Everything currently live, for the Home "Guides and sets" rail.
export function livePages() {
  return [
    ...data.offers.filter(o => anyLive(o.products)).map(o => ({ type: 'offer' as const, slug: o.slug, niche: o.niche, title: o.title, kicker: o.kicker, image: byTitle(o.image)?.image ?? offerProducts(o)[0]?.image, href: `/offer/${o.slug}` })),
    ...data.listicles.filter(l => anyLive(l.items.map(i => i.product))).map(l => ({ type: 'listicle' as const, slug: l.slug, niche: l.niche, title: l.title, kicker: 'Guide', image: byTitle(l.items.find(i => byTitle(i.product))?.product)?.image, href: `/list/${l.slug}` })),
    ...data.advertorials.filter(a => anyLive(a.sections.map(s => s.product))).map(a => ({ type: 'advertorial' as const, slug: a.slug, niche: a.niche, title: a.title, kicker: 'Story', image: byTitle(a.sections.find(s => byTitle(s.product))?.product)?.image, href: `/story/${a.slug}` })),
  ];
}

export const disclaimerFor = (niche: Niche) => NICHES[niche]?.disclaimer;
