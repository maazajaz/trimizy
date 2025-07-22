// UserDetailsScreen.tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAuth } from '../auth.context';
import { auth, db } from '../firebaseConfig'; // ✅ Using compat version

export default function UserDetailsScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { uid, phone } = useLocalSearchParams<{ uid: string; phone: string }>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      console.log('🚀 Starting user save process...');
      console.log('📌 UID from params:', uid);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert(
          'Error',
          'User not authenticated. Please try logging in again.'
        );
        setLoading(false);
        return;
      }

      console.log('✅ Authenticated UID:', currentUser.uid);
      if (currentUser.uid !== uid) {
        console.warn(
          '⚠️ UID mismatch between route params and authenticated user.'
        );
      }

      const userData = {
        uid,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      };

      console.log('📤 Writing user data to Firestore:', userData);

      await db.collection('users').doc(uid).set(userData);
      console.log('✅ User details saved to Firestore.');

      setUser({
        uid,
        phoneNumber: phone,
        displayName: name,
        email: email,
      });

      router.replace('/');
    } catch (error: any) {
      // Log the entire error object to see all properties
      console.error('❌ Full error object:', JSON.stringify(error, null, 2));

      // Firebase errors often have a 'code' property
      const errorCode = error.code || 'unknown';
      const errorMessage = error.message || 'An unknown error occurred.';

      console.error(
        `❌ Error saving user details: [Code: ${errorCode}] ${errorMessage}`
      );
      Alert.alert(
        `Error [${errorCode}]`,
        `Could not save details: ${errorMessage}`
      );
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Let's get your account set up.</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[
            styles.button,
            (loading || !name.trim() || !email.trim()) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={loading || !name.trim() || !email.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#8c52ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});