import { Router, Request, Response } from "express";
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
import {
  HouseboatBooking,
  SafariBooking,
  CabBooking,
  TourBookingEntity,
  ResortBookingEntity,
  LodgeBookingEntity,
  HotelBookingEntity,
} from "../types/travelVerticalsHierarchy";

export const verticalsApiRouter = Router();

// In-memory active stores with seed defaults
let houseboatsStore = [...SEED_HOUSEBOATS];
let houseboatBookingsStore: HouseboatBooking[] = [...SEED_HOUSEBOAT_BOOKINGS];
let safariPackagesStore = [...SEED_SAFARI_PACKAGES];
let safariBookingsStore: SafariBooking[] = [...SEED_SAFARI_BOOKINGS];
let cabsStore = [...SEED_CABS];
let cabBookingsStore: CabBooking[] = [...SEED_CAB_BOOKINGS];

let toursStore = [...SEED_TOURS];
let tourBookingsStore: TourBookingEntity[] = [...SEED_TOUR_BOOKINGS];
let resortsStore = [...SEED_RESORTS];
let resortBookingsStore: ResortBookingEntity[] = [...SEED_RESORT_BOOKINGS];
let lodgesStore = [...SEED_LODGES];
let lodgeBookingsStore: LodgeBookingEntity[] = [...SEED_LODGE_BOOKINGS];
let hotelPropertiesStore = [...SEED_HOTEL_PROPERTIES];
let hotelRoomsStore = [...SEED_HOTEL_ROOMS];
let hotelBookingsStore: HotelBookingEntity[] = [...SEED_HOTEL_BOOKINGS];
let customer360Store = [...SEED_CUSTOMER_360];

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

// ============================================================================
// 4. TOURS API: tour -> (tour_id) -> tour_bookings
// ============================================================================

verticalsApiRouter.get("/tours", (req: Request, res: Response) => {
  const { destination } = req.query;
  let results = toursStore;

  if (destination) {
    results = results.filter((t) =>
      t.destination.toLowerCase().includes(String(destination).toLowerCase())
    );
  }

  return res.json({
    success: true,
    total: results.length,
    tours: results,
  });
});

verticalsApiRouter.get("/tours/:tourId", (req: Request, res: Response) => {
  const { tourId } = req.params;
  const tour = toursStore.find((t) => t.id === tourId);
  if (!tour) return res.status(404).json({ success: false, error: "Tour not found" });

  const bookings = tourBookingsStore.filter((b) => b.tour_id === tourId);
  return res.json({ success: true, tour, bookingsCount: bookings.length, bookings });
});

verticalsApiRouter.post("/tours/bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const tour = toursStore.find((t) => t.id === body.tour_id);
    if (!tour) return res.status(400).json({ success: false, error: "Invalid tour_id" });

    const serial = Math.floor(1000 + Math.random() * 9000);
    const booking_reference = body.booking_reference || `TR-BK-2026-${serial}`;
    const passengers = body.passengers || [
      {
        full_name: "Rahul Verma",
        age: 32,
        gender: "Male" as const,
        id_type: "Aadhaar" as const,
        id_number: "XXXX-XXXX-8819",
        passenger_type: "Adult" as const,
      },
    ];

    const newBooking: TourBookingEntity = {
      booking_reference,
      tour_id: tour.id,
      customer_id: body.customer_id || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      travel_date: body.travel_date || new Date().toISOString().split("T")[0],
      passengers,
      total_passengers: passengers.length,
      payment_status: "paid",
      booking_status: "confirmed",
      total_amount: body.total_amount || tour.pricing.base_price_adult,
      tour_title: tour.title,
      destination: tour.destination,
      tour_code: tour.tour_code,
      invoice_number: `INV-TR-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    tourBookingsStore.unshift(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 5. RESORTS API: resort -> (resort_id) -> resort_bookings
// ============================================================================

verticalsApiRouter.get("/resorts", (req: Request, res: Response) => {
  const { destination } = req.query;
  let results = resortsStore;
  if (destination) {
    results = results.filter((r) =>
      r.location.destination.toLowerCase().includes(String(destination).toLowerCase())
    );
  }
  return res.json({ success: true, total: results.length, resorts: results });
});

verticalsApiRouter.get("/resorts/:resortId", (req: Request, res: Response) => {
  const { resortId } = req.params;
  const resort = resortsStore.find((r) => r.resort_id === resortId);
  if (!resort) return res.status(404).json({ success: false, error: "Resort not found" });

  const bookings = resortBookingsStore.filter((b) => b.resort_id === resortId);
  return res.json({ success: true, resort, bookingsCount: bookings.length, bookings });
});

verticalsApiRouter.post("/resorts/bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const resort = resortsStore.find((r) => r.resort_id === body.resort_id);
    if (!resort) return res.status(400).json({ success: false, error: "Invalid resort_id" });

    const serial = Math.floor(1000 + Math.random() * 9000);
    const selectedRoom = resort.rooms[0];
    const newBooking: ResortBookingEntity = {
      booking_reference: body.booking_reference || `RES-BK-2026-${serial}`,
      resort_id: resort.resort_id,
      resort_name: resort.resort_name,
      customer_id: body.customer_id || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: body.customer_name || "Aarav Sharma",
      customer_email: body.customer_email || "aarav.sharma@example.com",
      customer_phone: body.customer_phone || "+91 98111 22334",
      guest_details: body.guest_details || [
        {
          full_name: "Aarav Sharma",
          age: 34,
          gender: "Male",
          id_type: "Aadhaar Card",
          id_number: "XXXX-XXXX-4412",
          is_primary: true,
        },
      ],
      check_in_date: body.check_in_date || new Date().toISOString().split("T")[0],
      check_out_date: body.check_out_date || new Date().toISOString().split("T")[0],
      nights_count: body.nights_count || 2,
      room: {
        room_id: body.room?.room_id || selectedRoom.room_id,
        room_name: body.room?.room_name || selectedRoom.room_name,
        units_booked: 1,
      },
      amount: {
        base_fare: resort.pricing.starting_price_per_night * 2,
        taxes_and_service: Math.round(resort.pricing.starting_price_per_night * 2 * 0.18),
        discount: 0,
        total_amount: Math.round(resort.pricing.starting_price_per_night * 2 * 1.18),
      },
      payment_status: "paid",
      booking_status: "confirmed",
      invoice_number: `INV-RES-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    resortBookingsStore.unshift(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 6. LODGES API: auth.users -> lodge_bookings (lodge_id) -> lodge
// ============================================================================

verticalsApiRouter.get("/lodges", (req: Request, res: Response) => {
  return res.json({ success: true, total: lodgesStore.length, lodges: lodgesStore });
});

verticalsApiRouter.get("/lodges/:lodgeId", (req: Request, res: Response) => {
  const { lodgeId } = req.params;
  const lodge = lodgesStore.find((l) => l.lodge_id === lodgeId);
  if (!lodge) return res.status(404).json({ success: false, error: "Lodge not found" });

  const bookings = lodgeBookingsStore.filter((b) => b.lodge_id === lodgeId);
  return res.json({ success: true, lodge, bookingsCount: bookings.length, bookings });
});

verticalsApiRouter.post("/lodges/bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const lodge = lodgesStore.find((l) => l.lodge_id === body.lodge_id);
    if (!lodge) return res.status(400).json({ success: false, error: "Invalid lodge_id" });

    const serial = Math.floor(1000 + Math.random() * 9000);
    const selectedRoom = lodge.rooms[0];
    const nights = body.nights || 2;
    const base_amount = body.base_amount || lodge.starting_price * nights;
    const tax_amount = Math.round(base_amount * 0.12);

    const newBooking: LodgeBookingEntity = {
      booking_reference: body.booking_reference || `LDG-BK-2026-${serial}`,
      lodge_id: lodge.lodge_id,
      customer_id: body.customer_id || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: body.customer_name || "Lodge Traveler",
      customer_email: body.customer_email || "traveler@bharatyatra.in",
      customer_phone: body.customer_phone || "+91 99999 88888",
      check_in_date: body.check_in_date || new Date().toISOString().split("T")[0],
      check_out_date: body.check_out_date || new Date().toISOString().split("T")[0],
      nights,
      selected_room_id: body.selected_room_id || selectedRoom?.room_id || "RM-01",
      selected_room_name: selectedRoom?.room_name || "Standard Lodge Room",
      rooms_count: 1,
      guests_count: { adults: 2, children: 0 },
      guest_details: [
        {
          full_name: body.customer_name || "Lodge Traveler",
          age: 30,
          gender: "Male",
          gov_id: "XXXX-XXXX-9912",
        },
      ],
      base_amount,
      tax_amount,
      total_amount: base_amount + tax_amount,
      payment_status: "paid",
      booking_status: "confirmed",
      ticket_invoice_number: `TKT-INV-LDG-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    lodgeBookingsStore.unshift(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 7. HOTELS 3-TIER API: HOTELS -> HOTELS_ROOMS -> HOTELS_BOOKINGS
// ============================================================================

verticalsApiRouter.get("/hotels", (req: Request, res: Response) => {
  return res.json({ success: true, total: hotelPropertiesStore.length, hotels: hotelPropertiesStore });
});

verticalsApiRouter.get("/hotels/:hotelId/rooms", (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const rooms = hotelRoomsStore.filter((r) => r.hotel_id === hotelId);
  return res.json({ success: true, hotel_id: hotelId, total_rooms: rooms.length, rooms });
});

verticalsApiRouter.post("/hotels/bookings", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const hotel = hotelPropertiesStore.find((h) => h.id === body.hotel_id);
    if (!hotel) return res.status(400).json({ success: false, error: "Invalid hotel_id" });

    const serial = Math.floor(1000 + Math.random() * 9000);
    const room = hotelRoomsStore.find((r) => r.hotel_id === hotel.id) || hotelRoomsStore[0];
    const room_charges = body.base_amount || 9000;
    const gst_amount = Math.round(room_charges * 0.18);
    const total_amount = room_charges + gst_amount;

    const newBooking: HotelBookingEntity = {
      id: body.id || `HTL-BK-${serial}`,
      booking_reference: body.booking_reference || `HTL-BK-2026-${serial}`,
      hotel_id: hotel.id,
      room_id: body.room_id || room?.id || "ROOM-01",
      customer_id: body.customer_id || `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
      hotel_name: hotel.property_name,
      room_name: room?.room_name || "Executive Suite",
      customer_name: body.customer_name || "Vikramaditya Rao",
      customer_email: body.customer_email || "vikram.rao@example.com",
      customer_phone: body.customer_phone || "+91 98222 33445",
      check_in_date: body.check_in_date || new Date().toISOString().split("T")[0],
      check_out_date: body.check_out_date || new Date().toISOString().split("T")[0],
      nights_count: 2,
      rooms_booked_count: 1,
      adults_count: 2,
      children_count: 0,
      guest_manifest: [
        {
          full_name: "Vikramaditya Rao",
          age: 38,
          id_type: "Passport",
          id_number: "Z-8819201",
        },
      ],
      pricing_breakdown: {
        room_charges,
        meal_charges: 0,
        gst_amount,
        total_amount,
      },
      payment: {
        payment_id: `PAY-HTL-${serial}`,
        payment_gateway: "UPI",
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      },
      booking_status: "confirmed",
      qr_pass_code: `QR-PASS-HTL-${serial}`,
      tax_invoice_number: `INV-HTL-2026-${serial}`,
      created_at: new Date().toISOString(),
    };

    hotelBookingsStore.unshift(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 8. CUSTOMER 360 API: auth.users -> customers (7 Child Sub-Tables)
// ============================================================================

verticalsApiRouter.get("/crm/customers-360", (req: Request, res: Response) => {
  return res.json({ success: true, total: customer360Store.length, customers: customer360Store });
});

verticalsApiRouter.get("/crm/customers-360/:customerId", (req: Request, res: Response) => {
  const { customerId } = req.params;
  const customer = customer360Store.find((c) => c.customer_id === customerId);
  if (!customer) return res.status(404).json({ success: false, error: "Customer not found" });

  return res.json({ success: true, customer });
});
