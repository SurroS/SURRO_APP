import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const APP_ENV =
  Constants.expoConfig?.extra?.appEnv ||
  process.env.EXPO_PUBLIC_APP_ENV ||
  "development";

const isDev = __DEV__ || APP_ENV === "development";

// ✅ Unified async storage layer compatible with Zustand persist
const Storage = {
  async setItem(key: string, value: string) {
    try {
      if (isDev) {
        await AsyncStorage.setItem(key, value);
      } else {
        // Expo SecureStore is keychain/keystore safe, but slower — keep async
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("[Storage] setItem error:", error);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (isDev) {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error("[Storage] getItem error:", error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      if (isDev) {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error("[Storage] removeItem error:", error);
    }
  },
};

// ✅ Ensure all 3 methods exist for Zustand
export default {
  setItem: Storage.setItem.bind(Storage),
  getItem: Storage.getItem.bind(Storage),
  removeItem: Storage.removeItem.bind(Storage),
};
