// src/services/passengerApi.ts
// Saved Passenger Directory, Co-Travelers & Devotee Master API Service

import { apiClient } from "./apiClient";
import { ApiResponse, Passenger } from "../types/api";

const MOCK_PASSENGERS: Passenger[] = [
  {
    id: "pax-01",
    fullName: "Rohan Sharma",
    age: 32,
    gender: "Male",
    berthPreference: "Lower Berth",
    seatNumber: "B3-24",
    aadhaarNumber: "XXXX-XXXX-8921",
  },
  {
    id: "pax-02",
    fullName: "Priya Sharma",
    age: 29,
    gender: "Female",
    berthPreference: "Middle Berth",
    seatNumber: "B3-25",
    aadhaarNumber: "XXXX-XXXX-4512",
  },
  {
    id: "pax-03",
    fullName: "Savitri Devi",
    age: 68,
    gender: "Female",
    berthPreference: "Lower Berth (Senior Citizen)",
    seatNumber: "B3-21",
    aadhaarNumber: "XXXX-XXXX-1102",
  },
];

export const passengerApi = {
  // Get all saved co-travelers
  async getSavedPassengers(): Promise<ApiResponse<Passenger[]>> {
    const res = await apiClient.get<Passenger[]>("/api/passengers");
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: MOCK_PASSENGERS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Save new passenger
  async addPassenger(passenger: Omit<Passenger, "id">): Promise<ApiResponse<Passenger>> {
    const res = await apiClient.post<Passenger>("/api/passengers", passenger);
    if (res.success && res.data) return res;

    const newPax: Passenger = {
      ...passenger,
      id: `pax-${Date.now()}`,
    };

    return {
      success: true,
      data: newPax,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Remove passenger
  async deletePassenger(passengerId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return apiClient.delete(`/api/passengers/${passengerId}`);
  },
};

export default passengerApi;
