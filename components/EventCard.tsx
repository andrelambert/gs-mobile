import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PowerOutageEvent } from '@/types/event';
import Colors from '@/constants/Colors';
import { formatDate, calculateDuration } from '@/utils/dateUtils';
import { MapPin, Clock, Calendar, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import StatusBadge from './StatusBadge';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface EventCardProps {
  event: PowerOutageEvent;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventCard({ event, onPress, onEdit, onDelete }: EventCardProps) {
  const duration = calculateDuration(event.startDate, event.endDate);
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit();
          }}
        >
          <Edit2 size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
        >
          <Trash2 size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <TouchableOpacity 
          style={styles.container}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <View style={styles.row}>
              <Calendar size={16} color={Colors.primary} />
              <Text style={styles.date}>{formatDate(event.createdAt)}</Text>
            </View>
            <StatusBadge status={event.status} />
          </View>
          
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Clock size={18} color={Colors.primary} />
              <Text style={styles.duration}>
                {duration} {duration === 1 ? 'hora' : 'horas'}
              </Text>
            </View>
            
            {event.cause ? (
              <Text style={styles.cause} numberOfLines={1}>
                Causa: {event.cause}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.mediumText,
  },
  content: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkText,
    flex: 1,
  },
  duration: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.darkText,
  },
  cause: {
    fontSize: 14,
    color: Colors.mediumText,
    marginTop: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: '100%',
  },
  editButton: {
    backgroundColor: Colors.warning,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
  },
});