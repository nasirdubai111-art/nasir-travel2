// src/services/api/authApi.ts
// Supabase & BharatYatra Unified Auth API Service

import { apiClient } from "./apiClient";
import { ApiResponse, AuthCredentials, AuthSession, UserProfile } from "../../types/api";
import { supabase } from "../../lib/supabase";

export const authApi = {
  // Email/Password or Phone Login
  async login(credentials: AuthCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      if (credentials.email && credentials.password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (!error && data.session) {
          const user: UserProfile = {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || "BharatYatra Traveler",
            membershipTier: "BHARAT_CLUB",
            walletBalance: 1250,
            loyaltyPoints: 450,
            created_at: data.user.created_at,
            verifiedKyc: true,
          };
          const session: AuthSession = {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresAt: data.session.expires_at || Date.now() + 3600000,
            user,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("bharatyatra_auth_token", session.accessToken);
            localStorage.setItem("sb-token", session.accessToken);
          }
          return {
            success: true,
            data: session,
            timestamp: new Date().toISOString(),
            source: "REST",
          };
        }
      }

      // Backend fallback endpoint
      return await apiClient.post<AuthSession>("/api/auth/login", credentials);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Login failed",
        data: null as any,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Send OTP
  async sendOtp(phone: string): Promise<ApiResponse<{ message: string; otpSent: boolean }>> {
    return apiClient.post("/api/auth/send-otp", { phone });
  },

  // Verify OTP
  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<AuthSession>> {
    return apiClient.post("/api/auth/verify-otp", { phone, otp });
  },

  // Sign out
  async logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
    try {
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem("bharatyatra_auth_token");
        localStorage.removeItem("sb-token");
      }
      return {
        success: true,
        data: { loggedOut: true },
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: true,
        data: { loggedOut: true },
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Current session check
  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    return apiClient.get<AuthSession | null>("/api/auth/session");
  },
};

export default authApi;
