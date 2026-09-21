import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://attstemjmtsxafavjman.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_fICI_kAw2cZWnEChuWZd0w_xbpSlE2f";

export const TRAIN_API_FUNCTION =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_TRAIN_API_FUNCTION) ||
  "train-api";

export const createClient = () =>
  createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
