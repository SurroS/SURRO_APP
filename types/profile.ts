// Wallet Type
import { Wallet } from "./auth";

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
  stateOfResidence: string | null;
  stateOfOrigin: string | null;
  lga: string | null;
  address: string | null;
  zipCode: string | null;
  phone1: string | null;
  phone2: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  facebookProfile: string | null;
  instagramProfile: string | null;
  twitterProfile: string | null;
  tiktokProfile: string | null;
  isAvailable: boolean;
  termsAcceptedAt: string | null;
  isSubmitted?: boolean;
  isApproved?: boolean;
  submittedAt?: string;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    password?: string;
    role: string;
    isVerified: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    isOnline: boolean;
    lastSeen: string;
    googleId?: string | null;
    appleId?: string | null;
    profilePictureUrl?: string | null;
    kycStatus: string;
    referralCode: string;
    referredById?: string | null;
  };
  age?: number;
  medical?: MedicalProfile;
  wallet?: Wallet;
  compensationAmount?: number;
  compensationNegotiable?: boolean;
  experienceNotes?: string;
  enjoymentNotes?: string;
  previousPregnancyType?: string;
  hasBeenSurrogate?: boolean | null;
  experienceLevel?: string;
  numberOfBabiesCarried?: number;
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
  lga?: string;
  address?: string;
  zipCode?: string;
  phone1?: string | null;
  phone2?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  twitterProfile?: string;
  tiktokProfile?: string;
  isAvailable?: boolean;
  termsAcceptedAt?: string;
  medical?: MedicalProfile;
  compensationAmount?: number;
  compensationNegotiable?: boolean;
  experienceNotes?: string;
  enjoymentNotes?: string;
  previousPregnancyType?: string;
}

export interface MedicalProfile {
  id?: string;
  surrogateProfileId?: string;
  genotype?: string;
  bloodGroup?: string;
  // Backend field names
  pregnant?: boolean;
  children?: number;
  caesarean?: boolean;
  medicalReport?: string;
  // Legacy/frontend field names (maps to same backend fields)
  pregnancyExperience?: boolean;
  numberofChildren?: number;
  numberOFChildren?: number;
  ceasareanSection?: boolean;
  chronicIllnessDetails?: string;
  pregnancyComplicationsDetails?: string;
  endometriumUploadUrl?: string;
  createdAt?: string;
  updatedAt?: string;

  hasChildren?: boolean;
  numberOfChildren?: number;
  numberOfCs?: number;
  hadMiscarriage?: boolean;
  numberOfMiscarriages?: number;
  hasChronicIllness?: boolean;
  chronicIllnesses?: string[];
  otherChronicIllness?: string;
  hasAllergies?: boolean;
  allergies?: string[];
  takesMedication?: boolean;
  medications?: string[];
  hadSurgery?: boolean;
  surgeries?: string[];
  hasDisability?: boolean;
  disabilities?: string[];
}

export interface MedicalProfileUpdate {
  genotype?: string;
  bloodGroup?: string;
  // Backend field names
  pregnant?: boolean;
  children?: number;
  caesarean?: boolean;
  medicalReport?: string;
  // Legacy/frontend field names
  pregnancyExperience?: boolean;
  hasChildren?: boolean;
  numberOfChildren?: number;
  ceasareanSection?: boolean;
  numberOfCs?: number;
  hadMiscarriage?: boolean;
  numberOfMiscarriages?: number;
  hasChronicIllness?: boolean;
  chronicIllnesses?: string[];
  otherChronicIllness?: string;
  hasAllergies?: boolean;
  allergies?: string[];
  takesMedication?: boolean;
  medications?: string[];
  hadSurgery?: boolean;
  surgeries?: string[];
  hasDisability?: boolean;
  disabilities?: string[];
  pregnancyComplicationsDetails?: string;
  endometriumUploadUrl?: string;
}
export type YesNo = "yes" | "no";

export interface MedicalFormState {
  genotype?: string;
  bloodGroup?: string;
  pregnancyExperience?: boolean;
  hasChildren?: boolean;
  numberofChildren?: number;
  ceasareanSection?: boolean;
  numberOfCs?: number;
  hasAllergies?: boolean;
  allergies?: string;
  hasChronicIllness?: boolean;
  chronicIllnesses?: string[];
  otherChronicIllness?: string;
  chronicIllnessDetails: string;
  pregnancyComplicationsDetails: string;
  takesMedication?: boolean;
  medications?: string;
  hadSurgery?: boolean;
  surgeries?: string;
  hasDisability?: boolean;
  disabilities?: string;
  hadMiscarriage?: boolean;
  numberOfMiscarriages?: number;
  endometriumUploadUrl?: string;
}
