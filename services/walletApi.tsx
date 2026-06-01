// services/walletApi.ts
import { authenticatedGet, authenticatedPost } from "./httpClient";
import {
  WalletTransactionPayload,
  WalletTransactionResponse,
  WalletTransactionData,
  WalletBalanceResponse,
  UserId,
} from "@/types/walletTypes";

export const getWalletTransactions = async (): Promise<WalletTransactionData[]> => {
  const response = await authenticatedGet("/wallet/transaction");
  return response?.data ?? response ?? [];
};

export const getWalletBalance = async (
  userId: UserId,
  token?: string | null,
): Promise<{ balance: number; currency: string }> => {
  const response = await authenticatedGet(`/wallet/balance/${userId}`);

  return {
    balance: response.data.balance,
    currency: response.data.currency,
  };
};

/**
 * Perform any wallet transaction (CREDIT or DEBIT)
 */
export const performWalletTransaction = async (
  payload: WalletTransactionPayload,
  token?: string | null,
): Promise<WalletTransactionResponse["data"]> => {
  const response = await authenticatedPost("/wallet/transaction", payload);

  return response.data;
};

/**
 * CREDIT convenience wrapper
 */
export const fundWallet = async (
  userId: UserId,
  amount: number,
  token?: string | null,
  extra?: { description?: string; currency?: string },
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
  extra?: { description?: string; currency?: string },
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
