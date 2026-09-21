// src/services/partnerApi.ts
// B2B Partner Integrations & Travel Agent Whitelabel API Service

import { apiClient } from "./apiClient";
import { ApiResponse, PartnerB2BAgreement } from "../types/api";

const MOCK_PARTNERS: PartnerB2BAgreement[] = [
  {
    partnerId: "prt-makemytrip-corp",
    companyName: "MakeMyTrip Corporate Solutions",
    apiAccessTier: "HIGH_VOLUME_ENTERPRISE",
    apiKeyPrefix: "by_live_mmt_corp",
    rateLimitPerMinute: 1200,
    status: "ACTIVE",
  },
  {
    partnerId: "prt-easemytrip-irctc",
    companyName: "EaseMyTrip IRCTC Rail Gateway",
    apiAccessTier: "HIGH_VOLUME_ENTERPRISE",
    apiKeyPrefix: "by_live_emt_rail",
    rateLimitPerMinute: 2400,
    status: "ACTIVE",
  },
];

export const partnerApi = {
  // Get all B2B partner agreements
  async getPartners(): Promise<ApiResponse<PartnerB2BAgreement[]>> {
    const res = await apiClient.get<PartnerB2BAgreement[]>("/api/partners");
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_PARTNERS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Register new B2B agency partner
  async registerPartner(payload: Partial<PartnerB2BAgreement>): Promise<ApiResponse<PartnerB2BAgreement>> {
    return apiClient.post("/api/partners/register", payload);
  },

  // Regenerate API Key
  async rotateApiKey(partnerId: string): Promise<ApiResponse<{ newApiKeyPrefix: string }>> {
    return apiClient.post(`/api/partners/${partnerId}/rotate-key`);
  },
};

export default partnerApi;
