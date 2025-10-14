import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createProfileSlice } from './actions';
import { ProfileState } from './actions';
import { ProfileStore } from './types';
import { secureStorage } from '../middleware/persist';

const initialState: ProfileState = {
    surrogateProfile: null,
    medicalProfile: null,
    isLoading: false,
    error: null,
};

export const useProfileStore = create<ProfileStore>()(
    persist(
        (...a) => ({
            ...initialState,
            ...createProfileSlice(...a),
        }),
        {
            name: 'profile-storage',
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({
                surrogateProfile: state.surrogateProfile,
                medicalProfile: state.medicalProfile,
            }),
        }
    )
);
