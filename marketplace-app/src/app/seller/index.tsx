import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { API_URL } from '@/lib/api';
import { commerce } from '@/lib/commerce';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Card, IconName } from '@/components/ui';
import { compact, getProduct, money } from '@/lib/data';
import { myProducts, myShop, salesWeek, sellerOrders } from '@/lib/sellerData';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

function Tile({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
      <Ionicons name={icon} size={18} color={C.ink2} />
      <Text style={{ fontSize: 22, fontWeight: '900', marginTop: 6 }}>{value}</Text>
      <Text style={T.small}>{label}</Text>
    </Pressable>
  );
}

export default function SellerHome() {
  const { seller } = useStore();
  if (seller === 'none') return <Redirect href="/seller/apply" />;
  const shop = myShop();
  const orders = sellerOrders();
  const toShip = orders.filter(o => o.status === 'To ship');
  const week = salesWeek.reduce((n, d) => n + d.usd, 0);
  const max = Math.max(...salesWeek.map(d => d.usd));
  const fromLink = orders.filter(o => o.source === 'Your link').length;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title={shop.name} />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, gap: S.lg, paddingBottom: 40 }}>
        {/* The real shop tools live on the web dashboard (photos are easier to manage on a laptop) */}
        <Pressable onPress={() => { const url = commerce()?.sellerUrl ?? `${API_URL}/seller`; Platform.OS === 'web' ? (window.location.href = url || '/seller') : Linking.openURL(url); }} accessibilityRole="link"
          style={{ padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.accent, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="laptop-outline" size={24} color={C.accent} />
          <View style={{ flex: 1 }}><Text style={T.h3}>Open Shelby for Sellers</Text><Text style={T.small}>Upload products, manage stock and ship real orders. This screen is a preview.</Text></View>
          <Ionicons name="open-outline" size={18} color={C.ink2} />
        </Pressable>
        {seller === 'applied' && (
          <Card style={{ backgroundColor: C.warnSoft, borderColor: C.warnSoft }}>
            <Text style={[T.h3, { color: C.warn }]}>Application in review</Text>
            <Text style={[T.small, { marginTop: 2 }]}>Most shops are approved within 1 business day. Add products now; they go live on approval.</Text>
          </Card>
        )}
        {/* Today: the to-do comes first */}
        <Pressable onPress={() => router.push('/seller/orders')} style={{ padding: S.lg, borderRadius: R.lg, backgroundColor: C.accent, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="cube" size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{toShip.length} orders to ship</Text>
            <Text style={{ color: '#FFE3DB' }}>Ship within {shop.shipsIn} to keep your fast-shipper badge</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </Pressable>

        <View style={{ flexDirection: 'row', gap: S.md }}>
          <Tile icon="cash-outline" label="Sales, 7 days" value={money(week).replace('.00', '')} onPress={() => router.push('/seller/payouts')} />
          <Tile icon="people-outline" label="Followers" value={compact(shop.followers)} onPress={() => router.push('/seller/grow')} />
          <Tile icon="eye-outline" label="Shop visits" value="2.4k" />
        </View>

        <Card>
          <Text style={T.h3}>This week</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 110, marginTop: S.md }} accessibilityLabel={`Sales this week ${money(week)}`}>
            {salesWeek.map(d => (
              <View key={d.day} style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ width: '100%', height: (d.usd / max) * 86, borderRadius: 6, backgroundColor: d.day === 'Sat' ? C.accent : '#E7DED2' }} />
                <Text style={[T.tiny, { marginTop: 4 }]}>{d.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Seller-brings-buyers: the growth loop is a first-class card on the dashboard */}
        <Pressable onPress={() => router.push('/seller/grow')} style={{ padding: S.lg, borderRadius: R.lg, backgroundColor: C.ink }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="megaphone" size={22} color={C.accent} />
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '900', flex: 1 }}>Bring your followers</Text>
            <Ionicons name="chevron-forward" size={18} color="#CFC7BC" />
          </View>
          <Text style={{ color: '#CFC7BC', marginTop: 6 }}>{fromLink} of your last {orders.length} orders came from your shop link. Share it to your Instagram story in one tap; they check out with Apple Pay.</Text>
        </Pressable>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={T.h3}>Latest orders</Text><Pressable onPress={() => router.push('/seller/orders')}><Text style={{ color: C.accent, fontWeight: '700' }}>All</Text></Pressable></View>
          {orders.slice(0, 3).map(o => (
            <View key={o.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: S.md }}>
              <Image source={{ uri: getProduct(o.productId).image }} style={{ width: 40, height: 40, borderRadius: 8 }} />
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '700' }}>{o.buyer} · {money(o.total)}</Text><Text style={T.small}>{o.placed} · via {o.source}</Text></View>
              <Text style={{ fontWeight: '700', color: o.status === 'To ship' ? C.accent : C.good, fontSize: 12 }}>{o.status}</Text>
            </View>
          ))}
        </Card>

        <View style={{ flexDirection: 'row', gap: S.md }}>
          {([['add-circle', 'Add product', '/seller/product-new'], ['grid', `Products · ${myProducts().length}`, '/seller/products'], ['wallet', 'Payouts', '/seller/payouts']] as const).map(([i, l, to]) => (
            <Pressable key={l} onPress={() => router.push(to)} style={{ flex: 1, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, alignItems: 'center', gap: 6 }}>
              <Ionicons name={i} size={24} color={C.ink} />
              <Text style={{ fontWeight: '700', fontSize: 12, textAlign: 'center' }}>{l}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => router.push('/seller/apply')}><Text style={[T.small, { textAlign: 'center' }]}>Preview the seller sign-up flow</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
