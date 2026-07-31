// services/walletApi.ts
import { authenticatedGet, authenticatedPost, authenticatedPatch, authenticatedDelete } from "./httpClient";
import {
  WalletTransactionPayload,
  WalletTransactionResponse,
  WalletTransactionData,
  WalletBalanceResponse,
  WalletResponse,
  UserId,
  BankAccount,
  AddBankAccountRequest,
} from "@/types/walletTypes";

export const getWallet = async (): Promise<WalletResponse> => {
  const response = await authenticatedGet("/wallet");
  return response?.data ?? response;
};

export const getWalletBalance = async (
  userId: UserId,
  token?: string | null,
): Promise<{ balance: number; currency: string }> => {
  const response = await authenticatedGet(`/wallet/balance/${userId}`);
  const data = response?.data ?? response;

  return {
    balance: data?.balance ?? 0,
    currency: data?.currency ?? "NGN",
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

  return response?.data ?? response;
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
    currency: extra?.currency ?? "NGN",
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
    currency: extra?.currency ?? "NGN",
  };

  const data = await performWalletTransaction(payload, token);
  return { balance: data.balance };
};

// -------------------------
// BANK ACCOUNTS
// -------------------------

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  const response = await authenticatedGet("/wallet/bank/accounts");
  const data = response?.data ?? response;
  return data?.accounts ?? data ?? [];
};

export const addBankAccount = async (payload: AddBankAccountRequest): Promise<BankAccount> => {
  const response = await authenticatedPost("/wallet/bank/accounts", payload);
  return response?.data ?? response;
};

export const setDefaultBankAccount = async (id: string): Promise<void> => {
  await authenticatedPatch(`/wallet/bank/accounts/${id}/default`);
};

export const deleteBankAccount = async (id: string): Promise<void> => {
  await authenticatedDelete(`/wallet/bank/accounts/${id}`);
};

export const withdrawWallet = async (
  accountId: string,
  amount: number,
): Promise<any> => {
  const response = await authenticatedPost("/wallet/withdraw", { accountId, amount });
  return response?.data ?? response;
};


