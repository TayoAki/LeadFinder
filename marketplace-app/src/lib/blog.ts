// Catalogue blog client: posts generated for every Printify blueprint, served by the Shelby server
// (server/blog). The hand-written posts in src/data/pages.json stay local; these are fetched on demand.
import { api } from './api';
import { products, type Product } from './data';

export type Block = { h: string; p?: string; bullets?: string[]; table?: { head: string[]; rows: string[][] } };
export type PostSummary = { type: 'listicle' | 'advertorial'; slug: string; category: string; title: string; image: string | null; description: string; product_name: string; blueprint_id: number; href: string };
export type CatalogPost = PostSummary & {
  seo_title: string; intro?: string[]; dek?: string; kicker?: string; items?: Block[]; sections?: Block[];
  faq: { q: string; a: string }[]; mins: number; related: PostSummary[]; sibling: PostSummary | null; product_title: string;
};
export type PostList = { total: number; page: number; pages: number; posts: PostSummary[]; categories: { name: string; count: number }[] };

export const fetchPost = (slug: string) => api<CatalogPost>(`/api/blog/post/${encodeURIComponent(slug)}`);
export const fetchPosts = (o: { category?: string; q?: string; page?: number }) =>
  api<PostList>(`/api/blog/posts?${new URLSearchParams({ category: o.category ?? '', q: o.q ?? '', page: String(o.page ?? 1) })}`);

// A store product printed on this blueprint, if Shelby sells one.
export const productForBlueprint = (id: number): Product | undefined => products.find(p => p.blueprintId === id && p.stock > 0);
// Where "shop" goes when the exact blank isn't sold yet: the closest store category that exists.
const STORE_CAT: Record<string, string> = { 'Hoodies and sweatshirts': 'Apparel', 'T-shirts': 'Apparel', 'Tank tops': 'Apparel', 'Long sleeve tops': 'Apparel', 'Polos and shirts': 'Apparel', 'Bottoms': 'Apparel', 'Dresses': 'Apparel', 'Outerwear': 'Apparel', 'Kids and baby': 'Apparel', 'Swimwear': 'Apparel', 'Mugs and drinkware': 'Home', 'Kitchen and dining': 'Home', 'Wall art': 'Home', 'Home textiles': 'Home', 'Home decor': 'Home', 'Hats': 'Accessories', 'Bags': 'Accessories', 'Phone and tech': 'Accessories', 'Jewelry and accessories': 'Accessories' };
export function shopLinkFor(category: string) {
  const c = STORE_CAT[category];
  return c && products.some(p => p.category === c) ? { label: `Shop ${c.toLowerCase()}`, to: `/search?cat=${encodeURIComponent(c)}` } : { label: 'Shop Shelby', to: '/' };
}
