// Native card payment (iOS/Android): Stripe's PaymentSheet confirms the PaymentIntent that Mercur
// created for the cart. Cards, Apple Pay and Google Pay are handled by the sheet.
// The web version lives in CardPayment.web.tsx (Stripe Payment Element).
import { initPaymentSheet, initStripe, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useEffect } from 'react';
import { BRAND } from '@/lib/brand';

export type CardPaymentProps = {
  clientSecret: string | null; // open while set
  publishableKey: string;
  amount: number;
  onPaid: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
};

export function CardPayment({ clientSecret, publishableKey, onPaid, onCancel, onError }: CardPaymentProps) {
  useEffect(() => {
    if (!clientSecret) return;
    (async () => {
      await initStripe({ publishableKey, merchantIdentifier: 'merchant.com.hireshelby.app', urlScheme: 'shelby' });
      const init = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret, merchantDisplayName: BRAND.name, returnURL: 'shelby://stripe-redirect',
        applePay: { merchantCountryCode: 'US' }, googlePay: { merchantCountryCode: 'US', testEnv: publishableKey.startsWith('pk_test') },
      });
      if (init.error) return onError(init.error.message);
      const res = await presentPaymentSheet();
      if (!res.error) onPaid();
      else if (res.error.code === 'Canceled') onCancel();
      else onError(res.error.message);
    })().catch(e => onError(e?.message ?? 'Payment failed'));
  }, [clientSecret]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
