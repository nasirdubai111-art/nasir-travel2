import { ServiceCategory } from "../types";

export interface TravelNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: ServiceCategory | "general";
  type: "alert" | "info" | "success" | "warning";
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface RouteComparisonMode {
  category: "flights" | "trains" | "buses" | "cabs";
  serviceName: string;
  subTitle: string;
  duration: string;
  durationHours: number;
  price: number;
  punctualityScore: string;
  comfortRating: number;
  luggageLimit: string;
  carbonFootprint: string;
  bestFor: string;
  badge?: string;
  scheduleFrequency: string;
}

export interface RouteComparison {
  id: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  overview: string;
  recommendedMode: "flights" | "trains" | "buses" | "cabs";
  modes: RouteComparisonMode[];
}

export interface ScratchCardReward {
  id: string;
  title: string;
  code: string;
  valueText: string;
  coinsEarned: number;
  cashbackAmount?: number;
  description: string;
  isScratched: boolean;
  expiryDate: string;
  category: ServiceCategory | "all";
}

export interface MultiTripPlanTemplate {
  id: string;
  title: string;
  destination: string;
  duration: string;
  theme: string;
  image: string;
  tag: string;
  totalEstimatedPrice: number;
  discountedPackagePrice: number;
  steps: {
    service: ServiceCategory;
    icon: string;
    name: string;
    description: string;
    cost: number;
  }[];
  highlights: string[];
}

export const TRAVEL_NOTIFICATIONS: TravelNotification[] = [
  {
    id: "notif-1",
    title: "Flight Gate & Boarding Update",
    message: "IndiGo 6E-2044 (DEL ➔ GOX): Boarding Gate is assigned to Gate 42B, Terminal 3, IGI Delhi. Web Check-in is now completed.",
    time: "10 mins ago",
    category: "flights",
    type: "alert",
    read: false,
    actionText: "View Boarding Pass",
  },
  {
    id: "notif-2",
    title: "Train Platform Announcement",
    message: "Vande Bharat Express (22436) to Varanasi will depart on-time from Platform No. 1, New Delhi Railway Station (NDLS).",
    time: "1 hour ago",
    category: "trains",
    type: "info",
    read: false,
    actionText: "Track Live Train",
  },
  {
    id: "notif-3",
    title: "₹250 YatraCoins Cashback Added",
    message: "Congratulations! You earned 250 YatraCoins for your recent luxury resort booking. Use them on your next trip.",
    time: "3 hours ago",
    category: "general",
    type: "success",
    read: true,
    actionText: "Open Rewards Hub",
  },
  {
    id: "notif-4",
    title: "Chauffeur & Vehicle Assigned",
    message: "Your Outstation Cab (Innova Crysta - DL 01 AB 8920) with Chauffeur Rajesh Kumar is confirmed. OTP for start trip: 4921.",
    time: "5 hours ago",
    category: "cabs",
    type: "info",
    read: true,
    actionText: "Call Chauffeur",
  },
  {
    id: "notif-5",
    title: "VIP Darshan Slot Confirmed",
    message: "Tirupati Balaji Seeghra Darshan (₹300) slot confirmed for 28 Aug, 10:30 AM. Traditional dress code mandatory.",
    time: "1 day ago",
    category: "pilgrimage",
    type: "success",
    read: true,
    actionText: "View Pilgrim Pass",
  },
  {
    id: "notif-6",
    title: "Monsoon Weather Advisory",
    message: "Mild rain forecast in Western Ghats & Goa. Outstation cab drivers advised to maintain safe speeds on Ghat sections.",
    time: "1 day ago",
    category: "general",
    type: "warning",
    read: true,
  },
];

export const ROUTE_COMPARISONS: RouteComparison[] = [
  {
    id: "del-jai",
    fromCity: "New Delhi",
    toCity: "Jaipur (Pink City)",
    distanceKm: 280,
    overview: "Delhi to Jaipur is one of India's most popular corridors. Vande Bharat Express and Volvo Sleeper buses provide unbeatable value and comfort, while Cabs offer door-to-door convenience.",
    recommendedMode: "trains",
    modes: [
      {
        category: "trains",
        serviceName: "Vande Bharat / Shatabdi",
        subTitle: "NDLS ➔ JP (Train 20978)",
        duration: "3h 40m",
        durationHours: 3.6,
        price: 1050,
        punctualityScore: "98% On-time",
        comfortRating: 4.8,
        luggageLimit: "40 kg / person",
        carbonFootprint: "12 kg CO₂ (Eco-friendly)",
        bestFor: "Best overall speed, scenic comfort & on-seat snacks",
        badge: "⚡ Fastest & Best Value",
        scheduleFrequency: "6 daily express trains",
      },
      {
        category: "flights",
        serviceName: "IndiGo / Air India Non-stop",
        subTitle: "DEL ➔ JAI (Flight 6E-212)",
        duration: "55m (Flight) + 2h Airport",
        durationHours: 2.9,
        price: 2950,
        punctualityScore: "92% On-time",
        comfortRating: 4.6,
        luggageLimit: "15 kg Check-in + 7 kg Cabin",
        carbonFootprint: "74 kg CO₂",
        bestFor: "Connecting air passengers or urgent luxury travel",
        scheduleFrequency: "4 daily flights",
      },
      {
        category: "buses",
        serviceName: "Volvo 9600 Multi-Axle Sleeper",
        subTitle: "Zingbus / NueGo Electric",
        duration: "4h 45m",
        durationHours: 4.75,
        price: 650,
        punctualityScore: "94% On-time",
        comfortRating: 4.4,
        luggageLimit: "25 kg / person",
        carbonFootprint: "18 kg CO₂",
        bestFor: "Budget travelers & late-night comfortable sleep",
        badge: "💰 Budget Winner",
        scheduleFrequency: "Every 20 mins from ISBT / Dhaula Kuan",
      },
      {
        category: "cabs",
        serviceName: "Private Sedan / Innova Crysta",
        subTitle: "Door-to-door Highway Express",
        duration: "4h 15m (via Expressway)",
        durationHours: 4.25,
        price: 2799,
        punctualityScore: "100% On-demand",
        comfortRating: 4.9,
        luggageLimit: "Unlimited Boot Space",
        carbonFootprint: "58 kg CO₂",
        bestFor: "Families, pets, luggage & flexible pitstops at Murthal/Highway dhabas",
        badge: "🚗 Maximum Freedom",
        scheduleFrequency: "Instant 24x7 Pickup",
      },
    ],
  },
  {
    id: "bom-goa",
    fromCity: "Mumbai",
    toCity: "Goa (Mopa / Dabolim)",
    distanceKm: 590,
    overview: "Connecting the financial capital to Goa's beaches. Flights save maximum time, while the Konkan Vande Bharat offers breathtaking scenic viaducts and waterfalls.",
    recommendedMode: "flights",
    modes: [
      {
        category: "flights",
        serviceName: "IndiGo / Akasa Air Direct",
        subTitle: "BOM ➔ GOX / GOI",
        duration: "1h 10m",
        durationHours: 1.15,
        price: 3499,
        punctualityScore: "96% On-time",
        comfortRating: 4.8,
        luggageLimit: "15 kg Check-in + 7 kg Cabin",
        carbonFootprint: "92 kg CO₂",
        bestFor: "Quick weekend beach getaways & time saving",
        badge: "⚡ Super Fast",
        scheduleFrequency: "18+ daily flights",
      },
      {
        category: "trains",
        serviceName: "Konkan Vande Bharat Express",
        subTitle: "CSMT ➔ Madgaon (Train 22229)",
        duration: "7h 45m",
        durationHours: 7.75,
        price: 1815,
        punctualityScore: "97% On-time",
        comfortRating: 4.9,
        luggageLimit: "40 kg / person",
        carbonFootprint: "24 kg CO₂",
        bestFor: "Scenic Konkan railway views, tunnels & plush executive seats",
        badge: "🌊 Most Scenic Route",
        scheduleFrequency: "6 days / week",
      },
      {
        category: "buses",
        serviceName: "IntrCity SmartBus Volvo Sleeper",
        subTitle: "Overnight Luxury Sleeper",
        duration: "11h 30m (Overnight)",
        durationHours: 11.5,
        price: 1250,
        punctualityScore: "91% On-time",
        comfortRating: 4.3,
        luggageLimit: "25 kg / person",
        carbonFootprint: "31 kg CO₂",
        bestFor: "Overnight sleeping with zero daytime loss",
        scheduleFrequency: "25+ evening departures",
      },
      {
        category: "cabs",
        serviceName: "Innova Crysta Road Trip",
        subTitle: "Mumbai-Pune Expressway & NH66",
        duration: "10h 30m",
        durationHours: 10.5,
        price: 8499,
        punctualityScore: "100% On-demand",
        comfortRating: 4.7,
        luggageLimit: "4 Large Suitcases",
        carbonFootprint: "140 kg CO₂",
        bestFor: "Epic road trip lovers stopping for Kolhapuri thalis & Ghat vistas",
        scheduleFrequency: "On-demand Chauffeur",
      },
    ],
  },
  {
    id: "del-vns",
    fromCity: "New Delhi",
    toCity: "Varanasi (Kashi)",
    distanceKm: 780,
    overview: "The holy journey to Kashi. The pioneering Vande Bharat Express revolutionized this corridor with unmatched punctuality and comfort.",
    recommendedMode: "trains",
    modes: [
      {
        category: "trains",
        serviceName: "Vande Bharat Express (22436)",
        subTitle: "NDLS ➔ Varanasi Jn",
        duration: "8h 00m",
        durationHours: 8.0,
        price: 1750,
        punctualityScore: "99% On-time",
        comfortRating: 4.9,
        luggageLimit: "40 kg / person",
        carbonFootprint: "28 kg CO₂",
        bestFor: "Unmatched punctuality, Satvik meals & smooth 130-160 km/h ride",
        badge: "🏆 Flagship Route Winner",
        scheduleFrequency: "Daily except Thursday",
      },
      {
        category: "flights",
        serviceName: "Air India / IndiGo Non-stop",
        subTitle: "DEL ➔ VNS (Babatpur)",
        duration: "1h 25m",
        durationHours: 1.4,
        price: 4199,
        punctualityScore: "93% On-time",
        comfortRating: 4.7,
        luggageLimit: "15 kg Check-in",
        carbonFootprint: "115 kg CO₂",
        bestFor: "Senior citizens wanting shortest transit time",
        scheduleFrequency: "8 daily flights",
      },
      {
        category: "buses",
        serviceName: "Multi-Axle AC Sleeper",
        subTitle: "Yamuna & Purvanchal Expressway",
        duration: "12h 45m",
        durationHours: 12.75,
        price: 1100,
        punctualityScore: "90% On-time",
        comfortRating: 4.2,
        luggageLimit: "25 kg",
        carbonFootprint: "38 kg CO₂",
        bestFor: "Affordable direct overnight journey",
        scheduleFrequency: "12 daily departures",
      },
      {
        category: "cabs",
        serviceName: "Expressway Outstation Chauffeur",
        subTitle: "Via Agra-Lucknow & Purvanchal",
        duration: "11h 00m",
        durationHours: 11.0,
        price: 9800,
        punctualityScore: "100% Flexible",
        comfortRating: 4.6,
        luggageLimit: "Full Boot Space",
        carbonFootprint: "165 kg CO₂",
        bestFor: "Family pilgrimage with stopovers at Ayodhya & Prayagraj Sangam",
        scheduleFrequency: "24x7 Doorstep",
      },
    ],
  },
  {
    id: "blr-maa",
    fromCity: "Bengaluru",
    toCity: "Chennai",
    distanceKm: 345,
    overview: "Connecting South India's IT Capital with the Automobile hub. High-speed trains and electric buses lead this high-frequency corridor.",
    recommendedMode: "trains",
    modes: [
      {
        category: "trains",
        serviceName: "Mysuru-Chennai Vande Bharat (20608)",
        subTitle: "SBC ➔ MAS",
        duration: "4h 20m",
        durationHours: 4.33,
        price: 995,
        punctualityScore: "98% On-time",
        comfortRating: 4.8,
        luggageLimit: "40 kg",
        carbonFootprint: "14 kg CO₂",
        bestFor: "Relaxed executive travel with South Indian breakfast",
        badge: "⚡ Top Pick",
        scheduleFrequency: "8 daily intercity trains",
      },
      {
        category: "flights",
        serviceName: "IndiGo / Akasa Air",
        subTitle: "BLR ➔ MAA",
        duration: "50m (+ 2.5h Airport)",
        durationHours: 3.3,
        price: 2850,
        punctualityScore: "91% On-time",
        comfortRating: 4.5,
        luggageLimit: "15 kg Check-in",
        carbonFootprint: "68 kg CO₂",
        bestFor: "Connecting international travelers at Chennai",
        scheduleFrequency: "10 daily flights",
      },
      {
        category: "buses",
        serviceName: "NueGo 100% Electric Coach",
        subTitle: "Silent & Zero Emission",
        duration: "5h 15m",
        durationHours: 5.25,
        price: 599,
        punctualityScore: "95% On-time",
        comfortRating: 4.6,
        luggageLimit: "20 kg",
        carbonFootprint: "0 Direct tailpipe CO₂",
        bestFor: "Eco-conscious commuters & affordable luxury seats",
        badge: "🌱 Zero Emission",
        scheduleFrequency: "Departures every 30 mins",
      },
      {
        category: "cabs",
        serviceName: "Sedan / SUV Highway Drop",
        subTitle: "Via Hosur & Krishnagiri NH44",
        duration: "5h 30m",
        durationHours: 5.5,
        price: 3450,
        punctualityScore: "100% Flexible",
        comfortRating: 4.7,
        luggageLimit: "3 Bags",
        carbonFootprint: "62 kg CO₂",
        bestFor: "Direct factory/office visits in Sriperumbudur/Chennai suburbs",
        scheduleFrequency: "Instant Pickup",
      },
    ],
  },
];

export const SCRATCH_CARD_REWARDS: ScratchCardReward[] = [
  {
    id: "scratch-1",
    title: "Bharat Yatri Welcome Reward",
    code: "YATRI500",
    valueText: "₹500 Instant Discount",
    coinsEarned: 150,
    cashbackAmount: 100,
    description: "Valid on any flight or luxury resort booking above ₹3,000.",
    isScratched: false,
    expiryDate: "30 Sep 2026",
    category: "all",
  },
  {
    id: "scratch-2",
    title: "Vande Bharat Milestone Bonus",
    code: "VBCOINS",
    valueText: "300 YatraCoins Bonus",
    coinsEarned: 300,
    description: "Earned for booking Indian Railways executive tier travel.",
    isScratched: false,
    expiryDate: "15 Oct 2026",
    category: "trains",
  },
  {
    id: "scratch-3",
    title: "Free Airport Lounge Voucher",
    code: "LOUNGEFREE",
    valueText: "1x Complimentary Lounge Pass",
    coinsEarned: 50,
    description: "Valid at Delhi T3, Mumbai T2, and Bengaluru T2 Lounges.",
    isScratched: true,
    expiryDate: "31 Dec 2026",
    category: "flights",
  },
  {
    id: "scratch-4",
    title: "Highway Dhaba Meal Credit",
    code: "DHABA150",
    valueText: "₹150 Off on PNR Train Meal",
    coinsEarned: 75,
    cashbackAmount: 50,
    description: "Applicable on train seat food delivery via IRCTC e-catering partner.",
    isScratched: false,
    expiryDate: "20 Nov 2026",
    category: "dining",
  },
];

export const MULTI_TRIP_TEMPLATES: MultiTripPlanTemplate[] = [
  {
    id: "trip-kashi",
    title: "Sacred Kashi & Sarnath Complete Spiritual Journey",
    destination: "Varanasi, Uttar Pradesh",
    duration: "3 Days / 2 Nights",
    theme: "Spiritual & Cultural Immersion",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
    tag: "Most Popular Divine Plan",
    totalEstimatedPrice: 14500,
    discountedPackagePrice: 11999,
    highlights: [
      "Vande Bharat Express AC Chair Car round trip (NDLS ➔ VNS)",
      "2 Nights stay at Heritage Riverfront Ganga Haveli with breakfast",
      "Private VIP Bajra Boat for Evening Ganga Maha Aarti",
      "Kashi Vishwanath Corridor VIP Sparsh Darshan with Vedic Purohit",
      "Private AC Cab for Sarnath Buddhist Stupas & Weaver Village tour",
      "Authentic Banarasi Thali and Kashi Chaat experiences included",
    ],
    steps: [
      {
        service: "trains",
        icon: "Train",
        name: "Train: Vande Bharat Express",
        description: "New Delhi ➔ Varanasi (22436) Executive Chair Car with breakfast",
        cost: 3500,
      },
      {
        service: "hotels",
        icon: "Building2",
        name: "Stay: BrijRama Palace / Ganga Haveli",
        description: "2 Nights Deluxe Ganga River View Room with Daily Breakfast",
        cost: 6500,
      },
      {
        service: "pilgrimage",
        icon: "Landmark",
        name: "Yatra: Kashi VIP Darshan & Boat",
        description: "VIP Darshan pass, Sankalp Puja by Purohit & Private Aarti Bajra",
        cost: 2500,
      },
      {
        service: "cabs",
        icon: "Car",
        name: "Cab: 3-Day Sightseeing & Airport/Station Transfer",
        description: "Dedicated AC Sedan for Station pickup, Sarnath & Ramnagar Fort",
        cost: 2000,
      },
    ],
  },
  {
    id: "trip-jaipur",
    title: "Royal Rajputana Weekend Heritage & Forts Getaway",
    destination: "Jaipur, Rajasthan",
    duration: "2 Days / 1 Night",
    theme: "Heritage & Royal Luxury",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    tag: "Best Weekend Road Trip",
    totalEstimatedPrice: 12000,
    discountedPackagePrice: 9499,
    highlights: [
      "Roundtrip Outstation Chauffeur Cab (Delhi ➔ Jaipur ➔ Delhi)",
      "1 Night at ITC Rajputana / Alsisar Haveli with Royal Welcome Drink",
      "Guided Sunset tour at Nahargarh Fort with breathtaking city view",
      "Amber Fort VIP Elephant/Jeep entry & City Palace museum tickets",
      "Traditional Rajasthani Dal Baati Churma dining experience",
    ],
    steps: [
      {
        service: "cabs",
        icon: "Car",
        name: "Cab: Delhi-Jaipur Roundtrip Dzire/Innova",
        description: "Dedicated car for 2 days including highway tolls and state tax",
        cost: 4500,
      },
      {
        service: "resorts",
        icon: "Palmtree",
        name: "Stay: Heritage Haveli Suite",
        description: "1 Night Royal Heritage Haveli with courtyard swimming pool",
        cost: 4800,
      },
      {
        service: "dining",
        icon: "UtensilsCrossed",
        name: "Dining: Chokhi Dhani / 1135 AD Fort Dinner",
        description: "Authentic royal culinary dining spread with live folk dance",
        cost: 1700,
      },
      {
        service: "tours",
        icon: "Map",
        name: "Tour: Amber Fort & Jantar Mantar Guide",
        description: "Fast-track monument passes and govt-licensed historian guide",
        cost: 1000,
      },
    ],
  },
  {
    id: "trip-goa",
    title: "Goa Beachfront Villa & Sunset Cruise Escape",
    destination: "North & South Goa",
    duration: "4 Days / 3 Nights",
    theme: "Beach, Seafood & Sunset Cruises",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
    tag: "High Energy Holiday",
    totalEstimatedPrice: 22000,
    discountedPackagePrice: 17999,
    highlights: [
      "Return Flight Tickets (IndiGo/Akasa Air direct)",
      "3 Nights at Oceanfront Boutique Resort in Candolim/Morjim",
      "Luxury Catamaran Sunset Cruise with DJ and drinks",
      "Self-drive Thar / AC Cab for exploring Dudhsagar & Fontainhas Latin Quarter",
      "Complimentary beach shack dinner with Goan prawn curry",
    ],
    steps: [
      {
        service: "flights",
        icon: "Plane",
        name: "Flight: Direct Return Flights",
        description: "Non-stop flights with 15kg baggage included",
        cost: 7500,
      },
      {
        service: "resorts",
        icon: "Palmtree",
        name: "Resort: Beachfront Boutique Stay",
        description: "3 Nights luxury cottage with direct beach access & pool",
        cost: 9500,
      },
      {
        service: "cabs",
        icon: "Car",
        name: "Transport: 4-Day Airport Transfer & Local Cab",
        description: "Dedicated transport for beach hopping & night markets",
        cost: 3200,
      },
      {
        service: "dining",
        icon: "UtensilsCrossed",
        name: "Dining: Beach Shack & Latin Quarter Cafes",
        description: "Curated seafood dining passes and heritage cafe breakfast",
        cost: 1800,
      },
    ],
  },
];
