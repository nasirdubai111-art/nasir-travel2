// src/services/jungleSafariApi.ts
// National Park Jeep Safaris & Forest Department Permit API Service

import { apiClient } from "./apiClient";
import { ApiResponse, JungleSafariPackage } from "../types/api";

const MOCK_SAFARIS: JungleSafariPackage[] = [
  {
    id: "sf-ranthambore-zone3",
    parkName: "Ranthambore National Park",
    state: "Rajasthan",
    zone: "Zone 3 (Padam Talao & Fort View)",
    slot: "MORNING",
    vehicleType: "Gypsy 4x4",
    permitPrice: 2200,
    naturalistGuideIncluded: true,
  },
  {
    id: "sf-kaziranga-bagori",
    parkName: "Kaziranga National Park",
    state: "Assam",
    zone: "Bagori (Western Range - Rhino Core)",
    slot: "MORNING",
    vehicleType: "Gypsy 4x4",
    permitPrice: 2600,
    naturalistGuideIncluded: true,
  },
  {
    id: "sf-gir-devalia",
    parkName: "Gir National Park & Lion Sanctuary",
    state: "Gujarat",
    zone: "Sasan Gir Core Route 1",
    slot: "AFTERNOON",
    vehicleType: "Gypsy 4x4",
    permitPrice: 2450,
    naturalistGuideIncluded: true,
  },
];

export const jungleSafariApi = {
  async getAvailableSafaris(parkName?: string): Promise<ApiResponse<JungleSafariPackage[]>> {
    const res = await apiClient.get<JungleSafariPackage[]>("/api/safaris", {
      headers: parkName ? { "X-Park": parkName } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: parkName ? MOCK_SAFARIS.filter((s) => s.parkName.toLowerCase().includes(parkName.toLowerCase())) : MOCK_SAFARIS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async bookForestPermit(permitRequest: {
    safariId: string;
    date: string;
    slot: string;
    travelers: Array<{ name: string; age: number; idProofType: string; idProofNumber: string }>;
  }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/safaris/permit-book", permitRequest);
  },
};

export default jungleSafariApi;
