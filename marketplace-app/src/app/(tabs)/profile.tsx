import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { LogoMark } from '@/components/Logo';
import { Button, IconName } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { money } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';

function Row({ icon, label, sub, onPress, tone }: { icon: IconName; label: string; sub?: string; onPress?: () => void; tone?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: S.lg, backgroundColor: pressed ? '#F6F1EA' : C.surface })}>
      <Ionicons name={icon} size={22} color={tone ?? C.ink} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: tone ?? C.ink }}>{label}</Text>
        {sub && <Text style={T.small}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.ink3} />
    </Pressable>
  );
}

export default function Profile() {
  const { user, signOut, credit, orders, wishlist, following, invitesSent } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="You" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {user ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: S.lg }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>{user.name[0]}</Text></View>
            <View style={{ flex: 1 }}><Text style={T.h2}>{user.name}</Text><Text style={T.small}>{user.email}</Text></View>
            <View style={{ alignItems: 'flex-end' }}><Text style={T.tiny}>CREDIT</Text><Text style={{ fontSize: 20, fontWeight: '900', color: C.good }}>{money(credit)}</Text></View>
          </View>
        ) : (
          <View style={{ margin: S.lg, padding: S.xl, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.line, alignItems: 'center' }}>
            <LogoMark size={48} />
            <Text style={[T.h2, { marginTop: 12, textAlign: 'center' }]}>Sign up and get ${BRAND.firstOrderOff} off</Text>
            <Text style={[T.small, { textAlign: 'center', marginTop: 4 }]}>Save your wishlist, follow shops and track every order in one place.</Text>
            <Button title="Sign up or log in" kind="accent" style={{ marginTop: S.lg, alignSelf: 'stretch' }} onPress={() => router.push('/auth')} />
          </View>
        )}

        {/* Light habit loop: support small shops, level up, unlock perks */}
        <View style={{ marginHorizontal: S.lg, marginBottom: S.md, padding: S.lg, borderRadius: R.lg, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={T.h3}>Small-shop supporter · Level {1 + Math.floor((orders.length * 2 + following.length) / 4)}</Text>
            <Ionicons name="ribbon" size={20} color={C.accent} />
          </View>
          <Text style={[T.small, { marginTop: 2 }]}>{orders.reduce((n, o) => n + o.sellerOrders.length, 0)} shops supported · {following.length} followed. Next level unlocks early access to drops.</Text>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: C.line, marginTop: 10 }}><View style={{ height: 6, borderRadius: 3, backgroundColor: C.accent, width: `${(((orders.length * 2 + following.length) % 4) / 4) * 100 || 10}%` }} /></View>
        </View>

        <Pressable onPress={() => router.push('/invite')} style={{ marginHorizontal: S.lg, padding: S.lg, borderRadius: R.lg, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="gift" size={28} color={C.accent} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>Invite friends, earn ${BRAND.referralReward} each</Text>
            <Text style={{ color: '#CFC7BC', fontSize: 13 }}>{invitesSent ? `${invitesSent} invite${invitesSent > 1 ? 's' : ''} sent · credit lands when they buy` : 'They get $10 off. You get $10 credit.'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CFC7BC" />
        </Pressable>

        <View style={{ marginTop: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line }}>
          <Row icon="receipt-outline" label="Orders" sub={orders.length ? `${orders.length} order${orders.length > 1 ? 's' : ''}` : 'Track and return'} onPress={() => router.push('/orders')} />
          <Row icon="heart-outline" label="Wishlist" sub={`${wishlist.length} saved · share it as a gift list`} onPress={() => router.push('/wishlist')} />
          <Row icon="storefront-outline" label="Shops you follow" sub={`${following.length} shops`} onPress={() => router.push('/following')} />
          <Row icon="location-outline" label="Addresses" onPress={() => router.push('/addresses')} />
          <Row icon="card-outline" label="Payment methods" sub="Apple Pay, cards" onPress={() => router.push('/payments')} />
          <Row icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />
        </View>

        <Pressable onPress={() => router.push('/seller')} style={{ margin: S.lg, padding: S.lg, borderRadius: R.lg, borderWidth: 1.5, borderColor: C.accent, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="storefront" size={24} color={C.accent} />
          <View style={{ flex: 1 }}><Text style={T.h3}>Switch to seller mode</Text><Text style={T.small}>Run your shop from this app</Text></View>
          <Ionicons name="swap-horizontal" size={20} color={C.accent} />
        </Pressable>

        <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line }}>
          <Row icon="help-circle-outline" label="Help and buyer protection" onPress={() => router.push('/help')} />
          {user && <Row icon="log-out-outline" label="Log out" onPress={signOut} />}
          {user && <Row icon="trash-outline" label="Delete account" tone={C.accent} onPress={() => Alert.alert('Delete account?', 'This removes your orders history and personal data.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: signOut }])} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
