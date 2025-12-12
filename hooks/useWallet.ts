import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { getWalletBalance, fundWallet, debitWallet } from "@/services/walletApi";

// Types
export interface WalletState {
  balance: number;
  loading: boolean;
  error: string | null;
}

export function useWallet(userId: string) {
  const [state, setState] = useState<WalletState>({
    balance: 0,
    loading: false,
    error: null,
  });

  const fetchBalance = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const response = await getWalletBalance(userId);
      setState({ balance: response.balance, loading: false, error: null });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: "Failed to load balance" }));
      Alert.alert("Wallet Error", err?.message || "Could not fetch balance.");
    }
  }, [userId]);

  const addFunds = useCallback(
    async (amount: number) => {
      try {
        setState((s) => ({ ...s, loading: true }));
        const result = await fundWallet(userId, amount);
        setState((s) => ({ ...s, balance: result.balance, loading: false }));
      } catch (err: any) {
        setState((s) => ({ ...s, loading: false, error: "Failed to fund wallet" }));
        Alert.alert("Funding Error", err?.message || "Could not fund wallet.");
      }
    },
    [userId]
  );

  const deductFunds = useCallback(
    async (amount: number) => {
      try {
        setState((s) => ({ ...s, loading: true }));
        const result = await debitWallet(userId, amount);
        setState((s) => ({ ...s, balance: result.balance, loading: false }));
      } catch (err: any) {
        setState((s) => ({ ...s, loading: false, error: "Failed to debit wallet" }));
        Alert.alert("Debit Error", err?.message || "Could not complete payment.");
      }
    },
    [userId]
  );

  return {
    balance: state.balance,
    loading: state.loading,
    error: state.error,
    fetchBalance,
    addFunds,
    deductFunds,
  };
}

import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://dev.surrosantara.space/api/v1";

// Wallet Service (Regenerated)
export interface WalletTransactionPayload {
  userId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  currency: string;
}

export interface WalletTransactionResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    balance: number;
    amount: number;
    type: string;
    description: string;
    currency: string;
    createdAt: string;
  };
}

export const performWalletTransaction = async (
  payload: WalletTransactionPayload,
  token?: string | null
): Promise<WalletTransactionResponse> => {
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

  return response.data;
};
