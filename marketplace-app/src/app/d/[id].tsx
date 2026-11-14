// Deep link to a drop: https://hireshelby.com/d/<id>?ref=CODE
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { track } from '@/lib/analytics';

export default function DropLink() {
  const { id, ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { track('deep_link', { kind: 'd', id, ref: ref ?? '' }); if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href="/drops" />;
}
