// src/services/busApi.ts
// Intercity & State Transport Bus Booking API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Bus, BusSearchParams } from "../types/api";

const MOCK_BUSES: Bus[] = [
  {
    id: "bus-zing-881",
    operatorName: "Zingbus Electric Intercity",
    busType: "Volvo Multi-Axle",
    departureTime: "21:30",
    arrivalTime: "06:45",
    duration: "9h 15m",
    boardingPoint: "Kashmere Gate ISBT, Delhi",
    droppingPoint: "Alambagh Bus Station, Lucknow",
    fare: 899,
    availableSeats: 18,
    totalSeats: 42,
    rating: 4.7,
    amenities: ["AC", "Charging Point", "Blanket", "Water Bottle", "Emergency SOS"],
  },
  {
    id: "bus-intrcity-204",
    operatorName: "IntrCity SmartBus",
    busType: "AC Sleeper",
    departureTime: "22:00",
    arrivalTime: "07:30",
    duration: "9h 30m",
    boardingPoint: "Majestic Bus Stand, Bengaluru",
    droppingPoint: "Koyambedu CMBT, Chennai",
    fare: 950,
    availableSeats: 12,
    totalSeats: 36,
    rating: 4.8,
    amenities: ["AC", "Personal LCD", "CCTV", "Snacks", "Live Bus Tracking"],
  },
  {
    id: "bus-upsrtc-janrath",
    operatorName: "UPSRTC Janrath AC",
    busType: "BharatBenz AC",
    departureTime: "07:00",
    arrivalTime: "15:00",
    duration: "8h 00m",
    boardingPoint: "Anand Vihar, Delhi",
    droppingPoint: "Cantt Railway Station, Varanasi",
    fare: 1150,
    availableSeats: 24,
    totalSeats: 45,
    rating: 4.5,
    amenities: ["AC", "Reading Light", "Water Bottle"],
  },
];

export const busApi = {
  // Search buses
  async searchBuses(params: BusSearchParams): Promise<ApiResponse<Bus[]>> {
    const res = await apiClient.post<Bus[]>("/api/buses/search", params);
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_BUSES,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Bus seat layout
  async getBusSeatLayout(busId: string): Promise<ApiResponse<any>> {
    const res = await apiClient.get(`/api/buses/${busId}/seats`);
    if (res.success && res.data) return res;

    return {
      success: true,
      data: {
        busId,
        lowerDeck: Array.from({ length: 24 }, (_, i) => ({
          seatNumber: `L${i + 1}`,
          type: "SLEEPER",
          isAvailable: i % 3 !== 0,
          price: 950,
        })),
        upperDeck: Array.from({ length: 18 }, (_, i) => ({
          seatNumber: `U${i + 1}`,
          type: "SLEEPER",
          isAvailable: i % 2 === 0,
          price: 1050,
        })),
      },
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Boarding & Dropping points
  async getBoardingPoints(busId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`/api/buses/${busId}/points`);
  },
};

export default busApi;
