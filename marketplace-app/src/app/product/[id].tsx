import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrustLine } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { Button, Chip, IconButton, Pill, Price, SectionHeader, Stars } from '@/components/ui';
import { compact, getProduct, getShop, money, reviewsFor, shopProducts } from '@/lib/data';
import { groupCart, useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';
import { videoForProduct } from '@/lib/videos';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const p = getProduct(id);
  useEffect(() => { if (p) track('product_view', { product_id: p.id, title: p.title.slice(0, 80), price: p.price, shop_id: p.shopId, category: p.category, in_stock: p.stock > 0 }); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p) return <Redirect href="/search" />;
  const shop = getShop(p.shopId);
  const { add, cart, wishlist, toggleWish, following, toggleFollow, cartCount, user } = useStore();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const liked = wishlist.includes(p.id);
  const followed = following.includes(shop.id);
  const inCarts = 3 + ([...p.id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 17);
  const more = shopProducts(shop.id).filter(x => x.id !== p.id).slice(0, 6);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => setImg(Math.round(e.nativeEvent.contentOffset.x / width));

  const ensureSize = () => { if (p.sizes.length && !size) { setNeedSize(true); return false; } return true; };
  const onAdd = () => {
    if (!ensureSize()) return;
    // Free-shipping progress after this item lands in the cart (the cart state updates after this call).
    const left = Math.max(0, shop.freeOver - ((g?.subtotal ?? 0) + p.price));
    add(p, size, 1, { toast: left > 0 ? `Added · ${money(left)} more from ${shop.name} ships free` : `Added · free shipping from ${shop.name}` });
  };
  const onBuy = () => { if (!ensureSize()) return; add(p, size, 1, { toast: false }); router.push('/checkout'); };
  const g = groupCart(cart).find(x => x.shop.id === shop.id);
  const video = videoForProduct(p.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View>
          <ScrollView horizontal pagingEnabled onScroll={onScroll} scrollEventThrottle={16} showsHorizontalScrollIndicator={false}>
            {p.images.map((u, i) => <Image key={i} source={{ uri: u }} accessibilityLabel={`${p.title} photo ${i + 1}`} style={{ width, height: width * 1.05, backgroundColor: '#F1ECE4' }} resizeMode="cover" />)}
          </ScrollView>
          <SafeAreaView edges={['top']} style={{ position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.md }}>
            <IconButton name="chevron-back" label="Back" bg="rgba(255,255,255,0.92)" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton name="share-outline" label="Share" bg="rgba(255,255,255,0.92)" onPress={() => router.push({ pathname: '/share', params: { kind: 'product', id: p.id } })} />
              <IconButton name={liked ? 'heart' : 'heart-outline'} color={liked ? C.accent : C.ink} label={liked ? 'Remove from wishlist' : 'Save'} bg="rgba(255,255,255,0.92)" onPress={() => toggleWish(p.id)} />
              <IconButton name="bag-outline" label="Cart" badge={cartCount} bg="rgba(255,255,255,0.92)" onPress={() => router.push('/cart')} />
            </View>
          </SafeAreaView>
          {!!video && (
            <Pressable onPress={() => router.push({ pathname: '/watch', params: { start: video.id } })} accessibilityRole="button" accessibilityLabel="Watch the video"
              style={{ position: 'absolute', left: S.lg, bottom: 28, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 }}>
              <Ionicons name="play" size={14} color="#fff" /><Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>Watch it</Text>
            </Pressable>
          )}
          {p.images.length > 1 && (
            <View style={{ position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
              {p.images.map((_, i) => <View key={i} style={{ height: 6, width: i === img ? 18 : 6, borderRadius: 3, backgroundColor: i === img ? '#fff' : 'rgba(255,255,255,0.6)' }} />)}
            </View>
          )}
        </View>

        <View style={{ padding: S.lg }}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {p.stock <= 5 && <Pill text={`Only ${p.stock} left`} icon="flame" />}
            <Pill text={`${compact(p.sold)} sold`} tone="dark" icon="trending-up" />
            {!!p.compareAt && <Pill text={`Save ${money(p.compareAt - p.price)}`} tone="good" />}
          </View>
          <Text style={[T.h1, { fontSize: 24, marginTop: 10 }]}>{p.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Price price={p.price} compareAt={p.compareAt} size={22} />
            <Pressable onPress={() => router.push(`/product/${p.id}#reviews`)}><Stars value={p.rating} count={p.reviews} size={13} /></Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <Ionicons name="eye-outline" size={15} color={C.accent} />
            <Text style={{ fontSize: 13, color: C.ink2 }}><Text style={{ fontWeight: '800', color: C.ink }}>{inCarts} people</Text> have this in their cart right now</Text>
          </View>

          {!!p.sizes.length && (
            <View style={{ marginTop: S.xl }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[T.h3, needSize && { color: C.accent }]}>{needSize ? 'Pick a size first' : `Size${size ? `: ${size}` : ''}`}</Text>
                <Text style={{ color: C.ink2, fontSize: 13, textDecorationLine: 'underline' }}>Size guide</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {p.sizes.map(s => <Chip key={s} label={s} active={size === s} onPress={() => { setSize(s); setNeedSize(false); }} />)}
              </View>
            </View>
          )}

          {/* Seller card: the shop is the hero, follow builds the repeat loop */}
          <Pressable onPress={() => router.push(`/shop/${shop.id}`)} style={{ marginTop: S.xl, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: shop.logo }} style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View style={{ flex: 1 }}>
              <Text style={T.h3}>{shop.name}</Text>
              <Text style={T.small} numberOfLines={1}>{shop.tagline}</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}><Stars value={shop.rating} size={11} /><Text style={T.small}>{compact(shop.followers + (followed ? 1 : 0))} followers</Text></View>
            </View>
            <Pressable onPress={() => toggleFollow(shop.id)} accessibilityRole="button" style={{ paddingHorizontal: 14, height: 34, borderRadius: R.pill, backgroundColor: followed ? C.surface : C.ink, borderWidth: 1, borderColor: followed ? C.line : C.ink, justifyContent: 'center' }}>
              <Text style={{ color: followed ? C.ink : '#fff', fontWeight: '800', fontSize: 13 }}>{followed ? 'Following' : 'Follow'}</Text>
            </Pressable>
          </Pressable>

          <View style={{ marginTop: S.lg, gap: 10 }}>
            {[
              ['rocket-outline', `Ships in ${shop.shipsIn} from ${shop.name}`],
              ['cube-outline', `Free shipping over ${money(shop.freeOver)} from this shop, else ${money(shop.shipping)}`],
              ['refresh-outline', '30-day returns · buyer protection on every order'],
            ].map(([i, t]) => (
              <View key={t} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Ionicons name={i as any} size={18} color={C.ink2} /><Text style={{ color: C.ink2, flex: 1 }}>{t}</Text></View>
            ))}
          </View>

          <Text style={[T.h3, { marginTop: S.xl }]}>About this item</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>{p.description}</Text>

          <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'ask', id: p.id } })} style={{ marginTop: S.xl, padding: S.lg, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="chatbubbles" size={24} color={C.accent} />
            <View style={{ flex: 1 }}><Text style={T.h3}>Not sure? Ask a friend</Text><Text style={T.small}>Send it with a yes / no poll. They get $10 off their first order.</Text></View>
          </Pressable>
        </View>

        <View nativeID="reviews">
          <SectionHeader title={`Reviews · ${p.rating.toFixed(1)}`} sub={`${p.reviews} verified buyers`} />
          {reviewsFor(p).map(r => (
            <View key={r.who} style={{ marginHorizontal: S.lg, marginBottom: S.md, padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: '800' }}>{r.who}</Text><Text style={T.small}>{r.ago}</Text></View>
                <View style={{ flexDirection: 'row', marginTop: 2 }}>{[1, 2, 3, 4, 5].map(n => <Ionicons key={n} name={n <= r.stars ? 'star' : 'star-outline'} size={12} color="#F5A524" />)}</View>
                <Text style={{ marginTop: 6, color: C.ink, lineHeight: 20 }}>{r.text}</Text>
                <Text style={[T.tiny, { marginTop: 6 }]}>VERIFIED PURCHASE</Text>
              </View>
              {r.photo && <Image source={{ uri: r.photo }} style={{ width: 72, height: 72, borderRadius: R.md }} />}
            </View>
          ))}
        </View>

        {!!more.length && <>
          <SectionHeader title={`More from ${shop.name}`} action="Visit shop" onAction={() => router.push(`/shop/${shop.id}`)} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: S.lg, gap: 12 }}>
            {more.map(x => <ProductCard key={x.id} p={x} width={150} />)}
          </ScrollView>
        </>}
        <View style={{ marginTop: S.xl }}><TrustLine /></View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: S.lg }}>
          <Button title="Add to cart" kind="light" style={{ flex: 1 }} onPress={onAdd} disabled={p.stock === 0} />
          <Button title="Buy now" kind="accent" icon="logo-apple" style={{ flex: 1 }} onPress={onBuy} disabled={p.stock === 0} />
        </View>
      </SafeAreaView>
    </View>
  );
}
