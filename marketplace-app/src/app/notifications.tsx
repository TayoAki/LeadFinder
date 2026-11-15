import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { C, R, S, T } from '@/lib/theme';


const prefs = [['Orders and shipping', true], ['Restocks and reminders you set', true], ['Price drops on your wishlist', true], ['Friends who join with your link', true], ['Deals and recommendations', false]] as const;

export default function Notifications() {
  const [on, setOn] = useState<boolean[]>(prefs.map(p => p[1]));
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Notifications" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.sm }}>
        {/* Only real notifications belong here; none are stored yet, so say so plainly. */}
        <View style={{ alignItems: 'center', padding: S.xl, gap: 8 }}>
          <Ionicons name="notifications-outline" size={36} color={C.ink3} />
          <Text style={T.h3}>No notifications yet</Text>
          <Text style={[T.small, { textAlign: 'center' }]}>Order updates, restocks and reminders you set will show up here.</Text>
        </View>
        <Text style={[T.h3, { marginTop: S.xl }]}>What we ping you about</Text>
        <Text style={T.small}>Marketing is off by default. Turn anything off any time.</Text>
        {prefs.map(([label], i) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }}>
            <Text style={{ flex: 1, color: C.ink }}>{label}</Text>
            <Switch value={on[i]} onValueChange={v => setOn(o => o.map((x, j) => (j === i ? v : x)))} trackColor={{ true: C.accent, false: C.line }} accessibilityLabel={label} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
