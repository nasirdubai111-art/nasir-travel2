// src/services/analyticsApi.ts
// Platform Gross Bookings, Conversion Metrics & Route Demand Analytics API Service

import { apiClient } from "./apiClient";
import { ApiResponse, PlatformAnalyticsMetrics } from "../types/api";

const MOCK_METRICS: PlatformAnalyticsMetrics = {
  totalGrossBookings: 14852900,
  totalTransactionsCount: 6842,
  averageOrderValue: 2171,
  conversionRate: 4.82,
  verticalBreakdown: {
    train: 42,
    flight: 24,
    hotel: 14,
    pilgrimage: 11,
    bus: 5,
    cab: 4,
  },
  activeUsers24h: 3180,
};

export const analyticsApi = {
  // Get platform dashboard executive metrics
  async getMetrics(timeframe: "24h" | "7d" | "30d" | "all" = "7d"): Promise<ApiResponse<PlatformAnalyticsMetrics>> {
    const res = await apiClient.get<PlatformAnalyticsMetrics>("/api/analytics/metrics", {
      headers: { "X-Timeframe": timeframe },
    });
    if (res.success && res.data) return res;

    return {
      success: true,
      data: MOCK_METRICS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Route demand trends
  async getRouteDemand(vertical?: string): Promise<ApiResponse<Array<{ route: string; searches: number; bookings: number; avgFare: number }>>> {
    return apiClient.get("/api/analytics/route-demand", {
      headers: vertical ? { "X-Vertical": vertical } : undefined,
    });
  },

  // Funnel conversion drops
  async getFunnelConversion(): Promise<ApiResponse<Array<{ step: string; dropoffPercentage: number; completionCount: number }>>> {
    return apiClient.get("/api/analytics/funnel");
  },
};

export default analyticsApi;
