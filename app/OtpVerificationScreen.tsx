import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../auth.context';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { setUser, confirm } = useAuth(); // Destructure confirm from useAuth
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- START DEBUG LOG ---
  console.log("OtpVerificationScreen rendered. Initial confirm object:", confirm);
  // --- END DEBUG LOG ---


  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleVerify = async () => {
    Keyboard.dismiss();
    setLoading(true);

    // --- START DEBUG LOG ---
    console.log("handleVerify called. OTP:", otp, "Confirm object BEFORE verification:", confirm);
    // --- END DEBUG LOG ---

    // Modified __DEV__ logic to allow both mock and real OTP in dev mode
    if (__DEV__ && otp === '123456') { // If in DEV and mock OTP is entered, use mock user
        const mockUser = {
          uid: 'dev-user-123',
          phoneNumber: phone,
          displayName: 'Test User',
        };
        setUser(mockUser);
        router.replace('/');
        setLoading(false);
        return;
    }

    try {
      if (!confirm || typeof confirm.confirm !== 'function') {
        console.error('Confirmation object is missing or invalid:', confirm);
        Alert.alert('Error', 'Confirmation object not found. Please try logging in again.');
        setLoading(false);
        return;
      }

      const result = await confirm.confirm(otp);
      if (!result || !result.user) {
        throw new Error('No user returned from confirmation.');
      }
      setUser(result.user);
      router.replace('/');
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      Alert.alert('Invalid OTP', err?.message || 'The verification code entered is invalid.');
    } finally {
      setLoading(false);
    }
  };

  // Removed handleSkipLogin as it's redundant with the dev login in login.tsx

  return (
    <View style={styles.container}>
      {/* Keeping __DEV__ skip button if it exists in parent, but this component's skip button is removed */}
      {/* Removed: __DEV__ && (
        <TouchableOpacity style={styles.devSkipButton} onPress={handleSkipLogin}>
          <Text style={styles.devSkipText}>Skip Login</Text>
        </TouchableOpacity>
      ) */}

      <Text style={styles.heading}>OTP Verification</Text>
      <Text style={styles.subheading}>
        We have sent a verification code to {phone}
      </Text>

      <View style={styles.otpBox}>
        {Array(6)
          .fill(0)
          .map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.inputBox,
                otp.length === idx && styles.activeInputBox,
              ]}
            >
              <Text style={styles.inputDigit}>{otp[idx] || ''}</Text>
            </View>
          ))}
      </View>

      <TextInput
        style={styles.hiddenInput}
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        autoFocus
        onBlur={Keyboard.dismiss}
      />

      <Text style={styles.resendText}>
        Didn’t get the OTP? Resend SMS in {countdown}s
      </Text>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          (!otp?.length || otp.length < 6 || loading) && styles.disabledButton,
        ]}
        onPress={handleVerify}
        disabled={!otp || otp.length < 6 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.goBackText}>Go back to sign-in options</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 150,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    color: '#444',
  },
  otpBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 44,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeInputBox: {
    borderColor: '#8c52ff',
  },
  inputDigit: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  resendText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#8c52ff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  goBackText: {
    textAlign: 'center',
    color: '#8c52ff',
    fontSize: 14,
    fontWeight: '500',
  },
  devSkipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  devSkipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});