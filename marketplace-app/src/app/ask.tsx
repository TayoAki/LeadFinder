import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ProductCard';
import { Shelby } from '@/components/Shelby';
import { Chip, IconButton } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { Product } from '@/lib/data';
import { parse, pick, reasons } from '@/lib/shelby';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';

type Msg = { from: 'me' | 'shelby'; text: string; picks?: Product[]; based?: string[] };
const STARTERS = ['A gift for my dad under $40', 'Something cozy for my home', 'Earrings for my sister', 'Kitchen tools for a new cook'];

export default function AskShelby() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const { goal, budget } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'shelby', text: `Hi! Tell me what you're shopping for, who it's for and your budget. I'll pick from everything at ${BRAND.name}.` }]);
  const [text, setText] = useState('');
  const [thinking, setThinking] = useState(false);
  const scroll = useRef<any>(null);

  const send = (t: string) => {
    const msg = t.trim(); if (!msg) return;
    setText(''); setMsgs(m => [...m, { from: 'me', text: msg }]); setThinking(true);
    const a = parse(msg);
    const ask = { ...a, goal: a.goal ?? goal ?? undefined, maxPrice: a.maxPrice ?? budget ?? undefined };
    const picks = pick(ask, 4);
    track('ask_shelby', { query: msg.slice(0, 80), picks: picks.length, categories: (ask.categories ?? []).join(','), max_price: ask.maxPrice, goal: ask.goal });
    // A short, real wait for the answer (an LLM call in production), never a staged "analysing" screen.
    setTimeout(() => {
      setThinking(false);
      setMsgs(m => [...m, {
        from: 'shelby',
        text: a.categories.length ? `Here are ${picks.length} picks${ask.maxPrice ? ` under $${ask.maxPrice}` : ''}. Want me to narrow it down?` : "I wasn't sure of the type of thing, so here's what people love right now. Tell me a bit more?",
        picks, based: reasons(ask),
      }]);
    }, 450);
  };
  useEffect(() => { if (q) send(q); }, [q]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: S.sm, gap: 6 }}>
        <IconButton name="chevron-back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
        <Shelby size={34} mood={thinking ? 'thinking' : 'idle'} />
        <View style={{ flex: 1 }}><Text style={T.h3}>Ask Shelby</Text><Text style={T.small}>Your shopping helper</Text></View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} contentContainerStyle={{ padding: S.lg, gap: S.md }}>
          {msgs.map((m, i) => (
            <View key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'stretch', maxWidth: m.from === 'me' ? '82%' : '100%' }}>
              <View style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', backgroundColor: m.from === 'me' ? C.ink : C.surface, borderRadius: 18, borderBottomRightRadius: m.from === 'me' ? 4 : 18, borderBottomLeftRadius: m.from === 'me' ? 18 : 4, padding: 12, borderWidth: m.from === 'me' ? 0 : 1, borderColor: C.line, maxWidth: '88%' }}>
                <Text style={{ color: m.from === 'me' ? '#fff' : C.ink, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
              </View>
              {m.based && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                  <Text style={T.small}>Based on:</Text>
                  {m.based.map(b => <View key={b} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface }}><Text style={{ fontSize: 12, fontWeight: '700' }}>{b}</Text></View>)}
                </View>
              )}
              {m.picks && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: S.md }}>
                  {m.picks.map(p => <ProductCard key={p.id} p={p} width={150} />)}
                </ScrollView>
              )}
              {m.picks && (
                <Pressable onPress={() => router.push({ pathname: '/share', params: { kind: 'product', id: m.picks![0].id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <Ionicons name="paper-plane-outline" size={14} color={C.accent} /><Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>Send these picks to a friend</Text>
                </Pressable>
              )}
            </View>
          ))}
          {thinking && <Text style={[T.small, { fontStyle: 'italic' }]}>Shelby is looking…</Text>}
          {msgs.length === 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{STARTERS.map(s => <Chip key={s} label={s} icon="sparkles" onPress={() => send(s)} />)}</View>
          )}
        </ScrollView>
        <View style={{ padding: S.md, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.surface }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput value={text} onChangeText={setText} onSubmitEditing={() => send(text)} placeholder="e.g. a birthday gift under $50" placeholderTextColor={C.ink3} returnKeyType="send" accessibilityLabel="Message Shelby"
              style={{ flex: 1, height: 46, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, paddingHorizontal: 16, fontSize: 15, color: C.ink, backgroundColor: C.bg }} />
            <IconButton name="arrow-up" label="Send" color="#fff" bg={text.trim() ? C.accent : C.ink3} onPress={() => send(text)} />
          </View>
          <Text style={[T.tiny, { marginTop: 6, textAlign: 'center', fontWeight: '500' }]}>Shelby picks from shops on {BRAND.name} and can get things wrong. Prices and stock are live.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
