import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { getProduct, getShop, money } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { inHoldout } from '@/lib/experiments';

// The highest-intent moment in the app: ask for the share, the invite and the notification here.
export default function OrderSuccess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, notif, following, toggleFollow } = useStore();
  // Ask for push right after the first order (the moment it's obviously useful), never at launch.
  useEffect(() => {
    if (notif !== 'unknown' || inHoldout('holdout_push')) return;
    const t = setTimeout(() => router.push({ pathname: '/notify', params: { reason: 'order' } }), 1400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const o = orders.find(x => x.id === id) ?? orders[0];
  if (!o) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: S.xl, paddingBottom: 60 }}>
        <View style={{ alignSelf: 'center', width: 84, height: 84, borderRadius: 42, backgroundColor: C.goodSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="checkmark" size={48} color={C.good} />
        </View>
        <Text style={[T.h1, { textAlign: 'center', marginTop: S.lg }]}>Order placed</Text>
        <Text style={[T.body, { textAlign: 'center', color: C.ink2, marginTop: 4 }]}>{money(o.total)} paid · {o.sellerOrders.length} shop{o.sellerOrders.length > 1 ? 's are' : ' is'} packing it now</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: S.lg }}>
          {o.sellerOrders.flatMap(so => so.lines).slice(0, 5).map(l => <Image key={l.productId + l.size} source={{ uri: getProduct(l.productId).image }} style={{ width: 60, height: 60, borderRadius: R.md }} />)}
        </View>

        {notif === 'unknown' && (
          <Pressable onPress={() => router.push({ pathname: '/notify', params: { reason: 'order' } })} style={{ marginTop: S.xl, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <Ionicons name="notifications" size={22} color={C.accent} />
            <Text style={{ flex: 1, fontWeight: '700' }}>Get a ping when each shop ships</Text>
            <Ionicons name="chevron-forward" size={18} color={C.ink3} />
          </Pressable>
        )}

        <View style={{ marginTop: S.lg, padding: S.xl, borderRadius: R.lg, backgroundColor: C.ink }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>Share your haul, give ${BRAND.referralReward}</Text>
          <Text style={{ color: '#CFC7BC', marginTop: 6, lineHeight: 20 }}>Friends get ${BRAND.referralReward} off their first order. You get ${BRAND.referralReward} credit for each one who buys.</Text>
          <Button title="Share my haul" kind="accent" icon="paper-plane" style={{ marginTop: S.lg }} onPress={() => router.push({ pathname: '/share', params: { kind: 'order', id: o.id } })} />
        </View>

        <Text style={[T.h3, { marginTop: S.xl }]}>Follow the shops you bought from</Text>
        {o.sellerOrders.map(so => {
          const s = getShop(so.shopId); const on = following.includes(s.id);
          return (
            <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: S.md }}>
              <Image source={{ uri: s.logo }} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <Text style={{ flex: 1, fontWeight: '700' }}>{s.name}</Text>
              <Pressable onPress={() => toggleFollow(s.id)} style={{ paddingHorizontal: 14, height: 34, borderRadius: R.pill, backgroundColor: on ? C.surface : C.ink, borderWidth: 1, borderColor: on ? C.line : C.ink, justifyContent: 'center' }}>
                <Text style={{ color: on ? C.ink : '#fff', fontWeight: '800', fontSize: 13 }}>{on ? 'Following' : 'Follow'}</Text>
              </Pressable>
            </View>
          );
        })}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: S.xl }}>
          <Button title="Track order" kind="light" style={{ flex: 1 }} onPress={() => router.replace(`/orders/${o.id}`)} />
          <Button title="Keep shopping" style={{ flex: 1 }} onPress={() => router.replace('/')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
