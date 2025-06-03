import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PowerOutageEvent } from '@/types/event';
import Colors from '@/constants/Colors';
import { formatDate } from '@/utils/dateUtils';
import { Clock, MapPin } from 'lucide-react-native';
import StatusBadge from './StatusBadge';

interface DurationCardProps {
  event: PowerOutageEvent & { durationHours: number };
  onPress: () => void;
}

export default function DurationCard({ event, onPress }: DurationCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {event.durationHours} {event.durationHours === 1 ? 'hora' : 'horas'}
          </Text>
        </View>
        <StatusBadge status={event.status} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <MapPin size={18} color={Colors.primary} />
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Início:</Text>
            <Text style={styles.timeValue}>{formatDate(event.startDate)}</Text>
          </View>
          
          {event.endDate && (
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Fim:</Text>
              <Text style={styles.timeValue}>{formatDate(event.endDate)}</Text>
            </View>
          )}
        </View>
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  durationText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkText,
    flex: 1,
  },
  timeContainer: {
    backgroundColor: Colors.backgroundLight,
    padding: 8,
    borderRadius: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.mediumText,
    width: 50,
  },
  timeValue: {
    fontSize: 14,
    color: Colors.darkText,
    flex: 1,
  },
});