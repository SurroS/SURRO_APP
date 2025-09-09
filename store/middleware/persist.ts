import * as SecureStore from 'expo-secure-store';
import { StateStorage, createJSONStorage } from 'zustand/middleware';

// Custom storage implementation using Expo SecureStore
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(name);
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(name, value);
        } catch (error) {
            console.error('Error setting item in storage:', error);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(name);
        } catch (error) {
            console.error('Error removing item from storage:', error);
        }
    },
};

export const createPersistMiddleware = (config: any) => ({
    ...config,
    storage: createJSONStorage(() => storage),
});