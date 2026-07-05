// stores/wallet/walletStore.ts
import { create } from "zustand";
import {
  getWallet,
  getWalletBalance,
  fundWallet,
  debitWallet,
} from "@/services/walletApi";

import type {
  UserId,
  WalletCurrency,
  WalletTransactionData,
} from "@/types/walletTypes";

// -------------------------------
// Wallet Store Types
// -------------------------------
interface WalletState {
  balance: number;
  currency: WalletCurrency;
  loading: boolean;
  loadingBalance: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
  transactions: WalletTransactionData[];

  fetchBalance: (userId: UserId, token?: string | null) => Promise<void>;
  fetchWallet: () => Promise<void>;

  credit: (
    userId: UserId,
    amount: number,
    token?: string | null,
    opts?: { description?: string; currency?: WalletCurrency }
  ) => Promise<number | null>;

  debit: (
    userId: UserId,
    amount: number,
    token?: string | null,
    opts?: { description?: string; currency?: WalletCurrency }
  ) => Promise<number | null>;
}

// -----------------------------------------------------
// Zustand Store
// -----------------------------------------------------
export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  currency: "NGN",
  loading: false,
  loadingBalance: false,
  error: null,
  lastUpdatedAt: null,
  transactions: [],

  // -------------------------
  // FETCH FULL WALLET (includes transactions)
  // -------------------------
  fetchWallet: async () => {
    try {
      set({ loading: true });
      const res = await getWallet();
      console.log("[WalletStore] getWallet result:", JSON.stringify(res, null, 2));

      set({
        balance: res.balance,
        currency: res.currency as WalletCurrency,
        transactions: res.transactions ?? [],
        loading: false,
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Failed to fetch wallet",
      });
    }
  },

  // -------------------------
  // FETCH BALANCE ONLY
  // -------------------------
  fetchBalance: async (
    userId: UserId,
    token: string | null = null
  ) => {
    try {
      set({ loadingBalance: true });
      const res = await getWalletBalance(userId, token);

      set({
        balance: res.balance,
        currency: res.currency as WalletCurrency,
        loadingBalance: false,
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      set({
        loadingBalance: false,
        error: err?.message ?? "Failed to fetch wallet balance",
      });
    }
  },

  // -------------------------
  // CREDIT WALLET
  // -------------------------
  credit: async (
    userId: UserId,
    amount: number,
    token: string | null = null,
    opts: { description?: string; currency?: WalletCurrency } = {}
  ) => {
    try {
      set({ loading: true });
      const result = await fundWallet(userId, amount, token, opts);

      set({
        balance: result.balance,
        loading: false,
        lastUpdatedAt: new Date().toISOString(),
      });

      return result.balance;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.message ?? "Credit operation failed",
      });
      return null;
    }
  },

  // -------------------------
  // DEBIT WALLET
  // -------------------------
  debit: async (
    userId: UserId,
    amount: number,
    token: string | null = null,
    opts: { description?: string; currency?: WalletCurrency } = {}
  ) => {
    console.log("[WalletStore] debit start:", { userId, amount, currency: opts?.currency, description: opts?.description });
    try {
      set({ loading: true });
      const result = await debitWallet(userId, amount, token, opts);

      console.log("[WalletStore] debit success:", { newBalance: result.balance });

      set({
        balance: result.balance,
        loading: false,
        lastUpdatedAt: new Date().toISOString(),
      });

      return result.balance;
    } catch (err: any) {
      console.error("[WalletStore] debit failed:", {
        message: err?.message,
        details: err?.details,
        status: err?.status,
        code: err?.code,
        userId,
        amount,
      });
      set({
        loading: false,
        error: err?.message ?? "Debit operation failed",
      });
      return null;
    }
  },
}));
