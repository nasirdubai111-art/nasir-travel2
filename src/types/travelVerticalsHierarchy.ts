// ============================================================================
// BHARATYATRA TRAVEL VERTICALS RELATIONAL HIERARCHY & SCHEMAS
// 1. HOUSEBOATS: houseboats -> (houseboat_id) -> houseboat_bookings (customer_id, partner_id, payment_id)
//    Funnel: Customer -> Search -> Details -> Select Dates -> Guest Details -> Booking -> Payment -> Confirmed -> Ticket/Invoice
// 2. WILDLIFE SAFARI:
//    - safari_packages: Package, National Park, Zone, Safari Type, Vehicle, Date/Season, Pricing, Availability
//    - safari_bookings: Customer, Safari Package, Safari Date, Passenger Count, Vehicle, Payment, Booking Status, Ticket/QR Code
// 3. CAB: cab (1) -> cab_bookings (many)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. HOUSEBOATS & HOUSEBOAT BOOKINGS
// ----------------------------------------------------------------------------

export interface HouseboatCabinOption {
  cabinId: string;
  name: string;
  type: "Deluxe AC Cabin" | "Premium Glass-Front Suite" | "Honeymoon Jacuzzi Suite" | "Presidential Upper-Deck";
  beds: string;
  maxGuests: number;
  pricePerNight: number;
  amenities: string[];
}

export interface Houseboat {
  houseboatId: string; // Primary Key e.g. "HB-KL-ALPY-01"
  partnerId: string; // Foreign Key to partner / fleet operator e.g. "PTR-ALLEPPEY-ROYAL"
  partnerName: string;
  name: string;
  vesselRegistrationNumber: string; // Port of Registry e.g. "KIV/ALP/HB/2024/0912"
  waterbody: "Vembanad Lake" | "Punnamada Backwaters" | "Dal Lake" | "Nigeen Lake" | "Chapora River Goa";
  destination: "Alleppey" | "Kumarakom" | "Srinagar" | "Goa";
  state: "Kerala" | "Jammu & Kashmir" | "Goa";
  totalBedrooms: number;
  maxGuests: number;
  crewCount: number; // Captain, Cook, Engine Driver
  crewDetails: {
    captainName: string;
    chefName: string;
    contactPhone: string;
  };
  startingPricePerNight: number;
  taxRatePercent: number; // 5% GST
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  features: string[];
  diningSpecialties: string[];
  cabins: HouseboatCabinOption[];
  safetyCertificates: string[];
  availableDates: string[]; // ISO dates e.g. ["2026-09-20", "2026-09-21"]
  status: "active" | "docked" | "maintenance";
}

export interface HouseboatGuestManifestItem {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  idProofType: "Aadhaar" | "Passport" | "Voter ID" | "Driving License";
  idProofNumber: string;
}

export interface HouseboatBooking {
  bookingId: string; // Primary Key e.g. "HB-BK-2026-7819"
  houseboatId: string; // Foreign Key -> houseboats(houseboat_id)
  customerId: string; // Foreign Key -> customers(customer_id)
  partnerId: string; // Foreign Key -> partners(partner_id)
  paymentId: string; // Foreign Key -> payments.payment_transactions(transaction_id)
  
  // Funnel & Journey details
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
  };
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string; // e.g. "12:00 PM"
  checkOutTime: string; // e.g. "09:30 AM"
  totalNights: number;
  guestsCount: {
    adults: number;
    children: number;
  };
  guestManifest: HouseboatGuestManifestItem[];
  selectedCabinId?: string;
  selectedCabinName?: string;
  charterType: "Exclusive Private Charter" | "Single Cabin Booking";
  mealPlan: "Authentic Kerala Sadhya & Karimeen Fry" | "Pure Vegetarian & Jain" | "Kashmiri Wazwan & Kahwa" | "Goan Coastal Gourmet";
  specialRequests?: string;
  
  // Financial breakdown
  baseFare: number;
  mealsIncludedFare: number;
  specialAddonsFare: number;
  discountAmount: number;
  taxAmountGst: number;
  totalAmount: number;
  netPayableAmount: number;

  // Payment linkage
  payment: {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    paymentMethod: "UPI" | "NetBanking" | "CreditCard" | "DebitCard";
    status: "captured" | "authorized" | "pending" | "refunded";
    paidAt: string;
  };

  // Status & Documents
  bookingStatus: "confirmed" | "boarding_ready" | "cruise_ongoing" | "completed" | "cancelled";
  ticketNumber: string; // e.g. "HB-TKT-ALP-99120"
  taxInvoiceNumber: string; // e.g. "INV-HB-2026-5512"
  issuedAt: string;
  dockLocation: string;
}

// ----------------------------------------------------------------------------
// 2. WILDLIFE SAFARI: SAFARI PACKAGES & SAFARI BOOKINGS
// ----------------------------------------------------------------------------

export type SafariVehicleType =
  | "4x4 Maruti Gypsy (Open Top 6-Seater)"
  | "Mahindra Thar Jungle Special (Open Top 4-Seater)"
  | "Forest Dept Eco-Canter (20-Seater Open Bus)"
  | "Solar Electric River Patrol Boat (12-Seater)"
  | "Forest Elephant Back Patrol (Subject to Forest Dept Approval)";

export type SafariShiftType = "Morning Shift (06:00 AM - 09:30 AM)" | "Afternoon Shift (02:30 PM - 06:00 PM)" | "Full Day VIP Tracking";

export interface SafariPackage {
  packageId: string; // Primary Key e.g. "SF-PKG-CBT-DHK-01"
  packageName: string; // Package e.g. "Dhikala Classic Tiger Expedition"
  nationalPark: "Jim Corbett National Park" | "Ranthambore Tiger Reserve" | "Kaziranga National Park" | "Bandhavgarh National Park" | "Tadoba Andhari Tiger Reserve" | "Gir National Park" | "Kanha National Park" | "Nagarhole / Kabini";
  zone: string; // Zone e.g. "Dhikala Zone (Core)", "Bijrani Zone", "Tala Zone", "Central / Kohora Zone", "Zone 3 (Padam Talao)"
  safariType: "Jeep Safari" | "Canter Safari" | "River Boat Safari" | "Walking Trail with Naturalist";
  vehicle: SafariVehicleType;
  dateSeason: {
    seasonName: "Winter Peak Season" | "Summer Waterhole Season" | "Monsoon Restricted Season";
    monthsActive: string; // e.g. "October to June"
    slotsAvailablePerDay: number;
    recommendedSlot: SafariShiftType;
  };
  pricing: {
    baseVehicleHirePrice: number; // e.g. ₹4,500
    forestDeptPermitFeeIndian: number; // e.g. ₹1,200
    forestDeptPermitFeeForeigner: number; // e.g. ₹3,500
    naturalistGuideFee: number; // e.g. ₹1,000
    gstPercent: number; // 5%
    totalEstimatedPrice: number; // e.g. ₹7,035
  };
  availability: {
    totalPermitsAllocated: number; // e.g. 30 permits/day
    remainingPermitsToday: number; // e.g. 7
    quotaStatus: "Available" | "Filling Fast" | "Waiting List" | "Sold Out";
  };
  highlights: string[];
  keyFauna: string[]; // e.g. ["Royal Bengal Tiger", "Asian Elephant", "Gharial", "Hog Deer"]
  entryGate: string; // e.g. "Dhangarhi Gate, Ramnagar"
  image: string;
}

export interface SafariPassengerItem {
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  nationality: "Indian" | "Foreign National";
  govIdProofType: "Aadhaar Card" | "Passport" | "Voter ID" | "Driving License";
  govIdNumber: string;
}

export interface SafariBooking {
  bookingId: string; // Primary Key e.g. "SF-BK-2026-9041"
  customer: {
    customerId: string;
    name: string;
    email: string;
    phone: string;
    city: string;
  };
  safariPackageId: string; // Foreign Key -> safari_packages(packageId)
  safariPackageName: string;
  nationalPark: string;
  zone: string;
  safariDate: string; // ISO Date e.g. "2026-09-25"
  shift: SafariShiftType;
  passengerCount: {
    adults: number;
    children: number;
    total: number;
  };
  passengers: SafariPassengerItem[];
  vehicle: {
    vehicleType: SafariVehicleType;
    assignedVehicleNumber: string; // e.g. "UK-04-TA-8819"
    driverName: string;
    driverPhone: string;
    authorizedNaturalistName: string; // Forest Dept Badge holder
    naturalistBadgeId: string;
  };
  payment: {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amountPaid: number;
    currency: "INR";
    status: "captured" | "authorized" | "refunded";
    paidAt: string;
  };
  bookingStatus: "confirmed" | "permit_issued" | "manifest_verified" | "completed" | "cancelled";
  ticketNumber: string; // e.g. "FD-PERMIT-CTR-2026-88190"
  qrCodeData: string; // Payload string for gate scanner e.g. "GOV-IN-CTR:PERMIT=88190:DATE=2026-09-25:ZONE=DHIKALA"
  gateReportingTime: string; // e.g. "05:30 AM (Gate closes promptly at 06:00 AM)"
  issuedAt: string;
}

// ----------------------------------------------------------------------------
// 3. CAB: CAB (1) -> CAB BOOKINGS (MANY)
// ----------------------------------------------------------------------------

export interface Cab {
  cabId: string; // Primary Key e.g. "CAB-INNOVA-001"
  vehicleModel: string; // e.g. "Toyota Innova Crysta"
  cabCategory: "Prime Sedan" | "Prime SUV" | "Luxury Executive" | "Electric Clean-Tech" | "Tempo Traveller";
  registrationNumber: string; // e.g. "DL-01-TA-4491"
  partnerId: string; // e.g. "PTR-FLEET-DELHI-01"
  partnerName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  driverPhoto: string;
  fuelType: "CNG" | "Diesel" | "Electric" | "Petrol";
  seatingCapacity: number; // 4, 6, 7, 12
  luggageBagsCapacity: number;
  acType: "Dual Climate Control AC" | "Standard AC";
  baseFarePerKm: number; // e.g. 16
  minimumFare: number; // e.g. 1500
  driverAllowancePerNight: number; // e.g. 400
  status: "available" | "on_trip" | "scheduled" | "maintenance";
  currentLocationCity: string;
  totalTripsCompleted: number;
  allCabBookingsCount?: number; // Count of child bookings (1:many relation)
}

export interface CabBooking {
  cabBookingId: string; // Primary Key e.g. "CB-BK-2026-101"
  cabId: string; // Foreign Key -> cab(cabId) (Many-to-1)
  
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  tripType: "Outstation One-Way" | "Outstation Round-Trip" | "Local Hourly Rental" | "Airport Transfer";
  pickupLocation: string;
  dropLocation: string;
  pickupDatetime: string; // e.g. "2026-09-22 06:00 AM"
  returnDatetime?: string;
  
  totalEstimatedKm: number;
  baseFare: number;
  tollAndTaxes: number;
  driverAllowance: number;
  gstAmount: number;
  totalAmount: number;
  
  paymentId: string;
  paymentStatus: "paid" | "partially_paid" | "pay_on_trip";
  bookingStatus: "confirmed" | "driver_assigned" | "trip_started" | "completed" | "cancelled";
  otpStart: string; // 4-digit PIN e.g. "4912"
  taxInvoiceNumber: string;
  createdAt: string;
}
