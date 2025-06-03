import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface RecommendationCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export default function RecommendationCard({ title, icon, items }: RecommendationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.item}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkText,
    marginLeft: 12,
  },
  content: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  item: {
    fontSize: 15,
    color: Colors.darkText,
    flex: 1,
    lineHeight: 22,
  },
});