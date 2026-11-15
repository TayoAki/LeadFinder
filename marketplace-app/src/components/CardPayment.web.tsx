// Web card payment: Stripe's Payment Element in a bottom sheet, confirming the PaymentIntent that
// Mercur created for the cart (cards, Link, and Apple Pay / Google Pay where the browser supports it).
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui';
import { money } from '@/lib/data';
import { C, S, T } from '@/lib/theme';
import type { CardPaymentProps } from './CardPayment';

const MOUNT_ID = 'shelby-stripe-payment-element';
const stripes = new Map<string, Promise<Stripe | null>>();
const getStripe = (key: string) => { if (!stripes.has(key)) stripes.set(key, loadStripe(key)); return stripes.get(key)!; };

export function CardPayment({ clientSecret, publishableKey, amount, onPaid, onCancel, onError }: CardPaymentProps) {
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');
  const ctx = useRef<{ stripe: Stripe; elements: StripeElements } | null>(null);

  useEffect(() => {
    if (!clientSecret) return;
    let cancelled = false;
    setReady(false); setMessage('');
    (async () => {
      const stripe = await getStripe(publishableKey);
      if (!stripe) throw new Error('Card payments could not load.');
      // Wait for the modal's mount point to exist in the DOM.
      for (let i = 0; i < 50 && !document.getElementById(MOUNT_ID); i++) await new Promise(r => setTimeout(r, 30));
      if (cancelled) return;
      const elements = stripe.elements({
        clientSecret,
        appearance: { theme: 'stripe', variables: { colorPrimary: C.accent, colorText: C.ink, borderRadius: '12px', fontFamily: 'system-ui, sans-serif' } },
      });
      const el = elements.create('payment', { layout: 'tabs' });
      el.on('ready', () => setReady(true));
      el.mount(`#${MOUNT_ID}`);
      ctx.current = { stripe, elements };
    })().catch(e => onError(e?.message ?? 'Card payments could not load.'));
    return () => { cancelled = true; ctx.current = null; };
  }, [clientSecret]); // eslint-disable-line react-hooks/exhaustive-deps

  const pay = async () => {
    if (!ctx.current) return;
    setPaying(true); setMessage('');
    const { error } = await ctx.current.stripe.confirmPayment({
      elements: ctx.current.elements, redirect: 'if_required',
      confirmParams: { return_url: window.location.href },
    });
    setPaying(false);
    if (error) setMessage(error.message ?? 'Your card was not charged. Please try again.');
    else onPaid();
  };

  return (
    <Modal visible={!!clientSecret} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(43,6,39,0.45)' }}>
        <View style={{ backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: S.lg, gap: S.md, maxHeight: '92%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={T.h3}>Pay {money(amount)}</Text>
            <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel payment"><Text style={{ color: C.ink2, fontWeight: '700' }}>Cancel</Text></Pressable>
          </View>
          <View nativeID={MOUNT_ID} style={{ minHeight: 220 }} />
          {!!message && <Text style={{ color: C.sale, fontWeight: '700' }}>{message}</Text>}
          <Button title={paying ? 'Paying…' : `Pay ${money(amount)}`} kind="buy" icon="lock-closed" disabled={!ready} loading={paying} onPress={pay} testID="stripe-pay" />
          <Text style={[T.small, { textAlign: 'center' }]}>Secured by Stripe. Each shop is paid when it ships.</Text>
        </View>
      </View>
    </Modal>
  );
}
