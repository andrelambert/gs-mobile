import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';
import { PowerOutageEvent } from '../types';


type TempoInterrupcaoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TempoInterrupcaoScreen'>;
type TempoInterrupcaoScreenRouteProp = RouteProp<RootStackParamList, 'TempoInterrupcaoScreen'>;

type Props = {
  navigation: TempoInterrupcaoScreenNavigationProp;
  route: TempoInterrupcaoScreenRouteProp;
};

const TempoInterrupcaoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { currentData, formTimestamp } = route.params;

  const [inicio, setInicio] = useState<Date>(currentData?.inicio ? new Date(currentData.inicio) : new Date());
  const [fim, setFim] = useState<Date | undefined>(currentData?.fim ? new Date(currentData.fim) : undefined);
  const [duracaoEstimada, setDuracaoEstimada] = useState(currentData?.duracaoEstimada || '');

  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);

  const onInicioChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowInicioPicker(Platform.OS === 'ios');
    if (selectedDate) setInicio(selectedDate);
  };

  const onFimChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFimPicker(Platform.OS === 'ios');
    if (selectedDate) setFim(selectedDate);
  };
  
  const handleSave = () => {
    if (fim && inicio > fim) {
        Alert.alert("Erro de Validação", "A data final não pode ser anterior à data inicial.");
        return;
    }

    const interrupcaoData: PowerOutageEvent['interrupcao'] = {
      inicio: inicio.toISOString(),
      fim: fim?.toISOString(),
      duracaoEstimada: duracaoEstimada.trim() || undefined,
    };

    navigation.navigate({
      name: 'FormularioEvento',
      params: { updatedInterrupcao: interrupcaoData, formTimestamp },
      merge: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Início da Interrupção *</Text>
      <TouchableOpacity onPress={() => setShowInicioPicker(true)} style={styles.dateButton}>
        <Text>{inicio.toLocaleString()}</Text>
      </TouchableOpacity>
      {showInicioPicker && (
        <DateTimePicker value={inicio} mode="datetime" display="default" onChange={onInicioChange} />
      )}

      <Text style={styles.label}>Fim da Interrupção (Opcional)</Text>
      <TouchableOpacity onPress={() => setShowFimPicker(true)} style={styles.dateButton}>
        <Text>{fim ? fim.toLocaleString() : "Definir data/hora do fim"}</Text>
      </TouchableOpacity>
      {showFimPicker && (
        <DateTimePicker value={fim || inicio} mode="datetime" display="default" onChange={onFimChange} minimumDate={inicio} />
      )}
      <Button title="Limpar Data Final" onPress={() => setFim(undefined)} color="#FF6347" />
      
      <Text style={styles.label}>Duração Estimada (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={duracaoEstimada}
        onChangeText={setDuracaoEstimada}
        placeholder="Ex: 2 horas, Indeterminado"
      />
      <View style={styles.buttonSpacing} />
      <Button title="Confirmar Tempo de Interrupção" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 10 },
  dateButton: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10, alignItems: 'center' },
  buttonSpacing: { height: 10 },
});

export default TempoInterrupcaoScreen;