import React, { useMemo } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/AppNavigator';
import { useEvents } from '../contexts/EventContext';
import { PowerOutageEvent } from '../types';

type DetalhesEventoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DetalhesEvento'>;
type DetalhesEventoScreenRouteProp = RouteProp<RootStackParamList, 'DetalhesEvento'>;

type Props = {
  navigation: DetalhesEventoScreenNavigationProp;
  route: DetalhesEventoScreenRouteProp;
};

// Função utilitária para calcular duração (pode ir para src/utils/dateUtils.ts)
const calcularDuracaoReal = (inicioISO: string, fimISO?: string): string | undefined => {
    if (!fimISO) return undefined;
    const inicio = new Date(inicioISO);
    const fim = new Date(fimISO);
    let diffMs = fim.getTime() - inicio.getTime();

    if (diffMs < 0) return "Data final anterior à inicial";

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= diffHrs * (1000 * 60 * 60);
    const diffMins = Math.floor(diffMs / (1000 * 60));

    let duracao = "";
    if (diffHrs > 0) duracao += `${diffHrs} hora(s) `;
    if (diffMins > 0 || diffHrs === 0) duracao += `${diffMins} minuto(s)`;

    return duracao.trim() || "Menos de 1 minuto";
};


const DetalhesEventoScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { getEvent, deleteEvent, loading } = useEvents(); // Adicionado loading

  // Usar useMemo para evitar recalcular o evento em cada renderização,
  // a menos que eventId ou getEvent (ou a lista de eventos interna do context) mude.
  const evento = useMemo(() => getEvent(eventId), [eventId, getEvent]);

  if (loading) { // Se os eventos ainda estão carregando do AsyncStorage
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!evento) {
    return (
      <View style={styles.centered}>
        <Text>Evento não encontrado.</Text>
        <Button title="Voltar ao Panorama" onPress={() => navigation.navigate('PanoramaGeral')} />
      </View>
    );
  }

  const duracaoReal = calcularDuracaoReal(evento.interrupcao.inicio, evento.interrupcao.fim);

  const handleEdit = () => {
    navigation.navigate('AdicionarEditarEvento', { eventId: evento.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteEvent(evento.id);
            Alert.alert('Sucesso', 'Evento excluído.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Detalhes do Evento</Text>

      <View style={styles.detailItem}>
        <Text style={styles.label}>ID do Evento:</Text>
        <Text style={styles.value}>{evento.id}</Text>
      </View>

      <View style={styles.detailItem}>
        <Text style={styles.label}>Data do Registro:</Text>
        <Text style={styles.value}>{new Date(evento.timestampRegistro).toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localização</Text>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{evento.localizacao.descricao}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interrupção</Text>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Início:</Text>
          <Text style={styles.value}>{new Date(evento.interrupcao.inicio).toLocaleString()}</Text>
        </View>
        {evento.interrupcao.fim && (
          <View style={styles.detailItem}>
            <Text style={styles.label}>Fim:</Text>
            <Text style={styles.value}>{new Date(evento.interrupcao.fim).toLocaleString()}</Text>
          </View>
        )}
        {duracaoReal && (
          <View style={styles.detailItem}>
            <Text style={styles.label}>Duração Real:</Text>
            <Text style={styles.value}>{duracaoReal}</Text>
          </View>
        )}
        {evento.interrupcao.duracaoEstimada && (
          <View style={styles.detailItem}>
            <Text style={styles.label}>Duração Estimada:</Text>
            <Text style={styles.value}>{evento.interrupcao.duracaoEstimada}</Text>
          </View>
        )}
      </View>

      {evento.causa && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Causa</Text>
          <View style={styles.detailItem}>
            <Text style={styles.value}>{evento.causa}</Text>
          </View>
        </View>
      )}

      {evento.prejuizos && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prejuízos</Text>
          <View style={styles.detailItem}>
            <Text style={styles.value}>{evento.prejuizos}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <Button title="Editar Evento" onPress={handleEdit} />
        <View style={{marginVertical: 5}} />
        <Button title="Excluir Evento" onPress={handleDelete} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 15, backgroundColor: '#fff', padding: 15, borderRadius: 8, elevation: 1},
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginRight: 5 },
  value: { fontSize: 16, color: '#333', flexShrink: 1 },
  buttonGroup: { marginTop: 20 },
});

export default DetalhesEventoScreen;