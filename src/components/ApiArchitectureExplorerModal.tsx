import React, { useState } from "react";
import {
  Code2,
  Terminal,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  Copy,
  Check,
  Send,
  Loader2,
  Layers,
  ArrowRight,
  Server,
  Globe,
  Database,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Cpu,
  KeyRound,
  FileCode2,
  Building2,
  Ticket,
  CreditCard,
  Percent,
  Landmark,
  Radio,
  X,
} from "lucide-react";

interface ApiArchitectureExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiEndpointDef {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  category: string;
  title: string;
  description: string;
  rbac: "PUBLIC" | "CUSTOMER" | "PARTNER" | "ADMIN" | "SUPER_ADMIN";
  defaultBody?: any;
  defaultHeaders?: Record<string, string>;
  responseSample: any;
  serviceNamespace?: string;
}

export const API_ENDPOINTS: ApiEndpointDef[] = [
  // 1. Authentication APIs
  {
    id: "auth-register",
    method: "POST",
    path: "/api/v1/auth/register",
    category: "1. Authentication APIs",
    title: "Register New Account",
    description: "Registers a customer, partner, or corporate user with phone OTP verification.",
    rbac: "PUBLIC",
    defaultBody: {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
      role: "CUSTOMER",
      password: "StrongPassword@2026",
    },
    responseSample: {
      success: true,
      message: "Registration successful. OTP sent for phone verification.",
      user: { id: "usr_1029", name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "+91 98765 43210", role: "CUSTOMER" },
      token: "jwt_by_usr_1029_1771829102",
      refreshToken: "rt_by_usr_1029_1771829102",
    },
  },
  {
    id: "auth-login",
    method: "POST",
    path: "/api/v1/auth/login",
    category: "1. Authentication APIs",
    title: "User & Partner Login",
    description: "Authenticates credentials and returns JWT bearer token and refresh token.",
    rbac: "PUBLIC",
    defaultBody: {
      identifier: "aarav.sharma@example.com",
      password: "StrongPassword@2026",
      role: "CUSTOMER",
    },
    responseSample: {
      success: true,
      token: "jwt_by_usr_cust_001_1771829102",
      refreshToken: "rt_by_usr_cust_001_1771829102",
      expiresIn: 86400,
      user: { id: "usr_cust_001", name: "Aarav Sharma", role: "CUSTOMER" },
    },
  },
  {
    id: "auth-logout",
    method: "POST",
    path: "/api/v1/auth/logout",
    category: "1. Authentication APIs",
    title: "Revoke Session & Logout",
    description: "Invalidates active JWT token and clears server-side Redis session cache.",
    rbac: "CUSTOMER",
    defaultBody: { token: "jwt_by_usr_cust_001_1771829102" },
    responseSample: { success: true, message: "Session revoked and token invalidated successfully" },
  },
  {
    id: "auth-refresh",
    method: "POST",
    path: "/api/v1/auth/refresh",
    category: "1. Authentication APIs",
    title: "Refresh Access Token",
    description: "Exchanges valid refresh token for a new 24-hour access JWT token.",
    rbac: "PUBLIC",
    defaultBody: { refreshToken: "rt_by_usr_cust_001_1771829102" },
    responseSample: { success: true, token: "jwt_by_refreshed_1771829102", expiresIn: 86400 },
  },
  {
    id: "auth-forgot-password",
    method: "POST",
    path: "/api/v1/auth/forgot-password",
    category: "1. Authentication APIs",
    title: "Forgot Password Trigger",
    description: "Generates cryptographic 6-digit reset token sent via DLT SMS.",
    rbac: "PUBLIC",
    defaultBody: { emailOrPhone: "aarav.sharma@example.com" },
    responseSample: { success: true, message: "Password reset OTP dispatched", otpExpiresInSeconds: 300 },
  },
  {
    id: "auth-reset-password",
    method: "POST",
    path: "/api/v1/auth/reset-password",
    category: "1. Authentication APIs",
    title: "Reset Password via OTP",
    description: "Validates OTP and updates password hash.",
    rbac: "PUBLIC",
    defaultBody: { emailOrPhone: "aarav.sharma@example.com", otp: "582910", newPassword: "NewSecretPassword@2026" },
    responseSample: { success: true, message: "Password has been successfully reset" },
  },
  {
    id: "auth-verify-otp",
    method: "POST",
    path: "/api/v1/auth/verify-otp",
    category: "1. Authentication APIs",
    title: "Verify Phone/Email OTP",
    description: "Verifies Aadhaar Digilocker and mobile authentication OTP.",
    rbac: "PUBLIC",
    defaultBody: { phone: "+91 98765 43210", otp: "582910", purpose: "LOGIN" },
    responseSample: { success: true, verified: true, kycState: "AADHAAR_DIGILOCKER_VERIFIED" },
  },
  {
    id: "auth-mfa-verify",
    method: "POST",
    path: "/api/v1/auth/mfa/verify",
    category: "1. Authentication APIs",
    title: "MFA 2FA Verification",
    description: "Verifies TOTP authenticator code for privileged financial operations.",
    rbac: "CUSTOMER",
    defaultBody: { code: "918234", mfaToken: "mfa_req_981249" },
    responseSample: { success: true, mfaVerified: true, elevatedSessionToken: "BY-MFA-OK-1771829102" },
  },
  {
    id: "auth-me",
    method: "GET",
    path: "/api/v1/auth/me",
    category: "1. Authentication APIs",
    title: "Get Current Authenticated User",
    description: "Returns profile, role, permissions, wallet balance, and Yatra Coins.",
    rbac: "CUSTOMER",
    defaultHeaders: { Authorization: "Bearer BY-USER-SESSION" },
    responseSample: {
      success: true,
      user: { id: "usr_cust_001", name: "Aarav Sharma", email: "aarav.sharma@example.com", role: "CUSTOMER", walletBalance: 2450, yatraCoins: 480 },
    },
  },
  {
    id: "auth-namespace-partner",
    method: "POST",
    path: "/api/v1/auth/partner/login",
    category: "1. Authentication APIs",
    title: "Partner Namespace Login",
    description: "Isolated authentication tunnel for hotel, bus, and flight partners.",
    rbac: "PARTNER",
    defaultBody: { identifier: "ops@zingbus.com", password: "PartnerSecret@2026" },
    responseSample: { success: true, namespace: "partner", session: "partner_sess_1771829102" },
  },

  // 2. Admin API — Secure & Hidden
  {
    id: "admin-auth-login",
    method: "POST",
    path: "/api/v1/admin/auth/login",
    category: "2. Admin API — Secure & Hidden",
    title: "Admin Root Login",
    description: "Encrypted gateway for platform administrators with hardware token.",
    rbac: "SUPER_ADMIN",
    defaultBody: { pin: "2026", adminUsername: "root_ops" },
    responseSample: { success: true, token: "BY-SEC-ADMIN-1771829102", role: "SUPER_ADMIN" },
  },
  {
    id: "admin-dashboard",
    method: "GET",
    path: "/api/v1/admin/dashboard",
    category: "2. Admin API — Secure & Hidden",
    title: "Admin Platform Dashboard",
    description: "Aggregates real-time GMV, active inventory, gateway uptime, and partner metrics.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    responseSample: {
      success: true,
      metrics: { totalGmvINR: 846200000, monthlyBookings: 42890, activeOperators: 4, gatewaySuccessRate: "99.84%" },
    },
  },
  {
    id: "admin-users",
    method: "GET",
    path: "/api/v1/admin/users",
    category: "2. Admin API — Secure & Hidden",
    title: "List All Users & Roles",
    description: "Paginated user ledger with RBAC permission overrides.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    responseSample: { success: true, count: 3, users: [{ id: "usr_cust_001", name: "Aarav Sharma", role: "CUSTOMER" }] },
  },
  {
    id: "admin-operators",
    method: "GET",
    path: "/api/v1/admin/operators",
    category: "2. Admin API — Secure & Hidden",
    title: "Operator Verification Queue",
    description: "Inspects operator KYC records and commercial subscriptions.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    responseSample: {
      success: true,
      operators: [{ id: "op_bus_zingbus", businessName: "Zingbus", kycStatus: "APPROVED", rating: 4.86 }],
    },
  },
  {
    id: "admin-operators-approve",
    method: "PATCH",
    path: "/api/v1/admin/operators/op_cab_delhi_yatra/approve",
    category: "2. Admin API — Secure & Hidden",
    title: "Approve Operator KYC",
    description: "Activates operator inventory for live public booking feeds.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    responseSample: { success: true, message: "Operator approved and live on public search" },
  },
  {
    id: "admin-operators-reject",
    method: "PATCH",
    path: "/api/v1/admin/operators/op_cab_delhi_yatra/reject",
    category: "2. Admin API — Secure & Hidden",
    title: "Reject Operator KYC",
    description: "Rejects operator application with statutory compliance note.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    defaultBody: { reason: "RTO permits expired; commercial permit re-upload requested." },
    responseSample: { success: true, message: "Operator rejected. Notification sent to partner." },
  },
  {
    id: "admin-audit-logs",
    method: "GET",
    path: "/api/v1/admin/audit-logs",
    category: "2. Admin API — Secure & Hidden",
    title: "Immutable Security Audit Logs",
    description: "Tamper-proof log trail capturing all financial and administrative actions.",
    rbac: "SUPER_ADMIN",
    defaultHeaders: { Authorization: "Bearer BY-SEC-ADMIN-2026" },
    responseSample: { success: true, auditLogs: [{ id: "AUD-001", event: "API_GATEWAY_V1_INIT", actor: "SYSTEM" }] },
  },

  // 3. Operator APIs
  {
    id: "op-register",
    method: "POST",
    path: "/api/v1/operators/register",
    category: "3. Operator APIs",
    title: "Register New Operator",
    description: "Self-service onboarding for bus fleets, hoteliers, cab drivers, and homestays.",
    rbac: "PUBLIC",
    defaultBody: {
      businessName: "Kashmir Shalimar Houseboats",
      serviceCategory: "houseboats",
      contactPerson: "Bashir Ahmed",
      email: "info@shalimarhb.in",
      phone: "+91 94190 22334",
      commissionPlan: "MODEL_A",
    },
    responseSample: { success: true, message: "Operator onboarding initiated. Upload regulatory documents." },
  },
  {
    id: "op-me",
    method: "GET",
    path: "/api/v1/operators/me",
    category: "3. Operator APIs",
    title: "Get Operator Profile",
    description: "Fetches partner business details, commission rates, and active tier.",
    rbac: "PARTNER",
    defaultHeaders: { Authorization: "Bearer BY-PTR-SESSION" },
    responseSample: { success: true, operator: { id: "op_bus_zingbus", businessName: "Zingbus", rating: 4.86 } },
  },
  {
    id: "op-documents",
    method: "POST",
    path: "/api/v1/operators/documents",
    category: "3. Operator APIs",
    title: "Upload Statutory Documents",
    description: "Uploads GSTIN, PAN, RTO Stage Carriage permit, FSSAI, or Port registration.",
    rbac: "PARTNER",
    defaultBody: { docType: "GST_CERTIFICATE", documentNumber: "07AAACB4410R1ZP" },
    responseSample: { success: true, message: "Document verified via OCR, pending admin sign" },
  },
  {
    id: "op-service-bus",
    method: "GET",
    path: "/api/v1/bus-operators/overview",
    category: "3. Operator APIs",
    title: "Bus Operator Overview",
    description: "Bus fleet management, schedule dispatcher, and manifest summary.",
    rbac: "PARTNER",
    responseSample: { success: true, service: "bus-operators", activeListings: 14, liveTripsCount: 6 },
  },
  {
    id: "op-service-hotel",
    method: "GET",
    path: "/api/v1/hotel-operators/inventory",
    category: "3. Operator APIs",
    title: "Hotel Inventory & Rates",
    description: "Direct CRS inventory, seasonal tariffs, and room allotments.",
    rbac: "PARTNER",
    responseSample: { success: true, service: "hotel-operators", inventory: [{ id: "hotel-inv-01", baseRate: 3800 }] },
  },

  // 4. Search & Availability APIs
  {
    id: "search-unified",
    method: "GET",
    path: "/api/v1/search?from=Delhi&to=Mumbai&date=2026-08-28",
    category: "4. Search & Availability APIs",
    title: "Federated Multi-Modal Search",
    description: "Queries all travel services simultaneously for unified price and timing comparison.",
    rbac: "PUBLIC",
    responseSample: {
      success: true,
      categories: {
        flights: [{ airline: "IndiGo", flightNo: "6E-2041", fare: 4399 }],
        trains: [{ trainName: "Vande Bharat Express", trainNo: "22436", fare: 1750 }],
        buses: [{ operator: "Zingbus Electric", fare: 1199 }],
      },
    },
  },
  {
    id: "search-flights",
    method: "GET",
    path: "/api/v1/flights/search?destination=Mumbai&date=2026-08-28",
    category: "4. Search & Availability APIs",
    title: "Flight Search API",
    description: "Direct IATA NDC and airline GDS search feed with live seat buckets.",
    rbac: "PUBLIC",
    responseSample: { success: true, service: "flights", results: [{ id: "fl_101", title: "IndiGo 6E-2041", priceINR: 4399 }] },
  },
  {
    id: "search-trains",
    method: "GET",
    path: "/api/v1/trains/search?destination=Varanasi&date=2026-08-28",
    category: "4. Search & Availability APIs",
    title: "Train Search & PNR Feed",
    description: "Authorized IRCTC railway timetable search with Tatkal and General quota statuses.",
    rbac: "PUBLIC",
    responseSample: { success: true, service: "trains", results: [{ id: "tr_101", title: "Vande Bharat Express", priceINR: 1750 }] },
  },
  {
    id: "search-availability-flight",
    method: "GET",
    path: "/api/v1/flights/6E-2041/availability",
    category: "4. Search & Availability APIs",
    title: "Flight Live Seat Availability",
    description: "Real-time seat map and seat availability check via NDC direct socket.",
    rbac: "PUBLIC",
    responseSample: { success: true, service: "flights", availableUnits: 14, totalCapacity: 180, isInstantBookingAllowed: true },
  },

  // 5. Booking APIs
  {
    id: "booking-create",
    method: "POST",
    path: "/api/v1/bookings",
    category: "5. Booking APIs",
    title: "Create Unified Booking",
    description: "Central booking engine creating PNR across any travel category with escrow hold.",
    rbac: "CUSTOMER",
    defaultBody: {
      serviceCategory: "flights",
      title: "IndiGo 6E-2041 (DEL ➔ BOM)",
      amount: 4399,
      passengers: 1,
      seatOrRoom: "14A (Window)",
    },
    responseSample: {
      success: true,
      booking: { bookingId: "BK-1771829102", pnr: "BY-849102", amount: 4399, status: "CONFIRMED" },
    },
  },
  {
    id: "booking-list",
    method: "GET",
    path: "/api/v1/bookings",
    category: "5. Booking APIs",
    title: "List User Bookings",
    description: "Fetches user itinerary history across all 11 travel services.",
    rbac: "CUSTOMER",
    responseSample: { success: true, count: 2, bookings: [{ bookingId: "BK-2026-98101", pnr: "INDIGO-982142", amount: 4399 }] },
  },
  {
    id: "booking-voucher",
    method: "GET",
    path: "/api/v1/bookings/BK-2026-98101/voucher",
    category: "5. Booking APIs",
    title: "Get Boarding Pass / Voucher",
    description: "Generates digital travel pass with encrypted QR code.",
    rbac: "CUSTOMER",
    responseSample: { success: true, voucher: { pnr: "INDIGO-982142", status: "DIGITALLY_ISSUED_VALID_FOR_TRAVEL" } },
  },
  {
    id: "booking-invoice",
    method: "GET",
    path: "/api/v1/bookings/BK-2026-98101/invoice",
    category: "5. Booking APIs",
    title: "Get GST Tax Invoice",
    description: "Official B2B/B2C GST tax invoice with SAC breakdown (996411 / 996311) and CGST/SGST.",
    rbac: "CUSTOMER",
    responseSample: {
      success: true,
      invoice: { invoiceNumber: "INV-2026-98101", sacCode: "996411", taxableAmount: 4189, cgst: 105, sgst: 105, totalGrossINR: 4399 },
    },
  },
  {
    id: "booking-cancel",
    method: "POST",
    path: "/api/v1/bookings/BK-2026-98101/cancel",
    category: "5. Booking APIs",
    title: "Cancel Booking & Process Refund",
    description: "Cancels travel reservation and releases payment back to wallet or bank.",
    rbac: "CUSTOMER",
    defaultBody: { reason: "Change of travel itinerary" },
    responseSample: { success: true, refundId: "REF-1771829102", refundAmount: 4399 },
  },

  // 6. Payment APIs
  {
    id: "payment-create",
    method: "POST",
    path: "/api/v1/payments/create",
    category: "6. Payment APIs",
    title: "Create PG Order (Backend Vaulted)",
    description: "Generates order token on backend while keeping gateway keys strictly secure.",
    rbac: "CUSTOMER",
    defaultBody: { amount: 4399, currency: "INR", bookingId: "BK-2026-98101" },
    responseSample: { success: true, orderId: "order_k9L2pQ8xYzA4B1", amount: 439900, currency: "INR" },
  },
  {
    id: "payment-verify",
    method: "POST",
    path: "/api/v1/payments/verify",
    category: "6. Payment APIs",
    title: "Verify HMAC SHA256 Signature",
    description: "Server-side cryptographic payment verification ensuring tamper protection.",
    rbac: "CUSTOMER",
    defaultBody: {
      razorpay_order_id: "order_k9L2pQ8xYzA4B1",
      razorpay_payment_id: "pay_M9812039841",
      razorpay_signature: "sig_rzp_mock_hash_771829301923",
    },
    responseSample: { success: true, verified: true, paymentStatus: "CAPTURED", rbiRrn: "623810293847" },
  },
  {
    id: "payment-webhook",
    method: "POST",
    path: "/api/v1/payments/webhook",
    category: "6. Payment APIs",
    title: "Payment Gateway Webhook Listener",
    description: "Handles asynchronous notifications (payment.captured, refund.processed) securely.",
    rbac: "PUBLIC",
    defaultBody: { event: "payment.captured", paymentId: "pay_M9812039841", amount: 439900 },
    responseSample: { success: true, processed: true, event: "payment.captured" },
  },

  // 7. Commission & Subscription APIs
  {
    id: "commission-summary",
    method: "GET",
    path: "/api/v1/commissions/summary",
    category: "7. Commission & Subscription APIs",
    title: "Commission Analytics & Models",
    description: "Breakdown of platform take-rates across Models A, B, C, and D.",
    rbac: "ADMIN",
    responseSample: {
      success: true,
      totalCommissionMTD: 4892000,
      averageTakeRate: "6.84%",
      modelSplit: { MODEL_A: "42%", MODEL_B: "28%", MODEL_C: "24%", MODEL_D: "6%" },
    },
  },
  {
    id: "subscription-plans",
    method: "GET",
    path: "/api/v1/subscription/plans",
    category: "7. Commission & Subscription APIs",
    title: "List Partner Subscription Plans",
    description: "Commercial pricing plans: Free, Standard (₹999/mo), Pro (₹2,999/mo), Enterprise.",
    rbac: "PUBLIC",
    responseSample: {
      success: true,
      plans: [
        { id: "FREE", name: "Free Tier", priceMonthly: 0 },
        { id: "STANDARD", name: "Standard Plan", priceMonthly: 999 },
        { id: "PRO", name: "Professional Plan", priceMonthly: 2999 },
        { id: "ENTERPRISE", name: "Enterprise Custom", priceMonthly: 9999 },
      ],
    },
  },
  {
    id: "subscription-current",
    method: "GET",
    path: "/api/v1/subscriptions/current",
    category: "7. Commission & Subscription APIs",
    title: "Get Partner Active Subscription",
    description: "Checks partner subscription quotas, booking allowances, and validity dates.",
    rbac: "PARTNER",
    responseSample: {
      success: true,
      subscription: { id: "SUB-8810", planId: "PRO", status: "ACTIVE", validTo: "2026-12-31" },
    },
  },

  // 8. Settlement APIs
  {
    id: "settlements-list",
    method: "GET",
    path: "/api/v1/settlements",
    category: "8. Settlement APIs",
    title: "List Partner Settlements",
    description: "T+1 and T+2 daily automated partner bank disbursements.",
    rbac: "PARTNER",
    responseSample: {
      success: true,
      settlements: [
        { id: "SET-2026-0081", grossBookingAmount: 184500, platformCommission: 15682, netSettlementPayable: 164151, escrowStatus: "SETTLED_T1" },
      ],
    },
  },
  {
    id: "settlements-summary",
    method: "GET",
    path: "/api/v1/settlements/summary",
    category: "8. Settlement APIs",
    title: "Settlement Escrow Summary",
    description: "Pipeline: Booking Amount ➔ Commission ➔ Fees/Taxes ➔ Net Partner Amount ➔ Escrow Payout.",
    rbac: "ADMIN",
    responseSample: {
      success: true,
      summary: { totalDisbursedFY: 489200000, currentEscrowHold: 248000, nextDisbursementBatch: "Tomorrow 04:00 AM IST" },
    },
  },

  // 9. Integration APIs
  {
    id: "integ-flight-ndc",
    method: "POST",
    path: "/api/v1/integrations/flight/ndc-sync",
    category: "9. Integration APIs",
    title: "Flight NDC & Airline GDS Bridge",
    description: "Backend-only direct integration with airline reservation systems.",
    rbac: "ADMIN",
    responseSample: { success: true, adapter: "IATA_NDC_AIRLINE_DIRECT", activeChannels: ["IndiGo", "Air India", "Akasa"] },
  },
  {
    id: "integ-train-irctc",
    method: "POST",
    path: "/api/v1/integrations/train/irctc-sync",
    category: "9. Integration APIs",
    title: "IRCTC Authorized Rail Gateway",
    description: "Authorized NGET IRCTC bridge with sub-50ms latency PNR sync.",
    rbac: "ADMIN",
    responseSample: { success: true, adapter: "IRCTC_AUTHORIZED_NGET", syncLatencyMs: 42, pnrLiveLookup: "ACTIVE" },
  },
  {
    id: "integ-geo-maps",
    method: "GET",
    path: "/api/v1/integrations/maps/geocode?q=Delhi",
    category: "9. Integration APIs",
    title: "Maps & Geocoding Service",
    description: "Backend geo-location and routing matrix calculator.",
    rbac: "PUBLIC",
    responseSample: { success: true, lat: 28.6139, lng: 77.209, formattedAddress: "New Delhi, Delhi, India" },
  },
  {
    id: "integ-sms-otp",
    method: "POST",
    path: "/api/v1/integrations/sms/send-otp",
    category: "9. Integration APIs",
    title: "DLT-Compliant SMS Gateway",
    description: "High-priority SMS provider for transaction confirmations and OTPs.",
    rbac: "ADMIN",
    defaultBody: { phone: "+91 9876543210", template: "BOOKING_CONFIRMED" },
    responseSample: { success: true, provider: "PINPOINT_SMS_DLT", deliveryStatus: "DELIVERED_IN_1.2S" },
  },
];

export const ApiArchitectureExplorerModal: React.FC<ApiArchitectureExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(API_ENDPOINTS[0].id);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [requestBodyText, setRequestBodyText] = useState<string>("");
  const [customHeadersText, setCustomHeadersText] = useState<string>("");
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const currentEndpoint = API_ENDPOINTS.find((ep) => ep.id === selectedEndpointId) || API_ENDPOINTS[0];

  // Set default body & headers when switching endpoints
  React.useEffect(() => {
    if (currentEndpoint.defaultBody) {
      setRequestBodyText(JSON.stringify(currentEndpoint.defaultBody, null, 2));
    } else {
      setRequestBodyText("");
    }

    if (currentEndpoint.defaultHeaders) {
      setCustomHeadersText(JSON.stringify(currentEndpoint.defaultHeaders, null, 2));
    } else {
      setCustomHeadersText(JSON.stringify({ "Content-Type": "application/json" }, null, 2));
    }

    setLiveResponse(null);
    setResponseStatus(null);
    setResponseTimeMs(null);
  }, [selectedEndpointId]);

  if (!isOpen) return null;

  const categories = ["ALL", ...Array.from(new Set(API_ENDPOINTS.map((ep) => ep.category)))];

  const filteredEndpoints = API_ENDPOINTS.filter((ep) => {
    const matchesCat = activeCategoryFilter === "ALL" || ep.category === activeCategoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      let headers: any = { "Content-Type": "application/json" };
      try {
        if (customHeadersText.trim()) {
          headers = { ...headers, ...JSON.parse(customHeadersText) };
        }
      } catch (e) {
        console.warn("Invalid header JSON format, using default");
      }

      let parsedBody: any = undefined;
      if (currentEndpoint.method !== "GET" && requestBodyText.trim()) {
        try {
          parsedBody = JSON.parse(requestBodyText);
        } catch (e) {
          console.warn("Invalid request body JSON");
        }
      }

      const res = await fetch(currentEndpoint.path, {
        method: currentEndpoint.method,
        headers,
        body: parsedBody ? JSON.stringify(parsedBody) : undefined,
      });

      const data = await res.json().catch(() => ({ raw: "Non-JSON response" }));
      const duration = Math.round(performance.now() - startTime);

      setResponseStatus(res.status);
      setResponseTimeMs(duration);
      setLiveResponse(data);
    } catch (err: any) {
      const duration = Math.round(performance.now() - startTime);
      setResponseStatus(500);
      setResponseTimeMs(duration);
      setLiveResponse({ error: err.message || "Failed to execute request against local gateway" });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurlSnippet = () => {
    let curl = `curl -X ${currentEndpoint.method} "https://api.bharatyatra.in${currentEndpoint.path}"`;
    if (customHeadersText.trim()) {
      try {
        const parsedH = JSON.parse(customHeadersText);
        Object.entries(parsedH).forEach(([k, v]) => {
          curl += ` \\\n  -H "${k}: ${v}"`;
        });
      } catch (e) {
        curl += ` \\\n  -H "Content-Type: application/json"`;
      }
    }
    if (currentEndpoint.method !== "GET" && requestBodyText.trim()) {
      curl += ` \\\n  -d '${requestBodyText.replace(/\n/g, "").replace(/\s+/g, " ")}'`;
    }
    return curl;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "POST":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "PATCH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "DELETE":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const getRbacBadgeClass = (rbac: string) => {
    switch (rbac) {
      case "SUPER_ADMIN":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "ADMIN":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "PARTNER":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "CUSTOMER":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-7xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>BharatYatra Enterprise API Gateway</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    v1.0 Production Mesh
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                10 Isolated REST API Tiers • RBAC Authentication • Real-time Live Sandbox Testing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 text-xs bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Gateway: http://0.0.0.0:3000/api/v1</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="text-slate-400">
                <span>Active Endpoints: </span>
                <span className="text-white font-bold">{API_ENDPOINTS.length}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === cat
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat.replace(/^[0-9]+\.\s*/, "")}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter endpoint, route or tag..."
              className="w-full pl-9 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Main Content Area: Sidebar + Playground */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Endpoint Navigation List */}
          <div className="w-72 lg:w-84 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Endpoints ({filteredEndpoints.length})</span>
              <span className="text-[10px] text-indigo-400">Live Express Mock</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-1.5 space-y-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = ep.id === selectedEndpointId;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "bg-indigo-600/20 border border-indigo-500/50 shadow-sm"
                        : "hover:bg-slate-800/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getMethodBadgeClass(
                          ep.method
                        )}`}
                      >
                        {ep.method}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRbacBadgeClass(
                          ep.rbac
                        )}`}
                      >
                        {ep.rbac}
                      </span>
                    </div>

                    <div className="font-mono text-xs font-semibold text-slate-200 truncate mt-0.5">
                      {ep.path}
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-1">{ep.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive API Playground */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900/60 p-6 space-y-6">
            {/* Active Endpoint Banner */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-black border uppercase ${getMethodBadgeClass(
                      currentEndpoint.method
                    )}`}
                  >
                    {currentEndpoint.method}
                  </span>
                  <span className="font-mono text-base font-bold text-white">{currentEndpoint.path}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold border flex items-center gap-1 ${getRbacBadgeClass(
                      currentEndpoint.rbac
                    )}`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>RBAC: {currentEndpoint.rbac}</span>
                  </span>

                  <button
                    onClick={handleCopyCurl}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCurl ? "Copied cURL" : "Copy cURL"}</span>
                  </button>

                  <button
                    onClick={handleExecuteRequest}
                    disabled={isLoading}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send Request</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-200">{currentEndpoint.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentEndpoint.description}</p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-bold text-indigo-400">Category:</span>
                <span>{currentEndpoint.category}</span>
              </div>
            </div>

            {/* Request Configuration Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Box: Request Headers & Body Editor */}
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Request Headers (JSON)</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Authorization / Content-Type</span>
                  </div>
                  <textarea
                    rows={3}
                    value={customHeadersText}
                    onChange={(e) => setCustomHeadersText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-300 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                {currentEndpoint.method !== "GET" && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Request Body Payload (JSON)</span>
                      </span>
                      <span className="text-[10px] text-slate-500">application/json</span>
                    </div>
                    <textarea
                      rows={7}
                      value={requestBodyText}
                      onChange={(e) => setRequestBodyText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-sky-300 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Right Box: Live Response Inspector */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Response Output</span>
                    {responseStatus && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          responseStatus >= 200 && responseStatus < 300
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        Status: {responseStatus}
                      </span>
                    )}
                    {responseTimeMs !== null && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {responseTimeMs}ms
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500">
                    {liveResponse ? "Live Gateway Execution" : "Standard Schema Sample"}
                  </span>
                </div>

                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-y-auto max-h-[380px]">
                  <pre className="font-mono text-xs text-emerald-400 leading-relaxed">
                    {JSON.stringify(liveResponse || currentEndpoint.responseSample, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Architecture Highlights & 10 Isolated Modules Summary */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-900/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Enterprise API Gateway Specs & Security Invariants</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Hidden Admin & Secrets</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Payment Gateway (Razorpay/RBI), Airline GDS, and SMS provider credentials remain strictly isolated on the backend.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>Role-Based Access Control</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Strict namespace segregation: <code>/customer/*</code>, <code>/partner/*</code>, and <code>/admin/*</code> with token verification.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>Automated Escrow Pipeline</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Booking Gross ➔ Platform Commission ➔ TDS/GST ➔ Net Partner Escrow ➔ Daily T+1 NEFT Disbursement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
