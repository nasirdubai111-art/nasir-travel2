import {
  Houseboat,
  HouseboatBooking,
  SafariPackage,
  SafariBooking,
  Cab,
  CabBooking,
  TourEntity,
  TourBookingEntity,
  ResortEntity,
  ResortBookingEntity,
  LodgeEntity,
  LodgeBookingEntity,
  HotelPropertyEntity,
  HotelRoomEntity,
  HotelBookingEntity,
  Customer360CompositeRecord,
} from "../types/travelVerticalsHierarchy";
import {
  SEED_HOUSEBOATS,
  SEED_HOUSEBOAT_BOOKINGS,
  SEED_SAFARI_PACKAGES,
  SEED_SAFARI_BOOKINGS,
  SEED_CABS,
  SEED_CAB_BOOKINGS,
} from "../data/travelVerticalsData";
import {
  SEED_TOURS,
  SEED_TOUR_BOOKINGS,
  SEED_RESORTS,
  SEED_RESORT_BOOKINGS,
  SEED_LODGES,
  SEED_LODGE_BOOKINGS,
  SEED_HOTEL_PROPERTIES,
  SEED_HOTEL_ROOMS,
  SEED_HOTEL_BOOKINGS,
  SEED_CUSTOMER_360,
} from "../data/travelVerticalsExtendedData";

const LS_HOUSEBOATS_KEY = "bharatyatra_houseboats_v1";
const LS_HB_BOOKINGS_KEY = "bharatyatra_houseboat_bookings_v1";
const LS_SAFARI_PKGS_KEY = "bharatyatra_safari_packages_v1";
const LS_SAFARI_BOOKINGS_KEY = "bharatyatra_safari_bookings_v1";
const LS_CABS_KEY = "bharatyatra_cabs_v1";
const LS_CAB_BOOKINGS_KEY = "bharatyatra_cab_bookings_v1";

const LS_TOURS_KEY = "bharatyatra_tours_v1";
const LS_TOUR_BOOKINGS_KEY = "bharatyatra_tour_bookings_v1";
const LS_RESORTS_KEY = "bharatyatra_resorts_v1";
const LS_RESORT_BOOKINGS_KEY = "bharatyatra_resort_bookings_v1";
const LS_LODGES_KEY = "bharatyatra_lodges_v1";
const LS_LODGE_BOOKINGS_KEY = "bharatyatra_lodge_bookings_v1";
const LS_HOTEL_PROPS_KEY = "bharatyatra_hotel_properties_v1";
const LS_HOTEL_ROOMS_KEY = "bharatyatra_hotel_rooms_v1";
const LS_HOTEL_BOOKINGS_KEY = "bharatyatra_hotel_bookings_v1";
const LS_CUSTOMER_360_KEY = "bharatyatra_customer_360_v1";

class TravelVerticalsService {
  // --------------------------------------------------------------------------
  // 1. HOUSEBOATS & HOUSEBOAT BOOKINGS
  // --------------------------------------------------------------------------
  public getHouseboats(): Houseboat[] {
    try {
      const stored = localStorage.getItem(LS_HOUSEBOATS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_HOUSEBOATS;
  }

  public getHouseboatById(houseboatId: string): Houseboat | undefined {
    return this.getHouseboats().find((h) => h.houseboatId === houseboatId);
  }

  public getHouseboatBookings(filter?: { houseboatId?: string; customerId?: string }): HouseboatBooking[] {
    let list: HouseboatBooking[] = SEED_HOUSEBOAT_BOOKINGS;
    try {
      const stored = localStorage.getItem(LS_HB_BOOKINGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }

    if (filter?.houseboatId) {
      list = list.filter((b) => b.houseboatId === filter.houseboatId);
    }
    if (filter?.customerId) {
      list = list.filter((b) => b.customerId === filter.customerId);
    }
    return list;
  }

  public createHouseboatBooking(payload: {
    houseboatId: string;
    customer: { name: string; email: string; phone: string; city: string };
    checkInDate: string;
    checkOutDate: string;
    checkInTime?: string;
    checkOutTime?: string;
    totalNights: number;
    guestsCount: { adults: number; children: number };
    guestManifest: Array<{ name: string; age: number; gender: "Male" | "Female" | "Other"; idProofType: any; idProofNumber: string }>;
    selectedCabinId?: string;
    selectedCabinName?: string;
    charterType: "Exclusive Private Charter" | "Single Cabin Booking";
    mealPlan: any;
    specialRequests?: string;
    baseFare: number;
    discountAmount?: number;
    taxAmountGst: number;
    totalAmount: number;
    paymentMethod: "UPI" | "NetBanking" | "CreditCard" | "DebitCard";
  }): HouseboatBooking {
    const houseboat = this.getHouseboatById(payload.houseboatId) || SEED_HOUSEBOATS[0];
    const serial = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HB-BK-2026-${serial}`;
    const paymentId = `TX-HB-PAY-${serial}`;
    const customerId = `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`;
    const ticketNumber = `HB-TKT-${houseboat.destination.substring(0, 3).toUpperCase()}-${serial}`;
    const taxInvoiceNumber = `INV-HB-2026-${serial}`;
    const nowIso = new Date().toISOString();

    const newBooking: HouseboatBooking = {
      bookingId,
      houseboatId: houseboat.houseboatId,
      customerId,
      partnerId: houseboat.partnerId,
      paymentId,
      customer: payload.customer,
      checkInDate: payload.checkInDate,
      checkOutDate: payload.checkOutDate,
      checkInTime: payload.checkInTime || "12:00 PM",
      checkOutTime: payload.checkOutTime || "09:30 AM",
      totalNights: payload.totalNights,
      guestsCount: payload.guestsCount,
      guestManifest: payload.guestManifest,
      selectedCabinId: payload.selectedCabinId,
      selectedCabinName: payload.selectedCabinName,
      charterType: payload.charterType,
      mealPlan: payload.mealPlan,
      specialRequests: payload.specialRequests,
      baseFare: payload.baseFare,
      mealsIncludedFare: 0,
      specialAddonsFare: 0,
      discountAmount: payload.discountAmount || 0,
      taxAmountGst: payload.taxAmountGst,
      totalAmount: payload.totalAmount,
      netPayableAmount: payload.totalAmount,
      payment: {
        paymentId,
        razorpayOrderId: `order_HB_${serial}`,
        razorpayPaymentId: `pay_HB_${serial}_cap`,
        paymentMethod: payload.paymentMethod,
        status: "captured",
        paidAt: nowIso,
      },
      bookingStatus: "confirmed",
      ticketNumber,
      taxInvoiceNumber,
      issuedAt: nowIso,
      dockLocation: `${houseboat.waterbody} Main Tourist Jetty, ${houseboat.destination}, ${houseboat.state}`,
    };

    const currentList = this.getHouseboatBookings();
    const updatedList = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_HB_BOOKINGS_KEY, JSON.stringify(updatedList));
    } catch {
      // Ignored
    }

    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 2. WILDLIFE SAFARI: PACKAGES & BOOKINGS
  // --------------------------------------------------------------------------
  public getSafariPackages(filter?: { nationalPark?: string; safariType?: string }): SafariPackage[] {
    let list: SafariPackage[] = SEED_SAFARI_PACKAGES;
    try {
      const stored = localStorage.getItem(LS_SAFARI_PKGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }

    if (filter?.nationalPark && filter.nationalPark !== "All") {
      list = list.filter((p) => p.nationalPark.toLowerCase().includes(filter.nationalPark!.toLowerCase()));
    }
    if (filter?.safariType && filter.safariType !== "All") {
      list = list.filter((p) => p.safariType === filter.safariType);
    }
    return list;
  }

  public getSafariPackageById(packageId: string): SafariPackage | undefined {
    return this.getSafariPackages().find((p) => p.packageId === packageId);
  }

  public getSafariBookings(): SafariBooking[] {
    try {
      const stored = localStorage.getItem(LS_SAFARI_BOOKINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_SAFARI_BOOKINGS;
  }

  public createSafariBooking(payload: {
    packageId: string;
    customer: { name: string; email: string; phone: string; city: string };
    safariDate: string;
    shift: any;
    passengerCount: { adults: number; children: number; total: number };
    passengers: Array<{ fullName: string; age: number; gender: "Male" | "Female" | "Other"; nationality: "Indian" | "Foreign National"; govIdProofType: any; govIdNumber: string }>;
  }): SafariBooking {
    const pkg = this.getSafariPackageById(payload.packageId) || SEED_SAFARI_PACKAGES[0];
    const serial = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SF-BK-2026-${serial}`;
    const paymentId = `TX-SF-PAY-${serial}`;
    const ticketNumber = `FD-PERMIT-${pkg.nationalPark.substring(0, 3).toUpperCase()}-2026-${serial}`;
    const nowIso = new Date().toISOString();

    const vehicleRegPrefix = pkg.nationalPark.includes("Corbett")
      ? "UK-04-TA-"
      : pkg.nationalPark.includes("Ranthambore")
      ? "RJ-25-TA-"
      : pkg.nationalPark.includes("Kaziranga")
      ? "AS-05-SA-"
      : "MP-54-TA-";

    const assignedVehicleNumber = `${vehicleRegPrefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const qrCodeData = `GOV-IN-FOREST:PERMIT=${ticketNumber}:DATE=${payload.safariDate}:PARK=${pkg.nationalPark}:ZONE=${pkg.zone}:VEHICLE=${assignedVehicleNumber}:PAX=${payload.passengerCount.total}:SIGN=VERIFIED_SHA256`;

    const newBooking: SafariBooking = {
      bookingId,
      customer: {
        customerId: `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone,
        city: payload.customer.city,
      },
      safariPackageId: pkg.packageId,
      safariPackageName: pkg.packageName,
      nationalPark: pkg.nationalPark,
      zone: pkg.zone,
      safariDate: payload.safariDate,
      shift: payload.shift,
      passengerCount: payload.passengerCount,
      passengers: payload.passengers,
      vehicle: {
        vehicleType: pkg.vehicle,
        assignedVehicleNumber,
        driverName: "Ramswaroop Rawat (Forest Registered Chauffeur)",
        driverPhone: "+91 94120 77192",
        authorizedNaturalistName: "Dr. Arvind Pathak (Certified Wildlife Biologist)",
        naturalistBadgeId: `NAT-${pkg.nationalPark.substring(0, 3).toUpperCase()}-2026-${Math.floor(10 + Math.random() * 90)}`,
      },
      payment: {
        paymentId,
        razorpayOrderId: `order_SF_${serial}`,
        razorpayPaymentId: `pay_SF_${serial}_cap`,
        amountPaid: pkg.pricing.totalEstimatedPrice,
        currency: "INR",
        status: "captured",
        paidAt: nowIso,
      },
      bookingStatus: "permit_issued",
      ticketNumber,
      qrCodeData,
      gateReportingTime: payload.shift.includes("Morning") ? "05:30 AM (Gate entry strict cutoff: 06:00 AM)" : "02:00 PM (Gate entry strict cutoff: 02:30 PM)",
      issuedAt: nowIso,
    };

    const currentList = this.getSafariBookings();
    const updatedList = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_SAFARI_BOOKINGS_KEY, JSON.stringify(updatedList));
    } catch {
      // Ignored
    }

    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 3. CAB (1) -> CAB BOOKINGS (MANY)
  // --------------------------------------------------------------------------
  public getCabs(): Cab[] {
    let cabs = SEED_CABS;
    try {
      const stored = localStorage.getItem(LS_CABS_KEY);
      if (stored) cabs = JSON.parse(stored);
    } catch {
      // Fallback
    }

    // Attach real counts of 1:many bookings
    const allBookings = this.getAllCabBookings();
    return cabs.map((cab) => ({
      ...cab,
      allCabBookingsCount: allBookings.filter((b) => b.cabId === cab.cabId).length,
    }));
  }

  public getCabById(cabId: string): Cab | undefined {
    return this.getCabs().find((c) => c.cabId === cabId);
  }

  public getAllCabBookings(): CabBooking[] {
    try {
      const stored = localStorage.getItem(LS_CAB_BOOKINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_CAB_BOOKINGS;
  }

  public getCabBookingsForCab(cabId: string): CabBooking[] {
    return this.getAllCabBookings().filter((b) => b.cabId === cabId);
  }

  public createCabBooking(cabId: string, payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    tripType: "Outstation One-Way" | "Outstation Round-Trip" | "Local Hourly Rental" | "Airport Transfer";
    pickupLocation: string;
    dropLocation: string;
    pickupDatetime: string;
    returnDatetime?: string;
    totalEstimatedKm: number;
    baseFare: number;
    tollAndTaxes: number;
    driverAllowance: number;
    gstAmount: number;
    totalAmount: number;
  }): CabBooking {
    const cab = this.getCabById(cabId) || SEED_CABS[0];
    const serial = Math.floor(100 + Math.random() * 900);
    const cabBookingId = `CB-BK-2026-${serial}`;
    const otpStart = `${Math.floor(1000 + Math.random() * 9000)}`;
    const taxInvoiceNumber = `INV-CB-2026-${serial}`;
    const nowIso = new Date().toISOString();

    const newBooking: CabBooking = {
      cabBookingId,
      cabId: cab.cabId,
      customerId: `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      tripType: payload.tripType,
      pickupLocation: payload.pickupLocation,
      dropLocation: payload.dropLocation,
      pickupDatetime: payload.pickupDatetime,
      returnDatetime: payload.returnDatetime,
      totalEstimatedKm: payload.totalEstimatedKm,
      baseFare: payload.baseFare,
      tollAndTaxes: payload.tollAndTaxes,
      driverAllowance: payload.driverAllowance,
      gstAmount: payload.gstAmount,
      totalAmount: payload.totalAmount,
      paymentId: `TX-CB-${serial}`,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      otpStart,
      taxInvoiceNumber,
      createdAt: nowIso,
    };

    const currentList = this.getAllCabBookings();
    const updatedList = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_CAB_BOOKINGS_KEY, JSON.stringify(updatedList));
    } catch {
      // Ignored
    }

    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 4. TOURS & TOUR BOOKINGS
  // tour (id, tour_code, title, destination, itinerary, pricing, availability, operator)
  //   └── tour_bookings (booking_reference, tour_id ──► tour.id, customer_id ──► auth.users.id)
  // --------------------------------------------------------------------------
  public getTours(): TourEntity[] {
    try {
      const stored = localStorage.getItem(LS_TOURS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_TOURS;
  }

  public getTourById(id: string): TourEntity | undefined {
    return this.getTours().find((t) => t.id === id || t.tour_code === id);
  }

  public getTourBookings(filter?: { tour_id?: string; customer_id?: string }): TourBookingEntity[] {
    let list: TourBookingEntity[] = SEED_TOUR_BOOKINGS;
    try {
      const stored = localStorage.getItem(LS_TOUR_BOOKINGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }
    if (filter?.tour_id) {
      list = list.filter((b) => b.tour_id === filter.tour_id);
    }
    if (filter?.customer_id) {
      list = list.filter((b) => b.customer_id === filter.customer_id);
    }
    return list;
  }

  public createTourBooking(payload: {
    tour_id: string;
    customer_id: string;
    travel_date: string;
    passengers: TourBookingEntity["passengers"];
    total_amount: number;
    payment_method?: string;
  }): TourBookingEntity {
    const tour = this.getTourById(payload.tour_id);
    const serial = Math.floor(10000 + Math.random() * 90000);
    const newBooking: TourBookingEntity = {
      booking_reference: `TBK-2026-${serial}`,
      tour_id: payload.tour_id,
      tour_code: tour?.tour_code || "GT-TOUR-EXP",
      tour_title: tour?.title || "Bharat Holiday Circuit",
      destination: tour?.destination || "India",
      customer_id: payload.customer_id,
      travel_date: payload.travel_date,
      passengers: payload.passengers,
      total_passengers: payload.passengers.length,
      total_amount: payload.total_amount,
      payment_status: "paid",
      payment_method: payload.payment_method || "Direct UPI",
      payment_id: `TXN-UPI-${serial}`,
      booking_status: "confirmed",
      invoice_number: `INV-TOUR-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    const currentList = this.getTourBookings();
    const updated = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_TOUR_BOOKINGS_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 5. RESORTS & RESORT BOOKINGS
  // resort (Resort ID, Resort Name, Location, Rooms, Amenities, Images, Pricing, Status)
  //   └── resort_bookings (Booking Reference, Resort, Customer, Guest Details, Check-in / Out)
  // --------------------------------------------------------------------------
  public getResorts(): ResortEntity[] {
    try {
      const stored = localStorage.getItem(LS_RESORTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_RESORTS;
  }

  public getResortById(id: string): ResortEntity | undefined {
    return this.getResorts().find((r) => r.resort_id === id);
  }

  public getResortBookings(filter?: { resort_id?: string; customer_id?: string }): ResortBookingEntity[] {
    let list: ResortBookingEntity[] = SEED_RESORT_BOOKINGS;
    try {
      const stored = localStorage.getItem(LS_RESORT_BOOKINGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }
    if (filter?.resort_id) {
      list = list.filter((b) => b.resort_id === filter.resort_id);
    }
    if (filter?.customer_id) {
      list = list.filter((b) => b.customer_id === filter.customer_id);
    }
    return list;
  }

  public createResortBooking(payload: {
    resort_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    guest_details: ResortBookingEntity["guest_details"];
    check_in_date: string;
    check_out_date: string;
    nights_count: number;
    room_id: string;
    room_name: string;
    units_booked: number;
    base_fare: number;
    taxes: number;
    total_amount: number;
    payment_status?: ResortBookingEntity["payment_status"];
  }): ResortBookingEntity {
    const resort = this.getResortById(payload.resort_id);
    const serial = Math.floor(1000 + Math.random() * 9000);
    const newBooking: ResortBookingEntity = {
      booking_reference: `RBK-2026-${serial}`,
      resort_id: payload.resort_id,
      resort_name: resort?.resort_name || "Luxury Backwater / Heritage Resort",
      customer_id: payload.customer_id,
      customer_name: payload.customer_name,
      customer_email: payload.customer_email,
      customer_phone: payload.customer_phone,
      guest_details: payload.guest_details,
      check_in_date: payload.check_in_date,
      check_out_date: payload.check_out_date,
      nights_count: payload.nights_count,
      room: {
        room_id: payload.room_id,
        room_name: payload.room_name,
        units_booked: payload.units_booked,
      },
      amount: {
        base_fare: payload.base_fare,
        taxes_and_service: payload.taxes,
        discount: 0,
        total_amount: payload.total_amount,
      },
      payment_status: payload.payment_status || "paid",
      booking_status: "confirmed",
      invoice_number: `INV-RST-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    const currentList = this.getResortBookings();
    const updated = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_RESORT_BOOKINGS_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 6. LODGES & LODGE BOOKINGS (8-Step Customer Funnel)
  // auth.users ──► lodge_bookings (lodge_id) ──► lodge
  // Funnel: Search ➔ Details ➔ Select Room ➔ Check-in/Out ➔ Guest Details ➔ Payment ➔ Confirmation ➔ Ticket
  // --------------------------------------------------------------------------
  public getLodges(): LodgeEntity[] {
    try {
      const stored = localStorage.getItem(LS_LODGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_LODGES;
  }

  public getLodgeById(id: string): LodgeEntity | undefined {
    return this.getLodges().find((l) => l.lodge_id === id);
  }

  public getLodgeBookings(filter?: { lodge_id?: string; customer_id?: string }): LodgeBookingEntity[] {
    let list: LodgeBookingEntity[] = SEED_LODGE_BOOKINGS;
    try {
      const stored = localStorage.getItem(LS_LODGE_BOOKINGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }
    if (filter?.lodge_id) {
      list = list.filter((b) => b.lodge_id === filter.lodge_id);
    }
    if (filter?.customer_id) {
      list = list.filter((b) => b.customer_id === filter.customer_id);
    }
    return list;
  }

  public createLodgeBooking(payload: {
    lodge_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    selected_room_id: string;
    selected_room_name: string;
    rooms_count: number;
    guests_count: { adults: number; children: number };
    guest_details: LodgeBookingEntity["guest_details"];
    base_amount: number;
    tax_amount: number;
    total_amount: number;
    payment_status?: LodgeBookingEntity["payment_status"];
  }): LodgeBookingEntity {
    const serial = Math.floor(1000 + Math.random() * 9000);
    const newBooking: LodgeBookingEntity = {
      booking_reference: `LDG-BK-2026-${serial}`,
      lodge_id: payload.lodge_id,
      customer_id: payload.customer_id,
      customer_name: payload.customer_name,
      customer_email: payload.customer_email,
      customer_phone: payload.customer_phone,
      check_in_date: payload.check_in_date,
      check_out_date: payload.check_out_date,
      nights: payload.nights,
      selected_room_id: payload.selected_room_id,
      selected_room_name: payload.selected_room_name,
      rooms_count: payload.rooms_count,
      guests_count: payload.guests_count,
      guest_details: payload.guest_details,
      base_amount: payload.base_amount,
      tax_amount: payload.tax_amount,
      total_amount: payload.total_amount,
      payment_status: payload.payment_status || "paid",
      booking_status: "confirmed",
      ticket_invoice_number: `INV-LDG-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    const currentList = this.getLodgeBookings();
    const updated = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_LODGE_BOOKINGS_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 7. HOTELS 3-TIER RELATIONAL HIERARCHY
  // HOTELS (hotels.id)
  //   └── HOTELS_ROOMS (hotels_rooms.hotel_id)
  //         └── HOTELS_BOOKINGS (hotel_id, room_id)
  // --------------------------------------------------------------------------
  public getHotelProperties(): HotelPropertyEntity[] {
    try {
      const stored = localStorage.getItem(LS_HOTEL_PROPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_HOTEL_PROPERTIES;
  }

  public getHotelPropertyById(id: string): HotelPropertyEntity | undefined {
    return this.getHotelProperties().find((h) => h.id === id);
  }

  public getHotelRooms(hotel_id?: string): HotelRoomEntity[] {
    let list: HotelRoomEntity[] = SEED_HOTEL_ROOMS;
    try {
      const stored = localStorage.getItem(LS_HOTEL_ROOMS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }
    if (hotel_id) {
      list = list.filter((r) => r.hotel_id === hotel_id);
    }
    return list;
  }

  public getHotelBookings(filter?: { hotel_id?: string; room_id?: string; customer_id?: string }): HotelBookingEntity[] {
    let list: HotelBookingEntity[] = SEED_HOTEL_BOOKINGS;
    try {
      const stored = localStorage.getItem(LS_HOTEL_BOOKINGS_KEY);
      if (stored) list = JSON.parse(stored);
    } catch {
      // Fallback
    }
    if (filter?.hotel_id) {
      list = list.filter((b) => b.hotel_id === filter.hotel_id);
    }
    if (filter?.room_id) {
      list = list.filter((b) => b.room_id === filter.room_id);
    }
    if (filter?.customer_id) {
      list = list.filter((b) => b.customer_id === filter.customer_id);
    }
    return list;
  }

  public createHotelBooking(payload: {
    hotel_id: string;
    room_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    check_in_date: string;
    check_out_date: string;
    nights_count: number;
    rooms_booked_count: number;
    adults_count: number;
    children_count: number;
    guest_manifest: HotelBookingEntity["guest_manifest"];
    room_charges: number;
    meal_charges: number;
    gst_amount: number;
    total_amount: number;
    payment_gateway?: HotelBookingEntity["payment"]["payment_gateway"];
  }): HotelBookingEntity {
    const hotel = this.getHotelPropertyById(payload.hotel_id);
    const room = this.getHotelRooms().find((r) => r.id === payload.room_id);
    const serial = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `HTL-BK-${serial}`;

    const newBooking: HotelBookingEntity = {
      id: `HBK-2026-${serial}`,
      booking_reference: bookingRef,
      hotel_id: payload.hotel_id,
      room_id: payload.room_id,
      customer_id: payload.customer_id,
      hotel_name: hotel?.property_name || "Grand Star Hotel",
      room_name: room?.room_name || "Deluxe Suite",
      customer_name: payload.customer_name,
      customer_email: payload.customer_email,
      customer_phone: payload.customer_phone,
      check_in_date: payload.check_in_date,
      check_out_date: payload.check_out_date,
      nights_count: payload.nights_count,
      rooms_booked_count: payload.rooms_booked_count,
      adults_count: payload.adults_count,
      children_count: payload.children_count,
      guest_manifest: payload.guest_manifest,
      pricing_breakdown: {
        room_charges: payload.room_charges,
        meal_charges: payload.meal_charges,
        gst_amount: payload.gst_amount,
        total_amount: payload.total_amount,
      },
      payment: {
        payment_id: `TXN-HTL-${serial}`,
        payment_gateway: payload.payment_gateway || "UPI",
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      },
      booking_status: "confirmed",
      qr_pass_code: `HTL-CHECKIN:${serial}:${hotel?.city}:ROOM=${room?.room_code}`,
      tax_invoice_number: `INV-HTL-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    const currentList = this.getHotelBookings();
    const updated = [newBooking, ...currentList];
    try {
      localStorage.setItem(LS_HOTEL_BOOKINGS_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    return newBooking;
  }

  // --------------------------------------------------------------------------
  // 8. CUSTOMER 360 & IDENTITY ARCHITECTURE
  // auth.users ──► customers
  //   ├── customer_profiles
  //   ├── customer_documents
  //   ├── customer_addresses
  //   ├── bookings
  //   ├── payments
  //   ├── tickets
  //   └── customer_notes / CRM
  // --------------------------------------------------------------------------
  public getCustomer360List(): Customer360CompositeRecord[] {
    try {
      const stored = localStorage.getItem(LS_CUSTOMER_360_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_CUSTOMER_360;
  }

  public getCustomer360ByAuthId(auth_user_id: string): Customer360CompositeRecord | undefined {
    return this.getCustomer360List().find((c) => c.auth_user_id === auth_user_id);
  }

  public getCustomer360ById(customer_id: string): Customer360CompositeRecord | undefined {
    return this.getCustomer360List().find((c) => c.customer_id === customer_id);
  }
}

export const travelVerticalsService = new TravelVerticalsService();
