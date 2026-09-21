// src/services/operatorApi.ts
// Operator Fleet, KYC Verification & Inventory Management API Service

import { apiClient } from "./apiClient";
import { ApiResponse, OperatorProfile, BookingVertical } from "../types/api";

const MOCK_OPERATORS: OperatorProfile[] = [
  {
    id: "op-zingbus",
    name: "Zingbus Mobility Technologies",
    vertical: "bus",
    gstin: "07AABCT2394N1ZG",
    kycStatus: "VERIFIED",
    commissionRatePercent: 8.5,
    fleetCount: 140,
    rating: 4.8,
    payoutAccount: "HDFC0000240-XXXX9182",
  },
  {
    id: "op-taj-hotels",
    name: "Indian Hotels Company Limited (IHCL)",
    vertical: "hotel",
    gstin: "27AAACI1298L1ZZ",
    kycStatus: "VERIFIED",
    commissionRatePercent: 12.0,
    fleetCount: 220,
    rating: 4.95,
    payoutAccount: "ICIC0001099-XXXX4401",
  },
  {
    id: "op-alleppey-houseboats",
    name: "Kerala Backwater Kettuvallam Guild",
    vertical: "houseboat",
    gstin: "32AABCK9901M1ZQ",
    kycStatus: "VERIFIED",
    commissionRatePercent: 10.0,
    fleetCount: 45,
    rating: 4.88,
    payoutAccount: "SBIN0008412-XXXX3019",
  },
];

export const operatorApi = {
  // Get all registered operators
  async getOperators(vertical?: BookingVertical): Promise<ApiResponse<OperatorProfile[]>> {
    const res = await apiClient.get<OperatorProfile[]>("/api/operators", {
      headers: vertical ? { "X-Vertical": vertical } : undefined,
    });
    if (res.success && res.data && res.data.length > 0) return res;

    return {
      success: true,
      data: vertical ? MOCK_OPERATORS.filter((o) => o.vertical === vertical) : MOCK_OPERATORS,
      timestamp: new Date().toISOString(),
      source: "LOCAL_FALLBACK",
    };
  },

  // Onboard new operator
  async onboardOperator(profile: Partial<OperatorProfile>): Promise<ApiResponse<OperatorProfile>> {
    return apiClient.post("/api/operators/onboard", profile);
  },

  // Upload operator compliance / GST certificate
  async uploadComplianceDoc(operatorId: string, docType: string, fileUrl: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/operators/${operatorId}/compliance`, { docType, fileUrl });
  },
};

export default operatorApi;
