export interface BusBoardingPoint {
  id: string;
  locationName: string;
  landmark: string;
  time: string;
  contactPhone: string;
}

export interface BusSeat {
  seatNumber: string;
  deck: "lower" | "upper";
  type: "sleeper" | "seater";
  price: number;
  isBooked: boolean;
  isLadiesReserved?: boolean;
  isWindow?: boolean;
}

export interface DetailedBusItem {
  id: string;
  operator: string;
  operatorLogo?: string;
  busType: string; // e.g. "Volvo 9600 Multi-Axle AC Sleeper (2+1)"
  category: "electric" | "volvo" | "primo" | "seater" | "sleeper";
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  totalReviews: number;
  price: number;
  originalPrice: number;
  availableSeatsCount: number;
  isElectric: boolean;
  isPrimo: boolean;
  onTimeGuarantee: boolean; // ₹500 delay refund
  amenities: {
    name: string;
    icon: string;
    description: string;
  }[];
  boardingPoints: BusBoardingPoint[];
  droppingPoints: BusBoardingPoint[];
  seatMap: {
    lowerDeck: BusSeat[];
    upperDeck: BusSeat[];
  };
  liveTracking: {
    currentLocation: string;
    speedKmh: number;
    nextStop: string;
    nextStopEta: string;
    driverName: string;
    driverPhone: string;
    vehicleRegNo: string;
    routeHighway: string;
  };
  cancellationPolicy: {
    window: string;
    refundPercent: number;
  }[];
}

export const DETAILED_BUSES_DATABASE: DetailedBusItem[] = [
  {
    id: "bus-zing-01",
    operator: "Zingbus Electric Plus",
    busType: "Volvo 9600 Multi-Axle Luxury AC Sleeper (2+1)",
    category: "volvo",
    fromCity: "Delhi (Kashmere Gate / Majnu Ka Tila)",
    toCity: "Manali (Private Bus Stand)",
    departureTime: "07:30 PM",
    arrivalTime: "08:15 AM",
    duration: "12h 45m",
    rating: 4.85,
    totalReviews: 2450,
    price: 1399,
    originalPrice: 1899,
    availableSeatsCount: 14,
    isElectric: false,
    isPrimo: true,
    onTimeGuarantee: true,
    amenities: [
      { name: "Live GPS Tracking", icon: "Navigation", description: "Real-time location sharing via SMS/WhatsApp" },
      { name: "Clean Blanket & Fresh Pillow", icon: "Sparkles", description: "UV sanitized fresh linen kit" },
      { name: "220V Charging Ports", icon: "Zap", description: "High-speed USB-C & regular AC socket per berth" },
      { name: "Complimentary Mineral Water", icon: "Droplets", description: "1L Bisleri sealed bottle" },
      { name: "Individual Reading Lamp", icon: "Sun", description: "Adjustable warm LED light" },
      { name: "Emergency SOS & CCTV", icon: "ShieldCheck", description: "24x7 control room surveillance" },
    ],
    boardingPoints: [
      { id: "bp1", locationName: "Kashmere Gate Metro Gate #1", landmark: "Near HP Petrol Pump", time: "07:30 PM", contactPhone: "+91 98110 44551" },
      { id: "bp2", locationName: "Majnu Ka Tila", landmark: "Near Gurudwara Flyover", time: "08:00 PM", contactPhone: "+91 98110 44552" },
      { id: "bp3", locationName: "Karnal Bypass (Mukarba Chowk)", landmark: "Under the Flyover", time: "08:45 PM", contactPhone: "+91 98110 44553" },
    ],
    droppingPoints: [
      { id: "dp1", locationName: "Kullu Bypass", landmark: "Near Shobla Hotel", time: "07:15 AM", contactPhone: "+91 98110 44554" },
      { id: "dp2", locationName: "Manali Private Bus Stand", landmark: "Near Mall Road Entry", time: "08:15 AM", contactPhone: "+91 98110 44555" },
    ],
    seatMap: {
      lowerDeck: [
        { seatNumber: "L1", deck: "lower", type: "sleeper", price: 1399, isBooked: false, isLadiesReserved: true, isWindow: true },
        { seatNumber: "L2", deck: "lower", type: "sleeper", price: 1399, isBooked: false, isLadiesReserved: true, isWindow: false },
        { seatNumber: "L3", deck: "lower", type: "sleeper", price: 1449, isBooked: true, isWindow: true },
        { seatNumber: "L4", deck: "lower", type: "sleeper", price: 1399, isBooked: false, isWindow: true },
        { seatNumber: "L5", deck: "lower", type: "sleeper", price: 1399, isBooked: false, isWindow: false },
        { seatNumber: "L6", deck: "lower", type: "sleeper", price: 1449, isBooked: false, isWindow: true },
        { seatNumber: "L7", deck: "lower", type: "sleeper", price: 1399, isBooked: true, isWindow: true },
        { seatNumber: "L8", deck: "lower", type: "sleeper", price: 1399, isBooked: true, isWindow: false },
        { seatNumber: "L9", deck: "lower", type: "sleeper", price: 1449, isBooked: false, isWindow: true },
      ],
      upperDeck: [
        { seatNumber: "U1", deck: "upper", type: "sleeper", price: 1499, isBooked: false, isLadiesReserved: true, isWindow: true },
        { seatNumber: "U2", deck: "upper", type: "sleeper", price: 1499, isBooked: false, isLadiesReserved: true, isWindow: false },
        { seatNumber: "U3", deck: "upper", type: "sleeper", price: 1549, isBooked: false, isWindow: true },
        { seatNumber: "U4", deck: "upper", type: "sleeper", price: 1499, isBooked: true, isWindow: true },
        { seatNumber: "U5", deck: "upper", type: "sleeper", price: 1499, isBooked: false, isWindow: false },
        { seatNumber: "U6", deck: "upper", type: "sleeper", price: 1549, isBooked: false, isWindow: true },
        { seatNumber: "U7", deck: "upper", type: "sleeper", price: 1499, isBooked: false, isWindow: true },
        { seatNumber: "U8", deck: "upper", type: "sleeper", price: 1499, isBooked: true, isWindow: false },
        { seatNumber: "U9", deck: "upper", type: "sleeper", price: 1549, isBooked: false, isWindow: true },
      ],
    },
    liveTracking: {
      currentLocation: "NH-44 Murthal Haveli Bypass",
      speedKmh: 76,
      nextStop: "Ambala Cantt Junction (Dinner Stop)",
      nextStopEta: "10:45 PM",
      driverName: "Captain Jaswinder Singh",
      driverPhone: "+91 94160 22319",
      vehicleRegNo: "DL 01 PC 9988",
      routeHighway: "Delhi - Chandigarh - Bilaspur - Mandi - Manali (NH-21)",
    },
    cancellationPolicy: [
      { window: "> 24 hours before departure", refundPercent: 100 },
      { window: "12 to 24 hours before departure", refundPercent: 80 },
      { window: "4 to 12 hours before departure", refundPercent: 50 },
      { window: "< 4 hours before departure", refundPercent: 0 },
    ],
  },
  {
    id: "bus-nuego-02",
    operator: "NueGo 100% Electric Intercity",
    busType: "Zero-Emission Electric AC Seater (2+2)",
    category: "electric",
    fromCity: "Delhi (ISBT Kashmere Gate)",
    toCity: "Jaipur (Sindhi Camp / 200 Ft Bypass)",
    departureTime: "06:30 AM",
    arrivalTime: "11:30 AM",
    duration: "5h 00m",
    rating: 4.9,
    totalReviews: 3820,
    price: 499,
    originalPrice: 799,
    availableSeatsCount: 22,
    isElectric: true,
    isPrimo: true,
    onTimeGuarantee: true,
    amenities: [
      { name: "Zero Noise & Zero Emissions", icon: "Leaf", description: "Ultra-quiet electric drivetrain" },
      { name: "Reclining Leather Seats", icon: "Armchair", description: "135-degree pushback ergonomic comfort" },
      { name: "High Speed USB Fast Charger", icon: "Zap", description: "Dedicated port at every seat" },
      { name: "AI Driver Fatigue Detection", icon: "ShieldCheck", description: "Dual dash-cam with eye blink sensor" },
      { name: "Complimentary Snack & Water", icon: "Coffee", description: "Packaged juice and sealed water" },
    ],
    boardingPoints: [
      { id: "n-bp1", locationName: "ISBT Kashmere Gate", landmark: "Bay #42", time: "06:30 AM", contactPhone: "+91 99990 11221" },
      { id: "n-bp2", locationName: "Dhaula Kuan Metro Station", landmark: "Under Foot Over Bridge", time: "07:15 AM", contactPhone: "+91 99990 11222" },
      { id: "n-bp3", locationName: "IFFCO Chowk Gurgaon", landmark: "Opposite Westin Hotel", time: "07:45 AM", contactPhone: "+91 99990 11223" },
    ],
    droppingPoints: [
      { id: "n-dp1", locationName: "Amer Road Junction", landmark: "Near Petrol Pump", time: "11:00 AM", contactPhone: "+91 99990 11224" },
      { id: "n-dp2", locationName: "Sindhi Camp Bus Stand", landmark: "NueGo Electric Lounge", time: "11:30 AM", contactPhone: "+91 99990 11225" },
    ],
    seatMap: {
      lowerDeck: [
        { seatNumber: "1A", deck: "lower", type: "seater", price: 499, isBooked: false, isLadiesReserved: true, isWindow: true },
        { seatNumber: "1B", deck: "lower", type: "seater", price: 499, isBooked: false, isLadiesReserved: true, isWindow: false },
        { seatNumber: "1C", deck: "lower", type: "seater", price: 499, isBooked: true, isWindow: false },
        { seatNumber: "1D", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: true },
        { seatNumber: "2A", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: true },
        { seatNumber: "2B", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: false },
        { seatNumber: "2C", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: false },
        { seatNumber: "2D", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: true },
        { seatNumber: "3A", deck: "lower", type: "seater", price: 499, isBooked: true, isWindow: true },
        { seatNumber: "3B", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: false },
        { seatNumber: "3C", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: false },
        { seatNumber: "3D", deck: "lower", type: "seater", price: 499, isBooked: false, isWindow: true },
      ],
      upperDeck: [],
    },
    liveTracking: {
      currentLocation: "Delhi-Jaipur Super Expressway (NH-48) Kotputli",
      speedKmh: 82,
      nextStop: "Shahpura Mid-Way Halt",
      nextStopEta: "09:45 AM",
      driverName: "Pilot Rakesh Sharma",
      driverPhone: "+91 98290 88711",
      vehicleRegNo: "DL 01 EV 1024",
      routeHighway: "Delhi - Gurgaon - Neemrana - Kotputli - Jaipur (NH-48)",
    },
    cancellationPolicy: [
      { window: "> 12 hours before departure", refundPercent: 100 },
      { window: "2 to 12 hours before departure", refundPercent: 75 },
      { window: "< 2 hours before departure", refundPercent: 0 },
    ],
  },
  {
    id: "bus-intrcity-03",
    operator: "IntrCity SmartBus Primo",
    busType: "BharatBenz AC Sleeper (2+1) with In-Bus Washroom",
    category: "primo",
    fromCity: "Bengaluru (Madiwala / Majestic)",
    toCity: "Goa (Panaji / Mapusa)",
    departureTime: "08:30 PM",
    arrivalTime: "08:45 AM",
    duration: "12h 15m",
    rating: 4.88,
    totalReviews: 4190,
    price: 1550,
    originalPrice: 2100,
    availableSeatsCount: 9,
    isElectric: false,
    isPrimo: true,
    onTimeGuarantee: true,
    amenities: [
      { name: "In-Bus Bio-Washroom", icon: "Bath", description: "Hygienic vacuum toilet with sanitizer" },
      { name: "SmartBus Lounge Access", icon: "Armchair", description: "Air-conditioned private waiting lounge" },
      { name: "Bus Captain on Board", icon: "Users", description: "Dedicated attendant for baggage and assistance" },
      { name: "Live GPS & ETA Telemetry", icon: "Navigation", description: "Family WhatsApp sharing link" },
      { name: "Fresh Blanket & Water", icon: "Droplets", description: "Packaged sanitised travel set" },
    ],
    boardingPoints: [
      { id: "i-bp1", locationName: "Madiwala SmartBus Lounge", landmark: "Near Total Mall", time: "08:30 PM", contactPhone: "+91 97420 55661" },
      { id: "i-bp2", locationName: "Majestic Anand Rao Circle", landmark: "Opp. racecourse road", time: "09:15 PM", contactPhone: "+91 97420 55662" },
      { id: "i-bp3", locationName: "Yesvantpur Govardhan Theatre", landmark: "Next to Metro Station", time: "09:45 PM", contactPhone: "+91 97420 55663" },
    ],
    droppingPoints: [
      { id: "i-dp1", locationName: "Madgaon Junction", landmark: "Near Railway Station Circle", time: "07:30 AM", contactPhone: "+91 97420 55664" },
      { id: "i-dp2", locationName: "Panaji KTC Bus Stand", landmark: "Platform #3", time: "08:45 AM", contactPhone: "+91 97420 55665" },
    ],
    seatMap: {
      lowerDeck: [
        { seatNumber: "L1", deck: "lower", type: "sleeper", price: 1550, isBooked: true, isWindow: true },
        { seatNumber: "L2", deck: "lower", type: "sleeper", price: 1550, isBooked: true, isWindow: false },
        { seatNumber: "L3", deck: "lower", type: "sleeper", price: 1600, isBooked: false, isWindow: true },
        { seatNumber: "L4", deck: "lower", type: "sleeper", price: 1550, isBooked: false, isLadiesReserved: true, isWindow: true },
        { seatNumber: "L5", deck: "lower", type: "sleeper", price: 1550, isBooked: false, isLadiesReserved: true, isWindow: false },
        { seatNumber: "L6", deck: "lower", type: "sleeper", price: 1600, isBooked: false, isWindow: true },
      ],
      upperDeck: [
        { seatNumber: "U1", deck: "upper", type: "sleeper", price: 1650, isBooked: true, isWindow: true },
        { seatNumber: "U2", deck: "upper", type: "sleeper", price: 1650, isBooked: true, isWindow: false },
        { seatNumber: "U3", deck: "upper", type: "sleeper", price: 1700, isBooked: false, isWindow: true },
        { seatNumber: "U4", deck: "upper", type: "sleeper", price: 1650, isBooked: false, isWindow: true },
        { seatNumber: "U5", deck: "upper", type: "sleeper", price: 1650, isBooked: false, isWindow: false },
        { seatNumber: "U6", deck: "upper", type: "sleeper", price: 1700, isBooked: false, isWindow: true },
      ],
    },
    liveTracking: {
      currentLocation: "Hubballi-Dharwad Bypass Expressway",
      speedKmh: 84,
      nextStop: "Belagavi Royal Orchid Halt",
      nextStopEta: "03:15 AM",
      driverName: "Captain Ramesh Gowda",
      driverPhone: "+91 98450 71239",
      vehicleRegNo: "KA 01 AH 5544",
      routeHighway: "Bengaluru - Tumakuru - Chitradurga - Hubli - Dharwad - Goa (NH-48)",
    },
    cancellationPolicy: [
      { window: "> 24 hours before departure", refundPercent: 100 },
      { window: "12 to 24 hours before departure", refundPercent: 80 },
      { window: "4 to 12 hours before departure", refundPercent: 50 },
      { window: "< 4 hours before departure", refundPercent: 0 },
    ],
  },
];

export const DETAILED_BUSES = DETAILED_BUSES_DATABASE;
