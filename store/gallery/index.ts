import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createGallerySlice, GalleryState } from './actions';
import { GalleryStore } from './types';
import Storage  from '../middleware/persist';

const initialState: GalleryState = {
    images: [],
    isLoading: false,
    isUploading: false,
    error: null,
    lastFetched: null,
};

export const useGalleryStore = create<GalleryStore>()(
    persist(
        (...a) => ({
            ...initialState,
            ...createGallerySlice(...a),
        }),
        {
            name: 'gallery-storage',
            storage: createJSONStorage(() => Storage),
            partialize: (state) => ({
                images: state.images,
                lastFetched: state.lastFetched,
            }),
        }
    )
);
