import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { C, S, T } from '@/lib/theme';

const faqs = [
  ['When will my order arrive?', 'Every item is made after you order, which usually takes a few business days, then it ships. Tracking appears in Orders once it is on its way.'],
  ['What does shipping cost?', 'Shipping is added at checkout, and you see the total before you pay.'],
  ['Something is wrong with my order', 'Report it from the order, or with the button below, and we will look into it.'],
];

export default function Help() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Help" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {faqs.map(([q, a]) => <Card key={q}><Text style={T.h3}>{q}</Text><Text style={[T.small, { marginTop: 4, lineHeight: 19 }]}>{a}</Text></Card>)}
        <View style={{ gap: S.sm }}>
          <Button title="Report a problem with an order" icon="alert-circle-outline" />
          <Button title="Chat with us" kind="ghost" icon="chatbubble-ellipses-outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
