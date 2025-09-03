import { OnboardingProfile, EMPTY_PROFILE } from '@/types/profile';

const PROFILE_KEY = 'onboardingProfile';

export function getProfile(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } as OnboardingProfile : { ...EMPTY_PROFILE };
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function setProfile(p: OnboardingProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function updateProfile(partial: Partial<OnboardingProfile>): OnboardingProfile {
  const current = getProfile();
  const next = { ...current, ...partial };
  setProfile(next);
  return next;
}
