import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

const getMonthKey = () => new Date().toISOString().slice(0, 7);

const initialCreditsByTier = (tier: 'free' | 'pro') =>
  tier === 'free' ? 120 : 840;

const monthlyEmailLimitByTier = (tier: 'free' | 'pro') =>
  tier === 'free' ? 8 : 56;

interface User {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  accessToken?: string;
  tier: 'free' | 'pro';
  credits: number;
  maxCredits: number;
  subscriptionId?: string;
  emailsUsedThisMonth?: number;
  emailsMonthKey?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

// In your existing loadUserData function, replace the Firestore logic with this:
const loadUserData = async (firebaseUser: FirebaseUser) => {
  try {
    // TEMPORARY: Skip Firestore and create user from Firebase Auth
    const nowKey = getMonthKey();
    const defaultTier = 'free';
    const defaultCredits = initialCreditsByTier(defaultTier);

    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      picture: firebaseUser.photoURL || undefined,
      tier: defaultTier,
      credits: defaultCredits,
      maxCredits: defaultCredits,
      emailsMonthKey: nowKey,
      emailsUsedThisMonth: 0,
    };

    setUser(newUser);
    console.log('User set from Firebase Auth (no Firestore):', newUser);
  } catch (error) {
    console.error('Error loading user data:', error);
    setUser(null);
  }
};

  const signIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/gmail.compose');
      provider.addScope('https://www.googleapis.com/auth/gmail.modify');
      const result = await signInWithPopup(auth, provider);
      console.log('Authentication successful:', result.user.email);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, updates);
        
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, signIn, signOut, updateUser, isLoading }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
