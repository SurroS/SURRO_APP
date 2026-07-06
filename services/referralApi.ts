import { authenticatedGet, authenticatedPost } from "./httpClient";
import { ReferredUser } from "@/types/auth";

export interface ReferralRewardResponse {
  creditedAmount: number;
  totalAmount: number;
  redeemedCount: number;
  newBalance: number;
}

export const fetchReferrals = async (): Promise<ReferredUser[]> => {
  const res = await authenticatedGet("/referrals");
  console.log("[ReferralApi] GET /referrals response:", JSON.stringify(res, null, 2));
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  if (res?.referrals && Array.isArray(res.referrals)) return res.referrals;
  return [];
};

export const redeemReferralRewards = async (): Promise<ReferralRewardResponse> => {
  const res = await authenticatedPost("/referrals/redeem");
  console.log("[ReferralApi] POST /referrals/redeem response:", JSON.stringify(res, null, 2));
  return res;
};
