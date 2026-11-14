// Deep link to a shared wishlist: https://stalls.app/w/<code>?ref=CODE
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function WishlistLink() {
  const { ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href="/wishlist" />;
}
