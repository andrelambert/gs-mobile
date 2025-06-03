import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEvents } from '@/hooks/useEvents';
import Colors from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Check, X } from 'lucide-react-native';
import { PowerOutageEvent } from '@/types/event';

export default function NewEventScreen() {
  const router = useRouter();
  const { addEvent } = useEvents();
  const [formData, setFormData] = useState<Partial<PowerOutageEvent>>({
    location: '',
    startDate: new Date().toISOString(),
    status: 'active',
    cause: '',
    damages: ''
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        [field]: date.toISOString()
      });
      
      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location || formData.location.trim() === '') {
      newErrors.location = 'A localização é obrigatória';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'A data de início é obrigatória';
    }
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate!)) {
      newErrors.endDate = 'A data de fim deve ser posterior à data de início';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addEvent({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      } as PowerOutageEvent);
      
      Alert.alert(
        "Sucesso",
        "Evento registrado com sucesso!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        "Erro",
        "Por favor, verifique os campos obrigatórios."
      );
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: "Novo Evento",
          headerTintColor: Colors.white,
          headerStyle: { backgroundColor: Colors.primary },
        }} 
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Localização*</Text>
            <TextInput
              style={[styles.input, errors.location ? styles.inputError : null]}
              placeholder="Ex: Jardim Paulista, São Paulo"
              placeholderTextColor={Colors.darkGray}
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
            />
            {errors.location ? (
              <Text style={styles.errorText}>{errors.location}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Início*</Text>
            <TouchableOpacity 
              style={[styles.input, styles.dateInput, errors.startDate ? styles.inputError : null]} 
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.startDate ? new Date(formData.startDate).toLocaleString() : 'Selecionar data'}
              </Text>
            </TouchableOpacity>
            {errors.startDate ? (
              <Text style={styles.errorText}>{errors.startDate}</Text>
            ) : null}
            <Modal
              transparent={true}
              visible={showStartDatePicker}
              animationType="fade"
              onRequestClose={() => setShowStartDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      if (formData.startDate) {
                        handleDateChange('startDate', new Date(formData.startDate));
                      }
                      setShowStartDatePicker(false);
                    }}>
                      <Text style={[styles.modalButtonText, styles.confirmButton]}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={formData.startDate ? new Date(formData.startDate) : new Date()}
                    mode="datetime"
                    display="spinner"
                    textColor={Colors.darkText}
                    locale="pt-BR"
                    onChange={(event, date) => {
                      if (date) {
                        handleDateChange('startDate', date);
                      }
                    }}
                    style={styles.picker}
                  />
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Fim (opcional)</Text>
            <TouchableOpacity 
              style={[styles.input, styles.dateInput, errors.endDate ? styles.inputError : null]} 
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.endDate ? new Date(formData.endDate).toLocaleString() : 'Selecionar data'}
              </Text>
            </TouchableOpacity>
            {errors.endDate ? (
              <Text style={styles.errorText}>{errors.endDate}</Text>
            ) : null}
            <Modal
              transparent={true}
              visible={showEndDatePicker}
              animationType="fade"
              onRequestClose={() => setShowEndDatePicker(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      if (formData.endDate) {
                        handleDateChange('endDate', new Date(formData.endDate));
                      }
                      setShowEndDatePicker(false);
                    }}>
                      <Text style={[styles.modalButtonText, styles.confirmButton]}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={formData.endDate ? new Date(formData.endDate) : new Date()}
                    mode="datetime"
                    display="spinner"
                    textColor={Colors.darkText}
                    locale="pt-BR"
                    onChange={(event, date) => {
                      if (date) {
                        handleDateChange('endDate', date);
                      }
                    }}
                    style={styles.picker}
                  />
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Causa da Interrupção</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Tempestade com ventos fortes"
              placeholderTextColor={Colors.darkGray}
              value={formData.cause}
              onChangeText={(text) => handleChange('cause', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Prejuízos Causados</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva os prejuízos observados..."
              placeholderTextColor={Colors.darkGray}
              value={formData.damages}
              onChangeText={(text) => handleChange('damages', text)}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  formData.status === 'active' && styles.statusActive
                ]}
                onPress={() => handleChange('status', 'active')}
              >
                <Text style={[
                  styles.statusText,
                  formData.status === 'active' && styles.statusActiveText
                ]}>Ativo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  formData.status === 'resolved' && styles.statusResolved
                ]}
                onPress={() => handleChange('status', 'resolved')}
              >
                <Text style={[
                  styles.statusText,
                  formData.status === 'resolved' && styles.statusResolvedText
                ]}>Resolvido</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => router.back()}
            >
              <X size={20} color={Colors.danger} />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Check size={20} color={Colors.white} />
              <Text style={styles.submitButtonText}>Salvar</Text>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.darkText,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.darkText,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: Colors.darkText,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  statusActive: {
    backgroundColor: Colors.warningLight,
    borderColor: Colors.warning,
  },
  statusResolved: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  statusText: {
    fontSize: 16,
    color: Colors.darkText,
  },
  statusActiveText: {
    color: Colors.warning,
    fontWeight: 'bold',
  },
  statusResolvedText: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  confirmButton: {
    fontWeight: 'bold',
  },
  picker: {
    height: 200,
  },
});