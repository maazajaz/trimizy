import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopDetail() {
  const { name, location, price, rating, image } = useLocalSearchParams();
  const navigation = useNavigation(); // Correctly imported and used

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#1f1f1f" />
      </TouchableOpacity>

      <Image source={{ uri: image as string }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color="#444" />
          <Text style={styles.text}>{location}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="star" size={18} color="#f4c430" />
          <Text style={styles.text}>Rating: {rating}/5</Text>
        </View>

        <View style={styles.row}>
          <FontAwesome5 name="money-bill-wave" size={16} color="#444" />
          <Text style={styles.text}>Starting at {price}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="time-outline" size={18} color="#444" />
          <Text style={styles.text}>Open: 10 AM - 9 PM</Text>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          Welcome to {name}! We offer professional and hygienic services at your doorstep. 
          Book now for a premium experience without leaving your home.
        </Text>
      </View>

      <Link href="/booking" asChild>
        <TouchableOpacity style={styles.bookButton}>
          <Ionicons name="calendar" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 240,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: '#1f1f1f',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});