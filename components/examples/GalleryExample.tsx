import React, { useState } from 'react';
import { Button, Text, YStack, XStack } from 'tamagui';
import { useGallery } from '@/hooks/useGallery';
import { Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AlertModal from '@/components/modals/AlertModal';

// Example component showing how to use the gallery APIs
export const GalleryExample = () => {
    const {
        images,
        isLoading,
        isUploading,
        error,
        uploadImage,
        fetchImages,
        deleteImage,
        refreshCache,
        clearError,
    } = useGallery();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        message: string;
        buttons?: { text: string; style?: "default" | "cancel" | "destructive"; onPress?: () => void }[];
    }>({ title: "", message: "" });

    const showAlert = (title: string, message: string, buttons?: { text: string; style?: "default" | "cancel" | "destructive"; onPress?: () => void }[]) => {
        setAlertConfig({ title, message, buttons });
        setAlertVisible(true);
    };

    const handlePickImage = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                showAlert('Permission required', 'Permission to access camera roll is required!');
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
                formData.append('files', {
                    uri: asset.uri,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                } as any);

                // Upload image
                await uploadImage(formData);
                showAlert('Success', 'Image uploaded successfully!');
            }
        } catch (error) {
            console.error('Error picking/uploading image:', error);
            showAlert('Error', 'Failed to upload image');
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            showAlert(
                'Delete Image',
                'Are you sure you want to delete this image?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            await deleteImage(imageId);
                            showAlert('Success', 'Image deleted successfully!');
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error deleting image:', error);
            showAlert('Error', 'Failed to delete image');
        }
    };

    const handleRefreshCache = async () => {
        try {
            await refreshCache();
            showAlert('Success', 'Gallery cache refreshed!');
        } catch (error) {
            console.error('Error refreshing cache:', error);
            showAlert('Error', 'Failed to refresh cache');
        }
    };

    return (
        <YStack padding="$4" gap="$3">
            <Text fontSize="$6" fontWeight="bold">Gallery Management</Text>

            {error && (
                <XStack backgroundColor="$red2" padding="$2" borderRadius="$2">
                    <Text color="$red10">{error}</Text>
                    <Button size="$2" onPress={clearError}>Clear</Button>
                </XStack>
            )}

            <XStack gap="$2">
                <Button
                    onPress={handlePickImage}
                    disabled={isUploading}
                    flex={1}
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>

                <Button
                    onPress={() => fetchImages(false)}
                    disabled={isLoading}
                    flex={1}
                >
                    {isLoading ? 'Loading...' : 'Refresh Gallery'}
                </Button>
            </XStack>

            <Button
                onPress={handleRefreshCache}
                disabled={isLoading}
            >
                Refresh Cache
            </Button>

            <YStack gap="$2">
                <Text fontSize="$4" fontWeight="bold">
                    Gallery Images ({images.length})
                </Text>

                {images.length === 0 ? (
                    <Text color="$gray10">No images uploaded yet</Text>
                ) : (
                    <YStack gap="$2">
                        {images.map((image) => (
                            <XStack
                                key={image.id}
                                alignItems="center"
                                justifyContent="space-between"
                                backgroundColor="$gray2"
                                padding="$2"
                                borderRadius="$2"
                            >
                                <XStack alignItems="center" gap="$2">
                                    <RNImage
                                        source={{ uri: image.url }}
                                        style={{ width: 50, height: 50, borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                    <YStack>
                                        <Text fontSize="$3" fontWeight="600">
                                            {image.filename}
                                        </Text>
                                        <Text fontSize="$2" color="$gray10">
                                            Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                                        </Text>
                                    </YStack>
                                </XStack>

                                <Button
                                    size="$2"
                                    backgroundColor="$red8"
                                    color="white"
                                    onPress={() => handleDeleteImage(image.id)}
                                >
                                    Delete
                                </Button>
                            </XStack>
                        ))}
                    </YStack>
                )}
            </YStack>

            <YStack gap="$2">
                <Text fontSize="$4" fontWeight="bold">Cache Info</Text>
                <Text fontSize="$3">
                    Images cached: {images.length}
                </Text>
                <Text fontSize="$3">
                    Last fetched: {images.length > 0 ? 'Recently' : 'Never'}
                </Text>
            </YStack>
        </YStack>
        <AlertModal
            visible={alertVisible}
            title={alertConfig.title}
            message={alertConfig.message}
            buttons={alertConfig.buttons}
            onClose={() => setAlertVisible(false)}
        />
    );
};
