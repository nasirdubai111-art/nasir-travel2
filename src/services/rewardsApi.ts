// src/services/rewardsApi.ts
// Loyalty Points, Bharat Club Tier & Reward Vouchers API Service

import { apiClient } from "./apiClient";
import { ApiResponse, RewardsSummary } from "../types/api";

export const rewardsApi = {
  // Get loyalty summary
  async getRewardsSummary(): Promise<ApiResponse<RewardsSummary>> {
    const res = await apiClient.get<RewardsSummary>("/api/rewards/summary");
    if (res.success && res.data) return res;

    return {
      success: true,
      data: {
        userId: "usr-current",
        pointsAvailable: 2840,
        tier: "Gold",
        pointsExpiringSoon: 450,
        vouchers: [
          { code: "BHARATFLY10", discountPercent: 10, validUntil: "2026-12-31" },
          { code: "YATRADARSHAN", discountPercent: 15, validUntil: "2026-11-15" },
        ],
      },
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Redeem points for voucher or checkout discount
  async redeemPoints(points: number): Promise<ApiResponse<{ voucherCode: string; valueInRupees: number }>> {
    return apiClient.post("/api/rewards/redeem", { points });
  },
};

export default rewardsApi;
