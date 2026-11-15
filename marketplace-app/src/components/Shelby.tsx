import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import { C } from '@/lib/theme';

export type Mood = 'idle' | 'happy' | 'thinking' | 'wave';
const ND = Platform.OS !== 'web';

// Shelby, drawn in code from the logo's shapes so she can react: idle bob + blink, a happy
// bounce, a "thinking" sparkle spin. Production plan: swap the body for a Rive file with the
// same moods (smoother character motion, still one small file); keep this as the fallback.
export function Shelby({ size = 120, mood = 'idle', label }: { size?: number; mood?: Mood; label?: string }) {
  const bob = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: ND }),
      Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: ND }),
    ]));
    loop.start();
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3200);
    return () => { loop.stop(); clearInterval(t); };
  }, []);

  useEffect(() => {
    if (mood === 'happy' || mood === 'wave') {
      Animated.sequence([
        Animated.spring(pop, { toValue: 1.14, useNativeDriver: ND, speed: 30, bounciness: 14 }),
        Animated.spring(pop, { toValue: 1, useNativeDriver: ND, speed: 14, bounciness: 10 }),
      ]).start();
    }
    if (mood === 'thinking') {
      const l = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: ND }));
      l.start(); return () => { l.stop(); spin.setValue(0); };
    }
  }, [mood]);

  const s = size;
  const ink = C.ink, face = '#F6E7D7';
  const happy = mood === 'happy';
  const eyeH = blink ? s * 0.02 : happy ? s * 0.05 : s * 0.1;
  return (
    <View style={{ width: s * 1.15, height: s * 1.1, alignItems: 'center', justifyContent: 'flex-end' }} accessible accessibilityRole="image" accessibilityLabel={label ?? 'Shelby, your shopping helper'}>
      <Animated.View style={{ alignItems: 'center', transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -s * 0.05] }) }, { scale: pop }] }}>
        {/* handle */}
        <View style={{ width: s * 0.42, height: s * 0.3, borderWidth: s * 0.085, borderBottomWidth: 0, borderColor: ink, borderTopLeftRadius: s, borderTopRightRadius: s, marginBottom: -2 }} />
        {/* body: slightly wider at the bottom, like the logo */}
        <View style={{ width: s * 0.86, height: s * 0.66, backgroundColor: ink, borderTopLeftRadius: s * 0.16, borderTopRightRadius: s * 0.16, borderBottomLeftRadius: s * 0.2, borderBottomRightRadius: s * 0.2, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', gap: s * 0.28, marginBottom: s * 0.06, alignItems: 'center', height: s * 0.1 }}>
            {[0, 1].map(i => <View key={i} style={{ width: s * 0.07, height: eyeH, borderRadius: s * 0.05, backgroundColor: face, ...(happy && !blink ? { borderTopLeftRadius: s, borderTopRightRadius: s, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 } : {}) }} />)}
          </View>
          <View style={{ width: s * (mood === 'thinking' ? 0.1 : 0.2), height: s * (mood === 'thinking' ? 0.05 : 0.1), borderWidth: s * 0.035, borderTopWidth: mood === 'thinking' ? s * 0.035 : 0, borderColor: face, borderBottomLeftRadius: s, borderBottomRightRadius: s, borderTopLeftRadius: mood === 'thinking' ? s : 0, borderTopRightRadius: mood === 'thinking' ? s : 0 }} />
        </View>
      </Animated.View>
      {/* the AI sparkle */}
      <Animated.View style={{ position: 'absolute', top: s * 0.02, right: s * 0.02, transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
        <Ionicons name="sparkles" size={s * 0.26} color={C.spark} />
      </Animated.View>
    </View>
  );
}

// Shelby saying something: mascot + speech bubble.
export function ShelbySays({ text, mood = 'idle', size = 64 }: { text: string; mood?: Mood; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
      <Shelby size={size} mood={mood} />
      <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 18, borderBottomLeftRadius: 4, padding: 14, borderWidth: 1, borderColor: C.line, marginBottom: size * 0.2 }}>
        <Text style={{ fontSize: 16, color: C.ink, fontWeight: '600', lineHeight: 22 }}>{text}</Text>
      </View>
    </View>
  );
}
