import { UserDetails } from "@/types";
import { USER_KEY } from "../constants/AsyncStorage";
import { safeAsyncStorage } from "./storage.utils";

export const setUsersToAsyncStorage = async (user: UserDetails) => {
  try {
    if (user) {
      await safeAsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error("Error setting user details:", error);
  }
};

export const clearUserDetails = async () => {
  await safeAsyncStorage.removeItem(USER_KEY);
};

export const getUserDetailsFromAsyncStorage =
  async (): Promise<UserDetails | null> => {
    const userJson = await safeAsyncStorage.getItem<string>(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserDetails;
      } catch (error) {
        console.error("Error parsing user details:", error);
        return null;
      }
    }
    return null;
  };
