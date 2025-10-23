import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";


const APP_ENV = Constants.expoConfig?.extra?.appEnv || process.env.EXPO_PUBLIC_APP_ENV || "development";

// Check if we're in dev mode (Expo Go or local)
const isDev = __DEV__ || APP_ENV === "development";

// Use AsyncStorage in dev for easier debugging
const Storage = {
  async setItem(key: string, value: string) {
    try {
      if (isDev) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Storage setItem error:", error);
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
      console.error("Storage getItem error:", error);
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
      console.error("Storage removeItem error:", error);
    }
  },
};

export default Storage;
