// Deep link: https://hireshelby.com/p/<id>?ref=CODE lands on the exact product with the friend's credit applied.
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';

export default function ProductLink() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { track('deep_link', { kind: 'p', id, ref: ref ?? '' }); if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href={`/product/${id}`} />;
}
