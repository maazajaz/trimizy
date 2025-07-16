import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddAddressScreen() {
  const router = useRouter();
  const [additionalDetails, setAdditionalDetails] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select delivery location</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* Placeholder for Map */}
      <View style={styles.mapPlaceholder}>
        <Text style={{ color: '#aaa' }}>🗺 Map view here</Text>
      </View>

      {/* Use current location */}
      <TouchableOpacity style={styles.useLocationBtn}>
        <Ionicons name="locate" size={18} color="#e63946" />
        <Text style={styles.useLocationText}>Use current location</Text>
      </TouchableOpacity>

      {/* Delivery details */}
      <View style={styles.deliveryDetails}>
        <Text style={styles.deliveryLabel}>Amrapali Zodiac, Sector 120, Noida, Uttar Pradesh</Text>
        <TextInput
          placeholder="E.g. Floor, Flat no., Tower"
          style={styles.detailsInput}
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  searchInput: { marginLeft: 8, fontSize: 16, flex: 1 },
  mapPlaceholder: {
    height: 240,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  useLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  useLocationText: { color: '#e63946', marginLeft: 6, fontWeight: '600' },
  deliveryDetails: { paddingHorizontal: 4, marginBottom: 20 },
  deliveryLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#e63946',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
