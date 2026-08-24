import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
      "Booking Engine",
      "Pricing Engine",
      "Search Engine",
      "Partner Settlement Engine",
      "Notification Dispatcher",
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
// 4. VITE MIDDLEWARE & SERVER BOOTSTRAP
// ==========================================
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
