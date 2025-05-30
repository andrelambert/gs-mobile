import React, { useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar dados ao focar na tela
import { RootStackParamList } from '../navigators/AppNavigator';
import { useEvents } from '../contexts/EventContext';
import { PowerOutageEvent } from '../types';

type PanoramaGeralScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PanoramaGeral'>;

type Props = {
  navigation: PanoramaGeralScreenNavigationProp;
};

const PanoramaGeralScreen: React.FC<Props> = ({ navigation }) => {
  const { events, loading, refreshEvents } = useEvents();

  useFocusEffect(
    useCallback(() => {
      refreshEvents(); // Recarrega os eventos sempre que a tela recebe foco
    }, [refreshEvents])
  );

  const renderItem = ({ item }: { item: PowerOutageEvent }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate('DetalhesEvento', { eventId: item.id })}
    >
      <Text style={styles.eventTitle}>Local: {item.localizacao.descricao}</Text>
      <Text>Início: {new Date(item.interrupcao.inicio).toLocaleString()}</Text>
      <Text>Status: {item.interrupcao.fim ? 'Resolvido' : 'Em Andamento'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Adicionar Novo Evento"
          onPress={() => navigation.navigate('FormularioEvento', {})}
        />
        <View style={{marginVertical: 5}} />
        <Button
          title="Ver Recomendações"
          onPress={() => navigation.navigate('Recomendacoes')}
        />
      </View>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum evento registrado ainda.</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f0f0' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: { marginBottom: 20 },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  list: { paddingTop: 10 },
});

export default PanoramaGeralScreen;