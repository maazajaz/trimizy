// firebaseConfig.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBBptEpvyxS-yMVUDCEjw0y048TRJbYNqo',
  authDomain: 'trimizy-app.firebaseapp.com',
  projectId: 'trimizy-app',
  storageBucket: 'trimizy-app.firebasestorage.app',
  messagingSenderId: '731541489806',
  appId: '1:731541489806:web:fa2baa611a6a1fcd4ea1df',
  measurementId: 'G-568K0FBXQN',
};

// ✅ Initialize only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
export const auth = firebase.auth();
export const db = firebase.firestore();
export const firebaseConfigExport = firebaseConfig;