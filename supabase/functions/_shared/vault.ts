// supabase/functions/_shared/vault.ts
// Server-Side Vault & Secret Injection Manager for Supabase Edge Functions
// Ensures sensitive provider credentials never leak to the client browser.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { VaultCredential, AuthInjectionStrategy } from "./types.ts";

/**
 * Initializes an elevated Supabase admin client using server-only environment variables.
 * These keys are provisioned into the Deno Edge environment and never exposed to the client.
 */
export function getAdminSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Edge Function runtime."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Retrieves provider credential and secrets server-side.
 * 1. Checks server-side environment variables first (e.g. RAZORPAY_SECRET, INDIGO_NDC_KEY).
 * 2. If not found in env, queries Supabase Database `api_providers` table or `vault.decrypted_secrets`.
 */
export async function getProviderCredential(
  providerId: string
): Promise<VaultCredential | null> {
  const supabase = getAdminSupabaseClient();

  // Query database with service role (bypassing public RLS)
  const { data, error } = await supabase
    .from("api_providers")
    .select("*")
    .eq("id", providerId)
    .single();

  if (error || !data) {
    console.warn(`[Vault] Provider ${providerId} not found in database:`, error?.message);
    // Optional fallback to environment variable mappings
    return getFallbackEnvCredential(providerId);
  }

  // Derive authentication injection strategy based on category or custom metadata
  const authStrategy = deriveAuthStrategy(data.category, data.name);

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    environment: data.environment || "production",
    base_url: data.base_url,
    api_key: data.api_key,
    api_secret: data.api_secret || Deno.env.get(`${providerId.toUpperCase().replace(/-/g, "_")}_SECRET`),
    access_token: data.access_token,
    auth_strategy: authStrategy.strategy,
    header_key_name: authStrategy.headerKeyName,
    status: data.status || "active",
    allowed_roles: data.allowed_roles || ["authenticated", "admin"],
  };
}

/**
 * Automatically determine the correct auth injection scheme for known travel & infra providers
 */
function deriveAuthStrategy(
  category: string,
  providerName: string
): { strategy: AuthInjectionStrategy; headerKeyName?: string } {
  const lowerName = providerName.toLowerCase();

  // Razorpay or payment gateways use HTTP Basic Auth (key_id : key_secret)
  if (category === "Payment" || lowerName.includes("razorpay")) {
    return { strategy: "basic_auth" };
  }

  // Google Maps uses ?key= API key query param
  if (category === "Maps" || lowerName.includes("google")) {
    return { strategy: "query_param" };
  }

  // SMS & CRM gateways often use custom headers like apikey or x-api-key
  if (category === "SMS" || lowerName.includes("gupshup") || lowerName.includes("msg91")) {
    return { strategy: "custom_header", headerKeyName: "apikey" };
  }

  if (lowerName.includes("sendgrid")) {
    return { strategy: "bearer_token" };
  }

  // Default to header_api_key or bearer_token
  return { strategy: "header_api_key", headerKeyName: "X-API-Key" };
}

/**
 * Injects secrets into outbound upstream request headers / params.
 * STRICT SECURITY: Runs entirely inside Deno Edge runtime.
 */
export function injectProviderAuth(
  credential: VaultCredential,
  targetUrl: URL,
  headers: Headers
): void {
  // Strip out any spoofed auth headers sent from browser
  headers.delete("authorization");
  headers.delete("x-api-key");
  headers.delete("apikey");

  switch (credential.auth_strategy) {
    case "basic_auth": {
      // Basic Auth: base64(apiKey:apiSecret)
      const credentials = `${credential.api_key}:${credential.api_secret ?? ""}`;
      const encoded = btoa(credentials);
      headers.set("Authorization", `Basic ${encoded}`);
      break;
    }

    case "bearer_token": {
      // Bearer Token: Authorization: Bearer <secret/token>
      const token = credential.access_token || credential.api_secret || credential.api_key;
      headers.set("Authorization", `Bearer ${token}`);
      break;
    }

    case "header_api_key": {
      // Custom Header: e.g. X-API-Key: <key>
      const headerName = credential.header_key_name || "X-API-Key";
      headers.set(headerName, credential.api_key);
      if (credential.api_secret) {
        headers.set("X-API-Secret", credential.api_secret);
      }
      break;
    }

    case "custom_header": {
      const headerName = credential.header_key_name || "apikey";
      headers.set(headerName, credential.api_key);
      break;
    }

    case "query_param": {
      // Injects as URL query parameter (e.g. Google Maps key)
      targetUrl.searchParams.set("key", credential.api_key);
      break;
    }
  }
}

/**
 * Fallback credential resolution from Deno Environment variables
 */
function getFallbackEnvCredential(providerId: string): VaultCredential | null {
  const envKey = Deno.env.get(`${providerId.toUpperCase().replace(/-/g, "_")}_KEY`);
  if (!envKey) return null;

  return {
    id: providerId,
    name: providerId,
    category: "Payment",
    environment: "production",
    base_url: "https://api.provider.com",
    api_key: envKey,
    api_secret: Deno.env.get(`${providerId.toUpperCase().replace(/-/g, "_")}_SECRET`),
    auth_strategy: "header_api_key",
    status: "active",
  };
}
