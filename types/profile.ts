// Wallet Type
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  credit: string;
  debit: string;
  createdAt?: string;
  updatedAt?: string;
}

// Profile Types
export interface SurrogateProfile {
  id?: string;
  userId?: string;
  firstName: string | null;
  lastName: string | null;
  userName: string;
  countryOfOrigin: string | null;
  aboutMe: string;
  dateOfBirth: string | null;
  maritalStatus: string | null;
  height: string | null;
  weight: string | null;
  profilePicture: string | null;
  numberOfChildren: number | null;
  countryOfResidence: string | null;
  stateOfResidence: string;
  stateOfOrigin: string | null;
  address: string | null;
  zipCode: string | null;
  phone1: string | null | undefined;
  phone2: string | null | undefined;
  emergencyContactPhone: string | null | undefined;
  emergencyContactRelation: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  twitterProfile: string | null;
  threadsProfile: string | null;
  ticktock: string;
  isAvailable: boolean;
  termsAcceptedAt: string | null;
  isSubmitted?: boolean;
  isApproved?: boolean;
  submittedAt?: string;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  medical?: MedicalProfile;
  wallet?: Wallet;
  lga: string;
  medicalProfile?: MedicalProfile;
  hasBeenSurrogate: boolean;
  previousPregnancyType: string | null;
  compensationAmount: number;
  compensationNegotiable: boolean;
  experienceNotes: string;
  enjoymentNotes: string;
}

export interface SurrogateProfileUpdate {
  firstName?: string;
  lastName?: string;
  userName?: string;
  countryOfOrigin?: string;
  aboutMe?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  profilePicture?: string;
  numberOfChildren?: number;
  countryOfResidence?: string;
  stateOfResidence?: string;
  stateOfOrigin?: string;
  address?: string;
  zipCode?: string;
  phone1?: string | null | undefined;
  phone2?: string | null | undefined;
  emergencyContactPhone?: string | null | undefined;
  lga: string;
  emergencyContactRelation?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  threadsProfile?: string;
  ticktock: string;
  isAvailable?: boolean;
  termsAcceptedAt?: string;
  wallet?: Wallet; // <-- updated type
  hasBeenSurrogate: boolean;
  previousPregnancyType: string | null;
  compensationAmount: number;
  compensationNegotiable: boolean;
  experienceNotes: string;
  enjoymentNotes: string;
}

export interface MedicalProfile {
  id?: string;
  surrogateProfileId?: string;
  genotype: string;
  bloodGroup: string;
  pregnancyExperience: boolean;
  numberofChildren: number;
  ceasareanSection: boolean;
  disabilities: string;
  numberOfcs: number;
  chronicIllnessDetails: string;
  pregnancyComplicationsDetails: string;
  endometriumUploadUrl: string | null;
  medications: string;
  miscariageExperience: boolean;
  numberofMiscariages: number | string;
  surgeries: string;
  allergies: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalProfileUpdate {
  surrogateProfileId?: string;
  genotype: string;
  bloodGroup: string;
  pregnancyExperience: boolean;
  numberofChildren: number;
  ceasareanSection: boolean;
  disabilities: string;
  numberOfcs: number;
  chronicIllnessDetails: string;
  pregnancyComplicationsDetails: string;
  endometriumUploadUrl: string | null;
  medications: string;
  miscariageExperience: boolean;
  numberofMiscariages: number | string;
}
