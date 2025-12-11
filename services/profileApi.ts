import { secureGet } from "@/utils/storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8081";

const profileApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type UserRole = "SURROGATE" | "INTENDED_PARENT" | "AGENT";

export const getUsersByRole = (role: UserRole) =>
  makeAuthenticatedProfileRequest("GET", `/users/by-role/${role}`);
// ---- AUTH REQUEST WRAPPER ----
export const makeAuthenticatedProfileRequest = async (
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  data?: any
) => {
  const token = await secureGet("auth_token");

  if (!token) {
    console.warn("No token found in SecureStore — user might be logged out.");
    throw new Error("Authentication token missing.");
  }

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  switch (method) {
    case "GET":
      return profileApi.get(endpoint, config);
    case "POST":
      return profileApi.post(endpoint, data, config);
    case "PATCH":
      return profileApi.patch(endpoint, data, config);
    case "PUT":
      return profileApi.put(endpoint, data, config);
    case "DELETE":
      return profileApi.delete(endpoint, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// ----------------------------------------------------
// SURROGATE
// ----------------------------------------------------
export const createSurrogateProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("POST", "/surrogates/profile", profileData);

export const updateSurrogateProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/surrogates/profile", profileData);

export const getSurrogateProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/surrogates/profile/me");

// → Medical update
export const updateMedicalProfile = (medicalData: any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/surrogates/profile/medical",
    medicalData
  );

// → File upload
export const uploadEndometriumImage = async (imageData: FormData) => {
  const token = await secureGet("auth_token");

  return profileApi.patch(
    "/surrogates/profile/medical/upload-endometrium",
    imageData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ----------------------------------------------------
//  AGENT
// ----------------------------------------------------

// POST /agents/profile - Create agent profile
export const createAgentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("POST", "/agents/profile", profileData);

// GET /agents/profile - Get current logged-in Agent Profile
export const getAgentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/agents/profile");

// PATCH /agents/profile - Update Agent Profile details
export const updateAgentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/agents/profile", profileData);

// GET /agents - List all available agents
export const getAllAgents = () =>
  makeAuthenticatedProfileRequest("GET", "/agents");

// GET /agents/{id} - Get a specific agent by Profile ID
export const getAgentById = (agentId: string) =>
  makeAuthenticatedProfileRequest("GET", `/agents/${agentId}`);

// ----------------------------------------------------
// PARENT (INTENDED PARENTS)
// ----------------------------------------------------

// POST /intended-parents/profile - Submit intended parent profile
export const createParentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/profile",
    profileData
  );

// PATCH /intended-parents/profile - Update intended parent profile (partial update)
export const updateParentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/intended-parents/profile",
    profileData
  );

// GET /intended-parents/profile/me - Get current intended parent profile
export const getParentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/profile/me");

// PATCH /intended-parents/match-preferences - Update match preferences
export const updateParentMatchPreference = (preferenceData: any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/intended-parents/match-preferences",
    preferenceData
  );

// GET /intended-parents/matches - Get surrogate matches for intended parent
export const getParentMatches = () =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/matches");

// POST /intended-parents/save - Save a surrogate to favorites
export const saveParentSurrogate = (surrogateData: { surrogateId: string }) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/save",
    surrogateData
  );

// DELETE /intended-parents/save/{id} - Remove a saved surrogate
export const removeSavedSurrogate = (surrogateId: string) =>
  makeAuthenticatedProfileRequest(
    "DELETE",
    `/intended-parents/save/${surrogateId}`
  );

// GET /intended-parents/saved - Get all saved surrogates
export const getSavedSurrogates = () =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/saved");

export default profileApi;
