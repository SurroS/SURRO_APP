import { useGalleryStore } from '@/store/gallery';

export const useGallery = () => {
    const {
        images,
        isLoading,
        isUploading,
        error,
        lastFetched,
        uploadImage,
        fetchImages,
        deleteImage,
        refreshCache,
        getCachedImages,
        clearError,
        setImages,
        addImage,
        removeImage,
    } = useGalleryStore();

    return {
        // State
        images,
        isLoading,
        isUploading,
        error,
        lastFetched,

        // Actions
        uploadImage,
        fetchImages,
        deleteImage,
        refreshCache,
        getCachedImages,
        clearError,
        setImages,
        addImage,
        removeImage,
    };
};
