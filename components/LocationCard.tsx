import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface LocationCardProps {
  location: string;
  count: number;
  onPress: () => void;
}

export default function LocationCard({ location, count, onPress }: LocationCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MapPin size={24} color={Colors.white} />
      </View>
      <View style={styles.content}>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.count}>
          {count} {count === 1 ? 'evento' : 'eventos'} registrado{count === 1 ? '' : 's'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Colors.shadow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: Colors.mediumText,
  },
});