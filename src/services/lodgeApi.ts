// src/services/lodgeApi.ts
// Wildlife Safari Lodges & Forest Retreats API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Lodge } from "../types/api";

const MOCK_LODGES: Lodge[] = [
  {
    id: "ldg-corbett-river",
    name: "Corbett Riverside Wilderness Lodge",
    nationalPark: "Jim Corbett National Park",
    safariZone: "Dhikala & Bijrani",
    rating: 4.8,
    roomTypes: [
      {
        id: "rm-river-tent",
        name: "Luxury Glamping Safari Tent with Kosi River View",
        pricePerNight: 8500,
        safariIncluded: true,
      },
      {
        id: "rm-forest-cottage",
        name: "Heritage Forest Log Cottage",
        pricePerNight: 6200,
        safariIncluded: false,
      },
    ],
  },
  {
    id: "ldg-kanha-earth",
    name: "Singinawa Jungle Lodge Kanha",
    nationalPark: "Kanha National Park",
    safariZone: "Mukki Zone",
    rating: 4.9,
    roomTypes: [
      {
        id: "rm-jungle-bungalow",
        name: "Stone Jungle Bungalow with Open Shower",
        pricePerNight: 12500,
        safariIncluded: true,
      },
    ],
  },
];

export const lodgeApi = {
  async getLodges(nationalPark?: string): Promise<ApiResponse<Lodge[]>> {
    const res = await apiClient.get<Lodge[]>("/api/lodges", {
      headers: nationalPark ? { "X-National-Park": nationalPark } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: nationalPark
        ? MOCK_LODGES.filter((l) => l.nationalPark.toLowerCase().includes(nationalPark.toLowerCase()))
        : MOCK_LODGES,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async getLodgeDetails(lodgeId: string): Promise<ApiResponse<Lodge | null>> {
    const res = await apiClient.get<Lodge>(`/api/lodges/${lodgeId}`);
    if (res.success && res.data) return res;
    return {
      success: true,
      data: MOCK_LODGES.find((l) => l.id === lodgeId) || MOCK_LODGES[0],
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },
};

export default lodgeApi;
