import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import { formatDate, calculateDuration } from '@/utils/dateUtils';
import { MapPin, Clock, FileText, Calendar, TriangleAlert as AlertTriangle, CreditCard as Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import StatusBadge from '@/components/StatusBadge';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getEventById, deleteEvent } = useEvents();
  const [event, setEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const eventData = getEventById(String(id));
      setEvent(eventData);
    }
  }, [id, getEventById]);

  const handleEdit = () => {
    router.push(`/event/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => {
            deleteEvent(String(id));
            router.back();
          }
        }
      ]
    );
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const duration = calculateDuration(event.startDate, event.endDate);

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: "Detalhes do Evento",
          headerTintColor: Colors.white,
          headerStyle: { backgroundColor: Colors.primary },
        }} 
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.row}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.date}>
                Registrado em: {formatDate(event.createdAt)}
              </Text>
            </View>
            <StatusBadge status={event.status} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Localização</Text>
            </View>
            <Text style={styles.sectionContent}>{event.location}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Tempo de Interrupção</Text>
            </View>
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
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Duração:</Text>
              <Text style={styles.timeValue}>
                {duration} {duration === 1 ? 'hora' : 'horas'}
              </Text>
            </View>
          </View>

          {event.cause && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={20} color={Colors.warning} />
                <Text style={styles.sectionTitle}>Causa</Text>
              </View>
              <Text style={styles.sectionContent}>{event.cause}</Text>
            </View>
          )}

          {event.damages && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Prejuízos Causados</Text>
              </View>
              <Text style={styles.sectionContent}>{event.damages}</Text>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={handleEdit}
            >
              <Edit size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Trash2 size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    ...Colors.shadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.mediumText,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    ...Colors.shadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkText,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkText,
  },
  timeInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkText,
    width: 80,
  },
  timeValue: {
    fontSize: 16,
    color: Colors.darkText,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});