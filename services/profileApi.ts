import { secureGet } from '@/utils/storage';
import axios from 'axios';

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

const profileApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function for authenticated requests
export const makeAuthenticatedProfileRequest = async (
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
) => {
  const token = await secureGet('auth_token');

  if (!token) {
    console.warn('No token found in SecureStore — user might be logged out.');
    throw new Error('Authentication token missing.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  switch (method) {
    case 'GET':
      return profileApi.get(endpoint, config);
    case 'POST':
      return profileApi.post(endpoint, data, config);
    case 'PATCH':
      return profileApi.patch(endpoint, data, config);
    case 'PUT':
      return profileApi.put(endpoint, data, config);
    case 'DELETE':
      return profileApi.delete(endpoint, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};


// Profile API functions
export const createSurrogateProfile = async (
    // token: string,
    profileData: any
) => {
    return makeAuthenticatedProfileRequest(
        // token,
        'POST',
        '/surrogates/profile',
        profileData
    );
};

export const updateSurrogateProfile = async (
    // token: string,
    profileData: any
) => {
    return makeAuthenticatedProfileRequest(
        // token,
        'PATCH',
        '/surrogates/profile',
        profileData
    );
};

export const getSurrogateProfile = async () => {
    return makeAuthenticatedProfileRequest(
        // token,
        'GET',
        '/surrogates/profile/me'
    );
};

export const updateMedicalProfile = async (
    // token: string,
    medicalData: any
) => {
    return makeAuthenticatedProfileRequest(
        // token,
        'PATCH',
        '/surrogates/profile/medical',
        medicalData
    );
};

export const uploadEndometriumImage = async (
    // token: string,
    imageData: FormData
) => {
    const token = await secureGet('auth_token')
    return profileApi.patch(
        '/surrogates/profile/medical/upload-endometrium',
        imageData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};

export default profileApi;
