import * as SecureStore from 'expo-secure-store';

export const secureSet = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('Error setting secure storage:', error);
    }
};

export const secureGet = async (key: string): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error('Error getting secure storage:', error);
        return null;
    }
};

export const secureDelete = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Error deleting secure storage:', error);
    }
};