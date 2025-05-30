import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigators/AppNavigator';
import { useEvents } from '../contexts/EventContext';
import { PowerOutageEvent } from '../types';

type AdicionarEditarEventoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdicionarEditarEvento'>;
type AdicionarEditarEventoScreenRouteProp = RouteProp<RootStackParamList, 'AdicionarEditarEvento'>;

type Props = {
  navigation: AdicionarEditarEventoScreenNavigationProp;
  route: AdicionarEditarEventoScreenRouteProp;
};

const AdicionarEditarEventoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params || {};
  const { addEvent, updateEvent, getEvent } = useEvents();

  const [descricaoLocalizacao, setDescricaoLocalizacao] = useState('');
  const [inicioInterrupcao, setInicioInterrupcao] = useState<Date>(new Date());
  const [fimInterrupcao, setFimInterrupcao] = useState<Date | undefined>(undefined);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFimPicker, setShowFimPicker] = useState(false);
  const [duracaoEstimada, setDuracaoEstimada] = useState('');
  const [prejuizos, setPrejuizos] = useState('');
  const [causa, setCausa] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<PowerOutageEvent | null>(null);

  useEffect(() => {
    if (eventId) {
      const eventToEdit = getEvent(eventId);
      if (eventToEdit) {
        setIsEditing(true);
        setCurrentEvent(eventToEdit);
        setDescricaoLocalizacao(eventToEdit.localizacao.descricao);
        setInicioInterrupcao(new Date(eventToEdit.interrupcao.inicio));
        if (eventToEdit.interrupcao.fim) {
          setFimInterrupcao(new Date(eventToEdit.interrupcao.fim));
        }
        setDuracaoEstimada(eventToEdit.interrupcao.duracaoEstimada || '');
        setPrejuizos(eventToEdit.prejuizos || '');
        setCausa(eventToEdit.causa || '');
      } else {
        Alert.alert("Erro", "Evento não encontrado para edição.");
        navigation.goBack();
      }
    }
  }, [eventId, getEvent, navigation]);

  const onInicioDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowInicioPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setInicioInterrupcao(selectedDate);
    }
  };

  const onFimDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowFimPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFimInterrupcao(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!descricaoLocalizacao.trim()) {
      Alert.alert('Erro', 'A descrição da localização é obrigatória.');
      return;
    }

    const eventData = {
      localizacao: { descricao: descricaoLocalizacao },
      interrupcao: {
        inicio: inicioInterrupcao.toISOString(),
        fim: fimInterrupcao?.toISOString(),
        duracaoEstimada: duracaoEstimada.trim() || undefined,
      },
      prejuizos: prejuizos.trim() || undefined,
      causa: causa.trim() || undefined,
    };

    try {
      if (isEditing && currentEvent) {
        await updateEvent({ ...currentEvent, ...eventData });
        Alert.alert('Sucesso', 'Evento atualizado!');
      } else {
        await addEvent(eventData);
        Alert.alert('Sucesso', 'Evento adicionado!');
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Localização (Bairro, Cidade ou CEP)</Text>
      <TextInput
        style={styles.input}
        value={descricaoLocalizacao}
        onChangeText={setDescricaoLocalizacao}
        placeholder="Ex: Centro, São Paulo"
      />

      <Text style={styles.label}>Início da Interrupção</Text>
      <TouchableOpacity onPress={() => setShowInicioPicker(true)} style={styles.dateButton}>
        <Text>{inicioInterrupcao.toLocaleString()}</Text>
      </TouchableOpacity>
      {showInicioPicker && (
        <DateTimePicker
          value={inicioInterrupcao}
          mode="datetime"
          display="default"
          onChange={onInicioDateChange}
        />
      )}

      <Text style={styles.label}>Fim da Interrupção (Opcional)</Text>
       <TouchableOpacity onPress={() => setShowFimPicker(true)} style={styles.dateButton}>
        <Text>{fimInterrupcao ? fimInterrupcao.toLocaleString() : "Definir data/hora do fim"}</Text>
      </TouchableOpacity>
      {showFimPicker && (
        <DateTimePicker
          value={fimInterrupcao || new Date()} // Provide a default if undefined
          mode="datetime"
          display="default"
          onChange={onFimDateChange}
          minimumDate={inicioInterrupcao} // Cannot end before it started
        />
      )}
      <Button title="Limpar Data Final" onPress={() => setFimInterrupcao(undefined)} color="#FF6347" />


      <Text style={styles.label}>Duração Estimada (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={duracaoEstimada}
        onChangeText={setDuracaoEstimada}
        placeholder="Ex: 2 horas, Indeterminado"
      />

      <Text style={styles.label}>Causa (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={causa}
        onChangeText={setCausa}
        placeholder="Ex: Chuva intensa, Vento forte"
      />

      <Text style={styles.label}>Prejuízos (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={prejuizos}
        onChangeText={setPrejuizos}
        placeholder="Descreva os prejuízos observados..."
        multiline
        numberOfLines={4}
      />

      <Button title={isEditing ? "Atualizar Evento" : "Salvar Evento"} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 16, marginBottom: 5, marginTop: 15, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  }
});

export default AdicionarEditarEventoScreen;