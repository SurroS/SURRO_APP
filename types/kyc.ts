export interface KYCSubmitRequest {
  idFront: {
    uri: string;
    type: string;
    name: string;
  };
  idBack?: {
    uri: string;
    type: string;
    name: string;
  };
  idType?: string;
}

export interface KYCSubmitResponse {
  message: string;
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionId?: string;
}

export interface KYCStatus {
  status: 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

