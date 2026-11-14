import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useStore } from '@/lib/store';
import { C, S, T } from '@/lib/theme';
import { Logo } from './Logo';
import { IconButton } from './ui';

export function Header({ title, back, logo, right, share }: { title?: string; back?: boolean; logo?: boolean; right?: React.ReactNode; share?: () => void }) {
  const { cartCount } = useStore();
  return (
    <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.sm, backgroundColor: C.bg, gap: 4 }}>
      {back && <IconButton name="chevron-back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />}
      <View style={{ flex: 1, paddingLeft: back ? 0 : S.sm }}>
        {logo ? <Logo size={32} /> : <Text style={T.h3} numberOfLines={1}>{title}</Text>}
      </View>
      {right}
      {share && <IconButton name="share-outline" label="Share" onPress={share} />}
      <IconButton name="bag-outline" label={`Cart, ${cartCount} items`} badge={cartCount} onPress={() => router.push('/cart')} />
    </View>
  );
}
