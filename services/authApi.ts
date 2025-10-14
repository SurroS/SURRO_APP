import axios from 'axios';
import { secureGet } from '@/utils/storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makeAuthenticatedAuthRequest = async (
  token: string,
  endpoint: string,
  data: any
) => {
  return authApi.post(endpoint, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const authedRequest = async (endpoint: string, data: any) => {
  const token = await secureGet('auth_token')
  return authApi.post(endpoint, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export default authApi;
