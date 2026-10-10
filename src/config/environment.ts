// src/config/environment.ts
// Centralized runtime and client environment configuration

export interface EnvironmentConfig {
  database: {
    url: string;
    host: string;
    port: number;
    user: string;
    password?: string;
    database: string;
  };
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
  database: {
    url: getEnvVar("DATABASE_URL", "postgresql://bharatyatra_user:strongpassword123@localhost:5432/bharatyatra_db"),
    host: getEnvVar("POSTGRES_HOST", "localhost"),
    port: Number(getEnvVar("POSTGRES_PORT", "5432")),
    user: getEnvVar("POSTGRES_USER", "bharatyatra_user"),
    password: getEnvVar("POSTGRES_PASSWORD", "strongpassword123"),
    database: getEnvVar("POSTGRES_DB", "bharatyatra_db"),
  },
  supabase: {
    url:
      getEnvVar("VITE_SUPABASE_URL") ||
      getEnvVar("NEXT_PUBLIC_SUPABASE_URL") ||
      getEnvVar("SUPABASE_URL", ""),
    anonKey:
      getEnvVar("VITE_SUPABASE_ANON_KEY") ||
      getEnvVar("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
      getEnvVar("SUPABASE_PUBLISHABLE_KEY", ""),
    projectRef: getEnvVar("SUPABASE_PROJECT_REF", "bharatyatra_db"),
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
