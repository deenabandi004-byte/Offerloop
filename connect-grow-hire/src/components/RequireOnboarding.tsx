import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { isProfileComplete } from '@/utils/onboarding';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireOnboarding({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'needsOnboarding' | 'signin'>('loading');
  const location = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isLoading) return;
      
      const currentUser = auth.currentUser;
      if (!currentUser || !user) {
        setStatus('signin');
        return;
      }

      try {
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;
        
        if (profileData?.onboardingComplete || isProfileComplete(profileData)) {
          setStatus('ok');
        } else {
          setStatus('needsOnboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setStatus('ok');
      }
    };

    checkOnboardingStatus();
  }, [location.pathname, user, isLoading]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'signin') {
    return <Navigate to="/signin" replace />;
  }
  
  if (status === 'needsOnboarding') {
    return <Navigate to="/onboarding/resume-upload" replace />;
  }
  
  return children;
}
