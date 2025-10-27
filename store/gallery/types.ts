import { GalleryState } from './actions';

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
    setImages: (images: any[]) => void;
    addImage: (image: any) => void;
    removeImage: (imageId: string) => void;
}

export type GalleryStore = GalleryState & GalleryActions;
