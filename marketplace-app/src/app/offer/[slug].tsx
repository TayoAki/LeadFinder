// Offer page: one set of products, one decision. Hero → what's in it → why → guarantee → FAQ,
// with a fixed "Add the set" bar. Prices are the real product prices; no invented discount.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { Disclaimer, Guarantee, PageNotFound, ProductRow, StickyCTA } from '@/components/PageBlocks';
import { track } from '@/lib/analytics';
import { money } from '@/lib/data';
import { byTitle, disclaimerFor, offerPage, offerProducts } from '@/lib/pages';
import { useStore } from '@/lib/store';
import { C, S, T } from '@/lib/theme';

export default function Offer() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const { add } = useStore();
  const o = offerPage(String(slug));
  const [open, setOpen] = useState<number | null>(0);
  useEffect(() => { track('page_view', { page_type: 'offer', slug: String(slug), found: !!o }); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!o) return <PageNotFound />;

  const items = offerProducts(o);
  const ready = items.filter(p => p.stock > 0 && !p.sizes.length);
  const sized = items.filter(p => p.stock > 0 && p.sizes.length);
  const total = ready.reduce((n, p) => n + p.price, 0);
  const was = ready.reduce((n, p) => n + (p.compareAt ?? p.price), 0);
  const hero = byTitle(o.image)?.image ?? items[0]?.image;

  const addSet = () => {
    track('offer_add_set', { slug: o.slug, items: ready.length, total });
    ready.forEach((p, i) => add(p, null, 1, { toast: i === ready.length - 1 ? `Added ${ready.length} items` : false }));
    if (sized[0]) router.push(`/product/${sized[0].id}`); // sizes still need choosing
    else router.push('/cart');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title={o.kicker} />
      <PageIn>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {!!hero && <Image source={{ uri: hero }} style={{ width, height: Math.min(width, 520) * 0.8, backgroundColor: C.photo }} resizeMode="cover" accessibilityIgnoresInvertColors />}
        <View style={{ padding: S.lg }}>
          <Text style={[T.tiny, { color: C.accent }]}>{o.kicker.toUpperCase()}</Text>
          <Text style={[T.h1, { marginTop: 6 }]}>{o.title}</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 8 }]}>{o.sub}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: S.md }}>
            {ready.length ? <>
              <Text style={{ fontSize: 26, fontWeight: '900', color: C.ink }}>{money(total)}</Text>
              {was > total && <Text style={{ fontSize: 16, color: C.ink3, textDecorationLine: 'line-through' }}>{money(was)}</Text>}
              <Text style={T.small}>for {ready.length} item{ready.length === 1 ? '' : 's'}{sized.length ? ' + your pick of size' : ''}</Text>
            </> : <>
              {/* Everything here needs a size: show the starting price instead of an empty total. */}
              <Text style={T.small}>From</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: C.ink }}>{money(Math.min(...sized.map(p => p.price)))}</Text>
            </>}
          </View>

          <Text style={[T.h2, { marginTop: S.xl }]}>What's in it</Text>
          {items.map(p => <ProductRow key={p.id} p={p} source={`offer:${o.slug}`} />)}

          <View style={{ marginTop: S.xl, gap: 10 }}>
            {o.bullets.map(b => (
              <View key={b} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={20} color={C.good} />
                <Text style={[T.body, { flex: 1 }]}>{b}</Text>
              </View>
            ))}
          </View>
          <Guarantee text={o.guarantee} />

          <Text style={[T.h2, { marginTop: S.xl }]}>Questions</Text>
          {o.faq.map((f, i) => (
            <Pressable key={f.q} onPress={() => setOpen(open === i ? null : i)} accessibilityRole="button" accessibilityState={{ expanded: open === i }}
              style={{ paddingVertical: S.md, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[T.h3, { flex: 1 }]}>{f.q}</Text>
                <Ionicons name={open === i ? 'remove' : 'add'} size={20} color={C.ink2} />
              </View>
              {open === i && <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>{f.a}</Text>}
            </Pressable>
          ))}
          <Disclaimer text={disclaimerFor(o.niche)} />
        </View>
      </ScrollView>
      </PageIn>
      {ready.length > 0 ? <StickyCTA label={`Add the set · ${money(total)}`} onPress={addSet} note={sized.length ? 'Then pick your size' : 'Free returns within 30 days'} />
        : sized.length > 0 && <StickyCTA label={sized.length === 1 ? 'Choose your size' : 'Choose sizes'} icon="resize-outline" onPress={() => { track('offer_choose_size', { slug: o.slug }); router.push(`/product/${sized[0].id}`); }} />}
    </SafeAreaView>
  );
}
