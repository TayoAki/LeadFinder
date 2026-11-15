// The shopper's saved shipping address (kept on this device and used at checkout).
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddressForm, formatAddress } from '@/components/AddressForm';
import { Header } from '@/components/Header';
import { toast } from '@/lib/feedback';
import { useStore } from '@/lib/store';
import { C, S, T } from '@/lib/theme';

export default function Addresses() {
  const { address, setAddress, user } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Shipping address" back />
      <ScrollView contentContainerStyle={{ padding: S.lg }}>
        <Text style={[T.body, { color: C.ink2 }]}>{address ? `Saved: ${address.name}, ${formatAddress(address)}` : 'No address saved yet. Add one and checkout fills it in for you.'}</Text>
        <AddressForm initial={address ?? { name: user?.name ?? '' }} saveLabel="Save address" onSave={a => { setAddress(a); toast({ text: 'Address saved', icon: 'checkmark-circle' }); router.canGoBack() && router.back(); }} />
      </ScrollView>
    </SafeAreaView>
  );
}
