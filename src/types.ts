export type ServiceCategory = 
  | "all"
  | "flights" 
  | "trains" 
  | "buses" 
  | "hotels" 
  | "resorts" 
  | "tours" 
  | "pilgrimage" 
  | "cabs" 
  | "dining" 
  | "corporate"
  | "agent";

export interface ServiceMeta {
  id: ServiceCategory;
  name: string;
  hindiName: string;
  tagline: string;
  icon: string;
  badge?: string;
  color: string;
  bgLight: string;
  accent: string;
  popularHighlight: string;
}

export interface CityLocation {
  id: string;
  name: string;
  state: string;
  airportCode?: string;
  railwayCode?: string;
  popular: boolean;
  type: "metro" | "heritage" | "spiritual" | "hillstation" | "beach" | "business";
  image: string;
  tagline: string;
}

export interface TravelOffer {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  discount: string;
  category: ServiceCategory | "all";
  bank?: string;
  validTill: string;
  minBooking: number;
  bgGradient: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
  avatar: string;
  walletBalance: number;
  yatraCoins: number;
  tier: "Silver" | "Gold" | "Platinum Yatri";
  gstNumber?: string;
  companyName?: string;
}

export interface BookingItem {
  id: string;
  serviceType?: ServiceCategory;
  serviceCategory?: ServiceCategory;
  title: string;
  subtitle?: string;
  provider?: string;
  fromLocation?: string;
  toLocation?: string;
  route?: string;
  date: string;
  time?: string;
  status: "confirmed" | "completed" | "upcoming" | "cancelled";
  pnr?: string;
  amount?: number;
  amountPaid?: number;
  passengers?: number;
  passengersCount?: number;
  seatInfo?: string;
  seatOrRoomInfo?: string;
  downloadUrl?: string;
  qrCodeUrl?: string;
  invoiceNumber?: string;
  [key: string]: any;
}

// Service Specific Interfaces
export interface FlightDeal {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: string;
  price: number;
  originalPrice: number;
  tags: string[];
  refundable: boolean;
  mealsIncluded: boolean;
}

export interface FlightTraveller {
  id: string;
  type: "adult" | "child" | "infant";
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob?: string;
  frequentFlyerAirline?: string;
  frequentFlyerNumber?: string;
  wheelchair?: boolean;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  nationality?: string;
}

export interface TrainItem {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[];
  classes: {
    code: "1A" | "2A" | "3A" | "3E" | "CC" | "EC" | "SL";
    name: string;
    price: number;
    availability: string;
    status: "available" | "rac" | "wl";
    confirmationChance?: string;
  }[];
  isVandeBharat?: boolean;
}

export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  rating: number;
  totalReviews: number;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  windowSeats: number;
  isPrimo: boolean;
  isElectric: boolean;
  boardingPoints: string[];
  amenities: string[];
}

export interface HotelItem {
  id: string;
  name: string;
  city: string;
  location: string;
  rating: number;
  reviewsCount: number;
  starCategory: number;
  pricePerNight: number;
  originalPrice: number;
  image: string;
  gallery: string[];
  amenities: string[];
  isCoupleFriendly: boolean;
  freeCancellation: boolean;
  freeBreakfast: boolean;
  tag: string;
}

export interface ResortItem {
  id: string;
  name: string;
  destination: string;
  theme: "Ayurveda Wellness" | "Coffee Estate" | "Beachfront Villa" | "Himalayan Retreat" | "Royal Haveli";
  rating: number;
  pricePerNight: number;
  image: string;
  highlights: string[];
  includedExperiences: string[];
  mealPlan: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: string;
  nights: number;
  days: number;
  pricePerPerson: number;
  image: string;
  rating: number;
  reviews: number;
  highlights: string[];
  itinerary: { day: number; title: string; desc: string }[];
  inclusions: string[];
  groupSize: string;
}

export interface YatraPackage {
  id: string;
  title: string;
  sacredDeity: string;
  circuit: "Chardham" | "Jyotirlinga" | "South Temple Circuit" | "Shaktipeeth" | "Navagraha";
  duration: string;
  price: number;
  image: string;
  vipDarshanIncluded: boolean;
  purohitService: boolean;
  seniorCitizenFriendly: boolean;
  pureSatvikFood: boolean;
  itinerarySummary: string;
  keyDharmashalas: string;
}

export interface CabItem {
  id: string;
  vehicleCategory: "Sedan" | "SUV Prime" | "Innova Crysta" | "Tempo Traveller" | "Hatchback";
  models: string;
  capacity: number;
  luggage: number;
  ac: boolean;
  baseRatePerKm: number;
  estimatedFare: number;
  driverRating: number;
  features: string[];
  tollIncluded: boolean;
}

export interface DiningItem {
  id: string;
  name: string;
  type: "Highway Oasis / Dhaba" | "Heritage Dining" | "Train Seat Delivery" | "Regional Thali";
  highwayOrCity: string;
  cuisine: string;
  rating: number;
  avgCostForTwo: number;
  image: string;
  specialtyDish: string;
  discountOffer: string;
  trainPnrSupported: boolean;
}

export interface CorporatePlan {
  id: string;
  tier: string;
  employeeCount: string;
  creditDays: number;
  gstSavingRate: string;
  features: string[];
  dedicatedDesk: boolean;
}

export interface AIPlanningResponse {
  summary: string;
  recommendedServices: {
    service: ServiceCategory;
    title: string;
    description: string;
    estimatedCost: string;
  }[];
  dayWisePlan?: {
    day: number;
    title: string;
    activities: string[];
    travelLeg: string;
  }[];
  proTips: string[];
  bestTimeToVisit: string;
}

// ==========================================
// PARTNER ECOSYSTEM TYPES
// ==========================================

export type PartnerCategory =
  | "travel_agents"
  | "bus_operators"
  | "hotels"
  | "resorts"
  | "tour_operators"
  | "pilgrimage_operators"
  | "cab_operators"
  | "restaurants";

export type PartnerTab =
  | "overview"
  | "inventory"
  | "availability"
  | "pricing"
  | "bookings"
  | "customers"
  | "payments"
  | "commissions"
  | "settlements"
  | "reports";

export interface PartnerTypeMeta {
  id: PartnerCategory;
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  color: string;
  bgLight: string;
  inventoryUnit: string;
  tagline: string;
}

export interface PartnerProfile {
  id: string;
  name: string;
  businessName: string;
  partnerType: PartnerCategory;
  email: string;
  phone: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
  verified: boolean;
  rating: number;
  totalReviews: number;
  joinedYear: number;
  commissionRate: number; // e.g., 10%
  walletBalance: number;
  pendingSettlement: number;
  totalLifetimeRevenue: number;
  activeInventoryCount: number;
  bankAccountMasked: string;
  ifscCode: string;
}

export interface PartnerInventoryItem {
  id: string;
  partnerType: PartnerCategory;
  name: string;
  subCategory: string;
  capacityUnits: number;
  availableUnits: number;
  basePrice: number;
  currentPrice: number;
  status: "active" | "paused" | "sold_out";
  locationOrRoute: string;
  image: string;
  rating: number;
  tags: string[];
}

export interface PartnerAvailabilitySlot {
  id: string;
  inventoryId: string;
  inventoryName: string;
  date: string;
  timeSlot?: string;
  status: "available" | "blocked" | "booked_full" | "fast_filling";
  totalSlots: number;
  bookedSlots: number;
  surgeMultiplier: number;
}

export interface PartnerPricingRule {
  id: string;
  partnerType: PartnerCategory;
  title: string;
  ruleType: "weekend_surge" | "agent_b2b_discount" | "early_bird" | "seasonal_hike" | "last_minute";
  adjustmentPercent: number; // e.g. +15 or -10
  applicableDays: string;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

export interface PartnerBookingRecord {
  id: string;
  partnerType: PartnerCategory;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  itemName: string;
  travelOrServiceDate: string;
  unitsBooked: number;
  grossAmount: number;
  commissionAmount: number;
  netPayout: number;
  status: "confirmed" | "completed" | "pending" | "cancelled";
  paymentStatus: "paid_online" | "settlement_pending" | "settled";
  createdAt: string;
}

export interface PartnerCustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalBookings: number;
  totalSpent: number;
  vipTier: "Standard" | "Silver" | "Gold" | "Platinum Enterprise";
  lastBookingDate: string;
  ratingScore: number;
  notes?: string;
}

export interface PartnerTransaction {
  id: string;
  date: string;
  type: "customer_payment" | "commission_deduction" | "bank_settlement" | "tax_tds" | "agent_cashback";
  description: string;
  amount: number;
  isCredit: boolean;
  status: "completed" | "processing" | "scheduled";
  referenceId: string;
}

export interface PartnerCommissionTier {
  tierName: string;
  monthlyGmvRange: string;
  commissionPercentage: number;
  agentRebate: number;
  perks: string[];
  isCurrentTier?: boolean;
}

export interface PartnerSettlementRecord {
  id: string;
  settlementCycle: string;
  period: string;
  grossVolume: number;
  commissionCut: number;
  tdsDeducted: number;
  netAmountTransferred: number;
  bankRefNumber: string;
  payoutDate: string;
  status: "transferred" | "in_processing" | "upcoming";
  invoiceUrl: string;
}

export interface PartnerReportData {
  period: string;
  grossRevenue: number;
  netEarnings: number;
  commissionPaid: number;
  totalBookings: number;
  occupancyOrUtilizationRate: number;
  topPerformingItem: string;
  customerSatisfaction: number;
  cancellationRate: number;
}

// ==========================================
// BUSINESS MODEL & REVENUE ENGINE INTERFACES
// ==========================================
export type RevenueStreamId =
  | "booking_commissions"
  | "partner_commissions"
  | "service_convenience_fees"
  | "agent_commissions_markups"
  | "advertising"
  | "premium_partner_subscriptions"
  | "corporate_travel_services"
  | "affiliate_partnerships"
  | "promotional_campaigns";

export interface RevenueStreamMeta {
  id: RevenueStreamId;
  name: string;
  shortName: string;
  category: string;
  icon: string;
  color: string;
  badge: string;
  description: string;
  contributionPercent: number;
  projectedAnnualRevenue: number;
  keyDrivers: string[];
  takeRateFormula: string;
}

export interface BookingCommissionRate {
  serviceCategory: ServiceCategory;
  serviceName: string;
  baseCommissionPercent: number;
  averageOrderValue: number;
  netRevenuePerBooking: number;
  supplierType: string;
  paymentCycle: string;
  notes: string;
}

export interface ConvenienceFeeItem {
  id: string;
  feeName: string;
  serviceType: string;
  feeType: "fixed" | "percentage";
  rate: number;
  gstApplicable: number; // e.g. 18%
  description: string;
  annualVolumeEst: number;
}

export interface AdvertisingSlot {
  id: string;
  title: string;
  placement: "search_top_rank" | "homepage_hero_banner" | "category_spotlight" | "ticket_confirmation_ad";
  pricingModel: "CPC" | "CPM" | "Flat_Weekly";
  priceINR: number;
  impressionsOrClicks: string;
  activeAdvertisers: number;
  ctr: string;
}

export interface PremiumSubscriptionPlan {
  id: string;
  planName: string;
  monthlyPrice: number;
  annualPrice: number;
  commissionDiscount: number; // e.g. 50% discount on standard commission
  zeroCommissionQuota: number; // ₹ GMV per month
  features: string[];
  badge: string;
  popular?: boolean;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  category: "travel_insurance" | "forex_cards" | "airport_lounges" | "visa_processing" | "luggage_concierge";
  partnerBrand: string;
  commissionType: "fixed_cpa" | "rev_share";
  payoutAmount: number; // in INR or %
  attachmentRate: string;
  description: string;
}

export interface CorporatePlanTier {
  tierName: string;
  minEmployees: number;
  platformFeePerUserMonthly: number;
  creditPeriodDays: number;
  creditFinancingRate: number; // in %
  gstAutoReconciliation: boolean;
  dedicatedDeskManager: boolean;
}

export interface PromoCampaignItem {
  id: string;
  campaignTitle: string;
  sponsorBrand: string; // e.g., HDFC Bank, MakeMyTrip, Tourism of Kerala
  sponsorContributionPercent: number; // e.g. 70% merchant funded, 30% platform
  platformMarginPreserved: number;
  status: "active" | "scheduled" | "completed";
  duration: string;
  roiMultiplier: string;
}

