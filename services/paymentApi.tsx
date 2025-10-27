import axios from "axios";

export interface CardDetails {
  number: string;
  exp: string; // MM/YY
  cvv: string;
}

export async function initiatePaymentFrontend(
  gateway: string,
  mode: "card" | "bank" | "ussd",
  amount: number,
  email: string,
  card?: CardDetails
) {
  try {
    // Only send safe info
    const payload = {
      gateway,
      mode,
      amount,
      email,
      card, // only if mode === "card"
    };

    // Call your NestJS backend endpoint
    const response = await axios.post<{ paymentUrl: string }>(
      "https://your-backend.com/api/payments/initiate",
      payload
    );

    // Backend returns the secure WebView URL
    return response.data.paymentUrl;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw new Error("Failed to initiate payment");
  }
}
