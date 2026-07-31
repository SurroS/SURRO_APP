import {
  authenticatedGet,
  authenticatedDelete,
  default as httpClient,
} from "./httpClient";
import { secureGet, secureSet } from "@/utils/storage";

// Cache key for gallery data
const GALLERY_CACHE_KEY = "gallery_images";
const GALLERY_CACHE_TIMESTAMP_KEY = "gallery_cache_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Cache management functions
const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestamp = await secureGet(GALLERY_CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    return now - cacheTime < CACHE_DURATION;
  } catch {
    return false;
  }
};

const setCache = async (images: any[]): Promise<void> => {
  try {
    await secureSet(GALLERY_CACHE_KEY, JSON.stringify(images));
    await secureSet(GALLERY_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn("Failed to cache gallery data:", error);
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
    await secureSet(GALLERY_CACHE_KEY, "");
    await secureSet(GALLERY_CACHE_TIMESTAMP_KEY, "");
  } catch (error) {
    console.warn("Failed to clear gallery cache:", error);
  }
};

// Gallery API functions
export const uploadGalleryImage = async (imageData: FormData) => {
  const response = await httpClient.post("/gallery/upload", imageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Clear cache after upload to force refresh
  await clearCache();

  return response.data;
};

export const getGalleryImages = async (useCache: boolean = true) => {
  // Check cache first if requested
  if (useCache && (await isCacheValid())) {
    const cachedImages = await getCache();
    if (cachedImages) {
      return { data: { images: cachedImages, total: cachedImages.length } };
    }
  }

  // Fetch from API
  const response = await authenticatedGet("/gallery");

  // Backend returns an array directly, transform to expected structure
  const images = Array.isArray(response) ? response : [];

  // Cache the images array
  if (images.length > 0) {
    await setCache(images);
  }

  // Return in the expected format for compatibility
  return {
    data: {
      images,
      total: images.length,
    },
  };
};

export const deleteGalleryImage = async (imageId: string) => {
  const response = await authenticatedDelete(`/gallery/${imageId}`);

  // Clear cache after deletion to force refresh
  await clearCache();

  return response;
};

// Legacy wrapper for backward compatibility (remove after updating all usages)
export const makeAuthenticatedGalleryRequest = async (
  method: "GET" | "POST" | "DELETE",
  endpoint: string,
  data?: any,
) => {
  console.warn(
    "[galleryApi] makeAuthenticatedGalleryRequest is deprecated. Use authenticatedGet/Post/Delete directly.",
  );

  switch (method) {
    case "GET":
      return authenticatedGet(endpoint, data ? { params: data } : undefined);
    case "POST":
      return httpClient.post(endpoint, data);
    case "DELETE":
      return authenticatedDelete(endpoint);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// Utility functions for cache management
export const refreshGalleryCache = async (): Promise<any[]> => {
  await clearCache();
  const response = await getGalleryImages(false);
  return response.images || [];
};

export const getCachedGalleryImages = async (): Promise<any[] | null> => {
  if (await isCacheValid()) {
    return await getCache();
  }
  return null;
};

// Gallery API object for default export
const galleryApi = {
  fetchGallery: getGalleryImages,
  uploadImage: uploadGalleryImage,
  deleteImage: deleteGalleryImage,
  request: makeAuthenticatedGalleryRequest,
};

export default galleryApi;
