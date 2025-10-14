// Gallery Types
export interface GalleryImage {
    id: string;
    url: string;
    filename: string;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryUploadResponse {
    image: GalleryImage;
    message: string;
}

export interface GalleryResponse {
    images: GalleryImage[];
    total: number;
}

export interface GalleryDeleteResponse {
    message: string;
    deletedImageId: string;
}
