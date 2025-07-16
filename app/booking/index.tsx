import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from 'expo-router'; // Add this import
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookingScreen = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);

  const availableTimes = ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM'];

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const confirmBooking = () => {
    setLoading(true);
    setTimeout(() => {
      Alert.alert('✅ Booking Confirmed', `Date: ${selectedDate.toDateString()} \nTime: ${selectedTime}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button - Same style as shop page */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#1f1f1f" />
      </TouchableOpacity>

      <Text style={styles.title}>📅 Book Your Slot</Text>

      <Text style={styles.label}>Select a Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Select a Time</Text>
      <View style={styles.timeContainer}>
        {availableTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              selectedTime === time && styles.selectedTimeButton,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, loading && { opacity: 0.7 }]} 
        onPress={confirmBooking}
        disabled={loading}
      >
        {loading ? (
          <Ionicons name="time" size={20} color="white" />
        ) : (
          <>
            <Ionicons name="calendar" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.confirmText}>Confirm Booking</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    position: 'relative', // Needed for absolute positioning
  },
  backButton: {
    position: 'absolute',
    top: 50, // Matches your shop page style
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50, // Added space for back button
  },
  // ... (keep all your existing styles below)
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTimeButton: {
    backgroundColor: '#1f1f1f',
  },
  timeText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#fff',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;