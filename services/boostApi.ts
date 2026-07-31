import { authenticatedGet, authenticatedPost } from "./httpClient";

export interface BoostPlan {
  hours: number;
  cost: number;
  label: string;
}

export interface BoostPricingResponse {
  plans: BoostPlan[];
}

export interface ActivateBoostResponse {
  expiresAt: string;
  cost: number;
  newBalance: number;
}

export interface BoostStatus {
  isBoosted: boolean;
  expiresAt: string | null;
}

export interface BoostedProfile {
  userId: string;
  firstName: string;
  userName: string;
  profilePicture: string | null;
  role: string;
  boostExpiresAt: string;
}

export interface BoostedProfilesResponse {
  boosted: BoostedProfile[];
}

export async function getBoostPricing(): Promise<BoostPricingResponse> {
  const response = await authenticatedGet("/profile/boost/pricing");
  return response?.data ?? response;
}

export async function activateBoost(
  planHours: number,
): Promise<ActivateBoostResponse> {
  const response = await authenticatedPost("/profile/boost", { planHours });
  return response?.data ?? response;
}

export async function getBoostStatus(): Promise<BoostStatus | null> {
  const response = await authenticatedGet("/profile/boost/active");
  return response?.data ?? response ?? null;
}

export async function getBoostedProfiles(): Promise<BoostedProfilesResponse> {
  const response = await authenticatedGet("/profile/boosted");
  return response?.data ?? response;
}
