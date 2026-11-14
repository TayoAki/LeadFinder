import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Button, Card, Chip, Pill } from '@/components/ui';
import { getProduct, money } from '@/lib/data';
import { sellerOrders } from '@/lib/sellerData';
import { C, R, S, T } from '@/lib/theme';

export default function SellerOrders() {
  const [rows, setRows] = useState(sellerOrders());
  const [tab, setTab] = useState<'To ship' | 'Shipped' | 'Delivered'>('To ship');
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const list = rows.filter(r => r.status === tab);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title="Orders" back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, gap: S.md, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['To ship', 'Shipped', 'Delivered'] as const).map(t => <Chip key={t} label={`${t} · ${rows.filter(r => r.status === t).length}`} active={tab === t} onPress={() => setTab(t)} />)}
        </View>
        {!list.length && <Text style={[T.small, { textAlign: 'center', padding: S.xl }]}>Nothing here.</Text>}
        {list.map(o => {
          const p = getProduct(o.productId);
          return (
            <Card key={o.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={T.h3}>#{o.id} · {o.buyer}</Text><Text style={{ fontWeight: '800' }}>{money(o.total)}</Text></View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}><Text style={T.small}>{o.placed} · ship to {o.city}</Text><Pill text={`via ${o.source}`} tone={o.source === 'Your link' ? 'accent' : 'dark'} /></View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: S.md, alignItems: 'center' }}>
                <Image source={{ uri: p.image }} style={{ width: 52, height: 52, borderRadius: 10 }} />
                <Text style={{ flex: 1, fontWeight: '600' }} numberOfLines={2}>{p.title} × {o.qty}</Text>
              </View>
              {o.status === 'To ship' && <>
                <TextInput value={tracking[o.id] ?? ''} onChangeText={t => setTracking(v => ({ ...v, [o.id]: t }))} placeholder="Tracking number" placeholderTextColor={C.ink3} accessibilityLabel="Tracking number"
                  style={{ marginTop: S.md, height: 44, borderRadius: R.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: 12, color: C.ink }} />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: S.sm }}>
                  <Button title="Buy label" kind="light" style={{ flex: 1, height: 44 }} />
                  <Button title="Mark shipped" kind="accent" style={{ flex: 1, height: 44 }} disabled={!tracking[o.id]} onPress={() => setRows(rs => rs.map(r => (r.id === o.id ? { ...r, status: 'Shipped' } : r)))} />
                </View>
                <Text style={[T.small, { marginTop: 6 }]}>The buyer gets a push the moment you mark it shipped. Your payout is released then.</Text>
              </>}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
