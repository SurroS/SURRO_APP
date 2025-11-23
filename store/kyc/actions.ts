import { StateCreator } from 'zustand';
import { submitKYC as submitKYCApi, getKYCStatus as getKYCStatusApi } from '@/services/kycApi';
import { KYCStore } from './types';
import { KYCStatus } from '@/types/kyc';

export const createKYCSlice: StateCreator<KYCStore> = (set) => ({
  status: null,
  isLoading: false,
  error: null,

  submitKYC: async (
    idFront: { uri: string; type: string; name: string },
    idBack?: { uri: string; type: string; name: string },
    faceScan?: { uri: string; type: string; name: string }
  ) => {
    try {
      set({ isLoading: true, error: null });

      const response = await submitKYCApi(idFront, idBack, faceScan);

      set({
        status: {
          status: response.kycStatus,
          submittedAt: new Date().toISOString(),
        },
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to submit KYC documents',
      });
      throw error;
    }
  },

  getKYCStatus: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getKYCStatusApi();
      const statusData: KYCStatus = response.data;

      set({
        status: statusData,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch KYC status',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
});

