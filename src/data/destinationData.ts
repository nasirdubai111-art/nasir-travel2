export interface DestinationGuide {
  id: string;
  name: string;
  state: string;
  category: "Spiritual & Temples" | "Heritage & Forts" | "Hill Stations" | "Beaches & Coastal" | "Wildlife & Nature";
  tagline: string;
  rating: number;
  reviewsCount: number;
  coverImage: string;
  galleryImages: string[];
  bestSeason: string;
  idealDuration: string;
  nearestAirport: string;
  nearestRailway: string;
  highlights: string[];
  darshanTimings?: string;
  dressCode?: string;
  mustTryDelicacy: string;
  sampleItinerary: { day: string; title: string; activities: string }[];
  suggestedPackagePrice: number;
  serviceBundle: {
    flight: string;
    train: string;
    hotel: string;
    cab: string;
  };
  blogSnippet: string;
}

export const DESTINATIONS_CATALOG: DestinationGuide[] = [
  {
    id: "DEST-VARANASI",
    name: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    category: "Spiritual & Temples",
    tagline: "The World's Oldest Living Spiritual Capital along the Sacred Ganga",
    rating: 4.9,
    reviewsCount: 14200,
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80",
    ],
    bestSeason: "October to March (Pleasant breeze and grand Ganga Aarti)",
    idealDuration: "3 Days / 2 Nights",
    nearestAirport: "Lal Bahadur Shastri Int'l Airport (VNS - 24 km)",
    nearestRailway: "Varanasi Junction (BSB) / Pt. Deen Dayal Upadhyay (DDU)",
    highlights: [
      "Kashi Vishwanath Jyotirlinga Golden Temple",
      "Mesmerizing Dashashwamedh Ghat Evening Ganga Aarti",
      "Subah-e-Banaras Morning Sunrise Boat Cruise on Assi Ghat",
      "Sarnath (Where Lord Buddha gave first sermon)",
      "Silk Weaving & Banarasi Saree Craft Village",
    ],
    darshanTimings: "Mangala Aarti: 03:00 AM, General Darshan: 06:00 AM - 11:00 PM",
    dressCode: "Traditional Indian attire recommended (Dhoti/Kurta for sanctum Abhishek)",
    mustTryDelicacy: "Banarasi Malaiyo, Tamatar Chaat at Kashi Chaat Bhandar, Banarasi Paan",
    sampleItinerary: [
      { day: "Day 1", title: "Arrival, Ghat Walk & Grand Ganga Aarti", activities: "Check-in at heritage riverside havell, witness evening Aarti on private boat." },
      { day: "Day 2", title: "VIP Kashi Vishwanath Darshan & Sarnath Excursion", activities: "Early morning Abhishek at Vishwanath Corridor, afternoon excursion to Sarnath Stupa." },
      { day: "Day 3", title: "Sunrise Boat Ride, Banarasi Silk & Departure", activities: "Morning Ganga boat tour with classical music, shopping authentic weaves, departure." },
    ],
    suggestedPackagePrice: 8999,
    serviceBundle: {
      flight: "IndiGo 6E-2042 DEL ➔ VNS (1h 15m)",
      train: "Vande Bharat Express (22436) 06:00 AM",
      hotel: "BrijRama Palace / Taj Nadesar Heritage",
      cab: "Airport to Ghat Private AC Chauffeur",
    },
    blogSnippet: "Experiencing Varanasi is not just a holiday—it is a spiritual homecoming. As the ringing of temple bells echoes across the 84 ghats at dusk, one realizes why this timeless city has enchanted seekers for over 3,000 years...",
  },
  {
    id: "DEST-JAIPUR",
    name: "Jaipur (The Pink City)",
    state: "Rajasthan",
    category: "Heritage & Forts",
    tagline: "Royal Palaces, Majestic Forts & Timeless Rajputana Splendor",
    rating: 4.8,
    reviewsCount: 18900,
    coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
    ],
    bestSeason: "November to February",
    idealDuration: "3 Days / 2 Nights",
    nearestAirport: "Jaipur International Airport (JAI)",
    nearestRailway: "Jaipur Junction (JP)",
    highlights: [
      "Amer Fort Palace with Sheesh Mahal",
      "Hawa Mahal (Palace of Winds) with 953 jharokhas",
      "City Palace & Jantar Mantar (UNESCO World Heritage)",
      "Nahargarh Fort Sunset Viewpoint overlooking Pink City",
      "Johari Bazaar Gemstones & Blue Pottery shopping",
    ],
    mustTryDelicacy: "Dal Baati Churma, Pyaaz Kachori at Rawat Mishtan Bhandar, Ghewar",
    sampleItinerary: [
      { day: "Day 1", title: "Hawa Mahal, City Palace & Johari Bazaar", activities: "Explore royal courtyards, astronomical observatory and lively pink bazaars." },
      { day: "Day 2", title: "Amer Fort, Nahargarh & Royal Dinner", activities: "Guided Amer palace tour, evening sunset at Nahargarh, authentic Rajasthani folk dinner." },
      { day: "Day 3", title: "Patrika Gate, Albert Hall Museum & Departure", activities: "Iconic photo stop at Jawahar Circle Patrika gate and vintage armory museum." },
    ],
    suggestedPackagePrice: 7499,
    serviceBundle: {
      flight: "Air India AI-491 BOM ➔ JAI",
      train: "Delhi-Jaipur Vande Bharat (20978)",
      hotel: "ITC Rajputana / Samode Haveli",
      cab: "Full-day AC Cab with Local Heritage Guide",
    },
    blogSnippet: "The sandstone gates of Jaipur narrate tales of valor and architectural genius. From the mirror reflections of Amer to the fragrant street food of MI Road, Jaipur delivers an unforgettable royal journey...",
  },
  {
    id: "DEST-MANALI",
    name: "Manali & Solang Valley",
    state: "Himachal Pradesh",
    category: "Hill Stations",
    tagline: "Snow-Capped Himalayan Peaks, Pine Forests & Mountain Adventures",
    rating: 4.8,
    reviewsCount: 16500,
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596761064536-125032b49c06?auto=format&fit=crop&w=600&q=80",
    ],
    bestSeason: "March to June (Pleasant weather) / Dec to Feb (Snowfall)",
    idealDuration: "4 Days / 3 Nights",
    nearestAirport: "Kullu-Bhuntar Airport (KUU - 50 km) or Chandigarh (IXC)",
    nearestRailway: "Chandigarh Junction (CDG) / Anandpur Sahib",
    highlights: [
      "Atal Tunnel & Sissu Lahaul Valley Snow Excursion",
      "Solang Valley Paragliding & Zorbing",
      "Ancient Hadimba Devi Temple in cedar forest",
      "Old Manali Cafes & Live Acoustic Music",
      "Vashisht Natural Sulphur Hot Water Springs",
    ],
    mustTryDelicacy: "Himachali Siddu with Ghee, Trout Fish, Mountain Thukpa, Apple Cider",
    sampleItinerary: [
      { day: "Day 1", title: "Arrival & Old Manali Stroll", activities: "Check-in at riverside cedar resort, explore Hadimba Devi Temple and Old Manali." },
      { day: "Day 2", title: "Atal Tunnel & Sissu Waterfalls", activities: "Drive through 9km engineering marvel into snow-capped Lahaul Valley." },
      { day: "Day 3", title: "Solang Valley Adventure Sports", activities: "Paragliding, snow scooter rides, evening bonfire and stargazing." },
      { day: "Day 4", title: "Naggar Castle & Return", activities: "Visit historical Naggar wood-stone palace and return transfer." },
    ],
    suggestedPackagePrice: 9999,
    serviceBundle: {
      flight: "Flight to Chandigarh (IXC)",
      train: "Vande Bharat New Delhi to Chandigarh",
      hotel: "The Himalayan Resort / Span Resort & Spa",
      cab: "Chandigarh to Manali AC SUV Transfer",
    },
    blogSnippet: "Waking up to the whispering pines and roaring Beas River in Manali is therapy for the soul. The new Atal Tunnel has unlocked mystical Lahaul, making it a year-round paradise...",
  },
  {
    id: "DEST-GOA",
    name: "Goa (North & South Coast)",
    state: "Goa",
    category: "Beaches & Coastal",
    tagline: "Sun-Kissed Beaches, Portuguese Architecture & Coastal Gastronomy",
    rating: 4.9,
    reviewsCount: 22000,
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
    ],
    bestSeason: "October to April",
    idealDuration: "4 Days / 3 Nights",
    nearestAirport: "Mopa Int'l Airport (GOX) / Dabolim (GOI)",
    nearestRailway: "Madgaon Junction (MAO) / Thivim (THVM)",
    highlights: [
      "Palolem & Agonda Pristine South Goa Beaches",
      "Fontainhas Latin Quarter Portuguese Heritage Walk",
      "Basilica of Bom Jesus (UNESCO World Heritage)",
      "Mandovi River Sunset Catamaran Cruise",
      "Scuba Diving & Dolphin spotting near Grand Island",
    ],
    mustTryDelicacy: "Goan Fish Curry Thali, Poi Bread, Bebinca Cake, Cashew Feni",
    sampleItinerary: [
      { day: "Day 1", title: "North Goa Beaches & Sunset Cafe", activities: "Relax at Ashwem beach, evening live jazz at beachfront shack." },
      { day: "Day 2", title: "Fontainhas Old Latin Quarter & Churches", activities: "Walk colorful Portuguese villas, heritage bakeries, Bom Jesus Basilica." },
      { day: "Day 3", title: "South Goa Serenity & Ocean Cruise", activities: "Kayak at Palolem beach, sunset yacht cruise with Goan dinner." },
      { day: "Day 4", title: "Spice Plantation & Departure", activities: "Organic spice farm tour with authentic buffet lunch, airport transfer." },
    ],
    suggestedPackagePrice: 11499,
    serviceBundle: {
      flight: "Akasa Air / IndiGo direct to GOX",
      train: "Vande Bharat Express Mumbai to Madgaon",
      hotel: "Taj Exotica / W Goa Beach Villa",
      cab: "Private Convertible or SUV Rental",
    },
    blogSnippet: "Beyond the vibrant nightlife, Goa is an enchanting blend of serene coconut groves, centuries-old baroque churches, and culinary perfection that recharges every traveler...",
  },
  {
    id: "DEST-TIRUPATI",
    name: "Tirupati Balaji & Tirumala",
    state: "Andhra Pradesh",
    category: "Spiritual & Temples",
    tagline: "The Sacred Abode of Lord Sri Venkateswara on Seven Hills",
    rating: 4.95,
    reviewsCount: 31000,
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
    ],
    bestSeason: "September to March",
    idealDuration: "2 Days / 1 Night",
    nearestAirport: "Tirupati Airport (TIR - 15 km) / Chennai (MAA - 130 km)",
    nearestRailway: "Tirupati Main (TPTY) / Renigunta (RU)",
    highlights: [
      "Sri Venkateswara Swamy Temple on Tirumala Hills",
      "World-Famous GI-Tagged Tirupati Laddu Prasadam",
      "Sri Padmavathi Ammavari Temple at Tiruchanur",
      "Kapila Theertham Holy Waterfall",
      "Silathoranam Natural Rock Arch",
    ],
    darshanTimings: "Suprabhata Seva: 03:00 AM, Special Entry Darshan (SED): 09:00 AM - 09:00 PM",
    dressCode: "Strict Traditional: Dhoti/Pancha for Men, Saree/Chudidar with Dupatta for Women",
    mustTryDelicacy: "Tirupati GI Laddu Prasadam, Andhra Thali with Gongura Pachadi",
    sampleItinerary: [
      { day: "Day 1", title: "Arrival, Padmavathi Temple & Hill Ascent", activities: "Receive blessing at Goddess Padmavathi temple, scenic ghat road drive to Tirumala." },
      { day: "Day 2", title: "Lord Balaji Special Darshan & Laddu Collection", activities: "Confirmed Special Entry Darshan, collect sacred Prasadam, return transfer." },
    ],
    suggestedPackagePrice: 6299,
    serviceBundle: {
      flight: "Direct Flight to Tirupati (TIR)",
      train: "Vande Bharat Secunderabad / Chennai to Tirupati",
      hotel: "Fortune Select Grand Ridge / Marasa Sarovar",
      cab: "Dedicated Hill Pass AC Chauffeur",
    },
    blogSnippet: "The divine chants of 'Govinda Govinda' vibrating across the Seshachalam hills fill the heart with boundless peace. Our VIP Darshan coordination ensures smooth, blessed darshan...",
  },
];
