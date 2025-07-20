
# Trimizy Client

India’s #1 Barber Booking App (React Native + Expo)

---

## Overview
Trimizy is a modern mobile application for booking barber appointments, built with React Native and Expo. It features secure phone authentication (OTP via Firebase), Google Maps integration for address selection, and a beautiful, responsive UI. This project is designed for both development and production use, with all sensitive keys managed securely via environment variables.

---

## Features
- 📱 **React Native + Expo**: Cross-platform mobile app (iOS & Android)
- 🔒 **Firebase Phone Auth**: Secure OTP-based login
- 🗺️ **Google Maps Integration**: Address search and geolocation
- 🗝️ **Environment Variables**: All API keys and secrets are hidden
- 🧑‍💼 **User Context**: Global state for user and address management
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

### Address Selection
- Use the address screens to search and select your location
- Google Maps API is used for geocoding and address lookup

### Dev Mode
- In development (`__DEV__`), you can skip login or use the mock OTP for faster testing

---

## Project Structure
```
trimizy-client/
├── app/                # Main app screens (login, OTP, address, tabs)
├── components/         # Reusable UI components
├── constants/          # Colors, dummy data
├── hooks/              # Custom React hooks
├── scripts/            # Utility scripts
├── firebaseConfig.ts   # Firebase & Google Maps config
├── auth.context.tsx    # User/auth context provider
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
- **Other issues?**
  - Check the console logs for debug output

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](../LICENSE)

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
