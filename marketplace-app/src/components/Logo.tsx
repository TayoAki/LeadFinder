import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { BRAND } from '@/lib/brand';
import { C } from '@/lib/theme';

const MARK = require('../../assets/brand/logo-mark.png');
const WORDMARK = require('../../assets/brand/logo-wordmark.png');
const MARK_RATIO = 417 / 392;
const WORD_RATIO = 1839 / 628;

// Shelby the bag (mark, brand orange) and the "shelby" word-mark (navy, Nunito Black, OFL).
export function LogoMark({ size = 32 }: { size?: number }) {
  return <Image source={MARK} accessibilityIgnoresInvertColors style={{ width: size * MARK_RATIO, height: size }} resizeMode="contain" />;
}

export function Logo({ size = 28, light }: { size?: number; light?: boolean }) {
  if (light) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} accessibilityRole="header" accessibilityLabel={BRAND.name}>
        <View style={{ backgroundColor: '#fff', borderRadius: 6, padding: 2 }}><LogoMark size={size} /></View>
        <Text style={{ fontSize: size * 0.8, fontWeight: '900', color: '#fff', letterSpacing: -0.6 }}>{BRAND.name.toLowerCase()}</Text>
      </View>
    );
  }
  return <Image source={WORDMARK} accessibilityRole="header" accessibilityLabel={BRAND.name} style={{ height: size, width: size * WORD_RATIO }} resizeMode="contain" />;
}

export function TrustLine() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingHorizontal: 16 }}>
      <Ionicons name="shield-checkmark" size={14} color={C.good} />
      <Text style={{ fontSize: 12, color: C.ink2 }}>Buyer protection on every order · 30-day returns</Text>
    </View>
  );
}
