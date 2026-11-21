// src/types/auth.ts
// Supabase Authentication & Customer Profile Type Definitions

export interface CustomerUser {
  id: string; // Supabase Auth UUID
  customerId: string; // Unique customer identifier (e.g. BY-CUST-001001)
  email: string;
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  accountStatus: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
  emailVerified: boolean;
  role: "customer" | "operator" | "agent" | "driver" | "admin" | "super_admin";
  kycStatus: "pending" | "verified" | "rejected";
  avatarUrl?: string;
  walletBalance: number;
  yatraCoins: number;
  membershipTier: "Silver" | "Gold" | "Platinum Yatri";
  gstNumber?: string;
  companyName?: string;
  preferredCurrency?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  mobileNumber: string;
  countryCode?: string;
  agreeToTerms?: boolean;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: CustomerUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
