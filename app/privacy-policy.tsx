import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last updated: August 18, 2025</Text>
        
        <Text style={styles.paragraph}>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </Text>
        
        <Text style={styles.paragraph}>
          We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>Interpretation and Definitions</Text>
        
        <Text style={styles.subsectionTitle}>Interpretation</Text>
        <Text style={styles.paragraph}>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </Text>

        <Text style={styles.subsectionTitle}>Definitions</Text>
        <Text style={styles.paragraph}>For the purposes of this Privacy Policy:</Text>
        
        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Account</Text>
          <Text style={styles.definitionText}>means a unique account created for You to access our Service or parts of our Service.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Affiliate</Text>
          <Text style={styles.definitionText}>means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Application</Text>
          <Text style={styles.definitionText}>refers to Trimizy, the software program provided by the Company.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Company</Text>
          <Text style={styles.definitionText}>(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Trimizy.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Country</Text>
          <Text style={styles.definitionText}>refers to: Karnataka, India</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Device</Text>
          <Text style={styles.definitionText}>means any device that can access the Service such as a computer, a cellphone or a digital tablet.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Personal Data</Text>
          <Text style={styles.definitionText}>is any information that relates to an identified or identifiable individual.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Service</Text>
          <Text style={styles.definitionText}>refers to the Application.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Service Provider</Text>
          <Text style={styles.definitionText}>means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Third-party Social Media Service</Text>
          <Text style={styles.definitionText}>refers to any website or any social network website through which a User can log in or create an account to use the Service.</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>Usage Data</Text>
          <Text style={styles.definitionText}>refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</Text>
        </View>

        <View style={styles.definitionItem}>
          <Text style={styles.definitionTerm}>You</Text>
          <Text style={styles.definitionText}>means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</Text>
        </View>

        <Text style={styles.sectionTitle}>Collecting and Using Your Personal Data</Text>
        
        <Text style={styles.subsectionTitle}>Types of Data Collected</Text>
        
        <Text style={styles.subSubsectionTitle}>Personal Data</Text>
        <Text style={styles.paragraph}>
          While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
        </Text>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Email address</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• First name and last name</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Phone number</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Address, State, Province, ZIP/Postal code, City</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Usage Data</Text>
        </View>

        <Text style={styles.subSubsectionTitle}>Usage Data</Text>
        <Text style={styles.paragraph}>
          Usage Data is collected automatically when using the Service.
        </Text>
        
        <Text style={styles.paragraph}>
          Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
        </Text>

        <Text style={styles.paragraph}>
          When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
        </Text>

        <Text style={styles.paragraph}>
          We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
        </Text>

        <Text style={styles.subSubsectionTitle}>Information from Third-Party Social Media Services</Text>
        <Text style={styles.paragraph}>
          The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:
        </Text>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Google</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Facebook</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Instagram</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Twitter</Text>
        </View>
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• LinkedIn</Text>
        </View>

        <Text style={styles.paragraph}>
          If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.
        </Text>

        <Text style={styles.paragraph}>
          You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.
        </Text>

        <Text style={styles.subSubsectionTitle}>Information Collected while Using the Application</Text>
        <Text style={styles.paragraph}>
          While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:
        </Text>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• Information regarding your location</Text>
        </View>

        <Text style={styles.paragraph}>
          We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.
        </Text>

        <Text style={styles.paragraph}>
          You can enable or disable access to this information at any time, through Your Device settings.
        </Text>

        <Text style={styles.subsectionTitle}>Use of Your Personal Data</Text>
        <Text style={styles.paragraph}>
          The Company may use Personal Data for the following purposes:
        </Text>

        <View style={styles.bulletPoint}>
          <Text style={styles.bulletTextBold}>• To provide and maintain our Service</Text>
          <Text style={styles.bulletText}>, including to monitor the usage of our Service.</Text>
        </View>

        <View style={styles.bulletPoint}>
          <Text style={styles.bulletTextBold}>• To manage Your Account:</Text>
          <Text style={styles.bulletText}> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</Text>
        </View>

        <View style={styles.bulletPoint}>
          <Text style={styles.bulletTextBold}>• For the performance of a contract:</Text>
          <Text style={styles.bulletText}> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</Text>
        </View>

        <View style={styles.bulletPoint}>
          <Text style={styles.bulletTextBold}>• To contact You:</Text>
          <Text style={styles.bulletText}> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</Text>
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, You can contact us:
        </Text>
        
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletText}>• By email: maazajaz1234@gmail.com</Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  subSubsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 10,
  },
  definitionItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  definitionTerm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4B5563',
    marginLeft: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
    flexWrap: 'wrap',
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
    flex: 1,
  },
  bulletTextBold: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
    fontWeight: '600',
  },
});

export default PrivacyPolicyScreen;
