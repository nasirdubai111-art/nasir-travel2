import {
  Houseboat,
  HouseboatBooking,
  SafariPackage,
  SafariBooking,
  Cab,
  CabBooking,
} from "../types/travelVerticalsHierarchy";
import {
  SEED_HOUSEBOATS,
  SEED_HOUSEBOAT_BOOKINGS,
  SEED_SAFARI_PACKAGES,
  SEED_SAFARI_BOOKINGS,
  SEED_CABS,
  SEED_CAB_BOOKINGS,
} from "../data/travelVerticalsData";

const LS_HOUSEBOATS_KEY = "bharatyatra_houseboats_v1";
const LS_HB_BOOKINGS_KEY = "bharatyatra_houseboat_bookings_v1";
const LS_SAFARI_PKGS_KEY = "bharatyatra_safari_packages_v1";
const LS_SAFARI_BOOKINGS_KEY = "bharatyatra_safari_bookings_v1";
const LS_CABS_KEY = "bharatyatra_cabs_v1";
const LS_CAB_BOOKINGS_KEY = "bharatyatra_cab_bookings_v1";

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
}

export const travelVerticalsService = new TravelVerticalsService();
