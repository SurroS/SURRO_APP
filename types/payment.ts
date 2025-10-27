export type PaymentGateway = "paystack" | "flutterwave" | "stripe" | "interswitch";
export type PaymentMode = "card" | "bank" | "ussd" | "mobile" | "quickteller";

export interface PaymentRoutes {
  PaymentMethodScreen: {};
  PaymentModeScreen: { gateway: PaymentGateway };
  PaymentEntryScreen: { gateway: PaymentGateway; mode: PaymentMode };
  PaymentWebViewScreen: { paymentUrl: string; gateway: PaymentGateway; mode: PaymentMode };
}
