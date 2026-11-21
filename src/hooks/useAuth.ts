import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { CustomerUser, RegisterParams, LoginParams } from "../types/auth";
import { authApi } from "../services/authApi";

export function useAuth() {
  const [user, setUser] = useState<CustomerUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bharatyatra_customer_profile");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Supabase Auth & public.users table
  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const profile = await authApi.getProfile(session.user.id, session.user);
        setUser(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("bharatyatra_customer_profile", JSON.stringify(profile));
        }
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("bharatyatra_customer_profile");
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await authApi.getProfile(session.user.id, session.user);
        setUser(profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("bharatyatra_customer_profile", JSON.stringify(profile));
        }
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("bharatyatra_customer_profile");
          localStorage.removeItem("bharatyatra_auth_token");
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const register = async (params: RegisterParams) => {
    setLoading(true);
    const res = await authApi.register(params);
    if (res.success && res.user && !res.requiresVerification) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const login = async (params: LoginParams) => {
    setLoading(true);
    const res = await authApi.login(params);
    if (res.success && res.user) {
      setUser(res.user);
      setSession(res.session);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await authApi.logout();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const verifyEmail = async (params: { email: string; token: string }) => {
    setLoading(true);
    const res = await authApi.verifyEmail(params.email, params.token);
    if (res.success) {
      await refreshProfile();
    }
    setLoading(false);
    return res;
  };

  const resendVerification = async (email: string) => {
    return authApi.resendVerification(email);
  };

  const forgotPassword = async (email: string) => {
    return authApi.forgotPassword(email);
  };

  const resetPassword = async (newPassword: string) => {
    return authApi.resetPassword(newPassword);
  };

  const updateProfile = async (updates: Partial<CustomerUser>) => {
    if (!user) return { success: false, error: "Not authenticated" };
    const res = await authApi.updateProfile(user.id, updates);
    if (res.success) {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    return res;
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    refreshProfile,
    updateProfile,
  };
}

export default useAuth;
