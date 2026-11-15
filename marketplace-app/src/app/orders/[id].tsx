import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { getProduct, getShop, money } from '@/lib/data';
import { OrderStatus, useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

const steps: OrderStatus[] = ['Paid', 'Shipped', 'Out for delivery', 'Delivered'];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, reorder } = useStore();
  const o = orders.find(x => x.id === id);
  if (!o) return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}><Header title="Order" back /><Text style={{ padding: S.lg }}>Order not found.</Text></SafeAreaView>;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={`Order #${o.id}`} back share={() => router.push({ pathname: '/share', params: { kind: 'order', id: o.id } })} />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.lg, paddingBottom: 40 }}>
        {o.sellerOrders.map(so => {
          const s = getShop(so.shopId); const at = steps.indexOf(so.status);
          return (
            <Card key={so.shopId}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={{ uri: s.logo }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <Text style={[T.h3, { flex: 1 }]}>{s.name}</Text>
                <Pressable onPress={() => router.push('/help')}><Text style={{ color: C.accent, fontWeight: '700' }}>Message</Text></Pressable>
              </View>
              {/* Per-seller timeline */}
              <View style={{ flexDirection: 'row', marginTop: S.lg, alignItems: 'center' }}>
                {steps.map((st, i) => (
                  <React.Fragment key={st}>
                    <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: i <= at ? C.good : C.line }} />
                    {i < steps.length - 1 && <View style={{ flex: 1, height: 3, backgroundColor: i < at ? C.good : C.line }} />}
                  </React.Fragment>
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                {steps.map((st, i) => <Text key={st} style={{ fontSize: 10, color: i <= at ? C.ink : C.ink3, fontWeight: i === at ? '800' : '500', width: 70, textAlign: i === 0 ? 'left' : i === steps.length - 1 ? 'right' : 'center' }}>{st}</Text>)}
              </View>
              {so.tracking && <Text style={[T.small, { marginTop: S.md }]}>UPS {so.tracking} · arrives Thu</Text>}
              {so.lines.map(l => {
                const p = getProduct(l.productId);
                return (
                  <Pressable key={l.productId + l.size} onPress={() => router.push(`/product/${p.id}`)} style={{ flexDirection: 'row', gap: 12, marginTop: S.md }}>
                    <Image source={{ uri: p.image }} style={{ width: 56, height: 56, borderRadius: 10 }} />
                    <View style={{ flex: 1 }}><Text style={{ fontWeight: '600' }} numberOfLines={1}>{p.title}</Text><Text style={T.small}>{l.size ? `Size ${l.size} · ` : ''}Qty {l.qty}</Text></View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={{ fontWeight: '700' }}>{money(p.price * l.qty)}</Text>
                      <Pressable onPress={() => router.push({ pathname: '/review', params: { productId: p.id, orderId: o.id } })} accessibilityRole="button" hitSlop={8}><Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Review</Text></Pressable>
                    </View>
                  </Pressable>
                );
              })}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: S.lg }}>
                <Button title="Buy again" kind="buy" icon="repeat" style={{ flex: 1, height: 42 }} onPress={() => reorder({ ...o, sellerOrders: [so] })} />
                <Button title="Get help" kind="ghost" style={{ flex: 1, height: 42 }} onPress={() => router.push('/help')} />
              </View>
            </Card>
          );
        })}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={T.h3}>Paid</Text><Text style={T.h3}>{money(o.total)}</Text></View>
          {o.credit > 0 && <Text style={{ color: C.good, fontWeight: '700', marginTop: 4 }}>You saved {money(o.credit)} with credit</Text>}
        </Card>
        <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'order', id: o.id } })} style={{ padding: S.lg, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Ionicons name="camera" size={22} color={C.accent} />
          <Text style={{ flex: 1, fontWeight: '700' }}>Share your haul and give friends ${BRAND.referralReward} off</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
