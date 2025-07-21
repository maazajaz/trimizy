import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router'; // Import SplashScreen and Slot from expo-router
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react'; // Import useEffect
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../auth.context';

// Prevent the splash screen from auto-hiding immediately.
// This allows you to control when it hides, typically after all assets are loaded.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load fonts. The `loaded` state will be true once fonts are ready.
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add any other custom fonts your app uses here.
    // Example: 'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  // useEffect to hide the splash screen once fonts are loaded.
  // You can extend this to wait for other critical app resources (e.g., initial API calls, auth state)
  // before hiding the splash screen.
  useEffect(() => {
    if (loaded) {
      // Hide the splash screen once all necessary assets (like fonts) are loaded.
      SplashScreen.hideAsync();
    }
  }, [loaded]); // Dependency array ensures this effect runs when 'loaded' changes

  // If fonts are not yet loaded, return null to keep the splash screen visible.
  // The app content will only render once 'loaded' is true.
  if (!loaded) {
    return null;
  }

  // Once fonts are loaded, render the main app content.
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
        {/* StatusBar styling for the app content after splash screen hides */}
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
});
