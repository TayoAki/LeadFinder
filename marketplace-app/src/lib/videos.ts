// Shoppable videos: each clip is tied to one product in the live catalogue (matched by title, so
// it works with the Mercur catalogue and the built-in one). Clips live in public/videos today;
// sellers' own uploads replace them later (a `videos` list in the product's metadata).
import raw from '@/data/videos.json';
import { absolute } from './api';
import { getProduct, Product, products } from './data';

export type ShopVideo = { id: string; src: string; poster: string; caption: string; product: Product };

export function shopVideos(): ShopVideo[] {
  return raw.flatMap(v => {
    const product = products.find(p => p.title === v.title) ?? getProduct(v.productId);
    return product ? [{ id: v.id, src: absolute(v.src), poster: absolute(v.poster), caption: v.caption, product }] : [];
  });
}

export const videoForProduct = (productId: string) => shopVideos().find(v => v.product.id === productId);
