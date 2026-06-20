import { authenticatedGet, authenticatedPost } from "./httpClient";

export interface CurrentAd {
  id: string;
  imageUrl: string;
  linkUrl: string;
  rewardAmount: number;
}

export interface DailyAdStats {
  adsWatchedToday: number;
  earnedToday: number;
  dailyMax: number;
}

export interface ClaimAdResponse {
  rewardAmount: number;
  newBalance: number;
  adsWatchedToday: number;
}

export async function getCurrentAd(): Promise<CurrentAd | null> {
  const response = await authenticatedGet("/ads/current");
  return response?.data ?? response ?? null;
}

export async function getDailyAdStats(): Promise<DailyAdStats> {
  const response = await authenticatedGet("/ads/daily-stats");
  return response?.data ?? response;
}

export async function claimAdReward(adId: string): Promise<ClaimAdResponse> {
  const response = await authenticatedPost("/ads/claim", { adId });
  return response?.data ?? response;
}

export type AdAnalyticsEvent = "view" | "click" | "claim";

export async function sendAdAnalytics(
  adId: string,
  event: AdAnalyticsEvent,
): Promise<void> {
  await authenticatedPost("/ads/analytics", { adId, event });
}
