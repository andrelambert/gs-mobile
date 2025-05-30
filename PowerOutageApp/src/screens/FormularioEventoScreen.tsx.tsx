import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';
import { useEvents } from '../contexts/EventContext';
import { PowerOutageEvent } from '../types';

type FormularioEventoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FormularioEvento'>;
type FormularioEventoScreenRouteProp = RouteProp<RootStackParamList, 'FormularioEvento'>;

type Props = {
  navigation: FormularioEventoScreenNavigationProp;
  route: FormularioEventoScreenRouteProp;
};

// Estrutura inicial para um novo evento (rascunho)
const initialDraftEvent: Partial<PowerOutageEvent> = {
  localizacao: undefined,
  interrupcao: undefined,
  prejuizos: undefined,
  causa: undefined,
};

const FormularioEventoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params || {};
  const { addEvent, updateEvent, getEvent } = useEvents();

  const [draftEvent, setDraftEvent] = useState<Partial<PowerOutageEvent>>(initialDraftEvent);
  const [formTimestamp, setFormTimestamp] = useState<number>(Date.now()); // Identificador único para esta sessão do formulário
  const [isEditing, setIsEditing] = useState(false);

  // Carregar dados do evento se estiver editando
  useEffect(() => {
    if (eventId) {
      const eventToEdit = getEvent(eventId);
      if (eventToEdit) {
        setIsEditing(true);
        setDraftEvent({
            id: eventToEdit.id, // Manter o ID e timestampRegistro originais
            timestampRegistro: eventToEdit.timestampRegistro,
            localizacao: eventToEdit.localizacao,
            interrupcao: eventToEdit.interrupcao,
            prejuizos: eventToEdit.prejuizos,
            causa: eventToEdit.causa,
        });
      } else {
        Alert.alert("Erro", "Evento não encontrado para edição.");
        navigation.goBack();
      }
    } else {
        // Se não for edição, reseta para um novo rascunho com novo timestamp
        setDraftEvent(initialDraftEvent);
        setFormTimestamp(Date.now());
        setIsEditing(false);
    }
  }, [eventId, getEvent, navigation]);


  // Efeito para processar dados retornados das sub-telas
  useFocusEffect(
    useCallback(() => {
        let updated = false;
        // Verifica se os params são para esta sessão do formulário
        if (route.params?.formTimestamp === formTimestamp) {
            if (route.params?.updatedLocalizacao) {
                setDraftEvent(prev => ({ ...prev, localizacao: route.params.updatedLocalizacao }));
                navigation.setParams({ updatedLocalizacao: undefined }); // Limpa o param
                updated = true;
            }
            if (route.params?.updatedInterrupcao) {
                setDraftEvent(prev => ({ ...prev, interrupcao: route.params.updatedInterrupcao }));
                navigation.setParams({ updatedInterrupcao: undefined });
                updated = true;
            }
            if (route.params?.updatedPrejuizosText !== undefined) { // Checa por undefined explicitamente pois string vazia é falsy
                setDraftEvent(prev => ({ ...prev, prejuizos: route.params.updatedPrejuizosText }));
                navigation.setParams({ updatedPrejuizosText: undefined });
                updated = true;
            }
            // Adicionar para 'causa' se também for separado
            // if (route.params?.updatedCausaText !== undefined) { ... }
        }
        // Se houve atualização, pode ser útil logar ou fazer algo
        // if (updated) console.log('DraftEvent atualizado:', draftEvent);

    }, [route.params, navigation, formTimestamp, draftEvent]) // Adicionado draftEvent aqui, mas com cuidado
  );


  const handleSaveEvent = async () => {
    if (!draftEvent.localizacao?.descricao) {
      Alert.alert('Dados Incompletos', 'A localização é obrigatória.');
      return;
    }
    if (!draftEvent.interrupcao?.inicio) {
      Alert.alert('Dados Incompletos', 'O início da interrupção é obrigatório.');
      return;
    }

    const eventToSave: Omit<PowerOutageEvent, 'id' | 'timestampRegistro'> | PowerOutageEvent = {
      localizacao: draftEvent.localizacao,
      interrupcao: draftEvent.interrupcao,
      prejuizos: draftEvent.prejuizos,
      causa: draftEvent.causa,
    };

    try {
      if (isEditing && draftEvent.id && draftEvent.timestampRegistro) {
        // Se está editando, precisa do ID e timestampRegistro
        await updateEvent({ 
            ...(eventToSave as PowerOutageEvent), // Força a tipagem aqui
            id: draftEvent.id, 
            timestampRegistro: draftEvent.timestampRegistro 
        });
        Alert.alert('Sucesso', 'Evento atualizado!');
      } else {
        await addEvent(eventToSave as Omit<PowerOutageEvent, 'id' | 'timestampRegistro'>);
        Alert.alert('Sucesso', 'Evento adicionado!');
      }
      navigation.navigate('PanoramaGeral');
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    }
  };

  const getButtonText = (data?:any) => data ? "Modificar" : "Definir";
  const getSummaryText = (data: string | undefined, placeholder: string) => data || placeholder;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionHeader}>Detalhes do Evento</Text>

      {/* Campo de Causa (direto no hub ou pode ser tela separada) */}
      <Text style={styles.label}>Causa do Evento (Opcional)</Text>
      <TextInput
        style={styles.input}
        value={draftEvent.causa || ''}
        onChangeText={(text) => setDraftEvent(prev => ({ ...prev, causa: text }))}
        placeholder="Ex: Chuva intensa, Vento forte"
      />

      <View style={styles.section}>
        <Text style={styles.label}>Localização Atingida *</Text>
        <Text style={styles.summary}>{getSummaryText(draftEvent.localizacao?.descricao, "Não definida")}</Text>
        <Button
          title={`${getButtonText(draftEvent.localizacao)} Localização`}
          onPress={() => navigation.navigate('LocalizacaoScreen', { currentData: draftEvent.localizacao, formTimestamp })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tempo de Interrupção *</Text>
        <Text style={styles.summary}>
            Início: {draftEvent.interrupcao?.inicio ? new Date(draftEvent.interrupcao.inicio).toLocaleString() : "Não definido"}
        </Text>
        {draftEvent.interrupcao?.fim && <Text style={styles.summary}>Fim: {new Date(draftEvent.interrupcao.fim).toLocaleString()}</Text>}
        {draftEvent.interrupcao?.duracaoEstimada && <Text style={styles.summary}>Estimativa: {draftEvent.interrupcao.duracaoEstimada}</Text>}
        <Button
          title={`${getButtonText(draftEvent.interrupcao)} Tempo de Interrupção`}
          onPress={() => navigation.navigate('TempoInterrupcaoScreen', { currentData: draftEvent.interrupcao, formTimestamp })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Prejuízos Causados</Text>
        <Text style={styles.summary}>{getSummaryText(draftEvent.prejuizos, "Nenhum prejuízo registrado")}</Text>
        <Button
          title={`${getButtonText(draftEvent.prejuizos)} Prejuízos`}
          onPress={() => navigation.navigate('PrejuizosScreen', { currentData: draftEvent.prejuizos, formTimestamp })}
        />
      </View>
      
      <View style={styles.saveButtonContainer}>
        <Button title={isEditing ? "Atualizar Evento" : "Salvar Novo Evento"} onPress={handleSaveEvent} color="#28a745"/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, paddingBottom: 40 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  section: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 15, backgroundColor: '#fff' },
  summary: { fontSize: 15, fontStyle: 'italic', color: '#666', marginBottom: 10, minHeight: 20 },
  saveButtonContainer: { marginTop: 20 }
});

export default FormularioEventoScreen;