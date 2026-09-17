// src/services/apiProxyService.ts
// Secure Client-Side Service Layer for External Provider API Proxying
// Routes all external API calls through Supabase Edge Functions / Server Vault Proxy.
// Guarantees API keys and secrets NEVER reach or reside in client browser memory.

import { createClient } from "../../utils/supabase/client";

export interface ProxyCallPayload {
  provider_id: string; // e.g. "cred-flight-indigo", "cred-payment-razorpay", "cred-maps-google"
  endpoint_path: string; // e.g. "/flights/search", "/orders", "/geocode/json"
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query_params?: Record<string, string | number | boolean>;
  body?: unknown;
  client_headers?: Record<string, string>;
}

export interface ProxyCallResult<T = any> {
  success: boolean;
  status_code: number;
  status_text: string;
  latency_ms: number;
  data?: T;
  error?: string;
  request_id?: string;
}

/**
 * Universal dispatcher for proxying external API requests via Supabase Edge Function.
 * If the deployed Edge Function is unreachable or in local dev, seamlessly falls back
 * to the backend Express server vault proxy.
 */
export async function invokeSecureProxy<T = any>(
  payload: ProxyCallPayload
): Promise<ProxyCallResult<T>> {
  const supabase = createClient();

  // 1. Attempt Supabase Edge Function execution
  try {
    const { data, error } = await supabase.functions.invoke("api-proxy", {
      body: payload,
    });

    if (!error && data && data.status_code !== undefined) {
      return data as ProxyCallResult<T>;
    }
  } catch (edgeError) {
    // Silent fallback to local/container server proxy
  }

  // 2. Fallback to server-side Express proxy endpoint
  const startTime = Date.now();
  try {
    const response = await fetch("/functions/v1/api-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));
    const latencyMs = Date.now() - startTime;

    if (result.status_code !== undefined) {
      return result as ProxyCallResult<T>;
    }

    return {
      success: response.ok,
      status_code: response.status,
      status_text: response.statusText,
      latency_ms: latencyMs,
      data: result.data || result,
    };
  } catch (err: any) {
    return {
      success: false,
      status_code: 502,
      status_text: "Proxy Connection Error",
      latency_ms: Date.now() - startTime,
      error: err.message || "Failed to reach Edge Proxy service.",
    };
  }
}

/**
 * Convenience helper: Proxy Flight Search
 */
export async function proxyFlightSearch(
  providerId: string = "cred-flight-indigo",
  params: { origin: string; destination: string; date: string; travelers: number }
) {
  return invokeSecureProxy({
    provider_id: providerId,
    endpoint_path: "/v2/flights/search",
    method: "POST",
    body: params,
  });
}

/**
 * Convenience helper: Proxy Train PNR Enquiry (IRCTC Gateway)
 */
export async function proxyTrainPnrStatus(
  pnrNumber: string,
  providerId: string = "cred-train-irctc"
) {
  return invokeSecureProxy({
    provider_id: providerId,
    endpoint_path: `/eticketing/webservices/pnrEnquiry/${pnrNumber}`,
    method: "GET",
  });
}

/**
 * Convenience helper: Proxy Payment Order creation (Razorpay Route)
 */
export async function proxyCreatePaymentOrder(
  amountInPaisa: number,
  currency: string = "INR",
  receipt: string,
  providerId: string = "cred-payment-razorpay"
) {
  return invokeSecureProxy({
    provider_id: providerId,
    endpoint_path: "/orders",
    method: "POST",
    body: {
      amount: amountInPaisa,
      currency,
      receipt,
      payment_capture: 1,
    },
  });
}

/**
 * Convenience helper: Proxy SMS / WhatsApp OTP delivery (Gupshup Gateway)
 */
export async function proxySendOtp(
  phoneNumber: string,
  otpCode: string,
  providerId: string = "cred-sms-gupshup"
) {
  return invokeSecureProxy({
    provider_id: providerId,
    endpoint_path: "/sm/api/v1/msg",
    method: "POST",
    body: {
      channel: "whatsapp",
      source: "917011000000",
      destination: phoneNumber,
      message: `Your BharatYatra verification code is ${otpCode}. Valid for 10 minutes.`,
    },
  });
}
