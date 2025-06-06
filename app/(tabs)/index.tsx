import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useEvents } from '@/hooks/useEvents';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

export default function PanoramaScreen() {
  const { events, loading, fetchEvents, deleteEvent } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused();

  const activeEvents = events.filter(event => event.status === 'active');
  const resolvedEvents = events.filter(event => event.status === 'resolved');

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  const handleAddEvent = () => {
    router.push('/event/new');
  };

  const handleEditEvent = (id: string) => {
    router.push(`/event/edit/${id}`);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  const renderItem = ({ item }) => (
    <EventCard 
      event={item} 
      onPress={() => router.push(`/event/${item.id}`)}
      onEdit={() => handleEditEvent(item.id)}
      onDelete={() => handleDeleteEvent(item.id)}
    />
  );

  const StatsCard = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{events.length}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{activeEvents.length}</Text>
        <Text style={styles.statLabel}>Em andamento</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{resolvedEvents.length}</Text>
        <Text style={styles.statLabel}>Resolvidos</Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Eventos Registrados</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddEvent}
            activeOpacity={0.7}
          >
            <Plus size={24} color={Colors.white} />
            <Text style={styles.addButtonText}>Novo</Text>
          </TouchableOpacity>
        </View>

        <StatsCard />

        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <EmptyState 
            title="Nenhum evento registrado" 
            description="Registre seu primeiro evento de falta de energia clicando no botão 'Novo'"
            buttonText="Adicionar evento"
            onPress={handleAddEvent}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkText,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    ...Colors.shadow,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.mediumText,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 8,
  },
});