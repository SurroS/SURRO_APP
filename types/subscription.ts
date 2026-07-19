export interface PlanFeature {
  key: string;
  label: string;
  enabled: boolean;
}

export interface PlanRegion {
  region: string;
  currency: string;
  price: number;
  symbol: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  role: "AGENT" | "PARENT";
  interval: "MONTHLY" | "YEARLY";
  intervalCount: number;
  isActive: boolean;
  features: PlanFeature[];
  regions: PlanRegion[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  planId?: string;
  planName?: string;
  expiresAt?: string;
  activatedAt?: string;
}

export interface ActivateSubscriptionResponse {
  expiresAt: string;
  cost: number;
  newBalance: number;
  planId: string;
}

export interface SubscriptionPricingResponse {
  plans: SubscriptionPlan[];
}
