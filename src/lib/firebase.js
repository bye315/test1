import { initializeApp, getApps, getApp } from "firebase/app"; 
import { initializeFirestore, memoryLocalCache } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

const firebaseConfig = { 
  apiKey: "AIzaSyDUW0-976dmK-0DpmoUhZxQru0mWfady5Y", 
  authDomain: "test-b46ab.firebaseapp.com", 
  projectId: "test-b46ab", 
  storageBucket: "test-b46ab.firebasestorage.app", 
  messagingSenderId: "941602146363", 
  appId: "1:941602146363:web:e26512b29285285278341e", 
  measurementId: "G-RKJ3RFHBL1" 
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
