// src/services/pilgrimageApi.ts
// Sacred Yatras, Temple Trust VIP Darshan & Devotee E-Pass API Service

import { apiClient } from "./apiClient";
import { ApiResponse, PilgrimageYatra } from "../types/api";
import { pilgrimageService } from "./pilgrimageService";

export const pilgrimageApi = {
  // Get all registered sacred circuits
  async getYatras(): Promise<ApiResponse<PilgrimageYatra[]>> {
    const res = await apiClient.get<PilgrimageYatra[]>("/api/pilgrimage/yatras");
    if (res.success && res.data && res.data.length > 0) return res;

    // Bridge with existing rich local pilgrimageService dataset
    const localPackages = pilgrimageService.getPackages();
    const mapped: PilgrimageYatra[] = localPackages.map((pkg) => ({
      id: pkg.packageId,
      title: pkg.packageName,
      sacredCircuit: (pkg.circuit.includes("Char Dham")
        ? "Chardham"
        : pkg.circuit.includes("Kashi")
        ? "Kashi Vishwanath"
        : "Tirupati Balaji") as any,
      durationDays: parseInt(pkg.duration.split(" ")[0]) || 5,
      basePrice: pkg.basePriceAdult,
      vipDarshanSupported: pkg.vipDarshanFee > 0 || pkg.highlights.some((h) => h.toLowerCase().includes("darshan")),
      prasadDeliveryOption: true,
      seniorFriendlyPalki: true,
      upcomingBatches: pkg.availableBatchDates.map((date) => ({
        date,
        seatsAvailable: pkg.remainingSeatsCurrentBatch,
      })),
    }));

    return {
      success: true,
      data: mapped,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Get specific yatra details
  async getYatraDetails(yatraId: string): Promise<ApiResponse<any>> {
    const res = await apiClient.get(`/api/pilgrimage/yatras/${yatraId}`);
    if (res.success && res.data) return res;

    const localPkg = pilgrimageService.getPackageById(yatraId);
    return {
      success: true,
      data: localPkg,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Book sacred yatra with devotee details
  async bookYatra(bookingData: any): Promise<ApiResponse<any>> {
    const res = await apiClient.post("/api/pilgrimage/book", bookingData);
    if (res.success && res.data) return res;

    try {
      const record = pilgrimageService.createCustomerBooking(bookingData);
      return {
        success: true,
        data: record,
        timestamp: new Date().toISOString(),
        source: "LOCAL_FALLBACK",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to create pilgrimage booking",
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Devasthanam VIP Sugam Darshan Slot Booking
  async reserveDevasthanamSlot(slotData: { temple: string; date: string; timeSlot: string; devoteeCount: number }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/pilgrimage/darshan-slot", slotData);
  },
};

export default pilgrimageApi;
