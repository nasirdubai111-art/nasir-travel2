import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { CustomerUser, RegisterParams, LoginParams } from "../types/auth";

export interface AuthContextType {
  user: CustomerUser | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (params: RegisterParams) => Promise<{
    success: boolean;
    user?: CustomerUser;
    requiresVerification?: boolean;
    error?: string;
  }>;
  login: (params: LoginParams) => Promise<{
    success: boolean;
    user?: CustomerUser;
    session?: any;
    error?: string;
  }>;
  logout: () => Promise<void>;
  verifyEmail: (params: { email: string; token: string }) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<CustomerUser>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  register: async () => ({ success: false, error: "AuthContext uninitialized" }),
  login: async () => ({ success: false, error: "AuthContext uninitialized" }),
  logout: async () => {},
  verifyEmail: async () => ({ success: false }),
  resendVerification: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  refreshProfile: async () => {},
  updateProfile: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
