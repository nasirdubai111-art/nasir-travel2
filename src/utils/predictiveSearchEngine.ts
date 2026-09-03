import { ServiceCategory, CityLocation } from "../types";
import { RecentSearchItem } from "../components/SearchHistory";

export interface DestinationSuggestion {
  id: string;
  name: string;
  shortName: string;
  state: string;
  airportCode?: string;
  railwayCode?: string;
  busTerminal?: string;
  type: "spiritual" | "beach" | "heritage" | "hillstation" | "wildlife" | "weekend_getaway" | "metro";
  image: string;
  tagline: string;
  categoryHint: ServiceCategory;
  themeTags: string[];
  topAttractions: string[];
  bestSeason: string;
  startingPrice: {
    trains?: number;
    flights?: number;
    buses?: number;
    hotels?: number;
    packages?: number;
    resorts?: number;
    houseboats?: number;
    lodges?: number;
    cabs?: number;
    [key: string]: number | undefined;
  };
  connectedHubs: Record<
    string,
    {
      duration: string;
      mode: string;
      isHighSpeed?: boolean;
      routeNote?: string;
      startingFare: number;
      transportType: "flight" | "train" | "bus" | "cab" | "ferry";
    }
  >;
}

export const SEARCH_HISTORY_STORAGE_KEY = "bharatyatra_recent_searches";

export const INITIAL_DEFAULT_SEARCHES: RecentSearchItem[] = [
  {
    id: "search-1",
    query: "Delhi to Varanasi Vande Bharat Express",
    category: "trains",
    timestamp: Date.now() - 1000 * 60 * 20, // 20 mins ago
  },
  {
    id: "search-2",
    query: "Direct Flights to Goa this weekend",
    category: "flights",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
  },
  {
    id: "search-3",
    query: "Luxury Heritage Havelis in Jaipur",
    category: "hotels",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: "search-4",
    query: "Chardham Yatra 2026 Registration & Package",
    category: "pilgrimage",
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
  },
  {
    id: "search-5",
    query: "Volvo AC Sleeper Delhi to Manali",
    category: "buses",
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
  },
];

export function getStoredSearchHistory(): RecentSearchItem[] {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_DEFAULT_SEARCHES;
}

export function saveSearchToHistory(query: string, category?: ServiceCategory): RecentSearchItem[] {
  if (!query.trim()) return getStoredSearchHistory();
  try {
    const current = getStoredSearchHistory();
    const filtered = current.filter((item) => item.query.toLowerCase() !== query.trim().toLowerCase());
    const newItem: RecentSearchItem = {
      id: `search-${Date.now()}`,
      query: query.trim(),
      category: category || "flights",
      timestamp: Date.now(),
    };
    const updated = [newItem, ...filtered].slice(0, 10);
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getStoredSearchHistory();
  }
}

export function clearStoredSearchHistory(): RecentSearchItem[] {
  try {
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
  } catch {
    // ignore
  }
  return [];
}

export function removeStoredHistoryItem(id: string): RecentSearchItem[] {
  try {
    const current = getStoredSearchHistory();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export const COMPREHENSIVE_DESTINATIONS: DestinationSuggestion[] = [
  {
    id: "dest-varanasi",
    name: "Varanasi (Kashi)",
    shortName: "Varanasi",
    state: "Uttar Pradesh",
    airportCode: "VNS",
    railwayCode: "BSB",
    type: "spiritual",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    tagline: "Kashi Vishwanath Jyotirlinga & Evening Ganga Aarti",
    categoryHint: "trains",
    themeTags: ["Spiritual", "Ghats", "Vande Bharat", "Jyotirlinga"],
    topAttractions: ["Kashi Vishwanath Temple", "Dashashwamedh Ghat", "Sarnath", "Assi Ghat Aarti"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 1750, flights: 3890, hotels: 1800, packages: 6499 },
    connectedHubs: {
      "New Delhi": {
        duration: "8h 00m",
        mode: "🚆 Vande Bharat 2.0 (22436)",
        isHighSpeed: true,
        routeNote: "Fastest 130 km/h rail corridor",
        startingFare: 1750,
        transportType: "train",
      },
      Delhi: {
        duration: "8h 00m",
        mode: "🚆 Vande Bharat 2.0 (22436)",
        isHighSpeed: true,
        routeNote: "Fastest 130 km/h rail corridor",
        startingFare: 1750,
        transportType: "train",
      },
      Bengaluru: {
        duration: "2h 30m",
        mode: "✈️ IndiGo / Air India Non-stop",
        isHighSpeed: false,
        routeNote: "Direct daily flights",
        startingFare: 4999,
        transportType: "flight",
      },
      Mumbai: {
        duration: "2h 10m",
        mode: "✈️ Non-stop Flight",
        isHighSpeed: false,
        routeNote: "4 daily direct flights",
        startingFare: 4400,
        transportType: "flight",
      },
      Kolkata: {
        duration: "8h 15m",
        mode: "🚆 Vande Bharat Express",
        isHighSpeed: true,
        routeNote: "Howrah to Varanasi Express",
        startingFare: 1890,
        transportType: "train",
      },
    },
  },
  {
    id: "dest-goa",
    name: "Goa (North & South)",
    shortName: "Goa",
    state: "Goa",
    airportCode: "GOI / GOX",
    railwayCode: "MAO",
    type: "beach",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    tagline: "Sun-kissed beaches, coastal shacks & Portuguese heritage",
    categoryHint: "flights",
    themeTags: ["Beaches", "Nightlife", "Resorts", "Water Sports"],
    topAttractions: ["Baga Beach", "Dudhsagar Falls", "Old Goa Churches", "Palolem Beach", "Anjuna"],
    bestSeason: "Nov - Feb",
    startingPrice: { flights: 3499, trains: 1250, hotels: 2499, resorts: 5999, packages: 9999 },
    connectedHubs: {
      "New Delhi": {
        duration: "2h 30m",
        mode: "✈️ IndiGo / Akasa Non-stop",
        isHighSpeed: false,
        routeNote: "14 daily nonstop flights",
        startingFare: 3499,
        transportType: "flight",
      },
      Delhi: {
        duration: "2h 30m",
        mode: "✈️ IndiGo / Akasa Non-stop",
        isHighSpeed: false,
        routeNote: "14 daily nonstop flights",
        startingFare: 3499,
        transportType: "flight",
      },
      Mumbai: {
        duration: "1h 10m",
        mode: "✈️ Non-stop / 7h 45m Vande Bharat",
        isHighSpeed: true,
        routeNote: "Scenic Konkan Rail route & daily flights",
        startingFare: 1650,
        transportType: "train",
      },
      Bengaluru: {
        duration: "1h 05m",
        mode: "✈️ Daily Non-stop Flight",
        isHighSpeed: false,
        routeNote: "Over 10 daily shuttles",
        startingFare: 2399,
        transportType: "flight",
      },
      Kolkata: {
        duration: "2h 55m",
        mode: "✈️ Direct Flight",
        isHighSpeed: false,
        routeNote: "Direct winter holiday connections",
        startingFare: 5200,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-jaipur",
    name: "Jaipur (Pink City)",
    shortName: "Jaipur",
    state: "Rajasthan",
    airportCode: "JAI",
    railwayCode: "JP",
    type: "heritage",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    tagline: "Amber Fort, Hawa Mahal & Royal Heritage Havelis",
    categoryHint: "trains",
    themeTags: ["Heritage", "Forts", "Palaces", "Shopping"],
    topAttractions: ["Amber Fort", "Hawa Mahal", "City Palace", "Nahargarh Sunset Point", "Chokhi Dhani"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 880, flights: 2799, buses: 450, hotels: 1999, packages: 5999 },
    connectedHubs: {
      "New Delhi": {
        duration: "3h 45m",
        mode: "🚆 Vande Bharat Express (20978)",
        isHighSpeed: true,
        routeNote: "Fastest Delhi-Jaipur rail service",
        startingFare: 880,
        transportType: "train",
      },
      Delhi: {
        duration: "3h 45m",
        mode: "🚆 Vande Bharat Express (20978)",
        isHighSpeed: true,
        routeNote: "Fastest Delhi-Jaipur rail service",
        startingFare: 880,
        transportType: "train",
      },
      Mumbai: {
        duration: "1h 45m",
        mode: "✈️ Direct Flight",
        isHighSpeed: false,
        routeNote: "Frequent business & holiday flights",
        startingFare: 3600,
        transportType: "flight",
      },
      Bengaluru: {
        duration: "2h 35m",
        mode: "✈️ Non-stop Flight",
        isHighSpeed: false,
        routeNote: "Direct daily flights",
        startingFare: 4400,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-manali",
    name: "Manali & Solang Valley",
    shortName: "Manali",
    state: "Himachal Pradesh",
    airportCode: "KUU (Bhuntar)",
    railwayCode: "CDG (Chandigarh)",
    busTerminal: "Mall Road Private Bus Stand",
    type: "hillstation",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    tagline: "Snow peaks, Atal Tunnel, paragliding & apple orchards",
    categoryHint: "buses",
    themeTags: ["Snow", "Hill Station", "Atal Tunnel", "Adventure"],
    topAttractions: ["Solang Valley", "Atal Tunnel & Sissu", "Rohtang Pass", "Old Manali Cafes", "Hadimba Temple"],
    bestSeason: "Dec - Feb (Snow) & Apr - Jun (Pleasant)",
    startingPrice: { buses: 1399, flights: 6500, hotels: 2200, packages: 7999 },
    connectedHubs: {
      "New Delhi": {
        duration: "11h 30m",
        mode: "🚌 Volvo 9600 Multi-Axle AC Sleeper",
        isHighSpeed: false,
        routeNote: "Overnight luxury sleeper with washroom",
        startingFare: 1399,
        transportType: "bus",
      },
      Delhi: {
        duration: "11h 30m",
        mode: "🚌 Volvo 9600 Multi-Axle AC Sleeper",
        isHighSpeed: false,
        routeNote: "Overnight luxury sleeper with washroom",
        startingFare: 1399,
        transportType: "bus",
      },
      Chandigarh: {
        duration: "6h 30m",
        mode: "🚗 Outstation Cab / AC Volvo",
        isHighSpeed: false,
        routeNote: "Via 4-lane Kiratpur-Nerchowk highway",
        startingFare: 850,
        transportType: "bus",
      },
      Mumbai: {
        duration: "Flight to CHD + 6h Volvo",
        mode: "✈️ Flight + Bus combo",
        isHighSpeed: false,
        routeNote: "Via Chandigarh International Airport",
        startingFare: 4800,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-mysuru",
    name: "Mysuru (Mysore)",
    shortName: "Mysuru",
    state: "Karnataka",
    airportCode: "MYQ",
    railwayCode: "MYS",
    type: "heritage",
    image: "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=800&q=80",
    tagline: "Illuminated Mysore Palace, Chamundi Hill & Silk Heritage",
    categoryHint: "trains",
    themeTags: ["Heritage", "Palace", "Vande Bharat", "Weekend Trip"],
    topAttractions: ["Mysore Palace", "Chamundeshwari Temple", "Brindavan Gardens", "St. Philomena's Cathedral"],
    bestSeason: "Sep - Mar",
    startingPrice: { trains: 495, buses: 350, hotels: 1800, packages: 4499 },
    connectedHubs: {
      Bengaluru: {
        duration: "1h 45m",
        mode: "🚆 Vande Bharat Express (20607)",
        isHighSpeed: true,
        routeNote: "10-Lane Expressway & Vande Bharat corridor",
        startingFare: 495,
        transportType: "train",
      },
      Chennai: {
        duration: "6h 25m",
        mode: "🚆 Chennai-Mysuru Vande Bharat",
        isHighSpeed: true,
        routeNote: "Direct southern express connection",
        startingFare: 1100,
        transportType: "train",
      },
      Hyderabad: {
        duration: "1h 20m",
        mode: "✈️ Direct Alliance Air Flight",
        isHighSpeed: false,
        routeNote: "Direct regional flight",
        startingFare: 2900,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-coorg",
    name: "Coorg (Madikeri)",
    shortName: "Coorg",
    state: "Karnataka",
    airportCode: "CNN (Kannur) / BLR",
    railwayCode: "MYS (Mysuru)",
    type: "hillstation",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    tagline: "Scotland of India, misty coffee plantations & Abbey Falls",
    categoryHint: "resorts",
    themeTags: ["Coffee Estates", "Resorts", "Waterfalls", "Nature"],
    topAttractions: ["Abbey Falls", "Raja's Seat", "Dubare Elephant Camp", "Namdroling Monastery (Bylakuppe)"],
    bestSeason: "Oct - Apr",
    startingPrice: { buses: 650, resorts: 4500, hotels: 2200, packages: 6999 },
    connectedHubs: {
      Bengaluru: {
        duration: "4h 30m",
        mode: "🚗 AC Cab / KSRTC EV Coach",
        isHighSpeed: false,
        routeNote: "Scenic drive via Mysore expressway",
        startingFare: 650,
        transportType: "bus",
      },
      Mysuru: {
        duration: "2h 30m",
        mode: "🚗 Outstation Cab / Express Bus",
        isHighSpeed: false,
        routeNote: "Direct Ghat road connection",
        startingFare: 350,
        transportType: "bus",
      },
      Kochi: {
        duration: "6h 00m",
        mode: "🚗 Cab / Bus",
        isHighSpeed: false,
        routeNote: "Through Wayanad coffee trails",
        startingFare: 1200,
        transportType: "bus",
      },
    },
  },
  {
    id: "dest-ayodhya",
    name: "Ayodhya (Ram Janmabhoomi)",
    shortName: "Ayodhya",
    state: "Uttar Pradesh",
    airportCode: "AYJ",
    railwayCode: "AY / AYC",
    type: "spiritual",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    tagline: "Grand Shri Ram Janmabhoomi Mandir, Saryu Aarti & Hanumangarhi",
    categoryHint: "pilgrimage",
    themeTags: ["Spiritual", "Ram Mandir", "Vande Bharat", "Ghats"],
    topAttractions: ["Shri Ram Janmabhoomi Mandir", "Hanuman Garhi", "Kanak Bhawan", "Saryu River Ghat Aarti"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 1570, flights: 3800, hotels: 1900, packages: 5499 },
    connectedHubs: {
      "New Delhi": {
        duration: "8h 15m",
        mode: "🚆 Vande Bharat Express (22426)",
        isHighSpeed: true,
        routeNote: "Direct Vande Bharat & daily nonstop flights",
        startingFare: 1570,
        transportType: "train",
      },
      Delhi: {
        duration: "8h 15m",
        mode: "🚆 Vande Bharat Express (22426)",
        isHighSpeed: true,
        routeNote: "Direct Vande Bharat & daily nonstop flights",
        startingFare: 1570,
        transportType: "train",
      },
      Mumbai: {
        duration: "2h 10m",
        mode: "✈️ IndiGo / Air India Non-stop",
        isHighSpeed: false,
        routeNote: "Direct Maharishi Valmiki Airport flights",
        startingFare: 4200,
        transportType: "flight",
      },
      Bengaluru: {
        duration: "2h 45m",
        mode: "✈️ Direct Flight",
        isHighSpeed: false,
        routeNote: "Direct flight connectivity",
        startingFare: 4900,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-rishikesh",
    name: "Rishikesh & Haridwar",
    shortName: "Rishikesh",
    state: "Uttarakhand",
    airportCode: "DED (Dehradun)",
    railwayCode: "RKSH / HW",
    type: "weekend_getaway",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tagline: "Yoga capital of the world, Ganga river rafting & Triveni Ghat",
    categoryHint: "tours",
    themeTags: ["Yoga", "Rafting", "Spiritual", "Adventure"],
    topAttractions: ["Triveni Ghat Aarti", "Ram Jhula & Laxman Jhula", "White Water Rafting (Shivpuri)", "Beatles Ashram"],
    bestSeason: "Sep - Nov & Feb - May",
    startingPrice: { trains: 720, buses: 499, hotels: 1600, packages: 4999 },
    connectedHubs: {
      "New Delhi": {
        duration: "3h 30m",
        mode: "🚆 Vande Bharat to Haridwar / Dehradun",
        isHighSpeed: true,
        routeNote: "Expressway cab or Vande Bharat train",
        startingFare: 720,
        transportType: "train",
      },
      Delhi: {
        duration: "3h 30m",
        mode: "🚆 Vande Bharat to Haridwar / Dehradun",
        isHighSpeed: true,
        routeNote: "Expressway cab or Vande Bharat train",
        startingFare: 720,
        transportType: "train",
      },
      Chandigarh: {
        duration: "4h 00m",
        mode: "🚗 Direct Highway Cab",
        isHighSpeed: false,
        routeNote: "Via Ponta Sahib / Roorkee",
        startingFare: 650,
        transportType: "cab",
      },
      Mumbai: {
        duration: "2h 05m",
        mode: "✈️ Flight to Dehradun (Jolly Grant)",
        isHighSpeed: false,
        routeNote: "Direct flights to DED airport",
        startingFare: 4300,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-srinagar",
    name: "Srinagar & Gulmarg",
    shortName: "Srinagar",
    state: "Jammu & Kashmir",
    airportCode: "SXR",
    railwayCode: "JAT / SVDK",
    type: "hillstation",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
    tagline: "Dal Lake Shikara rides, Mughal Gardens & Gulmarg Gondola",
    categoryHint: "flights",
    themeTags: ["Snow", "Dal Lake", "Honeymoon", "Gondola"],
    topAttractions: ["Dal Lake Houseboats", "Gulmarg Gondola Ride", "Pahalgam Betaab Valley", "Shankaracharya Hill"],
    bestSeason: "Dec - Mar (Snow) & Apr - Oct (Lush)",
    startingPrice: { flights: 4200, hotels: 2800, houseboats: 4200, packages: 12999 },
    connectedHubs: {
      "New Delhi": {
        duration: "1h 25m",
        mode: "✈️ Direct Non-stop Flight",
        isHighSpeed: false,
        routeNote: "16 daily nonstop flights",
        startingFare: 4200,
        transportType: "flight",
      },
      Delhi: {
        duration: "1h 25m",
        mode: "✈️ Direct Non-stop Flight",
        isHighSpeed: false,
        routeNote: "16 daily nonstop flights",
        startingFare: 4200,
        transportType: "flight",
      },
      Mumbai: {
        duration: "2h 45m",
        mode: "✈️ Direct Flight",
        isHighSpeed: false,
        routeNote: "Direct flights to Srinagar",
        startingFare: 5900,
        transportType: "flight",
      },
      Bengaluru: {
        duration: "3h 25m",
        mode: "✈️ 1-Stop / Direct Flight",
        isHighSpeed: false,
        routeNote: "Daily air connections",
        startingFare: 6700,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-puri",
    name: "Puri & Jagannath Dham",
    shortName: "Puri",
    state: "Odisha",
    airportCode: "BBI (Bhubaneswar)",
    railwayCode: "PURI",
    type: "spiritual",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    tagline: "Sacred Jagannath Temple, Golden Beach & Konark Sun Temple",
    categoryHint: "trains",
    themeTags: ["Jagannath Dham", "Golden Beach", "Vande Bharat", "Konark"],
    topAttractions: ["Shri Jagannath Temple", "Puri Golden Beach", "Konark Sun Temple", "Chilika Lake Dolphins"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 1265, flights: 3800, hotels: 1700, packages: 5999 },
    connectedHubs: {
      Kolkata: {
        duration: "6h 25m",
        mode: "🚆 Howrah-Puri Vande Bharat (22895)",
        isHighSpeed: true,
        routeNote: "High speed direct coastal rail express",
        startingFare: 1265,
        transportType: "train",
      },
      "New Delhi": {
        duration: "2h 00m (Flight to BBI) + 1h Cab",
        mode: "✈️ Flight + Highway Cab",
        isHighSpeed: false,
        routeNote: "Direct flights to Bhubaneswar + expressway cab",
        startingFare: 4100,
        transportType: "flight",
      },
      Delhi: {
        duration: "2h 00m (Flight to BBI) + 1h Cab",
        mode: "✈️ Flight + Highway Cab",
        isHighSpeed: false,
        routeNote: "Direct flights to Bhubaneswar + expressway cab",
        startingFare: 4100,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-shirdi",
    name: "Shirdi (Sai Baba Sansthan)",
    shortName: "Shirdi",
    state: "Maharashtra",
    airportCode: "SAG",
    railwayCode: "SNSI",
    type: "spiritual",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    tagline: "Sai Baba Samadhi Mandir, Dwarkamai & Shani Shingnapur",
    categoryHint: "trains",
    themeTags: ["Sai Baba", "VIP Darshan", "Vande Bharat", "Spiritual"],
    topAttractions: ["Sai Baba Samadhi Mandir", "Dwarkamai", "Gurusthan", "Shani Shingnapur"],
    bestSeason: "Year Round",
    startingPrice: { trains: 975, flights: 3200, buses: 450, hotels: 1500, packages: 4299 },
    connectedHubs: {
      Mumbai: {
        duration: "3h 00m",
        mode: "🚆 Mumbai CSMT-Shirdi Vande Bharat (22223)",
        isHighSpeed: true,
        routeNote: "Direct high-speed Thal Ghat route",
        startingFare: 975,
        transportType: "train",
      },
      Pune: {
        duration: "4h 00m",
        mode: "🚗 Outstation Cab / AC Bus",
        isHighSpeed: false,
        routeNote: "Via Ahmednagar highway",
        startingFare: 550,
        transportType: "bus",
      },
      "New Delhi": {
        duration: "1h 50m",
        mode: "✈️ Direct SpiceJet / IndiGo Flight",
        isHighSpeed: false,
        routeNote: "Direct flight to Shirdi Airport (SAG)",
        startingFare: 3600,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-hampi",
    name: "Hampi & Vijayanagara Ruins",
    shortName: "Hampi",
    state: "Karnataka",
    airportCode: "VDY (Jindal Vijayanagar) / BLR",
    railwayCode: "HPT (Hosapete)",
    type: "heritage",
    image: "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=800&q=80",
    tagline: "UNESCO Stone Chariot, Virupaksha Temple & Tungabhadra Boulders",
    categoryHint: "trains",
    themeTags: ["UNESCO Ruins", "Heritage", "Boulders", "History"],
    topAttractions: ["Stone Chariot & Vittala Temple", "Virupaksha Temple", "Matanga Hill Sunrise", "Lotus Mahal"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 550, buses: 600, hotels: 1800, packages: 5999 },
    connectedHubs: {
      Bengaluru: {
        duration: "7h 15m",
        mode: "🚆 Hampi Express / KSRTC Sleeper",
        isHighSpeed: false,
        routeNote: "Overnight comfortable train directly to Hosapete",
        startingFare: 550,
        transportType: "train",
      },
      Goa: {
        duration: "6h 30m",
        mode: "🚆 Amaravathi Express / Cab",
        isHighSpeed: false,
        routeNote: "Direct Konkan to Deccan line",
        startingFare: 420,
        transportType: "train",
      },
      Hyderabad: {
        duration: "7h 00m",
        mode: "🚆 Train / Volvo Bus",
        isHighSpeed: false,
        routeNote: "Direct overnight sleeper bus",
        startingFare: 650,
        transportType: "bus",
      },
    },
  },
  {
    id: "dest-amritsar",
    name: "Amritsar (Golden Temple)",
    shortName: "Amritsar",
    state: "Punjab",
    airportCode: "ATQ",
    railwayCode: "ASR",
    type: "spiritual",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    tagline: "Harmandir Sahib Golden Temple, Wagah Border & Punjabi Kulcha",
    categoryHint: "trains",
    themeTags: ["Golden Temple", "Wagah Border", "Vande Bharat", "Food Trail"],
    topAttractions: ["Golden Temple (Harmandir Sahib)", "Attari-Wagah Border Ceremony", "Jallianwala Bagh", "Gobindgarh Fort"],
    bestSeason: "Oct - Mar",
    startingPrice: { trains: 1350, flights: 3100, hotels: 1800, packages: 4999 },
    connectedHubs: {
      "New Delhi": {
        duration: "5h 25m",
        mode: "🚆 Vande Bharat Express (22487)",
        isHighSpeed: true,
        routeNote: "Fastest Delhi-Amritsar rail corridor",
        startingFare: 1350,
        transportType: "train",
      },
      Delhi: {
        duration: "5h 25m",
        mode: "🚆 Vande Bharat Express (22487)",
        isHighSpeed: true,
        routeNote: "Fastest Delhi-Amritsar rail corridor",
        startingFare: 1350,
        transportType: "train",
      },
      Mumbai: {
        duration: "2h 30m",
        mode: "✈️ Non-stop Flight",
        isHighSpeed: false,
        routeNote: "Direct flights to Sri Guru Ram Dass Jee Airport",
        startingFare: 4400,
        transportType: "flight",
      },
    },
  },
  {
    id: "dest-udaipur",
    name: "Udaipur (City of Lakes)",
    shortName: "Udaipur",
    state: "Rajasthan",
    airportCode: "UDR",
    railwayCode: "UDZ",
    type: "heritage",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    tagline: "Lake Pichola boat cruises, City Palace & Royal Taj Lake Palace",
    categoryHint: "resorts",
    themeTags: ["Lakes", "Royal Palaces", "Resorts", "Romantic"],
    topAttractions: ["City Palace", "Lake Pichola Boat Cruise", "Jagmandir Island", "Saheliyon Ki Bari"],
    bestSeason: "Oct - Mar",
    startingPrice: { flights: 3100, trains: 950, resorts: 5500, packages: 8999 },
    connectedHubs: {
      Mumbai: {
        duration: "1h 20m",
        mode: "✈️ Non-stop Flight",
        isHighSpeed: false,
        routeNote: "Direct flights to Maharana Pratap Airport",
        startingFare: 3200,
        transportType: "flight",
      },
      "New Delhi": {
        duration: "1h 15m",
        mode: "✈️ Non-stop Flight / 11h Chetak Exp",
        isHighSpeed: false,
        routeNote: "Daily flights & overnight express trains",
        startingFare: 3100,
        transportType: "flight",
      },
      Delhi: {
        duration: "1h 15m",
        mode: "✈️ Non-stop Flight / 11h Chetak Exp",
        isHighSpeed: false,
        routeNote: "Daily flights & overnight express trains",
        startingFare: 3100,
        transportType: "flight",
      },
      Jaipur: {
        duration: "5h 30m",
        mode: "🚆 Vande Bharat / Highway Cab",
        isHighSpeed: true,
        routeNote: "Jaipur-Udaipur Vande Bharat corridor",
        startingFare: 850,
        transportType: "train",
      },
    },
  },
];

export interface PredictiveSearchResult {
  historySuggestions: {
    item: RecentSearchItem;
    destination?: DestinationSuggestion;
  }[];
  currentCityRecommendations: {
    destination: DestinationSuggestion;
    hubConnection: {
      duration: string;
      mode: string;
      isHighSpeed?: boolean;
      routeNote?: string;
      startingFare: number;
      transportType: "flight" | "train" | "bus" | "cab" | "ferry";
    };
  }[];
  queryMatches: {
    destination: DestinationSuggestion;
    matchedField: string;
    hubConnection?: {
      duration: string;
      mode: string;
      isHighSpeed?: boolean;
      routeNote?: string;
      startingFare: number;
    };
  }[];
  popularTrending: DestinationSuggestion[];
}

/**
 * Predicts and filters suggestions based on:
 * 1. User's active input query (fuzzy prefix/substring match across name, state, airport, railway code, attractions)
 * 2. User's current city (direct hub connections, Vande Bharat corridors, short travel times)
 * 3. User's previous search history (recent searches with matching keywords or past queries)
 * 4. Active category context
 */
export function getPredictiveSuggestions(
  query: string,
  currentCityName: string,
  recentSearches: RecentSearchItem[] = [],
  activeCategory?: ServiceCategory
): PredictiveSearchResult {
  const cleanQuery = query.trim().toLowerCase();
  const cleanCity = currentCityName.trim();

  // Normalize city name for hub lookup (e.g., "New Delhi", "Delhi", "Bengaluru", "Bangalore", "Mumbai", "Kolkata")
  const cityKey = Object.keys(COMPREHENSIVE_DESTINATIONS[0].connectedHubs).find(
    (h) => cleanCity.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(cleanCity.toLowerCase())
  ) || "New Delhi";

  // 1. Process Search History Matches
  const historySuggestions: { item: RecentSearchItem; destination?: DestinationSuggestion }[] = [];
  const seenQueryStrings = new Set<string>();

  recentSearches.forEach((item) => {
    if (seenQueryStrings.has(item.query.toLowerCase())) return;
    seenQueryStrings.add(item.query.toLowerCase());

    const isMatch =
      !cleanQuery ||
      item.query.toLowerCase().includes(cleanQuery) ||
      (item.category && item.category.toLowerCase().includes(cleanQuery));

    if (isMatch) {
      // Find matching destination if any
      const matchingDest = COMPREHENSIVE_DESTINATIONS.find(
        (d) =>
          item.query.toLowerCase().includes(d.shortName.toLowerCase()) ||
          item.query.toLowerCase().includes(d.name.toLowerCase()) ||
          (d.airportCode && item.query.toUpperCase().includes(d.airportCode))
      );

      historySuggestions.push({
        item,
        destination: matchingDest,
      });
    }
  });

  // 2. Process Current City Connected Recommendations (Direct fastest connections & Vande Bharat routes)
  const currentCityRecommendations: {
    destination: DestinationSuggestion;
    hubConnection: {
      duration: string;
      mode: string;
      isHighSpeed?: boolean;
      routeNote?: string;
      startingFare: number;
      transportType: "flight" | "train" | "bus" | "cab" | "ferry";
    };
  }[] = [];

  COMPREHENSIVE_DESTINATIONS.forEach((dest) => {
    // Exclude if destination IS the current city
    if (dest.name.toLowerCase().includes(cleanCity.toLowerCase())) return;

    // Check if connected from current city
    const connection =
      dest.connectedHubs[cityKey] ||
      dest.connectedHubs["New Delhi"] ||
      dest.connectedHubs[Object.keys(dest.connectedHubs)[0]];

    if (connection) {
      // If user typed a query, filter it as well
      const matchesQuery =
        !cleanQuery ||
        dest.name.toLowerCase().includes(cleanQuery) ||
        dest.state.toLowerCase().includes(cleanQuery) ||
        dest.themeTags.some((t) => t.toLowerCase().includes(cleanQuery));

      if (matchesQuery) {
        currentCityRecommendations.push({
          destination: dest,
          hubConnection: connection,
        });
      }
    }
  });

  // Sort city recommendations: High speed / Vande Bharat / Direct first, then by fare
  currentCityRecommendations.sort((a, b) => {
    if (a.hubConnection.isHighSpeed && !b.hubConnection.isHighSpeed) return -1;
    if (!a.hubConnection.isHighSpeed && b.hubConnection.isHighSpeed) return 1;
    return a.hubConnection.startingFare - b.hubConnection.startingFare;
  });

  // 3. Process Live Query Matches across all fields
  const queryMatches: {
    destination: DestinationSuggestion;
    matchedField: string;
    hubConnection?: {
      duration: string;
      mode: string;
      isHighSpeed?: boolean;
      routeNote?: string;
      startingFare: number;
    };
  }[] = [];

  if (cleanQuery) {
    COMPREHENSIVE_DESTINATIONS.forEach((dest) => {
      let matchedField = "";

      if (dest.name.toLowerCase().startsWith(cleanQuery)) {
        matchedField = "Destination Name";
      } else if (dest.name.toLowerCase().includes(cleanQuery)) {
        matchedField = "Name Match";
      } else if (dest.state.toLowerCase().includes(cleanQuery)) {
        matchedField = `State: ${dest.state}`;
      } else if (dest.airportCode && dest.airportCode.toLowerCase().includes(cleanQuery)) {
        matchedField = `Airport: ${dest.airportCode}`;
      } else if (dest.railwayCode && dest.railwayCode.toLowerCase().includes(cleanQuery)) {
        matchedField = `Station Code: ${dest.railwayCode}`;
      } else if (dest.themeTags.some((t) => t.toLowerCase().includes(cleanQuery))) {
        matchedField = `Theme Tag: ${dest.themeTags.find((t) => t.toLowerCase().includes(cleanQuery))}`;
      } else if (dest.topAttractions.some((a) => a.toLowerCase().includes(cleanQuery))) {
        matchedField = `Attraction: ${dest.topAttractions.find((a) => a.toLowerCase().includes(cleanQuery))}`;
      }

      if (matchedField) {
        const connection = dest.connectedHubs[cityKey] || dest.connectedHubs["New Delhi"];
        queryMatches.push({
          destination: dest,
          matchedField,
          hubConnection: connection,
        });
      }
    });
  }

  // 4. Popular & Trending Destinations
  const popularTrending = COMPREHENSIVE_DESTINATIONS.slice(0, 6);

  return {
    historySuggestions: historySuggestions.slice(0, 4),
    currentCityRecommendations: currentCityRecommendations.slice(0, 6),
    queryMatches: queryMatches.slice(0, 8),
    popularTrending,
  };
}
