import { authenticatedGet, authenticatedPost } from "./httpClient";

export interface UnlockFeeResponse {
  role: string;
  amount: number;
  currency: string;
}

export interface UnlockResponse {
  success: boolean;
  unlock: {
    id: string;
    userId: string;
    targetUserId: string;
    amountPaid: number;
    currency: string;
    createdAt: string;
    expiresAt: string;
    version?: number;
  };
  unlockedByOther?: boolean;
}

export interface UnlockStatusResponse {
  unlocked: boolean;
  unlockedBy?: string;
  version?: number;
  createdAt?: string;
  expiresAt?: string;
}

export interface UnlockTargetUser {
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  profilePicture: string | null;
}

export interface UnlockListItem {
  id: string;
  targetUserId: string;
  amountPaid: number;
  currency: string;
  createdAt: string;
  expiresAt: string;
  targetUser: UnlockTargetUser;
}

export interface UnlocksListResponse {
  unlocks: UnlockListItem[];
  total: number;
  page: number;
  limit: number;
}

export const getUnlockFee = (role: string): Promise<UnlockFeeResponse> =>
  authenticatedGet(`/unlocks/fees/${role}`);

export const createUnlock = (targetUserId: string): Promise<UnlockResponse> =>
  authenticatedPost(`/unlocks`, { targetUserId });

export const getUnlockStatus = (targetUserId: string): Promise<UnlockStatusResponse> =>
  authenticatedGet(`/unlocks/status/${targetUserId}`);

export const getUnlocks = (page = 1, limit = 20): Promise<UnlocksListResponse> =>
  authenticatedGet(`/unlocks?page=${page}&limit=${limit}`);
