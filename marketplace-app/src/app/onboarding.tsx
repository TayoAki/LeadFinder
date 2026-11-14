import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { categories, products } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

// One screen, no account: pick what you like and see your feed. Sign-up waits until checkout.
export default function Onboarding() {
  const { setInterests, setOnboarded } = useStore();
  const [picked, setPicked] = useState<string[]>([]);
  const finish = (v: string[]) => { setInterests(v); setOnboarded(true); router.back(); };
  const opts = categories.filter(c => c !== 'All');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.lg }}>
        <Logo />
        <Pressable onPress={() => finish([])} accessibilityRole="button" hitSlop={10}><Text style={{ color: C.ink2, fontWeight: '700' }}>Skip</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 120 }}>
        <Text style={[T.h1, { fontSize: 32 }]}>{BRAND.tagline}.</Text>
        <Text style={[T.body, { color: C.ink2, marginTop: 8 }]}>Buy from small makers across the US in one checkout. Pick what you're into and we'll build your feed.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: S.xl }}>
          {opts.map(c => {
            const on = picked.includes(c);
            const img = products.find(p => p.category === c)?.image;
            return (
              <Pressable key={c} onPress={() => setPicked(v => (on ? v.filter(x => x !== c) : [...v, c]))} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
                style={{ width: '31%', aspectRatio: 0.85, borderRadius: R.lg, overflow: 'hidden', borderWidth: 3, borderColor: on ? C.accent : 'transparent', backgroundColor: '#EEE7DD' }}>
                {img && <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />}
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 8, backgroundColor: 'rgba(22,19,15,0.55)' }}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>{c}</Text>
                </View>
                {on && <View style={{ position: 'absolute', right: 6, top: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="checkmark" size={16} color="#fff" /></View>}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button title={picked.length ? `Show my feed (${picked.length})` : 'Pick a few to start'} kind="accent" disabled={!picked.length} onPress={() => finish(picked)} />
        <Text style={{ textAlign: 'center', color: C.ink3, fontSize: 12, marginTop: 8 }}>No account needed to browse. ${BRAND.firstOrderOff} off your first order when you sign up.</Text>
      </View>
    </SafeAreaView>
  );
}
