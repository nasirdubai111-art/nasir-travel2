// src/services/adminApi.ts
// Platform Governance & Super Dashboard Admin Microservice

import { apiClient } from "./apiClient";
import { ApiResponse, AdminSession } from "../types/api";

export const adminApi = {
  // Admin PIN / Role Verification
  async verifyAdminSession(role: string, pin: string): Promise<ApiResponse<AdminSession>> {
    return apiClient.post<AdminSession>("/api/auth/verify-role", { role, pin });
  },

  // Fetch all registered operators
  async getOperatorsList(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>("/api/admin/operators");
  },

  // Update operator status
  async updateOperatorStatus(operatorId: string, status: "ACTIVE" | "SUSPENDED" | "PENDING_KYC"): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/admin/operators/${operatorId}/status`, { status });
  },

  // Audit logs
  async getAuditLogs(params?: { limit?: number; offset?: number }): Promise<ApiResponse<any[]>> {
    return apiClient.get("/api/admin/audit-logs", {
      headers: params ? { "X-Limit": String(params.limit || 50) } : undefined,
    });
  },

  // System Health & Service Ping
  async getSystemHealth(): Promise<ApiResponse<{ status: string; uptime: number; services: Record<string, string> }>> {
    return apiClient.get("/api/health");
  },
};

export default adminApi;
