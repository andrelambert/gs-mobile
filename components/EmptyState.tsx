import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileQuestion } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onPress?: () => void;
}

export default function EmptyState({ 
  title, 
  description, 
  buttonText, 
  onPress 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <FileQuestion size={64} color={Colors.mediumGray} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {buttonText && onPress && (
        <TouchableOpacity 
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.mediumText,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});