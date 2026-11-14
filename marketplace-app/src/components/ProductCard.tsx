import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { compact, getShop, Product } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R } from '@/lib/theme';
import { Pill, Price, Stars } from './ui';

export function ProductCard({ p, width }: { p: Product; width: number }) {
  const { wishlist, toggleWish } = useStore();
  const liked = wishlist.includes(p.id);
  const shop = getShop(p.shopId);
  // The heart sits beside (not inside) the card's pressable, so web never nests two buttons.
  return (
    <View style={{ width }}>
      <Pressable onPress={() => router.push(`/product/${p.id}`)} accessibilityLabel={`${p.title}, ${shop.name}`}
        style={({ pressed }) => ({ width, opacity: pressed ? 0.9 : 1 })}>
        <View style={{ width, height: width * 1.15, borderRadius: R.lg, backgroundColor: '#F1ECE4', overflow: 'hidden' }}>
          <Image source={{ uri: p.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <View style={{ position: 'absolute', left: 8, top: 8, gap: 4 }}>
            {p.stock <= 5 ? <Pill text={`Only ${p.stock} left`} tone="accent" icon="flame" /> : p.sold > 400 ? <Pill text={`${compact(p.sold)} sold`} tone="dark" icon="trending-up" /> : null}
            {!!p.compareAt && <Pill text={`${Math.round((1 - p.price / p.compareAt) * 100)}% off`} tone="good" />}
          </View>
        </View>
        <Text numberOfLines={1} style={{ fontSize: 12, color: C.ink3, marginTop: 8, fontWeight: '600' }}>{shop.name}</Text>
        <Text numberOfLines={1} style={{ fontSize: 14, color: C.ink, fontWeight: '600', marginTop: 1 }}>{p.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Price price={p.price} compareAt={p.compareAt} size={15} />
          <Stars value={p.rating} size={11} count={p.reviews} />
        </View>
      </Pressable>
      <Pressable onPress={() => toggleWish(p.id)} accessibilityRole="button" accessibilityLabel={liked ? 'Remove from wishlist' : 'Save to wishlist'} hitSlop={10}
        style={{ position: 'absolute', right: 8, top: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? C.accent : C.ink} />
      </Pressable>
    </View>
  );
}

export function ProductGrid({ items, width }: { items: Product[]; width: number }) {
  const w = (width - 16 * 2 - 12) / 2;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, rowGap: 20 }}>
      {items.map(p => <ProductCard key={p.id} p={p} width={w} />)}
    </View>
  );
}
