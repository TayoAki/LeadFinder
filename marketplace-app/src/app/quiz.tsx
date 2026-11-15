// "Find your match": 2–4 taps, one question per screen, then ranked picks for the shopper's
// segment (src/lib/icp.ts). Tracked as quiz_start → quiz_answer → quiz_complete → quiz_result_add,
// so Admin → Analytics shows where people drop and how each ICP converts.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { track } from '@/lib/analytics';
import { haptic } from '@/lib/feedback';
import { AREAS, Area, icpOf, QuizProfile, questionsFor, rankFor } from '@/lib/icp';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

export default function Quiz() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { setProfile, rememberSize } = useStore();
  const [answers, setAnswers] = useState<Partial<QuizProfile>>({});
  const [step, setStep] = useState(0);
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
    router.replace(`/match/${profile.icp}`); // the result is its own page (linkable from ads)
  };

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
