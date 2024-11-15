// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDCeaac0doL3dnkpzRbK8AbABaTDIQSR1U",
  authDomain: "reactnative-e74c2.firebaseapp.com",
  projectId: "reactnative-e74c2",
  storageBucket: "reactnative-e74c2.appspot.com",
  messagingSenderId: "991515090601",
  appId: "1:991515090601:web:85b230a26dfc04dacd53b8",
  measurementId: "G-BEYSJZXCHG"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with AsyncStorage for auth persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

// Export the initialized services
export { auth, db };
