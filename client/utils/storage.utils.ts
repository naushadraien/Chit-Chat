import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const safeAsyncStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to AsyncStorage:`, error);
    }
  },

  getItem: async <T extends string>(key: string): Promise<T | null> => {
    try {
      return (await AsyncStorage.getItem(key)) as T | null;
    } catch (error) {
      console.error(`Error getting ${key} from AsyncStorage:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
    }
  },
};

export const expoSecureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to Expo Secure Store:`, error);
    }
  },

  getItem: async <T extends string>(key: string): Promise<T | null> => {
    try {
      return (await SecureStore.getItemAsync(key)) as T | null;
    } catch (error) {
      console.error(`Error getting ${key} from Expo Secure Store:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing ${key} from Expo Secure Store:`, error);
    }
  },
};
