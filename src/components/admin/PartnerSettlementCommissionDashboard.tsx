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
} from "lucide-react";
import {
  B2BAttributedLeadConversion,
  INITIAL_ATTRIBUTED_LEADS,
  CATEGORY_COMMISSION_RATES,
} from "../../data/b2bCommissionTelesalesData";

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

export interface PayoutTransactionRecord {
  transactionId: string; // UTR Reference
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
  status: "Settled" | "Reconciled" | "Processing";
  batchId?: string;
  remarks?: string;
}

export const INITIAL_PAYOUT_HISTORY: PayoutTransactionRecord[] = [
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
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<PayoutTransactionRecord | null>(null);

  // Multi-Select Filters for Active Settlements
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  // Multi-select for Settlement Status: empty array [] denotes "All Statuses"
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // Multi-select for Partner IDs: empty array [] denotes "All Partners"
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Dropdown Popover States
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState<boolean>(false);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState<boolean>(false);
  const [partnerSearchTerm, setPartnerSearchTerm] = useState<string>("");

  const [settlingLeadId, setSettlingLeadId] = useState<string | null>(null);
  const [isBatchSettling, setIsBatchSettling] = useState<boolean>(false);
  const [selectedReceiptLead, setSelectedReceiptLead] = useState<B2BAttributedLeadConversion | null>(null);

  // Refs for click outside handling
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const partnerDropdownRef = useRef<HTMLDivElement>(null);
  const historyPartnerDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(event.target as Node)) {
        setIsPartnerDropdownOpen(false);
      }
      if (historyPartnerDropdownRef.current && !historyPartnerDropdownRef.current.contains(event.target as Node)) {
        setIsHistoryPartnerDropdownOpen(false);
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

  // Filtered converted leads in Active Settlements
  const filteredLeads = useMemo(() => {
    return leadsData.filter((item) => {
      const matchCategory = selectedCategory === "ALL" || item.partnerCategory === selectedCategory;
      
      // Multi-Select Partner ID filter (empty array matches ALL)
      const matchPartner =
        selectedPartnerIds.length === 0 || selectedPartnerIds.includes(item.partnerId);
      
      // Multi-Select Settlement Status filter (empty array matches ALL)
      const matchStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.settlementStatus);

      const matchChannel = selectedChannel === "ALL" || item.campaignSource === selectedChannel;
      const matchSearch =
        searchQuery === "" ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partnerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.leadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.bookingId && item.bookingId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.customerDestination.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchPartner && matchStatus && matchChannel && matchSearch;
    });
  }, [leadsData, selectedCategory, selectedPartnerIds, selectedStatuses, selectedChannel, searchQuery]);

  // Filtered Payout History for Auditing Log
  const filteredPayoutHistory = useMemo(() => {
    return payoutHistory.filter((item) => {
      const matchPartner =
        historySelectedPartnerIds.length === 0 || historySelectedPartnerIds.includes(item.partnerId);
      const matchCategory = historyCategoryFilter === "ALL" || item.partnerCategory === historyCategoryFilter;
      const matchMode = historyModeFilter === "ALL" || item.transferMode === historyModeFilter;
      const matchSearch =
        historySearchQuery === "" ||
        item.transactionId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.partnerName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.partnerId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.bookingId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.leadId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.beneficiaryBank.toLowerCase().includes(historySearchQuery.toLowerCase());

      return matchPartner && matchCategory && matchMode && matchSearch;
    });
  }, [payoutHistory, historySelectedPartnerIds, historyCategoryFilter, historyModeFilter, historySearchQuery]);

  // Payout History Summary Metrics
  const historyMetrics = useMemo(() => {
    const totalTransactions = payoutHistory.length;
    const totalAmountTransferred = payoutHistory.reduce((sum, p) => sum + (p.amountTransferredINR || 0), 0);
    const totalGrossGMV = payoutHistory.reduce((sum, p) => sum + (p.bookingValueINR || 0), 0);
    const totalCommissionRetained = payoutHistory.reduce((sum, p) => sum + (p.grossCommissionINR || 0), 0);
    const totalTdsRemitted = payoutHistory.reduce((sum, p) => sum + (p.tdsDeductionINR || 0), 0);

    return {
      totalTransactions,
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

  // Export CSV mock for active ledger
  const handleExportCSV = () => {
    const headers = [
      "Lead ID",
      "Booking ID",
      "Customer",
      "Partner ID",
      "Partner Name",
      "Category",
      "Booking Value (INR)",
      "Commission Rate (%)",
      "Gross Commission (INR)",
      "Partner Settlement (INR)",
      "Settlement Status",
      "Created At",
    ];
    const rows = filteredLeads.map((l) => [
      l.leadId,
      l.bookingId || "N/A",
      `"${l.customerName}"`,
      `"${l.partnerId}"`,
      `"${l.partnerName}"`,
      `"${l.partnerCategory}"`,
      l.bookingValueINR || 0,
      `${l.commissionPercent}%`,
      l.grossCommissionINR,
      l.partnerSettlementAmountINR,
      l.settlementStatus,
      l.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `partner_settlement_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onNotify) onNotify("Exported Partner Settlement Ledger CSV successfully!");
  };

  // Export CSV for Payout History Auditing Log
  const handleExportHistoryCSV = () => {
    const headers = [
      "Transaction ID (UTR)",
      "Transaction Date",
      "Partner ID",
      "Partner Name",
      "Category",
      "Booking ID",
      "Beneficiary Bank",
      "Transfer Mode",
      "Booking Value (INR)",
      "Platform Fee Retained (INR)",
      "TDS Deduction Sec 194-O (INR)",
      "Amount Transferred (INR)",
      "Audit Status",
      "Batch ID",
      "Remarks",
    ];
    const rows = filteredPayoutHistory.map((h) => [
      h.transactionId,
      `"${h.transactionDate}"`,
      `"${h.partnerId}"`,
      `"${h.partnerName}"`,
      `"${h.partnerCategory}"`,
      h.bookingId,
      `"${h.beneficiaryBank}"`,
      h.transferMode,
      h.bookingValueINR,
      h.grossCommissionINR,
      h.tdsDeductionINR,
      h.amountTransferredINR,
      h.status,
      h.batchId || "N/A",
      `"${h.remarks || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `partner_payout_history_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onNotify) onNotify("Exported Payout History Auditing Log CSV successfully!");
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
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 hover:border-slate-600 shadow-md"
            title="Download CSV report of settlement ledger"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Ledger CSV</span>
          </button>

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

            {(selectedCategory !== "ALL" ||
              selectedPartnerIds.length > 0 ||
              selectedStatuses.length > 0 ||
              selectedChannel !== "ALL" ||
              searchQuery !== "") && (
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedPartnerIds([]);
                  setSelectedStatuses([]);
                  setSelectedChannel("ALL");
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

      {/* Main Converted Leads & Settlement Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs">Converted Leads Settlement Ledger</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              Showing {filteredLeads.length} of {leadsData.length} records
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Click on <strong className="text-slate-200">"Trigger Payout"</strong> to execute instant partner bank transfer
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-[10px] text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer &amp; Trip</th>
                <th className="py-3.5 px-4">Partner Name &amp; ID</th>
                <th className="py-3.5 px-4 text-center">Category</th>
                <th className="py-3.5 px-4 text-right">Booking Value</th>
                <th className="py-3.5 px-4 text-center">Commission Percentage</th>
                <th className="py-3.5 px-4 text-right">Commission Amount</th>
                <th className="py-3.5 px-4 text-right">Partner Settlement</th>
                <th className="py-3.5 px-4 text-center">Status</th>
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

                  return (
                    <tr
                      key={item.leadId}
                      className="hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Booking ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                          <span>{item.bookingId || item.leadId}</span>
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
                        <div className="font-bold text-slate-200">{item.customerName}</div>
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
                            onClick={() => togglePartnerIdFilter(item.partnerId)}
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid / Settled
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Processing RTGS
                          </span>
                        )}
                        {isRefund && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Reversed / Refund
                          </span>
                        )}
                      </td>

                      {/* Action Trigger Button */}
                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handleTriggerPayout(item.leadId)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5 ml-auto"
                          >
                            <Send className="w-3 h-3" />
                            <span>Trigger Payout</span>
                          </button>
                        ) : isSettled ? (
                          <button
                            onClick={() => setSelectedReceiptLead(item)}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Historical Payouts</span>
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {historyMetrics.totalTransactions} Transfers
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Audited bank disbursements</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="text-[11px] font-bold">Total Transferred Volume</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ₹{historyMetrics.totalAmountTransferred.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-emerald-500/80 mt-0.5">Net escrow funds credited</div>
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

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Platform Fee Retained</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            ₹{historyMetrics.totalCommissionRetained.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Retained platform margins</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-300 mb-1">
            <span className="text-[11px] font-bold">TDS Remitted (194-O)</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300 font-mono">
            ₹{historyMetrics.totalTdsRemitted.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-indigo-400/70 mt-0.5">1% statutory tax deducted</div>
        </div>
      </div>

      {/* History Auditing Controls & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search by UTR or Partner */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by UTR Reference, Partner ID, Booking PNR..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filters & Export */}
          <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
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

            <button
              onClick={handleExportHistoryCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 shadow-sm"
              title="Download CSV of complete audited payout history"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export History CSV</span>
            </button>

            {(historySearchQuery !== "" ||
              historySelectedPartnerIds.length > 0 ||
              historyCategoryFilter !== "ALL" ||
              historyModeFilter !== "ALL") && (
              <button
                onClick={() => {
                  setHistorySearchQuery("");
                  setHistorySelectedPartnerIds([]);
                  setHistoryCategoryFilter("ALL");
                  setHistoryModeFilter("ALL");
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 underline font-semibold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auditing Table of Settled Payouts */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Settled Payouts Auditing &amp; Banking Reconciliation Log ({filteredPayoutHistory.length} Records)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3 h-3" />
            <span>All Transfers Acknowledged by Nodal Banking Gateway</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Transaction Reference ID (UTR)</th>
                <th className="py-3.5 px-4">Transaction Date &amp; Time</th>
                <th className="py-3.5 px-4">Partner Beneficiary &amp; ID</th>
                <th className="py-3.5 px-4 text-center">Category</th>
                <th className="py-3.5 px-4">Booking Reference</th>
                <th className="py-3.5 px-4 text-right">Gross GMV</th>
                <th className="py-3.5 px-4 text-right">Fee Retained</th>
                <th className="py-3.5 px-4 text-right">TDS (194-O)</th>
                <th className="py-3.5 px-4 text-right">Amount Transferred</th>
                <th className="py-3.5 px-4 text-center">Bank Status</th>
                <th className="py-3.5 px-4 text-right">Audit Action</th>
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
                  return (
                    <tr
                      key={item.transactionId}
                      className="hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Reference Transaction ID (UTR) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {item.transactionId}
                          </span>
                          <button
                            onClick={() => handleCopyUtr(item.transactionId)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Copy UTR Reference"
                          >
                            {isCopied ? (
                              <CheckCheck className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-slate-500 font-medium">
                            Mode: <strong className="text-slate-300">{item.transferMode}</strong>
                          </span>
                          {item.batchId && (
                            <span className="text-[9px] text-slate-600 font-mono">
                              • {item.batchId}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Transaction Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="font-mono text-xs">{item.transactionDate}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">
                          Immediate Escrow Cleared
                        </span>
                      </td>

                      {/* Partner Beneficiary & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {item.partnerName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                            {item.partnerId}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
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
                        <div className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                          ₹{item.amountTransferredINR.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Net Disbursed</div>
                      </td>

                      {/* Bank Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Reconciled
                        </span>
                      </td>

                      {/* Audit Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedAuditRecord(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto border border-slate-700"
                          title="Inspect Full Transaction Audit Advice"
                        >
                          <Receipt className="w-3 h-3 text-emerald-400" />
                          <span>Audit Advice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

  {/* Audit Record Voucher Modal (for Payout History tab) */}
  {selectedAuditRecord && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Receipt className="w-5 h-5" />
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

        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Disbursed via {selectedAuditRecord.transferMode}. Reconciled and electronically signed under GST Form GSTR-8.
          </span>
        </div>

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

  {/* Receipt / Settlement Voucher Modal */}
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
    </div>
  );
}
