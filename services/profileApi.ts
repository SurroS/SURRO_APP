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
export const getAllSurrogates = () => getUsersByRole("SURROGATE");

export const getSurrogatesList = () =>
  authenticatedGet("/surrogates");

export const getSurrogateById = async (id: string) => {
  console.log(`[Surrogates] GET /users/${id}`);
  const user = await getUserById(id);
  return { data: { profile: user } };
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
export const getAllAgents = () => getUsersByRole("AGENT");

export const getAgentById = async (id: string) => {
  console.log(`[Agents] GET /users/${id}`);
  const user = await getUserById(id);
  return { data: user };
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
