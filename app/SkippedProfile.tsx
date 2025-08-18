import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SkippedProfileScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.push('/');
  };

  // Icons updated to match the Zomato UI
  const options = [
    { title: 'About', iconName: 'information-circle-outline', action: () => router.push('/about') },
    { title: 'Send feedback', iconName: 'create-outline', action: () => Alert.alert("Navigate to Feedback screen") },
    { title: 'Report a safety emergency', iconName: 'alert-circle-outline', action: () => Alert.alert("Navigate to Emergency screen") },
    { title: 'Accessibility', iconName: 'star-outline', action: () => Alert.alert("Navigate to Accessibility screen") },
    { title: 'Settings', iconName: 'settings-outline', action: () => Alert.alert("Navigate to Settings screen") },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Icon name="arrow-back" size={28} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View>
          {/* Section 1: Login Prompt */}
          <View style={styles.sectionContainer}>
            <Text style={styles.guestTitle}>Log in or sign up to view your complete profile</Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>

          {/* Section 2: More Options */}
          <View style={styles.moreSectionContainer}>
            <View style={styles.moreHeader}>
              <View style={styles.redIndicator} />
              <Text style={styles.moreTitle}>More</Text>
            </View>
            {options.map((item) => (
              <TouchableOpacity key={item.title} style={styles.optionItem} onPress={item.action}>
                <View style={styles.optionLeft}>
                  <Icon name={item.iconName} size={24} color="#4B5563" />
                  <Text style={styles.optionText}>{item.title}</Text>
                </View>
                <Icon name="chevron-forward-outline" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer pushed to the bottom */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Trimizy</Text>
          <Text style={styles.footerVersion}>v0.0.2(3)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  moreSectionContainer: {
    paddingHorizontal: 16,
  },
  guestTitle: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8c52ff',
  },
  continueButtonText: {
    color: '#8c52ff',
    fontSize: 16,
    fontWeight: '600',
  },
  moreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  redIndicator: {
    width: 5,
    height: 24,
    backgroundColor: '#8c52ff',
    marginRight: 12,
    borderRadius: 2,
  },
  moreTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18, // Increased padding for more space
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1F2937',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerLogo: {
    fontSize: 32,
    fontWeight: '500',
    color: '#9CA3AF',
    fontStyle: 'italic', // Mimic Zomato's logo style
  },
  footerVersion: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default SkippedProfileScreen;