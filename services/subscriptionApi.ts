import { authenticatedGet, authenticatedPost } from "./httpClient";
import type { SubscriptionPricingResponse, SubscriptionStatus, ActivateSubscriptionResponse } from "@/types/subscription";

export const getSubscriptionPricing = async (): Promise<SubscriptionPricingResponse> => {
  try {
    const r = await authenticatedGet<SubscriptionPricingResponse>("/subscription/plans");
    return r?.data ?? r ?? { plans: [] };
  } catch { return { plans: [] }; }
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const r = await authenticatedGet<SubscriptionStatus>("/subscription/active");
    return r?.data ?? r ?? { isSubscribed: false };
  } catch { return { isSubscribed: false }; }
};

export const activateSubscription = async (planId: string): Promise<ActivateSubscriptionResponse> => {
  try {
    const r = await authenticatedPost<ActivateSubscriptionResponse>("/subscription/activate", { planId });
    return r?.data ?? r;
  } catch { throw new Error("Subscription not available"); }
};
