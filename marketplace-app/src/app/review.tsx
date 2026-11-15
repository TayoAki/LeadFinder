// Write a review. The server marks it "Verified purchase" only if this device bought the product.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui';
import { ids, track } from '@/lib/analytics';
import { api } from '@/lib/api';
import { getProduct } from '@/lib/data';
import { haptic, toast } from '@/lib/feedback';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Review() {
  const { productId, orderId } = useLocalSearchParams<{ productId: string; orderId?: string }>();
  const { user } = useStore();
  const p = getProduct(productId);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState(user?.name ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!p) return null;
  const submit = async () => {
    setBusy(true); setError('');
    try {
      const r = await api<{ verified: boolean }>('/api/reviews', { productId: p.id, orderId, rating, text, name, anon: ids().anon });
      track('review_submitted', { product_id: p.id, rating, verified: r.verified, has_text: !!text.trim() });
      haptic('success'); toast({ text: 'Thanks! Your review is live.', icon: 'star' });
      router.back();
    } catch (e: any) { haptic('error'); setError(e?.message ?? 'Could not post your review. Try again.'); setBusy(false); }
  };
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Write a review" back />
      <View style={{ padding: S.lg, gap: S.lg }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Image source={{ uri: p.image }} style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: C.photo }} />
          <Text style={[T.h3, { flex: 1 }]} numberOfLines={2}>{p.title}</Text>
        </View>
        <View>
          <Text style={T.h3}>How would you rate it?</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: S.sm }}>
            {[1, 2, 3, 4, 5].map(n => (
              <Pressable key={n} onPress={() => { haptic('select'); setRating(n); }} accessibilityRole="button" accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`} accessibilityState={{ selected: rating === n }} hitSlop={4} style={{ padding: 4 }}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={34} color="#B7791F" />
              </Pressable>
            ))}
          </View>
        </View>
        <TextInput value={text} onChangeText={setText} placeholder="What did you like? How's the fit, feel or results?" placeholderTextColor={C.ink3} multiline maxLength={600}
          accessibilityLabel="Your review" style={{ minHeight: 120, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, padding: S.md, fontSize: 15, color: C.ink, textAlignVertical: 'top' }} />
        <TextInput value={name} onChangeText={setName} placeholder="First name (shown with your review)" placeholderTextColor={C.ink3} maxLength={40}
          accessibilityLabel="Name shown with your review" style={{ height: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingHorizontal: S.md, fontSize: 15, color: C.ink }} />
        {!!error && <Text style={{ color: C.sale, fontWeight: '700' }} accessibilityRole="alert">{error}</Text>}
        <Button title="Post review" kind="primary" disabled={!rating} loading={busy} onPress={submit} />
        <Text style={T.small}>Reviews from people who bought the item show "Verified purchase". Shelby never edits or invents reviews.</Text>
      </View>
    </SafeAreaView>
  );
}
