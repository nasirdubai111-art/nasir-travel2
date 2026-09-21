export type SystemSettingsSection =
  | "all"
  | "general"
  | "authentication"
  | "booking"
  | "payment"
  | "commission"
  | "maintenance"
  | "feature_flags";

export interface GeneralSettings {
  platformName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  supportEmail: string;
  supportPhone: string;
}

export interface AuthenticationSettings {
  customerRegistration: boolean;
  allowPhoneOtp: boolean;
  allowGoogleAuth: boolean;
  requireEmailVerification: boolean;
  autoActivateCustomer: boolean;
  
  partnerRegistration: boolean;
  partnerApprovalRequired: boolean;
  mandatoryGstPan: boolean;
  bankPennyDropVerification: boolean;

  loginSettings: {
    mfaEnforcement: "disabled" | "optional" | "admin_only" | "all_users";
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
    sessionTimeoutMinutes: number;
    allowSimultaneousSessions: boolean;
    passwordRotationDays: number;
  };
}

export interface CancellationRuleTier {
  id: string;
  windowLabel: string;
  hoursBeforeDeparture: number;
  penaltyPercentage: number;
  description: string;
}

export interface BookingSettings {
  bookingEnabled: boolean;
  emergencyPauseNotice: string;
  
  cancellationRules: {
    freeCancellationHours: number;
    instantAutoRefund: boolean;
    convenienceFeeRefundable: boolean;
    tiers: CancellationRuleTier[];
  };

  bookingLimits: {
    maxConcurrentActiveBookings: number;
    maxPassengersPerTicket: number;
    maxBookingValueWithoutPan: number;
    rateLimitRequestsPerMin: number;
    seatLockDurationMinutes: number;
  };
}

export interface PaymentSettings {
  paymentEnabled: boolean;
  gatewayMode: "production" | "sandbox";
  currency: string;
  supportedCurrencies: string[];
  multiCurrencyEnabled: boolean;
  forexMarkupPercent: number;
  primaryGateway: "zeul_pay" | "cashfree" | "payu" | "stripe";
  fallbackGatewayEnabled: boolean;
  paymentMethods: {
    upi: boolean;
    creditDebitCards: boolean;
    netBanking: boolean;
    wallets: boolean;
    emi: boolean;
    payLater: boolean;
  };
  instantSplitSettlement: boolean;
}

export interface CommissionSettings {
  defaultCommission: number;
  minPlatformFee: number;
  
  partnerCommission: {
    flights: number;
    trains: number;
    buses: number;
    hotels: number;
    resorts: number;
    tours: number;
    pilgrimage: number;
  };

  agentCommission: {
    baseAgentCommission: number;
    superAgentBonus: number;
    minPayoutThreshold: number;
    tdsSection194HPercent: number;
    tdsSection194OPercent: number;
    payoutCycle: "daily" | "weekly" | "monthly";
  };
}

export interface MaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceScope: "entire_platform" | "customer_only" | "partner_only";
  scheduledStart: string;
  estimatedCompletionTime: string;
  allowAdminBypass: boolean;
  emergencyNoticeBanner: boolean;
}

export interface ServiceFeatureFlag {
  id: "flights" | "trains" | "buses" | "hotels" | "resorts" | "tours" | "pilgrimage";
  name: string;
  enabled: boolean;
  betaOnly: boolean;
  provider: string;
  badge?: string;
  description: string;
  lastUpdatedBy?: string;
}

export interface FeatureFlagsSettings {
  flights: ServiceFeatureFlag;
  trains: ServiceFeatureFlag;
  buses: ServiceFeatureFlag;
  hotels: ServiceFeatureFlag;
  resorts: ServiceFeatureFlag;
  tours: ServiceFeatureFlag;
  pilgrimage: ServiceFeatureFlag;
}

export interface SystemSettingsConfig {
  general: GeneralSettings;
  authentication: AuthenticationSettings;
  booking: BookingSettings;
  payment: PaymentSettings;
  commission: CommissionSettings;
  maintenance: MaintenanceSettings;
  featureFlags: FeatureFlagsSettings;
  lastSavedAt: string;
  savedBy: string;
  version: string;
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsConfig = {
  general: {
    platformName: "BharatYatra Superapp",
    tagline: "India's Unified Travel, Tourism & Spiritual Journey Platform",
    currency: "INR (₹)",
    currencySymbol: "₹",
    timezone: "Asia/Kolkata (IST, UTC+05:30)",
    language: "en-IN (English - India)",
    supportEmail: "support@bharatyatra.gov.in",
    supportPhone: "+91 1800-266-7890",
  },
  authentication: {
    customerRegistration: true,
    allowPhoneOtp: true,
    allowGoogleAuth: true,
    requireEmailVerification: false,
    autoActivateCustomer: true,
    partnerRegistration: true,
    partnerApprovalRequired: true,
    mandatoryGstPan: true,
    bankPennyDropVerification: true,
    loginSettings: {
      mfaEnforcement: "admin_only",
      maxFailedAttempts: 5,
      lockoutDurationMinutes: 30,
      sessionTimeoutMinutes: 120,
      allowSimultaneousSessions: false,
      passwordRotationDays: 90,
    },
  },
  booking: {
    bookingEnabled: true,
    emergencyPauseNotice: "Ticket booking engine is momentarily paused for scheduled IRCTC/GDS maintenance. Normal reservations will resume shortly.",
    cancellationRules: {
      freeCancellationHours: 24,
      instantAutoRefund: true,
      convenienceFeeRefundable: false,
      tiers: [
        {
          id: "tier_free",
          windowLabel: "> 24 Hours Before Departure",
          hoursBeforeDeparture: 24,
          penaltyPercentage: 0,
          description: "Zero cancellation fee. 100% fare refunded.",
        },
        {
          id: "tier_standard",
          windowLabel: "12 - 24 Hours Before Departure",
          hoursBeforeDeparture: 12,
          penaltyPercentage: 25,
          description: "Standard 25% operator cancellation fee applies.",
        },
        {
          id: "tier_last_min",
          windowLabel: "4 - 12 Hours Before Departure",
          hoursBeforeDeparture: 4,
          penaltyPercentage: 50,
          description: "Late cancellation: 50% refund on base fare.",
        },
        {
          id: "tier_no_refund",
          windowLabel: "< 4 Hours or Post-Departure",
          hoursBeforeDeparture: 0,
          penaltyPercentage: 100,
          description: "No refund available once manifest charts are locked.",
        },
      ],
    },
    bookingLimits: {
      maxConcurrentActiveBookings: 6,
      maxPassengersPerTicket: 6,
      maxBookingValueWithoutPan: 50000,
      rateLimitRequestsPerMin: 25,
      seatLockDurationMinutes: 15,
    },
  },
  payment: {
    paymentEnabled: true,
    gatewayMode: "production",
    currency: "INR (₹)",
    supportedCurrencies: ["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)", "AED (د.إ)", "SGD ($)"],
    multiCurrencyEnabled: true,
    forexMarkupPercent: 1.8,
    primaryGateway: "zeul_pay",
    fallbackGatewayEnabled: true,
    paymentMethods: {
      upi: true,
      creditDebitCards: true,
      netBanking: true,
      wallets: true,
      emi: true,
      payLater: true,
    },
    instantSplitSettlement: true,
  },
  commission: {
    defaultCommission: 8.5,
    minPlatformFee: 25,
    partnerCommission: {
      flights: 3.5,
      trains: 2.5,
      buses: 6.0,
      hotels: 12.0,
      resorts: 14.0,
      tours: 10.0,
      pilgrimage: 5.0,
    },
    agentCommission: {
      baseAgentCommission: 4.5,
      superAgentBonus: 1.5,
      minPayoutThreshold: 1000,
      tdsSection194HPercent: 5.0,
      tdsSection194OPercent: 1.0,
      payoutCycle: "weekly",
    },
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "BharatYatra is currently undergoing scheduled infrastructure upgrades to optimize high-speed reservation capabilities. We will be back online shortly.",
    maintenanceScope: "entire_platform",
    scheduledStart: "2026-09-20T02:00",
    estimatedCompletionTime: "2026-09-20T04:30",
    allowAdminBypass: true,
    emergencyNoticeBanner: false,
  },
  featureFlags: {
    flights: {
      id: "flights",
      name: "Flight Reservations",
      enabled: true,
      betaOnly: false,
      provider: "Amadeus GDS & TripJack Direct NDC",
      badge: "Fast Booking",
      description: "Domestic and international airline ticketing mesh with real-time seat selection.",
      lastUpdatedBy: "DevOps Lead",
    },
    trains: {
      id: "trains",
      name: "Train Bookings (IRCTC)",
      enabled: true,
      betaOnly: false,
      provider: "IRCTC Direct Authorized B2B Gateway",
      badge: "Instant PNR",
      description: "Live berth availability, Tatkal booking queue, and PNR status tracking.",
      lastUpdatedBy: "Railway Integration Admin",
    },
    buses: {
      id: "buses",
      name: "Intercity Bus Booking",
      enabled: true,
      betaOnly: false,
      provider: "AbhiBus / RedBus Direct Switch",
      badge: "Live GPS",
      description: "Private AC sleeper coaches and State Transport (UPSRTC, KSRTC, MSRTC) buses.",
      lastUpdatedBy: "Transport Ops",
    },
    hotels: {
      id: "hotels",
      name: "Hotel Stays",
      enabled: true,
      betaOnly: false,
      provider: "Expedia Partner Solutions & Direct PMS",
      badge: "Verified Stays",
      description: "Budget to luxury verified hotels with zero-cancellation fee options.",
      lastUpdatedBy: "Hospitality Lead",
    },
    resorts: {
      id: "resorts",
      name: "Resort Retreats",
      enabled: true,
      betaOnly: false,
      provider: "Direct Luxury Resort Extranet",
      badge: "All-Inclusive",
      description: "Ayurvedic retreats, tea estate bungalows, and coastal beach villa bookings.",
      lastUpdatedBy: "Resort Partnerships",
    },
    tours: {
      id: "tours",
      name: "Curated Tour Packages",
      enabled: true,
      betaOnly: false,
      provider: "BharatYatra Destination Desk & DMC",
      badge: "Guided",
      description: "Multi-day holiday packages, heritage city walks, and cultural trails.",
      lastUpdatedBy: "Holiday Products",
    },
    pilgrimage: {
      id: "pilgrimage",
      name: "Pilgrimage & Sacred Yatras",
      enabled: true,
      betaOnly: false,
      provider: "Temple Trust & Devasthanam Direct Board",
      badge: "VIP Darshan",
      description: "Special darshan booking, helicopter yatras (Kedarnath, Vaishno Devi), and sacred tours.",
      lastUpdatedBy: "Devasthan Desk",
    },
  },
  lastSavedAt: new Date().toISOString(),
  savedBy: "Super Admin (Current Session)",
  version: "2.4.0",
};
