// Shelby blog: hand-written guides and stories (src/data/pages.json, shown while their products are
// live) plus a buying guide (listicle) and a story (advertorial) for every product in Printify's
// catalogue, served by the Shelby server. Filter by category, search by product, load 20 at a time.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PageIn } from '@/components/Motion';
import { Button, Chip } from '@/components/ui';
import { track } from '@/lib/analytics';
import { fetchPosts, type PostSummary } from '@/lib/blog';
import { blogPosts } from '@/lib/pages';
import { C, R, S, T } from '@/lib/theme';

type Card = { href: string; title: string; image?: string | null; kicker: string; meta: string };

function PostCard({ c }: { c: Card }) {
  return (
    <Pressable onPress={() => { track('blog_open', { to: c.href }); router.push(c.href as any); }} accessibilityRole="link" accessibilityLabel={`${c.kicker}: ${c.title}`}
      style={({ pressed }) => ({ flexDirection: 'row', gap: 12, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, opacity: pressed ? 0.9 : 1 })}>
      <Image source={{ uri: c.image ?? undefined }} style={{ width: 88, height: 88, borderRadius: R.md, backgroundColor: C.photo }} resizeMode="contain" />
      <View style={{ flex: 1 }}>
        <Text style={[T.tiny, { color: C.accent }]} numberOfLines={1}>{c.kicker.toUpperCase()}</Text>
        <Text numberOfLines={3} style={[T.h3, { marginTop: 2 }]}>{c.title}</Text>
        <Text style={[T.small, { marginTop: 4 }]} numberOfLines={1}>{c.meta}</Text>
      </View>
    </Pressable>
  );
}

const fromRemote = (p: PostSummary): Card => ({ href: p.href, title: p.title, image: p.image, kicker: `${p.type === 'listicle' ? 'Guide' : 'Story'} · ${p.category}`, meta: `${p.product_name}${p.type === 'advertorial' ? ' · Ad' : ''}` });

export default function Blog() {
  const params = useLocalSearchParams<{ category?: string }>();
  const local = useMemo(() => blogPosts(), []);
  const [category, setCategory] = useState(params.category ?? '');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [cats, setCats] = useState<{ name: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setQuery(q.trim()), 350); return () => clearTimeout(t); }, [q]);
  useEffect(() => { setPage(1); }, [category, query]);
  useEffect(() => {
    let live = true; setLoading(true);
    fetchPosts({ category, q: query, page }).then(r => {
      if (!live) return;
      setPosts(prev => (page === 1 ? r.posts : [...prev, ...r.posts])); setCats(r.categories); setTotal(r.total);
    }).catch(() => {}).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [category, query, page]);
  useEffect(() => { track('page_view', { page_type: 'blog', slug: 'index', category: category || 'all' }); }, [category]);

  const localShown = !category && !query ? local : [];
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header back title="Shelby blog" />
      <PageIn>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={{ paddingHorizontal: S.lg }}>
          <Text style={T.h1}>Guides and stories</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 4 }]}>Buying guides for every product we can print: fabric, fit, sizes, print areas, production and shipping.</Text>
          <View style={{ marginTop: S.md, height: 46, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
            <Ionicons name="search" size={18} color={C.ink3} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search a product, brand or model" placeholderTextColor={C.ink3} accessibilityLabel="Search the blog" style={{ flex: 1, fontSize: 15, color: C.ink, outlineStyle: 'none' } as any} />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 8, paddingVertical: S.md }}>
          <Chip label="All" active={!category} onPress={() => setCategory('')} />
          {cats.map(c => <Chip key={c.name} label={`${c.name} (${c.count})`} active={category === c.name} onPress={() => setCategory(c.name)} />)}
        </ScrollView>
        <View style={{ paddingHorizontal: S.lg, gap: S.md }}>
          {localShown.map(p => <PostCard key={p.href} c={{ href: p.href, title: p.title, image: p.image, kicker: `${p.kicker}${p.category ? ` · ${p.category}` : ''}`, meta: `${p.mins} min read${p.type === 'advertorial' ? ' · Ad' : ''}` }} />)}
          {posts.map(p => <PostCard key={p.slug} c={fromRemote(p)} />)}
          {loading && <ActivityIndicator color={C.ink} style={{ marginTop: S.lg }} />}
          {!loading && !posts.length && !localShown.length && <Text style={[T.body, { color: C.ink2 }]}>No posts match that yet.</Text>}
          {!loading && posts.length < total && <Button title={`Load more (${total - posts.length} left)`} kind="ghost" onPress={() => setPage(n => n + 1)} />}
        </View>
      </ScrollView>
      </PageIn>
    </SafeAreaView>
  );
}
