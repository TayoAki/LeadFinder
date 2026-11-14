import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Button, Chip } from '@/components/ui';
import { categories } from '@/lib/data';
import { MY_SHOP } from '@/lib/sellerData';
import { C, R, S, T } from '@/lib/theme';

const input = { height: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingHorizontal: 14, fontSize: 15, color: C.ink, marginTop: 4 } as const;

export default function NewProduct() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [cat, setCat] = useState('Home');
  const [variants, setVariants] = useState(false);
  const [drop, setDrop] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title="New product" back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, paddingBottom: 60 }}>
        <Text style={T.tiny}>PHOTOS · UP TO 8</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          <Pressable style={{ width: 96, height: 96, borderRadius: R.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.ink3, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Add photos">
            <Ionicons name="camera" size={26} color={C.ink2} /><Text style={T.small}>Add</Text>
          </Pressable>
          {[0, 1].map(i => <View key={i} style={{ width: 96, height: 96, borderRadius: R.md, backgroundColor: '#EEE7DD' }} />)}
        </View>
        <Text style={[T.small, { marginTop: 6 }]}>Tip: the first photo is your share card. Natural light, plain background.</Text>
        <Text style={[T.tiny, { marginTop: S.lg }]}>TITLE</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Speckled stoneware mug, 12 oz" placeholderTextColor={C.ink3} style={input} accessibilityLabel="Title" />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: S.md }}>
          <View style={{ flex: 1 }}><Text style={T.tiny}>PRICE (USD)</Text><TextInput value={price} onChangeText={setPrice} placeholder="28.00" keyboardType="decimal-pad" placeholderTextColor={C.ink3} style={input} accessibilityLabel="Price" /></View>
          <View style={{ flex: 1 }}><Text style={T.tiny}>STOCK</Text><TextInput value={stock} onChangeText={setStock} keyboardType="number-pad" style={input} accessibilityLabel="Stock" /></View>
        </View>
        {!!price && <Text style={[T.small, { marginTop: 6 }]}>You keep ${(Number(price) * 0.9).toFixed(2)} after the 10% commission (0% during your first 60 days).</Text>}
        <Text style={[T.tiny, { marginTop: S.md }]}>CATEGORY</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>{categories.filter(c => c !== 'All').map(c => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}</View>
        {[['Has sizes or colours', variants, setVariants], ['Release as a timed drop', drop, setDrop]].map(([l, v, set]: any) => (
          <View key={l} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.lg }}>
            <Text style={T.h3}>{l}</Text><Switch value={v} onValueChange={set} trackColor={{ true: C.accent, false: C.line }} />
          </View>
        ))}
        {drop && <Text style={[T.small, { marginTop: 6 }]}>Followers get a reminder card. Drops with 500+ reminders are featured on the Drops tab.</Text>}
        <Button title={saved ? 'Saved · share it now?' : 'Publish'} kind="accent" style={{ marginTop: S.xl }} disabled={!title || !price}
          onPress={() => { if (saved) router.push({ pathname: '/share', params: { kind: 'shop', id: MY_SHOP } }); else setSaved(true); }} />
        <Button title="Save as draft" kind="ghost" style={{ marginTop: S.sm }} onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}
