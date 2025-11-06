import axios from "axios";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || "https://dev.surrosantara.space/api/v1";

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
  token?: string|null // optional, pass from secure storage
): Promise<PaymentInitResponse> => {
  const response = await axios.post<PaymentInitResponse>(
    `${API_BASE}/payments/init`,
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
