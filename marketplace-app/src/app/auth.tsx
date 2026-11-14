import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark } from '@/components/Logo';
import { Button, IconButton } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Auth() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { signIn } = useStore();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'start' | 'code'>('start');
  const [code, setCode] = useState('');
  const done = (name?: string) => { signIn(name); router.back(); if (next) setTimeout(() => router.push(next as any), 50); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ alignItems: 'flex-end', padding: S.md }}><IconButton name="close" label="Close" onPress={() => router.back()} /></View>
      <View style={{ padding: S.xl, gap: S.md }}>
        <LogoMark size={56} />
        <Text style={[T.h1, { marginTop: S.md }]}>{step === 'start' ? `Get $${BRAND.firstOrderOff} off your first order` : 'Check your email'}</Text>
        <Text style={[T.body, { color: C.ink2 }]}>{step === 'start' ? 'One account for every shop: saved wishlist, followed shops and order tracking.' : `We sent a 6-digit code to ${email || 'your email'}.`}</Text>
        {step === 'start' ? <>
          <Button title="Continue with Apple" icon="logo-apple" style={{ marginTop: S.lg }} onPress={() => done('Taylor')} />
          <Button title="Continue with Google" icon="logo-google" kind="light" onPress={() => done('Taylor')} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: S.sm }}><View style={{ flex: 1, height: 1, backgroundColor: C.line }} /><Text style={T.small}>or</Text><View style={{ flex: 1, height: 1, backgroundColor: C.line }} /></View>
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={C.ink3} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email"
            style={{ height: 52, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingHorizontal: 16, fontSize: 16, color: C.ink }} />
          <Button title="Email me a code" kind="accent" disabled={!email.includes('@')} onPress={() => setStep('code')} />
        </> : <>
          <TextInput value={code} onChangeText={t => { setCode(t); if (t.length === 6) done(email.split('@')[0]); }} placeholder="000000" placeholderTextColor={C.ink3} keyboardType="number-pad" maxLength={6} accessibilityLabel="Six digit code"
            style={{ height: 64, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, fontSize: 28, letterSpacing: 12, textAlign: 'center', color: C.ink, marginTop: S.lg }} />
          <Pressable onPress={() => setStep('start')}><Text style={{ color: C.accent, fontWeight: '700', textAlign: 'center', marginTop: S.md }}>Use a different email</Text></Pressable>
        </>}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: S.lg }}>
          <Ionicons name="lock-closed" size={13} color={C.ink3} />
          <Text style={[T.small, { flex: 1 }]}>We never sell your data. By continuing you agree to the Terms and Privacy Policy.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
