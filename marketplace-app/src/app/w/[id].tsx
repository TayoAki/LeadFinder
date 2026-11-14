// Deep link to a shared wishlist: https://hireshelby.com/w/<code>?ref=CODE
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';

export default function WishlistLink() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { track('deep_link', { kind: 'w', id, ref: ref ?? '' }); if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href="/wishlist" />;
}
