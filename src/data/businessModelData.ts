import {
  RevenueStreamMeta,
  BookingCommissionRate,
  ConvenienceFeeItem,
  AdvertisingSlot,
  PremiumSubscriptionPlan,
  AffiliateProduct,
  CorporatePlanTier,
  PromoCampaignItem,
} from "../types";

// =========================================================================
// 9 REVENUE STREAMS METADATA & FINANCIAL MIX
// =========================================================================
export const REVENUE_STREAMS_META: RevenueStreamMeta[] = [
  {
    id: "booking_commissions",
    name: "Direct Booking Commissions",
    shortName: "Booking Commissions",
    category: "Core Marketplace Take Rate",
    icon: "Ticket",
    color: "from-blue-500 to-indigo-600",
    badge: "38.5% of Revenue",
    description:
      "Take-rate commissions charged per confirmed reservation on Flights (2.5%), Trains (IRCTC agent quota fee), Buses (10%), Hotels & Resorts (18-22%), Cabs (15%), and Yatras (14%).",
    contributionPercent: 38.5,
    projectedAnnualRevenue: 186700000, // ₹18.67 Cr
    keyDrivers: [
      "Gross Marketplace Volume (GMV) expansion",
      "Direct inventory contracting with hoteliers & bus operators",
      "Dynamic take-rate optimization during peak festive seasons",
    ],
    takeRateFormula: "GMV × Category Commission Rate %",
  },
  {
    id: "partner_commissions",
    name: "B2B Partner & Vendor Commissions",
    shortName: "Partner Commissions",
    category: "B2B Supply Ecosystem",
    icon: "Building2",
    color: "from-emerald-500 to-teal-600",
    badge: "16.2% of Revenue",
    description:
      "Tiered supplier volume commissions from registered hospitality partners, transport operators, and pilgrimage guilds based on monthly quota fulfillment.",
    contributionPercent: 16.2,
    projectedAnnualRevenue: 78500000, // ₹7.85 Cr
    keyDrivers: [
      "Partner onboarding across Tier 2 / Tier 3 destinations",
      "Volume tier escalations (Silver 8% → Titanium 14%)",
      "Exclusive channel inventory allocation bonuses",
    ],
    takeRateFormula: "Partner Net Realized GMV × Tier Rate %",
  },
  {
    id: "service_convenience_fees",
    name: "Service & Convenience Fees",
    shortName: "Convenience Fees",
    category: "Transactional Add-ons",
    icon: "CreditCard",
    color: "from-purple-500 to-violet-600",
    badge: "14.8% of Revenue",
    description:
      "Fixed convenience charges for IRCTC e-ticketing (₹15 non-AC / ₹30 AC), payment gateway pass-through fees (1.2%), instant Tatkal engine fee (₹49), and zero-cancellation protection (₹199-₹499).",
    contributionPercent: 14.8,
    projectedAnnualRevenue: 71800000, // ₹7.18 Cr
    keyDrivers: [
      "High-frequency train & bus passenger volume",
      "High attachment rate on Free Cancellation Protection (26%)",
      "Express Tatkal fast-checkout automation upsell",
    ],
    takeRateFormula: "Fixed Transaction Fee + (1.2% PG Pass-through)",
  },
  {
    id: "agent_commissions_markups",
    name: "Agent Commissions & Custom Markups",
    shortName: "Agent Markups",
    category: "B2B Travel Agent Network",
    icon: "Briefcase",
    color: "from-amber-500 to-orange-600",
    badge: "9.4% of Revenue",
    description:
      "Software fee on B2B Travel Agent portal, white-label client receipt generator, custom markup engine margin splits, and sub-agent network licensing.",
    contributionPercent: 9.4,
    projectedAnnualRevenue: 45600000, // ₹4.56 Cr
    keyDrivers: [
      "22,000+ registered offline travel agents across India",
      "Agent wallet float balance earning short-term treasury yield",
      "Wholesale group booking markup overrides",
    ],
    takeRateFormula: "Agent Gross Markups × Platform Share (15%) + API Fee",
  },
  {
    id: "advertising",
    name: "Advertising & Sponsored Placements",
    shortName: "Advertising",
    category: "Media & Ad Marketplace",
    icon: "Megaphone",
    color: "from-pink-500 to-rose-600",
    badge: "7.1% of Revenue",
    description:
      "High-margin search top-ranking sponsored ads (CPC ₹12-₹25), homepage master banner takeovers, destination spotlight native features, and co-branded post-booking email ads.",
    contributionPercent: 7.1,
    projectedAnnualRevenue: 34400000, // ₹3.44 Cr
    keyDrivers: [
      "Targeted intent-based search placement (High 4.8% CTR)",
      "State Tourism Board destination campaigns (MP Tourism, Kerala, Goa)",
      "Premium hotel & airline sponsored visibility bids",
    ],
    takeRateFormula: "Paid Impressions (CPM) + Search Bids (CPC)",
  },
  {
    id: "premium_partner_subscriptions",
    name: "Premium Partner SaaS Subscriptions",
    shortName: "Partner Subscriptions",
    category: "Recurring SaaS Revenue",
    icon: "Gem",
    color: "from-cyan-500 to-blue-600",
    badge: "5.3% of Revenue",
    description:
      "Monthly and annual recurring SaaS subscription plans for hotels, tour operators, and bus fleets providing 0% commission quotas, multi-channel channel managers, and priority search placement.",
    contributionPercent: 5.3,
    projectedAnnualRevenue: 25700000, // ₹2.57 Cr
    keyDrivers: [
      "Pro Partner (₹2,999/mo) and Enterprise (₹9,999/mo) plan adoption",
      "94% net retention rate due to zero-commission quota savings",
      "Automated channel manager & dynamic pricing engine bundle",
    ],
    takeRateFormula: "Active Subscribed Merchants × Monthly MRR",
  },
  {
    id: "corporate_travel_services",
    name: "Corporate Travel & Expense Management",
    shortName: "Corporate Travel",
    category: "Enterprise B2B Solutions",
    icon: "Landmark",
    color: "from-indigo-600 to-slate-800",
    badge: "4.2% of Revenue",
    description:
      "Corporate desk with automated 18% GST credit reconciliation, employee travel policy violation control, per-seat SaaS fee (₹199/user), and 30-day corporate credit financing (1.5% fee).",
    contributionPercent: 4.2,
    projectedAnnualRevenue: 20400000, // ₹2.04 Cr
    keyDrivers: [
      "Mid-market Indian enterprises needing instant GST-compliant billing",
      "Corporate credit line financing margin (18% annualized APR)",
      "Bulk corporate hotel & flight negotiated desk margins",
    ],
    takeRateFormula: "Corporate GMV × 2.8% Desk Fee + Per Seat Subscription",
  },
  {
    id: "affiliate_partnerships",
    name: "Affiliate & Ancillary Travel Partnerships",
    shortName: "Affiliate Partnerships",
    category: "High-Margin Ancillaries",
    icon: "Share2",
    color: "from-emerald-600 to-green-700",
    badge: "2.8% of Revenue",
    description:
      "High-conversion affiliate commissions from travel insurance policies (35% rev-share), international Forex travel cards (₹500 CPA), airport lounge access passes (₹250/visit), and fast-track Visa concierge.",
    contributionPercent: 2.8,
    projectedAnnualRevenue: 13600000, // ₹1.36 Cr
    keyDrivers: [
      "Pre-ticked high-affinity travel insurance add-on during checkout",
      "International flight Forex card conversion with Niyo/BookMyForex",
      "Airport lounge pass pre-booking partnerships with DreamFolks",
    ],
    takeRateFormula: "Affiliate Units Sold × CPA / Rev-share %",
  },
  {
    id: "promotional_campaigns",
    name: "Co-Branded Promotional Campaigns",
    shortName: "Promotional Campaigns",
    category: "Bank & Merchant Co-Funding",
    icon: "Gift",
    color: "from-red-500 to-amber-600",
    badge: "1.7% of Revenue",
    description:
      "Sponsorship fees and customer acquisition subsidies co-funded by leading banking partners (HDFC, ICICI, SBI, Axis) and state tourism boards for festive mega sales.",
    contributionPercent: 1.7,
    projectedAnnualRevenue: 8200000, // ₹82 Lakhs
    keyDrivers: [
      "Bank payment gateway exclusivity deals",
      "Seasonal Mega Yatra flash sales (Diwali, Chhath, Navratri)",
      "Co-funded customer discount absorption (Banks fund 75% of discount)",
    ],
    takeRateFormula: "Campaign Sponsorship Retainers + Bank Co-funding Subsidy",
  },
];

// =========================================================================
// 1. DIRECT BOOKING COMMISSIONS MATRIX
// =========================================================================
export const BOOKING_COMMISSION_RATES: BookingCommissionRate[] = [
  {
    serviceCategory: "flights",
    serviceName: "Domestic & International Flights",
    baseCommissionPercent: 3.2,
    averageOrderValue: 7400,
    netRevenuePerBooking: 236.8,
    supplierType: "Airlines Direct (IndiGo, Air India, Akasa) + Amadeus GDS",
    paymentCycle: "Weekly BSP Settlement",
    notes: "Base take rate + ₹150 GDS segment incentive + ancillary seat/meal commission.",
  },
  {
    serviceCategory: "trains",
    serviceName: "IRCTC Authorized Train Ticketing",
    baseCommissionPercent: 1.8,
    averageOrderValue: 1450,
    netRevenuePerBooking: 45.0,
    supplierType: "IRCTC Principal Service Provider Direct API",
    paymentCycle: "Daily T+0 Rolling Escrow",
    notes: "Authorized ₹15 SL / ₹30 AC agent fee + PG markup + Tatkal automation fee.",
  },
  {
    serviceCategory: "hotels",
    serviceName: "Hotels, Homestays & Lodges",
    baseCommissionPercent: 19.5,
    averageOrderValue: 4200,
    netRevenuePerBooking: 819.0,
    supplierType: "Direct Extranet Contracted + Hotel Chains",
    paymentCycle: "T+1 Post Check-out Settlement",
    notes: "Merchant model with full room rate control; 22% on luxury tier properties.",
  },
  {
    serviceCategory: "resorts",
    serviceName: "Luxury Resorts & Wellness Retreats",
    baseCommissionPercent: 21.0,
    averageOrderValue: 12800,
    netRevenuePerBooking: 2688.0,
    supplierType: "Contracted Exclusive Properties & Heritage Palaces",
    paymentCycle: "T+2 Post Checkout",
    notes: "High basket size with inclusion of spa, safari, and culinary packages.",
  },
  {
    serviceCategory: "buses",
    serviceName: "Intercity Bus Fleets (Volvo/Sleeper)",
    baseCommissionPercent: 11.0,
    averageOrderValue: 1650,
    netRevenuePerBooking: 181.5,
    supplierType: "Private Fleet Operators + State Roadways (MSRTC, UPSRTC, KSRTC)",
    paymentCycle: "T+1 Trip Departure",
    notes: "Standard 10-12% commission on dynamic bus fares.",
  },
  {
    serviceCategory: "pilgrimage",
    serviceName: "Yatra Packages & Helipad Charters",
    baseCommissionPercent: 15.5,
    averageOrderValue: 18500,
    netRevenuePerBooking: 2867.5,
    supplierType: "Shrine Board Affiliates, Charter Operators, Ashrams",
    paymentCycle: "Milestone based (50% Advance / 50% on Arrival)",
    notes: "Includes VIP darshan pass fees, local pandit guide, and helicopter transfer markup.",
  },
  {
    serviceCategory: "tours",
    serviceName: "Guided Holiday & Weekend Packages",
    baseCommissionPercent: 16.0,
    averageOrderValue: 24000,
    netRevenuePerBooking: 3840.0,
    supplierType: "Local Destination Management Companies (DMCs)",
    paymentCycle: "7 Days Pre-departure",
    notes: "Full packaged tour margins with custom sightseeing and transport.",
  },
  {
    serviceCategory: "cabs",
    serviceName: "Intercity & Airport Cab Transfers",
    baseCommissionPercent: 14.5,
    averageOrderValue: 3100,
    netRevenuePerBooking: 449.5,
    supplierType: "Contracted Fleet Owners & Chauffeur Networks",
    paymentCycle: "Instant Trip Completion Payout",
    notes: "Toll pass-through + platform dispatch fee.",
  },
  {
    serviceCategory: "dining",
    serviceName: "Highway Dhaba & Temple Bhojanalaya",
    baseCommissionPercent: 12.0,
    averageOrderValue: 850,
    netRevenuePerBooking: 102.0,
    supplierType: "Verified Highway Food Courts & Traditional Restaurants",
    paymentCycle: "Daily UPI Settlement",
    notes: "Pre-paid dining coupons + ₹30 confirmed table cover reservation fee.",
  },
];

// =========================================================================
// 2. SERVICE & CONVENIENCE FEES REVENUE
// =========================================================================
export const CONVENIENCE_FEES_DATA: ConvenienceFeeItem[] = [
  {
    id: "CF-IRCTC-AC",
    feeName: "IRCTC Authorized E-Ticket Service Charge (AC Classes)",
    serviceType: "Trains (1A, 2A, 3A, CC, EC, Vande Bharat)",
    feeType: "fixed",
    rate: 30.0,
    gstApplicable: 18,
    description: "Official IRCTC authorized electronic booking fee per PNR.",
    annualVolumeEst: 1250000,
  },
  {
    id: "CF-IRCTC-SL",
    feeName: "IRCTC Authorized E-Ticket Service Charge (Non-AC Classes)",
    serviceType: "Trains (Sleeper, 2S)",
    feeType: "fixed",
    rate: 15.0,
    gstApplicable: 18,
    description: "Budget passenger railway electronic processing fee.",
    annualVolumeEst: 2100000,
  },
  {
    id: "CF-AIR-TECH",
    feeName: "Flight GDS & PSS Convenience Fee",
    serviceType: "Flights (Domestic / International)",
    feeType: "fixed",
    rate: 349.0,
    gstApplicable: 18,
    description: "Secure automated check-in, real-time gate SMS, and PSS cloud sync.",
    annualVolumeEst: 850000,
  },
  {
    id: "CF-ZERO-CANCEL",
    feeName: "Zero-Cancellation Refund Protection Add-on",
    serviceType: "All Services (Flights, Hotels, Buses)",
    feeType: "percentage",
    rate: 8.5,
    gstApplicable: 18,
    description: "100% full instant refund on cancellations up to 6 hours before departure.",
    annualVolumeEst: 420000,
  },
  {
    id: "CF-TATKAL-EXP",
    feeName: "Express Tatkal Automation & Autofill Fee",
    serviceType: "Trains (Tatkal Window 10:00 AM / 11:00 AM)",
    feeType: "fixed",
    rate: 49.0,
    gstApplicable: 18,
    description: "Sub-millisecond captcha solver and instant high-speed gateway checkout.",
    annualVolumeEst: 680000,
  },
  {
    id: "CF-BUS-SERVICE",
    feeName: "Bus Live GPS Tracking & Driver Connect Fee",
    serviceType: "Buses (Private & State Roadways)",
    feeType: "fixed",
    rate: 25.0,
    gstApplicable: 18,
    description: "Live vehicle GPS tracker link and 24x7 roadside helpline coverage.",
    annualVolumeEst: 1400000,
  },
];

// =========================================================================
// 3. ADVERTISING & SPONSORED SLOTS
// =========================================================================
export const ADVERTISING_SLOTS_DATA: AdvertisingSlot[] = [
  {
    id: "AD-SEARCH-TOP",
    title: "Sponsored Top Rank Placement (Search Results)",
    placement: "search_top_rank",
    pricingModel: "CPC",
    priceINR: 18, // ₹18 per click
    impressionsOrClicks: "1,200,000 monthly clicks",
    activeAdvertisers: 340,
    ctr: "4.82%",
  },
  {
    id: "AD-HOME-HERO",
    title: "Homepage Hero Banner Takeover (Desktop + Mobile App)",
    placement: "homepage_hero_banner",
    pricingModel: "CPM",
    priceINR: 420, // ₹420 per 1,000 views
    impressionsOrClicks: "4,500,000 monthly views",
    activeAdvertisers: 28,
    ctr: "2.95%",
  },
  {
    id: "AD-DEST-SPOTLIGHT",
    title: "State Tourism Board Destination Spotlight Feature",
    placement: "category_spotlight",
    pricingModel: "Flat_Weekly",
    priceINR: 75000, // ₹75,000 per week
    impressionsOrClicks: "Featured Native Story",
    activeAdvertisers: 14,
    ctr: "6.10%",
  },
  {
    id: "AD-TICKET-VOUCHER",
    title: "E-Ticket & WhatsApp PDF Confirmation Banner Ad",
    placement: "ticket_confirmation_ad",
    pricingModel: "CPM",
    priceINR: 280, // ₹280 per 1,000 downloads
    impressionsOrClicks: "2,800,000 vouchers/mo",
    activeAdvertisers: 45,
    ctr: "3.40%",
  },
];

// =========================================================================
// 4. PREMIUM PARTNER SUBSCRIPTIONS (SAAS)
// =========================================================================
export const PREMIUM_PARTNER_PLANS: PremiumSubscriptionPlan[] = [
  {
    id: "PLAN-STARTER",
    planName: "Partner Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    commissionDiscount: 0,
    zeroCommissionQuota: 0,
    badge: "Free Forever",
    features: [
      "Standard marketplace listing",
      "Manual availability updating",
      "Standard T+3 settlement cycle",
      "Standard 18-20% commission rate",
      "Basic email support",
    ],
  },
  {
    id: "PLAN-PRO",
    planName: "BharatYatra Pro Partner",
    monthlyPrice: 2999,
    annualPrice: 29990,
    commissionDiscount: 25, // 25% lower commission
    zeroCommissionQuota: 100000, // ₹1 Lakh GMV at 0%
    badge: "Most Popular for Hotels & Buses",
    popular: true,
    features: [
      "₹1,00,000 monthly GMV at 0% Commission",
      "25% discount on standard commission rates",
      "T+1 daily automated bank settlements",
      "2-Way Channel Manager & Google Hotel Ads sync",
      "AI Dynamic Pricing & Weekend Surge Automation",
      "WhatsApp automated booking confirmations to guests",
    ],
  },
  {
    id: "PLAN-ENTERPRISE",
    planName: "Enterprise Guild",
    monthlyPrice: 9999,
    annualPrice: 99990,
    commissionDiscount: 45,
    zeroCommissionQuota: 500000, // ₹5 Lakhs GMV at 0%
    badge: "For Chains, Fleets & DMCs",
    features: [
      "₹5,00,000 monthly GMV at 0% Commission",
      "45% reduced commission on overflow bookings",
      "Instant T+0 bank payouts on check-in",
      "Featured #1 position in City Search Results",
      "Dedicated Key Account Manager & 24x7 phone desk",
      "Custom Sub-Agent markup & B2B Distribution API",
      "Full White-Label guest invoices & branding",
    ],
  },
  {
    id: "PLAN-ELITE",
    planName: "Titanium Elite Network",
    monthlyPrice: 24999,
    annualPrice: 249990,
    commissionDiscount: 60,
    zeroCommissionQuota: 2000000, // ₹20 Lakhs GMV at 0%
    badge: "Multi-Property Luxury Brands",
    features: [
      "₹20,00,000 monthly GMV at 0% Commission",
      "Uncapped zero-commission for first 90 days",
      "Direct API integration & Webhook events",
      "Homepage Master Banner rotating inclusion",
      "Corporate Travel Desk priority placement",
      "Zero TDS deduction processing charges",
    ],
  },
];

// =========================================================================
// 5. AFFILIATE & ANCILLARY PARTNERSHIPS
// =========================================================================
export const AFFILIATE_PRODUCTS_DATA: AffiliateProduct[] = [
  {
    id: "AFF-INSURANCE",
    name: "Digit Travel & Medical Protection Policy",
    category: "travel_insurance",
    partnerBrand: "Go Digit General Insurance Ltd",
    commissionType: "rev_share",
    payoutAmount: 35, // 35% revenue share (avg ₹52 / policy)
    attachmentRate: "31.4% of total checkouts",
    description: "₹5,00,000 medical emergency + baggage loss + trip cancellation coverage.",
  },
  {
    id: "AFF-FOREX",
    name: "Niyo Global Zero-Forex Multi-Currency Card",
    category: "forex_cards",
    partnerBrand: "Niyo / State Bank of Mauritius",
    commissionType: "fixed_cpa",
    payoutAmount: 550, // ₹550 CPA per active loaded card
    attachmentRate: "18.2% on international flights",
    description: "Zero markup Forex card across 150+ global currencies.",
  },
  {
    id: "AFF-LOUNGE",
    name: "DreamFolks Airport Lounge Access Pass",
    category: "airport_lounges",
    partnerBrand: "DreamFolks Services Limited",
    commissionType: "fixed_cpa",
    payoutAmount: 250, // ₹250 margin per lounge pass
    attachmentRate: "22.6% on metro flight routes",
    description: "Complimentary buffet, high-speed Wi-Fi, and priority lounge seating.",
  },
  {
    id: "AFF-VISA",
    name: "Atlys Fast-Track Tourist & Pilgrimage Visa",
    category: "visa_processing",
    partnerBrand: "Atlys Global Inc.",
    commissionType: "fixed_cpa",
    payoutAmount: 750, // ₹750 CPA per visa approved
    attachmentRate: "14.5% on international outbound",
    description: "Guaranteed on-time e-visa delivery with smartphone document scanning.",
  },
];

// =========================================================================
// 6. CORPORATE TRAVEL & EXPENSE DESK
// =========================================================================
export const CORPORATE_TIERS_DATA: CorporatePlanTier[] = [
  {
    tierName: "Corporate Startup Desk",
    minEmployees: 10,
    platformFeePerUserMonthly: 149,
    creditPeriodDays: 15,
    creditFinancingRate: 1.2,
    gstAutoReconciliation: true,
    dedicatedDeskManager: false,
  },
  {
    tierName: "Mid-Market Enterprise",
    minEmployees: 100,
    platformFeePerUserMonthly: 199,
    creditPeriodDays: 30,
    creditFinancingRate: 1.5,
    gstAutoReconciliation: true,
    dedicatedDeskManager: true,
  },
  {
    tierName: "Fortune 500 Corporate Desk",
    minEmployees: 1000,
    platformFeePerUserMonthly: 249,
    creditPeriodDays: 45,
    creditFinancingRate: 1.8,
    gstAutoReconciliation: true,
    dedicatedDeskManager: true,
  },
];

// =========================================================================
// 7. PROMOTIONAL CAMPAIGNS & BANK CO-FUNDING
// =========================================================================
export const PROMO_CAMPAIGNS_DATA: PromoCampaignItem[] = [
  {
    id: "CAM-HDFC-FESTIVE",
    campaignTitle: "HDFC Bank Festive Fly & Stay Extravaganza",
    sponsorBrand: "HDFC Bank Credit Cards",
    sponsorContributionPercent: 75, // 75% funded by HDFC, 25% by BharatYatra
    platformMarginPreserved: 92.5,
    status: "active",
    duration: "15 Aug 2026 - 30 Oct 2026",
    roiMultiplier: "4.8x ROAS",
  },
  {
    id: "CAM-ICICI-VANDE",
    campaignTitle: "ICICI iMobile Zero Convenience Vande Bharat Yatra",
    sponsorBrand: "ICICI Bank Digital Banking",
    sponsorContributionPercent: 80,
    platformMarginPreserved: 95.0,
    status: "active",
    duration: "01 Aug 2026 - 31 Dec 2026",
    roiMultiplier: "5.2x ROAS",
  },
  {
    id: "CAM-MP-TOURISM",
    campaignTitle: "Madhya Pradesh Heart of Incredible India Spotlight",
    sponsorBrand: "MP State Tourism Development Corporation",
    sponsorContributionPercent: 100, // 100% state sponsored retainer
    platformMarginPreserved: 100.0,
    status: "active",
    duration: "Year-round 2026-27",
    roiMultiplier: "7.1x ROAS",
  },
  {
    id: "CAM-SBI-KASHI",
    campaignTitle: "SBI YONO Spiritual Odyssey & Kashi Corridor Cashbacks",
    sponsorBrand: "State Bank of India YONO",
    sponsorContributionPercent: 70,
    platformMarginPreserved: 91.0,
    status: "scheduled",
    duration: "01 Nov 2026 - 28 Feb 2027",
    roiMultiplier: "4.4x ROAS",
  },
];

// =========================================================================
// 8. UNIT ECONOMICS BENCHMARK (Per ₹1,000 GMV)
// =========================================================================
export const UNIT_ECONOMICS_SUMMARY = {
  grossMerchandiseValue: 1000,
  directBookingCommission: 78.5, // 7.85% blended base take rate
  convenienceAndServiceFees: 18.2, // 1.82% of GMV
  advertisingAndMediaRevenue: 8.6, // 0.86% of GMV
  affiliateAncillaries: 4.8, // 0.48% of GMV
  b2bSaaSSubscriptions: 3.2, // 0.32% of GMV
  totalGrossRevenue: 113.3, // 11.33% Total Blended Take Rate
  paymentGatewayAndCloudCost: -14.2, // 1.42%
  customerSupportAndOperations: -18.5, // 1.85%
  marketingAndAcquisitionCAC: -36.0, // 3.60%
  netContributionMargin: 44.6, // 4.46% of GMV (39.4% on Net Revenue)
  ebitdaOperatingProfit: 32.2, // 3.22% of GMV (28.4% Operating EBITDA Margin)
};
