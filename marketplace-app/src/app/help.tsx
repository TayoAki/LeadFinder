import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { C, S, T } from '@/lib/theme';

const faqs = [
  ['How does buying from several shops work?', 'You pay once. Each shop ships its own items and you get tracking for each in Orders.'],
  ['What is buyer protection?', "If an item doesn't arrive or isn't as described, we refund you, even if the shop doesn't respond."],
  ['How do returns work?', "Most items can be returned within 30 days. Start a return from the order; the shop's return policy is on its page."],
  ['When do I get my referral credit?', "When your friend's first order ships. Credit applies automatically at your next checkout."],
];

export default function Help() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Help" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: C.goodSoft, borderColor: C.goodSoft }}>
          <Ionicons name="shield-checkmark" size={28} color={C.good} />
          <Text style={{ flex: 1, color: C.good, fontWeight: '700' }}>Every order is covered by buyer protection.</Text>
        </Card>
        {faqs.map(([q, a]) => <Card key={q}><Text style={T.h3}>{q}</Text><Text style={[T.small, { marginTop: 4, lineHeight: 19 }]}>{a}</Text></Card>)}
        <View style={{ gap: S.sm }}>
          <Button title="Report a problem with an order" icon="alert-circle-outline" />
          <Button title="Chat with us" kind="ghost" icon="chatbubble-ellipses-outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
