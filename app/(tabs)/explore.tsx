import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  { id: '1', name: 'Haircut', emoji: '💇' },
  { id: '2', name: 'Beard', emoji: '🧔' },
  { id: '3', name: 'Massage', emoji: '💆' },
  { id: '4', name: 'Combo Deals', emoji: '✂️' },
  { id: '5', name: 'Coloring', emoji: '🎨' },
];

export default function Explore() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore Services</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryCard}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    elevation: 2,
  },
  emoji: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});
