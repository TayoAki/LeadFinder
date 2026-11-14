import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Shelby } from '@/components/Shelby';
import { absolute, api } from '@/lib/api';
import { applyCatalog, Product, Shop } from '@/lib/data';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebAppBanner } from '@/components/WebAppBanner';
import { StoreProvider } from '@/lib/store';
import { C } from '@/lib/theme';

// Load the live catalogue (what sellers have published) before the first screen; fall back to
// the bundled sample after 3 s so the app always opens.
function CatalogGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    api<{ shops: Shop[]; products: Product[] }>('/api/catalog', undefined, 3000)
      .then(r => applyCatalog(r, absolute)).catch(() => {}).finally(() => setReady(true));
  }, []);
  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}><Shelby size={110} mood="thinking" label="Loading Shelby" /></View>;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CatalogGate>
      <StoreProvider>
        <StatusBar style="dark" />
        <WebAppBanner />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="share" options={{ presentation: 'modal' }} />
          <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
          <Stack.Screen name="notify" options={{ presentation: 'modal' }} />
          <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="ask" options={{ presentation: 'modal' }} />
        </Stack>
      </StoreProvider>
      </CatalogGate>
    </SafeAreaProvider>
  );
}
