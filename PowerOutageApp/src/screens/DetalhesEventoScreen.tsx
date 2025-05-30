import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';

type DetalhesEventoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DetalhesEvento'>;
type DetalhesEventoScreenRouteProp = RouteProp<RootStackParamList, 'DetalhesEvento'>;

type Props = {
  navigation: DetalhesEventoScreenNavigationProp;
  route: DetalhesEventoScreenRouteProp;
};

const DetalhesEventoScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Detalhes do Evento ID: {eventId}</Text>
      {/* Exibir informações do evento aqui */}
      <Button
        title="Editar"
        onPress={() => navigation.navigate('AdicionarEditarEvento', { eventId })}
      />
      <Button
        title="Excluir"
        onPress={() => {
          // Lógica de exclusão aqui
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});

export default DetalhesEventoScreen;