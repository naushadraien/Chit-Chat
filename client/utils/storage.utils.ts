import AsyncStorage from "@react-native-async-storage/async-storage";

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
