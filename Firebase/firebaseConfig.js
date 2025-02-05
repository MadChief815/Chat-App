import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, sendPasswordResetEmail  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "ADD YOUR CONFIG DATA",
    authDomain: "ADD YOUR CONFIG DATA",
    projectId: "ADD YOUR CONFIG DATA",
    storageBucket: "ADD YOUR CONFIG DATA",
    messagingSenderId: "ADD YOUR CONFIG DATA",
    appId: "ADD YOUR CONFIG DATA",
    databaseURL: "ADD YOUR CONFIG DATA"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize RealTime Database
const database = getDatabase(app);

export { auth, db, database };

// Export DB01 Database
export const usersRef = collection(db, "DB01", "Credentials", "USERS");
