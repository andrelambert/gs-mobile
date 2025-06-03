import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import LocationCard from '@/components/LocationCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { List, Map } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function LocationScreen() {
  const { events, fetchEvents } = useEvents();
  const router = useRouter();
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' ou 'map'
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Solicitar permissão de localização
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error('Erro ao obter permissão de localização:', error);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      
      // Extract unique locations from events
      const locations = events.reduce((acc, event) => {
        if (event.location && !acc.some(loc => loc.name === event.location)) {
          acc.push({ 
            id: event.id,
            name: event.location, 
            count: events.filter(e => e.location === event.location).length,
            latitude: event.latitude,
            longitude: event.longitude
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

  const renderTabContent = () => {
    if (uniqueLocations.length === 0) {
      return (
        <EmptyState 
          title="Nenhuma localização registrada" 
          description="Adicione um evento de falta de energia para registrar uma localização"
          buttonText="Adicionar evento"
          onPress={handleAddEvent}
        />
      );
    }

    if (activeTab === 'list') {
      return (
        <FlatList
          data={uniqueLocations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      // Usar localização do usuário se disponível, caso contrário usar a primeira localização válida
      const validLocations = uniqueLocations.filter(loc => loc.latitude && loc.longitude);
      
      let initialRegion;
      if (userLocation) {
        initialRegion = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
      } else if (validLocations.length > 0) {
        initialRegion = {
          latitude: validLocations[0].latitude,
          longitude: validLocations[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
      } else {
        initialRegion = {
          latitude: -23.5505, // São Paulo como padrão
          longitude: -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
      }

      return (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
        >
          {uniqueLocations.map((location) => {
            // Só renderizar marcadores para localizações com coordenadas válidas
            if (location.latitude && location.longitude) {
              return (
                <Marker
                  key={location.id}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                  }}
                  title={location.name}
                  description={`${location.count} ${location.count === 1 ? 'evento' : 'eventos'}`}
                />
              );
            }
            return null;
          })}
        </MapView>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localizações Afetadas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <List size={20} color={activeTab === 'list' ? Colors.white : Colors.darkText} />
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Lista</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Map size={20} color={activeTab === 'map' ? Colors.white : Colors.darkText} />
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>Mapa</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkText,
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});