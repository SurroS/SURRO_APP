import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  compress?: number;
}

/**
 * Get file size in bytes from URI
 */
const getFileSize = async (uri: string): Promise<number> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists && 'size' in fileInfo) {
      return fileInfo.size;
    }
    return 0;
  } catch (error) {
    console.warn('Could not get file size:', error);
    return 0;
  }
};

/**
 * Format bytes to human readable string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Compress and resize an image to reduce file size
 * @param uri - Image URI to compress
 * @param options - Compression options
 * @returns Compressed image URI and metadata
 */
export const compressImage = async (
  uri: string,
  options: CompressImageOptions = {}
): Promise<{ uri: string; width: number; height: number; originalSize: number; compressedSize: number }> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    compress = 0.7,
  } = options;

  try {
    const originalSize = await getFileSize(uri);

    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    const compressedSize = await getFileSize(result.uri);

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error('Failed to compress image');
  }
};

/**
 * Compress image for KYC document upload (optimized for ID documents)
 * Uses more aggressive compression to avoid payload size limits
 * @param uri - Image URI to compress
 * @returns Compressed image URI
 */
export const compressKYCImage = async (uri: string): Promise<string> => {
  const result = await compressImage(uri, {
    maxWidth: 1600,
    maxHeight: 1600,
    compress: 0.6,
  });
  return result.uri;
};

