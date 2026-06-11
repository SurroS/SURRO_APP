import { authenticatedPost } from "./httpClient";

interface PaymentInitPayload {
  amount: number;
  gateway: string;
  channel: string;
}

interface PaymentInitResponse {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
    gateway: string;
  };
}

interface VerifyPaymentPayload {
  reference: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  data: {
    status: string;
    reference: string;
    amount: number;
    credited: boolean;
    new_balance?: number;
  };
}

export const verifyPayment = async (
  reference: string,
): Promise<VerifyPaymentResponse> => {
  console.log("[PaymentAPI] verifyPayment reference:", reference);
  const response = await authenticatedPost("/payments/verify", { reference });
  console.log("[PaymentAPI] verifyPayment response:", JSON.stringify(response, null, 2));
  return response;
};

export const initiatePaymentFrontend = async (
  payload: PaymentInitPayload,
  token?: string | null, // optional, pass from secure storage
): Promise<PaymentInitResponse> => {
  console.log("[PaymentAPI] initiatePaymentFrontend payload:", JSON.stringify(payload, null, 2));

  const response = await authenticatedPost("/payments/init", payload);

  console.log("[PaymentAPI] initiatePaymentFrontend response:", JSON.stringify(response, null, 2));

  return response;
};
