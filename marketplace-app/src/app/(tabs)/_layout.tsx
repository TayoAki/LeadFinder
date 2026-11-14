import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useStore } from '@/lib/store';
import { C } from '@/lib/theme';

type Icon = React.ComponentProps<typeof Ionicons>['name'];
const icon = (on: Icon, off: Icon) => ({ color, focused }: { color: any; focused: boolean }) => <Ionicons name={focused ? on : off} size={24} color={color} />;

export default function TabLayout() {
  const { cartCount } = useStore();
  return (
    <Tabs screenOptions={{
      headerShown: false, tabBarActiveTintColor: C.ink, tabBarInactiveTintColor: C.ink3,
      tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.line, height: 64, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: icon('search', 'search-outline') }} />
      <Tabs.Screen name="drops" options={{ title: 'Drops', tabBarIcon: icon('flash', 'flash-outline'), tabBarActiveTintColor: C.accent }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart', tabBarIcon: icon('bag', 'bag-outline'), tabBarBadge: cartCount || undefined, tabBarBadgeStyle: { backgroundColor: C.accent } }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: icon('person-circle', 'person-circle-outline') }} />
    </Tabs>
  );
}
