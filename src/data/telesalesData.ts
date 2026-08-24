import {
  TelesalesExecutive,
  TelesalesLead,
  TelesalesCallLog,
  TelesalesIncentiveTierConfig,
  TelesalesFraudAlert,
} from "../types";

// =========================================================================
// 6. TELESALES INCENTIVE TIERS (CONFIGURABLE MODEL: FIXED SALARY + BOOKING INCENTIVE + TARGET BONUS)
// Monthly Target: 100 bookings
// Tier 1: 0–50    → Base incentive
// Tier 2: 51–100  → Higher incentive
// Tier 3: 101–150 → Performance bonus
// Tier 4: 150+    → Premium target bonus
// =========================================================================
export const TELESALES_INCENTIVE_TIERS_CONFIG: TelesalesIncentiveTierConfig[] = [
  {
    tierNumber: 1,
    label: "0 – 50 Bookings (Base Tier)",
    minBookings: 0,
    maxBookings: 50,
    perBookingIncentiveINR: 150,
    milestoneTargetBonusINR: 0,
    color: "from-slate-600 to-slate-800",
    description: "Standard baseline commission per confirmed booking. Minimum SLA compliance required.",
  },
  {
    tierNumber: 2,
    label: "51 – 100 Bookings (Target Accelerator)",
    minBookings: 51,
    maxBookings: 100,
    perBookingIncentiveINR: 275,
    milestoneTargetBonusINR: 3500, // ₹3,500 extra bonus upon hitting 100 bookings target
    color: "from-blue-600 to-indigo-700",
    description: "Accelerated take-rate for reaching monthly target threshold + ₹3,500 target completion cash reward.",
  },
  {
    tierNumber: 3,
    label: "101 – 150 Bookings (Performance Supercharger)",
    minBookings: 101,
    maxBookings: 150,
    perBookingIncentiveINR: 425,
    milestoneTargetBonusINR: 7500, // Additional ₹7,500 milestone bonus at 150 bookings
    color: "from-amber-600 to-orange-700",
    description: "High-performer bracket with ₹425 per booking incentive and high priority hot lead routing.",
  },
  {
    tierNumber: 4,
    label: "150+ Bookings (Kohinoor Champion Tier)",
    minBookings: 151,
    maxBookings: 9999,
    perBookingIncentiveINR: 600,
    milestoneTargetBonusINR: 15000, // ₹15,000 champion quarterly cash award
    color: "from-purple-600 to-pink-700",
    description: "Elite tier with maximum revenue sharing, ₹600/booking payout, priority VIP inquiries, and corporate leads.",
  },
];

export const TELESALES_INCENTIVE_TIERS = TELESALES_INCENTIVE_TIERS_CONFIG;

// =========================================================================
// 4. TELESALES EXECUTIVES DATABASE (WORK FROM HOME / REGIONAL DESKS)
// =========================================================================
export const TELESALES_EXECUTIVES_LIST: TelesalesExecutive[] = [
  {
    id: "EXEC-WFH-101",
    empCode: "BY-TS-101",
    fullName: "Priya Sharma",
    email: "priya.sharma@bharatyatra.in",
    phone: "+91 98230 11984",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
    role: "Chardham & Yatra Specialist",
    cityLocation: "Dehradun (WFH)",
    workMode: "WORK_FROM_HOME",
    currentShiftStatus: "ONLINE_READY",
    todayCallsDialed: 42,
    todayConnectedCalls: 31,
    todayConversionsCount: 6,
    todayConvertedGMV: 186000,
    monthlyTargetBookings: 100,
    monthlyAchievedBookings: 114, // Tier 3!
    monthlyTargetGMV: 2500000,
    monthlyAchievedGMV: 3180000,
    currentIncentiveTier: 3,
    baseFixedSalaryINR: 28000,
    earnedBookingIncentiveINR: 27150, // (50*150) + (50*275) + (14*425) = 7500 + 13750 + 5950
    earnedMilestoneBonusINR: 3500,
    totalMonthlyEarningsINR: 58650,
    conversionRatePercent: 18.4,
    averageTalkTimeMinutes: 4.8,
    qualityScorePercent: 96.5,
    attendanceToday: {
      punchInTime: "09:15 AM",
      activeHours: 6.5,
      status: "PRESENT",
    },
  },
  {
    id: "EXEC-WFH-102",
    empCode: "BY-TS-102",
    fullName: "Rahul Varma",
    email: "rahul.varma@bharatyatra.in",
    phone: "+91 98112 34509",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    role: "Luxury Stays Advisor",
    cityLocation: "Jaipur (WFH)",
    workMode: "WORK_FROM_HOME",
    currentShiftStatus: "ON_ACTIVE_CALL",
    todayCallsDialed: 38,
    todayConnectedCalls: 26,
    todayConversionsCount: 4,
    todayConvertedGMV: 142000,
    monthlyTargetBookings: 100,
    monthlyAchievedBookings: 84, // Tier 2
    monthlyTargetGMV: 2500000,
    monthlyAchievedGMV: 2280000,
    currentIncentiveTier: 2,
    baseFixedSalaryINR: 26000,
    earnedBookingIncentiveINR: 16850, // (50*150) + (34*275) = 7500 + 9350
    earnedMilestoneBonusINR: 0,
    totalMonthlyEarningsINR: 42850,
    conversionRatePercent: 15.2,
    averageTalkTimeMinutes: 5.2,
    qualityScorePercent: 92.0,
    attendanceToday: {
      punchInTime: "09:00 AM",
      activeHours: 6.8,
      status: "PRESENT",
    },
  },
  {
    id: "EXEC-WFH-103",
    empCode: "BY-TS-103",
    fullName: "Sneha Iyer",
    email: "sneha.iyer@bharatyatra.in",
    phone: "+91 99401 55672",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    role: "Corporate Lead Manager",
    cityLocation: "Bengaluru (WFH)",
    workMode: "WORK_FROM_HOME",
    currentShiftStatus: "IN_POST_CALL_WRAPUP",
    todayCallsDialed: 29,
    todayConnectedCalls: 22,
    todayConversionsCount: 8,
    todayConvertedGMV: 480000,
    monthlyTargetBookings: 100,
    monthlyAchievedBookings: 156, // Tier 4 Kohinoor!
    monthlyTargetGMV: 3500000,
    monthlyAchievedGMV: 5640000,
    currentIncentiveTier: 4,
    baseFixedSalaryINR: 35000,
    earnedBookingIncentiveINR: 46100,
    earnedMilestoneBonusINR: 18500, // 3500 + 15000
    totalMonthlyEarningsINR: 99600,
    conversionRatePercent: 24.6,
    averageTalkTimeMinutes: 6.4,
    qualityScorePercent: 98.2,
    attendanceToday: {
      punchInTime: "08:45 AM",
      activeHours: 7.2,
      status: "PRESENT",
    },
  },
  {
    id: "EXEC-WFH-104",
    empCode: "BY-TS-104",
    fullName: "Vikram Patel",
    email: "vikram.patel@bharatyatra.in",
    phone: "+91 97234 89012",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    role: "Mobility Desk Specialist",
    cityLocation: "Ahmedabad (WFH)",
    workMode: "WORK_FROM_HOME",
    currentShiftStatus: "ONLINE_READY",
    todayCallsDialed: 48,
    todayConnectedCalls: 35,
    todayConversionsCount: 3,
    todayConvertedGMV: 76000,
    monthlyTargetBookings: 100,
    monthlyAchievedBookings: 46, // Tier 1
    monthlyTargetGMV: 1500000,
    monthlyAchievedGMV: 1120000,
    currentIncentiveTier: 1,
    baseFixedSalaryINR: 24000,
    earnedBookingIncentiveINR: 6900, // 46 * 150
    earnedMilestoneBonusINR: 0,
    totalMonthlyEarningsINR: 30900,
    conversionRatePercent: 11.8,
    averageTalkTimeMinutes: 3.9,
    qualityScorePercent: 89.5,
    attendanceToday: {
      punchInTime: "09:30 AM",
      activeHours: 6.0,
      status: "PRESENT",
    },
  },
];

// =========================================================================
// TELESALES LEADS REPOSITORY (HOT INBOUNDS, CALL LISTS & PIPELINE)
// =========================================================================
export const TELESALES_LEADS_DATABASE: TelesalesLead[] = [
  {
    id: "LEAD-2026-8801",
    leadNumber: "BY-LEAD-8801",
    customerName: "Siddharth Oberoi",
    customerPhone: "+91 98110 44321",
    customerEmail: "siddharth.oberoi@oberoient.com",
    city: "New Delhi",
    serviceCategory: "pilgrimage",
    destinationRequested: "Chardham VIP Helicopter & SUV Yatra (Kedarnath + Badrinath)",
    paxCount: 6,
    travelDate: "2026-09-18",
    budgetEstimateINR: 420000,
    source: "Hot Web Inbound",
    priority: "HOT",
    stage: "QUOTATION_SENT",
    assignedExecutiveId: "EXEC-WFH-101",
    assignedExecutiveName: "Priya Sharma",
    callStatus: "Quotation Shared on WhatsApp",
    followUpDateTime: "2026-08-23 15:30",
    quoteAmountINR: 395000,
    notes: [
      {
        id: "n1",
        timestamp: "2026-08-23 10:15",
        author: "Priya Sharma",
        text: "Client requires 6 VIP Darshan passes with senior citizen priority for parents. Shared detailed itinerary PDF via WhatsApp.",
        nextAction: "Follow up at 3:30 PM for booking advance token.",
      },
      {
        id: "n2",
        timestamp: "2026-08-23 11:45",
        author: "Priya Sharma",
        text: "Client confirmed dates are locked. Asked for 2 helicopter slots from Sahastradhara.",
      },
    ],
    createdDate: "2026-08-23 09:40",
    lastUpdatedDate: "2026-08-23 11:45",
  },
  {
    id: "LEAD-2026-8802",
    leadNumber: "BY-LEAD-8802",
    customerName: "Dr. Malini Krishnan",
    customerPhone: "+91 98401 22987",
    customerEmail: "malini.krishnan@apollohospitals.com",
    city: "Chennai",
    serviceCategory: "lodges",
    destinationRequested: "Corbett Wilderness Riverfront Cottage (3 Nights)",
    paxCount: 4,
    travelDate: "2026-09-25",
    budgetEstimateINR: 65000,
    source: "Abandoned Checkout",
    priority: "HOT",
    stage: "PAYMENT_LINK_SENT",
    assignedExecutiveId: "EXEC-WFH-102",
    assignedExecutiveName: "Rahul Varma",
    callStatus: "Payment Link Generated",
    followUpDateTime: "2026-08-23 16:00",
    quoteAmountINR: 58500,
    notes: [
      {
        id: "n3",
        timestamp: "2026-08-23 11:00",
        author: "Rahul Varma",
        text: "Called customer regarding cart drop-off on Corbett Stone Cottage. Offered flat 10% instant promo code + complimentary jungle safari booking assistance.",
        nextAction: "Sent Razorpay payment link of ₹58,500. Awaiting completion.",
      },
    ],
    createdDate: "2026-08-23 10:20",
    lastUpdatedDate: "2026-08-23 11:10",
  },
  {
    id: "LEAD-2026-8803",
    leadNumber: "BY-LEAD-8803",
    customerName: "Rajeev Agarwal (CFO)",
    customerPhone: "+91 98200 99123",
    customerEmail: "rajeev.agarwal@fintechbharat.io",
    city: "Mumbai",
    serviceCategory: "corporate",
    destinationRequested: "Corporate Leadership Offsite Goa (40 Pax, Taj Holiday Village)",
    paxCount: 40,
    travelDate: "2026-10-12",
    budgetEstimateINR: 1850000,
    source: "VIP WhatsApp Inquiry",
    priority: "HOT",
    stage: "ASSIGNED",
    assignedExecutiveId: "EXEC-WFH-103",
    assignedExecutiveName: "Sneha Iyer",
    callStatus: "Connected - High Interest",
    followUpDateTime: "2026-08-23 14:00",
    quoteAmountINR: 1720000,
    notes: [
      {
        id: "n4",
        timestamp: "2026-08-23 10:45",
        author: "Sneha Iyer",
        text: "Direct discussion with CFO. Requires GST input invoice, banquet hall with AV setup, and Goa airport coach transfers.",
        nextAction: "Submitting formal corporate proposal with 4.5% GST retainer pricing.",
      },
    ],
    createdDate: "2026-08-23 10:00",
    lastUpdatedDate: "2026-08-23 10:50",
  },
  {
    id: "LEAD-2026-8804",
    leadNumber: "BY-LEAD-8804",
    customerName: "Gaurav Bansal",
    customerPhone: "+91 97110 55432",
    customerEmail: "gaurav.b@gmail.com",
    city: "Chandigarh",
    serviceCategory: "trains",
    destinationRequested: "Vande Bharat Express Executive Class (Delhi ⇄ Srinagar)",
    paxCount: 2,
    travelDate: "2026-09-05",
    budgetEstimateINR: 8500,
    source: "Missed Call / IVR",
    priority: "WARM",
    stage: "CONVERTED",
    assignedExecutiveId: "EXEC-WFH-104",
    assignedExecutiveName: "Vikram Patel",
    callStatus: "Booking Completed",
    quoteAmountINR: 7890,
    convertedBookingRef: "BY-TRAIN-VB-9812",
    notes: [
      {
        id: "n5",
        timestamp: "2026-08-23 09:30",
        author: "Vikram Patel",
        text: "Assisted customer in Tatkal fast booking for Executive Chair Car. Confirmed ticket issued.",
        nextAction: "Sent e-ticket on WhatsApp. Lead marked Converted.",
      },
    ],
    createdDate: "2026-08-23 09:15",
    lastUpdatedDate: "2026-08-23 09:35",
  },
];

// =========================================================================
// CALL LOGS STREAM
// =========================================================================
export const TELESALES_CALL_LOGS_STREAM: TelesalesCallLog[] = [
  {
    id: "CALL-8801-1",
    leadId: "LEAD-2026-8801",
    executiveId: "EXEC-WFH-101",
    executiveName: "Priya Sharma",
    customerPhone: "+91 98110 44321",
    callType: "OUTBOUND_DIALER",
    durationSeconds: 340,
    outcome: "Detailed consultation on Chardham helicopter route and Satvik dining requirements.",
    notes: "Customer is impressed with direct VIP access. Requested WhatsApp summary.",
    timestamp: "2026-08-23 10:15",
  },
  {
    id: "CALL-8802-1",
    leadId: "LEAD-2026-8802",
    executiveId: "EXEC-WFH-102",
    executiveName: "Rahul Varma",
    customerPhone: "+91 98401 22987",
    callType: "OUTBOUND_DIALER",
    durationSeconds: 285,
    outcome: "Cart drop-off recovered. Sent custom discount link for Jim Corbett Lodge.",
    notes: "Payment link dispatched.",
    timestamp: "2026-08-23 11:00",
  },
];

// =========================================================================
// FRAUD & DUPLICATE DETECTION ALERTS (BACKEND ENGINE)
// =========================================================================
export const TELESALES_FRAUD_ALERTS: TelesalesFraudAlert[] = [
  {
    id: "FRAUD-ALERT-01",
    leadId: "LEAD-2026-7912",
    customerPhone: "+91 98199 00000",
    executiveId: "EXEC-WFH-999",
    executiveName: "Trainee Rep",
    flagType: "DUPLICATE_PHONE_SPAM",
    severity: "HIGH",
    description: "Same phone number submitted 14 times across 3 different customer names within 10 minutes.",
    flaggedAt: "2026-08-23 08:30",
    isResolved: false,
  },
  {
    id: "FRAUD-ALERT-02",
    leadId: "LEAD-2026-7889",
    customerPhone: "+91 98230 11984",
    executiveId: "EXEC-WFH-881",
    executiveName: "Suspended Agent",
    flagType: "SUSPICIOUS_SELF_BOOKING",
    severity: "CRITICAL",
    description: "Customer contact matches executive's own registered salary account phone number.",
    flaggedAt: "2026-08-22 17:45",
    isResolved: true,
  },
];
