// Prepare checkout ahead of Pay (conversion plan R8). Opening the cart, and again the checkout
// screen, attaches the address, each shop's shipping method, the payment collection and session,
// and reads the totals, all in the background. Pay is then only: save the email, complete.
import { useEffect } from 'react';
import { commerce, primeCheckout } from './commerce';
import { useStore } from './store';

// Sample address until address entry is wired to Mercur customers.
export const SAMPLE_ADDRESS = { address_1: '1208 Willow Ave, Apt 3', city: 'Austin', province: 'TX', postal_code: '78702' };

export function usePrimeCheckout() {
  const { cart, user, address } = useStore();
  const addr = address ?? { name: user?.name ?? '', ...SAMPLE_ADDRESS };
  const lines = cart.map(l => ({ productId: l.productId, size: l.size, qty: l.qty }));
  const key = JSON.stringify([lines, addr]);
  useEffect(() => { if (commerce() && lines.length) primeCheckout(lines, addr).catch(() => {}); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { lines, addr };
}
