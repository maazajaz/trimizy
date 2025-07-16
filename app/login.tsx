import {
  FirebaseRecaptchaVerifierModal,
} from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import { useAuth } from '../auth.context';
import { auth, firebaseConfigExport } from '../firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setConfirm: setAuthConfirm } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const bannerHeight = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (event: KeyboardEvent) => {
      Animated.timing(bannerHeight, {
        toValue: 250,
        duration: event.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', (event: KeyboardEvent) => {
      Animated.timing(bannerHeight, {
        toValue: 300,
        duration: event.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleDevLogin = () => {
    const mockUser = {
      uid: 'dev-user-123',
      phoneNumber: `+${callingCode}1234567890`,
      displayName: 'Test User',
    } as User;
    setUser(mockUser);
    router.replace('/');
  };

  const sendOTP = async () => {
    Keyboard.dismiss();
    const fullPhone = `+${callingCode}${phone}`;
    if (!fullPhone.startsWith('+')) {
      Alert.alert('Error', 'Invalid phone format');
      return;
    }
    setLoading(true);
    
    if (true) {
        try {
            if (!recaptchaVerifier.current) {
                Alert.alert('Error', 'RecaptchaVerifier is not initialized.');
                setLoading(false);
                return;
            }
            
            console.log("Attempting to get reCAPTCHA token directly via verifier ref...");
            const recaptchaToken = await recaptchaVerifier.current.verify();

            if (!recaptchaToken) {
                Alert.alert("Verification Failed", "reCAPTCHA token could not be obtained.");
                setLoading(false);
                return;
            }
            console.log("reCAPTCHA token obtained:", recaptchaToken.substring(0, 10) + "...");

            console.log("Attempting signInWithPhoneNumber for:", fullPhone);
            const confirmation = await auth.signInWithPhoneNumber(
                fullPhone,
                recaptchaVerifier.current
            );
            console.log("signInWithPhoneNumber successful! Confirmation object:", confirmation);

            setAuthConfirm(confirmation);
            Alert.alert('OTP sent');
            router.push({ pathname: '/OtpVerificationScreen', params: { phone: fullPhone } });
        } catch (err: any) {
            console.error("Error sending OTP:", err);
            let errorMessage = 'Failed to send OTP.';
            if (err.code) {
                if (err.code === 'auth/missing-client-identifier') {
                    errorMessage = 'Firebase reCAPTCHA client identifier missing. Check your firebaseConfig or app.json scheme.';
                } else if (err.code === 'auth/web-storage-unsupported') {
                    errorMessage = 'Web storage unsupported. Check browser settings.';
                } else if (err.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Check internet connection.';
                } else if (err.code === 'auth/quota-exceeded') {
                    errorMessage = 'SMS quota exceeded. Try again later.';
                } else if (err.code === 'auth/app-not-authorized') {
                    errorMessage = 'App not authorized. Check authorized domains in Firebase.';
                } else if (err.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many requests. Try again later.';
                } else if (err.message && err.message.includes('reCAPTCHA')) {
                    errorMessage = 'reCAPTCHA verification failed or was canceled.';
                } else if (err.code === 'auth/invalid-phone-number') {
                    errorMessage = 'Invalid phone number format.';
                } else if (err.code === 'auth/invalid-verification-code') {
                    errorMessage = 'Invalid verification code. This should not happen at sendOTP stage.';
                } else if (err.code === 'auth/user-disabled') {
                    errorMessage = 'User account has been disabled.';
                } else if (err.code === 'auth/captcha-check-failed') {
                    errorMessage = 'reCAPTCHA check failed. Try again.';
                }
                errorMessage = `${errorMessage} (${err.code.replace('auth/', '')})`; 
            } else {
                errorMessage = err.message || 'An unknown error occurred.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }
  };

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const LineWithText = ({ text }: { text: string }) => (
    <View style={styles.lineWithTextContainer}>
      <View style={styles.line} />
      <Text style={styles.lineText}>{text}</Text>
      <View style={styles.line} />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: 0 }]}> 
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfigExport}
          title="Verify you are not a robot"
          cancelLabel="Close"
          attemptInvisibleVerification={false} 
        />

        <Animated.View style={[styles.header, { height: bannerHeight }]}>
          <Image
            source={require('../assets/trimizy-banner.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {__DEV__ && (
            <TouchableOpacity
              style={styles.devSkipButton}
              onPress={handleDevLogin}
            >
              <Text style={styles.devSkipText}>Skip Login</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Text style={styles.subtitle}>India’s #1 Barber Booking App</Text>
        <LineWithText text="Log in or sign up" />

        <View style={styles.card}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.countryCodeBox}>
              {Platform.OS !== 'web' && (
                <CountryPicker
                  withCallingCode
                  withFlag
                  withFilter
                  countryCode={countryCode}
                  onSelect={onSelectCountry}
                />
              )}
              <Text style={styles.callingCodeText}>+{callingCode}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.phoneInputSeparated}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={sendOTP}
            disabled={loading || phone.length < 7}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <LineWithText text="or" />

          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Image
                source={require('../assets/google.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../assets/apple.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../assets/email.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomCard}>
            <Text style={styles.bottomCardText}>
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f2f2f2',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 14,
    color: '#333',
  },
  card: {
    padding: 20,
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
  backgroundColor: '#8c52ff',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  shadowColor: '#8c52ff',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 5,
},
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  bottomCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomCardText: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  lineWithTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  lineText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 5,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  callingCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 6,
  },
  phoneInputSeparated: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    height: 48,
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