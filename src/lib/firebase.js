import { initializeApp, getApps, getApp } from "firebase/app"; 
import { initializeFirestore, memoryLocalCache } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDUW0-976dmK-0DpmoUhZxQru0mWfady5Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test-b46ab.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "test-b46ab",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "test-b46ab.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "941602146363",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:941602146363:web:e26512b29285285278341e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-RKJ3RFHBL1"
}; 

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ZORLANMIŞ BAĞLANTI AYARLARI
// experimentalForceLongPolling: Firebase'i standart bir web sitesi gibi davranmaya zorlar, engelleri aşar.
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

export const storage = getStorage(app);
export const analytics = null;
