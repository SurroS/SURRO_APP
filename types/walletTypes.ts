// types/wallet.types.ts

// Currency supported by SurroSantara
export type WalletCurrency = "NGN" | "USD" | "GBP";

// UserId as strict brand type (optional but safer)
export type UserId = string;  // e.g., UUID

// Wallet transaction types coming from backend
export type WalletTransactionType = "CREDIT" | "DEBIT";

export interface WalletTransactionPayload {
  userId: UserId;
  type: WalletTransactionType;
  amount: number;               // always in minor units? (we assume Naira normal units)
  description: string;
  currency: WalletCurrency;
}

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED" | "PROCESSING";

export interface WalletTransactionData {
  id: string;
  userId: UserId;
  amount: number;
  balance: number;
  type: WalletTransactionType;
  description: string;
  currency: WalletCurrency;
  createdAt: string;
  status?: TransactionStatus;
  gateway?: string;
  reference?: string;
}

export interface WalletTransactionResponse {
  success: boolean;
  data: WalletTransactionData;
}

export interface WalletBalanceResponse {
  success: boolean;
  data: {
    balance: number;
    currency: WalletCurrency;
  };
}

export interface WalletResponse {
  id: string;
  userId: UserId;
  balance: number;
  currency: WalletCurrency;
  createdAt: string;
  updatedAt: string;
  transactions: WalletTransactionData[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  holderName: string;
  accountNumber: string;
  bankCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AddBankAccountRequest {
  bankName: string;
  holderName: string;
  accountNumber: string;
  bankCode: string;
}

export interface UpdateBankAccountRequest {
  bankName?: string;
  holderName?: string;
  accountNumber?: string;
  bankCode?: string;
}

export interface WithdrawRequest {
  accountId: string;
  amount: number;
}
