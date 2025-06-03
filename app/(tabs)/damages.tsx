import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import DamageCard from '@/components/DamageCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';
import { PowerOutageEvent } from '@/types/event';

export default function DamagesScreen() {
  const { events, fetchEvents } = useEvents();
  const router = useRouter();
  const [eventsWithDamages, setEventsWithDamages] = useState<PowerOutageEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      
      // Filter events that have damages recorded
      const filteredEvents = events.filter(event => 
        event.damages && event.damages.trim().length > 0
      );
      
      setEventsWithDamages(filteredEvents);
    }, [events, fetchEvents])
  );

  const handleAddEvent = () => {
    router.push('/event/new');
  };

  const renderDamageItem = ({ item }: { item: PowerOutageEvent }) => (
    <DamageCard 
      event={item}
      onPress={() => router.push(`/event/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prejuízos Reportados</Text>
      </View>

      {eventsWithDamages.length > 0 ? (
        <FlatList
          data={eventsWithDamages}
          renderItem={renderDamageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState 
          title="Nenhum prejuízo registrado" 
          description="Adicione um evento de falta de energia para registrar prejuízos causados"
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
});