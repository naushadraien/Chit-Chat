import { envs } from "@/config/envs";
import { showToast } from "@/providers/ToastProvider";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { router } from "expo-router";
import { clearUserDetails } from "../auth.utils";
import {
  clearTokensFromAsyncStorage,
  getDeviceIdFromAsyncStorage,
  getTokensFromAsyncStorage,
  refreshAccessToken,
} from "../token.utils";

// Extend AxiosResponse to include the 'ok' property
declare module "axios" {
  export interface AxiosResponse<T = any> {
    ok?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Token refresh state management
type RefreshSubscriber = (token: string) => void;
let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const addRefreshSubscriber = (callback: RefreshSubscriber): void => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Create Axios instance with base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL: envs.BACKEND_URL,
  timeout: 15000,
  headers: {
    //The Accept header tells the server what kind of response format your client can understand and prefers to receive.
    Accept: "application/json",
  },
});

// Clear Axios configuration
export const clearAxiosConfig = (): void => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

const logout = async () => {
  // Clean up and redirect
  await Promise.all([clearTokensFromAsyncStorage(), clearUserDetails()]);
  clearAxiosConfig();
  router.replace("/");
};

// Token refresh function
export const refreshToken = async ({
  originalRequest,
}: {
  originalRequest: InternalAxiosRequestConfig;
}): Promise<AxiosResponse> => {
  isRefreshing = true;

  try {
    const newAccessToken = await refreshAccessToken(clearAxiosConfig);

    // Update headers with new token
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${newAccessToken}`;

    // Process queued requests
    onRefreshed(newAccessToken);
    isRefreshing = false;

    // Update original request with new token
    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    return axiosInstance(originalRequest);
  } catch (error) {
    // Handle refresh failure
    showToast({
      type: "error",
      text1: "Session expired. Please log in again.",
    });

    // Reset state
    isRefreshing = false;
    refreshSubscribers = [];

    // Clean up and redirect
    await logout();

    return Promise.reject(error);
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const [tokens, userDeviceID] = await Promise.all([
        getTokensFromAsyncStorage(),
        getDeviceIdFromAsyncStorage(),
      ]);

      if (tokens?.accessToken) {
        config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
      }

      if (userDeviceID?.deviceId) {
        config.headers["X-Device-Id"] = userDeviceID.deviceId;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    response.ok = response.status >= 200 && response.status < 300;
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401) {
      const errorType = (error.response?.data as any)?.errorType;
      const shouldRelogin = (error.response?.data as any)?.shouldRelogin;

      if (errorType === "token_expired" && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          // Wait for token refresh if it's already in progress
          return new Promise((resolve) => {
            addRefreshSubscriber((token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }
        return refreshToken({ originalRequest });
      }

      if (shouldRelogin) {
        await logout();
      }
    }

    // Handle network errors
    if (error.message === "Network Error") {
      showToast({
        type: "error",
        text1: "No internet connection. Please check your network.",
      });
    }

    return Promise.reject(error);
  }
);

// Set Authorization header
export const setAuthorizationHeader = (token: string = ""): void => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Set base URL
export const setAxiosInstanceBaseURL = (baseURL: string): void => {
  axiosInstance.defaults.baseURL = baseURL;
};

export default axiosInstance;
