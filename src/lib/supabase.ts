import { createClient as createSupabaseJsClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/database";

export const SUPABASE_URL: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://attstemjmtsxafavjman.supabase.co";

export const SUPABASE_ANON_KEY: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_fICI_kAw2cZWnEChuWZd0w_xbpSlE2f";

export const TRAIN_API_FUNCTION: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_TRAIN_API_FUNCTION) ||
  "train-api";

// Factory function for SSR/browser client with Database type definitions
export const createClient = (): SupabaseClient<Database> => {
  if (typeof window !== "undefined") {
    try {
      return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (_e) {
      return createSupabaseJsClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }
  return createSupabaseJsClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Strongly-typed singleton Supabase client instance across all sub-services:
// ├── Auth (supabase.auth)
// ├── PostgreSQL / RLS (supabase.from('bookings'), supabase.from('users'), etc.)
// ├── Storage (supabase.storage.from('tickets'))
// └── Edge Functions (supabase.functions.invoke('train-api'))
export const supabase: SupabaseClient<Database> = createSupabaseJsClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: true,
    },
  }
);

export default supabase;
