import { getShop, shopProducts } from './data';

// The signed-in seller's own shop for the prototype.
export const MY_SHOP = 's5';
export const myShop = () => getShop(MY_SHOP);
export const myProducts = () => shopProducts(MY_SHOP);

export type SellerOrderRow = { id: string; buyer: string; city: string; productId: string; size: string | null; qty: number; total: number; status: 'To ship' | 'Shipped' | 'Delivered'; placed: string; source: 'App' | 'Your link' | 'Drop' };
export const sellerOrders = (): SellerOrderRow[] => {
  const ps = myProducts();
  return [
    { id: '481203', buyer: 'Maya L.', city: 'Austin, TX', productId: ps[0].id, size: null, qty: 2, total: ps[0].price * 2, status: 'To ship', placed: '12 min ago', source: 'Your link' },
    { id: '481177', buyer: 'Jordan P.', city: 'Denver, CO', productId: ps[2].id, size: null, qty: 1, total: ps[2].price, status: 'To ship', placed: '1 hr ago', source: 'App' },
    { id: '481102', buyer: 'Priya S.', city: 'Seattle, WA', productId: ps[4].id, size: null, qty: 1, total: ps[4].price, status: 'To ship', placed: '3 hr ago', source: 'Drop' },
    { id: '480951', buyer: 'Chris D.', city: 'Raleigh, NC', productId: ps[1].id, size: null, qty: 3, total: ps[1].price * 3, status: 'Shipped', placed: 'Yesterday', source: 'Your link' },
    { id: '480812', buyer: 'Ana R.', city: 'Miami, FL', productId: ps[3].id, size: null, qty: 1, total: ps[3].price, status: 'Delivered', placed: '3 days ago', source: 'App' },
  ];
};

export const salesWeek = [
  { day: 'Mon', usd: 142 }, { day: 'Tue', usd: 96 }, { day: 'Wed', usd: 210 }, { day: 'Thu', usd: 188 },
  { day: 'Fri', usd: 264 }, { day: 'Sat', usd: 318 }, { day: 'Sun', usd: 231 },
];
