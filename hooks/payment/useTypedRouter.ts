import { useRouter } from "expo-router";
import { PaymentRoutes, PaymentGateway, PaymentMode } from "@/types/payment";

export function useTypedRouter() {
  const router = useRouter();

  const pushModeScreen = (gateway: PaymentGateway) => {
    router.push({
      pathname: "/(tabs)/home/walletFlow/paymentMode",
      params: { gateway },
    });
  };

  const pushEntryScreen = (gateway: PaymentGateway, mode: PaymentMode) => {
    router.push({
      pathname: "/(tabs)/home/walletFlow/paymentEntry",
      params: { gateway, mode },
    });
  };

  const pushWebViewScreen = (url: string, gateway: PaymentGateway, mode: PaymentMode) => {
    router.push({
      pathname: "/(tabs)/home/walletFlow/paymentWebView",
      params: { paymentUrl: url, gateway, mode },
    });
  };

  return { pushModeScreen, pushEntryScreen, pushWebViewScreen };
}
