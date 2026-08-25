import { Router, Request, Response, NextFunction } from "express";

export const v1Router = Router();

// ============================================================================
// IN-MEMORY V1 DATABASE & RBAC CACHE
// ============================================================================

interface V1User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "PARTNER" | "ADMIN" | "SUPER_ADMIN" | "OPERATIONS_DIRECTOR";
  isMfaEnabled: boolean;
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  createdAt: string;
}

interface V1Operator {
  id: string;
  businessName: string;
  serviceCategory: string;
  contactPerson: string;
  email: string;
  phone: string;
  kycStatus: "APPROVED" | "PENDING" | "REJECTED";
  commissionPlan: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
  commissionRatePercent: number;
  subscriptionTier: "FREE" | "STANDARD" | "PRO" | "ENTERPRISE";
  rating: number;
  totalBookings: number;
  verifiedAt?: string;
  rejectionReason?: string;
}

interface V1Booking {
  bookingId: string;
  serviceCategory: string;
  title: string;
  subtitle: string;
  pnr: string;
  userId: string;
  customerName: string;
  operatorId: string;
  amount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  commissionAmount: number;
  netPartnerAmount: number;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  paymentId: string;
  date: string;
  seatOrRoom: string;
  passengers: number;
  createdAt: string;
}

const v1Users: V1User[] = [
  {
    id: "usr_cust_001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    role: "CUSTOMER",
    isMfaEnabled: false,
    status: "ACTIVE",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "usr_ptr_001",
    name: "Zingbus Operations Team",
    email: "ops@zingbus.com",
    phone: "+91 98112 00441",
    role: "PARTNER",
    isMfaEnabled: true,
    status: "ACTIVE",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "usr_adm_001",
    name: "Master Admin Security",
    email: "admin.sec@bharatyatra.in",
    phone: "+91 99999 00001",
    role: "SUPER_ADMIN",
    isMfaEnabled: true,
    status: "ACTIVE",
    createdAt: "2025-12-01T00:00:00Z",
  },
];

const v1Operators: V1Operator[] = [
  {
    id: "op_bus_zingbus",
    businessName: "Zingbus Electric Intercity Pvt Ltd",
    serviceCategory: "buses",
    contactPerson: "Prashant Kumar",
    email: "partner@zingbus.in",
    phone: "+91 98112 33445",
    kycStatus: "APPROVED",
    commissionPlan: "MODEL_A",
    commissionRatePercent: 8.5,
    subscriptionTier: "PRO",
    rating: 4.86,
    totalBookings: 1420,
    verifiedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "op_hotel_taj",
    businessName: "Taj Palace & Heritage Retreats",
    serviceCategory: "hotels",
    contactPerson: "Ananya Deshmukh",
    email: "concierge@tajhotels.in",
    phone: "+91 98220 55667",
    kycStatus: "APPROVED",
    commissionPlan: "MODEL_B",
    commissionRatePercent: 0.0,
    subscriptionTier: "ENTERPRISE",
    rating: 4.95,
    totalBookings: 3200,
    verifiedAt: "2026-01-20T12:00:00Z",
  },
  {
    id: "op_lodge_corbett",
    businessName: "Corbett Wilderness Safari Lodge",
    serviceCategory: "lodges",
    contactPerson: "Harish Rawat",
    email: "info@corbettwildlodge.in",
    phone: "+91 94120 77889",
    kycStatus: "APPROVED",
    commissionPlan: "MODEL_C",
    commissionRatePercent: 12.0,
    subscriptionTier: "STANDARD",
    rating: 4.82,
    totalBookings: 640,
    verifiedAt: "2026-04-10T14:00:00Z",
  },
  {
    id: "op_cab_delhi_yatra",
    businessName: "Delhi Outstation Chauffeur Express",
    serviceCategory: "cabs",
    contactPerson: "Rajender Yadav",
    email: "dispatch@delhicabs.in",
    phone: "+91 98100 88991",
    kycStatus: "PENDING",
    commissionPlan: "MODEL_C",
    commissionRatePercent: 15.0,
    subscriptionTier: "FREE",
    rating: 4.75,
    totalBookings: 180,
  },
];

const v1Bookings: V1Booking[] = [
  {
    bookingId: "BK-2026-98101",
    serviceCategory: "flights",
    title: "IndiGo 6E-2041",
    subtitle: "DEL ➔ BOM • Economy Saver",
    pnr: "INDIGO-982142",
    userId: "usr_cust_001",
    customerName: "Aarav Sharma",
    operatorId: "op_flight_indigo",
    amount: 4399,
    taxableAmount: 4189,
    cgst: 105,
    sgst: 105,
    commissionAmount: 175,
    netPartnerAmount: 4224,
    status: "CONFIRMED",
    paymentId: "pay_rzp_981249102",
    date: "2026-08-28",
    seatOrRoom: "14A (Window)",
    passengers: 1,
    createdAt: "2026-08-20T10:15:00Z",
  },
  {
    bookingId: "BK-2026-98102",
    serviceCategory: "trains",
    title: "Vande Bharat Express (22436)",
    subtitle: "New Delhi ➔ Varanasi Jn",
    pnr: "284-9182741",
    userId: "usr_cust_001",
    customerName: "Aarav Sharma",
    operatorId: "op_train_irctc",
    amount: 1750,
    taxableAmount: 1666,
    cgst: 42,
    sgst: 42,
    commissionAmount: 50,
    netPartnerAmount: 1700,
    status: "CONFIRMED",
    paymentId: "pay_rzp_981249103",
    date: "2026-09-05",
    seatOrRoom: "Coach C2 • Seats 24, 25",
    passengers: 2,
    createdAt: "2026-08-21T14:30:00Z",
  },
];

const v1Settlements = [
  {
    id: "SET-2026-0081",
    partnerId: "op_bus_zingbus",
    partnerName: "Zingbus Electric Intercity Pvt Ltd",
    period: "2026-08-15 to 2026-08-21",
    grossBookingAmount: 184500,
    platformCommission: 15682,
    tdsDeducted: 1845,
    gstOnCommission: 2822,
    netSettlementPayable: 164151,
    escrowStatus: "SETTLED_T1",
    bankUtr: "HDFCR5202608229981203",
    settledAt: "2026-08-22T04:30:00Z",
  },
  {
    id: "SET-2026-0082",
    partnerId: "op_lodge_corbett",
    partnerName: "Corbett Wilderness Safari Lodge",
    period: "2026-08-15 to 2026-08-21",
    grossBookingAmount: 98000,
    platformCommission: 11760,
    tdsDeducted: 980,
    gstOnCommission: 2116,
    netSettlementPayable: 83144,
    escrowStatus: "PROCESSING_T2",
    bankUtr: "Pending Escrow Release",
    settledAt: null,
  },
];

const v1Subscriptions = [
  {
    id: "SUB-8810",
    partnerId: "op_bus_zingbus",
    planId: "PRO",
    planName: "Professional Commercial Tier",
    billingCycle: "ANNUAL",
    amountPaid: 29990,
    currency: "INR",
    status: "ACTIVE",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    maxListings: 100,
    maxBookingsPerMonth: 2000,
    commissionDiscountRate: "45% Lower Commission",
    invoiceNumber: "SUB-INV-2026-0044",
  },
];

const v1AuditLogs = [
  {
    id: "AUD-001",
    event: "API_GATEWAY_V1_INIT",
    actor: "SYSTEM",
    role: "SYSTEM",
    ipAddress: "127.0.0.1",
    endpoint: "/api/v1/auth/register",
    timestamp: new Date().toISOString(),
    status: "SUCCESS",
  },
];

// RBAC Middleware Helper
function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Missing Authorization header (Bearer token required)",
        code: "AUTH_TOKEN_MISSING",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    // Simulate token payload lookup
    if (token.includes("admin") || token.includes("ADM") || token.includes("BY-SEC")) {
      (req as any).user = { role: "SUPER_ADMIN", id: "usr_adm_001", name: "Master Admin" };
    } else if (token.includes("partner") || token.includes("PTR")) {
      (req as any).user = { role: "PARTNER", id: "usr_ptr_001", name: "Zingbus Operations" };
    } else {
      (req as any).user = { role: "CUSTOMER", id: "usr_cust_001", name: "Aarav Sharma" };
    }

    const currentRole = (req as any).user.role;
    if (!allowedRoles.includes(currentRole) && !allowedRoles.includes("*")) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${currentRole}' lacks required permissions [${allowedRoles.join(", ")}]`,
        code: "RBAC_PERMISSION_DENIED",
      });
    }

    next();
  };
}

// ============================================================================
// 1. AUTHENTICATION APIS (/api/v1/auth/*)
// ============================================================================

v1Router.post("/auth/register", (req: Request, res: Response) => {
  const { name, email, phone, role = "CUSTOMER", password } = req.body || {};
  if (!email || !phone) {
    return res.status(400).json({ success: false, error: "Email and Phone are required for registration" });
  }

  const existing = v1Users.find((u) => u.email === email || u.phone === phone);
  if (existing) {
    return res.status(409).json({ success: false, error: "User already exists with this email or phone number" });
  }

  const newUser: V1User = {
    id: `usr_${Date.now()}`,
    name: name || "New Travel User",
    email,
    phone,
    role: (role.toUpperCase() as any) || "CUSTOMER",
    isMfaEnabled: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };

  v1Users.push(newUser);

  res.status(201).json({
    success: true,
    message: "Registration successful. OTP sent for phone verification.",
    user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role },
    token: `jwt_by_${newUser.id}_${Date.now()}`,
    refreshToken: `rt_by_${newUser.id}_${Date.now()}`,
  });
});

v1Router.post("/auth/login", (req: Request, res: Response) => {
  const { identifier, password, role = "CUSTOMER" } = req.body || {};
  if (!identifier) {
    return res.status(400).json({ success: false, error: "Identifier (Email or Phone) is required" });
  }

  const user = v1Users.find((u) => u.email === identifier || u.phone === identifier) || v1Users[0];

  res.json({
    success: true,
    message: "Login successful",
    token: `jwt_by_${user.id}_${Date.now()}`,
    refreshToken: `rt_by_${user.id}_${Date.now()}`,
    expiresIn: 86400,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    },
  });
});

v1Router.post("/auth/logout", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Session revoked and token invalidated successfully",
    revokedAt: new Date().toISOString(),
  });
});

v1Router.post("/auth/refresh", (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ success: false, error: "Refresh token is required" });
  }

  res.json({
    success: true,
    token: `jwt_by_refreshed_${Date.now()}`,
    refreshToken: `rt_by_refreshed_${Date.now()}`,
    expiresIn: 86400,
  });
});

v1Router.post("/auth/forgot-password", (req: Request, res: Response) => {
  const { emailOrPhone } = req.body || {};
  res.json({
    success: true,
    message: `Password reset OTP has been dispatched to ${emailOrPhone || "registered contact"}.`,
    otpExpiresInSeconds: 300,
  });
});

v1Router.post("/auth/reset-password", (req: Request, res: Response) => {
  const { emailOrPhone, otp, newPassword } = req.body || {};
  if (!otp || !newPassword) {
    return res.status(400).json({ success: false, error: "OTP and newPassword are required" });
  }

  res.json({
    success: true,
    message: "Password has been successfully reset. Please log in with new credentials.",
  });
});

v1Router.post("/auth/verify-otp", (req: Request, res: Response) => {
  const { phone, otp, purpose = "LOGIN" } = req.body || {};
  if (!otp) {
    return res.status(400).json({ success: false, error: "6-digit OTP code is required" });
  }

  res.json({
    success: true,
    verified: true,
    purpose,
    phone: phone || "+91 98765 43210",
    kycState: "AADHAAR_DIGILOCKER_VERIFIED",
  });
});

v1Router.post("/auth/mfa/verify", (req: Request, res: Response) => {
  const { code, mfaToken } = req.body || {};
  res.json({
    success: true,
    mfaVerified: true,
    elevatedSessionToken: `BY-MFA-OK-${Date.now()}`,
  });
});

v1Router.get("/auth/me", requireRole(["CUSTOMER", "PARTNER", "ADMIN", "SUPER_ADMIN"]), (req: Request, res: Response) => {
  const user = (req as any).user || v1Users[0];
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email || "user@bharatyatra.in",
      role: user.role,
      walletBalance: 2450,
      yatraCoins: 480,
      kycVerified: true,
      permissions:
        user.role === "SUPER_ADMIN"
          ? ["ADMIN_ALL", "OPERATOR_APPROVE", "PAYMENT_OVERRIDE", "AUDIT_READ"]
          : ["STANDARD_BOOKING", "CANCEL_TRIP", "VIEW_INVOICE"],
    },
  });
});

// Separate namespaces
v1Router.post("/auth/customer/login", (req: Request, res: Response) => {
  res.json({ success: true, namespace: "customer", session: `cust_sess_${Date.now()}` });
});
v1Router.post("/auth/customer/register", (req: Request, res: Response) => {
  res.json({ success: true, namespace: "customer", message: "Customer account registered" });
});
v1Router.post("/auth/partner/login", (req: Request, res: Response) => {
  res.json({ success: true, namespace: "partner", session: `partner_sess_${Date.now()}` });
});
v1Router.post("/auth/partner/register", (req: Request, res: Response) => {
  res.json({ success: true, namespace: "partner", message: "Partner application submitted for KYC review" });
});
v1Router.post("/auth/admin/login", (req: Request, res: Response) => {
  const { pin, email } = req.body || {};
  if (pin === "2026" || pin === "admin" || !pin) {
    return res.json({
      success: true,
      namespace: "admin",
      token: `BY-SEC-ADMIN-${Date.now()}`,
      requiresMfa: false,
      role: "SUPER_ADMIN",
    });
  }
  res.status(401).json({ success: false, error: "Invalid Admin PIN" });
});

// ============================================================================
// 2. ADMIN API — SECURE & HIDDEN (/api/v1/admin/*)
// ============================================================================

v1Router.post("/admin/auth/login", (req: Request, res: Response) => {
  res.json({
    success: true,
    adminSession: `adm_sess_${Date.now()}`,
    token: `BY-SEC-ADMIN-${Date.now()}`,
    role: "SUPER_ADMIN",
    expiresIn: 28800,
  });
});

v1Router.post("/admin/auth/mfa", (req: Request, res: Response) => {
  res.json({ success: true, mfaStatus: "PASSED", adminAuthLevel: "LEVEL_3_ROOT" });
});

v1Router.post("/admin/auth/logout", (req: Request, res: Response) => {
  res.json({ success: true, message: "Admin session destroyed cleanly" });
});

v1Router.get("/admin/dashboard", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({
    success: true,
    metrics: {
      totalGmvINR: 846200000,
      monthlyBookings: 42890,
      activeOperators: v1Operators.length,
      pendingOperatorApprovals: v1Operators.filter((o) => o.kycStatus === "PENDING").length,
      commissionEarnedMTD: 4892000,
      settlementsPendingINR: 248000,
      systemHealth: "99.98% UPTIME",
      gatewaySuccessRate: "99.84%",
    },
  });
});

v1Router.get("/admin/users", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, count: v1Users.length, users: v1Users });
});

v1Router.get("/admin/partners", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, count: v1Operators.length, partners: v1Operators });
});

v1Router.get("/admin/operators", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, operators: v1Operators });
});

v1Router.patch("/admin/operators/:id/approve", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  const { id } = req.params;
  const op = v1Operators.find((o) => o.id === id);
  if (!op) return res.status(404).json({ success: false, error: "Operator not found" });

  op.kycStatus = "APPROVED";
  op.verifiedAt = new Date().toISOString();

  res.json({
    success: true,
    message: `Operator ${op.businessName} has been approved and inventory is now active on public search.`,
    operator: op,
  });
});

v1Router.patch("/admin/operators/:id/reject", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason = "KYC documents non-compliant with state regulatory standards" } = req.body || {};
  const op = v1Operators.find((o) => o.id === id);
  if (!op) return res.status(404).json({ success: false, error: "Operator not found" });

  op.kycStatus = "REJECTED";
  op.rejectionReason = reason;

  res.json({
    success: true,
    message: `Operator ${op.businessName} rejected. Notification sent to partner contact.`,
    operator: op,
  });
});

v1Router.get("/admin/bookings", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, count: v1Bookings.length, bookings: v1Bookings });
});

v1Router.get("/admin/payments", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({
    success: true,
    payments: [
      { id: "pay_rzp_981249102", amount: 4399, method: "UPI", status: "CAPTURED", rbiRrn: "623810293847" },
      { id: "pay_rzp_981249103", amount: 1750, method: "CARD", status: "CAPTURED", rbiRrn: "623810293848" },
    ],
  });
});

v1Router.get("/admin/refunds", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({
    success: true,
    refunds: [
      { id: "ref_88910", bookingId: "BK-2026-98101", amount: 4399, status: "PROCESSED", method: "INSTANT_WALLET" },
    ],
  });
});

v1Router.get("/admin/commissions", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({
    success: true,
    summary: {
      totalPlatformCommissionEarned: 4892000,
      breakdownByCategory: {
        flights: { rate: "2-4%", total: 1420000 },
        buses: { rate: "8-12%", total: 1120000 },
        hotels: { rate: "12-18%", total: 1540000 },
        cabs: { rate: "10-15%", total: 812000 },
      },
    },
  });
});

v1Router.get("/admin/settlements", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, settlements: v1Settlements });
});

v1Router.get("/admin/subscriptions", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, subscriptions: v1Subscriptions });
});

v1Router.get("/admin/reports", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({
    success: true,
    reports: {
      gstr1Export: "GSTR-1_2026_AUG.json",
      itcReconciliationStatus: "100% MATCHED WITH GSTR-2B",
      grossPlatformTurnover: 846200000,
      netTdsCollected: 846200,
    },
  });
});

v1Router.get("/admin/audit-logs", requireRole(["SUPER_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
  res.json({ success: true, count: v1AuditLogs.length, auditLogs: v1AuditLogs });
});

// ============================================================================
// 3. OPERATOR APIS (/api/v1/operators/* & service-specific)
// ============================================================================

v1Router.post("/operators/register", (req: Request, res: Response) => {
  const { businessName, serviceCategory, contactPerson, email, phone, commissionPlan } = req.body || {};
  const newOp: V1Operator = {
    id: `op_${Date.now()}`,
    businessName: businessName || "New Travel Enterprise",
    serviceCategory: serviceCategory || "buses",
    contactPerson: contactPerson || "Lead Manager",
    email: email || "partner@enterprise.in",
    phone: phone || "+91 98000 00000",
    kycStatus: "PENDING",
    commissionPlan: commissionPlan || "MODEL_A",
    commissionRatePercent: 10.0,
    subscriptionTier: "FREE",
    rating: 5.0,
    totalBookings: 0,
  };

  v1Operators.push(newOp);
  res.status(201).json({
    success: true,
    message: "Operator onboarding initiated. Upload regulatory documents to complete KYC.",
    operator: newOp,
  });
});

v1Router.get("/operators/me", (req: Request, res: Response) => {
  res.json({ success: true, operator: v1Operators[0] });
});

v1Router.patch("/operators/me", (req: Request, res: Response) => {
  const updates = req.body || {};
  Object.assign(v1Operators[0], updates);
  res.json({ success: true, message: "Operator profile updated", operator: v1Operators[0] });
});

v1Router.post("/operators/documents", (req: Request, res: Response) => {
  const { docType, documentNumber } = req.body || {};
  res.json({
    success: true,
    message: `Document ${docType} (${documentNumber || "Uploaded"}) received and queued for OCR verification.`,
    verificationState: "OCR_VERIFIED_PENDING_ADMIN_SIGN",
  });
});

v1Router.get("/operators/bookings", (req: Request, res: Response) => {
  res.json({ success: true, bookings: v1Bookings });
});

v1Router.get("/operators/earnings", (req: Request, res: Response) => {
  res.json({
    success: true,
    earnings: {
      grossSales: 184500,
      netPayable: 164151,
      totalCommissionPaid: 15682,
      settledAmount: 164151,
      pendingEscrow: 0,
    },
  });
});

v1Router.get("/operators/settlements", (req: Request, res: Response) => {
  res.json({ success: true, settlements: v1Settlements });
});

// Service-specific operator namespaces
const serviceOperatorRoutes = [
  "bus-operators",
  "cab-operators",
  "hotel-operators",
  "lodge-operators",
  "resort-operators",
  "houseboat-operators",
  "tour-operators",
  "pilgrimage-operators",
  "corporate-operators",
  "restaurant-operators",
];

serviceOperatorRoutes.forEach((service) => {
  v1Router.get(`/${service}/overview`, (req: Request, res: Response) => {
    res.json({
      success: true,
      service,
      status: "OPERATIONAL",
      activeListings: 14,
      liveTripsCount: 6,
      settlementSchedule: "T+1 Daily Cycle",
    });
  });

  v1Router.get(`/${service}/inventory`, (req: Request, res: Response) => {
    res.json({
      success: true,
      service,
      inventory: [
        { id: `${service}-inv-01`, title: `Premium ${service.split("-")[0].toUpperCase()} Unit 1`, status: "AVAILABLE", baseRate: 2400 },
        { id: `${service}-inv-02`, title: `Deluxe ${service.split("-")[0].toUpperCase()} Unit 2`, status: "AVAILABLE", baseRate: 3800 },
      ],
    });
  });
});

// ============================================================================
// 4. SEARCH & AVAILABILITY APIS (/api/v1/search & /api/v1/<service>/search)
// ============================================================================

v1Router.get("/search", (req: Request, res: Response) => {
  const { from = "Delhi", to = "Mumbai", date = "2026-08-28" } = req.query;
  res.json({
    success: true,
    query: { from, to, date },
    resultsCount: 4,
    categories: {
      flights: [{ id: "fl_01", airline: "IndiGo", flightNo: "6E-2041", fare: 4399, duration: "2h 10m" }],
      trains: [{ id: "tr_01", trainName: "Vande Bharat Express", trainNo: "22436", fare: 1750, duration: "8h 00m" }],
      buses: [{ id: "bus_01", operator: "Zingbus Electric", model: "Volvo 9600 Multi-Axle", fare: 1199, duration: "12h 30m" }],
      cabs: [{ id: "cab_01", category: "Prime Sedan", fare: 3400, freeKm: 250 }],
    },
  });
});

const serviceList = [
  "flights",
  "trains",
  "buses",
  "hotels",
  "lodges",
  "resorts",
  "cabs",
  "houseboats",
  "tours",
  "pilgrimages",
  "restaurants",
];

serviceList.forEach((service) => {
  v1Router.get(`/${service}/search`, (req: Request, res: Response) => {
    const { destination, date } = req.query;
    res.json({
      success: true,
      service,
      query: { destination: destination || "Popular Hub", date: date || "2026-08-28" },
      results: [
        {
          id: `${service}_mock_101`,
          title: `Prime Verified ${service.toUpperCase()} Option`,
          rating: 4.85,
          priceINR: 2499,
          badge: "Instant Confirmation",
          availability: "HIGH",
        },
      ],
    });
  });
});

// Availability Endpoints
const availabilityServices = ["flights", "trains", "buses", "hotels", "cabs", "houseboats"];
availabilityServices.forEach((service) => {
  v1Router.get(`/${service}/:id/availability`, (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({
      success: true,
      service,
      resourceId: id,
      availableUnits: 14,
      totalCapacity: 40,
      isInstantBookingAllowed: true,
      realtimeSyncSource: "DIRECT_GDS_CRS_ADAPTER",
    });
  });
});

// ============================================================================
// 5. BOOKING APIS (/api/v1/bookings/* & service-specific)
// ============================================================================

v1Router.post("/bookings", (req: Request, res: Response) => {
  const { serviceCategory = "flights", title, subtitle, amount = 2999, passengers = 1, seatOrRoom = "Allocated" } = req.body || {};
  const bookingId = `BK-${Date.now()}`;
  const pnr = `BY-${Math.floor(100000 + Math.random() * 900000)}`;

  const newBooking: V1Booking = {
    bookingId,
    serviceCategory,
    title: title || `Confirmed ${serviceCategory.toUpperCase()} Trip`,
    subtitle: subtitle || "Verified Itinerary",
    pnr,
    userId: "usr_cust_001",
    customerName: "Aarav Sharma",
    operatorId: "op_bus_zingbus",
    amount: Number(amount),
    taxableAmount: Math.round(Number(amount) * 0.88),
    cgst: Math.round(Number(amount) * 0.06),
    sgst: Math.round(Number(amount) * 0.06),
    commissionAmount: Math.round(Number(amount) * 0.1),
    netPartnerAmount: Math.round(Number(amount) * 0.9),
    status: "CONFIRMED",
    paymentId: `pay_rzp_${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    seatOrRoom,
    passengers: Number(passengers),
    createdAt: new Date().toISOString(),
  };

  v1Bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: "Booking confirmed successfully",
    booking: newBooking,
  });
});

v1Router.get("/bookings", (req: Request, res: Response) => {
  res.json({ success: true, count: v1Bookings.length, bookings: v1Bookings });
});

v1Router.get("/bookings/:bookingId", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const booking = v1Bookings.find((b) => b.bookingId === bookingId || b.pnr === bookingId) || v1Bookings[0];
  res.json({ success: true, booking });
});

v1Router.patch("/bookings/:bookingId", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const updates = req.body || {};
  const booking = v1Bookings.find((b) => b.bookingId === bookingId) || v1Bookings[0];
  Object.assign(booking, updates);
  res.json({ success: true, message: "Booking details updated", booking });
});

v1Router.post("/bookings/:bookingId/cancel", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { reason = "Customer voluntary cancellation" } = req.body || {};
  const booking = v1Bookings.find((b) => b.bookingId === bookingId) || v1Bookings[0];
  booking.status = "CANCELLED";

  res.json({
    success: true,
    message: "Booking cancelled. Refund of 100% processed under zero cancellation guarantee.",
    refundId: `REF-${Date.now()}`,
    refundAmount: booking.amount,
    booking,
  });
});

v1Router.post("/bookings/:bookingId/reschedule", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { newDate = "2026-09-10", newTime = "10:00 AM" } = req.body || {};
  const booking = v1Bookings.find((b) => b.bookingId === bookingId) || v1Bookings[0];
  booking.date = newDate;
  booking.status = "RESCHEDULED";

  res.json({
    success: true,
    message: `Booking rescheduled to ${newDate} without modification penalty.`,
    booking,
  });
});

v1Router.get("/bookings/:bookingId/voucher", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const booking = v1Bookings.find((b) => b.bookingId === bookingId) || v1Bookings[0];
  res.json({
    success: true,
    voucher: {
      pnr: booking.pnr,
      eTicketNo: `ET-${booking.bookingId}`,
      passengerName: booking.customerName,
      status: "DIGITALLY_ISSUED_VALID_FOR_TRAVEL",
      qrCodeData: `https://bharatyatra.in/verify/pnr/${booking.pnr}`,
    },
  });
});

v1Router.get("/bookings/:bookingId/invoice", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const booking = v1Bookings.find((b) => b.bookingId === bookingId) || v1Bookings[0];
  res.json({
    success: true,
    invoice: {
      invoiceNumber: `INV-2026-${booking.bookingId.slice(-5)}`,
      gstinIssuer: "07AAACB4410R1ZP",
      sacCode: booking.serviceCategory === "hotels" ? "996311" : "996411",
      taxableAmount: booking.taxableAmount,
      cgst: booking.cgst,
      sgst: booking.sgst,
      totalGrossINR: booking.amount,
      itcEligible: true,
    },
  });
});

// Service-specific booking endpoints
const serviceBookingEndpoints = [
  "flights",
  "trains",
  "buses",
  "hotels",
  "lodges",
  "resorts",
  "cabs",
  "houseboats",
  "tours",
  "pilgrimages",
  "corporate",
  "restaurants",
];

serviceBookingEndpoints.forEach((service) => {
  v1Router.post(`/${service}/bookings`, (req: Request, res: Response) => {
    res.status(201).json({
      success: true,
      service,
      bookingReference: `BK-${service.toUpperCase().substring(0, 3)}-${Date.now()}`,
      status: "CONFIRMED_ESCROW_LOCKED",
    });
  });
});

// ============================================================================
// 6. PAYMENT APIS (/api/v1/payments/* & /api/v1/refunds/*)
// ============================================================================

v1Router.post("/payments/create", (req: Request, res: Response) => {
  const { amount = 2999, currency = "INR", bookingId = "BK-2026-98101" } = req.body || {};
  const orderId = `order_${Math.random().toString(36).substring(2, 15)}`;

  res.json({
    success: true,
    orderId,
    amount: Number(amount) * 100, // in paise
    currency,
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_live_secret_vaulted",
    customer: { name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 9876543210" },
    themeColor: "#4338ca",
  });
});

v1Router.post("/payments/verify", (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  // Server-side HMAC SHA256 validation simulation
  res.json({
    success: true,
    verified: true,
    paymentStatus: "CAPTURED",
    rbiRrn: `6238${Math.floor(10000000 + Math.random() * 90000000)}`,
    settlementEscrowHold: "T+1_RELEASE",
  });
});

v1Router.get("/payments/:paymentId", (req: Request, res: Response) => {
  const { paymentId } = req.params;
  res.json({
    success: true,
    payment: {
      id: paymentId,
      amountINR: 4399,
      status: "CAPTURED",
      method: "UPI_PHONEPE",
      rbiRrn: "623810293847",
      timestamp: new Date().toISOString(),
    },
  });
});

v1Router.post("/payments/webhook", (req: Request, res: Response) => {
  const event = req.body?.event || "payment.captured";
  res.json({ success: true, processed: true, event });
});

v1Router.post("/refunds", (req: Request, res: Response) => {
  const { paymentId, amount, refundMethod = "INSTANT_WALLET" } = req.body || {};
  res.json({
    success: true,
    refundId: `rfnd_${Date.now()}`,
    amountINR: amount || 4399,
    refundStatus: refundMethod === "INSTANT_WALLET" ? "COMPLETED_INSTANT" : "GATEWAY_INITIATED",
    arnReference: `ARN-92019482019`,
  });
});

v1Router.get("/refunds/:refundId", (req: Request, res: Response) => {
  const { refundId } = req.params;
  res.json({
    success: true,
    refund: {
      id: refundId,
      status: "SETTLED_TO_BANK",
      speed: "INSTANT_0_SECONDS",
    },
  });
});

// ============================================================================
// 7. COMMISSION & SUBSCRIPTION APIS (/api/v1/commissions & /api/v1/subscriptions)
// ============================================================================

v1Router.get("/commissions", (req: Request, res: Response) => {
  res.json({
    success: true,
    commissions: [
      { bookingId: "BK-2026-98101", grossAmount: 4399, platformCommission: 175, takeRatePercent: 4.0 },
      { bookingId: "BK-2026-98102", grossAmount: 1750, platformCommission: 50, takeRatePercent: 2.85 },
    ],
  });
});

v1Router.get("/commissions/summary", (req: Request, res: Response) => {
  res.json({
    success: true,
    totalCommissionMTD: 4892000,
    averageTakeRate: "6.84%",
    modelSplit: {
      MODEL_A_SUBSCRIPTION_COMMISSION: "42%",
      MODEL_B_SUBSCRIPTION_ONLY: "28%",
      MODEL_C_COMMISSION_ONLY: "24%",
      MODEL_D_ENTERPRISE_CUSTOM: "6%",
    },
  });
});

v1Router.get("/commissions/:bookingId", (req: Request, res: Response) => {
  const { bookingId } = req.params;
  res.json({
    success: true,
    bookingId,
    calculation: {
      grossAmount: 4399,
      baseFare: 4189,
      contractCommissionRate: "4.0%",
      commissionAmount: 175,
      tdsDeduction: 43.99,
      netPartnerDisbursement: 4180.01,
    },
  });
});

v1Router.get("/subscription/plans", (req: Request, res: Response) => {
  res.json({
    success: true,
    plans: [
      { id: "FREE", name: "Free Basic Tier", priceMonthly: 0, commissionRate: "Standard", maxListings: 3 },
      { id: "STANDARD", name: "Standard Plan", priceMonthly: 999, commissionRate: "25% Lower", maxListings: 15 },
      { id: "PRO", name: "Professional Plan", priceMonthly: 2999, commissionRate: "45% Lower", maxListings: 100 },
      { id: "ENTERPRISE", name: "Enterprise Custom", priceMonthly: 9999, commissionRate: "Negotiated 0%", maxListings: "Unlimited" },
    ],
  });
});

v1Router.post("/subscriptions", (req: Request, res: Response) => {
  const { planId = "PRO", partnerId = "op_bus_zingbus" } = req.body || {};
  res.status(201).json({
    success: true,
    message: `Subscribed to ${planId} plan. Active immediately.`,
    subscriptionId: `SUB-${Date.now()}`,
    status: "ACTIVE",
  });
});

v1Router.get("/subscriptions/current", (req: Request, res: Response) => {
  res.json({ success: true, subscription: v1Subscriptions[0] });
});

v1Router.post("/subscriptions/upgrade", (req: Request, res: Response) => {
  const { newPlanId = "ENTERPRISE" } = req.body || {};
  res.json({
    success: true,
    message: `Upgraded to ${newPlanId}. Pro-rata balance applied.`,
  });
});

v1Router.post("/subscriptions/downgrade", (req: Request, res: Response) => {
  res.json({ success: true, message: "Downgrade scheduled for end of active billing cycle." });
});

v1Router.post("/subscriptions/renew", (req: Request, res: Response) => {
  res.json({ success: true, message: "Subscription renewed successfully for another 12 months." });
});

v1Router.get("/subscriptions/invoices", (req: Request, res: Response) => {
  res.json({
    success: true,
    invoices: [
      { invoiceNo: "SUB-INV-2026-0044", amountINR: 29990, date: "2026-01-01", status: "PAID", gstin: "07AAACB4410R1ZP" },
    ],
  });
});

// ============================================================================
// 8. SETTLEMENT APIS (/api/v1/settlements/*)
// ============================================================================

v1Router.get("/settlements", (req: Request, res: Response) => {
  res.json({ success: true, count: v1Settlements.length, settlements: v1Settlements });
});

v1Router.get("/settlements/summary", (req: Request, res: Response) => {
  res.json({
    success: true,
    summary: {
      totalDisbursedFY: 489200000,
      currentEscrowHold: 248000,
      nextDisbursementBatch: "Tomorrow 04:00 AM IST (T+1 Automated NEFT/RTGS)",
    },
  });
});

v1Router.get("/settlements/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const item = v1Settlements.find((s) => s.id === id) || v1Settlements[0];
  res.json({
    success: true,
    settlement: item,
    breakdownPipeline: "Booking Amount (₹184,500) ➔ Platform Commission (₹15,682) ➔ GST/TDS (₹4,667) ➔ Net Partner Amount (₹164,151) ➔ Escrow NEFT",
  });
});

// ============================================================================
// 9. INTEGRATION APIS (/api/v1/integrations/*)
// ============================================================================

v1Router.post("/integrations/flight/ndc-sync", (req: Request, res: Response) => {
  res.json({ success: true, adapter: "IATA_NDC_AIRLINE_DIRECT", activeChannels: ["IndiGo", "Air India", "Akasa"] });
});

v1Router.post("/integrations/train/irctc-sync", (req: Request, res: Response) => {
  res.json({ success: true, adapter: "IRCTC_AUTHORIZED_NGET", syncLatencyMs: 42, pnrLiveLookup: "ACTIVE" });
});

v1Router.post("/integrations/bus/gds-sync", (req: Request, res: Response) => {
  res.json({ success: true, adapter: "INTERCITY_BUS_GDS", connectedOperators: 3400 });
});

v1Router.post("/integrations/hotel/crs-sync", (req: Request, res: Response) => {
  res.json({ success: true, adapter: "RATEGAIN_CRS_CHANNEL_MANAGER", liveProperties: 89000 });
});

v1Router.post("/integrations/payment/gateway-sync", (req: Request, res: Response) => {
  res.json({ success: true, adapter: "RAZORPAY_MULTI_RAIL_GATEWAY", webhookHealth: "ONLINE" });
});

v1Router.get("/integrations/maps/geocode", (req: Request, res: Response) => {
  const { q = "Delhi" } = req.query;
  res.json({ success: true, query: q, lat: 28.6139, lng: 77.209, formattedAddress: "New Delhi, Delhi, India" });
});

v1Router.get("/integrations/maps/route-matrix", (req: Request, res: Response) => {
  res.json({ success: true, distanceKm: 284, estimatedDurationMinutes: 280, tollCostEstimateINR: 420 });
});

v1Router.post("/integrations/sms/send-otp", (req: Request, res: Response) => {
  res.json({ success: true, provider: "PINPOINT_SMS_DLT", deliveryStatus: "DELIVERED_IN_1.2S" });
});

v1Router.post("/integrations/email/send-ticket", (req: Request, res: Response) => {
  res.json({ success: true, provider: "TRANSACTIONAL_SES_MIME", messageId: `msg_${Date.now()}` });
});
