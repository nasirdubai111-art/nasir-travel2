// src/services/userApi.ts
// User Profile & Preferences Service

import { apiClient } from "./apiClient";
import { ApiResponse, UserProfile } from "../types/api";

export const userApi = {
  // Get logged-in user profile
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>("/api/user/profile");
  },

  // Update profile
  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>("/api/user/profile", updates);
  },

  // Devotee / Traveler KYC verification
  async submitKyc(data: { aadhaarNumber?: string; panNumber?: string; documentUrl?: string }): Promise<ApiResponse<{ kycVerified: boolean }>> {
    return apiClient.post("/api/user/kyc", data);
  },

  // Travel preferences
  async updatePreferences(preferences: {
    mealPreference?: "VEG" | "JAIN" | "NON_VEG";
    seatPreference?: "WINDOW" | "AISLE" | "LOWER_BERTH";
    preferredPayment?: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post("/api/user/preferences", preferences);
  },
};

export default userApi;
