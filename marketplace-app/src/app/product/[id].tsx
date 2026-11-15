import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrustLine } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { Button, Chip, IconButton, Pill, Price, SectionHeader, Stars } from '@/components/ui';
import { compact, getProduct, getShop, money, shopProducts } from '@/lib/data';
import { groupCart, useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';
import { videoForProduct } from '@/lib/videos';
import { api } from '@/lib/api';
import { deliveryWindow, NICHES, nicheOf, SIZE_GUIDES } from '@/lib/niches';
import { sizeGroup } from '@/lib/store';
import { bundleFor } from '@/lib/upsell';
import { variant } from '@/lib/experiments';
import campaigns from '@/data/campaigns.json';

export default function ProductPage() {
  const { id, c } = useLocalSearchParams<{ id: string; c?: string }>();
  const { width } = useWindowDimensions();
  const p = getProduct(id);
  const [proof, setProof] = useState<{ addedToday: number; ordered30: number } | null>(null);
  const [reviews, setReviews] = useState<{ count: number; average: number | null; reviews: { rating: number; text: string; name: string; verified: boolean; created_at: number }[] } | null>(null);
  useEffect(() => {
    if (!p) return;
    api<{ addedToday: number; ordered30: number }>(`/api/proof/product/${encodeURIComponent(p.id)}`).then(setProof).catch(() => {});
    api<any>(`/api/reviews/${encodeURIComponent(p.id)}`).then(setReviews).catch(() => setReviews({ count: 0, average: null, reviews: [] }));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (p) track('product_view', { product_id: p.id, title: p.title.slice(0, 80), price: p.price, shop_id: p.shopId, category: p.category, in_stock: p.stock > 0 }); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p) return <Redirect href="/search" />;
  const shop = getShop(p.shopId);
  const { add, cart, wishlist, toggleWish, following, toggleFollow, cartCount, user, sizes: savedSizes, rememberSize, stockAlerts, toggleStockAlert, replenish, setReplenish } = useStore();
  const [img, setImg] = useState(0);
  const niche = nicheOf(p); const N = NICHES[niche];
  const group = sizeGroup(p.sizes);
  const inStock = (s: string) => (p.sizeStock?.[s] ?? 1) > 0;
  // The shopper's saved size is pre-selected when this item has it in stock.
  const saved = group ? savedSizes[group] : undefined;
  const [size, setSize] = useState<string | null>(saved && p.sizes.includes(saved) && inStock(saved) && variant('e3_saved_size') === 'preselect' ? saved : null);
  const bundle = variant('e7_bundle_pdp') === 'on' ? bundleFor(p) : null;
  const proofNear = variant('e8_proof_near_price') === 'near';
  // E16: a campaign link lands with its own hook on top, so the promise that brought them is the first thing they see.
  const campaign = c ? (campaigns as unknown as Record<string, { hook: string; from: string }>)[c] : undefined;
  const showCampaign = !!campaign && variant('e16_campaign_landing') === 'matched';
  useEffect(() => { if (c) track('campaign_landing', { campaign: c, product_id: p.id, matched: showCampaign }); }, [c]); // eslint-disable-line react-hooks/exhaustive-deps
  const [guide, setGuide] = useState(false);
  const details = N.detailKeys.filter(([k]) => p.details?.[k]);
  const plan = replenish.find(r => r.productId === p.id);
  const [needSize, setNeedSize] = useState(false);
  const liked = wishlist.includes(p.id);
  const followed = following.includes(shop.id);
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
              <IconButton name={liked ? 'heart' : 'heart-outline'} color={liked ? C.sale : C.ink} label={liked ? 'Remove from wishlist' : 'Save'} bg="rgba(255,255,255,0.92)" onPress={() => toggleWish(p.id)} />
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
            {p.stock <= 0 ? <Pill text="Sold out" tone="dark" /> : p.stock <= 5 && <Pill text={`Only ${p.stock} left`} tone="sale" icon="flame" />}
            <Pill text={`${compact(p.sold)} sold`} tone="dark" icon="trending-up" />
          </View>
          {showCampaign && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: S.md, borderRadius: R.md, backgroundColor: C.buySoft, marginBottom: S.md }}><Ionicons name="play-circle" size={18} color={C.warn} /><Text style={{ flex: 1, color: C.ink, fontWeight: '700' }}>{campaign!.from}: {campaign!.hook}</Text></View>}
          <Text style={[T.h1, { fontSize: 24, marginTop: 10 }]}>{p.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Price price={p.price} compareAt={p.compareAt} size={22} />
            <Pressable onPress={() => router.push(`/product/${p.id}#reviews`)}><Stars value={p.rating} count={p.reviews} size={13} /></Pressable>
          </View>
          {!!p.compareAt && p.compareAt > p.price && <Text style={{ color: C.sale, fontWeight: '700', marginTop: 4 }}>You save {money(p.compareAt - p.price)} ({Math.round((1 - p.price / p.compareAt) * 100)}%)</Text>}
          {/* Buy box: what you get, when, and what if it's wrong, right where you decide */}
          <View style={{ marginTop: S.md, padding: S.md, borderRadius: R.md, backgroundColor: C.goodSoft, gap: 8 }}>
            {[
              ['car-outline', p.stock > 0 ? `Arrives ${deliveryWindow(shop.shipsIn)}` : 'Sold out right now'],
              [N.promise.icon, N.promise.text],
              ['lock-closed-outline', `Secure checkout · Apple Pay or card · ${shop.freeOver ? `free shipping over ${money(shop.freeOver)}` : 'free shipping'}`],
            ].map(([i, t]) => (
              <View key={t} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Ionicons name={i as any} size={16} color={C.good} /><Text style={{ color: C.ink, fontSize: 13, flex: 1 }}>{t}</Text></View>
            ))}
          </View>
          {/* Real counts only, and only once they mean something */}
          {proofNear && proof && (proof.ordered30 >= 5 || proof.addedToday >= 3) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Ionicons name="trending-up" size={15} color={C.good} />
              <Text style={{ fontSize: 13, color: C.ink2 }}>{proof.ordered30 >= 5 ? <><Text style={{ fontWeight: '800', color: C.ink }}>{proof.ordered30} ordered</Text> in the last 30 days</> : <><Text style={{ fontWeight: '800', color: C.ink }}>{proof.addedToday} people</Text> added this today</>}</Text>
            </View>
          )}

          {!!p.sizes.length && (
            <View style={{ marginTop: S.xl }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[T.h3, needSize && { color: C.sale }]}>{needSize ? 'Pick a size first' : `Size${size ? `: ${size}` : ''}`}</Text>
                <Pressable onPress={() => { setGuide(true); track('size_guide_open', { product_id: p.id }); }} accessibilityRole="button" hitSlop={8}><Text style={{ color: C.accent, fontSize: 13, fontWeight: '700' }}>Size guide</Text></Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {p.sizes.map(s => <Chip key={s} label={s} active={size === s} disabled={!inStock(s)} onPress={() => { setSize(s); setNeedSize(false); rememberSize(p.sizes, s); track('size_selected', { product_id: p.id, size: s, saved: s === saved }); }} />)}
              </View>
              {!!saved && size === saved && <Text style={[T.small, { marginTop: 6 }]}>Your saved size</Text>}
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


          {details.length > 0 && (
            <View style={{ marginTop: S.xl }}>
              <Text style={T.h3}>{N.proofTitle}</Text>
              <View style={{ marginTop: 8, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface }}>
                {details.map(([k, label], i) => (
                  <View key={k} style={{ flexDirection: 'row', padding: S.md, gap: 12, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
                    <Text style={{ width: 110, color: C.ink2, fontWeight: '600' }}>{label}</Text><Text style={{ flex: 1, color: C.ink }}>{p.details![k]}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {!!N.replenishDays && p.stock > 0 && (
            <View style={{ marginTop: S.xl }}>
              <Text style={T.h3}>Runs out? Reorder in one tap</Text>
              <Text style={[T.small, { marginTop: 2 }]}>{plan ? `We'll remind you every ${plan.days} days.` : 'Pick how often and we will remind you before it runs out.'}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {N.replenishDays.map(d => <Chip key={d} label={`Every ${d} days`} active={plan?.days === d} onPress={() => setReplenish(p.id, size, plan?.days === d ? null : d)} />)}
              </View>
            </View>
          )}
          {/* Real counts only, and only once they mean something */}
          {!proofNear && proof && (proof.ordered30 >= 5 || proof.addedToday >= 3) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <Ionicons name="trending-up" size={15} color={C.good} />
              <Text style={{ fontSize: 13, color: C.ink2 }}>{proof.ordered30 >= 5 ? <><Text style={{ fontWeight: '800', color: C.ink }}>{proof.ordered30} ordered</Text> in the last 30 days</> : <><Text style={{ fontWeight: '800', color: C.ink }}>{proof.addedToday} people</Text> added this today</>}</Text>
            </View>
          )}
          {/* E7: niche bundle, one tap to add everything */}
          {bundle && p.stock > 0 && (
            <View style={{ marginTop: S.xl, padding: S.md, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
              <Text style={T.h3}>{bundle.title}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: S.md }}>
                {[p, ...bundle.items].map((x, i) => (
                  <Pressable key={x.id} onPress={() => i && router.push(`/product/${x.id}`)} style={{ flex: 1 }} accessibilityLabel={x.title}>
                    <Image source={{ uri: x.image }} style={{ width: '100%', aspectRatio: 1, borderRadius: R.md, backgroundColor: C.photo }} />
                    <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '600', marginTop: 4 }}>{i ? x.title : 'This item'}</Text>
                    <Text style={{ fontSize: 12, color: C.ink2 }}>{money(x.price)}</Text>
                  </Pressable>
                ))}
              </View>
              <Button title={`Add all ${bundle.items.length + 1} · ${money([p, ...bundle.items].reduce((n, x) => n + x.price, 0))}`} kind="light" icon="bag-add-outline" style={{ marginTop: S.md }}
                onPress={() => { if (!ensureSize()) return; track('bundle_add', { product_id: p.id, items: bundle.items.length + 1 }); bundle.items.filter(x => !x.sizes.length).forEach(x => add(x, null, 1, { toast: false })); add(p, size, 1, { toast: `Added ${bundle.items.length + 1} items to your cart` }); }} />
            </View>
          )}
          <Text style={[T.h3, { marginTop: S.xl }]}>About this item</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>{p.description}</Text>
          {!!N.disclaimer && <Text style={[T.small, { marginTop: S.md, fontStyle: 'italic' }]}>{N.disclaimer}</Text>}

          <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'ask', id: p.id } })} style={{ marginTop: S.xl, padding: S.lg, borderRadius: R.lg, backgroundColor: C.accentSoft, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="chatbubbles" size={24} color={C.accent} />
            <View style={{ flex: 1 }}><Text style={T.h3}>Not sure? Ask a friend</Text><Text style={T.small}>Send it with a yes / no poll. They get $10 off their first order.</Text></View>
          </Pressable>
        </View>

        <View nativeID="reviews">
          <SectionHeader title={reviews?.count ? `Reviews · ${reviews.average?.toFixed(1)}` : 'Reviews'} sub={reviews?.count ? `${reviews.count} from Shelby shoppers` : undefined} />
          {reviews && !reviews.count && (
            <View style={{ marginHorizontal: S.lg, padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
              <Text style={T.h3}>No reviews yet</Text>
              <Text style={[T.small, { marginTop: 2 }]}>Bought it? Your review appears here, marked "Verified purchase".</Text>
            </View>
          )}
          {reviews?.reviews.map((r, i) => (
            <View key={i} style={{ marginHorizontal: S.lg, marginBottom: S.md, padding: S.lg, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: '800' }}>{r.name}</Text><Text style={T.small}>{new Date(r.created_at).toLocaleDateString()}</Text></View>
              <View style={{ flexDirection: 'row', marginTop: 2 }}>{[1, 2, 3, 4, 5].map(n => <Ionicons key={n} name={n <= r.rating ? 'star' : 'star-outline'} size={12} color="#B7791F" />)}</View>
              {!!r.text && <Text style={{ marginTop: 6, color: C.ink, lineHeight: 20 }}>{r.text}</Text>}
              {r.verified && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}><Ionicons name="checkmark-circle" size={13} color={C.good} /><Text style={{ fontSize: 12, color: C.good, fontWeight: '700' }}>Verified purchase</Text></View>}
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

      {group && (
        <Modal visible={guide} transparent animationType="slide" onRequestClose={() => setGuide(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={() => setGuide(false)} accessibilityLabel="Close size guide" />
          <View style={{ backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: S.lg, paddingBottom: 40 }}>
            <Text style={T.h2}>Size guide</Text>
            <Text style={[T.small, { marginTop: 4 }]}>Standard US sizing. {p.details?.fit ? `This item: ${p.details.fit}.` : 'Between sizes? Size exchanges are free.'}</Text>
            <View style={{ marginTop: S.md, borderRadius: R.md, borderWidth: 1, borderColor: C.line }}>
              {[SIZE_GUIDES[group].head, ...SIZE_GUIDES[group].rows].map((row, i) => (
                <View key={i} style={{ flexDirection: 'row', backgroundColor: i === 0 ? C.bg : row[0] === size ? C.buySoft : 'transparent', borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
                  {row.map((c, j) => <Text key={j} style={{ flex: 1, padding: 10, fontWeight: i === 0 ? '800' : '500', color: C.ink, fontSize: 13 }}>{c}</Text>)}
                </View>
              ))}
            </View>
            <Button title="Done" kind="primary" style={{ marginTop: S.lg }} onPress={() => setGuide(false)} />
          </View>
        </Modal>
      )}
      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
        <View style={{ flexDirection: 'row', gap: 10, padding: S.lg }}>
          {p.stock > 0
            ? <Button title="Add to cart" kind="buy" style={{ flex: 1 }} onPress={onAdd} />
            : <Button title={stockAlerts.includes(p.id) ? "We'll tell you when it's back" : 'Notify me when back'} kind="primary" icon="notifications-outline" style={{ flex: 2 }} onPress={() => toggleStockAlert(p.id)} />}
          {p.stock > 0 && <Button title="Buy now" kind="primary" icon="logo-apple" style={{ flex: 1 }} onPress={onBuy} />}
        </View>
      </SafeAreaView>
    </View>
  );
}
