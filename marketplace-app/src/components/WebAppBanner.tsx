import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { BRAND } from '@/lib/brand';
import { useStore } from '@/lib/store';
import { C, S } from '@/lib/theme';
import { LogoMark } from './Logo';

// Web fallback for shared links: people without the app shop right here, and the banner
// carries them (and their friend's credit) into the app. Real deferred deep linking after
// install needs a link service (Branch, AppsFlyer or Adjust) wired to the same paths.
export function WebAppBanner() {
  const { referredBy } = useStore();
  const [hidden, setHidden] = useState(false);
  if (Platform.OS !== 'web' || hidden) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: S.md, paddingVertical: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <Pressable onPress={() => setHidden(true)} accessibilityLabel="Dismiss" hitSlop={8}><Ionicons name="close" size={16} color={C.ink3} /></Pressable>
      <LogoMark size={30} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '800', color: C.ink, fontSize: 13 }}>{BRAND.name}: AI shopper for small shops</Text>
        <Text style={{ color: C.ink2, fontSize: 11 }}>{referredBy ? `Your $${BRAND.referralReward} off comes with you` : BRAND.tagline}</Text>
      </View>
      <View style={{ backgroundColor: C.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Get app</Text></View>
    </View>
  );
}
