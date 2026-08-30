import { ServiceCategory } from "../types";

export interface ExploreCategoryItem {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  icon: string;
  tagline: string;
  description: string;
  coverImage: string;
  destinationsCount: number;
  popularSpots: string[];
  bestSeasons: string;
  highlightTag: string;
  featuredDestinations: string[];
}

export interface ThingToDoItem {
  id: string;
  title: string;
  destination: string;
  state: string;
  category:
    | "Attractions"
    | "Activities"
    | "Adventure activities"
    | "Sightseeing"
    | "Museums"
    | "Parks"
    | "Wildlife"
    | "Water activities"
    | "Religious visits"
    | "Cultural experiences"
    | "Local experiences"
    | "Nightlife"
    | "Shopping"
    | "Food experiences";
  duration: string;
  pricePerPerson: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  difficulty?: "Easy" | "Moderate" | "Challenging";
  timing?: string;
  included: string[];
}

export interface TourPackageItem {
  id: string;
  title: string;
  destination: string;
  statesCovered: string[];
  type:
    | "Domestic tour packages"
    | "Weekend packages"
    | "Family packages"
    | "Honeymoon packages"
    | "Pilgrimage packages"
    | "Group tours"
    | "Corporate tours"
    | "Custom tours"
    | "Budget packages"
    | "Premium packages"
    | "Multi-city tours";
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  highlights: string[];
  inclusions: string[];
  itinerary: { day: number; title: string; desc: string }[];
  isTrending?: boolean;
}

export interface StayAccommodationItem {
  id: string;
  name: string;
  destination: string;
  state: string;
  type:
    | "Hotels"
    | "Resorts"
    | "Lodges"
    | "Homestays"
    | "Villas"
    | "Hostels"
    | "Houseboats"
    | "Pilgrimage accommodation"
    | "Budget stays"
    | "Luxury stays";
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  image: string;
  amenities: string[];
  distanceFromCenter: string;
  cancellationPolicy: string;
  badge?: string;
}

export interface CuratedCollectionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  category:
    | "Top 10 destinations"
    | "Best places for couples"
    | "Best family destinations"
    | "Best monsoon destinations"
    | "Best summer destinations"
    | "Best winter destinations"
    | "₹5,000 weekend trips"
    | "Luxury escapes"
    | "Spiritual journeys"
    | "Adventure trips"
    | "Road trips"
    | "1-day / 2-day / 3-day trips";
  coverImage: string;
  destinationIds: string[];
  startingPrice: number;
  idealFor: string;
}

export interface TravelAlertItem {
  id: string;
  title: string;
  category:
    | "Weather alerts"
    | "Destination alerts"
    | "Transport alerts"
    | "Route alerts"
    | "Flight alerts"
    | "Train alerts"
    | "Bus alerts"
    | "Hotel availability alerts"
    | "Government/travel advisories"
    | "Emergency notifications";
  severity: "info" | "warning" | "critical";
  affectedRegion: string;
  description: string;
  timestamp: string;
  actionRequired?: string;
  source: string;
  isActive: boolean;
}

export interface DetailedDestination {
  id: string;
  slug: string;
  name: string;
  state: string;
  tagline: string;
  category: string;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  gallery: string[];
  tags: ("Popular" | "Trending" | "New" | "Hidden gems" | "Weekend" | "Nearby" | "Seasonal")[];
  overview: string;
  bestTimeToVisit: string;
  idealDuration: string;
  nearestAirport: string;
  nearestRailway: string;
  weather: {
    temp: string;
    condition: string;
    humidity: string;
  };
  placesToVisit: { name: string; desc: string; img: string }[];
  thingsToDo: string[];
  foodSpecialties: string[];
  travelTips: string[];
  nearbyDestinations: { name: string; dist: string }[];
  faq: { q: string; a: string }[];
  packagePrice: number;
}

// ----------------------------------------------------
// 15 TRAVEL CATEGORIES
// ----------------------------------------------------
export const EXPLORE_CATEGORIES_CATALOG: ExploreCategoryItem[] = [
  {
    id: "CAT-HILL",
    slug: "explore/hill-stations",
    name: "Hill Stations",
    hindiName: "पर्वतीय स्थल",
    icon: "Mountain",
    tagline: "Misty peaks, pine forests & panoramic valley views",
    description: "Escape the plains into the serene Himalayan ridges, Nilgiri hills, and Western Ghats sanctuaries.",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 42,
    popularSpots: ["Manali", "Ooty", "Munnar", "Darjeeling", "Shimla", "Mussoorie"],
    bestSeasons: "March - June & October - February (Snow)",
    highlightTag: "Popular in Summer",
    featuredDestinations: ["DEST-MANALI", "DEST-MUNNAR", "DEST-OOTY", "DEST-SHIMLA"],
  },
  {
    id: "CAT-BEACH",
    slug: "explore/beaches",
    name: "🏖️ Beaches & Coastal",
    hindiName: "समुद्र तट",
    icon: "Palmtree",
    tagline: "Golden sands, azure waves & vibrant coastal sunsets",
    description: "From Goa's vibrant shacks to Gokarna's tranquil coves and Andaman's pristine coral shores.",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 38,
    popularSpots: ["North Goa", "South Goa", "Gokarna", "Havelock Island", "Varkala", "Puri"],
    bestSeasons: "October - March",
    highlightTag: "Trending for Winter",
    featuredDestinations: ["DEST-GOA", "DEST-ANDAMAN", "DEST-GOKARNA", "DEST-VARKALA"],
  },
  {
    id: "CAT-HERITAGE",
    slug: "explore/heritage",
    name: "🏛️ Heritage & Historical Places",
    hindiName: "ऐतिहासिक धरोहर",
    icon: "Landmark",
    tagline: "Centuries of royal dynasties, majestic forts & stone artistry",
    description: "Explore UNESCO world heritage sites, Mughal splendors, Dravidian temples, and Rajput fortresses.",
    coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 65,
    popularSpots: ["Jaipur", "Agra", "Hampi", "Udaipur", "Khajuraho", "Mysore"],
    bestSeasons: "October - March",
    highlightTag: "UNESCO Circuits",
    featuredDestinations: ["DEST-JAIPUR", "DEST-HAMPI", "DEST-AGRA", "DEST-UDAIPUR"],
  },
  {
    id: "CAT-PILGRIM",
    slug: "explore/pilgrimage",
    name: "🛕 Pilgrimage & Spiritual",
    hindiName: "तीर्थ यात्रा व आध्यात्म",
    icon: "Sparkles",
    tagline: "Sacred dhams, divine river ghats & eternal Jyotirlingas",
    description: "Embark on transformative journeys to Chardham, Kashi, Tirupati, Vaishno Devi, and Golden Temple.",
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 88,
    popularSpots: ["Varanasi", "Kedarnath", "Tirupati", "Amritsar", "Rameshwaram", "Ayodhya"],
    bestSeasons: "Year Round (May-Oct for Himalayan Dhams)",
    highlightTag: "Direct VIP Darshan",
    featuredDestinations: ["DEST-VARANASI", "DEST-KEDARNATH", "DEST-TIRUPATI", "DEST-AMRITSAR"],
  },
  {
    id: "CAT-WILDLIFE",
    slug: "explore/wildlife",
    name: "🌿 Nature & Wildlife",
    hindiName: "वन्यजीव व प्रकृति",
    icon: "Trees",
    tagline: "Royal Bengal tigers, one-horned rhinos & lush biospheres",
    description: "Deep jungle safaris in Jim Corbett, Ranthambore, Kaziranga, and Bandhavgarh national parks.",
    coverImage: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 29,
    popularSpots: ["Jim Corbett", "Ranthambore", "Kaziranga", "Bandhavgarh", "Periyar"],
    bestSeasons: "November - May (Peak tiger sighting)",
    highlightTag: "Jeep Safari Open",
    featuredDestinations: ["DEST-CORBETT", "DEST-RANTHAMBORE", "DEST-KAZIRANGA"],
  },
  {
    id: "CAT-ADVENTURE",
    slug: "explore/adventure",
    name: "🏕️ Adventure & Trekking",
    hindiName: "साहसिक यात्रा",
    icon: "Compass",
    tagline: "High-altitude passes, white-water rapids & cliff zip-lining",
    description: "Get adrenaline surges in Rishikesh rafting, Bir Billing paragliding, and Chadar Frozen River treks.",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 34,
    popularSpots: ["Rishikesh", "Leh Ladakh", "Bir Billing", "Manali", "Spiti Valley"],
    bestSeasons: "April - June & Sept - Nov",
    highlightTag: "Adrenaline Rush",
    featuredDestinations: ["DEST-RISHIKESH", "DEST-LEH", "DEST-SPITI"],
  },
  {
    id: "CAT-CITY",
    slug: "explore/city-breaks",
    name: "🏙️ City Breaks",
    hindiName: "शहरी सैर",
    icon: "Building2",
    tagline: "Vibrant skylines, metropolitan culture & heritage walks",
    description: "Explore Delhi's food lanes, Mumbai's seaside promenades, and Bengaluru's gardens & breweries.",
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 22,
    popularSpots: ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Hyderabad"],
    bestSeasons: "October - March",
    highlightTag: "Weekend Getaways",
    featuredDestinations: ["DEST-DELHI", "DEST-MUMBAI", "DEST-BANGALORE"],
  },
  {
    id: "CAT-ISLAND",
    slug: "explore/islands",
    name: "🏝️ Islands & Coastal Escapes",
    hindiName: "द्वीप समूह",
    icon: "Sun",
    tagline: "Bioluminescent beaches, coral reefs & turquoise lagoons",
    description: "Discover Andaman & Nicobar archipelago and Lakshadweep's pristine scuba atolls.",
    coverImage: "https://images.unsplash.com/photo-1589136777351-fdc9c9cab193?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 16,
    popularSpots: ["Havelock Island", "Neil Island", "Agatti Island", "Minicoy", "Port Blair"],
    bestSeasons: "October - May",
    highlightTag: "Scuba Diving Hub",
    featuredDestinations: ["DEST-ANDAMAN", "DEST-LAKSHADWEEP"],
  },
  {
    id: "CAT-HOUSEBOAT",
    slug: "explore/houseboats",
    name: "🚤 Houseboats & Backwaters",
    hindiName: "शिकारा व हाउसबोट",
    icon: "Ship",
    tagline: "Gliding through emerald lagoons, palm canopies & lakes",
    description: "Traditional Kettuvallam cruises in Alleppey, Kumarakom, and Dal Lake Shikaras in Srinagar.",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 12,
    popularSpots: ["Alleppey", "Kumarakom", "Srinagar Dal Lake", "Nigeen Lake"],
    bestSeasons: "September - March",
    highlightTag: "Private Chef Onboard",
    featuredDestinations: ["DEST-ALLEPPEY", "DEST-SRINAGAR"],
  },
  {
    id: "CAT-FOOD",
    slug: "explore/food-culinary",
    name: "🍛 Food & Culinary",
    hindiName: "स्वाद व व्यंजन यात्रा",
    icon: "Utensils",
    tagline: "Royal Awadhi biryanis, coastal curries & street delicacies",
    description: "Savor Lucknowi kebabs, Chettinad spices, Amritsari kulchas, and Banarasi street chaats.",
    coverImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 28,
    popularSpots: ["Lucknow", "Amritsar", "Old Delhi", "Hyderabad", "Kolkata", "Madurai"],
    bestSeasons: "Year Round",
    highlightTag: "Curated Food Walks",
    featuredDestinations: ["DEST-LUCKNOW", "DEST-AMRITSAR", "DEST-DELHI"],
  },
  {
    id: "CAT-WELLNESS",
    slug: "explore/wellness",
    name: "🧘 Wellness & Retreats",
    hindiName: "योग, आयुर्वेद व शांति",
    icon: "HeartHandshake",
    tagline: "Authentic Panchakarma, Himalayan yoga ashrams & natural healing",
    description: "Revitalize body and soul in Rishikesh yoga centers, Gokarna wellness spas, and Kerala Ayurveda resorts.",
    coverImage: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 24,
    popularSpots: ["Rishikesh", "Kovalam", "Gokarna", "Varkala", "Dharamshala"],
    bestSeasons: "Year Round (Monsoon ideal for Ayurveda)",
    highlightTag: "Ayush Certified",
    featuredDestinations: ["DEST-RISHIKESH", "DEST-KOVALAM", "DEST-DHARAMSHALA"],
  },
  {
    id: "CAT-FAMILY",
    slug: "explore/family",
    name: "👨‍👩‍👧 Family Travel",
    hindiName: "पारिवारिक छुट्टियां",
    icon: "Users",
    tagline: "Comfortable resorts, amusement hubs & shared memories",
    description: "Wholesome holiday itineraries with multi-generational accessibility, private cabs, and verified resorts.",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 45,
    popularSpots: ["Ooty", "Jaipur", "Goa", "Munnar", "Shimla", "Mahabaleshwar"],
    bestSeasons: "Year Round",
    highlightTag: "Child & Elder Friendly",
    featuredDestinations: ["DEST-OOTY", "DEST-JAIPUR", "DEST-GOA"],
  },
  {
    id: "CAT-HONEYMOON",
    slug: "explore/honeymoon",
    name: "💑 Honeymoon & Romance",
    hindiName: "हनीमून व रोमांटिक स्थल",
    icon: "Heart",
    tagline: "Candlelit seaside dinners, snow cabins & private pools",
    description: "Curated romantic hideaways in Udaipur Lake Palace, Kashmir houseboats, and Andaman private villas.",
    coverImage: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 30,
    popularSpots: ["Udaipur", "Gulmarg", "Andaman", "Munnar", "Manali", "Coorg"],
    bestSeasons: "October - April",
    highlightTag: "Complimentary Cake & Decor",
    featuredDestinations: ["DEST-UDAIPUR", "DEST-GULMARG", "DEST-ANDAMAN"],
  },
  {
    id: "CAT-BACKPACK",
    slug: "explore/backpacking",
    name: "🎒 Backpacking & Solo",
    hindiName: "बैकपैकिंग व सोलो यात्रा",
    icon: "Backpack",
    tagline: "Hostel dorms, scenic mountain trails & budget connectivity",
    description: "Budget-friendly travel hubs with vibrant traveler communities in Zostel, nomadic cafes, and scooter rentals.",
    coverImage: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 36,
    popularSpots: ["Kasol", "Pushkar", "Hampi", "Varkala", "McLeod Ganj", "Gokarna"],
    bestSeasons: "September - May",
    highlightTag: "₹800/Night Stays",
    featuredDestinations: ["DEST-KASOL", "DEST-HAMPI", "DEST-GOKARNA"],
  },
  {
    id: "CAT-SHOPPING",
    slug: "explore/shopping",
    name: "🛍️ Shopping & Handicrafts",
    hindiName: "शॉपिंग व हस्तशिल्प",
    icon: "ShoppingBag",
    tagline: "Authentic silks, pashminas, brassware & spice markets",
    description: "Explore the bustling bazaars of Jaipur, Varanasi silk lanes, Kashmir carpet guilds, and Kochi spice alleys.",
    coverImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
    destinationsCount: 25,
    popularSpots: ["Jaipur", "Varanasi", "Srinagar", "Kochi", "Surat", "Kanchipuram"],
    bestSeasons: "Year Round",
    highlightTag: "GI-Tagged Crafts",
    featuredDestinations: ["DEST-JAIPUR", "DEST-VARANASI", "DEST-SRINAGAR"],
  },
];

// ----------------------------------------------------
// FULL DESTINATIONS CATALOG
// ----------------------------------------------------
export const FULL_DESTINATIONS_CATALOG: DetailedDestination[] = [
  {
    id: "DEST-GOA",
    slug: "travel/goa",
    name: "Goa (Sun, Sand & Heritage)",
    state: "Goa",
    tagline: "Tropical coastline, Portuguese colonial charm & vibrant beach life",
    category: "🏖️ Beaches & Coastal",
    rating: 4.9,
    reviewsCount: 24500,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Popular", "Trending", "Weekend", "Seasonal"],
    overview:
      "Goa is India's premier beach state, offering a seamless blend of Portuguese heritage, golden palm-fringed coastlines, electrifying sunsets at Vagator & Anjuna, and serene colonial backwaters in South Goa.",
    bestTimeToVisit: "November to February for beach festivals; July to September for lush green monsoon waterfalls.",
    idealDuration: "4 Days / 3 Nights",
    nearestAirport: "Manohar Int'l Airport (GOX, Mopa) / Dabolim (GOI)",
    nearestRailway: "Madgaon Junction (MAO) / Thivim (THVM)",
    weather: {
      temp: "29°C",
      condition: "Sunny Breeze",
      humidity: "68%",
    },
    placesToVisit: [
      { name: "Aguada Fort & Lighthouse", desc: "17th-century Portuguese fortress overlooking Arabian Sea", img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=500&q=80" },
      { name: "Basilica of Bom Jesus", desc: "UNESCO World Heritage holding relics of St. Francis Xavier", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80" },
      { name: "Palolem Beach", desc: "Crescent-shaped tranquil beach with colorful beach shacks", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=500&q=80" },
      { name: "Dudhsagar Waterfalls", desc: "Four-tiered milk-white cascade deep in Bhagwan Mahavir sanctuary", img: "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Catamaran sailing & dolphin sighting in Morjim",
      "Sunset party cruise on Mandovi River with Goan folk dance",
      "Scuba diving & reef snorkeling at Grand Island",
      "Heritage cycling tour through Latin Quarter of Fontainhas",
    ],
    foodSpecialties: ["Goan Fish Curry Thali", "Prawn Balchão", "Bebinca", "Pork Vindaloo", "Poi Bread & Chorizo"],
    travelTips: [
      "Rent a verified self-drive scooty or car with yellow plates.",
      "Carry sunscreen and beachwear; respect heritage church dress codes in Old Goa.",
      "Pre-book water sports via Bharat Yatra for guaranteed insurance coverage.",
    ],
    nearbyDestinations: [
      { name: "Gokarna", dist: "135 km (3 hrs)" },
      { name: "Dandeli", dist: "110 km (2.5 hrs)" },
      { name: "Sindhudurg", dist: "95 km (2 hrs)" },
    ],
    faq: [
      { q: "Which airport is better for North Goa?", a: "Mopa Airport (GOX) is just 30 mins from North Goa beaches like Morjim, Arambol, and Calangute." },
      { q: "Is South Goa good for families?", a: "Yes! South Goa (Benaulim, Cavelossim, Palolem) is exceptionally peaceful, clean, and family-friendly." },
      { q: "What is the best way to get around in Goa?", a: "Pre-booked BharatYatra cabs or verified two-wheeler rentals are the most convenient." },
    ],
    packagePrice: 7999,
  },
  {
    id: "DEST-KERALA",
    slug: "travel/kerala",
    name: "Kerala (God's Own Country)",
    state: "Kerala",
    tagline: "Emerald backwaters, misty tea plantations & Ayurvedic sanctuaries",
    category: "🚤 Houseboats & Backwaters",
    rating: 4.95,
    reviewsCount: 28900,
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Popular", "Trending", "Seasonal"],
    overview:
      "A serene paradise wedged between the Arabian Sea and the Western Ghats, Kerala captivates with tranquil Alleppey houseboats, Munnar's rolling tea estates, and Kochi's spice heritage.",
    bestTimeToVisit: "September to March for backwaters; June to August for authentic monsoon Ayurveda retreats.",
    idealDuration: "6 Days / 5 Nights",
    nearestAirport: "Cochin International Airport (COK) / Trivandrum (TRV)",
    nearestRailway: "Ernakulam Junction (ERS) / Alleppey (ALLP)",
    weather: {
      temp: "27°C",
      condition: "Tropical Pleasant",
      humidity: "72%",
    },
    placesToVisit: [
      { name: "Alleppey Backwaters", desc: "Network of palm-fringed canals, lagoons & luxury houseboats", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80" },
      { name: "Munnar Tea Gardens", desc: "High-altitude tea carpets and Nilgiri Tahr sanctuary at Eravikulam", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80" },
      { name: "Fort Kochi", desc: "Iconic Chinese fishing nets, Jewish Synagogue, and colonial streets", img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Overnight stay on a traditional AC Kettuvallam houseboat with private chef",
      "Watch an authentic Kathakali dance and Kalaripayattu martial arts show",
      "Authentic 7-day Panchakarma Ayurvedic rejuvenation session",
      "Spice plantation walk and tea-tasting experience in Thekkady",
    ],
    foodSpecialties: ["Kerala Sadya on Banana Leaf", "Appam with Ishtu", "Karimeen Pollichathu", "Malabar Parotta & Beef Curry"],
    travelTips: ["Book AC premium houseboats for the best sleeping comfort.", "Carry light cotton clothing."],
    nearbyDestinations: [
      { name: "Kanyakumari", dist: "90 km from Trivandrum" },
      { name: "Madurai", dist: "140 km from Thekkady" },
    ],
    faq: [
      { q: "Is Alleppey houseboat safe for senior citizens?", a: "Yes, houseboats are spacious, single-level, and staffed with certified local crews." },
    ],
    packagePrice: 14999,
  },
  {
    id: "DEST-VARANASI",
    slug: "travel/varanasi",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    tagline: "The world's oldest living spiritual capital along the sacred Ganga",
    category: "🛕 Pilgrimage & Spiritual",
    rating: 4.9,
    reviewsCount: 19800,
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Popular", "Trending", "Seasonal"],
    overview:
      "Varanasi is the spiritual heartbeat of India. With 84 ancient ghats along the sacred Ganges river, Kashi Vishwanath Jyotirlinga, and world-renowned evening Ganga Aarti, it offers an unforgettable cultural awakening.",
    bestTimeToVisit: "October to March (Pleasant weather and grand Dev Deepawali)",
    idealDuration: "3 Days / 2 Nights",
    nearestAirport: "Lal Bahadur Shastri Int'l Airport (VNS - 24 km)",
    nearestRailway: "Varanasi Junction (BSB) / Pt. Deen Dayal Upadhyay (DDU)",
    weather: {
      temp: "24°C",
      condition: "Breezy Morning",
      humidity: "55%",
    },
    placesToVisit: [
      { name: "Kashi Vishwanath Corridor", desc: "Reconstructed grand corridor connecting the sacred river to the sanctum", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=500&q=80" },
      { name: "Dashashwamedh Ghat", desc: "Centerstage for the world-famous evening synchronized Maha Aarti", img: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=500&q=80" },
      { name: "Sarnath Buddhist Sanctuary", desc: "Where Lord Buddha preached his first sermon 2,500 years ago", img: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Witness sunset Dashashwamedh Ganga Aarti from private motorboat",
      "Sunrise Assi Ghat classical music boat tour (Subah-e-Banaras)",
      "VIP Fast-Track Sugam Darshan at Kashi Vishwanath",
      "Guided Banarasi Silk saree weaving workshop tour in weavers' colony",
    ],
    foodSpecialties: ["Banarasi Malaiyo", "Tamatar Chaat", "Kashi Malai Lassi", "Banarasi Meetha Paan", "Kachori Jalebi"],
    travelTips: ["Dress respectfully in Indian attire for inner temple sanctums.", "Pre-book VIP Darshan tickets to avoid long queues."],
    nearbyDestinations: [
      { name: "Ayodhya", dist: "215 km (Vande Bharat 2.5 hrs)" },
      { name: "Prayagraj", dist: "120 km (2 hrs)" },
    ],
    faq: [
      { q: "What is the timing for the evening Aarti?", a: "Ganga Aarti starts at approximately 6:45 PM in summer and 6:00 PM in winter." },
    ],
    packagePrice: 6499,
  },
  {
    id: "DEST-JAIPUR",
    slug: "travel/jaipur",
    name: "Jaipur (The Pink City)",
    state: "Rajasthan",
    tagline: "Royal palaces, majestic hilltop forts & timeless Rajputana splendor",
    category: "🏛️ Heritage & Historical Places",
    rating: 4.85,
    reviewsCount: 18400,
    coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Popular", "Weekend", "Trending"],
    overview:
      "Capital of royal Rajasthan, Jaipur's terracotta pink walls enclose monumental architectural treasures like Amer Fort, Hawa Mahal, City Palace, and Jantar Mantar UNESCO observatory.",
    bestTimeToVisit: "October to March",
    idealDuration: "3 Days / 2 Nights",
    nearestAirport: "Jaipur International Airport (JAI)",
    nearestRailway: "Jaipur Junction (JP) - Delhi Vande Bharat in 3.5 hrs",
    weather: {
      temp: "25°C",
      condition: "Clear & Crisp",
      humidity: "40%",
    },
    placesToVisit: [
      { name: "Amer Fort & Sheesh Mahal", desc: "Hilltop citadel famous for mirror palace and elephant courtyards", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80" },
      { name: "Hawa Mahal (Palace of Winds)", desc: "Pink sandstone facade with 953 ornate latticed windows", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=500&q=80" },
      { name: "Nahargarh Fort Sunset Point", desc: "Panoramic sunset view over the sprawling Pink City", img: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Early morning hot air balloon ride over Amer Fort",
      "Heritage walking tour through Johari & Bapu Bazaars",
      "Royal Rajasthani dinner at Chokhi Dhani ethnic village",
    ],
    foodSpecialties: ["Dal Baati Churma", "Pyaaz Kachori at Rawat", "Laal Maas", "Ghewar from LMB"],
    travelTips: ["Combined composite entry tickets for 8 monuments save both time and money."],
    nearbyDestinations: [
      { name: "Pushkar", dist: "145 km (2.5 hrs)" },
      { name: "Ranthambore", dist: "160 km (3 hrs)" },
    ],
    faq: [{ q: "How far is Jaipur from Delhi?", a: "Jaipur is 270 km from Delhi via the Delhi-Mumbai Expressway (3.5 hrs by cab or Vande Bharat)." }],
    packagePrice: 5999,
  },
  {
    id: "DEST-MANALI",
    slug: "travel/manali",
    name: "Manali & Solang Valley",
    state: "Himachal Pradesh",
    tagline: "Snowy peaks, apple orchards & Himalayan adventure gateway",
    category: "Hill Stations",
    rating: 4.8,
    reviewsCount: 16200,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Popular", "Seasonal", "Weekend"],
    overview:
      "Perched in the Beas River Valley, Manali offers a gateway to Rohtang Pass, Atal Tunnel, Solang adventure arena, and cozy Old Manali cafes surrounded by cedar forests.",
    bestTimeToVisit: "October to February for snow; April to June for mountain hiking & river rafting.",
    idealDuration: "4 Days / 3 Nights",
    nearestAirport: "Bhuntar Kullu Airport (KUU - 50 km) / Chandigarh (IXC - 270 km)",
    nearestRailway: "Chandigarh Railway Station (CDG)",
    weather: {
      temp: "14°C",
      condition: "Mountain Breeze",
      humidity: "48%",
    },
    placesToVisit: [
      { name: "Solang Valley", desc: "Adventure sports hub for paragliding, zorbing & skiing", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=500&q=80" },
      { name: "Atal Tunnel & Sissu Waterfall", desc: "Engineering marvel opening into the magical Lahaul Valley", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80" },
      { name: "Hadimba Temple", desc: "Pagoda-style wooden shrine built amidst giant deodar forest", img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Drive through Atal Tunnel into Lahaul Valley & Sissu lake",
      "River rafting on Beas river from Kullu to Jhiri",
      "Relax in natural hot sulfur springs at Vashisht",
    ],
    foodSpecialties: ["Himachali Dham", "Siddu with Ghee & Dal", "Trout Fish Fry", "Tibetan Thukpa"],
    travelTips: ["Pre-book Atal Tunnel / Rohtang permits in advance during peak season."],
    nearbyDestinations: [
      { name: "Kasol & Parvati Valley", dist: "75 km (2.5 hrs)" },
      { name: "Naggar Castle", dist: "20 km (45 mins)" },
    ],
    faq: [{ q: "When does it snow in Manali?", a: "Snowfall typically begins in late December and continues through February." }],
    packagePrice: 8499,
  },
  {
    id: "DEST-MYSORE",
    slug: "travel/mysore",
    name: "Mysore (Mysuru Heritage)",
    state: "Karnataka",
    tagline: "Illuminated royal palaces, sandalwood fragrant gardens & silk traditions",
    category: "🏛️ Heritage & Historical Places",
    rating: 4.82,
    reviewsCount: 12500,
    coverImage: "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=600&q=80",
    ],
    tags: ["Weekend", "Hidden gems", "Popular"],
    overview:
      "The cultural capital of Karnataka, Mysore is famous for its breathtaking Mysore Palace illuminated by 100,000 golden bulbs, Chamundi Hills, Brindavan Gardens, and rich Ashtanga yoga heritage.",
    bestTimeToVisit: "October (Grand Dasara celebration) to March",
    idealDuration: "2 Days / 1 Night",
    nearestAirport: "Mysuru Airport (MYQ) / Bengaluru Int'l (BLR - 180 km via Expressway)",
    nearestRailway: "Mysuru Junction (MYS) - Vande Bharat from Bangalore in 1h 45m",
    weather: {
      temp: "26°C",
      condition: "Pleasant",
      humidity: "60%",
    },
    placesToVisit: [
      { name: "Mysore Palace (Amba Vilas)", desc: "Indo-Saracenic royal residence illuminated with golden lamps", img: "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=500&q=80" },
      { name: "Chamundeshwari Temple", desc: "Ancient hilltop temple overlooking the royal city", img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80" },
    ],
    thingsToDo: [
      "Witness Sunday evening grand illumination of Mysore Palace",
      "Shop authentic GI-tagged Mysore Silk sarees & pure Sandalwood oil",
      "Musical fountain light show at Brindavan Gardens",
    ],
    foodSpecialties: ["Mysore Pak from Guru Sweets", "Mylari Butter Masala Dosa", "Filter Coffee"],
    travelTips: ["The Bangalore-Mysore 10-lane expressway makes this a quick 2-hour drive."],
    nearbyDestinations: [
      { name: "Coorg (Madikeri)", dist: "115 km (2.5 hrs)" },
      { name: "Kabini Safari", dist: "70 km (1.5 hrs)" },
    ],
    faq: [{ q: "When is Mysore Palace illuminated?", a: "Sundays and public holidays from 7:00 PM to 7:45 PM, and every evening during Dasara." }],
    packagePrice: 4299,
  },
];

// ----------------------------------------------------
// THINGS TO DO CATALOG (14 categories)
// ----------------------------------------------------
export const THINGS_TO_DO_CATALOG: ThingToDoItem[] = [
  {
    id: "ACT-01",
    title: "Mesmerizing VIP Ganga Aarti Boat Experience",
    destination: "Varanasi",
    state: "Uttar Pradesh",
    category: "Religious visits",
    duration: "2.5 Hours",
    pricePerPerson: 750,
    rating: 4.95,
    reviewsCount: 3400,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
    tags: ["Must Do", "Spiritual", "Ganga Cruise"],
    difficulty: "Easy",
    timing: "05:30 PM - 08:00 PM",
    included: ["Reserved boat seat", "Ganga Diya offering", "Local priest narrative", "Masala Chai"],
  },
  {
    id: "ACT-02",
    title: "Scuba Diving & Coral Reef Walk at Grand Island",
    destination: "Goa",
    state: "Goa",
    category: "Water activities",
    duration: "6 Hours",
    pricePerPerson: 2199,
    rating: 4.85,
    reviewsCount: 5200,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    tags: ["PADI Certified", "Includes Video", "Dolphin Sighting"],
    difficulty: "Moderate",
    timing: "07:30 AM - 02:00 PM",
    included: ["Boat transfer", "PADI instructor", "Underwater HD video", "Snacks & Drinks"],
  },
  {
    id: "ACT-03",
    title: "Amer Fort Royal Sheesh Mahal Guided Heritage Tour",
    destination: "Jaipur",
    state: "Rajasthan",
    category: "Sightseeing",
    duration: "3 Hours",
    pricePerPerson: 650,
    rating: 4.9,
    reviewsCount: 4100,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
    tags: ["UNESCO Heritage", "Certified Historian", "Skip the Line"],
    difficulty: "Easy",
    timing: "09:00 AM - 12:00 PM",
    included: ["Monument entry pass", "Licensed historian guide", "Royal courtyard access"],
  },
  {
    id: "ACT-04",
    title: "Rishikesh Grade III+ White Water Rafting & Cliff Jump",
    destination: "Rishikesh",
    state: "Uttarakhand",
    category: "Adventure activities",
    duration: "4 Hours",
    pricePerPerson: 1250,
    rating: 4.92,
    reviewsCount: 6800,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    tags: ["Adrenaline", "Safety Gear", "16 km Shivpuri stretch"],
    difficulty: "Challenging",
    timing: "08:00 AM & 01:00 PM",
    included: ["Life jacket & helmet", "Professional river guide", "Cliff jump safety", "GoPro video clip"],
  },
  {
    id: "ACT-05",
    title: "Jim Corbett National Park Royal Bengal Tiger Jeep Safari",
    destination: "Jim Corbett",
    state: "Uttarakhand",
    category: "Wildlife",
    duration: "4.5 Hours",
    pricePerPerson: 3800,
    rating: 4.88,
    reviewsCount: 2900,
    image: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=600&q=80",
    tags: ["Bijrani/Dhikala Zone", "Govt Authorized 4x4", "Naturalist Guide"],
    difficulty: "Easy",
    timing: "05:45 AM Morning Safari",
    included: ["4x4 Maruti Gypsy", "Forest permit & fees", "Certified tracker", "Binoculars"],
  },
  {
    id: "ACT-06",
    title: "Old Delhi Midnight Street Food & Heritage Walk",
    destination: "New Delhi",
    state: "Delhi",
    category: "Food experiences",
    duration: "3 Hours",
    pricePerPerson: 850,
    rating: 4.93,
    reviewsCount: 3900,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    tags: ["7 Food Stops", "Chandni Chowk", "Paranthe Wali Gali"],
    difficulty: "Easy",
    timing: "06:00 PM - 09:30 PM",
    included: ["All food tastings (7 items)", "E-rickshaw ride", "Bottled mineral water", "Local guide"],
  },
  {
    id: "ACT-07",
    title: "Private Kettuvallam Sunset Backwater Cruise & Tea",
    destination: "Alleppey",
    state: "Kerala",
    category: "Local experiences",
    duration: "3 Hours",
    pricePerPerson: 1800,
    rating: 4.96,
    reviewsCount: 2100,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    tags: ["Exclusive Boat", "Kerala Snacks", "Paddy Fields"],
    difficulty: "Easy",
    timing: "03:30 PM - 06:30 PM",
    included: ["Private boat", "Pazham Pori banana fritters", "Fresh coconut water", "Captain"],
  },
  {
    id: "ACT-08",
    title: "Johari Bazaar Gemstone & Blue Pottery Craft Walk",
    destination: "Jaipur",
    state: "Rajasthan",
    category: "Shopping",
    duration: "2.5 Hours",
    pricePerPerson: 450,
    rating: 4.78,
    reviewsCount: 1400,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80",
    tags: ["Artisans", "Certified Gems", "Blue Pottery Demo"],
    difficulty: "Easy",
    timing: "04:00 PM - 06:30 PM",
    included: ["Shopping discounts pass", "Live pottery demo", "Local shopping concierge"],
  },
];

// ----------------------------------------------------
// TOURS & PACKAGES CATALOG (11 Types)
// ----------------------------------------------------
export const TOURS_PACKAGES_CATALOG: TourPackageItem[] = [
  {
    id: "PKG-01",
    title: "Golden Triangle Royal Heritage Circuit",
    destination: "Delhi - Agra - Jaipur",
    statesCovered: ["Delhi", "Uttar Pradesh", "Rajasthan"],
    type: "Domestic tour packages",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 24999,
    rating: 4.92,
    reviewsCount: 3800,
    coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    highlights: ["Taj Mahal Sunrise", "Amer Fort Jeep Ride", "Qutub Minar", "Luxury AC Chauffeur"],
    inclusions: ["4-Star Heritage Hotels", "Daily Buffet Breakfast", "All Monument Entry Passes", "Dedicated Chauffeur"],
    itinerary: [
      { day: 1, title: "Delhi Arrival & Heritage Walk", desc: "Qutub Minar, India Gate, and Chandni Chowk street food." },
      { day: 2, title: "Delhi to Agra & Taj Mahal Sunset", desc: "Scenic Yamuna Expressway drive, Agra Fort, Mehtab Bagh." },
      { day: 3, title: "Sunrise Taj & Drive to Jaipur via Fatehpur Sikri", desc: "Taj Mahal visit, UNESCO ghost city, arrival in Jaipur." },
      { day: 4, title: "Pink City Forts & Palaces", desc: "Amer Fort, Hawa Mahal, Jantar Mantar, and Johari bazaar." },
      { day: 5, title: "Patrika Gate & Return to Delhi", desc: "Morning photo stops and return transfer to IGI Airport." },
    ],
    isTrending: true,
  },
  {
    id: "PKG-02",
    title: "Kashi - Prayagraj - Ayodhya Sacred Ramayana Trail",
    destination: "Varanasi - Prayagraj - Ayodhya",
    statesCovered: ["Uttar Pradesh"],
    type: "Pilgrimage packages",
    duration: "4 Days / 3 Nights",
    price: 12499,
    originalPrice: 16999,
    rating: 4.97,
    reviewsCount: 4600,
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    highlights: ["Ram Janmabhoomi VIP Darshan", "Kashi Vishwanath Corridor", "Triveni Sangam Holy Dip", "Maha Aarti Cruise"],
    inclusions: ["3-Star AC Hotels", "All Meals (Pure Veg Sattvic)", "VIP Darshan Passes", "AC Tempo Traveller"],
    itinerary: [
      { day: 1, title: "Varanasi Arrival & Evening Ganga Aarti", desc: "Hotel check-in, Vishwanath temple darshan, motorboat Ganga Aarti." },
      { day: 2, title: "Assi Ghat Sunrise & Drive to Prayagraj", desc: "Subah-e-Banaras, holy bath at Triveni Sangam, Hanuman temple." },
      { day: 3, title: "Drive to Ayodhya & Shri Ram Mandir Darshan", desc: "Grand Ram Janmabhoomi Mandir, Kanak Bhavan, Saryu Aarti." },
      { day: 4, title: "Hanuman Garhi & Departure", desc: "Morning blessings at Hanuman Garhi, return transfer to airport/railway." },
    ],
    isTrending: true,
  },
  {
    id: "PKG-03",
    title: "Kerala Backwaters & Munnar Honeymoon Paradise",
    destination: "Cochin - Munnar - Alleppey",
    statesCovered: ["Kerala"],
    type: "Honeymoon packages",
    duration: "5 Days / 4 Nights",
    price: 24999,
    originalPrice: 32000,
    rating: 4.95,
    reviewsCount: 2900,
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    highlights: ["Private Houseboat Stay", "Munnar Tea Estate Pool Villa", "Candlelight Dinner & Cake", "Kathakali Show"],
    inclusions: ["5-Star Resort Stays", "Private AC Kettuvallam Houseboat", "All Meals & Candlelit Dinner", "Private Chauffeur Sedan"],
    itinerary: [
      { day: 1, title: "Cochin Arrival & Drive to Munnar", desc: "Scenic hill drive past Cheeyappara waterfalls, tea garden check-in." },
      { day: 2, title: "Munnar Tea Gardens & Eravikulam Safari", desc: "Nilgiri Tahr sanctuary, tea museum, and romantic viewpoint." },
      { day: 3, title: "Drive to Alleppey & Houseboat Boarding", desc: "Board private houseboat at noon, cruise through backwater canals." },
      { day: 4, title: "Backwater Village Walk & Marari Beach", desc: "Morning village stroll, visit peaceful white sand Marari beach." },
      { day: 5, title: "Fort Kochi Sightseeing & Departure", desc: "Chinese nets, spice shopping, drop-off at Cochin Airport." },
    ],
    isTrending: true,
  },
  {
    id: "PKG-04",
    title: "Goa Beachfront Long Weekend Getaway",
    destination: "Goa",
    statesCovered: ["Goa"],
    type: "Weekend packages",
    duration: "3 Days / 2 Nights",
    price: 8999,
    originalPrice: 12000,
    rating: 4.84,
    reviewsCount: 5100,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    highlights: ["4-Star Beach Resort", "Mandovi Sunset Cruise", "Scuba Diving & Water Sports", "Airport Transfers"],
    inclusions: ["Resort with Swimming Pool", "Buffet Breakfast", "Airport AC Cab", "Complimentary Cruise Pass"],
    itinerary: [
      { day: 1, title: "Goa Arrival & Beach Shack Sunset", desc: "Mopa/Dabolim pickup, hotel check-in, sunset cocktails at Calangute." },
      { day: 2, title: "Water Sports & Latin Quarter Fontainhas", desc: "Parasailing & jet ski, afternoon photo walk in colorful Fontainhas." },
      { day: 3, title: "Aguada Fort & Departure", desc: "Morning fort visit, duty-free Goan feni & cashew shopping, departure." },
    ],
  },
];

// ----------------------------------------------------
// CURATED COLLECTIONS CATALOG (12 Types)
// ----------------------------------------------------
export const CURATED_COLLECTIONS_CATALOG: CuratedCollectionItem[] = [
  {
    id: "COL-01",
    slug: "collection/top-10-destinations",
    title: "Top 10 Must-Visit Indian Destinations",
    subtitle: "The crown jewels of Indian culture, coastlines, and mountains",
    tag: "All-Time Favorites",
    category: "Top 10 destinations",
    coverImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-GOA", "DEST-KERALA", "DEST-VARANASI", "DEST-JAIPUR", "DEST-MANALI", "DEST-MYSORE"],
    startingPrice: 4999,
    idealFor: "First-time & seasoned travelers alike",
  },
  {
    id: "COL-02",
    slug: "collection/weekend-trips-under-5000",
    title: "₹5,000 Budget Weekend Trips",
    subtitle: "Pocket-friendly fast escapes without breaking the bank",
    tag: "Budget Friendly",
    category: "₹5,000 weekend trips",
    coverImage: "https://images.unsplash.com/photo-1600100397608-f010e42f9b1c?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-MYSORE", "DEST-JAIPUR", "DEST-VARANASI"],
    startingPrice: 3499,
    idealFor: "College students, solo travelers & quick weekenders",
  },
  {
    id: "COL-03",
    slug: "collection/best-monsoon-destinations",
    title: "Best Monsoon Destinations",
    subtitle: "Mist-covered hills, roaring waterfalls & lush rain-kissed valleys",
    tag: "Monsoon Special",
    category: "Best monsoon destinations",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-KERALA", "DEST-GOA", "DEST-MANALI"],
    startingPrice: 7499,
    idealFor: "Nature lovers, photographers & rain enthusiasts",
  },
  {
    id: "COL-04",
    slug: "collection/spiritual-journeys",
    title: "Sacred Spiritual Journeys",
    subtitle: "Connect with timeless sacred energy along ancient dhams",
    tag: "Divine Blessing",
    category: "Spiritual journeys",
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-VARANASI", "DEST-MYSORE"],
    startingPrice: 5999,
    idealFor: "Families, senior citizens & spiritual seekers",
  },
  {
    id: "COL-05",
    slug: "collection/best-places-for-couples",
    title: "Best Romantic Escapes for Couples",
    subtitle: "Secluded lakeside stays, sunset cruises & private pool villas",
    tag: "Romance & Honeymoon",
    category: "Best places for couples",
    coverImage: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-KERALA", "DEST-GOA", "DEST-JAIPUR"],
    startingPrice: 11999,
    idealFor: "Honeymooners, anniversaries & romantic getaways",
  },
  {
    id: "COL-06",
    slug: "collection/luxury-escapes",
    title: "Ultra-Luxury Palace & Resort Escapes",
    subtitle: "5-star royal heritage havelis, private butler service & royal spa retreats",
    tag: "Luxury & Heritage",
    category: "Luxury escapes",
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    destinationIds: ["DEST-JAIPUR", "DEST-KERALA", "DEST-GOA"],
    startingPrice: 28999,
    idealFor: "VIP travelers, high-net-worth clients & milestone celebrations",
  },
];

// ----------------------------------------------------
// TRAVEL ALERTS CATALOG (10 Types)
// ----------------------------------------------------
export const TRAVEL_ALERTS_CATALOG: TravelAlertItem[] = [
  {
    id: "ALT-01",
    title: "Himachal Mountain Weather Alert: Heavy Rainfall at Rohtang Pass",
    category: "Weather alerts",
    severity: "warning",
    affectedRegion: "Himachal Pradesh (Manali - Rohtang Axis)",
    description: "IMD has issued an orange alert for intermittent rainfall. Atal Tunnel route remains fully open; high-pass permits subject to morning visibility.",
    timestamp: "Updated 25 mins ago",
    actionRequired: "Carry thermal layers & check live traffic status before crossing Solang.",
    source: "India Meteorological Dept (IMD) & Himachal Police",
    isActive: true,
  },
  {
    id: "ALT-02",
    title: "Vande Bharat Express Route Update: On-Time Superfast Operations",
    category: "Train alerts",
    severity: "info",
    affectedRegion: "New Delhi - Varanasi (22436) & Bangalore - Mysore (20607)",
    description: "All 18 Vande Bharat express routes operating at 100% on-time punctuality with executive chair car hot meals serviced.",
    timestamp: "Updated 10 mins ago",
    source: "Northern & Southern Railway Operations HQ",
    isActive: true,
  },
  {
    id: "ALT-03",
    title: "Goa Airport Advisory: New Mopa (GOX) Shuttle Highway Operational",
    category: "Transport alerts",
    severity: "info",
    affectedRegion: "Goa (North & South Hubs)",
    description: "Direct 6-lane elevated expressway from Mopa Airport to Calangute-Candolim is fully operational, reducing transit time to 28 minutes.",
    timestamp: "Updated 1 hour ago",
    source: "Goa Tourism & Transport Department",
    isActive: true,
  },
  {
    id: "ALT-04",
    title: "Chardham Yatra 2026 Biometric Registration Advisory",
    category: "Government/travel advisories",
    severity: "warning",
    affectedRegion: "Uttarakhand (Kedarnath, Badrinath, Gangotri, Yamunotri)",
    description: "Mandatory biometric e-pass verification active at Haridwar & Rishikesh checkpoints. Bharat Yatra customers enjoy pre-cleared QR passes.",
    timestamp: "Updated 2 hours ago",
    actionRequired: "Ensure Aadhar card and Bharat Yatra booking PNR are handy on your mobile.",
    source: "Uttarakhand State Disaster Management Authority",
    isActive: true,
  },
  {
    id: "ALT-05",
    title: "Peak Season Hotel Availability: Munnar & Goa 85% Booked for Weekend",
    category: "Hotel availability alerts",
    severity: "info",
    affectedRegion: "Kerala & Goa Coastal Hubs",
    description: "High demand for weekend beach villas and tea estate resorts. Pre-booking recommended to lock current dynamic rates.",
    timestamp: "Updated 3 hours ago",
    source: "Bharat Yatra Hospitality Grid",
    isActive: true,
  },
];
