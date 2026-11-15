import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { TrustLine } from '@/components/Logo';
import { ProductGrid } from '@/components/ProductCard';
import { Button, SectionHeader } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { getProduct, money, products } from '@/lib/data';
import { useStore } from '@/lib/store';
import { usePrimeCheckout } from '@/lib/usePrimeCheckout';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';

export default function Cart() {
  const { width } = useWindowDimensions();
  const { cart, groups, setQty, remove, user, credit, referredBy, add } = useStore();
  usePrimeCheckout(); // checkout is ready before they tap Checkout
  const items = groups.reduce((n, g) => n + g.subtotal, 0);
  const shipping = groups.reduce((n, g) => n + g.shipping, 0);
  const pendingCredit = (user ? credit : 0) + (referredBy ? BRAND.referralReward : 0);
  const total = items + shipping;

  if (!cart.length) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
        <Header title="Cart" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ alignItems: 'center', padding: S.xxl }}>
            <Ionicons name="bag-handle-outline" size={48} color={C.ink3} />
            <Text style={[T.h2, { marginTop: 12 }]}>Your cart is empty</Text>
            <Text style={[T.small, { textAlign: 'center', marginTop: 6 }]}>Mix items from any shops. You'll check out once.</Text>
            <Button title="Start shopping" style={{ marginTop: S.lg }} onPress={() => router.push('/')} />
          </View>
          <SectionHeader title="You might like" />
          <ProductGrid items={[...products].sort((a, b) => b.sold - a.sold).slice(0, 4)} width={width} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={`Cart · ${cart.reduce((n, l) => n + l.qty, 0)} ${cart.reduce((n, l) => n + l.qty, 0) === 1 ? 'item' : 'items'}`} />
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 200, gap: S.lg }}>
        {/* One store, one order. Items may ship from more than one warehouse (see the note below). */}
        <View style={{ backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg, paddingTop: 0 }}>
            {cart.map(l => {
              const i = cart.indexOf(l);
              const p = getProduct(l.productId);
              return (
                <View key={`${l.productId}-${l.size}`} style={{ flexDirection: 'row', gap: 12, marginTop: S.lg }}>
                  <Pressable onPress={() => router.push(`/product/${p.id}`)}><Image source={{ uri: p.image }} style={{ width: 76, height: 86, borderRadius: R.md, backgroundColor: '#F7EEE5' }} /></Pressable>
                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} style={{ fontWeight: '700', color: C.ink }}>{p.title}</Text>
                    {l.size && <Text style={T.small}>Size {l.size}</Text>}
                    {p.stock <= 5 && <Text style={{ fontSize: 12, color: C.sale, fontWeight: '700', marginTop: 2 }}>Only {p.stock} left</Text>}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: R.pill }}>
                        <Pressable onPress={() => (l.qty === 1 ? remove(i) : setQty(i, l.qty - 1))} accessibilityLabel="Decrease quantity" style={{ padding: 8 }}><Ionicons name={l.qty === 1 ? 'trash-outline' : 'remove'} size={16} color={C.ink} /></Pressable>
                        <Text style={{ minWidth: 20, textAlign: 'center', fontWeight: '800' }}>{l.qty}</Text>
                        <Pressable onPress={() => setQty(i, l.qty + 1)} disabled={l.qty >= p.stock} accessibilityLabel="Increase quantity" style={{ padding: 8, opacity: l.qty >= p.stock ? 0.3 : 1 }}><Ionicons name="add" size={16} color={C.ink} /></Pressable>
                      </View>
                      <Text style={{ fontWeight: '800' }}>{money(p.price * l.qty)}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: S.lg, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line }}>
              <Text style={T.small}>Shipping{groups.length > 1 ? ` · arrives in ${groups.length} packages` : ''}</Text>
              <Text style={{ fontWeight: '700', color: shipping ? C.ink : C.good }}>{shipping ? money(shipping) : 'Free'}</Text>
            </View>
          </View>
        <TrustLine />
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={T.small}>Items {money(items)} · Shipping {shipping ? money(shipping) : 'free'}</Text>
          <Text style={{ fontWeight: '900', fontSize: 18 }}>{money(total)}</Text>
        </View>
        {pendingCredit > 0 && <Text style={{ color: C.good, fontWeight: '700', fontSize: 12, marginTop: 2 }}>{money(Math.min(pendingCredit, total))} credit applied at checkout</Text>}
        <Button title="Checkout" kind="buy" icon="lock-closed" style={{ marginTop: S.md }} onPress={() => router.push('/checkout')} />
        {!user && <Text style={{ textAlign: 'center', color: C.ink3, fontSize: 12, marginTop: 6 }}>No account needed. Check out as a guest.</Text>}
      </View>
    </SafeAreaView>
  );
}
