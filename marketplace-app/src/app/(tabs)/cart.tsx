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
import { C, R, S, T } from '@/lib/theme';
import { unlockShipping } from '@/lib/upsell';
import { track } from '@/lib/analytics';

export default function Cart() {
  const { width } = useWindowDimensions();
  const { cart, groups, setQty, remove, user, credit, referredBy, add } = useStore();
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
      <Header title={`Cart · ${groups.length} ${groups.length === 1 ? 'shop' : 'shops'}`} />
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 200, gap: S.lg }}>
        {groups.map(g => (
          <View key={g.shop.id} style={{ backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, padding: S.lg }}>
            <Pressable onPress={() => router.push(`/shop/${g.shop.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: g.shop.logo }} style={{ width: 32, height: 32, borderRadius: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={T.h3}>{g.shop.name}</Text>
                <Text style={T.small}>Ships in {g.shop.shipsIn}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.ink3} />
            </Pressable>
            {/* Free-shipping progress per seller: nudges a bigger basket at each shop */}
            <View style={{ marginTop: S.md, padding: 10, backgroundColor: g.toFree ? C.warnSoft : C.goodSoft, borderRadius: R.md }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: g.toFree ? C.warn : C.good }}>
                {g.toFree ? `Add ${money(g.toFree)} from ${g.shop.name} for free shipping` : `Free shipping from ${g.shop.name} unlocked`}
              </Text>
              <View style={{ height: 6, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 3, marginTop: 6 }}>
                <View style={{ height: 6, borderRadius: 3, width: `${Math.min(100, (g.subtotal / g.shop.freeOver) * 100)}%`, backgroundColor: g.toFree ? C.warn : C.good }} />
              </View>
              {g.toFree > 0 && unlockShipping(g.shop.id, g.toFree, g.lines.map(l => l.productId)).length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 8 }}>
                  {unlockShipping(g.shop.id, g.toFree, g.lines.map(l => l.productId)).map(x => (
                    <Pressable key={x.id} onPress={() => { track('upsell_add', { source: 'unlock_shipping', product_id: x.id }); add(x, null, 1, { toast: 'Added · free shipping unlocked' }); }} accessibilityRole="button" accessibilityLabel={`Add ${x.title}, ${money(x.price)}`}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderRadius: R.md, padding: 6, paddingRight: 10, borderWidth: 1, borderColor: C.line }}>
                      <Image source={{ uri: x.image }} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: C.photo }} />
                      <View><Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '700', maxWidth: 120 }}>{x.title}</Text><Text style={{ fontSize: 12, color: C.ink2 }}>+ {money(x.price)}</Text></View>
                      <Ionicons name="add-circle" size={22} color={C.ink} />
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
            {g.lines.map(l => {
              const i = cart.indexOf(l);
              const p = getProduct(l.productId);
              return (
                <View key={`${l.productId}-${l.size}`} style={{ flexDirection: 'row', gap: 12, marginTop: S.lg }}>
                  <Pressable onPress={() => router.push(`/product/${p.id}`)}><Image source={{ uri: p.image }} style={{ width: 76, height: 86, borderRadius: R.md, backgroundColor: '#F1ECE4' }} /></Pressable>
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
              <Text style={T.small}>Shipping from {g.shop.name}</Text>
              <Text style={{ fontWeight: '700', color: g.shipping ? C.ink : C.good }}>{g.shipping ? money(g.shipping) : 'Free'}</Text>
            </View>
          </View>
        ))}
        <TrustLine />
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={T.small}>Items {money(items)} · Shipping {shipping ? money(shipping) : 'free'}</Text>
          <Text style={{ fontWeight: '900', fontSize: 18 }}>{money(total)}</Text>
        </View>
        {pendingCredit > 0 && <Text style={{ color: C.good, fontWeight: '700', fontSize: 12, marginTop: 2 }}>{money(Math.min(pendingCredit, total))} credit applied at checkout</Text>}
        <Button title="Checkout" kind="buy" icon="lock-closed" style={{ marginTop: S.md }} onPress={() => router.push('/checkout')} />
        {!user && <Text style={{ textAlign: 'center', color: C.ink3, fontSize: 12, marginTop: 6 }}>No account needed. Pay with Apple Pay as a guest.</Text>}
      </View>
    </SafeAreaView>
  );
}
