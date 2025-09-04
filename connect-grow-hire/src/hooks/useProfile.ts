import { OnboardingProfile, EMPTY_PROFILE, UserAuth } from '@/types/profile';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const PROFILE_KEY = 'onboardingProfile';
const USERS_COLLECTION = 'users';
const PROFILES_COLLECTION = 'profiles';


export async function getProfile(): Promise<OnboardingProfile> {
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile : { ...EMPTY_PROFILE };
    } catch {
      return { ...EMPTY_PROFILE };
    }
  }

  try {
    const docRef = doc(db, PROFILES_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...EMPTY_PROFILE, ...docSnap.data() } as OnboardingProfile;
    } else {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const localProfile = { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile;
        await setDoc(docRef, localProfile);
        return localProfile;
      }
      return { ...EMPTY_PROFILE };
    }
  } catch (error) {
    console.error('Error getting profile from Firestore:', error);
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile : { ...EMPTY_PROFILE };
    } catch {
      return { ...EMPTY_PROFILE };
    }
  }
}

export async function setProfile(p: OnboardingProfile): Promise<void> {
  const userId = auth.currentUser?.uid;
  
  const profileWithTimestamp = {
    ...p,
    updatedAt: Date.now(),
  };
  
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileWithTimestamp));
  
  if (!userId) {
    return;
  }

  try {
    const docRef = doc(db, PROFILES_COLLECTION, userId);
    await setDoc(docRef, profileWithTimestamp);
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
  }
}

export async function updateProfile(partial: Partial<OnboardingProfile>): Promise<OnboardingProfile> {
  const current = await getProfile();
  const next = { ...current, ...partial };
  await setProfile(next);
  return next;
}

export function getProfileSync(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile : { ...EMPTY_PROFILE };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function setProfileSync(p: OnboardingProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function updateProfileSync(partial: Partial<OnboardingProfile>): OnboardingProfile {
  const current = getProfileSync();
  const next = { ...current, ...partial, updatedAt: Date.now() };
  setProfileSync(next);
  return next;
}

export async function createUserAuth(user: any): Promise<UserAuth> {
  const userAuth: UserAuth = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || undefined,
    tier: 'free',
    credits: 5000,
    maxCredits: 5000,
    createdAt: Date.now(),
    lastSignIn: Date.now(),
  };

  try {
    const docRef = doc(db, USERS_COLLECTION, user.uid);
    await setDoc(docRef, userAuth);
    return userAuth;
  } catch (error) {
    console.error('Error creating user auth:', error);
    throw error;
  }
}

export async function getUserAuth(uid: string): Promise<UserAuth | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserAuth;
    }
    return null;
  } catch (error) {
    console.error('Error getting user auth:', error);
    return null;
  }
}

export async function updateUserAuth(uid: string, updates: Partial<UserAuth>): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, { ...updates, lastSignIn: Date.now() });
  } catch (error) {
    console.error('Error updating user auth:', error);
  }
}
