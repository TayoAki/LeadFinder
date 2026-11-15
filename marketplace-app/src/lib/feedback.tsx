// Feedback: haptics + a single toast, so every meaningful action is felt and confirmed.
//   tap       light tick for buttons and icon buttons
//   select    selection tick for chips, toggles, size pickers
//   add       medium thump for add-to-cart and saves
//   success   notification pattern for an order placed
//   error     notification pattern for failures
// Native uses expo-haptics; web uses navigator.vibrate where the browser supports it (Android Chrome).
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, R, S } from './theme';

export type HapticKind = 'tap' | 'select' | 'add' | 'success' | 'error';
const WEB_PATTERN: Record<HapticKind, number | number[]> = { tap: 8, select: 6, add: 14, success: [12, 40, 18], error: [30, 50, 30] };

export function haptic(kind: HapticKind = 'tap') {
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(WEB_PATTERN[kind]);
      return;
    }
    if (kind === 'select') Haptics.selectionAsync();
    else if (kind === 'tap') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (kind === 'add') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  } catch {}
}

type Toast = { id: number; text: string; icon?: React.ComponentProps<typeof Ionicons>['name']; action?: { label: string; onPress: () => void } };
const Ctx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});
let external: ((t: Omit<Toast, 'id'>) => void) | null = null;
// Callable from non-React code (the store) once the provider is mounted.
export const toast = (t: Omit<Toast, 'id'>) => external?.(t);
export const useToast = () => useContext(Ctx);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Toast | null>(null);
  const y = useRef(new Animated.Value(-120)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const show = useCallback((t: Omit<Toast, 'id'>) => {
    if (timer.current) clearTimeout(timer.current);
    setCurrent({ ...t, id: Date.now() });
    AccessibilityInfo.announceForAccessibility?.(t.text);
    Animated.spring(y, { toValue: 0, useNativeDriver: Platform.OS !== 'web', speed: 18, bounciness: 6 }).start();
    timer.current = setTimeout(() => Animated.timing(y, { toValue: -120, duration: 180, useNativeDriver: Platform.OS !== 'web' }).start(() => setCurrent(null)), 2600);
  }, [y]);
  useEffect(() => { external = show; return () => { external = null; }; }, [show]);
  return (
    <Ctx.Provider value={show}>
      {children}
      {current && (
        <Animated.View pointerEvents="box-none" accessibilityLiveRegion="polite"
          style={{ position: 'absolute', left: S.lg, right: S.lg, top: insets.top + 8, transform: [{ translateY: y }] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.ink, borderRadius: R.lg, paddingVertical: 12, paddingHorizontal: S.lg,
            shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}>
            {current.icon && <Ionicons name={current.icon} size={18} color="#fff" />}
            <Text style={{ color: '#fff', fontWeight: '700', flex: 1 }} numberOfLines={2}>{current.text}</Text>
            {current.action && (
              <Pressable onPress={() => { haptic('tap'); current.action!.onPress(); }} accessibilityRole="button" hitSlop={10}>
                <Text style={{ color: C.accent, fontWeight: '800' }}>{current.action.label}</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
}
