export interface CategoryCommissionRate {
  category: string;
  minCommissionPercent: number;
  maxCommissionPercent: number;
  defaultCommissionPercent: number;
  averageBookingValueINR: number;
  averageCommissionINR: number;
  description: string;
}

export interface B2BCommercialPlan {
  id: "starter" | "growth" | "professional" | "enterprise";
  name: string;
  monthlyFeeINR: number;
  qualifiedLeadFeeRange: string;
  conversionCommissionRange: string;
  bestFor: string;
  features: string[];
  recommendedBadge?: string;
}

export interface QualifiedLeadValidationCheck {
  id: string;
  field: string;
  label: string;
  description: string;
  required: boolean;
  validationRule: string;
}

export interface B2BAttributedLeadConversion {
  leadId: string;
  campaignSource: "Google Ads" | "Meta Ads" | "Organic SEO" | "Instagram Reel" | "WhatsApp Inbound" | "Landing Page";
  campaignId: string;
  campaignName: string;
  partnerId: string;
  partnerName: string;
  partnerCategory: string;
  customerName: string;
  customerPhone: string;
  customerDestination: string;
  travelDate: string;
  paxCount: number;
  budgetEstimateINR: number;
  leadQualificationScore: number;
  telesalesExecutiveId: string;
  telesalesExecutiveName: string;
  stage: "Qualified Lead" | "Quotation Sent" | "Negotiation" | "Confirmed Booking" | "Cancelled / Refunded";
  bookingId?: string;
  bookingValueINR?: number;
  commissionPercent: number;
  grossCommissionINR: number;
  telesalesIncentiveINR: number;
  netPlatformRevenueINR: number;
  partnerSettlementAmountINR: number;
  settlementStatus: "Settled" | "Pending_Payment" | "Processing" | "Reversed_Refund";
  createdAt: string;
}

export interface TelesalesPerformanceSummary {
  executiveId: string;
  name: string;
  assignedLeads: number;
  callsMade: number;
  connectedCalls: number;
  qualifiedLeads: number;
  quotationsSent: number;
  followupsDue: number;
  conversions: number;
  totalBookingValueINR: number;
  conversionRatePercent: number;
  totalCommissionGeneratedINR: number;
  executiveIncentiveEarnedINR: number;
  cancelledBookingsCount: number;
  avatar: string;
}

export const CATEGORY_COMMISSION_RATES: CategoryCommissionRate[] = [
  {
    category: "Tour Package",
    minCommissionPercent: 10,
    maxCommissionPercent: 20,
    defaultCommissionPercent: 15,
    averageBookingValueINR: 65000,
    averageCommissionINR: 9750,
    description: "Multi-day customized itineraries, hill stations, wildlife & leisure packages.",
  },
  {
    category: "Pilgrimage Package",
    minCommissionPercent: 8,
    maxCommissionPercent: 15,
    defaultCommissionPercent: 12,
    averageBookingValueINR: 52000,
    averageCommissionINR: 6240,
    description: "Chardham, Kashi Vishwanath, Tirupati, Vaishno Devi & Jyotirlinga yatras.",
  },
  {
    category: "Resort",
    minCommissionPercent: 8,
    maxCommissionPercent: 15,
    defaultCommissionPercent: 12,
    averageBookingValueINR: 35000,
    averageCommissionINR: 4200,
    description: "Luxury beachfront villas, wellness retreats, luxury eco-resorts.",
  },
  {
    category: "Hotel / Lodge",
    minCommissionPercent: 5,
    maxCommissionPercent: 12,
    defaultCommissionPercent: 10,
    averageBookingValueINR: 18000,
    averageCommissionINR: 1800,
    description: "City boutique stays, business hotels, budget lodges & guest houses.",
  },
  {
    category: "Houseboat",
    minCommissionPercent: 8,
    maxCommissionPercent: 15,
    defaultCommissionPercent: 12,
    averageBookingValueINR: 22000,
    averageCommissionINR: 2640,
    description: "Alleppey backwaters & Dal Lake cedarwood heritage houseboats.",
  },
  {
    category: "Cab Booking / Outstation",
    minCommissionPercent: 8,
    maxCommissionPercent: 15,
    defaultCommissionPercent: 10,
    averageBookingValueINR: 12000,
    averageCommissionINR: 1200,
    description: "Outstation tourist cabs, airport transfers, luxury chauffeur cars.",
  },
  {
    category: "Bus Booking",
    minCommissionPercent: 3,
    maxCommissionPercent: 10,
    defaultCommissionPercent: 6,
    averageBookingValueINR: 4500,
    averageCommissionINR: 270,
    description: "Intercity sleeper buses, Volvo AC fleets & pilgrim buses.",
  },
  {
    category: "Corporate Travel",
    minCommissionPercent: 3,
    maxCommissionPercent: 10,
    defaultCommissionPercent: 5,
    averageBookingValueINR: 180000,
    averageCommissionINR: 9000,
    description: "Corporate offsites, MICE events, executive team conferences.",
  },
  {
    category: "Restaurant / Dining Experience",
    minCommissionPercent: 5,
    maxCommissionPercent: 12,
    defaultCommissionPercent: 8,
    averageBookingValueINR: 3500,
    averageCommissionINR: 280,
    description: "Rooftop dining, royal thali bookings, curated culinary experiences.",
  },
];

export const B2B_COMMERCIAL_PLANS: B2BCommercialPlan[] = [
  {
    id: "starter",
    name: "Starter (Performance Only)",
    monthlyFeeINR: 0,
    qualifiedLeadFeeRange: "₹100 – ₹300",
    conversionCommissionRange: "12% – 20%",
    bestFor: "Small boutique operators & new travel vendors testing lead conversion",
    features: [
      "Zero monthly fixed cost",
      "Pay only for verified qualified leads & converted bookings",
      "Direct CRM & Telesales routing",
      "Standard 15-day settlement cycle",
      "Standard WhatsApp lead notifications",
    ],
  },
  {
    id: "growth",
    name: "Growth Partner",
    monthlyFeeINR: 2999,
    qualifiedLeadFeeRange: "₹50 – ₹150",
    conversionCommissionRange: "8% – 15%",
    recommendedBadge: "MOST POPULAR",
    bestFor: "Established mid-size tour operators & resort chains scaling bookings",
    features: [
      "Reduced conversion commission rates (8% - 15%)",
      "Discounted qualified lead fee",
      "Dedicated WFH Telesales Executive allocation",
      "Weekly automated settlement payouts",
      "Full API & Google/Meta attribution logs",
    ],
  },
  {
    id: "professional",
    name: "Professional Agency Suite",
    monthlyFeeINR: 7999,
    qualifiedLeadFeeRange: "₹0 – ₹100",
    conversionCommissionRange: "6% – 12%",
    bestFor: "High-volume DMCs, multi-property hotel groups & luxury agencies",
    features: [
      "Lowest commission take-rate (6% - 12%)",
      "Free qualified leads allotment (up to 50/month)",
      "Priority VIP lead queue routing (<30 sec first call)",
      "Dedicated account manager & custom landing pages",
      "Daily instant UPI/IMPS settlement escrow",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Custom SLA",
    monthlyFeeINR: 19999,
    qualifiedLeadFeeRange: "Custom Volume Tier",
    conversionCommissionRange: "3% – 10%",
    bestFor: "National airlines, state tourism boards, large corporate travel networks",
    features: [
      "Negotiated volume commission rates",
      "Custom SLA guarantees with financial penalty clause",
      "Dedicated 24/7 Telesales Pod (5+ Executives)",
      "Custom ERP & PMS webhook sync",
      "White-label quotation PDF & SMS gateway",
    ],
  },
];

export const QUALIFIED_LEAD_RULES: QualifiedLeadValidationCheck[] = [
  {
    id: "QL-01",
    field: "customerName",
    label: "Valid Customer Full Name",
    description: "Must have at least first and last name; no placeholder strings like 'test' or 'abc'.",
    required: true,
    validationRule: "Regex: ^[A-Za-z ]{3,50}$",
  },
  {
    id: "QL-02",
    field: "customerPhone",
    label: "Verified 10-Digit Mobile / WhatsApp",
    description: "OTP or HLR live network verified Indian or international contact number.",
    required: true,
    validationRule: "Regex: ^\\+?[0-9]{10,14}$",
  },
  {
    id: "QL-03",
    field: "customerDestination",
    label: "Specific Travel Destination",
    description: "Clear destination intent (e.g. Kedarnath, Goa, Kashmir, Manali, Kerala).",
    required: true,
    validationRule: "Non-empty string matching travel database",
  },
  {
    id: "QL-04",
    field: "travelDate",
    label: "Proposed Travel Date / Month",
    description: "Specific date or travel departure window within 180 days.",
    required: true,
    validationRule: "Valid future ISO date string",
  },
  {
    id: "QL-05",
    field: "paxCount",
    label: "Number of Travellers (Pax)",
    description: "Adult, child, and infant headcount provided for accurate quotation.",
    required: true,
    validationRule: "Integer >= 1",
  },
  {
    id: "QL-06",
    field: "requiredService",
    label: "Required Category & Package",
    description: "Clear service requirement (Hotel, Resort, Tour, Cab, Flight, Yatra).",
    required: true,
    validationRule: "Valid Category ID",
  },
  {
    id: "QL-07",
    field: "budgetEstimate",
    label: "Approximate Travel Budget",
    description: "Customer provided estimated budget per person or total family spend.",
    required: true,
    validationRule: "Numeric INR value",
  },
  {
    id: "QL-08",
    field: "customerConsent",
    label: "Explicit Consent to Contact (TRAI / DND)",
    description: "Timestamped digital consent to receive call, WhatsApp & email quotation.",
    required: true,
    validationRule: "Boolean TRUE with timestamp",
  },
];

export const INITIAL_ATTRIBUTED_LEADS: B2BAttributedLeadConversion[] = [
  {
    leadId: "LEAD-ATT-8801",
    campaignSource: "Google Ads",
    campaignId: "CAMP-GOOG-01",
    campaignName: "Chardham Yatra Search Intent",
    partnerId: "PTR-HIMALAYAN-01",
    partnerName: "Himalayan Sacred Travels & Heli",
    partnerCategory: "Pilgrimage Package",
    customerName: "Sanjay Singhania & Family",
    customerPhone: "+91 98201 44521",
    customerDestination: "Kedarnath & Badrinath",
    travelDate: "2026-09-15",
    paxCount: 4,
    budgetEstimateINR: 120000,
    leadQualificationScore: 96,
    telesalesExecutiveId: "EXEC-WFH-101",
    telesalesExecutiveName: "Priya Sharma",
    stage: "Confirmed Booking",
    bookingId: "BK-YATRA-9942",
    bookingValueINR: 98000,
    commissionPercent: 12,
    grossCommissionINR: 11760,
    telesalesIncentiveINR: 1176, // 10% of commission
    netPlatformRevenueINR: 10584,
    partnerSettlementAmountINR: 86240,
    settlementStatus: "Settled",
    createdAt: "2026-08-26",
  },
  {
    leadId: "LEAD-ATT-8802",
    campaignSource: "Meta Ads",
    campaignId: "CAMP-META-02",
    campaignName: "Goa Luxury Beachfront Villas",
    partnerId: "PTR-GOA-VILLA-04",
    partnerName: "Azure Coastline Hospitality",
    partnerCategory: "Resort",
    customerName: "Rahul & Neha Kapoor",
    customerPhone: "+91 98112 88732",
    customerDestination: "Candolim, Goa",
    travelDate: "2026-10-02",
    paxCount: 2,
    budgetEstimateINR: 60000,
    leadQualificationScore: 92,
    telesalesExecutiveId: "EXEC-WFH-102",
    telesalesExecutiveName: "Amit Verma",
    stage: "Confirmed Booking",
    bookingId: "BK-GOA-1084",
    bookingValueINR: 52000,
    commissionPercent: 15,
    grossCommissionINR: 7800,
    telesalesIncentiveINR: 780,
    netPlatformRevenueINR: 7020,
    partnerSettlementAmountINR: 44200,
    settlementStatus: "Settled",
    createdAt: "2026-08-27",
  },
  {
    leadId: "LEAD-ATT-8803",
    campaignSource: "Instagram Reel",
    campaignId: "CAMP-REEL-04",
    campaignName: "Kerala Backwaters Houseboat Reel",
    partnerId: "PTR-KERALA-BOAT-02",
    partnerName: "Kumarakom Emerald Waters",
    partnerCategory: "Houseboat",
    customerName: "Dr. Arvind Swaminathan",
    customerPhone: "+91 94440 12890",
    customerDestination: "Alleppey, Kerala",
    travelDate: "2026-09-22",
    paxCount: 3,
    budgetEstimateINR: 35000,
    leadQualificationScore: 88,
    telesalesExecutiveId: "EXEC-WFH-101",
    telesalesExecutiveName: "Priya Sharma",
    stage: "Quotation Sent",
    commissionPercent: 12,
    grossCommissionINR: 3600,
    telesalesIncentiveINR: 360,
    netPlatformRevenueINR: 3240,
    partnerSettlementAmountINR: 26400,
    settlementStatus: "Pending_Payment",
    createdAt: "2026-08-28",
  },
  {
    leadId: "LEAD-ATT-8804",
    campaignSource: "Organic SEO",
    campaignId: "CAMP-SEO-05",
    campaignName: "Kashmir 5D/4N Itinerary Organic Guide",
    partnerId: "PTR-KASHMIR-08",
    partnerName: "Paradise Valley Expeditions",
    partnerCategory: "Tour Package",
    customerName: "Vikramaditya Roy",
    customerPhone: "+91 98300 55194",
    customerDestination: "Gulmarg & Srinagar",
    travelDate: "2026-10-18",
    paxCount: 5,
    budgetEstimateINR: 110000,
    leadQualificationScore: 94,
    telesalesExecutiveId: "EXEC-WFH-103",
    telesalesExecutiveName: "Ananya Desai",
    stage: "Confirmed Booking",
    bookingId: "BK-KASHMIR-7719",
    bookingValueINR: 85000,
    commissionPercent: 15,
    grossCommissionINR: 12750,
    telesalesIncentiveINR: 1275,
    netPlatformRevenueINR: 11475,
    partnerSettlementAmountINR: 72250,
    settlementStatus: "Settled",
    createdAt: "2026-08-25",
  },
  {
    leadId: "LEAD-ATT-8805",
    campaignSource: "Google Ads",
    campaignId: "CAMP-GOOG-02",
    campaignName: "Manali Rohtang Pass Adventure",
    partnerId: "PTR-HIMALAYAN-06",
    partnerName: "Snow Peak Adventure Camps",
    partnerCategory: "Tour Package",
    customerName: "Kunal Deshmukh",
    customerPhone: "+91 97654 32109",
    customerDestination: "Manali & Solang",
    travelDate: "2026-09-08",
    paxCount: 2,
    budgetEstimateINR: 40000,
    leadQualificationScore: 82,
    telesalesExecutiveId: "EXEC-WFH-102",
    telesalesExecutiveName: "Amit Verma",
    stage: "Cancelled / Refunded",
    bookingId: "BK-MANALI-3312",
    bookingValueINR: 38000,
    commissionPercent: 15,
    grossCommissionINR: 5700,
    telesalesIncentiveINR: 0, // reversed
    netPlatformRevenueINR: 0,
    partnerSettlementAmountINR: 0,
    settlementStatus: "Reversed_Refund",
    createdAt: "2026-08-24",
  },
];

export const INITIAL_TELESALES_PERFORMANCE: TelesalesPerformanceSummary[] = [
  {
    executiveId: "EXEC-WFH-101",
    name: "Priya Sharma",
    assignedLeads: 148,
    callsMade: 320,
    connectedCalls: 248,
    qualifiedLeads: 126,
    quotationsSent: 94,
    followupsDue: 12,
    conversions: 28,
    totalBookingValueINR: 1840000,
    conversionRatePercent: 18.9,
    totalCommissionGeneratedINR: 228000,
    executiveIncentiveEarnedINR: 22800,
    cancelledBookingsCount: 1,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  },
  {
    executiveId: "EXEC-WFH-102",
    name: "Amit Verma",
    assignedLeads: 132,
    callsMade: 290,
    connectedCalls: 215,
    qualifiedLeads: 104,
    quotationsSent: 78,
    followupsDue: 18,
    conversions: 21,
    totalBookingValueINR: 1260000,
    conversionRatePercent: 15.9,
    totalCommissionGeneratedINR: 151200,
    executiveIncentiveEarnedINR: 15120,
    cancelledBookingsCount: 1,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  },
  {
    executiveId: "EXEC-WFH-103",
    name: "Ananya Desai",
    assignedLeads: 118,
    callsMade: 260,
    connectedCalls: 198,
    qualifiedLeads: 98,
    quotationsSent: 71,
    followupsDue: 9,
    conversions: 19,
    totalBookingValueINR: 1180000,
    conversionRatePercent: 16.1,
    totalCommissionGeneratedINR: 141600,
    executiveIncentiveEarnedINR: 14160,
    cancelledBookingsCount: 0,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
  },
];
