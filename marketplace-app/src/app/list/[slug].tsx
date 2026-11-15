// Listicle: "N things to know…" — numbered, skimmable, each point can carry the product it's about,
// ending on one call to action (usually the matching offer page).
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CatalogPostScreen } from '@/components/CatalogPost';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { Disclaimer, PageNotFound, ProductRow, StickyCTA } from '@/components/PageBlocks';
import { track } from '@/lib/analytics';
import { disclaimerFor, listiclePage, slotProduct } from '@/lib/pages';
import { C, R, S, T } from '@/lib/theme';

export default function Listicle() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const l = listiclePage(String(slug));
  useEffect(() => { if (l) track('page_view', { page_type: 'listicle', slug: String(slug), found: true }); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!l) return <CatalogPostScreen slug={String(slug)} kind="listicle" />; // generated catalogue post

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Guide" />
      <PageIn>
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 140 }}>
        <Text style={[T.tiny, { color: C.accent }]}>SHELBY GUIDE</Text>
        <Text style={[T.h1, { marginTop: 6 }]}>{l.title}</Text>
        <Text style={[T.body, { color: C.ink2, marginTop: 8 }]}>{l.intro}</Text>
        {l.items.map((it, i) => {
          const p = slotProduct(l, it);
          return (
            <View key={it.title} style={{ marginTop: S.xl }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 34, height: 34, borderRadius: R.pill, backgroundColor: C.buy, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: C.buyInk, fontWeight: '900', fontSize: 16 }}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={T.h2}>{it.title}</Text>
                  <Text style={[T.body, { color: C.ink2, marginTop: 4 }]}>{it.body}</Text>
                </View>
              </View>
              {p && <ProductRow p={p} source={`listicle:${l.slug}`} />}
            </View>
          );
        })}
        <Disclaimer text={disclaimerFor(l.niche)} />
      </ScrollView>
      </PageIn>
      <StickyCTA label={l.cta.label} icon="arrow-forward" onPress={() => { track('page_cta', { page_type: 'listicle', slug: l.slug, to: l.cta.to }); router.push(l.cta.to as any); }} />
    </SafeAreaView>
  );
}
