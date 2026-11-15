// Renders a generated catalogue post (listicle or advertorial) from the Shelby server. Same blocks
// the server writes into the HTML for search engines: intro, numbered sections (listicles),
// size tables, bullets, FAQ, sibling post, related posts. The buy bar goes to the store product
// printed on this blank when Shelby sells one, otherwise to the closest store category.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { PageNotFound, ProductRow, StickyCTA } from '@/components/PageBlocks';
import { track } from '@/lib/analytics';
import { type Block, type CatalogPost as Post, fetchPost, productForBlueprint, shopLinkFor } from '@/lib/blog';
import { C, R, S, T } from '@/lib/theme';

function Table({ t }: { t: NonNullable<Block['table']> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: S.md }}>
      <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: R.md, overflow: 'hidden' }}>
        {[t.head, ...t.rows].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', backgroundColor: i === 0 ? C.bg : C.surface }}>
            {row.map((c, j) => <Text key={j} style={{ width: j === 0 ? 64 : 108, padding: 8, fontSize: 13, fontWeight: i === 0 || j === 0 ? '800' : '400', color: C.ink }}>{c}</Text>)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Section({ b, n }: { b: Block; n?: number }) {
  return (
    <View style={{ marginTop: S.xl }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        {n != null && <View style={{ width: 32, height: 32, borderRadius: R.pill, backgroundColor: C.buy, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.buyInk, fontWeight: '900' }}>{n}</Text></View>}
        <Text style={[T.h2, { flex: 1 }]}>{b.h}</Text>
      </View>
      {!!b.p && <Text style={[T.body, { marginTop: 6, fontSize: 16, lineHeight: 24 }]}>{b.p}</Text>}
      {b.bullets?.map((x, i) => <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}><Text style={{ color: C.accent, fontWeight: '900' }}>•</Text><Text style={[T.body, { flex: 1 }]}>{x}</Text></View>)}
      {b.table && <Table t={b.table} />}
    </View>
  );
}

export function CatalogPostScreen({ slug, kind }: { slug: string; kind: 'listicle' | 'advertorial' }) {
  const [post, setPost] = useState<Post | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    fetchPost(slug).then(p => { if (!live) return; if (p.type !== kind) { setState('missing'); return; } setPost(p); setState('ok'); track('page_view', { page_type: kind, slug, source: 'catalog', category: p.category }); })
      .catch(() => live && setState('missing'));
    return () => { live = false; };
  }, [slug, kind]);

  if (state === 'missing') return <PageNotFound />;
  if (!post) return <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.ink} /></SafeAreaView>;

  const product = productForBlueprint(post.blueprint_id);
  const shop = shopLinkFor(post.category);
  const blocks = post.items ?? post.sections ?? [];
  const go = (href: string, what: string) => { track('page_cta', { page_type: kind, slug, to: href, what }); router.push(href as any); };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title={kind === 'listicle' ? 'Guide' : 'Story'} />
      <PageIn>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {!!post.image && <Image source={{ uri: post.image }} style={{ width: '100%', height: 260, backgroundColor: C.photo }} resizeMode="contain" accessibilityLabel={post.product_title} />}
        <View style={{ padding: S.lg }}>
          {kind === 'advertorial'
            ? <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.sm, borderWidth: 1, borderColor: C.line }}><Text style={[T.tiny, { color: C.ink3 }]}>ADVERTISEMENT · FROM THE SHELBY TEAM</Text></View>
            : <Text style={[T.tiny, { color: C.accent }]}>{`SHELBY GUIDE · ${post.category}`.toUpperCase()}</Text>}
          <Text style={[T.h1, { marginTop: S.sm, fontSize: 28, lineHeight: 34 }]}>{post.title}</Text>
          <Text style={[T.small, { marginTop: 6 }]}>{post.mins} min read · {post.product_name}</Text>
          {(post.intro ?? [post.dek ?? '']).filter(Boolean).map((x, i) => <Text key={i} style={[T.body, { marginTop: S.md, fontSize: 17, lineHeight: 25, color: i ? C.ink2 : C.ink }]}>{x}</Text>)}

          {product ? <ProductRow p={product} source={`catalog:${slug}`} />
            : <View style={{ marginTop: S.md, padding: S.md, borderRadius: R.lg, backgroundColor: C.buySoft, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={20} color={C.ink} />
                <Text style={[T.small, { flex: 1, color: C.ink }]}>We don't sell this exact piece yet. This guide tells you what to look for; the button below shows what we do sell.</Text>
              </View>}
          {blocks.map((b, i) => <Section key={i} b={b} n={kind === 'listicle' ? i + 1 : undefined} />)}

          {post.faq.length > 0 && <>
            <Text style={[T.h2, { marginTop: S.xl }]}>Frequently asked questions</Text>
            {post.faq.map((f, i) => (
              <Pressable key={f.q} onPress={() => setOpen(open === i ? null : i)} accessibilityRole="button" accessibilityState={{ expanded: open === i }} style={{ paddingVertical: S.md, borderBottomWidth: 1, borderBottomColor: C.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={[T.h3, { flex: 1 }]}>{f.q}</Text><Ionicons name={open === i ? 'remove' : 'add'} size={20} color={C.ink2} /></View>
                {open === i && <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>{f.a}</Text>}
              </Pressable>
            ))}
          </>}

          {post.sibling && (
            <Pressable onPress={() => go(post.sibling!.href, 'sibling')} accessibilityRole="link" style={{ marginTop: S.xl, padding: S.md, borderRadius: R.lg, backgroundColor: C.accentSoft }}>
              <Text style={[T.tiny, { color: C.accent }]}>{post.sibling.type === 'listicle' ? 'READ THE GUIDE' : 'READ THE STORY'}</Text>
              <Text style={[T.h3, { marginTop: 2 }]}>{post.sibling.title}</Text>
            </Pressable>
          )}
          {post.related.length > 0 && <>
            <Text style={[T.h2, { marginTop: S.xl }]}>More {post.category.toLowerCase()}</Text>
            {post.related.map(r => (
              <Pressable key={r.slug} onPress={() => go(r.href, 'related')} accessibilityRole="link" style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: S.sm }}>
                {!!r.image && <Image source={{ uri: r.image }} style={{ width: 56, height: 56, borderRadius: R.md, backgroundColor: C.photo }} />}
                <Text style={[T.h3, { flex: 1 }]} numberOfLines={2}>{r.title}</Text>
              </Pressable>
            ))}
          </>}
          <Pressable onPress={() => go(`/blog?category=${encodeURIComponent(post.category)}`, 'hub')} accessibilityRole="link" style={{ marginTop: S.lg }}>
            <Text style={{ color: C.accent, fontWeight: '800' }}>All {post.category.toLowerCase()} guides and stories</Text>
          </Pressable>
        </View>
      </ScrollView>
      </PageIn>
      {product
        ? <StickyCTA label={`Shop the ${product.title}`} onPress={() => go(`/product/${product.id}`, 'product')} />
        : <StickyCTA label={shop.label} icon="storefront-outline" onPress={() => go(shop.to, 'shop')} note="This exact piece isn't in the store yet" />}
    </SafeAreaView>
  );
}
