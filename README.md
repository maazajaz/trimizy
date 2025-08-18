# Trimizy Client

India’s #1 Barber Booking App (React Native + Expo)

---

## Overview
Trimizy is a modern mobile application for booking barber appointments, built with React Native and Expo. It features secure phone authentication (OTP via Firebase), Google Maps integration for address selection, and a beautiful, responsive UI. This project is designed for both development and production use, with all sensitive keys managed securely via environment variables.

## 📱 App Preview

### Demo Video
<video width="320" height="640" controls>
  <source src="./assets/demo/trimizy-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

*Demo video showcasing the complete Trimizy app experience - from authentication to booking*

### Screenshots
| Home Screen | Shop Details | Checkout |
|-------------|--------------|----------|
| *Recommended section & nearby barbers* | *Service selection & cart* | *Cart review & suggestions* |
| 📱 *Coming Soon* | 📱 *Coming Soon* | 📱 *Coming Soon* |

### Key Highlights
- 🎯 **Smart Recommendations** - Personalized barber suggestions
- 🛒 **Multi-Shop Cart** - Handle services from different shops
- 📍 **Location-Based** - Find nearby barbers with GPS
- 💳 **Smooth Checkout** - Easy booking with service add-ons

---

## Features
- 📱 **React Native + Expo**: Cross-platform mobile app (iOS & Android)
- 🔒 **Firebase Phone Auth**: Secure OTP-based login with skip option
- 🗺️ **Google Maps Integration**: Address search, geolocation, and GPS auto-redirect
- 🛒 **Shopping Cart System**: Multi-shop cart with persistent storage
- 🏪 **Shop Management**: Browse barbers/salons with ratings and services
- 💳 **Checkout System**: Complete booking flow with service suggestions
- 👤 **Profile Management**: User profiles with dynamic avatars
- 🎯 **Recommendations**: Horizontal scrollable "Recommended for You" section
- � **Location Services**: GPS-based location detection and nearby shop discovery
- �🗝️ **Environment Variables**: All API keys and secrets are hidden
- 🧑‍💼 **User Context**: Global state for user, cart, and address management
- 🧪 **Dev Mode**: Skip login and use mock OTP for fast testing

---

## Getting Started

### 1. Prerequisites
- Node.js (18+ recommended)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (for phone auth)
- Google Cloud project (for Maps API)

### 2. Clone the Repository
```sh
git clone https://github.com/maazajaz/trimizy.git
cd trimizy/trimizy-client
```

### 3. Install Dependencies
```sh
yarn install
# or
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of `trimizy-client`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> **Note:** Never commit your `.env` file. It is already in `.gitignore`.

### 5. Configure `app.json`
Ensure all environment variables are injected into Expo's `extra` config in `app.json`:
```json
{
  "expo": {
    ...,
    "extra": {
      "firebaseApiKey": "${EXPO_PUBLIC_FIREBASE_API_KEY}",
      ...
      "googleMapsApiKey": "${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}"
    }
  }
}
```

### 6. Start the App
```sh
# Start Expo
npx expo start
# Or with yarn
yarn start
```

- Scan the QR code with Expo Go (for quick dev testing)
- For production, build a standalone app with EAS Build

---

## Usage

### Phone Authentication (OTP)
- Enter your phone number and tap "Continue"
- Complete the reCAPTCHA challenge
- Enter the OTP sent to your phone
- In development, you can use `123456` as a mock OTP
- Option to skip login for quick testing

### Shopping & Booking Flow
1. **Browse Services**: View recommended barbers and nearby shops
2. **Select Shop**: Choose from various categories (Haircut, Beard, Massage, Combo)
3. **Add to Cart**: Select services and add them to your cart
4. **Multi-Shop Support**: Add items from different shops with separate carts
5. **Checkout**: Review items, see service suggestions, and complete booking
6. **Floating Cart**: Quick access to cart from any page

### Location Features
- **Address Selection**: Search and save multiple addresses (Home, Work, etc.)
- **GPS Detection**: Automatically fetch current location
- **Auto-Redirect**: Location selection redirects to home page
- **Nearby Discovery**: Find barbers and salons near your location

### Profile Management
- **Dynamic Avatars**: Shows user initials or 'T' for Trimizy
- **Authentication State**: Different UI based on login status
- **User Settings**: Manage profile and preferences

## Key Screens

### Home Screen (`app/(tabs)/index.tsx`)
- **Recommended Section**: Horizontal scrollable grid with 2-row layout
- **Categories**: Filter shops by service type (Haircut, Beard, Massage, etc.)
- **Barbers Nearby**: Main listing of all available shops
- **Floating Cart**: Multi-shop cart with horizontal scroll for multiple active carts
- **Location Header**: Shows current address with quick location change option

### Shop Details (`app/shop/[id].tsx`)
- **Service Menu**: Browse available services with prices
- **Add to Cart**: Select services and quantities
- **Shop Information**: Ratings, location, and contact details

### Checkout (`app/checkout.tsx`)
- **Cart Review**: See all selected services and quantities
- **Service Suggestions**: Horizontal scrollable additional services
- **Total Calculation**: Dynamic pricing with offers
- **Remove Items**: Quantity controls with auto-removal at zero

### Profile (`app/profile.tsx`)
- **User Information**: Display name and authentication status
- **Settings**: App preferences and account management
- **Logout Option**: Secure sign-out functionality

### Dev Mode
- In development (`__DEV__`), you can skip login or use the mock OTP for faster testing

---

## Project Structure
```
trimizy-client/
├── app/                
│   ├── (tabs)/         # Main tab navigation (home, explore)
│   ├── booking/        # Booking related screens
│   ├── location/       # Location and address management
│   ├── shop/           # Individual shop pages
│   ├── checkout.tsx    # Cart and checkout functionality
│   ├── login.tsx       # Phone authentication
│   ├── profile.tsx     # User profile management
│   ├── OtpVerificationScreen.tsx
│   ├── UserDetailsScreen.tsx
│   └── location.tsx    # Location selection with GPS
├── components/         # Reusable UI components
├── constants/          
│   ├── Colors.ts       # App color scheme
│   ├── dummyData.ts    # Shop and location data
│   └── servicesData.ts # Shared services data
├── hooks/              # Custom React hooks
├── scripts/            # Utility scripts
├── assets/            
│   ├── images/         # App icons and graphics
│   └── fonts/          # Custom fonts
├── firebaseConfig.ts   # Firebase & Google Maps config
├── auth.context.tsx    # User/auth/cart context provider
├── package.json
├── app.json            # Expo config
├── .env                # Environment variables (not committed)
```

---

## Security
- All API keys are loaded from environment variables
- `.env` is in `.gitignore` and never committed
- Never expose secrets in the codebase

---

## Troubleshooting
- **OTP not working?**
  - Make sure you use the latest OTP sent to your device
  - Do not reload or navigate away between sending and verifying OTP
  - If using Expo Go, try a development build for more reliable phone auth
- **Google Maps not working?**
  - Check your API key and billing status in Google Cloud
  - Ensure Maps JavaScript API and Geocoding API are enabled
- **Cart not persisting?**
  - Cart data is stored using AsyncStorage and should persist across app restarts
  - Each shop has its own cart to prevent cross-contamination
- **Location services not working?**
  - Check device permissions for location access
  - Ensure Google Geocoding API is enabled and properly configured
- **Images not loading?**
  - All shop images use Pexels URLs - check internet connection
  - Some images may need to be updated if URLs become invalid
- **Other issues?**
  - Check the console logs for debug output
  - Clear AsyncStorage if experiencing persistent cart issues

## 📹 Adding Your Demo Video

### Step 1: Create Demo Video
Record your app demo showing:
- **Authentication flow** (Phone OTP + Google login)
- **Home screen** with recommendations and nearby barbers
- **Shopping experience** (browse → add to cart → checkout)
- **Key features** (multi-shop cart, location services, profile)

### Step 2: Prepare Video File
- **Format**: MP4 (best compatibility)
- **Duration**: 30-90 seconds for optimal viewing
- **Resolution**: 720p or 1080p (mobile aspect ratio preferred)
- **Size**: Keep under 25MB for GitHub

### Step 3: Add Video to Repository
```bash
# Create assets/demo folder
mkdir -p assets/demo

# Add your video file
cp your-demo-video.mp4 assets/demo/trimizy-demo.mp4

# Commit the video
git add assets/demo/trimizy-demo.mp4
git commit -m "Add app demo video"
git push origin main
```

### Step 4: Alternative - GitHub Issues Method
1. Go to any GitHub issue in your repo
2. Drag and drop your video file into a comment
3. GitHub will generate a permanent URL like:  
   `https://github.com/maazajaz/trimizy/assets/USERNAME/VIDEO_ID.mp4`
4. Replace the video source in README with this URL

### Example Direct Embedding
```html
<video width="320" height="640" controls>
  <source src="https://github.com/maazajaz/trimizy/assets/USERNAME/VIDEO_ID.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

The video will play directly in your README without needing external links!

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](./LICENSE)

---

## Author
- [maazajaz](https://github.com/maazajaz)
- [My Portfolio](https://maazajaz.com)

---

## Acknowledgements
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/)
- [Google Maps Platform](https://cloud.google.com/maps-platform)
- [React Native](https://reactnative.dev/)
