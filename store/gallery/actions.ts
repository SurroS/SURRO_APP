import { StateCreator } from "zustand";
import { GalleryImage } from "@/types/gallery";
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

    // If the API doesn't return full image info (with .url),
    // re-fetch the gallery immediately
    if (!image || !image.url) {
      await get().fetchImages(false);
      set({ isUploading: false });
      Toast.show({
        text1: 'Image uploaded successfully',
        type: 'customSuccess' as ToastType,
        text2: 'Your image has been added to the gallery',
      });
      return;
    }

    // Add new image to state
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
    set({
      isUploading: false,
      error: error.response?.data?.message || "Failed to upload image",
    });
    Toast.show({
      text1: 'Upload failed',
      type: 'customError' as ToastType,
      text2: error.response?.data?.message || 'Failed to upload image',
    });
    throw error;
  }
},

fetchImages: async (useCache: boolean = true) => {
  try {
    set({ isLoading: true, error: null });

    const lastFetched = get().lastFetched;
    const tooOld =
      !lastFetched ||
      Date.now() - new Date(lastFetched).getTime() > 10 * 60 * 1000; // 10 min refresh to make it better than static

    const shouldUseCache = useCache && !tooOld;

    const response = await getGalleryImages(shouldUseCache);
    const { images } = response.data;

    set({
      images: images || [],
      isLoading: false,
      error: null,
      lastFetched: new Date().toISOString(),
    });
  if (!shouldUseCache) {
    Toast.show({
      text1: 'Gallery loaded',
      type: 'customSuccess' as ToastType,
      text2: `Loaded ${images?.length || 0} image${(images?.length || 0) === 1 ? '' : 's'}`,
    });
  }
  } catch (error: any) {
    set({
      isLoading: false,
      error: error.response?.data?.message || "Failed to fetch images",
    });
  Toast.show({
    text1: 'Failed to load gallery',
    type: 'customError' as ToastType,
    text2: error.response?.data?.message || 'Please try again.',
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
        images: state.images.filter((img) => img.id !== imageId),
        isLoading: false,
        error: null,
        lastFetched: new Date().toISOString(),
      }));
      Toast.show({
        text1: 'Image deleted',
        type: 'customSuccess' as ToastType,
        text2: 'The image has been removed from your gallery',
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete image",
      });
      Toast.show({
        text1: 'Delete failed',
        type: 'customError' as ToastType,
        text2: error.response?.data?.message || 'Failed to delete image',
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
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to refresh cache",
      });
  Toast.show({
    text1: 'Refresh failed',
    type: 'customError' as ToastType,
    text2: error.response?.data?.message || 'Failed to refresh cache',
  });
      throw error;
    }
  },

 
  getCachedImages: async () => {
    try {
      const cachedImages = await getCachedGalleryImages();

      if (cachedImages && Array.isArray(cachedImages)) {
        // Filter out invalid URLs (null, empty, or non-http)
        const validImages = cachedImages.filter(
          (img) =>
            img && typeof img.url === "string" && img.url.startsWith("http")
        );

        set({
          images: validImages,
          lastFetched: new Date().toISOString(),
        });

        if (validImages.length === 0) {
          await get().fetchImages(false);
        }
      }
    } catch (error: any) {
      console.warn("Failed to get cached images:", error);
      // fallback — just try online
      await get().fetchImages(false);
    }
  },

  clearError: () => set({ error: null }),

  setImages: (images: GalleryImage[]) => set({ images }),

  addImage: (image: GalleryImage) =>
    set((state) => ({ images: [image, ...state.images] })),

  removeImage: (imageId: string) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== imageId),
    })),
});
