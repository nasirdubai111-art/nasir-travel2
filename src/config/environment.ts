// src/config/environment.ts
// Centralized runtime and client environment configuration

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    projectRef?: string;
  };
  api: {
    baseUrl: string;
    trainApiFunction: string;
    timeoutMs: number;
  };
  payments: {
    provider: string;
    gatewayKeyId?: string;
    enableFrontendSubscriptionFee: boolean;
  };
  app: {
    name: string;
    version: string;
    mode: string;
    isDev: boolean;
    isProd: boolean;
  };
}

const getEnvVar = (key: string, fallback: string = ""): string => {
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key] || fallback;
  }
  return fallback;
};

export const env: EnvironmentConfig = {
  supabase: {
    url:
      getEnvVar("VITE_SUPABASE_URL") ||
      getEnvVar("NEXT_PUBLIC_SUPABASE_URL") ||
      getEnvVar("SUPABASE_URL", "https://attstemjmtsxafavjman.supabase.co"),
    anonKey:
      getEnvVar("VITE_SUPABASE_ANON_KEY") ||
      getEnvVar("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
      getEnvVar("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_fICI_kAw2cZWnEChuWZd0w_xbpSlE2f"),
    projectRef: getEnvVar("SUPABASE_PROJECT_REF", "attstemjmtsxafavjman"),
  },
  api: {
    baseUrl: getEnvVar("VITE_API_BASE_URL", ""),
    trainApiFunction: getEnvVar("VITE_TRAIN_API_FUNCTION", "train-api"),
    timeoutMs: 30000,
  },
  payments: {
    provider: getEnvVar("PAYMENT_GATEWAY_PROVIDER", "CASHFREE"),
    gatewayKeyId: getEnvVar("PAYMENT_GATEWAY_KEY_ID") || getEnvVar("VITE_PAYMENT_GATEWAY_KEY_ID"),
    enableFrontendSubscriptionFee: getEnvVar("ENABLE_FRONTEND_SUBSCRIPTION_FEE", "false") === "true",
  },
  app: {
    name: "BharatYatra",
    version: "1.0.0",
    mode: (typeof import.meta !== "undefined" && (import.meta as any).env?.MODE) || "production",
    isDev: (typeof import.meta !== "undefined" && (import.meta as any).env?.DEV) ?? false,
    isProd: (typeof import.meta !== "undefined" && (import.meta as any).env?.PROD) ?? true,
  },
};

export default env;
