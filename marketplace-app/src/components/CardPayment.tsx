// Native card payment (iOS/Android). Stripe's React Native SDK is not in the phone build yet: it
// broke the EAS builds (Android needs Google's tap-and-pay library, iOS needs dynamic frameworks),
// and card payments are off until the store connects Stripe anyway. The working PaymentSheet
// version is in git history (commit 5e2fb3c, src/components/CardPayment.tsx); restore it with
// `npx expo install @stripe/stripe-react-native` + its config plugin when Stripe keys are added.
// The web version (CardPayment.web.tsx) is unaffected.
import { useEffect } from 'react';

export type CardPaymentProps = {
  clientSecret: string | null; // open while set
  publishableKey: string;
  amount: number;
  onPaid: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
};

export function CardPayment({ clientSecret, onError }: CardPaymentProps) {
  useEffect(() => {
    if (clientSecret) onError("Card payment isn't available in the app yet, so you haven't been charged. Please check out on shelby's website.");
  }, [clientSecret]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
