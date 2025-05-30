import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigators/AppNavigator';
// Importaremos o EventProvider mais tarde
// import { EventProvider } from './src/contexts/EventContext';

export default function App() {
  return (
    // <EventProvider> // Descomentaremos quando o Context estiver pronto
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    // </EventProvider>
  );
}