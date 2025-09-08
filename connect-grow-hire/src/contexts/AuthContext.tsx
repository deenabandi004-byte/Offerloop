import React, { createContext, useContext, useState, useEffect } from 'react';

const getMonthKey = () => new Date().toISOString().slice(0, 7);

const initialCreditsByTier = (tier: 'free' | 'starter' | 'pro') =>
  tier === 'free' ? 120 : 840;

const monthlyEmailLimitByTier = (tier: 'free' | 'starter' | 'pro') =>
  tier === 'free' ? 8 : 56;

// Add Google types
declare global {
  interface Window {
    google?: any;
  }
}

interface User {
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  // Add tier management fields
  tier: 'free' | 'starter' | 'pro';
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

  // Google OAuth configuration - TEMPORARILY REMOVE GMAIL SCOPE FOR PUBLISHING
  const GOOGLE_CLIENT_ID = '464822670976-htb19rt0rp079f5h3m0jk86m5ecq4rfi.apps.googleusercontent.com';
  const SCOPES = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  // const SCOPES = 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  const REDIRECT_URI = 'http://localhost:8080/auth/callback'; // Try these alternatives if needed:
  // const REDIRECT_URI = 'http://127.0.0.1:8080/auth/callback';
  // const REDIRECT_URI = 'http://localhost:3000/auth/callback';

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.head.appendChild(script);

    // Check for existing auth on page load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure tier data exists, add defaults if missing
        const nowKey = getMonthKey();
        const tier = parsedUser.tier || 'free';
        const defaultCredits = initialCreditsByTier(tier);
        
        const userWithDefaults: User = {
          ...parsedUser,
          tier,
          credits: parsedUser.credits ?? defaultCredits,
          maxCredits: parsedUser.maxCredits ?? defaultCredits,
          emailsMonthKey: parsedUser.emailsMonthKey || nowKey,
          emailsUsedThisMonth: (parsedUser.emailsMonthKey === nowKey)
            ? (parsedUser.emailsUsedThisMonth ?? 0)
            : 0,
        };
        setUser(userWithDefaults);
        // Update localStorage with new format
        localStorage.setItem('user', JSON.stringify(userWithDefaults));
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      console.log('Google Identity Services initialized');
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Create OAuth URL for popup
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', SCOPES);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('include_granted_scopes', 'true');
      authUrl.searchParams.set('state', Math.random().toString(36).substring(2, 15));

      // Open popup window
      const popup = window.open(
        authUrl.toString(),
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for popup messages
      const authPromise = new Promise<string>((resolve, reject) => {
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', messageListener);
            popup.close();
            resolve(event.data.code);
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageListener);

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);
      });

      // Get authorization code from popup
      const authCode = await authPromise;

      // Exchange code for tokens via your Flask backend
      const response = await fetch('http://localhost:5001/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to authenticate with backend: ${errorText}`);
      }

      const userData = await response.json();
      
      // Check if user has subscription data from backend
      // For now, we'll use defaults but you can extend this
      const tier: 'free' | 'starter' | 'pro' = userData.tier || 'free';
      const defaultCredits = initialCreditsByTier(tier);
      const nowKey = getMonthKey();

      const user: User = {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        accessToken: userData.access_token,
        // Add tier defaults - these would come from your backend/database
        tier,
        credits: userData.credits ?? defaultCredits,
        maxCredits: userData.maxCredits ?? defaultCredits,
        subscriptionId: userData.subscriptionId,
        emailsMonthKey: nowKey,
        emailsUsedThisMonth: 0,
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Authentication successful:', user.email);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User signed out');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
