import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui';
import { C, S, T } from '@/lib/theme';

export default function Payments() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Payment methods" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {/* Nothing is saved yet: cards are added (and stored by Stripe) the first time you pay by card. */}
        <Card style={{ alignItems: 'center', gap: 8 }}>
          <Ionicons name="card-outline" size={28} color={C.ink3} />
          <Text style={T.h3}>No saved payment methods</Text>
          <Text style={[T.small, { textAlign: 'center' }]}>Pay by card, Apple Pay or Google Pay at checkout. A card you choose to save will show here.</Text>
        </Card>
        <Text style={[T.small, { textAlign: 'center' }]}>Cards are stored by Stripe. We never see your full card number.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
