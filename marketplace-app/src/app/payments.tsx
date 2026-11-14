import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { C, S, T } from '@/lib/theme';

export default function Payments() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Payment methods" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {[['logo-apple', 'Apple Pay', 'Default'], ['card-outline', 'Visa ending 4242', 'Expires 08/29']].map(([i, a, b]) => (
          <Card key={a} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name={i as any} size={24} color={C.ink} />
            <View style={{ flex: 1 }}><Text style={T.h3}>{a}</Text><Text style={T.small}>{b}</Text></View>
          </Card>
        ))}
        <Button title="Add a card" kind="ghost" icon="add" />
        <Text style={[T.small, { textAlign: 'center' }]}>Cards are stored by Stripe. We never see your full card number.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
