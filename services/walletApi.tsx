// services/walletApi.ts
import axios from "axios";
import {
  WalletTransactionPayload,
  WalletTransactionResponse,
  WalletBalanceResponse,
  UserId,
} from "@/types/walletTypes";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "https://dev.surrosantara.space/api/v1";

/**
 * Fetch wallet balance for a specific user
 */
export const getWalletBalance = async (
  userId: UserId,
  token?: string | null
): Promise<{ balance: number; currency: string }> => {
  const response = await axios.get<WalletBalanceResponse>(
    `${API_BASE}/wallet/balance/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  return {
    balance: response.data.data.balance,
    currency: response.data.data.currency,
  };
};

/**
 * Perform any wallet transaction (CREDIT or DEBIT)
 */
export const performWalletTransaction = async (
  payload: WalletTransactionPayload,
  token?: string | null
): Promise<WalletTransactionResponse["data"]> => {
  const response = await axios.post<WalletTransactionResponse>(
    `${API_BASE}/wallet/transaction`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  return response.data.data;
};

/**
 * CREDIT convenience wrapper
 */
export const fundWallet = async (
  userId: UserId,
  amount: number,
  token?: string | null,
  extra?: { description?: string; currency?: string }
): Promise<{ balance: number }> => {
  const payload: WalletTransactionPayload = {
    userId,
    type: "CREDIT",
    amount,
    description: extra?.description ?? "Wallet funding",
    currency: (extra?.currency as any) ?? "NGN",
  };

  const data = await performWalletTransaction(payload, token);
  return { balance: data.balance };
};

/**
 * DEBIT convenience wrapper
 */
export const debitWallet = async (
  userId: UserId,
  amount: number,
  token?: string | null,
  extra?: { description?: string; currency?: string }
): Promise<{ balance: number }> => {
  const payload: WalletTransactionPayload = {
    userId,
    type: "DEBIT",
    amount,
    description: extra?.description ?? "Service payment",
    currency: (extra?.currency as any) ?? "NGN",
  };

  const data = await performWalletTransaction(payload, token);
  return { balance: data.balance };
};
