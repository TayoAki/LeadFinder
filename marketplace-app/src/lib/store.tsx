import { router } from 'expo-router';
import { track } from './analytics';
import { haptic, toast } from './feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BRAND } from './brand';
import type { Goal } from './shelby';
import { getProduct, getShop, Product } from './data';
import { commerce, syncCart } from './commerce';

export type CartLine = { productId: string; size: string | null; qty: number };
export type OrderStatus = 'Paid' | 'Shipped' | 'Out for delivery' | 'Delivered';
export type SellerOrder = { shopId: string; lines: CartLine[]; shipping: number; status: OrderStatus; tracking?: string };
export type Order = { id: string; placedAt: number; total: number; credit: number; sellerOrders: SellerOrder[] };
type User = { name: string; email: string; code: string } | null;
export type SizeGroup = 'clothing' | 'shoes';
export type Address = { name: string; address_1: string; city: string; province: string; postal_code: string };
// Replenishment: remind (and offer one-tap reorder) every `days` days for things that run out.
export type Replenish = { productId: string; size: string | null; days: number; next: number };
export const sizeGroup = (sizes: string[]): SizeGroup | null => (!sizes.length ? null : sizes.every(x => /^\d+(\.\d)?$/.test(x)) ? 'shoes' : 'clothing');

type Store = {
  user: User; signIn: (name?: string) => void; signOut: () => void;
  interests: string[]; setInterests: (v: string[]) => void; onboarded: boolean; setOnboarded: (v: boolean) => void;
  goal: Goal | null; setGoal: (v: Goal | null) => void; budget: number | null; setBudget: (v: number | null) => void;
  cart: CartLine[]; add: (p: Product, size: string | null, qty?: number, opts?: { toast?: string | false }) => void; setQty: (i: number, qty: number) => void; remove: (i: number) => void; clearCart: () => void;
  cartCount: number;
  wishlist: string[]; toggleWish: (id: string) => void;
  following: string[]; toggleFollow: (id: string) => void;
  reminders: string[]; toggleReminder: (id: string) => void;
  credit: number; invitesSent: number; invite: () => void;
  orders: Order[]; placeOrder: (discount: number, guestEmail?: string, tax?: number, id?: string) => Order;
  referredBy: string | null; setReferredBy: (v: string | null) => void;
  notif: 'unknown' | 'granted' | 'denied'; setNotif: (v: 'granted' | 'denied') => void;
  seller: 'none' | 'applied' | 'approved'; setSeller: (v: 'none' | 'applied' | 'approved') => void;
  groups: ReturnType<typeof groupCart>;
  sizes: Partial<Record<SizeGroup, string>>; rememberSize: (sizes: string[], size: string) => void;
  address: Address | null; setAddress: (a: Address) => void;
  stockAlerts: string[]; toggleStockAlert: (productId: string) => void;
  replenish: Replenish[]; setReplenish: (productId: string, size: string | null, days: number | null) => void;
  reorder: (o: Order) => void;
};

const Ctx = createContext<Store | null>(null);
const STATE_KEY = 'shelby_state_v1';

export function groupCart(cart: CartLine[]) {
  const by: Record<string, CartLine[]> = {};
  cart.forEach(l => (by[getProduct(l.productId).shopId] ||= []).push(l));
  return Object.entries(by).map(([shopId, lines]) => {
    const shop = getShop(shopId);
    const subtotal = lines.reduce((n, l) => n + getProduct(l.productId).price * l.qty, 0);
    const shipping = subtotal >= shop.freeOver ? 0 : shop.shipping;
    return { shop, lines, subtotal, shipping, toFree: Math.max(0, shop.freeOver - subtotal) };
  });
}

const pinfo = (id: string) => { const p = getProduct(id); return p ? { product_id: p.id, title: p.title.slice(0, 80), price: p.price, shop_id: p.shopId, category: p.category } : { product_id: id }; };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [onboarded, setOnboarded] = useState(false);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWish] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>(['s1', 's2']);
  const [reminders, setReminders] = useState<string[]>([]);
  const [credit, setCredit] = useState(0);
  const [invitesSent, setInvites] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [referredBy, setReferredBy] = useState<string | null>(null);
  const [notif, setNotif] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [seller, setSeller] = useState<'none' | 'applied' | 'approved'>('approved');
  const [sizes, setSizes] = useState<Partial<Record<SizeGroup, string>>>({});
  const [address, setAddress] = useState<Address | null>(null);
  const [stockAlerts, setStockAlerts] = useState<string[]>([]);
  const [replenish, setReplenishList] = useState<Replenish[]>([]);

  // Persist what a shopper would hate to lose (cart, sizes, saves, address, onboarding) across launches.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(STATE_KEY).then(raw => {
      const s = raw ? JSON.parse(raw) : {};
      if (s.user) setUser(s.user); if (s.interests) setInterests(s.interests); if (s.onboarded) setOnboarded(true);
      if (s.goal) setGoal(s.goal); if (s.budget) setBudget(s.budget);
      if (s.cart) setCart(s.cart.filter((l: CartLine) => getProduct(l.productId)));
      if (s.wishlist) setWish(s.wishlist); if (s.following) setFollowing(s.following); if (s.reminders) setReminders(s.reminders);
      if (s.credit) setCredit(s.credit); if (s.orders) setOrders(s.orders); if (s.notif) setNotif(s.notif);
      if (s.sizes) setSizes(s.sizes); if (s.address) setAddress(s.address); if (s.stockAlerts) setStockAlerts(s.stockAlerts); if (s.replenish) setReplenishList(s.replenish);
    }).catch(() => {}).finally(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => AsyncStorage.setItem(STATE_KEY, JSON.stringify({ user, interests, onboarded, goal, budget, cart, wishlist, following, reminders, credit, orders: orders.slice(0, 30), notif, sizes, address, stockAlerts, replenish })).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [hydrated, user, interests, onboarded, goal, budget, cart, wishlist, following, reminders, credit, orders, notif, sizes, address, stockAlerts, replenish]);
  // Live cart: mirror the cart to Mercur in the background so checkout starts almost done.
  useEffect(() => {
    if (!hydrated || !commerce()) return;
    const t = setTimeout(() => syncCart(cart.map(l => ({ productId: l.productId, size: l.size, qty: l.qty }))), 400);
    return () => clearTimeout(t);
  }, [hydrated, cart]);
  // Toggles report on/off so wishlist, follows and drop reminders are all measurable.
  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, list: string[], event: string, info: (id: string) => Record<string, any>) => (id: string) => {
    const on = !list.includes(id);
    track(event, { ...info(id), on });
    haptic(on ? 'add' : 'select');
    if (on && event === 'wishlist_toggle') toast({ text: 'Saved to your wishlist', icon: 'heart', action: { label: 'View', onPress: () => router.push('/wishlist') } });
    if (on && event === 'follow_toggle') toast({ text: 'Following. New drops show up in your feed.', icon: 'storefront' });
    if (on && event === 'drop_reminder_toggle') toast({ text: "We'll remind you before it drops", icon: 'notifications' });
    set(v => (v.includes(id) ? v.filter(x => x !== id) : [...v, id]));
  };

  const value = useMemo<Store>(() => {
    const groups = groupCart(cart);
    return {
      user,
      signIn: (name = 'Taylor') => { track('sign_in'); setUser({ name, email: `${name.toLowerCase()}@example.com`, code: `${name.toUpperCase()}10` }); setCredit(c => c + BRAND.firstOrderOff); },
      signOut: () => { track('sign_out'); setUser(null); },
      interests, setInterests, onboarded, setOnboarded, goal, setGoal, budget, setBudget,
      cart,
      add: (p, size, qty = 1, opts) => { haptic('add'); if (opts?.toast !== false) toast({ text: opts?.toast ?? `Added ${p.title.length > 28 ? 'to cart' : `${p.title} to cart`}`, icon: 'bag-check', action: { label: 'View cart', onPress: () => router.push('/cart') } }); track('add_to_cart', { ...pinfo(p.id), size, qty, cart_items: cart.length + 1 }); setCart(c => {
        const i = c.findIndex(l => l.productId === p.id && l.size === size);
        if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: Math.min(p.stock, l.qty + qty) } : l));
        return [...c, { productId: p.id, size, qty }];
      }); },
      setQty: (i, qty) => { if (cart[i]) track('cart_qty_change', { ...pinfo(cart[i].productId), from: cart[i].qty, to: qty }); setCart(c => c.map((l, j) => (j === i ? { ...l, qty: Math.max(1, Math.min(getProduct(l.productId).stock, qty)) } : l))); },
      remove: i => { haptic('tap'); if (cart[i]) track('remove_from_cart', pinfo(cart[i].productId)); setCart(c => c.filter((_, j) => j !== i)); },
      clearCart: () => setCart([]),
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      wishlist, toggleWish: toggle(setWish, wishlist, 'wishlist_toggle', pinfo),
      following, toggleFollow: toggle(setFollowing, following, 'follow_toggle', id => ({ shop_id: id })),
      reminders, toggleReminder: toggle(setReminders, reminders, 'drop_reminder_toggle', id => ({ drop_id: id })),
      credit, invitesSent, invite: () => { track('invite_sent', { total: invitesSent + 1 }); setInvites(n => n + 1); },
      orders,
      referredBy, setReferredBy, notif, setNotif, seller, setSeller,
      placeOrder: (discount, guestEmail, tax = 0, serverId) => {
        const items = groups.reduce((n, g) => n + g.subtotal + g.shipping, 0);
        const used = Math.min(discount, items);
        const order: Order = {
          id: serverId ?? `${Math.floor(100000 + Math.random() * 899999)}`, placedAt: Date.now(), total: Math.round((items + tax - used) * 100) / 100, credit: used,
          sellerOrders: groups.map(g => ({ shopId: g.shop.id, lines: g.lines, shipping: g.shipping, status: 'Paid' as OrderStatus })), // tracking arrives when the shop ships
        };
        haptic('success');
        track('order_placed', { order_id: order.id, total: order.total, credit_used: used, sellers: order.sellerOrders.length, items: cart.reduce((n, l) => n + l.qty, 0), referred: !!referredBy, guest: !user });
        for (const l of cart) track('purchase_item', { ...pinfo(l.productId), qty: l.qty, size: l.size ?? '', order_id: order.id });
        setOrders(o => [order, ...o]); setCredit(c => Math.max(0, c - used)); setReferredBy(null); setCart([]);
        if (guestEmail && !user) setUser({ name: guestEmail.split('@')[0], email: guestEmail, code: 'FRIEND10' });
        return order;
      },
      groups,
      sizes, rememberSize: (all, size) => { const g = sizeGroup(all); if (g) setSizes(x => ({ ...x, [g]: size })); },
      address, setAddress,
      stockAlerts, toggleStockAlert: id => {
        const on = !stockAlerts.includes(id); haptic(on ? 'add' : 'select'); track('stock_alert_toggle', { ...pinfo(id), on });
        if (on) toast({ text: "We'll tell you the moment it's back", icon: 'notifications' });
        setStockAlerts(v => (on ? [...v, id] : v.filter(x => x !== id)));
      },
      replenish, setReplenish: (productId, size, days) => {
        track('replenish_set', { ...pinfo(productId), days: days ?? 0 });
        setReplenishList(v => [...v.filter(r => r.productId !== productId), ...(days ? [{ productId, size, days, next: Date.now() + days * 864e5 }] : [])]);
        if (days) { haptic('add'); toast({ text: `We'll remind you to reorder every ${days} days`, icon: 'repeat' }); }
      },
      reorder: o => {
        const lines = o.sellerOrders.flatMap(so => so.lines).filter(l => (getProduct(l.productId)?.stock ?? 0) > 0);
        track('reorder', { order_id: o.id, items: lines.length });
        setCart(c => [...c, ...lines]); haptic('add');
        toast({ text: lines.length ? `Added ${lines.length} item${lines.length > 1 ? 's' : ''} to your cart` : 'Those items are sold out right now', icon: 'repeat', action: lines.length ? { label: 'View cart', onPress: () => router.push('/cart') } : undefined });
      },
    };
  }, [user, interests, onboarded, goal, budget, cart, wishlist, following, reminders, credit, invitesSent, orders, referredBy, notif, seller, sizes, address, stockAlerts, replenish]);

  if (!hydrated) return null; // a few ms: the catalogue splash is still up
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
};
