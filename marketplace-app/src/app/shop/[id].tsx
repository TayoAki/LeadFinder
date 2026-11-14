import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from '@/components/ProductCard';
import { Chip, IconButton, Stars } from '@/components/ui';
import { compact, drops, getShop, money, shopProducts, shopSold } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';

export default function ShopPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const s = getShop(id);
  useEffect(() => { if (s) track('shop_view', { shop_id: s.id, shop: s.name, category: s.category }); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const { following, toggleFollow, cartCount } = useStore();
  const [tab, setTab] = useState<'Shop' | 'Reviews' | 'About'>('Shop');
  const followed = following.includes(s.id);
  const items = shopProducts(s.id);
  const drop = drops.find(d => d.shopId === s.id);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          <Image source={{ uri: s.banner }} style={{ width, height: 170, backgroundColor: '#E9E1D6' }} resizeMode="cover" />
          <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.md }}>
            <IconButton name="chevron-back" label="Back" bg="rgba(255,255,255,0.92)" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton name="share-outline" label="Share shop" bg="rgba(255,255,255,0.92)" onPress={() => router.push({ pathname: '/share', params: { kind: 'shop', id: s.id } })} />
              <IconButton name="bag-outline" label="Cart" badge={cartCount} bg="rgba(255,255,255,0.92)" onPress={() => router.push('/cart')} />
            </View>
          </SafeAreaView>
        </View>
        <View style={{ paddingHorizontal: S.lg, marginTop: -36 }}>
          <Image source={{ uri: s.logo }} style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: C.bg, backgroundColor: '#eee' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Text style={T.h1}>{s.name}</Text>
            <Ionicons name="checkmark-circle" size={20} color={C.good} accessibilityLabel="Verified seller" />
          </View>
          <Text style={[T.body, { color: C.ink2 }]}>{s.tagline}</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 10, alignItems: 'center' }}>
            <Stars value={s.rating} size={13} />
            <Text style={T.small}><Text style={{ fontWeight: '800', color: C.ink }}>{compact(s.followers + (followed ? 1 : 0))}</Text> followers</Text>
            <Text style={T.small}><Text style={{ fontWeight: '800', color: C.ink }}>{compact(shopSold(s.id))}</Text> sold</Text>
            <Text style={T.small}>Ships in {s.shipsIn}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: S.lg }}>
            <Pressable onPress={() => toggleFollow(s.id)} accessibilityRole="button" style={{ flex: 1, height: 44, borderRadius: R.pill, backgroundColor: followed ? C.surface : C.ink, borderWidth: 1, borderColor: followed ? C.line : C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Ionicons name={followed ? 'checkmark' : 'add'} size={18} color={followed ? C.ink : '#fff'} />
              <Text style={{ color: followed ? C.ink : '#fff', fontWeight: '800' }}>{followed ? 'Following' : 'Follow for new drops'}</Text>
            </Pressable>
            <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'shop', id: s.id } })} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Share shop">
              <Ionicons name="paper-plane-outline" size={18} color={C.ink} />
            </Pressable>
          </View>
          <View style={{ marginTop: S.md, padding: 10, borderRadius: R.md, backgroundColor: C.goodSoft, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Ionicons name="cube-outline" size={16} color={C.good} />
            <Text style={{ color: C.good, fontWeight: '700', fontSize: 13 }}>Free shipping on orders over {money(s.freeOver)}</Text>
          </View>
          {drop && (
            <Pressable onPress={() => router.push('/drops')} style={{ marginTop: S.md, padding: S.md, borderRadius: R.md, backgroundColor: C.dark, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Ionicons name="flash" size={16} color={C.accent} />
              <Text style={{ color: '#fff', fontWeight: '700', flex: 1 }}>Upcoming drop: {drop.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </Pressable>
          )}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: S.lg, marginBottom: S.lg }}>
            {(['Shop', 'Reviews', 'About'] as const).map(t => <Chip key={t} label={t === 'Shop' ? `Shop · ${items.length}` : t} active={tab === t} onPress={() => setTab(t)} />)}
          </View>
        </View>
        {tab === 'Shop' && <ProductGrid items={items} width={width} />}
        {tab === 'Reviews' && (
          <View style={{ paddingHorizontal: S.lg, gap: S.md }}>
            {['Packaging was beautiful, felt like a gift.', 'Fast shipping and the owner answered my question in an hour.', 'Third order from this shop. Never disappointed.'].map((t, i) => (
              <View key={i} style={{ padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
                <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(n => <Ionicons key={n} name="star" size={12} color="#F5A524" />)}</View>
                <Text style={{ marginTop: 6 }}>{t}</Text>
              </View>
            ))}
          </View>
        )}
        {tab === 'About' && (
          <View style={{ paddingHorizontal: S.lg, gap: S.md }}>
            <Text style={T.body}>{s.tagline}. Every order is packed by hand by the people who made it.</Text>
            <Text style={T.small}>Returns: 30 days, buyer pays return shipping unless the item arrives damaged.</Text>
            <Text style={T.small}>Shipping: {money(s.shipping)} flat, free over {money(s.freeOver)}. Ships in {s.shipsIn}.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
