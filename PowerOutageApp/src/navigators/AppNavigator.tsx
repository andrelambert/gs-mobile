import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PanoramaGeralScreen from '../screens/PanoramaGeralScreen';
// Vamos renomear AdicionarEditarEventoScreen para FormularioEventoScreen para clareza
import FormularioEventoScreen from '../screens/FormularioEventoScreen.tsx';
import DetalhesEventoScreen from '../screens/DetalhesEventoScreen';
import RecomendacoesScreen from '../screens/RecomendacoesScreen';

// Novas telas de sub-formulário
import LocalizacaoScreen from '../screens/LocalizacaoScreen';
import TempoInterrupcaoScreen from '../screens/TempoInterrupcaoScreen';
import PrejuizosScreen from '../screens/PrejuizosScreen';

import { PowerOutageEvent } from '../types';

export type RootStackParamList = {
  PanoramaGeral: undefined;
  FormularioEvento: { // Antiga AdicionarEditarEventoScreen
    eventId?: string; // Para edição
    // Parâmetros para receber dados de volta das sub-telas
    // Usaremos um timestamp para garantir que estamos atualizando o rascunho correto
    formTimestamp?: number;
    updatedLocalizacao?: PowerOutageEvent['localizacao'];
    updatedInterrupcao?: PowerOutageEvent['interrupcao'];
    updatedPrejuizosText?: PowerOutageEvent['prejuizos']; // Renomeado para clareza
    updatedCausaText?: PowerOutageEvent['causa']; // Para a causa, se for em tela separada ou no hub
  };
  DetalhesEvento: { eventId: string };
  Recomendacoes: undefined;
  // Telas de sub-formulário
  LocalizacaoScreen: {
    currentData?: PowerOutageEvent['localizacao'];
    formTimestamp: number; // Para identificar a sessão do formulário principal
  };
  TempoInterrupcaoScreen: {
    currentData?: PowerOutageEvent['interrupcao'];
    formTimestamp: number;
  };
  PrejuizosScreen: {
    currentData?: PowerOutageEvent['prejuizos'];
    formTimestamp: number;
  };
  // Se a Causa também for uma tela separada:
  // CausaScreen: { currentData?: PowerOutageEvent['causa'], formTimestamp: number };
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
        name="FormularioEvento"
        component={FormularioEventoScreen}
        options={({ route }) => ({
          title: route.params?.eventId ? 'Editar Evento' : 'Novo Evento',
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
      {/* Telas de Sub-Formulário */}
      <Stack.Screen
        name="LocalizacaoScreen"
        component={LocalizacaoScreen}
        options={{ title: 'Definir Localização' }}
      />
      <Stack.Screen
        name="TempoInterrupcaoScreen"
        component={TempoInterrupcaoScreen}
        options={{ title: 'Tempo de Interrupção' }}
      />
      <Stack.Screen
        name="PrejuizosScreen"
        component={PrejuizosScreen}
        options={{ title: 'Registrar Prejuízos' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;