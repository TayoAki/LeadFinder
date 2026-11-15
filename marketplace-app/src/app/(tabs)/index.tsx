import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductCard';
import { Chip, IconButton, Pill, SectionHeader, useCountdown } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { categories, categoryIcon, compact, drops, getProduct, money, products } from '@/lib/data';
import { Shelby } from '@/components/Shelby';
import { ProductCard } from '@/components/ProductCard';
import { pick } from '@/lib/shelby';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { shopVideos } from '@/lib/videos';
import { useDropCounts } from '@/lib/proof';
import { icpOf, rankFor } from '@/lib/icp';
import { livePages } from '@/lib/pages';
import { track } from '@/lib/analytics';
import { variant } from '@/lib/experiments';

export default function Home() {
  const { width } = useWindowDimensions();
  const { onboarded, interests, reminders, toggleReminder, referredBy, setReferredBy, notif, goal, budget } = useStore();
  const { ref } = useLocalSearchParams<{ ref?: string }>();
  // First launch opens Shelby's welcome (its first screen already shows real products, and "Just browse" is one tap).
  // People arriving from a friend's link skip it and land on what was shared.
  // New shoppers go straight to onboarding before Home ever paints (no flash); shared links skip it.
  const firstRun = !onboarded && !referredBy && !ref;
  const dropCounts = useDropCounts();
  const shelbyPicks = useMemo(() => pick({ categories: interests, maxPrice: budget ?? undefined, goal: goal ?? undefined }, 8), [interests, budget, goal]);
  const videos = useMemo(() => shopVideos(), []);
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  const remind = (id: string) => { if (!reminders.includes(id) && notif === 'unknown') router.push({ pathname: '/notify', params: { reason: 'drop' } }); toggleReminder(id); };
  const [cat, setCat] = useState('All');
  const { profile } = useStore();
  const showQuiz = useMemo(() => !profile && variant('e18_quiz_entry') === 'show', [profile]);
  const forYou = useMemo(() => (profile ? rankFor(profile).slice(0, 4) : []), [profile]);


  const feed = useMemo(() => {
    const pool = cat !== 'All' ? products.filter(p => p.category === cat) : interests.length ? products.filter(p => interests.includes(p.category)) : products;
    return [...pool].sort((a, b) => b.sold - a.sold).slice(0, 12);
  }, [cat, interests]);
  const guides = useMemo(() => livePages(), []);
  const drop = drops[0];
  const cd = useCountdown(drop?.at ?? 0);

  if (firstRun) return <Redirect href="/onboarding" />;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header logo right={<IconButton name="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ paddingHorizontal: S.lg, marginBottom: S.md, fontSize: 22, fontWeight: '900', color: C.ink, letterSpacing: -0.4 }}>{BRAND.tagline}.</Text>
        <Pressable onPress={() => router.push('/search')} accessibilityRole="search" style={{ marginHorizontal: S.lg, height: 46, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 }}>
          <Ionicons name="search" size={18} color={C.ink3} />
          <Text style={{ color: C.ink3, fontSize: 15 }}>Search {products.length} products</Text>
        </Pressable>

        {referredBy && (
          <View style={{ margin: S.lg, marginBottom: 0, padding: S.md, borderRadius: R.lg, backgroundColor: C.goodSoft, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="gift" size={22} color={C.good} />
            <Text style={{ flex: 1, color: C.good, fontWeight: '700' }}>A friend sent you ${BRAND.referralReward} off. It's applied at checkout automatically.</Text>
          </View>
        )}
        {/* Quiz: sorts the shopper into a segment (ICP) and ranks products for it; afterwards, their picks */}
        {profile && forYou.length ? (
          <View style={{ marginTop: S.lg }}>
            <SectionHeader title={`For you: ${icpOf(profile).title}`} sub={icpOf(profile).line} action="Retake" onAction={() => router.push({ pathname: '/quiz', params: { from: 'home_retake' } })} />
            <ProductGrid items={forYou} width={width} />
          </View>
        ) : showQuiz && (
          <Pressable onPress={() => { track('quiz_entry_tap', { from: 'home' }); router.push({ pathname: '/quiz', params: { from: 'home' } }); }} accessibilityRole="button"
            style={{ margin: S.lg, marginBottom: 0, padding: S.lg, borderRadius: R.lg, backgroundColor: C.buy, borderWidth: 1, borderColor: C.buyEdge, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="sparkles" size={24} color={C.ink} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.ink, fontWeight: '800', fontSize: 16 }}>Find your match in 30 seconds</Text>
              <Text style={{ color: C.ink2, marginTop: 2 }}>3 quick questions, then picks for your skin, goals or size.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.ink} />
          </Pressable>
        )}
        {/* Shelby: ask in plain words, plus a daily row of picks (the reason to open the app each day) */}
        <Pressable onPress={() => router.push('/ask')} accessibilityRole="button" accessibilityLabel="Ask Shelby" style={{ margin: S.lg, marginBottom: 0, padding: S.md, paddingLeft: 4, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Shelby size={52} />
          <View style={{ flex: 1 }}>
            <Text style={T.h3}>Ask Shelby</Text>
            <Text style={T.small}>"A gift for my dad under $40"</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.ink2} />
        </Pressable>
        {/* Shop by category: one store, every niche a tap away */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 14, paddingTop: S.lg }}>
          {categories.filter(c => c !== 'All').map(c => {
            const img = products.find(p => p.category === c && p.stock > 0)?.image;
            return (
              <Pressable key={c} onPress={() => { track('home_category', { category: c }); router.push({ pathname: '/search', params: { cat: c } }); }} style={{ alignItems: 'center', width: 70 }} accessibilityRole="button" accessibilityLabel={`Shop ${c}`}>
                <View style={{ padding: 2.5, borderRadius: 40, borderWidth: 2.5, borderColor: C.brand }}>
                  <Image source={{ uri: img }} style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: C.photo }} />
                </View>
                <Text numberOfLines={1} style={{ fontSize: 11, marginTop: 6, color: C.ink2, fontWeight: '600' }}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Sets and guides: the offer, listicle and story pages (src/data/pages.json) */}
        {guides.length > 0 && <>
          <SectionHeader title="Sets and guides" sub="Routines, edits and how-tos from the Shelby team" action="Blog" onAction={() => router.push('/blog')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12, paddingBottom: S.sm }}>
            {guides.map(g => (
              <Pressable key={g.href} onPress={() => { track('home_page_card', { page_type: g.type, slug: g.slug }); router.push(g.href as any); }} accessibilityRole="link" accessibilityLabel={`${g.kicker}: ${g.title}`}
                style={({ pressed }) => ({ width: 220, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, overflow: 'hidden', opacity: pressed ? 0.9 : 1 })}>
                <Image source={{ uri: g.image }} style={{ width: 220, height: 120, backgroundColor: C.photo }} resizeMode="cover" />
                <View style={{ padding: S.md }}>
                  <Text style={[T.tiny, { color: C.accent }]}>{g.kicker.toUpperCase()}</Text>
                  <Text numberOfLines={3} style={[T.h3, { marginTop: 2 }]}>{g.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>}

        {/* Drop: scarcity + countdown + remind me */}
        {drop && <Pressable onPress={() => router.push('/drops')} style={{ margin: S.lg, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.dark }}>
          <Image source={{ uri: getProduct(drop.productId).images[0] }} style={{ position: 'absolute', right: -20, top: 0, bottom: 0, width: '55%', opacity: 0.9 }} resizeMode="cover" />
          <View style={{ padding: S.lg, width: '62%' }}>
            <Pill text="TODAY'S DROP" tone="accent" icon="flash" />
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 10 }}>{drop.title}</Text>
            <Text style={{ color: '#CFC7BC', fontSize: 13, marginTop: 4 }}>Limited run · only {drop.qty} made</Text>
            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 12, fontVariant: ['tabular-nums'] }}>{cd.text}</Text>
            <Pressable onPress={() => remind(drop.id)} accessibilityRole="button" style={{ marginTop: 12, alignSelf: 'flex-start', backgroundColor: reminders.includes(drop.id) ? C.good : C.accent, paddingHorizontal: 14, height: 38, borderRadius: R.pill, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name={reminders.includes(drop.id) ? 'checkmark' : 'notifications'} size={16} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '800' }}>{reminders.includes(drop.id) ? "You'll get a ping" : 'Remind me'}</Text>
            </Pressable>
            {(dropCounts[drop.id] ?? 0) >= 3 && <Text style={{ color: '#CFC7BC', fontSize: 11, marginTop: 8 }}>{compact(dropCounts[drop.id])} people waiting</Text>}
          </View>
        </Pressable>}

        <SectionHeader title="Shelby's picks for you" sub={onboarded ? 'Fresh every morning' : 'Tell Shelby what you like to tune these'} action={onboarded ? 'Ask' : 'Tune'} onAction={() => router.push(onboarded ? '/ask' : '/onboarding')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12, paddingBottom: S.lg }}>
          {shelbyPicks.map(p => <ProductCard key={p.id} p={p} width={150} />)}
        </ScrollView>

        {/* Shoppable videos: shops show their work; tap a clip to watch and shop without leaving it */}
        {videos.length > 0 && <>
          <SectionHeader title="Shop the videos" sub="Tap to watch, shop without leaving." action="Watch" onAction={() => router.push('/watch')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 10, paddingBottom: S.lg }}>
            {videos.map(v => (
              <Pressable key={v.id} onPress={() => router.push({ pathname: '/watch', params: { start: v.id } })} accessibilityRole="button" accessibilityLabel={`Watch ${v.product.title}`}
                style={({ pressed }) => ({ width: 118, height: 210, borderRadius: R.lg, overflow: 'hidden', backgroundColor: '#F7EEE5', opacity: pressed ? 0.9 : 1 })}>
                <Image source={{ uri: v.poster }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{ position: 'absolute', top: 8, left: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="play" size={14} color="#fff" /></View>
                <View style={{ position: 'absolute', left: 6, right: 6, bottom: 6, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: 6 }}>
                  <Text numberOfLines={1} style={{ fontSize: 11, fontWeight: '700', color: C.ink }}>{v.product.title}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: C.ink }}>{money(v.product.price)}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </>}

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


        <SectionHeader title={cat === 'All' ? (interests.length ? 'Picked for you' : 'Trending now') : cat} sub={cat === 'All' && interests.length ? `Because you like ${interests.slice(0, 2).join(' and ')}` : 'What people are buying this week'} action="See all" onAction={() => router.push('/search')} />
        <ProductGrid items={feed} width={width} />


      </ScrollView>
    </SafeAreaView>
  );
}
