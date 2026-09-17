import { ApiEndpointItem, EndpointTestResult } from "../types/apiEndpoints";
import { DEFAULT_API_ENDPOINTS } from "../data/defaultApiEndpoints";

const LOCAL_STORAGE_KEY = "bharatyatra_admin_api_endpoints_v1";

export class ApiEndpointsService {
  /**
   * Load endpoints with hybrid strategy:
   * 1. Attempts to query the server-side Supabase endpoint (/api/admin/endpoints).
   * 2. Falls back to localStorage or seeded default endpoints.
   */
  static async getEndpoints(): Promise<{ endpoints: ApiEndpointItem[]; source: "supabase" | "local_cache"; rlsActive?: boolean }> {
    try {
      const response = await fetch("/api/admin/endpoints", {
        headers: {
          "Accept": "application/json",
          "x-admin-request": "true",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.endpoints && Array.isArray(data.endpoints) && data.endpoints.length > 0) {
          // Cache locally for offline resilience
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.endpoints));
          return {
            endpoints: data.endpoints,
            source: data.source || "supabase",
            rlsActive: data.rlsActive ?? true,
          };
        }
      }
    } catch (err) {
      console.warn("Backend /api/admin/endpoints fetch failed, using local cache:", err);
    }

    // Fallback: localStorage or default data
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { endpoints: parsed, source: "local_cache" };
        }
      } catch (e) {
        // Ignore parse error
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_API_ENDPOINTS));
    return { endpoints: DEFAULT_API_ENDPOINTS, source: "local_cache" };
  }

  /**
   * Create a new endpoint
   */
  static async createEndpoint(endpoint: Omit<ApiEndpointItem, "id" | "created_at">): Promise<ApiEndpointItem> {
    const newEndpoint: ApiEndpointItem = {
      ...endpoint,
      id: `ep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_source: "local_cache",
    };

    try {
      const response = await fetch("/api/admin/endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true",
        },
        body: JSON.stringify(newEndpoint),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.endpoint) {
          return data.endpoint;
        }
      }
    } catch (err) {
      console.warn("Could not save endpoint to Supabase server route:", err);
    }

    // Save locally
    const { endpoints } = await this.getEndpoints();
    const updated = [newEndpoint, ...endpoints];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newEndpoint;
  }

  /**
   * Update an existing endpoint
   */
  static async updateEndpoint(id: string, updates: Partial<ApiEndpointItem>): Promise<ApiEndpointItem> {
    const updatedPayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/admin/endpoints/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true",
        },
        body: JSON.stringify(updatedPayload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.endpoint) {
          return data.endpoint;
        }
      }
    } catch (err) {
      console.warn("Backend update failed, persisting locally:", err);
    }

    // Update in local cache
    const { endpoints } = await this.getEndpoints();
    const index = endpoints.findIndex((e) => e.id === id);
    if (index !== -1) {
      const merged = { ...endpoints[index], ...updatedPayload };
      endpoints[index] = merged;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(endpoints));
      return merged;
    }

    throw new Error(`Endpoint with id ${id} not found`);
  }

  /**
   * Toggle is_active status
   */
  static async toggleStatus(id: string, currentState: boolean): Promise<boolean> {
    const newState = !currentState;
    try {
      const response = await fetch(`/api/admin/endpoints/${encodeURIComponent(id)}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true",
        },
        body: JSON.stringify({ is_active: newState }),
      });

      if (response.ok) {
        return newState;
      }
    } catch (err) {
      console.warn("Backend toggle failed, falling back to local:", err);
    }

    // Fallback local update
    const { endpoints } = await this.getEndpoints();
    const target = endpoints.find((e) => e.id === id);
    if (target) {
      target.is_active = newState;
      target.updated_at = new Date().toISOString();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(endpoints));
    }
    return newState;
  }

  /**
   * Delete an endpoint
   */
  static async deleteEndpoint(id: string): Promise<boolean> {
    try {
      await fetch(`/api/admin/endpoints/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-admin-request": "true",
        },
      });
    } catch (err) {
      console.warn("Backend delete error:", err);
    }

    const { endpoints } = await this.getEndpoints();
    const filtered = endpoints.filter((e) => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Securely probe/test endpoint through backend proxy
   * (Prevents credential leakage, bypasses CORS, computes round-trip latency)
   */
  static async testEndpoint(endpoint: ApiEndpointItem): Promise<EndpointTestResult> {
    const startTime = Date.now();
    try {
      const response = await fetch("/api/admin/endpoints/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true",
        },
        body: JSON.stringify({
          endpointId: endpoint.id,
          url: endpoint.endpoint_url,
          method: endpoint.http_method,
          environment: endpoint.environment,
          headers: endpoint.headers || {},
          timeoutMs: endpoint.timeout_ms || 5000,
        }),
      });

      const data = await response.json();
      return {
        success: response.ok && data.success,
        statusCode: data.statusCode || response.status,
        statusText: data.statusText || (response.ok ? "OK" : "Error"),
        latencyMs: data.latencyMs || (Date.now() - startTime),
        testedAt: new Date().toISOString(),
        endpointUrl: endpoint.endpoint_url,
        method: endpoint.http_method,
        headers: data.headers || {},
        responsePayload: data.responsePayload ?? data,
        errorMessage: data.errorMessage,
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: 504,
        statusText: "Gateway Timeout / Connection Failed",
        latencyMs: Date.now() - startTime,
        testedAt: new Date().toISOString(),
        endpointUrl: endpoint.endpoint_url,
        method: endpoint.http_method,
        headers: {},
        responsePayload: { error: err?.message || "Failed to reach endpoint" },
        errorMessage: err?.message || "Network error occurred while testing endpoint.",
      };
    }
  }

  /**
   * Synchronize local/seeded endpoints directly to Supabase api_endpoints table
   */
  static async syncToSupabase(): Promise<{ synced: number; message: string; success: boolean }> {
    try {
      const { endpoints } = await this.getEndpoints();
      const response = await fetch("/api/admin/endpoints/sync-supabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-request": "true",
        },
        body: JSON.stringify({ endpoints }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      return { success: false, synced: 0, message: err?.message || "Sync failed" };
    }
    return { success: false, synced: 0, message: "Sync response was not ok" };
  }
}
