// app/checkout.tsx

import { dummyShops } from '@/constants/dummyData';
import { services } from '@/constants/servicesData';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CartItem = {
  id: string;
  name: string;
  price: string;
  originalPrice: string; // Needed for savings calculation
  quantity: number;
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart: cartString, shopName } = useLocalSearchParams<{
    cart: string;
    shopName: string;
  }>();

  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter services that are not already in cart to show as suggestions
  const availableServices = services.filter(service => 
    !cart.find(cartItem => cartItem.id === service.id)
  ).slice(0, 4); // Show max 4 suggestions

  // Function to navigate back to the current shop
  const handleAddMoreItems = () => {
    // Find the shop by name in dummyShops
    const currentShop = dummyShops.find(shop => shop.name === shopName);
    
    if (currentShop) {
      // Navigate to the specific shop page
      router.push({
        pathname: '/shop/[id]',
        params: { 
          id: currentShop.id,
          name: currentShop.name,
          location: currentShop.location,
          price: currentShop.price,
          rating: currentShop.rating.toString(),
          category: currentShop.category,
          image: currentShop.image
        }
      });
    } else {
      // Fallback to going back if shop not found
      router.back();
    }
  };

  // Load cart from AsyncStorage on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (shopName) {
          const cartKey = `cart_${shopName}`;
          const savedCart = await AsyncStorage.getItem(cartKey);
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          } else if (cartString) {
            // Fallback to URL parameter if no saved cart
            const initialCart = JSON.parse(cartString);
            setCart(initialCart);
            await AsyncStorage.setItem(cartKey, cartString);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to URL parameter
        if (cartString) {
          setCart(JSON.parse(cartString));
        }
      }
    };

    loadCart();
  }, [cartString, shopName]);

  // Save cart to AsyncStorage whenever cart changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (shopName) {
          const cartKey = `cart_${shopName}`;
          await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    if (cart.length > 0 && shopName) {
      saveCart();
    } else if (shopName) {
      // Clear AsyncStorage if cart is empty
      const cartKey = `cart_${shopName}`;
      AsyncStorage.removeItem(cartKey);
    }
  }, [cart, shopName]);

  const handleIncrement = (itemId: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (itemId: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleAddServiceItem = (service: typeof services[0]) => {
    const newItem: CartItem = {
      id: service.id,
      name: service.name,
      price: service.price,
      originalPrice: service.originalPrice,
      quantity: 1,
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === service.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === service.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, newItem];
    });
  };

  const clearCart = async () => {
    try {
      if (shopName) {
        const cartKey = `cart_${shopName}`;
        await AsyncStorage.removeItem(cartKey);
        setCart([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // --- Bill Calculation ---
  const { subTotal, totalSavings, serviceFee, taxes, grandTotal } = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => acc + parseInt(item.price, 10) * item.quantity, 0);
    const totalOriginalPrice = cart.reduce(
      (acc, item) => acc + parseInt(item.originalPrice, 10) * item.quantity,
      0
    );
    const totalSavings = totalOriginalPrice - subTotal;
    const serviceFee = 30; // Example service fee
    const taxes = subTotal * 0.05; // Example 5% tax
    const grandTotal = subTotal + serviceFee + taxes;
    return { subTotal, totalSavings, serviceFee, taxes, grandTotal };
  }, [cart]);

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{shopName}</Text>
          <Text style={styles.headerSubtitle}>Booking Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Order Summary Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Order</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemTop}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrement(item.id)}>
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncrement(item.id)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.orderItemBottom}>
                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>₹{parseInt(item.price, 10) * item.quantity}</Text>
                  <Text style={styles.originalPrice}>₹{parseInt(item.originalPrice, 10) * item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
          {/* Add more items link */}
          <TouchableOpacity style={styles.addMoreItemsContainer} onPress={handleAddMoreItems}>
            <Text style={styles.addMoreItemsText}>+ Add more items</Text>
          </TouchableOpacity>
          
          {/* Add note section */}
          <TouchableOpacity style={styles.addNoteContainer}>
            <Ionicons name="document-text-outline" size={20} color="#666" />
            <Text style={styles.addNoteText}>Add a note for the salon</Text>
          </TouchableOpacity>
        </View>

        {/* --- Complete your order with section --- */}
        {availableServices.length > 0 && (
          <View style={styles.card}>
            <View style={styles.completeOrderHeader}>
              <Ionicons name="grid-outline" size={20} color="#333" />
              <Text style={styles.completeOrderTitle}>Complete your order with</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.servicesScrollView}
              contentContainerStyle={styles.servicesScrollContent}
            >
              {availableServices.map((service, index) => {
                const isInCart = cart.find(item => item.id === service.id);
                
                return (
                  <View key={service.id} style={[styles.serviceCard, index > 0 && styles.serviceCardMargin]}>
                    <View style={styles.serviceImageContainer}>
                      <Image source={service.image} style={styles.serviceImage} />
                    </View>
                    
                    <View style={styles.serviceContent}>
                      <Text style={styles.serviceName} numberOfLines={2}>{service.name}</Text>
                      <View style={styles.servicePriceContainer}>
                        <Text style={styles.servicePrice}>₹{service.price}</Text>
                        {service.originalPrice !== service.price && (
                          <Text style={styles.serviceOriginalPrice}>₹{service.originalPrice}</Text>
                        )}
                      </View>
                      
                      <TouchableOpacity 
                        style={[styles.addButton, isInCart && styles.addButtonActive]}
                        onPress={() => handleAddServiceItem(service)}
                      >
                        <Text style={[styles.addButtonText, isInCart && styles.addButtonTextActive]}>
                          ADD {isInCart ? `(${isInCart.quantity})` : ''}
                        </Text>
                        <Ionicons 
                          name="add" 
                          size={16} 
                          color={isInCart ? "#8c52ff" : "#666"} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* --- Bill Details Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Item Total</Text>
            <Text style={styles.billText}>₹{subTotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.savingsText}>Total Savings</Text>
            <Text style={styles.savingsText}>- ₹{totalSavings}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Service Fee</Text>
            <Text style={styles.billText}>₹{serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Taxes and Charges</Text>
            <Text style={styles.billText}>₹{taxes.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalText}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* --- Appointment & Payment Placeholders --- */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.placeholderRow}>
            <Ionicons name="calendar-outline" size={22} color="#333" />
            <View style={styles.placeholderTextContainer}>
              <Text style={styles.placeholderTitle}>Appointment Slot</Text>
              <Text style={styles.placeholderSubtitle}>Select your preferred time</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.placeholderRow}>
            <Ionicons name="wallet-outline" size={22} color="#333" />
            <View style={styles.placeholderTextContainer}>
              <Text style={styles.placeholderTitle}>Payment</Text>
              <Text style={styles.placeholderSubtitle}>Choose payment method</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        
        {/* --- Cancellation Policy --- */}
        <View style={styles.policyContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.policyText}>
            100% cancellation fee will be applied if you cancel within 30 mins of the appointment.
          </Text>
        </View>
      </ScrollView>

      {/* --- Sticky Bottom Button --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton}>
          <View>
            <Text style={styles.confirmButtonPrice}>₹{grandTotal.toFixed(2)}</Text>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, color: '#666' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: { 
    fontSize: 14, 
    color: '#333', 
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#333' },
  // New order item styles
  orderItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  orderItemBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8c52ff',
    borderRadius: 6,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 14,
    color: '#8c52ff',
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addMoreItemsContainer: {
    paddingVertical: 16,
    marginTop: 8,
  },
  addMoreItemsText: {
    fontSize: 16,
    color: '#8c52ff',
    fontWeight: '600',
  },
  addNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addNoteText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billText: { fontSize: 14, color: '#555' },
  savingsText: { fontSize: 14, color: '#2E7D32' }, // Green for savings
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#8c52ff' },
  placeholderRow: { flexDirection: 'row', alignItems: 'center' },
  placeholderTextContainer: { flex: 1, marginLeft: 16 },
  placeholderTitle: { fontSize: 16, fontWeight: '600' },
  placeholderSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  policyText: { flex: 1, marginLeft: 8, color: '#666', fontSize: 12 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: '#8c52ff',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButtonPrice: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  confirmButtonText: { color: '#fff', fontSize: 12 },
  
  // Complete your order with styles
  completeOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  completeOrderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  servicesScrollView: {
    marginHorizontal: -16, // Extend to card edges
  },
  servicesScrollContent: {
    paddingHorizontal: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 160,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  serviceCardMargin: {
    marginLeft: 12,
  },
  serviceImageContainer: {
    position: 'relative',
    height: 100,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  servicePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginRight: 6,
  },
  serviceOriginalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonActive: {
    borderColor: '#8c52ff',
    backgroundColor: '#f8f4ff',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginRight: 4,
  },
  addButtonTextActive: {
    color: '#8c52ff',
  },
});