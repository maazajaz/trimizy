import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExtendedUser, useAuth } from '../auth.context';

const ProfileScreen = () => {
  const { user, skippedLogin } = useAuth() as { user: ExtendedUser | null; skippedLogin: boolean };
  const userName = user?.displayName || 'Guest';
  const router = useRouter();

  const handleBackPress = () => {
    router.push('/');
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const options = [
    { title: 'About', iconName: 'information-circle-outline', action: () => router.push('/about') },
    { title: 'Send feedback', iconName: 'create-outline', action: () => Alert.alert("Navigate to Feedback screen") },
    { title: 'Report a safety emergency', iconName: 'warning-outline', action: () => Alert.alert("Navigate to Emergency screen") },
    { title: 'Accessibility', iconName: 'body-outline', action: () => Alert.alert("Navigate to Accessibility screen") },
    { title: 'Settings', iconName: 'settings-outline', action: () => Alert.alert("Navigate to Settings screen") },
    { title: 'Log out', iconName: 'log-out-outline', action: handleLogout },
  ];

  if (skippedLogin) {
    return <Redirect href="/SkippedProfile" />;
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Icon name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <TouchableOpacity style={styles.activityButton}>
                <Text style={styles.activityLink}>View activity <Icon name="chevron-forward-outline" size={16} color="#8c52ff" style={{ marginTop: 2 }} /></Text>
                
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.membershipButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcon name="crown" size={20} color="#FFD700" />
              <Text style={styles.membershipText}>Renew your Gold Membership</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.moreHeader}>
            <View style={styles.redIndicator} />
            <Text style={styles.moreTitle}>More</Text>
          </View>
          {options.map((item, index) => (
            <TouchableOpacity key={item.title} style={styles.optionItem} onPress={item.action}>
              <View style={styles.optionLeft}>
                <Icon name={item.iconName} size={22} color="#4B5563" />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>Trimizy</Text>
          <Text style={styles.footerVersion}>v0.2(3)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityButton: {
    marginTop: 5,
  },
  activityLink: {
    fontSize: 14,
    color: '#8c52ff',
  },
  membershipButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  membershipText: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 10,
  },
  moreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  redIndicator: {
    width: 5,
    height: 20,
    backgroundColor: '#8c52ff',
    marginRight: 10,
  },
  moreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerVersion: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ProfileScreen;