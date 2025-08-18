import { categories, dummyShops } from '@/constants/dummyData';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Link, Redirect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../auth.context'; // Correct path to useAuth

const placeholderTexts = ['"barber"', '"saloon"', '"massage"'];

export default function HomeScreen() {
  const { user, logout, selectedLocation, skippedLogin } = useAuth(); // Add skippedLogin
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartData, setCartData] = useState<{shopName: string, itemCount: number}[]>([]);
  const animationRef = useRef<any>(null);
  const textInputRef = useRef<TextInput>(null);

  // Function to get user initial
  const getUserInitial = () => {
    if (skippedLogin) {
      return 'T'; // T for Trimizy when login is skipped
    }
    
    // Try displayName first
    const displayName = (user as any)?.displayName;
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    
    // Try email as fallback
    const email = (user as any)?.email;
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U'; // Default fallback for User
  };

  // Check for existing cart items from all shops
  useEffect(() => {
    const checkForExistingCart = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const cartKeys = keys.filter(key => key.startsWith('cart_'));
        const allCarts: {shopName: string, itemCount: number}[] = [];
        
        for (const cartKey of cartKeys) {
          const cartDataStr = await AsyncStorage.getItem(cartKey);
          if (cartDataStr) {
            const cartItems = JSON.parse(cartDataStr);
            if (cartItems.length > 0) {
              const shopName = cartKey.replace('cart_', '');
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
              allCarts.push({ shopName, itemCount: totalItems });
            }
          }
        }
        
        setCartData(allCarts);
      } catch (error) {
        console.error('Error checking cart:', error);
      }
    };

    checkForExistingCart();
    
    // Also check periodically for cart changes
    const interval = setInterval(checkForExistingCart, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationRef.current && !searchQuery) {
        animationRef.current.animate({
          0: { 
            opacity: 1,
            translateY: 0 
          },
          1: { 
            opacity: 0,
            translateY: -10 
          },
          3: { 
            opacity: 0, 
            translateY: -20
          }
        }, 800).then(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
          animationRef.current.animate({
            0: { 
              opacity: 0, 
              translateY: 20
            },
            1: { 
              opacity: 1,
              translateY: 0
            }
          }, 100);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [searchQuery]);

  const navigateToProfile = () => {
    router.push('/profile');
  };

  if (!user) return <Redirect href="/login" />;

  const filteredShops = selectedCategory
    ? dummyShops.filter((shop) => shop.category === selectedCategory)
    : dummyShops;

  const renderCategoryButton = ({ label, emoji }: { label: string; emoji: string }) => (
    <TouchableOpacity
      key={label}
      style={[
        styles.categoryButton,
        (selectedCategory === label || (label === 'All' && !selectedCategory)) && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(label === 'All' ? null : label)}
    >
      <Text
        style={[
          styles.categoryText,
          (selectedCategory === label || (label === 'All' && !selectedCategory)) && styles.categoryTextActive,
        ]}
      >
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );

  const renderShopItem = ({ item }: { item: any }) => (
  <Animatable.View animation="fadeInUp" duration={600} delay={Number(item.id) * 100}>
    <Link
      href={{
        pathname: '/shop/[id]',
        params: { ...item, rating: item.rating.toString() },
      }}
      asChild
    >
      <TouchableOpacity style={styles.zCard} activeOpacity={0.85}>
        <View>
          <Image
            source={{ uri: item.image }}
            style={styles.zImage}
            contentFit="cover"
            transition={300}
          />

          <View style={styles.zOverlayLabel}>
            <Text style={styles.zOverlayText}>{item.category} · {item.price}</Text>
          </View>
        </View>

        <View style={styles.zContent}>
          {/* Optional Tag */}
          <Text style={styles.zTag}>⭐ Popular for {item.tag || item.category.toLowerCase()}</Text>

          {/* Shop Name */}
          <View style={styles.zRow}>
            <Text style={styles.zTitle}>{item.name}</Text>
            <View style={styles.zRatingBox}>
              <Text style={styles.zRatingText}>{item.rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* Subtext */}
          <Text style={styles.zSubText}>25–35 mins · 4.7 km · Free 🚚</Text>

          {/* Offer */}
          <Text style={styles.zOffer}>🎉 Flat 20% OFF above ₹500</Text>
        </View>
      </TouchableOpacity>
    </Link>
  </Animatable.View>
);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, cartData && cartData.length > 0 && { paddingBottom: 120 }]}
      >
        {/* Header */}
        <View style={styles.headerBar}>
          <View>
            <Link href="/location" asChild>
              <TouchableOpacity style={styles.locationDropdown}>
                {/* Display location type/area as the main label */}
                <Text style={styles.locationLabel}>
                  📍{selectedLocation?.additionalDetails || selectedLocation?.addressType || 'Select Location'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#333" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </Link>
            {/* Display full address or a placeholder */}
            <Text 
              style={styles.locationFullAddress}
              numberOfLines={1} // Limit to 1 line
              ellipsizeMode="tail" // Add ellipses at the end if truncated
            >
              {selectedLocation 
                ? selectedLocation.fullAddress
                : 'Tap to choose your address'}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileCircle} onPress={() => router.push('/profile')}>
            <Text style={styles.profileInitials}>{getUserInitial()}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.searchContainer}
          onPress={() => textInputRef.current?.focus()}
        >
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <View style={styles.inputContainer}>
              <TextInput
                ref={textInputRef}
                style={styles.searchInput}
                placeholder="search"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {!searchQuery && (
                <Animatable.Text
                  ref={animationRef}
                  style={styles.placeholderText}
                  numberOfLines={1}
                >
                  {placeholderTexts[placeholderIndex]}
                </Animatable.Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categoryContainer}>
            {categories.map(renderCategoryButton)}
          </View>
        </ScrollView>

        {/* Recommended Section */}
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>RECOMMENDED FOR YOU</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recommendedScroll}
            contentContainerStyle={styles.recommendedContent}
            nestedScrollEnabled={true}
          >
            {/* Create columns of 2 items each */}
            {Array.from({ length: Math.ceil(dummyShops.slice(0, 6).length / 2) }, (_, columnIndex) => (
              <View key={columnIndex} style={[styles.recommendedColumn, columnIndex > 0 && styles.recommendedColumnMargin]}>
                {dummyShops.slice(0, 6).slice(columnIndex * 2, columnIndex * 2 + 2).map((shop, rowIndex) => {
                  const globalIndex = columnIndex * 2 + rowIndex;
                  return (
                    <TouchableOpacity 
                      key={shop.id}
                      style={[styles.recommendedCard, rowIndex > 0 && styles.recommendedCardVerticalMargin]}
                      activeOpacity={0.9}
                      onPress={() => {
                        router.push({
                          pathname: '/shop/[id]',
                          params: { ...shop, rating: shop.rating.toString() },
                        });
                      }}
                    >
                      <View style={styles.recommendedImageContainer}>
                        <Image
                          source={{ uri: shop.image }}
                          style={styles.recommendedImage}
                          contentFit="cover"
                        />
                        <View style={styles.recommendedRatingBadge}>
                          <Text style={styles.recommendedRatingText}>{shop.rating.toFixed(1)} ★</Text>
                        </View>
                        {globalIndex < 3 && (
                          <View style={styles.offerBadge}>
                            <Text style={styles.offerText}>FLAT 50% OFF</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.recommendedInfo}>
                        <Text style={styles.recommendedShopName} numberOfLines={1}>{shop.name}</Text>
                        <View style={styles.recommendedMeta}>
                          <Ionicons name="time-outline" size={12} color="#666" />
                          <Text style={styles.recommendedTime}>25-30 mins</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Barbers Nearby Section */}
        <View style={styles.nearbySection}>
          <Text style={styles.nearbyTitle}>BARBERS NEARBY YOU</Text>
        </View>

        {/* Shops */}
        <View style={styles.shopsContainer}>
          {filteredShops.map((item, index) => (
            <Animatable.View key={item.id} animation="fadeInUp" duration={600} delay={index * 100}>
              <Link
                href={{
                  pathname: '/shop/[id]',
                  params: { ...item, rating: item.rating.toString() },
                }}
                asChild
              >
                <TouchableOpacity style={styles.zCard} activeOpacity={0.85}>
                  <View>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.zImage}
                      contentFit="cover"
                      transition={300}
                    />

                    <View style={styles.zOverlayLabel}>
                      <Text style={styles.zOverlayText}>{item.category} · {item.price}</Text>
                    </View>
                  </View>

                  <View style={styles.zContent}>
                    {/* Optional Tag */}
                    <Text style={styles.zTag}>⭐ Popular for {item.category.toLowerCase()}</Text>

                    {/* Shop Name */}
                    <View style={styles.zRow}>
                      <Text style={styles.zTitle}>{item.name}</Text>
                      <View style={styles.zRatingBox}>
                        <Text style={styles.zRatingText}>{item.rating.toFixed(1)}</Text>
                      </View>
                    </View>

                    {/* Subtext */}
                    <Text style={styles.zSubText}>25–35 mins · 4.7 km · Free 🚚</Text>

                    {/* Offer */}
                    <Text style={styles.zOffer}>🎉 Flat 20% OFF above ₹500</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart - Multiple Carts with Horizontal Scroll */}
      {cartData && cartData.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.floatingCartContainer}
          contentContainerStyle={styles.floatingCartContent}
        >
          {cartData.map((cart, index) => (
            <View key={cart.shopName} style={[styles.floatingCart, index > 0 && styles.floatingCartMargin]}>
              <TouchableOpacity 
                style={styles.cartLeft}
                onPress={() => {
                  // Navigate to the shop that has items in cart
                  const shop = dummyShops.find(s => s.name === cart.shopName);
                  if (shop) {
                    router.push({
                      pathname: '/shop/[id]',
                      params: {
                        id: shop.id,
                        name: shop.name,
                        location: shop.location,
                        price: shop.price,
                        rating: shop.rating,
                        image: shop.image,
                      },
                    });
                  }
                }}
              >
                <View style={styles.cartShopInfo}>
                  <Text style={styles.cartShopName}>{cart.shopName}</Text>
                  <Text style={styles.cartViewMenu}>View Menu ›</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cartRight}
                onPress={async () => {
                  // Navigate to checkout with current cart
                  try {
                    const cartKey = `cart_${cart.shopName}`;
                    const cartDataStr = await AsyncStorage.getItem(cartKey);
                    if (cartDataStr) {
                      router.push({
                        pathname: '/checkout',
                        params: {
                          cart: cartDataStr,
                          shopName: cart.shopName,
                        },
                      });
                    }
                  } catch (error) {
                    console.error('Error navigating to checkout:', error);
                  }
                }}
              >
                <Text style={styles.cartButtonText}>View Cart</Text>
                <Text style={styles.cartItemCount}>{cart.itemCount} item{cart.itemCount > 1 ? 's' : ''}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffffff1',
  },
  mainScrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: { // This style is now for "📍 Home", "📍 Work", etc.
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  locationName: { // This style is now for the full address, with truncation
    fontSize: 13,
    color: '#888',
  },
  locationDropdown: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},

locationTypeText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#222',
},

locationFullAddress: {
  fontSize: 13,
  color: '#666',
  maxWidth: '90%',
},

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c7c7c7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    
  },
  searchIcon: {
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8c52ff',
    position: 'absolute',
    left: 0,
    marginTop: 1.5,
    paddingLeft: 48,
    overflow: 'hidden',
    maxWidth: '100%',
    
  },
  categoriesScroll: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
    maxHeight: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingLeft: 4,
  },
  categoryButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    maxWidth: 140,
    alignSelf: 'flex-start',
  },
  categoryButtonActive: {
    backgroundColor: '#8c52ff',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
  },
  categoryTextActive: {
    color: '#fff',
  },
  shopList: {
    paddingBottom: 30,
  },
  shopsContainer: {
    paddingBottom: 30,
  },
  shopCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  shopImage: {
    width: 100,
    height: 100,
  },
  shopContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  shopMeta: {
    fontSize: 14,
    color: '#666',
  },
  shopPrice: {
    fontSize: 14,
    color: '#8c52ff',
    marginTop: 2,
  },
  shopRating: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  // Zomato-style card
zCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  marginBottom: 20,
  overflow: 'hidden',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
zImage: {
  width: '100%',
  height: 180,
  
},
zOverlayLabel: {
  position: 'absolute',
  bottom: 8,
  left: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
},
zOverlayText: {
  color: '#fff',
  fontSize: 13,
  fontWeight: '500',
},
zContent: {
  padding: 12,
},
zTag: {
  fontSize: 13,
  color: '#f77f00',
  marginBottom: 4,
},
zRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
zTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#222',
  flex: 1,
  marginRight: 8,
},
zRatingBox: {
  backgroundColor: '#38b000',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
},
zRatingText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 13,
},
zSubText: {
  fontSize: 13,
  color: '#666',
  marginTop: 4,
},
zOffer: {
  fontSize: 13,
  color: '#0055ff',
  fontWeight: '500',
  marginTop: 4,
},
floatingCartContainer: {
  position: 'absolute',
  bottom: 100, // Above the tab bar
  left: 0,
  right: 0,
  height: 80,
  zIndex: 1000,
},
floatingCartContent: {
  paddingHorizontal: 16,
},
floatingCart: {
  backgroundColor: '#ccb4faff',
  borderRadius: 12,
  flexDirection: 'row',
  elevation: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  overflow: 'hidden',
  minWidth: 300, // Minimum width for each cart card
  height: 70,
},
floatingCartMargin: {
  marginLeft: 12, // Space between multiple cart cards
},
cartLeft: {
  flex: 1,
  padding: 16,
  justifyContent: 'center',
},
cartShopInfo: {
  flex: 1,
},
cartShopName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 2,
},
cartViewMenu: {
  fontSize: 14,
  color: '#666',
},
cartRight: {
  backgroundColor: '#8c52ff',
  paddingHorizontal: 20,
  paddingVertical: 16,
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 120,
},
cartButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#fff',
  marginBottom: 2,
},
cartItemCount: {
  fontSize: 12,
  color: '#fff',
  opacity: 0.9,
},

// Recommended Section Styles
recommendedSection: {
  marginTop: 16,
  marginBottom: 20,
},
recommendedTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#888',
  marginBottom: 12,
  letterSpacing: 0.5,
  paddingLeft: 4,
},
recommendedScroll: {
  marginLeft: -4,
},
recommendedContent: {
  paddingLeft: 4,
  paddingRight: 20,
},
recommendedColumn: {
  flexDirection: 'column',
},
recommendedColumnMargin: {
  marginLeft: 12,
},
recommendedCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  width: 160,
  overflow: 'hidden',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
recommendedCardMargin: {
  marginLeft: 12,
},
recommendedCardVerticalMargin: {
  marginTop: 8,
},
recommendedImageContainer: {
  position: 'relative',
  width: '100%',
  height: 100,
},
recommendedImage: {
  width: '100%',
  height: '100%',
},
recommendedRatingBadge: {
  position: 'absolute',
  top: 6,
  left: 6,
  backgroundColor: '#38b000',
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 4,
},
recommendedRatingText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '600',
},
offerBadge: {
  position: 'absolute',
  bottom: 6,
  left: 6,
  backgroundColor: '#8c52ff',
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 4,
},
offerText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: '600',
},
recommendedInfo: {
  padding: 8,
},
recommendedShopName: {
  fontSize: 13,
  fontWeight: '600',
  color: '#222',
  marginBottom: 4,
},
recommendedMeta: {
  flexDirection: 'row',
  alignItems: 'center',
},
recommendedTime: {
  fontSize: 11,
  color: '#666',
  marginLeft: 4,
},

// Nearby Section Styles
nearbySection: {
  marginTop: 8,
  marginBottom: 16,
},
nearbyTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#888',
  letterSpacing: 0.5,
  paddingLeft: 4,
},

});

