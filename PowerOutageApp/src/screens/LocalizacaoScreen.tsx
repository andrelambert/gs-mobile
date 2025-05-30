import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';
import { PowerOutageEvent } from '../types';

type LocalizacaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LocalizacaoScreen'>;
type LocalizacaoScreenRouteProp = RouteProp<RootStackParamList, 'LocalizacaoScreen'>;

type Props = {
  navigation: LocalizacaoScreenNavigationProp;
  route: LocalizacaoScreenRouteProp;
};

const LocalizacaoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { currentData, formTimestamp } = route.params;
  const [descricao, setDescricao] = useState(currentData?.descricao || '');

  const handleSave = () => {
    if (!descricao.trim()) {
      Alert.alert("Campo Obrigatório", "A descrição da localização não pode ser vazia.");
      return;
    }
    const localizacaoData: PowerOutageEvent['localizacao'] = { descricao };
    navigation.navigate({
      name: 'FormularioEvento',
      params: { updatedLocalizacao: localizacaoData, formTimestamp },
      merge: true, // Importante para mesclar params e não resetar os outros
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição da Localização (Bairro, Cidade ou CEP)</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Centro, São Paulo"
      />
      <Button title="Confirmar Localização" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 20 },
});

export default LocalizacaoScreen;