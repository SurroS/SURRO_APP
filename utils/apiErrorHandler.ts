import { APIError } from "@/services/httpClient";
import { APIErrorCode } from "@/types/api";

/**
 * Explains axios errors in a user-friendly way
 * @param error - The error from an axios request
 * @returns A user-friendly error message
 */
export const explainAxiosError = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // If it's already our APIError format
  if (error.code && error.message) {
    return error.message;
  }

  // Handle axios errors
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data?.message || "Invalid request. Please check your input.";
      case 401:
        return "Authentication failed. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return data?.message || "A conflict occurred. Please try again.";
      case 422:
        return data?.message || "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
      case 504:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return data?.message || `An error occurred (${status})`;
    }
  }

  // Handle network errors
  if (
    error.code === "NETWORK_ERROR" ||
    error.message?.includes("Network Error")
  ) {
    return "Network connection failed. Please check your internet connection.";
  }

  // Handle timeout errors
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Fallback
  return error.message || "An unexpected error occurred";
};

/**
 * Creates a standardized APIError
 * @param message - Error message
 * @param code - Error code
 * @param status - HTTP status code
 * @param details - Additional error details
 * @returns APIError instance
 */
export const createAPIError = (
  message: string,
  code: APIErrorCode = "UNKNOWN_ERROR",
  status?: number,
  details?: any,
): APIError => {
  const error = new Error(message) as APIError;
  error.name = "APIError";
  error.code = code;
  error.status = status;
  error.details = details;
  return error;
};

/**
 * Checks if an error is an APIError
 * @param error - The error to check
 * @returns True if the error is an APIError
 */
export const isAPIError = (error: any): error is APIError => {
  return error && error.name === "APIError";
};
