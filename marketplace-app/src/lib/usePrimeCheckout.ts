// Prepare checkout ahead of Pay (conversion plan R8). Opening the cart, and again the checkout
// screen, attaches the shopper's address, each shop's shipping method, the payment collection and
// session, and reads the totals, all in the background. Pay is then only: save the email, complete.
// Nothing is prepared until the shopper has entered a real, valid address (no placeholder address).
import { useEffect } from 'react';
import { addressProblem } from '@/components/AddressForm';
import { commerce, primeCheckout } from './commerce';
import { useStore } from './store';

export function usePrimeCheckout() {
  const { cart, address } = useStore();
  const addr = address && !addressProblem(address) ? address : null;
  const lines = cart.map(l => ({ productId: l.productId, size: l.size, qty: l.qty }));
  const key = JSON.stringify([lines, addr]);
  useEffect(() => { if (commerce() && lines.length && addr) primeCheckout(lines, addr).catch(() => {}); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { lines, addr };
}
