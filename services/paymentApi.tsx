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
  const response = await authenticatedPost("/payments/verify", { reference });
  return response;
};

export const initiatePaymentFrontend = async (
  payload: PaymentInitPayload,
  token?: string | null, // optional, pass from secure storage
): Promise<PaymentInitResponse> => {
  const response = await authenticatedPost("/payments/init", payload);

  return response;
};
