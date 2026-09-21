// supabase/functions/_shared/types.ts
// Shared TypeScript types for Supabase Edge Functions

export type ApiCategory =
  | "Flight"
  | "Train"
  | "Bus"
  | "Hotel"
  | "Resort"
  | "Payment"
  | "Maps"
  | "SMS"
  | "Email"
  | "CRM";

export type AuthInjectionStrategy =
  | "bearer_token"
  | "header_api_key"
  | "basic_auth"
  | "custom_header"
  | "query_param";

export interface VaultCredential {
  id: string;
  name: string;
  category: ApiCategory;
  environment: "sandbox" | "production";
  base_url: string;
  api_key: string;
  api_secret?: string;
  access_token?: string;
  auth_strategy: AuthInjectionStrategy;
  header_key_name?: string; // e.g. "x-api-key", "X-RapidAPI-Key", "Authorization"
  status: "active" | "inactive" | "expired" | "revoked";
  rate_limit_per_minute?: number;
  allowed_roles?: string[]; // e.g. ["authenticated", "admin", "service_role"]
}

/**
 * Payload sent by client applications to invoke an external API securely.
 * Note: Notice there are ZERO API keys or secrets in this client payload.
 */
export interface SecureProxyRequest {
  provider_id: string; // Target provider, e.g. "cred-flight-indigo" or "cred-payment-gateway"
  endpoint_path: string; // Path relative to provider base URL, e.g. "/flights/search" or "/orders"
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query_params?: Record<string, string | number | boolean>;
  body?: unknown;
  client_headers?: Record<string, string>; // Safe headers from browser (e.g. idempotency key, locale)
}

/**
 * Result envelope returned to client
 */
export interface SecureProxyResponse<T = unknown> {
  success: boolean;
  status_code: number;
  status_text: string;
  latency_ms: number;
  data?: T;
  error?: string;
  request_id?: string;
}
