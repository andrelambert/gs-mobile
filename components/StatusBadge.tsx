import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface StatusBadgeProps {
  status: 'active' | 'resolved';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[
      styles.container,
      status === 'active' ? styles.activeContainer : styles.resolvedContainer
    ]}>
      <Text style={[
        styles.text,
        status === 'active' ? styles.activeText : styles.resolvedText
      ]}>
        {status === 'active' ? 'Em andamento' : 'Resolvido'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeContainer: {
    backgroundColor: Colors.warningLight,
  },
  resolvedContainer: {
    backgroundColor: Colors.successLight,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: Colors.warning,
  },
  resolvedText: {
    color: Colors.success,
  },
});