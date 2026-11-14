import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Button, Card, Chip } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { categories } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

const Field = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) => (
  <View style={{ marginTop: S.md }}>
    <Text style={T.tiny}>{label.toUpperCase()}</Text>
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.ink3} accessibilityLabel={label}
      style={{ marginTop: 4, height: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingHorizontal: 14, fontSize: 15, color: C.ink }} />
  </View>
);

// Three short steps: who you are, how you get paid (Stripe), and your first product.
export default function Apply() {
  const { setSeller } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cat, setCat] = useState('Home');
  const steps = ['Your shop', 'Get paid', 'First product'];
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title="Open your stall" back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, paddingBottom: 60 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {steps.map((s, i) => <View key={s} style={{ flex: 1 }}><View style={{ height: 6, borderRadius: 3, backgroundColor: i <= step ? C.accent : C.line }} /><Text style={[T.tiny, { marginTop: 4, color: i === step ? C.ink : C.ink3 }]}>{s}</Text></View>)}
        </View>
        {step === 0 && <>
          <Text style={[T.h1, { marginTop: S.xl }]}>Sell to your followers and ours.</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>0% commission for 60 days, then 10%. No monthly fee. Payouts to your bank as you ship.</Text>
          <Field label="Shop name" value={name} onChange={setName} placeholder="e.g. Kettle & Co." />
          <Field label="Where you sell now (optional)" value={link} onChange={setLink} placeholder="Instagram, Etsy or Shopify link" />
          <Text style={[T.tiny, { marginTop: S.md }]}>WHAT YOU SELL</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>{categories.filter(c => c !== 'All').map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}</View>
          <Button title="Continue" kind="accent" style={{ marginTop: S.xl }} disabled={!name} onPress={() => setStep(1)} />
        </>}
        {step === 1 && <>
          <Text style={[T.h1, { marginTop: S.xl }]}>Get paid with Stripe</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>Stripe verifies your identity and sends payouts to your bank. Takes about 5 minutes; you can finish later.</Text>
          <Card style={{ marginTop: S.lg, gap: 10 }}>
            {['Your legal name and date of birth', 'Bank account for payouts', 'Last 4 of SSN or your EIN'].map(t => <View key={t} style={{ flexDirection: 'row', gap: 8 }}><Ionicons name="checkmark-circle" size={18} color={C.good} /><Text style={{ flex: 1 }}>{t}</Text></View>)}
          </Card>
          <Button title="Continue to Stripe" icon="lock-closed" style={{ marginTop: S.xl }} onPress={() => setStep(2)} />
          <Pressable onPress={() => setStep(2)}><Text style={{ color: C.ink2, textAlign: 'center', marginTop: S.md, fontWeight: '600' }}>Do this later</Text></Pressable>
        </>}
        {step === 2 && <>
          <Text style={[T.h1, { marginTop: S.xl }]}>Add your first product</Text>
          <Text style={[T.body, { color: C.ink2, marginTop: 6 }]}>Shops with 10 or more products get featured in {BRAND.name}'s new-shop spotlight.</Text>
          <Button title="Add a product" kind="accent" icon="camera" style={{ marginTop: S.xl }} onPress={() => { setSeller('applied'); router.replace('/seller/product-new'); }} />
          <Button title="Import from Shopify or Etsy" kind="light" icon="cloud-download-outline" style={{ marginTop: S.sm }} onPress={() => { setSeller('applied'); router.replace('/seller'); }} />
          <Text style={[T.small, { textAlign: 'center', marginTop: 6 }]}>Import is coming in v1.1. We'll email you when it's ready.</Text>
        </>}
      </ScrollView>
    </SafeAreaView>
  );
}
