import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBf-RCfcMUt4JhzyUo5Q2icWHvwUHgd3TQ",
  authDomain: "shopsand-3508c.firebaseapp.com",
  projectId: "shopsand-3508c",
  storageBucket: "shopsand-3508c.firebasestorage.app",
  messagingSenderId: "135163729725",
  appId: "1:135163729725:web:ff314cf0cbaf802864d754",
  measurementId: "G-KH4NC2N9TP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
