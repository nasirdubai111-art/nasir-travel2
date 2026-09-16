export interface SubscriptionPlanOption {
  id: string;
  name: string;
  targetAudience: "partner" | "customer";
  badge: string;
  tagline: string;
  billingPeriod: "1 Year" | "6 Months" | "1 Month";
  annualFeeINR: number;
  monthlyFeeINR?: number;
  gstRate: number; // e.g. 0.18
  recommended?: boolean;
  features: string[];
  entitlements: {
    commissionRate?: string;
    listingsOrTrips: string;
    support: string;
    payoutOrDiscount: string;
  };
}

export interface SubscriptionPaymentReceipt {
  platform: string;
  partnerOrCustomerName: string;
  userOrPartnerId: string;
  subscriptionPlan: string;
  subscriptionPeriod: string;
  subscriptionFee: number;
  taxGstRate: number;
  taxGstAmount: number;
  totalPaid: number;
  paymentMethod: string;
  paymentMethodCategory: "UPI" | "Credit Card" | "Debit Card" | "QR Code" | "NetBanking";
  transactionId: string;
  paymentDateTime: string;
  paymentStatus: "PAID";
  receiptNumber: string;
  invoiceNumber: string;
  nextRenewalDate: string;
  verificationCode: string;
  qrVerificationUrl: string;
  notes?: string;
}

export const SUBSCRIPTION_PLAN_OPTIONS: SubscriptionPlanOption[] = [
  {
    id: "plan_premium_partner",
    name: "Premium Partner",
    targetAudience: "partner",
    badge: "Most Popular for Hoteliers & Fleet Operators",
    tagline: "Uncapped bookings, lowest commission tier, priority search ranking & dedicated account desk.",
    billingPeriod: "1 Year",
    annualFeeINR: 25000,
    monthlyFeeINR: 2500,
    gstRate: 0.18,
    recommended: true,
    features: [
      "Zero commission on first 50 bookings every month",
      "Flat 8.5% reduced platform commission (saves 40% vs basic)",
      "Featured Badge & Top-3 placement in City Search results",
      "Unlimited inventory & real-time channel manager API sync",
      "T+1 Next-Day bank settlement into Current Account",
      "Automated Monthly GST Tax Invoice with Section 31 ITC compliance",
      "Dedicated Relationship Manager & 24x7 Priority Support Desk",
    ],
    entitlements: {
      commissionRate: "8.5% (Lowest Tier)",
      listingsOrTrips: "Unlimited Listings",
      support: "24x7 Dedicated Manager",
      payoutOrDiscount: "T+1 Daily Payouts",
    },
  },
  {
    id: "plan_standard_partner",
    name: "Standard Partner",
    targetAudience: "partner",
    badge: "Independent Stays & Regional Cabs",
    tagline: "Essential digital tools to grow direct bookings with automated billing.",
    billingPeriod: "1 Year",
    annualFeeINR: 10000,
    monthlyFeeINR: 1100,
    gstRate: 0.18,
    features: [
      "Up to 25 verified property / fleet listings",
      "12.5% platform commission on confirmed guest bookings",
      "Interactive 30-day availability calendar & surge pricing",
      "Direct owner replies on verified guest reviews",
      "T+2 Rolling settlement into registered bank account",
      "Standard email & chat ticketing support",
    ],
    entitlements: {
      commissionRate: "12.5% Standard",
      listingsOrTrips: "25 Active Listings",
      support: "Priority Chat Support",
      payoutOrDiscount: "T+2 Rolling Payouts",
    },
  },
  {
    id: "plan_enterprise_partner",
    name: "Elite Enterprise Partner",
    targetAudience: "partner",
    badge: "State Corporations & National Chains",
    tagline: "Multi-branch architecture, custom SLA contracts and tailored API integrations.",
    billingPeriod: "1 Year",
    annualFeeINR: 50000,
    monthlyFeeINR: 5000,
    gstRate: 0.18,
    features: [
      "Multi-city branch management with role-based access control",
      "Custom negotiated commission structure (as low as 4%)",
      "Custom GDS & PMS webhook integrations (Opera, IDS, Cloudbeds)",
      "Instant T+0 same-day settlement via RBI RTGS",
      "Enterprise SLA assurance with 99.99% gateway uptime guarantee",
      "Dedicated Senior Key Account Director",
    ],
    entitlements: {
      commissionRate: "Custom Negotiated (4-6%)",
      listingsOrTrips: "Uncapped Multi-City",
      support: "Director-Level Escalation",
      payoutOrDiscount: "T+0 Same Day RTGS",
    },
  },
  {
    id: "plan_prime_traveler",
    name: "Prime Traveler Pass",
    targetAudience: "customer",
    badge: "Smart Yatris & Frequent Flyers",
    tagline: "Zero convenience fees, free seat selection, and complimentary airport/railway transfers.",
    billingPeriod: "1 Year",
    annualFeeINR: 1999,
    monthlyFeeINR: 249,
    gstRate: 0.18,
    features: [
      "Zero convenience fees on all Flight, Train & Bus bookings",
      "Free seat selection & priority check-in assistance",
      "Complimentary cab transfer voucher (Up to ₹500/yr)",
      "2x Yatra Coins on all hotel & holiday bookings",
      "Free cancellation protection on 2 trips per year",
      "Exclusive access to Secret Deal hotel discounts",
    ],
    entitlements: {
      commissionRate: "Zero Convenience Fee",
      listingsOrTrips: "Uncapped Personal Trips",
      support: "VIP Traveler Desk",
      payoutOrDiscount: "2x Yatra Coins & Vouchers",
    },
  },
];

// Sample Initial Benchmark Receipt (matches the user specification exactly)
export const INITIAL_SUBSCRIPTION_RECEIPT: SubscriptionPaymentReceipt = {
  platform: "BharatYatra Travel Platform",
  partnerOrCustomerName: "Nasir Travel Services",
  userOrPartnerId: "PTR-2026-00125",
  subscriptionPlan: "Premium Partner",
  subscriptionPeriod: "1 Year",
  subscriptionFee: 25000,
  taxGstRate: 0.18,
  taxGstAmount: 4500,
  totalPaid: 29500,
  paymentMethod: "UPI (Google Pay / NPCI AutoPay)",
  paymentMethodCategory: "UPI",
  transactionId: "TXN20260916000125",
  paymentDateTime: "16 Sep 2026, 12:45 PM",
  paymentStatus: "PAID",
  receiptNumber: "REC-2026-00125",
  invoiceNumber: "INV-2026-00125",
  nextRenewalDate: "16 Sep 2027",
  verificationCode: "BY-QC-8842-TXN20260916000125",
  qrVerificationUrl: "https://bharatyatra.in/verify-receipt/REC-2026-00125",
  notes: "Subscription activated for 1 Year. Entitlements applied to partner account immediately.",
};

// Past Receipts Storage
export const INITIAL_SUBSCRIPTION_RECEIPTS_HISTORY: SubscriptionPaymentReceipt[] = [
  INITIAL_SUBSCRIPTION_RECEIPT,
  {
    platform: "BharatYatra Travel Platform",
    partnerOrCustomerName: "Nasir Travel Services",
    userOrPartnerId: "PTR-2026-00125",
    subscriptionPlan: "Standard Partner",
    subscriptionPeriod: "1 Year",
    subscriptionFee: 10000,
    taxGstRate: 0.18,
    taxGstAmount: 1800,
    totalPaid: 11800,
    paymentMethod: "Credit Card (HDFC Corporate Visa •••• 8821)",
    paymentMethodCategory: "Credit Card",
    transactionId: "TXN20250916000084",
    paymentDateTime: "16 Sep 2025, 10:15 AM",
    paymentStatus: "PAID",
    receiptNumber: "REC-2025-00084",
    invoiceNumber: "INV-2025-00084",
    nextRenewalDate: "16 Sep 2026",
    verificationCode: "BY-QC-7721-TXN20250916000084",
    qrVerificationUrl: "https://bharatyatra.in/verify-receipt/REC-2025-00084",
    notes: "Prior year annual subscription (Successfully renewed to Premium Partner).",
  },
];

/**
 * Generate a secure, non-sensitive verification payload for the QR Code.
 * CRITICAL RULE: Must NOT contain any card numbers, CVVs, or UPI credentials.
 */
export function generateReceiptQrPayload(receipt: SubscriptionPaymentReceipt): string {
  return JSON.stringify({
    app: "BharatYatra Travel Platform",
    service: "ONLINE_SUBSCRIPTION_VERIFICATION",
    receiptNo: receipt.receiptNumber,
    invoiceNo: receipt.invoiceNumber,
    transactionId: receipt.transactionId,
    partnerOrCustomer: receipt.partnerOrCustomerName,
    partnerId: receipt.userOrPartnerId,
    subscriptionPlan: receipt.subscriptionPlan,
    subscriptionPeriod: receipt.subscriptionPeriod,
    baseFee: receipt.subscriptionFee,
    taxGst: receipt.taxGstAmount,
    amountPaid: receipt.totalPaid,
    paymentDate: receipt.paymentDateTime.split(",")[0],
    paymentStatus: "VERIFIED",
    nextRenewalDate: receipt.nextRenewalDate,
    verificationCode: receipt.verificationCode,
    authority: "BharatYatra Technologies Pvt Ltd (GSTIN: 07AAACB4410R1ZP)",
    verifiedTimestamp: new Date().toISOString(),
  });
}
