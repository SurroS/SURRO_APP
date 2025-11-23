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
    stateOfOrigin: string | null;
    address: string | null;
    zipCode: string | null;
    phone1: string | null;
    phone2: string | null;
    emergencyContactPhone: string | null;
    emergencyContactRelation: string | null;
    facebookProfile: string | null;
    instagramProfile: string | null;
    twitterProfile: string | null;
    threadsProfile: string | null;
    isAvailable: boolean;
    termsAcceptedAt: string | null;
    isSubmitted?: boolean;
    isApproved?: boolean;
    submittedAt?: string;
    approvedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    medical?: MedicalProfile;
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
    stateOfOrigin?: string;
    address?: string;
    zipCode?: string;
    phone1?: string;
    phone2?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
    facebookProfile?: string;
    instagramProfile?: string;
    twitterProfile?: string;
    threadsProfile?: string;
    isAvailable?: boolean;
    termsAcceptedAt?: string;
}

export interface MedicalProfile {
    id?: string;
    surrogateProfileId?: string;
    genotype: string;
    bloodGroup: string;
    pregnancyExperience: boolean;
    numberofChildren: number;
    ceasareanSection: boolean;
    chronicIllnessDetails: string;
    pregnancyComplicationsDetails: string;
    endometriumUploadUrl: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface MedicalProfileUpdate {
    genotype?: string;
    bloodGroup?: string;
    pregnancyExperience?: boolean;
    numberofChildren?: number;
    ceasareanSection?: boolean;
    chronicIllnessDetails?: string;
    pregnancyComplicationsDetails?: string;
    endometriumUploadUrl?: string;
}
