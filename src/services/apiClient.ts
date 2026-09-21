// src/services/apiClient.ts
// Centralized HTTP & Supabase Edge Client for BharatYatra Microservices

import { ApiResponse, RequestOptions } from "../types/api";
import { supabase } from "../lib/supabase";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("bharatyatra_auth_token") || localStorage.getItem("sb-token");
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
    return {};
  }

  async request<T = any>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
        ...(options?.headers || {}),
      };

      if (options?.token) {
        headers["Authorization"] = `Bearer ${options.token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: options?.signal,
      };

      if (body && method !== "GET") {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);
      const latency_ms = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        let errorJson: any;
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          errorJson = { message: errorText || `HTTP ${response.status}` };
        }
        return {
          success: false,
          error: errorJson.error || errorJson.message || `Request failed with status ${response.status}`,
          data: errorJson.data ?? null,
          timestamp: new Date().toISOString(),
          latency_ms,
          source: "REST",
        };
      }

      const data = await response.json();
      return {
        success: data.success !== undefined ? data.success : true,
        message: data.message,
        data: data.data !== undefined ? data.data : data,
        timestamp: data.timestamp || new Date().toISOString(),
        latency_ms,
        source: data.source || "REST",
      };
    } catch (err: any) {
      const latency_ms = Math.round(performance.now() - startTime);
      return {
        success: false,
        error: err?.message || "Network request failed",
        data: null as any,
        timestamp: new Date().toISOString(),
        latency_ms,
        source: "LOCAL_FALLBACK",
      };
    }
  }

  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  async post<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", body, options);
  }

  async put<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", body, options);
  }

  async patch<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", body, options);
  }

  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }

  // Edge Function Proxy Invocation via Supabase
  async invokeEdgeFunction<T = any>(functionName: string, payload: any): Promise<ApiResponse<T>> {
    const startTime = performance.now();
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      const latency_ms = Math.round(performance.now() - startTime);

      if (error) {
        return {
          success: false,
          error: error.message,
          data: null as any,
          timestamp: new Date().toISOString(),
          latency_ms,
          source: "SUPABASE_EDGE",
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
        latency_ms,
        source: "SUPABASE_EDGE",
      };
    } catch (err: any) {
      const latency_ms = Math.round(performance.now() - startTime);
      return {
        success: false,
        error: err?.message || "Supabase Edge Function invocation failed",
        data: null as any,
        timestamp: new Date().toISOString(),
        latency_ms,
        source: "SUPABASE_EDGE",
      };
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
