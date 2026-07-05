import { useState, useEffect, useCallback } from "react";
import type { BankAccount, AddBankAccountRequest } from "@/types/walletTypes";
import {
  getBankAccounts,
  addBankAccount as apiAddBankAccount,
  setDefaultBankAccount as apiSetDefault,
  deleteBankAccount as apiDelete,
} from "@/services/walletApi";

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBankAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("[BankAccounts] fetch failed:", err);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (payload: AddBankAccountRequest) => {
    setIsSubmitting(true);
    try {
      await apiAddBankAccount(payload);
      await fetchAccounts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDefault = async (id: string) => {
    await apiSetDefault(id);
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  };

  const remove = async (id: string) => {
    await apiDelete(id);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    accounts,
    isLoading,
    isSubmitting,
    fetchAccounts,
    addAccount,
    setDefault,
    remove,
  };
};
