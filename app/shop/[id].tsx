import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;
const HEADER_CHANGE_THRESHOLD = windowHeight * 0.73 - 110 - 60 - 50;

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
};

type CartItem = Service & { quantity: number };

const BANNER_HEIGHT = 78;

export default function ShopDetail() {
  const { name, location, price, rating, image } = useLocalSearchParams();
  const navigation = useNavigation();

  const [isHeaderWhite, setIsHeaderWhite] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const slideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: cart.length > 0 ? 0 : 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [cart.length]);

  const services: Service[] = [
    {
      id: 'item1',
      name: 'Fade Cut',
      description: 'A stylish fade, from skin fade to taper. Clean and sharp.',
      price: '250',
      originalPrice: '300',
      image: 'https://placehold.co/120x120.png?text=Fade+Cut',
    },
    {
      id: 'item2',
      name: 'Beard Trim & Shape',
      description: 'Expert shaping and trimming to keep your beard looking its best.',
      price: '150',
      originalPrice: '200',
      image: 'https://placehold.co/120x120.png?text=Beard+Trim',
    },
    {
      id: 'item3',
      name: 'Head Massage (15 min)',
      description: 'A relaxing champi-style head massage to relieve stress.',
      price: '200',
      originalPrice: '250',
      image: 'https://placehold.co/120x120.png?text=Massage',
    },
    {
      id: 'item4',
      name: 'Classic "Army" Cut',
      description: 'A timeless, no-nonsense short haircut for a sharp look.',
      price: '180',
      originalPrice: '220',
      image: 'https://placehold.co/120x120.png?text=Army+Cut',
    },
    {
      id: 'item5',
      name: 'Royal Shave',
      description: 'A traditional hot towel shave for an exceptionally smooth finish.',
      price: '300',
      originalPrice: '350',
      image: 'https://placehold.co/120x120.png?text=Shave',
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > HEADER_CHANGE_THRESHOLD) {
      if (!isHeaderWhite) setIsHeaderWhite(true);
    } else {
      if (isHeaderWhite) setIsHeaderWhite(false);
    }
  };

  const handleAddItem = (itemToAdd: Service) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...itemToAdd, quantity: 1 }];
    });
  };

  const handleRemoveItem = (itemToRemove: Service) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemToRemove.id);
      if (existingItem) {
        if (existingItem.quantity === 1) {
          return prevCart.filter((item) => item.id !== itemToRemove.id);
        }
        return prevCart.map((item) =>
          item.id === itemToRemove.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart;
    });
  };

  const { totalItems, totalSavings } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const originalPrice = parseInt(item.originalPrice, 10);
        const currentPrice = parseInt(item.price, 10);
        acc.totalItems += item.quantity;
        acc.totalSavings += (originalPrice - currentPrice) * item.quantity;
        return acc;
      },
      { totalItems: 0, totalSavings: 0 }
    );
  }, [cart]);

  // This object now only contains the styles that are actually animated
  const animatedBannerStyle = {
    height: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [BANNER_HEIGHT, 0],
    }),
    opacity: slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  return (
    <View style={styles.fullScreenContent}>
      <View style={[styles.topBar, isHeaderWhite && styles.topBarWhite]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconButton, isHeaderWhite && { backgroundColor: 'transparent' }]}
        >
          <Ionicons name="arrow-back" size={24} color={isHeaderWhite ? '#000' : '#fff'} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[styles.iconButton, isHeaderWhite && { backgroundColor: 'transparent' }]}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={isHeaderWhite ? '#000' : '#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.mainImageContainer, { height: windowHeight * 0.73 }]}>
          <Image source={{ uri: image as string }} style={styles.mainImage} />
          <Text style={styles.imageTitle}>Veg Deluxe Thali &gt;</Text>
          <View style={styles.imageDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.activeDot]} />
            ))}
          </View>
        </View>

        <View style={styles.shopInfoCard}>
          <View style={styles.shopHeader}>
            <Text style={styles.shopName}>{name}</Text>
            <TouchableOpacity style={styles.infoIcon}>
              <View>
                <Ionicons name="information-circle-outline" size={18} color="#999" />
              </View>
            </TouchableOpacity>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{rating}</Text>
              <Text style={styles.forYouText}>For you</Text>
            </View>
          </View>
          <View style={styles.shopDetailsRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.shopDetailText}>{location}</Text>
            <Ionicons name="chevron-down" size={14} color="#666" style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.shopDetailsRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.shopDetailText}>30-35 mins &middot; Schedule for later</Text>
            <Ionicons name="chevron-down" size={14} color="#666" style={{ marginLeft: 4 }} />
          </View>
          <View style={styles.shopDetailsRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.shopDetailText}>Frequently reordered</Text>
          </View>
          <View style={styles.offersContainer}>
            <Ionicons name="pricetag" size={16} color="#007bff" />
            <Text style={styles.offerText}>Flat 50% OFF</Text>
            <Text style={styles.offerCount}>7 offers</Text>
            <Ionicons name="chevron-down" size={14} color="#007bff" style={{ marginLeft: 4 }} />
          </View>
        </View>

        <View style={styles.servicesListSection}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          {services.map((item) => {
            const itemInCart = cart.find((cartItem) => cartItem.id === item.id);
            const quantity = itemInCart ? itemInCart.quantity : 0;

            return (
              <View key={item.id} style={styles.serviceItem}>
                <View style={styles.serviceTextContent}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.servicePriceStriked}>&#8377;{item.originalPrice}</Text>
                    <Text style={styles.servicePrice}>Get for &#8377;{item.price}</Text>
                  </View>
                  <Text style={styles.serviceDescription}>{item.description}</Text>
                  <View style={styles.serviceActionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="bookmark-outline" size={20} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share-social-outline" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.serviceImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.serviceImage} />
                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={styles.addServiceButton}
                      onPress={() => handleAddItem(item)}
                    >
                      <Text style={styles.addServiceButtonText}>ADD</Text>
                      <Ionicons name="add" size={16} color="red" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.quantityStepper}>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item)}
                        style={styles.stepperButton}
                      >
                        <Ionicons name="remove" size={16} color="red" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => handleAddItem(item)}
                        style={styles.stepperButton}
                      >
                        <Ionicons name="add" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={styles.customisableText}>customisable</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.bottomSafeArea}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.bottomSearchBar}>
              <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.bottomSearchText}>Search...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="restaurant-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
          </View>

          {/* We now apply two styles: the static wrapper style and the dynamic animated style */}
          <Animated.View style={[styles.animatedBannerWrapper, animatedBannerStyle]}>
            <TouchableOpacity style={styles.cartBanner}>
              <View>
                <Text style={styles.cartBannerText}>
                  {totalItems} {totalItems > 1 ? 'items' : 'item'} added
                </Text>
                <Text style={styles.cartBannerSubText}>
                  FLAT 50% OFF applied! You are saving &#8377;{totalSavings}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContent: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 150,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    marginTop: 15,
    marginBottom: 40,
  },
  bottomSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  bottomSearchText: {
    fontSize: 16,
    color: '#666',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // This new style holds the static 'overflow' property
  animatedBannerWrapper: {
    overflow: 'hidden',
  },
  cartBanner: {
    height: BANNER_HEIGHT,
    backgroundColor: '#ef4444',
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartBannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartBannerSubText: {
    color: '#fff',
    fontSize: 12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'space-between',
  },
  topBarWhite: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  imageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  imageDots: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  shopInfoCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: -125,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  infoIcon: {
    padding: 4,
  },
  ratingContainer: {
    marginLeft: 'auto',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  forYouText: {
    fontSize: 10,
    color: '#66bb6a',
  },
  shopDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  shopDetailText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
  },
  offersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  offerText: {
    fontSize: 15,
    color: '#007bff',
    marginLeft: 8,
    flex: 1,
  },
  offerCount: {
    fontSize: 15,
    color: '#007bff',
    marginRight: 4,
  },
  servicesListSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  serviceTextContent: {
    flex: 1,
    paddingRight: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  servicePriceStriked: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 13,
    color: '#666',
  },
  serviceActionsContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffc8c9',
    borderRadius: 8,
    width: 100,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  addServiceButtonText: {
    color: 'red',
    fontWeight: '600',
    fontSize: 16,
  },
  customisableText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffc8c9',
    borderRadius: 8,
    width: 100,
    height: 38,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  stepperButton: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },
  quantityText: {
    color: 'red',
    fontWeight: '600',
    fontSize: 16,
  },
});