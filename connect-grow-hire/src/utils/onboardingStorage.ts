import type { OnboardingProfile } from "@/types/onboarding";

const ONBOARDING_KEY = "onboardingProfile";

export function loadOnboarding(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
  } catch {
    return null;
  }
}

export function saveOnboarding(partial: Partial<OnboardingProfile>): OnboardingProfile {
  const current = loadOnboarding() || {};
  const next = { ...current, ...partial };
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next));
  return next;
}

export function clearOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}
