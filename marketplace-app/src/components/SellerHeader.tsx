import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { C, R, S, T } from '@/lib/theme';
import { LogoMark } from './Logo';
import { IconButton } from './ui';

// Seller mode wears a dark header so it never feels like the shopping app.
export function SellerHeader({ title, back }: { title: string; back?: boolean }) {
  return (
    <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.sm, backgroundColor: C.dark, gap: 6 }}>
      {back ? <IconButton name="chevron-back" color="#fff" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/seller'))} /> : <View style={{ paddingLeft: S.sm }}><LogoMark size={26} /></View>}
      <Text style={[T.h3, { color: '#fff', flex: 1 }]} numberOfLines={1}>{title}</Text>
      <Pressable onPress={() => router.replace('/profile')} accessibilityRole="button" style={{ paddingHorizontal: 12, height: 32, borderRadius: R.pill, borderWidth: 1, borderColor: '#4A443C', justifyContent: 'center', marginRight: S.sm }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Shopping mode</Text>
      </Pressable>
    </View>
  );
}
