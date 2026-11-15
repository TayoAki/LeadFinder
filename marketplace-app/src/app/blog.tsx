// Shelby blog: every live guide (listicle) and story (advertorial), grouped by category. Posts only
// appear while their category has products (src/lib/pages.ts), so new categories show up on their own
// once something is published in them.
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { Chip } from '@/components/ui';
import { track } from '@/lib/analytics';
import { blogPosts } from '@/lib/pages';
import { C, R, S, T } from '@/lib/theme';

export default function Blog() {
  const posts = useMemo(() => blogPosts(), []);
  const cats = useMemo(() => ['All', ...new Set(posts.map(p => p.category ?? 'More'))], [posts]);
  const [cat, setCat] = useState('All');
  useEffect(() => { track('page_view', { page_type: 'blog', slug: 'index', posts: posts.length }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = posts.filter(p => cat === 'All' || (p.category ?? 'More') === cat);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Shelby blog" />
      <PageIn>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: S.lg }}>
          <Text style={T.h1}>Guides and stories</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 4 }]}>How to wear it, use it and choose it, from the Shelby team.</Text>
        </View>
        {cats.length > 2 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 8, paddingVertical: S.md }}>
            {cats.map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
          </ScrollView>
        )}
        <View style={{ paddingHorizontal: S.lg, gap: S.md, marginTop: S.md }}>
          {shown.map(p => (
            <Pressable key={p.href} onPress={() => { track('blog_open', { page_type: p.type, slug: p.slug }); router.push(p.href as any); }} accessibilityRole="link" accessibilityLabel={`${p.kicker}: ${p.title}`}
              style={({ pressed }) => ({ flexDirection: 'row', gap: 12, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, opacity: pressed ? 0.9 : 1 })}>
              <Image source={{ uri: p.image }} style={{ width: 96, height: 96, borderRadius: R.md, backgroundColor: C.photo }} />
              <View style={{ flex: 1 }}>
                <Text style={[T.tiny, { color: C.accent }]}>{`${p.kicker} · ${p.category ?? ''}`.toUpperCase().replace(/ · $/, '')}</Text>
                <Text numberOfLines={3} style={[T.h3, { marginTop: 2 }]}>{p.title}</Text>
                <Text style={[T.small, { marginTop: 4 }]}>{p.mins} min read{p.type === 'advertorial' ? ' · Ad' : ''}</Text>
              </View>
            </Pressable>
          ))}
          {!shown.length && <Text style={[T.body, { color: C.ink2 }]}>New posts are on the way.</Text>}
        </View>
      </ScrollView>
      </PageIn>
    </SafeAreaView>
  );
}
