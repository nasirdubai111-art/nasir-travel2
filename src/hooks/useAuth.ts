import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { UserProfile } from "../types/api";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || "Traveler",
          phone: session.user.user_metadata?.phone,
          avatarUrl: session.user.user_metadata?.avatar_url,
          membershipTier: "BHARAT_CLUB",
          walletBalance: 1250,
          loyaltyPoints: 450,
          created_at: session.user.created_at,
          verifiedKyc: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || "Traveler",
          phone: session.user.user_metadata?.phone,
          avatarUrl: session.user.user_metadata?.avatar_url,
          membershipTier: "BHARAT_CLUB",
          walletBalance: 1250,
          loyaltyPoints: 450,
          created_at: session.user.created_at,
          verifiedKyc: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
