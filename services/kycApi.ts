import { authenticatedGet } from "./httpClient";
import httpClient from "./httpClient";
import { KYCSubmitResponse } from "@/types/kyc";

/**
 * Submit KYC documents (ID front and optional back)
 * @param idFront - Front side of ID document (required)
 * @param idBack - Back side of ID document (optional)
 * @param faceScan - Face scan/selfie image (optional)
 * @param idType - Type of ID document (national_id, drivers_license, passport)
 * @returns KYC submission response
 */
export const submitKYC = async (
  idFront: { uri: string; type: string; name: string },
  idBack?: { uri: string; type: string; name: string },
  faceScan?: { uri: string; type: string; name: string },
  idType?: string,
): Promise<KYCSubmitResponse> => {
  const formData = new FormData();

  formData.append("idFront", {
    uri: idFront.uri,
    type: idFront.type || "image/jpeg",
    name: idFront.name || "idFront.jpg",
  } as any);

  if (idBack) {
    formData.append("idBack", {
      uri: idBack.uri,
      type: idBack.type || "image/jpeg",
      name: idBack.name || "idBack.jpg",
    } as any);
  }

  if (faceScan) {
    formData.append("faceScan", {
      uri: faceScan.uri,
      type: faceScan.type || "image/jpeg",
      name: faceScan.name || "faceScan.jpg",
    } as any);
  }

  if (idType) {
    formData.append("idType", idType);
  }

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


