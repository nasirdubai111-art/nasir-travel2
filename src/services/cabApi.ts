// src/services/cabApi.ts
// Outstation, Local & Airport Cab Rental API Service

import { apiClient } from "./apiClient";
import { ApiResponse, CabVehicle, CabBookingParams } from "../types/api";

const MOCK_VEHICLES: CabVehicle[] = [
  {
    id: "cab-sedan-dzire",
    model: "Maruti Suzuki Dzire",
    category: "Sedan",
    seatingCapacity: 4,
    baseFare: 450,
    perKmRate: 14,
    estimatedTimeMin: 4,
    driverRating: 4.85,
    acAvailable: true,
  },
  {
    id: "cab-suv-ertiga",
    model: "Maruti Ertiga Hybrid",
    category: "SUV",
    seatingCapacity: 6,
    baseFare: 650,
    perKmRate: 18,
    estimatedTimeMin: 7,
    driverRating: 4.9,
    acAvailable: true,
  },
  {
    id: "cab-innova-crysta",
    model: "Toyota Innova Crysta",
    category: "Innova Crysta",
    seatingCapacity: 7,
    baseFare: 950,
    perKmRate: 23,
    estimatedTimeMin: 5,
    driverRating: 4.95,
    acAvailable: true,
  },
  {
    id: "cab-ev-nexon",
    model: "Tata Nexon EV Max",
    category: "Luxury EV",
    seatingCapacity: 4,
    baseFare: 550,
    perKmRate: 16,
    estimatedTimeMin: 6,
    driverRating: 4.88,
    acAvailable: true,
  },
];

export const cabApi = {
  // Get available vehicles nearby
  async getAvailableCabs(pickupCoords?: { lat: number; lng: number }): Promise<ApiResponse<CabVehicle[]>> {
    const res = await apiClient.post<CabVehicle[]>("/api/cabs/available", { pickupCoords });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_VEHICLES,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Calculate fare estimate
  async calculateFare(params: CabBookingParams): Promise<ApiResponse<{ estimatedFare: number; distanceKm: number; durationMinutes: number }>> {
    const res = await apiClient.post("/api/cabs/fare-estimate", params);
    if (res.success && res.data) return res;

    return {
      success: true,
      data: {
        estimatedFare: 840,
        distanceKm: 28,
        durationMinutes: 45,
      },
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Dispatch / Book cab
  async bookCab(bookingData: CabBookingParams & { customerName: string; phone: string }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/cabs/book", bookingData);
  },

  // Live driver GPS track
  async trackDriver(bookingId: string): Promise<ApiResponse<{ lat: number; lng: number; etaMinutes: number; driverName: string }>> {
    return apiClient.get(`/api/cabs/track/${bookingId}`);
  },
};

export default cabApi;
