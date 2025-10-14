# Gallery API Integration

This document describes the gallery API integration with local storage caching for efficient image management.

## Overview

The gallery API integration includes:
- Gallery image data models and types
- API service functions with intelligent caching
- Zustand store for state management
- React hooks for easy component integration
- Local storage caching to minimize API calls

## File Structure

```
types/
  └── gallery.ts              # Gallery type definitions
services/galleryApi.ts        # API service functions with caching
store/gallery/
  ├── actions.ts             # Zustand actions
  ├── types.ts               # Store type definitions
  └── index.ts               # Store configuration
hooks/useGallery.ts          # React hook for gallery functionality
components/examples/
  └── GalleryExample.tsx     # Usage example component
```

## API Endpoints

The following endpoints are supported:

### Gallery Management
- `POST /api/v1/gallery/upload` - Upload new image
- `GET /api/v1/gallery` - Get all gallery images
- `DELETE /api/v1/gallery/{id}` - Delete specific image

## Caching Strategy

The gallery API implements intelligent caching to minimize API calls:

### Cache Features
- **Automatic Caching**: Images are cached after first fetch
- **Cache Duration**: 5 minutes (configurable)
- **Cache Validation**: Checks if cache is still valid before using
- **Cache Invalidation**: Cache is cleared after upload/delete operations
- **Fallback Strategy**: Falls back to API if cache is invalid

### Cache Management
```typescript
// Cache is automatically managed, but you can also:
await refreshCache();        // Force refresh from API
await getCachedImages();     // Get cached images only
```

## Usage Examples

### Basic Gallery Operations

```typescript
import { useGallery } from '@/hooks/useGallery';

const MyComponent = () => {
  const { 
    images, 
    isLoading, 
    isUploading,
    error,
    uploadImage, 
    fetchImages, 
    deleteImage 
  } = useGallery();

  // Upload an image
  const handleUploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      await uploadImage(formData);
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  // Fetch images (uses cache by default)
  const handleFetchImages = async () => {
    try {
      await fetchImages(true); // true = use cache
      console.log('Images fetched:', images);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  // Delete an image
  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isUploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
      
      <button onClick={handleUploadImage}>Upload Image</button>
      <button onClick={handleFetchImages}>Fetch Images</button>
      
      {images.map(image => (
        <div key={image.id}>
          <img src={image.url} alt={image.filename} />
          <button onClick={() => handleDeleteImage(image.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Image Upload with Expo ImagePicker

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useGallery } from '@/hooks/useGallery';

const ImageUploadComponent = () => {
  const { uploadImage, isUploading } = useGallery();

  const handlePickAndUpload = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('Permission required!');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('image', {
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        } as any);

        // Upload image
        await uploadImage(formData);
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  return (
    <button onClick={handlePickAndUpload} disabled={isUploading}>
      {isUploading ? 'Uploading...' : 'Pick & Upload Image'}
    </button>
  );
};
```

### Cache Management

```typescript
import { useGallery } from '@/hooks/useGallery';

const CacheManagementComponent = () => {
  const { refreshCache, getCachedImages, images, lastFetched } = useGallery();

  const handleRefreshCache = async () => {
    try {
      await refreshCache(); // Force refresh from API
      console.log('Cache refreshed');
    } catch (error) {
      console.error('Failed to refresh cache:', error);
    }
  };

  const handleGetCachedImages = async () => {
    try {
      await getCachedImages(); // Get cached images only
      console.log('Cached images loaded');
    } catch (error) {
      console.error('Failed to get cached images:', error);
    }
  };

  return (
    <div>
      <button onClick={handleRefreshCache}>Refresh Cache</button>
      <button onClick={handleGetCachedImages}>Load Cached Images</button>
      
      <p>Images: {images.length}</p>
      <p>Last fetched: {lastFetched}</p>
    </div>
  );
};
```

## Type Definitions

### GalleryImage
Complete image data structure including metadata.

```typescript
interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### GalleryResponse
API response structure for gallery operations.

```typescript
interface GalleryResponse {
  images: GalleryImage[];
  total: number;
}
```

## Caching Details

### How Caching Works

1. **First Load**: Fetches from API and caches the result
2. **Subsequent Loads**: Uses cached data if still valid (< 5 minutes)
3. **Cache Expiry**: Automatically fetches from API when cache expires
4. **Cache Invalidation**: Clears cache after upload/delete operations
5. **Fallback**: Always falls back to API if cache fails

### Cache Configuration

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const GALLERY_CACHE_KEY = 'gallery_images';
const GALLERY_CACHE_TIMESTAMP_KEY = 'gallery_cache_timestamp';
```

### Cache Benefits

- **Reduced API Calls**: Minimizes server requests
- **Faster Loading**: Instant display of cached images
- **Better UX**: No loading states for cached data
- **Offline Support**: Works with cached data when offline
- **Bandwidth Savings**: Reduces data usage

## Error Handling

All gallery API functions include proper error handling:

- **Network Errors**: Handled gracefully with user-friendly messages
- **Permission Errors**: Clear feedback for image picker permissions
- **Upload Errors**: Specific error messages for upload failures
- **Cache Errors**: Fallback to API when cache operations fail

## State Management

The gallery store uses Zustand with persistence:

- **State Persistence**: Images and metadata are persisted
- **Automatic Rehydration**: Store is restored on app restart
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Error States**: Proper error handling and recovery

## Integration Notes

1. **Image Upload**: Use FormData for multipart uploads
2. **Permissions**: Request camera/photo library permissions
3. **Error Handling**: Always handle upload/fetch errors
4. **Loading States**: Use `isLoading` and `isUploading` states
5. **Cache Strategy**: Leverage caching for better performance

## Performance Tips

1. **Use Cache**: Always use cached data when available
2. **Batch Operations**: Upload multiple images efficiently
3. **Image Compression**: Compress images before upload
4. **Lazy Loading**: Load images on demand
5. **Cache Management**: Refresh cache when needed

## Testing

To test the gallery APIs:

1. Ensure you have a valid authentication token
2. Use the example component to test different operations
3. Check the network tab to verify API calls and caching
4. Test offline functionality with cached data
5. Verify image upload/delete operations work correctly

## Future Enhancements

Potential future enhancements:
- Image compression before upload
- Multiple image upload support
- Image editing capabilities
- Advanced caching strategies
- Image search and filtering
- Thumbnail generation
- Image metadata extraction
