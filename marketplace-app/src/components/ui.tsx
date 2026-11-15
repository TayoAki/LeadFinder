import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { C, R, S, T } from '@/lib/theme';
import { money } from '@/lib/data';
import { track } from '@/lib/analytics';
import { haptic } from '@/lib/feedback';

// Autocapture: every shared button, icon button and chip reports its label when tapped.
const tapped = (ui: string, label: string, fn?: () => void) => () => { haptic(ui === 'chip' ? 'select' : 'tap'); track('tap', { ui, label: label.slice(0, 60) }); fn?.(); };

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Button({ title, onPress, kind = 'primary', icon, style, disabled, loading, testID }: {
  title: string; onPress?: () => void; kind?: 'primary' | 'accent' | 'buy' | 'sage' | 'ghost' | 'light'; icon?: IconName;
  style?: StyleProp<ViewStyle>; disabled?: boolean; loading?: boolean; testID?: string;
}) {
  const bg = { primary: C.ink, accent: C.accent, buy: C.buy, sage: C.sage, ghost: 'transparent', light: C.surface }[kind];
  const fg = kind === 'ghost' || kind === 'light' || kind === 'sage' ? C.ink : kind === 'buy' ? C.buyInk : '#fff';
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} onPress={tapped('button', title, onPress)} disabled={disabled || loading}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        kind === 'ghost' && { borderWidth: 1, borderColor: C.line }, kind === 'light' && { borderWidth: 1, borderColor: C.line }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <>
        {icon && <Ionicons name={icon} size={18} color={fg} />}
        <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
      </>}
    </Pressable>
  );
}

export function IconButton({ name, onPress, label, color = C.ink, badge, size = 22, bg }: { name: IconName; onPress?: () => void; label: string; color?: string; badge?: number; size?: number; bg?: string }) {
  return (
    <Pressable onPress={tapped('icon', label, onPress)} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}
      style={({ pressed }) => [styles.iconBtn, bg ? { backgroundColor: bg } : null, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={name} size={size} color={color} />
      {!!badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text></View>}
    </Pressable>
  );
}

export function Chip({ label, active, onPress, icon, disabled }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName; disabled?: boolean }) {
  return (
    <Pressable onPress={tapped('chip', label, onPress)} disabled={disabled} accessibilityRole="button" accessibilityLabel={disabled ? `${label}, sold out` : label} accessibilityState={{ selected: !!active, disabled: !!disabled }}
      style={[styles.chip, active && { backgroundColor: C.ink, borderColor: C.ink }, disabled && { opacity: 0.4 }]}>
      {icon && <Ionicons name={icon} size={14} color={active ? '#fff' : C.ink} />}
      <Text style={[styles.chipText, active && { color: '#fff' }, disabled && { textDecorationLine: 'line-through' }]}>{label}</Text>
    </Pressable>
  );
}

export function Stars({ value, size = 12, count }: { value: number; size?: number; count?: number }) {
  if (!value) return null; // no real reviews yet: show nothing rather than a number
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }} accessibilityLabel={`Rated ${value} out of 5`}>
      <Ionicons name="star" size={size} color="#F5A524" />
      <Text style={{ fontSize: size + 1, fontWeight: '700', color: C.ink }}>{value.toFixed(1)}</Text>
      {count != null && <Text style={{ fontSize: size + 1, color: C.ink3 }}>({count})</Text>}
    </View>
  );
}

export function Price({ price, compareAt, size = 15 }: { price: number; compareAt?: number | null; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
      <Text style={{ fontSize: size, fontWeight: '800', color: compareAt ? C.sale : C.ink }}>{money(price)}</Text>
      {!!compareAt && <Text style={{ fontSize: size - 3, color: C.ink3, textDecorationLine: 'line-through' }}>{money(compareAt)}</Text>}
    </View>
  );
}

export function SectionHeader({ title, action, onAction, sub }: { title: string; action?: string; onAction?: () => void; sub?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: S.lg, marginTop: S.xl, marginBottom: S.md }}>
      <View style={{ flex: 1 }}>
        <Text style={T.h2}>{title}</Text>
        {sub && <Text style={[T.small, { marginTop: 2 }]}>{sub}</Text>}
      </View>
      {action && <Pressable onPress={onAction} accessibilityRole="link" hitSlop={8}><Text style={{ color: C.accent, fontWeight: '700' }}>{action}</Text></Pressable>}
    </View>
  );
}

export function Pill({ text, tone = 'accent', icon }: { text: string; tone?: 'accent' | 'sale' | 'good' | 'warn' | 'dark'; icon?: IconName }) {
  const map = { accent: [C.accentSoft, C.accent], sale: [C.saleSoft, C.sale], good: [C.goodSoft, C.good], warn: [C.warnSoft, C.warn], dark: ['rgba(0,0,0,0.72)', '#fff'] }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: map[0] }]}>
      {icon && <Ionicons name={icon} size={11} color={map[1]} />}
      <Text style={{ color: map[1], fontSize: 11, fontWeight: '800' }}>{text}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.surface, borderRadius: R.lg, padding: S.lg, borderWidth: 1, borderColor: C.line }, style]}>{children}</View>;
}

export function useCountdown(at: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((at - now) / 1000));
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return { done: s === 0, text: `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`, hours: Math.floor(s / 3600) };
}

export function Divider() { return <View style={{ height: 1, backgroundColor: C.line, marginVertical: S.md }} />; }

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: R.pill, paddingHorizontal: S.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { fontSize: 16, fontWeight: '800' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 0, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.sale, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: C.bg },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface },
  chipText: { fontSize: 14, fontWeight: '600', color: C.ink },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.pill, alignSelf: 'flex-start' },
});
