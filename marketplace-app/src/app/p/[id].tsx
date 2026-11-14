// Deep link: https://hireshelby.com/p/<id>?ref=CODE lands on the exact product with the friend's credit applied.
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ProductLink() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href={`/product/${id}`} />;
}
