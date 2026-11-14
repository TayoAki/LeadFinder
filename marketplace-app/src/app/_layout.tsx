import { Stack, useGlobalSearchParams, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Shelby } from '@/components/Shelby';
import { track, screen } from '@/lib/analytics';
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

// Every screen change is a screen_view; deep-link and campaign params ride along.
function ScreenTracker() {
  const pathname = usePathname();
  const q = useGlobalSearchParams<{ ref?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string }>();
  useEffect(() => { track('app_open', { ref: q.ref, utm_source: q.utm_source, utm_medium: q.utm_medium, utm_campaign: q.utm_campaign }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { screen(pathname, { ref: q.ref, utm_source: q.utm_source, utm_campaign: q.utm_campaign }); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CatalogGate>
      <StoreProvider>
        <StatusBar style="dark" />
        <WebAppBanner />
        <ScreenTracker />
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
