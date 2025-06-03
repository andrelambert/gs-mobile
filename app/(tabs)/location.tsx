import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import LocationCard from '@/components/LocationCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';

export default function LocationScreen() {
  const { events, fetchEvents } = useEvents();
  const router = useRouter();
  const [uniqueLocations, setUniqueLocations] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      
      // Extract unique locations from events
      const locations = events.reduce((acc, event) => {
        if (event.location && !acc.some(loc => loc.name === event.location)) {
          acc.push({ 
            id: event.id,
            name: event.location, 
            count: events.filter(e => e.location === event.location).length 
          });
        }
        return acc;
      }, []);
      
      setUniqueLocations(locations);
    }, [events, fetchEvents])
  );

  const handleAddEvent = () => {
    router.push('/event/new');
  };

  const renderLocationItem = ({ item }) => (
    <LocationCard 
      location={item.name} 
      count={item.count} 
      onPress={() => router.push({
        pathname: '/(tabs)',
        params: { filterLocation: item.name }
      })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localizações Afetadas</Text>
      </View>

      {uniqueLocations.length > 0 ? (
        <FlatList
          data={uniqueLocations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState 
          title="Nenhuma localização registrada" 
          description="Adicione um evento de falta de energia para registrar uma localização"
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