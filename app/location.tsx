import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavedAddress, useAuth } from '../auth.context'; // Import useAuth and SavedAddress

export default function LocationScreen() {
  const router = useRouter();
  const { savedAddresses, setSelectedLocation } = useAuth(); // Access savedAddresses and setSelectedLocation

  const [currentAddress, setCurrentAddress] = useState('Amrapali Zodiac, Sector 120, Noida');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const fetchCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = location.coords;

      // Fetch from Google Geocoding API
      const response = await axios.get(
        // Here's the change to use the environment variable
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`
      );

      const results = response.data.results;
      if (!results || results.length === 0) {
        setCurrentAddress('Unable to fetch address');
        return;
      }

      const addressComponents = results[0].address_components;

      const getPart = (types: string[]) =>
        addressComponents.find((c: { types: string | string[]; }) =>
          types.every((t) => c.types.includes(t))
        )?.long_name || '';


      const society = getPart(['sublocality_level_2']);
      const sublocality = getPart(['sublocality_level_1']);
      const locality = getPart(['locality']);
      const area = getPart(['administrative_area_level_2']);
      const city = getPart(['administrative_area_level_1']);
      const postalCode = getPart(['postal_code']);

      const cleanedAddress = [society, sublocality, locality || area, city, postalCode]
        .filter(Boolean)
        .join(', ');

      setCurrentAddress(cleanedAddress || 'Unknown location');
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Could not fetch your location.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Handler for when a saved address is pressed
  const handleSelectSavedAddress = (address: SavedAddress) => {
    setSelectedLocation(address); // Set the selected address in context
    router.replace('/'); // Navigate back to the home screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="chevron-down" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a location</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search for area, street name..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Options */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/add-address')}>
          <Ionicons name="add" size={22} color="#e63946" style={{ marginRight: 8 }} />
          <Text style={styles.optionTextRed}>Add address</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={fetchCurrentLocation}>
          <Ionicons name="locate" size={22} color="#e63946" style={{ marginRight: 8 }} />
          <View>
            <Text style={styles.optionTextRed}>Use your current location</Text>
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#e63946" style={{ marginTop: 4 }} />
            ) : (
              <Text style={styles.optionSubText}>{currentAddress}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Saved addresses from AuthContext */}
        {savedAddresses.length > 0 && (
          <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>
        )}
        
        {savedAddresses.map((address, index) => (
          <TouchableOpacity 
            key={address.id || index} 
            style={styles.addressCard}
            onPress={() => handleSelectSavedAddress(address)} // Call handler on press
          >
            <View style={styles.addressHeader}>
              <Ionicons
                name={
                  address.addressType === 'Home'
                    ? 'home-outline'
                    : address.addressType === 'Work'
                    ? 'briefcase-outline'
                    : 'bookmark-outline'
                }
                size={20}
                color="#111"
              />
              <Text style={styles.addressTitle}>{address.addressType || 'Other'}</Text>
              {/* Distance text might need to be dynamic based on current location and address coordinates */}
              {/* For now, we don't have current location constantly, so it's a placeholder */}
              <Text style={styles.distanceText}>{index === 0 ? '0 m' : 'X km'}</Text> 
            </View>
            <Text style={styles.addressText}>
              {/* Changed order: additionalDetails first, then fullAddress */}
              {address.additionalDetails ? `${address.additionalDetails}, ` : ''}
              {address.fullAddress}
            </Text>
            {address.receiverPhone && (
              <Text style={styles.phone}>
                Phone number: <Text style={{ fontWeight: '600' }}>{address.receiverPhone}</Text>
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  searchInput: { marginLeft: 10, fontSize: 16, flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionTextRed: { fontSize: 16, fontWeight: '600', color: '#e63946' },
  optionSubText: { fontSize: 13, color: '#777' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  addressCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  addressTitle: { fontWeight: '600', fontSize: 16, marginLeft: 4 },
  distanceText: { marginLeft: 'auto', fontSize: 13, color: '#666' },
  addressText: { fontSize: 14, color: '#333', marginBottom: 4 },
  phone: { fontSize: 13, color: '#666' },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0ff',
    padding: 6,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  alertText: { fontSize: 12, color: '#333', flex: 1 },
});