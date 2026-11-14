import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { Button, Pill } from '@/components/ui';
import { C, R, S, T } from '@/lib/theme';

export default function Addresses() {
  const [list] = useState([
    { id: 'a1', label: 'Home', lines: '1208 Willow Ave, Apt 3\nAustin, TX 78702' },
    { id: 'a2', label: 'Work', lines: '500 Congress Ave, Floor 9\nAustin, TX 78701' },
  ]);
  const [def, setDef] = useState('a1');
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Addresses" back />
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        {list.map(a => (
          <Pressable key={a.id} onPress={() => setDef(a.id)} accessibilityRole="radio" accessibilityState={{ checked: def === a.id }} style={{ padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1.5, borderColor: def === a.id ? C.ink : C.line, flexDirection: 'row', gap: 12 }}>
            <Ionicons name={a.label === 'Home' ? 'home-outline' : 'briefcase-outline'} size={22} color={C.ink} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Text style={T.h3}>{a.label}</Text>{def === a.id && <Pill text="Default" tone="good" />}</View>
              <Text style={[T.small, { marginTop: 4 }]}>{a.lines}</Text>
            </View>
          </Pressable>
        ))}
        <Button title="Add an address" kind="ghost" icon="add" />
      </ScrollView>
    </SafeAreaView>
  );
}
