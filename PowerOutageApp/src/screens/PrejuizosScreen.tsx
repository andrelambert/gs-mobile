import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';
import { PowerOutageEvent } from '../types';

type PrejuizosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrejuizosScreen'>;
type PrejuizosScreenRouteProp = RouteProp<RootStackParamList, 'PrejuizosScreen'>;

type Props = {
  navigation: PrejuizosScreenNavigationProp;
  route: PrejuizosScreenRouteProp;
};

const PrejuizosScreen: React.FC<Props> = ({ navigation, route }) => {
  const { currentData, formTimestamp } = route.params;
  const [prejuizos, setPrejuizos] = useState(currentData || '');

  const handleSave = () => {
    navigation.navigate({
      name: 'FormularioEvento',
      params: { updatedPrejuizosText: prejuizos.trim() || undefined, formTimestamp },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição dos Prejuízos (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={prejuizos}
        onChangeText={setPrejuizos}
        placeholder="Descreva os prejuízos observados (residências, comércios, etc.)"
        multiline
        numberOfLines={6}
      />
      <Button title="Confirmar Prejuízos" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 20 },
  textArea: { height: 150, textAlignVertical: 'top' },
});

export default PrejuizosScreen;