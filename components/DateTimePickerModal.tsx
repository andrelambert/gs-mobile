import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';

interface DateTimePickerModalProps {
  isVisible: boolean;
  date: Date;
  mode: 'date' | 'time' | 'datetime';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  maximumDate?: Date;
}

export default function DateTimePickerModal({
  isVisible,
  date,
  mode,
  onConfirm,
  onCancel,
  maximumDate
}: DateTimePickerModalProps) {
  const [selectedDate, setSelectedDate] = React.useState(date);
  const [currentMode, setCurrentMode] = React.useState<'date' | 'time'>(
    mode === 'datetime' ? 'date' : mode
  );

  const onChange = (event: any, selected: Date | undefined) => {
    if (selected) {
      setSelectedDate(selected);
      
      if (mode === 'datetime' && currentMode === 'date') {
        setCurrentMode('time');
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  if (Platform.OS === 'android') {
    if (!isVisible) return null;
    
    return (
      <DateTimePicker
        value={selectedDate}
        mode={currentMode}
        is24Hour={true}
        display="default"
        maximumDate={maximumDate}
        onChange={(event, date) => {
          if (event.type === 'dismissed') {
            onCancel();
            return;
          }
          
          if (date) {
            if (mode === 'datetime' && currentMode === 'date') {
              setSelectedDate(date);
              setCurrentMode('time');
            } else {
              onConfirm(date);
            }
          }
        }}
      />
    );
  }

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          
          <DateTimePicker
            value={selectedDate}
            mode={currentMode}
            is24Hour={true}
            display="spinner"
            maximumDate={maximumDate}
            onChange={onChange}
            style={styles.picker}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.mediumText,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  picker: {
    height: 260,
  },
});