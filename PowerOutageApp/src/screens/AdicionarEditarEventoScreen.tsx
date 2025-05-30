import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';

type AdicionarEditarEventoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdicionarEditarEvento'>;
type AdicionarEditarEventoScreenRouteProp = RouteProp<RootStackParamList, 'AdicionarEditarEvento'>;

type Props = {
  navigation: AdicionarEditarEventoScreenNavigationProp;
  route: AdicionarEditarEventoScreenRouteProp;
};

const AdicionarEditarEventoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params || {}; // Pega o eventId se existir

  return (
    <ScrollView style={styles.container}>
      <Text>{eventId ? 'Editar Evento ID: ' + eventId : 'Adicionar Novo Evento'}</Text>
      {/* Campos do formulário aqui (Localização, Interrupção, Prejuízos, Causa) */}
      <Button title="Salvar Evento" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default AdicionarEditarEventoScreen;