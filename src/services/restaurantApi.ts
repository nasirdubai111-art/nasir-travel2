// src/services/restaurantApi.ts
// Highway Dhabas, Heritage Restaurants & Sattvic Food Service

import { apiClient } from "./apiClient";
import { ApiResponse, RestaurantItem } from "../types/api";

const MOCK_RESTAURANTS: RestaurantItem[] = [
  {
    id: "rst-sukhdev-murthal",
    name: "Amrik Sukhdev Dhaba",
    cuisine: ["North Indian", "Tandoori", "Sattvic Desi Ghee", "Lassi & Chai"],
    location: "NH-44, Murthal, Haryana",
    type: "Dhaba",
    rating: 4.9,
    averageCostForTwo: 500,
    popularDishes: ["Aloo Pyaaz Paratha with White Butter", "Special Murthal Dal Makhani", "Kullhad Lassi"],
  },
  {
    id: "rst-kashi-sattvic",
    name: "Kashi Heritage Bhojanalaya",
    cuisine: ["Pure Sattvic (No Onion, No Garlic)", "Banarasi Thali", "Banarasi Dum Aloo"],
    location: "Near Kashi Vishwanath Gate 4, Varanasi",
    type: "Sattvic Thali",
    rating: 4.95,
    averageCostForTwo: 420,
    popularDishes: ["Maharaja Sattvic Thali", "Kashi Malaiyyo (Winter)", "Banarasi Tamatar Chaat"],
  },
];

export const restaurantApi = {
  async getRestaurants(type?: string): Promise<ApiResponse<RestaurantItem[]>> {
    const res = await apiClient.get<RestaurantItem[]>("/api/restaurants", {
      headers: type ? { "X-Restaurant-Type": type } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_RESTAURANTS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  async reserveTable(reservation: { restaurantId: string; guests: number; dateTime: string; specialRequests?: string }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/restaurants/reserve", reservation);
  },

  async orderHighwayDelivery(orderDetails: { restaurantId: string; vehicleNumber?: string; items: any[] }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/restaurants/order", orderDetails);
  },
};

export default restaurantApi;
