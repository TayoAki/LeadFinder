// Shoppable video feed: full-screen vertical clips, swipe to the next. Each clip is tagged with its
// product; "Shop" opens a sheet (size + add to cart) so shopping never interrupts watching.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Modal, Platform, Pressable, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Chip } from '@/components/ui';
import { track } from '@/lib/analytics';
import { getShop, money } from '@/lib/data';
import { haptic } from '@/lib/feedback';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { shopVideos, ShopVideo } from '@/lib/videos';

function RailButton({ icon, label, onPress, active }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={() => { haptic('tap'); onPress(); }} accessibilityRole="button" accessibilityLabel={label} hitSlop={6} style={{ alignItems: 'center', gap: 4, minWidth: 48, minHeight: 48 }}>
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={24} color={active ? C.sale : '#fff'} />
      </View>
      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } }}>{label}</Text>
    </Pressable>
  );
}

function Clip({ v, active, height, muted, onToggleMute, onShop }: { v: ShopVideo; active: boolean; height: number; muted: boolean; onToggleMute: () => void; onShop: () => void }) {
  const { wishlist, toggleWish } = useStore();
  const insets = useSafeAreaInsets();
  const shop = getShop(v.product.shopId);
  const [paused, setPaused] = useState(false);
  const player = useVideoPlayer(v.src, p => { p.loop = true; p.muted = true; });
  useEffect(() => { player.muted = muted; }, [muted, player]);
  useEffect(() => {
    if (active && !paused) player.play(); else player.pause();
  }, [active, paused, player]);
  useEffect(() => { if (active) { setPaused(false); track('video_view', { video_id: v.id, product_id: v.product.id, shop_id: v.product.shopId }); } }, [active]); // eslint-disable-line react-hooks/exhaustive-deps
  const liked = wishlist.includes(v.product.id);

  return (
    <View style={{ height, backgroundColor: '#000' }}>
      <Pressable onPress={() => { haptic('select'); setPaused(x => !x); }} accessibilityLabel={paused ? 'Play video' : 'Pause video'} style={{ flex: 1 }}>
        <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
        {/* Scrims keep white text legible on light footage */}
        <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140 }} />
        <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 320 }} />
        {paused && <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="play" size={64} color="rgba(255,255,255,0.85)" /></View>}
      </Pressable>

      {/* Right rail */}
      <View style={{ position: 'absolute', right: S.md, bottom: insets.bottom + 150, gap: S.lg, alignItems: 'center' }}>
        <RailButton icon={liked ? 'heart' : 'heart-outline'} label={liked ? 'Saved' : 'Save'} active={liked} onPress={() => toggleWish(v.product.id)} />
        <RailButton icon="paper-plane-outline" label="Share" onPress={() => { track('share', { via: 'video', kind: 'video', id: v.id }); Share.share({ message: `${v.product.title} on Shelby` }).catch(() => {}); }} />
        <RailButton icon={muted ? 'volume-mute' : 'volume-high'} label={muted ? 'Sound off' : 'Sound on'} onPress={onToggleMute} />
      </View>

      {/* Caption + product tag */}
      <View style={{ position: 'absolute', left: S.lg, right: 84, bottom: insets.bottom + S.lg, gap: S.md }}>
        <View>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Shelby</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 2, fontSize: 14 }} numberOfLines={2}>{v.caption}</Text>
        </View>
        <Pressable onPress={() => { haptic('tap'); track('video_shop_open', { video_id: v.id, product_id: v.product.id }); onShop(); }} accessibilityRole="button" accessibilityLabel={`Shop ${v.product.title}, ${money(v.product.price)}`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: R.lg, padding: 8, paddingRight: 12 }}>
          <Image source={{ uri: v.product.image }} style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: C.photo }} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ fontWeight: '700', color: C.ink }}>{v.product.title}</Text>
            <Text style={{ fontWeight: '800', color: C.ink }}>{money(v.product.price)}{v.product.compareAt ? <Text style={{ color: C.ink3, textDecorationLine: 'line-through', fontWeight: '600' }}>  {money(v.product.compareAt)}</Text> : null}</Text>
          </View>
          <View style={{ backgroundColor: C.buy, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}><Text style={{ color: C.buyInk, fontWeight: '800' }}>Shop</Text></View>
        </Pressable>
      </View>
    </View>
  );
}

function ShopSheet({ v, onClose }: { v: ShopVideo | null; onClose: () => void }) {
  const { add } = useStore();
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState<string | null>(null);
  const [needSize, setNeedSize] = useState(false);
  useEffect(() => { setSize(null); setNeedSize(false); }, [v?.id]);
  if (!v) return null;
  const p = v.product; const shop = getShop(p.shopId);
  const addIt = () => {
    if (p.sizes.length && !size) { setNeedSize(true); haptic('error'); return; }
    track('video_add_to_cart', { video_id: v.id, product_id: p.id });
    add(p, size); onClose();
  };
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={onClose} accessibilityLabel="Close" />
      <View style={{ backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: S.lg, paddingBottom: insets.bottom + S.lg, gap: S.md }}>
        <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: C.line }} />
        <View style={{ flexDirection: 'row', gap: S.md }}>
          <Image source={{ uri: p.image }} style={{ width: 88, height: 88, borderRadius: R.md, backgroundColor: C.photo }} />
          <View style={{ flex: 1 }}>
            <Text style={[T.small, { fontWeight: '700' }]}>{p.category}</Text>
            <Text style={T.h3} numberOfLines={2}>{p.title}</Text>
            <Text style={{ fontWeight: '900', fontSize: 18, marginTop: 4, color: C.ink }}>{money(p.price)}</Text>
          </View>
        </View>
        {!!p.sizes.length && (
          <View>
            <Text style={[T.small, { color: needSize ? C.sale : C.ink2, fontWeight: '700' }]}>{needSize ? 'Pick a size first' : 'Size'}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {p.sizes.map(s => <Chip key={s} label={s} active={size === s} onPress={() => { setSize(s); setNeedSize(false); }} />)}
            </View>
          </View>
        )}
        <Text style={T.small}>{p.stock > 0 ? `Ships in ${shop.shipsIn}` : 'Sold out'}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Details" kind="light" style={{ flex: 1 }} onPress={() => { onClose(); router.push(`/product/${p.id}`); }} />
          <Button title={`Add · ${money(p.price)}`} kind="buy" icon="bag-add" style={{ flex: 1.4 }} onPress={addIt} disabled={p.stock === 0} testID="video-add" />
        </View>
      </View>
    </Modal>
  );
}

export default function Watch() {
  const { start } = useLocalSearchParams<{ start?: string }>();
  const [height, setHeight] = useState(0); // measured: the screen can be shorter than the window
  const insets = useSafeAreaInsets();
  const { cartCount } = useStore();
  const videos = useMemo(() => {
    const all = shopVideos();
    const i = Math.max(0, all.findIndex(v => v.id === start));
    return [...all.slice(i), ...all.slice(0, i)]; // start where the shopper tapped
  }, [start]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [shopping, setShopping] = useState<ShopVideo | null>(null);
  const onViewable = useRef(({ viewableItems }: { viewableItems: { index?: number | null; isViewable: boolean }[] }) => {
    const first = viewableItems.find(x => x.isViewable);
    if (first?.index != null) setActive(first.index);
  }).current;
  const toggleMute = useCallback(() => setMuted(m => !m), []);

  if (!videos.length) return <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff' }}>No videos yet.</Text></View>;
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }} onLayout={e => setHeight(Math.round(e.nativeEvent.layout.height))}>
      {height > 0 && <FlatList data={videos} keyExtractor={v => v.id} pagingEnabled showsVerticalScrollIndicator={false} snapToInterval={height} decelerationRate="fast"
        getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })} windowSize={3} initialNumToRender={1} maxToRenderPerBatch={2}
        onViewableItemsChanged={onViewable} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item, index }) => <Clip v={item} height={height} active={index === active && !shopping} muted={muted} onToggleMute={toggleMute} onShop={() => setShopping(item)} />}
        style={Platform.OS === 'web' ? ({ scrollSnapType: 'y mandatory' } as any) : undefined} />}
      <View style={{ position: 'absolute', top: insets.top + 8, left: S.md, right: S.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => { haptic('tap'); router.back(); }} accessibilityRole="button" accessibilityLabel="Close videos" hitSlop={8}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Shop the videos</Text>
        <Pressable onPress={() => { haptic('tap'); router.push('/cart'); }} accessibilityRole="button" accessibilityLabel={`Cart, ${cartCount} items`} hitSlop={8}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="bag-outline" size={22} color="#fff" />
          {!!cartCount && <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.sale, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{cartCount}</Text></View>}
        </Pressable>
      </View>
      <ShopSheet v={shopping} onClose={() => setShopping(null)} />
    </View>
  );
}
