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
};
