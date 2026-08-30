import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  Download,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CreditCard,
  Percent,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Zap,
  Sliders,
  Send,
  ExternalLink,
  ShieldCheck,
  Receipt,
  FileSpreadsheet,
  History,
  Copy,
  Calendar,
  Banknote,
  CheckCheck,
  X,
  ChevronDown,
  CheckSquare,
  Square,
  Users,
  SlidersHorizontal,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calculator,
  ChevronRight,
  FileText,
  BadgeCheck,
  Phone,
  MapPin,
  User,
  Activity,
  Hash,
  ArrowLeftRight,
  Maximize2,
  Tag,
  Info,
} from "lucide-react";
import {
  B2BAttributedLeadConversion,
  INITIAL_ATTRIBUTED_LEADS,
  CATEGORY_COMMISSION_RATES,
} from "../../data/b2bCommissionTelesalesData";

export type SettlementSortField =
  | "createdAt"
  | "travelDate"
  | "bookingValueINR"
  | "partnerSettlementAmountINR"
  | "grossCommissionINR"
  | "commissionPercent"
  | "settlementStatus"
  | "partnerName"
  | "customerName"
  | "bookingId"
  | "partnerCategory";

export type HistorySortField =
  | "transactionDate"
  | "amountTransferredINR"
  | "bookingValueINR"
  | "grossCommissionINR"
  | "tdsDeductionINR"
  | "status"
  | "partnerName"
  | "partnerCategory"
  | "bookingId"
  | "transactionId";

export type SortDirection = "asc" | "desc";

export interface SettlementStatusOption {
  id: string;
  label: string;
  shortLabel: string;
  color: "amber" | "emerald" | "indigo" | "rose";
  bgClass: string;
  textClass: string;
  borderClass: string;
  activeBgClass: string;
}

export const SETTLEMENT_STATUS_OPTIONS: SettlementStatusOption[] = [
  {
    id: "Pending_Payment",
    label: "Pending Payment (Unpaid)",
    shortLabel: "Pending",
    color: "amber",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-300",
    borderClass: "border-amber-500/30",
    activeBgClass: "bg-amber-500 text-slate-950",
  },
  {
    id: "Settled",
    label: "Paid / Settled",
    shortLabel: "Paid",
    color: "emerald",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-300",
    borderClass: "border-emerald-500/30",
    activeBgClass: "bg-emerald-500 text-slate-950",
  },
  {
    id: "Processing",
    label: "Processing RTGS",
    shortLabel: "Processing",
    color: "indigo",
    bgClass: "bg-indigo-500/15",
    textClass: "text-indigo-300",
    borderClass: "border-indigo-500/30",
    activeBgClass: "bg-indigo-500 text-white",
  },
  {
    id: "Reversed_Refund",
    label: "Reversed / Refunded",
    shortLabel: "Refunded",
    color: "rose",
    bgClass: "bg-rose-500/15",
    textClass: "text-rose-300",
    borderClass: "border-rose-500/30",
    activeBgClass: "bg-rose-500 text-white",
  },
];

export type DateRangePreset =
  | "ALL"
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "CUSTOM";

export type DateFilterField = "createdAt" | "travelDate";

export interface DatePresetOption {
  id: DateRangePreset;
  label: string;
  shortLabel: string;
  subLabel?: string;
}

export const DATE_PRESET_OPTIONS: DatePresetOption[] = [
  { id: "ALL", label: "All Time (Complete History)", shortLabel: "All Time" },
  { id: "TODAY", label: "Today", shortLabel: "Today", subLabel: "Aug 28" },
  { id: "YESTERDAY", label: "Yesterday", shortLabel: "Yesterday", subLabel: "Aug 27" },
  { id: "LAST_7_DAYS", label: "Last 7 Days", shortLabel: "Last 7 Days", subLabel: "Aug 22 – Aug 28" },
  { id: "LAST_30_DAYS", label: "Last 30 Days", shortLabel: "Last 30 Days", subLabel: "Jul 30 – Aug 28" },
  { id: "THIS_MONTH", label: "This Month (August 2026)", shortLabel: "This Month", subLabel: "Aug 01 – Aug 31" },
  { id: "LAST_MONTH", label: "Last Month (July 2026)", shortLabel: "Last Month", subLabel: "Jul 01 – Jul 31" },
  { id: "CUSTOM", label: "Custom Date Range", shortLabel: "Custom" },
];

export const getDateRangeBounds = (
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): { start: string; end: string; label: string } => {
  switch (preset) {
    case "TODAY":
      return { start: "2026-08-28", end: "2026-08-28", label: "Today (Aug 28, 2026)" };
    case "YESTERDAY":
      return { start: "2026-08-27", end: "2026-08-27", label: "Yesterday (Aug 27, 2026)" };
    case "LAST_7_DAYS":
      return { start: "2026-08-22", end: "2026-08-28", label: "Last 7 Days (Aug 22 – Aug 28)" };
    case "LAST_30_DAYS":
      return { start: "2026-07-30", end: "2026-08-28", label: "Last 30 Days (Jul 30 – Aug 28)" };
    case "THIS_MONTH":
      return { start: "2026-08-01", end: "2026-08-31", label: "This Month (Aug 2026)" };
    case "LAST_MONTH":
      return { start: "2026-07-01", end: "2026-07-31", label: "Last Month (Jul 2026)" };
    case "CUSTOM":
      if (customStart && customEnd) {
        return { start: customStart, end: customEnd, label: `${customStart} → ${customEnd}` };
      } else if (customStart) {
        return { start: customStart, end: "", label: `From ${customStart}` };
      } else if (customEnd) {
        return { start: "", end: customEnd, label: `Until ${customEnd}` };
      }
      return { start: "", end: "", label: "Custom Range" };
    case "ALL":
    default:
      return { start: "", end: "", label: "All Time" };
  }
};

export interface PayoutTransactionRecord {
  transactionId: string; // UTR Reference or Failed Ref
  transactionDate: string; // Timestamp
  leadId: string;
  bookingId: string;
  partnerId: string;
  partnerName: string;
  partnerCategory: string;
  beneficiaryBank: string;
  transferMode: "Direct Escrow" | "RTGS" | "IMPS" | "NEFT";
  bookingValueINR: number;
  grossCommissionINR: number;
  commissionPercent: number;
  tdsDeductionINR: number;
  amountTransferredINR: number;
  status: "Settled" | "Reconciled" | "Processing" | "Failed";
  failureReason?: string;
  failureCode?: string;
  failedAt?: string;
  retryCount?: number;
  lastRetriedAt?: string;
  batchId?: string;
  remarks?: string;
}

export const INITIAL_PAYOUT_HISTORY: PayoutTransactionRecord[] = [
  {
    transactionId: "UTR-FAIL-20260828-0912",
    transactionDate: "2026-08-28 09:12:45 IST",
    leadId: "LEAD-ATT-8805",
    bookingId: "BK-DELHI-5019",
    partnerId: "PTR-DELHI-CAB-02",
    partnerName: "Delhi NCR Luxury Tourist Fleet",
    partnerCategory: "Cab",
    beneficiaryBank: "Punjab National Bank (A/C: ••••5521)",
    transferMode: "IMPS",
    bookingValueINR: 36000,
    grossCommissionINR: 4320,
    commissionPercent: 12,
    tdsDeductionINR: 360,
    amountTransferredINR: 31320,
    status: "Failed",
    failureReason: "NPCI IMPS Switch Rejection: Beneficiary IFSC Routing Code inactive / Branch merged",
    failureCode: "IFSC_ROUTING_INACTIVE",
    failedAt: "2026-08-28 09:12:51 IST",
    retryCount: 0,
    batchId: "BATCH-IMPS-883",
    remarks: "IMPS transfer bounced with code M1 (Invalid Beneficiary Details). Requires IFSC verification before retry.",
  },
  {
    transactionId: "UTR-HDFC-20260828-9842",
    transactionDate: "2026-08-28 14:32:10 IST",
    leadId: "LEAD-ATT-8803",
    bookingId: "BK-HIMALAYA-9021",
    partnerId: "PTR-HIMALAYAN-01",
    partnerName: "Himalayan Highs Expedition Retreat",
    partnerCategory: "Tour Package",
    beneficiaryBank: "HDFC Bank (A/C: ••••4091)",
    transferMode: "Direct Escrow",
    bookingValueINR: 85000,
    grossCommissionINR: 12750,
    commissionPercent: 15,
    tdsDeductionINR: 850,
    amountTransferredINR: 71400,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-882",
    remarks: "Automatic T+1 Escrow payout confirmed via Nodal API",
  },
  {
    transactionId: "UTR-FAIL-20260827-1420",
    transactionDate: "2026-08-27 14:20:10 IST",
    leadId: "LEAD-ATT-8809",
    bookingId: "BK-MICE-9092",
    partnerId: "PTR-CORP-DELHI-05",
    partnerName: "Apex Corporate Hospitality & Travel",
    partnerCategory: "Corporate MICE",
    beneficiaryBank: "Axis Bank (A/C: ••••9914)",
    transferMode: "RTGS",
    bookingValueINR: 395000,
    grossCommissionINR: 55300,
    commissionPercent: 14,
    tdsDeductionINR: 3950,
    amountTransferredINR: 335750,
    status: "Failed",
    failureReason: "Nodal Bank API Gateway Timeout during RBI RTGS settlement clearing window",
    failureCode: "GATEWAY_TIMEOUT",
    failedAt: "2026-08-27 14:20:55 IST",
    retryCount: 1,
    batchId: "BATCH-RTGS-881",
    remarks: "Gateway timeout during peak RBI clearance hours. Ready for instant re-execution via Direct Escrow.",
  },
  {
    transactionId: "UTR-ICICI-20260827-4180",
    transactionDate: "2026-08-27 11:15:45 IST",
    leadId: "LEAD-ATT-8808",
    bookingId: "BK-KASHI-3021",
    partnerId: "PTR-KASHI-01",
    partnerName: "Kashi Moksha Pilgrimage Trust",
    partnerCategory: "Pilgrimage Package",
    beneficiaryBank: "State Bank of India (A/C: ••••7723)",
    transferMode: "RTGS",
    bookingValueINR: 58000,
    grossCommissionINR: 6960,
    commissionPercent: 12,
    tdsDeductionINR: 580,
    amountTransferredINR: 50460,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-881",
    remarks: "Pilgrimage seasonal disbursement cleared",
  },
  {
    transactionId: "UTR-AXIS-20260826-6632",
    transactionDate: "2026-08-26 16:48:30 IST",
    leadId: "LEAD-ATT-8804",
    bookingId: "BK-KERALA-6104",
    partnerId: "PTR-KERALA-HB-09",
    partnerName: "Alleppey Royal Palm Houseboats",
    partnerCategory: "Houseboat",
    beneficiaryBank: "Federal Bank (A/C: ••••1190)",
    transferMode: "Direct Escrow",
    bookingValueINR: 42000,
    grossCommissionINR: 5880,
    commissionPercent: 14,
    tdsDeductionINR: 420,
    amountTransferredINR: 35700,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-880",
    remarks: "Pre-cruise checkout settlement completed",
  },
  {
    transactionId: "UTR-HDFC-20260825-3319",
    transactionDate: "2026-08-25 10:20:12 IST",
    leadId: "LEAD-ATT-8801",
    bookingId: "BK-RAJ-2024",
    partnerId: "PTR-RAJ-PALACE-03",
    partnerName: "Udaipur Royal Heritage Haveli",
    partnerCategory: "Hotel",
    beneficiaryBank: "HDFC Bank (A/C: ••••8812)",
    transferMode: "Direct Escrow",
    bookingValueINR: 110000,
    grossCommissionINR: 19800,
    commissionPercent: 18,
    tdsDeductionINR: 1100,
    amountTransferredINR: 89100,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-879",
    remarks: "Heritage suite confirmed checkout payout",
  },
  {
    transactionId: "UTR-KOTAK-20260824-7890",
    transactionDate: "2026-08-24 15:10:05 IST",
    leadId: "LEAD-ATT-8802",
    bookingId: "BK-GOA-1102",
    partnerId: "PTR-GOA-CAB-04",
    partnerName: "Goa Coast Luxury Chauffeurs",
    partnerCategory: "Cab",
    beneficiaryBank: "Kotak Mahindra Bank (A/C: ••••6641)",
    transferMode: "IMPS",
    bookingValueINR: 28000,
    grossCommissionINR: 3360,
    commissionPercent: 12,
    tdsDeductionINR: 280,
    amountTransferredINR: 24360,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-878",
    remarks: "Chauffeur transfer fleet batch settlement",
  },
  {
    transactionId: "UTR-HDFC-20260815-1044",
    transactionDate: "2026-08-15 12:45:00 IST",
    leadId: "LEAD-ATT-8811",
    bookingId: "BK-KERALA-4490",
    partnerId: "PTR-KERALA-HB-09",
    partnerName: "Alleppey Royal Palm Houseboats",
    partnerCategory: "Houseboat",
    beneficiaryBank: "Federal Bank (A/C: ••••1190)",
    transferMode: "Direct Escrow",
    bookingValueINR: 55000,
    grossCommissionINR: 7700,
    commissionPercent: 14,
    tdsDeductionINR: 550,
    amountTransferredINR: 46750,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-870",
    remarks: "Independence Day weekend cruise disbursal",
  },
  {
    transactionId: "UTR-SBI-20260722-5521",
    transactionDate: "2026-07-22 17:30:22 IST",
    leadId: "LEAD-ATT-8812",
    bookingId: "BK-HIMALAYA-7822",
    partnerId: "PTR-HIMALAYAN-01",
    partnerName: "Himalayan Highs Expedition Retreat",
    partnerCategory: "Tour Package",
    beneficiaryBank: "HDFC Bank (A/C: ••••4091)",
    transferMode: "RTGS",
    bookingValueINR: 92000,
    grossCommissionINR: 13800,
    commissionPercent: 15,
    tdsDeductionINR: 920,
    amountTransferredINR: 77280,
    status: "Reconciled",
    batchId: "BATCH-ESCROW-860",
    remarks: "July trekking monsoon batch settlement",
  }
];

interface PartnerSettlementCommissionDashboardProps {
  onNotify?: (message: string) => void;
  onOpenBookingDetails?: (item: any) => void;
}

export function PartnerSettlementCommissionDashboard({
  onNotify,
  onOpenBookingDetails,
}: PartnerSettlementCommissionDashboardProps) {
  // Enhanced dataset for rich demonstration
  const [leadsData, setLeadsData] = useState<B2BAttributedLeadConversion[]>([
    ...INITIAL_ATTRIBUTED_LEADS,
    {
      leadId: "LEAD-ATT-8806",
      campaignSource: "Google Ads",
      campaignId: "CAMP-GOOG-01",
      campaignName: "Luxury Rajasthan Heritage Palace Tour",
      partnerId: "PTR-RAJ-PALACE-03",
      partnerName: "Udaipur Royal Heritage Haveli",
      partnerCategory: "Hotel",
      customerName: "Dr. Rajesh & Sunita Malviya",
      customerPhone: "+91 98234 11099",
      customerDestination: "Udaipur & Jodhpur",
      travelDate: "2026-10-12",
      paxCount: 2,
      budgetEstimateINR: 145000,
      leadQualificationScore: 98,
      telesalesExecutiveId: "EXEC-WFH-101",
      telesalesExecutiveName: "Priya Sharma",
      stage: "Confirmed Booking",
      bookingId: "BK-HERITAGE-8491",
      bookingValueINR: 140000,
      commissionPercent: 18,
      grossCommissionINR: 25200,
      telesalesIncentiveINR: 2520,
      netPlatformRevenueINR: 22680,
      partnerSettlementAmountINR: 114800,
      settlementStatus: "Pending_Payment",
      createdAt: "2026-08-28",
    },
    {
      leadId: "LEAD-ATT-8807",
      campaignSource: "Meta Ads",
      campaignId: "CAMP-META-03",
      campaignName: "Coorg Plantation Resort Luxury Getaway",
      partnerId: "PTR-COORG-07",
      partnerName: "Misty Hills Plantation Sanctuary",
      partnerCategory: "Resort",
      customerName: "Karthik Raghavan & Group",
      customerPhone: "+91 97421 88301",
      customerDestination: "Coorg, Karnataka",
      travelDate: "2026-09-28",
      paxCount: 6,
      budgetEstimateINR: 180000,
      leadQualificationScore: 95,
      telesalesExecutiveId: "EXEC-WFH-103",
      telesalesExecutiveName: "Ananya Desai",
      stage: "Confirmed Booking",
      bookingId: "BK-COORG-5510",
      bookingValueINR: 165000,
      commissionPercent: 16,
      grossCommissionINR: 26400,
      telesalesIncentiveINR: 2640,
      netPlatformRevenueINR: 23760,
      partnerSettlementAmountINR: 138600,
      settlementStatus: "Pending_Payment",
      createdAt: "2026-08-27",
    },
    {
      leadId: "LEAD-ATT-8808",
      campaignSource: "Landing Page",
      campaignId: "CAMP-LP-01",
      campaignName: "Varanasi Ganga Aarti & Kashi Yatra",
      partnerId: "PTR-KASHI-01",
      partnerName: "Kashi Moksha Pilgrimage Trust",
      partnerCategory: "Pilgrimage Package",
      customerName: "Maheshwar Shastri",
      customerPhone: "+91 94150 99412",
      customerDestination: "Varanasi & Ayodhya",
      travelDate: "2026-09-18",
      paxCount: 4,
      budgetEstimateINR: 65000,
      leadQualificationScore: 91,
      telesalesExecutiveId: "EXEC-WFH-102",
      telesalesExecutiveName: "Amit Verma",
      stage: "Confirmed Booking",
      bookingId: "BK-KASHI-3021",
      bookingValueINR: 58000,
      commissionPercent: 12,
      grossCommissionINR: 6960,
      telesalesIncentiveINR: 696,
      netPlatformRevenueINR: 6264,
      partnerSettlementAmountINR: 51040,
      settlementStatus: "Settled",
      createdAt: "2026-08-26",
    },
    {
      leadId: "LEAD-ATT-8809",
      campaignSource: "WhatsApp Inbound",
      campaignId: "CAMP-WA-02",
      campaignName: "Corporate Offsite Golden Triangle",
      partnerId: "PTR-CORP-DELHI-05",
      partnerName: "Apex Corporate Hospitality & Travel",
      partnerCategory: "Corporate MICE",
      customerName: "Siddharth Jain (FinTech Corp)",
      customerPhone: "+91 99100 44556",
      customerDestination: "Jaipur & Agra",
      travelDate: "2026-11-05",
      paxCount: 22,
      budgetEstimateINR: 420000,
      leadQualificationScore: 97,
      telesalesExecutiveId: "EXEC-WFH-101",
      telesalesExecutiveName: "Priya Sharma",
      stage: "Confirmed Booking",
      bookingId: "BK-MICE-9092",
      bookingValueINR: 395000,
      commissionPercent: 14,
      grossCommissionINR: 55300,
      telesalesIncentiveINR: 5530,
      netPlatformRevenueINR: 49770,
      partnerSettlementAmountINR: 339700,
      settlementStatus: "Pending_Payment",
      createdAt: "2026-08-28",
    },
    {
      leadId: "LEAD-ATT-8810",
      campaignSource: "Instagram Reel",
      campaignId: "CAMP-REEL-02",
      campaignName: "Ladakh Bike Safari & Pangong Camp",
      partnerId: "PTR-LADAKH-09",
      partnerName: "High Altitude Himalayan Nomads",
      partnerCategory: "Tour Package",
      customerName: "Rohan & Devendra Patil",
      customerPhone: "+91 98690 12345",
      customerDestination: "Leh, Nubra, Pangong",
      travelDate: "2026-09-30",
      paxCount: 2,
      budgetEstimateINR: 75000,
      leadQualificationScore: 89,
      telesalesExecutiveId: "EXEC-WFH-103",
      telesalesExecutiveName: "Ananya Desai",
      stage: "Confirmed Booking",
      bookingId: "BK-LADAKH-4011",
      bookingValueINR: 72000,
      commissionPercent: 15,
      grossCommissionINR: 10800,
      telesalesIncentiveINR: 1080,
      netPlatformRevenueINR: 9720,
      partnerSettlementAmountINR: 61200,
      settlementStatus: "Pending_Payment",
      createdAt: "2026-08-28",
    },
    {
      leadId: "LEAD-ATT-8811",
      campaignSource: "Google Ads",
      campaignId: "CAMP-GOOG-02",
      campaignName: "Monsoon Houseboat & Backwater Cruise",
      partnerId: "PTR-KERALA-HB-09",
      partnerName: "Alleppey Royal Palm Houseboats",
      partnerCategory: "Houseboat",
      customerName: "Vinay & Shalini Iyer",
      customerPhone: "+91 98450 77112",
      customerDestination: "Alleppey & Kumarakom",
      travelDate: "2026-08-20",
      paxCount: 2,
      budgetEstimateINR: 58000,
      leadQualificationScore: 92,
      telesalesExecutiveId: "EXEC-WFH-102",
      telesalesExecutiveName: "Amit Verma",
      stage: "Confirmed Booking",
      bookingId: "BK-KERALA-4490",
      bookingValueINR: 55000,
      commissionPercent: 14,
      grossCommissionINR: 7700,
      telesalesIncentiveINR: 770,
      netPlatformRevenueINR: 6930,
      partnerSettlementAmountINR: 47300,
      settlementStatus: "Settled",
      createdAt: "2026-08-15",
    },
    {
      leadId: "LEAD-ATT-8812",
      campaignSource: "Organic SEO",
      campaignId: "CAMP-SEO-01",
      campaignName: "Himalayan High Passes Alpine Expedition",
      partnerId: "PTR-HIMALAYAN-01",
      partnerName: "Himalayan Highs Expedition Retreat",
      partnerCategory: "Tour Package",
      customerName: "Capt. Arvind Nair & Team",
      customerPhone: "+91 97110 33902",
      customerDestination: "Manali & Spiti Valley",
      travelDate: "2026-07-28",
      paxCount: 5,
      budgetEstimateINR: 98000,
      leadQualificationScore: 96,
      telesalesExecutiveId: "EXEC-WFH-101",
      telesalesExecutiveName: "Priya Sharma",
      stage: "Confirmed Booking",
      bookingId: "BK-HIMALAYA-7822",
      bookingValueINR: 92000,
      commissionPercent: 15,
      grossCommissionINR: 13800,
      telesalesIncentiveINR: 1380,
      netPlatformRevenueINR: 12420,
      partnerSettlementAmountINR: 78200,
      settlementStatus: "Settled",
      createdAt: "2026-07-22",
    }
  ]);

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState<"settlements" | "payout_history">("settlements");

  // Payout History Logs State
  const [payoutHistory, setPayoutHistory] = useState<PayoutTransactionRecord[]>(INITIAL_PAYOUT_HISTORY);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");
  const [historySelectedPartnerIds, setHistorySelectedPartnerIds] = useState<string[]>([]);
  const [isHistoryPartnerDropdownOpen, setIsHistoryPartnerDropdownOpen] = useState<boolean>(false);
  const [historyPartnerSearchTerm, setHistoryPartnerSearchTerm] = useState<string>("");
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>("ALL");
  const [historyModeFilter, setHistoryModeFilter] = useState<string>("ALL");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<"ALL" | "RECONCILED" | "FAILED">("ALL");
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<PayoutTransactionRecord | null>(null);
  const [retryingRecord, setRetryingRecord] = useState<PayoutTransactionRecord | null>(null);
  const [isRetryingDirectly, setIsRetryingDirectly] = useState<string | null>(null);
  const [retryTransferMode, setRetryTransferMode] = useState<"Direct Escrow" | "RTGS" | "IMPS" | "NEFT">("Direct Escrow");
  const [retryBeneficiaryBank, setRetryBeneficiaryBank] = useState<string>("");
  const [retryCustomRemarks, setRetryCustomRemarks] = useState<string>("");
  const [isExecutingRetryModal, setIsExecutingRetryModal] = useState<boolean>(false);
  const [retryExecutionStep, setRetryExecutionStep] = useState<number>(0);

  // Multi-Select Filters for Active Settlements
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  // Multi-select for Settlement Status: empty array [] denotes "All Statuses"
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // Multi-select for Partner IDs: empty array [] denotes "All Partners"
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Date Range Filtering State for Active Settlements
  const [selectedDatePreset, setSelectedDatePreset] = useState<DateRangePreset>("ALL");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [dateFilterField, setDateFilterField] = useState<DateFilterField>("createdAt");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);

  // Date Range Filtering State for Payout History
  const [historyDatePreset, setHistoryDatePreset] = useState<DateRangePreset>("ALL");
  const [historyCustomStartDate, setHistoryCustomStartDate] = useState<string>("");
  const [historyCustomEndDate, setHistoryCustomEndDate] = useState<string>("");
  const [isHistoryDateDropdownOpen, setIsHistoryDateDropdownOpen] = useState<boolean>(false);

  // Dropdown Popover States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState<boolean>(false);
  const [partnerSearchTerm, setPartnerSearchTerm] = useState<string>("");

  // Column Sorting State for Active Settlements
  const [settlementSortField, setSettlementSortField] = useState<SettlementSortField>("createdAt");
  const [settlementSortDirection, setSettlementSortDirection] = useState<SortDirection>("desc");

  // Column Sorting State for Payout History
  const [historySortField, setHistorySortField] = useState<HistorySortField>("transactionDate");
  const [historySortDirection, setHistorySortDirection] = useState<SortDirection>("desc");

  // Toggle sorting column for Active Settlements table
  const handleToggleSettlementSort = (field: SettlementSortField) => {
    if (settlementSortField === field) {
      setSettlementSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSettlementSortField(field);
      // Default to descending for dates and financial amounts, ascending for names/categories/statuses
      if (
        field === "createdAt" ||
        field === "travelDate" ||
        field === "bookingValueINR" ||
        field === "partnerSettlementAmountINR" ||
        field === "grossCommissionINR" ||
        field === "commissionPercent"
      ) {
        setSettlementSortDirection("desc");
      } else {
        setSettlementSortDirection("asc");
      }
    }
  };

  // Toggle sorting column for Payout History table
  const handleToggleHistorySort = (field: HistorySortField) => {
    if (historySortField === field) {
      setHistorySortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setHistorySortField(field);
      // Default to descending for dates and financial amounts
      if (
        field === "transactionDate" ||
        field === "amountTransferredINR" ||
        field === "bookingValueINR" ||
        field === "grossCommissionINR" ||
        field === "tdsDeductionINR"
      ) {
        setHistorySortDirection("desc");
      } else {
        setHistorySortDirection("asc");
      }
    }
  };

  // Reset active table sorting to default Date DESC
  const handleResetSettlementSort = () => {
    setSettlementSortField("createdAt");
    setSettlementSortDirection("desc");
  };

  const handleResetHistorySort = () => {
    setHistorySortField("transactionDate");
    setHistorySortDirection("desc");
  };

  const [settlingLeadId, setSettlingLeadId] = useState<string | null>(null);
  const [isBatchSettling, setIsBatchSettling] = useState<boolean>(false);
  const [selectedReceiptLead, setSelectedReceiptLead] = useState<B2BAttributedLeadConversion | null>(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState<boolean>(false);

  // Granular Transaction Breakdown & Settlement Metadata Side-Drawer State
  const [selectedDetailItem, setSelectedDetailItem] = useState<
    B2BAttributedLeadConversion | PayoutTransactionRecord | null
  >(null);
  const [selectedDetailType, setSelectedDetailType] = useState<"lead" | "history">("lead");
  const [drawerTab, setDrawerTab] = useState<"breakdown" | "partner" | "attribution" | "timeline">("breakdown");
  const [drawerCopiedToast, setDrawerCopiedToast] = useState<string | null>(null);

  const handleOpenGranularDetail = (
    item: B2BAttributedLeadConversion | PayoutTransactionRecord,
    type: "lead" | "history"
  ) => {
    setSelectedDetailItem(item);
    setSelectedDetailType(type);
    setDrawerTab("breakdown");
  };

  const handleCloseDrawer = () => {
    setSelectedDetailItem(null);
  };

  const handleDrawerCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setDrawerCopiedToast(`Copied ${label}!`);
      setTimeout(() => setDrawerCopiedToast(null), 2500);
      if (onNotify) onNotify(`Copied ${label}: ${text}`);
    }
  };

  // Keyboard shortcut: Escape to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedDetailItem) setSelectedDetailItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDetailItem]);

  // Refs for click outside handling
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const partnerDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const historyPartnerDropdownRef = useRef<HTMLDivElement>(null);
  const historyDateDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(event.target as Node)) {
        setIsPartnerDropdownOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
      if (historyPartnerDropdownRef.current && !historyPartnerDropdownRef.current.contains(event.target as Node)) {
        setIsHistoryPartnerDropdownOpen(false);
      }
      if (historyDateDropdownRef.current && !historyDateDropdownRef.current.contains(event.target as Node)) {
        setIsHistoryDateDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unique partner list derived for filtering & auditing
  const partnerList = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; pendingCount: number; settledCount: number }>();
    leadsData.forEach((l) => {
      if (l.partnerId) {
        const existing = map.get(l.partnerId);
        const isPending = l.settlementStatus === "Pending_Payment";
        const isSettled = l.settlementStatus === "Settled";
        if (!existing) {
          map.set(l.partnerId, {
            id: l.partnerId,
            name: l.partnerName,
            category: l.partnerCategory,
            pendingCount: isPending ? 1 : 0,
            settledCount: isSettled ? 1 : 0,
          });
        } else {
          if (isPending) existing.pendingCount += 1;
          if (isSettled) existing.settledCount += 1;
        }
      }
    });
    // Also include any partners in history
    payoutHistory.forEach((p) => {
      if (p.partnerId && !map.has(p.partnerId)) {
        map.set(p.partnerId, {
          id: p.partnerId,
          name: p.partnerName,
          category: p.partnerCategory,
          pendingCount: 0,
          settledCount: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [leadsData, payoutHistory]);

  // Category list derived
  const categories = useMemo(() => {
    const set = new Set<string>();
    leadsData.forEach((l) => set.add(l.partnerCategory));
    payoutHistory.forEach((p) => set.add(p.partnerCategory));
    return Array.from(set);
  }, [leadsData, payoutHistory]);

  // Multi-Select Status Handlers
  const toggleStatusFilter = (statusId: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(statusId)) {
        return prev.filter((s) => s !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  const selectOnlyStatus = (statusId: string) => {
    setSelectedStatuses([statusId]);
  };

  const clearStatusFilters = () => {
    setSelectedStatuses([]);
  };

  // Multi-Select Partner ID Handlers
  const togglePartnerIdFilter = (partnerId: string) => {
    setSelectedPartnerIds((prev) => {
      if (prev.includes(partnerId)) {
        return prev.filter((id) => id !== partnerId);
      } else {
        return [...prev, partnerId];
      }
    });
  };

  const selectSinglePartner = (partnerId: string) => {
    setSelectedPartnerIds([partnerId]);
  };

  const removePartnerIdFilter = (partnerId: string) => {
    setSelectedPartnerIds((prev) => prev.filter((id) => id !== partnerId));
  };

  const selectAllPartners = () => {
    setSelectedPartnerIds(partnerList.map((p) => p.id));
  };

  const clearPartnerFilters = () => {
    setSelectedPartnerIds([]);
  };

  // Payout History Multi-Select Partner Handlers
  const toggleHistoryPartnerFilter = (partnerId: string) => {
    setHistorySelectedPartnerIds((prev) => {
      if (prev.includes(partnerId)) {
        return prev.filter((id) => id !== partnerId);
      } else {
        return [...prev, partnerId];
      }
    });
  };

  const clearHistoryPartnerFilters = () => {
    setHistorySelectedPartnerIds([]);
  };

  // Date Range Filter Handlers for Active Settlements
  const handleSelectDatePreset = (preset: DateRangePreset) => {
    setSelectedDatePreset(preset);
    if (preset !== "CUSTOM") {
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  const handleClearDateFilter = () => {
    setSelectedDatePreset("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  // Date Range Filter Handlers for Payout History
  const handleSelectHistoryDatePreset = (preset: DateRangePreset) => {
    setHistoryDatePreset(preset);
    if (preset !== "CUSTOM") {
      setHistoryCustomStartDate("");
      setHistoryCustomEndDate("");
    }
  };

  const handleClearHistoryDateFilter = () => {
    setHistoryDatePreset("ALL");
    setHistoryCustomStartDate("");
    setHistoryCustomEndDate("");
  };

  // Active Date Bounds calculation
  const activeDateBounds = useMemo(() => {
    return getDateRangeBounds(selectedDatePreset, customStartDate, customEndDate);
  }, [selectedDatePreset, customStartDate, customEndDate]);

  const activeHistoryDateBounds = useMemo(() => {
    return getDateRangeBounds(historyDatePreset, historyCustomStartDate, historyCustomEndDate);
  }, [historyDatePreset, historyCustomStartDate, historyCustomEndDate]);

  // Filtered and Sorted converted leads in Active Settlements
  const filteredLeads = useMemo(() => {
    const { start: dateStart, end: dateEnd } = activeDateBounds;
    const isDateFilterActive = selectedDatePreset !== "ALL" || customStartDate !== "" || customEndDate !== "";

    const matched = leadsData.filter((item) => {
      const matchCategory = selectedCategory === "ALL" || item.partnerCategory === selectedCategory;
      
      // Multi-Select Partner ID filter (empty array matches ALL)
      const matchPartner =
        selectedPartnerIds.length === 0 || selectedPartnerIds.includes(item.partnerId);
      
      // Multi-Select Settlement Status filter (empty array matches ALL)
      const matchStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.settlementStatus);

      const matchChannel = selectedChannel === "ALL" || item.campaignSource === selectedChannel;
      
      // Date Range Match
      let matchDate = true;
      if (isDateFilterActive) {
        const itemDateStr = dateFilterField === "travelDate" ? item.travelDate : item.createdAt;
        if (itemDateStr) {
          if (dateStart && itemDateStr < dateStart) matchDate = false;
          if (dateEnd && itemDateStr > dateEnd) matchDate = false;
        } else {
          matchDate = false;
        }
      }

      const matchSearch =
        searchQuery === "" ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partnerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.leadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.bookingId && item.bookingId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.customerDestination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchPartner && matchStatus && matchChannel && matchDate && matchSearch;
    });

    // Apply interactive column sorting
    const sorted = [...matched];
    sorted.sort((a, b) => {
      let valA: any = a[settlementSortField as keyof B2BAttributedLeadConversion];
      let valB: any = b[settlementSortField as keyof B2BAttributedLeadConversion];

      if (settlementSortField === "createdAt" || settlementSortField === "travelDate") {
        const timeA = new Date(valA || 0).getTime();
        const timeB = new Date(valB || 0).getTime();
        return settlementSortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return settlementSortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = (valA ?? "").toString().toLowerCase();
      const strB = (valB ?? "").toString().toLowerCase();
      if (strA < strB) return settlementSortDirection === "asc" ? -1 : 1;
      if (strA > strB) return settlementSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [
    leadsData,
    selectedCategory,
    selectedPartnerIds,
    selectedStatuses,
    selectedChannel,
    searchQuery,
    activeDateBounds,
    selectedDatePreset,
    customStartDate,
    customEndDate,
    dateFilterField,
    settlementSortField,
    settlementSortDirection,
  ]);

  // Filtered and Sorted Payout History for Auditing Log
  const filteredPayoutHistory = useMemo(() => {
    const { start: dateStart, end: dateEnd } = activeHistoryDateBounds;
    const isDateFilterActive = historyDatePreset !== "ALL" || historyCustomStartDate !== "" || historyCustomEndDate !== "";

    const matched = payoutHistory.filter((item) => {
      const matchPartner =
        historySelectedPartnerIds.length === 0 || historySelectedPartnerIds.includes(item.partnerId);
      const matchCategory = historyCategoryFilter === "ALL" || item.partnerCategory === historyCategoryFilter;
      const matchMode = historyModeFilter === "ALL" || item.transferMode === historyModeFilter;
      const matchStatus =
        historyStatusFilter === "ALL" ||
        (historyStatusFilter === "FAILED"
          ? item.status === "Failed"
          : item.status === "Reconciled" || item.status === "Settled");

      // Date Range Match for History (using transactionDate timestamp)
      let matchDate = true;
      if (isDateFilterActive) {
        const txDateStr = item.transactionDate.substring(0, 10);
        if (txDateStr) {
          if (dateStart && txDateStr < dateStart) matchDate = false;
          if (dateEnd && txDateStr > dateEnd) matchDate = false;
        } else {
          matchDate = false;
        }
      }

      const matchSearch =
        historySearchQuery === "" ||
        item.transactionId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.partnerName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.partnerId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.bookingId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.leadId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        (item.failureReason && item.failureReason.toLowerCase().includes(historySearchQuery.toLowerCase())) ||
        item.beneficiaryBank.toLowerCase().includes(historySearchQuery.toLowerCase());

      return matchPartner && matchCategory && matchMode && matchStatus && matchDate && matchSearch;
    });

    // Apply interactive column sorting
    const sorted = [...matched];
    sorted.sort((a, b) => {
      let valA: any = a[historySortField as keyof PayoutTransactionRecord];
      let valB: any = b[historySortField as keyof PayoutTransactionRecord];

      if (historySortField === "transactionDate") {
        const timeA = new Date(valA || 0).getTime();
        const timeB = new Date(valB || 0).getTime();
        return historySortDirection === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return historySortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = (valA ?? "").toString().toLowerCase();
      const strB = (valB ?? "").toString().toLowerCase();
      if (strA < strB) return historySortDirection === "asc" ? -1 : 1;
      if (strA > strB) return historySortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [
    payoutHistory,
    historySelectedPartnerIds,
    historyCategoryFilter,
    historyModeFilter,
    historyStatusFilter,
    historySearchQuery,
    activeHistoryDateBounds,
    historyDatePreset,
    historyCustomStartDate,
    historyCustomEndDate,
    historySortField,
    historySortDirection,
  ]);

  // Payout History Summary Metrics
  const historyMetrics = useMemo(() => {
    const totalTransactions = payoutHistory.length;
    const failedRecords = payoutHistory.filter((p) => p.status === "Failed");
    const failedCount = failedRecords.length;
    const failedAmountINR = failedRecords.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);
    const reconciledRecords = payoutHistory.filter((p) => p.status !== "Failed");
    const reconciledCount = reconciledRecords.length;
    const totalAmountTransferred = reconciledRecords.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);
    const totalGrossGMV = payoutHistory.reduce((sum, p) => sum + (p.bookingValueINR || 0), 0);
    const totalCommissionRetained = payoutHistory.reduce((sum, p) => sum + (p.grossCommissionINR || 0), 0);
    const totalTdsRemitted = payoutHistory.reduce((sum, p) => sum + (p.tdsDeductionINR || 0), 0);

    return {
      totalTransactions,
      failedCount,
      failedAmountINR,
      reconciledCount,
      totalAmountTransferred,
      totalGrossGMV,
      totalCommissionRetained,
      totalTdsRemitted,
      lastPayoutDate: payoutHistory[0]?.transactionDate || "N/A",
    };
  }, [payoutHistory]);

  // Targeted Multi-Partner Audit & Reconciliation Summary Details
  const selectedPartnerAudit = useMemo(() => {
    if (selectedPartnerIds.length === 0) return null;
    const partnerLeads = leadsData.filter((l) => selectedPartnerIds.includes(l.partnerId));
    const partnerDetails = partnerList.filter((p) => selectedPartnerIds.includes(p.id));
    const totalBookings = partnerLeads.length;
    const totalGMV = partnerLeads.reduce((sum, l) => sum + (l.bookingValueINR || 0), 0);
    const totalCommission = partnerLeads.reduce((sum, l) => sum + (l.grossCommissionINR || 0), 0);
    const totalPaid = partnerLeads
      .filter((l) => l.settlementStatus === "Settled")
      .reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
    const totalPending = partnerLeads
      .filter((l) => l.settlementStatus === "Pending_Payment")
      .reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
    const pendingCount = partnerLeads.filter((l) => l.settlementStatus === "Pending_Payment").length;
    const settledCount = partnerLeads.filter((l) => l.settlementStatus === "Settled").length;
    const isSingle = selectedPartnerIds.length === 1;

    return {
      isSingle,
      count: selectedPartnerIds.length,
      partnerIds: selectedPartnerIds,
      partnerDetails,
      singlePartnerName: partnerDetails[0]?.name || partnerLeads[0]?.partnerName || selectedPartnerIds[0],
      singlePartnerId: selectedPartnerIds[0],
      singlePartnerCategory: partnerDetails[0]?.category || partnerLeads[0]?.partnerCategory || "General",
      totalBookings,
      totalGMV,
      totalCommission,
      totalPaid,
      totalPending,
      pendingCount,
      settledCount,
    };
  }, [leadsData, selectedPartnerIds, partnerList]);

  // Aggregated Key Metrics
  const metrics = useMemo(() => {
    const converted = leadsData.filter((l) => l.stage === "Confirmed Booking");
    const totalGMV = converted.reduce((sum, l) => sum + (l.bookingValueINR || 0), 0);
    const totalGrossCommission = converted.reduce((sum, l) => sum + (l.grossCommissionINR || 0), 0);
    const totalPartnerSettlements = converted.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
    const pendingPayouts = converted.filter((l) => l.settlementStatus === "Pending_Payment");
    const pendingAmount = pendingPayouts.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
    const settledPayouts = converted.filter((l) => l.settlementStatus === "Settled");
    const settledAmount = settledPayouts.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
    const avgCommissionPercent =
      converted.length > 0
        ? (converted.reduce((sum, l) => sum + l.commissionPercent, 0) / converted.length).toFixed(1)
        : "15.0";

    return {
      convertedCount: converted.length,
      totalGMV,
      totalGrossCommission,
      totalPartnerSettlements,
      pendingCount: pendingPayouts.length,
      pendingAmount,
      settledCount: settledPayouts.length,
      settledAmount,
      avgCommissionPercent,
    };
  }, [leadsData]);

  // Live Filtered Summary for Active Settlements Ledger
  const filteredLeadsSummary = useMemo(() => {
    const count = filteredLeads.length;
    const totalGMV = filteredLeads.reduce((sum, l) => sum + (l.bookingValueINR || 0), 0);
    const totalCommission = filteredLeads.reduce((sum, l) => sum + (l.grossCommissionINR || 0), 0);
    const totalSettlementAmount = filteredLeads.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);

    const pendingLeads = filteredLeads.filter((l) => l.settlementStatus === "Pending_Payment");
    const pendingCount = pendingLeads.length;
    const pendingAmount = pendingLeads.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);

    const settledLeads = filteredLeads.filter((l) => l.settlementStatus === "Settled");
    const settledCount = settledLeads.length;
    const settledAmount = settledLeads.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);

    const processingLeads = filteredLeads.filter((l) => l.settlementStatus === "Processing" || settlingLeadId === l.leadId);
    const processingCount = processingLeads.length;
    const processingAmount = processingLeads.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);

    const refundLeads = filteredLeads.filter((l) => l.settlementStatus === "Reversed_Refund");
    const refundCount = refundLeads.length;
    const refundAmount = refundLeads.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);

    const uniquePartnersCount = new Set(filteredLeads.map((l) => l.partnerId)).size;
    const uniqueTravelersCount = new Set(filteredLeads.map((l) => l.customerName)).size;
    const avgCommissionPercent =
      count > 0 ? (filteredLeads.reduce((sum, l) => sum + l.commissionPercent, 0) / count).toFixed(1) : "0.0";

    const isFiltered =
      selectedCategory !== "ALL" ||
      selectedPartnerIds.length > 0 ||
      selectedStatuses.length > 0 ||
      selectedChannel !== "ALL" ||
      selectedDatePreset !== "ALL" ||
      customStartDate !== "" ||
      customEndDate !== "" ||
      searchQuery !== "";

    return {
      count,
      totalGMV,
      totalCommission,
      totalSettlementAmount,
      pendingCount,
      pendingAmount,
      settledCount,
      settledAmount,
      processingCount,
      processingAmount,
      refundCount,
      refundAmount,
      uniquePartnersCount,
      uniqueTravelersCount,
      avgCommissionPercent,
      isFiltered,
    };
  }, [
    filteredLeads,
    settlingLeadId,
    selectedCategory,
    selectedPartnerIds,
    selectedStatuses,
    selectedChannel,
    selectedDatePreset,
    customStartDate,
    customEndDate,
    searchQuery,
  ]);

  // Live Filtered Summary for Payout History (Auditing Log)
  const filteredPayoutHistorySummary = useMemo(() => {
    const count = filteredPayoutHistory.length;
    const totalAmountTransferred = filteredPayoutHistory.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);
    const totalGrossGMV = filteredPayoutHistory.reduce((sum, p) => sum + (p.bookingValueINR || 0), 0);
    const totalCommission = filteredPayoutHistory.reduce((sum, p) => sum + (p.grossCommissionINR || 0), 0);
    const totalTds = filteredPayoutHistory.reduce((sum, p) => sum + (p.tdsDeductionINR || 0), 0);
    
    const failedItems = filteredPayoutHistory.filter((p) => p.status === "Failed");
    const failedCount = failedItems.length;
    const failedAmountINR = failedItems.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);

    const reconciledItems = filteredPayoutHistory.filter((p) => p.status !== "Failed");
    const reconciledCount = reconciledItems.length;
    const reconciledAmountINR = reconciledItems.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);

    const uniquePartnersCount = new Set(filteredPayoutHistory.map((p) => p.partnerId)).size;

    const isFiltered =
      historySelectedPartnerIds.length > 0 ||
      historyCategoryFilter !== "ALL" ||
      historyModeFilter !== "ALL" ||
      historyStatusFilter !== "ALL" ||
      historyDatePreset !== "ALL" ||
      historyCustomStartDate !== "" ||
      historyCustomEndDate !== "" ||
      historySearchQuery !== "";

    return {
      count,
      totalAmountTransferred,
      totalGrossGMV,
      totalCommission,
      totalTds,
      failedCount,
      failedAmountINR,
      reconciledCount,
      reconciledAmountINR,
      uniquePartnersCount,
      isFiltered,
    };
  }, [
    filteredPayoutHistory,
    historySelectedPartnerIds,
    historyCategoryFilter,
    historyModeFilter,
    historyStatusFilter,
    historyDatePreset,
    historyCustomStartDate,
    historyCustomEndDate,
    historySearchQuery,
  ]);

  // Copy UTR handler
  const handleCopyUtr = (utr: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(utr);
    }
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
    if (onNotify) onNotify(`Copied UTR Reference: ${utr}`);
  };

  // Handler for individual payout trigger
  const handleTriggerPayout = (leadId: string) => {
    setSettlingLeadId(leadId);
    setTimeout(() => {
      const lead = leadsData.find((l) => l.leadId === leadId);
      const generatedUtr = `UTR-HDFC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;
      const tds = Math.round((lead?.bookingValueINR || 0) * 0.01);
      const netTransferred = Math.max(0, (lead?.partnerSettlementAmountINR || 0) - tds);

      setLeadsData((prev) =>
        prev.map((item) => {
          if (item.leadId === leadId) {
            return {
              ...item,
              settlementStatus: "Settled",
            };
          }
          return item;
        })
      );

      // Append into Payout History Log
      if (lead) {
        const newHistoryRecord: PayoutTransactionRecord = {
          transactionId: generatedUtr,
          transactionDate: nowFormatted,
          leadId: lead.leadId,
          bookingId: lead.bookingId || `BK-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
          partnerId: lead.partnerId,
          partnerName: lead.partnerName,
          partnerCategory: lead.partnerCategory,
          beneficiaryBank: "HDFC Nodal Escrow A/C (••••4091)",
          transferMode: "Direct Escrow",
          bookingValueINR: lead.bookingValueINR || lead.budgetEstimateINR || 0,
          grossCommissionINR: lead.grossCommissionINR,
          commissionPercent: lead.commissionPercent,
          tdsDeductionINR: tds,
          amountTransferredINR: lead.partnerSettlementAmountINR,
          status: "Reconciled",
          batchId: `BATCH-AUTO-${Math.floor(100 + Math.random() * 900)}`,
          remarks: "Instant Escrow Payout executed via Admin Dashboard",
        };
        setPayoutHistory((prev) => [newHistoryRecord, ...prev]);
      }

      setSettlingLeadId(null);
      const msg = `Disbursed ₹${(lead?.partnerSettlementAmountINR || 0).toLocaleString(
        "en-IN"
      )} to ${lead?.partnerName} (Ref UTR: ${generatedUtr})`;
      if (onNotify) onNotify(msg);
    }, 600);
  };

  // Handler for Batch Settlement
  const handleBatchPayout = () => {
    setIsBatchSettling(true);
    setTimeout(() => {
      const pendingItems = leadsData.filter(
        (l) => l.settlementStatus === "Pending_Payment" && l.stage === "Confirmed Booking"
      );
      const batchId = `BATCH-ESCROW-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;

      const newHistoryRecords: PayoutTransactionRecord[] = pendingItems.map((lead, idx) => ({
        transactionId: `UTR-HDFC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + idx * 11 + Math.random() * 900)}`,
        transactionDate: nowFormatted,
        leadId: lead.leadId,
        bookingId: lead.bookingId || `BK-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        partnerId: lead.partnerId,
        partnerName: lead.partnerName,
        partnerCategory: lead.partnerCategory,
        beneficiaryBank: "HDFC Nodal Escrow A/C (••••4091)",
        transferMode: "Direct Escrow",
        bookingValueINR: lead.bookingValueINR || lead.budgetEstimateINR || 0,
        grossCommissionINR: lead.grossCommissionINR,
        commissionPercent: lead.commissionPercent,
        tdsDeductionINR: Math.round((lead.bookingValueINR || 0) * 0.01),
        amountTransferredINR: lead.partnerSettlementAmountINR,
        status: "Reconciled",
        batchId,
        remarks: `Batch Settlement ${batchId} auto-cleared`,
      }));

      setLeadsData((prev) =>
        prev.map((item) => {
          if (item.settlementStatus === "Pending_Payment" && item.stage === "Confirmed Booking") {
            return {
              ...item,
              settlementStatus: "Settled",
            };
          }
          return item;
        })
      );

      setPayoutHistory((prev) => [...newHistoryRecords, ...prev]);
      setIsBatchSettling(false);
      const msg = `Batch Payout Processed: Successfully settled ${pendingItems.length} pending partner payouts (Total ₹${metrics.pendingAmount.toLocaleString(
        "en-IN"
      )}) via Automated Escrow Route!`;
      if (onNotify) onNotify(msg);
    }, 900);
  };

  // Handler for Batch Settlement of Filtered Pending Records
  const handleBatchFilteredPayout = () => {
    const pendingFilteredItems = filteredLeads.filter(
      (l) => l.settlementStatus === "Pending_Payment" && l.stage === "Confirmed Booking"
    );
    if (pendingFilteredItems.length === 0) return;

    setIsBatchSettling(true);
    setTimeout(() => {
      const batchId = `BATCH-FILTERED-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;
      const pendingIds = pendingFilteredItems.map((l) => l.leadId);

      const newHistoryRecords: PayoutTransactionRecord[] = pendingFilteredItems.map((lead, idx) => ({
        transactionId: `UTR-HDFC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + idx * 11 + Math.random() * 900)}`,
        transactionDate: nowFormatted,
        leadId: lead.leadId,
        bookingId: lead.bookingId || `BK-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
        partnerId: lead.partnerId,
        partnerName: lead.partnerName,
        partnerCategory: lead.partnerCategory,
        beneficiaryBank: "HDFC Nodal Escrow A/C (••••4091)",
        transferMode: "Direct Escrow",
        bookingValueINR: lead.bookingValueINR || lead.budgetEstimateINR || 0,
        grossCommissionINR: lead.grossCommissionINR,
        commissionPercent: lead.commissionPercent,
        tdsDeductionINR: Math.round((lead.bookingValueINR || 0) * 0.01),
        amountTransferredINR: lead.partnerSettlementAmountINR,
        status: "Reconciled",
        batchId,
        remarks: `Filtered Batch Settlement ${batchId} auto-cleared`,
      }));

      setLeadsData((prev) =>
        prev.map((item) => {
          if (pendingIds.includes(item.leadId)) {
            return {
              ...item,
              settlementStatus: "Settled",
            };
          }
          return item;
        })
      );

      setPayoutHistory((prev) => [...newHistoryRecords, ...prev]);
      setIsBatchSettling(false);
      const totalAmount = pendingFilteredItems.reduce((sum, l) => sum + (l.partnerSettlementAmountINR || 0), 0);
      const msg = `Filtered Batch Payout: Successfully settled ${pendingFilteredItems.length} visible partner payout(s) (Total ₹${totalAmount.toLocaleString(
        "en-IN"
      )}) via Escrow Route!`;
      if (onNotify) onNotify(msg);
    }, 900);
  };

  // Open Retry Diagnostics & Authorization Modal
  const handleOpenRetryModal = (record: PayoutTransactionRecord) => {
    setRetryingRecord(record);
    setRetryTransferMode(record.transferMode === "IMPS" ? "Direct Escrow" : record.transferMode);
    setRetryBeneficiaryBank(record.beneficiaryBank);
    setRetryCustomRemarks(record.failureReason ? `Resolved: Re-disbursing via alternative gateway after verifying banking routing.` : "");
    setIsExecutingRetryModal(false);
    setRetryExecutionStep(0);
  };

  // Execute Modal Retry with realistic simulated steps
  const handleExecuteModalRetry = () => {
    if (!retryingRecord) return;
    setIsExecutingRetryModal(true);
    setRetryExecutionStep(1); // Verifying IFSC & account

    setTimeout(() => {
      setRetryExecutionStep(2); // Connecting Nodal Gateway & clearing funds

      setTimeout(() => {
        setRetryExecutionStep(3); // Generating live UTR & Reconciling
        const newUtr = `UTR-${retryTransferMode === "Direct Escrow" ? "HDFC" : retryTransferMode}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
        const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;

        setPayoutHistory((prev) =>
          prev.map((item) => {
            if (item.transactionId === retryingRecord.transactionId) {
              return {
                ...item,
                transactionId: newUtr,
                transactionDate: nowFormatted,
                transferMode: retryTransferMode,
                beneficiaryBank: retryBeneficiaryBank || item.beneficiaryBank,
                status: "Reconciled",
                retryCount: (item.retryCount || 0) + 1,
                lastRetriedAt: nowFormatted,
                failureReason: undefined,
                failureCode: undefined,
                remarks: retryCustomRemarks || `Payment successfully re-disbursed via ${retryTransferMode} on retry #${(item.retryCount || 0) + 1}.`,
              };
            }
            return item;
          })
        );

        // Update corresponding lead in leadsData if matched
        if (retryingRecord.leadId) {
          setLeadsData((prev) =>
            prev.map((l) => {
              if (l.leadId === retryingRecord.leadId || (retryingRecord.bookingId && l.bookingId === retryingRecord.bookingId)) {
                return {
                  ...l,
                  settlementStatus: "Settled",
                };
              }
              return l;
            })
          );
        }

        setTimeout(() => {
          setIsExecutingRetryModal(false);
          setRetryingRecord(null);
          setRetryExecutionStep(0);
          const msg = `Retry Successful: ₹${retryingRecord.amountTransferredINR.toLocaleString("en-IN")} re-disbursed to ${retryingRecord.partnerName} via ${retryTransferMode} (New UTR: ${newUtr})`;
          if (onNotify) onNotify(msg);
        }, 600);
      }, 700);
    }, 700);
  };

  // Direct 1-Click Inline Retry from table row
  const handleDirectInlineRetry = (record: PayoutTransactionRecord) => {
    setIsRetryingDirectly(record.transactionId);
    setTimeout(() => {
      const mode = record.transferMode === "IMPS" ? "Direct Escrow" : record.transferMode;
      const newUtr = `UTR-RETRY-HDFC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;

      setPayoutHistory((prev) =>
        prev.map((item) => {
          if (item.transactionId === record.transactionId) {
            return {
              ...item,
              transactionId: newUtr,
              transactionDate: nowFormatted,
              transferMode: mode,
              status: "Reconciled",
              retryCount: (item.retryCount || 0) + 1,
              lastRetriedAt: nowFormatted,
              failureReason: undefined,
              failureCode: undefined,
              remarks: `Quick inline retry #${(item.retryCount || 0) + 1} auto-reconciled via Direct Escrow nodal gateway.`,
            };
          }
          return item;
        })
      );

      // Update lead
      if (record.leadId) {
        setLeadsData((prev) =>
          prev.map((l) => {
            if (l.leadId === record.leadId || (record.bookingId && l.bookingId === record.bookingId)) {
              return {
                ...l,
                settlementStatus: "Settled",
              };
            }
            return l;
          })
        );
      }

      setIsRetryingDirectly(null);
      const msg = `Instant Retry Success: Disbursed ₹${record.amountTransferredINR.toLocaleString("en-IN")} to ${record.partnerName} (Ref UTR: ${newUtr})`;
      if (onNotify) onNotify(msg);
    }, 850);
  };

  // Batch Retry All Failed Transactions
  const handleBatchRetryAllFailed = () => {
    const failedList = payoutHistory.filter((p) => p.status === "Failed");
    if (failedList.length === 0) return;

    setIsRetryingDirectly("ALL_FAILED");
    setTimeout(() => {
      const nowFormatted = `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString("en-IN", { hour12: false })} IST`;
      const batchId = `BATCH-RETRY-${Math.floor(1000 + Math.random() * 9000)}`;

      setPayoutHistory((prev) =>
        prev.map((item, idx) => {
          if (item.status === "Failed") {
            const newUtr = `UTR-HDFC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(2000 + idx * 31 + Math.random() * 700)}`;
            return {
              ...item,
              transactionId: newUtr,
              transactionDate: nowFormatted,
              transferMode: "Direct Escrow",
              status: "Reconciled",
              retryCount: (item.retryCount || 0) + 1,
              lastRetriedAt: nowFormatted,
              failureReason: undefined,
              failureCode: undefined,
              batchId,
              remarks: `Batch retry re-disbursal authorized via Escrow Nodal routing.`,
            };
          }
          return item;
        })
      );

      // Update leads
      const failedLeadIds = failedList.map((f) => f.leadId);
      setLeadsData((prev) =>
        prev.map((l) => {
          if (failedLeadIds.includes(l.leadId)) {
            return {
              ...l,
              settlementStatus: "Settled",
            };
          }
          return l;
        })
      );

      setIsRetryingDirectly(null);
      const totalAmount = failedList.reduce((sum, p) => sum + p.amountTransferredINR, 0);
      const msg = `Batch Retry Completed: ${failedList.length} failed payments (Total ₹${totalAmount.toLocaleString("en-IN")}) successfully re-authorized and cleared!`;
      if (onNotify) onNotify(msg);
    }, 1100);
  };

  // Helper to safely format CSV values according to RFC 4180
  const formatCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Helper to trigger UTF-8 CSV download
  const triggerCsvDownload = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.map(formatCsvCell).join(","),
      ...rows.map((row) => row.map(formatCsvCell).join(",")),
    ].join("\r\n");

    // Include UTF-8 BOM (\uFEFF) for seamless compatibility with Excel and Sheets
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Export Filtered Active Settlements Ledger CSV (with Status, Partner ID, & linked Payout History)
  const handleExportActiveSettlementsCSV = () => {
    const headers = [
      "Lead ID",
      "Booking ID",
      "Settlement Status",
      "Partner ID",
      "Partner Name",
      "Partner Category",
      "Customer Name",
      "Customer Destination",
      "Campaign Channel",
      "Booking GMV (INR)",
      "Commission Rate (%)",
      "Gross Platform Commission (INR)",
      "TDS Deducted Sec 194-O (INR)",
      "Net Partner Settlement (INR)",
      "Payout History Ref (UTR)",
      "Payout Transfer Mode",
      "Beneficiary Bank",
      "Payout Disbursal Date",
      "Lead Created Date",
    ];

    const rows = filteredLeads.map((l) => {
      // Find matching payout history record if settled
      const matchedPayout = payoutHistory.find(
        (p) => p.leadId === l.leadId || (l.bookingId && p.bookingId === l.bookingId)
      );

      const tds = Math.round(l.grossCommissionINR * 0.01);
      const utr = matchedPayout ? matchedPayout.transactionId : l.settlementStatus === "Settled" ? "UTR-DIRECT-ESCROW" : "Awaiting Disbursal";
      const transferMode = matchedPayout ? matchedPayout.transferMode : l.settlementStatus === "Settled" ? "Direct Escrow" : "Pending";
      const bank = matchedPayout ? matchedPayout.beneficiaryBank : "Primary Partner Bank A/C";
      const payoutDate = matchedPayout ? matchedPayout.transactionDate : l.settlementStatus === "Settled" ? l.createdAt : "Unsettled";

      return [
        l.leadId,
        l.bookingId || "N/A",
        l.settlementStatus,
        l.partnerId,
        l.partnerName,
        l.partnerCategory,
        l.customerName,
        l.customerDestination || "N/A",
        l.campaignSource || "Direct",
        l.bookingValueINR || 0,
        `${l.commissionPercent}%`,
        l.grossCommissionINR,
        tds,
        l.partnerSettlementAmountINR,
        utr,
        transferMode,
        bank,
        payoutDate,
        l.createdAt,
      ];
    });

    const dateStr = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(`partner_settlement_ledger_filtered_${dateStr}.csv`, headers, rows);

    if (onNotify) {
      onNotify(`Exported ${filteredLeads.length} filtered settlement record(s) to CSV!`);
    }
  };

  // 2. Export Filtered Payout History Auditing Log CSV (with Status, Partner ID, & Bank clearance logs)
  const handleExportPayoutHistoryCSV = () => {
    const headers = [
      "Transaction ID (UTR)",
      "Payout Status",
      "Partner ID",
      "Partner Name",
      "Category",
      "Booking ID / PNR",
      "Lead ID",
      "Beneficiary Bank",
      "Transfer Mode",
      "Booking GMV (INR)",
      "Commission Rate (%)",
      "Platform Fee Retained (INR)",
      "TDS Deduction Sec 194-O (INR)",
      "Amount Transferred (INR)",
      "Transaction Timestamp",
      "Failure Code",
      "Failure Diagnostics / Reason",
      "Retry Count",
      "Last Retried At",
      "Batch ID",
      "Remarks / Escrow Notes",
    ];

    const rows = filteredPayoutHistory.map((h) => [
      h.transactionId,
      h.status,
      h.partnerId,
      h.partnerName,
      h.partnerCategory,
      h.bookingId,
      h.leadId,
      h.beneficiaryBank,
      h.transferMode,
      h.bookingValueINR,
      `${h.commissionPercent || 10}%`,
      h.grossCommissionINR,
      h.tdsDeductionINR,
      h.amountTransferredINR,
      h.transactionDate,
      h.failureCode || "NONE",
      h.failureReason || (h.status === "Failed" ? "Bank switch timeout" : "Successfully cleared and acknowledged"),
      h.retryCount || 0,
      h.lastRetriedAt || "N/A",
      h.batchId || "N/A",
      h.remarks || "",
    ]);

    const dateStr = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(`partner_payout_history_audit_filtered_${dateStr}.csv`, headers, rows);

    if (onNotify) {
      onNotify(`Exported ${filteredPayoutHistory.length} filtered payout history record(s) to CSV!`);
    }
  };

  // 3. Export Comprehensive Consolidated Master Ledger (Settlements + Payouts)
  const handleExportComprehensiveMasterCSV = () => {
    const headers = [
      "Record Type",
      "Status",
      "Partner ID",
      "Partner Name",
      "Category",
      "Booking ID / PNR",
      "Lead ID / Ref",
      "Customer / Beneficiary",
      "Gross Booking GMV (INR)",
      "Commission Rate (%)",
      "Platform Retained Margin (INR)",
      "TDS Sec 194-O (INR)",
      "Net Transferred / Settlement (INR)",
      "Payout Transaction Ref (UTR)",
      "Transfer Mode",
      "Beneficiary Bank",
      "Timestamp / Created Date",
      "Notes / Diagnostics",
    ];

    // Map filtered leads
    const leadRows = filteredLeads.map((l) => {
      const matched = payoutHistory.find((p) => p.leadId === l.leadId);
      const tds = Math.round(l.grossCommissionINR * 0.01);
      return [
        "Settlement Lead",
        l.settlementStatus,
        l.partnerId,
        l.partnerName,
        l.partnerCategory,
        l.bookingId || "N/A",
        l.leadId,
        l.customerName,
        l.bookingValueINR || 0,
        `${l.commissionPercent}%`,
        l.grossCommissionINR,
        tds,
        l.partnerSettlementAmountINR,
        matched ? matched.transactionId : l.settlementStatus === "Settled" ? "UTR-DIRECT-ESCROW" : "Pending",
        matched ? matched.transferMode : "Nodal Route",
        matched ? matched.beneficiaryBank : "Partner Bank",
        l.createdAt,
        l.campaignSource ? `Channel: ${l.campaignSource}` : "Direct lead",
      ];
    });

    // Map filtered payout history
    const payoutRows = filteredPayoutHistory.map((h) => [
      "Disbursed Payout",
      h.status,
      h.partnerId,
      h.partnerName,
      h.partnerCategory,
      h.bookingId,
      h.leadId,
      h.partnerName,
      h.bookingValueINR,
      `${h.commissionPercent || 10}%`,
      h.grossCommissionINR,
      h.tdsDeductionINR,
      h.amountTransferredINR,
      h.transactionId,
      h.transferMode,
      h.beneficiaryBank,
      h.transactionDate,
      h.failureReason || h.remarks || "Reconciled via Escrow",
    ]);

    const dateStr = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(`partner_settlements_and_payouts_master_${dateStr}.csv`, headers, [...leadRows, ...payoutRows]);

    if (onNotify) {
      onNotify(`Exported master consolidated CSV with ${leadRows.length + payoutRows.length} total records!`);
    }
  };

  // Contextual single-click export based on active tab
  const handleExportContextualCSV = () => {
    if (activeTab === "payout_history") {
      handleExportPayoutHistoryCSV();
    } else {
      handleExportActiveSettlementsCSV();
    }
  };

  // 4. Export Single Transaction Record CSV for Detailed Reconciliation
  const handleExportSingleRecordCSV = (
    item: B2BAttributedLeadConversion | PayoutTransactionRecord | null,
    isLead: boolean
  ) => {
    if (!item) return;

    if (isLead) {
      const l = item as B2BAttributedLeadConversion;
      const matchedPayout = payoutHistory.find(
        (p) => p.leadId === l.leadId || (l.bookingId && p.bookingId === l.bookingId)
      );
      const tds = Math.round(l.grossCommissionINR * 0.01);
      const utr = matchedPayout ? matchedPayout.transactionId : l.settlementStatus === "Settled" ? "UTR-DIRECT-ESCROW" : "Awaiting Disbursal";
      const transferMode = matchedPayout ? matchedPayout.transferMode : l.settlementStatus === "Settled" ? "Direct Escrow" : "Pending";
      const bank = matchedPayout ? matchedPayout.beneficiaryBank : "Primary Partner Bank A/C";
      const payoutDate = matchedPayout ? matchedPayout.transactionDate : l.settlementStatus === "Settled" ? l.createdAt : "Unsettled";

      const headers = [
        "Lead ID",
        "Booking ID / PNR",
        "Settlement Status",
        "Partner ID",
        "Partner Name",
        "Partner Category",
        "Customer Name",
        "Customer Destination",
        "Pax Count",
        "Campaign Channel",
        "Campaign Name",
        "Telesales Agent",
        "Booking GMV (INR)",
        "Commission Rate (%)",
        "Gross Platform Commission (INR)",
        "Statutory TDS Sec 194-O (1%) (INR)",
        "Net Partner Settlement (INR)",
        "Payout Reference (UTR)",
        "Transfer Mode",
        "Beneficiary Bank",
        "Disbursal Date",
        "Lead Created Timestamp",
      ];

      const row = [
        l.leadId,
        l.bookingId || "N/A",
        l.settlementStatus,
        l.partnerId,
        l.partnerName,
        l.partnerCategory,
        l.customerName,
        l.customerDestination || "N/A",
        l.paxCount || 1,
        l.campaignSource || "Direct",
        l.campaignName || "General",
        l.telesalesExecutiveName || "Agent",
        l.bookingValueINR || 0,
        `${l.commissionPercent}%`,
        l.grossCommissionINR,
        tds,
        l.partnerSettlementAmountINR,
        utr,
        transferMode,
        bank,
        payoutDate,
        l.createdAt,
      ];

      triggerCsvDownload(`settlement_reconciliation_${l.bookingId || l.leadId}.csv`, headers, [row]);
    } else {
      const h = item as PayoutTransactionRecord;
      const headers = [
        "Transaction Reference (UTR)",
        "Payout Status",
        "Partner ID",
        "Partner Name",
        "Category",
        "Booking ID / PNR",
        "Lead ID",
        "Beneficiary Bank",
        "Transfer Mode",
        "Gross Booking GMV (INR)",
        "Commission Rate (%)",
        "Platform Commission (INR)",
        "TDS Sec 194-O (INR)",
        "Amount Transferred (INR)",
        "Transaction Date",
        "Failure Code",
        "Failure Diagnostics",
        "Retry Count",
        "Batch ID",
        "Audit Remarks",
      ];

      const row = [
        h.transactionId,
        h.status,
        h.partnerId,
        h.partnerName,
        h.partnerCategory,
        h.bookingId,
        h.leadId,
        h.beneficiaryBank,
        h.transferMode,
        h.bookingValueINR,
        `${h.commissionPercent || 10}%`,
        h.grossCommissionINR,
        h.tdsDeductionINR,
        h.amountTransferredINR,
        h.transactionDate,
        h.failureCode || "NONE",
        h.failureReason || (h.status === "Failed" ? "Bank switch timeout" : "Successfully settled"),
        h.retryCount || 0,
        h.batchId || "N/A",
        h.remarks || "",
      ];

      triggerCsvDownload(`payout_reconciliation_${h.transactionId}.csv`, headers, [row]);
    }

    if (onNotify) {
      onNotify(`Exported transaction reconciliation record to CSV!`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Automated Partner Settlement &amp; Commission Ledger
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              Live T+1 Bank Escrow Route
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
            <Building className="w-6 h-6 text-indigo-400" />
            Partner Settlement &amp; Commission Dashboard
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Real-time reconciliation of converted customer leads across all 8 travel categories, booking GMV values, category-tiered commission percentages, platform retainage, and instant disbursement triggers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Export to CSV Dropdown & Button */}
          <div className="relative" ref={exportDropdownRef}>
            <div className="inline-flex rounded-xl shadow-md border border-slate-700 bg-slate-800 hover:border-slate-600 transition-all overflow-hidden">
              <button
                onClick={handleExportContextualCSV}
                className="flex items-center gap-2 px-3.5 py-2 text-slate-200 hover:text-white hover:bg-slate-700 text-xs font-bold transition-colors"
                title="Download filtered CSV data for current table"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export to CSV</span>
              </button>
              <button
                onClick={() => setIsExportDropdownOpen((prev) => !prev)}
                className="px-2 py-2 border-l border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Select CSV export report format"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExportDropdownOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Export Format Dropdown Menu */}
            {isExportDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>CSV Export Options</span>
                  <span className="font-mono text-indigo-400 text-[9px]">RFC 4180 / Excel</span>
                </div>

                {/* Option 1: Current View */}
                <button
                  onClick={() => {
                    handleExportContextualCSV();
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-white">Current Filtered View</div>
                      <div className="text-[10px] text-slate-400">
                        {activeTab === "settlements"
                          ? `${filteredLeads.length} Active Settlement lead(s)`
                          : `${filteredPayoutHistory.length} Payout History record(s)`}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    Active
                  </span>
                </button>

                {/* Option 2: Active Settlements */}
                <button
                  onClick={() => {
                    handleExportActiveSettlementsCSV();
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-slate-200">Active Settlements Ledger</div>
                      <div className="text-[10px] text-slate-400">Status, Partner ID, Commissions &amp; Payouts</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {filteredLeads.length}
                  </span>
                </button>

                {/* Option 3: Payout History */}
                <button
                  onClick={() => {
                    handleExportPayoutHistoryCSV();
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-slate-200">Payout History Audit Log</div>
                      <div className="text-[10px] text-slate-400">UTR, Banks, Status, Diagnostics</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {filteredPayoutHistory.length}
                  </span>
                </button>

                {/* Option 4: Comprehensive Consolidated */}
                <button
                  onClick={() => {
                    handleExportComprehensiveMasterCSV();
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-950/40 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-between group transition-colors border-t border-slate-800 pt-2 mt-1"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-amber-200">Master Consolidated Ledger</div>
                      <div className="text-[10px] text-slate-400">Complete settlements &amp; payouts combined</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Master
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleBatchPayout}
            disabled={isBatchSettling || metrics.pendingCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg ${
              metrics.pendingCount === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black shadow-emerald-500/20"
            }`}
          >
            {isBatchSettling ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Escrow Batch...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Execute Batch Settlement ({metrics.pendingCount} Pending)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Converted Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{metrics.convertedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Attributed lead closures</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Total Converted GMV</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">
            ₹{metrics.totalGMV.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Gross booking value</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Platform Commission</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            ₹{metrics.totalGrossCommission.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-amber-500/80 mt-0.5">Avg Rate: {metrics.avgCommissionPercent}%</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Partner Settlement GMV</span>
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300 font-mono">
            ₹{metrics.totalPartnerSettlements.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disbursable to partners</div>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="text-[11px] font-bold">Pending Payouts</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">
            ₹{metrics.pendingAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-amber-400/70 mt-0.5">{metrics.pendingCount} Leads awaiting trigger</div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl bg-emerald-950/10">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-[11px] font-bold">Settled Payouts</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ₹{metrics.settledAmount.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-emerald-400/70 mt-0.5">{metrics.settledCount} Settled via Bank UTR</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("settlements")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === "settlements"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Active Settlements Ledger</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === "settlements"
                ? "bg-indigo-950 text-indigo-200 border border-indigo-400/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {metrics.pendingCount} Pending • ₹{metrics.pendingAmount.toLocaleString("en-IN")}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("payout_history")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
            activeTab === "payout_history"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Payout History (Auditing Log)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === "payout_history"
                ? "bg-emerald-950 text-emerald-200 border border-emerald-400/30"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {payoutHistory.length} Settled • ₹{historyMetrics.totalAmountTransferred.toLocaleString("en-IN")}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE SETTLEMENTS LEDGER                                         */}
      {/* ========================================================================= */}
      {activeTab === "settlements" && (
        <div className="space-y-6">
          {/* Category Commission Rate Matrix Badges */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Category-Based Commission Rates Reference Matrix</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Configured in dynamic commission engine</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {CATEGORY_COMMISSION_RATES.map((rate) => (
            <div
              key={rate.category}
              className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl hover:border-indigo-500/40 transition-colors"
            >
              <div className="text-[10px] font-bold text-slate-300 truncate" title={rate.category}>
                {rate.category}
              </div>
              <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                {rate.defaultCommissionPercent}%
              </div>
              <div className="text-[9px] text-slate-500">
                Range: {rate.minCommissionPercent}-{rate.maxCommissionPercent}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3.5">
        {/* Quick Multi-Select Status Toggle Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-400" />
              Settlement Status:
            </span>

            {/* All Statuses Toggle */}
            <button
              onClick={clearStatusFilters}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedStatuses.length === 0
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
              title="Show all settlement statuses"
            >
              All Statuses ({leadsData.length})
            </button>

            {/* Pending Payment Toggle */}
            <button
              onClick={() => toggleStatusFilter("Pending_Payment")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedStatuses.includes("Pending_Payment")
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
                  : "bg-slate-950 text-amber-300 hover:bg-amber-500/10 border border-amber-500/30"
              }`}
              title="Toggle Pending Payment filter"
            >
              <div className={`w-3 h-3 rounded flex items-center justify-center ${selectedStatuses.includes("Pending_Payment") ? "bg-slate-950 text-amber-400" : "border border-amber-400/60"}`}>
                {selectedStatuses.includes("Pending_Payment") ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Clock className="w-2 h-2" />}
              </div>
              <span>Pending Payment ({metrics.pendingCount})</span>
            </button>

            {/* Paid / Settled Toggle */}
            <button
              onClick={() => toggleStatusFilter("Settled")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedStatuses.includes("Settled")
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-300"
                  : "bg-slate-950 text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/30"
              }`}
              title="Toggle Paid / Settled filter"
            >
              <div className={`w-3 h-3 rounded flex items-center justify-center ${selectedStatuses.includes("Settled") ? "bg-slate-950 text-emerald-400" : "border border-emerald-400/60"}`}>
                {selectedStatuses.includes("Settled") ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <CheckCircle2 className="w-2 h-2" />}
              </div>
              <span>Paid / Settled ({metrics.settledCount})</span>
            </button>

            {/* Processing RTGS Toggle */}
            <button
              onClick={() => toggleStatusFilter("Processing")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedStatuses.includes("Processing")
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30 ring-1 ring-indigo-300"
                  : "bg-slate-950 text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/30"
              }`}
              title="Toggle Processing RTGS filter"
            >
              <div className={`w-3 h-3 rounded flex items-center justify-center ${selectedStatuses.includes("Processing") ? "bg-white text-indigo-600" : "border border-indigo-400/60"}`}>
                {selectedStatuses.includes("Processing") ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Zap className="w-2 h-2" />}
              </div>
              <span>Processing RTGS</span>
            </button>

            {/* Reversed / Refund Toggle */}
            <button
              onClick={() => toggleStatusFilter("Reversed_Refund")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedStatuses.includes("Reversed_Refund")
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-1 ring-rose-300"
                  : "bg-slate-950 text-rose-300 hover:bg-rose-500/10 border border-rose-500/30"
              }`}
              title="Toggle Reversed / Refund filter"
            >
              <div className={`w-3 h-3 rounded flex items-center justify-center ${selectedStatuses.includes("Reversed_Refund") ? "bg-white text-rose-600" : "border border-rose-400/60"}`}>
                {selectedStatuses.includes("Reversed_Refund") ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <AlertCircle className="w-2 h-2" />}
              </div>
              <span>Refunded</span>
            </button>
          </div>

          {/* Quick Clear for Multi-Select Filters */}
          {(selectedPartnerIds.length > 0 || selectedStatuses.length > 0) && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold">
                Active Multi-Filters: <strong className="text-amber-300">{selectedPartnerIds.length} Partners</strong> • <strong className="text-emerald-300">{selectedStatuses.length === 0 ? "All Statuses" : `${selectedStatuses.length} Statuses`}</strong>
              </span>
              <button
                onClick={() => {
                  setSelectedPartnerIds([]);
                  setSelectedStatuses([]);
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold underline transition-colors"
              >
                Clear All Multi-Filters
              </button>
            </div>
          )}
        </div>

        {/* Selected Partner ID Badges Row */}
        {selectedPartnerIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center flex-wrap gap-2">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1 mr-1">
              <Building className="w-3 h-3 text-indigo-400" />
              Targeted Partners ({selectedPartnerIds.length}):
            </span>
            {selectedPartnerIds.map((partnerId) => {
              const partner = partnerList.find((p) => p.id === partnerId);
              return (
                <span
                  key={partnerId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-white text-xs font-semibold shadow-sm"
                >
                  <span className="font-mono text-amber-300 font-bold">{partnerId}</span>
                  <span className="text-slate-300 text-[11px]">({partner?.name || "Partner"})</span>
                  <button
                    onClick={() => removePartnerIdFilter(partnerId)}
                    className="p-0.5 rounded-full hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-0.5"
                    title={`Remove ${partnerId} from filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            <button
              onClick={clearPartnerFilters}
              className="text-[10px] text-slate-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded border border-slate-800 hover:border-rose-500/40 transition-colors ml-auto"
            >
              Deselect All Partners
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner ID, customer, booking PNR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Multi-Select Filters Grid */}
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
            {/* Multi-Select Partner ID Dropdown Popover */}
            <div className="relative" ref={partnerDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsPartnerDropdownOpen((prev) => !prev);
                  setIsStatusDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedPartnerIds.length > 0
                    ? "bg-indigo-950/80 border-indigo-500/50 text-indigo-200 shadow-md shadow-indigo-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
                title="Select one or multiple Partner IDs for targeted auditing"
              >
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {selectedPartnerIds.length === 0
                    ? `All Partners (${partnerList.length})`
                    : selectedPartnerIds.length === 1
                    ? `1 Partner: ${selectedPartnerIds[0]}`
                    : `Partners (${selectedPartnerIds.length} Selected)`}
                </span>
                {selectedPartnerIds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-mono">
                    {selectedPartnerIds.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPartnerDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Partner Dropdown Popover */}
              {isPartnerDropdownOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Select Partner IDs</span>
                      <span className="text-[10px] font-mono text-slate-400">({selectedPartnerIds.length}/{partnerList.length})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={selectAllPartners}
                        className="text-[10px] text-indigo-300 hover:text-white font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearPartnerFilters}
                        className="text-[10px] text-slate-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Search inside partner dropdown */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter by ID, name or category..."
                      value={partnerSearchTerm}
                      onChange={(e) => setPartnerSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {partnerSearchTerm && (
                      <button
                        onClick={() => setPartnerSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Partner List with checkboxes */}
                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {partnerList
                      .filter(
                        (p) =>
                          partnerSearchTerm === "" ||
                          p.id.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                          p.name.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(partnerSearchTerm.toLowerCase())
                      )
                      .map((p) => {
                        const isChecked = selectedPartnerIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePartnerIdFilter(p.id)}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors border ${
                              isChecked
                                ? "bg-indigo-950/70 border-indigo-500/40 text-white"
                                : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? "bg-indigo-600 text-white"
                                    : "border border-slate-700 bg-slate-900"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-amber-300">{p.id}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 truncate">
                                    {p.category}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-200 truncate font-semibold">{p.name}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono shrink-0 ml-2">
                              {p.pendingCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {p.pendingCount} pend
                                </span>
                              )}
                              {p.settledCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {p.settledCount} paid
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {selectedPartnerIds.length === 0 ? "Showing all partners" : `${selectedPartnerIds.length} partners active`}
                    </span>
                    <button
                      onClick={() => setIsPartnerDropdownOpen(false)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Select Settlement Status Dropdown Popover */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsStatusDropdownOpen((prev) => !prev);
                  setIsPartnerDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedStatuses.length > 0
                    ? "bg-slate-900 border-amber-500/40 text-amber-200 shadow-md shadow-amber-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
                title="Select multiple Settlement Statuses"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {selectedStatuses.length === 0
                    ? "All Statuses (4)"
                    : `Status (${selectedStatuses.length} Selected)`}
                </span>
                {selectedStatuses.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-mono font-black">
                    {selectedStatuses.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Status Dropdown Popover */}
              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Settlement Statuses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={clearStatusFilters}
                        className="text-[10px] text-indigo-300 hover:text-white font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors"
                      >
                        All (Reset)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {SETTLEMENT_STATUS_OPTIONS.map((opt) => {
                      const isChecked = selectedStatuses.includes(opt.id);
                      let count = 0;
                      if (opt.id === "Pending_Payment") count = metrics.pendingCount;
                      else if (opt.id === "Settled") count = metrics.settledCount;
                      else count = leadsData.filter((l) => l.settlementStatus === opt.id).length;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleStatusFilter(opt.id)}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors border ${
                            isChecked
                              ? `${opt.bgClass} ${opt.borderClass} ${opt.textClass}`
                              : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                isChecked
                                  ? opt.activeBgClass
                                  : "border border-slate-700 bg-slate-900"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-bold">{opt.label}</span>
                          </div>
                          <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-950/60">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shortcuts */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => selectOnlyStatus("Pending_Payment")}
                      className="text-[10px] font-bold text-amber-300 hover:underline"
                    >
                      Only Pending
                    </button>
                    <button
                      onClick={() => selectOnlyStatus("Settled")}
                      className="text-[10px] font-bold text-emerald-300 hover:underline"
                    >
                      Only Settled
                    </button>
                    <button
                      onClick={() => setIsStatusDropdownOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors ml-auto"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Channel Dropdown */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Channels</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Instagram Reel">Instagram Reel</option>
              <option value="Organic SEO">Organic SEO</option>
              <option value="WhatsApp Inbound">WhatsApp Inbound</option>
              <option value="Landing Page">Landing Page</option>
            </select>

            {/* Date Range Filter Dropdown Popover */}
            <div className="relative" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDateDropdownOpen((prev) => !prev);
                  setIsPartnerDropdownOpen(false);
                  setIsStatusDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedDatePreset !== "ALL" || customStartDate !== "" || customEndDate !== ""
                    ? "bg-indigo-950/80 border-indigo-500/50 text-indigo-200 shadow-md shadow-indigo-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
                title="Filter settlements by specific date range"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {selectedDatePreset === "ALL" && !customStartDate && !customEndDate
                    ? "All Dates"
                    : selectedDatePreset === "CUSTOM"
                    ? (customStartDate || customEndDate ? `${customStartDate || "Start"} → ${customEndDate || "End"}` : "Custom Range")
                    : DATE_PRESET_OPTIONS.find((p) => p.id === selectedDatePreset)?.shortLabel || "Date Filter"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Date Range Popover */}
              {isDateDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Date Range Filter</span>
                    </div>
                    {(selectedDatePreset !== "ALL" || customStartDate !== "" || customEndDate !== "") && (
                      <button
                        onClick={handleClearDateFilter}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        Reset Date
                      </button>
                    )}
                  </div>

                  {/* Date Field Target Toggle */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Filter Leads By Date Field:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setDateFilterField("createdAt")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          dateFilterField === "createdAt"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Booking / Created
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateFilterField("travelDate")}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          dateFilterField === "travelDate"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Travel Departure
                      </button>
                    </div>
                  </div>

                  {/* Preset Options Grid */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Time Presets:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DATE_PRESET_OPTIONS.map((opt) => {
                        const isSelected = selectedDatePreset === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectDatePreset(opt.id)}
                            className={`flex flex-col items-start px-2.5 py-2 rounded-xl text-left border transition-all ${
                              isSelected
                                ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                                : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                            }`}
                          >
                            <span className="text-xs font-bold flex items-center justify-between w-full">
                              <span>{opt.shortLabel}</span>
                              {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                            </span>
                            {opt.subLabel && (
                              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                {opt.subLabel}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Date Range Picker Inputs */}
                  {selectedDatePreset === "CUSTOM" && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/30 space-y-2">
                      <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        Specify Start &amp; End Dates (YYYY-MM-DD)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold mb-1 block">From Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold mb-1 block">To Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active summary & done button */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-indigo-300 font-mono">
                      {activeDateBounds.label !== "All Time" ? `Active: ${activeDateBounds.label}` : "All time window"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDateDropdownOpen(false)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleExportActiveSettlementsCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 shadow-sm"
              title="Download filtered active settlements ledger as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export to CSV</span>
            </button>

            {(selectedCategory !== "ALL" ||
              selectedPartnerIds.length > 0 ||
              selectedStatuses.length > 0 ||
              selectedChannel !== "ALL" ||
              selectedDatePreset !== "ALL" ||
              customStartDate !== "" ||
              customEndDate !== "" ||
              searchQuery !== "") && (
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedPartnerIds([]);
                  setSelectedStatuses([]);
                  setSelectedChannel("ALL");
                  handleClearDateFilter();
                  setSearchQuery("");
                }}
                className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors"
                title="Reset all active filters"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {(selectedDatePreset !== "ALL" || customStartDate !== "" || customEndDate !== "" || selectedChannel !== "ALL" || selectedCategory !== "ALL") && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Active Criteria:</span>
            
            {/* Date Range Chip */}
            {(selectedDatePreset !== "ALL" || customStartDate !== "" || customEndDate !== "") && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 text-xs font-semibold">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>
                  {dateFilterField === "travelDate" ? "Travel Date" : "Booking Date"}: <strong className="text-white">{activeDateBounds.label}</strong>
                </span>
                <button
                  onClick={handleClearDateFilter}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                  title="Remove date filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Channel Chip */}
            {selectedChannel !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span>Channel: <strong>{selectedChannel}</strong></span>
                <button
                  onClick={() => setSelectedChannel("ALL")}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Chip */}
            {selectedCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span>Category: <strong>{selectedCategory}</strong></span>
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Targeted Multi-Partner Audit & Reconciliation Panel */}
      {selectedPartnerAudit && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Building className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="text-base font-black text-white">
                    {selectedPartnerAudit.isSingle
                      ? selectedPartnerAudit.singlePartnerName
                      : `Targeted Multi-Partner Financial Audit (${selectedPartnerAudit.count} Partners)`}
                  </h3>
                  {selectedPartnerAudit.isSingle ? (
                    <>
                      <span className="font-mono text-xs text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                        {selectedPartnerAudit.singlePartnerId}
                      </span>
                      <span className="text-[10px] text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md font-semibold">
                        {selectedPartnerAudit.singlePartnerCategory}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-xs text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-md font-bold">
                      {selectedPartnerAudit.count} Selected Partners Cohort
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedPartnerAudit.isSingle
                    ? "Single Partner Financial Audit & Escrow Reconciliation Summary"
                    : `Multi-Partner Cross-Audit & Combined Escrow Disbursal Summary for: ${selectedPartnerAudit.partnerIds.join(", ")}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedPartnerAudit.totalPending > 0 && (
                <button
                  onClick={() => {
                    const pendingIds = leadsData
                      .filter(
                        (l) =>
                          selectedPartnerAudit.partnerIds.includes(l.partnerId) &&
                          l.settlementStatus === "Pending_Payment"
                      )
                      .map((l) => l.leadId);
                    setLeadsData((prev) =>
                      prev.map((item) => {
                        if (pendingIds.includes(item.leadId)) {
                          return { ...item, settlementStatus: "Settled" };
                        }
                        return item;
                      })
                    );
                    if (onNotify) {
                      onNotify(
                        `Disbursed outstanding ₹${selectedPartnerAudit.totalPending.toLocaleString(
                          "en-IN"
                        )} across ${selectedPartnerAudit.count} partner(s) (${selectedPartnerAudit.partnerIds.join(", ")})!`
                      );
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Settle All Pending (₹{selectedPartnerAudit.totalPending.toLocaleString("en-IN")})</span>
                </button>
              )}
              <button
                onClick={handleExportActiveSettlementsCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
                title="Export this partner's settlement transactions to CSV"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={clearPartnerFilters}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Exit Partner Audit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Total Bookings</span>
              <span className="text-base font-black text-white font-mono">{selectedPartnerAudit.totalBookings}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Gross Converted GMV</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                ₹{selectedPartnerAudit.totalGMV.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Platform Commission Retained</span>
              <span className="text-base font-black text-amber-400 font-mono">
                ₹{selectedPartnerAudit.totalCommission.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-emerald-500/20 p-3 rounded-2xl bg-emerald-950/20">
              <span className="text-[10px] text-emerald-400 block font-semibold">Paid / Reconciled</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                ₹{selectedPartnerAudit.totalPaid.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/20 p-3 rounded-2xl bg-amber-950/20">
              <span className="text-[10px] text-amber-400 block font-semibold">Pending Escrow Payout</span>
              <span className="text-base font-black text-amber-300 font-mono">
                ₹{selectedPartnerAudit.totalPending.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Live Filtered Summary Card */}
      <div
        id="settlement-filtered-summary-card"
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          filteredLeadsSummary.isFiltered
            ? "bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/40 shadow-xl shadow-indigo-950/20"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl border ${
                filteredLeadsSummary.isFiltered
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Calculator className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {filteredLeadsSummary.isFiltered ? "Filtered Settlement View Summary" : "Live Settlement Table Summary"}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${
                    filteredLeadsSummary.isFiltered
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {filteredLeadsSummary.count} of {leadsData.length} Records Visible
                </span>
                {filteredLeadsSummary.isFiltered && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/25">
                    Filters Applied
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated totals and status breakdown for all currently filtered records in the ledger
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {filteredLeadsSummary.pendingCount > 0 && (
              <button
                onClick={handleBatchFilteredPayout}
                disabled={isBatchSettling}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 disabled:opacity-50"
                title={`Disburse ${filteredLeadsSummary.pendingCount} pending payout(s) in the current filtered view`}
              >
                {isBatchSettling ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>
                  Settle Filtered Pending (₹{filteredLeadsSummary.pendingAmount.toLocaleString("en-IN")})
                </span>
              </button>
            )}
            <button
              onClick={handleExportActiveSettlementsCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Download filtered active settlements ledger as CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export CSV</span>
            </button>
            {filteredLeadsSummary.isFiltered && (
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedPartnerIds([]);
                  setSelectedStatuses([]);
                  setSelectedChannel("ALL");
                  handleClearDateFilter();
                  setSearchQuery("");
                }}
                className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors"
                title="Reset all active filters"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Primary Metric Highlights Grid for Filtered View */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          {/* Total Settlement Amount (Highlighted Main Metric) */}
          <div className="bg-slate-950/90 border border-emerald-500/40 p-3.5 rounded-2xl bg-emerald-950/20 shadow-md">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
              Total Visible Settlement
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono block mt-0.5">
              ₹{filteredLeadsSummary.totalSettlementAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5 block truncate">
              Net payable to partners
            </span>
          </div>

          {/* Visible Transactions Count */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Transactions Visible
            </span>
            <span className="text-lg sm:text-xl font-black text-white font-mono block mt-0.5">
              {filteredLeadsSummary.count}{" "}
              <span className="text-xs text-slate-400 font-normal">
                ({leadsData.length > 0 ? ((filteredLeadsSummary.count / leadsData.length) * 100).toFixed(0) : 0}%)
              </span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              {filteredLeadsSummary.uniquePartnersCount} partner(s) • {filteredLeadsSummary.uniqueTravelersCount} pax
            </span>
          </div>

          {/* Total Converted GMV */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
              Visible Gross GMV
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono block mt-0.5">
              ₹{filteredLeadsSummary.totalGMV.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              Gross booking turnover
            </span>
          </div>

          {/* Platform Retained Commission */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
              Retained Margin
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono block mt-0.5">
              ₹{filteredLeadsSummary.totalCommission.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-amber-500/80 mt-0.5 block truncate">
              Avg rate: {filteredLeadsSummary.avgCommissionPercent}%
            </span>
          </div>

          {/* Visible Pending Escrow */}
          <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-2xl bg-amber-950/20">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
              Pending Escrow
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-mono block mt-0.5">
              ₹{filteredLeadsSummary.pendingAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-amber-400/80 mt-0.5 block truncate">
              {filteredLeadsSummary.pendingCount} lead(s) awaiting payout
            </span>
          </div>

          {/* Visible Settled / Paid */}
          <div className="bg-slate-950/80 border border-emerald-500/30 p-3.5 rounded-2xl bg-emerald-950/15">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
              Cleared / Settled
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block mt-0.5">
              ₹{filteredLeadsSummary.settledAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-400/70 mt-0.5 block truncate">
              {filteredLeadsSummary.settledCount} lead(s) reconciled
            </span>
          </div>
        </div>
      </div>

      {/* Key Settlement Metrics Summary Row (Total Processed, Total Pending, Total Failed) */}
      <div id="settlement-summary-metrics-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Processed Amount */}
        <div className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/50 p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-sm shadow-emerald-950/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              <span>Reconciled &amp; Paid</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Processed Amount
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
              ₹{(filteredLeadsSummary.isFiltered ? filteredLeadsSummary.settledAmount : metrics.settledAmount).toLocaleString("en-IN")}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 flex-wrap gap-1">
              <span className="text-slate-400 font-medium">
                <strong className="text-emerald-300 font-bold">
                  {filteredLeadsSummary.isFiltered ? filteredLeadsSummary.settledCount : metrics.settledCount}
                </strong>{" "}
                reconciled booking(s)
              </span>
              <button
                onClick={() => {
                  if (selectedStatuses.includes("Settled") && selectedStatuses.length === 1) {
                    setSelectedStatuses([]);
                  } else {
                    setSelectedStatuses(["Settled"]);
                  }
                }}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                title="Filter table to show only settled records"
              >
                <span>{selectedStatuses.includes("Settled") && selectedStatuses.length === 1 ? "Showing Settled" : "Filter Settled"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Total Settlement Pending */}
        <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-amber-950/20 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-sm shadow-amber-950/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></span>
              <span>Pending Escrow</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Settlement Pending
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">
              ₹{(filteredLeadsSummary.isFiltered ? filteredLeadsSummary.pendingAmount : metrics.pendingAmount).toLocaleString("en-IN")}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 flex-wrap gap-1">
              <span className="text-slate-400 font-medium">
                <strong className="text-amber-300 font-bold">
                  {filteredLeadsSummary.isFiltered ? filteredLeadsSummary.pendingCount : metrics.pendingCount}
                </strong>{" "}
                lead(s) awaiting disbursal
              </span>
              <button
                onClick={() => {
                  if (selectedStatuses.includes("Pending_Payment") && selectedStatuses.length === 1) {
                    setSelectedStatuses([]);
                  } else {
                    setSelectedStatuses(["Pending_Payment"]);
                  }
                }}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                title="Filter table to show only pending records"
              >
                <span>{selectedStatuses.includes("Pending_Payment") && selectedStatuses.length === 1 ? "Showing Pending" : "Filter Pending"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Total Failed Transactions */}
        <div className="bg-slate-900/90 border border-rose-500/30 hover:border-rose-500/50 p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-rose-950/20 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/40 text-[11px] font-bold shadow-sm shadow-rose-950/60">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              <span>{historyMetrics.failedCount > 0 ? "Requires Attention" : "All Clear"}</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Failed Transactions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono mt-1 flex items-baseline gap-2">
              <span>{historyMetrics.failedCount}</span>
              <span className="text-sm font-bold text-rose-300/80 font-mono">
                (₹{historyMetrics.failedAmountINR.toLocaleString("en-IN")})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2.5 border-t border-slate-800/80 flex-wrap gap-1">
              <span className="text-slate-400 font-medium">
                {historyMetrics.failedCount > 0 ? (
                  <span className="text-rose-300">Bank switch timeout / rejected</span>
                ) : (
                  <span className="text-slate-500">0 gateway disbursal errors</span>
                )}
              </span>
              <button
                onClick={() => {
                  setActiveTab("payout_history");
                  setHistoryStatusFilter("FAILED");
                }}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                title="Navigate to Payout History and filter by Failed Transactions"
              >
                <span>Audit &amp; Retry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Converted Leads & Settlement Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-white text-xs">Converted Leads Settlement Ledger</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              Showing {filteredLeads.length} of {leadsData.length} records
            </span>
            {/* Active Sort Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/70 text-[11px] text-slate-300">
              <span className="text-slate-400">Sort:</span>
              <button
                onClick={() => handleToggleSettlementSort(settlementSortField)}
                className="font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors"
                title={`Sorted by ${settlementSortField} (${settlementSortDirection.toUpperCase()}). Click to toggle.`}
              >
                <span>
                  {settlementSortField === "createdAt"
                    ? "Date"
                    : settlementSortField === "bookingValueINR"
                    ? "Booking Value"
                    : settlementSortField === "partnerSettlementAmountINR"
                    ? "Partner Settlement"
                    : settlementSortField === "grossCommissionINR"
                    ? "Commission Amount"
                    : settlementSortField === "commissionPercent"
                    ? "Commission %"
                    : settlementSortField === "settlementStatus"
                    ? "Payout Status"
                    : settlementSortField === "partnerName"
                    ? "Partner"
                    : settlementSortField === "customerName"
                    ? "Customer"
                    : settlementSortField === "partnerCategory"
                    ? "Category"
                    : "Booking ID"}
                </span>
                {settlementSortDirection === "asc" ? (
                  <ArrowUp className="w-3 h-3 text-indigo-400" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-indigo-400" />
                )}
              </button>
              {settlementSortField !== "createdAt" && (
                <button
                  onClick={handleResetSettlementSort}
                  className="ml-1 text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-0.5 px-1 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  title="Reset sorting to Date (Newest first)"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportActiveSettlementsCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export to CSV</span>
            </button>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Click on <strong className="text-slate-200">"Trigger Payout"</strong> to execute instant partner bank transfer
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-[10px] uppercase font-black tracking-wider border-b border-slate-800 select-none">
              <tr>
                {/* Booking ID & Date (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("createdAt")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    settlementSortField === "createdAt" || settlementSortField === "bookingId"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort transactions by Date / Booking ID"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Booking ID &amp; Date</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "createdAt" || settlementSortField === "bookingId" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Customer & Trip (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("customerName")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    settlementSortField === "customerName"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Customer Name"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer &amp; Trip</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "customerName" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Partner Name & ID (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("partnerName")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    settlementSortField === "partnerName"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Partner Name"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Partner Name &amp; ID</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "partnerName" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Category (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("partnerCategory")}
                  className={`py-3.5 px-4 text-center cursor-pointer transition-colors group/th ${
                    settlementSortField === "partnerCategory"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Category"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Category</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "partnerCategory" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Booking Value Amount (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("bookingValueINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    settlementSortField === "bookingValueINR"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Booking Value Amount"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Booking Value</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "bookingValueINR" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Commission Percentage (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("commissionPercent")}
                  className={`py-3.5 px-4 text-center cursor-pointer transition-colors group/th ${
                    settlementSortField === "commissionPercent"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Commission Rate %"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Commission %</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "commissionPercent" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Commission Amount (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("grossCommissionINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    settlementSortField === "grossCommissionINR"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Commission Amount"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Commission Amount</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "grossCommissionINR" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Partner Settlement Amount (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("partnerSettlementAmountINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    settlementSortField === "partnerSettlementAmountINR"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Net Partner Settlement Amount"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Partner Settlement</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "partnerSettlementAmountINR" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Status (Sortable) */}
                <th
                  onClick={() => handleToggleSettlementSort("settlementStatus")}
                  className={`py-3.5 px-4 text-center cursor-pointer transition-colors group/th ${
                    settlementSortField === "settlementStatus"
                      ? "text-indigo-300 bg-indigo-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Payout / Settlement Status"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Status</span>
                    <span className="p-0.5 rounded transition-all">
                      {settlementSortField === "settlementStatus" ? (
                        settlementSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    No converted leads matching the active filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((item) => {
                  const isSettled = item.settlementStatus === "Settled";
                  const isPending = item.settlementStatus === "Pending_Payment";
                  const isRefund = item.settlementStatus === "Reversed_Refund";
                  const isProcessing = item.settlementStatus === "Processing" || settlingLeadId === item.leadId;

                  const isSelectedInDrawer =
                    selectedDetailItem && "leadId" in selectedDetailItem && selectedDetailItem.leadId === item.leadId;

                  return (
                    <tr
                      key={item.leadId}
                      onClick={() => handleOpenGranularDetail(item, "lead")}
                      className={`transition-all group cursor-pointer ${
                        isSelectedInDrawer
                          ? "bg-indigo-950/60 border-l-4 border-l-indigo-400"
                          : "hover:bg-slate-900/80"
                      }`}
                      title="Click row to inspect granular transaction breakdown & settlement metadata"
                    >
                      {/* Booking ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                          <span>{item.bookingId || item.leadId}</span>
                          <ChevronRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.leadId}
                          </span>
                          <span className="text-[9px] text-slate-500">• {item.createdAt}</span>
                        </div>
                      </td>

                      {/* Customer & Trip */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{item.customerName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{item.customerDestination}</span>
                          <span>•</span>
                          <span>{item.paxCount} Pax</span>
                        </div>
                      </td>

                      {/* Partner Name & Clickable ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.partnerName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePartnerIdFilter(item.partnerId);
                            }}
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                              selectedPartnerIds.includes(item.partnerId)
                                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                                : "text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/25"
                            }`}
                            title={`Toggle Multi-Select Filter for Partner: ${item.partnerId}`}
                          >
                            <span>{item.partnerId}</span>
                            {selectedPartnerIds.includes(item.partnerId) ? (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ) : (
                              <Filter className="w-2.5 h-2.5 opacity-60" />
                            )}
                          </button>
                          <span className="text-[10px] text-slate-500 truncate max-w-[100px]" title={item.campaignSource}>
                            {item.campaignSource}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 text-[11px] font-bold border border-indigo-500/25 inline-block">
                          {item.partnerCategory}
                        </span>
                      </td>

                      {/* Booking Value */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                        {item.bookingValueINR ? (
                          `₹${item.bookingValueINR.toLocaleString("en-IN")}`
                        ) : (
                          <span className="text-slate-500 font-normal">₹{item.budgetEstimateINR.toLocaleString("en-IN")} (Est)</span>
                        )}
                      </td>

                      {/* Commission Percentage */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-black text-xs">
                          {item.commissionPercent}%
                        </div>
                      </td>

                      {/* Commission Amount */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-amber-400 text-sm">
                          ₹{item.grossCommissionINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Fee Retained
                        </div>
                      </td>

                      {/* Net Partner Settlement */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-black text-emerald-400 text-sm">
                          ₹{item.partnerSettlementAmountINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] text-slate-500">Net after {item.commissionPercent}% fee</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isSettled && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-sm shadow-emerald-950/60 whitespace-nowrap"
                            title="Settlement processed and reconciled in partner bank account"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Settled</span>
                          </span>
                        )}
                        {isPending && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-sm shadow-amber-950/60 whitespace-nowrap"
                            title="Pending escrow disbursal trigger approval"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></span>
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Pending</span>
                          </span>
                        )}
                        {isProcessing && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold shadow-sm shadow-indigo-950/60 whitespace-nowrap"
                            title="RTGS gateway transmission in flight"
                          >
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
                            <span>Processing RTGS</span>
                          </span>
                        )}
                        {isRefund && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-bold shadow-sm shadow-rose-950/60 whitespace-nowrap"
                            title="Booking cancelled / transaction reversed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400"></span>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Refunded</span>
                          </span>
                        )}
                      </td>

                      {/* Action Trigger Button */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerPayout(item.leadId);
                            }}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5 ml-auto"
                          >
                            <Send className="w-3 h-3" />
                            <span>Trigger Payout</span>
                          </button>
                        ) : isSettled ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceiptLead(item);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto border border-slate-700"
                            title="View Bank UTR & GST Settlement Advice"
                          >
                            <Receipt className="w-3 h-3 text-emerald-400" />
                            <span>View Advice</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredLeads.length > 0 && (
              <tfoot className="bg-slate-900/95 border-t-2 border-slate-700 text-xs font-bold text-slate-200">
                <tr>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-white font-mono">
                      <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Total Filtered:</span>
                      <span className="text-indigo-300">({filteredLeadsSummary.count})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-medium text-[11px]">
                    {filteredLeadsSummary.uniqueTravelersCount} Travelers
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-medium text-[11px]">
                    {filteredLeadsSummary.uniquePartnersCount} Partners
                  </td>
                  <td className="py-4 px-4 text-center text-slate-500 font-mono">
                    —
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-black text-cyan-300 text-sm">
                    ₹{filteredLeadsSummary.totalGMV.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-amber-400 text-xs">
                    Avg {filteredLeadsSummary.avgCommissionPercent}%
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                    ₹{filteredLeadsSummary.totalCommission.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                    ₹{filteredLeadsSummary.totalSettlementAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] text-slate-300 font-medium block">
                      {filteredLeadsSummary.settledCount} Paid • {filteredLeadsSummary.pendingCount} Pending
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {filteredLeadsSummary.pendingCount > 0 && (
                      <button
                        onClick={handleBatchFilteredPayout}
                        disabled={isBatchSettling}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[10px] transition-all shadow ml-auto flex items-center gap-1 disabled:opacity-50"
                        title="Settle all visible pending items"
                      >
                        <Zap className="w-2.5 h-2.5" />
                        <span>Settle ({filteredLeadsSummary.pendingCount})</span>
                      </button>
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* TAB 2: PAYOUT HISTORY (AUDITING LOG)                                      */}
  {/* ========================================================================= */}
  {activeTab === "payout_history" && (
    <div className="space-y-6">
      {/* Payout History Auditing Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Historical Transfers</span>
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {historyMetrics.totalTransactions} Total
          </div>
          <div className="text-[10px] text-emerald-400/90 mt-0.5 font-semibold">
            {historyMetrics.reconciledCount} Cleared / Reconciled
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-[11px] font-bold">Cleared Volume</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ₹{historyMetrics.totalAmountTransferred.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">Net escrow funds credited</div>
        </div>

        {/* Failed Disbursals Metric Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          historyMetrics.failedCount > 0
            ? "bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40"
            : "bg-slate-900/90 border-slate-800"
        }`}>
          <div className="flex items-center justify-between text-rose-300 mb-1">
            <span className="text-[11px] font-bold flex items-center gap-1.5">
              {historyMetrics.failedCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
              Failed Payouts
            </span>
            <AlertTriangle className={`w-4 h-4 ${historyMetrics.failedCount > 0 ? "text-rose-400" : "text-slate-500"}`} />
          </div>
          <div className="text-xl font-black font-mono text-rose-400">
            {historyMetrics.failedCount} Failed
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-rose-300/80 font-mono">
              ₹{historyMetrics.failedAmountINR.toLocaleString("en-IN")}
            </span>
            {historyMetrics.failedCount > 0 && (
              <button
                onClick={() => setHistoryStatusFilter(historyStatusFilter === "FAILED" ? "ALL" : "FAILED")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                  historyStatusFilter === "FAILED"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                }`}
              >
                {historyStatusFilter === "FAILED" ? "Showing Failed" : "View Failed"}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Gross GMV Reconciled</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-300 font-mono">
            ₹{historyMetrics.totalGrossGMV.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Booking turnover cleared</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Platform Fee Retained</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            ₹{historyMetrics.totalCommissionRetained.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Retained platform margins</div>
        </div>
      </div>

      {/* History Auditing Controls & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search by UTR, Partner, Error Reason */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by UTR, Partner ID, Failure code/reason..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
            {/* Status Filter (All / Reconciled / Failed) */}
            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value as "ALL" | "RECONCILED" | "FAILED")}
              className={`text-xs font-bold rounded-xl px-3 py-2 border transition-all focus:outline-none ${
                historyStatusFilter === "FAILED"
                  ? "bg-rose-950/80 border-rose-500 text-rose-200 shadow-sm shadow-rose-900/40"
                  : historyStatusFilter === "RECONCILED"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                  : "bg-slate-950 border-slate-800 text-slate-300"
              }`}
            >
              <option value="ALL">All Statuses ({payoutHistory.length})</option>
              <option value="RECONCILED">Cleared / Reconciled ({historyMetrics.reconciledCount})</option>
              <option value="FAILED">Failed / Action Required ({historyMetrics.failedCount})</option>
            </select>

            {/* Multi-Select Partner Filter for Payout History */}
            <div className="relative" ref={historyPartnerDropdownRef}>
              <button
                type="button"
                onClick={() => setIsHistoryPartnerDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  historySelectedPartnerIds.length > 0
                    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
                title="Select multiple Partner IDs for historical auditing"
              >
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {historySelectedPartnerIds.length === 0
                    ? `All Partners (${partnerList.length})`
                    : historySelectedPartnerIds.length === 1
                    ? `1 Partner: ${historySelectedPartnerIds[0]}`
                    : `Partners (${historySelectedPartnerIds.length} Selected)`}
                </span>
                {historySelectedPartnerIds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] flex items-center justify-center font-mono font-black">
                    {historySelectedPartnerIds.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isHistoryPartnerDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* History Partner Dropdown Popover */}
              {isHistoryPartnerDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Filter Payout History by Partner</span>
                    </div>
                    <button
                      onClick={clearHistoryPartnerFilters}
                      className="text-[10px] text-slate-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Search inside history partner dropdown */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search partner ID or name..."
                      value={historyPartnerSearchTerm}
                      onChange={(e) => setHistoryPartnerSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    {historyPartnerSearchTerm && (
                      <button
                        onClick={() => setHistoryPartnerSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Partner List with checkboxes */}
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {partnerList
                      .filter(
                        (p) =>
                          historyPartnerSearchTerm === "" ||
                          p.id.toLowerCase().includes(historyPartnerSearchTerm.toLowerCase()) ||
                          p.name.toLowerCase().includes(historyPartnerSearchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(historyPartnerSearchTerm.toLowerCase())
                      )
                      .map((p) => {
                        const isChecked = historySelectedPartnerIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => toggleHistoryPartnerFilter(p.id)}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors border ${
                              isChecked
                                ? "bg-emerald-950/70 border-emerald-500/40 text-white"
                                : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? "bg-emerald-600 text-white"
                                    : "border border-slate-700 bg-slate-900"
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-amber-300">{p.id}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 truncate">
                                    {p.category}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-200 truncate font-semibold">{p.name}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {historySelectedPartnerIds.length === 0 ? "Showing all partners" : `${historySelectedPartnerIds.length} partners active`}
                    </span>
                    <button
                      onClick={() => setIsHistoryPartnerDropdownOpen(false)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={historyCategoryFilter}
              onChange={(e) => setHistoryCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Transfer Mode Filter */}
            <select
              value={historyModeFilter}
              onChange={(e) => setHistoryModeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Transfer Modes</option>
              <option value="Direct Escrow">Direct Escrow Nodal</option>
              <option value="RTGS">RTGS Real-Time</option>
              <option value="IMPS">IMPS Instant</option>
              <option value="NEFT">NEFT Batch</option>
            </select>

            {/* Date Range Filter for Payout History */}
            <div className="relative" ref={historyDateDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsHistoryDateDropdownOpen((prev) => !prev);
                  setIsHistoryPartnerDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  historyDatePreset !== "ALL" || historyCustomStartDate !== "" || historyCustomEndDate !== ""
                    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700"
                }`}
                title="Filter payout history by date range"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {historyDatePreset === "ALL" && !historyCustomStartDate && !historyCustomEndDate
                    ? "All Dates"
                    : historyDatePreset === "CUSTOM"
                    ? (historyCustomStartDate || historyCustomEndDate ? `${historyCustomStartDate || "Start"} → ${historyCustomEndDate || "End"}` : "Custom Range")
                    : DATE_PRESET_OPTIONS.find((p) => p.id === historyDatePreset)?.shortLabel || "Date Filter"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isHistoryDateDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* History Date Range Popover */}
              {isHistoryDateDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Payout Date Range</span>
                    </div>
                    {(historyDatePreset !== "ALL" || historyCustomStartDate !== "" || historyCustomEndDate !== "") && (
                      <button
                        onClick={handleClearHistoryDateFilter}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        Reset Date
                      </button>
                    )}
                  </div>

                  {/* Preset Options Grid */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Time Presets:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DATE_PRESET_OPTIONS.map((opt) => {
                        const isSelected = historyDatePreset === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectHistoryDatePreset(opt.id)}
                            className={`flex flex-col items-start px-2.5 py-2 rounded-xl text-left border transition-all ${
                              isSelected
                                ? "bg-emerald-600/20 border-emerald-500 text-white shadow-sm"
                                : "bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/60"
                            }`}
                          >
                            <span className="text-xs font-bold flex items-center justify-between w-full">
                              <span>{opt.shortLabel}</span>
                              {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                            </span>
                            {opt.subLabel && (
                              <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                {opt.subLabel}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Date Range Picker Inputs */}
                  {historyDatePreset === "CUSTOM" && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        Specify Start &amp; End Dates (YYYY-MM-DD)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold mb-1 block">From Date</label>
                          <input
                            type="date"
                            value={historyCustomStartDate}
                            onChange={(e) => setHistoryCustomStartDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-semibold mb-1 block">To Date</label>
                          <input
                            type="date"
                            value={historyCustomEndDate}
                            onChange={(e) => setHistoryCustomEndDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active summary & done button */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-300 font-mono">
                      {activeHistoryDateBounds.label !== "All Time" ? `Active: ${activeHistoryDateBounds.label}` : "All time window"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsHistoryDateDropdownOpen(false)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Retry Button when failed records exist */}
            {historyMetrics.failedCount > 0 && (
              <button
                onClick={handleBatchRetryAllFailed}
                disabled={isRetryingDirectly !== null}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30 disabled:opacity-50"
                title="Retry all failed payouts in batch via Direct Escrow route"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRetryingDirectly === "ALL_FAILED" ? "animate-spin" : ""}`} />
                <span>Retry All Failed ({historyMetrics.failedCount})</span>
              </button>
            )}

            <button
              onClick={handleExportPayoutHistoryCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-800 hover:border-slate-700 shadow-sm"
              title="Download CSV of filtered audited payout history"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export to CSV</span>
            </button>

            {(historySearchQuery !== "" ||
              historySelectedPartnerIds.length > 0 ||
              historyCategoryFilter !== "ALL" ||
              historyModeFilter !== "ALL" ||
              historyStatusFilter !== "ALL" ||
              historyDatePreset !== "ALL" ||
              historyCustomStartDate !== "" ||
              historyCustomEndDate !== "") && (
              <button
                onClick={() => {
                  setHistorySearchQuery("");
                  setHistorySelectedPartnerIds([]);
                  setHistoryCategoryFilter("ALL");
                  setHistoryModeFilter("ALL");
                  setHistoryStatusFilter("ALL");
                  handleClearHistoryDateFilter();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 underline font-semibold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active History Filter Chips Row */}
        {(historyDatePreset !== "ALL" || historyCustomStartDate !== "" || historyCustomEndDate !== "" || historyCategoryFilter !== "ALL" || historyModeFilter !== "ALL" || historyStatusFilter !== "ALL") && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Active Criteria:</span>
            
            {/* Status Filter Chip */}
            {historyStatusFilter !== "ALL" && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                historyStatusFilter === "FAILED"
                  ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
                  : "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              }`}>
                {historyStatusFilter === "FAILED" ? (
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                )}
                <span>
                  Status: <strong>{historyStatusFilter === "FAILED" ? "Failed / Action Required" : "Cleared / Reconciled"}</strong>
                </span>
                <button
                  onClick={() => setHistoryStatusFilter("ALL")}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* History Date Range Chip */}
            {(historyDatePreset !== "ALL" || historyCustomStartDate !== "" || historyCustomEndDate !== "") && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>
                  Payout Date: <strong className="text-white">{activeHistoryDateBounds.label}</strong>
                </span>
                <button
                  onClick={handleClearHistoryDateFilter}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                  title="Remove date filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* History Category Chip */}
            {historyCategoryFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span>Category: <strong>{historyCategoryFilter}</strong></span>
                <button
                  onClick={() => setHistoryCategoryFilter("ALL")}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* History Mode Chip */}
            {historyModeFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold">
                <span>Mode: <strong>{historyModeFilter}</strong></span>
                <button
                  onClick={() => setHistoryModeFilter("ALL")}
                  className="p-0.5 rounded hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Live Filtered Summary Card for Payout History */}
      <div
        id="history-filtered-summary-card"
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          filteredPayoutHistorySummary.isFiltered
            ? "bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-950/20"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl border ${
                filteredPayoutHistorySummary.isFiltered
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {filteredPayoutHistorySummary.isFiltered
                    ? "Filtered Payout History Summary"
                    : "Live Payout Auditing Summary"}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${
                    filteredPayoutHistorySummary.isFiltered
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {filteredPayoutHistorySummary.count} of {payoutHistory.length} Transactions Visible
                </span>
                {filteredPayoutHistorySummary.isFiltered && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/25">
                    Filters Applied
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated cleared volume, retained margins, TDS remittances, and exception status for visible payout logs
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleExportPayoutHistoryCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Download filtered payout history as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            {filteredPayoutHistorySummary.isFiltered && (
              <button
                onClick={() => {
                  setHistorySearchQuery("");
                  setHistorySelectedPartnerIds([]);
                  setHistoryCategoryFilter("ALL");
                  setHistoryModeFilter("ALL");
                  setHistoryStatusFilter("ALL");
                  handleClearHistoryDateFilter();
                }}
                className="px-2.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition-colors"
                title="Reset all active payout history filters"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Primary Metric Highlights Grid for Filtered History */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
          {/* Total Transferred Volume */}
          <div className="bg-slate-950/90 border border-emerald-500/40 p-3.5 rounded-2xl bg-emerald-950/20 shadow-md">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
              Total Visible Transferred
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono block mt-0.5">
              ₹{filteredPayoutHistorySummary.totalAmountTransferred.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5 block truncate">
              Net escrow funds routed
            </span>
          </div>

          {/* Visible Transactions Count */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Transactions Visible
            </span>
            <span className="text-lg sm:text-xl font-black text-white font-mono block mt-0.5">
              {filteredPayoutHistorySummary.count}{" "}
              <span className="text-xs text-slate-400 font-normal">
                ({payoutHistory.length > 0 ? ((filteredPayoutHistorySummary.count / payoutHistory.length) * 100).toFixed(0) : 0}%)
              </span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              {filteredPayoutHistorySummary.uniquePartnersCount} beneficiary partner(s)
            </span>
          </div>

          {/* Total Gross GMV Turnover */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
              Booking GMV Cleared
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono block mt-0.5">
              ₹{filteredPayoutHistorySummary.totalGrossGMV.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              Underlying booking turnover
            </span>
          </div>

          {/* Platform Retained Margin */}
          <div className="bg-slate-950/80 border border-slate-800/90 p-3.5 rounded-2xl">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
              Margin Retained
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono block mt-0.5">
              ₹{filteredPayoutHistorySummary.totalCommission.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-amber-500/80 mt-0.5 block truncate">
              Commission fees withheld
            </span>
          </div>

          {/* TDS Sec 194-O Remittances */}
          <div className="bg-slate-950/80 border border-indigo-500/30 p-3.5 rounded-2xl bg-indigo-950/15">
            <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">
              TDS Remitted (194-O)
            </span>
            <span className="text-lg sm:text-xl font-black text-indigo-300 font-mono block mt-0.5">
              ₹{filteredPayoutHistorySummary.totalTds.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-indigo-400/80 mt-0.5 block truncate">
              Tax withheld at source
            </span>
          </div>

          {/* Reconciled vs Failed Status */}
          <div className={`p-3.5 rounded-2xl border ${
            filteredPayoutHistorySummary.failedCount > 0
              ? "bg-rose-950/30 border-rose-500/40"
              : "bg-slate-950/80 border-emerald-500/30 bg-emerald-950/15"
          }`}>
            <span className={`text-[10px] font-bold block uppercase tracking-wider ${
              filteredPayoutHistorySummary.failedCount > 0 ? "text-rose-400" : "text-emerald-400"
            }`}>
              {filteredPayoutHistorySummary.failedCount > 0 ? "Cleared / Failed" : "Status Clearance"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black font-mono text-emerald-400">
                {filteredPayoutHistorySummary.reconciledCount} OK
              </span>
              {filteredPayoutHistorySummary.failedCount > 0 && (
                <span className="text-lg font-black font-mono text-rose-400">
                  • {filteredPayoutHistorySummary.failedCount} Fail
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {filteredPayoutHistorySummary.failedCount > 0
                ? `₹${filteredPayoutHistorySummary.failedAmountINR.toLocaleString("en-IN")} requires retry`
                : "100% gateway reconciliation"}
            </span>
          </div>
        </div>
      </div>

      {/* Auditing Table of Settled and Failed Payouts */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Disbursed Payouts Auditing &amp; Banking Reconciliation Log ({filteredPayoutHistory.length} Records)
              </span>
            </div>
            {/* Active Sort Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/70 text-[11px] text-slate-300">
              <span className="text-slate-400">Sort:</span>
              <button
                onClick={() => handleToggleHistorySort(historySortField)}
                className="font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
                title={`Sorted by ${historySortField} (${historySortDirection.toUpperCase()}). Click to toggle.`}
              >
                <span>
                  {historySortField === "transactionDate"
                    ? "Date & Time"
                    : historySortField === "amountTransferredINR"
                    ? "Amount Transferred"
                    : historySortField === "bookingValueINR"
                    ? "Gross GMV"
                    : historySortField === "grossCommissionINR"
                    ? "Fee Retained"
                    : historySortField === "tdsDeductionINR"
                    ? "TDS (194-O)"
                    : historySortField === "status"
                    ? "Bank Status"
                    : historySortField === "partnerName"
                    ? "Partner"
                    : historySortField === "partnerCategory"
                    ? "Category"
                    : historySortField === "bookingId"
                    ? "Booking Ref"
                    : "UTR Reference"}
                </span>
                {historySortDirection === "asc" ? (
                  <ArrowUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-emerald-400" />
                )}
              </button>
              {historySortField !== "transactionDate" && (
                <button
                  onClick={handleResetHistorySort}
                  className="ml-1 text-slate-400 hover:text-slate-200 text-[10px] flex items-center gap-0.5 px-1 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  title="Reset sorting to Date & Time (Newest first)"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPayoutHistoryCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Export filtered payout history to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export to CSV</span>
            </button>
            {historyMetrics.failedCount > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-bold bg-rose-950/50 border border-rose-500/30 px-2.5 py-1 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{historyMetrics.failedCount} Failed</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-xl hidden sm:flex">
              <CheckCircle2 className="w-3 h-3" />
              <span>Nodal Escrow Linked</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="select-none">
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                {/* UTR Reference ID (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("transactionId")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    historySortField === "transactionId"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Transaction Reference ID (UTR)"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Reference ID (UTR)</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "transactionId" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Transaction Date & Time (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("transactionDate")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    historySortField === "transactionDate"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Transaction Date & Time"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Transaction Date &amp; Time</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "transactionDate" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Partner Beneficiary & ID (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("partnerName")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    historySortField === "partnerName"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Partner Beneficiary Name"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Partner Beneficiary &amp; ID</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "partnerName" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Category (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("partnerCategory")}
                  className={`py-3.5 px-4 text-center cursor-pointer transition-colors group/th ${
                    historySortField === "partnerCategory"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Category"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Category</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "partnerCategory" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Booking Reference (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("bookingId")}
                  className={`py-3.5 px-4 cursor-pointer transition-colors group/th ${
                    historySortField === "bookingId"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Booking Reference"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Booking Ref</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "bookingId" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Gross GMV (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("bookingValueINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    historySortField === "bookingValueINR"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Gross Booking Value"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Gross GMV</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "bookingValueINR" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Fee Retained (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("grossCommissionINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    historySortField === "grossCommissionINR"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Commission Fee Retained"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Fee Retained</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "grossCommissionINR" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* TDS (194-O) (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("tdsDeductionINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    historySortField === "tdsDeductionINR"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by TDS Remitted (Sec 194-O)"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>TDS (194-O)</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "tdsDeductionINR" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Amount Transferred (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("amountTransferredINR")}
                  className={`py-3.5 px-4 text-right cursor-pointer transition-colors group/th ${
                    historySortField === "amountTransferredINR"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Disbursed Amount Transferred"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Amount Transferred</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "amountTransferredINR" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                {/* Bank Status (Sortable) */}
                <th
                  onClick={() => handleToggleHistorySort("status")}
                  className={`py-3.5 px-4 text-center cursor-pointer transition-colors group/th ${
                    historySortField === "status"
                      ? "text-emerald-300 bg-emerald-950/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                  title="Click to sort by Bank / Payout Status"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Bank Status</span>
                    <span className="p-0.5 rounded transition-all">
                      {historySortField === "status" ? (
                        historySortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-40 group-hover/th:opacity-100" />
                      )}
                    </span>
                  </div>
                </th>

                <th className="py-3.5 px-4 text-right">Audit / Retry Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPayoutHistory.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-sm">No historical payout logs match your search.</p>
                    <button
                      onClick={() => {
                        setHistorySearchQuery("");
                        setHistorySelectedPartnerIds([]);
                        setHistoryCategoryFilter("ALL");
                        setHistoryModeFilter("ALL");
                        setHistoryStatusFilter("ALL");
                      }}
                      className="mt-2 text-xs text-indigo-400 underline font-bold"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPayoutHistory.map((item) => {
                  const isCopied = copiedUtr === item.transactionId;
                  const isFailed = item.status === "Failed";
                  const isRetrying = isRetryingDirectly === item.transactionId;
                  const isSelectedInDrawer =
                    selectedDetailItem && "transactionId" in selectedDetailItem && selectedDetailItem.transactionId === item.transactionId;

                  return (
                    <tr
                      key={item.transactionId}
                      onClick={() => handleOpenGranularDetail(item, "history")}
                      className={`transition-all group cursor-pointer ${
                        isSelectedInDrawer
                          ? "bg-emerald-950/60 border-l-4 border-l-emerald-400"
                          : isFailed
                          ? "bg-rose-950/20 hover:bg-rose-950/35 border-l-4 border-rose-500"
                          : "hover:bg-slate-900/80"
                      }`}
                      title="Click row to inspect granular payout audit & bank metadata"
                    >
                      {/* Reference Transaction ID (UTR) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-black text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${
                              isFailed
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {isFailed && <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />}
                            {item.transactionId}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUtr(item.transactionId);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Copy Reference ID"
                          >
                            {isCopied ? (
                              <CheckCheck className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Mode: <strong className="text-slate-200">{item.transferMode}</strong>
                          </span>
                          {isFailed ? (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-950 px-1.5 py-0.2 rounded border border-rose-500/30">
                              BOUNCED
                            </span>
                          ) : (
                            item.batchId && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                • {item.batchId}
                              </span>
                            )
                          )}
                          {item.retryCount && item.retryCount > 0 ? (
                            <span className="text-[9px] text-amber-400 font-mono bg-amber-500/10 px-1 rounded">
                              Retry #{item.retryCount}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Transaction Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-mono text-xs">{item.transactionDate}</span>
                        </div>
                        {isFailed ? (
                          <span className="text-[10px] text-rose-400 block mt-0.5 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
                            Disbursal Bounced / Failed
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">
                            Immediate Escrow Cleared
                          </span>
                        )}
                      </td>

                      {/* Partner Beneficiary & ID */}
                      <td className="py-3.5 px-4">
                        <div className={`font-bold transition-colors ${isFailed ? "text-rose-200 group-hover:text-white" : "text-white group-hover:text-emerald-300"}`}>
                          {item.partnerName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                            {item.partnerId}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]" title={item.beneficiaryBank}>
                            {item.beneficiaryBank}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-bold border border-indigo-500/25 inline-block">
                          {item.partnerCategory}
                        </span>
                      </td>

                      {/* Booking Reference */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-200">{item.bookingId}</div>
                        <div className="text-[10px] text-slate-500">{item.leadId}</div>
                      </td>

                      {/* Gross GMV */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-300">
                        ₹{item.bookingValueINR.toLocaleString("en-IN")}
                      </td>

                      {/* Fee Retained */}
                      <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                        <div className="font-bold">
                          ₹{item.grossCommissionINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] text-slate-500">{item.commissionPercent}%</div>
                      </td>

                      {/* TDS 194-O */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        <div className="font-semibold">
                          ₹{item.tdsDeductionINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] text-slate-500">1% Sec 194-O</div>
                      </td>

                      {/* Amount Transferred (INR) */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div
                          className={`text-sm font-black px-2 py-0.5 rounded border inline-block ${
                            isFailed
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          ₹{item.amountTransferredINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {isFailed ? "Uncollected / Failed" : "Net Disbursed"}
                        </div>
                      </td>

                      {/* Bank Status Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isFailed ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/50 text-[11px] font-bold shadow-sm shadow-rose-950/80 whitespace-nowrap"
                              title="Bank payment gateway rejection / timeout"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping shadow-sm shadow-rose-400"></span>
                              <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Failed</span>
                            </span>
                            {item.failureReason && (
                              <span
                                className="text-[9px] text-rose-300/90 max-w-[140px] truncate block font-medium font-mono"
                                title={item.failureReason}
                              >
                                {item.failureCode || item.failureReason}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-sm shadow-emerald-950/60 whitespace-nowrap"
                            title="Direct Escrow RTGS transaction cleared & reconciled"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Reconciled</span>
                          </span>
                        )}
                      </td>

                      {/* Audit / Retry Action Column */}
                      <td className="py-3.5 px-4 text-right">
                        {isFailed ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Instant Inline Retry Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirectInlineRetry(item);
                              }}
                              disabled={isRetrying}
                              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-900/30 flex items-center gap-1"
                              title="Instantly re-disburse payout via Direct Escrow nodal route"
                            >
                              <RotateCcw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
                              <span>{isRetrying ? "Retrying..." : "Retry"}</span>
                            </button>

                            {/* Diagnose & Review Modal */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenRetryModal(item);
                              }}
                              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
                              title="Review Bank Rejection Error & Adjust Routing Gateway"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAuditRecord(item);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto border border-slate-700"
                            title="Inspect Full Transaction Audit Advice"
                          >
                            <Receipt className="w-3 h-3 text-emerald-400" />
                            <span>Audit Advice</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filteredPayoutHistory.length > 0 && (
              <tfoot className="bg-slate-900/95 border-t-2 border-slate-700 text-xs font-bold text-slate-200">
                <tr>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-white font-mono">
                      <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Total Filtered:</span>
                      <span className="text-emerald-300">({filteredPayoutHistorySummary.count})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-mono text-[10px]">
                    {activeHistoryDateBounds.label}
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-medium text-[11px]">
                    {filteredPayoutHistorySummary.uniquePartnersCount} Beneficiaries
                  </td>
                  <td className="py-4 px-4 text-center text-slate-500 font-mono">
                    —
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-mono text-center">
                    —
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-black text-cyan-300 text-sm">
                    ₹{filteredPayoutHistorySummary.totalGrossGMV.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                    ₹{filteredPayoutHistorySummary.totalCommission.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-indigo-300 text-sm">
                    ₹{filteredPayoutHistorySummary.totalTds.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                    ₹{filteredPayoutHistorySummary.totalAmountTransferred.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-center text-slate-500 font-mono text-[10px]">
                    —
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[10px] text-slate-300 font-medium block">
                      {filteredPayoutHistorySummary.reconciledCount} OK
                      {filteredPayoutHistorySummary.failedCount > 0 && ` • ${filteredPayoutHistorySummary.failedCount} Failed`}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={handleExportPayoutHistoryCSV}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white text-[10px] font-bold transition-colors flex items-center gap-1 ml-auto border border-slate-700"
                      title="Export filtered records to CSV"
                    >
                      <Download className="w-3 h-3 text-emerald-400" />
                      <span>CSV</span>
                    </button>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL 1: RETRY FAILED DISBURSAL & GATEWAY RE-ROUTING                      */}
  {/* ========================================================================= */}
  {retryingRecord && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Retry Failed Disbursal &amp; Re-Authorize</h4>
              <p className="text-[11px] text-rose-400 font-mono font-bold">
                Failed Ref ID: {retryingRecord.transactionId}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isExecutingRetryModal) setRetryingRecord(null);
            }}
            disabled={isExecutingRetryModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Failure Diagnostic Alert Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Bank Rejection Diagnostics (NPCI / RBI Gateway)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed pl-5">
            {retryingRecord.failureReason || "Gateway clearance timeout. The receiving beneficiary bank did not acknowledge the transfer within the clearing SLA window."}
          </p>
          {retryingRecord.failureCode && (
            <div className="pl-5 pt-1">
              <span className="font-mono text-[10px] bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30 text-rose-300">
                Code: {retryingRecord.failureCode}
              </span>
            </div>
          )}
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Beneficiary Partner:</span>
            <span className="font-bold text-white">{retryingRecord.partnerName} ({retryingRecord.partnerId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Booking Reference / PNR:</span>
            <span className="font-mono text-indigo-300">{retryingRecord.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gross Converted Value:</span>
            <span className="font-mono font-bold text-white">₹{retryingRecord.bookingValueINR.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>Commission Retained ({retryingRecord.commissionPercent}%):</span>
            <span className="font-mono font-bold">- ₹{retryingRecord.grossCommissionINR.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>TDS Remittance (1% Sec 194-O):</span>
            <span className="font-mono">- ₹{retryingRecord.tdsDeductionINR.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
            <span className="font-black text-white">Net Re-Disbursal Amount:</span>
            <span className="font-mono font-black text-emerald-400">
              ₹{retryingRecord.amountTransferredINR.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Corrective Gateway & Routing Controls */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Select Re-Disbursal Gateway Route:</span>
              <span className="text-[10px] text-emerald-400 font-normal">Direct Escrow Recommended</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "Direct Escrow", title: "Direct Escrow Nodal", desc: "Instant clearance via HDFC Nodal API" },
                  { id: "RTGS", title: "RTGS Real-Time", desc: "RBI Gross Settlement 24x7" },
                  { id: "IMPS", title: "IMPS Instant", desc: "NPCI immediate fast routing" },
                  { id: "NEFT", title: "NEFT Batch", desc: "Hourly batch clearing" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setRetryTransferMode(mode.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    retryTransferMode === mode.id
                      ? "bg-emerald-950/80 border-emerald-500 text-white shadow-md shadow-emerald-900/20"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{mode.title}</span>
                    {retryTransferMode === mode.id && <Check className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Verify / Update Beneficiary Bank Account:
            </label>
            <input
              type="text"
              value={retryBeneficiaryBank}
              onChange={(e) => setRetryBeneficiaryBank(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              placeholder="Bank Name, Branch & Account (e.g. HDFC Bank A/C ••••4091)"
            />
          </div>
        </div>

        {/* Live Execution Animation Steps */}
        {isExecutingRetryModal && (
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-500/40 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Processing Re-Disbursal via {retryTransferMode}...</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                {retryExecutionStep >= 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                )}
                <span>1. Verified beneficiary banking routing &amp; nodal reserve fund</span>
              </div>
              <div className="flex items-center gap-2">
                {retryExecutionStep >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                )}
                <span>2. Connecting RBI/Nodal Gateway &amp; dispatching ₹{retryingRecord.amountTransferredINR.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center gap-2">
                {retryExecutionStep >= 3 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                )}
                <span>3. Live UTR generated &amp; ledger reconciled</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setRetryingRecord(null)}
            disabled={isExecutingRetryModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteModalRetry}
            disabled={isExecutingRetryModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isExecutingRetryModal ? "animate-spin" : ""}`} />
            <span>{isExecutingRetryModal ? "Authorizing Re-Disbursal..." : "Authorize & Re-Disburse Payout"}</span>
          </button>
        </div>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL 2: AUDIT RECORD VOUCHER MODAL (FOR PAYOUT HISTORY TAB)              */}
  {/* ========================================================================= */}
  {selectedAuditRecord && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${selectedAuditRecord.status === "Failed" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {selectedAuditRecord.status === "Failed" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Receipt className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Settlement Advice &amp; Auditing Voucher</h4>
              <p className="text-[11px] text-amber-400 font-mono font-bold">
                Ref ID: {selectedAuditRecord.transactionId}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAuditRecord(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* If failed record, show diagnostic callout */}
        {selectedAuditRecord.status === "Failed" && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Failed Disbursal Audit Log</span>
            </div>
            <p className="text-[11px] text-slate-300">{selectedAuditRecord.failureReason || "Payment rejected by switch."}</p>
          </div>
        )}

        <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-400">Transaction Timestamp:</span>
            <span className="font-mono font-bold text-white">{selectedAuditRecord.transactionDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Partner Beneficiary:</span>
            <span className="font-bold text-white">{selectedAuditRecord.partnerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Partner ID &amp; Category:</span>
            <span className="font-semibold text-indigo-300 font-mono">
              {selectedAuditRecord.partnerId} ({selectedAuditRecord.partnerCategory})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bank &amp; Account:</span>
            <span className="text-slate-200">{selectedAuditRecord.beneficiaryBank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Booking Reference / PNR:</span>
            <span className="font-mono text-slate-200">{selectedAuditRecord.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gross Booking GMV:</span>
            <span className="font-mono font-bold text-white">
              ₹{selectedAuditRecord.bookingValueINR.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>Platform Commission ({selectedAuditRecord.commissionPercent}%):</span>
            <span className="font-mono font-bold">
              - ₹{selectedAuditRecord.grossCommissionINR.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Section 194-O TDS Deduction (1%):</span>
            <span className="font-mono">- ₹{selectedAuditRecord.tdsDeductionINR.toLocaleString("en-IN")}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
            <span className="font-black text-white">Net Amount Transferred:</span>
            <span className="font-mono font-black text-emerald-400">
              ₹{selectedAuditRecord.amountTransferredINR.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {selectedAuditRecord.status === "Failed" ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Action required: Retry payment to credit partner account.</span>
            </span>
            <button
              onClick={() => {
                const record = selectedAuditRecord;
                setSelectedAuditRecord(null);
                handleOpenRetryModal(record);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Retry Now
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Disbursed via {selectedAuditRecord.transferMode}. Reconciled and electronically signed under GST Form GSTR-8.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => handleCopyUtr(selectedAuditRecord.transactionId)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Reference UTR</span>
          </button>

          <button
            onClick={() => setSelectedAuditRecord(null)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Receipt / Settlement Voucher Modal for Active Settlements tab */}
      {selectedReceiptLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Partner Settlement Advice &amp; Tax Voucher</h4>
                  <p className="text-[11px] text-slate-400 font-mono">UTR: UTR-HDFC-20260828-9842</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Partner Beneficiary:</span>
                <span className="font-bold text-white">{selectedReceiptLead.partnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Partner Category:</span>
                <span className="font-semibold text-indigo-300">{selectedReceiptLead.partnerCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer &amp; Trip PNR:</span>
                <span className="text-slate-200">
                  {selectedReceiptLead.customerName} ({selectedReceiptLead.bookingId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Converted GMV:</span>
                <span className="font-mono font-bold text-white">
                  ₹{selectedReceiptLead.bookingValueINR?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Platform Commission ({selectedReceiptLead.commissionPercent}%):</span>
                <span className="font-mono font-bold">
                  - ₹{selectedReceiptLead.grossCommissionINR.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TDS deduction (Section 194-O @ 1%):</span>
                <span className="font-mono">- ₹{Math.round((selectedReceiptLead.bookingValueINR || 0) * 0.01).toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
                <span className="font-black text-white">Net Disbursed Amount:</span>
                <span className="font-mono font-black text-emerald-400">
                  ₹{selectedReceiptLead.partnerSettlementAmountINR.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Settled via Automated Bank Route on 28 Aug 2026. Electronic GST tax invoice delivered to partner registered email.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReceiptLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3 / SIDE-DRAWER: GRANULAR TRANSACTION BREAKDOWN & SETTLEMENT METADATA */}
      {/* ========================================================================= */}
      {selectedDetailItem && (() => {
        const isLeadItem = "leadId" in selectedDetailItem && !("transferMode" in selectedDetailItem);
        const leadItem = isLeadItem ? (selectedDetailItem as B2BAttributedLeadConversion) : null;
        const historyItem = !isLeadItem ? (selectedDetailItem as PayoutTransactionRecord) : null;

        const associatedLead = historyItem
          ? leadsData.find((l) => l.leadId === historyItem.leadId || (historyItem.bookingId && l.bookingId === historyItem.bookingId))
          : null;

        const displayBookingId = leadItem?.bookingId || historyItem?.bookingId || leadItem?.leadId || historyItem?.leadId || "—";
        const displayLeadId = leadItem?.leadId || historyItem?.leadId || "—";
        const displayPartnerName = leadItem?.partnerName || historyItem?.partnerName || "—";
        const displayPartnerId = leadItem?.partnerId || historyItem?.partnerId || "—";
        const displayPartnerCategory = leadItem?.partnerCategory || historyItem?.partnerCategory || "Tour Package";
        const displayCustomerName = leadItem?.customerName || associatedLead?.customerName || "Traveler Client";
        const displayCustomerPhone = leadItem?.customerPhone || associatedLead?.customerPhone || "+91 98765 43210";
        const displayDestination = leadItem?.customerDestination || associatedLead?.customerDestination || "Kashmir Valley";
        const displayTravelDate = leadItem?.travelDate || associatedLead?.travelDate || "2026-09-15";
        const displayPaxCount = leadItem?.paxCount || associatedLead?.paxCount || 2;
        const displayGrossGMV = leadItem?.bookingValueINR || historyItem?.bookingValueINR || leadItem?.budgetEstimateINR || 0;
        const displayCommissionPercent = leadItem?.commissionPercent || historyItem?.commissionPercent || 15;
        const displayGrossCommission =
          leadItem?.grossCommissionINR ||
          historyItem?.grossCommissionINR ||
          Math.round(displayGrossGMV * (displayCommissionPercent / 100));
        const displayTdsDeduction = historyItem?.tdsDeductionINR || Math.round(displayGrossGMV * 0.01);
        const displaySalesIncentive =
          leadItem?.telesalesIncentiveINR ||
          associatedLead?.telesalesIncentiveINR ||
          Math.round(displayGrossCommission * 0.08);
        const displayNetPlatformRevenue =
          leadItem?.netPlatformRevenueINR || displayGrossCommission - displaySalesIncentive;
        const displayNetSettlementAmount =
          leadItem?.partnerSettlementAmountINR ||
          historyItem?.amountTransferredINR ||
          displayGrossGMV - displayGrossCommission;
        const displayTransferMode = historyItem?.transferMode || "Direct Escrow";
        const displayBeneficiaryBank = historyItem?.beneficiaryBank || "HDFC Nodal Escrow A/C (••••4091)";
        const displayCreatedAt = leadItem?.createdAt || historyItem?.transactionDate || "2026-08-28";
        const displayStatus = leadItem?.settlementStatus || historyItem?.status || "Pending_Payment";
        const isFailedDisbursal = displayStatus === "Failed";
        const isSettledOrReconciled = displayStatus === "Settled" || displayStatus === "Reconciled";
        const isPendingPayment = displayStatus === "Pending_Payment";
        const isProcessingState = displayStatus === "Processing" || (leadItem && settlingLeadId === leadItem.leadId);
        const displayUtr =
          historyItem?.transactionId ||
          (isSettledOrReconciled
            ? `UTR-HDFC-20260828-${displayLeadId.replace(/\D/g, "").slice(-4) || "9842"}`
            : undefined);
        const displayCampaignSource = leadItem?.campaignSource || associatedLead?.campaignSource || "Google Ads";
        const displayCampaignName =
          leadItem?.campaignName || associatedLead?.campaignName || "Google Ads Search - Kashmir Luxury";
        const displayCampaignId = leadItem?.campaignId || associatedLead?.campaignId || "CMP-GOOGLE-KSH-09";
        const displayLeadScore = leadItem?.leadQualificationScore || associatedLead?.leadQualificationScore || 92;
        const displayExecutiveName =
          leadItem?.telesalesExecutiveName || associatedLead?.telesalesExecutiveName || "Rahul Varma";
        const displayExecutiveId = leadItem?.telesalesExecutiveId || associatedLead?.telesalesExecutiveId || "EXEC-01";

        return (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            {/* Click-outside backdrop closer */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={handleCloseDrawer}
              title="Click outside to close breakdown"
            />

            {/* Slide-Over Drawer Container */}
            <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
              {/* Toast alert inside drawer for copied items */}
              {drawerCopiedToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black rounded-full shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-150">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{drawerCopiedToast}</span>
                </div>
              )}

              {/* Top Sticky Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-500/30">
                        {isLeadItem ? "B2B Attributed Settlement" : "Gateway Payout Audit"}
                      </span>
                      {isSettledOrReconciled && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-sm shadow-emerald-950/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Paid &amp; Settled</span>
                        </span>
                      )}
                      {isPendingPayment && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-sm shadow-amber-950/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></span>
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pending Escrow Disbursal</span>
                        </span>
                      )}
                      {isProcessingState && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold shadow-sm shadow-indigo-950/60">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          <span>Processing RTGS Transfer</span>
                        </span>
                      )}
                      {isFailedDisbursal && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/50 text-[11px] font-bold shadow-sm shadow-rose-950/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Failed Disbursal Bounced</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white font-mono tracking-tight">
                        {displayBookingId}
                      </h3>
                      <button
                        onClick={() => handleDrawerCopy(displayBookingId, "Booking ID")}
                        className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Copy Booking ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>Ref Lead: <strong className="font-mono text-slate-200">{displayLeadId}</strong></span>
                      <span>•</span>
                      <span>Created: <strong className="text-slate-200">{displayCreatedAt}</strong></span>
                      <span>•</span>
                      <span>Partner: <strong className="text-indigo-300">{displayPartnerName}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportSingleRecordCSV(selectedDetailItem, isLeadItem)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                      title="Export single transaction record to CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        const payload = JSON.stringify(selectedDetailItem, null, 2);
                        handleDrawerCopy(payload, "Full JSON Metadata");
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                      title="Copy granular payload as JSON"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="hidden sm:inline">JSON</span>
                    </button>
                    <button
                      onClick={handleCloseDrawer}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Close drawer (Esc)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Financial Quick Bar */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Gross GMV</span>
                    <span className="font-mono font-bold text-white text-sm">
                      ₹{displayGrossGMV.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-amber-400 block">Fee ({displayCommissionPercent}%)</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      ₹{displayGrossCommission.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">TDS 194-O (1%)</span>
                    <span className="font-mono font-bold text-indigo-300 text-sm">
                      ₹{displayTdsDeduction.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 block">Net Disbursal</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      ₹{displayNetSettlementAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Granular Drawer Navigation Tabs */}
                <div className="flex items-center gap-1.5 mt-3.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setDrawerTab("breakdown")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === "breakdown"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Financial Ledger</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab("partner")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === "partner"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Partner &amp; Bank</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab("attribution")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === "attribution"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Traveler &amp; Lead</span>
                  </button>
                  <button
                    onClick={() => setDrawerTab("timeline")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === "timeline"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Audit Trail</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: FINANCIAL LEDGER & WATERFALL BREAKDOWN                  */}
                {/* ------------------------------------------------------------- */}
                {drawerTab === "breakdown" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Detailed Waterfall Card */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          Escrow Financial Settlement Waterfall
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          GST Compliant (Rule 52 TCS)
                        </span>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-slate-300">1. Gross Booking Value (GMV Collected)</span>
                          <span className="font-mono font-bold text-white text-sm">
                            ₹{displayGrossGMV.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 text-amber-400 bg-amber-500/5 px-2 rounded-lg border border-amber-500/10">
                          <div className="flex items-center gap-1.5">
                            <span>2. Platform Retained Commission ({displayCommissionPercent}%)</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 rounded font-mono font-bold">
                              Contract Rate
                            </span>
                          </div>
                          <span className="font-mono font-bold text-sm">
                            - ₹{displayGrossCommission.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 text-indigo-300 px-2">
                          <div className="flex items-center gap-1">
                            <span>3. Statutory TDS Withholding (Section 194-O @ 1%)</span>
                            <span title="Mandatory 1% TDS on E-Commerce operator transactions under Indian Income Tax Act Sec 194-O" className="inline-flex items-center">
                              <Info className="w-3 h-3 text-slate-500 cursor-help" />
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs">
                            - ₹{displayTdsDeduction.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 text-slate-400 px-2">
                          <span>4. Telesales Executive Performance Incentive</span>
                          <span className="font-mono text-xs">
                            ₹{displaySalesIncentive.toLocaleString("en-IN")} ({displayExecutiveName})
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-1 text-slate-400 px-2">
                          <span>5. Net Platform Yield (Margin after incentive)</span>
                          <span className="font-mono text-xs font-semibold text-slate-300">
                            ₹{displayNetPlatformRevenue.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30">
                          <div>
                            <span className="font-black text-white text-sm block">
                              6. Net Beneficiary Payout (Payable)
                            </span>
                            <span className="text-[10px] text-emerald-300">
                              Disbursed directly into partner bank escrow account
                            </span>
                          </div>
                          <span className="font-mono font-black text-emerald-400 text-lg">
                            ₹{displayNetSettlementAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Benchmark Comparison Card */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-400" />
                          Category Commission Benchmark ({displayPartnerCategory})
                        </span>
                        <span className="font-mono text-xs text-amber-400 font-bold">
                          {displayCommissionPercent}% Applied
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        The standard commission tier for <strong>{displayPartnerCategory}</strong> packages is between{" "}
                        <strong>10% – 20%</strong> (Standard: <strong>15%</strong>). This transaction was processed under the contracted rate of{" "}
                        <strong>{displayCommissionPercent}%</strong> with zero discrepancy.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-500">Benchmark Rate:</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                          10% (Min) – 20% (Max)
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold ml-auto flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Standard Tier
                        </span>
                      </div>
                    </div>

                    {/* Nodal Escrow Safeguard Callout */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Reserve Nodal Escrow Security</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                        Funds are held securely in a compliant 2-way RBI Nodal Escrow account with HDFC Bank. Settlement clearance is executed automatically via electronic bank routing SLA with automated GST TCS tax invoice credit.
                      </p>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: PARTNER & BENEFICIARY PROFILE & BANKING RAILS           */}
                {/* ------------------------------------------------------------- */}
                {drawerTab === "partner" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Partner Details */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-white">{displayPartnerName}</span>
                        </div>
                        <button
                          onClick={() => handleDrawerCopy(displayPartnerId, "Partner ID")}
                          className="font-mono text-[10px] text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 transition-colors"
                        >
                          <span>{displayPartnerId}</span>
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Business Vertical:</span>
                          <span className="font-bold text-slate-200">{displayPartnerCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contract Tier:</span>
                          <span className="font-bold text-emerald-400">Verified Premium Merchant</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Settlement Frequency:</span>
                          <span className="text-slate-300">T+1 Post Tour Verification</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Direct Escrow Route:</span>
                          <span className="text-slate-300 font-mono">HDFC Nodal API v3</span>
                        </div>
                      </div>
                    </div>

                    {/* Banking & Disbursal Rails */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          Beneficiary Banking Account &amp; Rails
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <BadgeCheck className="w-3.5 h-3.5" /> Bank Verified
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-300">
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Beneficiary Bank:</span>
                          <span className="font-bold text-white">{displayBeneficiaryBank}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Clearing Network:</span>
                          <span className="font-mono text-indigo-300 font-bold">{displayTransferMode}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">IFSC Branch Verification:</span>
                          <span className="font-mono text-slate-200">HDFC0001842 (Cleared)</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Account Type:</span>
                          <span className="text-slate-200">Current Corporate Account</span>
                        </div>
                      </div>
                    </div>

                    {/* Tax & Regulatory Compliance */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          Tax &amp; Regulatory Verification (GST / PAN)
                        </span>
                        <span className="text-[10px] text-indigo-300 font-mono">100% Compliant</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">GSTIN Registration:</span>
                          <span className="font-mono font-bold text-slate-200">27AABCU9603R1ZM (Active)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Section 194-O PAN:</span>
                          <span className="font-mono font-bold text-slate-200">ABCDE1234F (Verified)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">GST TCS Form GSTR-8:</span>
                          <span className="text-emerald-400 font-medium">Auto-Logged &amp; Reconciled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: ATTRIBUTED LEAD & TRAVELER JOURNEY                      */}
                {/* ------------------------------------------------------------- */}
                {drawerTab === "attribution" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* Traveler Profile */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-indigo-400" />
                          Traveler &amp; Tour Booking Details
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                          Confirmed Guest
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Primary Traveler:</span>
                          <span className="font-bold text-white text-sm">{displayCustomerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contact Mobile:</span>
                          <span className="font-mono text-slate-300">{displayCustomerPhone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Destination Itinerary:</span>
                          <span className="font-bold text-indigo-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            {displayDestination}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Party Size &amp; Date:</span>
                          <span className="text-slate-200">
                            {displayPaxCount} Pax • {displayTravelDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Attribution & Marketing Channel */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Multi-Touch Marketing Attribution
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Score: {displayLeadScore}/100
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Acquisition Source:</span>
                          <span className="font-bold text-white">{displayCampaignSource}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Campaign ID:</span>
                          <span className="font-mono text-slate-300">{displayCampaignId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Campaign Name:</span>
                          <span className="text-slate-300 max-w-[260px] truncate text-right" title={displayCampaignName}>
                            {displayCampaignName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sales Representative Attribution */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          Telesales Representative Attribution
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          {displayExecutiveId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <span className="font-bold text-white block">{displayExecutiveName}</span>
                          <span className="text-[10px] text-slate-500">B2B Commercial Desk</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400">
                            + ₹{displaySalesIncentive.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Agent Incentive</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 4: BANKING RAILS, UTR & AUDIT TIMELINE                    */}
                {/* ------------------------------------------------------------- */}
                {drawerTab === "timeline" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    {/* UTR & Transaction Reference */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Receipt className="w-4 h-4 text-emerald-400" />
                          Banking Reference UTR / Hash
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {displayTransferMode} Gateway
                        </span>
                      </div>
                      {displayUtr ? (
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <span className="font-mono font-bold text-emerald-400 text-xs truncate">
                            {displayUtr}
                          </span>
                          <button
                            onClick={() => handleDrawerCopy(displayUtr, "UTR Reference")}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 ml-2"
                            title="Copy UTR Reference"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Pending disbursal trigger. UTR will be generated upon bank gateway authorization.</span>
                        </div>
                      )}
                    </div>

                    {/* Transaction Lifecycle Timeline */}
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-300 block pb-1 border-b border-slate-800">
                        Lifecycle Timeline &amp; Escrow Milestones
                      </span>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                        {/* Step 1: Ingest */}
                        <div className="relative">
                          <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              1. Lead Ingestion &amp; Attribution Captured
                            </span>
                            <p className="text-[10px] text-slate-400">
                              Attributed via {displayCampaignSource} ({displayCampaignId}) on {displayCreatedAt}
                            </p>
                          </div>
                        </div>

                        {/* Step 2: Quote & Conversion */}
                        <div className="relative">
                          <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              2. Booking Confirmed &amp; GMV Locked
                            </span>
                            <p className="text-[10px] text-slate-400">
                              Gross Booking GMV ₹{displayGrossGMV.toLocaleString("en-IN")} received into Nodal Escrow
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Commission & TDS */}
                        <div className="relative">
                          <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              3. Commission ({displayCommissionPercent}%) &amp; TDS (1%) Computed
                            </span>
                            <p className="text-[10px] text-slate-400">
                              Platform fee ₹{displayGrossCommission.toLocaleString("en-IN")} • Sec 194-O TDS ₹{displayTdsDeduction.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* Step 4: Disbursal / Settlement */}
                        <div className="relative">
                          <div
                            className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              isSettledOrReconciled
                                ? "bg-emerald-500 text-slate-950"
                                : isFailedDisbursal
                                ? "bg-rose-500 text-white"
                                : isProcessingState
                                ? "bg-indigo-500 text-white animate-spin"
                                : "bg-amber-500 text-slate-950"
                            }`}
                          >
                            {isSettledOrReconciled ? (
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ) : isFailedDisbursal ? (
                              <X className="w-2.5 h-2.5 stroke-[3]" />
                            ) : (
                              <Clock className="w-2.5 h-2.5" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`text-xs font-bold block ${
                                isSettledOrReconciled
                                  ? "text-emerald-400"
                                  : isFailedDisbursal
                                  ? "text-rose-400"
                                  : isProcessingState
                                  ? "text-indigo-300"
                                  : "text-amber-400"
                              }`}
                            >
                              4. Partner Disbursal (₹{displayNetSettlementAmount.toLocaleString("en-IN")})
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {isSettledOrReconciled
                                ? `Settled via ${displayTransferMode} to ${displayBeneficiaryBank}`
                                : isFailedDisbursal
                                ? (historyItem?.failureReason || "Gateway rejection: bank switch clearing timeout.")
                                : isProcessingState
                                ? "RTGS transaction transmission in progress..."
                                : "Awaiting disbursal trigger approval"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action Controls */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/90 shrink-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseDrawer}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleExportSingleRecordCSV(selectedDetailItem, isLeadItem)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
                    title="Export this transaction record to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isPendingPayment && leadItem && (
                    <button
                      onClick={() => {
                        handleTriggerPayout(leadItem.leadId);
                      }}
                      disabled={isProcessingState}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disburse Payout (₹{displayNetSettlementAmount.toLocaleString("en-IN")})</span>
                    </button>
                  )}

                  {isSettledOrReconciled && (
                    <button
                      onClick={() => {
                        if (leadItem) {
                          setSelectedReceiptLead(leadItem);
                        } else if (historyItem) {
                          setSelectedAuditRecord(historyItem);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Tax Voucher</span>
                    </button>
                  )}

                  {isFailedDisbursal && historyItem && (
                    <button
                      onClick={() => {
                        handleOpenRetryModal(historyItem);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs transition-all shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Disbursal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
