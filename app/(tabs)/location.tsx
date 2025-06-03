import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, Animated } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const slideAnimation = useRef(new Animated.Value(0)).current;
  
  // Calcular o tamanho do container e do slider
  const toggleContainerWidth = Dimensions.get('window').width - 32; // Subtrair margens
  const toggleSliderWidth = (toggleContainerWidth - 8) / 2; // Metade do container menos padding

  // Efeito para animar a transição entre tabs
  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: activeTab === 'list' ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60
    }).start();
  }, [activeTab, slideAnimation]);

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
        
        {/* Toggle moderno */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleOption, { width: toggleSliderWidth }]}
            onPress={() => setActiveTab('list')}
            activeOpacity={0.7}
          >
            <List size={18} color={activeTab === 'list' ? Colors.white : Colors.mediumText} />
            <Text style={[
              styles.toggleText,
              activeTab === 'list' && styles.toggleActiveText
            ]}>Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleOption, { width: toggleSliderWidth }]}
            onPress={() => setActiveTab('map')}
            activeOpacity={0.7}
          >
            <Map size={18} color={activeTab === 'map' ? Colors.white : Colors.mediumText} />
            <Text style={[
              styles.toggleText,
              activeTab === 'map' && styles.toggleActiveText
            ]}>Mapa</Text>
          </TouchableOpacity>

          <Animated.View 
            style={[
              styles.toggleSlider,
              {
                width: toggleSliderWidth,
                transform: [{ 
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, toggleSliderWidth]
                  }) 
                }]
              }
            ]}
          />
        </View>
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
    marginBottom: 16,
  },
  list: {
    padding: 16,
  },
  // Novos estilos para o toggle moderno
  toggleContainer: {
    height: 44,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: 16,
    padding: 4,
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  toggleSlider: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 36,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    zIndex: -1,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: 6,
    height: 36,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumText,
  },
  toggleActiveText: {
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