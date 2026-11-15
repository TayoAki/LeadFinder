// "Find your match": 2–4 taps, one question per screen, then ranked picks for the shopper's
// segment (src/lib/icp.ts). Tracked as quiz_start → quiz_answer → quiz_complete → quiz_result_add,
// so Admin → Analytics shows where people drop and how each ICP converts.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from '@/components/ProductCard';
import { Button } from '@/components/ui';
import { track } from '@/lib/analytics';
import { haptic } from '@/lib/feedback';
import { AREAS, Area, icpOf, matchScore, QuizProfile, questionsFor, rankFor } from '@/lib/icp';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Quiz() {
  const { width } = useWindowDimensions();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { setProfile, add, rememberSize } = useStore();
  const [answers, setAnswers] = useState<Partial<QuizProfile>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<QuizProfile | null>(null);
  useEffect(() => { track('quiz_start', { from: from ?? 'unknown' }); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = useMemo(() => [AREAS, ...(answers.area ? questionsFor(answers.area as Area) : [])], [answers.area]);
  const q = questions[step];
  const total = answers.area ? questions.length : 3;

  const pick = (value: string) => {
    haptic('select');
    const next = { ...answers, [q.key]: q.key === 'budget' ? (value ? Number(value) : null) : value } as Partial<QuizProfile>;
    track('quiz_answer', { question: String(q.key), answer: value || 'none', step: step + 1 });
    setAnswers(next);
    if (step + 1 < (next.area ? [AREAS, ...questionsFor(next.area as Area)].length : 1)) { setStep(step + 1); return; }
    const base = { area: next.area as Area, goal: next.goal, skin_type: next.skin_type, concern: next.concern, size: next.size, budget: next.budget ?? null };
    const profile: QuizProfile = { ...base, icp: icpOf(base).key, at: Date.now() };
    if (profile.size) rememberSize(['XS', 'S', 'M', 'L', 'XL', 'XXL'], profile.size);
    setProfile(profile);
    track('quiz_complete', { icp: profile.icp, area: profile.area, goal: profile.goal, skin_type: profile.skin_type, concern: profile.concern, budget: profile.budget ?? 0, results: rankFor(profile).length });
    setDone(profile);
  };

  if (done) {
    const info = icpOf(done);
    const picks = rankFor(done).slice(0, 6);
    // Only items that genuinely match an answer go in the set (never filler to raise the basket).
    const routine = picks.filter(p => !p.sizes.length && matchScore(done, p) > 0).slice(0, done.area === 'skin' ? 3 : 2);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ padding: S.lg, gap: 6 }}>
            <Text style={T.tiny}>YOUR MATCH</Text>
            <Text style={[T.h1, { fontSize: 28 }]}>{info.title}</Text>
            <Text style={[T.body, { color: C.ink2 }]}>{info.line} Here's what fits, best match first.</Text>
          </View>
          {picks.length ? <ProductGrid items={picks} width={width} /> : (
            <Text style={[T.body, { padding: S.lg, color: C.ink2 }]}>Nothing in stock fits all your answers yet. Try a higher budget, or browse everything.</Text>
          )}
          {routine.length >= 2 && (
            <View style={{ margin: S.lg, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, gap: 8 }}>
              <Text style={T.h3}>{done.area === 'skin' ? 'Your routine' : 'Your starter set'}</Text>
              <Text style={T.small}>{routine.map(p => p.title).join(' + ')}</Text>
              <Button title={`Add all ${routine.length} · $${routine.reduce((n, p) => n + p.price, 0).toFixed(2)}`} kind="buy" icon="bag-add"
                onPress={() => { routine.forEach((p, i) => add(p, null, 1, { toast: i === routine.length - 1 ? `Added ${routine.length} items` : false })); track('quiz_result_add', { icp: done.icp, items: routine.length }); }} />
            </View>
          )}
          <View style={{ paddingHorizontal: S.lg, gap: 10 }}>
            <Button title="Keep shopping" kind="primary" onPress={() => router.replace('/')} />
            <Pressable onPress={() => { setDone(null); setStep(0); setAnswers({}); track('quiz_retake', {}); }} accessibilityRole="button" style={{ alignItems: 'center', padding: S.md }}>
              <Text style={{ color: C.accent, fontWeight: '700' }}>Retake the quiz</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: S.lg }}>
        <Pressable onPress={() => (step ? setStep(step - 1) : router.back())} accessibilityRole="button" accessibilityLabel={step ? 'Previous question' : 'Close'} hitSlop={10}>
          <Ionicons name={step ? 'chevron-back' : 'close'} size={24} color={C.ink} />
        </Pressable>
        <Text style={T.small}>Question {step + 1} of {total}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ height: 4, marginHorizontal: S.lg, borderRadius: 2, backgroundColor: C.line }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: C.accent, width: `${((step + 1) / total) * 100}%` }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: 10 }}>
        <Text style={[T.h1, { fontSize: 26 }]}>{q.title}</Text>
        <Text style={[T.small, { marginBottom: 6 }]}>{q.sub}</Text>
        {q.options.map(o => (
          <Pressable key={o.label} onPress={() => pick(o.value)} accessibilityRole="button" accessibilityLabel={o.label}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 2, borderColor: C.line, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={o.icon as any} size={20} color={C.accent} /></View>
            <Text style={[T.h3, { flex: 1 }]}>{o.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={C.ink3} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
