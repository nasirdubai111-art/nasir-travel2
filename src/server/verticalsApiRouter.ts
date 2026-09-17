import { Router, Request, Response } from "express";
import {
  SEED_HOUSEBOATS,
  SEED_HOUSEBOAT_BOOKINGS,
  SEED_SAFARI_PACKAGES,
  SEED_SAFARI_BOOKINGS,
  SEED_CABS,
  SEED_CAB_BOOKINGS,
} from "../data/travelVerticalsData";
import { HouseboatBooking, SafariBooking, CabBooking } from "../types/travelVerticalsHierarchy";

export const verticalsApiRouter = Router();

// In-memory active stores with seed defaults
let houseboatsStore = [...SEED_HOUSEBOATS];
let houseboatBookingsStore: HouseboatBooking[] = [...SEED_HOUSEBOAT_BOOKINGS];
let safariPackagesStore = [...SEED_SAFARI_PACKAGES];
let safariBookingsStore: SafariBooking[] = [...SEED_SAFARI_BOOKINGS];
let cabsStore = [...SEED_CABS];
let cabBookingsStore: CabBooking[] = [...SEED_CAB_BOOKINGS];

// ============================================================================
// 1. HOUSEBOATS API: houseboats -> (houseboat_id) -> houseboat_bookings
// ============================================================================

verticalsApiRouter.get("/houseboats", (req: Request, res: Response) => {
  const { destination, waterbody } = req.query;
  let results = houseboatsStore;

  if (destination && destination !== "All") {
    results = results.filter((hb) =>
      hb.destination.toLowerCase().includes(String(destination).toLowerCase())
    );
  }
  if (waterbody && waterbody !== "All") {
    results = results.filter((hb) =>
      hb.waterbody.toLowerCase().includes(String(waterbody).toLowerCase())
    );
  }

  return res.json({
    success: true,
    total: results.length,
    houseboats: results,
  });
});

verticalsApiRouter.get("/houseboats/:houseboatId", (req: Request, res: Response) => {
  const { houseboatId } = req.params;
  const hb = houseboatsStore.find((h) => h.houseboatId === houseboatId);
  if (!hb) {
    return res.status(404).json({ success: false, error: "Houseboat not found" });
  }
  const relatedBookings = houseboatBookingsStore.filter((b) => b.houseboatId === houseboatId);
  return res.json({
    success: true,
    houseboat: hb,
    bookingsCount: relatedBookings.length,
    bookings: relatedBookings,
  });
});

verticalsApiRouter.get("/houseboat-bookings", (req: Request, res: Response) => {
  const { houseboat_id, customer_id, partner_id } = req.query;
  let results = houseboatBookingsStore;

  if (houseboat_id) {
    results = results.filter((b) => b.houseboatId === houseboat_id);
  }
  if (customer_id) {
    results = results.filter((b) => b.customerId === customer_id);
  }
  if (partner_id) {
    results = results.filter((b) => b.partnerId === partner_id);
  }

  return res.json({
    success: true,
    total: results.length,
    bookings: results,
  });
});

// Full Funnel Completion POST
verticalsApiRouter.post("/houseboat-bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const houseboat = houseboatsStore.find((h) => h.houseboatId === body.houseboatId);
    if (!houseboat) {
      return res.status(400).json({ success: false, error: "Invalid houseboatId" });
    }

    const serial = Math.floor(1000 + Math.random() * 9000);
    const bookingId = body.bookingId || `HB-BK-2026-${serial}`;
    const paymentId = body.paymentId || `TX-HB-PAY-${serial}`;
    const customerId = body.customerId || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();

    const newBooking: HouseboatBooking = {
      bookingId,
      houseboatId: houseboat.houseboatId,
      customerId,
      partnerId: houseboat.partnerId,
      paymentId,
      customer: {
        name: body.customer?.name || "Guest Traveller",
        email: body.customer?.email || "guest@travel.in",
        phone: body.customer?.phone || "+91 98000 00000",
        city: body.customer?.city || "Kochi",
      },
      checkInDate: body.checkInDate || "2026-09-25",
      checkOutDate: body.checkOutDate || "2026-09-26",
      checkInTime: body.checkInTime || "12:00 PM",
      checkOutTime: body.checkOutTime || "09:30 AM",
      totalNights: body.totalNights || 1,
      guestsCount: body.guestsCount || { adults: 2, children: 0 },
      guestManifest: body.guestManifest || [],
      selectedCabinId: body.selectedCabinId,
      selectedCabinName: body.selectedCabinName,
      charterType: body.charterType || "Exclusive Private Charter",
      mealPlan: body.mealPlan || "Authentic Kerala Sadhya & Karimeen Fry",
      specialRequests: body.specialRequests,
      baseFare: body.baseFare || houseboat.startingPricePerNight,
      mealsIncludedFare: 0,
      specialAddonsFare: body.specialAddonsFare || 0,
      discountAmount: body.discountAmount || 0,
      taxAmountGst: body.taxAmountGst || Math.round((body.baseFare || houseboat.startingPricePerNight) * 0.05),
      totalAmount: body.totalAmount || Math.round((body.baseFare || houseboat.startingPricePerNight) * 1.05),
      netPayableAmount: body.totalAmount || Math.round((body.baseFare || houseboat.startingPricePerNight) * 1.05),
      payment: {
        paymentId,
        razorpayOrderId: `order_HB_${serial}`,
        razorpayPaymentId: `pay_HB_${serial}_cap`,
        paymentMethod: body.paymentMethod || "UPI",
        status: "captured",
        paidAt: nowIso,
      },
      bookingStatus: "confirmed",
      ticketNumber: `HB-TKT-${houseboat.destination.substring(0, 3).toUpperCase()}-${serial}`,
      taxInvoiceNumber: `INV-HB-2026-${serial}`,
      issuedAt: nowIso,
      dockLocation: `${houseboat.waterbody} Main Tourist Jetty, ${houseboat.destination}, ${houseboat.state}`,
    };

    houseboatBookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: "Houseboat booking confirmed successfully through funnel",
      booking: newBooking,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 2. WILDLIFE SAFARI API: safari_packages & safari_bookings
// ============================================================================

verticalsApiRouter.get("/safari-packages", (req: Request, res: Response) => {
  const { national_park, safari_type } = req.query;
  let results = safariPackagesStore;

  if (national_park && national_park !== "All") {
    results = results.filter((p) =>
      p.nationalPark.toLowerCase().includes(String(national_park).toLowerCase())
    );
  }
  if (safari_type && safari_type !== "All") {
    results = results.filter((p) => p.safariType === safari_type);
  }

  return res.json({
    success: true,
    total: results.length,
    packages: results,
  });
});

verticalsApiRouter.get("/safari-bookings", (req: Request, res: Response) => {
  return res.json({
    success: true,
    total: safariBookingsStore.length,
    bookings: safariBookingsStore,
  });
});

verticalsApiRouter.post("/safari-bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const pkg = safariPackagesStore.find((p) => p.packageId === body.packageId);
    if (!pkg) {
      return res.status(400).json({ success: false, error: "Invalid safari packageId" });
    }

    const serial = Math.floor(1000 + Math.random() * 9000);
    const bookingId = body.bookingId || `SF-BK-2026-${serial}`;
    const paymentId = body.paymentId || `TX-SF-PAY-${serial}`;
    const ticketNumber = `FD-PERMIT-${pkg.nationalPark.substring(0, 3).toUpperCase()}-2026-${serial}`;
    const nowIso = new Date().toISOString();

    const assignedVehicleNumber = `UK-04-TA-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCodeData = `GOV-IN-FOREST:PERMIT=${ticketNumber}:DATE=${body.safariDate || "2026-09-26"}:PARK=${pkg.nationalPark}:ZONE=${pkg.zone}:VEHICLE=${assignedVehicleNumber}:PAX=${body.passengerCount?.total || 2}:SIGN=VERIFIED_SHA256`;

    const newBooking: SafariBooking = {
      bookingId,
      customer: {
        customerId: `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
        name: body.customer?.name || "Wildlife Enthusiast",
        email: body.customer?.email || "wildlife@safari.in",
        phone: body.customer?.phone || "+91 98000 11223",
        city: body.customer?.city || "New Delhi",
      },
      safariPackageId: pkg.packageId,
      safariPackageName: pkg.packageName,
      nationalPark: pkg.nationalPark,
      zone: pkg.zone,
      safariDate: body.safariDate || "2026-09-26",
      shift: body.shift || pkg.dateSeason.recommendedSlot,
      passengerCount: body.passengerCount || { adults: 2, children: 0, total: 2 },
      passengers: body.passengers || [],
      vehicle: {
        vehicleType: pkg.vehicle,
        assignedVehicleNumber,
        driverName: "Ramswaroop Rawat (Forest Registered Chauffeur)",
        driverPhone: "+91 94120 77192",
        authorizedNaturalistName: "Dr. Arvind Pathak (Certified Wildlife Biologist)",
        naturalistBadgeId: `NAT-${pkg.nationalPark.substring(0, 3).toUpperCase()}-2026-049`,
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
      gateReportingTime: "05:30 AM (Strict Cutoff 06:00 AM)",
      issuedAt: nowIso,
    };

    safariBookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: "Wildlife Safari permit issued and booked successfully",
      booking: newBooking,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 3. CAB API: cab (1) -> cab_bookings (many)
// ============================================================================

verticalsApiRouter.get("/cabs", (req: Request, res: Response) => {
  // Returns cabs and includes the 1:many relation summary
  const enrichedCabs = cabsStore.map((cab) => {
    const bookings = cabBookingsStore.filter((b) => b.cabId === cab.cabId);
    return {
      ...cab,
      allCabBookingsCount: bookings.length,
      bookings,
    };
  });

  return res.json({
    success: true,
    total: enrichedCabs.length,
    cabs: enrichedCabs,
  });
});

verticalsApiRouter.get("/cabs/:cabId", (req: Request, res: Response) => {
  const { cabId } = req.params;
  const cab = cabsStore.find((c) => c.cabId === cabId);
  if (!cab) {
    return res.status(404).json({ success: false, error: "Cab not found" });
  }
  const bookings = cabBookingsStore.filter((b) => b.cabId === cabId);

  return res.json({
    success: true,
    cab: {
      ...cab,
      allCabBookingsCount: bookings.length,
      bookings,
    },
  });
});

verticalsApiRouter.get("/cabs/:cabId/bookings", (req: Request, res: Response) => {
  const { cabId } = req.params;
  const bookings = cabBookingsStore.filter((b) => b.cabId === cabId);
  return res.json({
    success: true,
    cabId,
    total: bookings.length,
    bookings,
  });
});

verticalsApiRouter.post("/cabs/:cabId/bookings", (req: Request, res: Response) => {
  try {
    const { cabId } = req.params;
    const cab = cabsStore.find((c) => c.cabId === cabId);
    if (!cab) {
      return res.status(404).json({ success: false, error: "Cab not found" });
    }

    const body = req.body;
    const serial = Math.floor(100 + Math.random() * 900);
    const cabBookingId = body.cabBookingId || `CB-BK-2026-${serial}`;
    const nowIso = new Date().toISOString();

    const newBooking: CabBooking = {
      cabBookingId,
      cabId: cab.cabId,
      customerId: body.customerId || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: body.customerName || "Rohan Mathur",
      customerPhone: body.customerPhone || "+91 98100 22334",
      customerEmail: body.customerEmail || "rohan@mail.in",
      tripType: body.tripType || "Outstation One-Way",
      pickupLocation: body.pickupLocation || "Delhi NCR",
      dropLocation: body.dropLocation || "Agra",
      pickupDatetime: body.pickupDatetime || "2026-09-22 06:00 AM",
      returnDatetime: body.returnDatetime,
      totalEstimatedKm: body.totalEstimatedKm || 230,
      baseFare: body.baseFare || Math.round(230 * cab.baseFarePerKm),
      tollAndTaxes: body.tollAndTaxes || 415,
      driverAllowance: body.driverAllowance || 0,
      gstAmount: body.gstAmount || 170,
      totalAmount: body.totalAmount || Math.round(230 * cab.baseFarePerKm + 415 + 170),
      paymentId: `TX-CB-${serial}`,
      paymentStatus: body.paymentStatus || "paid",
      bookingStatus: "confirmed",
      otpStart: `${Math.floor(1000 + Math.random() * 9000)}`,
      taxInvoiceNumber: `INV-CB-2026-${serial}`,
      createdAt: nowIso,
    };

    cabBookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: `Booking created and attached to cab ${cab.cabId} (1:many relation)`,
      booking: newBooking,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
