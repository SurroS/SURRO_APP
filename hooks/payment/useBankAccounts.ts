import { useState } from "react";

type BankAccount = {
  bankName?: string;
  holderName: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
};

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    // Mock fetching (replace with real API)
    setTimeout(() => {
      setAccounts([]); // or prefill with test data
      setIsLoading(false);
    }, 800);
  };

  const addAccount = async (account: BankAccount) => {
    setIsSubmitting(true);
    // Mock submission
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAccounts((prev) => [...prev, account]);
        setIsSubmitting(false);
        resolve();
      }, 1000);
    });
  };

  return {
    accounts,
    isLoading,
    isSubmitting,
    fetchAccounts,
    addAccount,
  };
};
