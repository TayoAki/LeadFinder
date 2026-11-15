// Quiz result page: the shopper's segment (ICP), ranked picks, a routine/starter set made only of
// genuine matches, and the offer and guides written for that segment. Opened by the quiz, or
// directly from an ad (/match/skin_barrier) using that segment's starting answers.
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PageNotFound } from '@/components/PageBlocks';
import { ProductGrid } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { track } from '@/lib/analytics';
import { money } from '@/lib/data';
import { icpOf, matchScore, pagesForIcp, presetFor, rankFor } from '@/lib/icp';
import { advertorialPage, listiclePage, offerPage } from '@/lib/pages';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Match() {
  const { icp } = useLocalSearchParams<{ icp: string }>();
  const { width } = useWindowDimensions();
  const { profile, add } = useStore();
  const p = profile?.icp === icp ? profile : presetFor(String(icp));
  useEffect(() => { track('page_view', { page_type: 'quiz_result', slug: String(icp), own_answers: profile?.icp === icp }); }, [icp]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p) return <PageNotFound />;

  const info = icpOf(p);
  const picks = rankFor(p).slice(0, 6);
  // Only items that genuinely match an answer go in the set (never filler to raise the basket).
  const routine = picks.filter(x => !x.sizes.length && matchScore(p, x) > 0).slice(0, p.area === 'skin' ? 3 : 2);
  const links = pagesForIcp(p.icp);
  const offer = links.offer ? offerPage(links.offer) : undefined;
  const guide = links.guide ? listiclePage(links.guide) : undefined;
  const story = links.story ? advertorialPage(links.story) : undefined;
  const reads = [offer && { href: `/offer/${offer.slug}`, kicker: offer.kicker, title: offer.title }, guide && { href: `/list/${guide.slug}`, kicker: 'Guide', title: guide.title }, story && { href: `/story/${story.slug}`, kicker: 'Story', title: story.title }].filter(Boolean) as { href: string; kicker: string; title: string }[];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Your match" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ margin: S.lg, padding: S.lg, borderRadius: R.lg, backgroundColor: C.buy, borderWidth: 1, borderColor: C.buyEdge }}>
          <Text style={[T.tiny, { color: C.ink }]}>YOUR MATCH</Text>
          <Text style={{ color: C.ink, fontSize: 28, fontWeight: '900', marginTop: 6 }}>{info.title}</Text>
          <Text style={{ color: C.ink2, marginTop: 6, fontSize: 15, lineHeight: 21 }}>{info.line} Here's what fits, best match first.</Text>
        </View>
        {routine.length >= 2 && (
          <View style={{ marginHorizontal: S.lg, marginBottom: S.lg, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, gap: 8 }}>
            <Text style={T.h3}>{p.area === 'skin' ? 'Your routine' : 'Your starter set'}</Text>
            <Text style={T.small}>{routine.map(x => x.title).join(' + ')}</Text>
            <Button title={`Add all ${routine.length} · ${money(routine.reduce((n, x) => n + x.price, 0))}`} kind="buy" icon="bag-add"
              onPress={() => { routine.forEach((x, i) => add(x, null, 1, { toast: i === routine.length - 1 ? `Added ${routine.length} items` : false })); track('quiz_result_add', { icp: p.icp, items: routine.length }); }} />
          </View>
        )}
        {picks.length ? <ProductGrid items={picks} width={width} /> : <Text style={[T.body, { padding: S.lg, color: C.ink2 }]}>Nothing in stock fits all your answers yet. Try a higher budget, or browse everything.</Text>}
        {reads.length > 0 && <View style={{ padding: S.lg, gap: 10 }}>
          <Text style={T.h2}>Made for your match</Text>
          {reads.map(r => (
            <Pressable key={r.href} onPress={() => { track('quiz_result_read', { icp: p.icp, to: r.href }); router.push(r.href as any); }} accessibilityRole="link"
              style={{ padding: S.md, borderRadius: R.lg, backgroundColor: C.accentSoft }}>
              <Text style={[T.tiny, { color: C.accent }]}>{r.kicker.toUpperCase()}</Text>
              <Text style={[T.h3, { marginTop: 2 }]}>{r.title}</Text>
            </Pressable>
          ))}
        </View>}
        <View style={{ paddingHorizontal: S.lg, gap: 10, marginTop: S.md }}>
          <Button title="Keep shopping" kind="primary" onPress={() => router.replace('/')} />
          <Button title="Retake the quiz" kind="ghost" onPress={() => { track('quiz_retake', {}); router.replace({ pathname: '/quiz', params: { from: 'result' } }); }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
