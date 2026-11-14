import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Button, Pill } from '@/components/ui';
import { money } from '@/lib/data';
import { myProducts } from '@/lib/sellerData';
import { C, R, S, T } from '@/lib/theme';

export default function SellerProducts() {
  const items = myProducts();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title={`Products · ${items.length}`} back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, gap: S.sm, paddingBottom: 40 }}>
        <Button title="Add product" kind="accent" icon="add" onPress={() => router.push('/seller/product-new')} />
        {items.map(p => (
          <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}`)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
            <Image source={{ uri: p.image }} style={{ width: 56, height: 56, borderRadius: 10 }} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ fontWeight: '700' }}>{p.title}</Text>
              <Text style={T.small}>{money(p.price)} · {p.sold} sold</Text>
            </View>
            {p.stock <= 5 ? <Pill text={`${p.stock} left`} tone="warn" /> : <Pill text={`${p.stock} in stock`} tone="good" />}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
