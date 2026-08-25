import { ServiceCategory } from "../types";

export interface SubscriptionPlanTier {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  category: "basic" | "standard" | "professional" | "enterprise";
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  color: string;
  accentBorder: string;
  commissionRate: {
    hotels: number;
    resorts: number;
    lodges: number;
    buses: number;
    cabs: number;
    houseboats: number;
    tours: number;
    pilgrimage: number;
    restaurants: number;
    corporate: number;
    flights: number;
    trains: number;
  };
  listingLimit: number | "Unlimited";
  bookingLimitPerMonth: number | "Unlimited";
  branchesPropertiesLimit: number | "Unlimited";
  settlementCycle: "T+0 Instant" | "T+1 Daily" | "T+2 Rolling" | "T+3 Standard" | "Custom Negotiated";
  features: string[];
  supportedModules: {
    partnerRegistration: boolean;
    businessProfile: boolean;
    bookingManagement: "basic" | "standard" | "advanced" | "enterprise";
    availabilityManagement: boolean;
    offersCoupons: boolean;
    customerReviews: boolean;
    revenueDashboard: boolean;
    advancedReports: boolean;
    supportLevel: "Standard Email" | "Priority Desk" | "24x7 Priority Desk" | "Dedicated Key Account Manager";
    reducedCommission: boolean;
    multipleBranches: boolean;
    customerManagementCRM: boolean;
    analytics: "Basic" | "Standard" | "Advanced Real-Time" | "Custom Enterprise BI";
    promotionalTools: boolean;
    corporateBookingFeatures: boolean;
    apiIntegrationAccess: boolean;
    customCommercialTerms: boolean;
    negotiatedCommission: boolean;
  };
}

export const PARTNER_SUBSCRIPTION_PLANS: SubscriptionPlanTier[] = [
  {
    id: "plan_free_basic",
    name: "Free / Basic Plan",
    badge: "Pay-As-You-Go",
    tagline: "Essential tools for small operators & individual vehicle/homestay owners.",
    category: "basic",
    monthlyPrice: 0,
    quarterlyPrice: 0,
    annualPrice: 0,
    color: "from-slate-700 to-slate-900",
    accentBorder: "border-slate-300",
    listingLimit: 3,
    bookingLimitPerMonth: 50,
    branchesPropertiesLimit: 1,
    settlementCycle: "T+3 Standard",
    commissionRate: {
      hotels: 18.0,
      resorts: 20.0,
      lodges: 16.0,
      buses: 11.0,
      cabs: 18.0,
      houseboats: 17.0,
      tours: 16.0,
      pilgrimage: 15.0,
      restaurants: 12.0,
      corporate: 10.0,
      flights: 3.5,
      trains: 2.0,
    },
    features: [
      "Partner Registration & Verification",
      "Standard Business Profile on BharatYatra",
      "Limited Listings (Up to 3 active inventories)",
      "Basic Booking Management & Guest details",
      "Basic Dashboard (Today's check-ins & reservations)",
      "Basic Monthly Sales Reports",
      "Standard Email Support (24-48 hr TAT)",
      "Standard Platform Commission Applicable",
    ],
    supportedModules: {
      partnerRegistration: true,
      businessProfile: true,
      bookingManagement: "basic",
      availabilityManagement: true,
      offersCoupons: false,
      customerReviews: true,
      revenueDashboard: false,
      advancedReports: false,
      supportLevel: "Standard Email",
      reducedCommission: false,
      multipleBranches: false,
      customerManagementCRM: false,
      analytics: "Basic",
      promotionalTools: false,
      corporateBookingFeatures: false,
      apiIntegrationAccess: false,
      customCommercialTerms: false,
      negotiatedCommission: false,
    },
  },
  {
    id: "plan_standard",
    name: "Standard Plan",
    badge: "Recommended for Independent Stays & Operators",
    tagline: "Accelerate revenue with revenue dashboards, offers & lower commission rates.",
    category: "standard",
    monthlyPrice: 999,
    quarterlyPrice: 2699,
    annualPrice: 9990,
    popular: true,
    color: "from-blue-600 to-indigo-700",
    accentBorder: "border-blue-500",
    listingLimit: 15,
    bookingLimitPerMonth: 300,
    branchesPropertiesLimit: 2,
    settlementCycle: "T+2 Rolling",
    commissionRate: {
      hotels: 14.0,
      resorts: 15.5,
      lodges: 12.5,
      buses: 8.5,
      cabs: 13.5,
      houseboats: 13.0,
      tours: 12.5,
      pilgrimage: 11.5,
      restaurants: 9.0,
      corporate: 7.5,
      flights: 2.8,
      trains: 1.5,
    },
    features: [
      "More Listings (Up to 15 active rooms/vehicles/packages)",
      "Comprehensive Booking & Guest Roster Management",
      "Interactive 30-Day Availability & Blackout Calendar",
      "Custom Offers, Promo Flash Sales & Discount Coupons",
      "Customer Reviews Management with Direct Owner Replies",
      "Live Revenue Dashboard & Net Earnings Tracker",
      "Advanced P&L Reports (Daily, Weekly, Monthly Export)",
      "Priority Support Desk (Under 4 hours TAT)",
      "Reduced Commission Rate across all bookings (~25% lower)",
    ],
    supportedModules: {
      partnerRegistration: true,
      businessProfile: true,
      bookingManagement: "standard",
      availabilityManagement: true,
      offersCoupons: true,
      customerReviews: true,
      revenueDashboard: true,
      advancedReports: true,
      supportLevel: "Priority Desk",
      reducedCommission: true,
      multipleBranches: false,
      customerManagementCRM: true,
      analytics: "Standard",
      promotionalTools: true,
      corporateBookingFeatures: false,
      apiIntegrationAccess: false,
      customCommercialTerms: false,
      negotiatedCommission: false,
    },
  },
  {
    id: "plan_professional",
    name: "Professional Plan",
    badge: "High-Growth Fleets, Chains & Tour Guilds",
    tagline: "Multi-property management, automated channel sync & promotional tools.",
    category: "professional",
    monthlyPrice: 2999,
    quarterlyPrice: 7999,
    annualPrice: 29990,
    color: "from-indigo-600 to-purple-700",
    accentBorder: "border-indigo-500",
    listingLimit: 100,
    bookingLimitPerMonth: 2000,
    branchesPropertiesLimit: 10,
    settlementCycle: "T+1 Daily",
    commissionRate: {
      hotels: 9.5,
      resorts: 11.0,
      lodges: 9.0,
      buses: 6.0,
      cabs: 9.5,
      houseboats: 9.0,
      tours: 8.5,
      pilgrimage: 8.0,
      restaurants: 6.5,
      corporate: 5.0,
      flights: 2.0,
      trains: 1.0,
    },
    features: [
      "High Listing Limits (Up to 100 inventory units)",
      "Advanced Booking Engine with Automated Mutex & Channel Manager",
      "Multiple Branches / Multi-Property Single-Sign-On",
      "Advanced Surge Offers, Weekend Pricing & Rule Automations",
      "Full Customer Management CRM & VIP Repeat Guest Tagging",
      "Real-Time Business Intelligence & Occupancy Yield Analytics",
      "Search Top-Rank Boost & Sponsored Ad Promotional Tools",
      "24x7 Dedicated Priority Phone & WhatsApp Helpline",
      "Lower Tier Commission Rate (~45% savings vs Basic)",
    ],
    supportedModules: {
      partnerRegistration: true,
      businessProfile: true,
      bookingManagement: "advanced",
      availabilityManagement: true,
      offersCoupons: true,
      customerReviews: true,
      revenueDashboard: true,
      advancedReports: true,
      supportLevel: "24x7 Priority Desk",
      reducedCommission: true,
      multipleBranches: true,
      customerManagementCRM: true,
      analytics: "Advanced Real-Time",
      promotionalTools: true,
      corporateBookingFeatures: true,
      apiIntegrationAccess: true,
      customCommercialTerms: false,
      negotiatedCommission: false,
    },
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Plan",
    badge: "Custom Commercial Terms",
    tagline: "Large hotel chains, state transport corporations, airline groups & multi-city brands.",
    category: "enterprise",
    monthlyPrice: 9999,
    quarterlyPrice: 26990,
    annualPrice: 99990,
    color: "from-amber-600 to-rose-700",
    accentBorder: "border-amber-500",
    listingLimit: "Unlimited",
    bookingLimitPerMonth: "Unlimited",
    branchesPropertiesLimit: "Unlimited",
    settlementCycle: "T+0 Instant",
    commissionRate: {
      hotels: 0.0, // Or 0-5% negotiated
      resorts: 0.0,
      lodges: 0.0,
      buses: 0.0,
      cabs: 0.0,
      houseboats: 0.0,
      tours: 0.0,
      pilgrimage: 0.0,
      restaurants: 0.0,
      corporate: 0.0,
      flights: 0.0,
      trains: 0.0,
    },
    features: [
      "Custom / Unlimited Listing Limits across India",
      "Multi-Branch & Enterprise Hierarchy Organization Management",
      "Dedicated Corporate Booking Desk & B2B GST Invoicing Engine",
      "Full API & Webhook Access (PMS, GDS, ERP & Accounting Sync)",
      "Custom BI Data Lake, Cohort Analytics & Predictive Demand ML",
      "Dedicated Key Account Director & SLA Guarantees (15 min response)",
      "Custom Commercial Terms & Negotiated Zero-Commission Structure",
      "Instant T+0 Real-Time Bank Settlement upon Guest Check-in",
    ],
    supportedModules: {
      partnerRegistration: true,
      businessProfile: true,
      bookingManagement: "enterprise",
      availabilityManagement: true,
      offersCoupons: true,
      customerReviews: true,
      revenueDashboard: true,
      advancedReports: true,
      supportLevel: "Dedicated Key Account Manager",
      reducedCommission: true,
      multipleBranches: true,
      customerManagementCRM: true,
      analytics: "Custom Enterprise BI",
      promotionalTools: true,
      corporateBookingFeatures: true,
      apiIntegrationAccess: true,
      customCommercialTerms: true,
      negotiatedCommission: true,
    },
  },
];

// =========================================================================
// 4 COMMERCIAL MODELS (CONFIGURATION-DRIVEN ARCHITECTURE)
// =========================================================================
export interface CommercialModelDefinition {
  id: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
  name: string;
  shortCode: string;
  badge: string;
  description: string;
  typicalUse: string;
  subscriptionStructure: string;
  commissionStructure: string;
  examplePartner: string;
  exampleBreakdown: {
    monthlySubscriptionINR: number;
    commissionPercent: number;
    monthlyGMVINR: number;
    calculatedSubscription: number;
    calculatedCommission: number;
    totalPlatformTake: number;
    partnerRetained: number;
  };
  keyModules: string[];
  supportedVerticals: string[];
}

export const COMMERCIAL_MODELS_CATALOG: CommercialModelDefinition[] = [
  {
    id: "MODEL_A",
    name: "Model A — Subscription + Commission",
    shortCode: "Sub + Comm",
    badge: "Standard Hybrid Model",
    description:
      "Partner pays both a predictable recurring monthly/annual subscription fee and a reduced commission on every confirmed reservation/order.",
    typicalUse: "Standard independent hotels, bus fleet operators, resorts, tour operators, and homestays seeking balanced marketing and platform features.",
    subscriptionStructure: "Fixed Monthly (e.g. ₹999/mo) or Annual (₹9,990/yr)",
    commissionStructure: "Reduced Take Rate (e.g. 8% - 14% depending on category)",
    examplePartner: "Heritage Retreat Hotel (Jaipur) • 24 Rooms",
    exampleBreakdown: {
      monthlySubscriptionINR: 999,
      commissionPercent: 10.0,
      monthlyGMVINR: 450000, // ₹4.5 Lakhs
      calculatedSubscription: 999,
      calculatedCommission: 45000,
      totalPlatformTake: 45999,
      partnerRetained: 404001,
    },
    keyModules: [
      "Partner Registration & Verification",
      "Partner Profile & Extranet",
      "Subscription Plans Catalog",
      "Plan Upgrade/Downgrade Lifecycle",
      "Subscription Billing & Invoicing",
      "Category-wise Booking Commission Rules",
      "Service-wise Commission & Slabs",
      "Promotional / Negotiated Commission",
      "Booking Revenue & Platform Fee Computation",
      "GST / Tax Surcharge Calculation",
      "Partner & Platform Commission Invoices",
      "Payment Gateway Collection",
      "Automated Settlement Management",
      "Refund & Cancellation Adjustments",
      "Renewal, Expiry & Suspension Handlers",
      "Partner Finance & Earnings Dashboard",
      "Admin Commercial Controls & Audit Logs",
    ],
    supportedVerticals: [
      "Hotels", "Resorts", "Lodges", "Buses", "Cabs", "Houseboats", "Tours", "Pilgrimage", "Restaurants", "Corporate Tours", "Other travel services"
    ],
  },
  {
    id: "MODEL_B",
    name: "Model B — Subscription Only",
    shortCode: "Zero Comm",
    badge: "Premium / Enterprise / High Volume",
    description:
      "Designed for strategic, enterprise, or high-volume partners. The partner pays an upfront fixed subscription fee and enjoys zero (0%) or heavily reduced nominal booking commissions.",
    typicalUse: "Enterprise hotel chains (Taj, Marriott, ITC), large state bus corporations (MSRTC, UPSRTC), and national flight consolidators.",
    subscriptionStructure: "Fixed Enterprise Annual Commitment (e.g. ₹50,000 to ₹2,50,000/yr)",
    commissionStructure: "0% Commission (Zero take-rate on booking volume, subject to contract terms)",
    examplePartner: "Oberoi & Trident Chain (India) • 12 Properties",
    exampleBreakdown: {
      monthlySubscriptionINR: 4166, // ₹50,000/yr amortized
      commissionPercent: 0.0,
      monthlyGMVINR: 2500000, // ₹25 Lakhs
      calculatedSubscription: 4166,
      calculatedCommission: 0,
      totalPlatformTake: 4166,
      partnerRetained: 2495834,
    },
    keyModules: [
      "Premium Partner Plans & Quotas",
      "Enterprise Partner Contract Management",
      "Custom Subscription Pricing Override",
      "Zero-Commission Flag Enforcement",
      "Reduced-Commission Rule Engine",
      "Minimum Annual Commitment Tracking",
      "Contract Start/End Date SLA Lifecycle",
      "Subscription Invoices & GST ITC Receipt",
      "Instant Direct Gateway Settlement",
      "Tax / GST Pass-Through Reconciler",
      "Refund & Cancellation Escrow Handling",
      "Partner Key Account Management",
      "Enterprise Multi-Approver Commercial Flow",
      "Finance Ledger Reconciliation",
      "Admin Security Audit Logs",
    ],
    supportedVerticals: [
      "Hotels", "Resorts", "Flights", "Trains", "Buses", "Corporate Travel", "Houseboats", "State Tourism Charters"
    ],
  },
  {
    id: "MODEL_C",
    name: "Model C — Commission Only",
    shortCode: "Zero Subscription",
    badge: "Flexible / Zero Commitment",
    description:
      "Designed for small, seasonal, or individual operators who prefer zero upfront subscription cost and only pay a higher transaction commission upon completed, confirmed bookings.",
    typicalUse: "Individual outstation cab drivers, seasonal houseboat owners, local highway dhabas, freelance tour guides, and weekend pilgrimage facilitators.",
    subscriptionStructure: "₹0 Upfront / Zero Monthly Fee",
    commissionStructure: "Higher Performance Take Rate (e.g. 15% - 22% per completed booking)",
    examplePartner: "Kerala Backwater Kettuvallam Owner • 2 Boats",
    exampleBreakdown: {
      monthlySubscriptionINR: 0,
      commissionPercent: 18.0,
      monthlyGMVINR: 180000, // ₹1.8 Lakhs
      calculatedSubscription: 0,
      calculatedCommission: 32400,
      totalPlatformTake: 32400,
      partnerRetained: 147600,
    },
    keyModules: [
      "Commission-Only Partner Plan",
      "Instant DigiLocker Partner KYC",
      "Dynamic Commission Tier Matrix",
      "Performance Slabs by Monthly Trips",
      "Category-wise Rate Allocation",
      "Automated Commission Deduction on Payout",
      "Net Settlement Calculation Engine",
      "Cancellation Penalty & Refund Adjustment",
      "Automated Bank Account RTGS Payout",
      "GST Invoices for Commission Charged",
      "Finance Ledger Reconciliation",
      "Partner Real-Time Earnings Dashboard",
      "Admin Commission Rate Controls",
      "Commercial Activity Audit Logs",
    ],
    supportedVerticals: [
      "Cabs", "Houseboats", "Dhabas", "Independent Guides", "Homestays", "Pilgrimage Pujaris", "Adventure Treks"
    ],
  },
  {
    id: "MODEL_D",
    name: "Model D — Custom Enterprise",
    shortCode: "Bespoke SLA",
    badge: "Custom Negotiated Terms",
    description:
      "Tailor-made commercial contracts with negotiated subscription rates, tiered commission brackets, custom platform fees, bespoke listing/booking limits, and custom settlement windows.",
    typicalUse: "Major multi-modal transport conglomerates, global airline alliances, IRCTC direct desks, and government tourism boards.",
    subscriptionStructure: "Negotiated Milestone Schedule (Custom Quarterly / Bi-Annual)",
    commissionStructure: "Tiered Slabs (e.g. 5% on first ₹10L, 3% on next ₹50L, 1.5% above ₹1Cr)",
    examplePartner: "India Tourism Development Corp (ITDC) & IRCTC Consortium",
    exampleBreakdown: {
      monthlySubscriptionINR: 25000,
      commissionPercent: 3.5,
      monthlyGMVINR: 15000000, // ₹1.5 Cr
      calculatedSubscription: 25000,
      calculatedCommission: 525000,
      totalPlatformTake: 550000,
      partnerRetained: 14450000,
    },
    keyModules: [
      "Enterprise Custom Agreement Engine",
      "Custom Subscription Schedule",
      "Tiered Volume Commission Slabs",
      "Custom Platform & Booking Fee Overrides",
      "Uncapped Listing & Branch Structures",
      "Custom Settlement Cycle (T+0 or Custom Escrow)",
      "Dedicated Enterprise Gateway Integration",
      "Custom Tax Exemption & SEZ Rules",
      "Consolidated Multi-Entity GST Invoicing",
      "Predictive Revenue Share Auditing",
      "Admin Legal & Commercial Sign-off Workflow",
      "Cryptographic Audit Log Ledger",
    ],
    supportedVerticals: [
      "All 14 Platform Verticals & Government Travel Consortia"
    ],
  },
];

// =========================================================================
// MULTI-SERVICE CATEGORY COMMISSION CONFIGURATION MATRIX
// =========================================================================
export interface ServiceCommissionConfig {
  category: ServiceCategory | "corporate_tours" | "dhabas" | "other_services";
  name: string;
  iconName: string;
  defaultModel: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
  standardTakeRatePercent: number;
  proTakeRatePercent: number;
  fixedConvenienceFeeINR: number;
  settlementCycle: string;
  gstRatePercent: number;
  sacCode: string;
  typicalAOV: number;
}

export const MULTI_SERVICE_COMMISSION_CONFIGS: ServiceCommissionConfig[] = [
  {
    category: "flights",
    name: "Flights (Domestic & International)",
    iconName: "Plane",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 3.0,
    proTakeRatePercent: 2.0,
    fixedConvenienceFeeINR: 249,
    settlementCycle: "Weekly BSP Settlement",
    gstRatePercent: 18,
    sacCode: "996411",
    typicalAOV: 7500,
  },
  {
    category: "trains",
    name: "Trains (IRCTC Authorized Desk)",
    iconName: "Train",
    defaultModel: "MODEL_B",
    standardTakeRatePercent: 1.8,
    proTakeRatePercent: 1.0,
    fixedConvenienceFeeINR: 35,
    settlementCycle: "Daily T+0 Escrow",
    gstRatePercent: 18,
    sacCode: "996412",
    typicalAOV: 1450,
  },
  {
    category: "buses",
    name: "Buses (Volvo, Sleeper & State Fleets)",
    iconName: "Bus",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 10.0,
    proTakeRatePercent: 6.5,
    fixedConvenienceFeeINR: 30,
    settlementCycle: "T+1 Daily Post Departure",
    gstRatePercent: 18,
    sacCode: "996413",
    typicalAOV: 1650,
  },
  {
    category: "hotels",
    name: "Hotels & Homestays",
    iconName: "Building2",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 18.0,
    proTakeRatePercent: 9.5,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "T+1 Post Check-out",
    gstRatePercent: 18,
    sacCode: "996311",
    typicalAOV: 4200,
  },
  {
    category: "lodges",
    name: "Lodges (Eco, Wildlife & Heritage)",
    iconName: "Home",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 16.0,
    proTakeRatePercent: 9.0,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "T+1 Post Check-out",
    gstRatePercent: 18,
    sacCode: "996312",
    typicalAOV: 3800,
  },
  {
    category: "resorts",
    name: "Luxury Resorts & Wellness Retreats",
    iconName: "Palmtree",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 20.0,
    proTakeRatePercent: 11.0,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "T+1 Post Check-out",
    gstRatePercent: 18,
    sacCode: "996313",
    typicalAOV: 14500,
  },
  {
    category: "cabs",
    name: "Cabs & Outstation Car Rentals",
    iconName: "Car",
    defaultModel: "MODEL_C",
    standardTakeRatePercent: 15.0,
    proTakeRatePercent: 9.0,
    fixedConvenienceFeeINR: 25,
    settlementCycle: "T+0 Daily on Drop-off",
    gstRatePercent: 18,
    sacCode: "996414",
    typicalAOV: 2800,
  },
  {
    category: "houseboats",
    name: "Houseboats (Kerala Kettuvallam & Dal Lake)",
    iconName: "Ship",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 16.0,
    proTakeRatePercent: 9.5,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "T+1 Post Checkout",
    gstRatePercent: 18,
    sacCode: "996415",
    typicalAOV: 11200,
  },
  {
    category: "tours",
    name: "Holiday Tours & Guided Packages",
    iconName: "Map",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 15.0,
    proTakeRatePercent: 8.5,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "Milestone: 50% Advance / 50% Departure",
    gstRatePercent: 18,
    sacCode: "998553",
    typicalAOV: 24000,
  },
  {
    category: "pilgrimage",
    name: "Pilgrimage / Yatra Packages & Darshan",
    iconName: "Landmark",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 14.0,
    proTakeRatePercent: 8.0,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "Milestone: 50% Booking / 50% Yatra Start",
    gstRatePercent: 18,
    sacCode: "998554",
    typicalAOV: 18500,
  },
  {
    category: "corporate_tours",
    name: "Corporate Tours & MICE Events",
    iconName: "Briefcase",
    defaultModel: "MODEL_B",
    standardTakeRatePercent: 8.0,
    proTakeRatePercent: 4.5,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "15-Day Corporate Billing Cycle",
    gstRatePercent: 18,
    sacCode: "998555",
    typicalAOV: 85000,
  },
  {
    category: "dhabas",
    name: "Restaurants & Highway Dhabas",
    iconName: "UtensilsCrossed",
    defaultModel: "MODEL_C",
    standardTakeRatePercent: 12.0,
    proTakeRatePercent: 6.5,
    fixedConvenienceFeeINR: 15,
    settlementCycle: "Daily T+0 Escrow",
    gstRatePercent: 18,
    sacCode: "996331",
    typicalAOV: 650,
  },
  {
    category: "other_services",
    name: "Other Travel Services (Insurance, Forex, Lounges)",
    iconName: "Sparkles",
    defaultModel: "MODEL_A",
    standardTakeRatePercent: 25.0,
    proTakeRatePercent: 18.0,
    fixedConvenienceFeeINR: 0,
    settlementCycle: "Monthly CPA Reconciliation",
    gstRatePercent: 18,
    sacCode: "997132",
    typicalAOV: 950,
  },
];

// =========================================================================
// MOCK ACTIVE PARTNER SUBSCRIPTION PROFILE STATE
// =========================================================================
export interface ActivePartnerSubscriptionState {
  partnerId: string;
  partnerName: string;
  businessType: string;
  category: ServiceCategory;
  gstin: string;
  currentPlanId: string;
  currentPlanName: string;
  billingCycle: "monthly" | "quarterly" | "annual";
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
  status: "active" | "trial" | "past_due" | "cancelled" | "suspended";
  autoRenew: boolean;
  activeCommercialModel: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
  
  // Usage & Limits
  listingsUsed: number;
  listingLimit: number | "Unlimited";
  bookingsUsedThisMonth: number;
  bookingLimitPerMonth: number | "Unlimited";
  branchesUsed: number;
  branchesLimit: number | "Unlimited";
  
  // Financial Performance
  totalBookingsMonth: number;
  grossBookingValueMonth: number;
  platformCommissionMonth: number;
  partnerEarningsMonth: number;
  taxesCollectedMonth: number;
  netPayableBalance: number;
  pendingSettlementINR: number;
  paidSettlementINR: number;
  nextSettlementDate: string;
  
  // Payment History
  paymentHistory: {
    id: string;
    date: string;
    invoiceNumber: string;
    description: string;
    amountINR: number;
    gstAmountINR: number;
    totalPaidINR: number;
    paymentMethod: string;
    status: "paid" | "pending" | "failed";
    receiptUrl?: string;
  }[];
  
  // Upgrade / Downgrade History
  planHistory: {
    id: string;
    date: string;
    fromPlan: string;
    toPlan: string;
    billingCycle: string;
    action: "upgrade" | "downgrade" | "renewal" | "initial";
    chargedAmountINR: number;
  }[];
  
  // Recent Booking-Wise Commission Records
  bookingCommissions: {
    id: string;
    bookingId: string;
    guestName: string;
    serviceTitle: string;
    serviceCategory: string;
    bookingDate: string;
    grossAmount: number;
    commissionRatePercent: number;
    commissionAmount: number;
    gstOnCommission: number;
    netPartnerShare: number;
    settlementStatus: "settled" | "pending_escrow" | "refund_adjusted";
  }[];
}

export const INITIAL_PARTNER_SUBSCRIPTION_STATE: ActivePartnerSubscriptionState = {
  partnerId: "PTR-HOTEL-8842",
  partnerName: "Royal Heritage Haveli & Suites",
  businessType: "Boutique Heritage Hotel",
  category: "hotels",
  gstin: "08AABCR4410R1ZP",
  currentPlanId: "plan_standard",
  currentPlanName: "Standard Plan",
  billingCycle: "monthly",
  subscriptionStartDate: "2026-08-01",
  subscriptionExpiryDate: "2026-08-31",
  status: "active",
  autoRenew: true,
  activeCommercialModel: "MODEL_A",
  
  listingsUsed: 12,
  listingLimit: 15,
  bookingsUsedThisMonth: 142,
  bookingLimitPerMonth: 300,
  branchesUsed: 1,
  branchesLimit: 2,
  
  totalBookingsMonth: 142,
  grossBookingValueMonth: 596400, // ₹5,96,400 GMV
  platformCommissionMonth: 83496, // 14% commission
  partnerEarningsMonth: 512904, // Partner Net
  taxesCollectedMonth: 64411, // 12% hotel GST collected
  netPayableBalance: 42800,
  pendingSettlementINR: 42800,
  paidSettlementINR: 470104,
  nextSettlementDate: "2026-08-26",
  
  paymentHistory: [
    {
      id: "SUB-INV-2026-08",
      date: "01 Aug 2026",
      invoiceNumber: "INV-SUB-8842-AUG26",
      description: "Standard Plan — Monthly SaaS Subscription (01 Aug - 31 Aug 2026)",
      amountINR: 999,
      gstAmountINR: 180, // 18% GST
      totalPaidINR: 1179,
      paymentMethod: "Razorpay Auto-Debit (HDFC Current A/C ••9481)",
      status: "paid",
    },
    {
      id: "SUB-INV-2026-07",
      date: "01 Jul 2026",
      invoiceNumber: "INV-SUB-8842-JUL26",
      description: "Standard Plan — Monthly SaaS Subscription (01 Jul - 31 Jul 2026)",
      amountINR: 999,
      gstAmountINR: 180,
      totalPaidINR: 1179,
      paymentMethod: "Razorpay UPI AutoPay (royalheritage@hdfcbank)",
      status: "paid",
    },
    {
      id: "SUB-INV-2026-06",
      date: "01 Jun 2026",
      invoiceNumber: "INV-SUB-8842-JUN26",
      description: "Free / Basic Plan to Standard Plan Upgrade",
      amountINR: 999,
      gstAmountINR: 180,
      totalPaidINR: 1179,
      paymentMethod: "Razorpay NetBanking",
      status: "paid",
    },
  ],
  
  planHistory: [
    {
      id: "PLN-HIST-001",
      date: "01 Jun 2026",
      fromPlan: "Free / Basic Plan",
      toPlan: "Standard Plan",
      billingCycle: "Monthly (₹999/mo)",
      action: "upgrade",
      chargedAmountINR: 1179,
    },
    {
      id: "PLN-HIST-002",
      date: "01 Jul 2026",
      fromPlan: "Standard Plan",
      toPlan: "Standard Plan",
      billingCycle: "Monthly Renewal",
      action: "renewal",
      chargedAmountINR: 1179,
    },
    {
      id: "PLN-HIST-003",
      date: "01 Aug 2026",
      fromPlan: "Standard Plan",
      toPlan: "Standard Plan",
      billingCycle: "Monthly Renewal",
      action: "renewal",
      chargedAmountINR: 1179,
    },
  ],
  
  bookingCommissions: [
    {
      id: "BCOMM-1092",
      bookingId: "BY-HTL-94812",
      guestName: "Vikram Malhotra",
      serviceTitle: "Royal Heritage Suite (CP Meal Plan)",
      serviceCategory: "Hotels",
      bookingDate: "24 Aug 2026",
      grossAmount: 9400,
      commissionRatePercent: 14.0,
      commissionAmount: 1316,
      gstOnCommission: 237,
      netPartnerShare: 7847,
      settlementStatus: "pending_escrow",
    },
    {
      id: "BCOMM-1091",
      bookingId: "BY-HTL-94808",
      guestName: "Ananya Sharma",
      serviceTitle: "Deluxe Courtyard View Room",
      serviceCategory: "Hotels",
      bookingDate: "23 Aug 2026",
      grossAmount: 5200,
      commissionRatePercent: 14.0,
      commissionAmount: 728,
      gstOnCommission: 131,
      netPartnerShare: 4341,
      settlementStatus: "settled",
    },
    {
      id: "BCOMM-1090",
      bookingId: "BY-HTL-94799",
      guestName: "Rajesh Kulkarni",
      serviceTitle: "Presidential Haveli Suite (2 Nights)",
      serviceCategory: "Hotels",
      bookingDate: "22 Aug 2026",
      grossAmount: 18800,
      commissionRatePercent: 14.0,
      commissionAmount: 2632,
      gstOnCommission: 474,
      netPartnerShare: 15694,
      settlementStatus: "settled",
    },
    {
      id: "BCOMM-1089",
      bookingId: "BY-HTL-94784",
      guestName: "Sunita Deshmukh",
      serviceTitle: "Heritage Deluxe Room",
      serviceCategory: "Hotels",
      bookingDate: "21 Aug 2026",
      grossAmount: 4800,
      commissionRatePercent: 14.0,
      commissionAmount: 672,
      gstOnCommission: 121,
      netPartnerShare: 4007,
      settlementStatus: "settled",
    },
    {
      id: "BCOMM-1088",
      bookingId: "BY-HTL-94760",
      guestName: "Amitabh Verma",
      serviceTitle: "Royal Suite with Private Terrace",
      serviceCategory: "Hotels",
      bookingDate: "20 Aug 2026",
      grossAmount: 12500,
      commissionRatePercent: 14.0,
      commissionAmount: 1750,
      gstOnCommission: 315,
      netPartnerShare: 10435,
      settlementStatus: "settled",
    },
  ],
};

// =========================================================================
// CORE BACKEND SCHEMA DEFINITIONS (NEVER EXPOSED CREDENTIALS)
// =========================================================================
export interface BackendTableSchemaSpec {
  tableName: string;
  category: "commercial_plans" | "subscriptions" | "commissions" | "settlements" | "governance";
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    isEncrypted?: boolean;
    description: string;
  }[];
}

export const BACKEND_DATABASE_SCHEMAS: BackendTableSchemaSpec[] = [
  {
    tableName: "partner_commercial_plans",
    category: "commercial_plans",
    description: "Catalog of subscription tiers, base take-rates, listing limits, and feature flags.",
    columns: [
      { name: "plan_id", type: "VARCHAR(64)", isPrimary: true, description: "Unique plan tier identifier" },
      { name: "plan_name", type: "VARCHAR(128)", description: "Display name (e.g. Standard Plan)" },
      { name: "category", type: "VARCHAR(32)", description: "basic | standard | professional | enterprise" },
      { name: "monthly_price_inr", type: "DECIMAL(10,2)", description: "Monthly recurring price before tax" },
      { name: "annual_price_inr", type: "DECIMAL(10,2)", description: "Annual price with discount" },
      { name: "listing_limit", type: "INT", description: "Max active listing inventory (-1 for unlimited)" },
      { name: "booking_limit_per_mo", type: "INT", description: "Max bookings processed per cycle" },
      { name: "default_commission_rate", type: "DECIMAL(5,2)", description: "Base category commission percentage" },
      { name: "is_active", type: "BOOLEAN", description: "Whether plan is open for new subscriptions" },
    ],
  },
  {
    tableName: "partner_contracts",
    category: "commercial_plans",
    description: "Legal and commercial contracts establishing Model A, B, C, or D terms.",
    columns: [
      { name: "contract_id", type: "VARCHAR(64)", isPrimary: true, description: "Legal contract UUID" },
      { name: "partner_id", type: "VARCHAR(64)", isForeign: true, description: "References partner entity" },
      { name: "model_type", type: "VARCHAR(16)", description: "MODEL_A | MODEL_B | MODEL_C | MODEL_D" },
      { name: "negotiated_sub_fee", type: "DECIMAL(10,2)", description: "Contracted subscription amount" },
      { name: "commission_override_pct", type: "DECIMAL(5,2)", description: "Contracted custom take-rate" },
      { name: "zero_commission_flag", type: "BOOLEAN", description: "True if partner operates under 0% commission" },
      { name: "start_date", type: "TIMESTAMP WITH TIME ZONE", description: "Agreement effective start" },
      { name: "end_date", type: "TIMESTAMP WITH TIME ZONE", description: "Agreement expiration timestamp" },
      { name: "approver_admin_id", type: "VARCHAR(64)", description: "Super admin sign-off authority" },
    ],
  },
  {
    tableName: "subscriptions",
    category: "subscriptions",
    description: "Active partner subscription instances, lifecycle states, and renewal tokens.",
    columns: [
      { name: "subscription_id", type: "VARCHAR(64)", isPrimary: true, description: "Subscription UUID" },
      { name: "partner_id", type: "VARCHAR(64)", isForeign: true, description: "Owner partner account" },
      { name: "plan_id", type: "VARCHAR(64)", isForeign: true, description: "Subscribed plan tier" },
      { name: "status", type: "VARCHAR(32)", description: "active | trial | past_due | cancelled | suspended" },
      { name: "billing_cycle", type: "VARCHAR(16)", description: "monthly | quarterly | annual" },
      { name: "current_period_start", type: "TIMESTAMP WITH TIME ZONE", description: "Billing cycle anchor" },
      { name: "current_period_end", type: "TIMESTAMP WITH TIME ZONE", description: "Next renewal invoice date" },
      { name: "auto_renew", type: "BOOLEAN", description: "Recurring mandate flag" },
      { name: "gateway_mandate_token", type: "VARCHAR(256)", isEncrypted: true, description: "Encrypted Razorpay/e-NACH token" },
    ],
  },
  {
    tableName: "subscription_invoices",
    category: "subscriptions",
    description: "GST-compliant tax invoices for monthly/annual recurring subscription fees.",
    columns: [
      { name: "invoice_id", type: "VARCHAR(64)", isPrimary: true, description: "Invoice unique reference" },
      { name: "subscription_id", type: "VARCHAR(64)", isForeign: true, description: "Subscription mapping" },
      { name: "partner_id", type: "VARCHAR(64)", isForeign: true, description: "Billed partner" },
      { name: "subtotal_inr", type: "DECIMAL(10,2)", description: "Base subscription charge" },
      { name: "cgst_inr", type: "DECIMAL(10,2)", description: "9% Central GST" },
      { name: "sgst_inr", type: "DECIMAL(10,2)", description: "9% State GST" },
      { name: "total_inr", type: "DECIMAL(10,2)", description: "Total collected amount" },
      { name: "payment_status", type: "VARCHAR(32)", description: "paid | failed | refunded" },
      { name: "irn_number", type: "VARCHAR(128)", description: "Govt GST e-Invoice IRN Hash" },
    ],
  },
  {
    tableName: "commission_rules",
    category: "commissions",
    description: "Configuration-driven commission rule matrix across services, plans, and regions.",
    columns: [
      { name: "rule_id", type: "VARCHAR(64)", isPrimary: true, description: "Rule UUID" },
      { name: "service_category", type: "VARCHAR(32)", description: "hotels | buses | flights | cabs etc" },
      { name: "plan_id", type: "VARCHAR(64)", description: "Associated subscription plan" },
      { name: "calculation_type", type: "VARCHAR(32)", description: "PERCENTAGE | FIXED | TIERED_SLAB | HYBRID" },
      { name: "percentage_rate", type: "DECIMAL(5,2)", description: "Take-rate percentage" },
      { name: "fixed_fee_inr", type: "DECIMAL(10,2)", description: "Fixed booking facilitation charge" },
      { name: "min_commission_cap", type: "DECIMAL(10,2)", description: "Floor commission threshold" },
      { name: "max_commission_cap", type: "DECIMAL(10,2)", description: "Ceiling take-rate limit" },
      { name: "effective_from", type: "TIMESTAMP WITH TIME ZONE", description: "Rule activation date" },
    ],
  },
  {
    tableName: "booking_commissions",
    category: "commissions",
    description: "Immutable ledger of commission deducted per confirmed booking transaction.",
    columns: [
      { name: "commission_entry_id", type: "VARCHAR(64)", isPrimary: true, description: "Entry UUID" },
      { name: "booking_id", type: "VARCHAR(64)", isForeign: true, description: "Unique booking reference" },
      { name: "partner_id", type: "VARCHAR(64)", isForeign: true, description: "Partner entity receiving payout" },
      { name: "gross_booking_value", type: "DECIMAL(10,2)", description: "Total passenger paid fare" },
      { name: "commission_applied_pct", type: "DECIMAL(5,2)", description: "Actual take-rate calculated" },
      { name: "commission_amount_inr", type: "DECIMAL(10,2)", description: "Platform share before tax" },
      { name: "commission_gst_inr", type: "DECIMAL(10,2)", description: "18% GST on platform fee" },
      { name: "net_partner_amount_inr", type: "DECIMAL(10,2)", description: "Payable to partner escrow" },
      { name: "settlement_batch_id", type: "VARCHAR(64)", isForeign: true, description: "Settlement grouping" },
    ],
  },
  {
    tableName: "settlements",
    category: "settlements",
    description: "Bank transfer payout batches executed via RTGS / IMPS / Escrow accounts.",
    columns: [
      { name: "settlement_id", type: "VARCHAR(64)", isPrimary: true, description: "Settlement Batch UUID" },
      { name: "partner_id", type: "VARCHAR(64)", isForeign: true, description: "Beneficiary partner" },
      { name: "gross_payout_inr", type: "DECIMAL(12,2)", description: "Sum of net partner shares" },
      { name: "tax_deducted_tds_inr", type: "DECIMAL(10,2)", description: "1% Section 194O TDS" },
      { name: "net_bank_transfer_inr", type: "DECIMAL(12,2)", description: "Actual amount credited to bank" },
      { name: "bank_rrn_reference", type: "VARCHAR(128)", isEncrypted: true, description: "RBI Bank UTR / RRN Code" },
      { name: "settlement_status", type: "VARCHAR(32)", description: "PROCESSING | PROCESSED | FAILED" },
      { name: "executed_at", type: "TIMESTAMP WITH TIME ZONE", description: "Bank credit timestamp" },
    ],
  },
  {
    tableName: "commercial_audit_logs",
    category: "governance",
    description: "Cryptographically linked immutable audit trail of plan upgrades, overrides, and fee changes.",
    columns: [
      { name: "log_id", type: "VARCHAR(64)", isPrimary: true, description: "Audit sequence UUID" },
      { name: "actor_id", type: "VARCHAR(64)", description: "Admin / Partner / System Engine" },
      { name: "action_type", type: "VARCHAR(64)", description: "PLAN_UPGRADE | OVERRIDE_COMMISSION | SETTLEMENT_PAYOUT" },
      { name: "old_payload_json", type: "TEXT", description: "Previous state" },
      { name: "new_payload_json", type: "TEXT", description: "Updated state" },
      { name: "ip_address", type: "VARCHAR(45)", isEncrypted: true, description: "Origin IP" },
      { name: "created_at", type: "TIMESTAMP WITH TIME ZONE", description: "Timestamp" },
      { name: "hash_sha256", type: "VARCHAR(64)", description: "Cryptographic tamper-evident hash" },
    ],
  },
];
