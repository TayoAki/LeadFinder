import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { TrustLine } from '@/components/Logo';
import { Button, Card } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { api } from '@/lib/api';
import { applyCatalog, getProduct, money } from '@/lib/data';
import { useStore } from '@/lib/store';
import { C, R, S, T } from '@/lib/theme';
import { ids, track } from '@/lib/analytics';
import { commerce, completeCheckout, loadMercurCatalog, PreparedCheckout, prepareCheckout } from '@/lib/commerce';
import { CardPayment } from '@/components/CardPayment';
import { haptic } from '@/lib/feedback';

export default function Checkout() {
  const { groups, user, credit, referredBy, placeOrder, cart, remove } = useStore();
  const [pay, setPay] = useState<'apple' | 'card'>('apple');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState<PreparedCheckout | null>(null); // awaiting card confirmation
  const stripeOn = !!commerce()?.stripePublishableKey; // real payments: Stripe's sheet collects the card
  const items = groups.reduce((n, g) => n + g.subtotal, 0);
  const shipping = groups.reduce((n, g) => n + g.shipping, 0);
  // With Mercur, show exactly what it will charge: no tax rates or promotions are configured there
  // yet, so no estimated tax and no Shelby credit until they are (then read them from the cart).
  const mercur = !!commerce();
  const tax = mercur ? 0 : Math.round(items * 0.0725 * 100) / 100;
  const referral = referredBy && !mercur ? BRAND.referralReward : 0;
  const userCredit = user && !mercur ? credit : 0;
  const discount = Math.min(referral + userCredit, items + shipping);
  const total = items + shipping + tax - discount;
  const guestOk = !!user || email.includes('@');

  useEffect(() => { if (cart.length) track('checkout_start', { total: Math.round(total * 100) / 100, items: cart.reduce((n, l) => n + l.qty, 0), sellers: groups.length, guest: !user, referred: !!referredBy }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!cart.length && !loading) return <Redirect href="/cart" />;

  // Someone else bought the last one between add-to-cart and pay: refresh live stock, drop what
  // sold out, and say so in plain words (Mercur's message is about inventory items and offers).
  const soldOut = async () => {
    const cfg = commerce(); if (!cfg) return false;
    applyCatalog(await loadMercurCatalog(cfg), u => u);
    const gone = cart.map((l, i) => ({ l, i })).filter(({ l }) => (getProduct(l.productId)?.stock ?? 0) < l.qty);
    for (const { i } of gone.reverse()) remove(i);
    track('checkout_sold_out', { items: gone.length });
    return gone.length > 0;
  };
  const fail = async (e: any) => {
    haptic('error');
    if (/sufficient stock|out of stock|inventory/i.test(String(e?.message)) && await soldOut().catch(() => false)) {
      setError('Sorry, something in your cart just sold out, so we removed it. Check your total and pay again.');
      setPrepared(null); setLoading(false); return;
    }
    track('checkout_error', { reason: e?.name === 'AbortError' ? 'timeout' : String(e?.message ?? 'unknown').slice(0, 80) });
    setError(e?.name === 'AbortError' ? "Couldn't reach Shelby. Check your connection and try again." : e?.message ?? 'Payment failed');
    setPrepared(null); setLoading(false);
  };
  const done = (r: { id: string; tax: number }) => {
    const o = placeOrder(discount, user ? undefined : email, r.tax, r.id);
    router.replace({ pathname: '/order-success', params: { id: o.id } });
  };
  // Mercur: complete the prepared cart (after Stripe confirmed the card, when Stripe is on).
  const finish = async (p: PreparedCheckout) => { try { done(await completeCheckout(p)); } catch (e) { fail(e); } };

  // The server re-prices the cart, checks stock and splits it into one order per shop.
  const place = async () => {
    setLoading(true); setError('');
    track('checkout_submit', { total: Math.round(total * 100) / 100, guest: !user });
    try {
      const lines = cart.map(l => ({ productId: l.productId, size: l.size, qty: l.qty }));
      if (commerce()) {
        const p = await prepareCheckout(lines, { email: user?.email ?? email, name: user?.name ?? '' }, { address_1: '1208 Willow Ave, Apt 3', city: 'Austin', province: 'TX', postal_code: '78702' });
        if (p.clientSecret) { track('payment_sheet_open', { total: p.total }); setPrepared(p); return; } // CardPayment takes over
        return finish(p);
      }
      done(await api<{ id: string; total: number; tax: number }>('/api/orders', {
        lines, email: user?.email ?? email, name: user?.name ?? '',
        address: '1208 Willow Ave, Apt 3, Austin, TX 78702', discount, ref: referredBy ?? undefined, ...ids(),
      }));
    } catch (e: any) { fail(e); }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Checkout" back />
      {!!commerce()?.stripePublishableKey && (
        <CardPayment clientSecret={prepared?.clientSecret ?? null} publishableKey={commerce()!.stripePublishableKey!} amount={prepared?.total ?? total}
          onPaid={() => { track('payment_confirmed', { total: prepared?.total ?? 0 }); if (prepared) finish(prepared); }}
          onCancel={() => { track('payment_sheet_cancel'); setPrepared(null); setLoading(false); }}
          onError={m => fail(new Error(m))} />
      )}
      <ScrollView contentContainerStyle={{ padding: S.lg, gap: S.lg, paddingBottom: 220 }}>
        {!user && (
          <Card>
            <Text style={T.h3}>Checking out as a guest</Text>
            <Text style={[T.small, { marginTop: 2 }]}>Where should we send your receipt and tracking?</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@email.com" placeholderTextColor={C.ink3} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email for receipt"
              style={{ marginTop: S.md, height: 48, borderRadius: R.md, borderWidth: 1, borderColor: C.line, paddingHorizontal: 14, fontSize: 15, color: C.ink }} />
            <Pressable onPress={() => router.push({ pathname: '/auth', params: { next: '/checkout' } })}><Text style={{ color: C.accent, fontWeight: '700', marginTop: 10 }}>Or sign in to use saved details</Text></Pressable>
          </Card>
        )}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={T.h3}>Ship to</Text><Pressable onPress={() => router.push('/addresses')}><Text style={{ color: C.accent, fontWeight: '700' }}>Change</Text></Pressable></View>
          <Text style={[T.body, { marginTop: 6 }]}>{user?.name ?? 'Your name'}{'\n'}<Text style={{ color: C.ink2 }}>1208 Willow Ave, Apt 3{'\n'}Austin, TX 78702</Text></Text>
          {pay === 'apple' && !stripeOn && !user && <Text style={[T.small, { marginTop: 6 }]}>Apple Pay fills this in for you.</Text>}
        </Card>

        {stripeOn ? (
          <Card>
            <Text style={T.h3}>Payment</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: S.md }}>
              <Ionicons name="lock-closed" size={20} color={C.ink} />
              <Text style={[T.small, { flex: 1 }]}>Card, Apple Pay or Google Pay on the next step, secured by Stripe. You're charged once; each shop is paid when it ships.</Text>
            </View>
          </Card>
        ) : (
        <Card>
          <Text style={T.h3}>Pay with</Text>
          {([['apple', 'logo-apple', 'Apple Pay', 'Fastest. No card details to type.'], ['card', 'card-outline', 'Card', 'Visa ending 4242']] as const).map(([k, icon, label, sub]) => (
            <Pressable key={k} onPress={() => setPay(k)} accessibilityRole="radio" accessibilityState={{ checked: pay === k }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: S.md, padding: S.md, borderRadius: R.md, borderWidth: 1.5, borderColor: pay === k ? C.ink : C.line }}>
              <Ionicons name={icon} size={22} color={C.ink} />
              <View style={{ flex: 1 }}><Text style={{ fontWeight: '700' }}>{label}</Text><Text style={T.small}>{sub}</Text></View>
              <Ionicons name={pay === k ? 'radio-button-on' : 'radio-button-off'} size={20} color={pay === k ? C.ink : C.ink3} />
            </Pressable>
          ))}
        </Card>
        )}

        <Card>
          <Text style={T.h3}>{groups.length} shop{groups.length > 1 ? 's' : ''}, one payment</Text>
          <Text style={[T.small, { marginTop: 2 }]}>Each shop ships separately and you'll get tracking for each.</Text>
          {groups.map(g => (
            <View key={g.shop.id} style={{ marginTop: S.md, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: '800' }}>{g.shop.name}</Text><Text style={T.small}>Ships in {g.shop.shipsIn}</Text></View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                {g.lines.map(l => <Image key={l.productId + l.size} source={{ uri: getProduct(l.productId).image }} style={{ width: 44, height: 44, borderRadius: 8 }} />)}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}><Text style={T.small}>Items {money(g.subtotal)}</Text><Text style={T.small}>Shipping {g.shipping ? money(g.shipping) : 'free'}</Text></View>
            </View>
          ))}
        </Card>
        <TrustLine />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line, padding: S.lg }}>
        {[['Items', money(items)], ['Shipping', shipping ? money(shipping) : 'Free'], ...(mercur ? [] : [['Estimated tax', money(tax)]])].map(([a, b]) => (
          <View key={a} style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={T.small}>{a}</Text><Text style={T.small}>{b}</Text></View>
        ))}
        {!!referral && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: C.good, fontSize: 13, fontWeight: '700' }}>Friend's invite</Text><Text style={{ color: C.good, fontSize: 13, fontWeight: '700' }}>−{money(referral)}</Text></View>}
        {!!userCredit && <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: C.good, fontSize: 13, fontWeight: '700' }}>Your credit</Text><Text style={{ color: C.good, fontSize: 13, fontWeight: '700' }}>−{money(Math.min(userCredit, items + shipping - referral))}</Text></View>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}><Text style={T.h3}>Total</Text><Text style={{ fontSize: 20, fontWeight: '900' }}>{money(total)}</Text></View>
        <Button title={stripeOn ? `Continue to payment · ${money(total)}` : pay === 'apple' ? 'Pay with Apple Pay' : `Pay ${money(total)}`} icon={!stripeOn && pay === 'apple' ? 'logo-apple' : 'lock-closed'} kind={!stripeOn && pay === 'apple' ? 'primary' : 'accent'}
          style={{ marginTop: S.md }} onPress={place} loading={loading} disabled={!guestOk} testID="place-order" />
        {!!error && <Text style={{ textAlign: 'center', color: C.accent, fontWeight: '700', fontSize: 13, marginTop: 6 }} accessibilityRole="alert">{error}</Text>}
        {!guestOk && <Text style={{ textAlign: 'center', color: C.ink3, fontSize: 12, marginTop: 6 }}>Add an email for your receipt to continue</Text>}
      </SafeAreaView>
    </SafeAreaView>
  );
}
