import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Detect current environment
 * Set APP_ENV in your .env or eas.json ("development", "preview", or "production")
 */
const ENV = process.env.APP_ENV ?? 'development';

/**
 * Returns the best storage engine depending on environment.
 * SecureStore is used in production, AsyncStorage in dev/preview for persistence across builds.
 */
const getStorageEngine = () => {
  if (ENV === 'production') {
    return {
      getItem: async (key: string) => {
        try {
          const value = await SecureStore.getItemAsync(key);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('[SecureStore:getItem]', error);
          return null;
        }
      },
      setItem: async (key: string, value: any) => {
        try {
          await SecureStore.setItemAsync(key, JSON.stringify(value));
        } catch (error) {
          console.error('[SecureStore:setItem]', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.error('[SecureStore:removeItem]', error);
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
          console.error('[AsyncStorage:getItem]', error);
          return null;
        }
      },
      setItem: async (key: string, value: any) => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('[AsyncStorage:setItem]', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.error('[AsyncStorage:removeItem]', error);
        }
      },
    };
  }
};

export const appStorage = getStorageEngine();

