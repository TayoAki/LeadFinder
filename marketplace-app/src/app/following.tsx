import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Stars } from '@/components/ui';
import { compact, shops } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Following() {
  const { following, toggleFollow } = useStore();
  const sorted = [...shops].sort((a, b) => Number(following.includes(b.id)) - Number(following.includes(a.id)));
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Shops" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        <Text style={T.small}>You follow {following.length}. New products and drops from these shops lead your Home feed.</Text>
        {sorted.map(s => {
          const on = following.includes(s.id);
          return (
            <Pressable key={s.id} onPress={() => router.push(`/shop/${s.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line }}>
              <Image source={{ uri: s.logo }} style={{ width: 52, height: 52, borderRadius: 26 }} />
              <View style={{ flex: 1 }}>
                <Text style={T.h3}>{s.name}</Text>
                <Text style={T.small} numberOfLines={1}>{s.tagline}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}><Stars value={s.rating} size={11} /><Text style={T.small}>{compact(s.followers)} followers</Text></View>
              </View>
              <Pressable onPress={() => toggleFollow(s.id)} style={{ paddingHorizontal: 14, height: 34, borderRadius: R.pill, backgroundColor: on ? C.surface : C.ink, borderWidth: 1, borderColor: on ? C.line : C.ink, justifyContent: 'center' }}>
                <Text style={{ color: on ? C.ink : '#fff', fontWeight: '800', fontSize: 13 }}>{on ? 'Following' : 'Follow'}</Text>
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
