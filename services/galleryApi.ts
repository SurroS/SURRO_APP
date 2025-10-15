import { secureGet, secureSet } from '@/utils/storage';
import axios from 'axios';

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';

const galleryApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cache key for gallery data
const GALLERY_CACHE_KEY = 'gallery_images';
const GALLERY_CACHE_TIMESTAMP_KEY = 'gallery_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function for authenticated requests
export const makeAuthenticatedGalleryRequest = async (
    method: 'GET' | 'POST' | 'DELETE',
    endpoint: string,
    data?: any
) => {
    const token = await secureGet('auth_token');

    if (!token) {
        throw new Error('No authentication token available');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    switch (method) {
        case 'GET':
            return galleryApi.get(endpoint, config);
        case 'POST':
            return galleryApi.post(endpoint, data, config);
        case 'DELETE':
            return galleryApi.delete(endpoint, config);
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }
};

// Cache management functions
const isCacheValid = async (): Promise<boolean> => {
    try {
        const timestamp = await secureGet(GALLERY_CACHE_TIMESTAMP_KEY);
        if (!timestamp) return false;

        const cacheTime = parseInt(timestamp);
        const now = Date.now();
        return (now - cacheTime) < CACHE_DURATION;
    } catch {
        return false;
    }
};

const setCache = async (images: any[]): Promise<void> => {
    try {
        await secureSet(GALLERY_CACHE_KEY, JSON.stringify(images));
        await secureSet(GALLERY_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.warn('Failed to cache gallery data:', error);
    }
};

const getCache = async (): Promise<any[] | null> => {
    try {
        const cached = await secureGet(GALLERY_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

const clearCache = async (): Promise<void> => {
    try {
        await secureSet(GALLERY_CACHE_KEY, '');
        await secureSet(GALLERY_CACHE_TIMESTAMP_KEY, '');
    } catch (error) {
        console.warn('Failed to clear gallery cache:', error);
    }
};

// Gallery API functions
export const uploadGalleryImage = async (imageData: FormData) => {
    const token = await secureGet('auth_token');

    if (!token) {
        throw new Error('No authentication token available');
    }

    const response = await galleryApi.post('/gallery/upload', imageData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

    // Clear cache after upload to force refresh
    await clearCache();

    return response;
};

export const getGalleryImages = async (useCache: boolean = true) => {
    // Check cache first if requested
    if (useCache && await isCacheValid()) {
        const cachedImages = await getCache();
        if (cachedImages) {
            console.log('📸 Using cached gallery images');
            return { data: { images: cachedImages, total: cachedImages.length } };
        }
    }

    // Fetch from API
    console.log('📸 Fetching gallery images from API');
    const response = await makeAuthenticatedGalleryRequest('GET', '/gallery');

    // Cache the response
    if (response.data.images) {
        await setCache(response.data.images);
    }

    return response;
};

export const deleteGalleryImage = async (imageId: string) => {
    const response = await makeAuthenticatedGalleryRequest('DELETE', `/gallery/${imageId}`);

    // Clear cache after deletion to force refresh
    await clearCache();

    return response;
};

// Utility functions for cache management
export const refreshGalleryCache = async (): Promise<any[]> => {
    await clearCache();
    const response = await getGalleryImages(false);
    return response.data.images;
};

export const getCachedGalleryImages = async (): Promise<any[] | null> => {
    if (await isCacheValid()) {
        return await getCache();
    }
    return null;
};

export default galleryApi;
