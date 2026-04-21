import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { secureGet } from "@/utils/storage";
import { APIErrorCode } from "@/types/api";

export interface APIError extends Error {
  name: "APIError";
  message: string;
  code: APIErrorCode;
  status?: number;
  details?: any;
}

// Create axios instance with default config
const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for authentication
httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Always add auth token if available
    try {
      const token = await secureGet("auth_token");
      console.log("🔒 AccessToken:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("[httpClient] Failed to get auth token:", error);
    }

    console.log(`[httpClient] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[httpClient] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error("[httpClient] Response error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Show toast for network errors
    if (!error.response) {
      const { Toast } = require("toastify-react-native");
      Toast.show({
        text1: "Network error",
        text2: "Please check your internet connection",
        type: "customError",
      });
    }

    // Create standardized error
    const apiError: APIError = {
      name: "APIError",
      message:
        error.response?.data?.message || error.message || "An error occurred",
      code: (error.response?.data?.code as APIErrorCode) || "UNKNOWN_ERROR",
      status: error.response?.status,
      details: error.response?.data,
    };

    return Promise.reject(apiError);
  },
);

// Helper functions for common HTTP methods
export const authenticatedGet = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.get(endpoint, config);
  return response.data;
};

export const authenticatedPost = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.post(endpoint, data, config);
  return response.data;
};

export const authenticatedPut = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.put(endpoint, data, config);
  return response.data;
};

export const authenticatedPatch = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.patch(endpoint, data, config);
  return response.data;
};

export const authenticatedDelete = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.delete(endpoint, config);
  return response.data;
};

export const publicGet = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.get(endpoint, config);
  return response.data;
};

export const publicPost = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await httpClient.post(endpoint, data, config);
  return response.data;
};

export default httpClient;
