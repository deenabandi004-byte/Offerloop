// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz6qHGyJCQgsL1KRxetkeTWdEWMtNvSf4",
  authDomain: "offerloop-690d7.firebaseapp.com",
  projectId: "offerloop-690d7",
  storageBucket: "offerloop-690d7.firebasestorage.app",
  messagingSenderId: "397312689444",
  appId: "1:397312689444:web:f4fc33782daf838555dfb1",
  measurementId: "G-XZZY32PPL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service  
export const db = getFirestore(app);

export default app;