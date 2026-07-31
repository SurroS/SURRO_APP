export type PaymentGateway = 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERSWITCH'; 
export type PaymentMode = "card" | "bank_transfer" | "ussd" | "mobile" | "quickteller";

export interface PaymentRoutes {
  PaymentMethodScreen: {};
  PaymentModeScreen: { gateway: PaymentGateway };
  PaymentEntryScreen: { gateway: PaymentGateway; mode: PaymentMode };
  PaymentWebViewScreen: { paymentUrl: string; gateway: PaymentGateway; mode: PaymentMode; reference: string };
}