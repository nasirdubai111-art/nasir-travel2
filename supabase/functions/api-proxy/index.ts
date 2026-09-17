// supabase/functions/api-proxy/index.ts
// Supabase Edge Function: Secure External API Proxy
// Injects API keys and secrets server-side so they NEVER reach the client browser.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCorsPreflight, jsonResponse, errorResponse, corsHeaders } from "../_shared/cors.ts";
import { SecureProxyRequest, SecureProxyResponse } from "../_shared/types.ts";
import { getProviderCredential, injectProviderAuth, getAdminSupabaseClient } from "../_shared/vault.ts";

console.log("[Edge Function] api-proxy initialized and listening for requests.");

serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  try {
    // 2. Client Authentication & RBAC Check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return errorResponse("Missing Authorization header. Sign in required to invoke proxy.", 401);
    }

    const adminSupabase = getAdminSupabaseClient();
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await adminSupabase.auth.getUser(token);

    // If user token is invalid and not a trusted service call, block request
    const isServiceRole = token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!isServiceRole && (userError || !userData?.user)) {
      return errorResponse("Unauthorized: Invalid user session or expired token.", 401);
    }

    const userId = userData?.user?.id || "service_role";
    const userEmail = userData?.user?.email || "internal@bharatyatra.gov.in";

    // 3. Parse and Validate Request Payload
    if (req.method !== "POST") {
      return errorResponse("Method Not Allowed. Secure proxy requires POST.", 405);
    }

    const payload: SecureProxyRequest = await req.json().catch(() => null);
    if (!payload || !payload.provider_id || !payload.endpoint_path) {
      return errorResponse("Invalid payload. 'provider_id' and 'endpoint_path' are required.", 400);
    }

    const { provider_id, endpoint_path, method = "GET", query_params = {}, body, client_headers = {} } = payload;

    // 4. Retrieve Provider Credential from Server-Side Vault
    const credential = await getProviderCredential(provider_id);
    if (!credential) {
      return errorResponse(`Provider '${provider_id}' was not found in API credentials vault.`, 404);
    }

    if (credential.status !== "active") {
      return errorResponse(
        `Provider '${credential.name}' is currently ${credential.status.toUpperCase()}. Operations are suspended.`,
        403
      );
    }

    // 5. Construct External Provider URL
    const sanitizedBaseUrl = credential.base_url.replace(/\/+$/, "");
    const sanitizedPath = endpoint_path.startsWith("/") ? endpoint_path : `/${endpoint_path}`;
    const targetUrl = new URL(`${sanitizedBaseUrl}${sanitizedPath}`);

    // Append query params from client
    Object.entries(query_params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        targetUrl.searchParams.set(key, String(val));
      }
    });

    // 6. Build Request Headers & Inject Secrets Server-Side
    const upstreamHeaders = new Headers();

    // Pass allowable client headers (e.g. content-type, idempotency)
    const allowedClientHeaders = ["content-type", "accept", "x-request-id", "idempotency-key", "accept-language"];
    Object.entries(client_headers).forEach(([k, v]) => {
      if (allowedClientHeaders.includes(k.toLowerCase())) {
        upstreamHeaders.set(k, v);
      }
    });

    if (!upstreamHeaders.has("content-type") && body && method !== "GET") {
      upstreamHeaders.set("content-type", "application/json");
    }

    // CRITICAL: Inject API keys/secrets server-side. Browser never sees these values!
    injectProviderAuth(credential, targetUrl, upstreamHeaders);

    // 7. Dispatch Outbound Upstream Request
    console.log(`[Proxy] Dispatching ${method} to ${targetUrl.origin}${targetUrl.pathname} for user ${userEmail}`);

    let upstreamResponse: Response;
    try {
      const requestOptions: RequestInit = {
        method,
        headers: upstreamHeaders,
        body: method !== "GET" && method !== "HEAD" && body ? JSON.stringify(body) : undefined,
      };

      upstreamResponse = await fetch(targetUrl.toString(), requestOptions);
    } catch (networkError: any) {
      console.error(`[Proxy Upstream Error] Failed to reach provider ${credential.name}:`, networkError.message);
      return errorResponse(`Upstream connection failed: ${networkError.message}`, 502, {
        provider: credential.name,
        target: targetUrl.origin,
      });
    }

    const latencyMs = Date.now() - startTime;
    const responseContentType = upstreamResponse.headers.get("content-type") || "";

    let responseData: unknown;
    if (responseContentType.includes("application/json")) {
      responseData = await upstreamResponse.json().catch(() => ({}));
    } else {
      responseData = await upstreamResponse.text();
    }

    // 8. Audit Logging to Supabase `api_logs` (Sanitized)
    try {
      await adminSupabase.from("api_logs").insert([
        {
          id: `log-${requestId.slice(0, 8)}`,
          provider_id: credential.id,
          provider_name: credential.name,
          category: credential.category,
          action: "SECURE_PROXY_CALL",
          status: upstreamResponse.ok ? "SUCCESS" : "ERROR",
          environment: credential.environment,
          admin_user: userEmail,
          ip_address: req.headers.get("x-forwarded-for") || "edge-worker",
          details: `Proxied ${method} ${sanitizedPath} -> HTTP ${upstreamResponse.status} in ${latencyMs}ms.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (logErr: any) {
      console.warn("[Audit Log] Failed to record edge log:", logErr.message);
    }

    // 9. Return Response to Client
    const envelope: SecureProxyResponse = {
      success: upstreamResponse.ok,
      status_code: upstreamResponse.status,
      status_text: upstreamResponse.statusText,
      latency_ms: latencyMs,
      data: responseData,
      request_id: requestId,
    };

    return jsonResponse(envelope, upstreamResponse.status);
  } catch (err: any) {
    console.error("[Proxy Fatal]", err);
    return errorResponse(`Internal Edge Proxy Error: ${err.message}`, 500, {
      requestId,
      durationMs: Date.now() - startTime,
    });
  }
});
