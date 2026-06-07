import {
  authenticatedGet,
  authenticatedPost,
  authenticatedPut,
  authenticatedPatch,
  authenticatedDelete,
} from "./httpClient";
import httpClient from "./httpClient";

// ----------------------------------------------------
//   ROLE ENDPOINT (KEEP, but DO NOT USE for UI)
// ----------------------------------------------------
export type UserRole = "SURROGATE" | "INTENDED_PARENT" | "AGENT";

export const getUsersByRole = (role: UserRole) =>
  authenticatedGet(`/users/by-role/${role}`);

// ----------------------------------------------------
// GENERIC USER
// ----------------------------------------------------
export const getUserById = (userId: string) =>
  authenticatedGet(`/users/${userId}`);

// ----------------------------------------------------
// SURROGATES
// ----------------------------------------------------
export const getAllSurrogates = () => authenticatedGet("/surrogates");
// SURROGATES
// ----------------------------------------------------
const MOCK_PROFILES: Record<string, any> = {
  "surr-mock-1": {
    id: "surr-mock-1",
    firstName: "Jane", lastName: "Doe", userName: "janedoe",
    profilePicture: "https://ui-avatars.com/api/?name=Jane+Doe&background=0E0E55&color=fff&size=400",
    countryOfResidence: "Nigeria", stateOfResidence: "Lagos", lga: "Ikeja",
    aboutMe: "Experienced surrogate with a passion for helping families.",
    dateOfBirth: "1996-01-01", age: 28,
    maritalStatus: "Married", height: "165", weight: "60",
    phone1: "+2348011111111", phone2: null, emergencyContactPhone: null,
    facebookProfile: "janedoe", instagramProfile: "janedoe", twitterProfile: "janedoe", tiktokProfile: "janedoe",
    medical: { genotype: "AA", bloodGroup: "O+", pregnancyExperience: true, numberOfChildren: 2, ceasareanSection: false, hasAllergies: false, allergies: [], hasChronicIllness: false, takesMedication: false, medications: [], hadSurgery: false, surgeries: [], hasDisability: false, disabilities: [], hadMiscarriage: false, numberOfMiscarriages: 0 },
    isAvailable: true, termsAcceptedAt: "2025-01-01",
    user: { id: "user-mock-1", email: "jane@example.com", role: "SURROGATE", isVerified: true, isApproved: true, createdAt: "2025-01-01", updatedAt: "2025-01-01", isOnline: true, lastSeen: "2026-06-07", kycStatus: "verified", referralCode: "JANE123" },
    wallet: { id: "w1", userId: "surr-mock-1", balance: 0, currency: "NGN" },
  },
  "surr-mock-2": {
    id: "surr-mock-2",
    firstName: "Mary", lastName: "Ann", userName: "maryann",
    profilePicture: "https://ui-avatars.com/api/?name=Mary+Ann&background=0E0E55&color=fff&size=400",
    countryOfResidence: "Nigeria", stateOfResidence: "Abuja", lga: "Gwarinpa",
    aboutMe: "Kind-hearted and healthy surrogate ready to start a new journey.",
    dateOfBirth: "1992-06-15", age: 32,
    maritalStatus: "Single", height: "170", weight: "65",
    phone1: "+2348022222222", phone2: null, emergencyContactPhone: null,
    facebookProfile: "maryann", instagramProfile: "maryann", twitterProfile: "maryann", tiktokProfile: "maryann",
    medical: { genotype: "AS", bloodGroup: "A+", pregnancyExperience: true, numberOfChildren: 1, ceasareanSection: false, hasAllergies: false, allergies: [], hasChronicIllness: false, takesMedication: false, medications: [], hadSurgery: false, surgeries: [], hasDisability: false, disabilities: [], hadMiscarriage: false, numberOfMiscarriages: 0 },
    isAvailable: true, termsAcceptedAt: "2025-01-01",
    user: { id: "user-mock-2", email: "mary@example.com", role: "SURROGATE", isVerified: true, isApproved: true, createdAt: "2025-01-01", updatedAt: "2025-01-01", isOnline: true, lastSeen: "2026-06-07", kycStatus: "verified", referralCode: "MARY456" },
    wallet: { id: "w2", userId: "surr-mock-2", balance: 0, currency: "NGN" },
  },
  "surr-mock-3": {
    id: "surr-mock-3",
    firstName: "Sarah", lastName: "Williams", userName: "sarahw",
    profilePicture: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0E0E55&color=fff&size=400",
    countryOfResidence: "Nigeria", stateOfResidence: "Rivers", lga: "Port Harcourt",
    aboutMe: "First-time surrogate excited to make a difference.",
    dateOfBirth: "1998-03-22", age: 26,
    maritalStatus: "Married", height: "162", weight: "58",
    phone1: "+2348033333333", phone2: null, emergencyContactPhone: null,
    facebookProfile: "sarahw", instagramProfile: "sarahw", twitterProfile: "sarahw", tiktokProfile: "sarahw",
    medical: { genotype: "AA", bloodGroup: "B+", pregnancyExperience: false, numberOfChildren: 0, ceasareanSection: false, hasAllergies: false, allergies: [], hasChronicIllness: false, takesMedication: false, medications: [], hadSurgery: false, surgeries: [], hasDisability: false, disabilities: [], hadMiscarriage: false, numberOfMiscarriages: 0 },
    isAvailable: true, termsAcceptedAt: "2025-01-01",
    user: { id: "user-mock-3", email: "sarah@example.com", role: "SURROGATE", isVerified: true, isApproved: true, createdAt: "2025-01-01", updatedAt: "2025-01-01", isOnline: true, lastSeen: "2026-06-07", kycStatus: "verified", referralCode: "SARAH789" },
    wallet: { id: "w3", userId: "surr-mock-3", balance: 0, currency: "NGN" },
  },
  "surr-mock-4": {
    id: "surr-mock-4",
    firstName: "Grace", lastName: "Okonkwo", userName: "graceo",
    profilePicture: "https://ui-avatars.com/api/?name=Grace+Okonkwo&background=0E0E55&color=fff&size=400",
    countryOfResidence: "Nigeria", stateOfResidence: "Lagos", lga: "Lagos Island",
    aboutMe: "Healthy and motivated surrogate with a successful previous journey.",
    dateOfBirth: "1994-09-10", age: 30,
    maritalStatus: "Married", height: "168", weight: "63",
    phone1: "+2348044444444", phone2: null, emergencyContactPhone: null,
    facebookProfile: "graceo", instagramProfile: "graceo", twitterProfile: "graceo", tiktokProfile: "graceo",
    medical: { genotype: "AA", bloodGroup: "AB+", pregnancyExperience: true, numberOfChildren: 2, ceasareanSection: true, numberOfCs: 1, hasAllergies: false, allergies: [], hasChronicIllness: false, takesMedication: false, medications: [], hadSurgery: false, surgeries: [], hasDisability: false, disabilities: [], hadMiscarriage: false, numberOfMiscarriages: 0 },
    isAvailable: true, termsAcceptedAt: "2025-01-01",
    user: { id: "user-mock-4", email: "grace@example.com", role: "SURROGATE", isVerified: true, isApproved: true, createdAt: "2025-01-01", updatedAt: "2025-01-01", isOnline: true, lastSeen: "2026-06-07", kycStatus: "verified", referralCode: "GRACE000" },
    wallet: { id: "w4", userId: "surr-mock-4", balance: 0, currency: "NGN" },
  },
  "surr-mock-5": {
    id: "surr-mock-5",
    firstName: "Fatima", lastName: "Ibrahim", userName: "fatimai",
    profilePicture: "https://ui-avatars.com/api/?name=Fatima+Ibrahim&background=0E0E55&color=fff&size=400",
    countryOfResidence: "Nigeria", stateOfResidence: "Kaduna", lga: "Kaduna South",
    aboutMe: "Caring surrogate dedicated to bringing joy to intended parents.",
    dateOfBirth: "1997-05-20", age: 27,
    maritalStatus: "Single", height: "160", weight: "55",
    phone1: "+2348055555555", phone2: null, emergencyContactPhone: null,
    facebookProfile: "fatimai", instagramProfile: "fatimai", twitterProfile: "fatimai", tiktokProfile: "fatimai",
    medical: { genotype: "AS", bloodGroup: "O-", pregnancyExperience: false, numberOfChildren: 0, ceasareanSection: false, hasAllergies: false, allergies: [], hasChronicIllness: false, takesMedication: false, medications: [], hadSurgery: false, surgeries: [], hasDisability: false, disabilities: [], hadMiscarriage: false, numberOfMiscarriages: 0 },
    isAvailable: true, termsAcceptedAt: "2025-01-01",
    user: { id: "user-mock-5", email: "fatima@example.com", role: "SURROGATE", isVerified: true, isApproved: true, createdAt: "2025-01-01", updatedAt: "2025-01-01", isOnline: true, lastSeen: "2026-06-07", kycStatus: "verified", referralCode: "FATIMA111" },
    wallet: { id: "w5", userId: "surr-mock-5", balance: 0, currency: "NGN" },
  },
  "agent-mock-1": {
    id: "agent-mock-1", userId: "user-agent-1",
    fullName: "Jane Doe", userName: "janedoe",
    profilePicture: "https://ui-avatars.com/api/?name=Jane+Doe&background=0E0E55&color=fff&size=400",
    country: "Nigeria", city: "Lagos",
    age: 34, dateOfBirth: "1990-01-01",
    about: "Experienced agent dedicated to helping families find the perfect surrogate match.",
    phone1: "+2348011111111", phone2: null, emergencyPhone: null,
    facebookProfile: "janedoe", instagramProfile: "janedoe", twitterProfile: "janedoe",
    performance: { matches: 15, rating: 4.5, responseTime: "2h", activeCases: 3 },
    additionalDetails: { languages: ["English", "Yoruba"], experience: "5 years", coverage: "Nigeria" },
    services: ["Matching Guidance", "Legal Coordination", "Emotional Support"],
    certifications: [{ title: "Certified Surrogacy Specialist", status: "Verified" }],
    compensation: 50000, negotiable: true,
    wallet: { id: "w1", userId: "agent-mock-1", balance: 0, currency: "NGN" },
  },
  "agent-mock-2": {
    id: "agent-mock-2", userId: "user-agent-2",
    fullName: "Mary Ann", userName: "maryann",
    profilePicture: "https://ui-avatars.com/api/?name=Mary+Ann&background=0E0E55&color=fff&size=400",
    country: "Nigeria", city: "Abuja",
    age: 36, dateOfBirth: "1988-06-15",
    about: "Compassionate agent with 5+ years of surrogacy coordination experience.",
    phone1: "+2348022222222", phone2: null, emergencyPhone: null,
    facebookProfile: "maryann", instagramProfile: "maryann", twitterProfile: "maryann",
    performance: { matches: 22, rating: 4.8, responseTime: "1h", activeCases: 5 },
    additionalDetails: { languages: ["English", "Hausa"], experience: "7 years", coverage: "Nigeria" },
    services: ["Matching Guidance", "Legal Coordination"],
    certifications: [{ title: "Senior Surrogacy Coordinator", status: "Verified" }],
    compensation: 60000, negotiable: true,
    wallet: { id: "w2", userId: "agent-mock-2", balance: 0, currency: "NGN" },
  },
  "agent-mock-3": {
    id: "agent-mock-3", userId: "user-agent-3",
    fullName: "Sarah Williams", userName: "sarahw",
    profilePicture: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0E0E55&color=fff&size=400",
    country: "Nigeria", city: "Port Harcourt",
    age: 32, dateOfBirth: "1992-03-22",
    about: "Professional agent specializing in international surrogacy arrangements.",
    phone1: "+2348033333333", phone2: null, emergencyPhone: null,
    facebookProfile: "sarahw", instagramProfile: "sarahw", twitterProfile: "sarahw",
    performance: { matches: 10, rating: 4.2, responseTime: "3h", activeCases: 2 },
    additionalDetails: { languages: ["English"], experience: "4 years", coverage: "International" },
    services: ["Matching Guidance", "Legal Coordination", "International Coordination"],
    certifications: [{ title: "International Surrogacy Specialist", status: "Verified" }],
    compensation: 75000, negotiable: true,
    wallet: { id: "w3", userId: "agent-mock-3", balance: 0, currency: "NGN" },
  },
  "agent-mock-4": {
    id: "agent-mock-4", userId: "user-agent-4",
    fullName: "Chioma Okafor", userName: "chiomao",
    profilePicture: "https://ui-avatars.com/api/?name=Chioma+Okafor&background=0E0E55&color=fff&size=400",
    country: "Nigeria", city: "Lagos",
    age: 39, dateOfBirth: "1985-09-10",
    about: "Dedicated agent focused on ethical matching and supporting intended parents throughout their journey.",
    phone1: "+2348066666666", phone2: null, emergencyPhone: null,
    facebookProfile: "chiomao", instagramProfile: "chiomao", twitterProfile: "chiomao",
    performance: { matches: 30, rating: 4.9, responseTime: "30m", activeCases: 7 },
    additionalDetails: { languages: ["English", "Igbo", "Yoruba"], experience: "10 years", coverage: "Nigeria & International" },
    services: ["Matching Guidance", "Legal Coordination", "Emotional Support", "Progress Tracking"],
    certifications: [{ title: "Master Surrogacy Consultant", status: "Verified" }, { title: "Ethical Matching Specialist", status: "Verified" }],
    compensation: 80000, negotiable: false,
    wallet: { id: "w4", userId: "agent-mock-4", balance: 0, currency: "NGN" },
  },
  "agent-mock-5": {
    id: "agent-mock-5", userId: "user-agent-5",
    fullName: "Emeka Nwosu", userName: "emekan",
    profilePicture: "https://ui-avatars.com/api/?name=Emeka+Nwosu&background=0E0E55&color=fff&size=400",
    country: "Nigeria", city: "Abuja",
    age: 42, dateOfBirth: "1982-12-05",
    about: "Certified agent with expertise in cross-border surrogacy coordination and legal navigation.",
    phone1: "+2348077777777", phone2: null, emergencyPhone: null,
    facebookProfile: "emekan", instagramProfile: "emekan", twitterProfile: "emekan",
    performance: { matches: 18, rating: 4.6, responseTime: "1.5h", activeCases: 4 },
    additionalDetails: { languages: ["English", "Igbo", "Hausa"], experience: "8 years", coverage: "Nigeria & West Africa" },
    services: ["Matching Guidance", "Legal Coordination", "Cross-border Coordination"],
    certifications: [{ title: "Cross-border Surrogacy Expert", status: "Verified" }],
    compensation: 70000, negotiable: true,
    wallet: { id: "w5", userId: "agent-mock-5", balance: 0, currency: "NGN" },
  },
};

export const getSurrogateById = (id: string) => {
  console.log(`[Surrogates] GET /surrogates/${id}`);
  if (MOCK_PROFILES[id]) {
    return Promise.resolve({ data: { profile: MOCK_PROFILES[id] } });
  }
  return authenticatedGet(`/surrogates/${id}`);
};

export const createSurrogateProfile = (data: any) =>
  authenticatedPost("/surrogates/profile", data);

export const updateSurrogateProfile = (data: any) =>
  authenticatedPatch("/surrogates/profile", data);

export const getSurrogateProfile = async () => {
  const res = await authenticatedGet("/surrogates/profile/me");
  console.log("RAW getSurrogateProfile response:", JSON.stringify(res, null, 2));
  return res;
};

export const updateMedicalProfile = (data: any) =>
  authenticatedPatch("/surrogates/profile/medical", data);

export const uploadEndometriumImage = async (data: any) => {
  const res = await authenticatedPatch("/surrogates/profile/medical/upload-endometrium", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("[profileApi] uploadEndometriumImage response:", JSON.stringify(res, null, 2));
  return res;
};

// ----------------------------------------------------
// AVATAR UPLOAD
// ----------------------------------------------------
export const uploadAvatar = async (data: any) => {
  const response = await httpClient.post("/profiles/avatar", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// ----------------------------------------------------
// AGENTS
// ----------------------------------------------------
export const getAllAgents = () => authenticatedGet(`/agents`);

export const getAgentById = (id: string) => {
  console.log(`[Agents] GET /agents/${id}`);
  if (MOCK_PROFILES[id]) {
    return Promise.resolve({ data: MOCK_PROFILES[id] });
  }
  return authenticatedGet(`/agents/${id}`);
};

export const createAgentProfile = (data: any) =>
  authenticatedPost("/agents/profile", data);

export const updateAgentProfile = (data: any) =>
  authenticatedPatch("/agents/profile", data);

export const getAgentProfile = () => authenticatedGet("/agents/profile/me");

// ----------------------------------------------------
// PARENTS
// ----------------------------------------------------
export const createParentProfile = (data: any) =>
  authenticatedPost("/intended-parents/profile", data);

export const updateParentProfile = (data: any) =>
  authenticatedPatch("/intended-parents/profile", data);

export const updateParentSurrogateMatch = (data: any) =>
  authenticatedPut("/intended-parents/match-preferences", data);

export const fetchParentMatch = (data: any) =>
  authenticatedGet("/intended-parents/matches", { params: data });

export const saveParentSurrogateMatch = (data: any) =>
  authenticatedPost("/intended-parents/save", data);

export const GetsavedParentSurrogateMatch = (data: any) =>
  authenticatedGet("/intended-parents/saved", { params: data });

export const updateParentMatchPreference = (data: any) =>
  authenticatedPost("/intended-parents/match-preferences", data);

export const getParentProfile = () =>
  authenticatedGet("/intended-parents/profile/me");

// Legacy wrapper for backward compatibility (remove after updating all usages)
export const makeAuthenticatedProfileRequest = async (
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  data?: any,
) => {
  console.warn(
    "[profileApi] makeAuthenticatedProfileRequest is deprecated. Use authenticatedGet/Post/Put/Delete directly.",
  );

  switch (method) {
    case "GET":
      return authenticatedGet(endpoint, data ? { params: data } : undefined);
    case "POST":
      return authenticatedPost(endpoint, data);
    case "PATCH":
    case "PUT":
      return authenticatedPut(endpoint, data);
    case "DELETE":
      return authenticatedDelete(endpoint);
  }
};
