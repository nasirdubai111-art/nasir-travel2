// Booking Hierarchy & Relational Schema Types
// Reflecting the canonical structure:
// bookings
//    │
//    ├── booking_id
//    │
//    ├── bookings_items
//    │      ├── Flight
//    │      ├── Train
//    │      ├── Bus
//    │      ├── Hotel
//    │      ├── Resort
//    │      ├── Lodge
//    │      ├── Tour
//    │      ├── Pilgrimage
//    │      └── Cab
//    │
//    └── payments
//           └── payment_transactions

export type BookingItemType =
  | "Flight"
  | "Train"
  | "Bus"
  | "Hotel"
  | "Resort"
  | "Lodge"
  | "Tour"
  | "Pilgrimage"
  | "Cab";

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded";

export type ItemStatus = "confirmed" | "pending" | "cancelled" | "completed";

export type PaymentTransactionStatus =
  | "captured"
  | "created"
  | "authorized"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking"
  | "wallet"
  | "emi"
  | "split_route";

// --- 1. Specific Item Details Interfaces ---

export interface FlightItemDetails {
  airline: string;
  flightNumber: string;
  pnr: string;
  originIata: string;
  originCity: string;
  originAirport: string;
  destinationIata: string;
  destinationCity: string;
  destinationAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  seatNumber?: string;
  baggageAllowanceKg: number;
  terminal?: string;
}

export interface TrainItemDetails {
  trainNumber: string;
  trainName: string;
  pnr: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  coach: string;
  berthNumber: string;
  berthType: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper" | "Executive";
  travelClass: "1A" | "2A" | "3A" | "CC" | "SL" | "EC";
  quota: "GN" | "TATKAL" | "PREMIUM_TATKAL" | "LADIES";
}

export interface BusItemDetails {
  busOperator: string;
  busType: string; // e.g. "Volvo Multi-Axle AC Sleeper (2+1)"
  route: string;
  boardingPoint: string;
  boardingTime: string;
  droppingPoint: string;
  droppingTime: string;
  seatNumbers: string[];
  liveTrackingAvailable: boolean;
}

export interface HotelItemDetails {
  propertyName: string;
  city: string;
  address: string;
  starRating: number;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  guestsCount: number;
  roomsCount: number;
  mealPlan: "EP (Room Only)" | "CP (Breakfast)" | "MAP (Breakfast + Dinner)" | "AP (All Meals)";
  confirmationCode: string;
}

export interface ResortItemDetails {
  resortName: string;
  destination: string; // e.g. "Goa Beachfront", "Munnar Tea Valley", "Kabini Riverside"
  villaOrCottageType: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  packageTheme: "Beachfront Luxury" | "Ayurvedic Wellness" | "Hilltop Plantation" | "Spa Retreat";
  includedAmenities: string[];
  complimentaryActivities: string[];
  wellnessSessionsIncluded: number;
}

export interface LodgeItemDetails {
  lodgeName: string;
  reserveOrHillStation: string; // e.g. "Jim Corbett National Park", "Kaziranga", "Ranthambore"
  forestZone: string; // e.g. "Bijrani Zone", "Dhikala", "Western Range"
  checkInDate: string;
  checkOutDate: string;
  safariIncluded: boolean;
  safariPermitNumber?: string;
  jeepSafariSlots?: string[];
  naturalistGuideAssigned: string;
  ecoTaxLevyINR: number;
}

export interface TourItemDetails {
  tourName: string;
  itineraryCode: string;
  durationDays: number;
  durationNights: number;
  groupType: "Private Custom" | "Group Escorted" | "Luxury Small Group";
  primaryDestinations: string[];
  tourGuideName: string;
  tourGuideContact: string;
  spokenLanguages: string[];
  allInclusiveSightseeing: boolean;
  vehicleIncluded: string;
}

export interface PilgrimageItemDetails {
  yatraName: string; // e.g. "Kedarnath VIP Helicopter Darshan", "Tirupati Balaji Special Entry", "Vaishno Devi Ropeway"
  templeOrShrine: string;
  darshanDate: string;
  darshanSlot: string; // e.g. "06:00 AM - 08:30 AM (Brahma Muhurat)"
  passType: "VIP Priority Darshan" | "Helicopter Shuttling" | "Shrine Board Special Pass" | "Ropeway Express";
  tokenOrPassId: string;
  biometricRegistered: boolean;
  prasadDeliveryIncluded: boolean;
  authorizedPanditOrSevak?: string;
}

export interface CabItemDetails {
  cabType: "Hatchback" | "Sedan" | "SUV (Innova/Ertiga)" | "Luxury SUV" | "Tempo Traveller";
  vehicleModel: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  totalDistanceKm: number;
  tollAndParkingIncluded: boolean;
  outstationType: "One-way Outstation" | "Roundtrip" | "Local Airport Transfer" | "Sightseeing Package";
}

// Union of all item detail types
export type BookingItemDetailsMap = {
  Flight: FlightItemDetails;
  Train: TrainItemDetails;
  Bus: BusItemDetails;
  Hotel: HotelItemDetails;
  Resort: ResortItemDetails;
  Lodge: LodgeItemDetails;
  Tour: TourItemDetails;
  Pilgrimage: PilgrimageItemDetails;
  Cab: CabItemDetails;
};

// Generic or typed item in `bookings_items`
export interface BookingItem<T extends BookingItemType = BookingItemType> {
  id: string;
  bookingId: string;
  itemType: T;
  title: string;
  serviceProvider: string;
  itemCodeOrPnr: string;
  startDate: string;
  endDate?: string;
  amount: number;
  taxRatePercent: number;
  status: ItemStatus;
  sacCode: string;
  details: BookingItemDetailsMap[T];
  createdAt: string;
}

// --- 2. Payment Transactions Schema ---

export interface PaymentTransaction {
  transactionId: string;
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  signatureVerified: boolean;
  amount: number;
  currency: "INR";
  status: PaymentTransactionStatus;
  paymentMethod: PaymentMethod;
  paymentMethodDetail?: string; // e.g. "UPI: gpay@okaxis", "Visa ending in 4242"
  receiptNumber: string;
  taxInvoiceNumber?: string;
  nodalEscrowStatus?: "held" | "released" | "split_settled" | "refunded";
  subMerchantSplits?: {
    partnerAccountId: string;
    partnerName: string;
    amount: number;
    commissionPercent: number;
  }[];
  errorMessage?: string;
  createdAt: string;
  verifiedAt?: string;
}

// --- 3. Parent Booking Schema ---

export interface BookingCustomer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  panNumber?: string;
  gstin?: string;
  city?: string;
  loyaltyTier?: "Silver" | "Gold" | "Platinum" | "Yatra Elite";
}

export interface BookingHierarchy {
  bookingId: string; // root booking_id e.g. "BY-BK-2026-98101"
  customer: BookingCustomer;
  bookingDate: string;
  travelStartDate: string;
  travelEndDate: string;
  status: BookingStatus;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  netPayableAmount: number;
  currency: "INR";
  specialRequests?: string;
  internalNotes?: string;

  // bookings_items child node
  bookingsItems: BookingItem[];

  // payments child node
  payments: {
    paymentTransactions: PaymentTransaction[];
    totalPaidAmount: number;
    balanceDue: number;
    paymentStatus: "paid" | "partial" | "unpaid" | "refunded";
  };

  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
