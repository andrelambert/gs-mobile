import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { EventProvider } from '@/contexts/EventContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <EventProvider>
      <>
        <Stack screenOptions={{
          headerShown: false,
          headerBackTitle: 'Voltar',
          headerBackTitleVisible: true,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </EventProvider>
  );
}