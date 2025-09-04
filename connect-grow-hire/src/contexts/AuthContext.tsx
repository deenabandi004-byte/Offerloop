import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';

interface User {
  email: string;
  name: string;
  picture?: string;
  accessToken?: string;
  tier: 'free' | 'starter' | 'pro';
  credits: number;
  maxCredits: number;
  subscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const stored = localStorage.getItem('user');
        const defaults = stored ? JSON.parse(stored) : {};
        const mapped: User = {
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          picture: fbUser.photoURL || undefined,
          tier: defaults.tier || 'free',
          credits: defaults.credits ?? 5000,
          maxCredits: defaults.maxCredits ?? 5000,
          subscriptionId: defaults.subscriptionId,
        };
        setUser(mapped);
        localStorage.setItem('user', JSON.stringify(mapped));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Firebase sign-in failed:', e);
      setIsLoading(false);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('User signed out');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
