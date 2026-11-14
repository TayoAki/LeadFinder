// Deep link: https://hireshelby.com/s/<id>?ref=CODE lands on the shop page with the friend's credit applied.
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ShopLink() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href={`/shop/${id}`} />;
}
