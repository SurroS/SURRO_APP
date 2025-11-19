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

export const getAgentList = () => {getUsersByRole("AGENT")};
export const getParentList = () => getUsersByRole("INTENDED_PARENT");
export const getSurrogateList = () => getUsersByRole("SURROGATE");

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
export const createAgentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("POST", "/agents/profile", profileData);

export const updateAgentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/agents/profile", profileData);

export const getAgentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/agents/profile/me");

// ----------------------------------------------------
// PARENT (INTENDED PARENTS)
// ----------------------------------------------------
export const createParentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/profile",
    profileData
  );

export const updateParentProfile = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/intended-parents/match",
    profileData
  );

  export const saveParentSurrogate = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/save",
    profileData
  );
export const updateParentMatchPreference = (profileData: any) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/match-preferences",
    profileData
  );

export const getParentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/parents/profile/me");

export default profileApi;
