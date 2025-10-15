// Profile Types
export interface SurrogateProfile {
    id?: string;
    firstName: string;
    lastName: string;
    userName: string;
    countryOfOrigin: string;
    aboutMe: string;
    dateOfBirth: string;
    maritalStatus: string;
    height: string;
    weight: string;
    profilePicture: string;
    numberOfChildren: number;
    countryOfResidence: string;
    stateOfOrigin: string;
    address: string;
    zipCode: string;
    phone1: string;
    phone2: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    facebookProfile: string;
    instagramProfile: string;
    twitterProfile: string;
    threadsProfile: string;
    isAvailable: boolean;
    termsAcceptedAt: string;
    createdAt?: string;
    updatedAt?: string;
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
    genotype: string;
    bloodGroup: string;
    pregnancyExperience: boolean;
    numberofChildren: number;
    ceasareanSection: boolean;
    chronicIllnessDetails: string;
    pregnancyComplicationsDetails: string;
    endometriumUploadUrl: string;
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
