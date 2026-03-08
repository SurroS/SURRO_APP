import { secureGet } from "@/utils/storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8081";

const profileApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------
// AUTH WRAPPER
// ----------------------------------------------------
export const makeAuthenticatedProfileRequest = async (
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  data?: any
) => {
  const token = await secureGet("auth_token");

  if (!token) {
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
  }
};

// ----------------------------------------------------
// LEGACY ROLE ENDPOINT (KEEP, but DO NOT USE for UI)
// ----------------------------------------------------
export type UserRole = "SURROGATE" | "INTENDED_PARENT" | "AGENT";

export const getUsersByRole = (role: UserRole) =>
  makeAuthenticatedProfileRequest("GET", `/users/by-role/${role}`);

// ----------------------------------------------------
// GENERIC USER
// ----------------------------------------------------
export const getUserById = (userId: string) =>
  makeAuthenticatedProfileRequest("GET", `/users/${userId}`);

// ----------------------------------------------------
// SURROGATES
// ----------------------------------------------------
export const getAllSurrogates = () =>
  makeAuthenticatedProfileRequest("GET", "/surrogates");

export const getSurrogateById = (id: string) =>
  makeAuthenticatedProfileRequest("GET", `/surrogates/${id}`);

export const createSurrogateProfile = (d: any) =>
  makeAuthenticatedProfileRequest("POST", "/surrogates/profile", d);

export const updateSurrogateProfile = (d: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/surrogates/profile", d);

export const getSurrogateProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/surrogates/profile/me");
export const updateMedicalProfile = (data:any) =>
  makeAuthenticatedProfileRequest("PATCH", "/surrogates/profile/medical");
export const uploadEndometriumImage = (data:any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/surrogates/profile/medical/upload-endometrium"
  );
// ----------------------------------------------------
// AGENTS
// ----------------------------------------------------
export const getAllAgents = () =>
  makeAuthenticatedProfileRequest("GET", `/agents`);

export const getAgentById = (id: string) =>
  makeAuthenticatedProfileRequest("GET", `/agents/${id}`);

export const createAgentProfile = (d: any) =>
  makeAuthenticatedProfileRequest("POST", "/agents/profile", d);

export const updateAgentProfile = (d: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/agents/profile", d);

export const getAgentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/agents/profile");

// ----------------------------------------------------
// PARENTS
// ----------------------------------------------------
export const createParentProfile = (d: any) =>
  makeAuthenticatedProfileRequest("POST", "/intended-parents/profile", d);

export const updateParentProfile = (d: any) =>
  makeAuthenticatedProfileRequest("PATCH", "/intended-parents/profile", d);

export const updateParentSurrogateMatch = (d: any) =>
  makeAuthenticatedProfileRequest(
    "PATCH",
    "/intended-parents/match-preferences",
    d
  );
export const fetchParentMatch = (d: any) =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/matches", d);

export const saveParentSurrogateMatch = (d: any) =>
  makeAuthenticatedProfileRequest("POST", "/intended-parents/save", d);
export const GetsavedParentSurrogateMatch = (d: any) =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/saved", d);

export const updateParentMatchPreference = (d: any) =>
  makeAuthenticatedProfileRequest(
    "POST",
    "/intended-parents/match-preferences",
    d
  );

export const getParentProfile = () =>
  makeAuthenticatedProfileRequest("GET", "/intended-parents/profile/me");

export default profileApi;
