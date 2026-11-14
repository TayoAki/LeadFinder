import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { drops, getShop, products } from '@/lib/data';
import { C, R, S, T } from '@/lib/theme';

const items = [
  { icon: 'flash', title: `${drops[0].title} drops in 3 hours`, sub: `${getShop(drops[0].shopId).name} · 40 made`, to: '/drops', fresh: true },
  { icon: 'storefront', title: `${getShop('s1').name} added 3 new items`, sub: 'A shop you follow', to: '/shop/s1', fresh: true },
  { icon: 'pricetag', title: `Shelby spotted a price drop on ${products[8].title}`, sub: 'Saved in your wishlist', to: `/product/${products[8].id}`, fresh: false },
  { icon: 'gift', title: 'Your friend Sam just signed up', sub: "You'll get $10 when they buy", to: '/invite', fresh: false },
];

const prefs = [['Orders and shipping', true], ['Drops you set a reminder for', true], ['New items from shops you follow', true], ['Price drops on your wishlist', true], ['Friends who join with your link', true], ['Deals and recommendations', false]] as const;

export default function Notifications() {
  const [on, setOn] = useState<boolean[]>(prefs.map(p => p[1]));
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Notifications" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.sm }}>
        {items.map(n => (
          <Pressable key={n.title} onPress={() => router.push(n.to as any)} style={{ flexDirection: 'row', gap: 12, padding: S.md, borderRadius: R.lg, backgroundColor: n.fresh ? C.surface : 'transparent', borderWidth: 1, borderColor: n.fresh ? C.line : 'transparent' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={n.icon as any} size={20} color={C.accent} /></View>
            <View style={{ flex: 1 }}><Text style={{ fontWeight: '700', color: C.ink }}>{n.title}</Text><Text style={T.small}>{n.sub}</Text></View>
            {n.fresh && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent, marginTop: 6 }} />}
          </Pressable>
        ))}
        <Text style={[T.h3, { marginTop: S.xl }]}>What we ping you about</Text>
        <Text style={T.small}>Marketing is off by default. Turn anything off any time.</Text>
        {prefs.map(([label], i) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }}>
            <Text style={{ flex: 1, color: C.ink }}>{label}</Text>
            <Switch value={on[i]} onValueChange={v => setOn(o => o.map((x, j) => (j === i ? v : x)))} trackColor={{ true: C.accent, false: C.line }} accessibilityLabel={label} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
