// Building blocks shared by the funnel pages (offer, listicle, advertorial, quiz result).
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { track } from '@/lib/analytics';
import { money, type Product } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { Button, Price } from './ui';

// One product inline in an article or offer: tap opens it; Add adds it (sized items open the page).
export function ProductRow({ p, source }: { p: Product; source: string }) {
  const { add } = useStore();
  const sized = p.sizes.length > 0;
  return (
    <Pressable onPress={() => { track('page_product_open', { source, product_id: p.id }); router.push(`/product/${p.id}`); }} accessibilityRole="button" accessibilityLabel={`${p.title}, ${money(p.price)}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, marginTop: S.md }}>
      <Image source={{ uri: p.image }} style={{ width: 64, height: 64, borderRadius: R.md, backgroundColor: C.photo }} />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={2} style={T.h3}>{p.title}</Text>
        <Price price={p.price} compareAt={p.compareAt} size={14} />
      </View>
      {p.stock > 0 ? (
        <Pressable onPress={() => { if (sized) { router.push(`/product/${p.id}`); return; } track('page_add', { source, product_id: p.id }); add(p, null, 1); }} accessibilityRole="button" accessibilityLabel={sized ? `Choose a size for ${p.title}` : `Add ${p.title} to cart`} hitSlop={6}
          style={{ height: 38, paddingHorizontal: 14, borderRadius: R.pill, backgroundColor: C.buy, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.buyInk, fontWeight: '800' }}>{sized ? 'Choose size' : 'Add'}</Text>
        </Pressable>
      ) : <Text style={[T.small, { fontWeight: '700' }]}>Sold out</Text>}
    </Pressable>
  );
}

// Fixed buy bar at the bottom of a page.
export function StickyCTA({ label, onPress, note, icon = 'bag-add' }: { label: string; onPress: () => void; note?: string; icon?: any }) {
  return (
    <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line, paddingHorizontal: S.lg, paddingTop: S.md, paddingBottom: S.md }}>
      <Button title={label} kind="buy" icon={icon} onPress={onPress} />
      {!!note && <Text style={[T.small, { textAlign: 'center', marginTop: 6 }]}>{note}</Text>}
    </SafeAreaView>
  );
}

export function Disclaimer({ text }: { text?: string }) {
  if (!text) return null;
  return <Text style={[T.tiny, { color: C.ink3, marginTop: S.lg, lineHeight: 16, fontWeight: '400' }]}>{text}</Text>;
}

export function Guarantee({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: S.md, borderRadius: R.lg, backgroundColor: C.goodSoft, marginTop: S.lg }}>
      <Ionicons name="shield-checkmark" size={22} color={C.good} />
      <Text style={{ flex: 1, color: C.good, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}

export function PageNotFound() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: S.xl, gap: S.md }}>
      <Ionicons name="search" size={40} color={C.ink3} />
      <Text style={T.h2}>This page isn't available</Text>
      <Text style={[T.body, { color: C.ink2, textAlign: 'center' }]}>The products it featured are no longer in the store.</Text>
      <Button title="Go to the store" kind="primary" onPress={() => router.replace('/')} />
    </SafeAreaView>
  );
}
