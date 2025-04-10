import { envs } from "@/config/envs";
import { storageEventEmitter } from "@/events/event.emitter";
import { showToast } from "@/providers/ToastProvider";
import axios from "axios";
import { router } from "expo-router";
import {
  ACCESS_TOKEN_KEY,
  PUSH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_DEVICE_ID,
} from "../constants/AsyncStorage";
import { clearUserDetails } from "./auth.utils";
import { safeAsyncStorage } from "./storage.utils";

// Token functions
export const setTokensToAsyncStorage = async (tokens: {
  accessToken: string;
  refreshToken?: string;
}) => {
  await safeAsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    await safeAsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  // Notify app about token update
  storageEventEmitter.emit("storageUpdate", {
    token: tokens.accessToken,
  });
};

export const clearTokensFromAsyncStorage = async () => {
  await Promise.all([
    safeAsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    safeAsyncStorage.removeItem(REFRESH_TOKEN_KEY),
  ]);
};

export const getTokensFromAsyncStorage = async (): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> => {
  const [accessToken, refreshToken] = await Promise.all([
    safeAsyncStorage.getItem<string>(ACCESS_TOKEN_KEY),
    safeAsyncStorage.getItem<string>(REFRESH_TOKEN_KEY),
  ]);

  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
};

export const refreshAccessToken = async (clearAxiosConfig: () => void) => {
  try {
    const tokens = await getTokensFromAsyncStorage();
    if (!tokens?.refreshToken) {
      showToast({ type: "error", text1: "No refresh token available" });
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${envs.BACKEND_URL}/auth/access/refresh-token`,
      { refreshToken: tokens.refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data.data;
      await setTokensToAsyncStorage({ ...tokens, accessToken, refreshToken });
      return accessToken;
    } else {
      showToast({ type: "error", text1: "Failed to refresh access token" });
      throw new Error("Failed to refresh access token");
    }
  } catch (error) {
    showToast({
      type: "error",
      text1: "Refresh token is invalid. Logging out...",
    });
    await clearTokensFromAsyncStorage();
    await clearUserDetails();
    clearAxiosConfig();
    router.replace("/start-up");
    throw error;
  }
};

// Device and push token functions
export const setDeviceIdToAsyncStorage = async (deviceId: string) =>
  safeAsyncStorage.setItem(USER_DEVICE_ID, deviceId);

export const setPushTokenToAsyncStorage = async (pushToken: string) =>
  safeAsyncStorage.setItem(PUSH_TOKEN_KEY, pushToken);

export const getDeviceIdFromAsyncStorage = async (): Promise<{
  deviceId: string;
} | null> => {
  const deviceId = await safeAsyncStorage.getItem<string>(USER_DEVICE_ID);
  return deviceId ? { deviceId } : null;
};

export const getPushTokenFromAsyncStorage = async (): Promise<{
  pushToken: string;
} | null> => {
  const pushToken = await safeAsyncStorage.getItem<string>(PUSH_TOKEN_KEY);
  return pushToken ? { pushToken } : null;
};
