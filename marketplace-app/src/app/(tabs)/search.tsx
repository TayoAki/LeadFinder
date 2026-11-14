import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from '@/components/ProductCard';
import { Chip, Stars } from '@/components/ui';
import { categories, compact, products, shops } from '@/lib/data';
import { C, R, S, T } from '@/lib/theme';

const sorts = ['Popular', 'Newest', 'Price: low', 'Price: high', 'Top rated'] as const;
const prices = [{ label: 'Any price', max: Infinity }, { label: 'Under $25', max: 25 }, { label: 'Under $50', max: 50 }, { label: 'Under $100', max: 100 }];
const trending = ['ceramic mug', 'linen dress', 'body oil', 'trail pack', 'gold hoops'];

export default function Search() {
  const { width } = useWindowDimensions();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState<(typeof sorts)[number]>('Popular');
  const [price, setPrice] = useState(0);
  const [onSale, setOnSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    let r = products.filter(p => (cat === 'All' || p.category === cat) && p.price <= prices[price].max && (!onSale || p.compareAt)
      && words.every(w => `${p.title} ${p.category} ${p.description} ${shops.find(s => s.id === p.shopId)!.name}`.toLowerCase().includes(w)));
    const by = { Popular: (a: any, b: any) => b.sold - a.sold, Newest: (a: any, b: any) => Number(b.id) - Number(a.id), 'Price: low': (a: any, b: any) => a.price - b.price, 'Price: high': (a: any, b: any) => b.price - a.price, 'Top rated': (a: any, b: any) => b.rating - a.rating }[sort];
    return [...r].sort(by);
  }, [q, cat, sort, price, onSale]);
  const shopHits = q ? shops.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase())) : [];
  const filterCount = (price ? 1 : 0) + (onSale ? 1 : 0) + (sort !== 'Popular' ? 1 : 0);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: S.lg, paddingBottom: S.sm }}>
        <View style={{ flex: 1, height: 46, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
          <Ionicons name="search" size={18} color={C.ink3} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search products and shops" placeholderTextColor={C.ink3} returnKeyType="search" style={{ flex: 1, fontSize: 15, color: C.ink, outlineStyle: 'none' } as any} accessibilityLabel="Search" />
          {!!q && <Pressable onPress={() => setQ('')} accessibilityLabel="Clear search"><Ionicons name="close-circle" size={18} color={C.ink3} /></Pressable>}
        </View>
        <Pressable onPress={() => setShowFilters(v => !v)} accessibilityRole="button" accessibilityLabel="Filters" style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: showFilters || filterCount ? C.ink : C.surface, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="options" size={20} color={showFilters || filterCount ? '#fff' : C.ink} />
          {!!filterCount && <View style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{filterCount}</Text></View>}
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 8, alignItems: 'center' }} style={{ flexGrow: 0, flexShrink: 0, minHeight: 44 }}>
        {categories.map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>

      {showFilters && (
        <View style={{ margin: S.lg, marginBottom: 0, padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, gap: 10 }}>
          <Text style={T.tiny}>SORT</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{sorts.map(s => <Chip key={s} label={s} active={sort === s} onPress={() => setSort(s)} />)}</View>
          <Text style={T.tiny}>PRICE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{prices.map((p, i) => <Chip key={p.label} label={p.label} active={price === i} onPress={() => setPrice(i)} />)}</View>
          <Chip label="On sale" icon="pricetag" active={onSale} onPress={() => setOnSale(v => !v)} />
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => router.push(q ? { pathname: '/ask', params: { q } } : '/ask')} accessibilityRole="button" style={{ marginHorizontal: S.lg, marginTop: S.md, padding: S.md, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Ionicons name="sparkles" size={18} color={C.accent} />
          <Text style={{ flex: 1, fontWeight: '700', color: C.ink }}>{q ? `Ask Shelby about "${q}"` : 'Not sure what to search? Ask Shelby'}</Text>
          <Ionicons name="chevron-forward" size={16} color={C.ink2} />
        </Pressable>
        {!q && (
          <View style={{ padding: S.lg }}>
            <Text style={T.tiny}>TRENDING SEARCHES</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {trending.map(t => <Chip key={t} label={t} icon="trending-up" onPress={() => setQ(t.split(' ')[0])} />)}
            </View>
          </View>
        )}
        {shopHits.map(s => (
          <Pressable key={s.id} onPress={() => router.push(`/shop/${s.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: S.lg, marginTop: S.md, padding: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
            <Image source={{ uri: s.logo }} style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View style={{ flex: 1 }}><Text style={T.h3}>{s.name}</Text><Text style={T.small}>{compact(s.followers)} followers</Text></View>
            <Stars value={s.rating} />
          </Pressable>
        ))}
        <Text style={[T.small, { paddingHorizontal: S.lg, marginVertical: S.md }]}>{results.length} results{q ? ` for "${q}"` : ''}</Text>
        {results.length ? <ProductGrid items={results} width={width} /> : (
          <View style={{ alignItems: 'center', padding: S.xxl }}>
            <Ionicons name="search-outline" size={40} color={C.ink3} />
            <Text style={[T.h3, { marginTop: 8 }]}>Nothing matches yet</Text>
            <Text style={[T.small, { textAlign: 'center', marginTop: 4 }]}>Try a broader word, or clear the filters.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
