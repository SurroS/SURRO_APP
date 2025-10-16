import { StateCreator } from 'zustand';
import { GalleryImage } from '@/types/gallery';
import {
    uploadGalleryImage,
    getGalleryImages,
    deleteGalleryImage,
    refreshGalleryCache,
    getCachedGalleryImages,
} from '@/services/galleryApi';

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
        } catch (error: any) {
            set({
                isUploading: false,
                error: error.response?.data?.message || 'Failed to upload image',
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
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch images',
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
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to delete image',
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
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to refresh cache',
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
