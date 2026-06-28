import { authenticatedGet, authenticatedPost } from "./httpClient";

export interface SubscriptionPlan {
  id: string;
  label: string;
  months: number;
  cost: number;
}

export interface SubscriptionPricingResponse {
  plans: SubscriptionPlan[];
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  planId?: string;
  expiresAt?: string;
}

export interface ActivateSubscriptionResponse {
  expiresAt: string;
  cost: number;
  newBalance: number;
}

export const getSubscriptionPricing = () =>
  authenticatedGet<SubscriptionPricingResponse>("/profile/subscription/pricing")
    .then((r) => r?.data ?? r);

export const getSubscriptionStatus = () =>
  authenticatedGet<SubscriptionStatus>("/profile/subscription/active")
    .then((r) => r?.data ?? r);

export const activateSubscription = (planId: string) =>
  authenticatedPost<ActivateSubscriptionResponse>("/profile/subscription/activate", { planId })
    .then((r) => r?.data ?? r);
