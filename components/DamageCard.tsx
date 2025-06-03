import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PowerOutageEvent } from '@/types/event';
import Colors from '@/constants/Colors';
import { FileText, MapPin } from 'lucide-react-native';
import StatusBadge from './StatusBadge';

interface DamageCardProps {
  event: PowerOutageEvent;
  onPress: () => void;
}

export default function DamageCard({ event, onPress }: DamageCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        </View>
        <StatusBadge status={event.status} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FileText size={20} color={Colors.primary} />
          <Text style={styles.damagesTitle}>Prejuízos Reportados</Text>
        </View>
        <Text style={styles.damages} numberOfLines={3}>
          {event.damages}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.viewMore}>Ver detalhes completos</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    ...Colors.shadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.darkText,
    flex: 1,
  },
  content: {
    padding: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  damagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginLeft: 8,
  },
  damages: {
    fontSize: 14,
    color: Colors.darkText,
    lineHeight: 20,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    alignItems: 'center',
  },
  viewMore: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});