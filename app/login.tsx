import * as Google from 'expo-auth-session/providers/google';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import { useAuth } from '../auth.context';
import { auth, db, firebase, firebaseConfigExport } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setConfirm: setAuthConfirm } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const bannerHeight = useRef(new Animated.Value(300)).current;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: "http://localhost:8081", // Hardcoded redirect URI for development
  });

  useEffect(() => {
    const handleResponse = async () => {
      if (response) {
        setGoogleLoading(false);
        if (response.type === 'success') {
          const { id_token } = response.params;
          if (!id_token) {
            Alert.alert('Authentication Failed', 'Could not retrieve token from Google.');
            return;
          }
          const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
          try {
            const userCredential = await auth.signInWithCredential(credential);
            const firebaseUser = userCredential.user;
            if (!firebaseUser) {
              throw new Error('User not found after sign-in');
            }
            const userDocRef = db.collection('users').doc(firebaseUser.uid);
            const userDoc = await userDocRef.get();
            if (!userDoc.exists) {
              const userData = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                phone: firebaseUser.phoneNumber,
                createdAt: new Date().toISOString(),
              };
              await userDocRef.set(userData);
            }
            setUser(firebaseUser);
            router.replace('/');
          } catch (error) {
            console.error('Firebase sign-in error:', error);
            Alert.alert('Sign-In Failed', 'Could not sign in with Firebase.');
          }
        } else if (response.type === 'error') {
          console.error('Authentication Error:', response.error);
          Alert.alert('Authentication Failed', 'An error occurred during Google Sign-In.');
        } else if (response.type === 'cancel') {
          console.log('User cancelled Google Sign-In.');
        }
      }
    };
    handleResponse();
  }, [response]);

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
    router.replace('/(tabs)');
  };

  const sendOTP = async () => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      const fullPhoneNumber = `+${callingCode}${phone}`;
      console.log('Attempting to send OTP to:', fullPhoneNumber);

      if (!recaptchaVerifier.current) {
        console.error('recaptchaVerifier.current is null.');
        throw new Error('RecaptchaVerifier is not initialized');
      }
      
      console.log('RecaptchaVerifier ref is available. Calling signInWithPhoneNumber...');
      const confirmation = await firebase.auth().signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier.current);
      
      console.log('Phone number verified, confirmation result received.');
      setAuthConfirm(confirmation);
      router.push({
        pathname: '/OtpVerificationScreen',
        params: { phone: fullPhoneNumber },
      });
    } catch (err: any) {
      console.error('Detailed error sending OTP:', err);
      // Handle common errors
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        Alert.alert('Verification Cancelled', 'You cancelled the reCAPTCHA verification.');
      } else {
        Alert.alert('Error', `Failed to send OTP. ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    promptAsync();
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
          attemptInvisibleVerification={true} // Re-enable invisible verification
        />

        <Animated.View style={[styles.header, { height: bannerHeight }]}>
          <Image
            source={require('../assets/trimizy-banner.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {__DEV__ && (
            <TouchableOpacity style={styles.devSkipButton} onPress={handleDevLogin}>
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
            <TouchableOpacity onPress={handleGoogleSignIn} disabled={!request || googleLoading}>
              {googleLoading ? (
                <ActivityIndicator style={styles.icon} />
              ) : (
                <Image
                  source={require('../assets/google.png')}
                  style={styles.icon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../assets/apple.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../assets/email.png')} style={styles.icon} />
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