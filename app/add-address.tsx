import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SavedAddress, useAuth } from '../auth.context'; // Import useAuth and SavedAddress

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Create animatable components
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);


// --- START: CRITICAL CONSTANT DEFINITIONS ---
const INITIAL_MAP_HEIGHT = 400; // Original map height when keyboard is down
const SHRINK_MAP_HEIGHT = 150; // Desired smaller map height when keyboard is up

const USE_CURRENT_LOCATION_BUTTON_APPROX_HEIGHT = 50; // Approximate button height for calculation
const PIN_TOOLTIP_APPROX_HEIGHT = 40; // Estimated height of the tooltip for positioning

// Initial TOP positions (relative to the top of mapContainer)
const INITIAL_USE_CURRENT_LOCATION_BUTTON_TOP = INITIAL_MAP_HEIGHT - USE_CURRENT_LOCATION_BUTTON_APPROX_HEIGHT - 20; // 20px from bottom of large map
const INITIAL_PIN_TOOLTIP_TOP = (INITIAL_MAP_HEIGHT / 2) - (PIN_TOOLTIP_APPROX_HEIGHT / 2) - 60; // 60px above pin center on large map

// Shrinked TOP positions (relative to the top of SHRUNK mapContainer)
const SHRINK_USE_CURRENT_LOCATION_BUTTON_TOP = SHRINK_MAP_HEIGHT - USE_CURRENT_LOCATION_BUTTON_APPROX_HEIGHT - 10; // 10px from bottom of shrunk map
const SHRINK_PIN_TOOLTIP_TOP = (SHRINK_MAP_HEIGHT / 2) - (PIN_TOOLTIP_APPROX_HEIGHT / 2) - 60; // 60px above pin center on shrunk map

// Fine-tuning offset for bottom section animation to meet keyboard edge.
const TRANSLATE_Y_KEYBOARD_OFFSET_ADJUST = Platform.OS === 'ios' ? -300 : 0; // Fine-tune if needed
// --- END: CRITICAL CONSTANT DEFINITIONS ---


export default function AddAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addAddress } = useAuth(); // Destructure addAddress from useAuth

  const [initialRegion, setInitialRegion] = useState<any>(null);
  const [currentAddress, setCurrentAddress] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [receiverName, setReceiverName] = useState('Maaz Ajaz');
  const [receiverPhone, setReceiverPhone] = useState('7565848104');
  const [selectedAddressType, setSelectedAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [isExpanded, setIsExpanded] = useState(true); // Starts expanded as per screenshot
  // Removed showPinTooltip state as it's always rendered


  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null); 

  // Animated values
  const bottomSectionTranslateY = useRef(new Animated.Value(0)).current;
  const mapHeightAnim = useRef(new Animated.Value(INITIAL_MAP_HEIGHT)).current;
  const useCurrentLocationButtonTopAnim = useRef(new Animated.Value(INITIAL_USE_CURRENT_LOCATION_BUTTON_TOP)).current;
  const pinTooltipTopAnim = useRef(new Animated.Value(INITIAL_PIN_TOOLTIP_TOP)).current;
  
  const [scrollViewBottomPadding, setScrollViewBottomPadding] = useState(insets.bottom);


  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        const keyboardHeight = e.endCoordinates.height;

        const translateYValue = -(keyboardHeight - insets.bottom + TRANSLATE_Y_KEYBOARD_OFFSET_ADJUST);

        Animated.parallel([
          Animated.timing(bottomSectionTranslateY, {
            toValue: translateYValue,
            duration: e.duration || 250,
            useNativeDriver: true,
          }),
          Animated.timing(mapHeightAnim, {
            toValue: SHRINK_MAP_HEIGHT,
            duration: e.duration || 250,
            useNativeDriver: false,
          }),
          Animated.timing(useCurrentLocationButtonTopAnim, {
            toValue: SHRINK_USE_CURRENT_LOCATION_BUTTON_TOP,
            duration: e.duration || 250,
            useNativeDriver: false,
          }),
          Animated.timing(pinTooltipTopAnim, {
            toValue: SHRINK_PIN_TOOLTIP_TOP,
            duration: e.duration || 250,
            useNativeDriver: false,
          })
        ]).start();

        setScrollViewBottomPadding(keyboardHeight);
        
        if (Platform.OS === 'ios') {
          scrollViewRef.current?.setNativeProps({
            contentInset: { bottom: keyboardHeight + 20 },
            scrollIndicatorInsets: { bottom: keyboardHeight + 20 },
          });
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      hideEvent,
      (e: KeyboardEvent) => {
        Animated.parallel([
          Animated.timing(bottomSectionTranslateY, {
            toValue: 0,
            duration: e.duration || 250,
            useNativeDriver: true,
          }),
          Animated.timing(mapHeightAnim, {
            toValue: INITIAL_MAP_HEIGHT,
            duration: e.duration || 250,
            useNativeDriver: false,
          }),
          Animated.timing(useCurrentLocationButtonTopAnim, {
            toValue: INITIAL_USE_CURRENT_LOCATION_BUTTON_TOP,
            duration: e.duration || 250,
            useNativeDriver: false,
          }),
          Animated.timing(pinTooltipTopAnim, {
            toValue: INITIAL_PIN_TOOLTIP_TOP,
            duration: e.duration || 250,
            useNativeDriver: false,
          })
        ]).start();

        setScrollViewBottomPadding(insets.bottom);

        if (Platform.OS === 'ios') {
          scrollViewRef.current?.setNativeProps({
            contentInset: { bottom: 0 },
            scrollIndicatorInsets: { bottom: 0 },
          });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [insets.bottom, bottomSectionTranslateY, mapHeightAnim, useCurrentLocationButtonTopAnim, pinTooltipTopAnim]);


  const fetchCurrentLocation = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      setLoadingLocation(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = location.coords;
    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setLoadingLocation(false);
  };

  const geocodeLocation = async (latitude: number, longitude: number) => {
    setLoadingGeocode(true);
    try {
      const response = await axios.get(
        // Here's the change to use the environment variable
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}`
      );

      const results = response.data.results;
      if (!results || results.length === 0) {
        setCurrentAddress('Unable to fetch address');
        return;
      }

      const addressComponents = results[0].address_components;

      const getPart = (types: string[]) =>
        addressComponents.find((c: { types: string[] }) =>
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
      console.error('Error geocoding location:', error);
      setCurrentAddress('Error fetching address');
    } finally {
      setLoadingGeocode(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleMapRegionChangeComplete = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      if (camera.center) {
        geocodeLocation(camera.center.latitude, camera.center.longitude);
      }
    }
  };

  const handleSaveAddress = () => {
    // Validate required fields
    if (!currentAddress || currentAddress === 'Fetching location...' || currentAddress === 'Unable to fetch address' || currentAddress === 'Error fetching address') {
      Alert.alert('Address Required', 'Please select a valid address on the map.');
      return;
    }
    if (!additionalDetails && isExpanded) { // If expanded, additional details might be mandatory
        Alert.alert('Additional Details Required', 'Please provide additional address details (e.g., Flat no., Floor).');
        return;
    }
    if (!receiverName || !receiverPhone && isExpanded) { // If expanded, receiver details might be mandatory
        Alert.alert('Receiver Details Required', 'Please provide receiver name and phone number.');
        return;
    }

    // Capture location coordinates for saving
    const latitude = initialRegion?.latitude || 0;
    const longitude = initialRegion?.longitude || 0;

    const newAddress: SavedAddress = {
      id: Date.now().toString(), // Simple unique ID for now
      fullAddress: currentAddress,
      additionalDetails: additionalDetails || undefined, // Use undefined if empty
      receiverName: receiverName || undefined,
      receiverPhone: receiverPhone || undefined,
      addressType: selectedAddressType,
      latitude: latitude,
      longitude: longitude,
    };

    addAddress(newAddress); // Save address using context function
    Alert.alert('Address Saved!', 'Your address has been saved successfully.');
    router.back(); // Navigate back after saving
  };

  if (loadingLocation) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Getting your current location...</Text>
      </View>
    );
  }

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
          editable={false}
        />
      </View>

      {/* Main ScrollView now handles all content below header/search */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingBottom: scrollViewBottomPadding }}
      >
        {/* Animated Map Container with Centered Pin */}
        <Animated.View style={[styles.mapContainer, { height: mapHeightAnim }]}>
          {initialRegion && (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={initialRegion}
              onRegionChangeComplete={handleMapRegionChangeComplete}
            />
          )}
          {/* Centered Pin Image */}
          <Image
            source={require('../assets/map-pin.png')}
            style={styles.centeredPin}
            resizeMode="contain"
          />

          {/* "Move pin" tooltip - Now AnimatedView and always rendered */}
          <AnimatedView
            style={[
              styles.pinTooltip,
              { top: pinTooltipTopAnim } // Animate its top position
            ]}
          >
            <Text style={styles.pinTooltipText}>Move pin to your exact delivery location</Text>
          </AnimatedView>
        </Animated.View>

        {/* Animated Use current location button over the map */}
        <AnimatedTouchableOpacity
          style={[
            styles.useCurrentLocationButton,
            { top: useCurrentLocationButtonTopAnim }
          ]}
          onPress={fetchCurrentLocation}
        >
          <Ionicons name="compass-outline" size={20} color="#e63946" />
          <Text style={styles.useCurrentLocationText}>Use current location</Text>
        </AnimatedTouchableOpacity>

        {/* Animated Bottom Section */}
        <Animated.View
          style={[
            styles.bottomSection,
            { transform: [{ translateY: bottomSectionTranslateY }] },
          ]}
        >
            {/* Delivery details section */}
            <Text style={styles.sectionHeading}>Delivery Details</Text>
            <TouchableOpacity style={styles.deliveryAddressRow} onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsExpanded(!isExpanded);
            }}>
                <Ionicons name="location-sharp" size={20} color="#e63946" />
                {loadingGeocode ? (
                <ActivityIndicator size="small" color="#e63946" style={{ marginLeft: 10 }} />
                ) : (
                <Text style={styles.deliveryAddressText}>{currentAddress}</Text>
                )}
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-forward"} size={20} color="#999" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <View style={styles.additionalDetailsInputContainer}>
                <TextInput
                placeholder="Additional address details*"
                placeholderTextColor="#999"
                style={styles.additionalDetailsInput}
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
                multiline
                maxLength={150}
                />
                <Text style={styles.inputHintText}>E.g. Floor, Flat no., Tower</Text>
            </View>

            {/* Expanded Content - conditionally rendered */}
            {isExpanded && (
                <>
                    {/* Receiver details for this address */}
                    <TouchableOpacity style={styles.receiverDetailsRow}>
                        <Ionicons name="call-outline" size={20} color="#e63946" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.receiverText}>Receiver details for this address</Text>
                          <Text style={styles.receiverContact}>{receiverName}, {receiverPhone}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    {/* Save address as */}
                    <Text style={styles.saveAddressAsLabel}>Save address as</Text>
                    <View style={styles.addressTypeContainer}>
                        {/* Iterating through array for address type buttons */}
                        {['Home', 'Work', 'Other'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                                styles.addressTypeButton,
                                selectedAddressType === type && styles.selectedAddressTypeButton
                            ]}
                            onPress={() => setSelectedAddressType(type as any)}
                          >
                            <Ionicons
                              name={
                                type === 'Home'
                                  ? 'home-outline'
                                  : type === 'Work'
                                  ? 'briefcase-outline'
                                  : 'bookmark-outline'
                              }
                              size={20}
                              color={selectedAddressType === type ? '#e63946' : '#555'}
                            />
                            <Text
                              style={[
                                styles.addressTypeButtonText,
                                selectedAddressType === type && styles.selectedAddressTypeButtonText
                              ]}
                            >
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {/* Save Button - now a direct child of Animated.View */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
                <Text style={styles.saveText}>Save address</Text>
            </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centeredPin: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: '50%',
    left: '50%',
    marginTop: -40, // Adjust this based on your pin's actual anchor point
    marginLeft: -20,
    zIndex: 2,
  },
  useCurrentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e63946',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  useCurrentLocationText: {
    color: '#e63946',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  pinTooltip: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -100 }], // Centered horizontally
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 4,
    width: 200, // Fixed width
    alignItems: 'center',
  },
  pinTooltipText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // This creates the initial overlap with the map
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deliveryAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  deliveryAddressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  additionalDetailsInputContainer: {
    marginBottom: 20,
  },
  additionalDetailsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  inputHintText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    marginLeft: 5,
  },
  receiverDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  receiverText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  receiverContact: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  saveAddressAsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  selectedAddressTypeButton: {
    borderColor: '#e63946',
    backgroundColor: '#ffe8e8',
  },
  addressTypeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  selectedAddressTypeButtonText: {
    color: '#e63946',
  },
  saveButton: {
    backgroundColor: '#e63946',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});