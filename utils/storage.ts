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

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ENV = process.env.APP_ENV ?? "development";

const getStorageEngine = () => {
  if (ENV === "production") {
    return {
      getItem: async (key: string) => {
        try {
          const value = await SecureStore.getItemAsync(key);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error("[SecureStore:getItem]", error);
          return null;
        }
      },
      setItem: async (key: string, value: any) => {
        try {
          await SecureStore.setItemAsync(key, JSON.stringify(value));
        } catch (error) {
          console.error("[SecureStore:setItem]", error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.error("[SecureStore:removeItem]", error);
        }
      },
    };
  } else {
    // Use AsyncStorage for dev / preview to persist data easily between builds
    return {
      getItem: async (key: string) => {
        try {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error("[AsyncStorage:getItem]", error);
          return null;
        }
      },
      setItem: async (key: string, value: any) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error("[AsyncStorage:setItem]", error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.error("[AsyncStorage:removeItem]", error);
        }
      },
    };
  }
};

export const appStorage = getStorageEngine();
