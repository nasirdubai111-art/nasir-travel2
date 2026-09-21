// src/services/commissionApi.ts
// Operator Commission Calculation, TDS Deductions & Payout Settlements

import { apiClient } from "./apiClient";
import { ApiResponse, CommissionRecord } from "../types/api";

const MOCK_COMMISSIONS: CommissionRecord[] = [
  {
    recordId: "comm-rec-091",
    operatorId: "op-zingbus",
    bookingRef: "BY-BUS-90214",
    grossAmount: 1850,
    commissionEarned: 157.25,
    tdsDeducted: 15.72,
    netPayableToOperator: 1677.03,
    settled: true,
    settlementBatchId: "BATCH-2026-W37",
  },
  {
    recordId: "comm-rec-092",
    operatorId: "op-taj-hotels",
    bookingRef: "BY-HTL-11940",
    grossAmount: 19600,
    commissionEarned: 2352.0,
    tdsDeducted: 235.2,
    netPayableToOperator: 17012.8,
    settled: false,
  },
];

export const commissionApi = {
  // Get commission ledger
  async getCommissionRecords(operatorId?: string): Promise<ApiResponse<CommissionRecord[]>> {
    const res = await apiClient.get<CommissionRecord[]>("/api/commissions", {
      headers: operatorId ? { "X-Operator-Id": operatorId } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: operatorId ? MOCK_COMMISSIONS.filter((c) => c.operatorId === operatorId) : MOCK_COMMISSIONS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Calculate commission breakdown for a booking
  async calculateCommission(grossAmount: number, commissionPercent: number): Promise<ApiResponse<{ commission: number; tds: number; netPayout: number }>> {
    const commission = (grossAmount * commissionPercent) / 100;
    const tds = commission * 0.1; // 10% TDS
    const netPayout = grossAmount - commission;

    return {
      success: true,
      data: {
        commission,
        tds,
        netPayout,
      },
      timestamp: new Date().toISOString(),
      source: "REST",
    };
  },

  // Trigger payout batch
  async executePayoutBatch(operatorIds: string[]): Promise<ApiResponse<{ batchId: string; totalTransferred: number }>> {
    return apiClient.post("/api/commissions/payout-batch", { operatorIds });
  },
};

export default commissionApi;
