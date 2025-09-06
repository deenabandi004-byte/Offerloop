export interface OnboardingProfile {
  firstName?: string;
  lastName?: string;
  university?: string;

  graduationMonth?: string;
  graduationYear?: string;
  fieldOfStudy?: string;
  degreeType?: string;
  customDegree?: string;

  industries?: string[];
  jobRole?: string;        // normalized selection when not "other"
  customJobRole?: string;  // free text when "other"

  locations?: string[];
  jobTypes?: string[];     // ['internship','part-time','full-time']

  profileImageDataUrl?: string; // for uploaded profile photo
}
