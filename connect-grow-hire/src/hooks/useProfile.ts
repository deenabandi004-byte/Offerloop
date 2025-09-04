import { OnboardingProfile, EMPTY_PROFILE } from '@/types/profile';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PROFILE_KEY = 'onboardingProfile';

function getCurrentUserId(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || user.sub || null;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<OnboardingProfile> {
  const userId = getCurrentUserId();
  
  if (!userId) {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile : { ...EMPTY_PROFILE };
    } catch {
      return { ...EMPTY_PROFILE };
    }
  }

  try {
    const docRef = doc(db, 'profiles', userId);
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
  const userId = getCurrentUserId();
  
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  
  if (!userId) {
    return;
  }

  try {
    const docRef = doc(db, 'profiles', userId);
    await setDoc(docRef, p);
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
  const next = { ...current, ...partial };
  setProfileSync(next);
  return next;
}
