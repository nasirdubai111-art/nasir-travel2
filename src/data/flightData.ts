import { FlightDeal } from "../types";

export interface FlightAirport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  isDomestic: boolean;
  terminal: string;
  popular: boolean;
}

export const AIRPORTS_DATABASE: FlightAirport[] = [
  // Domestic Airports
  { id: "del", code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India", isDomestic: true, terminal: "T3 / T2 / T1", popular: true },
  { id: "bom", code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India", isDomestic: true, terminal: "T2 / T1", popular: true },
  { id: "blr", code: "BLR", name: "Kempegowda International Airport", city: "Bengaluru", country: "India", isDomestic: true, terminal: "T2 / T1", popular: true },
  { id: "hyd", code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India", isDomestic: true, terminal: "Main Terminal", popular: true },
  { id: "maa", code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India", isDomestic: true, terminal: "T1 / T4", popular: true },
  { id: "ccu", code: "CCU", name: "Netaji Subhash Chandra Bose International Airport", city: "Kolkata", country: "India", isDomestic: true, terminal: "Integrated Terminal", popular: true },
  { id: "gox", code: "GOX", name: "Manohar International Airport (Mopa)", city: "Goa (Mopa)", country: "India", isDomestic: true, terminal: "Main Terminal", popular: true },
  { id: "goi", code: "GOI", name: "Dabolim Airport", city: "Goa (Dabolim)", country: "India", isDomestic: true, terminal: "T1", popular: true },
  { id: "pnq", code: "PNQ", name: "Pune International Airport", city: "Pune", country: "India", isDomestic: true, terminal: "New Terminal", popular: true },
  { id: "amd", code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", country: "India", isDomestic: true, terminal: "T1 / T2", popular: true },
  { id: "jai", code: "JAI", name: "Jaipur International Airport", city: "Jaipur", country: "India", isDomestic: true, terminal: "T2", popular: true },
  { id: "cok", code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India", isDomestic: true, terminal: "T1 / T3", popular: true },
  { id: "sxr", code: "SXR", name: "Sheikh ul-Alam International Airport", city: "Srinagar", country: "India", isDomestic: true, terminal: "Main Terminal", popular: true },
  { id: "vns", code: "VNS", name: "Lal Bahadur Shastri International Airport", city: "Varanasi", country: "India", isDomestic: true, terminal: "Main Terminal", popular: true },
  { id: "atq", code: "ATQ", name: "Sri Guru Ram Dass Jee International Airport", city: "Amritsar", country: "India", isDomestic: true, terminal: "Integrated Terminal", popular: true },
  { id: "gau", code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India", isDomestic: true, terminal: "Main Terminal", popular: true },
  { id: "ixz", code: "IXZ", name: "Veer Savarkar International Airport", city: "Port Blair", country: "India", isDomestic: true, terminal: "New Terminal", popular: true },
  { id: "ded", code: "DED", name: "Jolly Grant Airport", city: "Dehradun", country: "India", isDomestic: true, terminal: "T2", popular: true },

  // International Airports
  { id: "dxb", code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates", isDomestic: false, terminal: "T3 / T1", popular: true },
  { id: "sin", code: "SIN", name: "Singapore Changi Airport", city: "Singapore", country: "Singapore", isDomestic: false, terminal: "T3 / Jewel", popular: true },
  { id: "bkk", code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", isDomestic: false, terminal: "Main Concourse", popular: true },
  { id: "lhr", code: "LHR", name: "London Heathrow Airport", city: "London", country: "United Kingdom", isDomestic: false, terminal: "T2 / T4", popular: true },
  { id: "jfk", code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States", isDomestic: false, terminal: "T4 / T7", popular: true },
  { id: "doh", code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar", isDomestic: false, terminal: "Concourse A-E", popular: true },
  { id: "kul", code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia", isDomestic: false, terminal: "KLIA 1 / 2", popular: true },
  { id: "auh", code: "AUH", name: "Zayed International Airport", city: "Abu Dhabi", country: "United Arab Emirates", isDomestic: false, terminal: "Terminal A", popular: true },
  { id: "cmb", code: "CMB", name: "Bandaranaike International Airport", city: "Colombo", country: "Sri Lanka", isDomestic: false, terminal: "Main Terminal", popular: true },
  { id: "cdg", code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France", isDomestic: false, terminal: "2E / 2F", popular: true },
  { id: "fra", code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", isDomestic: false, terminal: "T1", popular: true },
  { id: "syd", code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia", isDomestic: false, terminal: "T1 International", popular: true },
  { id: "nrt", code: "NRT", name: "Narita International Airport", city: "Tokyo", country: "Japan", isDomestic: false, terminal: "T1 / T2", popular: true },
];

export interface FlightExtendedDeal extends FlightDeal {
  aircraft: string;
  isInternational: boolean;
  cabinBaggageKg: number;
  checkInBaggageKg: number;
  onTimePerformance: string;
  terminalDep: string;
  terminalArr: string;
  co2Kg: number;
  amenities: {
    wifi: boolean;
    usbPower: boolean;
    inFlightEntertainment: boolean;
    hotMealIncluded: boolean;
    extraLegroomOptions: boolean;
  };
  returnFlight?: {
    flightNumber: string;
    airline: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    price: number;
  };
}

export const DETAILED_FLIGHTS_DATABASE: FlightExtendedDeal[] = [
  // Domestic Trunk Routes
  {
    id: "fl-del-bom-6e",
    airline: "IndiGo",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    flightNumber: "6E-2041",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Mumbai",
    toCode: "BOM",
    departTime: "06:15",
    arriveTime: "08:30",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 3899,
    originalPrice: 4899,
    tags: ["Most Punctual", "Fastest", "Zero Rescheduling with Flexi"],
    refundable: true,
    mealsIncluded: false,
    aircraft: "Airbus A321neo",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 15,
    onTimePerformance: "94% On-time",
    terminalDep: "T2",
    terminalArr: "T2",
    co2Kg: 95,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: false, extraLegroomOptions: true },
    returnFlight: { flightNumber: "6E-2046", airline: "IndiGo", departTime: "19:30", arriveTime: "21:45", duration: "2h 15m", price: 3999 }
  },
  {
    id: "fl-del-bom-ai",
    airline: "Air India",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "AI-887",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Mumbai",
    toCode: "BOM",
    departTime: "08:00",
    arriveTime: "10:20",
    duration: "2h 20m",
    stops: "Non-stop",
    price: 4350,
    originalPrice: 5499,
    tags: ["Complimentary Hot Breakfast", "25kg Free Baggage", "Widebody A350"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Airbus A350-900",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 25,
    onTimePerformance: "89% On-time",
    terminalDep: "T3",
    terminalArr: "T2",
    co2Kg: 82,
    amenities: { wifi: true, usbPower: true, inFlightEntertainment: true, hotMealIncluded: true, extraLegroomOptions: true },
    returnFlight: { flightNumber: "AI-888", airline: "Air India", departTime: "18:45", arriveTime: "21:05", duration: "2h 20m", price: 4450 }
  },
  {
    id: "fl-del-bom-uk",
    airline: "Vistara",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "UK-945",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Mumbai",
    toCode: "BOM",
    departTime: "11:30",
    arriveTime: "13:45",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 4799,
    originalPrice: 5999,
    tags: ["Gourmet Dining Included", "Star Alliance Lounge", "Club Vistara Points"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Boeing 787-9 Dreamliner",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 20,
    onTimePerformance: "92% On-time",
    terminalDep: "T3",
    terminalArr: "T2",
    co2Kg: 88,
    amenities: { wifi: true, usbPower: true, inFlightEntertainment: true, hotMealIncluded: true, extraLegroomOptions: true },
    returnFlight: { flightNumber: "UK-946", airline: "Vistara", departTime: "20:15", arriveTime: "22:30", duration: "2h 15m", price: 4899 }
  },
  {
    id: "fl-del-bom-qp",
    airline: "Akasa Air",
    airlineLogo: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=120&q=80",
    flightNumber: "QP-1102",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Mumbai",
    toCode: "BOM",
    departTime: "14:10",
    arriveTime: "16:25",
    duration: "2h 15m",
    stops: "Non-stop",
    price: 3499,
    originalPrice: 4400,
    tags: ["Brand New Boeing 737 MAX", "Cafe Akeza Gourmet Snacks", "Fastest Boarding"],
    refundable: true,
    mealsIncluded: false,
    aircraft: "Boeing 737 MAX 8",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 15,
    onTimePerformance: "96% On-time",
    terminalDep: "T2",
    terminalArr: "T1",
    co2Kg: 78,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: false, extraLegroomOptions: true },
    returnFlight: { flightNumber: "QP-1105", airline: "Akasa Air", departTime: "21:00", arriveTime: "23:15", duration: "2h 15m", price: 3599 }
  },
  {
    id: "fl-del-gox",
    airline: "Air India",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "AI-883",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Goa (Mopa)",
    toCode: "GOX",
    departTime: "09:40",
    arriveTime: "12:15",
    duration: "2h 35m",
    stops: "Non-stop",
    price: 4299,
    originalPrice: 5599,
    tags: ["Complimentary Hot Meal", "25kg Baggage", "Holiday Special"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Airbus A320neo",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 25,
    onTimePerformance: "91% On-time",
    terminalDep: "T3",
    terminalArr: "Main",
    co2Kg: 98,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: true, extraLegroomOptions: true }
  },
  {
    id: "fl-blr-del",
    airline: "IndiGo",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    flightNumber: "6E-5032",
    fromCity: "Bengaluru",
    fromCode: "BLR",
    toCity: "New Delhi",
    toCode: "DEL",
    departTime: "07:30",
    arriveTime: "10:15",
    duration: "2h 45m",
    stops: "Non-stop",
    price: 4899,
    originalPrice: 6200,
    tags: ["Early Bird Direct", "Zero Convenience Fee"],
    refundable: true,
    mealsIncluded: false,
    aircraft: "Airbus A321neo",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 15,
    onTimePerformance: "93% On-time",
    terminalDep: "T1",
    terminalArr: "T2",
    co2Kg: 110,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: false, extraLegroomOptions: true }
  },
  {
    id: "fl-bom-sxr",
    airline: "Vistara",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "UK-945",
    fromCity: "Mumbai",
    fromCode: "BOM",
    toCity: "Srinagar",
    toCode: "SXR",
    departTime: "07:05",
    arriveTime: "10:10",
    duration: "3h 05m",
    stops: "Non-stop",
    price: 6199,
    originalPrice: 7800,
    tags: ["Valley Special Direct", "Gourmet Kashmiri Meal Included"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Airbus A320neo",
    isInternational: false,
    cabinBaggageKg: 7,
    checkInBaggageKg: 20,
    onTimePerformance: "88% On-time",
    terminalDep: "T2",
    terminalArr: "Main",
    co2Kg: 125,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: true, extraLegroomOptions: true }
  },

  // International Flights
  {
    id: "fl-del-dxb-ek",
    airline: "Emirates",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "EK-512",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Dubai",
    toCode: "DXB",
    departTime: "09:55",
    arriveTime: "12:10",
    duration: "3h 45m",
    stops: "Non-stop",
    price: 18450,
    originalPrice: 22500,
    tags: ["Fly Better", "30kg Free Baggage", "ice In-Flight Entertainment (5,000+ Channels)"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Boeing 777-300ER",
    isInternational: true,
    cabinBaggageKg: 7,
    checkInBaggageKg: 30,
    onTimePerformance: "97% On-time",
    terminalDep: "T3",
    terminalArr: "T3",
    co2Kg: 210,
    amenities: { wifi: true, usbPower: true, inFlightEntertainment: true, hotMealIncluded: true, extraLegroomOptions: true },
    returnFlight: { flightNumber: "EK-515", airline: "Emirates", departTime: "21:30", arriveTime: "02:15 (+1d)", duration: "3h 45m", price: 18900 }
  },
  {
    id: "fl-del-dxb-6e",
    airline: "IndiGo International",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    flightNumber: "6E-1402",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Dubai",
    toCode: "DXB",
    departTime: "17:20",
    arriveTime: "19:55",
    duration: "4h 05m",
    stops: "Non-stop",
    price: 12999,
    originalPrice: 15800,
    tags: ["Best Value Dubai", "Direct Connection"],
    refundable: true,
    mealsIncluded: false,
    aircraft: "Airbus A321LR",
    isInternational: true,
    cabinBaggageKg: 7,
    checkInBaggageKg: 20,
    onTimePerformance: "95% On-time",
    terminalDep: "T3",
    terminalArr: "T1",
    co2Kg: 195,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: false, extraLegroomOptions: true },
    returnFlight: { flightNumber: "6E-1403", airline: "IndiGo International", departTime: "21:10", arriveTime: "02:00 (+1d)", duration: "3h 50m", price: 13450 }
  },
  {
    id: "fl-bom-sin-sq",
    airline: "Singapore Airlines",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "SQ-423",
    fromCity: "Mumbai",
    fromCode: "BOM",
    toCity: "Singapore",
    toCode: "SIN",
    departTime: "11:45",
    arriveTime: "19:50",
    duration: "5h 35m",
    stops: "Non-stop",
    price: 24800,
    originalPrice: 29500,
    tags: ["World's Best Airline", "KrisFlyer Miles", "Complimentary High-Speed Wi-Fi"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Airbus A350-900",
    isInternational: true,
    cabinBaggageKg: 7,
    checkInBaggageKg: 30,
    onTimePerformance: "98% On-time",
    terminalDep: "T2",
    terminalArr: "T3",
    co2Kg: 280,
    amenities: { wifi: true, usbPower: true, inFlightEntertainment: true, hotMealIncluded: true, extraLegroomOptions: true },
    returnFlight: { flightNumber: "SQ-424", airline: "Singapore Airlines", departTime: "07:45", arriveTime: "10:45", duration: "5h 30m", price: 25200 }
  },
  {
    id: "fl-del-lhr-ai",
    airline: "Air India",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "AI-161",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "London",
    toCode: "LHR",
    departTime: "02:45",
    arriveTime: "07:30",
    duration: "9h 15m",
    stops: "Non-stop",
    price: 49500,
    originalPrice: 58000,
    tags: ["Direct London Flagship", "2 x 23kg Check-in Bags", "Maharaja Comfort"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Boeing 777-300ER",
    isInternational: true,
    cabinBaggageKg: 7,
    checkInBaggageKg: 46,
    onTimePerformance: "87% On-time",
    terminalDep: "T3",
    terminalArr: "T2",
    co2Kg: 540,
    amenities: { wifi: true, usbPower: true, inFlightEntertainment: true, hotMealIncluded: true, extraLegroomOptions: true }
  },
  {
    id: "fl-del-bkk-ai",
    airline: "Air India",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    flightNumber: "AI-332",
    fromCity: "New Delhi",
    fromCode: "DEL",
    toCity: "Bangkok",
    toCode: "BKK",
    departTime: "13:30",
    arriveTime: "19:15",
    duration: "4h 15m",
    stops: "Non-stop",
    price: 14200,
    originalPrice: 17500,
    tags: ["Direct Bangkok Flight", "Free 25kg Bag", "Thai Visa Assistance"],
    refundable: true,
    mealsIncluded: true,
    aircraft: "Airbus A320neo",
    isInternational: true,
    cabinBaggageKg: 7,
    checkInBaggageKg: 25,
    onTimePerformance: "92% On-time",
    terminalDep: "T3",
    terminalArr: "Main",
    co2Kg: 220,
    amenities: { wifi: false, usbPower: true, inFlightEntertainment: false, hotMealIncluded: true, extraLegroomOptions: true }
  }
];

export interface FlightFareTier {
  id: "saver" | "flexi" | "superflex" | "business";
  name: string;
  tagline: string;
  badge?: string;
  priceDelta: number;
  cabinBaggage: string;
  checkInBaggage: string;
  seatSelection: string;
  dateChangeFee: string;
  cancellationFee: string;
  mealBenefit: string;
  yatraCoins: string;
}

export const FLIGHT_FARE_TIERS: FlightFareTier[] = [
  {
    id: "saver",
    name: "Saver Lite",
    tagline: "Essential travel at the guaranteed lowest fare",
    priceDelta: 0,
    cabinBaggage: "7 kg included",
    checkInBaggage: "15 kg included (20kg Intl)",
    seatSelection: "Paid (from ₹150) or free auto-assign",
    dateChangeFee: "₹2,999 + Fare Difference",
    cancellationFee: "₹3,499 airline deduction",
    mealBenefit: "Buy on board / chargeable",
    yatraCoins: "1x YatraCoins (₹150 value)",
  },
  {
    id: "flexi",
    name: "Flexi Plus",
    tagline: "Free standard seats & unlimited date changes",
    badge: "RECOMMENDED",
    priceDelta: 699,
    cabinBaggage: "7 kg included",
    checkInBaggage: "15 kg included + 5kg bonus",
    seatSelection: "Free Standard & Window seats",
    dateChangeFee: "₹0 Unlimited Free Date Changes",
    cancellationFee: "Reduced penalty (only ₹1,500)",
    mealBenefit: "Complimentary Snack Combo & Beverage",
    yatraCoins: "2x YatraCoins (₹350 value)",
  },
  {
    id: "superflex",
    name: "SuperFlex Corporate",
    tagline: "Extra legroom, free hot meals & 100% refund guarantee",
    badge: "MOST FLEXIBLE",
    priceDelta: 1499,
    cabinBaggage: "10 kg Priority Cabin Bag",
    checkInBaggage: "25 kg included",
    seatSelection: "Free Extra Legroom (XL) & Front Rows",
    dateChangeFee: "₹0 Free changes up to 2 hours prior",
    cancellationFee: "₹0 Cancellation Fee (100% Refund)",
    mealBenefit: "Complimentary Gourmet Hot Meal + Desert",
    yatraCoins: "3x YatraCoins + Fast-track Boarding",
  },
  {
    id: "business",
    name: "Business / Maharaja Class",
    tagline: "Lie-flat/recliner seats, airport lounge access & fine dining",
    badge: "LUXURY",
    priceDelta: 6999,
    cabinBaggage: "12 kg Cabin Allowance",
    checkInBaggage: "35 kg Priority Tagged Bag",
    seatSelection: "Wide Business Suite / Recliner",
    dateChangeFee: "₹0 Free anytime date change",
    cancellationFee: "100% Full Refund without deductions",
    mealBenefit: "3-Course Chef Curated Fine Dining",
    yatraCoins: "5x YatraCoins + Lounge Access + Dedicated Escort",
  }
];

export interface FlightSeatItem {
  id: string;
  row: number;
  col: "A" | "B" | "C" | "D" | "E" | "F";
  category: "window" | "middle" | "aisle" | "extra_legroom" | "business";
  price: number;
  isAvailable: boolean;
  features: string[];
}

export const GENERATE_AIRCRAFT_SEATS = (): FlightSeatItem[] => {
  const seats: FlightSeatItem[] = [];
  const rows = 28;
  const cols: ("A" | "B" | "C" | "D" | "E" | "F")[] = ["A", "B", "C", "D", "E", "F"];

  // Rows 1-3: Business / Front Extra Legroom
  // Row 12, 13: Emergency Exit Rows (XL Legroom)
  // Other rows: Standard
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const isWindow = c === "A" || c === "F";
      const isAisle = c === "C" || c === "D";
      const isMiddle = c === "B" || c === "E";

      let category: "window" | "middle" | "aisle" | "extra_legroom" | "business" = isWindow ? "window" : isAisle ? "aisle" : "middle";
      let price = 0;
      let features: string[] = [];

      if (r <= 2) {
        category = "business";
        price = 1200;
        features = ["Front Cabin", "Priority De-boarding", "Extra Recline"];
      } else if (r === 12 || r === 13) {
        category = "extra_legroom";
        price = 850;
        features = ["34-inch XL Legroom", "Emergency Exit Row", "Faster Service"];
      } else if (r <= 6) {
        price = isMiddle ? 250 : 450;
        features = ["Front Zone", "Faster De-boarding"];
      } else {
        price = isMiddle ? 0 : 200;
        features = isWindow ? ["Scenic View"] : isAisle ? ["Direct Aisle Access"] : ["Standard Seat"];
      }

      // Random occupied state for realistic feel
      const isOccupied = (r === 4 && (c === "A" || c === "B")) ||
        (r === 7 && c === "C") ||
        (r === 12 && c === "A") ||
        (r === 15 && (c === "D" || c === "E")) ||
        (r === 18 && c === "F") ||
        (r === 22 && c === "B");

      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        category,
        price,
        isAvailable: !isOccupied,
        features
      });
    }
  }
  return seats;
};

export interface FlightBaggageTier {
  id: string;
  weightKg: number;
  price: number;
  airportCounterPrice: number;
  label: string;
}

export const EXTRA_BAGGAGE_OPTIONS: FlightBaggageTier[] = [
  { id: "bag-3", weightKg: 3, price: 1350, airportCounterPrice: 1950, label: "+3 kg Extra Check-in" },
  { id: "bag-5", weightKg: 5, price: 2250, airportCounterPrice: 3250, label: "+5 kg Extra Check-in" },
  { id: "bag-10", weightKg: 10, price: 4500, airportCounterPrice: 6500, label: "+10 kg Extra Check-in" },
  { id: "bag-15", weightKg: 15, price: 6750, airportCounterPrice: 9750, label: "+15 kg Extra Check-in" },
  { id: "bag-20", weightKg: 20, price: 8990, airportCounterPrice: 13000, label: "+20 kg Extra Check-in" },
];

export interface InFlightMeal {
  id: string;
  name: string;
  diet: "veg" | "non_veg" | "jain" | "vegan";
  price: number;
  calories: string;
  description: string;
  image: string;
}

export const INFLIGHT_MEALS: InFlightMeal[] = [
  {
    id: "meal-1",
    name: "Awadhi Paneer Tikka Rice Bowl",
    diet: "veg",
    price: 399,
    calories: "450 kcal",
    description: "Char-grilled cottage cheese in rich tomato gravy served with aromatic jeera rice and gulab jamun.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "meal-2",
    name: "Hyderabadi Dum Chicken Biryani",
    diet: "non_veg",
    price: 499,
    calories: "580 kcal",
    description: "Succulent chicken cooked with fragrant basmati rice, saffron spices, paired with cooling cucumber raita.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "meal-3",
    name: "Pure Jain Gujarati Khichdi & Kadhi",
    diet: "jain",
    price: 379,
    calories: "380 kcal",
    description: "Prepared without onion/garlic/root vegetables with tempered desi ghee and spiced buttermilk.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "meal-4",
    name: "Smoked Chicken Multigrain Sandwich",
    diet: "non_veg",
    price: 320,
    calories: "340 kcal",
    description: "Herbed smoked chicken breast slices, cheddar cheese, crisp iceberg lettuce in artisanal multigrain bread.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "meal-5",
    name: "South Indian Medu Vada & Idli Combo",
    diet: "veg",
    price: 299,
    calories: "320 kcal",
    description: "Steaming hot idlis with crispy medu vada, served with traditional drumstick sambar and fresh coconut chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "meal-6",
    name: "Mediterranean Falafel & Hummus Wrap",
    diet: "vegan",
    price: 349,
    calories: "390 kcal",
    description: "Crispy chickpea patties, creamy tahini garlic hummus, pickled cucumbers rolled in warm wholewheat flatbread.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
  }
];

export interface FlightAddonOption {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  badge?: string;
  benefit: string;
}

export const FLIGHT_ADDONS_LIST: FlightAddonOption[] = [
  {
    id: "addon-lounge",
    name: "VIP Airport Lounge Pass",
    price: 1199,
    description: "Access Plaza Premium, Encalm & 080 lounges with unlimited buffet, high-speed Wi-Fi, and recliners.",
    icon: "Coffee",
    badge: "POPULAR",
    benefit: "Guaranteed lounge entry even on Economy ticket",
  },
  {
    id: "addon-priority",
    name: "Priority Baggage & Fast-Track Boarding",
    price: 399,
    description: "First on-board, and your checked bags arrive first on the arrival conveyor belt.",
    icon: "Zap",
    badge: "FAST TRACK",
    benefit: "Save 30 mins post-landing",
  },
  {
    id: "addon-zero-cancel",
    name: "Digit 100% Full Refund Guarantee",
    price: 249,
    description: "Cancel for ANY reason up to 2 hours prior to departure and get 100% airline fare refund in wallet/bank.",
    icon: "ShieldCheck",
    badge: "ZERO RISK",
    benefit: "Zero deduction refund protection",
  },
  {
    id: "addon-doorstep",
    name: "Doorstep Baggage Delivery & Pickup",
    price: 699,
    description: "CarterX luggage pickup from your home/hotel directly delivered to your destination hotel room.",
    icon: "Truck",
    benefit: "Travel hands-free without carrying bags to airport",
  },
  {
    id: "addon-carbon",
    name: "Green Yatra Carbon Offset",
    price: 49,
    description: "Plant a certified tree in the Himalayan afforestation belt to neutralize your flight's carbon footprint.",
    icon: "Leaf",
    badge: "ECO FRIENDLY",
    benefit: "Offsets 95kg CO2 with certificate",
  }
];

export interface LiveFlightStatusItem {
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  fromCode: string;
  fromCity: string;
  fromAirport: string;
  fromTerminal: string;
  toCode: string;
  toCity: string;
  toAirport: string;
  toTerminal: string;
  scheduledDep: string;
  estimatedDep: string;
  scheduledArr: string;
  estimatedArr: string;
  status: "ON_TIME" | "BOARDING" | "DEPARTED" | "LANDED" | "DELAYED";
  statusText: string;
  gate: string;
  baggageBelt: string;
  aircraft: string;
  altitude: string;
  speed: string;
  progressPercent: number;
  delayMinutes?: number;
}

export const LIVE_FLIGHTS_TRACKER: LiveFlightStatusItem[] = [
  {
    flightNumber: "6E-2041",
    airline: "IndiGo",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromAirport: "Indira Gandhi Intl T2",
    fromTerminal: "Terminal 2",
    toCode: "BOM",
    toCity: "Mumbai",
    toAirport: "CSMIA T2",
    toTerminal: "Terminal 2",
    scheduledDep: "06:15",
    estimatedDep: "06:15",
    scheduledArr: "08:30",
    estimatedArr: "08:22 (8m Early)",
    status: "LANDED",
    statusText: "Landed & Docked at Gate 32B",
    gate: "Gate 32B",
    baggageBelt: "Belt 04",
    aircraft: "Airbus A321neo (VT-ILQ)",
    altitude: "0 ft (Parked)",
    speed: "0 km/h",
    progressPercent: 100
  },
  {
    flightNumber: "AI-887",
    airline: "Air India",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromAirport: "Indira Gandhi Intl T3",
    fromTerminal: "Terminal 3",
    toCode: "BOM",
    toCity: "Mumbai",
    toAirport: "CSMIA T2",
    toTerminal: "Terminal 2",
    scheduledDep: "08:00",
    estimatedDep: "08:00",
    scheduledArr: "10:20",
    estimatedArr: "10:15",
    status: "DEPARTED",
    statusText: "Cruising over Rajasthan at 36,000 ft",
    gate: "Gate 14A",
    baggageBelt: "Belt 06",
    aircraft: "Airbus A350-900 (VT-JRA)",
    altitude: "36,000 ft",
    speed: "840 km/h",
    progressPercent: 68
  },
  {
    flightNumber: "UK-945",
    airline: "Vistara",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromAirport: "Indira Gandhi Intl T3",
    fromTerminal: "Terminal 3",
    toCode: "BOM",
    toCity: "Mumbai",
    toAirport: "CSMIA T2",
    toTerminal: "Terminal 2",
    scheduledDep: "11:30",
    estimatedDep: "11:30",
    scheduledArr: "13:45",
    estimatedArr: "13:45",
    status: "BOARDING",
    statusText: "Final Boarding Call • Gate 28",
    gate: "Gate 28",
    baggageBelt: "Belt 08",
    aircraft: "Boeing 787-9 Dreamliner",
    altitude: "Ground",
    speed: "0 km/h",
    progressPercent: 10
  },
  {
    flightNumber: "EK-512",
    airline: "Emirates",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromAirport: "Indira Gandhi Intl T3",
    fromTerminal: "Terminal 3",
    toCode: "DXB",
    toCity: "Dubai",
    toAirport: "Dubai Intl T3",
    toTerminal: "Terminal 3",
    scheduledDep: "09:55",
    estimatedDep: "10:20",
    scheduledArr: "12:10",
    estimatedArr: "12:35",
    status: "DELAYED",
    statusText: "Delayed by 25 mins due to airspace congestion",
    gate: "Gate 19B",
    baggageBelt: "Belt 12",
    aircraft: "Boeing 777-300ER (A6-EGO)",
    altitude: "Ground",
    speed: "0 km/h",
    progressPercent: 5,
    delayMinutes: 25
  },
  {
    flightNumber: "QP-1102",
    airline: "Akasa Air",
    airlineLogo: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromAirport: "Indira Gandhi Intl T2",
    fromTerminal: "Terminal 2",
    toCode: "BOM",
    toCity: "Mumbai",
    toAirport: "CSMIA T1",
    toTerminal: "Terminal 1",
    scheduledDep: "14:10",
    estimatedDep: "14:10",
    scheduledArr: "16:25",
    estimatedArr: "16:25",
    status: "ON_TIME",
    statusText: "On Schedule • Aircraft assigned",
    gate: "Gate 06",
    baggageBelt: "Belt 02",
    aircraft: "Boeing 737 MAX 8",
    altitude: "Scheduled",
    speed: "Scheduled",
    progressPercent: 0
  }
];

export interface MockPNRRecord {
  pnr: string;
  bookingRef: string;
  airlinePnr: string;
  airline: string;
  flightNumber: string;
  airlineLogo: string;
  fromCode: string;
  fromCity: string;
  fromTerminal: string;
  toCode: string;
  toCity: string;
  toTerminal: string;
  departDate: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  status: "CONFIRMED" | "CANCELLED" | "RESCHEDULED";
  fareTier: string;
  passengers: {
    name: string;
    type: string;
    seat: string;
    meal: string;
    baggage: string;
    ticketNumber: string;
  }[];
  gate: string;
  boardingTime: string;
  baseFare: number;
  taxesAndGst: number;
  addonsCost: number;
  totalPaid: number;
  paymentMode: string;
  cancellationRefund?: {
    refundId: string;
    originalPaid: number;
    airlineFee: number;
    convenienceRetained: number;
    refundAmount: number;
    status: "INITIATED" | "AIRLINE_APPROVED" | "BANK_PROCESSED" | "CREDITED";
    rrnNumber: string;
    estimatedCreditDate: string;
  };
}

export const INITIAL_PNR_DATABASE: MockPNRRecord[] = [
  {
    pnr: "BY7K92",
    bookingRef: "BY-FL-2026-9901",
    airlinePnr: "6E-K92XW",
    airline: "IndiGo",
    flightNumber: "6E-2041",
    airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromTerminal: "Terminal 2",
    toCode: "BOM",
    toCity: "Mumbai",
    toTerminal: "Terminal 2",
    departDate: "2026-08-28",
    departTime: "06:15",
    arriveTime: "08:30",
    duration: "2h 15m",
    status: "CONFIRMED",
    fareTier: "Flexi Plus",
    passengers: [
      {
        name: "Vikram Malhotra",
        type: "Adult (Primary)",
        seat: "12A (Extra Legroom)",
        meal: "Awadhi Paneer Tikka Rice Bowl",
        baggage: "15 kg + 5 kg Flexi bonus",
        ticketNumber: "312-9902341102"
      }
    ],
    gate: "Gate 18B",
    boardingTime: "05:35",
    baseFare: 3899,
    taxesAndGst: 195,
    addonsCost: 1099,
    totalPaid: 5193,
    paymentMode: "HDFC Bank Credit Card (•••• 8821)"
  },
  {
    pnr: "AI4R2P",
    bookingRef: "BY-FL-2026-8842",
    airlinePnr: "AI-R2PY9",
    airline: "Air India",
    flightNumber: "AI-887",
    airlineLogo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80",
    fromCode: "DEL",
    fromCity: "New Delhi",
    fromTerminal: "Terminal 3",
    toCode: "GOX",
    toCity: "Goa (Mopa)",
    toTerminal: "Main Terminal",
    departDate: "2026-09-05",
    departTime: "09:40",
    arriveTime: "12:15",
    duration: "2h 35m",
    status: "CONFIRMED",
    fareTier: "SuperFlex Corporate",
    passengers: [
      {
        name: "Ananya Sharma",
        type: "Adult",
        seat: "02F (Window)",
        meal: "Chef Special Breakfast",
        baggage: "25 kg Free Checked Bag",
        ticketNumber: "098-5542109823"
      }
    ],
    gate: "Gate 09",
    boardingTime: "09:00",
    baseFare: 4299,
    taxesAndGst: 215,
    addonsCost: 1499,
    totalPaid: 6013,
    paymentMode: "UPI (ananya@okhdfcbank)"
  }
];
