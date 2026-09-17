import {
  PilgrimagePackage,
  PilgrimageOperator,
  PilgrimageBookingRecord,
  PilgrimagePaymentLedgerItem,
  PilgrimageCustomerProfile,
  PilgrimagePassenger,
} from "../types/pilgrimagePipelineTypes";

const LS_PILGRIMAGE_PACKAGES_KEY = "bharatyatra_pilgrimage_pkgs_v1";
const LS_PILGRIMAGE_OPERATORS_KEY = "bharatyatra_pilgrimage_operators_v1";
const LS_PILGRIMAGE_BOOKINGS_KEY = "bharatyatra_pilgrimage_bookings_v1";
const LS_PILGRIMAGE_PAYMENTS_KEY = "bharatyatra_pilgrimage_payments_v1";

export const SEED_PILGRIMAGE_PACKAGES: PilgrimagePackage[] = [
  {
    packageId: "PKG-CHARDHAM-01",
    packageName: "Sacred Char Dham Yatra (Kedarnath & Badrinath Deluxe)",
    circuit: "Char Dham",
    temples: ["Kedarnath Jyotirlinga", "Badrinath Temple", "Guptkashi Vishwanath", "Joshimath Shankarcharya Math"],
    duration: "7 Days / 6 Nights",
    departureCity: "Haridwar / Dehradun",
    arrivalCity: "Haridwar / Dehradun",
    basePriceAdult: 18500,
    basePriceSenior: 16500,
    helipadAddonPrice: 8500,
    vipDarshanFee: 1500,
    availableBatchDates: ["2026-09-22", "2026-09-29", "2026-10-06", "2026-10-14"],
    totalSeatsPerBatch: 35,
    remainingSeatsCurrentBatch: 8,
    transportVehicle: "2x2 Deluxe Air-Suspension Push-Back Coach + 4x4 Mountain Jeeps",
    accommodationType: "Deluxe Ashram Guest Houses & Swiss Cottage Camp at Guptkashi",
    mealPlan: "100% Pure Satvik Vegetarian (No Onion, No Garlic) - 4 Meals Daily",
    vedicGuideIncluded: true,
    operatorId: "OP-DIVYA-01",
    operatorName: "Divya Darshan Yatra Samiti & Pilgrimage Trust",
    rating: 4.96,
    reviewsCount: 480,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Guaranteed VIP Sugam Darshan Pass for Morning Aarti at Kedarnath",
      "Helipad Priority Transfer option from Phata/Sersi",
      "Dedicated High-Altitude Medical Escort & Portable Oxygen Kits",
      "Ganga Aarti participation at Har Ki Pauri with Vedic Pandits",
    ],
    highAltitudeAdvisory: "Mandatory biometric biometric token and high-altitude fitness self-declaration required for Kedarnath (11,755 ft).",
  },
  {
    packageId: "PKG-JYOTIRLINGA-02",
    packageName: "Mahakaleshwar Bhasma Aarti & Omkareshwar Jyotirlinga Circuit",
    circuit: "12 Jyotirlinga",
    temples: ["Mahakaleshwar Jyotirlinga (Ujjain)", "Omkareshwar Jyotirlinga", "Harsiddhi Shaktipeeth", "Kaal Bhairav Mandir"],
    duration: "4 Days / 3 Nights",
    departureCity: "Indore",
    arrivalCity: "Indore",
    basePriceAdult: 11200,
    basePriceSenior: 9800,
    helipadAddonPrice: 0,
    vipDarshanFee: 1200,
    availableBatchDates: ["2026-09-24", "2026-10-01", "2026-10-08", "2026-10-15"],
    totalSeatsPerBatch: 40,
    remainingSeatsCurrentBatch: 14,
    transportVehicle: "Luxury AC BharatBenz Executive Coach",
    accommodationType: "3-Star Deluxe Pilgrim Hotel near Mahakal Corridor",
    mealPlan: "Satvik Malwa Special Vegetarian Thali & Falahari Cuisine",
    vedicGuideIncluded: true,
    operatorId: "OP-KASHI-02",
    operatorName: "Shri Mahakal Vedic Yatra Seva Parishad",
    rating: 4.92,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Confirmed Early Morning Bhasma Aarti Special Entry Pass",
      "Narmada River Boat Cruise & Island Parikrama at Omkareshwar",
      "Direct Escorted Entry at Mahakal Lok Corridor",
      "Senior Citizen Special E-Cart Assistance within temple complex",
    ],
  },
  {
    packageId: "PKG-KASHI-AYODHYA-03",
    packageName: "Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj Sangam",
    circuit: "Kashi & Ayodhya",
    temples: ["Ram Janmabhoomi Mandir (Ayodhya)", "Kashi Vishwanath Dham (Varanasi)", "Sankat Mochan", "Triveni Sangam (Prayagraj)"],
    duration: "5 Days / 4 Nights",
    departureCity: "Varanasi",
    arrivalCity: "Ayodhya / Lucknow",
    basePriceAdult: 14800,
    basePriceSenior: 13200,
    helipadAddonPrice: 0,
    vipDarshanFee: 1100,
    availableBatchDates: ["2026-09-25", "2026-10-02", "2026-10-10", "2026-10-18"],
    totalSeatsPerBatch: 30,
    remainingSeatsCurrentBatch: 6,
    transportVehicle: "Volvo 9600 Multi-Axle Luxury Cruiser",
    accommodationType: "Heritage Pilgrim Haveli by the Ghats & Deluxe Ayodhya Hotel",
    mealPlan: "Pure Satvik Banarasi & Awadhi Prasadam Meals",
    vedicGuideIncluded: true,
    operatorId: "OP-KASHI-02",
    operatorName: "Kashi Vedic Charters & Yatra Samiti",
    rating: 4.98,
    reviewsCount: 620,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Special Sugam Darshan Pass at Ram Lalla Sanctum Sanctorum",
      "Private Bajra Boat on Ganges for Sunset Ganga Aarti at Dashashwamedh",
      "Holy Snan & Vedic Sankalp Puja at Prayagraj Triveni Sangam",
      "Shri Ram Janmabhoomi Teerth Kshetra authorized prasad box",
    ],
  },
  {
    packageId: "PKG-VAISHNO-04",
    packageName: "Mata Vaishno Devi Bhawan & Bhairon Ghati Sacred Darshan",
    circuit: "Vaishno Devi",
    temples: ["Mata Vaishno Devi Sanctum (Holy Pindies)", "Ardhkuwari Cave", "Bhairon Nath Temple", "Ban Ganga"],
    duration: "3 Days / 2 Nights",
    departureCity: "Jammu Tawi / Katra",
    arrivalCity: "Jammu Tawi / Katra",
    basePriceAdult: 7900,
    basePriceSenior: 6900,
    helipadAddonPrice: 4200,
    vipDarshanFee: 800,
    availableBatchDates: ["2026-09-23", "2026-09-27", "2026-10-04", "2026-10-11"],
    totalSeatsPerBatch: 45,
    remainingSeatsCurrentBatch: 19,
    transportVehicle: "AC Tempo Cruiser + Battery Car & Ropeway Priority",
    accommodationType: "Shrine Board Affiliated Deluxe Guest Suite in Katra",
    mealPlan: "Satvik Vaishno Bhoj & Fruit Refreshments on Track",
    vedicGuideIncluded: true,
    operatorId: "OP-VAISHNO-03",
    operatorName: "Mata Rani Yatra Seva Samiti Katra",
    rating: 4.94,
    reviewsCount: 540,
    image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Shri Mata Vaishno Devi Shrine Board (SMVDSB) Verified VIP Yatra Parchi",
      "Helicopter Transfer Option: Katra Helipad to Sanjichhat (8 mins)",
      "Battery car booking & Cable Car Bhairon pass included",
      "Special dry fruit mahaprasad packet blessed at Bhawan",
    ],
  },
  {
    packageId: "PKG-TIRUPATI-05",
    packageName: "Tirupati Balaji Sheegra Darshan & Golden Temple Vellore",
    circuit: "South Temple Circuit",
    temples: ["Lord Venkateswara Swamy (Tirumala)", "Padmavathi Ammavari Temple", "Sri Kalahasti Temple", "Sripuram Golden Temple"],
    duration: "4 Days / 3 Nights",
    departureCity: "Chennai / Bengaluru",
    arrivalCity: "Chennai / Bengaluru",
    basePriceAdult: 12900,
    basePriceSenior: 11500,
    helipadAddonPrice: 0,
    vipDarshanFee: 1800,
    availableBatchDates: ["2026-09-26", "2026-10-03", "2026-10-12", "2026-10-20"],
    totalSeatsPerBatch: 36,
    remainingSeatsCurrentBatch: 11,
    transportVehicle: "Scania Metrolink Air-Conditioned Coach",
    accommodationType: "TTD Privileged Hill Cottages & 4-Star Resort at Tirupati Foot",
    mealPlan: "Authentic South Indian Satvik Banana Leaf Meals & Pure Ghee Laddus",
    vedicGuideIncluded: true,
    operatorId: "OP-TIRUPATI-04",
    operatorName: "Sri Srinivasa Divya Darshanam Trust",
    rating: 4.97,
    reviewsCount: 780,
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "TTD Guaranteed Special Entry (Sheegra) Darshan Slot with Vedic Archana",
      "Original Srivari GI-Tagged Big Tirupati Laddu Prasadam (4 per devotee)",
      "Rahukalam Puja special pass at Sri Kalahasti (Rahu-Ketu Kshetra)",
      "Dedicated Brahmins for Angapradakshinam and Tonsure support",
    ],
  },
];

export const SEED_PILGRIMAGE_OPERATORS: PilgrimageOperator[] = [
  {
    operatorId: "OP-DIVYA-01",
    samitiName: "Divya Darshan Yatra Samiti & Pilgrimage Services",
    headPriestName: "Pandit Radhe Shyam Shastri & Acharya Mukund Vyas",
    phone: "+91 98201 44910",
    email: "yatra@divyadarshan.org.in",
    regNumber: "UTT-REG-TR-2018-9901",
    gstin: "05AABCD8821K1Z5",
    headquartersCity: "Rishikesh, Uttarakhand",
    circuitsCovered: ["Char Dham", "Vaishno Devi", "Amarnath"],
    fleetBusesCount: 18,
    accreditedVedicGuidesCount: 24,
    verificationStatus: "accredited",
    rating: 4.96,
    totalPilgrimsServed: 18450,
    escrowBalance: 1420000,
  },
  {
    operatorId: "OP-KASHI-02",
    samitiName: "Kashi Vedic Charters & Yatra Parishad",
    headPriestName: "Acharya Vidyadhar Shukla",
    phone: "+91 94152 11982",
    email: "kashivedic@teerthyatra.in",
    regNumber: "UP-SOC-VNS-2016-4412",
    gstin: "09AAECK4491J1Z2",
    headquartersCity: "Varanasi, Uttar Pradesh",
    circuitsCovered: ["Kashi & Ayodhya", "12 Jyotirlinga"],
    fleetBusesCount: 14,
    accreditedVedicGuidesCount: 19,
    verificationStatus: "accredited",
    rating: 4.95,
    totalPilgrimsServed: 14200,
    escrowBalance: 980000,
  },
  {
    operatorId: "OP-VAISHNO-03",
    samitiName: "Mata Rani Yatra Seva Samiti Katra",
    headPriestName: "Pandit Omkar Nath Sharma",
    phone: "+91 94191 77283",
    email: "seva@mataraniyatra.com",
    regNumber: "JK-TOU-KTR-2020-119",
    gstin: "01AABCM9902P1Z8",
    headquartersCity: "Katra, Jammu & Kashmir",
    circuitsCovered: ["Vaishno Devi", "Shiv Khori"],
    fleetBusesCount: 12,
    accreditedVedicGuidesCount: 15,
    verificationStatus: "accredited",
    rating: 4.94,
    totalPilgrimsServed: 22100,
    escrowBalance: 760000,
  },
  {
    operatorId: "OP-TIRUPATI-04",
    samitiName: "Sri Srinivasa Divya Darshanam Trust",
    headPriestName: "Shri R. Ramanuja Chariar",
    phone: "+91 98400 33819",
    email: "darshan@srisrinivasa.org",
    regNumber: "AP-TR-TPT-2015-882",
    gstin: "37AABCS3310M1Z7",
    headquartersCity: "Tirupati, Andhra Pradesh",
    circuitsCovered: ["South Temple Circuit"],
    fleetBusesCount: 22,
    accreditedVedicGuidesCount: 30,
    verificationStatus: "accredited",
    rating: 4.98,
    totalPilgrimsServed: 31200,
    escrowBalance: 2150000,
  },
];

export const SEED_PILGRIMAGE_BOOKINGS: PilgrimageBookingRecord[] = [
  {
    bookingId: "PLG-BK-2026-8819",
    packageId: "PKG-CHARDHAM-01",
    packageName: "Sacred Char Dham Yatra (Kedarnath & Badrinath Deluxe)",
    circuit: "Char Dham",
    customerId: "CUST-IN-99012",
    customer: {
      customerId: "CUST-IN-99012",
      fullName: "Ramesh Sharma",
      phone: "+91 98112 44332",
      email: "ramesh.sharma@gmail.com",
      city: "Lucknow",
      state: "Uttar Pradesh",
      emergencyContactName: "Sumit Sharma (Son)",
      emergencyContactPhone: "+91 98112 44335",
      isSeniorCitizenPriority: true,
      medicalFitnessDeclared: true,
    },
    travelDate: "2026-09-22",
    passengersCount: { adults: 1, seniors: 1, total: 2 },
    passengers: [
      {
        id: "pax-1",
        fullName: "Ramesh Sharma",
        age: 62,
        gender: "Male",
        aadhaarToken: "AADHAAR-TOKEN-8819-OK",
        specialSeva: "Rudrabhishek Puja",
        highAltitudeFitnessOk: true,
      },
      {
        id: "pax-2",
        fullName: "Sharda Sharma",
        age: 59,
        gender: "Female",
        aadhaarToken: "AADHAAR-TOKEN-8820-OK",
        specialSeva: "Senior Wheelchair / Doli",
        highAltitudeFitnessOk: true,
      },
    ],
    accommodationType: "Deluxe Ashram & Cottage Suites",
    transportSeats: ["Coach Seat 5A (Window)", "Coach Seat 5B"],
    hasHelicopterAddon: true,
    baseFare: 35000,
    vipDarshanFees: 3000,
    helicopterFees: 17000,
    sevaAddonFees: 2100,
    gstAmount: 2855,
    totalAmount: 59955,
    paymentId: "TX-YATRA-PAY-8819",
    paymentMethod: "UPI",
    paymentStatus: "paid",
    bookingStatus: "darshan_pass_issued",
    ticketNumber: "TKT-YATRA-2026-9041",
    taxInvoiceNumber: "INV-PLG-2026-4412",
    darshanSlotTime: "05:30 AM - 07:00 AM (Sugam Morning Darshan)",
    helipadPriorityToken: "HELI-PHATA-KD-9912",
    shrineBoardQrPayload: "SHRINE-BOARD-BKTC:PASS=8819:PILGRIMS=2:DARSHAN=2026-09-23:SLOT=0530:VIP=TRUE",
    assignedVedicGuide: {
      name: "Acharya Mukund Vyas",
      phone: "+91 98201 44910",
      badgeId: "UK-YATRA-GD-091",
    },
    createdAt: "2026-09-17T10:30:00Z",
  },
];

export const SEED_PILGRIMAGE_PAYMENTS: PilgrimagePaymentLedgerItem[] = [
  {
    paymentId: "TX-YATRA-PAY-8819",
    bookingId: "PLG-BK-2026-8819",
    packageName: "Sacred Char Dham Yatra (Kedarnath & Badrinath Deluxe)",
    customerName: "Ramesh Sharma",
    totalCollected: 59955,
    operatorEscrowPayout: 53959.5, // 90%
    platformCommission: 2997.75, // 5%
    templeTrustSevaContribution: 2997.75, // 5%
    razorpayTransferId: "trf_rzp_live_9918237",
    payoutStatus: "settled_to_bank",
    settlementDate: "2026-09-17",
  },
];

class PilgrimageService {
  public getPackages(): PilgrimagePackage[] {
    try {
      const stored = localStorage.getItem(LS_PILGRIMAGE_PACKAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_PILGRIMAGE_PACKAGES;
  }

  public getPackageById(packageId: string): PilgrimagePackage | undefined {
    return this.getPackages().find((p) => p.packageId === packageId);
  }

  public getOperators(): PilgrimageOperator[] {
    try {
      const stored = localStorage.getItem(LS_PILGRIMAGE_OPERATORS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_PILGRIMAGE_OPERATORS;
  }

  public updateOperatorStatus(operatorId: string, status: "accredited" | "audit_pending" | "suspended"): void {
    const list = this.getOperators().map((op) =>
      op.operatorId === operatorId ? { ...op, verificationStatus: status } : op
    );
    try {
      localStorage.setItem(LS_PILGRIMAGE_OPERATORS_KEY, JSON.stringify(list));
    } catch {
      // Ignored
    }
  }

  public getBookings(): PilgrimageBookingRecord[] {
    try {
      const stored = localStorage.getItem(LS_PILGRIMAGE_BOOKINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_PILGRIMAGE_BOOKINGS;
  }

  public getPayments(): PilgrimagePaymentLedgerItem[] {
    try {
      const stored = localStorage.getItem(LS_PILGRIMAGE_PAYMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return SEED_PILGRIMAGE_PAYMENTS;
  }

  public createCustomerBooking(payload: {
    packageId: string;
    customer: PilgrimageCustomerProfile;
    travelDate: string;
    passengers: PilgrimagePassenger[];
    hasHelicopterAddon: boolean;
    paymentMethod: "UPI" | "NetBanking" | "CreditCard" | "DebitCard";
  }): PilgrimageBookingRecord {
    const pkg = this.getPackageById(payload.packageId) || SEED_PILGRIMAGE_PACKAGES[0];
    const serial = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `PLG-BK-2026-${serial}`;
    const paymentId = `TX-YATRA-PAY-${serial}`;
    const ticketNumber = `TKT-YATRA-2026-${serial + 200}`;
    const taxInvoiceNumber = `INV-PLG-2026-${serial + 500}`;

    const seniorsCount = payload.passengers.filter((p) => p.age >= 60).length;
    const adultsCount = payload.passengers.length - seniorsCount;

    const baseFare = adultsCount * pkg.basePriceAdult + seniorsCount * pkg.basePriceSenior;
    const vipDarshanFees = payload.passengers.length * pkg.vipDarshanFee;
    const helicopterFees = payload.hasHelicopterAddon ? payload.passengers.length * pkg.helipadAddonPrice : 0;
    const sevaAddonFees = payload.passengers.reduce((acc, p) => {
      if (p.specialSeva === "Rudrabhishek Puja") return acc + 1500;
      if (p.specialSeva === "Aarti Pass") return acc + 500;
      if (p.specialSeva === "Senior Wheelchair / Doli") return acc + 2500;
      if (p.specialSeva === "Mahaprasad Box") return acc + 350;
      return acc;
    }, 0);

    const subtotal = baseFare + vipDarshanFees + helicopterFees + sevaAddonFees;
    const gstAmount = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + gstAmount;

    const newBooking: PilgrimageBookingRecord = {
      bookingId,
      packageId: pkg.packageId,
      packageName: pkg.packageName,
      circuit: pkg.circuit,
      customerId: payload.customer.customerId || `CUST-IN-${serial}`,
      customer: payload.customer,
      travelDate: payload.travelDate,
      passengersCount: {
        adults: adultsCount,
        seniors: seniorsCount,
        total: payload.passengers.length,
      },
      passengers: payload.passengers,
      accommodationType: pkg.accommodationType,
      transportSeats: payload.passengers.map((_, idx) => `Coach Seat ${10 + idx}A`),
      hasHelicopterAddon: payload.hasHelicopterAddon,
      baseFare,
      vipDarshanFees,
      helicopterFees,
      sevaAddonFees,
      gstAmount,
      totalAmount,
      paymentId,
      paymentMethod: payload.paymentMethod,
      paymentStatus: "paid",
      bookingStatus: "darshan_pass_issued",
      ticketNumber,
      taxInvoiceNumber,
      darshanSlotTime: "05:30 AM - 07:00 AM (Sugam Darshan & Vedic Archana)",
      helipadPriorityToken: payload.hasHelicopterAddon ? `HELI-${pkg.circuit.substring(0, 3).toUpperCase()}-${serial}` : undefined,
      shrineBoardQrPayload: `SHRINE-PASS-${bookingId}:PAX=${payload.passengers.length}:DATE=${payload.travelDate}:DARSHAN=05:30AM:STATUS=CONFIRMED`,
      assignedVedicGuide: {
        name: "Acharya Mukund Vyas",
        phone: "+91 98201 44910",
        badgeId: "UK-YATRA-GD-091",
      },
      createdAt: new Date().toISOString(),
    };

    // Save booking
    const bookings = [newBooking, ...this.getBookings()];
    try {
      localStorage.setItem(LS_PILGRIMAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // Ignored
    }

    // Save payment ledger entry
    const paymentItem: PilgrimagePaymentLedgerItem = {
      paymentId,
      bookingId,
      packageName: pkg.packageName,
      customerName: payload.customer.fullName,
      totalCollected: totalAmount,
      operatorEscrowPayout: Math.round(totalAmount * 0.9),
      platformCommission: Math.round(totalAmount * 0.05),
      templeTrustSevaContribution: Math.round(totalAmount * 0.05),
      razorpayTransferId: `trf_rzp_${Math.random().toString(36).substring(2, 9)}`,
      payoutStatus: "escrow_held",
      settlementDate: new Date().toISOString().split("T")[0],
    };
    const payments = [paymentItem, ...this.getPayments()];
    try {
      localStorage.setItem(LS_PILGRIMAGE_PAYMENTS_KEY, JSON.stringify(payments));
    } catch {
      // Ignored
    }

    return newBooking;
  }
}

export const pilgrimageService = new PilgrimageService();
