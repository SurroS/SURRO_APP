import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  getItem: async (name: string) => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },
  setItem: async (name: string, value: any) => {
    try {
      await SecureStore.setItemAsync(name, JSON.stringify(value));
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
    }
  },
  removeItem: async (name: string) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
    }
  },
};
