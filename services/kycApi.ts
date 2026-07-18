import { authenticatedGet } from "./httpClient";
import httpClient from "./httpClient";
import { KYCSubmitResponse } from "@/types/kyc";

/**
 * Submit KYC documents (ID front and optional back)
 * @param idFront - Front side of ID document (required)
 * @param idBack - Back side of ID document (optional)
 * @param faceScan - Face scan/selfie image (optional)
 * @returns KYC submission response
 */
export const submitKYC = async (
  idFront: { uri: string; type: string; name: string },
  idBack?: { uri: string; type: string; name: string },
  faceScan?: { uri: string; type: string; name: string },
): Promise<KYCSubmitResponse> => {
  // Create FormData for multipart/form-data
  const formData = new FormData();

  // Append front ID image (required)
  formData.append("idFront", {
    uri: idFront.uri,
    type: idFront.type || "image/jpeg",
    name: idFront.name || "idFront.jpg",
  } as any);

  // Append back ID image (optional)
  if (idBack) {
    formData.append("idBack", {
      uri: idBack.uri,
      type: idBack.type || "image/jpeg",
      name: idBack.name || "idBack.jpg",
    } as any);
  }

  // Append face scan image (optional)
  if (faceScan) {
    formData.append("faceScan", {
      uri: faceScan.uri,
      type: faceScan.type || "image/jpeg",
      name: faceScan.name || "faceScan.jpg",
    } as any);
  }

  // Use httpClient directly for multipart/form-data (bypasses JSON Content-Type)
  const response = await httpClient.post("/kyc/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Get current KYC status
 */
export const getKYCStatus = async () => {
  return authenticatedGet("/kyc/status");
};


