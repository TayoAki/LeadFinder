// Advertorial: an editorial-style story that leads to an offer. Always labelled as an advertisement,
// written in the store's own voice (no invented customers or quotes).
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CatalogPostScreen } from '@/components/CatalogPost';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { Disclaimer, PageNotFound, ProductRow, StickyCTA } from '@/components/PageBlocks';
import { track } from '@/lib/analytics';
import { advertorialPage, disclaimerFor, slotProduct } from '@/lib/pages';
import { C, R, S, T } from '@/lib/theme';

export default function Story() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const a = advertorialPage(String(slug));
  useEffect(() => { if (a) track('page_view', { page_type: 'advertorial', slug: String(slug), found: true }); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!a) return <CatalogPostScreen slug={String(slug)} kind="advertorial" />; // generated catalogue post

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Story" />
      <PageIn>
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 140 }}>
        <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.sm, borderWidth: 1, borderColor: C.line }}>
          <Text style={[T.tiny, { color: C.ink3 }]}>ADVERTISEMENT · {a.kicker.toUpperCase()}</Text>
        </View>
        <Text style={[T.h1, { marginTop: S.md, fontSize: 30, lineHeight: 36 }]}>{a.title}</Text>
        <Text style={[T.body, { color: C.ink2, marginTop: 8, fontSize: 17, lineHeight: 25 }]}>{a.dek}</Text>
        <View style={{ height: 1, backgroundColor: C.line, marginVertical: S.lg }} />
        {a.sections.map((s, i) => {
          const p = slotProduct(a, s);
          return (
            <View key={i} style={{ marginBottom: S.lg }}>
              {!!s.h && <Text style={[T.h2, { marginBottom: 6 }]}>{s.h}</Text>}
              <Text style={[T.body, { fontSize: 16, lineHeight: 25 }]}>{s.p}</Text>
              {p && <ProductRow p={p} source={`advertorial:${a.slug}`} />}
            </View>
          );
        })}
        <Disclaimer text={disclaimerFor(a.niche)} />
      </ScrollView>
      </PageIn>
      <StickyCTA label={a.cta.label} icon="arrow-forward" onPress={() => { track('page_cta', { page_type: 'advertorial', slug: a.slug, to: a.cta.to }); router.push(a.cta.to as any); }} />
    </SafeAreaView>
  );
}
