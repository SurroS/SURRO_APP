import { useKYCStore } from '@/store/kyc';

export const useKYC = () => {
  const {
    status,
    isLoading,
    error,
    submitKYC,
    getKYCStatus,
    clearError,
  } = useKYCStore();

  return {
    status,
    isLoading,
    error,
    submitKYC,
    getKYCStatus,
    clearError,
  };
};

