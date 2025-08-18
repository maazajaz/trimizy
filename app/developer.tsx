import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DeveloperScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:maazajaz1234@gmail.com');
  };

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/maazajaz');
  };

  const handleLinkedInPress = () => {
    // Add your LinkedIn URL here
    Linking.openURL('https://linkedin.com/in/maazajaz');
  };
  const handlePortfolioPress = () => {
    // Add your portfolio URL here
    Linking.openURL('https://maazajaz.com');
  };

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
        <Text style={styles.headerTitle}>Developer</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* Developer Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/profile-photo.jpg')} 
              style={styles.avatarImage}
            />
          </View>
          
          <Text style={styles.developerName}>Maaz Ajaz</Text>
          <Text style={styles.developerTitle}>Software Engineer</Text>
          <Text style={styles.location}>Karnataka, India</Text>
        </View>

        {/* About Developer Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>
            I’m Maaz Ajaz, a Computer Science graduate with a CGPA of 9.4 from Sharda University, where I earned a merit scholarship. I’ve built projects in AI, IoT, AR, and full-stack development, many of which have won prizes at hackathons and competitions across India. My work ranges from AI-powered crop disease detection and smart cattle health monitoring to an inventory management system I developed during my internship.
          </Text>
          <Text style={styles.aboutText}>
           I’m currently working on Trimizy, a Zomato-style platform for local barbershops, and Socialens, a social media platform built with Node.js, React Native, and TypeScript. Beyond coding, I’ve actively taken part in debates, volunteering, and research publications, with multiple papers co-authored and presented.
          </Text>
        </View>

        {/* Skills Section */}
        <View style={styles.skillsSection}>
          <Text style={styles.sectionTitle}>Skills & Technologies</Text>
          <View style={styles.skillsContainer}>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>React Native</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>TypeScript</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>JavaScript</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Expo</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Firebase</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Mobile UI/UX</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <Icon name="mail-outline" size={24} color="#8c52ff" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>maazajaz1234@gmail.com</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleGitHubPress}>
            <Icon name="logo-github" size={24} color="#8c52ff" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>GitHub</Text>
              <Text style={styles.contactValue}>github.com/maazajaz</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleLinkedInPress}>
            <Icon name="logo-linkedin" size={24} color="#8c52ff" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>LinkedIn</Text>
              <Text style={styles.contactValue}>Connect with me</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handlePortfolioPress}>
            <Icon name="globe-outline" size={24} color="#8c52ff" />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Portfolio</Text>
              <Text style={styles.contactValue}>check my profile</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>Made with ❤️ for Trimizy users</Text>
          <Text style={styles.appInfoSubtext}>Thank you for using the app!</Text>
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
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8c52ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  developerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  developerTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  aboutSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 12,
  },
  skillsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  contactSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appInfoText: {
    fontSize: 16,
    color: '#8c52ff',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default DeveloperScreen;
