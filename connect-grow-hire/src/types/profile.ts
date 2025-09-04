export interface OnboardingProfile {
  firstName: string;
  lastName: string;
  university?: string;

  graduationMonth?: string;
  graduationYear?: string;

  fieldOfStudy?: string;
  degreeType?: string;

  industries?: string[];
  jobRole?: string;
  locations?: string[];
  jobTypes?: string[];

  avatarDataUrl?: string | null;
  resume?: { name: string; dataUrl: string } | null;
  
  onboardingComplete?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface UserAuth {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: 'free' | 'starter' | 'pro';
  credits: number;
  maxCredits: number;
  subscriptionId?: string;
  createdAt: number;
  lastSignIn: number;
}

export const EMPTY_PROFILE: OnboardingProfile = {
  firstName: "",
  lastName: "",
  university: "",
  graduationMonth: "",
  graduationYear: "",
  fieldOfStudy: "",
  degreeType: "",
  industries: [],
  jobRole: "",
  locations: [],
  jobTypes: [],
  avatarDataUrl: null,
  resume: null,
  onboardingComplete: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
