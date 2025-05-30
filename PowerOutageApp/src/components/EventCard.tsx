// src/components/EventCard.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { PowerOutageEvent } from '../types';

interface EventCardProps {
  event: PowerOutageEvent;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity style={styles.eventItem} onPress={onPress}>
      <Text style={styles.eventTitle}>Local: {event.localizacao.descricao}</Text>
      <Text>Início: {new Date(event.interrupcao.inicio).toLocaleDateString()}</Text>
      <Text>Status: {event.interrupcao.fim ? 'Resolvido' : 'Em Andamento'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventItem: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default EventCard;