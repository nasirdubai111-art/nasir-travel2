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
