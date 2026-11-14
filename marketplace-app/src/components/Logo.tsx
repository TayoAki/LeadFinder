import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { BRAND } from '@/lib/brand';
import { C } from '@/lib/theme';

// The name IS the logo: a market-stall awning (the "stall") over the word-mark.
export function LogoMark({ size = 32 }: { size?: number }) {
  const stripes = 4;
  const sw = (size * 0.8) / stripes;
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.26, backgroundColor: C.ink, alignItems: 'center', overflow: 'hidden' }} accessible={false}>
      <View style={{ flexDirection: 'row', marginTop: size * 0.16 }}>
        {Array.from({ length: stripes }).map((_, i) => (
          <View key={i} style={{ width: sw, height: size * 0.3, backgroundColor: i % 2 ? '#fff' : C.accent, borderBottomLeftRadius: sw / 2, borderBottomRightRadius: sw / 2 }} />
        ))}
      </View>
      <View style={{ width: size * 0.62, height: size * 0.28, marginTop: size * 0.08, borderWidth: size * 0.06, borderColor: '#fff', borderTopWidth: 0, borderBottomLeftRadius: size * 0.06, borderBottomRightRadius: size * 0.06 }} />
    </View>
  );
}

export function Logo({ size = 28, light }: { size?: number; light?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityRole="header" accessibilityLabel={BRAND.name}>
      <LogoMark size={size} />
      <Text style={{ fontSize: size * 0.85, fontWeight: '900', color: light ? '#fff' : C.ink, letterSpacing: -0.8 }}>{BRAND.name.toLowerCase()}</Text>
    </View>
  );
}

export function TrustLine() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingHorizontal: 16 }}>
      <Ionicons name="shield-checkmark" size={14} color={C.good} />
      <Text style={{ fontSize: 12, color: C.ink2 }}>Buyer protection on every order · 30-day returns</Text>
    </View>
  );
}
