import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const aboutOptions = [
    { 
      title: 'Terms of Service', 
      iconName: 'document-text-outline', 
      action: () => {
        // Navigate to Terms of Service screen or open web view
        console.log('Navigate to Terms of Service');
      }
    },
    { 
      title: 'Privacy Policy', 
      iconName: 'shield-checkmark-outline', 
      action: () => {
        router.push('/privacy-policy');
      }
    },
    { 
      title: 'Open Source Libraries', 
      iconName: 'library-outline', 
      action: () => {
        // Navigate to Open Source Libraries screen
        console.log('Navigate to Open Source Libraries');
      }
    },
    { 
      title: 'Licenses and Registrations', 
      iconName: 'document-outline', 
      action: () => {
        // Navigate to Licenses screen
        console.log('Navigate to Licenses and Registrations');
      }
    },
    { 
      title: 'Developer', 
      iconName: 'person-outline', 
      action: () => {
        router.push('/developer');
      }
    },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Icon name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* About Options */}
        <View style={styles.optionsContainer}>
          {aboutOptions.map((item, index) => (
            <TouchableOpacity 
              key={item.title} 
              style={[
                styles.optionItem,
                index === aboutOptions.length - 1 && styles.lastOptionItem
              ]} 
              onPress={item.action}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Information */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Trimizy</Text>
          <Text style={styles.appVersion}>Version 0.2(3)</Text>
          <Text style={styles.copyright}>© 2025 Trimizy. All rights reserved.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  scrollContentContainer: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  appInfoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8c52ff',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default AboutScreen;
