import { categories, dummyShops } from '@/constants/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Redirect } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
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
  const { user, logout, selectedLocation } = useAuth(); // Destructure selectedLocation
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const animationRef = useRef<any>(null);
  const textInputRef = useRef<TextInput>(null);

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
      {/* Header */}
      <View style={styles.headerBar}>
        <View>
          <Link href="/location" asChild>
            <TouchableOpacity style={styles.locationDropdown}>
              {/* Dynamically display selected location type (Home/Work/Other) with emoji */}
              <Text style={styles.locationLabel}>
                {selectedLocation ? `📍 ${selectedLocation.addressType || 'Other'}` : 'Select Location'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#333" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </Link>
          {/* Display full address of selected location or a placeholder */}
          <Text 
            style={styles.locationFullAddress}
            numberOfLines={1} // Limit to 1 line
            ellipsizeMode="tail" // Add ellipses at the end if truncated
          >
            {/* Changed order: additionalDetails first, then fullAddress */}
            {selectedLocation 
              ? `${selectedLocation.additionalDetails ? `${selectedLocation.additionalDetails}, ` : ''}${selectedLocation.fullAddress}`
              : 'Tap to choose your address'}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileCircle} onPress={logout}>
          <Text style={styles.profileInitials}>M</Text>
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
                pointerEvents="none"
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

      {/* Shops */}
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.id}
        renderItem={renderShopItem}
        contentContainerStyle={styles.shopList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
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
    backgroundColor: '#eee',
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
    color: '#e63946',
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

});

