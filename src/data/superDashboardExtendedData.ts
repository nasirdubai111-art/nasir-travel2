export interface FrontendModuleItem {
  moduleName: string;
  features: string;
  demoValue: string;
  status: "Active" | "Verified" | "Live";
}

export interface ListingPlanSpec {
  planName: string;
  listingDuration: string;
  packageOrListingLimit: string;
  packageVisibility: string;
  featuredListingEligibility?: string;
  featuredListingOption?: string;
  leadBookingAccess?: string;
  planStatus: string;
}

export interface CommissionSpec {
  applicableCommissionPlan: string;
  bookingCommission: string;
  commissionAmountStatus: string;
  netOperatorAmount: string;
  settlementStatus: string;
}

export interface OperatorDeepSpecification {
  id: string;
  categoryName: string;
  operatorTitle: string;
  frontendModulesTable: FrontendModuleItem[];
  operatorDashboardManageList: string[];
  listingPlan: ListingPlanSpec;
  commission: CommissionSpec;
  backendModulesNeverDisplayed: string[];
  backendDataNeverDisplayed: string[];
  architectureAscii: string;
  architectureNotes: string;
  liveInteractiveDemoData: {
    propertyOrCompanyName: string;
    description: string;
    ratingScore: string;
    facilitiesOrServicesList: string[];
    policiesMap: {
      checkInCheckOut: string;
      cancellation: string;
      guestAndProperty: string;
      refundStatus: string;
    };
    pricingBreakdown: {
      basePrice: number;
      unit: string;
      taxesGst: number;
      platformFee: number;
      discounts: string;
      finalPrice: number;
    };
    itineraryOrActivities?: Array<{ day: string; title: string; highlight: string }>;
    destinationsOrServiceAreas?: string[];
    approvalWorkflow?: {
      corporateLevels: string[];
      currentStatus: string;
      invoiceNumber: string;
    };
  };
}

export const OPERATOR_DEEP_SPECS: Record<string, OperatorDeepSpecification> = {
  // =========================================================================
  // 1. LODGE PROFILE
  // =========================================================================
  lodge: {
    id: "lodge",
    categoryName: "Lodge Profile",
    operatorTitle: "Corbett Wilderness Eco-Lodge & Safari Haven",
    frontendModulesTable: [
      {
        moduleName: "Lodge Profile",
        features: "Lodge name, logo, description, category, ratings",
        demoValue: "Corbett Wilderness Eco-Lodge • 4.82★ (890+ Verified Reviews) • Eco-Certified Heritage Category",
        status: "Active",
      },
      {
        moduleName: "Lodge Details",
        features: "Property information, facilities, services",
        demoValue: "18 Rustic Cottages & Swiss Safari Glamping Tents on Kosi Riverbanks • Forest Naturalist Desk",
        status: "Verified",
      },
      {
        moduleName: "Photos & Gallery",
        features: "Lodge photos, room photos, surroundings",
        demoValue: "34 High-Res Photographs • Riverfront Drone Views • Stargazing Campfire Grounds",
        status: "Live",
      },
      {
        moduleName: "Room Details",
        features: "Room type, beds, occupancy, facilities",
        demoValue: "Riverfront Wooden Cottage (King Bed, 2+1 Occ), Swiss Safari Glamping Tent (Double Bed, 2 Occ)",
        status: "Active",
      },
      {
        moduleName: "Facilities",
        features: "Wi-Fi, parking, AC, food, hot water, etc.",
        demoValue: "Solar Hot Water, Village-Style Organic Buffet, Starlink Satellite Wi-Fi, Free 4x4 Parking",
        status: "Active",
      },
      {
        moduleName: "Location",
        features: "Address, map, nearby places",
        demoValue: "Dhikala Gate Eco-Zone, Ramnagar, Uttarakhand • 4.2 km from Corbett Museum",
        status: "Verified",
      },
      {
        moduleName: "Policies",
        features: "Check-in/out, cancellation, guest and property policies",
        demoValue: "Check-in 01:00 PM / Check-out 11:00 AM • Silent Hours 10:00 PM • Free cancel 7 days prior",
        status: "Active",
      },
      {
        moduleName: "Booking Date",
        features: "Check-in, check-out, guests, rooms",
        demoValue: "Interactive Date Picker • Night Count Calculator • Dynamic Room & Guest Counters",
        status: "Live",
      },
      {
        moduleName: "Availability",
        features: "Available rooms for selected dates",
        demoValue: "Real-time query: 4 River Cottages & 2 Safari Tents remaining for upcoming weekend",
        status: "Live",
      },
      {
        moduleName: "Pricing",
        features: "Room price, taxes, discounts, platform fee, final price",
        demoValue: "₹4,200/night + 12% GST (₹504) - SAFARICOMBO Disc (₹420) + ₹0 Fee = ₹4,284 Final",
        status: "Active",
      },
      {
        moduleName: "Booking",
        features: "Guest details → payment → confirmation",
        demoValue: "3-Step Instant Confirmation: Guest Details → UPI/Card Gateway → QR Digital Voucher",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation request, eligibility, refund status",
        demoValue: "1-Click Cancellation Portal • Auto-calculated refund matrix • 5-day bank refund SLA",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer feedback and ratings",
        demoValue: "4.82★ Average • 98% Recommended for Nature & Birding • Verified Resident Reviews",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Lodge profile (Name, Tagline, Category, Badges, Operating Description)",
      "Photos (Upload, High-Res Categorisation: Exterior, Rooms, Dining, Forest Grounds)",
      "Rooms and room types (Cottages, Glamping Tents, Family Treehouse Suites)",
      "Facilities (Wi-Fi, Organic Farm Dining, Campfire, Solar Geysers, EV Charging)",
      "Room availability (Real-time calendar slot lock & maintenance overrides)",
      "Pricing (Base season rate, weekend dynamic surge, special festival rates)",
      "Booking calendar (Day/Week/Month graphical occupancy view)",
      "Reservations (Live list of active, checked-in & upcoming guest arrivals)",
      "Cancellations (Approval queue, retention deductions, refund trigger status)",
      "Customer reviews (Public reply desk, rating analytics, guest sentiment score)",
      "Listing Plan (Tier inspection: Gold Active, 15 inventory slots, Featured booster)",
      "Commission Plan (6.5% contracted OTA commission rate, GST invoices)",
      "Earnings (Gross room revenue, TDS withholding, platform brokerage breakdown)",
      "Settlement status (Bi-weekly automated bank wire clearing: 1st & 15th of each month)",
    ],
    listingPlan: {
      planName: "Gold Partner Wildlife Listing",
      listingDuration: "12 Months (Auto-Renewing)",
      packageOrListingLimit: "15 Active Room / Cottage Types",
      packageVisibility: "Top 3 Rank in Corbett Eco-Zone Searches (+120% Leads)",
      featuredListingEligibility: "Eligible (Eco-Certified Wildlife Badge Displayed)",
      leadBookingAccess: "Direct Safari & Glamping Traveler Booking Desk",
      planStatus: "Active & Verified",
    },
    commission: {
      applicableCommissionPlan: "Eco-Lodge Tier B Standard Commission Plan",
      bookingCommission: "6.5% on Gross Room Booking Value",
      commissionAmountStatus: "₹44,200 Deducted on ₹6,80,000 MTD Bookings (Settled)",
      netOperatorAmount: "₹6,35,800 Transferred to Partner Bank Account",
      settlementStatus: "Cleared & Reconciled (Next Batch: 1st of next month)",
    },
    backendModulesNeverDisplayed: [
      "Lodge Property Service",
      "Lodge Profile Service",
      "Room Management Service",
      "Inventory Service",
      "Availability Engine",
      "Rate Management Engine",
      "Booking Engine",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Service",
      "Commission Engine",
      "Settlement Service",
      "Partner Account Service",
      "KYC / Verification Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Internal property/partner IDs (e.g., LDG_CORBETT_ECO_0912, PARTNER_NODE_992)",
      "Inventory database (raw SQL schema, room block allocations, row-level locks)",
      "Partner account credentials (hashed passwords, private bank IFSC/RTGS tokens)",
      "Internal rate-management rules (dynamic yield multiplier formulas, base floors)",
      "Commission calculation logic (algorithmic tier weighting, GST/TDS split rules)",
      "Settlement calculation details (escrow holdbacks, banking batch transaction IDs)",
      "Listing-plan configuration (internal billing cycle tokens, quota overrides)",
      "API keys/secrets (UTTARAKHAND_FOREST_DEPT_API_KEY, RAZORPAY_ROUTE_SECRET)",
      "Authentication tokens (JWT bearer private keys, session HMAC cookies)",
      "KYC documents (Proprietor PAN card, GSTIN filings, Land registry deeds)",
      "Database schema/queries (PostgreSQL migrations, DDL statements, raw execution plans)",
      "Admin controls (Platform superuser overrides, partner account suspension switches)",
      "Audit/security logs (IP access logs, failed auth attempts, vulnerability scanners)",
      "Server configuration (NGINX upstream clusters, Docker environment variables)",
      "Internal API endpoints (e.g., /internal/v1/settlement/payout-execute)",
      "Stack traces (Server-side error call stacks, debug telemetry payloads)",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Core Rule: Frontend shows only authorized lodge/profile, availability, pricing and booking information. Backend modules remain server-side and are never displayed or exposed to the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Corbett Wilderness Eco-Lodge",
      description: "Riverfront eco-haven featuring handcrafted stone cottages and Swiss luxury safari tents along the pristine Kosi River.",
      ratingScore: "4.82★ (890 reviews)",
      facilitiesOrServicesList: [
        "High-Speed Satellite Wi-Fi",
        "Solar 24/7 Hot Water",
        "Organic Farm Buffet (AP Plan)",
        "Nightly Campfire & Folk Music",
        "Forest Naturalist Safari Desk",
        "Free 4x4 Gypsy Parking",
      ],
      policiesMap: {
        checkInCheckOut: "Check-in: 01:00 PM • Check-out: 11:00 AM",
        cancellation: "Free cancellation up to 7 days before check-in date.",
        guestAndProperty: "Strict silent hours after 10:00 PM to protect forest fauna.",
        refundStatus: "100% refund credited within 5 bank business days.",
      },
      pricingBreakdown: {
        basePrice: 4200,
        unit: "per cottage / night",
        taxesGst: 504,
        platformFee: 0,
        discounts: "SAFARICOMBO (-₹420)",
        finalPrice: 4284,
      },
    },
  },

  // =========================================================================
  // 2. RESORT PROFILE
  // =========================================================================
  resort: {
    id: "resort",
    categoryName: "Resort Profile",
    operatorTitle: "Goa Beachfront Palms & Wellness Spa Resort",
    frontendModulesTable: [
      {
        moduleName: "Resort Profile",
        features: "Resort name, logo, description, category/rating",
        demoValue: "Goa Beachfront Palms & Wellness Spa Resort • 5-Star Luxury Beach Resort • 4.91★ (3,100+ Reviews)",
        status: "Active",
      },
      {
        moduleName: "Resort Details",
        features: "Property highlights, facilities and services",
        demoValue: "20-Acre Oceanfront Sanctuary • Direct Varca Beach Access • 2 Olympic Lagoon Pools • Ayurvedic Spa",
        status: "Verified",
      },
      {
        moduleName: "Rooms / Villas",
        features: "Room/villa type, occupancy, beds, facilities, photos",
        demoValue: "Oceanfront Sunset Beach Villa (King Bed, 2+2 Occ), Lagoon View Deluxe Suite (King/Twin, 2+1 Occ)",
        status: "Live",
      },
      {
        moduleName: "Facilities",
        features: "Pool, restaurant, parking, Wi-Fi, spa, recreation, etc.",
        demoValue: "2 Lagoon Pools, 3 Seafood Shacks, Valet Parking, Oceanfront Yoga Deck, Kids Play Hub",
        status: "Active",
      },
      {
        moduleName: "Activities",
        features: "Adventure, sightseeing, indoor/outdoor activities",
        demoValue: "Private Sunset Yacht Charters, Jet Skiing, Beach Volleyball, Ayurvedic Panchakarma Sessions",
        status: "Active",
      },
      {
        moduleName: "Photos & Gallery",
        features: "Resort, rooms/villas, facilities and surroundings",
        demoValue: "48 Curated Photographs • 360° Villa Virtual Walkthrough • Sunset Drone Panorama",
        status: "Live",
      },
      {
        moduleName: "Packages",
        features: "Stay packages, activity packages, meal packages, special offers",
        demoValue: "Honeymoon Sunset Escape (3N), Ayurvedic Detox Wellness (5N), Family Splash Holiday (2N)",
        status: "Active",
      },
      {
        moduleName: "Policies",
        features: "Check-in/out, cancellation, child, guest and property policies",
        demoValue: "Check-in: 03:00 PM / Check-out: 12:00 PM • Free cancel up to 72 hrs prior • Kids under 6 stay free",
        status: "Active",
      },
      {
        moduleName: "Date Selection",
        features: "Check-in, check-out, guests and rooms/villas",
        demoValue: "Interactive Dynamic Calendar • Peak Season Price Estimator • Extra Bedding Toggles",
        status: "Live",
      },
      {
        moduleName: "Availability",
        features: "Available rooms/villas and packages",
        demoValue: "3 Sunset Beach Villas, 8 Lagoon Suites & 1 Presidential Pool Villa Available",
        status: "Live",
      },
      {
        moduleName: "Selection",
        features: "Room/villa selection and package selection",
        demoValue: "1-Click Villa Selection + Meal Plan Addon (Breakfast Only / Half Board / All-Inclusive)",
        status: "Active",
      },
      {
        moduleName: "Guest Details",
        features: "Guest/passenger information",
        demoValue: "Lead Guest Name, Mobile Number, Government Photo ID, Special Arrival Notes",
        status: "Verified",
      },
      {
        moduleName: "Pricing",
        features: "Room/villa/package price, taxes, discounts, platform fee",
        demoValue: "₹14,500/night + 18% GST (₹2,610) - GOA_SUMMER_ESCAPE (₹2,900) + ₹0 Fee = ₹14,210 Final",
        status: "Active",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "PCI-DSS Level 1 Gateway • UPI, Cards, NetBanking, International Cards with 3D Secure",
        status: "Live",
      },
      {
        moduleName: "Booking",
        features: "Booking confirmation and reservation details",
        demoValue: "Instant Digital Voucher • QR Mobile Check-in Pass • SMS & WhatsApp Confirmation",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation eligibility and refund status",
        demoValue: "Self-service Cancellation Console • Automated 48-Hour Refund Gateway Dispatch",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer reviews and ratings",
        demoValue: "4.91★ Overall Score • Cleanliness 4.95★ • Hospitality 4.98★ • Food & Dining 4.88★",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Resort profile (Luxury branding, certifications, amenity highlights, operating hours)",
      "Rooms/villas (Villa categories, square footage, bed configurations, private plunge pools)",
      "Facilities (Lagoon swimming pools, spa treatment rooms, private beach cabanas)",
      "Activities (Water sports, yacht charter schedule, sunrise yoga sessions, live music)",
      "Photos (High-definition photography asset library & 360° virtual tour staging)",
      "Packages (Seasonal stay packages, honeymoon bundles, Ayurvedic spa detox plans)",
      "Availability (Live villa inventory calendar, blackout dates, VIP hold allotments)",
      "Booking calendar (Multi-villa visual timeline with guest check-in & check-out statuses)",
      "Pricing (Dynamic yield rate management, weekend surge rates, minimum length of stay rules)",
      "Reservations (Guest reservation ledger with meal plans, flight arrival times & special requests)",
      "Cancellations (Cancellation request management, retention policy application, refund triggers)",
      "Reviews (Guest feedback response portal, sentiment analysis, concierge action tracking)",
      "Listing Plan (Platinum Luxury Tier Active, 60 inventory slots, Maximum visibility boost)",
      "Commission Plan (7.5% contracted commission rate, automated GST billing statements)",
      "Earnings (Gross room & package revenue, F&B commission splits, monthly payout reports)",
      "Settlement status (Weekly automated bank transfer every Wednesday 11:00 AM IST)",
    ],
    listingPlan: {
      planName: "Platinum Luxury Resort Showcase Plan",
      listingDuration: "12 Months Multi-Year Contract",
      packageOrListingLimit: "60 Active Room & Villa Categories",
      packageVisibility: "Top Recommended Luxury Resort in Goa (+300% Engagement)",
      featuredListingEligibility: "Eligible (5-Star Luxury Platinum Badge Displayed)",
      leadBookingAccess: "High-Value Honeymoon, Destination Wedding & MICE Channel",
      planStatus: "Active & Reconciled",
    },
    commission: {
      applicableCommissionPlan: "Luxury Resort 5-Star Contract Tier A",
      bookingCommission: "7.5% Contracted Rate on Completed Check-Outs",
      commissionAmountStatus: "₹3,66,750 Deducted on ₹48,90,000 MTD Bookings (Reconciled)",
      netOperatorAmount: "₹45,23,250 Transferred via NEFT/RTGS Batch",
      settlementStatus: "Cleared (Next Batch: Coming Wednesday 11:00 AM IST)",
    },
    backendModulesNeverDisplayed: [
      "Resort Property Service",
      "Resort Profile Service",
      "Room/Villa Management Service",
      "Inventory Service",
      "Availability Engine",
      "Rate Management Engine",
      "Package Management Service",
      "Activity Management Service",
      "Booking Engine",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Service",
      "Commission Engine",
      "Settlement Service",
      "Partner Management Service",
      "Partner API Integration",
      "KYC / Verification Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Internal resort/property IDs (e.g., RST_GOA_PALMS_8831, RESV_NODE_GOA_9918)",
      "Room/villa inventory database (raw SQL schema, dynamic room locks, PMS allocations)",
      "Internal availability logic (yield overbooking buffer calculations, group blocks)",
      "Rate-management rules (BAR rate parity algorithms, minimum night rate ladders)",
      "Partner API credentials (MICROS_FIDELIO_KEY, OPERA_CONNECTOR_SECRET)",
      "API keys/secrets (STRIPE_LIVE_SECRET, RAZORPAY_RESORT_KEY, SMS_GATEWAY_TOKEN)",
      "Commission calculation logic (tiered brokerage equations, corporate tax split)",
      "Settlement calculations (rolling reserve escrow deposits, bank clearing batch numbers)",
      "Internal listing-plan configuration (billing discount multipliers, custom override flags)",
      "Partner/KYC records (GST registration certificates, bank cancelled cheques, director PAN)",
      "Authentication tokens (OAuth2 refresh tokens, JWT server signatures, session caches)",
      "Database schema and queries (PostgreSQL schema definitions, SQL trigger functions)",
      "Admin controls (Platform super-admin console access, account lockout triggers)",
      "Audit/security logs (SOC2 compliance traces, failed administrative login audits)",
      "Server configuration (Kubernetes ingress routes, Redis cluster connection strings)",
      "Internal API endpoints (e.g., /api/internal/v1/resort/yield-compute)",
      "Internal error/stack traces (Java/Node runtime stack dumps, memory diagnostic traces)",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Core Rule: The frontend displays only authorized resort information, availability, packages, pricing and booking functions. Inventory, rate management, partner APIs, commission, settlement, databases, credentials and internal backend services remain server-side and are never displayed on the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Goa Beachfront Palms & Wellness Spa Resort",
      description: "Expansive 20-acre beachfront sanctuary featuring Portuguese-style sea villas, direct white sand beach access, 2 Olympic lagoon pools, and holistic Ayurvedic wellness.",
      ratingScore: "4.91★ (3,100 reviews)",
      facilitiesOrServicesList: [
        "Direct Private Access to Varca White Sand Beach",
        "2 Freeform Olympic Lagoon Pools + Kid's Splash Zone",
        "Ayurvedic Panchakarma Spa & Sunrise Yoga",
        "Multi-Cuisine Seafood Shacks & Continental Bistro",
        "Private Sunset Yacht & Water Sports Desk",
        "Luxury Airport Limousine Pickup",
      ],
      policiesMap: {
        checkInCheckOut: "Check-in: 03:00 PM • Check-out: 12:00 PM (Noon)",
        cancellation: "Free cancellation up to 72 hours prior to arrival date.",
        guestAndProperty: "Pool open 07:00 AM - 08:00 PM. Proper swimwear mandatory.",
        refundStatus: "100% refund initiated within 48 hours to original payment mode.",
      },
      pricingBreakdown: {
        basePrice: 14500,
        unit: "per villa / night",
        taxesGst: 2610,
        platformFee: 0,
        discounts: "GOA_SUMMER_ESCAPE (-₹2,900)",
        finalPrice: 14210,
      },
    },
  },

  // =========================================================================
  // 3. PILGRIMAGE TOUR OPERATOR PROFILE
  // =========================================================================
  pilgrimage: {
    id: "pilgrimage",
    categoryName: "Pilgrimage Tour Operator Profile",
    operatorTitle: "Divya Darshan Sacred Yatra Travels",
    frontendModulesTable: [
      {
        moduleName: "Operator Profile",
        features: "Operator/company name, logo, description, experience, ratings",
        demoValue: "Divya Darshan Sacred Yatra Travels • 18 Years Devotional Experience • Govt. Approved • 4.96★ (5,400+ Reviews)",
        status: "Active",
      },
      {
        moduleName: "Yatra Package",
        features: "Package name, destination, duration, package highlights",
        demoValue: "Sacred Chardham Yatra by Luxury Coach (11D/10N), Kashi Vishwanath & Ayodhya Ram Mandir (4D/3N)",
        status: "Verified",
      },
      {
        moduleName: "Itinerary",
        features: "Day-wise itinerary, travel route, sightseeing/temple schedule",
        demoValue: "Day 1: Haridwar → Barkot; Day 2: Yamunotri Holy Dip; Day 3: Uttarkashi; Day 4: Gangotri Aarti...",
        status: "Live",
      },
      {
        moduleName: "Temples / Pilgrimage Places",
        features: "Temple names, locations, visit schedule, important information",
        demoValue: "Yamunotri, Gangotri, Kedarnath Jyotirlinga, Badrinath, Kashi Vishwanath, Ayodhya Ram Mandir",
        status: "Active",
      },
      {
        moduleName: "Travel Dates",
        features: "Available departure dates, return dates, duration",
        demoValue: "Upcoming Departures: Every Saturday & Tuesday • May through November Yatra Calendar",
        status: "Live",
      },
      {
        moduleName: "Group Capacity",
        features: "Available seats/spots, minimum/maximum group size",
        demoValue: "Group Size: 24 to 36 Devotees per Deluxe Coach • 8 Seats Remaining on Next Departure",
        status: "Active",
      },
      {
        moduleName: "Inclusions",
        features: "Transport, accommodation, meals, darshan/entry where applicable, guide/services",
        demoValue: "AC Deluxe Coach, Verified 3-Star Yatri Niwas Hotels, 100% Pure Veg Sattvic Food, VIP Darshan Desk, Pujari Guide",
        status: "Active",
      },
      {
        moduleName: "Exclusions",
        features: "Services not included in package price",
        demoValue: "Pony / Palki / Doli charges at Kedarnath, Personal laundry, Special VIP pooja dakshina",
        status: "Active",
      },
      {
        moduleName: "Package Policies",
        features: "Cancellation, refund, age, travel and booking policies",
        demoValue: "Free cancellation 15 days prior • Medical fitness mandatory for high altitude • 100% Pure Jain/Veg meals",
        status: "Verified",
      },
      {
        moduleName: "Package Search",
        features: "Destination → dates → travellers/group",
        demoValue: "Quick Sacred Search: Destination (Chardham, Kashi, Tirupati) → Month/Date → Devotee Count",
        status: "Live",
      },
      {
        moduleName: "Date Selection",
        features: "Select available yatra date",
        demoValue: "Interactive Departure Picker with Auspicious Tithi & Shubh Muhurat Highlights",
        status: "Live",
      },
      {
        moduleName: "Group Selection",
        features: "Number of travellers/group size",
        demoValue: "Devotee Counter with Senior Citizen Assistance & Wheelchair/Porter Flagging",
        status: "Active",
      },
      {
        moduleName: "Passenger Details",
        features: "Traveller names, age and required booking information",
        demoValue: "Yatri Full Names, Age, Aadhaar Card Numbers, Emergency Family Contact, Health Status",
        status: "Verified",
      },
      {
        moduleName: "Pricing",
        features: "Package price, taxes, discounts, platform fee and final amount",
        demoValue: "₹28,500/person + 5% GST (₹1,425) - SENIORDEVOTEE Disc (₹1,500) + ₹0 Platform Fee = ₹28,425 Final",
        status: "Active",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "Secure UPI, NetBanking, Debit/Credit Card or 3-part Milestone Payment (30% Advance, 70% at Departure)",
        status: "Live",
      },
      {
        moduleName: "Booking",
        features: "Booking confirmation and package details",
        demoValue: "Instant Yatra Confirmation Kit • Yatri Registration QR Pass • WhatsApp Itinerary Pack",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation request and refund status",
        demoValue: "Automated Yatra Cancellation Desk • Transparent slabs based on yatra departure date",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer feedback and ratings",
        demoValue: "4.96★ Rating • 99% Recommended by Senior Pilgrims • Praise for Sattvic Food & Pujari Guides",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Operator profile (Company history, religious approvals, guide credentials, awards)",
      "Yatra packages (Chardham, Jyotirlinga Darshan, Ram Mandir Yatra, Tirupati Express)",
      "Destinations (Kedarnath, Badrinath, Kashi, Rameshwaram, Dwarka, Puri)",
      "Temples/pilgrimage places (Temple timings, VIP darshan passes, aarti schedules)",
      "Day-wise itinerary (Route stops, scenic halts, spiritual discourses, night stays)",
      "Travel dates (Seasonal departure schedules, batch capacity limits, shubh muhurat flags)",
      "Group capacity (Coach seat allocations, pilgrim group size thresholds)",
      "Package inclusions/exclusions (Sattvic meals, hotel star ratings, porter assistance)",
      "Package pricing (Per devotee pricing, triple sharing discounts, single room supplements)",
      "Availability (Real-time seat availability across upcoming yatra batches)",
      "Bookings (Pilgrim manifest, senior citizen assistance requests, room allotments)",
      "Passenger information (Aadhaar validation status, emergency medical contacts)",
      "Cancellations (Batch cancellation handling, weather-contingency rescheduling)",
      "Reviews (Pilgrim testimony desk, temple video reviews, prasad satisfaction ratings)",
      "Listing Plan (Platinum Pilgrimage Master Plan, 35 yatra packages, Featured positioning)",
      "Commission Plan (5.0% flat platform commission, GST billing statements)",
      "Earnings (Gross pilgrimage revenues, advance payment escrow balances, net payouts)",
      "Settlement status (Weekly automated bank settlements every Monday 10:00 AM IST)",
    ],
    listingPlan: {
      planName: "Platinum Sacred Pilgrimage Yatra Tier",
      listingDuration: "12 Months (Full Yatra Season)",
      packageOrListingLimit: "35 Active Yatra Packages Allowed",
      packageVisibility: "Top Search Priority for Chardham, Kashi, Ayodhya & Tirupati (+280% Leads)",
      featuredListingEligibility: "Eligible (Govt. Approved Religious Specialist Badge)",
      leadBookingAccess: "Direct Devotee & Senior Citizen Group Charter Desk",
      planStatus: "Active & Verified",
    },
    commission: {
      applicableCommissionPlan: "Pilgrimage Yatra Tier 1 Preferred Partner Plan",
      bookingCommission: "5.0% on Gross Yatra Booking Value",
      commissionAmountStatus: "₹1,47,500 Deducted on ₹29,50,000 MTD Bookings (Cleared)",
      netOperatorAmount: "₹28,02,500 Disbursed to Operator Escrow Account",
      settlementStatus: "Settled (Weekly Payout Batch: Every Monday 10:00 AM IST)",
    },
    backendModulesNeverDisplayed: [
      "Operator Management Service",
      "Operator Profile Service",
      "Yatra Package Engine",
      "Destination Service",
      "Temple / Pilgrimage Place Service",
      "Itinerary Engine",
      "Travel Date Service",
      "Group Inventory Service",
      "Availability Engine",
      "Passenger/Traveller Service",
      "Booking Engine",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "KYC / Verification Service",
      "Partner Management Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Internal operator IDs (e.g., PLG_OP_DIVYA_0982, YATRA_NODE_KEDAR_771)",
      "Package-engine logic (seat yield algorithms, dynamic coach fill rate calculators)",
      "Group-inventory database (raw seat matrix, room pooling tables, pilgrim PII data)",
      "KYC documents/data (Govt religious registration certificates, driver commercial licenses)",
      "Internal commission rules (volume discount rebate thresholds, agent kickbacks)",
      "Settlement calculation logic (temple trust donation splits, driver stipend ledgers)",
      "Listing-plan configuration rules (backend subscription status, manual quota boosts)",
      "API keys and secrets (TEMPLE_TRUST_VIP_GATEWAY_KEY, IRCTC_CHARTER_SECRET)",
      "Authentication tokens (Yatra desk admin JWTs, session tokens, SMS OTP hashes)",
      "Database schema/queries (PostgreSQL yatra tables, relational foreign keys, DDL files)",
      "Admin controls (Platform override switches, blacklist operator triggers)",
      "Audit/security logs (Passenger identity audit logs, server access telemetry)",
      "Server configuration (Node/Spring Boot server environment configurations)",
      "Internal API endpoints (e.g., /internal/v1/yatra/reconcile-temple-passes)",
      "Internal error/stack traces (System stack dumps, database timeout trace logs)",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Final Rule: Frontend = profile, packages, dates, availability, pricing and booking functions. Backend = package engine, group inventory, KYC, commission, settlement, databases, credentials and internal services; these must never be rendered or exposed in the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Divya Darshan Sacred Yatra Travels",
      description: "Dedicated spiritual pilgrimage operator with 18+ years experience guiding devotees through Chardham, Jyotirlingas, and holy shrines with pure sattvic meals and VIP darshan assistance.",
      ratingScore: "4.96★ (5,400 reviews)",
      facilitiesOrServicesList: [
        "AC 2x2 Deluxe Pushback Coaches with Air Suspension",
        "100% Pure Vegetarian & Sattvic Buffet Meals Included",
        "Experienced Pujari & Spiritual Guide Onboard",
        "Temple Trust Darshan Token Pre-Arrangement Desk",
        "24/7 Medical First-Aid & Portable Oxygen Cylinders",
        "Verified 3-Star Deluxe Yatri Niwas Accommodations",
      ],
      policiesMap: {
        checkInCheckOut: "Coach Departure: 05:30 AM sharp from designated Haridwar / Delhi boarding points.",
        cancellation: "100% refund 15 days prior to yatra date. 50% refund between 7-14 days.",
        guestAndProperty: "Strictly vegetarian tour. Alcohol and tobacco strictly banned on yatra.",
        refundStatus: "Refund processed within 7 bank working days to original bank/UPI.",
      },
      pricingBreakdown: {
        basePrice: 28500,
        unit: "per devotee (All-Inclusive)",
        taxesGst: 1425,
        platformFee: 0,
        discounts: "SENIORDEVOTEE (-₹1,500)",
        finalPrice: 28425,
      },
      itineraryOrActivities: [
        { day: "Day 1", title: "Haridwar to Barkot via Mussoorie", highlight: "Kempty Falls halt • Evening Ganga Aarti at Yamuna Ashram" },
        { day: "Day 2", title: "Yamunotri Dham Holy Trek & Darshan", highlight: "Surya Kund hot spring holy dip • Divine Yamunotri temple darshan" },
        { day: "Day 3", title: "Barkot to Uttarkashi", highlight: "Kashi Vishwanath Uttarkashi temple aarti • Bhagirathi bank stay" },
        { day: "Day 4", title: "Uttarkashi to Gangotri & Guptkashi", highlight: "Holy dip in Bhagirathi at Gangotri Dham • Sacred prayer ceremony" },
      ],
      destinationsOrServiceAreas: ["Chardham Yatra (Uttarakhand)", "Kashi Vishwanath & Ayodhya (UP)", "12 Jyotirlinga Darshan", "Tirupati Balaji & Meenakshi (South India)"],
    },
  },

  // =========================================================================
  // 4. TOUR OPERATOR PROFILE
  // =========================================================================
  tour: {
    id: "tour",
    categoryName: "Tour Operator Profile",
    operatorTitle: "Incredible Himalayas & Pan-India Expeditions",
    frontendModulesTable: [
      {
        moduleName: "Tour Operator Profile",
        features: "Company name, logo, description, experience, ratings",
        demoValue: "Incredible Himalayas & Pan-India Expeditions • ISO Certified • 12 Years Experience • 4.93★ (4,120+ Reviews)",
        status: "Active",
      },
      {
        moduleName: "Destinations",
        features: "Destination name, cities/places covered, highlights",
        demoValue: "Leh Ladakh, Spiti Valley, Kashmir Paradise, Rajasthan Royal Circuit, Meghalaya Living Root Bridges",
        status: "Verified",
      },
      {
        moduleName: "Tour Packages",
        features: "Package name, duration, destination, package highlights",
        demoValue: "Leh Ladakh 4x4 Mountain Safari (7D/6N), Kashmir Heaven on Earth (6D/5N), Spiti Circuit (9D/8N)",
        status: "Live",
      },
      {
        moduleName: "Itinerary",
        features: "Day-wise itinerary, sightseeing and activities",
        demoValue: "Detailed Day 1 to Day 7 Breakdown: Pangong Lake Camping, Khardung La Pass (18,380ft), Nubra Valley ATV",
        status: "Active",
      },
      {
        moduleName: "Travel Dates",
        features: "Departure dates, return dates, duration",
        demoValue: "Fixed Weekly Departures: Every Saturday from May to October • Custom Private Group Dates Available",
        status: "Live",
      },
      {
        moduleName: "Inclusions",
        features: "Transport, accommodation, meals, activities, guide/services",
        demoValue: "Customized 4x4 SUVs / Bikes, Handpicked Luxury Camps & 4-Star Hotels, MAP Meals, Inner Line Permits, Certified Guides",
        status: "Active",
      },
      {
        moduleName: "Exclusions",
        features: "Services/expenses not included",
        demoValue: "Personal Airfare, River rafting fees, Camel safari ride, Personal medical insurance",
        status: "Active",
      },
      {
        moduleName: "Policies",
        features: "Booking, cancellation and refund policies",
        demoValue: "25% Advance Booking • Free cancellation up to 21 days prior • Weather-contingency route modifications",
        status: "Verified",
      },
      {
        moduleName: "Package Search",
        features: "Destination → date → travellers",
        demoValue: "Smart Search Matrix: Destination Selector → Season/Month Filter → Traveler Group Size",
        status: "Live",
      },
      {
        moduleName: "Date Selection",
        features: "Select available travel date",
        demoValue: "Dynamic Batch Date Selector with Guaranteed Departure Confirmations",
        status: "Live",
      },
      {
        moduleName: "Availability",
        features: "Available seats/spots/packages",
        demoValue: "12 Seats Available on upcoming Leh Batch • 6 Private SUV slots open for booking",
        status: "Active",
      },
      {
        moduleName: "Passenger Details",
        features: "Traveller information",
        demoValue: "Full Passenger Names, Age, Government ID, Blood Group, Emergency Contact, Food Preference",
        status: "Verified",
      },
      {
        moduleName: "Pricing",
        features: "Package price, taxes, discounts, platform fee, final amount",
        demoValue: "₹34,999/person + 5% GST (₹1,750) - HIMALAYA_EARLYBIRD (₹2,500) + ₹0 Platform Fee = ₹34,249 Final",
        status: "Active",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "Instant Online Payment via Razorpay / Stripe • Easy No-Cost EMI Options available",
        status: "Live",
      },
      {
        moduleName: "Booking",
        features: "Booking confirmation and trip details",
        demoValue: "Instant Digital Trip Confirmation • WhatsApp Packing Guide • Digital Permit Dispatch",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation request and refund status",
        demoValue: "Self-service Cancellation & Rescheduling Portal • High-Altitude Weather Protection Guarantee",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer reviews and ratings",
        demoValue: "4.93★ Rating • 97% 5-Star Reviews • Rated Top Mountain Tour Operator in Northern India",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Company profile (Agency history, certified mountain guides, fleet size, badges)",
      "Destinations (Ladakh, Kashmir, Spiti, Himachal, Kerala, Northeast India, Rajasthan)",
      "Tour packages (Road trips, bike expeditions, family holidays, trekking packages)",
      "Itineraries (Day-by-day interactive route builder with altitude & driving duration flags)",
      "Travel dates (Batch calendars, guaranteed departure flags, seasonal opening dates)",
      "Inclusions/exclusions (Vehicle type, meals, luxury glamping, inner line permits)",
      "Package availability (Real-time vehicle and camp seat occupancy tracking)",
      "Package pricing (Per person pricing, single supplement rates, bike upgrade costs)",
      "Booking calendar (Master departure timeline across all active expedition batches)",
      "Customer bookings (Passenger manifests, special dietary requirements, room sharing)",
      "Passenger details (Aadhaar/Passport verification for permit clearance)",
      "Cancellations (Automated refund ledger, emergency voucher reissuance)",
      "Reviews (Customer photo reviews, expedition feedback desk, tour leader ratings)",
      "Listing Plan (Platinum Adventure Partner Plan, 50 active packages, Top visibility)",
      "Commission Plan (6.0% platform brokerage, GST tax compliance statements)",
      "Earnings (Gross package sales, driver/camp payment disbursals, net profit)",
      "Settlement status (Weekly automated bank settlements every Thursday 11:00 AM IST)",
    ],
    listingPlan: {
      planName: "Platinum Pan-India Tour Partner Plan",
      listingDuration: "12 Months Tier Contract",
      packageOrListingLimit: "50 Active Tour Packages Allowed",
      packageVisibility: "Top Search Ranking in Ladakh, Kashmir & Spiti Queries (+260% Impressions)",
      featuredListingOption: "Featured Adventure Operator Badge Active",
      planStatus: "Active & Reconciled",
    },
    commission: {
      applicableCommissionPlan: "Tour Operator Tier A Verified Partner Commission",
      bookingCommission: "6.0% of Gross Package Booking Value",
      commissionAmountStatus: "₹2,16,000 Deducted on ₹36,00,000 MTD Bookings (Settled)",
      netOperatorAmount: "₹33,84,000 Cleared to Tour Operator Bank Account",
      settlementStatus: "Reconciled (Next Automated Payout: Thursday 11:00 AM IST)",
    },
    backendModulesNeverDisplayed: [
      "Operator Management Service",
      "Company Profile Service",
      "Destination Service",
      "Package Management Service",
      "Package Database",
      "Itinerary Service",
      "Travel Date Service",
      "Inventory Service",
      "Availability Engine",
      "Pricing Engine",
      "Booking Engine",
      "Passenger Service",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "Partner/KYC Service",
      "Authentication & RBAC",
      "Notification Service",
      "External API Integration",
      "PostgreSQL Database",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Package database structure (internal SQL schema, normalized itinerary relations)",
      "Internal package/operator IDs (e.g., TOUR_OP_HIMALAYA_8821, BATCH_LEH_2026_09)",
      "Inventory database (raw vehicle seat matrix, hotel contracted room blocks)",
      "Internal pricing rules (cost-per-kilometer tables, fuel price hedge algorithms)",
      "Commission calculation logic (agent affiliate tiers, group leader kickback rules)",
      "Settlement calculations (driver advance payment batches, vendor NEFT reconciliations)",
      "Listing-plan configuration (internal billing tokens, enterprise visibility weights)",
      "Partner/KYC records (commercial transport permits, travel agency insurance policies)",
      "API keys/secrets (INNER_LINE_PERMIT_GOVT_KEY, MAPBOX_GEOCODING_SECRET)",
      "Authentication tokens (operator backend JWT sessions, bcrypt password hashes)",
      "Database queries/schema (PostgreSQL table DDLs, index definitions, SQL execution logs)",
      "Admin controls (Platform superadmin ban buttons, manual listing pin controls)",
      "Audit/security logs (SOC2 compliance records, unauthorized login attempt logs)",
      "Server configuration (Vite/Node backend environment vars, NGINX proxy configs)",
      "Internal API endpoints (e.g., /api/internal/v1/tour/payout-reconciliation)",
      "Internal error/stack traces (Express runtime exceptions, database connection dumps)",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Rule: The frontend displays only authorized tour information and booking functionality. Package DB, inventory, pricing engine, commission engine, settlement engine, credentials, security controls and internal backend services remain server-side and are never displayed or exposed through the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Incredible Himalayas & Pan-India Expeditions",
      description: "Premier adventure and experiential tour operator specializing in guided 4x4 mountain expeditions, bike road trips, and cultural journeys across India.",
      ratingScore: "4.93★ (4,120 reviews)",
      facilitiesOrServicesList: [
        "Fleet of Custom Modified 4x4 Toyota Fortuners & Royal Enfield 450s",
        "Luxury Swiss Glamping Tents & 4-Star Mountain Lodges Included",
        "Official Ladakh Inner Line & Spiti Forest Permits Handled",
        "Certified High-Altitude Mountaineering Leaders & Mechanics",
        "Complimentary Onboard Oxygen Cylinders & First Aid Support",
        "Breakfast & Gourmet Hot Dinners Included (MAP Plan)",
      ],
      policiesMap: {
        checkInCheckOut: "Expedition Briefing: Day 1 at 05:00 PM at Base Camp Hotel.",
        cancellation: "Full refund 21 days before departure. 50% refund between 10-20 days.",
        guestAndProperty: "Valid Driving License & Govt ID mandatory for vehicle rentals.",
        refundStatus: "Processed within 3-5 business days to original payment method.",
      },
      pricingBreakdown: {
        basePrice: 34999,
        unit: "per person (7D/6N All-Inclusive)",
        taxesGst: 1750,
        platformFee: 0,
        discounts: "HIMALAYA_EARLYBIRD (-₹2,500)",
        finalPrice: 34249,
      },
      itineraryOrActivities: [
        { day: "Day 1", title: "Leh Arrival & Acclimatization", highlight: "Rest day for altitude adaptation • Evening Shanti Stupa sunset" },
        { day: "Day 2", title: "Leh to Sham Valley & Magnetic Hill", highlight: "Sangam (Indus & Zanskar rivers confluence) • Hall of Fame" },
        { day: "Day 3", title: "Leh to Nubra Valley via Khardung La (18,380 ft)", highlight: "World highest motorable pass • Diskit Monastery & Hunder Sand Dunes" },
        { day: "Day 4", title: "Nubra to Pangong Tso Lake", highlight: "Off-road Shyok river drive • Turquoise blue lake camping under stars" },
      ],
      destinationsOrServiceAreas: ["Leh Ladakh", "Spiti Valley", "Kashmir Paradise", "Meghalaya & Northeast", "Rajasthan Heritage"],
    },
  },

  // =========================================================================
  // 5. CORPORATE TOUR OPERATOR PROFILE
  // =========================================================================
  corporate: {
    id: "corporate",
    categoryName: "Corporate Tour Operator Profile",
    operatorTitle: "Bharat Corporate Travel & MICE Solutions",
    frontendModulesTable: [
      {
        moduleName: "Company Profile",
        features: "Company name, logo, description, experience, ratings",
        demoValue: "Bharat Corporate Travel & MICE Solutions • ISO 9001:2015 Certified • 15 Years Corporate Experience • 4.95★ (2,800+ Corporate Clients)",
        status: "Active",
      },
      {
        moduleName: "Travel Services",
        features: "Business trips, employee travel, group travel, meetings/events, accommodation and transport",
        demoValue: "Executive Flights & High-Speed Train Charters, 5-Star Business Hotels, Dedicated Airport Chauffeur Network, Annual CXO Retreats",
        status: "Verified",
      },
      {
        moduleName: "Destinations",
        features: "Domestic/international destinations and service coverage",
        demoValue: "Delhi NCR, Mumbai, Bengaluru, Hyderabad, Goa, Udaipur, Singapore, Dubai, London Business Hubs",
        status: "Live",
      },
      {
        moduleName: "Packages",
        features: "Business travel packages, group packages, accommodation/transport packages",
        demoValue: "Annual Leadership Summit (Goa 3D/2N), Tech Hackathon Offsite (Bengaluru), CXO Global Delegation (Dubai)",
        status: "Active",
      },
      {
        moduleName: "Service Areas",
        features: "Cities, states, countries and operational coverage",
        demoValue: "All Major Tier 1 & Tier 2 Indian Metros • 42 Global Business Hubs with 24/7 Desk",
        status: "Verified",
      },
      {
        moduleName: "Travel Dates",
        features: "Travel date, return date, duration",
        demoValue: "Flexible Corporate Date Scheduling • Multi-City Itinerary Dates • Instant Urgent Booking Desk",
        status: "Live",
      },
      {
        moduleName: "Availability",
        features: "Available packages/services and capacity",
        demoValue: "Bulk Room Blocks in 250+ Partnered Luxury Hotels • 50 to 500 Employee Conference Halls",
        status: "Active",
      },
      {
        moduleName: "Corporate Booking",
        features: "Create/manage corporate travel booking",
        demoValue: "Enterprise Travel Portal • Employee Cost-Center Tagging • Direct ERP Integration",
        status: "Live",
      },
      {
        moduleName: "Traveller Details",
        features: "Authorized employee/traveller information required for booking",
        demoValue: "Employee Corporate ID, Department, Grade/Entitlement Level, Official Email, Mobile",
        status: "Verified",
      },
      {
        moduleName: "Approval Status",
        features: "Pending, approved, rejected or completed",
        demoValue: "Multi-Level Managerial Approval Workflow (Level 1: Dept Head → Level 2: Finance Controller → Auto-Booked)",
        status: "Active",
      },
      {
        moduleName: "Invoice",
        features: "Customer-facing invoice and payment details",
        demoValue: "Automated GST Compliant B2B E-Invoice with Input Tax Credit (ITC) Verification & QR IRN Code",
        status: "Live",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "Corporate Credit Line (Net 30/60 Days), Corporate Card Gateway, Virtual Account NEFT/RTGS",
        status: "Live",
      },
      {
        moduleName: "Booking Confirmation",
        features: "Booking reference, itinerary and traveller details",
        demoValue: "Instant PNR & Hotel Voucher Delivery via Email/Slack/WhatsApp • Real-time Expense Logged",
        status: "Live",
      },
      {
        moduleName: "Cancellations",
        features: "Cancellation eligibility and refund status",
        demoValue: "Zero-Penalty Corporate Flexi-Cancel Option • Instant Credit Note Generation to Corporate Wallet",
        status: "Active",
      },
      {
        moduleName: "Reviews",
        features: "Customer/partner feedback where applicable",
        demoValue: "4.95★ Overall Corporate CSAT • 99.4% SLA Adherence • 98% Prompt GST Invoice Compliance",
        status: "Verified",
      },
      {
        moduleName: "Listing Plan",
        features: "Plan name, listing duration, package/service listing limit, profile visibility, featured listing option, plan status",
        demoValue: "Enterprise Corporate MICE Master Plan • 24 Months Contract • Unlimited Delegations • Status: Active",
        status: "Verified",
      },
      {
        moduleName: "Commission",
        features: "Applicable commission plan, booking commission, commission status, net payable/receivable amount, settlement status",
        demoValue: "Standard B2B Corporate Fee Structure: 4.0% Service Management Fee (Authorized & Transparent)",
        status: "Active",
      },
      {
        moduleName: "Earnings",
        features: "Authorized corporate operator turnover & payout ledger",
        demoValue: "₹1,28,00,000 Gross Turnover MTD • ₹1,22,88,000 Net Payout Cleared",
        status: "Live",
      },
      {
        moduleName: "Settlement Status",
        features: "Consolidated monthly corporate billing & banking reconciliation",
        demoValue: "Settlement Reconciled • Monthly Consolidated Invoicing (Net-30 Days)",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Company profile (Corporate credentials, certifications, GSTIN, CIN, enterprise client badges)",
      "Corporate travel services (Executive flight charters, business hotel chains, airport transfers, MICE)",
      "Destinations (Major domestic corporate corridors, international financial hubs)",
      "Packages (Annual leadership summits, tech hackathons, dealer meets, executive retreats)",
      "Service areas (Tier 1 & Tier 2 Indian business centers, international hubs)",
      "Travel dates (Flexible corporate calendars, expedited emergency delegation dates)",
      "Availability (Corporate bulk hotel room allocations, chartered flight seat blocks)",
      "Corporate bookings (Master corporate booking ledger, PNR tracking, group vouchers)",
      "Traveller/employee booking information (Employee IDs, grade entitlements, meal preferences)",
      "Booking approvals (Multi-tier corporate authorization: Manager → Finance Controller → Auto-Issue)",
      "Invoices (GST E-invoices with IRN, digital QR signatures, ITC validation)",
      "Payments (Corporate credit lines, Net-30 revolving ledger, virtual account NEFT)",
      "Cancellations (Corporate credit note generation, flexi-cancellation penalty waivers)",
      "Reviews (Corporate travel manager feedback, CSAT scorecards, SLA adherence metrics)",
      "Listing Plan (Plan name, duration, package/service limit, profile visibility, featured option, status)",
      "Commission Plan (Applicable commission, booking commission, status, net payable/receivable, settlement status)",
      "Earnings (Gross corporate travel billing, service fee breakdown, net payout)",
      "Settlement status (Monthly consolidated corporate billing cycle: 1st of every month)",
    ],
    listingPlan: {
      planName: "Enterprise Corporate MICE Master Plan",
      listingDuration: "24 Months Enterprise SLA Contract",
      packageOrListingLimit: "Unlimited Corporate Offsites & Employee Bookings",
      packageVisibility: "Exclusive Recommended Corporate Travel Desk on B2B Portal",
      featuredListingOption: "Featured Enterprise Corporate Badge Active",
      featuredListingEligibility: "Eligible (ISO 9001 Certified Enterprise Badge)",
      leadBookingAccess: "Direct Enterprise RFP & Large Corporate Account Channel",
      planStatus: "Active",
    },
    commission: {
      applicableCommissionPlan: "Enterprise B2B Volume Preferred Fee Tier",
      bookingCommission: "4.0% Corporate Travel Management Service Fee",
      commissionAmountStatus: "₹2,48,00,000 Corporate Volume Reconciled",
      netOperatorAmount: "₹59,52,000 Direct Supplier Settlement Ledger",
      settlementStatus: "Cleared & Reconciled (Monthly Net-30 Invoicing)",
    },
    backendModulesNeverDisplayed: [
      "Corporate Operator Management",
      "Company Profile Service",
      "Corporate Travel Service",
      "Destination Service",
      "Package Management Service",
      "Service Area Management",
      "Travel Date Service",
      "Availability Engine",
      "Corporate Booking Engine",
      "Employee/Traveller Service",
      "Approval Workflow Engine",
      "Contract Management Service",
      "Billing Engine",
      "Invoice Service",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "Corporate Data Service",
      "KYC / Verification",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Corporate contracts",
      "Internal approval rules",
      "Billing-engine logic",
      "Internal corporate employee data",
      "Internal corporate account IDs",
      "Database structure",
      "Package/inventory database",
      "Internal pricing rules",
      "Commission calculation logic",
      "Settlement calculations",
      "Listing-plan configuration",
      "KYC documents",
      "API keys/secrets",
      "Authentication tokens",
      "Admin controls",
      "Audit/security logs",
      "Server configuration",
      "Internal API endpoints",
      "Internal error/stack traces",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Final rule: Frontend shows only authorized corporate travel information, booking functions, approved invoice/payment information, listing-plan information and applicable commission status. Contracts, approval rules, billing engine, internal corporate data, databases, credentials, commission/settlement logic and other backend services remain server-side and are never displayed or exposed through the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Bharat Corporate Travel & MICE Solutions",
      description: "Comprehensive corporate travel management desk providing flight/hotel ticketing, annual offsites, executive transport, automated GST invoicing, and ERP expense integration.",
      ratingScore: "4.95★ (2,800 corporate accounts)",
      facilitiesOrServicesList: [
        "Automated B2B GST E-Invoicing with 100% ITC Compliance",
        "Integration with SAP Concur, Darwinbox & Zoho Expense",
        "Corporate Flexi-Fares with Zero Date-Change Penalties",
        "24/7 Dedicated CXO Travel Concierge Desk",
        "Pre-negotiated Corporate Rates at 2,500+ Partner Hotels",
        "Corporate Net-30 Credit Line & Virtual Account Payments",
      ],
      policiesMap: {
        checkInCheckOut: "24/7 Corporate Desk • Instant PNR Issuance within 90 seconds.",
        cancellation: "Flexi-Corporate Tickets: Free cancellation up to 4 hours before departure.",
        guestAndProperty: "Official Corporate Email & Employee ID required for entitlement booking.",
        refundStatus: "Instant 100% credit to Corporate Wallet / Credit Line.",
      },
      pricingBreakdown: {
        basePrice: 18500,
        unit: "per employee (3D/2N Leadership Summit)",
        taxesGst: 3330,
        platformFee: 0,
        discounts: "CORPORATE_VOLUME (-₹1,850)",
        finalPrice: 19980,
      },
      destinationsOrServiceAreas: ["Delhi NCR", "Bengaluru Tech Corridor", "Mumbai BKC", "Hyderabad HITEC City", "Goa MICE Resorts", "Dubai & Singapore Business Hubs"],
      approvalWorkflow: {
        corporateLevels: ["Level 1: Team Manager (Approved)", "Level 2: Finance Controller (Approved)", "Level 3: Auto-Ticketing Engine (Complete)"],
        currentStatus: "Approved & Ticketed",
        invoiceNumber: "INV-B2B-2026-08892 (IRN Verified)",
      },
    },
  },

  // =========================================================================
  // 6. CAB OPERATOR PROFILE, BOOKING, COMMISSION & LISTING PLAN
  // =========================================================================
  cab: {
    id: "cab",
    categoryName: "Cab Operator Profile",
    operatorTitle: "BharatRide Outstation & Airport Chauffeur Network",
    frontendModulesTable: [
      {
        moduleName: "Cab Operator Profile",
        features: "Operator/company name, logo, description, rating",
        demoValue: "BharatRide Chauffeur Network • 4.87★ (6,890+ Verified Ratings) • ISO Certified Fleet",
        status: "Active",
      },
      {
        moduleName: "Vehicle Profile",
        features: "Vehicle name/model, vehicle type, seating capacity, luggage capacity, AC/Non-AC",
        demoValue: "Swift Dzire / Toyota Etios / Innova Crysta / Tempo Traveller • 4-17 Seats • AC Commercial",
        status: "Verified",
      },
      {
        moduleName: "Vehicle Types",
        features: "Hatchback, Sedan, SUV, Premium, Tempo Traveller, etc.",
        demoValue: "Prime Sedan, Luxury SUV (Innova), Executive Tempo Traveller (12/17s)",
        status: "Live",
      },
      {
        moduleName: "Service Areas",
        features: "Cities, routes, airport/railway transfers and operating areas",
        demoValue: "Delhi NCR, Mumbai-Pune, Bangalore-Mysore, Chennai, Hyderabad, Jaipur, Chandigarh",
        status: "Active",
      },
      {
        moduleName: "Fare Details",
        features: "Per-trip, per-km, hourly/package fare, taxes and applicable charges",
        demoValue: "₹11/km (Sedan), ₹17/km (SUV) • Base starts ₹1,499 • Fastag Tolls Included • 5% GST",
        status: "Live",
      },
      {
        moduleName: "Travel Date & Time",
        features: "Pickup date, pickup time, return date/time where applicable",
        demoValue: "24/7 Precision Pickup Date & Time Selector with Real-Time Chauffeur Dispatch",
        status: "Active",
      },
      {
        moduleName: "Availability",
        features: "Available vehicles for selected date/time",
        demoValue: "34 Prime Sedans, 22 Innova Crystas, 8 Tempo Travellers Available for Instant Booking",
        status: "Live",
      },
      {
        moduleName: "Pickup & Drop",
        features: "Pickup location, destination and stops",
        demoValue: "Doorstep Pickup → Multi-Stop Highway Route → Final Drop-Off Location",
        status: "Verified",
      },
      {
        moduleName: "Cab Selection",
        features: "Select available vehicle",
        demoValue: "One-Touch Vehicle Selection with Live Boot Space & Seating Capacity Preview",
        status: "Active",
      },
      {
        moduleName: "Passenger Details",
        features: "Traveller name, contact and required booking information",
        demoValue: "Lead Passenger Name, Mobile Number, Email for E-Receipt, Pickup Address Landmark",
        status: "Verified",
      },
      {
        moduleName: "Booking",
        features: "Booking request → payment → confirmation",
        demoValue: "Instant Ride Dispatch Engine with Live SMS & WhatsApp Driver Allocation",
        status: "Live",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "UPI, Credit/Debit Cards, Net Banking, Cash to Chauffeur • Status: Paid",
        status: "Live",
      },
      {
        moduleName: "Booking Confirmation",
        features: "Booking reference, vehicle, date/time and trip details",
        demoValue: "Trip Ref: CAB-IND-9921 • Driver: Ramesh Singh (DL01AZ4412) • Verified Chauffeur",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation eligibility and refund status",
        demoValue: "Free Cancellation up to 2 hours prior to scheduled pickup time • Instant Refund",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer ratings and reviews",
        demoValue: "4.87★ Punctuality Rating • 99.2% On-Time Pickup Rate across 15,000+ Outstation Trips",
        status: "Verified",
      },
      {
        moduleName: "Listing Plan",
        features: "Plan name, duration, visibility and plan status",
        demoValue: "Platinum Cab Fleet Plan • 12 Months • Top Recommended Outstation Network • Status: Active",
        status: "Verified",
      },
      {
        moduleName: "Commission",
        features: "Applicable commission/status",
        demoValue: "Standard Outstation Tier: 12.0% Platform Commission • Fully Reconciled",
        status: "Active",
      },
      {
        moduleName: "Earnings",
        features: "Authorized operator earnings information",
        demoValue: "Gross Bookings: ₹21,50,000 MTD • Net Disbursed Payout: ₹18,92,000",
        status: "Live",
      },
      {
        moduleName: "Settlement Status",
        features: "Settlement status/history",
        demoValue: "Instant Per-Ride Auto-Disbursement via UPI / IMPS to Operator Bank Account",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Operator profile (Agency details, commercial transport license, registered office)",
      "Vehicle profiles (RC registration, model year, seating, boot capacity, insurance expiry)",
      "Vehicle types (Hatchback, Sedan, SUV, Premium SUV, Tempo Traveller, Minibus)",
      "Service areas (Intercity routes, airport transfer zones, local rental radiuses)",
      "Fare configuration (Per-km base fare, night allowance, driver bata, minimum km slab)",
      "Travel dates (Pickup date/time slots, peak festive schedule calendars)",
      "Availability (Fleet vehicle online/offline toggle, maintenance downtime calendar)",
      "Booking calendar (Master outstation trip schedule, active highway trips, airport pickups)",
      "Reservations (Confirmed customer trip manifests, scheduled pickups, return legs)",
      "Passenger/booking information (Lead traveler contact, flight number for delay tracking)",
      "Cancellations (Automated cancellation logs, driver reassignment desk)",
      "Reviews (Driver behavior ratings, car cleanliness feedback, trip reviews)",
      "Listing Plan (Platinum Outstation Partner Plan, 100 vehicle slots, Top visibility)",
      "Commission Plan (12.0% platform commission, GST TDS compliance ledger)",
      "Earnings (Gross trip fares, toll reimbursements, net operator payout)",
      "Settlement status (Instant Automated UPI Payout per completed ride)",
    ],
    listingPlan: {
      planName: "Platinum Cab Fleet Partner Plan",
      listingDuration: "12 Months Tier Contract",
      packageOrListingLimit: "100 Active Commercial Vehicles Allowed",
      packageVisibility: "Top Recommended Outstation Cab Fleet in NCR & West India",
      featuredListingOption: "Featured Verified Fleet Badge Active",
      featuredListingEligibility: "Eligible (Verified Commercial Fleet Badge)",
      leadBookingAccess: "High-Value Long Distance & Multi-Day Outstation Bookings",
      planStatus: "Active",
    },
    commission: {
      applicableCommissionPlan: "Cab Operator Tier 1 Preferred Commission",
      bookingCommission: "12.0% of Gross Trip Value",
      commissionAmountStatus: "₹2,58,000 Deducted on ₹21,50,000 MTD Trips (Reconciled)",
      netOperatorAmount: "₹18,92,000 Cleared to Fleet Bank Account",
      settlementStatus: "Instant Per-Ride Auto-Disbursement via UPI / IMPS",
    },
    backendModulesNeverDisplayed: [
      "Cab Operator Management",
      "Operator Profile Service",
      "Vehicle/Fleet Management Service",
      "Vehicle Type Service",
      "Service Area Service",
      "Fare/Pricing Engine",
      "Availability Engine",
      "Driver Allocation Service",
      "Dispatch Engine",
      "Trip Management Service",
      "Booking Engine",
      "Payment Service",
      "Cancellation & Refund Service",
      "GPS/Tracking Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "Partner/KYC Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Fleet database",
      "Internal vehicle/driver IDs",
      "Driver allocation logic",
      "Dispatch logic",
      "Internal GPS/tracking data",
      "Internal pricing rules",
      "Commission calculation engine",
      "Settlement calculations",
      "Listing-plan configuration",
      "Partner/KYC records",
      "API keys and secrets",
      "Authentication tokens",
      "Database schema/queries",
      "Admin controls",
      "Audit/security logs",
      "Server configuration",
      "Internal API endpoints",
      "Internal error/stack traces",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Final rule: The frontend displays only authorized cab/operator information, vehicle availability, fares, dates, booking and permitted commission/listing information. Fleet DB, driver allocation, dispatch, tracking, pricing logic, commission/settlement engines, credentials and all internal backend services remain server-side and are never displayed or exposed through the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "BharatRide Outstation & Airport Chauffeur Network",
      description: "Reliable intercity outstation and airport taxi fleet providing commercially licensed, background-verified chauffeurs, clean AC vehicles, transparent per-km billing, and zero hidden toll surprises.",
      ratingScore: "4.87★ (6,890 reviews)",
      facilitiesOrServicesList: [
        "Clean, Sanitised & Air-Conditioned Commercial Vehicles",
        "Police-Verified & Uniformed Professional Chauffeurs",
        "Fastag Included with Transparent Toll & State Tax Calculators",
        "Live GPS Shareable Ride Link for Family Tracking",
        "Complimentary Packaged Water Bottle & In-Car Phone Chargers",
        "Zero Driver Cancellation Policy (Guaranteed Backup Vehicle)",
      ],
      policiesMap: {
        checkInCheckOut: "Driver details with vehicle number sent via SMS/WhatsApp 2 hours before trip.",
        cancellation: "Free cancellation up to 2 hours prior to scheduled pickup time.",
        guestAndProperty: "Boot space fits 2 large suitcases in Sedan, 4 large suitcases in Innova/SUV.",
        refundStatus: "Immediate online refund for eligible cancellations.",
      },
      pricingBreakdown: {
        basePrice: 1499,
        unit: "Base Fare (Starts ₹11/km for Prime Sedan)",
        taxesGst: 75,
        platformFee: 20,
        discounts: "ONEWAY_DISCOUNT (-₹250)",
        finalPrice: 1344,
      },
      destinationsOrServiceAreas: ["Delhi NCR", "Mumbai-Pune Expressway", "Bangalore-Mysore Corridor", "Jaipur-Agra Golden Triangle", "Chandigarh-Shimla Route"],
    },
  },

  // =========================================================================
  // 7. RESTAURANT / DHABA OPERATOR PROFILE, BOOKING, LISTING PLAN & COMMISSION
  // =========================================================================
  restaurant: {
    id: "restaurant",
    categoryName: "Restaurant Operator Profile",
    operatorTitle: "Haveli Grand Heritage Dhaba & Family Restaurant",
    frontendModulesTable: [
      {
        moduleName: "Restaurant / Dhaba Profile",
        features: "Restaurant name, logo, description, cuisine type, ratings",
        demoValue: "Haveli Grand Heritage Dhaba • Pure Desi Ghee North Indian & Punjabi Cuisine • 4.86★ (8,920+ Reviews)",
        status: "Active",
      },
      {
        moduleName: "Menu",
        features: "Categories, dishes, descriptions, prices, veg/non-veg indicators where applicable",
        demoValue: "Tandoori Breads, Amritsari Kulchas, Dal Makhani, Paneer Lababdar, Lassi, Kulfi • 100% Pure Veg",
        status: "Verified",
      },
      {
        moduleName: "Photos",
        features: "Restaurant, dining area, dishes and facilities",
        demoValue: "Grand Heritage Courtyard, AC Family Halls, Open Tandoor Live Kitchen, Punjabi Village Photo Booths",
        status: "Live",
      },
      {
        moduleName: "Location",
        features: "Address, map, nearby landmarks",
        demoValue: "Mile 48, NH-44 Grand Trunk Road, Murthal, Haryana (Near Milestone 50 Toll Plaza)",
        status: "Verified",
      },
      {
        moduleName: "Timings",
        features: "Opening/closing hours, service hours",
        demoValue: "Open 24 Hours / 7 Days a Week • Live Kitchen Operating Non-Stop for Highway Travelers",
        status: "Live",
      },
      {
        moduleName: "Facilities",
        features: "Parking, Wi-Fi, family seating, outdoor seating, washroom, etc.",
        demoValue: "200+ Car Valet Parking, Ultra-Clean Baby Care Restrooms, Free Wi-Fi, Wheelchair Ramp, Children Play Area",
        status: "Active",
      },
      {
        moduleName: "Offers",
        features: "Customer-facing discounts, deals and offers",
        demoValue: "HIGHWAY_SAVER (10% OFF on Pre-Booked Family Thali) • Complimentary Special Masala Chai",
        status: "Live",
      },
      {
        moduleName: "Date & Time",
        features: "Reservation/order date and time where supported",
        demoValue: "Select Reservation Date, Dining Time Slot (Breakfast/Lunch/Dinner/Midnight Highway Stop)",
        status: "Active",
      },
      {
        moduleName: "Availability",
        features: "Table/booking availability where supported",
        demoValue: "Instant Table Availability Tracking across AC Family Hall, Heritage Baithak & Outdoor Garden",
        status: "Live",
      },
      {
        moduleName: "Table Booking",
        features: "Date, time, number of guests and reservation confirmation",
        demoValue: "VIP Reserved Family Table with Zero Waiting Time Pass & Dedicated Hospitality Steward",
        status: "Active",
      },
      {
        moduleName: "Food Order",
        features: "Menu selection, cart, quantity and order confirmation where enabled",
        demoValue: "Express Pre-Order Highway Combos • Ready-to-Serve upon Arrival at Table",
        status: "Live",
      },
      {
        moduleName: "Guest Details",
        features: "Customer information required for booking/order",
        demoValue: "Lead Guest Name, Contact Mobile Number, Number of Adults & Children, Special Requests",
        status: "Verified",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "UPI, Cards, Net Banking, Pre-Paid Meal Wallet • Status: Confirmed & Paid",
        status: "Live",
      },
      {
        moduleName: "Booking / Order Status",
        features: "Confirmed, preparing, ready/completed or cancelled",
        demoValue: "Table Status: Confirmed (VIP Table #14) • Food Status: Preparing in Clay Tandoor",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Applicable cancellation/refund status",
        demoValue: "Free Table Cancellation up to 1 hour prior to reserved slot • Instant Full Credit",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer feedback",
        demoValue: "4.86★ Overall Dining Rating • FSSAI 5-Star Hygiene Certified • 98% Positive Food Quality Score",
        status: "Verified",
      },
      {
        moduleName: "Listing Plan",
        features: "Plan name, duration and listing status",
        demoValue: "Platinum Highway Dining Tier • 12 Months Contract • Status: Active",
        status: "Verified",
      },
      {
        moduleName: "Commission",
        features: "Applicable commission/status",
        demoValue: "Standard Restaurant Partner Plan: 5.0% on Pre-Booked Dining & Meal Vouchers",
        status: "Active",
      },
      {
        moduleName: "Earnings",
        features: "Authorized operator earnings",
        demoValue: "₹14,20,000 Gross Monthly Pre-Orders • ₹13,49,000 Net Disbursed Payout",
        status: "Live",
      },
      {
        moduleName: "Settlement Status",
        features: "Settlement information",
        demoValue: "Daily T+2 Automated Clearing to Dhaba Bank Account • Status: Fully Reconciled",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Restaurant/Dhaba profile (Restaurant name, heritage story, FSSAI license, operating company)",
      "Menu categories (Tandoori, Main Course, Breads, Beverages, Desserts, Highway Combos)",
      "Menu items (Dish names, ingredients, veg/non-veg tags, spice levels, chef specials)",
      "Prices (Base rates, combo discounts, festive surge pricing, GST rates)",
      "Food photos (High-resolution dish plating, tandoor preparation, dining atmosphere)",
      "Facilities (Valet parking, baby feeding room, wheelchair access, Wi-Fi, AC halls)",
      "Opening hours (24/7 dining hours, breakfast/lunch/dinner buffet timings)",
      "Offers (Discount coupon codes, highway breakfast combos, family group offers)",
      "Table availability (Real-time table counts, hall seat capacity, reservation blocks)",
      "Booking calendar (Master reservation schedule, peak highway rush hour forecasts)",
      "Orders (Live Kitchen Order Tickets [KOT], pre-ordered meal queues, takeaway packets)",
      "Customer bookings (Guest manifests, VIP table requests, celebration arrangements)",
      "Cancellations (Automated table releases, refund reconciliation ledger)",
      "Reviews (Guest food ratings, service speed feedback, cleanliness scores)",
      "Listing Plan (Plan name, listing duration, menu limits, search visibility, featured option, status)",
      "Commission Plan (Applicable plan, booking/order commission, status, net operator amount, settlement status)",
      "Earnings (Gross food orders, commission deductions, daily net payout)",
      "Settlement status (Daily T+2 automated bank payout reconciliations)",
    ],
    listingPlan: {
      planName: "Platinum Highway Dining Partner Plan",
      listingDuration: "12 Months Subscription",
      packageOrListingLimit: "50 Menu Item Highlights & Unlimited Table Bookings",
      packageVisibility: "Top Highway Dhaba & Dining Destination across NH-44 (+350% Leads)",
      featuredListingOption: "Featured FSSAI 5-Star Heritage Badge Active",
      featuredListingEligibility: "Eligible (FSSAI 5-Star Certified Heritage Badge)",
      leadBookingAccess: "Direct Tourist Bus & Family Traveler Table Bookings",
      planStatus: "Active",
    },
    commission: {
      applicableCommissionPlan: "Restaurant Tier 1 Preferred Partner Commission",
      bookingCommission: "5.0% of Pre-Paid Table & Food Value",
      commissionAmountStatus: "₹71,000 Deducted on ₹14,20,000 MTD Bookings (Reconciled)",
      netOperatorAmount: "₹13,49,000 Cleared to Restaurant Bank Account",
      settlementStatus: "Daily T+2 Automated Clearing (Next Payout: Tomorrow 09:00 AM IST)",
    },
    backendModulesNeverDisplayed: [
      "Restaurant Operator Management",
      "Restaurant Profile Service",
      "Menu Management Service",
      "Menu Database",
      "Table / Availability Service",
      "Reservation Engine",
      "Order Management Service",
      "Cart / Order Processing",
      "Pricing & Offer Engine",
      "Payment Service",
      "Cancellation / Refund Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "Partner Controls",
      "KYC / Verification Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Menu database structure",
      "Internal restaurant/operator IDs",
      "Internal order-management logic",
      "Partner controls",
      "Internal pricing/offer rules",
      "Commission calculation logic",
      "Settlement calculations",
      "Listing-plan configuration",
      "KYC documents",
      "API keys/secrets",
      "Authentication tokens",
      "Database schema/queries",
      "Admin controls",
      "Audit/security logs",
      "Server configuration",
      "Internal API endpoints",
      "Internal error/stack traces",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Final rule: The frontend displays only authorized restaurant/Dhaba information, menu, offers, availability, booking/order functions, dates, and permitted listing/commission information. Menu DB, order-management internals, partner controls, commission/settlement logic, credentials and all other backend services remain server-side and are never displayed or exposed through the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Haveli Grand Heritage Dhaba & Family Restaurant",
      description: "Iconic North Indian highway dining establishment renowned for melting white butter parathas, authentic tandoori delicacies, traditional village cultural performances, and sparkling clean highway rest facilities.",
      ratingScore: "4.86★ (8,920 reviews)",
      facilitiesOrServicesList: [
        "100% Pure Desi Ghee Preparation & Open Hygiene Kitchen",
        "Spacious Air-Conditioned Family Dining Halls",
        "Ample Free Valet Parking for 200+ Tourist Cars & Buses",
        "Pristine Clean Restrooms with Baby-Care Facilities",
        "Wheelchair-Accessible Entrances & Special Senior Citizen Seating",
        "Traditional Punjabi Chhajja, Baithak & Selfie Heritage Zones",
      ],
      policiesMap: {
        checkInCheckOut: "Show booking confirmation SMS/QR code at the VIP Hospitality Desk for instant seating.",
        cancellation: "Table reservations held for 20 minutes past booking time. Free cancellation up to 1 hour prior.",
        guestAndProperty: "Outside food and pets not permitted inside main air-conditioned dining halls.",
        refundStatus: "Instant refund on pre-paid food credit if cancelled on time.",
      },
      pricingBreakdown: {
        basePrice: 650,
        unit: "Grand Royal Punjab Heritage Thali (Serves 2)",
        taxesGst: 32,
        platformFee: 0,
        discounts: "HIGHWAY_SAVER (-₹65)",
        finalPrice: 617,
      },
      destinationsOrServiceAreas: ["NH-44 Murthal Highway Corridor", "Grand Trunk Road Delhi-Chandigarh", "Amritsar Highway Mile"],
    },
  },

  // =========================================================================
  // 8. HOUSE BOAT OPERATOR PROFILE, BOOKING, LISTING PLAN & COMMISSION
  // =========================================================================
  houseboat: {
    id: "houseboat",
    categoryName: "House Boat Operator Profile",
    operatorTitle: "Alleppey Royal Waves Eco-Kettuvallam Luxury Cruises",
    frontendModulesTable: [
      {
        moduleName: "Houseboat Operator Profile",
        features: "Operator/company name, logo, description, experience, ratings",
        demoValue: "Royal Waves Cruises • 18 Years Kerala Backwater Hospitality • Gold Star Certified • 4.94★ (2,780+ Reviews)",
        status: "Active",
      },
      {
        moduleName: "Houseboat Profile",
        features: "Houseboat name, type/category, capacity, deck/cabin details",
        demoValue: "Handcrafted Eco-Kettuvallam • 1 to 4 AC Luxury Glass Bedrooms • Upper Panoramic Sun-Deck",
        status: "Verified",
      },
      {
        moduleName: "Photos & Gallery",
        features: "Houseboat, cabins, deck, dining area, facilities and surroundings",
        demoValue: "36 High-Res Photos • Drone Lagoon Views • Wooden Bed Chambers • Sunset Cruise Deck",
        status: "Live",
      },
      {
        moduleName: "Capacity",
        features: "Number of guests, cabins/rooms and occupancy",
        demoValue: "Honeymoon 1-Bed (2 Pax), Family 2-Bed (4-6 Pax), Maharaja 4-Bed (8-12 Pax)",
        status: "Active",
      },
      {
        moduleName: "Facilities",
        features: "AC, meals, kitchen, dining, Wi-Fi, safety facilities, etc.",
        demoValue: "Full AC Bedrooms, Attached En-Suite Bathrooms, Upper Sun-Deck, Private Chef, Life Jackets, Govt Approved",
        status: "Verified",
      },
      {
        moduleName: "Routes",
        features: "Starting point, destination, cruising route, stops",
        demoValue: "Punnamada Jetty → Vembanad Lake → Kuttanad Paddy Waterways → Champakulam Church & Village Canal",
        status: "Live",
      },
      {
        moduleName: "Packages",
        features: "Day cruise, overnight stay, sightseeing and customized packages",
        demoValue: "Overnight Luxury Stay (12 PM - 9 AM), Day Village Cruise (11 AM - 5 PM), Honeymoon Backwater Escape",
        status: "Active",
      },
      {
        moduleName: "Pricing",
        features: "Package/houseboat price, taxes, discounts, platform fee and final amount",
        demoValue: "₹11,500/night (1-Bed All Meals) + 5% GST (₹575) - BACKWATER_HONEYMOON (₹1,000) = ₹11,075 Final",
        status: "Live",
      },
      {
        moduleName: "Date & Time",
        features: "Cruise/stay date, departure time and duration",
        demoValue: "Check-in: 12:00 PM (Noon) • Cruise Duration: Overnight 21 Hours • Sunset Anchor in Lake",
        status: "Active",
      },
      {
        moduleName: "Availability",
        features: "Available houseboats/packages for selected date",
        demoValue: "3 Honeymoon 1-Bed, 2 Family 2-Bed, 1 Grand Maharaja 4-Bed Available for Selected Dates",
        status: "Live",
      },
      {
        moduleName: "Houseboat Selection",
        features: "Select available houseboat/package",
        demoValue: "One-Click Kettuvallam Selection with Live Cabin Walkthrough & Deck Floorplan",
        status: "Active",
      },
      {
        moduleName: "Guest Details",
        features: "Traveller/guest information",
        demoValue: "Guest Names, Identification, Dietary Preferences (Kerala Fish Curry, Pure Veg, Jain)",
        status: "Verified",
      },
      {
        moduleName: "Payment",
        features: "Secure payment and payment status",
        demoValue: "Instant Online Payment via Razorpay / Stripe • 50% Advance Lock Option • Status: Paid",
        status: "Live",
      },
      {
        moduleName: "Booking",
        features: "Booking confirmation and trip details",
        demoValue: "Digital Boarding Voucher • Dedicated Houseboat Captain Mobile & Jetty Location Coordinates",
        status: "Live",
      },
      {
        moduleName: "Cancellation",
        features: "Cancellation eligibility and refund status",
        demoValue: "Full Refund up to 10 days prior to cruise • 50% Refund between 4-9 days • Automated Reversal",
        status: "Active",
      },
      {
        moduleName: "Reviews & Ratings",
        features: "Customer feedback and ratings",
        demoValue: "4.94★ Overall Experience Rating • 99% Praise for Fresh Karimeen Dining & Onboard Hospitality",
        status: "Verified",
      },
      {
        moduleName: "Listing Plan",
        features: "Plan name, duration, visibility and status",
        demoValue: "Platinum Kerala Backwaters Tier • 12 Months • Top 1 Featured Position in Alleppey • Status: Active",
        status: "Verified",
      },
      {
        moduleName: "Commission",
        features: "Applicable commission/status",
        demoValue: "Standard Houseboat OTA Brokerage: 7.0% of Cruise Gross Booking Value",
        status: "Active",
      },
      {
        moduleName: "Settlement Status",
        features: "Authorized operator settlement information",
        demoValue: "Milestone Payout (50% on Booking, 50% on Check-in) • Cleared via NEFT Every Monday",
        status: "Verified",
      },
    ],
    operatorDashboardManageList: [
      "Operator profile (Company credentials, Kerala Tourism registration, DTPC certification)",
      "Houseboat profiles (Vessel name, hull build year, wooden anjili build specifications)",
      "Houseboat photos (Cabins, sun-decks, dining setup, bathroom fixtures, lagoon scenery)",
      "Capacity (Max passenger limit, daytime cruise capacity, overnight sleeping occupancy)",
      "Cabins/rooms (Master bedrooms, bed dimensions, AC operating hours, attached bathrooms)",
      "Facilities (Kitchen equipment, dining tables, life jackets, onboard inverter/generator)",
      "Routes (Vembanad lake cruises, narrow canal routes, heritage village anchor spots)",
      "Packages (Overnight romantic stays, day family cruises, corporate day outings)",
      "Pricing (Seasonal monsoon rates, peak winter rates, extra adult/child supplement charges)",
      "Travel dates (Daily departure booking calendar, mandatory annual dry-dock maintenance slots)",
      "Availability (Real-time boat berth status, reserved dates, offline maintenance blocks)",
      "Booking calendar (Master cruise schedule, jetty boarding times, guest arrival manifests)",
      "Reservations (Confirmed guest vouchers, custom meal requests, arrival pickup arrangements)",
      "Guest information (Passenger names, government ID proofs, food allergies, special occasions)",
      "Cancellations (Weather disruption contingency waivers, refund transaction ledger)",
      "Reviews (Traveler ratings, onboard chef feedback, captain navigation ratings)",
      "Listing Plan (Plan name, listing duration, houseboat limit, search visibility, featured option, status)",
      "Commission Plan (Applicable commission, booking commission, status, net operator amount, settlement status)",
      "Earnings (Gross cruise revenues, chef ingredient allocations, net operator payouts)",
      "Settlement status (Weekly jetty settlements: every Monday 10:00 AM IST)",
    ],
    listingPlan: {
      planName: "Platinum Kerala Backwaters Partner Plan",
      listingDuration: "12 Months Contract",
      packageOrListingLimit: "10 Luxury Houseboats Allowed",
      packageVisibility: "Top 1 Featured Houseboat in Alleppey Backwaters (+280% Inquiries)",
      featuredListingOption: "Featured Kerala Gold Star Badge Active",
      featuredListingEligibility: "Eligible (Kerala Gold Star Certified Badge)",
      leadBookingAccess: "Direct Luxury Honeymooners & Family Holiday Cruises",
      planStatus: "Active",
    },
    commission: {
      applicableCommissionPlan: "Houseboat Tier 1 Preferred Partner Commission",
      bookingCommission: "7.0% of Gross Cruise Booking Value",
      commissionAmountStatus: "₹1,32,300 Deducted on ₹18,90,000 MTD Bookings (Reconciled)",
      netOperatorAmount: "₹17,57,700 Cleared to Operator Bank Account",
      settlementStatus: "Milestone Cleared (Every Monday Jetty Settlement)",
    },
    backendModulesNeverDisplayed: [
      "Houseboat Operator Management",
      "Houseboat Profile Service",
      "Fleet Management Service",
      "Inventory Service",
      "Capacity Management",
      "Cabin/Room Management",
      "Route Management Service",
      "Package Management Service",
      "Availability Engine",
      "Pricing / Rate Engine",
      "Booking Engine",
      "Payment Service",
      "Cancellation & Refund Service",
      "Listing Plan Engine",
      "Commission Engine",
      "Settlement Engine",
      "Partner/KYC Service",
      "Authentication & RBAC",
      "Notification Service",
      "PostgreSQL Database",
      "External API Integration",
      "Audit Logs",
      "Security Logs",
      "API Keys / Secrets",
    ],
    backendDataNeverDisplayed: [
      "Fleet database",
      "Internal houseboat IDs",
      "Inventory database",
      "Internal availability logic",
      "Route/package engine logic",
      "Internal pricing rules",
      "Booking-engine internals",
      "Commission calculation logic",
      "Settlement calculations",
      "Listing-plan configuration",
      "Partner/KYC records",
      "API keys and secrets",
      "Authentication tokens",
      "Database schema/queries",
      "Admin controls",
      "Audit/security logs",
      "Server configuration",
      "Internal API endpoints",
      "Internal error/stack traces",
    ],
    architectureAscii: `1. CUSTOMER / OPERATOR INTEGRATION FLOW:
   Customer/Operator Frontend
              │ (Public HTTPS / Port 3000 Ingress)
              ▼
          Secure API
              │ (JWT Bearer Token / Rate Limiter / WAF)
              ▼
       Backend Services
              │ (Domain Business Logic & Escrow Settlement)
              ▼
 Database / External Integrations
   ├── PostgreSQL Encrypted DB
   ├── Payment Gateways (Razorpay / Stripe)
   └── External APIs & GDS Providers

2. ADMIN INTEGRATION FLOW:
        Admin Frontend
              │ (Protected Super Admin Console)
              ▼
     Admin Authentication
              │ (FIDO2 / WebAuthn / MFA / RBAC Token)
              ▼
          Admin APIs
              │ (Scoped Platform Governance APIs)
              ▼
   Backend / Admin Services
              │ (Audit Trails / Automated Payouts / KYC)
              ▼
          Database
   └── PostgreSQL Master DB (Encrypted Tables & Ledger)`,
    architectureNotes:
      "Final rule: Frontend = houseboat profile, photos, capacity, facilities, routes, packages, dates, availability, pricing and booking. Backend = fleet/inventory, booking engine, rate engine, commission, settlement, partner controls, credentials, databases and internal services; these must remain server-side and never be displayed or exposed through the frontend.",
    liveInteractiveDemoData: {
      propertyOrCompanyName: "Alleppey Royal Waves Eco-Kettuvallam Luxury Cruises",
      description: "Traditional Kerala wooden Kettuvallam houseboats handcrafted with anjili wood and bamboo, equipped with modern air-conditioned glass bedrooms, open upper sun-decks, private onboard chef, and authentic Karimeen fish delicacies.",
      ratingScore: "4.94★ (2,780 reviews)",
      facilitiesOrServicesList: [
        "All Kerala Traditional Meals: Lunch, Tea & Snacks, Dinner, Breakfast",
        "Fresh Backwater Karimeen Pollichathu & Traditional Kerala Curries",
        "Air-Conditioned Master Bedrooms with Attached En-Suite Bathrooms",
        "Spacious Upper Sun-Deck with 360° Panoramic Backwater Views",
        "3-Member Dedicated Private Crew: Captain, Engine Driver & Private Chef",
        "Complete Marine Safety Life-Jackets & Govt Tourism Certified Navigation",
      ],
      policiesMap: {
        checkInCheckOut: "Boarding at Punnamada Finishing Point Jetty at 12:00 PM (Noon).",
        cancellation: "Full refund up to 10 days prior to cruise date. 50% refund between 4-9 days.",
        guestAndProperty: "Cruising ceases at 05:30 PM as per Kerala inland marine laws; boat anchors safely in tranquil lake for night.",
        refundStatus: "Reversal to bank/card within 5 business days.",
      },
      pricingBreakdown: {
        basePrice: 11500,
        unit: "per 1-Bedroom Boat / Overnight (All Meals Included)",
        taxesGst: 575,
        platformFee: 0,
        discounts: "BACKWATER_HONEYMOON (-₹1,000)",
        finalPrice: 11075,
      },
      destinationsOrServiceAreas: ["Punnamada Jetty", "Vembanad Lake", "Kuttanad Canals", "Champakulam Church Route", "Kumarakom Bird Sanctuary Backwaters"],
    },
  },
};
