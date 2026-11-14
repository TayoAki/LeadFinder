import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { Mood, Shelby, ShelbySays } from '@/components/Shelby';
import { Button, Chip, IconButton } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { categories, categoryIcon, products, shops } from '@/lib/data';
import { Goal, parse, pick, reasons } from '@/lib/shelby';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { track } from '@/lib/analytics';

// Onboarding built on the essay's rules (Effective_App_Onboarding_Essay):
// - one specific promise, then a first real success (saving a pick) before anything is asked of the user;
// - every question changes what Shelby shows next, and says so under the question;
// - honest progress ("step 2 of 3" means 3), Back keeps answers, Skip is always visible;
// - no fake "analysing" delay: picks appear at once with the real reasons they were chosen;
// - no account, no rating request, no paywall; notifications only offered after a save, in context;
// - selected answers carry a check icon, not just colour.
type Step = 'welcome' | 'goal' | 'details' | 'picks';
const GOALS: { key: Goal; title: string; sub: string; icon: any }[] = [
  { key: 'gift', title: 'Find a gift', sub: "Tell me who it's for, I'll pick", icon: 'gift' },
  { key: 'treat', title: 'Treat myself', sub: 'Something nice, made by a small shop', icon: 'sparkles' },
  { key: 'find', title: 'Find something specific', sub: 'Describe it in your own words', icon: 'search' },
  { key: 'browse', title: 'Just looking around', sub: "I'll show what people love this week", icon: 'compass' },
];
const BUDGETS: { label: string; v: number | null }[] = [{ label: 'Under $25', v: 25 }, { label: 'Under $50', v: 50 }, { label: 'Under $100', v: 100 }, { label: 'No limit', v: null }];
const EXAMPLES = ['a mug for a coffee lover', 'summer dress under $40', 'earrings for my sister'];

function Progress({ step }: { step: number }) {
  return (
    <View accessibilityLabel={`Shelby setup, step ${step} of 3`}>
      <Text style={T.tiny}>SHELBY SETUP · STEP {step} OF 3</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
        {[1, 2, 3].map(i => <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= step ? C.accent : C.line }} />)}
      </View>
    </View>
  );
}

function Option({ title, sub, icon, on, onPress }: { title: string; sub: string; icon: any; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={`${title}. ${sub}`}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: S.lg, borderRadius: R.lg, backgroundColor: on ? C.accentSoft : C.surface, borderWidth: 2, borderColor: on ? C.accent : C.line, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: on ? C.accent : C.bg, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={icon} size={22} color={on ? '#fff' : C.ink} /></View>
      <View style={{ flex: 1 }}><Text style={T.h3}>{title}</Text><Text style={T.small}>{sub}</Text></View>
      <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={on ? C.accent : C.ink3} />
    </Pressable>
  );
}

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const st = useStore();
  const [step, setStep] = useState<Step>('welcome');
  const [goal, setGoal] = useState<Goal | null>(st.goal);
  const [cats, setCats] = useState<string[]>(st.interests);
  const [budget, setBudget] = useState<number | null>(st.budget);
  const [text, setText] = useState('');
  const [watch, setWatch] = useState<'asked' | 'yes' | 'no' | null>(null);

  const ask = useMemo(() => {
    if (goal === 'find' && text.trim()) { const a = parse(text); return { ...a, goal, maxPrice: a.maxPrice ?? budget ?? undefined }; }
    return { categories: cats, maxPrice: budget ?? undefined, goal: goal ?? undefined };
  }, [goal, cats, budget, text]);
  const picks = useMemo(() => pick(ask, 6), [ask]);
  const shopCount = new Set(picks.map(p => p.shopId)).size;
  const saved = picks.filter(p => st.wishlist.includes(p.id)).length;

  useEffect(() => { track('onboarding_step', { step }); }, [step]);
  const finish = () => {
    track('onboarding_complete', { goal: goal ?? 'none', budget: budget ?? 0, categories: ask.categories.join(','), saved, price_watch: watch ?? 'not_asked', shops: shopCount });
    st.setGoal(goal); st.setBudget(budget); st.setInterests(ask.categories); st.setOnboarded(true);
    if (watch === 'yes') st.setNotif('granted');
    router.back();
  };
  const browse = () => { track('onboarding_skip', { at: step }); st.setOnboarded(true); router.back(); };
  const mood: Mood = step === 'picks' ? (saved ? 'happy' : 'idle') : step === 'welcome' ? 'wave' : 'idle';
  const w = (width - S.lg * 2 - 12) / 2;

  if (step === 'welcome') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: S.lg }}>
          <Logo size={26} />
          <Pressable onPress={browse} accessibilityRole="button" hitSlop={10}><Text style={{ color: C.ink2, fontWeight: '700' }}>Just browse</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 160, alignItems: 'center' }}>
          <Shelby size={150} mood={mood} />
          <Text style={[T.h1, { textAlign: 'center', fontSize: 30, marginTop: S.lg }]}>Hi, I'm Shelby.</Text>
          <Text style={[T.body, { textAlign: 'center', color: C.ink2, marginTop: 6, fontSize: 17, lineHeight: 24 }]}>Tell me what you're shopping for and I'll find it from {shops.length} independent shops. One cart, one checkout.</Text>
          {/* Real products on the very first screen: value is visible before any question */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: S.lg }}>
            {products.slice(0, 8).map(p => <Image key={p.id} source={{ uri: p.image }} accessibilityLabel={p.title} style={{ width: 72, height: 80, borderRadius: R.md, backgroundColor: '#EFE7DC' }} />)}
          </ScrollView>
          <View style={{ alignSelf: 'stretch', gap: 10 }}>
            {['Tell me what you need (3 quick steps)', 'I pick from small shops and show you why', 'Save what you like. No account needed'].map((t, i) => (
              <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: C.accent, fontWeight: '900' }}>{i + 1}</Text></View>
                <Text style={{ color: C.ink, flex: 1 }}>{t}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, backgroundColor: C.bg }}>
          <Button title="Let's find something" kind="accent" onPress={() => setStep('goal')} testID="ob-start" />
          <Text style={{ textAlign: 'center', color: C.ink3, fontSize: 12, marginTop: 8 }}>{BRAND.name} is free. You only pay for what you buy.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const n = step === 'goal' ? 1 : step === 'details' ? 2 : 3;
  const back = () => setStep(step === 'picks' ? 'details' : step === 'details' ? 'goal' : 'welcome');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: S.sm, paddingTop: S.sm }}>
        <IconButton name="chevron-back" label="Back" onPress={back} />
        <View style={{ flex: 1 }}><Progress step={n} /></View>
        <Pressable onPress={browse} accessibilityRole="button" hitSlop={10} style={{ paddingHorizontal: S.md }}><Text style={{ color: C.ink2, fontWeight: '700' }}>Skip</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: S.lg, paddingBottom: 200, gap: S.md }} keyboardShouldPersistTaps="handled">
        {step === 'goal' && <>
          <ShelbySays text="What can I help you with today?" mood={mood} />
          {GOALS.map(g => <Option key={g.key} title={g.title} sub={g.sub} icon={g.icon} on={goal === g.key} onPress={() => setGoal(g.key)} />)}
          <Text style={T.small}>This decides the next question and how I rank picks. You can change it later.</Text>
        </>}

        {step === 'details' && <>
          <ShelbySays mood={mood} text={goal === 'gift' ? "Who's it for? Tell me what they're into." : goal === 'find' ? 'Describe it like you would to a friend.' : 'What are you into?'} />
          {goal === 'find' ? <>
            <TextInput value={text} onChangeText={setText} placeholder="e.g. a mug for a coffee lover" placeholderTextColor={C.ink3} accessibilityLabel="What are you looking for"
              style={{ minHeight: 56, borderRadius: R.lg, borderWidth: 2, borderColor: text ? C.accent : C.line, backgroundColor: C.surface, paddingHorizontal: 16, fontSize: 16, color: C.ink }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{EXAMPLES.map(e => <Chip key={e} label={e} icon="sparkles" onPress={() => setText(e)} />)}</View>
          </> : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {categories.filter(c => c !== 'All').map(c => {
                const on = cats.includes(c);
                return <Chip key={c} label={c} icon={on ? 'checkmark' : (categoryIcon[c] as any)} active={on} onPress={() => setCats(v => (on ? v.filter(x => x !== c) : [...v, c]))} />;
              })}
            </View>
          )}
          <Text style={[T.tiny, { marginTop: S.md }]}>BUDGET</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {BUDGETS.map(b => <Chip key={b.label} label={b.label} icon={budget === b.v ? 'checkmark' : undefined} active={budget === b.v} onPress={() => setBudget(b.v)} />)}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, padding: S.md, borderRadius: R.md, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
            <Ionicons name="information-circle-outline" size={18} color={C.ink2} />
            <Text style={[T.small, { flex: 1 }]}>I only use this to pick items, and you'll see it on the next screen. {goal === 'browse' ? 'Pick none and I’ll show what’s popular.' : 'Change it any time.'}</Text>
          </View>
        </>}

        {step === 'picks' && <>
          <ShelbySays mood={mood} text={saved ? (watch ? 'Saved. Your feed is ready.' : 'Nice pick! Want me to watch its price?') : `Here are ${picks.length} picks from ${shopCount} small shop${shopCount === 1 ? '' : 's'}. Tap the heart to save one.`} />
          {/* The real reasons, editable: no fake processing step */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Text style={T.small}>Based on:</Text>
            {reasons(ask).map(r => <View key={r} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: R.pill, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}><Text style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>{r}</Text></View>)}
            <Pressable onPress={() => setStep('details')} accessibilityRole="button"><Text style={{ color: C.accent, fontWeight: '800', fontSize: 13 }}>Edit</Text></Pressable>
          </View>
          {saved > 0 && !watch && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="Yes, watch prices" kind="primary" icon="notifications" style={{ flex: 1, height: 44 }} onPress={() => setWatch('yes')} />
              <Button title="Not now" kind="ghost" style={{ flex: 1, height: 44 }} onPress={() => setWatch('no')} />
            </View>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 18 }}>
            {picks.map((p, i) => (
              <View key={p.id}>
                <ProductCard p={p} width={w} />
                {i === 0 && !saved && (
                  <View pointerEvents="none" style={{ position: 'absolute', right: 2, top: 46, backgroundColor: C.ink, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>Tap ♡ to save</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>}
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: S.lg, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line }}>
        {step === 'goal' && <Button title="Continue" kind="accent" disabled={!goal} onPress={() => setStep('details')} testID="ob-next" />}
        {step === 'details' && <Button title="Show my picks" kind="accent" disabled={goal === 'find' && !text.trim()} onPress={() => setStep('picks')} testID="ob-next" />}
        {step === 'picks' && <>
          <Button title={saved ? 'See my feed' : 'Save one to continue'} kind="accent" disabled={!saved} onPress={finish} testID="ob-finish" />
          <Pressable onPress={finish}><Text style={{ textAlign: 'center', color: C.ink2, fontWeight: '600', marginTop: 10 }}>Skip, go to my feed</Text></Pressable>
        </>}
      </View>
    </SafeAreaView>
  );
}
