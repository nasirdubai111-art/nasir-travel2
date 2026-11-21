import { createClient as createSupabaseJsClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/database";

const DEFAULT_SUPABASE_PROJECT_URL = "https://attstemjmtsxafavjman.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dHN0ZW1qbXRzeGFmYXZqbWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNjQ5OTEsImV4cCI6MjEwNDk0MDk5MX0.jBnN5eiM6Chi-lx2gv6_FHwMJuHO4Z3ol7Ig9jgQ8dE";

/**
 * Validates whether a value is a legitimate HTTP/HTTPS URL.
 */
function isValidHttpUrl(url: any): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates whether a key looks like a valid anon / publishable Supabase key (JWT or sb_publishable_*).
 */
function isValidKey(key: any): boolean {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  return trimmed.length > 20 && !/^\d+$/.test(trimmed);
}

function resolveSupabaseUrl(): string {
  const metaUrl = typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL;
  if (isValidHttpUrl(metaUrl)) return metaUrl.trim();

  const nextUrl = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL;
  if (isValidHttpUrl(nextUrl)) return nextUrl.trim();

  const procUrl = typeof process !== "undefined" && process.env?.SUPABASE_URL;
  if (isValidHttpUrl(procUrl)) return procUrl.trim();

  return DEFAULT_SUPABASE_PROJECT_URL;
}

function resolveSupabaseKey(): string {
  const metaKey = typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (isValidKey(metaKey)) return metaKey.trim();

  const pubKey = typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (isValidKey(pubKey)) return pubKey.trim();

  const nextKey = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (isValidKey(nextKey)) return nextKey.trim();

  const procKey = typeof process !== "undefined" && process.env?.SUPABASE_PUBLISHABLE_KEY;
  if (isValidKey(procKey)) return procKey.trim();

  const srvKey = typeof process !== "undefined" && process.env?.SUPABASE_SERVICE_ROLE_KEY;
  if (isValidKey(srvKey)) return srvKey.trim();

  return DEFAULT_SUPABASE_ANON_KEY;
}

export const SUPABASE_URL: string = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY: string = resolveSupabaseKey();

const rawTrainFn = typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_TRAIN_API_FUNCTION;
export const TRAIN_API_FUNCTION: string =
  typeof rawTrainFn === "string" && rawTrainFn.trim() && !/^\d+$/.test(rawTrainFn.trim())
    ? rawTrainFn.trim()
    : "train-api";

// Factory function for SSR/browser client with Database type definitions
export const createClient = (): SupabaseClient<Database> => {
  const validUrl = isValidHttpUrl(SUPABASE_URL) ? SUPABASE_URL : DEFAULT_SUPABASE_PROJECT_URL;
  const validKey = isValidKey(SUPABASE_ANON_KEY) ? SUPABASE_ANON_KEY : DEFAULT_SUPABASE_ANON_KEY;

  if (typeof window !== "undefined") {
    try {
      return createBrowserClient<Database>(validUrl, validKey);
    } catch (_e) {
      return createSupabaseJsClient<Database>(validUrl, validKey);
    }
  }
  return createSupabaseJsClient<Database>(validUrl, validKey);
};

// Strongly-typed singleton Supabase client instance across all sub-services:
// ├── Auth (supabase.auth)
// ├── PostgreSQL / RLS (supabase.from('bookings'), supabase.from('users'), etc.)
// ├── Storage (supabase.storage.from('tickets'))
// └── Edge Functions (supabase.functions.invoke('train-api'))
const buildSingletonClient = (): SupabaseClient<Database> => {
  const validUrl = isValidHttpUrl(SUPABASE_URL) ? SUPABASE_URL : DEFAULT_SUPABASE_PROJECT_URL;
  const validKey = isValidKey(SUPABASE_ANON_KEY) ? SUPABASE_ANON_KEY : DEFAULT_SUPABASE_ANON_KEY;

  try {
    return createSupabaseJsClient<Database>(validUrl, validKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn("Failed initializing primary Supabase client, falling back to default project endpoint:", err);
    return createSupabaseJsClient<Database>(DEFAULT_SUPABASE_PROJECT_URL, DEFAULT_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: true,
      },
    });
  }
};

export const supabase: SupabaseClient<Database> = buildSingletonClient();

export default supabase;
