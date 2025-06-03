import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import DurationCard from '@/components/DurationCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';
import { calculateDuration } from '@/utils/dateUtils';

export default function DurationScreen() {
  const { events, fetchEvents } = useEvents();
  const router = useRouter();
  const [sortedEvents, setSortedEvents] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      
      // Sort events by duration (longest first)
      const eventsWithDuration = events.map(event => ({
        ...event,
        durationHours: calculateDuration(event.startDate, event.endDate)
      })).sort((a, b) => b.durationHours - a.durationHours);
      
      setSortedEvents(eventsWithDuration);
    }, [events, fetchEvents])
  );

  const totalDuration = sortedEvents.reduce((acc, event) => acc + event.durationHours, 0);
  const averageDuration = sortedEvents.length > 0 
    ? Math.round(totalDuration / sortedEvents.length) 
    : 0;

  const handleAddEvent = () => {
    router.push('/event/new');
  };

  const renderDurationItem = ({ item }) => (
    <DurationCard 
      event={item}
      onPress={() => router.push(`/event/${item.id}`)}
    />
  );

  const StatsCard = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalDuration}</Text>
        <Text style={styles.statLabel}>Duração Total (horas)</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{averageDuration}</Text>
        <Text style={styles.statLabel}>Duração Média (horas)</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tempos de Interrupção</Text>
      </View>

      <StatsCard />

      {sortedEvents.length > 0 ? (
        <FlatList
          data={sortedEvents}
          renderItem={renderDurationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState 
          title="Nenhuma interrupção registrada" 
          description="Adicione um evento de falta de energia para registrar um tempo de interrupção"
          buttonText="Adicionar evento"
          onPress={handleAddEvent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 8,
  },
});