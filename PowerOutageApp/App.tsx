import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigators/AppNavigator';
import { EventProvider } from './src/contexts/EventContext'; // Importe o Provider

export default function App() {
  return (
    <EventProvider> {/* Adicione o Provider aqui */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </EventProvider>
  );
}