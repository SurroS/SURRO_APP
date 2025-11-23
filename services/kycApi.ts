import { secureGet } from '@/utils/storage';
import axios from 'axios';
import { KYCSubmitResponse } from '@/types/kyc';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

const kycApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for authenticated requests
export const makeAuthenticatedKYCRequest = async (
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
) => {
  const token = await secureGet('auth_token');

  if (!token) {
    throw new Error('No authentication token available');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  switch (method) {
    case 'GET':
      return kycApi.get(endpoint, config);
    case 'POST':
      return kycApi.post(endpoint, data, config);
    case 'PATCH':
      return kycApi.patch(endpoint, data, config);
    case 'PUT':
      return kycApi.put(endpoint, data, config);
    case 'DELETE':
      return kycApi.delete(endpoint, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

/**
 * Submit KYC documents (ID front and optional back)
 * @param idFront - Front side of ID document (required)
 * @param idBack - Back side of ID document (optional)
 * @returns KYC submission response
 */
export const submitKYC = async (
  idFront: { uri: string; type: string; name: string },
  idBack?: { uri: string; type: string; name: string }
): Promise<KYCSubmitResponse> => {
  const token = await secureGet('auth_token');

  if (!token) {
    throw new Error('No authentication token available');
  }

  // Create FormData for multipart/form-data
  const formData = new FormData();

  // Append front ID image (required)
  formData.append('idFront', {
    uri: idFront.uri,
    type: idFront.type || 'image/jpeg',
    name: idFront.name || 'idFront.jpg',
  } as any);

  // Append back ID image (optional)
  if (idBack) {
    formData.append('idBack', {
      uri: idBack.uri,
      type: idBack.type || 'image/jpeg',
      name: idBack.name || 'idBack.jpg',
    } as any);
  }

  const response = await kycApi.post('/api/v1/kyc/submit', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Get current KYC status
 */
export const getKYCStatus = async () => {
  return makeAuthenticatedKYCRequest('GET', '/api/v1/kyc/status');
};

export default kycApi;

