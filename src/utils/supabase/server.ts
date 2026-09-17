import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== "undefined" && (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)) ||
  "https://attstemjmtsxafavjman.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) ||
  "sb_publishable_fICI_kAw2cZWnEChuWZd0w_xbpSlE2f";

export interface CookieStoreLike {
  getAll: () => Array<{ name: string; value: string }>;
  set?: (name: string, value: string, options?: CookieOptions) => void;
}

export const createClient = (cookieStore?: CookieStoreLike) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        if (cookieStore && typeof cookieStore.getAll === "function") {
          return cookieStore.getAll();
        }
        return [];
      },
      setAll(cookiesToSet) {
        try {
          if (cookieStore && typeof cookieStore.set === "function") {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set?.(name, value, options);
            });
          }
        } catch {
          // Ignore if called in read-only context
        }
      },
    },
  });
};
