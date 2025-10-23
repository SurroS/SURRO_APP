// import * as SecureStore from 'expo-secure-store';

// export const secureSet = async (key: string, value: string) => {
//     try {
//         await SecureStore.setItemAsync(key, value);
//     } catch (error) {
//         console.error('Error setting secure storage:', error);
//     }
// };

// export const secureGet = async (key: string): Promise<string | null> => {
//     try {
//         return await SecureStore.getItemAsync(key);
//     } catch (error) {
//         console.error('Error getting secure storage:', error);
//         return null;
//     }
// };

// export const secureDelete = async (key: string) => {
//     try {
//         await SecureStore.deleteItemAsync(key);
//     } catch (error) {
//         console.error('Error deleting secure storage:', error);
//     }
// };

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const APP_ENV =
  Constants.expoConfig?.extra?.appEnv ||
  process.env.EXPO_PUBLIC_APP_ENV ||
  "development";

// Check if we're in dev mode (Expo Go or local)
const isDev = __DEV__ || APP_ENV === "development";

// Use AsyncStorage in dev for easier debugging

export const secureSet = async (key: string, value: string) => {
  try {
    if (isDev) {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("Storage setItem error:", error);
  }
};
export const secureGet = async (key: string): Promise<string | null> => {
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
};

export const secureDelete = async (key: string) => {
  try {
    if (isDev) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error("Storage removeItem error:", error);
  }
};
