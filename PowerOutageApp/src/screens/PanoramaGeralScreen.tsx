import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/AppNavigator'; // Importe o tipo

type PanoramaGeralScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PanoramaGeral'>;

type Props = {
  navigation: PanoramaGeralScreenNavigationProp;
};

const PanoramaGeralScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Panorama Geral Screen</Text>
      <Button
        title="Adicionar Novo Evento"
        onPress={() => navigation.navigate('AdicionarEditarEvento', {})} // Passa objeto vazio se não for edição
      />
      <Button
        title="Ver Recomendações"
        onPress={() => navigation.navigate('Recomendacoes')}
      />
      {/* Aqui listaremos os eventos e cada item levará para DetalhesEvento */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});

export default PanoramaGeralScreen;