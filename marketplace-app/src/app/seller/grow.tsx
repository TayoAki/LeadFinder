import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { SellerHeader } from '@/components/SellerHeader';
import { Button, Card, Chip } from '@/components/ui';
import { BRAND, link } from '@/lib/brand';
import { compact } from '@/lib/data';
import { myProducts, myShop } from '@/lib/sellerData';
import { C, R, S, T } from '@/lib/theme';

// Tools that turn each seller's existing audience into buyers (and new app users).
export default function Grow() {
  const shop = myShop();
  const ps = myProducts();
  const [code, setCode] = useState<string | null>(null);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title="Bring your followers" back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, gap: S.lg, paddingBottom: 40 }}>
        {/* Ready-made story card */}
        <View style={{ alignSelf: 'center', width: 220, aspectRatio: 9 / 16, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.dark }}>
          <Image source={{ uri: ps[0].images[0] }} style={{ width: '100%', height: '62%' }} />
          <View style={{ padding: 12, flex: 1, justifyContent: 'space-between' }}>
            <View><Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{shop.name}</Text><Text style={{ color: '#CFC7BC', fontSize: 11 }}>is now on {BRAND.name}. Tap to shop.</Text></View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Logo size={16} light /><View style={{ backgroundColor: C.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>SHOP NOW</Text></View></View>
          </View>
        </View>
        <Button title="Post to Instagram story" icon="logo-instagram" kind="accent" onPress={() => router.push({ pathname: '/share', params: { kind: 'shop', id: shop.id } })} />

        <Card>
          <Text style={T.tiny}>YOUR SHOP LINK</Text>
          <Text style={[T.h3, { marginTop: 4 }]} selectable>{link(`/s/${shop.id}`)}</Text>
          <Text style={[T.small, { marginTop: 4 }]}>Put it in your bio. Visitors without the app see your shop on the web and check out with Apple Pay; the app install comes after.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: S.md }}>
            <Button title="Copy" kind="light" icon="copy-outline" style={{ flex: 1, height: 44 }} onPress={() => router.push({ pathname: '/share', params: { kind: 'shop', id: shop.id } })} />
            <Button title="QR for markets" kind="light" icon="qr-code-outline" style={{ flex: 1, height: 44 }} />
          </View>
        </Card>

        <Card>
          <Text style={T.h3}>Follower-only code</Text>
          <Text style={[T.small, { marginTop: 2 }]}>A discount you fund, for your audience. Shoppers who use it auto-follow your shop.</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: S.md }}>
            {['10% off', 'Free shipping', '$5 off $40'].map(c => <Chip key={c} label={c} active={code === c} onPress={() => setCode(c)} />)}
          </View>
          {code && <Text style={{ marginTop: S.md, fontWeight: '800', color: C.good }}>Code {shop.name.split(' ')[0].toUpperCase()}{code.includes('ship') ? 'SHIP' : '10'} created · {code}</Text>}
        </Card>

        <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Ionicons name="people" size={26} color={C.accent} />
          <View style={{ flex: 1 }}>
            <Text style={T.h3}>{compact(shop.followers)} followers on {BRAND.name}</Text>
            <Text style={T.small}>They get a push for every drop you schedule.</Text>
          </View>
          <Pressable onPress={() => router.push('/seller/product-new')}><Text style={{ color: C.accent, fontWeight: '800' }}>Plan a drop</Text></Pressable>
        </Card>
        <Card style={{ backgroundColor: C.dark, borderColor: C.dark }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>Invite another maker, both get 30 days at 0%</Text>
          <Text style={{ color: '#CFC7BC', marginTop: 4 }}>Know a shop that belongs here? Your intro period extends when they make their first sale.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
