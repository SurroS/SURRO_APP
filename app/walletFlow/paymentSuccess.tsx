import React from "react";
import { useRouter } from "expo-router";
import { useWalletStore } from "@/store/wallet/walletStore";
import PaymentStatusScreen from "@/components/wallet/PaymentStatus";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const fetchWallet = useWalletStore((s) => s.fetchWallet);

  const handleDone = async () => {
    await fetchWallet();
    router.replace("/walletFlow");
  };

  return <PaymentStatusScreen onDone={handleDone} />;
}
