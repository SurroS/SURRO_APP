import { KYCStatus } from '@/types/kyc';

export interface KYCStore {
  status: KYCStatus | null;
  isLoading: boolean;
  error: string | null;
  submitKYC: (
    idFront: { uri: string; type: string; name: string },
    idBack?: { uri: string; type: string; name: string },
    faceScan?: { uri: string; type: string; name: string }
  ) => Promise<void>;
  getKYCStatus: () => Promise<void>;
  clearError: () => void;
}

