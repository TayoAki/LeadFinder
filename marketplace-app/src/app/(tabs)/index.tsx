import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductCard';
import { Chip, IconButton, Pill, SectionHeader, useCountdown } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { categories, categoryIcon, compact, drops, getProduct, getShop, products, recentBuys, shops } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Home() {
  const { width } = useWindowDimensions();
  const { onboarded, interests, following, reminders, toggleReminder, referredBy, setReferredBy, notif } = useStore();
  const { ref } = useLocalSearchParams<{ ref?: string }>();
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  const remind = (id: string) => { if (!reminders.includes(id) && notif === 'unknown') router.push({ pathname: '/notify', params: { reason: 'drop' } }); toggleReminder(id); };
  const [cat, setCat] = useState('All');
  const [tick, setTick] = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(n => (n + 1) % recentBuys.length), 3500); return () => clearInterval(t); }, []);

  const feed = useMemo(() => {
    const pool = cat !== 'All' ? products.filter(p => p.category === cat) : interests.length ? products.filter(p => interests.includes(p.category)) : products;
    return [...pool].sort((a, b) => b.sold - a.sold).slice(0, 12);
  }, [cat, interests]);
  const fromFollowed = products.filter(p => following.includes(p.shopId)).slice(0, 6);
  const drop = drops[0];
  const cd = useCountdown(drop.at);
  const buy = recentBuys[tick];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header logo right={<IconButton name="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} badge={2} />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ paddingHorizontal: S.lg, marginBottom: S.md, fontSize: 22, fontWeight: '900', color: C.ink, letterSpacing: -0.4 }}>{BRAND.tagline}.</Text>
        <Pressable onPress={() => router.push('/search')} accessibilityRole="search" style={{ marginHorizontal: S.lg, height: 46, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 }}>
          <Ionicons name="search" size={18} color={C.ink3} />
          <Text style={{ color: C.ink3, fontSize: 15 }}>Search {products.length} items from {shops.length} indie shops</Text>
        </Pressable>

        {referredBy && (
          <View style={{ margin: S.lg, marginBottom: 0, padding: S.md, borderRadius: R.lg, backgroundColor: C.goodSoft, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="gift" size={22} color={C.good} />
            <Text style={{ flex: 1, color: C.good, fontWeight: '700' }}>A friend sent you ${BRAND.referralReward} off. It's applied at checkout automatically.</Text>
          </View>
        )}
        {!onboarded && (
          <Pressable onPress={() => router.push('/onboarding')} style={{ margin: S.lg, marginBottom: 0, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="sparkles" size={20} color={C.accent} />
            <Text style={{ flex: 1, color: C.ink, fontWeight: '600' }}>Tap 3 things you like to tune your feed</Text>
            <Ionicons name="chevron-forward" size={18} color={C.ink3} />
          </Pressable>
        )}
        {/* Shops you follow: story-style ring, the habit loop that brings people back */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 14, paddingTop: S.lg }}>
          {shops.slice(0, 8).map(s => {
            const followed = following.includes(s.id);
            return (
              <Pressable key={s.id} onPress={() => router.push(`/shop/${s.id}`)} style={{ alignItems: 'center', width: 70 }} accessibilityLabel={`${s.name} shop`}>
                <View style={{ padding: 2.5, borderRadius: 40, borderWidth: 2.5, borderColor: followed ? C.accent : C.line }}>
                  <Image source={{ uri: s.logo }} style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: '#eee' }} />
                </View>
                {followed && <View style={{ position: 'absolute', top: 50, backgroundColor: C.accent, paddingHorizontal: 6, borderRadius: 6 }}><Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>NEW</Text></View>}
                <Text numberOfLines={1} style={{ fontSize: 11, marginTop: 6, color: C.ink2, fontWeight: '600' }}>{s.name.split(' ')[0]}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Drop: scarcity + countdown + remind me */}
        <Pressable onPress={() => router.push('/drops')} style={{ margin: S.lg, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.dark }}>
          <Image source={{ uri: getProduct(drop.productId).images[0] }} style={{ position: 'absolute', right: -20, top: 0, bottom: 0, width: '55%', opacity: 0.9 }} resizeMode="cover" />
          <View style={{ padding: S.lg, width: '62%' }}>
            <Pill text="TODAY'S DROP" tone="accent" icon="flash" />
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 10 }}>{drop.title}</Text>
            <Text style={{ color: '#CFC7BC', fontSize: 13, marginTop: 4 }}>by {getShop(drop.shopId).name} · only {drop.qty} made</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 12, fontVariant: ['tabular-nums'] }}>{cd.text}</Text>
            <Pressable onPress={() => remind(drop.id)} accessibilityRole="button" style={{ marginTop: 12, alignSelf: 'flex-start', backgroundColor: reminders.includes(drop.id) ? C.good : C.accent, paddingHorizontal: 14, height: 38, borderRadius: R.pill, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name={reminders.includes(drop.id) ? 'checkmark' : 'notifications'} size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{reminders.includes(drop.id) ? "You'll get a ping" : 'Remind me'}</Text>
            </Pressable>
            <Text style={{ color: '#CFC7BC', fontSize: 11, marginTop: 8 }}>{compact(drop.reminders + (reminders.includes(drop.id) ? 1 : 0))} people waiting</Text>
          </View>
        </Pressable>

        {/* Two-sided referral, visible on the first screen */}
        <Pressable onPress={() => router.push('/invite')} style={{ marginHorizontal: S.lg, padding: S.lg, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="gift" size={22} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={T.h3}>Give ${BRAND.referralReward}, get ${BRAND.referralReward}</Text>
            <Text style={T.small}>Friends get ${BRAND.referralReward} off their first order. You get ${BRAND.referralReward} when they buy.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.ink2} />
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 8, paddingTop: S.xl }}>
          {categories.map(c => <Chip key={c} label={c} icon={categoryIcon[c] as any} active={cat === c} onPress={() => setCat(c)} />)}
        </ScrollView>

        {/* Live social proof ticker */}
        <View style={{ marginHorizontal: S.lg, marginTop: S.lg, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, paddingHorizontal: 12, paddingVertical: 8 }} accessibilityLiveRegion="polite">
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.good }} />
          <Text numberOfLines={1} style={{ fontSize: 12, color: C.ink2, flex: 1 }}><Text style={{ fontWeight: '800', color: C.ink }}>{buy.who}</Text> bought {getProduct(buy.productId).title} · {buy.mins} min ago</Text>
        </View>

        <SectionHeader title={cat === 'All' ? (interests.length ? 'Picked for you' : 'Trending now') : cat} sub={cat === 'All' && interests.length ? `Because you like ${interests.slice(0, 2).join(' and ')}` : 'What people are buying this week'} action="See all" onAction={() => router.push('/search')} />
        <ProductGrid items={feed} width={width} />

        <SectionHeader title="New from shops you follow" action="Shops" onAction={() => router.push('/following')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12 }}>
          {fromFollowed.map(p => (
            <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}`)} style={{ width: 140 }}>
              <Image source={{ uri: p.image }} style={{ width: 140, height: 150, borderRadius: R.md, backgroundColor: '#F1ECE4' }} />
              <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '600', marginTop: 6 }}>{p.title}</Text>
              <Text style={{ fontSize: 13, fontWeight: '800' }}>${p.price.toFixed(2)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Seller-brings-buyers loop */}
        <Pressable onPress={() => router.push('/seller/apply')} style={{ margin: S.lg, marginTop: S.xl, padding: S.xl, borderRadius: R.lg, backgroundColor: C.ink }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>Make things? Sell them here.</Text>
          <Text style={{ color: '#CFC7BC', marginTop: 6, lineHeight: 20 }}>Open a shop in 10 minutes. Share one link and your followers check out with Apple Pay. 0% commission for your first 60 days.</Text>
          <Text style={{ color: C.accent, fontWeight: '800', marginTop: 12 }}>Start selling →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
