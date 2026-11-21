// src/services/authApi.ts
// Supabase Authentication & Customer Profile Integration Service

import { supabase } from "../lib/supabase";
import { CustomerUser, RegisterParams, LoginParams } from "../types/auth";
import { apiClient } from "./apiClient";
import { ApiResponse, AuthSession } from "../types/api";

export const authApi = {
  /**
   * 1. Register a new Customer via Supabase Auth & PostgreSQL sync
   */
  async register(params: RegisterParams): Promise<{
    success: boolean;
    user?: CustomerUser;
    requiresVerification?: boolean;
    error?: string;
  }> {
    try {
      const countryCode = params.countryCode || "+91";
      const cleanPhone = params.mobileNumber.replace(/\D/g, "");
      const fullPhone = `${countryCode} ${cleanPhone}`;

      // 1. Call Supabase Auth signUp
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim().toLowerCase(),
        password: params.password,
        options: {
          data: {
            full_name: params.fullName.trim(),
            phone: fullPhone,
            mobile_number: cleanPhone,
            country_code: countryCode,
            role: "customer",
          },
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Registration failed. Please check your credentials.",
        };
      }

      const authUser = data.user;
      if (!authUser) {
        return {
          success: false,
          error: "Registration failed: No user returned by authentication gateway.",
        };
      }

      const customerId = `BY-CUST-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Sync to PostgreSQL public.users (client or via backend)
      const customerRecord: CustomerUser = {
        id: authUser.id,
        customerId,
        email: authUser.email || params.email,
        fullName: params.fullName.trim(),
        mobileNumber: cleanPhone,
        countryCode,
        accountStatus: "ACTIVE",
        emailVerified: Boolean(authUser.email_confirmed_at),
        role: "customer",
        kycStatus: "pending",
        walletBalance: 1000,
        yatraCoins: 250,
        membershipTier: "Silver",
        createdAt: authUser.created_at || new Date().toISOString(),
      };

      try {
        // Attempt insert directly to Supabase public.users
        await supabase.from("users").upsert({
          id: customerRecord.id,
          customer_id: customerRecord.customerId,
          email: customerRecord.email,
          full_name: customerRecord.fullName,
          phone: fullPhone,
          mobile_number: customerRecord.mobileNumber,
          country_code: customerRecord.countryCode,
          role: customerRecord.role,
          account_status: customerRecord.accountStatus,
          email_verified: customerRecord.emailVerified,
          kyc_status: customerRecord.kycStatus,
          updated_at: new Date().toISOString(),
        } as any);
      } catch {
        // Silently continue if public.users is written via auth trigger or backend
      }

      // 3. Fallback sync to local Express backend if running in mixed mode
      try {
        await apiClient.post("/api/v1/auth/customer/register", {
          id: authUser.id,
          customerId,
          name: customerRecord.fullName,
          email: customerRecord.email,
          phone: fullPhone,
          mobileNumber: cleanPhone,
          countryCode,
        });
      } catch {}

      const requiresVerification = !authUser.email_confirmed_at && (!data.session);

      return {
        success: true,
        user: customerRecord,
        requiresVerification,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "An unexpected error occurred during registration.",
      };
    }
  },

  /**
   * 2. Customer Login via Supabase Auth
   */
  async login(params: LoginParams): Promise<{
    success: boolean;
    user?: CustomerUser;
    session?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim().toLowerCase(),
        password: params.password,
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "Incorrect email or password. Please verify and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMsg = "Your email address has not been verified yet. Please check your inbox or resend the verification code.";
        }
        return {
          success: false,
          error: errorMsg,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: "Authentication failed: User account not found.",
        };
      }

      // Fetch user profile from public.users table
      const profile = await this.getProfile(data.user.id, data.user);

      if (typeof window !== "undefined") {
        if (data.session?.access_token) {
          localStorage.setItem("bharatyatra_auth_token", data.session.access_token);
        }
        localStorage.setItem("bharatyatra_customer_profile", JSON.stringify(profile));
      }

      return {
        success: true,
        user: profile,
        session: data.session,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to sign in. Please try again.",
      };
    }
  },

  /**
   * 3. Fetch Full Profile from public.users table or fallback
   */
  async getProfile(userId: string, authUser?: any): Promise<CustomerUser> {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        const row = data as any;
        return {
          id: row.id,
          customerId: row.customer_id || `BY-CUST-${row.id.slice(0, 6).toUpperCase()}`,
          email: row.email || authUser?.email || "",
          fullName: row.full_name || authUser?.user_metadata?.full_name || "BharatYatra Traveler",
          mobileNumber: row.mobile_number || row.phone || authUser?.user_metadata?.mobile_number || "",
          countryCode: row.country_code || "+91",
          accountStatus: (row.account_status as any) || "ACTIVE",
          emailVerified: Boolean(row.email_verified || authUser?.email_confirmed_at),
          role: (row.role as any) || "customer",
          kycStatus: (row.kyc_status as any) || "pending",
          avatarUrl: row.avatar_url || authUser?.user_metadata?.avatar_url,
          walletBalance: 1250,
          yatraCoins: 350,
          membershipTier: "Gold",
          createdAt: row.created_at || authUser?.created_at || new Date().toISOString(),
          updatedAt: row.updated_at,
        };
      }
    } catch {}

    // Fallback if public.users is not yet synced
    return {
      id: userId,
      customerId: `BY-CUST-${userId.slice(0, 6).toUpperCase()}`,
      email: authUser?.email || "traveler@bharatyatra.in",
      fullName: authUser?.user_metadata?.full_name || "BharatYatra Traveler",
      mobileNumber: authUser?.user_metadata?.mobile_number || authUser?.user_metadata?.phone || "9876543210",
      countryCode: authUser?.user_metadata?.country_code || "+91",
      accountStatus: "ACTIVE",
      emailVerified: Boolean(authUser?.email_confirmed_at),
      role: "customer",
      kycStatus: "pending",
      walletBalance: 1250,
      yatraCoins: 350,
      membershipTier: "Gold",
      createdAt: authUser?.created_at || new Date().toISOString(),
    };
  },

  /**
   * 4. Verify Email Address using OTP or Token
   */
  async verifyEmail(email: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: "signup",
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Invalid or expired verification code.",
        };
      }

      // Update email_verified in public.users
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await (supabase as any).from("users").update({
            email_verified: true,
            account_status: "ACTIVE",
            updated_at: new Date().toISOString(),
          }).eq("id", user.id);
        }
      } catch {}

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to verify email address.",
      };
    }
  },

  /**
   * 5. Resend Verification Email
   */
  async resendVerification(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to resend verification email.",
        };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Error resending verification email.",
      };
    }
  },

  /**
   * 6. Forgot Password: Send Reset Link
   */
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/?action=reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Unable to send password reset link.",
        };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Error initiating password reset.",
      };
    }
  },

  /**
   * 7. Reset Password with new password
   */
  async resetPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Failed to update password.",
        };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Error updating password.",
      };
    }
  },

  /**
   * 8. Logout
   */
  async logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
    try {
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem("bharatyatra_auth_token");
        localStorage.removeItem("bharatyatra_customer_profile");
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

  /**
   * 9. Current Session Check
   */
  async getSession(): Promise<ApiResponse<AuthSession | null>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = await this.getProfile(session.user.id, session.user);
        return {
          success: true,
          data: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at || Date.now() + 3600000,
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              phone: user.mobileNumber,
              membershipTier: "BHARAT_CLUB",
              walletBalance: user.walletBalance,
              loyaltyPoints: user.yatraCoins,
              created_at: user.createdAt,
              verifiedKyc: user.kycStatus === "verified",
            },
          },
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: false,
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * 10. Update Profile in public.users
   */
  async updateProfile(userId: string, updates: Partial<CustomerUser>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await (supabase as any)
        .from("users")
        .update({
          full_name: updates.fullName,
          mobile_number: updates.mobileNumber,
          phone: updates.mobileNumber,
          country_code: updates.countryCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to update profile" };
    }
  },
};

export default authApi;
