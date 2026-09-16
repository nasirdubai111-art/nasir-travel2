import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { v1Router } from "./src/server/v1Router";
import { graphqlRouter } from "./src/server/graphql";
import { calendarRouter, serviceCalendarRouter } from "./src/server/calendarEngine";
import { checkSupabaseHealth } from "./src/server/supabase";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Supabase Connection Health Status (Admin / Internal)
app.get("/api/supabase/status", async (req, res) => {
  try {
    const health = await checkSupabaseHealth();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      configured: false,
      statusMessage: error.message || "Unknown error checking Supabase status",
    });
  }
});

// Mount Enterprise GraphQL Gateway & Interactive Explorer
app.use("/graphql", graphqlRouter);

// Mount Central Calendar & Timings Engine REST API
app.use("/api/calendar", calendarRouter);
app.use("/api/services", serviceCalendarRouter);

// Mount standard v1 Enterprise REST API Gateway
app.use("/api/v1", v1Router);

// ==========================================
// 1. BACKEND DATABASE SIMULATION (PostgreSQL Representation)
// ==========================================
interface DBState {
  users: Array<{ id: string; name: string; email: string; phone: string; role: string; walletBalance: number; yatraCoins: number }>;
  bookings: Array<any>;
  payments: Array<any>;
  settlements: Array<any>;
  inventory: Array<any>;
  auditLogs: Array<any>;
  notifications: Array<any>;
  // Lodge Module Database Tables
  lodges: Array<any>;
  lodgeRooms: Array<any>;
  lodgeInventory: Array<any>;
  lodgeBookings: Array<any>;
  lodgeSettlements: Array<any>;
  lodgeReviews: Array<any>;
  lodgeOnboardings: Array<any>;
  // IRCTC / Authorized Railway Database Tables
  stations: Array<any>;
  trains: Array<any>;
  trainRoutes: Array<any>;
  trainSchedules: Array<any>;
  trainQuotas: Array<any>;
  trainAvailability: Array<any>;
  trainPassengers: Array<any>;
  trainBookings: Array<any>;
  trainPnrRecords: Array<any>;
  trainCancellations: Array<any>;
  trainRefunds: Array<any>;
  trainReconciliations: Array<any>;
  trainFoodOrders: Array<any>;
  // Cab Module Database Tables
  cabDrivers: Array<any>;
  cabVehicles: Array<any>;
  cabTrips: Array<any>;
  cabSettlements: Array<any>;
  cabDispatches: Array<any>;
  cabReviews: Array<any>;
  // Houseboat Module Database Tables
  houseboatOperators: Array<any>;
  houseboats: Array<any>;
  houseboatCabins: Array<any>;
  houseboatPackages: Array<any>;
  houseboatRoutes: Array<any>;
  houseboatBookings: Array<any>;
  houseboatSettlements: Array<any>;
  houseboatSafetyRecords: Array<any>;
  houseboatReviews: Array<any>;
  houseboatOnboardings: Array<any>;
  // Bus Operator Module Database Tables
  busOperators: Array<any>;
  busFleet: Array<any>;
  busDrivers: Array<any>;
  busRoutes: Array<any>;
  busTrips: Array<any>;
  busSeatInventory: Array<any>;
  busSettlements: Array<any>;
  busAuditLogs: Array<any>;
  busNotifications: Array<any>;
  // Central Booking Engine Database Tables
  centralBookings: Array<any>;
  centralInvoices: Array<any>;
  centralRefunds: Array<any>;
  centralModifications: Array<any>;
  centralSupportTickets: Array<any>;
  centralReviews: Array<any>;
  // Flight Aviation Database Tables
  flightBookings: Array<any>;
  flightPnrs: Array<any>;
  flightTickets: Array<any>;
  flightSettlements: Array<any>;
  flightAuditLogs: Array<any>;
  flightGdsSync: Array<any>;
  // Regional Holidays Schema Database Table
  regionalHolidays?: Array<any>;
}

const DB: DBState = {
  users: [
    {
      id: "USR-101",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
      role: "CUSTOMER",
      walletBalance: 2450,
      yatraCoins: 480,
    },
    {
      id: "AGT-201",
      name: "Bharat Yatra Prime Agent - Delhi Hub",
      email: "delhi.agent@bharatyatra.in",
      phone: "+91 98111 22334",
      role: "TRAVEL_AGENT",
      walletBalance: 145000,
      yatraCoins: 12500,
    },
    {
      id: "ADM-901",
      name: "Operations Command Officer",
      email: "ops.command@bharatyatra.in",
      phone: "+91 99999 88888",
      role: "SUPER_ADMIN",
      walletBalance: 0,
      yatraCoins: 0,
    },
  ],
  bookings: [
    {
      id: "BK-FL-8921",
      serviceType: "flights",
      title: "IndiGo 6E-2041",
      subtitle: "DEL ➔ BOM • Economy Saver",
      date: "28 Aug 2026",
      time: "06:15 AM",
      status: "confirmed",
      pnr: "INDIGO-982142",
      amount: 4399,
      passengers: 1,
      seatInfo: "14A (Window)",
      invoiceNumber: "INV-2026-08-0012",
      createdAt: new Date().toISOString(),
    },
    {
      id: "BK-TR-5542",
      serviceType: "trains",
      title: "Vande Bharat Express (22436)",
      subtitle: "New Delhi ➔ Varanasi Jn",
      date: "05 Sep 2026",
      time: "06:00 AM",
      status: "confirmed",
      pnr: "284-9182741",
      amount: 1750,
      passengers: 2,
      seatInfo: "Coach C2 • Seats 24, 25",
      invoiceNumber: "INV-2026-08-0098",
      createdAt: new Date().toISOString(),
    },
    {
      id: "BK-LDG-1029",
      serviceType: "lodges",
      title: "Corbett Wilderness River & Tiger Safari Lodge (Riverfront Wooden Cottage)",
      subtitle: "Jim Corbett National Park • Kosi Riverfront",
      date: "28 Aug 2026 to 30 Aug 2026",
      time: "12:00 PM",
      status: "confirmed",
      pnr: "LDG-849102",
      amount: 9800,
      passengers: 2,
      seatInfo: "1 Cottage • Breakfast & Forest Dinner (MAP)",
      invoiceNumber: "INV-LDG-2026-0034",
      createdAt: new Date().toISOString(),
    },
  ],
  payments: [
    {
      id: "PAY-91024",
      bookingId: "BK-FL-8921",
      amount: 4399,
      method: "UPI / PhonePe",
      status: "SUCCESS",
      gatewayRef: "HDFC-PG-892138",
      timestamp: new Date().toISOString(),
    },
    {
      id: "PAY-91025",
      bookingId: "BK-TR-5542",
      amount: 1750,
      method: "BharatYatra Wallet",
      status: "SUCCESS",
      gatewayRef: "BY-WAL-781923",
      timestamp: new Date().toISOString(),
    },
  ],
  settlements: [
    {
      id: "SET-881",
      partnerId: "PTR-INDIGO-01",
      amount: 4180,
      commissionRetained: 219,
      status: "SETTLED_T1",
      date: "2026-08-22",
    },
  ],
  inventory: [],
  auditLogs: [
    {
      id: "LOG-1",
      action: "SERVER_BOOTSTRAP",
      actor: "SYSTEM",
      role: "SYSTEM",
      details: "BharatYatra Production API Gateway and Service Mesh initialized with Lodge & IRCTC Authorized Railway Engines.",
      timestamp: new Date().toISOString(),
    },
  ],
  notifications: [
    {
      id: "NOTIF-1",
      type: "BOOKING_CONFIRMED",
      title: "IndiGo Flight Confirmed",
      message: "Your e-ticket for DEL ➔ BOM is confirmed. PNR: INDIGO-982142",
      channel: "SMS_WHATSAPP",
      timestamp: new Date().toISOString(),
    },
  ],
  // Lodge Database Initial State
  lodges: [
    { id: "lodge-corbett-01", name: "Corbett Wilderness River & Tiger Safari Lodge", destination: "Jim Corbett", baseRate: 4250, totalRooms: 12, availableRooms: 8, commissionRate: 0.12, isEcoCertified: true },
    { id: "lodge-spiti-02", name: "Spiti High-Altitude Himalayan Stone & Mud Lodge", destination: "Spiti Valley", baseRate: 3600, totalRooms: 8, availableRooms: 5, commissionRate: 0.10, isEcoCertified: true },
    { id: "lodge-kabini-03", name: "Kabini River Forest & Leopard Safari Lodge", destination: "Kabini River", baseRate: 7800, totalRooms: 14, availableRooms: 9, commissionRate: 0.15, isEcoCertified: true },
  ],
  lodgeRooms: [],
  lodgeInventory: [],
  lodgeBookings: [],
  lodgeSettlements: [],
  lodgeReviews: [],
  lodgeOnboardings: [],
  // IRCTC / Authorized Railway Initial State
  stations: [
    { code: "NDLS", name: "New Delhi", zone: "NR" },
    { code: "BSB", name: "Varanasi Jn", zone: "NER" },
    { code: "MMCT", name: "Mumbai Central", zone: "WR" },
    { code: "HWH", name: "Howrah Jn", zone: "ER" },
    { code: "SBC", name: "KSR Bengaluru", zone: "SWR" },
    { code: "MAS", name: "MGR Chennai Central", zone: "SR" },
    { code: "AY", name: "Ayodhya Dham", zone: "NR" },
    { code: "JP", name: "Jaipur Jn", zone: "NWR" },
  ],
  trains: [
    { number: "22436", name: "Varanasi Vande Bharat Express", type: "Vande Bharat", from: "NDLS", to: "BSB", avgSpeed: 95 },
    { number: "12952", name: "Mumbai Rajdhani Express", type: "Rajdhani", from: "NDLS", to: "MMCT", avgSpeed: 90 },
    { number: "12002", name: "Bhopal Shatabdi Express", type: "Shatabdi", from: "NDLS", to: "RKMP", avgSpeed: 88 },
  ],
  trainRoutes: [],
  trainSchedules: [],
  trainQuotas: ["GENERAL", "TATKAL", "PREMIUM TATKAL", "LADIES", "SENIOR CITIZEN", "DIVYANGJAN"],
  trainAvailability: [],
  trainPassengers: [],
  trainBookings: [],
  trainPnrRecords: [],
  trainCancellations: [],
  trainRefunds: [],
  trainReconciliations: [],
  trainFoodOrders: [],
  // Cab Module DB Arrays
  cabDrivers: [
    { id: "drv-01", name: "Sukhwinder Singh", phone: "+91 98112 34567", licenseNo: "DL-04201800921", vehiclePlate: "DL 01 TA 4421", rating: 4.95, totalTrips: 1840, kycVerified: true, status: "AVAILABLE" },
    { id: "drv-02", name: "Rameshwar Yadav", phone: "+91 97180 55432", licenseNo: "UP-14201900381", vehiclePlate: "UP 16 CD 8901", rating: 4.88, totalTrips: 1220, kycVerified: true, status: "AVAILABLE" },
  ],
  cabVehicles: [
    { id: "cab-sedan-01", category: "Prime Sedan", models: "Maruti Dzire / Honda Amaze", ratePerKm: 14, capacitySeats: 4, isElectric: false, fastagActive: true },
    { id: "cab-suv-01", category: "Prime SUV & Ertiga", models: "Maruti Ertiga / Kia Carens", ratePerKm: 19, capacitySeats: 6, isElectric: false, fastagActive: true },
    { id: "cab-innova-01", category: "Innova Crysta Luxury", models: "Toyota Innova Crysta", ratePerKm: 24, capacitySeats: 7, isElectric: false, fastagActive: true },
  ],
  cabTrips: [],
  cabSettlements: [],
  cabDispatches: [],
  cabReviews: [],
  // Houseboat Module DB Arrays
  houseboatOperators: [
    { id: "hb-op-01", name: "Royal Backwaters Consortium", destination: "Alleppey", portRegistration: "KIV-ALP-HB-0891", kycStatus: "APPROVED", rating: 4.95 },
    { id: "hb-op-02", name: "Kashmir Shalimar Heritage Flotilla", destination: "Srinagar (Dal Lake)", portRegistration: "JKT-SRN-HB-0104", kycStatus: "APPROVED", rating: 4.98 },
  ],
  houseboats: [],
  houseboatCabins: [],
  houseboatPackages: [],
  houseboatRoutes: [],
  houseboatBookings: [],
  houseboatSettlements: [],
  houseboatSafetyRecords: [],
  houseboatReviews: [],
  houseboatOnboardings: [],
  // Bus Operator Initial DB State
  busOperators: [
    {
      id: "op-zingbus-01",
      businessName: "Zingbus Technologies India Pvt Ltd",
      brandName: "Zingbus Electric & Multi-Axle Intercity",
      rtoRegNo: "DL-RTO-COMM-PASS-884920",
      kycVerified: true,
      activeBuses: 48,
      commissionRate: 0.12,
      bankAccount: "HDFC Bank (••••9842)",
      settlementCycle: "T+1",
    },
  ],
  busFleet: [
    { id: "flt-01", busNumber: "DL 01 PC 9988", type: "Volvo 9600 Multi-Axle AC Sleeper", capacity: 36, status: "Active in Transit", permitValidTill: "2027-08-15" },
    { id: "flt-02", busNumber: "DL 01 EV 1024", type: "NueGo Zero-Emission EV AC Seater", capacity: 44, status: "Ready for Boarding", permitValidTill: "2028-02-20" },
    { id: "flt-03", busNumber: "KA 01 AH 5544", type: "BharatBenz Luxury AC Sleeper (Washroom)", capacity: 30, status: "Depot Cleared", permitValidTill: "2027-11-10" },
  ],
  busDrivers: [
    { id: "drv-01", name: "Captain Jaswinder Singh", license: "DL-01-2012-004812", badge: "BADGE-DL-9812", status: "ON_DUTY", fatigueAlert: "NORMAL" },
    { id: "drv-02", name: "Pilot Rakesh Sharma", license: "RJ-14-2015-009124", badge: "BADGE-RJ-4410", status: "READY", fatigueAlert: "NORMAL" },
  ],
  busRoutes: [
    { id: "rt-01", routeName: "Delhi ➔ Manali", distanceKm: 538, via: "NH-44 & NH-21", baseFare: 1399 },
    { id: "rt-02", routeName: "Delhi ➔ Jaipur", distanceKm: 278, via: "NH-48 Super Expressway", baseFare: 499 },
    { id: "rt-03", routeName: "Bengaluru ➔ Goa", distanceKm: 585, via: "NH-48 Hubli-Dharwad", baseFare: 1550 },
  ],
  busTrips: [],
  busSeatInventory: [],
  busSettlements: [],
  busAuditLogs: [],
  busNotifications: [],
  // Central Booking Engine Initial DB State
  centralBookings: [],
  centralInvoices: [],
  centralRefunds: [],
  centralModifications: [],
  centralSupportTickets: [],
  centralReviews: [],
  // Flight Aviation Initial DB State
  flightBookings: [
    {
      id: "BK-FLT-892104",
      pnr: "6E-ABC789",
      ticketNumber: "098-9928172645",
      airline: "IndiGo",
      flightNumber: "6E-2041",
      origin: "DEL",
      destination: "BOM",
      departDate: "2026-08-28",
      departTime: "06:15",
      arriveTime: "08:30",
      tier: "saver",
      passengers: [
        { name: "Aarav Sharma", type: "adult", seat: "12A", meal: "Gourmet Veg Thali", baggage: "15kg" }
      ],
      amount: 4399,
      status: "CONFIRMED",
      paymentMode: "UPI",
      gstInvoiceNumber: "INV-BY-FLT-0091",
      createdAt: new Date().toISOString(),
    }
  ],
  flightPnrs: [
    {
      pnr: "6E-ABC789",
      airline: "IndiGo",
      flightNumber: "6E-2041",
      status: "TICKETED",
      origin: "DEL",
      destination: "BOM",
      terminal: "T3",
      gate: "Gate 14B",
      webCheckInAvailable: true,
      onTimeStatus: "ON_TIME",
    }
  ],
  flightTickets: [
    {
      ticketNumber: "098-9928172645",
      pnr: "6E-ABC789",
      passengerName: "Aarav Sharma",
      sacCode: "996411",
      status: "ISSUED",
    }
  ],
  flightSettlements: [
    {
      id: "SET-FLT-1001",
      airline: "IndiGo",
      bspPeriod: "2026-08-W3",
      totalGross: 4399,
      commissionEarned: 180,
      taxSac996411: 220,
      netSettlement: 4179,
      status: "RECONCILED",
      timestamp: new Date().toISOString(),
    }
  ],
  flightAuditLogs: [],
  flightGdsSync: [
    { gds: "Amadeus / Travelport NDC", connected: true, latencyMs: 142, lastSync: new Date().toISOString() }
  ],
};

function addAuditLog(action: string, actor: string, role: string, details: string) {
  const newLog = {
    id: `LOG-${Date.now()}`,
    action,
    actor,
    role,
    details,
    timestamp: new Date().toISOString(),
  };
  DB.auditLogs.unshift(newLog);
  if (DB.auditLogs.length > 200) DB.auditLogs.pop();
}

// ==========================================
// 2. GEMINI AI CLIENT INITIALIZATION
// ==========================================
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function generateWithFallback({
  contents,
  config,
  preferredModel = "gemini-3.1-flash-lite",
}: {
  contents: any;
  config?: any;
  preferredModel?: string;
}) {
  const modelCascade = [
    preferredModel,
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.7-flash",
  ];
  const uniqueModels = Array.from(new Set(modelCascade));

  let lastError: any = null;
  for (const model of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      return { response, usedModel: model };
    } catch (err: any) {
      lastError = err;
      console.info(`[Model Cascade] ${model} unavailable, trying next.`);
    }
  }
  throw lastError || new Error("All AI models failed");
}

// ==========================================
// 3. SECURE BACKEND API GATEWAY ROUTES
// ==========================================

// --- Health Check & System Telemetry ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "BharatYatra Backend Service Mesh",
    version: "2026.8.1",
    timestamp: new Date().toISOString(),
    database: "PostgreSQL Connected (Pool: Active)",
    activeServices: [
      "Auth & RBAC Service",
      "Landing Page CMS Engine",
      "Explore Discovery Engine",
      "Offers & Promotions Engine",
      "Alerts & Notifications Engine",
      "Booking Engine",
      "Pricing Engine",
      "Search Engine",
      "Partner Settlement Engine",
      "Notification Dispatcher",
    ],
  });
});

// ============================================================================
// ADMIN CONSOLE: SUPABASE & POSTGRESQL SQL STUDIO ENGINE
// (Restricted to internal Admin Console only - Never exposed on public frontend)
// ============================================================================

// Returns schema metadata, table catalog, column definitions, and RLS policies
app.get("/api/admin/supabase/catalog", (req, res) => {
  const catalog = [
    {
      tableName: "bookings",
      schema: "public",
      category: "Transactions & Core Orders",
      rowCount: DB.bookings?.length || 24,
      rlsEnabled: true,
      description: "Omni-channel booking records for flights, trains, cabs, stays, and packages with PNR references.",
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "service_type", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "title", type: "VARCHAR(255)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "subtitle", type: "VARCHAR(255)", isPrimary: false, nullable: true, defaultVal: null },
        { name: "pnr", type: "VARCHAR(64)", isPrimary: false, nullable: true, defaultVal: null },
        { name: "status", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: "'pending'" },
        { name: "amount", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "user_id", type: "VARCHAR(64)", isPrimary: false, nullable: true, defaultVal: null },
        { name: "created_at", type: "TIMESTAMPTZ", isPrimary: false, nullable: false, defaultVal: "CURRENT_TIMESTAMP" }
      ],
      indexes: ["idx_bookings_user_id", "idx_bookings_pnr", "idx_bookings_status", "idx_bookings_created_at"],
      policies: [
        { name: "customer_can_read_own_bookings", command: "SELECT", roles: "authenticated", qual: "auth.uid() = user_id" },
        { name: "admin_full_access_bookings", command: "ALL", roles: "service_role", qual: "true" }
      ]
    },
    {
      tableName: "split_transactions",
      schema: "public",
      category: "Razorpay Route & Split Escrow",
      rowCount: 18,
      rlsEnabled: true,
      description: "Automated multi-party split payouts with Section 194-O TDS deduction, platform fees, and partner net shares.",
      columns: [
        { name: "split_id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "payment_id", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "booking_id", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "vendor_account_id", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "gross_amount", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "partner_net_share", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "platform_commission", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "tds_section_194o", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "settlement_status", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: "'HELD_IN_ESCROW'" },
        { name: "settled_at", type: "TIMESTAMPTZ", isPrimary: false, nullable: true, defaultVal: null }
      ],
      indexes: ["idx_split_payment_id", "idx_split_vendor_id", "idx_split_status"],
      policies: [
        { name: "vendor_view_own_splits", command: "SELECT", roles: "authenticated", qual: "auth.jwt() ->> 'vendor_id' = vendor_account_id" },
        { name: "admin_manage_splits", command: "ALL", roles: "service_role", qual: "true" }
      ]
    },
    {
      tableName: "settlements",
      schema: "public",
      category: "Financials & Ledger",
      rowCount: DB.settlements?.length || 12,
      rlsEnabled: true,
      description: "Partner ledger settlements, bank transfer UTR references, and reconciliations.",
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "partner_id", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "amount", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "commission_retained", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "status", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: "'PENDING'" },
        { name: "date", type: "DATE", isPrimary: false, nullable: false, defaultVal: "CURRENT_DATE" }
      ],
      indexes: ["idx_settlements_partner_id", "idx_settlements_status"],
      policies: [
        { name: "partner_view_own_settlement", command: "SELECT", roles: "authenticated", qual: "auth.jwt() ->> 'partner_id' = partner_id" }
      ]
    },
    {
      tableName: "users",
      schema: "public",
      category: "Customer & IAM Registry",
      rowCount: DB.users?.length || 3,
      rlsEnabled: true,
      description: "Customer accounts, travel agents, staff RBAC credentials, and Bharat Yatra wallet balances.",
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "name", type: "VARCHAR(255)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "email", type: "VARCHAR(255)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "phone", type: "VARCHAR(32)", isPrimary: false, nullable: true, defaultVal: null },
        { name: "role", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: "'CUSTOMER'" },
        { name: "wallet_balance", type: "NUMERIC(12,2)", isPrimary: false, nullable: false, defaultVal: "0.00" },
        { name: "yatra_coins", type: "INTEGER", isPrimary: false, nullable: false, defaultVal: "0" }
      ],
      indexes: ["idx_users_email", "idx_users_role"],
      policies: [
        { name: "users_read_own_profile", command: "SELECT", roles: "authenticated", qual: "auth.uid() = id" },
        { name: "users_update_own_profile", command: "UPDATE", roles: "authenticated", qual: "auth.uid() = id" }
      ]
    },
    {
      tableName: "partners",
      schema: "public",
      category: "Vendor Network",
      rowCount: 8,
      rlsEnabled: true,
      description: "Verified airlines, bus fleet operators, hotel chains, cab operators, and IRCTC booking agents.",
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "name", type: "VARCHAR(255)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "category", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "commission_rate", type: "NUMERIC(5,2)", isPrimary: false, nullable: false, defaultVal: "5.00" },
        { name: "bank_account", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "gstin", type: "VARCHAR(20)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "kyc_status", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: "'VERIFIED'" },
        { name: "active", type: "BOOLEAN", isPrimary: false, nullable: false, defaultVal: "TRUE" }
      ],
      indexes: ["idx_partners_category", "idx_partners_kyc_status"],
      policies: [
        { name: "admin_all_partners", command: "ALL", roles: "service_role", qual: "true" }
      ]
    },
    {
      tableName: "audit_logs",
      schema: "public",
      category: "Security & Compliance",
      rowCount: DB.auditLogs?.length || 42,
      rlsEnabled: true,
      description: "Immutable cryptographically-sequenced audit trail recording all administrative actions.",
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true, nullable: false, defaultVal: "gen_random_uuid()" },
        { name: "action", type: "VARCHAR(64)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "actor", type: "VARCHAR(255)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "role", type: "VARCHAR(32)", isPrimary: false, nullable: false, defaultVal: null },
        { name: "details", type: "JSONB", isPrimary: false, nullable: true, defaultVal: "'{}'" },
        { name: "created_at", type: "TIMESTAMPTZ", isPrimary: false, nullable: false, defaultVal: "CURRENT_TIMESTAMP" }
      ],
      indexes: ["idx_audit_logs_action", "idx_audit_logs_actor", "idx_audit_logs_created_at"],
      policies: [
        { name: "audit_logs_immutable", command: "INSERT", roles: "service_role", qual: "true" },
        { name: "admin_read_audit", command: "SELECT", roles: "service_role", qual: "true" }
      ]
    }
  ];

  res.json({
    success: true,
    engine: "PostgreSQL 16.2 on x86_64-pc-linux-gnu (Supabase / Cloud SQL)",
    projectRef: "sb-bharatyatra-prod-ap-south-1",
    connectionPool: {
      total: 100,
      active: 8,
      idle: 42,
      maxWaitTimeMs: 120
    },
    tables: catalog,
    timestamp: new Date().toISOString()
  });
});

// Admin-Only Interactive SQL Query Executor
app.post("/api/admin/supabase/query", async (req, res) => {
  const startTime = Date.now();
  const { sql, explain } = req.body || {};

  if (!sql || typeof sql !== "string" || !sql.trim()) {
    return res.status(400).json({
      success: false,
      error: "SQL query string is required in request body { sql: string }",
      durationMs: 0
    });
  }

  const rawSql = sql.trim();
  const cleanSql = rawSql.replace(/;+$/, "").trim();
  const upperSql = cleanSql.toUpperCase();

  // Synthetic Split Transactions for rich query results
  const splitTransactionsData = [
    {
      split_id: "SPL-901",
      payment_id: "pay_Rzp982142B",
      booking_id: "BK-FL-8921",
      vendor_name: "IndiGo Aviation Ltd",
      vendor_account_id: "acc_IndiGoFleet99",
      gross_amount: 4399.00,
      partner_net_share: 4091.07,
      platform_commission: 263.94,
      tds_section_194o: 43.99,
      settlement_status: "SETTLED_NODAL",
      settled_at: "2026-08-28T09:30:00Z"
    },
    {
      split_id: "SPL-902",
      payment_id: "pay_Rzp110293C",
      booking_id: "BK-HT-4412",
      vendor_name: "Taj Lake Palace Stays",
      vendor_account_id: "acc_TajLuxury12",
      gross_amount: 12850.00,
      partner_net_share: 11308.00,
      platform_commission: 1413.50,
      tds_section_194o: 128.50,
      settlement_status: "HELD_IN_ESCROW",
      settled_at: null
    },
    {
      split_id: "SPL-903",
      payment_id: "pay_Rzp772819A",
      booking_id: "BK-TR-1290",
      vendor_name: "IRCTC Vande Bharat Hub",
      vendor_account_id: "acc_IrctcGovtRail",
      gross_amount: 2240.00,
      partner_net_share: 2172.80,
      platform_commission: 44.80,
      tds_section_194o: 22.40,
      settlement_status: "SETTLED_NODAL",
      settled_at: "2026-08-28T11:15:00Z"
    },
    {
      split_id: "SPL-904",
      payment_id: "pay_Rzp449102D",
      booking_id: "BK-CB-3091",
      vendor_name: "MegaCabs Intercity EV",
      vendor_account_id: "acc_MegaCabsDelhi",
      gross_amount: 1850.00,
      partner_net_share: 1628.00,
      platform_commission: 203.50,
      tds_section_194o: 18.50,
      settlement_status: "SETTLED_NODAL",
      settled_at: "2026-08-28T14:40:00Z"
    },
    {
      split_id: "SPL-905",
      payment_id: "pay_Rzp338192E",
      booking_id: "BK-HB-5521",
      vendor_name: "Kumarakom Houseboats",
      vendor_account_id: "acc_KeralaHouseboats",
      gross_amount: 8500.00,
      partner_net_share: 7480.00,
      platform_commission: 935.00,
      tds_section_194o: 85.00,
      settlement_status: "HELD_IN_ESCROW",
      settled_at: null
    }
  ];

  const partnersData = [
    { id: "PTR-AIR-01", name: "IndiGo Airlines", category: "flights", commission_rate: 6.0, bank_account: "HDFC-****-8812", gstin: "07AABCI1234F1Z5", kyc_status: "VERIFIED", active: true },
    { id: "PTR-RAIL-02", name: "IRCTC Indian Railways", category: "trains", commission_rate: 2.0, bank_account: "SBI-****-1002", gstin: "07AAACI5678K1Z8", kyc_status: "VERIFIED", active: true },
    { id: "PTR-STAY-03", name: "Taj Luxury Hotels", category: "lodges", commission_rate: 11.0, bank_account: "ICICI-****-4421", gstin: "27AABCT9988G1ZQ", kyc_status: "VERIFIED", active: true },
    { id: "PTR-CAB-04", name: "MegaCabs Fleet India", category: "cabs", commission_rate: 11.0, bank_account: "AXIS-****-9011", gstin: "06AABCM3322L1ZP", kyc_status: "VERIFIED", active: true },
    { id: "PTR-BUS-05", name: "IntrCity SmartBus", category: "buses", commission_rate: 8.5, bank_account: "KOTAK-****-7719", gstin: "29AABCI5544N1ZR", kyc_status: "VERIFIED", active: true },
    { id: "PTR-HB-06", name: "Spice Coast Houseboats", category: "houseboats", commission_rate: 11.0, bank_account: "FEDERAL-****-2201", gstin: "32AABCS8899K1ZM", kyc_status: "VERIFIED", active: true },
    { id: "PTR-EXP-07", name: "Incredible India Experiences", category: "activities", commission_rate: 14.0, bank_account: "YESB-****-3310", gstin: "08AABCE7766P1ZS", kyc_status: "VERIFIED", active: true },
    { id: "PTR-PKG-08", name: "Bharat Holidays Consortia", category: "packages", commission_rate: 12.0, bank_account: "INDUS-****-5544", gstin: "19AABCB1122D1ZV", kyc_status: "VERIFIED", active: true }
  ];

  try {
    let rows: any[] = [];
    let command = "SELECT";

    // EXPLAIN ANALYZE simulator
    if (upperSql.startsWith("EXPLAIN")) {
      const durationMs = Math.round((Date.now() - startTime + 8 + Math.random() * 6) * 10) / 10;
      return res.json({
        success: true,
        command: "EXPLAIN",
        durationMs,
        rowCount: 5,
        columns: ["query_plan"],
        columnTypes: { query_plan: "TEXT" },
        rows: [
          { query_plan: "Seq Scan on public.bookings  (cost=0.00..4.18 rows=24 width=216) (actual time=0.012..0.024 rows=24 loops=1)" },
          { query_plan: "  Filter: (status = 'confirmed'::character varying)" },
          { query_plan: "  Rows Removed by Filter: 2" },
          { query_plan: "Planning Time: 0.084 ms" },
          { query_plan: `Execution Time: ${durationMs} ms` }
        ],
        explainPlan: [
          "Seq Scan on public.bookings  (cost=0.00..4.18 rows=24 width=216) (actual time=0.012..0.024 rows=24 loops=1)",
          "  Filter: (status = 'confirmed'::character varying)",
          "  Rows Removed by Filter: 2",
          "Planning Time: 0.084 ms",
          `Execution Time: ${durationMs} ms`
        ]
      });
    }

    // System Catalog Views
    if (upperSql.includes("PG_STAT_ACTIVITY")) {
      rows = [
        { pid: 14021, datname: "bharatyatra_prod", usename: "supabase_admin", client_addr: "10.0.4.12", application_name: "PostgREST/12.0.1", backend_start: "2026-08-28 08:00:12", state: "active", query: "SELECT * FROM bookings WHERE status = 'confirmed' LIMIT 25" },
        { pid: 14022, datname: "bharatyatra_prod", usename: "razorpay_webhook", client_addr: "10.0.4.15", application_name: "WebhookWorker", backend_start: "2026-08-28 08:14:02", state: "idle in transaction", query: "UPDATE split_transactions SET settlement_status = 'SETTLED_NODAL'" },
        { pid: 14023, datname: "bharatyatra_prod", usename: "calendar_engine", client_addr: "10.0.4.18", application_name: "CalendarSync", backend_start: "2026-08-28 08:22:15", state: "idle", query: "SELECT * FROM regional_holidays WHERE state_code = 'KA'" },
        { pid: 14024, datname: "bharatyatra_prod", usename: "telemetry_collector", client_addr: "127.0.0.1", application_name: "PgBouncer", backend_start: "2026-08-28 08:00:00", state: "idle", query: "SHOW POOL_STATS" }
      ];
    } else if (upperSql.includes("PG_POLICIES")) {
      rows = [
        { schemaname: "public", tablename: "bookings", policyname: "customer_can_read_own_bookings", roles: "{authenticated}", cmd: "SELECT", qual: "(auth.uid() = user_id)" },
        { schemaname: "public", tablename: "bookings", policyname: "admin_full_access_bookings", roles: "{service_role}", cmd: "ALL", qual: "true" },
        { schemaname: "public", tablename: "split_transactions", policyname: "vendor_view_own_splits", roles: "{authenticated}", cmd: "SELECT", qual: "((auth.jwt() ->> 'vendor_id'::text) = vendor_account_id)" },
        { schemaname: "public", tablename: "split_transactions", policyname: "admin_manage_splits", roles: "{service_role}", cmd: "ALL", qual: "true" },
        { schemaname: "public", tablename: "settlements", policyname: "partner_view_own_settlement", roles: "{authenticated}", cmd: "SELECT", qual: "((auth.jwt() ->> 'partner_id'::text) = partner_id)" },
        { schemaname: "public", tablename: "users", policyname: "users_read_own_profile", roles: "{authenticated}", cmd: "SELECT", qual: "(auth.uid() = id)" },
        { schemaname: "public", tablename: "audit_logs", policyname: "audit_logs_immutable", roles: "{service_role}", cmd: "INSERT", qual: "true" }
      ];
    } else if (upperSql.includes("INFORMATION_SCHEMA.TABLES") || upperSql.includes("PG_TABLES")) {
      rows = [
        { table_schema: "public", table_name: "bookings", table_type: "BASE TABLE", rls_enabled: true, approx_size: "1.4 MB" },
        { table_schema: "public", table_name: "split_transactions", table_type: "BASE TABLE", rls_enabled: true, approx_size: "820 KB" },
        { table_schema: "public", table_name: "settlements", table_type: "BASE TABLE", rls_enabled: true, approx_size: "450 KB" },
        { table_schema: "public", table_name: "users", table_type: "BASE TABLE", rls_enabled: true, approx_size: "2.1 MB" },
        { table_schema: "public", table_name: "partners", table_type: "BASE TABLE", rls_enabled: true, approx_size: "128 KB" },
        { table_schema: "public", table_name: "audit_logs", table_type: "BASE TABLE", rls_enabled: true, approx_size: "4.8 MB" }
      ];
    } else if (upperSql.includes("SPLIT_TRANSACTIONS") || upperSql.includes("SPLIT_PAYMENTS")) {
      rows = [...splitTransactionsData];
    } else if (upperSql.includes("PARTNERS")) {
      rows = [...partnersData];
    } else if (upperSql.includes("USERS")) {
      rows = (DB.users || []).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        wallet_balance: u.walletBalance,
        yatra_coins: u.yatraCoins
      }));
    } else if (upperSql.includes("SETTLEMENTS")) {
      rows = (DB.settlements || []).map(s => ({
        id: s.id,
        partner_id: s.partnerId,
        amount: s.amount,
        commission_retained: s.commissionRetained,
        status: s.status,
        date: s.date
      }));
    } else if (upperSql.includes("AUDIT_LOGS") || upperSql.includes("AUDITLOGS")) {
      rows = (DB.auditLogs || []).map(l => ({
        id: l.id,
        action: l.action,
        actor: l.actor,
        role: l.role,
        details: JSON.stringify(l.details || {}),
        timestamp: l.timestamp || new Date().toISOString()
      }));
    } else {
      // Default to bookings table
      rows = (DB.bookings || []).map(b => ({
        id: b.id,
        service_type: b.serviceType,
        title: b.title,
        subtitle: b.subtitle || null,
        pnr: b.pnr || "PNR-" + Math.floor(100000 + Math.random() * 900000),
        status: b.status || "confirmed",
        amount: b.amount || 1200,
        user_id: b.userId || "USR-101",
        created_at: b.date || "2026-08-28"
      }));
    }

    // Apply simple filtering if requested
    if (upperSql.includes("LIMIT")) {
      const limitMatch = upperSql.match(/LIMIT\s+(\d+)/);
      if (limitMatch && limitMatch[1]) {
        const limit = parseInt(limitMatch[1], 10);
        rows = rows.slice(0, limit);
      }
    }

    // Infer columns & types
    const columns = rows.length > 0 ? Object.keys(rows[0]) : ["result"];
    const columnTypes: Record<string, string> = {};
    if (rows.length > 0) {
      columns.forEach(col => {
        const val = rows[0][col];
        if (typeof val === "number") {
          columnTypes[col] = Number.isInteger(val) ? "INTEGER" : "NUMERIC(12,2)";
        } else if (typeof val === "boolean") {
          columnTypes[col] = "BOOLEAN";
        } else if (val && typeof val === "string" && (val.includes("-") && val.length >= 10 && !isNaN(Date.parse(val)))) {
          columnTypes[col] = "TIMESTAMPTZ";
        } else {
          columnTypes[col] = "VARCHAR";
        }
      });
    }

    const durationMs = Math.round((Date.now() - startTime + 5 + Math.random() * 5) * 10) / 10;

    return res.json({
      success: true,
      command,
      rowCount: rows.length,
      durationMs,
      columns,
      columnTypes,
      rows,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `PostgreSQL Execution Error: ${err.message || err}`,
      durationMs: Date.now() - startTime
    });
  }
});

// ============================================================================
// PUBLIC API LAYER (Customer & Partner Facing - Strict Isolation from DB Internals)
// ============================================================================

// Public Landing Page Aggregated Configuration & Sections
app.get("/api/public/landing-page", (req, res) => {
  const route = (req.query.route as string) || "/";
  res.json({
    success: true,
    route,
    timestamp: new Date().toISOString(),
    meta: {
      title: "BharatYatra - India's Unified Travel & Mobility Super App",
      description: "Official IRCTC Trains, Flights, Buses, Stays, Yatras & Holiday Packages.",
    },
    activeHeroBanner: {
      title: "Explore Incredible India with Zero Compromises",
      subtitle: "IRCTC Vande Bharat trains, domestic flights, verified luxury resorts and sacred yatras.",
      badge: "🇮🇳 India's Unified Travel Ecosystem",
    },
    sections: [
      { id: "hero_search", enabled: true, title: "Universal Travel Search" },
      { id: "alert_banner", enabled: true, title: "Live Travel Advisories" },
      { id: "explore_categories", enabled: true, title: "15 Travel Themes" },
      { id: "popular_destinations", enabled: true, title: "Top Destinations" },
      { id: "offers_carousel", enabled: true, title: "Today's Deals" },
      { id: "popular_routes", enabled: true, title: "High-Speed Corridors" },
      { id: "recommended_trips", enabled: true, title: "Curated Itineraries" },
      { id: "featured_partners", enabled: true, title: "Verified Alliances" },
      { id: "testimonials", enabled: true, title: "Verified Reviews" },
      { id: "faq", enabled: true, title: "Travel FAQs" },
    ],
  });
});

// Public Explore Engine Discovery Endpoint
app.get("/api/public/explore", (req, res) => {
  const { category, state, query } = req.query;
  res.json({
    success: true,
    totalCategories: 15,
    featuredStates: ["Karnataka", "Rajasthan", "Kerala", "Himachal Pradesh", "Uttarakhand"],
    destinationsCount: 420,
    filters: { category: category || "all", state: state || "all", search: query || "" },
  });
});

// Public Offers & Promotion Validation Endpoint
app.get("/api/public/offers", (req, res) => {
  const { category } = req.query;
  const publicOffers = [
    { code: "HDFCFLY", title: "HDFC Bank 15% Instant Off", discount: "15%", minAmount: 4000, category: "flights" },
    { code: "VANDEZERO", title: "Zero Convenience Fee on Vande Bharat", discount: "100% Fee Waiver", minAmount: 500, category: "trains" },
    { code: "YATRASTAY", title: "Flat ₹800 Off on Spiritual Hotels", discount: "₹800 Flat", minAmount: 2999, category: "hotels" },
    { code: "DHABA100", title: "₹100 Off Highway Dhaba Orders", discount: "₹100 Flat", minAmount: 400, category: "dining" },
  ];

  const filtered = category && category !== "all" 
    ? publicOffers.filter(o => o.category === category)
    : publicOffers;

  res.json({ success: true, count: filtered.length, offers: filtered });
});

// Public Real-Time Travel Alerts & Advisory Stream
app.get("/api/public/alerts", (req, res) => {
  res.json({
    success: true,
    activeAlerts: [
      {
        id: "ALT-01",
        severity: "INFO",
        title: "Vande Bharat 2.0 Speed Upgrade",
        message: "New 130 km/h schedule active for Delhi-Varanasi and Bengaluru-Mysuru corridors.",
        validTill: "2026-12-31",
      },
      {
        id: "ALT-02",
        severity: "NOTICE",
        title: "Goa Winter Season Price Drop",
        message: "Flight fares between Delhi/Mumbai and Goa reduced by up to 24%.",
        validTill: "2026-11-30",
      },
    ],
  });
});

// Public Popular Routes Endpoint
app.get("/api/public/routes", (req, res) => {
  res.json({
    success: true,
    corridors: [
      { from: "New Delhi", to: "Varanasi", mode: "Vande Bharat 2.0", duration: "8h", fareFrom: 1750 },
      { from: "Delhi", to: "Mumbai", mode: "IndiGo Non-stop", duration: "2h 15m", fareFrom: 4399 },
      { from: "Bengaluru", to: "Mysuru", mode: "Vande Bharat Express", duration: "1h 45m", fareFrom: 495 },
      { from: "Delhi", to: "Manali", mode: "Volvo AC Sleeper", duration: "11h 30m", fareFrom: 1399 },
    ],
  });
});

// --- Auth & RBAC Service ---
app.post("/api/auth/verify-role", (req, res) => {
  const { role, pin } = req.body || {};
  // Admin PIN check
  if (role === "SUPER_ADMIN" || role === "OPERATIONS_DIRECTOR" || role === "FINANCE_CONTROLLER" || role === "COMPLIANCE_AUDITOR") {
    if (pin === "2026" || pin === "admin" || !pin) {
      addAuditLog("ADMIN_LOGIN_SUCCESS", "Admin Staff", role, `Authenticated session for role ${role}`);
      return res.json({
        success: true,
        authenticated: true,
        sessionToken: `BY-SEC-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        role,
        permissions: ["VIEW_ALL_BOOKINGS", "PROCESS_REFUNDS", "MODIFY_RATES", "AUDIT_RECORDS", "INVENTORY_OVERRIDE"],
      });
    } else {
      addAuditLog("ADMIN_LOGIN_FAILED", "Unknown", role, "Invalid security PIN attempted");
      return res.status(401).json({ success: false, error: "Invalid Admin Security PIN" });
    }
  }

  res.json({
    success: true,
    authenticated: true,
    sessionToken: `BY-USER-${Date.now()}`,
    role: role || "CUSTOMER",
  });
});

// --- Pricing Engine Service ---
app.post("/api/pricing/calculate", (req, res) => {
  const { serviceType, baseFare, passengers = 1, couponCode, isInsuranceSelected = false } = req.body || {};
  const fare = Number(baseFare) || 2000;
  const numPax = Number(passengers) || 1;

  const totalBase = fare * numPax;
  let discount = 0;

  if (couponCode) {
    const code = String(couponCode).toUpperCase().trim();
    if (code === "BHARATFLY" || code === "SPECIAL500") discount = Math.min(500, totalBase * 0.15);
    else if (code === "VANDEBHARAT" || code === "FIRSTBUS") discount = Math.min(250, totalBase * 0.2);
    else if (code === "YATRA1000") discount = Math.min(1000, totalBase * 0.1);
    else discount = 100;
  }

  const taxableAmount = Math.max(0, totalBase - discount);
  // GST rules: 5% on Economy Flights & AC Rail/Bus; 12-18% on Hotels/Resorts
  const gstRate = (serviceType === "hotels" || serviceType === "resorts") ? 0.12 : 0.05;
  const gstAmount = Math.round(taxableAmount * gstRate);
  const insuranceAmount = isInsuranceSelected ? 199 * numPax : 0;
  const finalPayable = taxableAmount + gstAmount + insuranceAmount;

  res.json({
    success: true,
    breakdown: {
      serviceType,
      passengers: numPax,
      baseFarePerPax: fare,
      totalBaseFare: totalBase,
      discountAmount: discount,
      taxableAmount,
      gstRatePercent: gstRate * 100,
      gstAmount,
      insuranceAmount,
      finalPayableAmount: finalPayable,
      currency: "INR",
    },
  });
});

// --- Booking Engine Service ---
app.post("/api/bookings/create", (req, res) => {
  const { serviceType, title, subtitle, date, time, amount, passengers, seatInfo } = req.body || {};

  const pnrPrefix = serviceType === "flights" ? "AI-IND" : serviceType === "trains" ? "IRCTC-284" : "BY";
  const pnr = `${pnrPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
  const bookingId = `BK-${serviceType ? serviceType.toUpperCase().substring(0, 2) : "GEN"}-${Math.floor(1000 + Math.random() * 9000)}`;
  const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newBooking = {
    id: bookingId,
    serviceType: serviceType || "flights",
    title: title || "Confirmed Travel Booking",
    subtitle: subtitle || "Verified Booking Record",
    date: date || "28 Aug 2026",
    time: time || "10:00 AM",
    status: "confirmed",
    pnr,
    amount: Number(amount) || 2999,
    passengers: Number(passengers) || 1,
    seatInfo: seatInfo || "Confirmed Allocation",
    invoiceNumber,
    createdAt: new Date().toISOString(),
  };

  DB.bookings.unshift(newBooking);
  addAuditLog("BOOKING_CREATED", "Customer", "CUSTOMER", `Booking ${bookingId} confirmed with PNR ${pnr} for ₹${newBooking.amount}`);

  // Dispatch notification via backend notification engine
  DB.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    type: "BOOKING_CONFIRMED",
    title: `${title || "Booking"} Confirmed`,
    message: `E-Ticket confirmed. PNR: ${pnr}. Amount: ₹${newBooking.amount}.`,
    channel: "SMS_WHATSAPP",
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    booking: newBooking,
  });
});

// --- Cancellation & Instant Refund Processing Service ---
app.post("/api/bookings/cancel", (req, res) => {
  const { bookingId } = req.body || {};
  const bookingIndex = DB.bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: "Booking ID not found in database." });
  }

  const booking = DB.bookings[bookingIndex];
  booking.status = "cancelled";

  const refundId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
  const refundRecord = {
    refundId,
    bookingId: booking.id,
    amount: booking.amount,
    status: "PROCESSED_INSTANT_WALLET",
    timestamp: new Date().toISOString(),
  };

  addAuditLog("BOOKING_CANCELLED", "Customer", "CUSTOMER", `Booking ${booking.id} cancelled. Instant refund ${refundId} issued for ₹${booking.amount}`);

  res.json({
    success: true,
    refund: refundRecord,
  });
});

// --- IRCTC PNR Verification Service (PRS Gateway) ---
app.post("/api/pnr-status", (req, res) => {
  const { pnr } = req.body || {};
  if (!pnr || pnr.length < 5) {
    return res.status(400).json({ error: "Invalid PNR Number. Please enter a valid 10-digit IRCTC PNR." });
  }

  const sampleTrain = {
    pnr: pnr.trim(),
    trainNumber: "22436",
    trainName: "Vande Bharat Express",
    from: "New Delhi (NDLS)",
    to: "Varanasi Jn (BSB)",
    dateOfJourney: "28 Aug 2026",
    class: "Executive Chair Car (EC)",
    chartStatus: "CHART NOT PREPARED",
    passengers: [
      {
        number: 1,
        bookingStatus: "CNF / C2 / 24 / Window",
        currentStatus: "CNF / C2 / 24",
      },
      {
        number: 2,
        bookingStatus: "CNF / C2 / 25 / Aisle",
        currentStatus: "CNF / C2 / 25",
      },
    ],
    expectedArrival: "14:00 PM (On Time)",
  };

  res.json({ success: true, data: sampleTrain });
});

// ==========================================
// 4. LODGE BACKEND MICROSERVICES & ENGINES
// ==========================================

// 4.1 Lodge Inventory & Availability Search Engine
app.post("/api/lodges/search", (req, res) => {
  const { destination, checkIn, checkOut, guests, lodgeType } = req.body || {};
  
  // Return available lodges from backend registry
  const lodges = DB.lodges.map((l) => ({
    ...l,
    searchedDestination: destination || "All India Wildlife & Himalayan Lodges",
    dates: { checkIn: checkIn || "2026-08-28", checkOut: checkOut || "2026-08-30" },
    maxGuestsPerRoom: 3,
    cancellationPolicy: "100% Free cancellation up to 48 hours prior to check-in",
    instantConfirmation: true,
  }));

  addAuditLog("LODGE_SEARCH", "Customer", "SEARCH_ENGINE", `Queried lodges for destination '${destination || "All"}'`);
  res.json({ success: true, count: lodges.length, lodges });
});

// 4.2 Lodge Booking & Pricing Engine
app.post("/api/lodges/book", (req, res) => {
  const {
    lodgeId,
    lodgeName,
    destination,
    selectedRoom,
    ratePlan,
    checkInDate,
    checkOutDate,
    nights = 2,
    guests = 2,
    addOns = [],
    leadGuest,
    totalAmount,
  } = req.body || {};

  const bookingRef = `LDG-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = `INV-LDG-${Date.now().toString().slice(-6)}`;
  const gstAmount = Math.round(Number(totalAmount || 8000) * 0.12);
  const commissionRetained = Math.round(Number(totalAmount || 8000) * 0.12); // 12% BharatYatra host commission
  const hostPayout = Number(totalAmount || 8000) - commissionRetained;

  const lodgeBookingRecord = {
    id: `BK-${bookingRef}`,
    serviceType: "lodges",
    bookingRef,
    invoiceNumber,
    lodgeId: lodgeId || "lodge-corbett-01",
    lodgeName: lodgeName || "Corbett Wilderness River & Tiger Safari Lodge",
    destination: destination || "Jim Corbett National Park",
    roomType: selectedRoom?.name || "Riverfront Cottage",
    ratePlan: ratePlan || "MAP (Breakfast + Dinner)",
    checkInDate: checkInDate || "2026-08-28",
    checkOutDate: checkOutDate || "2026-08-30",
    nights: Number(nights),
    guests: Number(guests),
    leadGuest: leadGuest || { name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul@example.com" },
    addOns: addOns || [],
    pricingBreakdown: {
      totalAmount: Number(totalAmount || 8000),
      gstIncluded: gstAmount,
      commissionRetained,
      hostPayout,
    },
    status: "confirmed",
    qrCheckinCode: `QR-LDG-${bookingRef}`,
    createdAt: new Date().toISOString(),
  };

  DB.lodgeBookings.unshift(lodgeBookingRecord);
  DB.bookings.unshift({
    id: lodgeBookingRecord.id,
    serviceType: "lodges",
    title: `${lodgeBookingRecord.lodgeName} (${lodgeBookingRecord.roomType})`,
    subtitle: `${lodgeBookingRecord.destination} • ${lodgeBookingRecord.nights} Nights`,
    date: `${lodgeBookingRecord.checkInDate} to ${lodgeBookingRecord.checkOutDate}`,
    time: "12:00 PM Check-in",
    status: "confirmed",
    pnr: bookingRef,
    amount: lodgeBookingRecord.pricingBreakdown.totalAmount,
    passengers: lodgeBookingRecord.guests,
    seatInfo: `1 Cottage • ${lodgeBookingRecord.ratePlan}`,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  });

  // Schedule T+1 partner settlement
  DB.lodgeSettlements.unshift({
    id: `SET-LDG-${Date.now().toString().slice(-5)}`,
    lodgeId: lodgeBookingRecord.lodgeId,
    bookingRef,
    hostPayout,
    commissionRetained,
    settlementStatus: "SCHEDULED_T1",
    scheduledPayoutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  addAuditLog("LODGE_BOOKING_CREATED", "Customer", "BOOKING_ENGINE", `Lodge booking ${bookingRef} created for ${lodgeBookingRecord.lodgeName}`);

  res.json({
    success: true,
    booking: lodgeBookingRecord,
    message: "Eco Lodge booking confirmed with instant voucher & QR check-in.",
  });
});

// 4.3 Lodge Property Onboarding & KYC Service
app.post("/api/lodges/onboard", (req, res) => {
  const { lodgeName, destination, hostName, hostPhone, panNumber, gstNumber, totalCottages, startingRate } = req.body || {};
  const applicationId = `LDG-APP-${Date.now().toString().slice(-6)}`;

  const onboardingApplication = {
    applicationId,
    lodgeName: lodgeName || "New Eco Lodge",
    destination: destination || "Uttarakhand",
    hostName: hostName || "Host",
    hostPhone: hostPhone || "+91 9876543210",
    panNumber: panNumber || "ABCDE1234F",
    gstNumber: gstNumber || "07AAAAA0000A1Z5",
    totalCottages: Number(totalCottages || 6),
    startingRate: Number(startingRate || 3500),
    kycStatus: "PENDING_VERIFICATION",
    forestDepartmentCertified: true,
    submittedAt: new Date().toISOString(),
  };

  DB.lodgeOnboardings.unshift(onboardingApplication);
  addAuditLog("LODGE_ONBOARDING_SUBMITTED", hostName || "Host", "PARTNER_SERVICE", `Onboarding application ${applicationId} submitted for ${onboardingApplication.lodgeName}`);

  res.json({
    success: true,
    applicationId,
    status: "UNDER_REVIEW",
    message: "Application submitted. Naturalist verification team will inspect buffer-zone permissions within 24 hours.",
  });
});

// ==========================================
// 5. AUTHORIZED IRCTC / RAILWAY BACKEND SERVICES
// ==========================================

// 5.1 IRCTC PRS Train Search & Live Quota Availability Engine
app.post("/api/trains/search", (req, res) => {
  const { fromStation, toStation, journeyDate, trainClass, quota = "GENERAL" } = req.body || {};

  // PRS Search engine runs server-side to simulate Indian Railways backend integration
  const availableTrains = [
    {
      trainNumber: "22436",
      trainName: "Vande Bharat Express",
      trainType: "VANDE_BHARAT",
      from: fromStation || "NDLS",
      to: toStation || "BSB",
      departureTime: "06:00 AM",
      arrivalTime: "14:00 PM",
      duration: "8h 00m",
      runsOn: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
      classes: [
        { code: "CC", name: "AC Chair Car", fare: 1750, availability: "AVAILABLE-042", confirmationProbability: 100 },
        { code: "EC", name: "Executive Chair Car", fare: 3300, availability: "AVAILABLE-014", confirmationProbability: 100 },
      ],
      pantryAvailable: true,
      eCateringSupported: true,
    },
    {
      trainNumber: "12952",
      trainName: "Mumbai Rajdhani Express",
      trainType: "RAJDHANI",
      from: fromStation || "NDLS",
      to: toStation || "MMCT",
      departureTime: "16:55 PM",
      arrivalTime: "08:35 AM",
      duration: "15h 40m",
      runsOn: ["Daily"],
      classes: [
        { code: "3A", name: "AC 3 Tier", fare: 2150, availability: "AVAILABLE-088", confirmationProbability: 100 },
        { code: "2A", name: "AC 2 Tier", fare: 3050, availability: "RAC-08", confirmationProbability: 95 },
        { code: "1A", name: "AC First Class", fare: 5120, availability: "AVAILABLE-006", confirmationProbability: 100 },
      ],
      pantryAvailable: true,
      eCateringSupported: true,
    },
  ];

  addAuditLog("IRCTC_PRS_SEARCH", "Customer", "TRAIN_SERVICE", `Authorized PRS query: ${fromStation || "NDLS"} ➔ ${toStation || "BSB"} for quota ${quota}`);
  res.json({
    success: true,
    quota,
    journeyDate: journeyDate || "2026-08-28",
    trains: availableTrains,
  });
});

// 5.2 IRCTC User Authentication Verification Service
app.post("/api/trains/validate-irctc-user", (req, res) => {
  const { irctcUsername } = req.body || {};
  if (!irctcUsername || irctcUsername.trim().length < 3) {
    return res.status(400).json({ success: false, error: "Please enter a valid IRCTC User ID." });
  }

  res.json({
    success: true,
    irctcUsername: irctcUsername.trim(),
    isValid: true,
    message: "IRCTC User ID verified with CRIS / Indian Railways authentication gateway.",
  });
});

// 5.3 IRCTC Authorized Booking Engine (PNR Allocation & E-Ticket Generation)
app.post("/api/trains/book", (req, res) => {
  const {
    trainNumber,
    trainName,
    fromStation,
    toStation,
    journeyDate,
    selectedClass,
    quota = "GENERAL",
    passengers = [],
    irctcUsername,
    contactInfo,
    travelInsurance = true,
  } = req.body || {};

  const pnr = `284-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const bookingId = `BK-TR-${Date.now().toString().slice(-6)}`;
  const invoiceNumber = `INV-RAIL-${Date.now().toString().slice(-6)}`;
  const farePerPax = selectedClass?.fare || 1750;
  const numPax = Math.max(1, passengers.length);
  const totalBaseFare = farePerPax * numPax;
  const irctcServiceFee = 15;
  const insuranceFee = travelInsurance ? numPax * 0.45 : 0;
  const gstAmount = Math.round(totalBaseFare * 0.05);
  const totalAmount = Math.round(totalBaseFare + irctcServiceFee + insuranceFee + gstAmount);

  const trainBookingRecord = {
    bookingId,
    pnr,
    invoiceNumber,
    trainNumber: trainNumber || "22436",
    trainName: trainName || "Vande Bharat Express",
    fromStation: fromStation || "New Delhi (NDLS)",
    toStation: toStation || "Varanasi Jn (BSB)",
    journeyDate: journeyDate || "2026-08-28",
    classCode: selectedClass?.code || "CC",
    quota,
    irctcUsername: irctcUsername || "verified_user",
    passengers: passengers.map((p: any, idx: number) => ({
      name: p.name || `Passenger ${idx + 1}`,
      age: p.age || 30,
      gender: p.gender || "Male",
      berth: `${selectedClass?.code || "CC"} / Coach C2 / Seat ${23 + idx}`,
      status: "CONFIRMED",
    })),
    totalAmount,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  DB.trainBookings.unshift(trainBookingRecord);
  DB.bookings.unshift({
    id: bookingId,
    serviceType: "trains",
    title: `${trainBookingRecord.trainName} (${trainBookingRecord.trainNumber})`,
    subtitle: `${trainBookingRecord.fromStation} ➔ ${trainBookingRecord.toStation}`,
    date: trainBookingRecord.journeyDate,
    time: "06:00 AM",
    status: "confirmed",
    pnr,
    amount: totalAmount,
    passengers: numPax,
    seatInfo: `${trainBookingRecord.classCode} • Coach C2 / Berths 23-${23 + numPax - 1}`,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  });

  addAuditLog("IRCTC_BOOKING_SUCCESS", irctcUsername || "Customer", "TRAIN_BOOKING_ENGINE", `Generated PNR ${pnr} for train ${trainBookingRecord.trainNumber}`);

  res.json({
    success: true,
    booking: trainBookingRecord,
    message: "Train E-Ticket issued with official IRCTC 10-digit PNR.",
  });
});

// 5.4 IRCTC Train Live Running Status (GPS Satellite Feed)
app.post("/api/trains/live-status", (req, res) => {
  const { trainNumber } = req.body || {};
  res.json({
    success: true,
    trainNumber: trainNumber || "22436",
    trainName: "Vande Bharat Express",
    currentLocation: "Kanpur Central (CNB)",
    delayMinutes: 0,
    delayStatus: "RUNNING ON TIME",
    nextStation: "Prayagraj Jn (PRYJ)",
    estimatedArrivalNextStation: "11:30 AM",
    lastUpdated: new Date().toLocaleTimeString(),
    gpsSignal: "STRONG_SATELLITE_LOCK",
  });
});

// 5.5 IRCTC Train e-Catering Food on Track Seat Delivery
app.post("/api/trains/ecatering-order", (req, res) => {
  const { pnr, stationCode, restaurantName, items = [], berthNumber } = req.body || {};
  const orderId = `FOT-${Math.floor(100000 + Math.random() * 900000)}`;

  const foodOrder = {
    orderId,
    pnr: pnr || "284-9182741",
    stationCode: stationCode || "CNB (Kanpur Central)",
    restaurantName: restaurantName || "Haldiram's Express",
    items,
    berthNumber: berthNumber || "Coach C2 / Seat 24",
    status: "CONFIRMED_TO_BE_DELIVERED_AT_BERTH",
    estimatedDeliveryTime: "Kanpur Platform Arrival",
    timestamp: new Date().toISOString(),
  };

  DB.trainFoodOrders.unshift(foodOrder);
  addAuditLog("TRAIN_ECATERING_ORDERED", "Passenger", "FOOD_ENGINE", `Food on track order ${orderId} placed for PNR ${foodOrder.pnr}`);

  res.json({
    success: true,
    order: foodOrder,
    message: "Meal booked! Your warm food will be delivered directly to your berth when the train halts at the station.",
  });
});

// ==========================================
// 6. CAB / TAXI BACKEND MICROSERVICES (HIDDEN)
// ==========================================

// 6.1 Cab Dispatch & Fare Calculation Engine
app.post("/api/cabs/search", (req, res) => {
  const { tripType = "oneway", pickupCity = "Delhi", dropCity = "Agra", distanceKm = 230 } = req.body || {};
  const rates = [
    { category: "Hatchback (WagonR/Tiago)", baseFare: 11, seats: 4, totalEstimate: Math.round(distanceKm * 11) },
    { category: "Prime Sedan (Dzire/Amaze)", baseFare: 14, seats: 4, totalEstimate: Math.round(distanceKm * 14) },
    { category: "Prime SUV & Ertiga", baseFare: 19, seats: 6, totalEstimate: Math.round(distanceKm * 19) },
    { category: "Innova Crysta Luxury", baseFare: 24, seats: 7, totalEstimate: Math.round(distanceKm * 24) },
  ];
  res.json({
    success: true,
    tripType,
    pickupCity,
    dropCity,
    distanceKm,
    options: rates,
    tollIncluded: true,
    driverAllowancePerNight: tripType === "roundtrip" ? 400 : 0,
  });
});

// 6.2 Cab Booking & Verified Chauffeur Assignment Engine
app.post("/api/cabs/book", (req, res) => {
  const {
    tripType,
    pickupCity,
    dropCity,
    pickupAddress,
    pickupDate,
    pickupTime,
    vehicleCategory,
    models,
    passengerName,
    passengerPhone,
    paymentMode = "UPI",
    distanceKm = 230,
    totalFare = 3220,
    includeTolls = true,
  } = req.body || {};

  const bookingId = `BK-CB-${Date.now().toString().slice(-6)}`;
  const pnr = `CAB-${Math.floor(100000 + Math.random() * 900000)}`;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const invoiceNumber = `INV-CAB-${Date.now().toString().slice(-6)}`;

  const assignedDriver = DB.cabDrivers[Math.floor(Math.random() * DB.cabDrivers.length)] || {
    name: "Sukhwinder Singh",
    phone: "+91 98112 34567",
    vehiclePlate: "DL 01 TA 4421",
    rating: 4.95,
  };

  const platformCommission = Math.round(totalFare * 0.15); // 15% platform commission
  const driverPayout = totalFare - platformCommission; // 85% driver settlement

  const cabTripRecord = {
    bookingId,
    pnr,
    otp,
    invoiceNumber,
    tripType: tripType || "oneway",
    fromLocation: `${pickupCity} (${pickupAddress || "City Center"})`,
    toLocation: dropCity,
    pickupDate: pickupDate || "2026-08-28",
    pickupTime: pickupTime || "06:00 AM",
    vehicleCategory: vehicleCategory || "Prime Sedan",
    vehicleModel: models || "Maruti Suzuki Dzire",
    vehiclePlate: assignedDriver.vehiclePlate,
    driver: assignedDriver,
    passengerName: passengerName || "Passenger",
    passengerPhone: passengerPhone || "+91 98765 00000",
    distanceKm,
    totalFare,
    platformCommission,
    driverPayout,
    paymentMode,
    paymentStatus: "CONFIRMED",
    tripStatus: "DISPATCHED",
    createdAt: new Date().toISOString(),
  };

  DB.cabTrips.unshift(cabTripRecord);

  // Settlement Engine
  DB.cabSettlements.unshift({
    id: `SET-CAB-${Date.now().toString().slice(-6)}`,
    tripPnr: pnr,
    driverId: assignedDriver.id || "drv-01",
    driverName: assignedDriver.name,
    grossFare: totalFare,
    commissionRetained: platformCommission,
    netSettlementAmount: driverPayout,
    settlementChannel: "UPI_DIRECT_TO_DRIVER_ACCOUNT",
    status: "SCHEDULED_POST_RIDE_COMPLETION",
    date: new Date().toISOString().split("T")[0],
  });

  // Global Bookings
  DB.bookings.unshift({
    id: bookingId,
    serviceType: "cabs",
    title: `${vehicleCategory || "Prime Sedan"} (${(tripType || "ONEWAY").toUpperCase()})`,
    subtitle: `${pickupCity} ➔ ${dropCity}`,
    date: pickupDate || "28 Aug 2026",
    time: pickupTime || "06:00 AM",
    status: "confirmed",
    pnr,
    amount: totalFare,
    passengers: 4,
    seatInfo: `${assignedDriver.name} (${assignedDriver.vehiclePlate}) • Ride OTP: ${otp}`,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  });

  addAuditLog(
    "CAB_DISPATCH_MATCHED",
    assignedDriver.name,
    "DISPATCH_MATCHING_ENGINE",
    `Assigned chauffeur ${assignedDriver.name} (${assignedDriver.vehiclePlate}) for trip ${pnr}`
  );

  res.json({
    success: true,
    booking: cabTripRecord,
    message: "Chauffeur assigned. Ride OTP generated for start authorization.",
  });
});

// 6.3 Cab Live GPS Tracking Simulation Engine
app.post("/api/cabs/live-status", (req, res) => {
  const { tripPnr } = req.body || {};
  res.json({
    success: true,
    tripPnr: tripPnr || "CAB-849201",
    driverStatus: "ON_THE_WAY",
    driverLocation: { lat: 28.5355, lng: 77.3910, address: "Sector 18 Expressway Interchange" },
    speedKmph: 58,
    etaMinutes: 12,
    trafficCondition: "SMOOTH_FLOWING",
    gpsLastPing: new Date().toISOString(),
    sosActive: false,
  });
});

// 6.4 Cab Cancellation & Instant Refund Engine
app.post("/api/cabs/cancel", (req, res) => {
  const { tripPnr, reason = "Change of travel schedule" } = req.body || {};
  const refundId = `RFD-CAB-${Date.now().toString().slice(-6)}`;

  addAuditLog("CAB_TRIP_CANCELLED", "Passenger", "CANCELLATION_ENGINE", `Trip ${tripPnr} cancelled with 100% zero penalty refund ${refundId}`);

  res.json({
    success: true,
    tripPnr,
    refundId,
    refundAmount: "100% Full Refund",
    refundMethod: "ORIGINAL_SOURCE_ACCOUNT",
    message: "Cab ride cancelled successfully. 100% refund credited with zero cancellation penalty.",
  });
});

// 6.5 Cab Chauffeur Review & Tipping Engine
app.post("/api/cabs/review", (req, res) => {
  const { tripPnr, driverRating = 5, tipAmount = 0, compliments = [], feedbackText = "" } = req.body || {};
  
  const reviewRecord = {
    id: `REV-CAB-${Date.now().toString().slice(-6)}`,
    tripPnr,
    driverRating,
    tipAmount,
    compliments,
    feedbackText,
    submittedAt: new Date().toISOString(),
  };

  DB.cabReviews.unshift(reviewRecord);
  addAuditLog("CAB_REVIEW_RECORDED", "Passenger", "RATING_MODERATION", `Recorded rating ${driverRating} stars for trip ${tripPnr}`);

  res.json({
    success: true,
    review: reviewRecord,
    message: "Thank you for rating your chauffeur! Tip sent directly to captain.",
  });
});

// ==========================================
// 7. HOUSEBOAT BACKEND MICROSERVICES (HIDDEN)
// ==========================================

// 7.1 Houseboat Search & Inventory Engine
app.post("/api/houseboats/search", (req, res) => {
  const { destination = "Alleppey", category = "All", stayType = "All" } = req.body || {};
  res.json({
    success: true,
    destination,
    category,
    stayType,
    vesselsAvailable: 18,
    ecoBioToiletMandatory: true,
    portAuthorityZone: destination === "Alleppey" ? "Kerala Inland Vessels (KIV)" : "J&K Tourism Directorate (JKT)",
  });
});

// 7.2 Houseboat Reservation & Charter Voucher Engine
app.post("/api/houseboats/book", (req, res) => {
  const {
    houseboatId,
    houseboatName,
    destination,
    packageId,
    packageName,
    cabinName,
    checkInDate,
    guestCount = 2,
    guestName,
    guestPhone,
    totalAmount = 14500,
    portRegistrationNumber,
  } = req.body || {};

  const bookingId = `BK-HB-${Date.now().toString().slice(-6)}`;
  const pnr = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
  const voucherId = `VOUCH-HB-${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceNumber = `INV-HB-${Date.now().toString().slice(-6)}`;

  const platformFee = Math.round(totalAmount * 0.12); // 12% commission
  const partnerPayout = totalAmount - platformFee; // 88% partner payout

  const houseboatBookingRecord = {
    bookingId,
    pnr,
    voucherId,
    invoiceNumber,
    houseboatId: houseboatId || "hb-alleppey-01",
    houseboatName: houseboatName || "Backwater Royale Sovereign Suite Cruise",
    destination: destination || "Alleppey (Alappuzha)",
    packageTitle: packageName || "Overnight Backwater Paradise",
    cabinName: cabinName || "Royal Master Bedroom (Upper Deck)",
    checkInDate: checkInDate || "2026-09-15",
    guestCount,
    guestName: guestName || "Guest",
    guestPhone: guestPhone || "+91 98450 11223",
    totalAmount,
    platformFee,
    partnerPayout,
    portRegistrationNumber: portRegistrationNumber || "KIV-ALP-HB-0891",
    safetyAuditCleared: true,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };

  DB.houseboatBookings.unshift(houseboatBookingRecord);

  // Settlement for Boat Operator
  DB.houseboatSettlements.unshift({
    id: `SET-HB-${Date.now().toString().slice(-6)}`,
    bookingPnr: pnr,
    operatorName: "Backwaters Master Consortium",
    grossAmount: totalAmount,
    platformFeeRetained: platformFee,
    netPartnerPayout: partnerPayout,
    settlementStatus: "SCHEDULED_T_PLUS_1",
    payoutDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  });

  // Global Bookings
  DB.bookings.unshift({
    id: bookingId,
    serviceType: "houseboats",
    title: `${houseboatBookingRecord.houseboatName} (${packageName || "Overnight Cruise"})`,
    subtitle: `${destination || "Alleppey"} • Port Reg: ${houseboatBookingRecord.portRegistrationNumber}`,
    date: checkInDate || "15 Sep 2026",
    time: "12:00 PM (Check-in)",
    status: "confirmed",
    pnr,
    amount: totalAmount,
    passengers: guestCount,
    seatInfo: `${cabinName || "Deluxe Suite"} • Full Board 4-Meals Included`,
    invoiceNumber,
    createdAt: new Date().toISOString(),
  });

  addAuditLog(
    "HOUSEBOAT_BOOKING_ISSUED",
    guestName || "Guest",
    "HOUSEBOAT_BOOKING_ENGINE",
    `Issued digital charter voucher ${voucherId} for vessel ${houseboatBookingRecord.houseboatName}`
  );

  res.json({
    success: true,
    booking: houseboatBookingRecord,
    message: "Houseboat cruise confirmed. QR boarding pass and port clearance voucher generated.",
  });
});

// 7.3 Houseboat Operator Onboarding & Maritime KYC Portal
app.post("/api/houseboats/onboard", (req, res) => {
  const {
    businessName,
    ownerName,
    contactMobile,
    destination,
    portRegistrationNo,
    hasBioToilet,
    hasIRSInsurance,
  } = req.body || {};

  const onboardingId = `HBO-KYC-${Date.now().toString().slice(-6)}`;
  const newOnboarding = {
    onboardingId,
    businessName,
    ownerName,
    contactMobile,
    destination,
    portRegistrationNo,
    hasBioToilet: !!hasBioToilet,
    hasIRSInsurance: !!hasIRSInsurance,
    verificationStatus: "PENDING_PORT_INSPECTION",
    submittedAt: new Date().toISOString(),
  };

  DB.houseboatOnboardings.unshift(newOnboarding);
  addAuditLog(
    "HOUSEBOAT_PARTNER_KYC_SUBMITTED",
    ownerName || "Operator",
    "PARTNER_ONBOARDING_GATEWAY",
    `Maritime onboarding request ${onboardingId} logged for port reg #${portRegistrationNo}`
  );

  res.json({
    success: true,
    onboardingId,
    message: "Application received. Our Maritime Compliance Desk will verify your port registration and activate your listing within 24 hours.",
  });
});

// 7.4 Houseboat Safety Compliance & Environmental Clearance
app.get("/api/houseboats/safety-compliance", (req, res) => {
  res.json({
    success: true,
    authorities: [
      { state: "Kerala", board: "Kerala Inland Vessels (KIV) Port Directorate", bioToiletMandatory: true, lifeJacketRatio: 1.5 },
      { state: "Jammu & Kashmir", board: "J&K Tourism Directorate & Lakes Conservation Authority (LCMA)", cedarWoodPreservation: true },
      { state: "Goa", board: "Captain of Ports Department (CPD) Panaji", speedLimitKnots: 8 },
    ],
    complianceStandard: "IRS (Indian Register of Shipping) Maritime Class IV",
  });
});

// ==========================================
// 8. BUS OPERATOR BACKEND SERVICES (HIDDEN)
// ==========================================

// 8.1 Operator KYC & Compliance Service
app.post("/api/bus-operator/kyc", (req, res) => {
  const { businessName, rtoPermitNumber, gstNumber, panNumber, statePermits } = req.body || {};
  const kycId = `BUS-KYC-${Date.now().toString().slice(-6)}`;

  addAuditLog(
    "BUS_OPERATOR_KYC_AUDITED",
    businessName || "Zingbus Technologies",
    "OPERATOR_KYC_SERVICE",
    `Audited Commercial Passenger License and RTO permit #${rtoPermitNumber || "AITP-IND-2024-91823"}`
  );

  res.json({
    success: true,
    kycId,
    status: "RTO_VERIFIED_LEVEL_3",
    verifiedAt: new Date().toISOString(),
    compliance: {
      ais140GpsMandate: "COMPLIANT",
      speedGovernorCalibration: "CALIBRATED_80KMPH",
      emergencySosIntegration: "CONNECTED_TO_112_POLICE_DESK",
      sacCode: "996411",
    },
    message: "Operator KYC & RTO transport permits validated successfully.",
  });
});

// 8.2 Fleet & Vehicle Service
app.get("/api/bus-operator/fleet", (req, res) => {
  res.json({
    success: true,
    fleetCount: DB.busFleet.length,
    fleet: DB.busFleet,
  });
});

app.post("/api/bus-operator/fleet", (req, res) => {
  const { busNumber, busType, category, capacity, permitNumber, fitnessValidTill, driverName } = req.body || {};
  const newBus = {
    id: `flt-${Date.now().toString().slice(-4)}`,
    busNumber: busNumber || "DL 01 PC 9999",
    busType: busType || "Volvo 9600 Multi-Axle 15M Luxury AC Sleeper",
    category: category || "Volvo Multi-Axle",
    capacity: Number(capacity || 36),
    status: "Ready for Boarding",
    permitValidTill: fitnessValidTill || "2027-12-31",
    assignedDriver: driverName || "Captain Jaswinder Singh",
    registeredAt: new Date().toISOString(),
  };

  DB.busFleet.unshift(newBus);
  addAuditLog("BUS_FLEET_ADDED", "Operator Ops", "FLEET_SERVICE", `Added fleet vehicle ${newBus.busNumber} (${newBus.busType})`);

  res.json({
    success: true,
    bus: newBus,
    message: "New vehicle registered in fleet management system with AIS-140 GPS mapping.",
  });
});

// 8.3 Driver Management Service
app.get("/api/bus-operator/drivers", (req, res) => {
  res.json({
    success: true,
    drivers: DB.busDrivers,
  });
});

app.post("/api/bus-operator/drivers", (req, res) => {
  const { name, licenseNumber, badgeNumber, phone, experienceYears } = req.body || {};
  const newDriver = {
    id: `drv-${Date.now().toString().slice(-4)}`,
    name: name || "Captain Satnam Singh",
    license: licenseNumber || "DL-01-2015-004910",
    badge: badgeNumber || "BADGE-TRANS-4481",
    phone: phone || "+91 98110 55660",
    experienceYears: Number(experienceYears || 10),
    status: "READY",
    fatigueAlert: "NORMAL",
    policeVerified: true,
  };

  DB.busDrivers.unshift(newDriver);
  addAuditLog("BUS_DRIVER_ONBOARDED", "Driver Desk", "DRIVER_SERVICE", `Verified heavy transport license for ${newDriver.name}`);

  res.json({
    success: true,
    driver: newDriver,
    message: "Commercial driver registered and linked to fatigue monitoring telemetry.",
  });
});

// 8.4 Route & Trip Service
app.get("/api/bus-operator/routes", (req, res) => {
  res.json({
    success: true,
    routes: DB.busRoutes,
  });
});

app.post("/api/bus-operator/trips", (req, res) => {
  const { routeId, routeName, departureTime, arrivalTime, busNumber, driverName, baseFare } = req.body || {};
  const tripId = `TRIP-${Date.now().toString().slice(-6)}`;
  const tripRecord = {
    tripId,
    routeId: routeId || "rt-01",
    routeName: routeName || "Delhi ➔ Manali",
    departureTime: departureTime || "07:30 PM",
    arrivalTime: arrivalTime || "08:15 AM",
    busNumber: busNumber || "DL 01 PC 9988",
    driverName: driverName || "Captain Jaswinder Singh",
    baseFare: Number(baseFare || 1399),
    status: "SCHEDULED",
    createdAt: new Date().toISOString(),
  };

  DB.busTrips.unshift(tripRecord);
  addAuditLog("BUS_TRIP_SCHEDULED", "Route Planner", "TRIP_SERVICE", `Scheduled trip ${tripId} on route ${tripRecord.routeName}`);

  res.json({
    success: true,
    trip: tripRecord,
    message: "Intercity bus trip schedule published to live booking engine.",
  });
});

// 8.5 Dynamic Fare & Pricing Engine
app.post("/api/bus-operator/pricing", (req, res) => {
  const { routeId, baseFare, weekendSurgePercent, festivalPeak, dynamicPricingActive } = req.body || {};
  res.json({
    success: true,
    routeId: routeId || "rt-01",
    baseFare: Number(baseFare || 1399),
    weekendSurgePercent: Number(weekendSurgePercent || 15),
    festivalPeakApplied: !!festivalPeak,
    dynamicPricingActive: !!dynamicPricingActive,
    effectiveWeekendFare: Math.round(Number(baseFare || 1399) * (1 + Number(weekendSurgePercent || 15) / 100)),
    message: "Dynamic pricing algorithm synced with inventory availability curves.",
  });
});

// 8.6 Seat Inventory & Quota Engine
app.post("/api/bus-operator/seats", (req, res) => {
  const { busId, blockedSeats = [], ladiesQuotaSeats = [] } = req.body || {};
  res.json({
    success: true,
    busId: busId || "flt-01",
    blockedSeatsCount: blockedSeats.length,
    ladiesQuotaSeatsCount: ladiesQuotaSeats.length,
    status: "QUOTA_APPLIED",
    message: "Seat layout rules updated with dedicated female traveler safety buffer rows.",
  });
});

// 8.7 Operator Settlement & Platform Commission Engine
app.get("/api/bus-operator/settlements", (req, res) => {
  const settlementSummary = {
    grossBookingsVolume: 942800,
    platformCommissionRate: "12%",
    platformCommissionRetained: 113136,
    tdsTaxDeducted: 9428,
    netDisbursementScheduled: 820236,
    payoutCycle: "T+1 Daily Automated Escrow Transfer",
    nextDisbursementTimestamp: "Tonight 23:59:59 IST",
    bankAccountMasked: "HDFC Bank (••••9842)",
    settlementStatus: "SCHEDULED_AUTOMATED",
  };

  res.json({
    success: true,
    summary: settlementSummary,
  });
});

// 8.8 Daily Reconciliation & AIS-140 Notification Engine
app.post("/api/bus-operator/reconcile", (req, res) => {
  const reconciliationReport = {
    reportId: `REC-BUS-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    totalTripsRun: 28,
    passengersCarried: 642,
    onTimeArrivalRate: "96.8%",
    gpsAlertsTriggered: 0,
    reconciliationStatus: "100% BALANCED & CLEARED",
    gstInputInvoiceSAC: "996411",
  };

  addAuditLog("BUS_DAILY_RECONCILIATION", "Automated Engine", "RECONCILIATION_SERVICE", `Generated daily audit report ${reconciliationReport.reportId}`);

  res.json({
    success: true,
    report: reconciliationReport,
  });
});

// ==========================================
// 9. CENTRAL BOOKING PROFILE & ENGINE (HIDDEN)
// ==========================================

// 9.1 Universal PNR Lookup across ALL 11 Categories
app.post("/api/central-bookings/pnr-search", (req, res) => {
  const { pnrQuery } = req.body || {};
  if (!pnrQuery || String(pnrQuery).trim().length < 3) {
    return res.status(400).json({ success: false, error: "Please enter a valid Booking Reference or PNR number." });
  }

  const query = String(pnrQuery).trim().toUpperCase();
  const matched = DB.bookings.find(
    (b) => (b.pnr && b.pnr.toUpperCase().includes(query)) || (b.id && b.id.toUpperCase().includes(query))
  );

  if (matched) {
    return res.json({ success: true, found: true, booking: matched });
  }

  // Return realistic fallback match for quick previewing
  const fallbackBooking = {
    id: `BK-UNI-${Date.now().toString().slice(-4)}`,
    bookingRef: `REF-${query}`,
    pnr: query,
    serviceType: "buses",
    title: "Zingbus Volvo 9600 Luxury Multi-Axle AC Sleeper",
    subtitle: "Delhi (ISBT Kashmere Gate) ➔ Manali (Mall Road)",
    provider: "Zingbus Electric & Multi-Axle Intercity",
    date: "10 Sep 2026",
    time: "07:30 PM",
    status: "confirmed",
    amount: 1399,
    passengers: 1,
    seatInfo: "Lower Deck Sleeper Berth #L4",
    invoiceNumber: `INV-${query}`,
    paymentSummary: {
      totalAmount: 1399,
      paymentMode: "UPI",
      paymentStatus: "PAID",
      paidAt: new Date().toISOString(),
    },
  };

  res.json({ success: true, found: true, booking: fallbackBooking });
});

// 9.2 Universal Booking Creation & Validation Engine
app.post("/api/central-bookings/create", (req, res) => {
  const {
    serviceType = "buses",
    title,
    subtitle,
    provider,
    date,
    time,
    amount = 1500,
    passengers = 1,
    seatInfo,
    customerName = "Aditya Sharma",
    customerPhone = "+91 98765 43210",
    customerEmail = "aditya.sharma@traveler.in",
    paymentMode = "UPI",
  } = req.body || {};

  const bookingId = `BK-${serviceType.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const pnr = `${serviceType.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = `INV-${serviceType.toUpperCase()}-${Date.now().toString().slice(-6)}`;

  const newBookingRecord = {
    id: bookingId,
    bookingRef: `REF-${pnr}`,
    serviceType,
    title: title || `${serviceType.toUpperCase()} Journey Confirmation`,
    subtitle: subtitle || "Confirmed Booking via BharatYatra Unified Gateway",
    provider: provider || "BharatYatra Partner Network",
    date: date || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    time: time || "08:00 AM",
    status: "confirmed",
    pnr,
    amount: Number(amount),
    amountPaid: Number(amount),
    passengers: Number(passengers),
    passengersCount: Number(passengers),
    seatInfo: seatInfo || "Allotted upon confirmation",
    invoiceNumber,
    customerName,
    customerPhone,
    customerEmail,
    createdAt: new Date().toISOString(),
  };

  DB.bookings.unshift(newBookingRecord);
  DB.centralBookings.unshift(newBookingRecord);

  addAuditLog(
    "CENTRAL_BOOKING_CREATED",
    customerName,
    "CENTRAL_BOOKING_ENGINE",
    `Created booking ${bookingId} for service ${serviceType} (PNR: ${pnr}, Amount: ₹${amount})`
  );

  res.json({
    success: true,
    booking: newBookingRecord,
    message: "Booking confirmed across central travel gateway. Digital ticket and QR voucher issued.",
  });
});

// 9.3 Self-Service Cancellation & Instant Refund Pipeline
app.post("/api/central-bookings/cancel", (req, res) => {
  const { bookingId, reason = "Change of travel schedule" } = req.body || {};
  const bookingIndex = DB.bookings.findIndex((b) => b.id === bookingId || b.pnr === bookingId);

  if (bookingIndex !== -1) {
    DB.bookings[bookingIndex].status = "cancelled";
  }

  const refundId = `RFD-UNI-${Date.now().toString().slice(-6)}`;
  const refundRecord = {
    refundId,
    bookingId,
    status: "INSTANT_WALLET_CREDITED",
    refundMethod: "BHARATYATRA_ESCROW_WALLET",
    processedAt: new Date().toISOString(),
    instantCredit: true,
  };

  DB.centralRefunds.unshift(refundRecord);
  addAuditLog("CENTRAL_BOOKING_CANCELLED", "Customer", "CANCELLATION_ENGINE", `Cancelled booking ${bookingId}. Processed instant refund ${refundId}`);

  res.json({
    success: true,
    refund: refundRecord,
    message: "Booking cancelled successfully. 100% refundable amount credited instantly to BharatYatra Wallet.",
  });
});

// 9.4 Booking Modification Engine (Date / Seat change)
app.post("/api/central-bookings/modify", (req, res) => {
  const { bookingId, newDate, newSeat, modificationReason } = req.body || {};
  const modRecord = {
    modificationId: `MOD-${Date.now().toString().slice(-6)}`,
    bookingId: bookingId || "BK-UNI-001",
    newDate,
    newSeat,
    status: "CONFIRMED_BY_SUPPLIER",
    modificationFee: 0,
    timestamp: new Date().toISOString(),
  };

  DB.centralModifications.unshift(modRecord);
  addAuditLog("BOOKING_MODIFIED", "Customer", "MODIFICATION_SERVICE", `Modified booking ${bookingId} date to ${newDate}`);

  res.json({
    success: true,
    modification: modRecord,
    message: "Booking modification confirmed with service operator. Updated boarding pass generated.",
  });
});

// 9.5 Universal Digital GST Invoice Retrieval
app.post("/api/central-bookings/invoice", (req, res) => {
  const { bookingId } = req.body || {};
  res.json({
    success: true,
    invoice: {
      invoiceNumber: `INV-GST-${Date.now().toString().slice(-6)}`,
      bookingId: bookingId || "BK-88210",
      date: new Date().toISOString().split("T")[0],
      legalEntity: "BharatYatra Travel & Mobility Technologies Limited",
      gstin: "07AAACB4410R1ZP",
      sacCode: "996411",
      taxableAmount: 3450,
      cgst: 172.5,
      sgst: 172.5,
      totalAmount: 3795,
      downloadUrl: `/api/central-bookings/invoice-download?id=${bookingId}`,
    },
  });
});

// 9.6 Universal Review & Rating Submission
app.post("/api/central-bookings/review", (req, res) => {
  const { bookingId, rating = 5, reviewText = "", compliments = [] } = req.body || {};
  const reviewRecord = {
    id: `REV-UNI-${Date.now().toString().slice(-6)}`,
    bookingId,
    rating: Number(rating),
    reviewText,
    compliments,
    submittedAt: new Date().toISOString(),
  };

  DB.centralReviews.unshift(reviewRecord);
  addAuditLog("CUSTOMER_REVIEW_RECORDED", "Traveler", "RATING_MODERATION", `Recorded ${rating}-star rating for booking ${bookingId}`);

  res.json({
    success: true,
    review: reviewRecord,
    message: "Thank you for reviewing! 50 YatraCoins added to your wallet reward balance.",
  });
});

// 9.7 24x7 Support & Emergency SOS Dispute Ticket
app.post("/api/central-bookings/support-ticket", (req, res) => {
  const { bookingId, issueType = "Boarding Assistance", description = "" } = req.body || {};
  const ticketId = `SOS-TKT-${Date.now().toString().slice(-6)}`;
  const ticketRecord = {
    ticketId,
    bookingId,
    issueType,
    description,
    priority: "HIGH_PRIORITY_DISPATCH",
    status: "ASSIGNED_TO_DUTY_OFFICER",
    slaResponseMinutes: 5,
    timestamp: new Date().toISOString(),
  };

  DB.centralSupportTickets.unshift(ticketRecord);
  addAuditLog("SUPPORT_TICKET_RAISED", "Customer", "SUPPORT_GATEWAY", `Raised emergency support ticket ${ticketId} for ${bookingId}`);

  res.json({
    success: true,
    ticket: ticketRecord,
    message: "Grievance ticket created. Our 24x7 Travel Command Desk is connecting with the on-ground operator.",
  });
});

// 9.8 Booking Engine Health & Pipeline Status
app.get("/api/central-bookings/pipeline-status", (req, res) => {
  res.json({
    success: true,
    pipeline: {
      bookingCreationEngine: "HEALTHY_ONLINE",
      pnrGenerator: "PRS_GDS_SYNCED",
      instantRefundGateway: "ZERO_LATENCY_ACTIVE",
      escrowSettlementService: "T_PLUS_1_BALANCED",
      activeCategoriesCovered: [
        "Flights",
        "Trains",
        "Buses",
        "Hotels",
        "Lodges",
        "Resorts",
        "Houseboats",
        "Tours",
        "Pilgrimage",
        "Cabs",
        "Dining",
      ],
    },
  });
});

// --- AI Travel Planner Service (Server-side Gemini Integration) ---
app.post("/api/ai-travel-planner", async (req, res) => {
  const { prompt, originCity, destinationCity, travelers, budget, travelStyle } = req.body || {};

  try {
    const systemInstruction = `You are "Maya", India's premier Master Travel & Mobility Concierge.
You specialize in Indian journeys across Flights (IndiGo/Air India), IRCTC Vande Bharat trains, Volvo Sleeper buses, Heritage Havelis & Resorts, Outstation Cabs, Sacred Yatras, and Highway dining.
Return a structured JSON with: summary, bestTimeToVisit, recommendedServices (array with service, title, description, estimatedCost), dayWisePlan (array with day, title, travelLeg, activities), proTips.`;

    const userPrompt = `Create a customized Indian travel itinerary:
Query / Goal: ${prompt || "Curate a memorable trip to India's top destination"}
Origin City: ${originCity || "New Delhi"}
Destination City / Circuit: ${destinationCity || "Varanasi & Ayodhya"}
Travelers: ${travelers || 2}
Budget: ${budget || "Moderate / Comfort"}
Travel Style: ${travelStyle || "Heritage & Spiritual"}`;

    const { response } = await generateWithFallback({
      contents: userPrompt,
      preferredModel: "gemini-3.1-flash-lite",
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.info("[AI Travel Planner] Using high-quality India travel planner fallback.");
    const dest = destinationCity || "Rajasthan & Varanasi";
    res.json({
      success: true,
      plan: {
        summary: `Crafted a personalized experience for ${dest} starting from ${originCity || "your city"}. Combines high-speed rail, verified stays, and local heritage exploration.`,
        bestTimeToVisit: "September through April (ideal weather and festive atmospheres)",
        recommendedServices: [
          {
            service: "trains",
            title: "Vande Bharat Express (Chair Car / Executive)",
            description: "Fastest direct connection with panoramic windows and onboard catering.",
            estimatedCost: "₹1,750 per person",
          },
          {
            service: "hotels",
            title: "Royal Heritage Boutique Haveli",
            description: "Centrally located with heritage courtyard, rooftop dining, and breakfast included.",
            estimatedCost: "₹3,800 per night",
          },
          {
            service: "cabs",
            title: "Pre-booked AC Sedan for Day Sightseeing",
            description: "Verified chauffeur with unlimited local sightseeing and toll inclusions.",
            estimatedCost: "₹2,200 / day",
          },
          {
            service: "dining",
            title: "Authentic Regional Thali & Highway Oasis",
            description: "Pure vegetarian delicacies and signature local desserts.",
            estimatedCost: "₹450 for two",
          },
        ],
        dayWisePlan: [
          {
            day: 1,
            title: "Morning Arrival & Heritage Immersion",
            travelLeg: "Direct Vande Bharat or Flight arrival, followed by pre-arranged AC cab transfer.",
            activities: [
              "Express check-in and welcome drink at boutique heritage stay",
              "Visit historic monuments and ancient courtyards",
              "Evening sacred Aarti ceremony at the riverfront / sunset view point",
            ],
          },
          {
            day: 2,
            title: "Cultural Exploration & Culinary Trail",
            travelLeg: "Dedicated outstation cab for day-long landmarks and crafts villages.",
            activities: [
              "Morning guided walk through traditional artisan bazaars",
              "Sample regional specialties (Lassi, Kachori, fresh sweets)",
              "Sunset panoramic overlook & cultural folk performance",
            ],
          },
          {
            day: 3,
            title: "Sacred Darshan & Comfortable Return",
            travelLeg: "Return connection with flexible check-out and airport/station transfer.",
            activities: [
              "VIP Darshan or early morning quiet walk",
              "Souvenir shopping for local handicrafts and textiles",
              "Evening return journey with verified travel vouchers",
            ],
          },
        ],
        proTips: [
          "Book train tickets at least 14 days in advance or use instant Tatkal assistance.",
          "Keep digital copies of photo IDs ready for seamless hotel & airport check-in.",
          "Use BharatYatra's pre-booked outstation cabs to avoid local surge pricing.",
        ],
      },
    });
  }
});

// ==========================================
// FLIGHT AVIATION BACKEND API SERVICES (HIDDEN SERVICES)
// ==========================================

// 1. Flight Search & GDS/NDC Inventory Query
app.post("/api/flights/search", (req, res) => {
  const { from, to, departDate, returnDate, tripType = "oneway", passengers = 1, cabinClass = "Economy" } = req.body || {};
  
  addAuditLog("FLIGHT_SEARCH_QUERY", "Flight NDC Gateway", "SYSTEM", `Search query: ${from || "DEL"} to ${to || "BOM"}, Pax: ${passengers}, Cabin: ${cabinClass}`);

  res.json({
    success: true,
    route: { from, to, departDate, returnDate, tripType, passengers, cabinClass },
    gdsSyncStatus: "CONNECTED_AMADEUS_TRAVELPORT",
    totalResults: 14,
    source: "Amadeus / IndiGo Direct NDC / Air India API",
    currency: "INR",
  });
});

// 2. Fare & Availability Revalidation Engine
app.post("/api/flights/revalidate-fare", (req, res) => {
  const { flightId, tierId = "saver", passengers = 1 } = req.body || {};
  const baseFare = 3899;
  const tierOffset = tierId === "flexi" ? 1200 : tierId === "superflex" ? 2400 : tierId === "business" ? 9500 : 0;
  const totalBase = (baseFare + tierOffset) * Number(passengers);
  const taxes = 1200 * Number(passengers);
  const gstRate = tierId === "business" ? 0.12 : 0.05;
  const gst = Math.round((totalBase + taxes) * gstRate);

  res.json({
    success: true,
    fareStatus: "FARE_CONFIRMED_LOCKED",
    fareLockExpiresInSeconds: 900,
    priceDetails: {
      flightId,
      tierId,
      passengers,
      baseFarePerPax: baseFare + tierOffset,
      totalBaseFare: totalBase,
      airportTaxes: taxes,
      gstAviationTax: gst,
      sacCode: "996411",
      grossTotal: totalBase + taxes + gst,
    },
  });
});

// 3. Seat Map API Service
app.get("/api/flights/seat-map", (req, res) => {
  const { flightId = "fl-del-bom-6e", aircraft = "Airbus A321neo" } = req.query || {};
  res.json({
    success: true,
    flightId,
    aircraft,
    configuration: "3-3 Single Aisle",
    rows: 32,
    exitRows: [12, 13],
    extraLegroomRows: [1, 2, 12, 13],
    pricingGrid: {
      standardWindow: 250,
      standardAisle: 250,
      standardMiddle: 0,
      extraLegroomXL: 650,
      frontRowBusiness: 1200,
    },
  });
});

// 4. Ancillary Services & Baggage API
app.get("/api/flights/ancillaries", (req, res) => {
  res.json({
    success: true,
    baggagePacks: [
      { id: "bag-5kg", weightKg: 5, price: 1900, label: "5 kg Check-in Pack" },
      { id: "bag-10kg", weightKg: 10, price: 3600, label: "10 kg Check-in Pack" },
      { id: "bag-15kg", weightKg: 15, price: 5200, label: "15 kg Check-in Pack" },
    ],
    loungePasses: [
      { id: "lounge-del-t3", lounge: "Encalm Lounge T3", terminal: "T3", price: 799, complimentaryBar: true },
      { id: "lounge-bom-t2", lounge: "Adani Lounge T2", terminal: "T2", price: 899, complimentaryBar: true },
    ],
    zeroCancellationCover: { pricePerPax: 449, coveragePercent: 100, validTillHoursBefore: 2 },
  });
});

// 5. Booking / Order Creation & Ticket Issuance Engine
app.post("/api/flights/create-booking", (req, res) => {
  const {
    flightNumber = "6E-2041",
    airline = "IndiGo",
    origin = "DEL",
    destination = "BOM",
    departDate = "2026-08-28",
    departTime = "06:15",
    arriveTime = "08:30",
    tier = "saver",
    passengers = [{ name: "Aarav Sharma", seat: "12A" }],
    amount = 4399,
    paymentMethod = "UPI",
    gstDetails,
  } = req.body || {};

  const bookingId = `BK-FLT-${Math.floor(100000 + Math.random() * 900000)}`;
  const pnr = `${airline.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const ticketNumber = `098-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const invoiceNumber = `INV-BY-FLT-${Math.floor(100000 + Math.random() * 900000)}`;

  const newBooking = {
    id: bookingId,
    pnr,
    ticketNumber,
    airline,
    flightNumber,
    origin,
    destination,
    departDate,
    departTime,
    arriveTime,
    tier,
    passengers,
    amount: Number(amount),
    status: "CONFIRMED",
    paymentMode: paymentMethod,
    gstInvoiceNumber: invoiceNumber,
    gstDetails: gstDetails || null,
    createdAt: new Date().toISOString(),
  };

  DB.flightBookings.unshift(newBooking);

  // Add PNR record
  DB.flightPnrs.unshift({
    pnr,
    airline,
    flightNumber,
    status: "TICKETED",
    origin,
    destination,
    terminal: "T3",
    gate: "Gate 12A",
    webCheckInAvailable: true,
    onTimeStatus: "ON_TIME",
  });

  // Add Settlement Ledger Entry
  DB.flightSettlements.unshift({
    id: `SET-FLT-${Date.now()}`,
    airline,
    bspPeriod: "2026-08-W4",
    totalGross: Number(amount),
    commissionEarned: Math.round(Number(amount) * 0.04),
    taxSac996411: Math.round(Number(amount) * 0.05),
    netSettlement: Math.round(Number(amount) * 0.91),
    status: "RECONCILED",
    timestamp: new Date().toISOString(),
  });

  addAuditLog("FLIGHT_BOOKING_ISSUED", "Airline Ticketing Engine", "SYSTEM", `Issued PNR ${pnr} for ${passengers.length} pax on ${airline} ${flightNumber}`);

  res.json({
    success: true,
    booking: newBooking,
    pnr,
    ticketNumber,
    invoiceNumber,
    eTicketDeliveryStatus: "SMS_AND_WHATSAPP_DISPATCHED",
  });
});

// 6. PNR Status & Real-time Radar Lookup
app.get("/api/flights/pnr-status/:pnr", (req, res) => {
  const { pnr } = req.params;
  const record = DB.flightPnrs.find((p) => p.pnr.toUpperCase() === pnr.toUpperCase()) || {
    pnr: pnr.toUpperCase(),
    airline: "IndiGo",
    flightNumber: "6E-2041",
    status: "CONFIRMED & TICKETED",
    origin: "DEL",
    destination: "BOM",
    terminal: "T3",
    gate: "Gate 14B",
    webCheckInAvailable: true,
    onTimeStatus: "ON_TIME",
  };

  res.json({
    success: true,
    pnrRecord: record,
    baggageDropCounter: "Counters 12 to 18",
    securityFastTrack: "Available via BharatYatra Pass",
  });
});

// 7. Flight Reschedule & Date Modification Engine
app.post("/api/flights/reschedule", (req, res) => {
  const { pnr, newDate, newFlightNumber } = req.body || {};
  const rebookingRef = `REISSUE-${Date.now()}`;
  
  addAuditLog("FLIGHT_RESCHEDULED", "Customer Portal", "CUSTOMER", `Rescheduled PNR ${pnr} to new date ${newDate}`);

  res.json({
    success: true,
    pnr,
    rebookingRef,
    newDate,
    newFlightNumber: newFlightNumber || "6E-2045",
    airlineChangeFee: 0,
    fareDifference: 450,
    newEvoTicketIssued: true,
  });
});

// 8. Flight Cancellation & Automated Refund Engine
app.post("/api/flights/cancel", (req, res) => {
  const { pnr, reason = "Customer Request" } = req.body || {};
  const booking = DB.flightBookings.find((b) => b.pnr === pnr);

  const deduction = 1500;
  const originalAmount = booking ? booking.amount : 4399;
  const refundAmount = Math.max(0, originalAmount - deduction);

  addAuditLog("FLIGHT_CANCELLED", "Refund Engine", "SYSTEM", `Cancelled PNR ${pnr}. Refund ₹${refundAmount} credited.`);

  res.json({
    success: true,
    pnr,
    cancellationStatus: "CANCELLED",
    deductionAmount: deduction,
    refundAmount,
    refundDestination: "BharatYatra Instant Wallet / Original Source",
    refundRef: `REF-${Date.now()}`,
    processedAt: new Date().toISOString(),
  });
});

// 9. Airline Commission, Settlement & Reconciliation Audit API
app.get("/api/flights/admin/reconciliation", (req, res) => {
  res.json({
    success: true,
    totalBookingsCount: DB.flightBookings.length,
    settlements: DB.flightSettlements,
    gdsSync: DB.flightGdsSync,
    taxComplianceSAC: "996411 - Transport of Passengers by Air",
    summary: {
      grossVolumeINR: DB.flightSettlements.reduce((sum, s) => sum + s.totalGross, 0),
      totalCommissionINR: DB.flightSettlements.reduce((sum, s) => sum + s.commissionEarned, 0),
      gstRemittedINR: DB.flightSettlements.reduce((sum, s) => sum + s.taxSac996411, 0),
    },
  });
});

// ==========================================
// 10. MALHOTRA WORLD TRAVELS & B2B DESK BACKEND OPS API (NEVER DISPLAYED ON FRONTEND)
// ==========================================
app.get("/api/operator/malhotra-desk/status", (req, res) => {
  res.json({
    success: true,
    agencyId: "agent-malhotra",
    businessName: "Malhotra World Travels & B2B Desk",
    tradeName: "Malhotra World Travel Solutions India Pvt. Ltd.",
    accreditations: {
      iata: "IATA-14-1-77820",
      mot: "MOT-NRO-DEL-33829",
      irctc: "IRCTC-PSP-772901",
      taai: "TAAI-DL-1994-09",
      gstin: "07AAACM9012F1ZB",
    },
    activeOperatorProfiles: [
      "1. Bus Operator (Volvo 9600 Fleet)",
      "2. Train Profile (Vande Bharat & Tatkal Desk)",
      "3. Hotel Profile (5★ Grand Heritage Palace)",
      "4. Lodge Profile (Corbett Forest Safaris)",
      "5. Resort Profile (Royal Palm Wellness)",
      "6. Pilgrimage Yatra (Char Dham VIP Sugam)",
      "7. Tour Operator (Golden Triangle DMC)",
      "8. Corporate Desk (MICE & 18% GST ITC)",
      "9. Cab Operator (Chauffeur Outstation Fleet)",
      "10. Restaurant & Dhaba (NH-44 Murthal Pitstop)",
      "11. House Boat (Alleppey & Dal Lake Cruises)",
    ],
    b2bCreditLimitINR: 2500000,
    settlementCycle: "T+1 Daily RTGS Automatic",
    securityAudit: "COMPLIANT_ISO_9001_2015",
    serverTimestamp: new Date().toISOString(),
  });
});

app.post("/api/operator/b2b/enquiry", (req, res) => {
  const { name, phone, email, vertical, message } = req.body || {};
  const enquiryRef = `ENQ-MWT-${Date.now()}`;
  addAuditLog("B2B_ENQUIRY_RECEIVED", "Malhotra Operations Desk", name || "B2B Partner", `Enquiry for ${vertical}`);
  
  res.json({
    success: true,
    enquiryRef,
    status: "DISPATCHED_TO_DUTY_MANAGER",
    assignedConsultant: "Rajesh Malhotra / B2B Senior Desk",
    slaResponseTime: "15 Minutes Guaranteed",
    recordedAt: new Date().toISOString(),
  });
});

// ==========================================
// 12. BACKEND PAYMENT ENGINE, SPLIT & SETTLEMENT SERVICES (SERVER-SIDE ONLY)
// ==========================================

// 12.1 Backend Payment Split Engine (Customer Payment ➔ Payment Gateway ➔ Split Engine ➔ Platform Commission + Operator Share + Taxes ➔ Ledger ➔ Settlement/Payout)
app.post("/api/payments/split-engine", (req, res) => {
  const { grossAmount, serviceCategory, partnerId = "PTR-VERIFIED", numPayers = 1, isPartial = false, depositPercent = 25 } = req.body || {};
  const amount = Number(grossAmount) || 3000;
  
  // Commission rates by vertical
  const commissionRates: Record<string, number> = {
    flights: 0.04,
    trains: 0.03,
    buses: 0.12,
    hotels: 0.15,
    lodges: 0.12,
    resorts: 0.14,
    houseboats: 0.15,
    cabs: 0.15,
    tours: 0.12,
    pilgrimage: 0.10,
    dining: 0.10,
  };

  const rate = commissionRates[serviceCategory?.toLowerCase()] || 0.10;
  const platformCommission = Math.round(amount * rate);
  const gstRate = (serviceCategory === "hotels" || serviceCategory === "resorts") ? 0.12 : 0.05;
  const statutoryTaxes = Math.round(amount * gstRate);
  const section194oTds = Math.round(amount * 0.01); // 1% statutory TDS for e-commerce operators in India
  const operatorShare = Math.max(0, amount - platformCommission - statutoryTaxes);
  const netOperatorDisbursement = Math.max(0, operatorShare - section194oTds);

  // Split calculation for co-travelers
  const payersCount = Math.max(1, Number(numPayers) || 1);
  const perPayerShare = Math.round(amount / payersCount);

  // Partial milestone calculations
  const depositAmount = isPartial ? Math.round(amount * (depositPercent / 100)) : amount;
  const balanceDue = isPartial ? amount - depositAmount : 0;

  // Server-side audit log
  addAuditLog(
    "PAYMENT_SPLIT_CALCULATED",
    "Payment Split Engine",
    "SETTLEMENT_SERVICE",
    `Split calculated for ₹${amount} (${serviceCategory}): Commission: ₹${platformCommission}, Operator: ₹${operatorShare}, Taxes: ₹${statutoryTaxes}, TDS: ₹${section194oTds}`
  );

  // Record into internal DB ledger
  const ledgerId = `LEDG-${Date.now()}`;
  DB.settlements.unshift({
    id: ledgerId,
    partnerId,
    serviceCategory,
    grossAmount: amount,
    platformCommission,
    statutoryTaxes,
    tdsDeducted: section194oTds,
    netDisbursement: netOperatorDisbursement,
    status: "SCHEDULED_T1_ESCROW",
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    // Customer-facing clean breakdown
    customerSummary: {
      totalPayable: amount,
      baseFare: Math.round(amount / (1 + gstRate)),
      taxesAndGst: statutoryTaxes,
      perPayerShare,
      payersCount,
      isPartial,
      depositAmount,
      balanceDue,
    },
    // Server-side calculated shares
    splitStatus: "CALCULATED_BALANCED",
  });
});

// 12.2 Group Split Link & Multi-Payer Generator Engine
app.post("/api/payments/group-split/create", (req, res) => {
  const { bookingId, totalAmount, payers = [] } = req.body || {};
  const splitGroupId = `SPLIT-${Date.now().toString().slice(-6)}`;
  const count = Math.max(2, payers.length || 2);
  const sharePerPax = Math.round((Number(totalAmount) || 4000) / count);

  const splitLinks = (payers.length > 0 ? payers : ["Traveler 1 (You)", "Traveler 2"]).map((name: any, idx: number) => ({
    payerIndex: idx + 1,
    payerName: typeof name === "string" ? name : name?.name || `Traveler ${idx + 1}`,
    shareAmount: sharePerPax,
    status: idx === 0 ? "PAID" : "PENDING",
    paymentLink: `https://bharatyatra.in/pay/split/${splitGroupId}?p=${idx + 1}`,
    qrCodeString: `upi://pay?pa=bharatyatra.escrow@icici&pn=BharatYatraTravel&am=${sharePerPax}&cu=INR&tn=Split-${splitGroupId}`,
  }));

  res.json({
    success: true,
    splitGroupId,
    bookingId: bookingId || `BK-${Date.now().toString().slice(-5)}`,
    totalAmount: Number(totalAmount) || 4000,
    sharePerPax,
    splitLinks,
    message: "Group split links generated. Each traveler can pay their equal share independently.",
  });
});

// 12.3 Automated Refund & Gateway Reverse Pipeline
app.post("/api/payments/refund/process", (req, res) => {
  const { bookingId, pnr, amount, refundMethod = "INSTANT_WALLET", cancellationReason } = req.body || {};
  const refundId = `RFD-${Date.now().toString().slice(-6)}`;
  const refundAmount = Number(amount) || 2499;

  // Add to internal audit
  addAuditLog(
    "GATEWAY_REFUND_EXECUTED",
    "Refund Engine",
    "FINANCE_GATEWAY",
    `Dispatched 100% refund of ₹${refundAmount} for PNR ${pnr || bookingId} via ${refundMethod}`
  );

  res.json({
    success: true,
    refundId,
    bookingId,
    pnr,
    refundAmount,
    refundMethod,
    refundStatus: refundMethod === "INSTANT_WALLET" ? "COMPLETED_INSTANT" : "GATEWAY_INITIATED_3_5_DAYS",
    referenceNumber: `RRN-REV-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    estimatedCreditTime: refundMethod === "INSTANT_WALLET" ? "Instant (0 seconds)" : "3-5 Business Days to Source Bank",
    timestamp: new Date().toISOString(),
  });
});

// 12.4 Hotel, Lodge & Travel Booking Standardized Payment Checkout & Receipt Engine
// CRITICAL SECURITY RULE: Full card numbers, CVVs, and UPI PINs are NEVER accepted or stored.
app.post("/api/payments/process-checkout", (req, res) => {
  const {
    bookingId,
    receiptNumber,
    transactionId,
    serviceCategory = "hotels",
    serviceTitle = "Luxury Hotel Booking",
    location = "India",
    roomOrSeatInfo = "Deluxe Room",
    checkIn,
    checkOut,
    nights = 1,
    roomAmount = 3000,
    taxes = 360,
    discount = 0,
    paymentFee = 0,
    totalPaid = 3360,
    paymentMethod = "UPI",
    guestName = "Guest Traveler",
    guestPhone,
    guestEmail,
    maskedAccount,
    // Intentionally sanitized: reject/strip any full card numbers or sensitive credentials
  } = req.body || {};

  // Security enforcement: Explicitly verify that sensitive payment credentials are absent
  if (req.body.cardNumber || req.body.cvv || req.body.upiPin || req.body.fullCardNumber) {
    console.warn("Security Alert: Request contained sensitive payment credentials which have been discarded.");
  }

  const generatedTxnId = transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const generatedReceiptNo = receiptNumber || (serviceCategory === "lodges" ? `REC-LODGE-2026-${Math.floor(1000 + Math.random() * 9000)}` : `REC-HTL-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const generatedBookingId = bookingId || (serviceCategory === "lodges" ? `LODGE-2026-${Math.floor(1000 + Math.random() * 9000)}` : `HTL-${Math.floor(100000 + Math.random() * 900000)}`);

  const paymentRecord = {
    id: `PAY-${Date.now()}`,
    receiptNumber: generatedReceiptNo,
    bookingId: generatedBookingId,
    transactionId: generatedTxnId,
    serviceCategory,
    serviceTitle,
    location,
    roomOrSeatInfo,
    checkIn,
    checkOut,
    nights: Number(nights) || 1,
    roomAmount: Number(roomAmount) || 0,
    taxes: Number(taxes) || 0,
    discount: Number(discount) || 0,
    paymentFee: Number(paymentFee) || 0,
    totalPaid: Number(totalPaid) || (Number(roomAmount) + Number(taxes) - Number(discount)),
    paymentMethod,
    paymentStatus: "PAID",
    paidAt: new Date().toISOString(),
    guestName,
    guestPhone,
    guestEmail,
    maskedAccount: maskedAccount || "Authorized Banking Rail",
    gatewayApprovalCode: `APPR-${Math.floor(100000 + Math.random() * 900000)}`,
    settlementBatch: `BATCH-${new Date().toISOString().slice(0, 10)}`,
    verificationHash: `BY-REC-HASH-${Math.abs((generatedReceiptNo + generatedBookingId).split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
  };

  // Store in non-sensitive payment transactions ledger
  DB.payments.unshift(paymentRecord);

  // Add audit log
  addAuditLog(
    "PAYMENT_AUTHORIZED_ESCROW",
    guestName,
    "PAYMENT_GATEWAY",
    `Authorized ₹${paymentRecord.totalPaid} via ${paymentMethod} for ${serviceTitle} (${generatedBookingId}). Receipt: ${generatedReceiptNo}, Txn: ${generatedTxnId}`
  );

  res.json({
    success: true,
    message: "Payment processed successfully through authorized gateway. Receipt generated.",
    receipt: paymentRecord,
  });
});

// 12.5 Retrieve Digital Receipt by Receipt Number
app.get("/api/payments/receipt/:receiptNumber", (req, res) => {
  const { receiptNumber } = req.params;
  const found = DB.payments.find((p) => p.receiptNumber === receiptNumber);
  if (found) {
    return res.json({ success: true, receipt: found });
  }
  // Return standard mock verified receipt if not in transient memory
  res.json({
    success: true,
    receipt: {
      receiptNumber,
      bookingId: receiptNumber.includes("LODGE") ? "LODGE-2026-4819" : "HTL-892182",
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentStatus: "PAID",
      totalPaid: 4200,
      paymentMethod: "UPI",
      paidAt: new Date().toISOString(),
    },
  });
});

// --- Travel Concierge Chat Endpoint ---
app.post("/api/chat-travel-guide", async (req, res) => {
  const { messages = [], activeLocation, activeCategory } = req.body || {};

  try {
    const systemInstruction = `You are "Maya", the AI India Travel Concierge for BharatYatra Super App.
You possess deep expertise in Indian aviation, IRCTC trains, buses, heritage stays, yatras, outstation cabs, regional cuisines, and corporate travel. Provide crisp, structured, helpful answers.`;

    const contents: any[] = [];
    for (const msg of messages) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Namaste Maya! Can you help me plan my next trip in India?" }],
      });
    }

    const { response } = await generateWithFallback({
      contents,
      preferredModel: "gemini-3.1-flash-lite",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reply: response.text || "Namaste! How may I assist you with your Indian travel plans today?",
    });
  } catch (error: any) {
    console.info("[Travel Chat] Serving offline concierge response.");
    res.json({
      success: true,
      reply: `**Namaste! I am Maya, your India Travel Concierge.**\n\nTop recommendations for **${activeLocation?.name || "your travel"}**:\n- **Flights & Trains:** Compare Vande Bharat routes with non-stop flights to balance time and cost.\n- **Verified Stays:** Enjoy *Pay @ Hotel* and 100% Free Cancellation.\n- **Outstation Cabs:** Book fixed-rate chauffeur cabs with no hidden toll charges.`,
    });
  }
});

// ==========================================
// 3.8. PUBLIC COUPON VALIDATOR
// ==========================================

// Coupon Validator Endpoint
app.post("/api/public/offers/validate", (req, res) => {
  const { code, cartAmount = 1000, category = "all" } = req.body || {};
  const upperCode = (code || "").trim().toUpperCase();

  const validCoupons: Record<string, { discountPercent?: number; flatDiscount?: number; maxDiscount?: number; minCart?: number; desc: string }> = {
    BHARAT1500: { flatDiscount: 1500, minCart: 5000, desc: "Flat ₹1,500 off on holiday packages & resorts" },
    FLYINDIGO: { discountPercent: 12, maxDiscount: 1200, minCart: 3000, desc: "12% off on domestic flights up to ₹1,200" },
    HOTELPREMIER: { discountPercent: 20, maxDiscount: 2500, minCart: 4000, desc: "20% off on 4★ & 5★ luxury stays" },
    YATRAFREE: { flatDiscount: 500, minCart: 1500, desc: "Flat ₹500 off on temple darshans and bus tickets" },
    MONSOON35: { discountPercent: 35, maxDiscount: 3500, minCart: 6000, desc: "35% Monsoon special discount" },
    BHARATFIRST: { flatDiscount: 1000, minCart: 3500, desc: "Flat ₹1,000 off on your first trip booking" },
    HDFCFLY: { discountPercent: 12, maxDiscount: 1800, minCart: 4500, desc: "12% instant discount on flights via HDFC Bank" },
  };

  const coupon = validCoupons[upperCode];
  if (!coupon) {
    return res.json({ success: false, valid: false, error: "Invalid or expired promo code" });
  }

  if (coupon.minCart && cartAmount < coupon.minCart) {
    return res.json({
      success: false,
      valid: false,
      error: `Minimum booking amount of ₹${coupon.minCart} required for ${upperCode}`,
    });
  }

  let calculatedDiscount = 0;
  if (coupon.flatDiscount) {
    calculatedDiscount = coupon.flatDiscount;
  } else if (coupon.discountPercent) {
    calculatedDiscount = Math.min((cartAmount * coupon.discountPercent) / 100, coupon.maxDiscount || 99999);
  }

  res.json({
    success: true,
    valid: true,
    code: upperCode,
    discountAmount: Math.round(calculatedDiscount),
    finalPayable: Math.max(0, cartAmount - Math.round(calculatedDiscount)),
    description: coupon.desc,
  });
});

// =========================================================================
// 3.9. TRAVEL PLATFORM — EXPLORE + OFFERS + CAMPAIGN + CMS REST API LAYER
// =========================================================================

let OFFERS_STORE: any[] = [
  {
    id: "OFF-2026-001",
    offerCode: "BHARATFIRST",
    offerName: "First Trip on BharatYatra",
    offerType: "FIRST_BOOKING",
    productType: "ALL",
    partner: "BharatYatra Direct",
    destination: "All India",
    description: "Flat ₹1,000 instant discount on your maiden flight, hotel, or package booking.",
    discountType: "FLAT",
    discountValue: 1000,
    maxDiscountCap: 1000,
    minBookingValue: 3500,
    status: "LIVE",
    priority: 10,
    stackable: false,
  },
  {
    id: "OFF-2026-002",
    offerCode: "HDFCFLY",
    offerName: "HDFC Bank Wings Privilege",
    offerType: "BANK_CARD",
    productType: "FLIGHTS",
    partner: "HDFC Bank",
    destination: "Domestic & International",
    description: "12% instant discount up to ₹1,800 on all domestic flights via HDFC cards.",
    discountType: "PERCENTAGE",
    discountValue: 12,
    maxDiscountCap: 1800,
    minBookingValue: 4500,
    status: "LIVE",
    priority: 9,
    stackable: false,
  },
  {
    id: "OFF-2026-003",
    offerCode: "GOAREPAIRE",
    offerName: "Goa Beachfront Resorts Bonanza",
    offerType: "RESORT",
    productType: "HOTELS",
    partner: "Goa Tourism & Luxury Stays",
    destination: "Goa",
    description: "25% discount up to ₹3,500 on verified beachfront resorts in North and South Goa.",
    discountType: "PERCENTAGE",
    discountValue: 25,
    maxDiscountCap: 3500,
    minBookingValue: 6000,
    status: "LIVE",
    priority: 8,
    stackable: true,
  },
  {
    id: "OFF-2026-004",
    offerCode: "YATRAPILGRIM",
    offerName: "Sacred Yatra & Darshan Special",
    offerType: "PILGRIMAGE",
    productType: "PILGRIMAGE",
    partner: "Shrine Boards & Yatra Trust",
    destination: "Varanasi, Ayodhya, Tirupati, Char Dham",
    description: "Flat ₹1,500 off on Chardham, Varanasi, Tirupati, and Ayodhya guided packages.",
    discountType: "FLAT",
    discountValue: 1500,
    maxDiscountCap: 1500,
    minBookingValue: 8000,
    status: "LIVE",
    priority: 9,
    stackable: false,
  },
  {
    id: "OFF-2026-005",
    offerCode: "MONSOON35",
    offerName: "Monsoon Magic 35% Voucher",
    offerType: "SEASONAL",
    productType: "HOTELS",
    partner: "BharatYatra Escapes",
    destination: "Munnar, Coorg, Lonavala, Wayanad",
    description: "35% off on hill stations, waterfall treks, and backwater retreats.",
    discountType: "PERCENTAGE",
    discountValue: 35,
    maxDiscountCap: 3500,
    minBookingValue: 5000,
    status: "LIVE",
    priority: 8,
    stackable: true,
  },
];

let CAMPAIGNS_STORE: any[] = [
  {
    id: "CAMP-2026-01",
    name: "Diwali Travel Mahotsav 2026",
    objective: "GMV_GROWTH",
    budgetInr: 2500000,
    spentInr: 1150000,
    targetAudience: "All Pan-India Travelers & Families",
    assignedOfferCodes: ["BHARATFIRST", "HDFCFLY", "YATRAPILGRIM"],
    startDate: "2026-10-01",
    endDate: "2026-11-15",
    status: "APPROVED",
    priority: 10,
    metrics: { impressions: 540000, clicks: 72000, bookings: 6850, gmvGeneratedInr: 28400000, roiMultiplier: 15.4 },
  },
  {
    id: "CAMP-2026-02",
    name: "Monsoon Magic & Hill Stations",
    objective: "BOOKING_CONVERSION",
    budgetInr: 1200000,
    spentInr: 960000,
    targetAudience: "Couples, Weekend Roadtrippers, Solo Trekkers",
    assignedOfferCodes: ["MONSOON35", "GOAREPAIRE"],
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    status: "LIVE",
    priority: 9,
    metrics: { impressions: 380000, clicks: 46000, bookings: 4120, gmvGeneratedInr: 16800000, roiMultiplier: 15.0 },
  },
];

let CMS_PAGES_STORE: any[] = [
  {
    id: "CMS-PAGE-01",
    slug: "travel/goa",
    pageType: "DESTINATION",
    title: "Goa Beachfront & Heritage Travel Guide 2026",
    status: "PUBLISHED",
    sectionsCount: 8,
    lastUpdated: "2026-08-28T10:00:00Z",
  },
  {
    id: "CMS-PAGE-02",
    slug: "travel/kerala",
    pageType: "DESTINATION",
    title: "Kerala Backwaters & Tea Plantation Guide",
    status: "PUBLISHED",
    sectionsCount: 7,
    lastUpdated: "2026-08-29T12:00:00Z",
  },
  {
    id: "CMS-PAGE-03",
    slug: "campaign/diwali-mahotsav",
    pageType: "CAMPAIGN",
    title: "Diwali Travel Mahotsav 2026 Deals & Vouchers",
    status: "PUBLISHED",
    sectionsCount: 6,
    lastUpdated: "2026-08-25T14:30:00Z",
  },
];

// 1. Explore REST Endpoints
app.get("/api/explore", (req, res) => {
  res.json({
    success: true,
    totalCategories: 24,
    totalDestinations: 340,
    featuredDestinations: ["Goa", "Kerala", "Jaipur", "Manali", "Varanasi", "Kashmir", "Andaman", "Rishikesh"],
    trendingSeasons: "Monsoon Waterfalls & Festive Himalayan Getaways",
  });
});

app.get("/api/explore/categories", (req, res) => {
  res.json({
    success: true,
    categories: [
      "Destinations", "Cities", "States", "Beaches", "Hill stations", "Pilgrimage", "Adventure", "Wildlife",
      "Heritage", "Weekend trips", "Honeymoon", "Family travel", "Solo travel", "Luxury travel", "Budget travel",
      "Festivals/events", "Seasonal travel", "Popular attractions", "Hidden destinations", "Travel guides",
      "Things to do", "Food & restaurants", "Hotels/resorts", "Tours", "Transport"
    ],
  });
});

app.get("/api/explore/destinations", (req, res) => {
  const { category, state } = req.query;
  res.json({
    success: true,
    filter: { category: category || "all", state: state || "all" },
    destinations: [
      { id: "dest-goa", name: "Goa", state: "Goa", category: "Beaches", rating: 4.9, minPrice: 2499, coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
      { id: "dest-kerala", name: "Kerala Backwaters", state: "Kerala", category: "Houseboats & Nature", rating: 4.9, minPrice: 3199, coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80" },
      { id: "dest-jaipur", name: "Jaipur Pink City", state: "Rajasthan", category: "Heritage & Forts", rating: 4.8, minPrice: 1899, coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
      { id: "dest-varanasi", name: "Varanasi Ghats", state: "Uttar Pradesh", category: "Pilgrimage", rating: 4.9, minPrice: 1499, coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80" },
      { id: "dest-manali", name: "Manali & Solang", state: "Himachal Pradesh", category: "Hill Stations", rating: 4.7, minPrice: 2199, coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
    ],
  });
});

app.get("/api/explore/:slug(*)", (req, res) => {
  const slug = req.params.slug;
  const page = CMS_PAGES_STORE.find((p) => p.slug === slug || p.slug.includes(slug));
  if (!page) {
    return res.status(404).json({ success: false, error: "Explore topic not found for slug: " + slug });
  }
  res.json({ success: true, exploreData: page });
});

// 2. Offers REST Endpoints
app.get("/api/offers", (req, res) => {
  const { productType, offerType } = req.query;
  let filtered = [...OFFERS_STORE];
  if (productType && productType !== "ALL") {
    filtered = filtered.filter((o) => o.productType === productType || o.productType === "ALL");
  }
  if (offerType) {
    filtered = filtered.filter((o) => o.offerType === offerType);
  }
  res.json({ success: true, count: filtered.length, offers: filtered });
});

app.get("/api/offers/:id", (req, res) => {
  const offer = OFFERS_STORE.find((o) => o.id === req.params.id || o.offerCode === req.params.id.toUpperCase());
  if (!offer) {
    return res.status(404).json({ success: false, error: "Offer not found" });
  }
  res.json({ success: true, offer });
});

// Offer Eligibility Rule Evaluator API (Module 5)
app.post("/api/offers/eligible", (req, res) => {
  const {
    userSegment = "NEW_USER",
    destination = "Goa",
    product = "HOTELS",
    bookingAmount = 6500,
    paymentMethod = "HDFC",
    device = "WEB",
  } = req.body || {};

  const eligibleOffers = OFFERS_STORE.filter((offer) => {
    if (offer.status !== "LIVE" && offer.status !== "ACTIVE") return false;
    if (bookingAmount < offer.minBookingValue) return false;
    if (offer.productType !== "ALL" && offer.productType !== product) return false;
    if (offer.destination && offer.destination !== "All India" && !destination.toLowerCase().includes(offer.destination.toLowerCase())) {
      // allow flexible matching
    }
    return true;
  });

  res.json({
    success: true,
    context: { userSegment, destination, product, bookingAmount, paymentMethod, device },
    eligibleCount: eligibleOffers.length,
    eligibleOffers,
  });
});

// Apply Offer (Module 4)
app.post("/api/offers/apply", (req, res) => {
  const { offerCode, cartAmount = 5000, category = "HOTELS" } = req.body || {};
  const offer = OFFERS_STORE.find((o) => o.offerCode.toUpperCase() === (offerCode || "").trim().toUpperCase());
  if (!offer) {
    return res.status(400).json({ success: false, error: "Invalid offer code" });
  }
  if (cartAmount < offer.minBookingValue) {
    return res.status(400).json({ success: false, error: `Minimum booking of ₹${offer.minBookingValue} required` });
  }

  let discount = 0;
  if (offer.discountType === "FLAT") {
    discount = offer.discountValue;
  } else if (offer.discountType === "PERCENTAGE") {
    discount = Math.min((cartAmount * offer.discountValue) / 100, offer.maxDiscountCap);
  }

  res.json({
    success: true,
    appliedOffer: offer.offerCode,
    discountAmount: Math.round(discount),
    finalPayable: Math.max(0, cartAmount - Math.round(discount)),
    description: offer.description,
  });
});

// 3. Campaign REST Endpoints (Module 6)
app.get("/api/campaigns", (req, res) => {
  res.json({ success: true, count: CAMPAIGNS_STORE.length, campaigns: CAMPAIGNS_STORE });
});

app.get("/api/campaigns/:id", (req, res) => {
  const camp = CAMPAIGNS_STORE.find((c) => c.id === req.params.id);
  if (!camp) return res.status(404).json({ success: false, error: "Campaign not found" });
  res.json({ success: true, campaign: camp });
});

// 4. CMS Endpoints (Module 7)
app.get("/api/cms/pages/:slug(*)", (req, res) => {
  const targetSlug = req.params.slug;
  const page = CMS_PAGES_STORE.find(
    (p) => p.slug === targetSlug || p.slug === `travel/${targetSlug}` || p.slug === `explore/${targetSlug}`
  );
  if (!page) {
    return res.status(404).json({ success: false, error: "Page not found for slug: " + targetSlug });
  }
  res.json({ success: true, page });
});

app.get("/api/cms/blocks/:id", (req, res) => {
  res.json({
    success: true,
    blockId: req.params.id,
    reusableBlocksAvailable: [
      "HERO_BANNER", "OFFER_CAROUSEL", "DESTINATION_CAROUSEL", "HOTEL_CARDS", "FLIGHT_CARDS",
      "TOUR_CARDS", "BUS_CARDS", "CATEGORY_CARDS", "PARTNER_CARDS", "COUPON_BANNER",
      "COUNTDOWN_TIMER", "TRAVEL_GUIDE", "FAQ", "TESTIMONIALS", "REVIEWS", "MAP", "VIDEO", "CTA", "NEWSLETTER"
    ],
  });
});

// Admin Offer Management
app.post("/api/admin/offers", (req, res) => {
  const newOffer = {
    id: `OFF-2026-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    status: "LIVE",
    ...req.body,
  };
  OFFERS_STORE.unshift(newOffer);
  res.json({ success: true, offer: newOffer });
});

app.put("/api/admin/offers/:id", (req, res) => {
  const idx = OFFERS_STORE.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Offer not found" });
  OFFERS_STORE[idx] = { ...OFFERS_STORE[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, offer: OFFERS_STORE[idx] });
});

app.delete("/api/admin/offers/:id", (req, res) => {
  OFFERS_STORE = OFFERS_STORE.filter((o) => o.id !== req.params.id);
  res.json({ success: true, message: `Offer ${req.params.id} deleted successfully` });
});

// Admin CMS Page Management
app.post("/api/admin/cms/pages", (req, res) => {
  const newPage = {
    id: `CMS-PAGE-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    status: "PUBLISHED",
    ...req.body,
  };
  CMS_PAGES_STORE.unshift(newPage);
  res.json({ success: true, page: newPage });
});

app.put("/api/admin/cms/pages/:id", (req, res) => {
  const idx = CMS_PAGES_STORE.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Page not found" });
  CMS_PAGES_STORE[idx] = { ...CMS_PAGES_STORE[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, page: CMS_PAGES_STORE[idx] });
});

// Admin Campaign Management
app.post("/api/admin/campaigns", (req, res) => {
  const newCamp = {
    id: `CAMP-2026-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    status: "APPROVED",
    ...req.body,
  };
  CAMPAIGNS_STORE.unshift(newCamp);
  res.json({ success: true, campaign: newCamp });
});

app.put("/api/admin/campaigns/:id", (req, res) => {
  const idx = CAMPAIGNS_STORE.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Campaign not found" });
  CAMPAIGNS_STORE[idx] = { ...CAMPAIGNS_STORE[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, campaign: CAMPAIGNS_STORE[idx] });
});

// Analytics Funnel API (Module 17)
app.get("/api/analytics/funnel", (req, res) => {
  res.json({
    success: true,
    funnel: {
      impressions: 1840000,
      views: 1120000,
      clicks: 430000,
      offerDetails: 245000,
      couponApplied: 142000,
      searches: 98000,
      checkout: 52000,
      bookings: 38400,
      conversionRate: "2.09%",
      totalGmvInr: 153600000,
      discountBurnInr: 11520000,
      netRevenueInr: 142080000,
    },
  });
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BharatYatra Super App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
