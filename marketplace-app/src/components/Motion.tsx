// Motion: small, fast, purposeful (150–350 ms). Built on Reanimated layout animations, which run
// on the UI thread on iOS/Android and as CSS-like transitions on the web. Every animation honours
// the phone's "Reduce motion" setting (ReduceMotion.System) and is skipped there.
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, ReduceMotion, ZoomIn } from 'react-native-reanimated';

// A whole page settling in.
export function PageIn({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <Animated.View entering={FadeIn.duration(260).reduceMotion(ReduceMotion.System)} style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}

// Items in a list or grid rising in one after another (capped so long lists never wait).
export function Rise({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 45).duration(320).reduceMotion(ReduceMotion.System)} style={style}>
      {children}
    </Animated.View>
  );
}

// A badge that pops when its value changes (keyed by the value so each change re-enters).
export function Pop({ k, children, style }: { k: string | number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <Animated.View key={String(k)} entering={ZoomIn.springify().damping(12).reduceMotion(ReduceMotion.System)} style={style}>{children}</Animated.View>;
}
