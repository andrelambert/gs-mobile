import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PanoramaGeralScreen from '../screens/PanoramaGeralScreen';
import AdicionarEditarEventoScreen from '../screens/AdicionarEditarEventoScreen';
import DetalhesEventoScreen from '../screens/DetalhesEventoScreen';
import RecomendacoesScreen from '../screens/RecomendacoesScreen';
import { PowerOutageEvent } from '../types'; // Importe seu tipo

// Define os tipos de parâmetros para cada rota
export type RootStackParamList = {
  PanoramaGeral: undefined; // Sem parâmetros esperados para esta tela
  AdicionarEditarEvento: { eventId?: string }; // eventId é opcional (para edição)
  DetalhesEvento: { eventId: string }; // eventId é obrigatório
  Recomendacoes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="PanoramaGeral">
      <Stack.Screen
        name="PanoramaGeral"
        component={PanoramaGeralScreen}
        options={{ title: 'Panorama de Eventos' }}
      />
      <Stack.Screen
        name="AdicionarEditarEvento"
        component={AdicionarEditarEventoScreen}
        options={({ route }) => ({
          title: route.params?.eventId ? 'Editar Evento' : 'Adicionar Evento',
        })}
      />
      <Stack.Screen
        name="DetalhesEvento"
        component={DetalhesEventoScreen}
        options={{ title: 'Detalhes do Evento' }}
      />
      <Stack.Screen
        name="Recomendacoes"
        component={RecomendacoesScreen}
        options={{ title: 'Recomendações' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;