// src/types/zeulPayGateway.ts
// Enterprise Zeul Pay Gateway & Multi-Vendor Split Payment System Types
// STRICT CONFIDENTIALITY: Admin Console Internal Only. NEVER exposed at customer frontend.

export type ZeulAggregatorStatus = "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "STANDBY";
export type ZeulSplitExecutionMode = "AUTOMATIC_REALTIME" | "BATCH_SETTLEMENT" | "ESCROW_MILESTONE_RELEASE";
export type ZeulPaymentChannel = "UPI_AUTO_COLLECT" | "NET_BANKING_MULTI_RAIL" | "CREDIT_CARD_EMV" | "CORPORATE_COMMERCIAL" | "ESCROW_NEFT";

export interface ZeulAggregatorPartner {
  id: string; // e.g. "ZEUL-AGG-001"
  aggregatorName: string; // e.g. "PayU Enterprise Hub", "BillDesk Rail", "Cashfree Direct Nodal", "CCAvenue Switch"
  aggregatorCode: string; // e.g. "PAYU_CORP", "BILLDESK_RAIL", "CASHFREE_NODAL"
  merchantId: string;
  clientIdMasked: string; // masked client id
  status: ZeulAggregatorStatus;
  supportedChannels: ZeulPaymentChannel[];
  priorityWeight: number; // 1 - 100 for smart traffic cascading
  dailyGmvLimitINR: number;
  currentGmvTodayINR: number;
  feePercentage: number; // MDR negotiated
  fixedFeeINR: number;
  healthLatencyMs: number;
  successRatePercent: number;
  settlementTurnaround: "T+0_INSTANT" | "T+1_RTGS" | "T+2_NEFT";
  webhookEndpointUrl: string;
  contactEmail: string;
  panNumberMasked: string;
  gstinMasked: string;
  escrowNodalAccount: string;
  createdAt: string;
}

// Vendor Account & Split Destination Profile
export interface ZeulVendorAccount {
  vendorId: string; // e.g. "VND-HTL-KHYBER"
  businessName: string; // e.g. "The Khyber Himalayan Resort & Spa"
  vendorCategory: "HOTELS" | "HOUSEBOATS" | "SAFARI" | "TOURS" | "YATRAS" | "CABS" | "FLIGHTS" | "BUSES" | "TRAINS" | "OTHER";
  nodalVirtualAccountId: string; // e.g. "VA_NODAL_ZEUL_99812"
  bankAccountMasked: string; // e.g. "HDFC Bank •••• 9921"
  ifscCode: string; // e.g. "HDFC0001892"
  accountHolderName: string;
  panMasked: string; // e.g. "AAACK••••L"
  gstinMasked: string; // e.g. "01AAACK4409J1Z9"
  tdsApplicablePercent: number; // e.g. 1% under Section 194-O
  instantSettlementEnabled: boolean;
  kycStatus: "VERIFIED" | "PENDING_DOCS" | "SUSPENDED";
  preferredAggregatorId?: string;
  totalGrossDisbursedINR: number;
  pendingEscrowBalanceINR: number;
  contactPerson: string;
  contactPhone: string;
}

// Multi-vendor split allocation breakdown
export interface ZeulVendorSplitShare {
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  bankAccountMasked: string;
  splitPercentage: number; // e.g. 70% or fixed sum
  fixedAmountINR?: number;
  settlementSchedule: "IMMEDIATE_T0" | "AFTER_CHECKIN" | "JOURNEY_END" | "T1_BATCH";
  escrowReleaseWindowHours: number;
}

export interface ZeulSplitRuleConfig {
  id: string; // e.g. "ZEUL-RULE-HTL-01"
  ruleName: string;
  verticalCategory: "FLIGHTS" | "HOTELS" | "TRAINS" | "BUSES" | "HOUSEBOATS" | "SAFARI" | "TOURS" | "YATRAS" | "CABS" | "MULTI_VENDOR_COMBO" | "ALL";
  aggregatorId: string; // Bound Aggregator
  splitExecutionMode: ZeulSplitExecutionMode;
  platformTakeRatePercent: number; // e.g. 5%
  partnerVendorSharePercent: number; // e.g. 92% (or distributed across multiple vendors)
  agentIncentivePercent: number; // e.g. 2%
  tdsSec194OPercent: number; // 1%
  gstOnCommissionPercent: number; // 18%
  holdUntilEvent: "IMMEDIATE" | "SERVICE_DELIVERED" | "CHECK_IN_COMPLETED" | "JOURNEY_CONCLUDED";
  escrowReleaseWindowHours: number;
  isActive: boolean;
  notes?: string;
  // Multi-vendor support
  isMultiVendorSplit?: boolean;
  vendorAllocations?: ZeulVendorSplitShare[];
}

export interface ZeulVendorDisbursementItem {
  vendorId: string;
  vendorName: string;
  vendorRole: string; // e.g. "Primary Stay Provider", "Shuttle & Cab Partner", "Local Guide"
  accountMasked: string;
  grossAllocatedINR: number;
  tdsDeductedINR: number;
  netDisbursedINR: number;
  nodalEscrowUtr?: string;
  status: "SETTLED" | "ESCROW_LOCKED" | "PROCESSING" | "HOLD";
}

export interface ZeulSplitTransactionRecord {
  id: string; // e.g. "ZEUL-TXN-998201"
  zeulReferenceId: string; // e.g. "ZEUL-REF-2026-X812"
  bookingRef: string; // e.g. "BY-BK-SRINAGAR-2026"
  customerName: string;
  aggregatorId: string;
  aggregatorName: string;
  totalGrossAmountINR: number;
  currency: string;
  channel: ZeulPaymentChannel;
  status: "AUTHORIZED" | "CAPTURED" | "SPLIT_COMPLETED" | "ESCROW_HELD" | "REFUNDED";
  platformFeeINR: number;
  partnerDisbursementINR: number; // Total vendor net
  taxTdsINR: number;
  partnerBeneficiaryName: string;
  partnerBeneficiaryAccountMasked: string;
  splitRuleId: string;
  nodalEscrowUtr?: string;
  timestamp: string;
  // Multi-vendor breakdown items
  isMultiVendor?: boolean;
  vendorBreakdown?: ZeulVendorDisbursementItem[];
}

export interface ZeulGatewayNodalMetrics {
  totalProcessedGmvINR: number;
  totalAggregatorsCount: number;
  activeAggregatorsCount: number;
  totalVendorsCount: number;
  activeVendorsCount: number;
  totalSplitTransfersTodayINR: number;
  escrowHeldBalanceINR: number;
  avgGatewaySuccessRate: number;
  currentActiveSwitch: string;
  lastUpdated: string;
}
