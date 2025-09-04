import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCz6qHGyJCQgsL1KRxetkeTWdEWMtNvSf4",
  authDomain: "offerloop-690d7.firebaseapp.com",
  projectId: "offerloop-690d7",
  storageBucket: "offerloop-690d7.appspot.com",
  messagingSenderId: "397312689444",
  appId: "1:397312689444:web:f4fc33782daf838555dfb1",
  measurementId: "G-XZZY32PPL2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
