import { authenticatedPost } from "./httpClient";

interface PaymentInitPayload {
  amount: number;
  gateway: string;
  channel: string;
  location: string;
}

interface PaymentInitResponse {
  success: boolean;
  data: {
    authorization_url: string;
    reference: string;
    gateway: string;
  };
}

export const initiatePaymentFrontend = async (
  payload: PaymentInitPayload,
  token?: string | null, // optional, pass from secure storage
): Promise<PaymentInitResponse> => {
  // If token is provided explicitly, use it; otherwise rely on httpClient's auth interceptor
  const response = await authenticatedPost("/payments/init", payload);

  return response;
};
