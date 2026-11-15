import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { drops } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';
import * as Notifications from 'expo-notifications';

// Pre-permission screen: asked only at a moment the ping is obviously useful (a drop reminder,
// a shipped order), never at launch. "Not now" keeps the system prompt unused for later.
const copy: Record<string, { title: string; body: string; icon: any }> = {
  drop: { title: 'Want a ping when it drops?', body: 'Drops sell out in minutes. We only notify you about reminders you set, orders, and shops you follow.', icon: 'flash' },
  order: { title: 'Track your order live', body: "Get a ping when each shop ships and when it's out for delivery. No marketing spam.", icon: 'cube' },
};

export default function Notify() {
  const { reason = 'drop' } = useLocalSearchParams<{ reason?: string }>();
  const { setNotif } = useStore();
  const c = copy[reason] ?? copy.drop;
  const close = async (v: 'granted' | 'denied') => {
    // Phones: ask the OS for real; the shopper's choice in the system prompt is what we record.
    if (v === 'granted' && Platform.OS !== 'web') v = (await Notifications.requestPermissionsAsync().catch(() => ({ granted: false }))).granted ? 'granted' : 'denied';
    track('notification_permission', { result: v, reason }); setNotif(v); router.back();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', padding: S.xl }}>
      <View style={{ alignSelf: 'center', width: 88, height: 88, borderRadius: 44, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={c.icon} size={40} color={C.accent} />
      </View>
      <Text style={[T.h1, { textAlign: 'center', marginTop: S.xl }]}>{c.title}</Text>
      <Text style={[T.body, { textAlign: 'center', color: C.ink2, marginTop: S.sm }]}>{c.body}</Text>
      <View style={{ marginTop: S.xl, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Ionicons name="notifications" size={20} color={C.accent} />
        <Text style={{ flex: 1, color: C.ink }}><Text style={{ fontWeight: '800' }}>{drops[0].title}</Text> is live. {drops[0].qty} made. Tap to buy.</Text>
      </View>
      <Button title="Turn on notifications" kind="accent" style={{ marginTop: S.xl }} onPress={() => close('granted')} />
      <Button title="Not now" kind="ghost" style={{ marginTop: S.sm }} onPress={() => close('denied')} />
    </SafeAreaView>
  );
}
