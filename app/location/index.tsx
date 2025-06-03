import { Redirect } from 'expo-router';

export default function LocationScreen() {
  // Redirecionar para a tela de localização na pasta (tabs)
  return <Redirect href="/(tabs)/location" />;
} 