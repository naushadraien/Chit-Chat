import { showToast } from "@/providers/ToastProvider";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export type MethodType =
  | "get"
  | "post"
  | "delete"
  | "patch"
  | "put"
  | "head"
  | "options";

/**
 * API request configuration options with proper typing
 */
export type ApiRequestConfig<TData = any> = {
  url: string;
  method: MethodType;
  data?: TData;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  /**
   * Silent mode prevents toast notifications (default: false)
   */
  silent?: boolean;
  /**
   * Log request details to console (default: false)
   */
  debug?: boolean;
  /**
   * Request timeout in milliseconds (default: inherited from axiosInstance)
   */
  timeout?: number;
};

/**
 * Industrial-grade API request wrapper for React Native applications
 * with standardized error handling and toast notifications
 *
 * @param config - Request configuration
 * @returns Promise with response data
 */
async function requestAPI<TResponse = any, TRequest = any>(
  config: ApiRequestConfig<TRequest>
): Promise<TResponse> {
  // Log request in debug mode
  if (config.debug) {
    console.group(
      `🌐 API Request: ${config.method.toUpperCase()} ${config.url}`
    );
    console.log("Headers:", config.headers || "Default headers");
    if (config.data) console.log("Payload:", config.data);
    if (config.params) console.log("Params:", config.params);
    console.groupEnd();
  }

  try {
    // Prepare request configuration
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers,
      timeout: config.timeout,
    };

    // Execute request
    const response: AxiosResponse = await axiosInstance(axiosConfig);

    // Extract and return data with consistent pattern
    return extractResponseData<TResponse>(response);
  } catch (error) {
    return handleApiError(error as Error | AxiosError, config);
  }
}

/**
 * Helper function to extract response data consistently
 */
function extractResponseData<T>(response: AxiosResponse): T {
  // Standard API response shape: { data: { data: actualData } }
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }
  // Alternative API response shape: { data: actualData }
  else if (response?.data !== undefined) {
    return response.data;
  }
  // Fallback for non-standard responses
  return response as unknown as T;
}

/**
 * Unified error handler for API requests
 */
function handleApiError(
  error: Error | AxiosError,
  config: ApiRequestConfig
): never {
  // Standard error message format
  let errorMessage = "An unexpected error occurred";
  let errorCode: number | undefined;

  if (axios.isAxiosError(error)) {
    // Network errors (no response)
    if (!error.response) {
      errorMessage = "Network error: Unable to connect to server";

      // Report network errors to analytics (if needed)
      // analytics.logEvent('network_error', { url: config.url });
    }
    // Server responded with error status
    else {
      errorCode = error.response.status;

      // Extract error message from response
      errorMessage =
        (error.response.data as any)?.message ||
        (error.response.data as any)?.error ||
        error.message ||
        `HTTP Error ${errorCode}`;

      // Skip 401 errors as they're handled by axios interceptors
      if (errorCode === 401) {
        if (!config.silent) {
          showToast({
            text1: errorMessage,
            type: "error",
          });
        }
        throw error;
      }

      // Classify by status code
      if (errorCode >= 500) {
        errorMessage = `Server Error: ${errorMessage}`;
      } else if (errorCode >= 400 && errorCode !== 401) {
        errorMessage = `Request Error: ${errorMessage}`;
      }
    }
  } else {
    // Non-axios errors
    errorMessage = error.message || errorMessage;
  }

  // Show toast unless silent mode is enabled
  if (!config.silent) {
    showToast({
      text1: errorMessage,
      type: "error",
    });
  }

  // Enrich error object for better debugging
  const enrichedError = new Error(errorMessage);
  enrichedError.name = errorCode ? `ApiError(${errorCode})` : "ApiError";

  /**
   * Extend the error object with additional contextual information to improve debugging
   * This adds API-specific details that aren't available in standard Error objects:
   * - originalError: Preserves the complete error chain for tracing
   * - endpoint: The API endpoint that was called
   * - method: The HTTP method used in the request
   * - statusCode: The HTTP status code returned by the server
   */
  Object.assign(enrichedError, {
    originalError: error,
    endpoint: config.url,
    method: config.method,
    statusCode: errorCode,
  });

  throw enrichedError;
}

/**
 * Utility to check if an error is an axios error (type guard)
 */
const axios = {
  isAxiosError(error: any): error is AxiosError {
    return error && error.isAxiosError === true;
  },
};

export default requestAPI;
