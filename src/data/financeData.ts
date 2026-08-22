export interface PaymentMethodOption {
  id: "upi" | "cards" | "netbanking" | "wallet" | "paylater" | "corporate";
  name: string;
  subtext: string;
  badge?: string;
  icon: string;
  zeroFee: boolean;
  providers: { name: string; icon?: string; code?: string }[];
}

export interface GSTBreakdown {
  sacCode: string;
  hsnDescription: string;
  baseFare: number;
  convenienceFee: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  isInterstate: boolean;
  totalTax: number;
  grandTotal: number;
  gstinInputCreditApplicable: boolean;
}

export interface RefundPolicyMatrix {
  service: "flights" | "trains" | "buses" | "hotels" | "resorts" | "tours" | "pilgrimage" | "cabs" | "dining" | "corporate";
  cancellationWindow: string;
  deductionFormula: string;
  instantWalletBonus: string;
  bankCreditTimeline: string;
}

export interface FinancialReportSummary {
  period: string;
  totalGMV: number;
  totalBookings: number;
  platformCommissions: number;
  convenienceFeesCollected: number;
  partnerPayoutsDisbursed: number;
  gatewayProcessingFees: number;
  netOperatingMargin: number;
  gstCollectedPayable: number;
  tdsDeducted: number;
}

export const PAYMENT_GATEWAY_OPTIONS: PaymentMethodOption[] = [
  {
    id: "upi",
    name: "Instant UPI (Zero Surcharge)",
    subtext: "Google Pay, PhonePe, Paytm, BHIM, Cred or any UPI App",
    badge: "Most Popular",
    icon: "Smartphone",
    zeroFee: true,
    providers: [
      { name: "Google Pay", code: "gpay" },
      { name: "PhonePe", code: "phonepe" },
      { name: "Paytm UPI", code: "paytm" },
      { name: "Cred UPI", code: "cred" },
      { name: "BHIM UPI", code: "bhim" },
    ],
  },
  {
    id: "cards",
    name: "Credit / Debit Cards (RuPay, Visa, Master)",
    subtext: "Zero surcharge on RuPay Credit Cards on UPI & Debit Cards",
    badge: "No Cost EMI",
    icon: "CreditCard",
    zeroFee: true,
    providers: [
      { name: "RuPay (Zero Fee)", code: "rupay" },
      { name: "Visa", code: "visa" },
      { name: "Mastercard", code: "mastercard" },
      { name: "Diners Club / Amex", code: "amex" },
    ],
  },
  {
    id: "netbanking",
    name: "Net Banking (50+ Indian Banks)",
    subtext: "Direct secure bank gateway with SBI, HDFC, ICICI, Axis, Kotak",
    icon: "Building",
    zeroFee: true,
    providers: [
      { name: "State Bank of India (SBI)", code: "sbi" },
      { name: "HDFC Bank", code: "hdfc" },
      { name: "ICICI Bank", code: "icici" },
      { name: "Axis Bank", code: "axis" },
      { name: "Kotak Mahindra Bank", code: "kotak" },
      { name: "Punjab National Bank", code: "pnb" },
    ],
  },
  {
    id: "wallet",
    name: "BharatYatra Wallet & YatraCoins",
    subtext: "1-Click instant debit with extra 5% cashback coins",
    badge: "Fastest Checkout",
    icon: "Wallet",
    zeroFee: true,
    providers: [
      { name: "BharatYatra Cash", code: "bycash" },
      { name: "YatraCoins Loyalty Points", code: "bycoins" },
      { name: "Sodexo Meal Pass (Dining & Meals)", code: "sodexo" },
    ],
  },
  {
    id: "paylater",
    name: "Travel Now, Pay Later (0% EMI)",
    subtext: "Split into 3 or 6 monthly installments with instant approval",
    icon: "Calendar",
    zeroFee: true,
    providers: [
      { name: "Bajaj Finserv No-Cost EMI", code: "bajaj" },
      { name: "LazyPay PayLater", code: "lazypay" },
      { name: "Simpl 1-Tap", code: "simpl" },
      { name: "ZestMoney EMI", code: "zest" },
    ],
  },
  {
    id: "corporate",
    name: "Corporate Central Billing / GST Invoice",
    subtext: "Pre-approved company travel budget with automated GST ITC",
    badge: "18% GST Input Credit",
    icon: "Briefcase",
    zeroFee: true,
    providers: [
      { name: "Corporate Credit Line", code: "corp_credit" },
      { name: "Purchase Order (PO)", code: "po_invoice" },
    ],
  },
];

export const REFUND_POLICY_MATRIX: RefundPolicyMatrix[] = [
  {
    service: "flights",
    cancellationWindow: "Up to 2 hours before scheduled departure",
    deductionFormula: "Airline standard fare rule + ₹250 platform fee",
    instantWalletBonus: "Instant credit with +10% bonus coins",
    bankCreditTimeline: "2-4 banking business days to original source",
  },
  {
    service: "trains",
    cancellationWindow: "IRCTC standard rules (Up to chart preparation)",
    deductionFormula: "IRCTC clerkage (₹60 to ₹240 depending on class)",
    instantWalletBonus: "Instant 100% refund to BharatYatra Wallet in 30 seconds",
    bankCreditTimeline: "1-3 banking business days",
  },
  {
    service: "hotels",
    cancellationWindow: "Free cancellation up to 24 hours prior to check-in",
    deductionFormula: "100% full refund if cancelled > 24 hrs",
    instantWalletBonus: "Instant wallet credit with ₹200 bonus voucher",
    bankCreditTimeline: "2-3 banking business days",
  },
  {
    service: "buses",
    cancellationWindow: "Up to 4 hours before boarding time",
    deductionFormula: "10% deduction > 12h, 25% deduction 4-12h",
    instantWalletBonus: "Instant wallet refund with zero processing deduction",
    bankCreditTimeline: "1-2 banking business days",
  },
];

export const FINANCIAL_REPORT_MOCK: FinancialReportSummary = {
  period: "FY 2026-27 (Current Quarter Q2)",
  totalGMV: 846200000,
  totalBookings: 1428900,
  platformCommissions: 48950000,
  convenienceFeesCollected: 15840000,
  partnerPayoutsDisbursed: 762400000,
  gatewayProcessingFees: 5820000,
  netOperatingMargin: 58970000,
  gstCollectedPayable: 11662200,
  tdsDeducted: 7624000,
};
