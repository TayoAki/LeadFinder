import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Pill } from '@/components/ui';
import { getProduct, getShop, money } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Orders() {
  const { orders } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Orders" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {!orders.length && (
          <View style={{ alignItems: 'center', padding: S.xxl }}>
            <Ionicons name="receipt-outline" size={44} color={C.ink3} />
            <Text style={[T.h2, { marginTop: 12 }]}>No orders yet</Text>
            <Text style={[T.small, { marginTop: 4 }]}>Your orders from every shop show up here.</Text>
            <Button title="Start shopping" style={{ marginTop: S.lg }} onPress={() => router.push('/')} />
          </View>
        )}
        {orders.map(o => (
          <Pressable key={o.id} onPress={() => router.push(`/orders/${o.id}`)} style={{ padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={T.h3}>Order #{o.id}</Text>
              <Text style={{ fontWeight: '800' }}>{money(o.total)}</Text>
            </View>
            <Text style={T.small}>{new Date(o.placedAt).toLocaleDateString()} · {o.sellerOrders.length} shop{o.sellerOrders.length > 1 ? 's' : ''}</Text>
            {o.sellerOrders.map(so => (
              <View key={so.shopId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: S.md }}>
                <Image source={{ uri: getProduct(so.lines[0].productId).image }} style={{ width: 44, height: 44, borderRadius: 8 }} />
                <Text style={{ flex: 1, fontWeight: '600' }}>{getShop(so.shopId).name}</Text>
                <Pill text={so.status} tone={so.status === 'Paid' ? 'warn' : 'good'} />
              </View>
            ))}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
