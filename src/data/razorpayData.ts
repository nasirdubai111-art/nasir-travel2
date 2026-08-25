import { RazorpayGatewayConfig, RazorpayPaymentRail, RazorpayWebhookLog } from "../types";

export const RAZORPAY_CONFIG: RazorpayGatewayConfig = {
  keyId: "rzp_test_9kL2pQ8xYzA4B1",
  merchantName: "Travel Super Global India Pvt Ltd",
  themeColor: "#0c2340",
  mode: "test",
  autoCapture: true,
  currency: "INR",
  webhookSecret: "whsec_tsg_rzp_9847291039485721",
  routeSplitPercentage: 62,
  supportedRails: ["upi", "card", "netbanking", "wallet", "emi", "paylater"],
};

export interface TestCardPreset {
  id: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  network: "visa" | "mastercard" | "rupay" | "amex";
  type: "credit" | "debit";
  bank: string;
  outcome: "success" | "otp_required" | "insufficient_funds" | "declined";
}

export const TEST_CARDS: TestCardPreset[] = [
  {
    id: "card_hdfc_visa",
    name: "Aarav Sharma",
    number: "4111 2222 3333 4111",
    expiry: "12/28",
    cvv: "782",
    network: "visa",
    type: "credit",
    bank: "HDFC Bank Regalia Gold",
    outcome: "success",
  },
  {
    id: "card_sbi_rupay",
    name: "Aarav Sharma",
    number: "6071 5200 1234 5678",
    expiry: "09/29",
    cvv: "331",
    network: "rupay",
    type: "debit",
    bank: "SBI Global RuPay Platinum",
    outcome: "success",
  },
  {
    id: "card_icici_mc",
    name: "Aarav Sharma",
    number: "5123 4567 8901 2345",
    expiry: "04/27",
    cvv: "910",
    network: "mastercard",
    type: "credit",
    bank: "ICICI Sapphiro",
    outcome: "otp_required",
  },
  {
    id: "card_axis_amex",
    name: "Aarav Sharma",
    number: "3782 8224 6310 005",
    expiry: "08/27",
    cvv: "4421",
    network: "amex",
    type: "credit",
    bank: "Axis Magnus Burgundy",
    outcome: "success",
  },
];

export const POPULAR_UPI_APPS = [
  { id: "gpay", name: "Google Pay", handle: "@okaxis", icon: "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=100&auto=format&fit=crop&q=80", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "phonepe", name: "PhonePe", handle: "@ybl", icon: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "paytm", name: "Paytm UPI", handle: "@paytm", icon: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { id: "cred", name: "CRED UPI", handle: "@axiscred", icon: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80", color: "bg-slate-900 text-amber-300 border-slate-700" },
  { id: "bhim", name: "BHIM NPCI", handle: "@upi", icon: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=100&auto=format&fit=crop&q=80", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
];

export const POPULAR_BANKS = [
  { id: "HDFC", name: "HDFC Bank", code: "HDFC", popular: true, logo: "🏦" },
  { id: "ICICI", name: "ICICI Bank", code: "ICIC", popular: true, logo: "🏛️" },
  { id: "SBI", name: "State Bank of India", code: "SBIN", popular: true, logo: "🇮🇳" },
  { id: "AXIS", name: "Axis Bank", code: "UTIB", popular: true, logo: "🏢" },
  { id: "KOTAK", name: "Kotak Mahindra Bank", code: "KKBK", popular: true, logo: "🪙" },
  { id: "PNB", name: "Punjab National Bank", code: "PUNB", popular: true, logo: "🏪" },
  { id: "BOB", name: "Bank of Baroda", code: "BARB", popular: false, logo: "🏦" },
  { id: "INDUS", name: "IndusInd Bank", code: "INDB", popular: false, logo: "🏛️" },
  { id: "YES", name: "Yes Bank", code: "YESB", popular: false, logo: "🏢" },
  { id: "UNION", name: "Union Bank of India", code: "UBIN", popular: false, logo: "🏪" },
  { id: "CANARA", name: "Canara Bank", code: "CNRB", popular: false, logo: "🏦" },
  { id: "IDFC", name: "IDFC FIRST Bank", code: "IDFB", popular: false, logo: "🏛️" },
];

export const WALLETS_LIST = [
  { id: "amazonpay", name: "Amazon Pay Balance", cashback: "₹50 Instant Cashback", icon: "🛍️", minAmount: 1 },
  { id: "mobikwik", name: "MobiKwik Zip & SuperCash", cashback: "Up to 5% SuperCash", icon: "⚡", minAmount: 100 },
  { id: "airtel", name: "Airtel Payments Bank", cashback: "Flat ₹40 Back on first trip", icon: "🔴", minAmount: 200 },
  { id: "freecharge", name: "Freecharge PayLater & Wallet", cashback: "10% Cashback", icon: "🔋", minAmount: 50 },
  { id: "olamoney", name: "Ola Money Postpaid+", cashback: "Credit limit auto-deduct", icon: "🚖", minAmount: 100 },
  { id: "yatracash", name: "Yatra Super Cash Balance", cashback: "100% Usable on Travel", icon: "✈️", minAmount: 0 },
];

export const EMI_TENURES = [
  { months: 3, interestRate: 0, label: "3 Months No-Cost EMI", monthlyCalc: (amt: number) => Math.round(amt / 3), note: "Zero extra charges" },
  { months: 6, interestRate: 0, label: "6 Months No-Cost EMI", monthlyCalc: (amt: number) => Math.round(amt / 6), note: "Zero extra charges • Subsidized by Bank" },
  { months: 9, interestRate: 13.5, label: "9 Months Low-Cost EMI", monthlyCalc: (amt: number) => Math.round((amt * 1.06) / 9), note: "13.5% p.a. standard bank interest" },
  { months: 12, interestRate: 14.0, label: "12 Months Low-Cost EMI", monthlyCalc: (amt: number) => Math.round((amt * 1.08) / 12), note: "14.0% p.a. easy monthly installments" },
];

export const PAYLATER_PROVIDERS = [
  { id: "simpl", name: "Simpl Pay in 3", creditLimit: "₹25,000", tag: "1-Tap Checkout", logo: "⚡" },
  { id: "lazypay", name: "LazyPay (PayU)", creditLimit: "₹40,000", tag: "Pay next month 15th", logo: "🛋️" },
  { id: "flexipay", name: "Razorpay FlexiPay (HDFC)", creditLimit: "₹60,000", tag: "Pre-approved by HDFC", logo: "🏦" },
  { id: "zest", name: "ZestMoney / DMI", creditLimit: "₹1,00,000", tag: "0% Interest for 30 days", logo: "🚀" },
];

export const INITIAL_RAZORPAY_WEBHOOKS: RazorpayWebhookLog[] = [
  {
    id: "wh_log_901",
    event: "payment.captured",
    orderId: "order_O6W8819231",
    paymentId: "pay_Pk9128374829",
    amount: 439900,
    timestamp: "2026-08-24 14:12:05",
    signatureVerified: true,
    payload: {
      entity: "event",
      account_id: "acc_TSG_India_9981",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: "pay_Pk9128374829",
            entity: "payment",
            amount: 439900,
            currency: "INR",
            status: "captured",
            order_id: "order_O6W8819231",
            method: "upi",
            vpa: "aarav@oksbi",
            bank: null,
            wallet: null,
            fee: 0,
            tax: 0,
            acquirer_data: { rrn: "623849182391", upi_transaction_id: "NPCI/UPI/7728192" },
          },
        },
      },
    },
  },
  {
    id: "wh_log_902",
    event: "order.paid",
    orderId: "order_O6W8819231",
    paymentId: "pay_Pk9128374829",
    amount: 439900,
    timestamp: "2026-08-24 14:12:06",
    signatureVerified: true,
    payload: {
      entity: "event",
      event: "order.paid",
      payload: {
        order: {
          entity: {
            id: "order_O6W8819231",
            amount_paid: 439900,
            amount_due: 0,
            currency: "INR",
            receipt: "RCP-FLT-2026-081",
            status: "paid",
          },
        },
      },
    },
  },
  {
    id: "wh_log_903",
    event: "settlement.processed",
    orderId: "order_O6W7612091",
    paymentId: "pay_M9812039841",
    amount: 1845000,
    timestamp: "2026-08-24 06:00:00",
    signatureVerified: true,
    payload: {
      entity: "event",
      event: "settlement.processed",
      payload: {
        settlement: {
          id: "setl_9182736412",
          amount: 1845000,
          status: "processed",
          utr: "RBI9984719283741",
        },
      },
    },
  },
];
