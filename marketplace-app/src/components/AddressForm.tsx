// Shipping address form (US only: the store's one region). Used at checkout and in Addresses.
// Validates as you type and only hands back a complete address; the store saves it on the device.
import React, { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { Address } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { Button } from './ui';

const STATES = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR'.split(' ');

export function addressProblem(a: Partial<Address>): string | null {
  if (!a.name || a.name.trim().length < 2) return 'Add the name for the delivery';
  if (!a.address_1 || a.address_1.trim().length < 4) return 'Add the street address';
  if (!a.city || a.city.trim().length < 2) return 'Add the city';
  if (!a.province || !STATES.includes(a.province.trim().toUpperCase())) return 'Use a 2-letter US state code (e.g. TX)';
  if (!a.postal_code || !/^\d{5}(-\d{4})?$/.test(a.postal_code.trim())) return 'Use a 5-digit ZIP code';
  if (a.phone && a.phone.replace(/\D/g, '').length < 10) return 'Check the phone number (10 digits)';
  return null;
}
export const formatAddress = (a: Address) => `${a.address_1}${a.address_2 ? `, ${a.address_2}` : ''}, ${a.city}, ${a.province} ${a.postal_code}`;

function Field({ label, value, onText, ...rest }: { label: string; value: string; onText: (v: string) => void } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={[T.tiny, { marginBottom: 4 }]}>{label.toUpperCase()}</Text>
      <TextInput value={value} onChangeText={onText} placeholderTextColor={C.ink3} accessibilityLabel={label}
        style={{ height: 46, borderWidth: 1, borderColor: C.line, borderRadius: R.md, paddingHorizontal: 12, fontSize: 15, color: C.ink, backgroundColor: C.surface }} {...rest} />
    </View>
  );
}

export function AddressForm({ initial, onSave, saveLabel = 'Use this address' }: { initial?: Partial<Address> | null; onSave: (a: Address) => void; saveLabel?: string }) {
  const [a, setA] = useState<Partial<Address>>({ name: '', address_1: '', address_2: '', city: '', province: '', postal_code: '', phone: '', ...(initial ?? {}) });
  const [tried, setTried] = useState(false);
  const set = (k: keyof Address) => (v: string) => setA(x => ({ ...x, [k]: k === 'province' ? v.toUpperCase().slice(0, 2) : v }));
  const problem = useMemo(() => addressProblem(a), [a]);
  const save = () => {
    setTried(true);
    if (problem) return;
    onSave({ name: a.name!.trim(), address_1: a.address_1!.trim(), address_2: a.address_2?.trim() || undefined, city: a.city!.trim(), province: a.province!.trim().toUpperCase(), postal_code: a.postal_code!.trim(), phone: a.phone?.trim() || undefined });
  };
  return (
    <View style={{ gap: S.md, marginTop: S.md }}>
      <Field label="Full name" value={a.name ?? ''} onText={set('name')} autoComplete="name" textContentType="name" placeholder="Jordan Lee" />
      <Field label="Street address" value={a.address_1 ?? ''} onText={set('address_1')} autoComplete="address-line1" textContentType="streetAddressLine1" placeholder="123 Main St" />
      <Field label="Apartment, suite (optional)" value={a.address_2 ?? ''} onText={set('address_2')} autoComplete="address-line2" textContentType="streetAddressLine2" placeholder="Apt 4B" />
      <View style={{ flexDirection: 'row', gap: S.sm }}>
        <View style={{ flex: 2 }}><Field label="City" value={a.city ?? ''} onText={set('city')} autoComplete="postal-address-locality" textContentType="addressCity" /></View>
        <View style={{ flex: 1 }}><Field label="State" value={a.province ?? ''} onText={set('province')} autoCapitalize="characters" maxLength={2} autoComplete="postal-address-region" textContentType="addressState" placeholder="TX" /></View>
        <View style={{ flex: 1.3 }}><Field label="ZIP" value={a.postal_code ?? ''} onText={set('postal_code')} keyboardType="number-pad" maxLength={10} autoComplete="postal-code" textContentType="postalCode" /></View>
      </View>
      <Field label="Phone (optional, for delivery issues)" value={a.phone ?? ''} onText={set('phone')} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
      <Text style={T.small}>We ship to US addresses.</Text>
      {tried && problem && <Text style={{ color: C.sale, fontWeight: '700' }} accessibilityRole="alert">{problem}</Text>}
      <Button title={saveLabel} kind="primary" onPress={save} />
    </View>
  );
}
