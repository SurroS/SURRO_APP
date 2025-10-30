import { StateCreator } from 'zustand';
import { GalleryImage } from '@/types/gallery';
import {
    uploadGalleryImage,
    getGalleryImages,
    deleteGalleryImage,
    refreshGalleryCache,
    getCachedGalleryImages,
} from '@/services/galleryApi';
import { Toast } from 'toastify-react-native';
import { ToastType } from 'toastify-react-native/utils/interfaces';

export interface GalleryState {
    images: GalleryImage[];
    isLoading: boolean;
    isUploading: boolean;
    error: string | null;
    lastFetched: string | null;
}

export interface GalleryActions {
    // Image Management
    uploadImage: (imageData: FormData) => Promise<void>;
    fetchImages: (useCache?: boolean) => Promise<void>;
    deleteImage: (imageId: string) => Promise<void>;

    // Cache Management
    refreshCache: () => Promise<void>;
    getCachedImages: () => Promise<void>;

    // Utility Actions
    clearError: () => void;
    setImages: (images: GalleryImage[]) => void;
    addImage: (image: GalleryImage) => void;
    removeImage: (imageId: string) => void;
}

export type GalleryStore = GalleryState & GalleryActions;

export const createGallerySlice: StateCreator<GalleryStore> = (set, get) => ({
    images: [],
    isLoading: false,
    isUploading: false,
    error: null,
    lastFetched: null,

    uploadImage: async (imageData: FormData) => {
        try {
            set({ isUploading: true, error: null });

            const response = await uploadGalleryImage(imageData);
            const { image } = response.data;

            // Add new image to current state
            set((state) => ({
                images: [image, ...state.images],
                isUploading: false,
                error: null,
                lastFetched: new Date().toISOString(),
            }));

            Toast.show({
                text1: 'Image uploaded successfully',
                type: 'customSuccess' as ToastType,
                text2: 'Your image has been added to the gallery',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to upload image';
            set({
                isUploading: false,
                error: errorMessage,
            });
            
            Toast.show({
                text1: 'Upload failed',
                type: 'customError' as ToastType,
                text2: errorMessage,
            });
            
            throw error;
        }
    },

    fetchImages: async (useCache: boolean = true) => {
        try {
            set({ isLoading: true, error: null });

            const response = await getGalleryImages(useCache);
            const { images } = response.data;

            set({
                images: images || [],
                isLoading: false,
                error: null,
                lastFetched: new Date().toISOString(),
            });

            // Only show success toast if not using cache and images were fetched
            if (!useCache && images && images.length > 0) {
                Toast.show({
                    text1: 'Gallery refreshed',
                    type: 'customSuccess' as ToastType,
                    text2: `Loaded ${images.length} image${images.length === 1 ? '' : 's'}`,
                });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch images';
            set({
                isLoading: false,
                error: errorMessage,
            });
            
            Toast.show({
                text1: 'Failed to load gallery',
                type: 'customError' as ToastType,
                text2: errorMessage,
            });
            
            throw error;
        }
    },

    deleteImage: async (imageId: string) => {
        try {
            set({ isLoading: true, error: null });

            await deleteGalleryImage(imageId);

            // Remove image from current state
            set((state) => ({
                images: state.images.filter(img => img.id !== imageId),
                isLoading: false,
                error: null,
                lastFetched: new Date().toISOString(),
            }));

            Toast.show({
                text1: 'Image deleted successfully',
                type: 'customSuccess' as ToastType,
                text2: 'The image has been removed from your gallery',
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete image';
            set({
                isLoading: false,
                error: errorMessage,
            });
            
            Toast.show({
                text1: 'Delete failed',
                type: 'customError' as ToastType,
                text2: errorMessage,
            });
            
            throw error;
        }
    },

    refreshCache: async () => {
        try {
            set({ isLoading: true, error: null });

            const images = await refreshGalleryCache();

            set({
                images: images || [],
                isLoading: false,
                error: null,
                lastFetched: new Date().toISOString(),
            });

            Toast.show({
                text1: 'Gallery refreshed',
                type: 'customSuccess' as ToastType,
                text2: `Loaded ${images.length} image${images.length === 1 ? '' : 's'}`,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to refresh cache';
            set({
                isLoading: false,
                error: errorMessage,
            });
            
            Toast.show({
                text1: 'Refresh failed',
                type: 'customError' as ToastType,
                text2: errorMessage,
            });
            
            throw error;
        }
    },

    getCachedImages: async () => {
        try {
            const cachedImages = await getCachedGalleryImages();

            if (cachedImages) {
                set({
                    images: cachedImages,
                    lastFetched: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            console.warn('Failed to get cached images:', error);
        }
    },

    clearError: () => set({ error: null }),

    setImages: (images: GalleryImage[]) => set({ images }),

    addImage: (image: GalleryImage) =>
        set((state) => ({ images: [image, ...state.images] })),

    removeImage: (imageId: string) =>
        set((state) => ({
            images: state.images.filter(img => img.id !== imageId)
        })),
});
