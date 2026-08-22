export type ServiceCategory = 
  | "all"
  | "flights" 
  | "trains" 
  | "buses" 
  | "hotels" 
  | "lodges"
  | "resorts" 
  | "houseboats"
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
  preferredCurrency?: string;
}

export interface BookingPassengerDetail {
  name: string;
  age?: number;
  gender?: string;
  seatNumber?: string;
  berthType?: string;
  roomType?: string;
  cabinName?: string;
  idProofType?: string;
  idProofNumber?: string;
  mealPreference?: string;
}

export interface BookingPaymentSummary {
  totalAmount: number;
  baseFare: number;
  taxesAndGst: number;
  convenienceFee: number;
  discountApplied: number;
  paymentMode: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | "PAY_AT_HOTEL";
  transactionRef: string;
  paidAt: string;
}

export interface BookingGSTInvoice {
  invoiceNumber: string;
  gstin: string;
  legalEntity: string;
  sacCode: string;
  date: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalInvoiceAmount: number;
  customerGst?: string;
  customerCompanyName?: string;
}

export type TravelServiceType = ServiceCategory;

export interface BusSeatItem {
  seatNumber: string;
  isBooked: boolean;
  isFemaleReserved?: boolean;
  isSelected?: boolean;
  price: number;
  type: "sleeper" | "seater";
  deck: "lower" | "upper";
}

export interface BookingCancellationDetails {
  isEligible: boolean;
  cancellationPolicyRule: string;
  cancellationFee: number;
  refundableAmount: number;
  refundStatus?: "INSTANT_WALLET_CREDITED" | "BANK_TRANSFER_IN_PROGRESS" | "NOT_APPLICABLE" | "REFUND_PROCESSED_WALLET";
  refundRefId?: string;
  refundReference?: string;
  processedAt?: string;
}

export interface BookingModificationRecord {
  modifiedDate: string;
  detail: string;
  oldValue: string;
  newValue: string;
  status: "CONFIRMED";
}

export interface BookingReviewRating {
  rating: number;
  reviewText: string;
  reviewedDate: string;
  compliments?: string[];
  operatorReply?: string;
}

export interface BookingItem {
  id: string;
  serviceType?: ServiceCategory;
  serviceCategory?: ServiceCategory;
  title: string;
  subtitle?: string;
  provider?: string;
  providerLogo?: string;
  fromLocation?: string;
  toLocation?: string;
  route?: string;
  date: string;
  returnDate?: string;
  time?: string;
  arrivalTime?: string;
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
  // Deep Central Profile Attributes
  bookingRef?: string;
  terminalOrPlatformOrJetty?: string;
  pickupAddress?: string;
  dropAddress?: string;
  passengerDetailsList?: BookingPassengerDetail[];
  paymentSummary?: BookingPaymentSummary;
  gstInvoice?: BookingGSTInvoice;
  cancellationDetails?: BookingCancellationDetails;
  modificationHistory?: BookingModificationRecord[];
  reviewRating?: BookingReviewRating;
  supportContactPhone?: string;
  supportHelpdeskId?: string;
  emergencySosActive?: boolean;
  [key: string]: any;
}

// ==========================================
// BUS OPERATOR MODULE TYPES
// ==========================================

export interface BusOperatorKYCDocument {
  id: string;
  docType: "Commercial Passenger Transport License" | "State Transport Permit" | "Certificate of Incorporation" | "PAN Card" | "AIS-140 GPS Compliance Certificate";
  docNumber: string;
  status: "VERIFIED" | "PENDING_RENEWAL" | "SUBMITTED";
  issuedDate: string;
  expiryDate: string;
  issuingAuthority: string;
  fileUrl?: string;
}

export interface BusOperatorOfficeLocation {
  id: string;
  city: string;
  address: string;
  state: string;
  isHQ: boolean;
  managerName: string;
  contactPhone: string;
  depotCapacity: number;
}

export interface BusOperatorProfile {
  id: string;
  businessName: string;
  brandName: string;
  logo: string;
  contactDetails: {
    officialEmail: string;
    tollFree: string;
    emergencyPhone: string;
    operationsDesk: string;
    website: string;
  };
  officeLocations: BusOperatorOfficeLocation[];
  kycDocuments: BusOperatorKYCDocument[];
  gstDetails: {
    gstNumber: string;
    stateName: string;
    sacCode: string;
    filingStatus: "ACTIVE" | "COMPLIANT";
    legalEntity: string;
  };
  bankSettlement: {
    accountHolder: string;
    accountNumberMasked: string;
    bankName: string;
    ifsc: string;
    payoutCycle: "T+1 Daily" | "Weekly" | "Instant Auto-Disbursement";
    upiId: string;
    autoDisburse: boolean;
  };
  verificationStatus: {
    isRtoCertified: boolean;
    safetyScore: number;
    verifiedDate: string;
    auditLevel: "Level 3 Gold Partner";
    activeStatePermits: string[];
  };
}

export interface BusFleetItem {
  id: string;
  busNumber: string; // e.g. DL 01 PC 9988
  fleetId: string; // e.g. FLT-VOLVO-9600
  busType: string; // Volvo 9600 Multi-Axle 15M Luxury Sleeper
  category: "Volvo Multi-Axle" | "Electric Zero-Emission" | "BharatBenz Luxury" | "Scania Metrolink" | "Eicher AC Seater";
  isAC: boolean;
  layoutType: "Sleeper (2+1)" | "Seater (2+2)" | "Semi-Sleeper (2+2)" | "Executive AC (2+1)";
  capacity: {
    total: number;
    lowerDeck: number;
    upperDeck: number;
  };
  amenities: string[];
  vehicleDocuments: {
    fitnessValidTill: string;
    permitType: "All India Tourist Permit (AITP)" | "Stage Carriage State Permit";
    permitNumber: string;
    insuranceValidTill: string;
    pucValidTill: string;
    speedGovernorCalibrated: boolean;
    ais140GpsDeviceId: string;
  };
  assignedDriver: {
    id: string;
    name: string;
    licenseNumber: string;
    badgeNumber: string;
    phone: string;
    experienceYears: number;
    policeVerified: boolean;
    fatigueEyeSensorEnabled: boolean;
    photo?: string;
  };
  maintenanceStatus: "Active in Transit" | "Service Scheduled" | "Depot Inspection Cleared" | "Ready for Boarding";
  odometerKm: number;
  lastServiceDate: string;
}

export interface BusTripStopPoint {
  id: string;
  name: string;
  landmark: string;
  scheduledTime: string;
  contactPhone: string;
}

export interface BusLayoutSeatSpec {
  seatNo: string;
  deck: "lower" | "upper";
  type: "sleeper" | "seater";
  baseFare: number;
  status: "AVAILABLE" | "BOOKED" | "LADIES_QUOTA" | "DRIVER_RESERVED";
  passengerName?: string;
  passengerGender?: "Male" | "Female";
  bookingPnr?: string;
}

export interface BusRouteSchedule {
  id: string;
  routeName: string;
  sourceCity: string;
  destinationCity: string;
  viaNationalHighways: string;
  distanceKm: number;
  approxDuration: string;
  boardingPoints: BusTripStopPoint[];
  droppingPoints: BusTripStopPoint[];
  tripSchedules: {
    tripId: string;
    departureTime: string;
    arrivalTime: string;
    assignedBusId: string;
    assignedBusNumber: string;
    assignedDriverName: string;
    frequency: "Daily" | "Mon, Wed, Fri" | "Weekend Special";
    status: "ON_TIME" | "BOARDING" | "IN_TRANSIT" | "COMPLETED";
    bookedSeatsCount: number;
    totalSeatsCount: number;
  }[];
  seatLayout: {
    lowerDeckSeats: BusLayoutSeatSpec[];
    upperDeckSeats: BusLayoutSeatSpec[];
  };
  baseFare: number;
  weekendSurgePercent: number;
  dynamicPricingActive: boolean;
  cancellationPolicy: {
    hoursBefore: string;
    refundPercent: number;
  }[];
}

export interface BusOperatorDashboardStats {
  todayTripsCount: number;
  todayActivePax: number;
  todayRevenue: number;
  averageOccupancyRate: number;
  upcomingTripsCount: number;
  totalMonthlyRevenue: number;
  pendingSettlement: number;
  cancellationsCount: number;
  refundsProcessed: number;
  onTimePunctualityScore: number;
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

export interface LodgeRatePlan {
  planId: string;
  planName: string;
  mealInclusion: "Room Only (EP)" | "Bed & Breakfast (CP)" | "Breakfast + Dinner (MAP)" | "All Meals & Safari (AP)";
  pricePerNight: number;
  freeCancellationHours: number;
  description: string;
}

export interface LodgeRoomType {
  roomId: string;
  name: string;
  category: "Wooden Cottage" | "Treehouse Suite" | "Stone Cabin" | "Safari Tent" | "Riverfront Chalet" | "Forest Machan";
  capacity: { adults: number; children: number; maxGuests: number };
  bedType: string;
  view: string;
  sizeSqFt: number;
  availableRooms: number;
  ratePlans: LodgeRatePlan[];
  photos: string[];
  features: string[];
}

export interface LodgeAddon {
  id: string;
  name: string;
  price: number;
  unit: "per person" | "per session" | "per vehicle" | "per night";
  icon?: string;
}

export interface LodgeReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedStay: boolean;
  travelerType: "Solo Explorer" | "Wildlife Photographer" | "Family" | "Couple";
}

export interface LodgeItem {
  id: string;
  name: string;
  hindiName?: string;
  destination: string;
  state: string;
  region: string; // e.g. "Jim Corbett Buffer Zone", "Spiti High Altitude", "Kabini Riverfront"
  lodgeType: "Jungle Wildlife Lodge" | "Himalayan Eco Lodge" | "Tea Estate Heritage Lodge" | "Backwater River Lodge" | "Forest Dak Bungalow" | "Desert Camp Lodge";
  rating: number;
  reviewsCount: number;
  startingPricePerNight: number;
  originalPrice: number;
  image: string;
  gallery: string[];
  hostName: string;
  hostExperienceYears: number;
  isSuperHost: boolean;
  isEcoCertified: boolean;
  amenities: string[];
  safariAssistance: boolean;
  bonfireAvailable: boolean;
  organicMealsAvailable: boolean;
  petFriendly: boolean;
  roomTypes: LodgeRoomType[];
  addons: LodgeAddon[];
  reviews: LodgeReview[];
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    idRequirement: string;
    forestEntryPermitRequired: boolean;
  };
  locationCoordinates?: { lat: number; lng: number; mapAddress: string };
}

export interface IRCTCPassenger {
  id: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Transgender";
  berthPreference: "No Choice" | "Lower Berth" | "Middle Berth" | "Upper Berth" | "Side Lower" | "Side Upper" | "Window Seat";
  foodPreference: "Veg" | "Non-Veg" | "Jain Meal" | "No Food";
  seniorCitizenConcession: boolean;
  divyangjan: boolean;
  seatAllotted?: string; // e.g. "B4 / 32 / Lower Berth"
  status?: "CNF" | "RAC" | "WL";
}

export interface IRCTCTrainBookingDetails {
  bookingId: string;
  pnr: string;
  irctcUserId: string;
  trainNumber: string;
  trainName: string;
  trainType: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  quota: "GENERAL" | "TATKAL" | "PREMIUM TATKAL" | "LADIES" | "SENIOR CITIZEN" | "DIVYANGJAN";
  coachClass: string;
  coachClassName: string;
  passengers: IRCTCPassenger[];
  contactMobile: string;
  contactEmail: string;
  baseFare: number;
  irctcConvenienceFee: number;
  travelInsuranceOpted: boolean;
  insuranceFee: number;
  gstAmount: number;
  totalPaid: number;
  autoUpgradationOpted: boolean;
  onlyConfirmBerthsOpted: boolean;
  chartStatus: "CHART NOT PREPARED" | "CHART PREPARED";
  bookingStatus: "CONFIRMED" | "RAC" | "WAITLISTED" | "CANCELLED";
  transactionTimestamp: string;
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

export interface CabDriverDetail {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  languages: string[];
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  kycVerified: boolean;
  photo: string;
  currentLat?: number;
  currentLng?: number;
}

export interface CabTripBooking {
  tripId: string;
  bookingRef: string;
  tripType: "oneway" | "roundtrip" | "hourly" | "airport";
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  vehicleType: string;
  vehicleModel: string;
  baseFare: number;
  distanceKm: number;
  durationText: string;
  driverBata: number;
  tollTax: number;
  gstAmount: number;
  totalFare: number;
  paymentMode: "UPI" | "Card" | "NetBanking" | "Cash to Driver";
  paymentStatus: "paid" | "pending" | "driver_collect";
  rideOtp: string;
  tripStatus: "ASSIGNED" | "ARRIVING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  driver: CabDriverDetail;
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface HouseboatCabin {
  id: string;
  name: string;
  type: "Deluxe AC Bedroom" | "Premium Jacuzzi Cabin" | "Royal Glass Suite" | "Family Connecting Suite";
  capacity: number;
  bedType: string;
  hasPrivateBalcony: boolean;
  hasAttachedBath: boolean;
  acTiming: "24 Hours Full AC" | "9 PM to 6 AM Night AC";
  pricePerNight: number;
  originalPrice: number;
  image: string;
  features: string[];
}

export interface HouseboatRoute {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  cruiseDuration: string;
  highlights: string[];
  itinerary: { time: string; title: string; activity: string }[];
}

export interface HouseboatPackage {
  id: string;
  title: string;
  type: "Day Cruise" | "Overnight Stay" | "2 Nights Backwater Safari" | "Sunset Shikara & Stay";
  checkInTime: string;
  checkOutTime: string;
  cruiseHours: string;
  mealPlanIncluded: "Kerala Traditional Sadhya & Dinner (Full Board)" | "Kashmiri Wazwan & Kahwa" | "Goan Coastal Gourmet" | "Welcome Drinks & Lunch";
  startingPrice: number;
  description: string;
}

export interface HouseboatReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedStay: boolean;
  tripType: string;
}

export interface HouseboatItem {
  id: string;
  name: string;
  category: "Deluxe" | "Premium" | "Luxury";
  charterType: "Private Houseboat" | "Shared Houseboat";
  stayType: "Overnight Stay" | "Day Cruise" | "Both Available";
  destination: "Alleppey (Alappuzha)" | "Kumarakom" | "Srinagar (Dal Lake)" | "Srinagar (Nigeen Lake)" | "Goa (Mandovi River)" | "Goa (Chapora Backwaters)";
  state: "Kerala" | "Jammu & Kashmir" | "Goa";
  waterbody: "Vembanad Lake & Punnamada" | "Dal Lake & Nagin" | "Chapora River Backwaters" | "Mandovi River";
  rating: number;
  reviewsCount: number;
  startingPricePerNight: number;
  originalPrice: number;
  image: string;
  gallery: string[];
  operatorName: string;
  portRegistrationNumber: string;
  safetyCertified: boolean;
  crewCount: number; // e.g. Captain, Private Chef, Engine Master
  totalBedrooms: number;
  amenities: string[];
  diningHighlights: string[];
  routes: HouseboatRoute[];
  cabins: HouseboatCabin[];
  packages: HouseboatPackage[];
  reviews: HouseboatReview[];
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    dockingRules: string;
    safetyCompliance: string;
  };
  locationCoordinates?: { lat: number; lng: number; jettyAddress: string };
  captainBio?: {
    name: string;
    experienceYears: number;
    phone: string;
    speaksLanguages: string[];
    licenseNumber: string;
  };
  deckFacilities?: string[];
  boatTypeDescription?: string;
  maxGuestCapacity?: number;
  minGuestCapacity?: number;
}

export interface HouseboatExperienceActivity {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: "Sightseeing" | "Cultural" | "Adventure" | "Wellness";
  description: string;
  highlightTag?: string;
}

export interface HouseboatPriceCalculation {
  baseCharterTariff: number;
  cruiseDurationHours: number;
  nightsCount: number;
  charterTypeSelected: "Private Charter (Full Boat)" | "Sharing Cabin";
  cabinsCount: number;
  grossAccommodationCharges: number;
  guestCharges: number;
  mealUpgradeCharges: number;
  activityCharges: number;
  transferCharges: number;
  subtotal: number;
  couponDiscount: number;
  coinsDiscount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  portSafetyLevy: number;
  convenienceFee: number;
  finalPayable: number;
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

// ==========================================
// HOTEL, LODGE & RESORT DETAIL & BOOKING PROFILE TYPES
// ==========================================

export type PropertyClassification = "Hotel" | "Heritage Haveli" | "Luxury Resort" | "Eco Lodge" | "Jungle Safari Lodge" | "Wellness Retreat" | "Homestay" | "Houseboat";

export type RoomCategoryType = "Standard" | "Deluxe" | "Suite" | "Family" | "Premium";

export type HotelMealPlanCode = "EP" | "CP" | "MAP" | "AP";

export interface HotelMealPlan {
  planCode: HotelMealPlanCode;
  planName: string; // e.g. "Room Only (EP)", "Bed & Breakfast (CP)", "Half Board (MAP)", "Full Board (AP)"
  description: string;
  pricePerNight: number;
  originalPrice: number;
  freeCancellationUntil: string;
  includesBreakfast: boolean;
  includesLunch?: boolean;
  includesDinner: boolean;
}

export interface HotelRoomSpecification {
  id: string;
  category: RoomCategoryType;
  name: string;
  bedType: "King Bed" | "Twin Beds" | "Queen Bed" | "Super King Bed" | "Family 2-Queen Beds";
  maxAdults: number;
  maxChildren: number;
  roomSizeSqFt: number;
  roomView: string; // e.g. "Lake Pichola View", "Mountain Valley View", "Private Pool View", "Garden View", "City Skyline"
  photos: string[];
  videoTourUrl?: string;
  facilities: string[];
  totalInventory: number;
  availableInventory: number;
  isSoldOut: boolean;
  ratePlans: HotelMealPlan[];
}

export interface HotelFacilityCategory {
  category: "Popular Facilities" | "Wellness & Spa" | "Food & Dining" | "Room Amenities" | "Safety & Hygiene" | "Business & Events" | "Outdoor & Leisure";
  items: Array<{
    name: string;
    icon?: string;
    isComplimentary: boolean;
  }>;
}

export interface HotelPolicySpec {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  childPolicy: string;
  petPolicy: string;
  idProofPolicy: string[];
  localIdsAllowed: boolean;
  coupleFriendlyPolicy: string;
  smokingPolicy: string;
}

export interface HotelNearbyTransit {
  name: string;
  distance: string;
  type: "airport" | "railway" | "attraction" | "bus_stand" | "temple";
}

export interface HotelReviewItem {
  id: string;
  userName: string;
  userCity: string;
  userBadge?: string;
  rating: number;
  date: string;
  comment: string;
  tag: string;
  images?: string[];
  stayType?: "Solo" | "Couple" | "Family with Kids" | "Business";
}

export interface HotelOfferCoupon {
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxDiscount: number;
  minBookingAmount: number;
  badge: string;
}

export interface UnifiedPropertyItem {
  id: string;
  name: string;
  propertyType: PropertyClassification;
  categoryTag: "hotels" | "lodges" | "resorts";
  starCategory: number;
  city: string;
  state: string;
  address: string;
  landmark: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  ratingBreakdown: {
    cleanliness: number;
    location: number;
    service: number;
    food: number;
    valueForMoney: number;
  };
  featuredImage: string;
  galleryImages: string[];
  propertyVideoUrl?: string;
  priceStart: number;
  originalPriceStart: number;
  badge?: string;
  isCoupleFriendly: boolean;
  freeBreakfast: boolean;
  payAtHotel: boolean;
  swimmingPool: boolean;
  petFriendly: boolean;
  description: string;
  roomTypes: HotelRoomSpecification[];
  facilitiesList: HotelFacilityCategory[];
  policies: HotelPolicySpec;
  nearbyTransit: HotelNearbyTransit[];
  reviewsList: HotelReviewItem[];
  availableOffers: HotelOfferCoupon[];
}

export interface RoomGuestAllocationItem {
  roomNumber: number;
  adultsCount: number;
  childrenCount: number;
  guestNames: string[];
  bedPreference: "King Bed" | "Twin Beds" | "No Preference";
  smokingPreference: "Non-Smoking" | "Smoking";
  extraBedRequested: boolean;
}

export interface HotelBookingGuestProfile {
  title: "Mr" | "Ms" | "Mrs" | "Dr";
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  nationality: string; // "Indian" | "International"
  idDocumentType: "Aadhaar Card" | "Passport" | "Voter ID" | "Driving License";
  idDocumentNumber: string;
  specialRequests: string[];
  customRequestNote?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isGstInvoiceRequested: boolean;
  gstDetails?: {
    companyName: string;
    gstin: string;
    companyAddress: string;
  };
}

export interface ResortPackageOption {
  id: string;
  name: string;
  category: "Honeymoon" | "Family" | "Wellness" | "Weekend" | "Adventure" | "Standard";
  tagline: string;
  description: string;
  priceDeltaPerNight: number;
  badge?: string;
  inclusions: string[];
  recommendedFor: string;
}

export interface ResortActivityItem {
  id: string;
  title: string;
  category: "Boating & Water" | "Adventure & Trails" | "Wildlife Safari" | "Plantation & Nature" | "Spa & Wellness" | "Cultural & Games";
  description: string;
  duration: string;
  pricePerPerson: number;
  isComplimentary: boolean;
  image?: string;
  slotsAvailable: string[];
}

export interface ResortDiningItem {
  id: string;
  name: string;
  type: "Fine Dining Restaurant" | "Beachfront Grill" | "Plantation Café" | "Private Gazebo" | "Floating Pool Breakfast" | "In-Villa Dining";
  cuisine: string;
  timing: string;
  description: string;
  specialExperience?: string;
  pricePerCouple?: number;
  photos: string[];
}

export interface UnifiedResortItem extends UnifiedPropertyItem {
  resortStyle?: "Waterfront Backwaters" | "Coffee Plantation" | "Jungle Safari" | "Tropical Beachfront" | "Himalayan Mountain" | "Heritage Palace";
  privatePoolAvailable?: boolean;
  beachfrontOrLakefront?: boolean;
  wellnessSpaRating?: number;
  curatedPackages: ResortPackageOption[];
  resortActivities: ResortActivityItem[];
  diningVenues: ResortDiningItem[];
  virtualTour360Url?: string;
  conciergeContact: {
    phone: string;
    email: string;
    whatsapp: string;
    managerName: string;
  };
}

export interface ResortPriceCalculation {
  baseNightRate: number;
  nightsCount: number;
  roomsCount: number;
  grossRoomTariff: number;
  packageCharges: number;
  activityCharges: number;
  transferCharges: number;
  extraBedCharges: number;
  subtotal: number;
  couponDiscount: number;
  coinsDiscount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  convenienceFee: number;
  finalPayable: number;
}

// ==========================================
// TOUR OPERATOR & TOUR BOOKING TYPES
// ==========================================

export interface TourPackageAddOn {
  id: string;
  name: string;
  description: string;
  category: "transfer" | "upgrade" | "activity" | "meal" | "insurance";
  pricePerUnit: number;
  priceType: "per_person" | "per_room" | "per_booking";
  selectedByDefault?: boolean;
}

export interface TourDepartureBatch {
  id: string;
  departureDate: string;
  returnDate: string;
  totalSeats: number;
  bookedSeats: number;
  status: "Available" | "Filling Fast" | "Guaranteed Departure" | "Sold Out";
  priceMultiplier: number;
}

export interface TourGuideInfo {
  id: string;
  name: string;
  photo: string;
  languages: string[];
  experienceYears: number;
  licenseNumber: string;
  rating: number;
  speciality: string;
}

export interface TourAccommodationInfo {
  tier: "Standard 3-Star" | "Deluxe 4-Star" | "Luxury Heritage 5-Star" | "Eco Luxury Camp";
  hotelsList: {
    city: string;
    hotelName: string;
    roomCategory: string;
    rating: number;
    photos: string[];
  }[];
  roomConfigurations: ("Single" | "Double / Twin" | "Triple" | "Family Suite")[];
}

export interface TourTransportInfo {
  primaryMode: "Private AC Sedan/SUV" | "AC Luxury Volvo Coach" | "Vande Bharat Express + Cab" | "Flight + AC Cab";
  vehicleTypes: string[];
  airportTransfersIncluded: boolean;
  intercityTransfersIncluded: boolean;
}

export interface TourMealInfo {
  mealPlan: "CP - Breakfast Only" | "MAP - Breakfast & Dinner" | "AP - All Meals (Breakfast, Lunch, Dinner)" | "Custom Culinary Experience";
  dietaryOptions: string[];
  signatureMeals: string[];
}

export interface TourCustomerReview {
  id: string;
  userName: string;
  userCity: string;
  userAvatar?: string;
  rating: number;
  travelDate: string;
  travelGroup: "Family" | "Couple" | "Solo" | "Friends Group";
  comment: string;
  photos?: string[];
  verified: boolean;
}

export interface TourOperatorProfile {
  id: string;
  name: string;
  brandName: string;
  logo: string;
  coverImage: string;
  description: string;
  yearsInBusiness: number;
  rating: number;
  reviewsCount: number;
  verifiedBadges: string[];
  destinationsCovered: {
    cities: string[];
    states: string[];
    countries: string[];
  };
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    emergencyHelpline: string;
    officeAddress: string;
    operatingHours: string;
  };
  guidesCount: number;
  fleetCount: number;
  completedToursCount: number;
  kycStatus?: "VERIFIED" | "PENDING" | "REJECTED";
  panNumber?: string;
  gstin?: string;
  iatoRegNumber?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
  };
  commissionRate?: number;
}

export interface UnifiedTourPackage {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorLogo: string;
  title: string;
  subtitle: string;
  destination: string;
  states: string[];
  category: "Heritage" | "Honeymoon" | "Beach" | "Wildlife" | "Adventure" | "Spiritual" | "Golden Triangle" | "Backwaters" | "Family Special";
  durationDays: number;
  durationNights: number;
  durationText: string;
  minGroupSize: number;
  maxGroupSize: number;
  rating: number;
  reviewsCount: number;
  featuredImage: string;
  gallery: string[];
  pricePerAdult: number;
  originalPrice: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    dayNumber: number;
    title: string;
    activities: string[];
    mealsIncluded: string[];
    stayHotel: string;
    transferType: string;
  }[];
  departureBatches: TourDepartureBatch[];
  accommodation: TourAccommodationInfo;
  transport: TourTransportInfo;
  meals: TourMealInfo;
  activities: string[];
  guideInfo: TourGuideInfo;
  addOns: TourPackageAddOn[];
  offers: {
    code: string;
    discountPercent: number;
    maxDiscount: number;
    description: string;
  }[];
  reviews: TourCustomerReview[];
  policies: {
    cancellationRules: {
      daysBefore: string;
      refundPercentage: number;
      penalty: string;
    }[];
    childPolicy: string;
    paymentTerms: string;
    identificationRequired: string;
  };
  supportContact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
}

export interface TourBookingTravellerProfile {
  leadName: string;
  mobile: string;
  email: string;
  adultsCount: number;
  childrenCount: number;
  nationality: string;
  idType: "Aadhaar Card" | "Passport" | "Voter ID" | "Driving License";
  idNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  specialRequests: string[];
  roomRequirement: "Single Occupancy" | "Double Occupancy" | "Twin Beds" | "Family Suite + Extra Bed";
  transportOption: "Standard AC Coach" | "Upgrade to Private Sedan" | "Upgrade to Private SUV (Innova Crysta)";
  dietaryPreference: "Vegetarian" | "Non-Vegetarian" | "Jain Food" | "No Preference";
  isGstInvoice: boolean;
  gstDetails?: {
    companyName: string;
    gstin: string;
    address: string;
  };
}

export interface TourPriceCalculation {
  basePackagePrice: number;
  travellerPriceAdults: number;
  travellerPriceChildren: number;
  accommodationCharges: number;
  transportUpgradeCharges: number;
  addOnsTotal: number;
  subtotal: number;
  couponDiscount: number;
  coinsDiscount: number;
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  platformFee: number;
  finalPayable: number;
}

export interface OperatorBookingRecord {
  id: string;
  bookingRef: string;
  packageId: string;
  packageTitle: string;
  leadTravellerName: string;
  travellerPhone: string;
  travellerEmail: string;
  departureDate: string;
  returnDate: string;
  adultsCount: number;
  childrenCount: number;
  totalGuests: number;
  roomType: string;
  transportMode: string;
  specialRequests?: string;
  grossAmount: number;
  platformFee: number;
  netOperatorEarnings: number;
  status: "CONFIRMED" | "DISPATCHED" | "COMPLETED" | "RESCHEDULED" | "CANCELLED";
  paymentStatus: "PAID_ONLINE" | "ADVANCE_PAID" | "SETTLED_TO_OPERATOR";
  assignedGuide?: string;
  assignedVehicle?: string;
  manifestPassengers: {
    name: string;
    age: number;
    gender: "M" | "F" | "Other";
    idProof: string;
    mealPreference: string;
  }[];
}

export interface OperatorSettlementBatch {
  id: string;
  batchDate: string;
  period: string;
  totalBookings: number;
  grossBookingValue: number;
  platformCommission: number;
  tdsDeduction: number;
  netPayoutAmount: number;
  utrNumber: string;
  bankAccount: string;
  status: "SETTLED" | "PROCESSING" | "PENDING_INVOICE";
  gstr1InvoiceRef: string;
}

// -------------------------------------------------------------
// TRAVEL AGENT PUBLIC PROFILE & BACKEND ENTERPRISE ARCHITECTURE
// -------------------------------------------------------------

export interface AgentVerificationBadge {
  label: string;
  issuer: string;
  badgeCode: string;
  isVerified: boolean;
}

export interface AgentTourPackageSummary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  category: string;
  inclusions: string[];
  highlights: string[];
}

export interface AgentGalleryItem {
  url: string;
  caption: string;
  category: "office" | "destination" | "tour_group" | "award";
}

export interface AgentOfferItem {
  code: string;
  title: string;
  discountText: string;
  description: string;
  validTill: string;
  minAmount: number;
}

export interface AgentCustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  serviceBooked: string;
  verifiedTrip: boolean;
}

export interface TravelAgentPublicProfile {
  id: string;
  agentName: string;
  businessName: string;
  tradeName: string;
  logo: string;
  coverImage: string;
  tagline: string;
  description: string;
  verified: boolean;
  verificationBadges: AgentVerificationBadge[];
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  services: ("flights" | "trains" | "buses" | "hotels" | "resorts" | "tours" | "pilgrimage" | "cabs")[];
  destinationsCovered: {
    cities: string[];
    states: string[];
    countries: string[];
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    tollFree?: string;
    emergencySupport: string;
  };
  officeDetails: {
    headOffice: {
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    branchOffices?: {
      city: string;
      address: string;
      phone: string;
    }[];
    workingHours: string;
    workingDays: string;
  };
  gallery: AgentGalleryItem[];
  offers: AgentOfferItem[];
  reviews: AgentCustomerReview[];
  packages: AgentTourPackageSummary[];
  accreditations: {
    iata?: string;
    taai?: string;
    irctc?: string;
    ministryOfTourism?: string;
    gstin: string;
    pan: string;
  };
}

export interface AgentCustomerEnquiry {
  id: string;
  agentId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceRequested: string;
  destination: string;
  travelDate: string;
  travellersCount: number;
  budgetPerPerson: number;
  message: string;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
  assignedAgent: string;
  notes?: string;
}

export interface AgentBookingRecord {
  id: string;
  bookingRef: string;
  agentId: string;
  serviceCategory: "flights" | "trains" | "buses" | "hotels" | "resorts" | "tours" | "pilgrimage";
  serviceTitle: string;
  providerName: string;
  leadCustomer: {
    name: string;
    phone: string;
    email: string;
    city: string;
  };
  travellers: {
    name: string;
    age: number;
    gender: string;
    idProofType?: string;
    idProofNumber?: string;
    seatOrRoom?: string;
  }[];
  travelDates: {
    start: string;
    end?: string;
  };
  origin: string;
  destination: string;
  basePrice: number;
  taxesGst: number;
  agentCommission: number;
  platformFee: number;
  totalPayable: number;
  paymentStatus: "PAID_ONLINE" | "AGENT_WALLET_DEBIT" | "SETTLED";
  bookingStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  ticketOrPnr: string;
  issuedAt: string;
}

export interface AgentTechnicalApiEndpoint {
  service: string;
  providerGds: string;
  status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE";
  latencyMs: number;
  todayCalls: number;
  errorRate: string;
  endpointUrl: string;
}

// ==========================================
// PILGRIMAGE OPERATOR & YATRA BOOKING TYPES
// ==========================================

export interface PilgrimageDestinationInfo {
  id: string;
  name: string;
  hindiName?: string;
  category: "Char Dham" | "12 Jyotirlinga" | "Shaktipeeth" | "Divya Desam" | "Sanatan Circuit" | "Kailash Mansarovar";
  deity: string;
  location: string;
  state: string;
  image: string;
  bestSeason: string;
  significance: string;
}

export interface PilgrimageDepartureBatch {
  id: string;
  date: string;
  returnDate: string;
  totalSeats: number;
  availableSeats: number;
  status: "OPEN" | "FILLING_FAST" | "SOLD_OUT";
  batchPricePerPerson: number;
}

export interface PilgrimageDayItinerary {
  day: number;
  title: string;
  places: string[];
  morningRitual: string;
  eveningRitual: string;
  nightHalt: string;
  mealsIncluded: string[];
}

export interface PilgrimageYatraPackage {
  id: string;
  operatorId: string;
  operatorName: string;
  title: string;
  hindiTitle: string;
  circuitCategory: "Char Dham" | "12 Jyotirlinga" | "Shaktipeeth" | "Divya Desam" | "Sanatan Circuit" | "Kailash Mansarovar";
  sacredDeity: string;
  destinationsCovered: string[];
  durationDays: number;
  durationNights: number;
  duration: string;
  featuredImage: string;
  galleryImages: string[];
  basePricePerPerson: number;
  originalPrice: number;
  groupDiscountPercent: number;
  rating: number;
  reviewsCount: number;
  departureDates: PilgrimageDepartureBatch[];
  inclusions: string[];
  exclusions: string[];
  itinerary: PilgrimageDayItinerary[];
  accommodationDetails: {
    type: "Dharamshala & Ashram" | "3-Star Deluxe Hotel" | "4-Star Luxury Heritage Resort" | "VIP Alpine Tents";
    name: string;
    description: string;
    amenities: string[];
    pureSatvikDining: boolean;
    oxygenAvailable: boolean;
  };
  transportDetails: {
    mode: "AC Volvo Coach" | "Tempo Traveller" | "Private SUV Innova" | "Helicopter VIP Shuttle" | "IRCTC Bharat Gaurav Train";
    vehicleModel: string;
    gpsTracking: boolean;
    certifiedPahadiDriver: boolean;
    description: string;
  };
  darshanServices: {
    vipSugamPassIncluded: boolean;
    templePassType: string;
    priorityQueueAccess: boolean;
    aartiPasses: string[];
  };
  priestGuideServices: {
    vedicPurohitAssigned: boolean;
    pujariSamagriIncluded: boolean;
    spiritualGuideLanguages: string[];
    personalSankalp: boolean;
  };
  mealPlan: {
    type: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    jainOption: boolean;
    vratSpecial: boolean;
  };
  specialAssistance: {
    wheelchairAvailable: boolean;
    palkiPonySupport: boolean;
    batteryCarAssistance: boolean;
    portableOxygenKit: boolean;
  };
}

export interface PilgrimMemberDetail {
  id: string;
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  isSeniorCitizen: boolean;
  idType: "Aadhaar" | "Passport" | "Voter ID";
  idNumber: string;
  medicalFitnessCertified: boolean;
  specialRequirements?: string;
  seatOrRoomAllocation?: string;
}

export interface PilgrimageBookingRecord {
  id: string;
  bookingRef: string;
  pnrNumber: string;
  operatorId: string;
  packageId: string;
  packageName: string;
  circuit: string;
  departureDate: string;
  returnDate: string;
  departurePoint: string;
  leadPilgrim: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  pilgrims: PilgrimMemberDetail[];
  adultsCount: number;
  childrenCount: number;
  seniorCount: number;
  totalPilgrims: number;
  selectedAccommodationTier: "Standard Dharamshala" | "Deluxe 3-Star Hotel" | "VIP Heritage Resort";
  selectedTransportMode: "AC Volvo Coach" | "Tempo Traveller" | "Private Innova Crysta" | "Helicopter VIP Shuttle";
  addOnsSelected: {
    vipDarshanPass: boolean;
    personalPurohitPooja: boolean;
    palkiPonyArrangement: boolean;
    sattvicMealPlanFull: boolean;
    oxygenKit: boolean;
    sacredPrasadDeliveryHome: boolean;
    roomUpgrade: boolean;
  };
  fareBreakdown: {
    baseFare: number;
    travellerCharges: number;
    accommodationCharge: number;
    transportCharge: number;
    mealsCharge: number;
    addOnsTotal: number;
    gstTaxes: number;
    platformFee: number;
    discountAmount: number;
    couponCodeApplied?: string;
    totalPayable: number;
  };
  paymentDetails: {
    paymentMethod: "UPI" | "CREDIT_DEBIT_CARD" | "NET_BANKING" | "WALLET";
    transactionId: string;
    paidAt: string;
    status: "PAID" | "PENDING" | "REFUNDED";
  };
  status: "CONFIRMED" | "PENDING" | "RESCHEDULED" | "CANCELLED" | "COMPLETED";
  voucherUrl: string;
  qrCodeUrl: string;
  gstInvoiceNumber: string;
  issuedAt: string;
  assignedGuide?: string;
  assignedVehicle?: string;
  assignedRoom?: string;
}

export interface PilgrimageOperatorProfile {
  id: string;
  businessName: string;
  brandName: string;
  tagline: string;
  logo: string;
  bannerImage: string;
  description: string;
  experienceYears: number;
  totalYatrisServed: number;
  rating: number;
  reviewsCount: number;
  verification: {
    isGovtApproved: boolean;
    govtCertNumber: string;
    templeBoardEmpanelments: string[];
    irctcAffiliated: boolean;
    isoCertified: string;
    safetyAudited: boolean;
    badgeText: string;
  };
  destinations: PilgrimageDestinationInfo[];
  officeContact: {
    hqAddress: string;
    city: string;
    state: string;
    helplinePhone: string;
    emergencyYatraPhone: string;
    whatsapp: string;
    officialEmail: string;
    operatingHours: string;
    branchOffices: string[];
  };
  policies: {
    cancellationRules: string[];
    refundPolicy: string;
    seniorMedicalGuidelines: string[];
    dressCodeNotice: string;
    termsAndConditions: string;
  };
  bankSettlement: {
    accountHolder: string;
    accountNumberMasked: string;
    bankName: string;
    ifsc: string;
    payoutCycle: "T+1 Daily" | "Weekly on Tuesday" | "Instant Yatra Closure";
    panNumber: string;
    gstin: string;
  };
}

export interface PilgrimageRoomInventory {
  id: string;
  hotelOrAshramName: string;
  destination: string;
  roomCategory: "Dharamshala Room" | "Deluxe AC Room" | "Luxury Cottage" | "Ashram Dormitory";
  totalRooms: number;
  allocatedRooms: number;
  availableRooms: number;
  nightlyTariff: number;
  hasOxygenSupport: boolean;
  satvikKitchenOnsite: boolean;
}

export interface PilgrimageTransportFleet {
  id: string;
  vehicleType: "Volvo 9600 AC Coach" | "Force Urbania 17-Seater" | "Innova Crysta Luxury" | "Helicopter Bell 407";
  registrationNumber: string;
  seatingCapacity: number;
  driverName: string;
  driverPhone: string;
  pahadiDrivingExperienceYears: number;
  gpsTracked: boolean;
  assignedCircuit: string;
  status: "ACTIVE_EN_ROUTE" | "AVAILABLE_DEPOT" | "SCHEDULED_DEPARTURE" | "MAINTENANCE";
}

export interface PilgrimagePriestGuide {
  id: string;
  fullName: string;
  title: "Head Vedic Purohit" | "Senior Spiritual Guide" | "Char Dham Yatra Escort" | "Sanskrit Acharya";
  languages: string[];
  experienceYears: number;
  phone: string;
  assignedTemples: string[];
  verifiedByTempleBoard: boolean;
  status: "ASSIGNED" | "AVAILABLE";
}

export interface PilgrimageSettlementRecord {
  id: string;
  payoutRef: string;
  period: string;
  grossBookingsAmount: number;
  platformFee: number;
  tdsDeducted: number;
  netSettlementAmount: number;
  status: "SETTLED_RTGS" | "PROCESSING" | "PENDING_AUDIT";
  settledDate: string;
  utrNumber: string;
  bankAccountMasked: string;
}




