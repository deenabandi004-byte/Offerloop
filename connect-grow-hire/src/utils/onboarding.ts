import { OnboardingProfile } from '@/types/profile';

export function isProfileComplete(p: Partial<OnboardingProfile> | null | undefined): boolean {
  if (!p) return false;
  
  const nonEmpty = (v?: string) => !!v && v.trim().length > 0;
  const hasArray = (arr?: unknown[]) => Array.isArray(arr) && arr.length > 0;

  return (
    nonEmpty(p.firstName) &&
    nonEmpty(p.lastName) &&
    nonEmpty(p.fieldOfStudy) &&
    nonEmpty(p.degreeType) &&
    (hasArray(p.locations) || hasArray(p.jobTypes) || hasArray(p.industries))
  );
}

export function getOnboardingProgress(p: Partial<OnboardingProfile> | null | undefined): number {
  if (!p) return 0;
  
  const nonEmpty = (v?: string) => !!v && v.trim().length > 0;
  const hasArray = (arr?: unknown[]) => Array.isArray(arr) && arr.length > 0;
  
  let completed = 0;
  const total = 5;
  
  if (nonEmpty(p.firstName) && nonEmpty(p.lastName)) completed++;
  if (nonEmpty(p.university)) completed++;
  if (nonEmpty(p.fieldOfStudy) && nonEmpty(p.degreeType)) completed++;
  if (hasArray(p.industries) && nonEmpty(p.jobRole)) completed++;
  if (hasArray(p.locations) || hasArray(p.jobTypes)) completed++;
  
  return Math.round((completed / total) * 100);
}
