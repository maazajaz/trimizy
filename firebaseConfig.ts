// firebaseConfig.ts - native react-native-firebase migration
import auth from '@react-native-firebase/auth';

// Keep the environment variables object for developer diagnostics and web-based flows.
export const firebaseConfigExport = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Export the native auth module; use auth() to access the instance methods.
export { auth };

// In development builds, let phone auth bypass app verification so you can test without a visible reCAPTCHA.
// This does NOT send an SMS and should never be enabled in production builds.
if (__DEV__) {
  try {
    // Disable app verification for testing phone auth flows (native)
    // @ts-ignore - settings typing may not be present in every version
    auth().settings.appVerificationDisabledForTesting = true;
    console.log('[firebase-auth] appVerificationDisabledForTesting = true (DEV only)');
  } catch (e) {
    console.warn('[firebase-auth] Failed to set appVerificationDisabledForTesting:', e);
  }
}
