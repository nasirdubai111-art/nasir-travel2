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

// ----------------------------------------------------------------------------
// 4. TOUR & TOUR BOOKINGS
// tour (id, tour_code, title, destination, itinerary, pricing, availability, operator)
//   └── tour_bookings (booking_reference, tour_id ──► tour.id, customer_id ──► auth.users.id, travel_date, passengers, payment_status, booking_status, total_amount)
// ----------------------------------------------------------------------------

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  mealsIncluded: string[];
  sightseeingPoints: string[];
  stayLocation: string;
}

export interface TourOperatorEntity {
  id: string; // e.g. "OPR-ROYAL-RAJ"
  name: string;
  registrationNumber: string; // Ministry of Tourism License
  rating: number;
  reviewsCount: number;
  phone: string;
  email: string;
  city: string;
  verified: boolean;
}

export interface TourEntity {
  id: string; // Primary Key e.g. "TOUR-GOLDEN-TRIANGLE-01"
  tour_code: string; // e.g. "GT-DEL-AGR-JAI-07D"
  title: string;
  destination: string;
  circuit_category: "Heritage & Forts" | "Himalayan Adventure" | "Spiritual Circuit" | "Coastal & Beach" | "Wildlife Sanctuary";
  duration_days: number;
  duration_nights: number;
  itinerary: TourItineraryDay[];
  pricing: {
    base_price_adult: number;
    base_price_child: number;
    single_supplement: number;
    gst_percent: number;
    currency: "INR";
  };
  availability: {
    departure_dates: string[]; // YYYY-MM-DD
    seats_per_batch: number;
    available_seats: number;
    status: "available" | "filling_fast" | "sold_out";
  };
  operator: TourOperatorEntity;
  featured_image: string;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
}

export interface TourPassengerEntity {
  full_name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  id_type: "Aadhaar" | "Passport" | "Voter ID" | "Driving License";
  id_number: string;
  passenger_type: "Adult" | "Child";
}

export interface TourBookingEntity {
  booking_reference: string; // Primary Key e.g. "TBK-2026-98124"
  tour_id: string; // Foreign Key -> tour.id
  customer_id: string; // Foreign Key -> auth.users.id
  travel_date: string; // Departure Date (YYYY-MM-DD)
  passengers: TourPassengerEntity[];
  total_passengers: number;
  total_amount: number;
  payment_status: "paid" | "partially_paid" | "pending" | "refunded";
  booking_status: "confirmed" | "completed" | "cancelled" | "waitlist";
  tour_title?: string;
  destination?: string;
  tour_code?: string;
  payment_method?: string;
  payment_id?: string;
  invoice_number?: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 5. RESORT & RESORT BOOKINGS
// resort (Resort ID, Resort Name, Location, Rooms, Amenities, Images, Pricing, Status)
//   └── resort_bookings (Booking Reference, Resort, Customer, Guest Details, Check-in / Check-out, Room, Amount, Payment Status, Booking Status)
// ----------------------------------------------------------------------------

export interface ResortRoomType {
  room_id: string; // e.g. "RM-VILLA-PLUNGE"
  room_name: string;
  type: "Private Plunge Pool Villa" | "Luxury Treehouse Chalet" | "Heritage Palace Suite" | "Beachfront Lagoon Cottage";
  max_adults: number;
  max_children: number;
  base_price_per_night: number;
  bed_type: string;
  size_sq_ft: number;
  total_inventory: number;
  available_units: number;
  amenities: string[];
}

export interface ResortEntity {
  resort_id: string; // Primary Key e.g. "RST-KERALA-KUMARAKOM-01"
  resort_name: string;
  location: {
    destination: string; // e.g. "Kumarakom"
    state: string; // e.g. "Kerala"
    address: string;
    latitude?: number;
    longitude?: number;
    nearest_airport: string;
  };
  rooms: ResortRoomType[];
  amenities: string[];
  images: {
    primary: string;
    gallery: string[];
  };
  pricing: {
    starting_price_per_night: number;
    currency: "INR";
    tax_percent: number;
    complimentary_breakfast: boolean;
  };
  status: "Active" | "Seasonal Renovation" | "Booked Out";
  star_rating: 4 | 5;
  user_rating: number;
  reviews_count: number;
}

export interface ResortGuestDetail {
  full_name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  id_type: string;
  id_number: string;
  is_primary: boolean;
}

export interface ResortBookingEntity {
  booking_reference: string; // Primary Key e.g. "RBK-2026-4412"
  resort_id: string; // Foreign Key -> resort.resort_id
  resort_name: string;
  customer_id: string; // Foreign Key -> auth.users.id
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  guest_details: ResortGuestDetail[];
  check_in_date: string;
  check_out_date: string;
  nights_count: number;
  room: {
    room_id: string;
    room_name: string;
    units_booked: number;
  };
  amount: {
    base_fare: number;
    taxes_and_service: number;
    discount: number;
    total_amount: number;
  };
  payment_status: "paid" | "partially_paid" | "pay_at_resort" | "refunded";
  booking_status: "confirmed" | "checked_in" | "checked_out" | "cancelled";
  invoice_number: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 6. LODGE & LODGE BOOKINGS (8-Step Customer Funnel)
// auth.users ──► lodge_bookings (lodge_id) ──► lodge
// Funnel: Search ➔ Details ➔ Select Room ➔ Check-in/Out ➔ Guest Details ➔ Payment ➔ lodge_bookings ➔ Confirmation ➔ Ticket/Invoice
// ----------------------------------------------------------------------------

export interface LodgeRoomOption {
  room_id: string;
  room_name: string;
  room_type: "Eco Log Cabin" | "Safari Tented Suite" | "Himalayan Stone Cottage" | "Riverfront Mud Villa";
  capacity: number;
  price_per_night: number;
  inventory: number;
  available_inventory: number;
  features: string[];
}

export interface LodgeEntity {
  lodge_id: string; // Primary Key e.g. "LDG-BANDHAVGARH-01"
  name: string;
  destination: string;
  state: string;
  region: string;
  lodge_type: "Wildlife Safari" | "Himalayan Forest" | "Heritage Mud Stay" | "Plantation Retreat";
  rooms: LodgeRoomOption[];
  rating: number;
  starting_price: number;
  bonfire_available: boolean;
  safari_assistance: boolean;
  pet_friendly: boolean;
  images: {
    thumbnail: string;
    gallery: string[];
  };
  overview: string;
  contact_number: string;
  manager_name: string;
  status: "Active" | "Maintenance";
}

export interface LodgeBookingEntity {
  booking_reference: string; // Primary Key e.g. "LDG-BK-2026-7781"
  lodge_id: string; // Foreign Key -> lodge.lodge_id
  customer_id: string; // Foreign Key -> auth.users.id
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  selected_room_id: string;
  selected_room_name: string;
  rooms_count: number;
  guests_count: {
    adults: number;
    children: number;
  };
  guest_details: Array<{
    full_name: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    gov_id: string;
  }>;
  base_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_status: "paid" | "pay_at_lodge" | "pending";
  booking_status: "confirmed" | "checked_in" | "completed" | "cancelled";
  ticket_invoice_number: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 7. HOTELS 3-TIER RELATIONAL HIERARCHY
// HOTELS (hotels.id)
//   └── HOTELS_ROOMS (hotels_rooms.hotel_id)
//         └── HOTELS_BOOKINGS (hotel_id, room_id)
// ----------------------------------------------------------------------------

export interface HotelPropertyEntity {
  id: string; // Primary Key: hotels.id e.g. "HTL-DELHI-AEROCITY-01"
  property_name: string;
  chain_brand?: string;
  category: "Luxury 5-Star" | "Business Executive 4-Star" | "Boutique Heritage" | "Smart Comfort 3-Star";
  city: string;
  state: string;
  address: string;
  pincode: string;
  star_rating: number;
  rating_score: number;
  total_rooms_count: number;
  amenities: string[];
  images: string[];
  policies: {
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: string;
  };
  contact: {
    general_manager: string;
    front_desk_phone: string;
    reservations_email: string;
  };
  status: "Active" | "Maintenance";
}

export interface HotelRoomEntity {
  id: string; // Primary Key: hotels_rooms.id e.g. "HRM-DEL-01-DLX"
  hotel_id: string; // Foreign Key -> hotels.id
  room_code: string; // e.g. "DLX-KING"
  room_name: string; // e.g. "Deluxe Club King Room"
  room_category: "Standard" | "Deluxe" | "Executive Club" | "Presidential Suite";
  bedding_setup: "1 King Bed" | "2 Twin Beds" | "1 Queen Bed";
  max_occupancy_adults: number;
  max_occupancy_children: number;
  room_size_sqm: number;
  
  // Inventory & Pricing
  total_inventory: number; // e.g. 24 rooms
  available_inventory: number; // e.g. 6 available today
  base_price_per_night: number; // e.g. ₹5,500
  weekend_surge_percent: number; // e.g. 15%
  breakfast_addon_price: number; // e.g. ₹600
  tax_rate_percent: number; // 12% or 18% GST

  amenities: string[];
  room_photos: string[];
  status: "available" | "limited" | "sold_out";
}

export interface HotelBookingEntity {
  id: string; // Primary Key: hotels_bookings.id e.g. "HBK-2026-5591"
  booking_reference: string; // e.g. "HTL-DEL-BK-99120"
  hotel_id: string; // Foreign Key -> hotels.id
  room_id: string; // Foreign Key -> hotels_rooms.id
  customer_id: string; // Foreign Key -> auth.users.id
  
  // Denormalized property & room snapshots for instant invoice rendering
  hotel_name: string;
  room_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  
  check_in_date: string;
  check_out_date: string;
  nights_count: number;
  rooms_booked_count: number;
  adults_count: number;
  children_count: number;
  
  guest_manifest: Array<{
    full_name: string;
    age: number;
    id_type: string;
    id_number: string;
  }>;

  pricing_breakdown: {
    room_charges: number;
    meal_charges: number;
    gst_amount: number;
    total_amount: number;
  };

  payment: {
    payment_id: string;
    payment_gateway: "Cashfree" | "UPI" | "PayAtHotel";
    payment_status: "paid" | "pay_at_hotel" | "failed" | "refunded";
    paid_at?: string;
  };

  booking_status: "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show";
  qr_pass_code: string;
  tax_invoice_number: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// 8. CUSTOMER 360 & IDENTITY ARCHITECTURE
// auth.users
//     │
//     ▼
// customers
//     ├── customer_profiles
//     ├── customer_documents
//     ├── customer_addresses
//     ├── bookings
//     ├── payments
//     ├── tickets
//     └── customer_notes / CRM
// ----------------------------------------------------------------------------

export interface CustomerProfileEntity {
  customer_id: string; // PK e.g. "CUST-1001"
  auth_user_id: string; // FK -> auth.users.id e.g. "USR-AUTH-9901"
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  loyalty_tier: "Bronze" | "Silver" | "Gold" | "Platinum VIP";
  total_trips_booked: number;
  total_lifetime_spend: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerDocumentEntity {
  doc_id: string; // PK e.g. "DOC-501"
  customer_id: string; // FK -> customers.customer_id
  doc_type: "Aadhaar Card" | "Passport" | "Voter ID" | "Driving License" | "PAN Card";
  doc_number_masked: string; // e.g. "XXXX-XXXX-8921"
  issuing_authority: string;
  expiry_date?: string;
  verification_status: "Verified" | "Pending" | "Rejected";
  uploaded_at: string;
}

export interface CustomerAddressEntity {
  address_id: string; // PK e.g. "ADDR-201"
  customer_id: string; // FK -> customers.customer_id
  address_type: "Home" | "Billing" | "Office";
  street_address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_primary: boolean;
}

export interface Customer360CompositeRecord {
  auth_user_id: string;
  customer_id: string;
  profile: CustomerProfileEntity;
  documents: CustomerDocumentEntity[];
  addresses: CustomerAddressEntity[];
  bookings_count: number;
  recent_bookings: Array<{
    booking_reference: string;
    vertical: "Hotels" | "Tours" | "Resorts" | "Lodges" | "Houseboats" | "Safari" | "Cabs" | "Pilgrimage";
    title: string;
    travel_date: string;
    amount: number;
    booking_status: string;
    payment_status: string;
  }>;
  total_payments_value: number;
  active_tickets_count: number;
  crm_notes_count: number;
  tags: string[];
}

