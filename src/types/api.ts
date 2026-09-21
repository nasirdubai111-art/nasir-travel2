// src/types/api.ts
// Comprehensive TypeScript definitions for BharatYatra Unified Travel Microservices & Platform APIs

// ============================================================================
// 1. GENERIC API PROTOCOL & ENVELOPE TYPES
// ============================================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
  latency_ms?: number;
  source?: "REST" | "SUPABASE_EDGE" | "LOCAL_FALLBACK" | "CACHE";
  error?: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: ApiPagination;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  token?: string;
}

// ============================================================================
// 2. AUTH, USER & ADMIN DOMAIN
// ============================================================================

export interface AuthCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  membershipTier: "SILVER" | "GOLD" | "PLATINUM" | "BHARAT_CLUB";
  walletBalance: number;
  loyaltyPoints: number;
  created_at: string;
  verifiedKyc: boolean;
}

export interface AdminRole {
  roleId: string;
  roleName: "SUPER_ADMIN" | "OPERATOR_ADMIN" | "FINANCE_AUDITOR" | "SUPPORT_LEAD";
  permissions: string[];
}

export interface AdminSession {
  adminId: string;
  role: AdminRole;
  token: string;
  lastLogin: string;
}

// ============================================================================
// 3. TRANSPORTATION VERTICALS (TRAIN, FLIGHT, BUS, CAB)
// ============================================================================

export interface TrainStationHalt {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  dayCount: number;
  platform: string;
}

export interface TrainClassFare {
  code: string;
  name: string;
  availableSeats: number;
  status: "AVAILABLE" | "RAC" | "WL" | "REGRET";
  waitlistCount?: number;
  baseFare: number;
  tatkalFare: number;
  dynamicFareMultiplier?: number;
  lastUpdated: string;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  trainType: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  fromStationCode: string;
  toStationCode: string;
  duration: string;
  distanceKm: number;
  runsOn: string[];
  classes: TrainClassFare[];
  foodIncluded: boolean;
  pantryAvailable: boolean;
  eCateringSupported: boolean;
  onTimeRating: number;
  haltsCount: number;
  halts?: TrainStationHalt[];
  rakeComposition?: string[];
}

export interface TrainSearchParams {
  fromStation: string;
  toStation: string;
  date: string;
  quota?: "GENERAL" | "TATKAL" | "PREMIUM_TATKAL" | "LADIES" | "SENIOR_CITIZEN";
  travelClass?: string;
}

export interface TrainPnrStatus {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  fromStation: string;
  toStation: string;
  boardingPoint: string;
  reservationUpto: string;
  quota: string;
  class: string;
  chartStatus: "CHART_PREPARED" | "CHART_NOT_PREPARED";
  passengers: Array<{
    passengerNumber: number;
    bookingStatus: string;
    currentStatus: string;
    coach?: string;
    berth?: string;
    berthType?: string;
  }>;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  logo: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  aircraft: string;
  cabinClasses: string[];
  baggageAllowance: string;
  refundable: boolean;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType?: "ONE_WAY" | "ROUND_TRIP";
  passengers?: number;
  cabinClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

export interface Bus {
  id: string;
  operatorName: string;
  busType: "AC Sleeper" | "Volvo Multi-Axle" | "BharatBenz AC" | "Non-AC Seater";
  departureTime: string;
  arrivalTime: string;
  duration: string;
  boardingPoint: string;
  droppingPoint: string;
  fare: number;
  availableSeats: number;
  totalSeats: number;
  rating: number;
  amenities: string[];
}

export interface BusSearchParams {
  fromCity: string;
  toCity: string;
  travelDate: string;
  busType?: string;
}

export interface CabVehicle {
  id: string;
  model: string;
  category: "Hatchback" | "Sedan" | "SUV" | "Innova Crysta" | "Luxury EV";
  seatingCapacity: number;
  baseFare: number;
  perKmRate: number;
  estimatedTimeMin: number;
  driverRating: number;
  acAvailable: boolean;
}

export interface CabBookingParams {
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  serviceType: "POINT_TO_POINT" | "OUTSTATION" | "AIRPORT_TRANSFER" | "RENTAL_PACKAGE";
  vehicleCategory: string;
}

// ============================================================================
// 4. HOSPITALITY VERTICALS (HOTELS, RESORTS, LODGES, RESTAURANTS)
// ============================================================================

export interface HotelRoom {
  roomId: string;
  name: string;
  capacity: string;
  pricePerNight: number;
  availableCount: number;
  amenities: string[];
  images: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  starRating: number;
  pricePerNight: number;
  guestRating: number;
  reviewsCount: number;
  heroImage: string;
  images: string[];
  amenities: string[];
  rooms: HotelRoom[];
}

export interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  theme: "BEACHFRONT" | "MOUNTAIN_WELLNESS" | "HERITAGE_PALACE" | "BACKWATER_ECO";
  villaTypes: Array<{
    id: string;
    title: string;
    price: number;
    amenities: string[];
  }>;
  rating: number;
  images: string[];
}

export interface Lodge {
  id: string;
  name: string;
  nationalPark: string;
  safariZone: string;
  roomTypes: Array<{
    id: string;
    name: string;
    pricePerNight: number;
    safariIncluded: boolean;
  }>;
  rating: number;
}

export interface RestaurantItem {
  id: string;
  name: string;
  cuisine: string[];
  location: string;
  type: "Dhaba" | "Fine Dining" | "Sattvic Thali" | "Highway Express";
  rating: number;
  averageCostForTwo: number;
  popularDishes: string[];
}

// ============================================================================
// 5. EXPERIENCES & SPECIALIZED VERTICALS (TOURS, PILGRIMAGE, SAFARI, HOUSEBOATS)
// ============================================================================

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  pricePerPerson: number;
  itinerary: Array<{ day: number; title: string; activities: string[] }>;
  highlights: string[];
  rating: number;
  images: string[];
}

export interface PilgrimageYatra {
  id: string;
  title: string;
  sacredCircuit: "Chardham" | "Kashi Vishwanath" | "Tirupati Balaji" | "Vaishno Devi" | "Ayodhya Ram Mandir" | "Jyotirlinga";
  durationDays: number;
  basePrice: number;
  vipDarshanSupported: boolean;
  prasadDeliveryOption: boolean;
  seniorFriendlyPalki: boolean;
  upcomingBatches: Array<{ date: string; seatsAvailable: number }>;
}

export interface JungleSafariPackage {
  id: string;
  parkName: string;
  state: string;
  zone: string;
  slot: "MORNING" | "AFTERNOON" | "NIGHT_PATROL";
  vehicleType: "Gypsy 4x4" | "Canter 20-Seater";
  permitPrice: number;
  naturalistGuideIncluded: boolean;
}

export interface Houseboat {
  id: string;
  boatName: string;
  waterway: "Alleppey" | "Kumarakom" | "Dal Lake Srinagar";
  category: "Deluxe" | "Premium" | "Luxury Presidential";
  bedrooms: number;
  pricePerNight: number;
  chefIncluded: boolean;
  acHours: string;
}

// ============================================================================
// 6. TRANSACTIONS, BOOKINGS & FINANCE
// ============================================================================

export type BookingVertical =
  | "train"
  | "flight"
  | "bus"
  | "hotel"
  | "resort"
  | "lodge"
  | "tour"
  | "pilgrimage"
  | "cab"
  | "restaurant"
  | "safari"
  | "houseboat";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUND_PROCESSED"
  | "COMPLETED"
  | "WAITLIST";

export interface Passenger {
  id?: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  berthPreference?: string;
  seatNumber?: string;
  aadhaarNumber?: string;
  passportNumber?: string;
}

export interface UnifiedBooking {
  id: string;
  bookingRef: string;
  vertical: BookingVertical;
  userId: string;
  itemId: string;
  itemTitle: string;
  journeyDate: string;
  departureTime?: string;
  passengers: Passenger[];
  pricing: {
    baseFare: number;
    taxes: number;
    convenienceFee: number;
    discounts: number;
    totalPayable: number;
    currency: string;
  };
  status: BookingStatus;
  paymentId?: string;
  ticketUrl?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingRef: string;
  amount: number;
  currency: string;
  method: "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET";
  gatewayRef: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  timestamp: string;
}

export interface WalletBalance {
  userId: string;
  currentBalance: number;
  currency: string;
  cashbackEarned: number;
  lastUpdated: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
  referenceId: string;
  timestamp: string;
}

export interface RewardsSummary {
  userId: string;
  pointsAvailable: number;
  tier: "Silver" | "Gold" | "Platinum" | "Ambassador";
  pointsExpiringSoon: number;
  vouchers: Array<{ code: string; discountPercent: number; validUntil: string }>;
}

// ============================================================================
// 7. POST-BOOKING (CANCELLATION, REFUND, TICKET)
// ============================================================================

export interface CancellationPolicy {
  freeCancellationHoursBefore: number;
  penaltyPercentage: number;
  refundMethod: "SOURCE_ACCOUNT" | "BHARAT_WALLET_INSTANT";
}

export interface CancellationResult {
  bookingId: string;
  status: "CANCELLED";
  cancellationCharge: number;
  refundableAmount: number;
  refundReference: string;
}

export interface RefundItem {
  refundId: string;
  bookingId: string;
  originalAmount: number;
  refundAmount: number;
  status: "QUEUED" | "PROCESSING" | "CREDITED";
  estimatedSettlementDays: number;
  processedAt: string;
}

export interface DigitalTicket {
  ticketNumber: string;
  pnrOrBookingRef: string;
  vertical: BookingVertical;
  qrCodeData: string;
  barcode: string;
  passengerNames: string[];
  departureFormatted: string;
  arrivalFormatted: string;
  seatBerthSummary: string;
  supportHelpline: string;
}

// ============================================================================
// 8. B2B, OPERATORS & COMMISSIONS
// ============================================================================

export interface OperatorProfile {
  id: string;
  name: string;
  vertical: BookingVertical;
  gstin: string;
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED";
  commissionRatePercent: number;
  fleetCount?: number;
  rating: number;
  payoutAccount: string;
}

export interface CommissionRecord {
  recordId: string;
  operatorId: string;
  bookingRef: string;
  grossAmount: number;
  commissionEarned: number;
  tdsDeducted: number;
  netPayableToOperator: number;
  settled: boolean;
  settlementBatchId?: string;
}

export interface PartnerB2BAgreement {
  partnerId: string;
  companyName: string;
  apiAccessTier: "SANDBOX" | "PRODUCTION_STANDARD" | "HIGH_VOLUME_ENTERPRISE";
  apiKeyPrefix: string;
  rateLimitPerMinute: number;
  status: "ACTIVE" | "SUSPENDED";
}

// ============================================================================
// 9. PLATFORM, NOTIFICATIONS, OFFERS, CRM & ANALYTICS
// ============================================================================

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: "BOOKING_ALERT" | "PRICE_DROP" | "GATE_CHANGE" | "PROMO" | "SYSTEM";
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle: string;
  category: BookingVertical;
  imageUrl: string;
  deeplink: string;
  active: boolean;
}

export interface PromoOffer {
  code: string;
  title: string;
  description: string;
  vertical: BookingVertical | "ALL";
  discountAmount?: number;
  discountPercentage?: number;
  minimumBookingAmount: number;
  validUntil: string;
}

export interface CRMLeadOrTicket {
  ticketId: string;
  customerName: string;
  contactNumber: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface PlatformAnalyticsMetrics {
  totalGrossBookings: number;
  totalTransactionsCount: number;
  averageOrderValue: number;
  conversionRate: number;
  verticalBreakdown: Record<string, number>;
  activeUsers24h: number;
}
