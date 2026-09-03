import {
  MOCK_FLIGHTS,
  MOCK_HOTELS,
  MOCK_TRAINS,
  MOCK_BUSES,
  MOCK_CABS,
  MOCK_YATRAS,
  INITIAL_USER_PROFILE,
  INITIAL_BOOKINGS,
  PROMO_OFFERS,
} from "../../data/mockTravelData";

// In-memory runtime state for mutations
let currentProfile = {
  ...INITIAL_USER_PROFILE,
  id: "usr_cust_001",
  walletBalance: INITIAL_USER_PROFILE.walletBalance || 5450,
  yatraCoins: INITIAL_USER_PROFILE.yatraCoins || 1200,
  preferredCurrency: INITIAL_USER_PROFILE.preferredCurrency || "INR",
  recentSearches: INITIAL_USER_PROFILE.recentSearches || [
    "Delhi to Varanasi Vande Bharat Express",
    "Direct Flights to Goa this weekend",
    "Luxury Heritage Havelis in Jaipur",
  ],
};

let userBookings = [...INITIAL_BOOKINGS];

export const rootResolvers = {
  // Query: health
  health: () => "Enterprise GraphQL Gateway v2.4 operational (AWS Amplify & AppSync Ready)",

  // Query: flights
  flights: ({ from, to, limit }: { from?: string; to?: string; limit?: number }) => {
    let results = MOCK_FLIGHTS.map((f, i) => ({
      id: f.id || `flt_${i + 1}`,
      airline: f.airline || "Air India",
      flightNumber: f.flightNumber || `AI-${200 + i}`,
      from: f.fromCity || (f as any).from || "Delhi (DEL)",
      to: f.toCity || (f as any).to || "Mumbai (BOM)",
      departureTime: f.departTime || (f as any).departureTime || "06:00 AM",
      arrivalTime: f.arriveTime || (f as any).arrivalTime || "08:15 AM",
      duration: f.duration || "2h 15m",
      price: f.price || 4850,
      stops: f.stops === "Non-stop" ? 0 : 1,
      aircraft: (f as any).aircraft || "Airbus A321neo",
      cabinClass: (f as any).cabinClass || "Economy",
      seatsAvailable: (f as any).seatsAvailable || 18,
    }));

    if (from) {
      results = results.filter((r) => r.from.toLowerCase().includes(from.toLowerCase()));
    }
    if (to) {
      results = results.filter((r) => r.to.toLowerCase().includes(to.toLowerCase()));
    }
    return results.slice(0, limit || 10);
  },

  // Query: hotels
  hotels: ({ city, minRating, limit }: { city?: string; minRating?: number; limit?: number }) => {
    let list = MOCK_HOTELS.map((h, i) => ({
      id: h.id || `htl_${i + 1}`,
      name: h.name,
      city: h.city || h.location || "New Delhi",
      address: h.location || `${h.name}, Central District`,
      starRating: h.starCategory || (h as any).starRating || 4.5,
      pricePerNight: h.pricePerNight || (h as any).price || 3200,
      rating: h.rating || 4.6,
      reviewCount: h.reviewsCount || (h as any).reviewCount || 342,
      amenities: h.amenities || ["Free High-Speed Wi-Fi", "Swimming Pool", "Spa & Wellness", "Breakfast Included"],
      image: h.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      roomType: (h as any).roomType || "Deluxe King Room",
    }));

    if (city) {
      list = list.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (minRating) {
      list = list.filter((h) => h.rating >= minRating);
    }
    return list.slice(0, limit || 10);
  },

  // Query: trains
  trains: ({ fromStation, toStation, limit }: { fromStation?: string; toStation?: string; limit?: number }) => {
    let list = MOCK_TRAINS.map((t, i) => ({
      id: t.id || `trn_${i + 1}`,
      trainNumber: t.trainNumber || `${22435 + i}`,
      trainName: t.trainName || "Vande Bharat Express",
      fromStation: t.fromStation || "NDLS (New Delhi)",
      toStation: t.toStation || "BSB (Varanasi Jn)",
      departureTime: t.departureTime || "06:00 AM",
      arrivalTime: t.arrivalTime || "02:00 PM",
      duration: t.duration || "8h 00m",
      fareTier: (t as any).fareTier || "Executive Chair Car (EC)",
      price: (t as any).price || (t.classes && t.classes[0]?.price) || 1750,
      availabilityStatus: (t as any).availabilityStatus || (t.classes && t.classes[0]?.availability) || "AVAILABLE - 42 Seats",
    }));

    if (fromStation) {
      list = list.filter((t) => t.fromStation.toLowerCase().includes(fromStation.toLowerCase()));
    }
    if (toStation) {
      list = list.filter((t) => t.toStation.toLowerCase().includes(toStation.toLowerCase()));
    }
    return list.slice(0, limit || 10);
  },

  // Query: buses
  buses: ({ origin, destination, limit }: { origin?: string; destination?: string; limit?: number }) => {
    let list = MOCK_BUSES.map((b, i) => ({
      id: b.id || `bus_${i + 1}`,
      operatorName: b.operator || (b as any).operatorName || "Zingbus Multi-Axle Volvo",
      busType: b.busType || "AC Sleeper 2+1",
      departureTime: b.departTime || (b as any).departureTime || "21:30 PM",
      arrivalTime: b.arriveTime || (b as any).arrivalTime || "06:00 AM",
      origin: b.from || (b as any).origin || "Delhi",
      destination: b.to || (b as any).destination || "Manali",
      fare: b.price || (b as any).fare || 1250,
      rating: b.rating || 4.8,
      seatsAvailable: b.seatsAvailable || 14,
    }));

    if (origin) {
      list = list.filter((b) => b.origin.toLowerCase().includes(origin.toLowerCase()));
    }
    if (destination) {
      list = list.filter((b) => b.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    return list.slice(0, limit || 10);
  },

  // Query: cabs
  cabs: ({ city }: { city?: string }) => {
    return MOCK_CABS.map((c, i) => ({
      id: c.id || `cab_${i + 1}`,
      cabType: c.vehicleCategory || (c as any).type || "Sedan Prime",
      model: c.models || (c as any).model || "Maruti Suzuki Dzire",
      capacity: c.capacity || 4,
      baseFare: c.estimatedFare || (c as any).baseFare || 149,
      perKmRate: c.baseRatePerKm || (c as any).perKm || 14,
      etaMinutes: 3,
      driverRating: c.driverRating || 4.9,
    }));
  },

  // Query: yatraPackages
  yatraPackages: ({ circuit }: { circuit?: string }) => {
    let list = MOCK_YATRAS.map((y, i) => ({
      id: y.id || `yatra_${i + 1}`,
      title: y.title || "Chardham Sacred Himalayan Circuit",
      circuit: y.circuit || "Uttarakhand Himalayas",
      durationDays: 10,
      startingPrice: y.price || 28500,
      highlights: [y.itinerarySummary || "Helicopter Kedarnath darshan", "VIP Pooja Pass", y.keyDharmashalas || "3-Star Deluxe Camps"],
      isHelicopterAvailable: true,
      registrationRequired: true,
    }));

    if (circuit) {
      list = list.filter((y) => y.circuit.toLowerCase().includes(circuit.toLowerCase()));
    }
    return list;
  },

  // Query: userProfile
  userProfile: ({ userId }: { userId?: string }) => {
    return currentProfile;
  },

  // Query: myBookings
  myBookings: ({ userId, status }: { userId?: string; status?: string }) => {
    let list = userBookings.map((b, i) => ({
      id: b.id || `bk_${i + 1}`,
      type: b.category || b.type || "Flight",
      title: b.title || "Delhi to Mumbai Business Travel",
      bookingDate: b.date || (b as any).bookingDate || "2026-03-01",
      travelDate: b.travelDate || "2026-03-15",
      amount: b.amount || (b as any).price || 4850,
      status: (b.status?.toUpperCase() || "CONFIRMED") as any,
      pnr: b.pnr || `PNR${89000 + i}`,
      ticketNumber: b.ticketNumber || `TKT-${45000 + i}`,
      passengerCount: b.passengerCount || (b as any).passengers || 1,
      qrPayload: `PAYLOAD_TICKET_${b.id || i}_SECURE_SHA256`,
    }));

    if (status) {
      list = list.filter((b) => b.status === status);
    }
    return list;
  },

  // Query: offers
  offers: ({ category }: { category?: string }) => {
    return PROMO_OFFERS.map((o, i) => ({
      id: o.id || `off_${i + 1}`,
      code: o.code || `PROMO${i + 10}`,
      title: o.title || "Instant 15% Off with Axis Bank",
      description: o.subtitle || "Get up to ₹1,500 off on all domestic flights & luxury stays.",
      discountPercent: 15,
      maxDiscount: 1500,
      validTill: o.validTill || "2026-12-31",
      category: (category?.toUpperCase() || "FLIGHTS") as any,
    }));
  },

  // Query: predictPriceTrend
  predictPriceTrend: ({ route, category }: { route: string; category: string }) => {
    const base = 4850;
    const isHoliday = route.toLowerCase().includes("goa") || route.toLowerCase().includes("manali");
    const predicted = isHoliday ? base * 1.35 : base * 0.92;

    return {
      route,
      currentPrice: base,
      predictedPrice7Days: Math.round(predicted),
      recommendation: isHoliday
        ? "Book immediately. High festive demand predicted to raise prices by 35% in 48 hours."
        : "Prices are steady. Safe to track or book with zero cancellation charge protection.",
      confidenceScore: 0.94,
      bestTimeToBook: "Tuesday morning (04:00 AM - 08:00 AM IST)",
    };
  },

  // Query: generateAiItinerary
  generateAiItinerary: ({ destination, days = 3, budgetInr = 15000 }: { destination: string; days?: number; budgetInr?: number }) => {
    return {
      destination,
      durationDays: days,
      estimatedBudget: budgetInr,
      dayWisePlan: Array.from({ length: days }).map((_, idx) => ({
        day: idx + 1,
        title: `Day ${idx + 1}: Iconic ${destination} Landmarks & Heritage Exploration`,
        activities: [
          `Morning: Sunrise heritage walking tour of ${destination}`,
          `Afternoon: Culinary tasting & artisanal handicraft markets`,
          `Evening: Sunset panoramic viewpoint & traditional cultural show`,
        ],
        recommendedDining: `Café ${destination} Bistro & Royal Thali Restaurant`,
      })),
      smartTips: [
        "Pre-book monument fast-track passes on our verified portal to save 45 minutes of queuing.",
        "Opt for Metro QR tickets or pre-paid cabs during peak rush hours (05:00 PM - 08:30 PM).",
        "Keep digital copies of government photo IDs and pilgrim darshan e-passes handy.",
      ],
    };
  },

  // Mutation: createBooking
  createBooking: ({ input }: { input: any }) => {
    const newId = `bk_gql_${Date.now()}`;
    const pnr = `PNR${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: newId,
      category: input.category,
      title: input.serviceTitle,
      date: new Date().toISOString().split("T")[0],
      travelDate: input.travelDate,
      amount: input.amount,
      status: "CONFIRMED",
      pnr,
      passengerCount: input.passengers,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    userBookings.unshift(newBooking as any);

    return {
      success: true,
      message: `Booking created successfully via GraphQL. PNR: ${pnr}`,
      booking: {
        id: newBooking.id,
        type: newBooking.category,
        title: newBooking.title,
        bookingDate: newBooking.date,
        travelDate: newBooking.travelDate,
        amount: newBooking.amount,
        status: "CONFIRMED",
        pnr: newBooking.pnr,
        ticketNumber: newBooking.ticketNumber,
        passengerCount: newBooking.passengerCount,
        qrPayload: `VERIFIED_${pnr}_JWT_AUTH`,
      },
      pnr,
      transactionId: `txn_gql_${Date.now()}`,
    };
  },

  // Mutation: cancelBooking
  cancelBooking: ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
    const item = userBookings.find((b) => b.id === bookingId);
    if (!item) {
      return {
        success: false,
        message: `Booking ${bookingId} not found.`,
        booking: null,
      };
    }

    item.status = "cancelled";
    return {
      success: true,
      message: `Booking ${bookingId} has been cancelled. Refund initiated to wallet. Reason: ${reason || "User requested"}`,
      booking: {
        id: item.id,
        type: item.category || "Flight",
        title: item.title,
        bookingDate: item.date || "2026-03-01",
        travelDate: item.travelDate || "2026-03-15",
        amount: item.amount,
        status: "CANCELLED",
        pnr: item.pnr,
        ticketNumber: item.ticketNumber,
        passengerCount: item.passengerCount || 1,
      },
      transactionId: `ref_${Date.now()}`,
    };
  },

  // Mutation: addMoneyToWallet
  addMoneyToWallet: ({ userId, amount }: { userId: string; amount: number }) => {
    currentProfile.walletBalance += amount;
    return {
      success: true,
      newBalance: currentProfile.walletBalance,
      transactionId: `wlt_topup_${Date.now()}`,
      message: `₹${amount.toLocaleString("en-IN")} credited to user wallet. New balance: ₹${currentProfile.walletBalance.toLocaleString("en-IN")}`,
    };
  },

  // Mutation: updateUserProfile
  updateUserProfile: ({ userId, input }: { userId: string; input: any }) => {
    currentProfile = {
      ...currentProfile,
      ...input,
    };
    return currentProfile;
  },

  // Mutation: saveSearchQuery
  saveSearchQuery: ({ userId, query }: { userId: string; query: string }) => {
    const filtered = currentProfile.recentSearches.filter((q) => q.toLowerCase() !== query.toLowerCase());
    currentProfile.recentSearches = [query, ...filtered].slice(0, 5);
    return currentProfile.recentSearches;
  },
};
