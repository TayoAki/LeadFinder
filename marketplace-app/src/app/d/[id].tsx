// Deep link to a drop: https://stalls.app/d/<id>?ref=CODE
import { Redirect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function DropLink() {
  const { ref } = useLocalSearchParams<{ id: string; ref?: string }>();
  const { setReferredBy } = useStore();
  useEffect(() => { if (ref) setReferredBy(ref); }, [ref]);
  return <Redirect href="/drops" />;
}
