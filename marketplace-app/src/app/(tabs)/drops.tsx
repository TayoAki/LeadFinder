import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Pill, useCountdown } from '@/components/ui';
import { compact, drops, getProduct, getShop } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { useDropCounts } from '@/lib/proof';

function DropCard({ d, counts }: { d: (typeof drops)[number]; counts: Record<string, number> }) {
  const { reminders, toggleReminder, notif } = useStore();
  const cd = useCountdown(d.at);
  const on = reminders.includes(d.id);
  const p = getProduct(d.productId);
  const shop = getShop(d.shopId);
  return (
    <View style={{ marginHorizontal: S.lg, marginBottom: S.lg, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
      <Pressable onPress={() => router.push(`/product/${p.id}`)}>
        <Image source={{ uri: p.images[0] }} style={{ width: '100%', height: 220, backgroundColor: '#F1ECE4' }} />
        <View style={{ position: 'absolute', left: 12, top: 12 }}><Pill text={`${d.qty} made · first come`} tone="dark" icon="flash" /></View>
        <View style={{ position: 'absolute', right: 12, bottom: 12, backgroundColor: 'rgba(22,19,15,0.85)', borderRadius: R.md, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>DROPS IN</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{cd.text}</Text>
        </View>
      </Pressable>
      <View style={{ padding: S.lg }}>
        <Text style={T.h3}>{d.title}</Text>
        <Pressable onPress={() => router.push(`/shop/${shop.id}`)}><Text style={[T.small, { marginTop: 2 }]}>by <Text style={{ fontWeight: '800', color: C.ink }}>{shop.name}</Text> · ${p.price.toFixed(2)}</Text></Pressable>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: S.md }}>
          <Pressable onPress={() => { if (!on && notif === 'unknown') router.push({ pathname: '/notify', params: { reason: 'drop' } }); toggleReminder(d.id); }} accessibilityRole="button" style={{ flex: 1, height: 44, borderRadius: R.pill, backgroundColor: on ? C.goodSoft : C.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name={on ? 'checkmark-circle' : 'notifications'} size={18} color={on ? C.good : '#fff'} />
            <Text style={{ color: on ? C.good : '#fff', fontWeight: '800' }}>{on ? 'Reminder set' : 'Remind me'}</Text>
          </Pressable>
          <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'drop', id: d.id } })} accessibilityRole="button" accessibilityLabel="Share this drop" style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="paper-plane-outline" size={18} color={C.ink} />
          </Pressable>
        </View>
        {(counts[d.id] ?? 0) >= 3 && <Text style={[T.tiny, { marginTop: 8 }]}>{compact(counts[d.id])} people have a reminder set</Text>}
      </View>
    </View>
  );
}

export default function Drops() {
  const counts = useDropCounts();
  const [waitlisted, setWaitlisted] = useState(false);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Drops" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={[T.body, { color: C.ink2, paddingHorizontal: S.lg, marginBottom: S.lg }]}>Limited runs from indie makers. Set a reminder and we'll ping you the minute it opens.</Text>
        {drops.map(d => <DropCard key={d.id} d={d} counts={counts} />)}
        {/* Live shopping teaser: builds the audience before phase 2 ships */}
        <View style={{ marginHorizontal: S.lg, padding: S.xl, borderRadius: R.lg, backgroundColor: C.dark }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent }} />
            <Text style={{ color: '#fff', fontWeight: '900', letterSpacing: 1 }}>LIVE · COMING SOON</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 10 }}>Watch makers go live. Buy in one tap.</Text>
          <Text style={{ color: '#CFC7BC', marginTop: 6, lineHeight: 20 }}>Live shows from the shops you follow, with drop prices that only last the show.</Text>
          <Pressable onPress={() => setWaitlisted(true)} accessibilityRole="button" style={{ marginTop: S.lg, height: 44, borderRadius: R.pill, backgroundColor: waitlisted ? C.good : '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: waitlisted ? '#fff' : C.ink, fontWeight: '800' }}>{waitlisted ? "You're on the early list" : 'Get early access'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
