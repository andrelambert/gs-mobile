import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { EventProvider } from '@/contexts/EventContext';
import Colors from '@/constants/Colors';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <EventProvider>
      <>
        <Stack screenOptions={{
          headerShown: false,
          headerBackTitle: 'Voltar',
          headerBackTitleVisible: true,
          headerTintColor: Colors.white,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </EventProvider>
  );
}