import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { BRAND, link } from '@/lib/brand';
import { money } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Invite() {
  const { user, invitesSent, credit } = useStore();
  const code = user?.code ?? 'Sign in to get your code';
  const goal = 5;
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Invite friends" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.lg }}>
        <View style={{ padding: S.xl, borderRadius: R.lg, backgroundColor: C.ink }}>
          <Ionicons name="gift" size={36} color={C.accent} />
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', marginTop: S.md }}>Give ${BRAND.referralReward}.{'\n'}Get ${BRAND.referralReward}.</Text>
          <Text style={{ color: '#CFC7BC', marginTop: 6, lineHeight: 21 }}>Your friend gets ${BRAND.referralReward} off their first order from any shop. When they buy, you get ${BRAND.referralReward} credit. No limit.</Text>
        </View>
        <Card>
          <Text style={T.tiny}>YOUR LINK</Text>
          <Text style={[T.h3, { marginTop: 4 }]} selectable>{user ? link('/', user.code) : code}</Text>
          <Button title={user ? 'Share my link' : 'Sign in to get your link'} kind="accent" icon="paper-plane" style={{ marginTop: S.md }}
            onPress={() => router.push(user ? { pathname: '/share', params: { kind: 'invite', id: 'me' } } : { pathname: '/auth', params: { next: '/invite' } })} />
        </Card>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={T.h3}>Invite {goal} friends, unlock free shipping for a month</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: S.md }}>
            {Array.from({ length: goal }).map((_, i) => <View key={i} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: i < invitesSent ? C.accent : C.line }} />)}
          </View>
          <Text style={[T.small, { marginTop: 8 }]}>{Math.min(invitesSent, goal)} of {goal} sent · {money(credit)} credit available</Text>
        </Card>
        <Card>
          <Text style={T.h3}>How it works</Text>
          {['Share your link anywhere: texts, stories, group chats.', `They get $${BRAND.referralReward} off automatically, no code to type.`, `You get $${BRAND.referralReward} credit the moment their order ships.`].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10, marginTop: S.md }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.accent, fontWeight: '900' }}>{i + 1}</Text></View>
              <Text style={{ flex: 1, color: C.ink }}>{t}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
