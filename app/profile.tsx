import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../auth.context';

// Define the type for section items, including an optional text style
interface SectionItem {
  label: string;
  onPress: () => void;
  textStyle?: TextStyle; // Optional style for the text
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const avatar = (user && 'photoURL' in user && user.photoURL) ? user.photoURL : require('../assets/trimizy-banner.png');

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f8' }}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Header Card with User Info */}
        <View style={styles.headerCard}>
          <Image source={typeof avatar === 'string' ? { uri: avatar } : avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user && 'displayName' in user && user.displayName ? String(user.displayName) : 'User Name'}</Text>
            <Text style={styles.userEmail}>{user && 'email' in user && user.email ? String(user.email) : (user && 'phoneNumber' in user && user.phoneNumber ? String(user.phoneNumber) : 'user@email.com')}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.activityLink}>View activity ▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sections */}
        <Section title="Appointments" items={[
          { label: 'Your orders', onPress: () => {} },
          { label: 'Address book', onPress: () => {} },
          { label: 'Online ordering help', onPress: () => {} },
        ]} />

        {/* Updated "More" section with Logout button */}
        <Section title="More" items={[
          { label: 'Settings', onPress: () => {} },
          { label: 'Send Feedback', onPress: () => {} },
          { label: 'Rate us on the Play Store', onPress: () => {} },
          { label: 'Logout', onPress: handleLogout, textStyle: styles.logoutText }, // Added Logout item
        ]} />
      </ScrollView>
    </View>
  );
}

function Section({ title, items }: { title: string; items: SectionItem[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, idx) => (
        <TouchableOpacity
            key={item.label}
            style={[styles.sectionItem, idx === items.length - 1 && styles.lastSectionItem]}
            onPress={item.onPress}
        >
          {/* Apply the custom text style if it exists */}
          <Text style={[styles.sectionItemText, item.textStyle]}>{item.label}</Text>
          <Text style={styles.sectionItemArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#f4f4f8',
        paddingBottom: 10,
        zIndex: 10,
      },
      iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
      },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 14,
        padding: 16,
        marginTop: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#eee',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    userEmail: {
        fontSize: 15,
        color: '#666',
        marginTop: 2,
    },
    activityLink: {
        color: '#8c52ff',
        marginTop: 6,
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 14,
        marginBottom: 0,
        paddingVertical: 8,
        elevation: 1,
        marginTop: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#222',
        marginVertical: 12,
        marginLeft: 18,
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    lastSectionItem: {
        borderBottomWidth: 0,
    },
    sectionItemText: {
        flex: 1,
        fontSize: 16,
        color: '#222',
    },
    // Style for the logout button text
    logoutText: {
        color: '#ff3b30', // iOS system red for destructive actions
        fontWeight: '600',
    },
    sectionItemArrow: {
        fontSize: 22,
        color: '#bbb',
        marginLeft: 8,
    },
});