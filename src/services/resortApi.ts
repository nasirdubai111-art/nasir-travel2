// src/services/resortApi.ts
// Luxury Resorts, Private Villas & Wellness Stays API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Resort } from "../types/api";

const MOCK_RESORTS: Resort[] = [
  {
    id: "rst-kumarakom-lake",
    name: "Kumarakom Lake Resort",
    location: "Kottayam, Kerala Backwaters",
    theme: "BACKWATER_ECO",
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"],
    villaTypes: [
      {
        id: "vil-heritage-lake",
        title: "Heritage Lake Villa with Private Plunge Pool",
        price: 24500,
        amenities: ["Private Pool", "Ayurvedic Spa Package", "Sunset Cruise"],
      },
      {
        id: "vil-meandering-pool",
        title: "Meandering Pool Villa Duplex",
        price: 18900,
        amenities: ["Direct Pool Access", "Traditional Open Courtyard"],
      },
    ],
  },
  {
    id: "rst-ananda-himalayas",
    name: "Ananda in the Himalayas",
    location: "Rishikesh, Uttarakhand",
    theme: "MOUNTAIN_WELLNESS",
    rating: 4.95,
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80"],
    villaTypes: [
      {
        id: "vil-palace-view",
        title: "Palace View Wellness Suite",
        price: 38000,
        amenities: ["Daily Yoga & Meditation", "Vedanta Lectures", "Ayurvedic Consult"],
      },
    ],
  },
];

export const resortApi = {
  async getResorts(filters?: { theme?: string; location?: string }): Promise<ApiResponse<Resort[]>> {
    const res = await apiClient.get<Resort[]>("/api/resorts", {
      headers: filters ? { "X-Theme": filters.theme || "" } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_RESORTS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async getResortDetails(resortId: string): Promise<ApiResponse<Resort | null>> {
    const res = await apiClient.get<Resort>(`/api/resorts/${resortId}`);
    if (res.success && res.data) return res;
    return {
      success: true,
      data: MOCK_RESORTS.find((r) => r.id === resortId) || MOCK_RESORTS[0],
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async reserveVilla(villaId: string, bookingDetails: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/resorts/villas/${villaId}/book`, bookingDetails);
  },
};

export default resortApi;
