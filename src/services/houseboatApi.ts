// src/services/houseboatApi.ts
// Kerala Backwaters & Dal Lake Houseboat Cruises API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Houseboat } from "../types/api";

const MOCK_HOUSEBOATS: Houseboat[] = [
  {
    id: "hb-alleppey-kettuvallam",
    boatName: "Golden Waters Royal Kettuvallam",
    waterway: "Alleppey",
    category: "Luxury Presidential",
    bedrooms: 2,
    pricePerNight: 16500,
    chefIncluded: true,
    acHours: "24 Hours Full AC",
  },
  {
    id: "hb-kumarakom-eco",
    boatName: "Vembanad Queen Eco Cruise",
    waterway: "Kumarakom",
    category: "Premium",
    bedrooms: 1,
    pricePerNight: 11200,
    chefIncluded: true,
    acHours: "9:00 PM to 6:00 AM AC in Bedroom",
  },
  {
    id: "hb-srinagar-dal",
    boatName: "Kashmir Heritage Dal Palace",
    waterway: "Dal Lake Srinagar",
    category: "Deluxe",
    bedrooms: 3,
    pricePerNight: 8900,
    chefIncluded: true,
    acHours: "Central Heated / AC",
  },
];

export const houseboatApi = {
  async getHouseboats(waterway?: string): Promise<ApiResponse<Houseboat[]>> {
    const res = await apiClient.get<Houseboat[]>("/api/houseboats", {
      headers: waterway ? { "X-Waterway": waterway } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: waterway ? MOCK_HOUSEBOATS.filter((h) => h.waterway.toLowerCase().includes(waterway.toLowerCase())) : MOCK_HOUSEBOATS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async bookCruise(cruiseDetails: { houseboatId: string; checkIn: string; guests: number; mealPlan: string }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/houseboats/book", cruiseDetails);
  },
};

export default houseboatApi;
