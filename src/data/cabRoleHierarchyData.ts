import {
  CabRoleTier,
  CabSystemAuditLog,
  CabFinancialReconciliation,
} from "../types/pilgrimagePipelineTypes";

export interface CabCustomerUser {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  frequentRoutes: string[];
}

export const SEED_CAB_CUSTOMERS: CabCustomerUser[] = [
  {
    customerId: "CUST-IN-55102",
    name: "Aman Singhania",
    phone: "+91 98110 44219",
    email: "aman.singhania@techcorp.com",
    city: "New Delhi",
    frequentRoutes: ["Delhi to Agra Expressway", "Delhi to Jaipur NH48"],
  },
  {
    customerId: "CUST-IN-33211",
    name: "Pooja Desai",
    phone: "+91 98200 99411",
    email: "pooja.desai@investmumbai.in",
    city: "Mumbai",
    frequentRoutes: ["Mumbai to Pune Expressway", "BKC to Mumbai Airport T2"],
  },
  {
    customerId: "CUST-IN-88912",
    name: "Vikramaditya Roy",
    phone: "+91 94330 11290",
    email: "v.roy@kolkatadesign.org",
    city: "Bengaluru",
    frequentRoutes: ["Bengaluru to Mysore Expressway", "KIAL Airport Transfer"],
  },
];

export const SEED_CAB_SYSTEM_AUDIT_LOGS: CabSystemAuditLog[] = [
  {
    logId: "AUD-CAB-9901",
    timestamp: "2026-09-17T11:45:10Z",
    actorRole: "super_admin",
    actorId: "SA-ROOT-001",
    actorName: "Chief Risk & Compliance Officer",
    action: "PAYMENT_SPLIT_RELEASED",
    entityType: "payment",
    entityId: "TX-CB-9901",
    details: "Released escrow payout of ₹8,853.60 to Bharat FastCab Premier Fleet (HDFC Bank A/C 9901-4412). Platform brokerage 10% (₹1,041.60) retained.",
    ipAddress: "10.0.4.19 (VPC Private Subnet)",
    cryptoChecksum: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    logId: "AUD-CAB-9902",
    timestamp: "2026-09-17T11:30:22Z",
    actorRole: "admin",
    actorId: "ADM-OPS-DELHI",
    actorName: "National Dispatch Controller (North Zone)",
    action: "DISPATCH_CREATED",
    entityType: "cab_booking",
    entityId: "CB-BK-2026-101",
    details: "Approved inter-state toll exemption & assigned primary vehicle CAB-INNOVA-001 (Toyota Innova Crysta, DL-01-TA-4491) to Aman Singhania.",
    ipAddress: "14.139.60.201",
    cryptoChecksum: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    logId: "AUD-CAB-9903",
    timestamp: "2026-09-17T10:14:00Z",
    actorRole: "super_admin",
    actorId: "SA-ROOT-001",
    actorName: "Platform Systems Architect",
    action: "SECURITY_ALERT",
    entityType: "cab",
    entityId: "CAB-MERC-003",
    details: "Automated speed-telemetry tamper check verified. Zero GPS spoofing detected across Mumbai-Pune expressway telemetry relay.",
    ipAddress: "10.0.1.55",
    cryptoChecksum: "SHA256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  },
  {
    logId: "AUD-CAB-9904",
    timestamp: "2026-09-17T09:05:41Z",
    actorRole: "admin",
    actorId: "ADM-COMPLY-04",
    actorName: "Transport Department Liason",
    action: "OPERATOR_KYC_VERIFIED",
    entityType: "rate_card",
    entityId: "PTR-FLEET-DELHI-01",
    details: "All India Tourist Permit (AITP) renewed with Parivahan Vahan 4.0 database. Fitness certificate valid till August 2028.",
    ipAddress: "164.100.128.11",
    cryptoChecksum: "SHA256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  },
  {
    logId: "AUD-CAB-9905",
    timestamp: "2026-09-17T08:20:15Z",
    actorRole: "operator",
    actorId: "PTR-FLEET-DELHI-01",
    actorName: "Fleet Dispatch Manager",
    action: "DRIVER_ASSIGNED",
    entityType: "driver",
    entityId: "DRV-DEL-091",
    details: "Assigned Harpreet Singh (Rating: 4.95) to vehicle DL-01-TA-4491 after routine pre-trip alcohol breathalyzer check pass.",
    ipAddress: "103.21.124.99",
    cryptoChecksum: "SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
  },
];

export const SEED_CAB_FINANCIAL_RECONCILIATION: CabFinancialReconciliation[] = [
  {
    reconciliationId: "REC-CB-2026-001",
    bookingId: "CB-BK-2026-101",
    cabId: "CAB-INNOVA-001",
    registrationNumber: "DL-01-TA-4491",
    partnerId: "PTR-FLEET-DELHI-01",
    partnerName: "Bharat FastCab Premier Fleet",
    totalCustomerPaid: 10416,
    operatorNetEarnings: 8853.6, // 85%
    platformTakeRate: 1041.6, // 10%
    gstTdsDeduction: 520.8, // 5%
    driverIncentiveBonus: 250,
    razorpayTransferId: "trf_rzp_live_9981244",
    razorpayPayoutBatch: "BATCH-HDFC-20260917-01",
    escrowStatus: "transferred_to_operator_bank",
    clearedAt: "2026-09-17T11:45:00Z",
  },
  {
    reconciliationId: "REC-CB-2026-002",
    bookingId: "CB-BK-2026-102",
    cabId: "CAB-DZIRE-002",
    registrationNumber: "DL-02-TA-8812",
    partnerId: "PTR-FLEET-DELHI-01",
    partnerName: "Bharat FastCab Premier Fleet",
    totalCustomerPaid: 3220,
    operatorNetEarnings: 2737.0,
    platformTakeRate: 322.0,
    gstTdsDeduction: 161.0,
    driverIncentiveBonus: 100,
    razorpayTransferId: "trf_rzp_live_9981245",
    razorpayPayoutBatch: "BATCH-HDFC-20260917-01",
    escrowStatus: "transferred_to_operator_bank",
    clearedAt: "2026-09-17T11:00:00Z",
  },
  {
    reconciliationId: "REC-CB-2026-003",
    bookingId: "CB-BK-2026-103",
    cabId: "CAB-MERC-003",
    registrationNumber: "MH-01-EE-0099",
    partnerId: "PTR-LUXURY-MUMBAI",
    partnerName: "Royal Chauffeur Drive India",
    totalCustomerPaid: 14850,
    operatorNetEarnings: 12622.5,
    platformTakeRate: 1485.0,
    gstTdsDeduction: 742.5,
    driverIncentiveBonus: 500,
    razorpayTransferId: "trf_rzp_live_9981249",
    razorpayPayoutBatch: "BATCH-AXIS-20260917-02",
    escrowStatus: "funds_escrowed",
    clearedAt: "Pending Trip Completion",
  },
];
