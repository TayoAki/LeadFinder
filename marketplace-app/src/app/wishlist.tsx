import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { ProductGrid } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { getProduct } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, S, T } from '@/lib/theme';

export default function Wishlist() {
  const { width } = useWindowDimensions();
  const { wishlist } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={`Wishlist · ${wishlist.length}`} back share={() => router.push({ pathname: '/share', params: { kind: 'wishlist', id: 'me' } })} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {wishlist.length ? <>
          <View style={{ margin: S.lg, marginTop: 0 }}>
            <Button title="Share as a gift list" icon="gift" kind="accent" onPress={() => router.push({ pathname: '/share', params: { kind: 'wishlist', id: 'me' } })} />
            <Text style={[T.small, { textAlign: 'center', marginTop: 6 }]}>Birthdays, holidays, just because. Friends buy straight from your list.</Text>
          </View>
          <ProductGrid items={wishlist.map(getProduct)} width={width} />
        </> : (
          <View style={{ alignItems: 'center', padding: S.xxl }}>
            <Ionicons name="heart-outline" size={44} color={C.ink3} />
            <Text style={[T.h2, { marginTop: 12 }]}>Nothing saved yet</Text>
            <Text style={[T.small, { textAlign: 'center', marginTop: 4 }]}>Tap the heart on anything you love. We'll tell you if it's about to sell out.</Text>
            <Button title="Browse" style={{ marginTop: S.lg }} onPress={() => router.push('/')} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
