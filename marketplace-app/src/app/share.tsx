import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { IconButton } from '@/components/ui';
import { BRAND, link } from '@/lib/brand';
import { drops, getProduct, getShop, money, products } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';

type Kind = 'product' | 'shop' | 'drop' | 'ask' | 'wishlist' | 'order' | 'invite';

// Every share produces a rich card + a deep link carrying the sharer's referral code,
// so the friend lands on the exact item with $10 off already applied.
export default function ShareSheet() {
  const { kind = 'product', id = '' } = useLocalSearchParams<{ kind: Kind; id: string }>();
  const { user, wishlist, orders, invite } = useStore();
  const [done, setDone] = useState<string | null>(null);
  const ref = user?.code ?? 'FRIEND10';

  let image = '', title = '', sub = '', url = '', message = '', badge = '';
  if (kind === 'product' || kind === 'ask') {
    const p = getProduct(id); const shop = getShop(p.shopId);
    image = p.images[0]; title = p.title; sub = `${money(p.price)} · ${BRAND.name}`; url = link(`/p/${p.id}`, ref);
    message = kind === 'ask' ? `Should I get this? Yes or no 👇 ${title} at ${BRAND.name}` : `Found this on ${BRAND.name}: ${title} at ${BRAND.name}`;
    badge = kind === 'ask' ? 'YES OR NO?' : '';
  } else if (kind === 'shop') {
    const s = getShop(id); image = s.banner; title = s.name; sub = s.tagline; url = link(`/s/${s.id}`, ref); message = `Shop ${s.name} on ${BRAND.name}`;
  } else if (kind === 'drop') {
    const d = drops.find(x => x.id === id)!; image = getProduct(d.productId).images[0]; title = d.title; sub = `${d.qty} made · drops soon`; url = link(`/d/${d.id}`, ref); message = `This drop is limited to ${d.qty}. Set a reminder:`; badge = 'DROP';
  } else if (kind === 'wishlist') {
    const first = getProduct(wishlist[0] ?? products[0].id); image = first.image; title = `${user?.name ?? 'My'} wishlist`; sub = `${wishlist.length || 1} things I'd love from indie shops`; url = link(`/w/${ref}`, ref); message = 'My wishlist (hint hint):'; badge = 'GIFT IDEAS';
  } else if (kind === 'order') {
    const o = orders.find(x => x.id === id) ?? orders[0]; const p = getProduct(o.sellerOrders[0].lines[0].productId);
    image = p.images[0]; title = 'Just got my haul'; sub = `From ${BRAND.name}, in one checkout`; url = link('/', ref); message = `Shopped ${o.sellerOrders.length} small shops in one go on ${BRAND.name}. Here's $${BRAND.referralReward} off your first order:`; badge = 'MY HAUL';
  } else {
    image = products[5].images[0]; title = `$${BRAND.referralReward} off at ${BRAND.name}`; sub = `${BRAND.tagline}. Use my link.`; url = link('/', ref); message = `Here's $${BRAND.referralReward} off your first order on ${BRAND.name}:`; badge = `$${BRAND.referralReward} OFF`;
  }

  const send = async (via: string) => {
    if (via === 'Copy link' && Platform.OS === 'web') { try { await (navigator as any).clipboard?.writeText(url); } catch {} }
    else { try { await Share.share({ message: `${message} ${url}`, url }); } catch {} }
    track('share', { via, kind, id }); invite(); setDone(via);
  };

  const targets: [string, any, string][] = [
    ['Messages', 'chatbubble', '#34C759'], ['Instagram story', 'logo-instagram', '#E1306C'], ['WhatsApp', 'logo-whatsapp', '#25D366'],
    ['TikTok', 'logo-tiktok', '#000'], ['Copy link', 'link', C.ink2], ['More', 'ellipsis-horizontal', C.ink2],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: S.md }}>
        <Text style={[T.h3, { paddingLeft: S.sm }]}>{kind === 'ask' ? 'Ask a friend' : kind === 'invite' ? 'Invite friends' : 'Share'}</Text>
        <IconButton name="close" label="Close" onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingTop: 0 }}>
        {/* The card friends actually see in their feed or chat */}
        <View style={{ borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
          <Image source={{ uri: image }} style={{ width: '100%', height: 260, backgroundColor: '#F7EEE5' }} resizeMode="cover" />
          {!!badge && <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: C.accent, borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>{badge}</Text></View>}
          <View style={{ padding: S.lg }}>
            <Text style={T.h2}>{title}</Text>
            <Text style={[T.small, { marginTop: 2 }]}>{sub}</Text>
            {kind === 'ask' && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: S.md }}>
                {['Get it', 'Skip it'].map(v => <View key={v} style={{ flex: 1, height: 40, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '800' }}>{v}</Text></View>)}
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.md, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line }}>
              <Logo size={20} />
              <Text style={{ color: C.good, fontWeight: '800', fontSize: 12 }}>${BRAND.referralReward} off your first order</Text>
            </View>
          </View>
        </View>
        <Text numberOfLines={1} style={[T.small, { marginTop: S.md, textAlign: 'center' }]}>{url}</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: S.lg, marginTop: S.xl }}>
          {targets.map(([label, icon, color]) => (
            <Pressable key={label} onPress={() => send(label)} accessibilityRole="button" accessibilityLabel={`Share via ${label}`} style={{ width: '31%', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={24} color={color} /></View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.ink2 }}>{label}</Text>
            </Pressable>
          ))}
        </View>
        {done && (
          <View style={{ marginTop: S.xl, padding: S.md, borderRadius: R.lg, backgroundColor: C.goodSoft, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={20} color={C.good} />
            <Text style={{ color: C.good, fontWeight: '700', flex: 1 }}>{done === 'Copy link' ? 'Link copied.' : 'Sent.'} You get ${BRAND.referralReward} credit when a friend buys with your link.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
