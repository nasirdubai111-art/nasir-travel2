export interface OperatorModuleDetail {
  id: string;
  name: string;
  categoryName: string;
  icon: string;
  tagline: string;
  badge: string;
  heroImage: string;
  galleryImages: string[];
  starRating: number;
  totalReviews: number;
  operatingBase: string;
  supportContact: {
    phone: string;
    email: string;
    hours: string;
  };
  frontendAllowed: {
    profileSummary: string;
    servicesOffered: string[];
    amenities: string[];
    policies: {
      cancellation: string;
      checkInOrBoarding: string;
      luggageOrRules: string;
      refund: string;
    };
    publicPricing: {
      startingFrom: number;
      priceUnit: string;
      taxPercentage: number;
      platformFee: number;
      discountOptions: string[];
    };
    bookingFeatures: string[];
  };
  backendHiddenNeverDisplayed: {
    databaseTables: string[];
    hiddenCredentialsAndKeys: string[];
    internalIds: string[];
    backendServices: string[];
    settlementEngineDetails: string[];
    securityAndAuditLogs: string[];
    zeroFrontendExposureGuarantee: string;
  };
  partnerListingPlans: {
    currentPlan: "Silver" | "Gold" | "Platinum" | "Enterprise";
    planStatus: "Active" | "Pending Review" | "Renewing";
    monthlyFee: number;
    inventorySlotsUsed: number;
    inventorySlotsTotal: number;
    searchVisibilityBoost: string;
    featuredBadging: boolean;
    leadAccess: string;
    settlementCycle: string;
    commissionRatePercentage: number;
    grossBookingsThisMonth: number;
    netPayoutThisMonth: number;
    nextPayoutDate: string;
  };
  mockInventoryItems: Array<{
    id: string;
    title: string;
    subtitle: string;
    capacity: string;
    price: number;
    availableCount: number;
    amenityHighlights: string[];
  }>;
}

export const SUPER_DASHBOARD_MODULES: OperatorModuleDetail[] = [
  // 1. Bus Operator Profile
  {
    id: "bus",
    name: "ZingBus Diamond Luxury Travels",
    categoryName: "Bus Operator Profile",
    icon: "Bus",
    tagline: "Ultra-Luxury Multi-Axle Volvo & BharatBenz Sleeper Coaches Across Pan-India Corridors",
    badge: "Verified Premium Bus Partner",
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.88,
    totalReviews: 3420,
    operatingBase: "Delhi • Jaipur • Manali • Lucknow • Ahmedabad • Mumbai Corridors",
    supportContact: {
      phone: "+91 1800-890-2877 (Toll-Free)",
      email: "support@zingbusdiamond.in",
      hours: "24/7 Live Passenger Operations Desk",
    },
    frontendAllowed: {
      profileSummary: "Premier intercity bus mobility service with live GPS tracking, sanitised individual sleeper pods, onboard washrooms, and high-speed Wi-Fi.",
      servicesOffered: [
        "AC Multi-Axle Sleeper (2+1)",
        "Volvo 9600 B11R Luxury Seater",
        "Executive Sleeper with Individual TV",
        "Direct Night Express Non-Stop Routes",
      ],
      amenities: [
        "High-Speed Wi-Fi",
        "USB & Universal 220V Charging",
        "Sanitized Blanket & Fresh Pillow",
        "Mineral Water Bottle & Snacks",
        "Emergency SOS & CCTV Monitoring",
        "Clean Onboard Vacuum Restroom",
      ],
      policies: {
        cancellation: "Full refund 12 hours prior to scheduled departure. 50% refund between 6-12 hours.",
        checkInOrBoarding: "Passengers requested to arrive at designated boarding counter 20 minutes before departure.",
        luggageOrRules: "1 standard suitcase up to 20kg + 1 laptop handbag permitted per seat.",
        refund: "Processed automatically to original payment source within 24 bank hours.",
      },
      publicPricing: {
        startingFrom: 799,
        priceUnit: "per seat / berth",
        taxPercentage: 5,
        platformFee: 25,
        discountOptions: ["ZINGFIRST (Flat ₹150 OFF)", "ROUNDTRIP10 (10% OFF Return Journey)"],
      },
      bookingFeatures: [
        "Dynamic 2D/3D Seat Layout Selection",
        "Female Solo Passenger Safe Berth Marking",
        "Live Boarding Point Geo-Location Sharing",
        "Instant WhatsApp & SMS E-Ticket Delivery",
        "1-Click Cancellation & Real-Time Refund Status",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "bus_fleet_telemetry_master",
        "operator_credential_vault",
        "dynamic_fare_algorithm_weights",
        "pnr_audit_transaction_ledger",
        "partner_settlement_reconciliation",
      ],
      hiddenCredentialsAndKeys: [
        "VTS_GPS_TELEMETRY_API_KEY",
        "ABHIBUS_GDS_CLIENT_SECRET",
        "OPERATOR_BANK_IFSC_VAULT_TOKEN",
        "RAZORPAY_ROUTE_SETTLEMENT_KEY",
      ],
      internalIds: ["BUS_OP_ID_ZB_8829104", "FLEET_UNIT_VOLVO9600_DL01AZ9912", "SETTLE_ACCT_INDUS_99812"],
      backendServices: [
        "Fleet & Telemetry Microservice (Spring Boot)",
        "Seat Inventory Lock & Reservation Engine (Redis + Java)",
        "Dynamic Surge Fare Computation Engine",
        "Automated GST & TDS Commission Reconciliation Service",
      ],
      settlementEngineDetails: [
        "Gross Fare Deductions: 4.5% Platform Commission + 1% TCS + 18% GST on Commission",
        "Automated T+1 Payouts via RBI NEFT / RTGS Batches",
        "Escrow Account Buffer Retention: 3% rolling 7-day dispute reserve",
      ],
      securityAndAuditLogs: [
        "SOC2 Type II compliant booking event ledger",
        "Encrypted passenger identity tokens (zero plaintext phone numbers stored)",
        "Driver alcohol-sensor pre-trip log verification engine",
      ],
      zeroFrontendExposureGuarantee: "No backend database IDs, supplier GDS secrets, internal commissions, or raw GPS telemetry endpoints are rendered in customer DOM.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 14999,
      inventorySlotsUsed: 42,
      inventorySlotsTotal: 50,
      searchVisibilityBoost: "Top 3 Corridors Placement (+180% Search Impressions)",
      featuredBadging: true,
      leadAccess: "Direct Corporate & Group Charter Booking Leads Enabled",
      settlementCycle: "Daily T+1 Automated Bank Settlement",
      commissionRatePercentage: 4.5,
      grossBookingsThisMonth: 1845000,
      netPayoutThisMonth: 1761975,
      nextPayoutDate: "Tomorrow 06:00 AM IST",
    },
    mockInventoryItems: [
      {
        id: "zing_route_1",
        title: "Delhi Kashmere Gate → Manali Private Stand",
        subtitle: "Volvo 9600 AC Multi-Axle Sleeper (2+1)",
        capacity: "32 Berths (14 Upper, 18 Lower)",
        price: 1399,
        availableCount: 9,
        amenityHighlights: ["WiFi", "Blanket", "USB", "CCTV", "Snacks"],
      },
      {
        id: "zing_route_2",
        title: "Delhi ISBT → Jaipur Sindhi Camp",
        subtitle: "BharatBenz AC Semi-Sleeper Luxury",
        capacity: "45 Push-back Reclining Seats",
        price: 799,
        availableCount: 18,
        amenityHighlights: ["AC", "Water Bottle", "Reading Light", "Air Suspension"],
      },
      {
        id: "zing_route_3",
        title: "Jaipur → Udaipur City Link Express",
        subtitle: "Scania Metrolink HD Sleeper AC",
        capacity: "30 Berths with Privacy Curtains",
        price: 1099,
        availableCount: 6,
        amenityHighlights: ["Bed Linen", "Power Plug", "Washroom", "GPS Tracking"],
      },
    ],
  },

  // 2. Train Profile
  {
    id: "train",
    name: "Indian Railways / Vande Bharat Express",
    categoryName: "Train Profile",
    icon: "Train",
    tagline: "Next-Generation High Speed Semi-Bullet & Superfast Rajdhani Travel Services",
    badge: "Official IRCTC Authorized GDS Gateway",
    heroImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.92,
    totalReviews: 12890,
    operatingBase: "Pan-India Broad Gauge Network • 16 Active Vande Bharat & Tejas Express Routes",
    supportContact: {
      phone: "139 (Indian Railways 24/7 Helpline)",
      email: "care@irctc-gds-gateway.gov.in",
      hours: "Round the Clock Real-Time PNR & Train Operations",
    },
    frontendAllowed: {
      profileSummary: "Cutting-edge passenger rail services featuring 160 km/h cruising speeds, bio-vacuum toilets, revolving 180° executive chairs, and gourmet regional meals.",
      servicesOffered: [
        "Executive Class (EC) Revolving Chairs",
        "AC Chair Car (CC) Ergonomic Seating",
        "1st AC Sleeper (1A) Private Coupe",
        "2nd AC (2A) & 3rd AC (3A) Economy Sleeper",
      ],
      amenities: [
        "Automated Sliding Coach Doors",
        "Kavach Anti-Collision Safety Tech",
        "Hot Gourmet Regional Meals & Beverages",
        "Onboard Infotainment via Local WiFi",
        "Wheelchair-Friendly Bio-Vacuum Restrooms",
        "Emergency Talkback System to Driver",
      ],
      policies: {
        cancellation: "As per Ministry of Railways refund rules: Flat ₹240 deduction for 1A/EC prior to 48 hrs.",
        checkInOrBoarding: "Platform display available 4 hours prior. Valid original Govt ID mandatory.",
        luggageOrRules: "Up to 50kg free allowance per ticket in EC/1A, 40kg in CC/2A/3A.",
        refund: "IRCTC direct reversal to source within 3-5 working days.",
      },
      publicPricing: {
        startingFrom: 1120,
        priceUnit: "per passenger / ticket",
        taxPercentage: 5,
        platformFee: 15,
        discountOptions: ["SENIOR_PILGRIMAGE (Applicable via IRCTC rules)", "CHILD_CONCESSION (5-11 Years)"],
      },
      bookingFeatures: [
        "Live Train Running Status & Platform Estimator",
        "Quota Selection: General, Tatkal, Premium Tatkal & Senior Citizen",
        "Instant PNR Confirmation Probability Predictor",
        "Berth Preference Selection (Window, Aisle, Lower, Coupe)",
        "E-Catering Pre-Meal Order Integration",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "cris_prs_session_ledger",
        "irctc_gds_secret_auth_store",
        "pnr_quota_allocation_internal",
        "railway_settlement_reconciliation_master",
      ],
      hiddenCredentialsAndKeys: [
        "CRIS_PRS_PUBLIC_CERTIFICATE_PEM",
        "IRCTC_ENTERPRISE_API_SECRET",
        "RAILWAY_CONCESSION_KEY_HMAC",
      ],
      internalIds: ["CRIS_GDS_NODE_NDLS_09", "TRAIN_PRS_22436_VB_VARANASI", "PRS_TOKEN_HASH_99182"],
      backendServices: [
        "CRIS Direct PRS High-Concurrency Gateway",
        "Tatkal Queue Throttle & Bot Mitigation Filter",
        "Dynamic Cancellation Matrix Calculator",
        "Railway Treasury Daily Escrow Clearing Worker",
      ],
      settlementEngineDetails: [
        "Direct Indian Railways GDS clearing via SBI Payment Gateway & e-Treasury",
        "Zero margin markup on PRS base fares (authorized statutory booking charges only)",
      ],
      securityAndAuditLogs: [
        "Encrypted Aadhaar/Passport tokenization (no raw IDs logged)",
        "Strict 10-minute PRS seat reservation transaction timeouts",
      ],
      zeroFrontendExposureGuarantee: "PRS session keys, CRIS gateway secrets, and raw railway database schemas are strictly secured inside the backend cluster.",
    },
    partnerListingPlans: {
      currentPlan: "Enterprise",
      planStatus: "Active",
      monthlyFee: 0,
      inventorySlotsUsed: 980,
      inventorySlotsTotal: 1000,
      searchVisibilityBoost: "Official Rail System Top Integration",
      featuredBadging: true,
      leadAccess: "National High-Speed Rail GDS Feed",
      settlementCycle: "Direct Real-Time Railway Treasury Settlement",
      commissionRatePercentage: 1.8,
      grossBookingsThisMonth: 14200000,
      netPayoutThisMonth: 13944400,
      nextPayoutDate: "Daily Automated Clearing (00:00 IST)",
    },
    mockInventoryItems: [
      {
        id: "train_22436",
        title: "22436 Vande Bharat Express (New Delhi → Varanasi)",
        subtitle: "Superfast Semi-High Speed (Departure: 06:00 AM • 8h 00m)",
        capacity: "16 Coaches (1,128 Seats)",
        price: 1750,
        availableCount: 42,
        amenityHighlights: ["Gourmet Meals", "Revolving Seats", "Free WiFi", "Bio Vacuum WC"],
      },
      {
        id: "train_12002",
        title: "12002 Bhopal Shatabdi Express (New Delhi → Agra Cantt)",
        subtitle: "Executive Chair Car & AC Chair Car (Departure: 06:00 AM • 1h 50m)",
        capacity: "14 Coaches (980 Seats)",
        price: 1120,
        availableCount: 115,
        amenityHighlights: ["Tea & Breakfast Included", "Wide Windows", "Fast Commute"],
      },
      {
        id: "train_12952",
        title: "12952 Mumbai Rajdhani (New Delhi → Mumbai Central)",
        subtitle: "1st AC, 2nd AC & 3rd AC Sleeper (Departure: 16:55 PM • 15h 32m)",
        capacity: "22 LHB Coaches",
        price: 2850,
        availableCount: 18,
        amenityHighlights: ["Fresh Bedding", "Multi-Course Meals", "Private Coupes"],
      },
    ],
  },

  // 3. Hotel Profile
  {
    id: "hotel",
    name: "The Grand Royal Palace & Heritage Suites",
    categoryName: "Hotel Profile",
    icon: "Hotel",
    tagline: "5-Star Luxury Heritage Hospitality with Regal Courtyards & Royal Dining",
    badge: "5-Star Deluxe Luxury Hotel",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.95,
    totalReviews: 2150,
    operatingBase: "Civil Lines & Heritage Boulevard, Jaipur, Rajasthan",
    supportContact: {
      phone: "+91 141-2890-4400",
      email: "reservations@grandroyalpalace.com",
      hours: "24/7 Front Desk & Butler Services",
    },
    frontendAllowed: {
      profileSummary: "An opulent 19th-century royal palace restored with world-class modern luxuries, Olympic-sized marble swimming pools, authentic Rajputana dining, and lush peacocks' gardens.",
      servicesOffered: [
        "Royal Heritage Courtyard Suites",
        "Maharaja Presidential Villa with Private Plunge Pool",
        "Deluxe Colonial Palace Rooms",
        "Jiva Ayurvedic Luxury Spa & Wellness",
      ],
      amenities: [
        "Complimentary Royal Breakfast Buffet",
        "Infinity Temperature-Controlled Pool",
        "24-Hour Dedicated Butler Service",
        "Valet Parking & Airport Limousine Transfers",
        "Fine-Dining Heritage Restaurants (Sheesh Mahal)",
        "High-Speed Fiber Optic Wi-Fi",
      ],
      policies: {
        cancellation: "Free cancellation up to 48 hours before check-in date. 1-night charge thereafter.",
        checkInOrBoarding: "Standard Check-in: 02:00 PM • Standard Check-out: 12:00 PM (Noon).",
        luggageOrRules: "Govt ID (Passport, Aadhaar, Voter ID) required for all adult guests at check-in.",
        refund: "Processed directly to card/UPI within 3 business days.",
      },
      publicPricing: {
        startingFrom: 7499,
        priceUnit: "per room / night",
        taxPercentage: 12,
        platformFee: 0,
        discountOptions: ["ROYALSTAY15 (15% OFF for 2+ Nights)", "HERITAGE_HONEYMOON (Free Spa Session)"],
      },
      bookingFeatures: [
        "Interactive Room & Villa Category Comparison",
        "High-Definition 360° Room Virtual Walkthroughs",
        "Custom Meal Plan Selection (Room Only, CP, MAP, AP)",
        "Special Requests: Early Check-in, Airport Pickup, Honeymoon Cake",
        "Instant Confirmed Voucher with QR Check-In Code",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "hotel_property_master",
        "room_inventory_rate_calendar",
        "hotel_channel_manager_sync_ledger",
        "partner_kyc_verification_docs",
        "hotel_payout_settlement_batches",
      ],
      hiddenCredentialsAndKeys: [
        "ORACLE_OPERA_PMS_API_SECRET",
        "SITEMINDER_CHANNEL_MGR_TOKEN",
        "HOTEL_PAN_GST_INTERNAL_VAULT",
      ],
      internalIds: ["HTL_PROP_JPR_ROYAL_00192", "PMS_RESV_NODE_9921", "INTERNAL_BANK_NODE_HDFC_881"],
      backendServices: [
        "Hotel PMS Two-Way Real-Time Rate & Inventory Sync Service",
        "Dynamic Yield Management & Seasonal Surge Rate Engine",
        "Hotel Partner Tax Withholding & Commission Billing Service",
      ],
      settlementEngineDetails: [
        "Commission Structure: 8.0% contracted OTA fee on completed check-outs",
        "Weekly Consolidated Payouts every Tuesday for all checked-out reservations",
      ],
      securityAndAuditLogs: [
        "PCI-DSS Level 1 compliant tokenized card payment processing",
        "Automated guest verification against hospitality compliance database",
      ],
      zeroFrontendExposureGuarantee: "Channel manager API tokens, internal rate grids, and hotel partner bank credentials are never rendered on the frontend.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 19999,
      inventorySlotsUsed: 38,
      inventorySlotsTotal: 40,
      searchVisibilityBoost: "Featured Heritage Hotel across Jaipur & Golden Triangle (+220% Views)",
      featuredBadging: true,
      leadAccess: "Direct Luxury Wedding & MICE Inquiry Channel",
      settlementCycle: "Weekly Automated Bank Wire (Every Tuesday)",
      commissionRatePercentage: 8.0,
      grossBookingsThisMonth: 3480000,
      netPayoutThisMonth: 3201600,
      nextPayoutDate: "Coming Tuesday 10:00 AM IST",
    },
    mockInventoryItems: [
      {
        id: "room_palace_deluxe",
        title: "Royal Heritage Courtyard Room",
        subtitle: "King Bed • 450 sq.ft • Private Balcony overlooking Gardens",
        capacity: "2 Adults, 1 Child (under 12)",
        price: 7499,
        availableCount: 7,
        amenityHighlights: ["Breakfast Included", "Free WiFi", "Bathtub", "Garden View"],
      },
      {
        id: "room_palace_maharaja",
        title: "Maharaja Presidential Heritage Suite",
        subtitle: "Super King Bed • 1,100 sq.ft • Private Jacuzzi & Plunge Pool",
        capacity: "3 Adults or 2 Adults + 2 Children",
        price: 18999,
        availableCount: 2,
        amenityHighlights: ["Butler Service", "Airport Limousine", "Jacuzzi", "Sheesh Mahal Dining"],
      },
      {
        id: "room_palace_family",
        title: "Rajputana Interconnected Family Suite",
        subtitle: "2 King Bedrooms • 850 sq.ft • Regal Living Room",
        capacity: "4 Adults + 2 Children",
        price: 13500,
        availableCount: 4,
        amenityHighlights: ["2 Bathrooms", "Living Room", "Free Kids Meals", "City View"],
      },
    ],
  },

  // 4. Lodge Profile
  {
    id: "lodge",
    name: "Corbett Wilderness Eco-Lodge & Safari Haven",
    categoryName: "Lodge Profile",
    icon: "Home",
    tagline: "Authentic Forest Cabins & Safari Glamping Near Jim Corbett National Park",
    badge: "Eco-Certified Wildlife Lodge",
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.82,
    totalReviews: 890,
    operatingBase: "Dhikala Gate Eco-Zone, Ramnagar, Uttarakhand",
    supportContact: {
      phone: "+91 5947-284-910",
      email: "wildlife@corbett-ecolodge.in",
      hours: "06:00 AM - 10:00 PM Daily",
    },
    frontendAllowed: {
      profileSummary: "Rustic eco-friendly stone and bamboo cottages situated along the Kosi River with open campfires, guided forest naturalist safaris, and organic farm-to-table meals.",
      servicesOffered: [
        "Riverfront Wooden Eco-Cottages",
        "Safari Swiss Glamping Tents with Attached Bath",
        "Jungle Family Treehouse Suites",
        "Open 4x4 Gypsy Safari Booking Coordination",
      ],
      amenities: [
        "Organic Village-Style Farm Buffet Included",
        "Nightly Campfire with Folk Music & Stargazing",
        "Solar Water Heating & Rainwater Harvesting",
        "Onsite Naturalist & Bird Watching Trails",
        "High-Speed Satellite Wi-Fi in Lounge Area",
        "Free 4x4 Vehicle Parking on Premises",
      ],
      policies: {
        cancellation: "Full refund 7 days prior to check-in. Non-refundable within 72 hours due to wildlife permit blockages.",
        checkInOrBoarding: "Check-in: 01:00 PM • Check-out: 11:00 AM.",
        luggageOrRules: "Strictly silent zone after 10:00 PM to protect forest fauna. Loud music strictly prohibited.",
        refund: "Refunds processed within 5 working days.",
      },
      publicPricing: {
        startingFrom: 4200,
        priceUnit: "per cottage / night",
        taxPercentage: 12,
        platformFee: 0,
        discountOptions: ["SAFARICOMBO (10% OFF with 2 Gypsy Safaris)", "BIRDINGWEEKEND (Free Naturalist Guide)"],
      },
      bookingFeatures: [
        "Cottage & Glamping Tent Availability by Dates",
        "Direct Safari Zone Permit Add-on Selection (Bijrani, Jhirna, Dhela)",
        "All-Meals Inclusive (AP) Meal Plan Pre-Booking",
        "Guided Nature Walk Timings Registration",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "lodge_inventory_master",
        "forest_department_permit_ledger",
        "lodge_partner_commission_rules",
        "payout_kyc_vault",
      ],
      hiddenCredentialsAndKeys: [
        "UTTARAKHAND_FOREST_DEPT_API_KEY",
        "LODGE_INTERNAL_SECRET_HASH",
        "ECO_PARTNER_CREDENTIAL_KEY",
      ],
      internalIds: ["LDG_CORBETT_ECO_0912", "SAFARI_AGENT_DESK_CORBETT_88", "INVENTORY_BLOCK_99182"],
      backendServices: [
        "Lodge Inventory & Safari Permit Coordination Microservice",
        "Forest Department Daily Quota Verifier",
        "Automated Partner Commission Calculation Engine",
      ],
      settlementEngineDetails: [
        "Flat 6.5% Platform Brokerage Fee on gross room sales",
        "Bi-weekly settlement direct to partner Current Account",
      ],
      securityAndAuditLogs: [
        "Eco-tax verification audit trail",
        "Guest forest clearance compliance logs",
      ],
      zeroFrontendExposureGuarantee: "Forest permit quota tokens, internal partner margin tables, and lodge bank credentials remain strictly hidden on server-side.",
    },
    partnerListingPlans: {
      currentPlan: "Gold",
      planStatus: "Active",
      monthlyFee: 7999,
      inventorySlotsUsed: 14,
      inventorySlotsTotal: 15,
      searchVisibilityBoost: "High Rank in Corbett & Wildlife Filter Searches (+120% Leads)",
      featuredBadging: true,
      leadAccess: "Direct Safari & Glamping Traveler Bookings",
      settlementCycle: "Bi-Weekly Bank Transfer (Every 1st & 15th of the month)",
      commissionRatePercentage: 6.5,
      grossBookingsThisMonth: 680000,
      netPayoutThisMonth: 635800,
      nextPayoutDate: "1st of next month",
    },
    mockInventoryItems: [
      {
        id: "lodge_river_cottage",
        title: "Kosi Riverfront Wooden Eco-Cottage",
        subtitle: "King Bed • River Facing Veranda • Attached Stone Bath",
        capacity: "2 Adults + 1 Child",
        price: 4200,
        availableCount: 4,
        amenityHighlights: ["All Meals Included", "Campfire Access", "River View", "Hot Water"],
      },
      {
        id: "lodge_safari_tent",
        title: "Luxury Forest Safari Swiss Tent",
        subtitle: "Double Bed • Climate Control • Private Sit-out under Teak Trees",
        capacity: "2 Adults",
        price: 3499,
        availableCount: 3,
        amenityHighlights: ["Breakfast & Dinner", "Naturalist Tour", "Wildlife Stargazing"],
      },
      {
        id: "lodge_treehouse_suite",
        title: "Wild Canopy Family Treehouse",
        subtitle: "Elevated 25ft in Sal Forest • 2 Queen Beds • Panoramic Balcony",
        capacity: "4 Adults or Family of 5",
        price: 7800,
        availableCount: 2,
        amenityHighlights: ["360° Jungle View", "Complimentary Safari Tea", "Bathtub"],
      },
    ],
  },

  // 5. Resort Profile
  {
    id: "resort",
    name: "Goa Beachfront Palms & Wellness Spa Resort",
    categoryName: "Resort Profile",
    icon: "Palmtree",
    tagline: "5-Star Tropical Beachside Villas with Private Sunsets, Infinity Pools & Ayurvedic Spa",
    badge: "5-Star Luxury Beach Resort",
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.91,
    totalReviews: 3100,
    operatingBase: "Varca Beach Road, South Goa, India",
    supportContact: {
      phone: "+91 832-289-9900",
      email: "aloha@goabeachfrontpalms.com",
      hours: "24/7 Resort Concierge & Guest Experience",
    },
    frontendAllowed: {
      profileSummary: "Expansive 20-acre beachfront sanctuary offering Portuguese-style sea villas, direct access to white sands, 3 multi-cuisine restaurants, and therapeutic Ayurvedic wellness.",
      servicesOffered: [
        "Oceanfront Private Sunset Beach Villas",
        "Lagoon View Executive Luxury Rooms",
        "Ayurvedic Panchakarma & Ocean Spa Retreats",
        "Water Sports & Private Yacht Sunset Charters",
      ],
      amenities: [
        "Direct Private Access to Varca White Sand Beach",
        "2 Freeform Olympic Lagoon Pools + Kid's Splash Zone",
        "Complimentary Beachside Sunset Cocktails & Live Jazz",
        "Holistic Spa & Daily Sunrise Yoga by the Sea",
        "Multi-Cuisine Seafood Shacks & Continental Bistro",
        "Airport Luxury Pickup & Drop Coordination",
      ],
      policies: {
        cancellation: "Free cancellation up to 72 hours prior to arrival. 1-night retention for late cancellations.",
        checkInOrBoarding: "Check-in: 03:00 PM • Check-out: 12:00 PM (Late check-out subject to availability).",
        luggageOrRules: "Pool access open 07:00 AM - 08:00 PM. Proper swimwear mandatory.",
        refund: "Refund initiated within 48 hours to original payment mode.",
      },
      publicPricing: {
        startingFrom: 9999,
        priceUnit: "per villa / night",
        taxPercentage: 18,
        platformFee: 0,
        discountOptions: ["GOA_SUMMER_ESCAPE (20% OFF on 3+ Nights)", "SPA_INCLUSIVE_PACKAGE (Free 60m Couple Massage)"],
      },
      bookingFeatures: [
        "Interactive Resort Map with Villa Selection",
        "Add-on Experience Booking (Candlelight Beach Dinner, Yacht Cruise)",
        "Curated Stay Package Selection: Romantic, Family, Wellness",
        "Instant WhatsApp Voucher & Digital Check-In Card",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "resort_property_inventory",
        "spa_treatment_calendar_internal",
        "resort_ota_rate_parity_matrix",
        "partner_settlement_ledger",
      ],
      hiddenCredentialsAndKeys: [
        "RESORT_MICROS_FIDELIO_API_KEY",
        "STRIPE_PAYMENT_GATEWAY_SECRET",
        "RESORT_CORPORATE_PAN_KEY",
      ],
      internalIds: ["RST_GOA_PALMS_8831", "YIELD_RULE_X991", "SETTLE_ACCT_AXIS_7721"],
      backendServices: [
        "Resort Dynamic Yield Pricing & Rate Parity Monitor",
        "Spa & Activity Real-Time Resource Scheduler",
        "Automated Partner Commission & Reconciliation Engine",
      ],
      settlementEngineDetails: [
        "Standard OTA Commission: 7.5% per completed stay",
        "Automated Weekly Bank Wire clearing on gross checkout balances",
      ],
      securityAndAuditLogs: [
        "PCI compliant guest card tokenization",
        "Daily automated revenue audit reports for finance controllers",
      ],
      zeroFrontendExposureGuarantee: "PMS property access keys, internal commission rates, and hotel management secrets are never exposed on client devices.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 24999,
      inventorySlotsUsed: 52,
      inventorySlotsTotal: 60,
      searchVisibilityBoost: "Top Recommended Luxury Resort in Goa (+300% Engagement)",
      featuredBadging: true,
      leadAccess: "High-Value Honeymoon & Corporate Retreat Inquiries",
      settlementCycle: "Weekly Automated Payouts (Every Wednesday)",
      commissionRatePercentage: 7.5,
      grossBookingsThisMonth: 4890000,
      netPayoutThisMonth: 4523250,
      nextPayoutDate: "Coming Wednesday 11:00 AM IST",
    },
    mockInventoryItems: [
      {
        id: "resort_villa_sunset",
        title: "Oceanfront Sunset Beach Villa",
        subtitle: "King Bed • 900 sq.ft • Private Sundeck directly stepping onto beach",
        capacity: "2 Adults + 2 Children",
        price: 14500,
        availableCount: 3,
        amenityHighlights: ["Direct Beach Access", "Private Sundeck", "Buffet Breakfast", "Free Spa Credit"],
      },
      {
        id: "resort_lagoon_room",
        title: "Lagoon View Deluxe Suite",
        subtitle: "King or Twin Beds • 550 sq.ft • Balcony overlooking palm lagoons",
        capacity: "2 Adults + 1 Child",
        price: 9999,
        availableCount: 8,
        amenityHighlights: ["Pool Access", "Breakfast Included", "High Speed WiFi", "Rain Shower"],
      },
      {
        id: "resort_presidential_suite",
        title: "Grand Portuguese Royal Presidential Villa",
        subtitle: "3 Bedrooms • 2,200 sq.ft • Private Infinity Pool & Dedicated Chef",
        capacity: "6 Adults + 3 Children",
        price: 32000,
        availableCount: 1,
        amenityHighlights: ["Private Pool", "Private Chef", "Sunset Champagne", "VIP Airport Transfer"],
      },
    ],
  },

  // 6. Pilgrimage Tour Operator Profile
  {
    id: "pilgrimage",
    name: "Divya Darshan Sacred Yatra Travels",
    categoryName: "Pilgrimage Tour Operator Profile",
    icon: "Sun",
    tagline: "Dedicated Spiritual Pilgrimages with VIP Darshan, Devotional Guides & Pure Veg Sattvic Food",
    badge: "Govt. Approved Religious Yatra Specialist",
    heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.96,
    totalReviews: 5410,
    operatingBase: "Varanasi • Haridwar • Tirupati • Puri • Rameswaram • Chardham",
    supportContact: {
      phone: "+91 1800-419-7788 (Toll-Free Yatra Helpdesk)",
      email: "yatra@divyadarshan.org.in",
      hours: "05:00 AM - 11:00 PM Daily",
    },
    frontendAllowed: {
      profileSummary: "Premier spiritual tour organizer offering comprehensive pilgrim care, comfortable AC transport, senior-citizen friendly pacing, VIP temple darshan coordination, and 100% pure sattvic vegetarian meals.",
      servicesOffered: [
        "Chardham Yatra by Luxury Bus & Helicopter Options",
        "Varanasi - Ayodhya - Prayagraj Spiritual Triangle",
        "South India 12 Jyotirlinga & Divya Desam Expeditions",
        "Tirupati Balaji Sheegra Darshan & Accommodation Tours",
      ],
      amenities: [
        "100% Pure Vegetarian & Sattvic Jain Meals Included",
        "Senior-Citizen Special Care: Wheelchairs & Medical Kit Support",
        "Experienced Sanskrit & Regional Language Devotional Guides",
        "AC Push-Back Coach Transfers with Punctual Schedules",
        "Comfortable 3-Star & 4-Star Verified Hotel Stays",
        "VIP Temple Pass & Puja Samagri Assistance",
      ],
      policies: {
        cancellation: "Full refund 15 days prior to yatra start date. 50% refund between 7-14 days.",
        checkInOrBoarding: "Assembly at designated holy city station 2 hours before scheduled departure.",
        luggageOrRules: "1 medium suitcase + 1 cabin kitbag per pilgrim recommended for mountain yatras.",
        refund: "Processed within 7 bank working days.",
      },
      publicPricing: {
        startingFrom: 14500,
        priceUnit: "per pilgrim / complete package",
        taxPercentage: 5,
        platformFee: 50,
        discountOptions: ["SR_CITIZEN_SEVA (Flat ₹1,000 OFF for 60+ yrs)", "FAMILY_YATRA (₹2,500 OFF on 4+ Devotees)"],
      },
      bookingFeatures: [
        "Departure Date & Batch Capacity Tracker",
        "Custom Group Size Selection (Individual, Family, Senior Batch)",
        "Devotee Special Requirements (Jain food, Ground Floor Room, Wheelchair)",
        "Day-Wise Spiritual Itinerary & Temple Puja Timings Explorer",
        "Instant Yatra Confirmation Kit with Emergency Pilgrim ID",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "pilgrimage_yatra_master",
        "temple_trust_quota_ledger",
        "devotee_kyc_aadhaar_vault",
        "pilgrim_operator_settlement_db",
      ],
      hiddenCredentialsAndKeys: [
        "CHARDHAM_DEVASTHANAM_BOARD_API_KEY",
        "TTD_TIRUPATI_TRUST_PARTNER_SECRET",
        "PILGRIM_ESCROW_VAULT_KEY",
      ],
      internalIds: ["YATRA_OP_DIVYA_77192", "TTD_SEVA_NODE_099", "SETTLE_ACCT_SBI_RELIGIOUS_441"],
      backendServices: [
        "Temple Trust Darshan Slot Sync & Batch Scheduler",
        "Pilgrim High-Altitude Medical Fitness Verification Engine",
        "Pilgrimage Escrow & Operator Progress-Based Payout Engine",
      ],
      settlementEngineDetails: [
        "5.0% Platform Fee with Milestone-Based Payout (40% at booking, 60% on yatra departure)",
        "Automated Temple Trust statutory fee direct pass-through",
      ],
      securityAndAuditLogs: [
        "Encrypted biometric and identity records for state border checkposts",
        "High-altitude emergency medical alert monitoring logs",
      ],
      zeroFrontendExposureGuarantee: "Temple trust internal APIs, devotee raw KYC documents, and operator milestone escrow calculations are strictly concealed server-side.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 16999,
      inventorySlotsUsed: 22,
      inventorySlotsTotal: 25,
      searchVisibilityBoost: "Top 1 Featured Spiritual Yatra in India (+250% Bookings)",
      featuredBadging: true,
      leadAccess: "High-Volume Senior Citizen & Group Pilgrimage Inquiries",
      settlementCycle: "Milestone Payout (40% Advance, 60% on Batch Flag-off)",
      commissionRatePercentage: 5.0,
      grossBookingsThisMonth: 5640000,
      netPayoutThisMonth: 5358000,
      nextPayoutDate: "Next Batch Flag-off (Friday 08:00 AM)",
    },
    mockInventoryItems: [
      {
        id: "yatra_varanasi_ayodhya",
        title: "Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj Sangam",
        subtitle: "5 Days / 4 Nights • AC Coach • 4-Star Stays • All Pure Veg Meals",
        capacity: "40 Devotees / Batch",
        price: 14500,
        availableCount: 11,
        amenityHighlights: ["VIP Darshan Pass", "Ganga Aarti Boat", "Pure Veg Sattvic Food", "Guide"],
      },
      {
        id: "yatra_chardham_express",
        title: "Grand Chardham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath)",
        subtitle: "10 Days / 9 Nights • Haridwar to Haridwar • Medical Oxygen Support",
        capacity: "30 Pilgrims / Batch",
        price: 34999,
        availableCount: 5,
        amenityHighlights: ["Kedarnath Helicopter Assist", "Deluxe Stays", "Doctor on Call", "Pooja Samagri"],
      },
      {
        id: "yatra_tirupati_balaji",
        title: "Tirupati Balaji Sheegra Darshan & Sri Kalahasti Tour",
        subtitle: "3 Days / 2 Nights • Chennai/Bangalore Pickup • 5-Star Hotel Stay",
        capacity: "25 Pilgrims / Batch",
        price: 9999,
        availableCount: 8,
        amenityHighlights: ["Special Entry Darshan Pass", "Laddoo Prasadam", "AC Innova Transfers"],
      },
    ],
  },

  // 7. Tour Operator Profile
  {
    id: "tour",
    name: "Incredible Himalayas & Pan-India Expeditions",
    categoryName: "Tour Operator Profile",
    icon: "Compass",
    tagline: "Curated Guided Adventures, Cultural Heritage Trails & Scenic Pan-India Road Trips",
    badge: "Ministry of Tourism Certified Operator",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.89,
    totalReviews: 4120,
    operatingBase: "Leh Ladakh • Himachal Pradesh • Kashmir • Rajasthan • Kerala",
    supportContact: {
      phone: "+91 1982-259-880",
      email: "explore@incrediblehimalayas.com",
      hours: "08:00 AM - 09:00 PM Daily",
    },
    frontendAllowed: {
      profileSummary: "Specialist adventure and cultural holiday designer offering expertly guided small-group journeys, 4x4 mountain expeditions, heritage stays, and seamless logistics.",
      servicesOffered: [
        "Leh-Ladakh Pangong & Nubra 4x4 Expedition",
        "Kashmir Paradise: Srinagar, Gulmarg & Pahalgam",
        "Spiti Valley High Altitude Off-Road Circuit",
        "Golden Triangle Heritage & Cultural Odyssey",
      ],
      amenities: [
        "All Transport in Sanitised 4x4 Scorpio/Innova Crysta",
        "Verified Handpicked Boutique Hotels & Luxury Camp Stays",
        "Certified Local Tour Captain & Mountaineering Guides",
        "Breakfast & Dinners Included throughout Itinerary",
        "All Inner-Line Permits, Green Fees & Toll Taxes Handled",
        "Emergency Oxygen Cylinders & First Aid on High Mountain Passes",
      ],
      policies: {
        cancellation: "Full refund up to 20 days prior to departure. 50% between 10-19 days.",
        checkInOrBoarding: "Trip briefing and airport pickup coordinated 1 day prior.",
        luggageOrRules: "1 rucksack/duffel bag + 1 daypack per explorer recommended.",
        refund: "Reversal to bank/card within 5-7 business days.",
      },
      publicPricing: {
        startingFrom: 18999,
        priceUnit: "per traveler / complete tour",
        taxPercentage: 5,
        platformFee: 0,
        discountOptions: ["EARLYBIRD_HIMALAYA (10% OFF 45 Days in Advance)", "GROUP_EXPLORER (Flat ₹5,000 OFF on 5+ Pax)"],
      },
      bookingFeatures: [
        "Fixed Batch Departure Calendar & Open Seats Counter",
        "Day-Wise Route Map with Altitude Elevation Charts",
        "Inclusions vs Exclusions Transparent Matrix",
        "Room Sharing Configuration: Twin Sharing, Triple or Solo Room",
        "Digital Packing Checklist & Pre-Trip Acclimatization Guide",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "tour_package_catalog_master",
        "tour_guide_allocation_engine",
        "permit_application_db",
        "operator_supplier_settlement",
      ],
      hiddenCredentialsAndKeys: [
        "LEH_DC_OFFICE_INNERLINE_PERMIT_KEY",
        "AIR_INDIA_GROUP_DESK_CREDENTIALS",
        "TOUR_ESCROW_OPERATING_SECRET",
      ],
      internalIds: ["TOUR_OP_INCR_HIM_0091", "ROUTE_EXP_LADAKH_772", "SETTLE_ACCT_KOTAK_99182"],
      backendServices: [
        "Tour Batch Capacity & Hotel Block Allocation Service",
        "Dynamic Weather & Road Clearance Advisory Engine",
        "Tour Operator Stage-Wise Commission Billing Engine",
      ],
      settlementEngineDetails: [
        "6.0% Contracted Platform Service Fee",
        "Staggered Operator Remittance: 50% on booking lock, 50% upon batch commencement",
      ],
      securityAndAuditLogs: [
        "High-altitude traveler emergency insurance tracking records",
        "Local permit compliance logs with local district magistrates",
      ],
      zeroFrontendExposureGuarantee: "Permit integration APIs, internal vendor margins, and group flight desk tokens are strictly isolated on backend servers.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 18499,
      inventorySlotsUsed: 28,
      inventorySlotsTotal: 30,
      searchVisibilityBoost: "Featured Adventure & Holiday Operator (#1 Rank in Ladakh/Himachal)",
      featuredBadging: true,
      leadAccess: "Direct Corporate & Small-Group Adventure Travelers",
      settlementCycle: "Stage-Wise Remittance (50% Advance, 50% on Trip Start)",
      commissionRatePercentage: 6.0,
      grossBookingsThisMonth: 4120000,
      netPayoutThisMonth: 3872800,
      nextPayoutDate: "Every Friday Batch Settlement",
    },
    mockInventoryItems: [
      {
        id: "tour_ladakh_circuit",
        title: "Ladakh Explorer: Leh, Nubra Valley & Pangong Lake",
        subtitle: "6 Days / 5 Nights • 4x4 Innova Crysta • Luxury Camps • Permits Included",
        capacity: "16 Travelers / Batch",
        price: 24999,
        availableCount: 4,
        amenityHighlights: ["Oxygen Onboard", "Nubra Camel Safari", "Pangong Camp", "All Meals"],
      },
      {
        id: "tour_kashmir_paradise",
        title: "Gems of Kashmir: Srinagar, Gulmarg, Sonamarg & Pahalgam",
        subtitle: "5 Days / 4 Nights • Deluxe Houseboat & Pine Resorts • Shikara Ride",
        capacity: "20 Travelers / Batch",
        price: 18999,
        availableCount: 7,
        amenityHighlights: ["Gondola Phase 1 Assist", "Dal Lake Houseboat", "Breakfast & Dinner"],
      },
      {
        id: "tour_spiti_4x4",
        title: "Spiti Valley Off-Road Roadtrip: Kaza, Chandratal & Key Monastery",
        subtitle: "7 Days / 6 Nights • 4x4 Scorpio • High Altitude Stargazing",
        capacity: "12 Travelers / Batch",
        price: 21500,
        availableCount: 2,
        amenityHighlights: ["Chandratal Camping", "Monastery Tours", "Experienced Driver-Guide"],
      },
    ],
  },

  // 8. Corporate Tour Operator Profile
  {
    id: "corporate",
    name: "Bharat Corporate Travel & MICE Solutions",
    categoryName: "Corporate Tour Operator Profile",
    icon: "Building2",
    tagline: "Enterprise MICE, Executive Delegations, Offsites & Corporate Compliance Management",
    badge: "ISO 9001 Certified Corporate Travel Partner",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.93,
    totalReviews: 1850,
    operatingBase: "Gurugram • Mumbai BKC • Bengaluru Whitefield • Hyderabad Hitec City",
    supportContact: {
      phone: "+91 124-490-8800 (Dedicated Corporate Key Account Desk)",
      email: "enterprise@bharatcorporatetravel.com",
      hours: "24/7 Priority Corporate Concierge",
    },
    frontendAllowed: {
      profileSummary: "Premier business travel management organization delivering end-to-end annual conferences, leadership retreats, overseas delegations, GST-compliant invoicing, and automated corporate travel policy compliance.",
      servicesOffered: [
        "Annual Corporate Offsites & Team Building Retreats (50 to 1,500 Pax)",
        "Executive CXO Delegations & Luxury Boardroom Transport",
        "MICE (Meetings, Incentives, Conferences, Exhibitions) End-to-End Execution",
        "Automated Corporate Travel Policy & Approval Workflows",
      ],
      amenities: [
        "100% Automated GST Compliant Tax Invoices with Input Tax Credit (ITC)",
        "Pre-Negotiated Corporate Rates with Top 5-Star Hotel Chains",
        "Dedicated On-Ground Event Operations Manager at Destination",
        "Corporate Billing Desk with 30-Day Revolving Credit Lines",
        "Real-Time Corporate Travel Duty-of-Care & SOS Tracking",
        "Audiovisual & Keynote Conference Technology Staging",
      ],
      policies: {
        cancellation: "Flexible corporate master contract terms: Individual traveler changes permitted up to 24 hrs.",
        checkInOrBoarding: "Express VIP corporate group check-in counters arranged at hotels/airports.",
        luggageOrRules: "Corporate equipment transport and customs handling support included.",
        refund: "Credit note or bank refund issued within 48 hours for corporate accounts.",
      },
      publicPricing: {
        startingFrom: 12500,
        priceUnit: "per employee / offsite package",
        taxPercentage: 18,
        platformFee: 0,
        discountOptions: ["ENTERPRISE_VOLUME (Custom tiering for 100+ delegates)", "ANNUAL_CONTRACT (Zero Platform Booking Surcharge)"],
      },
      bookingFeatures: [
        "Multi-Tier Employee Corporate Approval Workflow (Manager -> Finance Head)",
        "Bulk Employee Traveler Manifest Upload via Excel/CSV",
        "Corporate Cost-Center & Department Code Tagging",
        "Automated Pro-Forma & Final Tax Invoice Generation",
        "Real-Time Attendance & Airport Shuttle Logistics Tracker",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "corporate_master_contracts",
        "employee_corporate_directory_sync",
        "approval_hierarchy_rule_matrix",
        "gst_itc_reconciliation_engine",
        "corporate_credit_line_ledger",
      ],
      hiddenCredentialsAndKeys: [
        "CORPORATE_ERP_SAP_CONNECTOR_KEY",
        "AMADEUS_CORP_GDS_SECRET",
        "GSTIN_GOVT_E_INVOICE_KEY",
        "CORP_CREDIT_UNDERWRITING_TOKEN",
      ],
      internalIds: ["CORP_ACC_BHARAT_MICE_9981", "ERP_SAP_NODE_BLR_002", "CREDIT_VAULT_AXIS_CORP_112"],
      backendServices: [
        "Enterprise SAP/Oracle ERP Expense Sync Microservice",
        "Multi-Level Corporate Policy Validation & Auto-Approval Engine",
        "Govt E-Invoice Real-Time IRN Generation Service",
      ],
      settlementEngineDetails: [
        "Net 30-Day Corporate Credit Line with 2.5% platform processing margin",
        "Automated GST ITC 2A/2B monthly automated reconciliation",
      ],
      securityAndAuditLogs: [
        "SOC2 Type II & ISO 27001 data privacy certified employee data vault",
        "Corporate duty-of-care live geo-tracking security logs",
      ],
      zeroFrontendExposureGuarantee: "Corporate contractual negotiated margins, ERP API credentials, and internal employee salary bands are never exposed on client apps.",
    },
    partnerListingPlans: {
      currentPlan: "Enterprise",
      planStatus: "Active",
      monthlyFee: 39999,
      inventorySlotsUsed: 95,
      inventorySlotsTotal: 100,
      searchVisibilityBoost: "Official Recommended Enterprise MICE Partner",
      featuredBadging: true,
      leadAccess: "Direct Fortune 500 & Unicorn Tech Company RFPs",
      settlementCycle: "Monthly Consolidated Invoicing (Net-30 Days)",
      commissionRatePercentage: 4.0,
      grossBookingsThisMonth: 12800000,
      netPayoutThisMonth: 12288000,
      nextPayoutDate: "1st of next month (Corporate Master Settlement)",
    },
    mockInventoryItems: [
      {
        id: "corp_goa_retreat",
        title: "Goa 5-Star Leadership Offsite & Annual Strategy Conference",
        subtitle: "3 Days / 2 Nights • 5-Star Beach Resort • Banquet Hall • Team Building",
        capacity: "50 - 400 Delegates",
        price: 18500,
        availableCount: 12,
        amenityHighlights: ["Conference AV Setup", "Gala Dinner with Live Band", "GST E-Invoice", "Airport Shuttles"],
      },
      {
        id: "corp_jim_corbett",
        title: "Corbett Wilderness Team Offsite & Wildlife Survival Challenge",
        subtitle: "3 Days / 2 Nights • Luxury Safari Resort • Outdoor Leadership Drills",
        capacity: "30 - 150 Delegates",
        price: 12500,
        availableCount: 8,
        amenityHighlights: ["Gypsy Safaris", "Leadership Coach", "Campfire Networking", "All Meals"],
      },
      {
        id: "corp_udaipur_palace",
        title: "Udaipur Royal CXO Strategic Conclave & Gala Awards",
        subtitle: "2 Days / 1 Night • Heritage Palace Hotel • High-Level Security Setup",
        capacity: "20 - 80 Executives",
        price: 26000,
        availableCount: 5,
        amenityHighlights: ["Private Yacht Conclave", "Executive Sedans", "High-Security Stays"],
      },
    ],
  },

  // 9. Cab Operator Profile
  {
    id: "cab",
    name: "BharatRide Outstation & Airport Chauffeur Network",
    categoryName: "Cab Operator Profile",
    icon: "Car",
    tagline: "Punctual Outstation Cabs, One-Way Drops, Airport Transfers & Chauffeur Services",
    badge: "Verified Top-Rated Cab Operator",
    heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.87,
    totalReviews: 6890,
    operatingBase: "Delhi NCR • Mumbai • Pune • Bangalore • Chennai • Hyderabad • Jaipur • Chandigarh",
    supportContact: {
      phone: "+91 1800-209-9022 (24/7 Dispatch Control)",
      email: "dispatch@bharatridecabs.in",
      hours: "24/7 Active Fleet Dispatch & Chauffeur Support",
    },
    frontendAllowed: {
      profileSummary: "Reliable intercity outstation and airport taxi fleet providing commercially licensed, background-verified chauffeurs, clean AC vehicles, transparent per-km billing, and zero hidden toll surprises.",
      servicesOffered: [
        "One-Way Outstation Drops (Pay Only for Distance Travelled)",
        "Round-Trip Multi-Day Leisure Roadtrips",
        "Guaranteed Punctual Airport Transfers (With Flight Delay Tracking)",
        "Hourly City Rental Packages (4h/40km, 8h/80km, 12h/120km)",
      ],
      amenities: [
        "Clean, Sanitised & Air-Conditioned Commercial Vehicles",
        "Police-Verified & Uniformed Professional Chauffeurs",
        "Fastag Included with Transparent Toll & State Tax Calculators",
        "Live GPS Shareable Ride Link for Family Tracking",
        "Complimentary Packaged Water Bottle & In-Car Phone Chargers",
        "Zero Driver Cancellation Policy (Guaranteed Backup Vehicle)",
      ],
      policies: {
        cancellation: "Free cancellation up to 2 hours prior to scheduled pickup time.",
        checkInOrBoarding: "Driver details with vehicle number sent via SMS/WhatsApp 2 hours before trip.",
        luggageOrRules: "Boot space fits 2 large suitcases in Sedan, 4 large suitcases in Innova/SUV.",
        refund: "Immediate online refund for eligible cancellations.",
      },
      publicPricing: {
        startingFrom: 11,
        priceUnit: "per km / Sedan (Base starts ₹1,499)",
        taxPercentage: 5,
        platformFee: 20,
        discountOptions: ["ONEWAY_DISCOUNT (Save up to 40% vs Roundtrip)", "AIRPORT_SPECIAL (Flat ₹100 OFF)"],
      },
      bookingFeatures: [
        "Vehicle Class Selector (Sedan Dzire/Etios, SUV Ertiga/Innova Crysta, Tempo Traveller)",
        "Real-Time Fare Calculator with Toll, State Tax & Driver Allowance Breakdown",
        "Multi-Stop Route Planning with Intermediate Drop-Off Points",
        "Instant Chauffeur Allocation & Live Telemetry Map Display",
        "Digital Trip Invoice with Exact Odometer Reading Start/End",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "cab_fleet_telemetry_live",
        "driver_background_verification_vault",
        "dispatch_matching_algorithm_weights",
        "cab_payout_daily_ledger",
      ],
      hiddenCredentialsAndKeys: [
        "GOOGLE_MAPS_DISTANCE_MATRIX_SERVER_KEY",
        "MAPMYINDIA_ENTERPRISE_ROUTING_KEY",
        "DRIVER_UPI_DISBURSEMENT_SECRET",
      ],
      internalIds: ["CAB_FLEET_BR_99182", "CHAUFFEUR_NODE_DL01_4421", "DISPATCH_GEOHASH_NCR_09"],
      backendServices: [
        "Real-Time Proximity Driver Dispatch & Allocation Engine",
        "Dynamic Toll & State Tax Computation Engine (National Highway API)",
        "Automated Daily Driver Earnings & UPI Settlement Service",
      ],
      settlementEngineDetails: [
        "Driver Commission: 12.0% platform deduction, 88% instant payout upon trip end",
        "Automated Instant UPI Payout to driver account within 5 minutes of trip completion",
      ],
      securityAndAuditLogs: [
        "Encrypted driver driving license & criminal background verification records",
        "Live SOS button event dispatch logs with nearest police PCR integration",
      ],
      zeroFrontendExposureGuarantee: "Driver private bank details, internal matching dispatch scores, and raw GPS tracker hardware keys are strictly isolated.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 11999,
      inventorySlotsUsed: 84,
      inventorySlotsTotal: 100,
      searchVisibilityBoost: "Top Recommended Outstation Cab Fleet in NCR & West India",
      featuredBadging: true,
      leadAccess: "High-Value Long Distance & Multi-Day Outstation Bookings",
      settlementCycle: "Instant Automated UPI Payout per completed ride",
      commissionRatePercentage: 12.0,
      grossBookingsThisMonth: 2150000,
      netPayoutThisMonth: 1892000,
      nextPayoutDate: "Instant Per-Ride Auto-Disbursement",
    },
    mockInventoryItems: [
      {
        id: "cab_sedan_dzire",
        title: "Prime Sedan (Swift Dzire / Toyota Etios)",
        subtitle: "4 Passengers • 2 Suitcases • AC • Professional Chauffeur",
        capacity: "4 Seats + Driver",
        price: 11,
        availableCount: 34,
        amenityHighlights: ["Fastag Included", "Water Bottle", "Phone Charger", "Clean Boot Space"],
      },
      {
        id: "cab_suv_innova",
        title: "Luxury SUV (Toyota Innova Crysta)",
        subtitle: "6/7 Passengers • 4 Large Suitcases • Captain Seats • Dual AC",
        capacity: "6/7 Seats + Driver",
        price: 17,
        availableCount: 22,
        amenityHighlights: ["Captain Seats", "High Legroom", "Dual AC", "Long Distance Comfort"],
      },
      {
        id: "cab_tempo_traveller",
        title: "Executive Luxury Tempo Traveller (12 to 17 Seater)",
        subtitle: "12-17 Passengers • 10 Suitcases • Reclining Push-Back Seats • TV",
        capacity: "16 Seats + Chauffeur",
        price: 25,
        availableCount: 8,
        amenityHighlights: ["Reclining Seats", "Audio-Video System", "Big Luggage Carrier"],
      },
    ],
  },

  // 10. Restaurant / Dhaba Operator Profile
  {
    id: "restaurant",
    name: "Haveli Grand Heritage Dhaba & Family Restaurant",
    categoryName: "Restaurant Operator Profile",
    icon: "Utensils",
    tagline: "Authentic Highway Heritage Dining, Pure Desi Ghee Flavors & Cultural Ambience",
    badge: "FSSAI 5-Star Hygiene Certified",
    heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.86,
    totalReviews: 8920,
    operatingBase: "NH-44 Murthal, Haryana & Grand Trunk Road Heritage Mile",
    supportContact: {
      phone: "+91 130-248-8900",
      email: "hospitality@havelidhabamurthal.in",
      hours: "24/7 Non-Stop Open Kitchen & Highway Hospitality",
    },
    frontendAllowed: {
      profileSummary: "Iconic North Indian highway dining establishment renowned for melting white butter parathas, authentic tandoori delicacies, traditional village cultural performances, and sparkling clean highway rest facilities.",
      servicesOffered: [
        "24/7 Grand Buffet & A La Carte Family Dining",
        "Guaranteed Table Pre-Booking for Highway Travelers",
        "Express Takeaway Food Boxes & Highway Refreshment Kits",
        "Cultural Folk Music, Pottery Making & Camel Rides for Kids",
      ],
      amenities: [
        "100% Pure Desi Ghee Preparation & Open Hygiene Kitchen",
        "Spacious Air-Conditioned Family Dining Halls",
        "Ample Free Valet Parking for 200+ Tourist Cars & Buses",
        "Pristine Clean Restrooms with Baby-Care Facilities",
        "Wheelchair-Accessible Entrances & Special Senior Citizen Seating",
        "Traditional Punjabi Chhajja, Baithak & Selfie Heritage Zones",
      ],
      policies: {
        cancellation: "Table reservations held for 20 minutes past booking time. Free cancellation up to 1 hour prior.",
        checkInOrBoarding: "Show booking confirmation SMS/QR code at the VIP Hospitality Desk for instant seating.",
        luggageOrRules: "Outside food and pets not permitted inside main air-conditioned dining halls.",
        refund: "Instant refund on pre-paid food credit if cancelled on time.",
      },
      publicPricing: {
        startingFrom: 220,
        priceUnit: "per item / Meal Combos from ₹450",
        taxPercentage: 5,
        platformFee: 0,
        discountOptions: ["HIGHWAY_SAVER (10% OFF on Pre-Booked Family Thali)", "BREAKFAST_COMBO (Free Special Chai with Paratha)"],
      },
      bookingFeatures: [
        "Real-Time Table Reservation with Time Slot & Guest Count",
        "Digital Menu Explorer with Veg / Non-Veg / Jain Indicators",
        "Pre-Order Highway Food Combos for Zero-Wait Express Service",
        "Instant VIP Seating Pass with QR Entry",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "restaurant_pos_live_orders",
        "table_capacity_allocation_matrix",
        "kitchen_inventory_ingredient_ledger",
        "restaurant_partner_settlement_db",
      ],
      hiddenCredentialsAndKeys: [
        "PETPOOJA_POS_API_SECRET",
        "FSSAI_HYGIENE_AUDIT_INTERNAL_KEY",
        "RESTAURANT_ESCROW_SETTLEMENT_KEY",
      ],
      internalIds: ["REST_HAVELI_MURTHAL_001", "KITCHEN_POS_NODE_99", "SETTLE_ACCT_PNB_88291"],
      backendServices: [
        "Kitchen Order Ticket (KOT) Direct POS Sync Service",
        "Real-Time Highway Table Availability & Waiting Time Predictor",
        "Automated Food Order Commission & Partner Settlement Engine",
      ],
      settlementEngineDetails: [
        "5.0% Platform Commission on table booking transactions and pre-paid meals",
        "T+2 Automated Daily Clearing to Restaurant Bank Account",
      ],
      securityAndAuditLogs: [
        "FSSAI food hygiene compliance daily audit logs",
        "Zero customer payment card exposure (tokenized checkout)",
      ],
      zeroFrontendExposureGuarantee: "POS integration credentials, food margin breakdowns, and partner payout account numbers remain strictly server-side.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 9999,
      inventorySlotsUsed: 45,
      inventorySlotsTotal: 50,
      searchVisibilityBoost: "Top Highway Dhaba & Dining Destination across NH-44 (+350% Leads)",
      featuredBadging: true,
      leadAccess: "Direct Tourist Bus & Family Traveler Table Bookings",
      settlementCycle: "Daily T+2 Automated Settlement",
      commissionRatePercentage: 5.0,
      grossBookingsThisMonth: 1420000,
      netPayoutThisMonth: 1349000,
      nextPayoutDate: "Tomorrow 09:00 AM IST",
    },
    mockInventoryItems: [
      {
        id: "dish_paratha_combo",
        title: "Haveli Famous Stuffed Paratha Basket (Amritsari Aloo & Paneer)",
        subtitle: "Served with Fresh White Churn Butter, Curd, Homemade Pickles & Dal Makhani",
        capacity: "Serves 1 - 2 Guests",
        price: 380,
        availableCount: 150,
        amenityHighlights: ["Fresh White Butter", "Pure Desi Ghee", "Clay Oven Tandoor", "Curd & Pickle"],
      },
      {
        id: "dish_maharaja_thali",
        title: "Grand Royal Punjab Heritage Thali",
        subtitle: "Paneer Lababdar, Dal Makhani, Pindi Chhole, Dum Aloo, Missi Roti, Pulao, Gulab Jamun & Lassi",
        capacity: "Complete Royal Feast for 1 - 2 Guests",
        price: 650,
        availableCount: 80,
        amenityHighlights: ["Unlimited Gravy Refills", "Kesar Pista Lassi", "Pure Vegetarian"],
      },
      {
        id: "dish_table_vip",
        title: "Guaranteed VIP Family Dining Table (4 to 8 Guests)",
        subtitle: "Zero Waiting Time • Dedicated Steward • Welcome Welcome Thandai Drink",
        capacity: "4 to 8 Guests",
        price: 500,
        availableCount: 6,
        amenityHighlights: ["Zero Waiting", "Welcome Drinks", "Dedicated Waiter", "AC Hall"],
      },
    ],
  },

  // 11. House Boat Operator Profile
  {
    id: "houseboat",
    name: "Alleppey Royal Waves Eco-Kettuvallam Luxury Cruises",
    categoryName: "House Boat Operator Profile",
    icon: "Ship",
    tagline: "Handcrafted Luxury Houseboat Cruises through the Serene Backwaters of Kerala",
    badge: "Kerala Tourism Gold Star Certified Houseboat",
    heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    ],
    starRating: 4.94,
    totalReviews: 2780,
    operatingBase: "Punnamada Jetty & Vembanad Lake, Alappuzha (Alleppey), Kerala",
    supportContact: {
      phone: "+91 477-289-4411",
      email: "cruises@royalwavesalleppey.com",
      hours: "07:00 AM - 10:00 PM Daily Cruise Operations",
    },
    frontendAllowed: {
      profileSummary: "Traditional Kerala wooden Kettuvallam houseboats handcrafted with anjili wood and bamboo, equipped with modern air-conditioned glass bedrooms, open upper sun-decks, private onboard chef, and authentic Karimeen fish delicacies.",
      servicesOffered: [
        "Overnight Luxury Cruise (Check-in 12:00 PM to Next Day 09:00 AM)",
        "Day Cruise through Narrow Village Canals (11:00 AM to 05:00 PM)",
        "Honeymoon Private 1-Bedroom Luxury Suite with Flower Bed Decoration",
        "Family & Corporate Multi-Bedroom Houseboats (2 to 6 Bedrooms)",
      ],
      amenities: [
        "All Kerala Traditional Meals: Lunch, Tea & Snacks, Dinner, Breakfast",
        "Fresh Backwater Karimeen Pollichathu & Traditional Kerala Curries",
        "Air-Conditioned Master Bedrooms with Attached En-Suite Bathrooms",
        "Spacious Upper Sun-Deck with 360° Panoramic Backwater Views",
        "3-Member Dedicated Private Crew: Captain, Engine Driver & Private Chef",
        "Complete Marine Safety Life-Jackets & Govt Tourism Certified Navigation",
      ],
      policies: {
        cancellation: "Full refund up to 10 days prior to cruise date. 50% refund between 4-9 days.",
        checkInOrBoarding: "Boarding at Punnamada Finishing Point Jetty at 12:00 PM (Noon).",
        luggageOrRules: "Cruising ceases at 05:30 PM as per Kerala inland marine laws; boat anchors safely in tranquil lake for night.",
        refund: "Reversal to bank/card within 5 business days.",
      },
      publicPricing: {
        startingFrom: 11500,
        priceUnit: "per 1-Bedroom Boat / Overnight (All Meals Included)",
        taxPercentage: 5,
        platformFee: 0,
        discountOptions: ["BACKWATER_HONEYMOON (Free Candlelight Dinner & Cake)", "DAY_CRUISE_SAVER (25% OFF on Day Trips)"],
      },
      bookingFeatures: [
        "Houseboat Bedroom Configuration Selector (1, 2, 3 or 4 Bed Kettuvallam)",
        "Cruise Route Preview (Vembanad Lake, Kuttanad Paddy Fields, Village Canals)",
        "Custom Meal Preference: Traditional Kerala Non-Veg, Pure Veg, or Jain Food",
        "Instant Jetty Boarding Pass with Captain Contact & Google Maps Location",
      ],
    },
    backendHiddenNeverDisplayed: {
      databaseTables: [
        "houseboat_fleet_registration_master",
        "kerala_port_department_license_vault",
        "houseboat_fuel_crew_log_internal",
        "operator_reconciliation_settlement_db",
      ],
      hiddenCredentialsAndKeys: [
        "KERALA_TOURISM_DEPT_PORT_API_KEY",
        "DTPC_ALAPPUZHA_LICENSING_SECRET",
        "HOUSEBOAT_PARTNER_ESCROW_VAULT_KEY",
      ],
      internalIds: ["HB_ALPY_ROYAL_WAVES_0088", "PORT_LIC_KL04_9921", "SETTLE_ACCT_FEDERAL_BANK_771"],
      backendServices: [
        "Kerala Inland Vessel Pollution & Safety Compliance Engine",
        "Jetty Berth Allocation & Real-Time Weather Advisory Service",
        "Houseboat Operator Commission & Milestone Payout Engine",
      ],
      settlementEngineDetails: [
        "7.0% Standard OTA Commission",
        "Milestone Payout: 50% on booking lock, 50% upon successful cruise check-in",
      ],
      securityAndAuditLogs: [
        "Kerala Inland Waterways Authority compliance audit logs",
        "Emergency marine response dispatch connection logs",
      ],
      zeroFrontendExposureGuarantee: "Marine license records, fuel cost structures, and operator bank coordinates are strictly secluded on server-side microservices.",
    },
    partnerListingPlans: {
      currentPlan: "Platinum",
      planStatus: "Active",
      monthlyFee: 12999,
      inventorySlotsUsed: 8,
      inventorySlotsTotal: 10,
      searchVisibilityBoost: "Top 1 Featured Houseboat in Alleppey Backwaters (+280% Inquiries)",
      featuredBadging: true,
      leadAccess: "Direct Luxury Honeymooners & Family Holiday Cruises",
      settlementCycle: "Milestone Payout (50% on Booking, 50% on Check-in)",
      commissionRatePercentage: 7.0,
      grossBookingsThisMonth: 1890000,
      netPayoutThisMonth: 1757700,
      nextPayoutDate: "Every Monday Jetty Settlement",
    },
    mockInventoryItems: [
      {
        id: "hb_1bed_honeymoon",
        title: "Royal 1-Bedroom Luxury Honeymoon Houseboat",
        subtitle: "1 AC Master Bedroom • Upper Sundeck • Private Chef & Crew • All Meals",
        capacity: "2 Adults (Ideal for Couples)",
        price: 11500,
        availableCount: 3,
        amenityHighlights: ["All Meals Included", "Karimeen Fish", "Sundeck", "Candlelight Dinner"],
      },
      {
        id: "hb_2bed_family",
        title: "Imperial 2-Bedroom Deluxe Family Houseboat",
        subtitle: "2 AC Master Bedrooms • Large Living Area • Dining Table • Glass Enclosed",
        capacity: "4 Adults + 2 Children",
        price: 16500,
        availableCount: 2,
        amenityHighlights: ["2 Attached Bathrooms", "Living Hall", "Traditional Feast", "Village Cruise"],
      },
      {
        id: "hb_4bed_grand",
        title: "Maharaja 4-Bedroom Ultra-Luxury Cruise Vessel",
        subtitle: "4 AC Suites • Expansive 2nd Floor Party Deck • Conference Ready",
        capacity: "8 to 12 Guests",
        price: 29999,
        availableCount: 1,
        amenityHighlights: ["Jacuzzi on Deck", "4 Master Suites", "BBQ Grill", "Dedicated 5-Crew"],
      },
    ],
  },
];
