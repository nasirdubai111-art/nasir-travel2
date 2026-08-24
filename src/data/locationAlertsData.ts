import { CityLocation } from "../types";

export interface CityWeatherAlert {
  temp: number;
  tempUnit: string;
  condition: string;
  iconType: "sun" | "cloud-sun" | "cloud-rain" | "cloud-snow" | "cloud-fog" | "wind" | "zap";
  aqi: number;
  aqiCategory: "Good" | "Moderate" | "Poor" | "Severe";
  humidity: string;
  visibility: string;
  windSpeed: string;
}

export interface LocationTravelAlert {
  id: string;
  category: "WEATHER_WARNING" | "TRANSIT_ONTIME" | "TRAFFIC_ALERT" | "PILGRIMAGE_UPDATE" | "AIRPORT_SECURITY" | "RAIL_UPDATE";
  severity: "normal" | "info" | "advisory" | "warning" | "critical";
  badgeText: string;
  headline: string;
  details: string;
  impact: string;
  timestamp: string;
  helpline?: string;
  recommendedAction?: string;
}

export interface CityStatusProfile {
  cityId: string;
  cityName: string;
  state: string;
  weather: CityWeatherAlert;
  overallStatus: "Normal Operations" | "Minor Weather Advisory" | "High Crowd Advisory" | "Clear Blue Skies" | "Fog & Visibility Caution" | "Pleasant Season";
  overallStatusColor: "emerald" | "amber" | "rose" | "sky" | "purple";
  alerts: LocationTravelAlert[];
  emergencyContacts: { service: string; number: string }[];
  transitSummary: {
    flights: { status: string; onTimeRate: string; gateQueue: string };
    trains: { status: string; majorHub: string; punctuality: string };
    cabsHighways: { status: string; expressway: string; tollStatus: string };
  };
}

export const CITY_STATUS_DATABASE: Record<string, CityStatusProfile> = {
  delhi: {
    cityId: "delhi",
    cityName: "New Delhi",
    state: "Delhi NCR",
    weather: {
      temp: 24,
      tempUnit: "°C",
      condition: "Pleasant & Clear",
      iconType: "sun",
      aqi: 112,
      aqiCategory: "Moderate",
      humidity: "48%",
      visibility: "6.5 km",
      windSpeed: "12 km/h NW",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "del-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "AIRPORT RADAR",
        headline: "IGI T3 & T2 Departures Operating at 98.4% On-Time Index",
        details: "DigiYatra biometric express gates average queue time is under 4 minutes across all security checkpoints.",
        impact: "Zero flight disruptions reported across domestic and international carriers.",
        timestamp: "Updated 4m ago",
        helpline: "0124-4797300",
        recommendedAction: "Use DigiYatra smart gates for swift 3-minute terminal entry.",
      },
      {
        id: "del-alt-2",
        category: "RAIL_UPDATE",
        severity: "info",
        badgeText: "VANDE BHARAT",
        headline: "New Delhi (NDLS) Vande Bharat & Rajdhani Express on Schedule",
        details: "Varanasi, Katra, Dehradun & Ajmer Vande Bharat rakes boarded smoothly from Platforms 1, 2, and 16.",
        impact: "Smooth passenger boarding with 100% automated platform screen displays.",
        timestamp: "Updated 12m ago",
        helpline: "139 (Railway SOS)",
        recommendedAction: "Report to NDLS Paharganj or Ajmeri Gate 25 minutes prior to departure.",
      },
      {
        id: "del-alt-3",
        category: "TRAFFIC_ALERT",
        severity: "info",
        badgeText: "HIGHWAY FLOW",
        headline: "Delhi-Mumbai Expressway & Yamuna Expressway Normal Speed",
        details: "FASTag automated barrier lanes clearing vehicles within 12 seconds. Murthal food corridor traffic smooth.",
        impact: "Ideal driving conditions for Agra, Jaipur, and Chandigarh outstation cabs.",
        timestamp: "Updated 18m ago",
        helpline: "1033 (NHAI Helpline)",
        recommendedAction: "Keep FASTag balance topped up above ₹500 for uninterrupted transit.",
      },
      {
        id: "del-alt-4",
        category: "WEATHER_WARNING",
        severity: "normal",
        badgeText: "AIR QUALITY",
        headline: "Comfortable Afternoon Temperatures (24°C) with Crisp Autumn Breeze",
        details: "Air Quality Index (AQI 112) is within comfortable range for outdoor monuments & India Gate walks.",
        impact: "Optimal conditions for Connaught Place dining, Red Fort & Qutub Minar tours.",
        timestamp: "Updated 30m ago",
      },
    ],
    emergencyContacts: [
      { service: "Delhi Police Travel Helpline", number: "112" },
      { service: "Tourist Police Assistance", number: "011-23363400" },
      { service: "IGI Airport Master Control", number: "0124-4797300" },
      { service: "Northern Railway Help", number: "139" },
    ],
    transitSummary: {
      flights: { status: "Normal Departures", onTimeRate: "98.4%", gateQueue: "3-5 mins (DigiYatra)" },
      trains: { status: "100% On-Time", majorHub: "NDLS / Anand Vihar / Nizamuddin", punctuality: "99.1%" },
      cabsHighways: { status: "Free Flowing", expressway: "NE-4 Delhi-Mumbai / Yamuna Exp", tollStatus: "Instant FASTag" },
    },
  },

  mumbai: {
    cityId: "mumbai",
    cityName: "Mumbai",
    state: "Maharashtra",
    weather: {
      temp: 29,
      tempUnit: "°C",
      condition: "Coastal Breeze & Sunny",
      iconType: "sun",
      aqi: 68,
      aqiCategory: "Good",
      humidity: "64%",
      visibility: "9 km",
      windSpeed: "18 km/h WSW",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "bom-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "AIRPORT RADAR",
        headline: "CSMIA T2 & T1 Operations 100% Green • Atal Setu Sea Link Smooth",
        details: "Mumbai Airport runway handling 46 aircraft movements/hour with zero hold-over delays.",
        impact: "Seamless connections to Goa, Delhi, Bengaluru, Dubai, and Singapore.",
        timestamp: "Updated 6m ago",
        helpline: "022-66851010",
        recommendedAction: "Pre-book airport prepaid cabs or utilize Navi Mumbai Atal Setu connector.",
      },
      {
        id: "bom-alt-2",
        category: "TRAFFIC_ALERT",
        severity: "info",
        badgeText: "COASTAL ROAD",
        headline: "Mumbai Coastal Road & Bandra-Worli Sea Link Green Corridors",
        details: "Marine Drive to Worli travel time clocked at just 9 minutes. Western Express Highway normal.",
        impact: "Effortless South Mumbai sightseeing and hotel transfers.",
        timestamp: "Updated 15m ago",
        helpline: "100 / 112",
        recommendedAction: "Opt for Coastal Road route during evening peak hours for fastest scenic commute.",
      },
      {
        id: "bom-alt-3",
        category: "RAIL_UPDATE",
        severity: "normal",
        badgeText: "CSMT / BCT",
        headline: "Mumbai-Goa Vande Bharat & Western Railway Exp. Running On-Time",
        details: "All Konkan Railway superfast routes cleared with excellent coastal track visibility.",
        impact: "Smooth journey for holiday travelers heading to Ratnagiri, Madgaon, and Shirdi.",
        timestamp: "Updated 22m ago",
        helpline: "139",
      },
    ],
    emergencyContacts: [
      { service: "Mumbai Police SOS", number: "112" },
      { service: "Tourist Police Cell", number: "022-22621855" },
      { service: "CSMIA Airport Control", number: "022-66851010" },
      { service: "Central Railway Helpline", number: "139" },
    ],
    transitSummary: {
      flights: { status: "Zero Delays", onTimeRate: "99.0%", gateQueue: "4 mins" },
      trains: { status: "On-Time", majorHub: "CSMT / Mumbai Central", punctuality: "98.5%" },
      cabsHighways: { status: "Coastal Road Open", expressway: "Atal Setu MTHL / Mumbai-Pune Exp", tollStatus: "All Lanes Active" },
    },
  },

  bengaluru: {
    cityId: "bengaluru",
    cityName: "Bengaluru",
    state: "Karnataka",
    weather: {
      temp: 21,
      tempUnit: "°C",
      condition: "Pleasant Drizzle & Cool",
      iconType: "cloud-sun",
      aqi: 45,
      aqiCategory: "Good",
      humidity: "72%",
      visibility: "8 km",
      windSpeed: "14 km/h ENE",
    },
    overallStatus: "Pleasant Season",
    overallStatusColor: "sky",
    alerts: [
      {
        id: "blr-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "T2 GARDEN TERMINAL",
        headline: "KIA T2 Voted World's Best Terminal • Zero Baggage Wait",
        details: "Kempegowda International Airport Terminal 2 automated biometric gates recording 2.8 min processing.",
        impact: "Express departures to Hyderabad, Kochi, Chennai, and overseas routes.",
        timestamp: "Updated 8m ago",
        helpline: "080-66785555",
      },
      {
        id: "blr-alt-2",
        category: "TRAFFIC_ALERT",
        severity: "info",
        badgeText: "EXPRESSWAY",
        headline: "Bengaluru-Mysuru 10-Lane Expressway Operating at 100 km/h",
        details: "Travel time between Bengaluru and Mysuru palace remains steady at 75 minutes.",
        impact: "Perfect weekend road trip conditions for Coorg, Kabini, and Ooty tours.",
        timestamp: "Updated 20m ago",
        helpline: "1033",
      },
      {
        id: "blr-alt-3",
        category: "WEATHER_WARNING",
        severity: "normal",
        badgeText: "GARDEN CITY WEATHER",
        headline: "Mild 21°C Climate • Great for Cubbon Park & Bannerghatta Safari",
        details: "Clean air with AQI 45. Refreshing cool breeze throughout the city.",
        impact: "Ideal outdoor exploration weather across cafes, botanical gardens & tech parks.",
        timestamp: "Updated 35m ago",
      },
    ],
    emergencyContacts: [
      { service: "Karnataka Tourist Police", number: "112 / 080-22211456" },
      { service: "KIA Airport Helpdesk", number: "080-66785555" },
      { service: "South Western Railway", number: "139" },
    ],
    transitSummary: {
      flights: { status: "Smooth Operations", onTimeRate: "98.7%", gateQueue: "3 mins (T2)" },
      trains: { status: "Punctual", majorHub: "KSR Bengaluru / Yesvantpur / SMVB", punctuality: "99.4%" },
      cabsHighways: { status: "Expressway Clear", expressway: "Bengaluru-Mysuru NE-7", tollStatus: "FASTag Seamless" },
    },
  },

  srinagar: {
    cityId: "srinagar",
    cityName: "Srinagar & Gulmarg",
    state: "Jammu & Kashmir",
    weather: {
      temp: 9,
      tempUnit: "°C",
      condition: "Crisp Mountain Sun & Snow Slopes",
      iconType: "cloud-snow",
      aqi: 28,
      aqiCategory: "Good",
      humidity: "55%",
      visibility: "10 km",
      windSpeed: "8 km/h N",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "sky",
    alerts: [
      {
        id: "sxr-alt-1",
        category: "WEATHER_WARNING",
        severity: "info",
        badgeText: "GULMARG SNOW REPORT",
        headline: "Gulmarg Gondola Phase 1 & 2 Fully Operational (10cm Fresh Snow)",
        details: "Clear sunny morning at Kongdoori & Apharwat peak. Ski lift equipment and licensed guides ready.",
        impact: "High demand for Phase 2 tickets; book official slots prior to arrival.",
        timestamp: "Updated 5m ago",
        helpline: "1800-103-1070",
        recommendedAction: "Wear thermal layering and sunglasses for snow reflection protection.",
      },
      {
        id: "sxr-alt-2",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "SHIKARA & DAL LAKE",
        headline: "Dal Lake & Nigeen Lake Shikaras & Houseboats Operating Safely",
        details: "Water safety patrols active with certified lifejackets and heated Kahwa onboard.",
        impact: "Romantic sunset Shikara rides available across Ghats 1 to 17.",
        timestamp: "Updated 14m ago",
      },
      {
        id: "sxr-alt-3",
        category: "AIRPORT_SECURITY",
        severity: "info",
        badgeText: "SRINAGAR AIRPORT",
        headline: "Sheikh ul-Alam Airport (SXR) Clear Runway & Normal Departures",
        details: "Visibility exceeding 10,000m. Direct flights to Delhi, Mumbai, and Amritsar on time.",
        impact: "Zero weather hold. Arrive 2 hours prior for mandatory security checks.",
        timestamp: "Updated 25m ago",
        helpline: "0194-2303000",
      },
    ],
    emergencyContacts: [
      { service: "J&K Tourism Emergency Desk", number: "1800-103-1070" },
      { service: "Gulmarg Gondola Rescue", number: "01954-254480" },
      { service: "Srinagar Tourist Police", number: "0194-2452224" },
    ],
    transitSummary: {
      flights: { status: "All Flights Clear", onTimeRate: "97.8%", gateQueue: "12 mins" },
      trains: { status: "Banihal-Baramulla Vistadome Active", majorHub: "Srinagar / Jammu Tawi", punctuality: "98.9%" },
      cabsHighways: { status: "NH-44 Highway Open", expressway: "Srinagar-Qazigund Tunnel Road", tollStatus: "Clear" },
    },
  },

  varanasi: {
    cityId: "varanasi",
    cityName: "Varanasi (Kashi)",
    state: "Uttar Pradesh",
    weather: {
      temp: 23,
      tempUnit: "°C",
      condition: "Clear & Serene",
      iconType: "sun",
      aqi: 82,
      aqiCategory: "Moderate",
      humidity: "52%",
      visibility: "7 km",
      windSpeed: "10 km/h NE",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "vns-alt-1",
        category: "PILGRIMAGE_UPDATE",
        severity: "normal",
        badgeText: "KASHI VISHWANATH",
        headline: "Shri Kashi Vishwanath Dham Sugam VIP Darshan Operational",
        details: "Corridor queue time averages 18 minutes. Ganga view gallery and battery cart assistance active for seniors.",
        impact: "Mangala Aarti, Bhog Aarti & Shringar Aarti passes available via BharatYatra.",
        timestamp: "Updated 3m ago",
        helpline: "0542-2392629",
        recommendedAction: "Carry physical Aadhaar or DigiLocker ID for verification at Gate 4 (Chhatrapati Shivaji Gate).",
      },
      {
        id: "vns-alt-2",
        category: "PILGRIMAGE_UPDATE",
        severity: "info",
        badgeText: "GANGA AARTI",
        headline: "Dashashwamedh & Assi Ghat Evening Aarti Commencing at 06:15 PM",
        details: "Electric motorboat cruise and luxury bajra bookings open. Lifejackets mandatory per district magistrate notice.",
        impact: "Spectacular Aarti viewing from reserved mid-river pontoon boats.",
        timestamp: "Updated 16m ago",
      },
      {
        id: "vns-alt-3",
        category: "RAIL_UPDATE",
        severity: "normal",
        badgeText: "BANARAS / BSB",
        headline: "Vande Bharat (22436 / 22435) Delhi-Varanasi 100% Punctual",
        details: "Banaras (BSBS) and Varanasi Junction (BSB) platform escalator facilities active 24x7.",
        impact: "Hassle-free embarkation for senior citizens and pilgrimage groups.",
        timestamp: "Updated 28m ago",
        helpline: "139",
      },
    ],
    emergencyContacts: [
      { service: "Kashi Temple Trust SOS", number: "0542-2392629" },
      { service: "Varanasi Tourist Police", number: "9454402844" },
      { service: "Lal Bahadur Shastri Airport Help", number: "0542-2622155" },
    ],
    transitSummary: {
      flights: { status: "Normal Departures", onTimeRate: "99.1%", gateQueue: "4 mins" },
      trains: { status: "High Punctuality", majorHub: "Varanasi Jn (BSB) / Banaras (BSBS)", punctuality: "99.5%" },
      cabsHighways: { status: "Purvanchal Expressway Open", expressway: "NH-19 & Ring Road Phase 2", tollStatus: "Normal" },
    },
  },

  goa: {
    cityId: "goa",
    cityName: "Goa",
    state: "Goa",
    weather: {
      temp: 28,
      tempUnit: "°C",
      condition: "Tropical Sunshine & Gentle Surf",
      iconType: "sun",
      aqi: 32,
      aqiCategory: "Good",
      humidity: "68%",
      visibility: "10 km",
      windSpeed: "15 km/h SW",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "goi-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "MOPA & DABOLIM",
        headline: "Manohar Intl (GOX) & Dabolim (GOI) Flights Operating at 99.4%",
        details: "Direct electric bus shuttles to Calangute, Panjim, and Margao running every 20 minutes.",
        impact: "Zero delay in beach resort check-ins and cab pickups.",
        timestamp: "Updated 7m ago",
        helpline: "0832-2438034",
      },
      {
        id: "goi-alt-2",
        category: "WEATHER_WARNING",
        severity: "normal",
        badgeText: "BEACH SAFETY",
        headline: "Drishti Marine Lifeguards Active • Red Flag Areas Clearly Marked",
        details: "Water sports (parasailing, jet-ski, scuba) fully certified and operational in Calangute, Baga, and Palolem.",
        impact: "Safe family swimming conditions across all major North & South Goa beaches.",
        timestamp: "Updated 19m ago",
        helpline: "0832-2414040",
      },
      {
        id: "goi-alt-3",
        category: "TRAFFIC_ALERT",
        severity: "info",
        badgeText: "FERRY & CRUISE",
        headline: "Mandovi River Dinner Cruise & Betim Ferries on Schedule",
        details: "Panaji promenade parking smoothly managed with live digital bay counters.",
        impact: "Exciting nightlife and river sunset experiences.",
        timestamp: "Updated 32m ago",
      },
    ],
    emergencyContacts: [
      { service: "Goa Tourist Police Assistance", number: "112 / 0832-2428989" },
      { service: "Drishti Beach Lifeguard SOS", number: "0832-2414040" },
      { service: "Mopa Airport Help Desk", number: "0832-2438034" },
    ],
    transitSummary: {
      flights: { status: "Flawless On-Time", onTimeRate: "99.4%", gateQueue: "3 mins" },
      trains: { status: "Konkan Kanya / Vande Bharat On-Time", majorHub: "Madgaon (MAO) / Thivim", punctuality: "98.8%" },
      cabsHighways: { status: "NH-66 Open", expressway: "Zuari Bridge & Atal Setu Goa", tollStatus: "Free Flow" },
    },
  },

  jaipur: {
    cityId: "jaipur",
    cityName: "Jaipur",
    state: "Rajasthan",
    weather: {
      temp: 26,
      tempUnit: "°C",
      condition: "Warm Royal Sun & Dry",
      iconType: "sun",
      aqi: 95,
      aqiCategory: "Moderate",
      humidity: "35%",
      visibility: "8 km",
      windSpeed: "11 km/h W",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "jai-alt-1",
        category: "PILGRIMAGE_UPDATE",
        severity: "normal",
        badgeText: "HERITAGE PASS",
        headline: "Amber Fort Elephant Rides & Light & Sound Show Operating",
        details: "Composite heritage e-tickets allow instant QR entry to Hawa Mahal, Jantar Mantar & Nahargarh.",
        impact: "Zero queue waiting at heritage monument ticket counters.",
        timestamp: "Updated 9m ago",
        helpline: "0141-2822863",
      },
      {
        id: "jai-alt-2",
        category: "TRAFFIC_ALERT",
        severity: "info",
        badgeText: "DELHI-JAIPUR EXP",
        headline: "Delhi-Jaipur NE-4 Expressway Transit Time: 2 Hours 45 Minutes",
        details: "Smooth cruising speeds with fully monitored smart cameras and rest area amenities at Dausa.",
        impact: "Ideal for intercity cab bookings and luxury bus travelers.",
        timestamp: "Updated 21m ago",
        helpline: "1033",
      },
    ],
    emergencyContacts: [
      { service: "Rajasthan Tourist Police", number: "0141-2822863" },
      { service: "Jaipur Police SOS", number: "112" },
      { service: "Jaipur Airport Control", number: "0141-2299221" },
    ],
    transitSummary: {
      flights: { status: "Normal", onTimeRate: "98.2%", gateQueue: "4 mins" },
      trains: { status: "Ajmer Shatabdi & Vande Bharat On-Time", majorHub: "Jaipur Junction (JP) / Gandhinagar", punctuality: "99.0%" },
      cabsHighways: { status: "Delhi-Jaipur Expressway Clear", expressway: "NE-4 Delhi-Vadodara / NH-48", tollStatus: "All Green" },
    },
  },

  ayodhya: {
    cityId: "ayodhya",
    cityName: "Ayodhya",
    state: "Uttar Pradesh",
    weather: {
      temp: 24,
      tempUnit: "°C",
      condition: "Sunny & Sacred",
      iconType: "sun",
      aqi: 70,
      aqiCategory: "Good",
      humidity: "50%",
      visibility: "8 km",
      windSpeed: "9 km/h NE",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "ay-alt-1",
        category: "PILGRIMAGE_UPDATE",
        severity: "normal",
        badgeText: "RAM JANMABHOOMI",
        headline: "Shri Ram Mandir Sugam & Aarti Entry Passes Moving Swiftly",
        details: "Pilgrim facilitation centre lockers and wheelchair ramps operational across all gates.",
        impact: "Aarti tokens verified via digital QR at the main verification pavilion.",
        timestamp: "Updated 4m ago",
        helpline: "05278-292000",
      },
      {
        id: "ay-alt-2",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "MAHARISHI VALMIKI AIRPORT",
        headline: "Ayodhya Airport (AYJ) Direct Flights from Delhi, Mumbai & Ahmedabad",
        details: "Airport electric luxury shuttle buses connect directly to Ram Path and Hanuman Garhi.",
        impact: "Smooth arrival for weekend pilgrimage travelers.",
        timestamp: "Updated 17m ago",
      },
    ],
    emergencyContacts: [
      { service: "Ayodhya Pilgrim Assistance Centre", number: "05278-292000" },
      { service: "Ayodhya Tourist Police", number: "9454403844" },
      { service: "UP Tourism Toll Free", number: "1800-180-5013" },
    ],
    transitSummary: {
      flights: { status: "Direct Flights Active", onTimeRate: "99.0%", gateQueue: "3 mins" },
      trains: { status: "Ayodhya Dham Jn (AY) Revamped", majorHub: "Ayodhya Dham Jn / Ayodhya Cantt", punctuality: "99.2%" },
      cabsHighways: { status: "Lucknow-Ayodhya Highway Clear", expressway: "NH-27 Four-Lane Corridor", tollStatus: "FASTag Active" },
    },
  },

  tirupati: {
    cityId: "tirupati",
    cityName: "Tirupati",
    state: "Andhra Pradesh",
    weather: {
      temp: 27,
      tempUnit: "°C",
      condition: "Pleasant & Sacred Breeze",
      iconType: "sun",
      aqi: 40,
      aqiCategory: "Good",
      humidity: "58%",
      visibility: "9 km",
      windSpeed: "12 km/h SE",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "tpt-alt-1",
        category: "PILGRIMAGE_UPDATE",
        severity: "normal",
        badgeText: "TTD DARSHAN",
        headline: "Tirumala Special Entry Darshan (SED ₹300) Compartments Moving Normal",
        details: "Average darshan queue time: 2 hours 15 minutes. Free laddu prasadam counters running seamlessly.",
        impact: "Alipiri and Srivari Mettu pedestrian walking paths open with free luggage transfer.",
        timestamp: "Updated 5m ago",
        helpline: "0877-2233333 / 2277777",
      },
      {
        id: "tpt-alt-2",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "TIRUPATI AIRPORT",
        headline: "Renigunta Airport (TIR) Flights On-Schedule from HYD, BLR & MAA",
        details: "APSRTC Electric Sapthagiri Ghat buses operating every 3 minutes up the Seven Hills.",
        impact: "Zero delay in Tirumala hill transport.",
        timestamp: "Updated 18m ago",
      },
    ],
    emergencyContacts: [
      { service: "TTD Call Centre (24x7)", number: "0877-2233333" },
      { service: "Tirumala Vigilance & Security", number: "0877-2263721" },
      { service: "Tirupati Police SOS", number: "112" },
    ],
    transitSummary: {
      flights: { status: "All On-Time", onTimeRate: "99.1%", gateQueue: "3 mins" },
      trains: { status: "Vande Bharat to Secunderabad On-Time", majorHub: "Tirupati (TPTY) / Renigunta", punctuality: "99.6%" },
      cabsHighways: { status: "Ghat Roads Open", expressway: "Alipiri Toll Gate 2-Way Flow", tollStatus: "Smooth RFID" },
    },
  },

  rishikesh: {
    cityId: "rishikesh",
    cityName: "Rishikesh",
    state: "Uttarakhand",
    weather: {
      temp: 20,
      tempUnit: "°C",
      condition: "Clear Mountain Air & Ganga Waves",
      iconType: "sun",
      aqi: 30,
      aqiCategory: "Good",
      humidity: "45%",
      visibility: "10 km",
      windSpeed: "10 km/h NW",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "rsh-alt-1",
        category: "WEATHER_WARNING",
        severity: "normal",
        badgeText: "GANGA RAFTING",
        headline: "Kaudiyala, Marine Drive & Shivpuri River Rafting Certified Clear",
        details: "Water temperature 16°C with safe Grade II & III rapids. Certified guides & rescue kayaks stationed.",
        impact: "Ideal conditions for adventure sports, cliff jumping & beach camping.",
        timestamp: "Updated 6m ago",
        helpline: "0135-2430209",
      },
      {
        id: "rsh-alt-2",
        category: "PILGRIMAGE_UPDATE",
        severity: "info",
        badgeText: "TRIVENI GHAT",
        headline: "Maha Aarti at Triveni Ghat & Parmarth Niketan at 06:00 PM",
        details: "Pedestrian Ram Jhula & Janki Setu glass suspension bridge open with smooth crowd management.",
        impact: "Peaceful spiritual experience along the sacred Ganga.",
        timestamp: "Updated 20m ago",
      },
    ],
    emergencyContacts: [
      { service: "Uttarakhand Tourism Helpline", number: "0135-2430209" },
      { service: "Rishikesh Disaster / SDRF", number: "112 / 1070" },
      { service: "Dehradun Jolly Grant Airport", number: "0135-2412052" },
    ],
    transitSummary: {
      flights: { status: "Jolly Grant (DED) On-Time", onTimeRate: "98.5%", gateQueue: "4 mins" },
      trains: { status: "Yog Nagari Rishikesh (YNRK) Active", majorHub: "Yog Nagari Rishikesh / Haridwar", punctuality: "99.0%" },
      cabsHighways: { status: "Delhi-Dehradun Expressway Progressing", expressway: "NH-58 Haridwar-Rishikesh", tollStatus: "FASTag Active" },
    },
  },

  kochi: {
    cityId: "kochi",
    cityName: "Kochi & Munnar",
    state: "Kerala",
    weather: {
      temp: 27,
      tempUnit: "°C",
      condition: "Tropical Serenity & Gentle Clouds",
      iconType: "cloud-sun",
      aqi: 35,
      aqiCategory: "Good",
      humidity: "75%",
      visibility: "9 km",
      windSpeed: "13 km/h W",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "cok-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "SOLAR AIRPORT CIAL",
        headline: "Kochi Airport (100% Solar Powered) 99.3% On-Time Index",
        details: "Water Metro electric boats connecting High Court to Vypeen running every 15 minutes.",
        impact: "Eco-friendly, fast transit across the Kochi backwater islands.",
        timestamp: "Updated 8m ago",
        helpline: "0484-2610115",
      },
      {
        id: "cok-alt-2",
        category: "WEATHER_WARNING",
        severity: "normal",
        badgeText: "MUNNAR TEA HILLS",
        headline: "Munnar & Eravikulam National Park Mist-Free Views (17°C)",
        details: "Nilgiri Tahr spotting tours operating. Mattupetty Dam boating and spice plantations welcoming visitors.",
        impact: "Ideal holiday climate for family & honeymoon tours.",
        timestamp: "Updated 25m ago",
      },
    ],
    emergencyContacts: [
      { service: "Kerala Tourism 24x7 SOS", number: "1800-425-4747" },
      { service: "Kochi Water Metro Desk", number: "0484-2846700" },
      { service: "CIAL Airport Command", number: "0484-2610115" },
    ],
    transitSummary: {
      flights: { status: "Green Solar Operations", onTimeRate: "99.3%", gateQueue: "3 mins" },
      trains: { status: "Vande Bharat Thiruvananthapuram-Kasaragod", majorHub: "Ernakulam Jn (ERS) / Town", punctuality: "99.4%" },
      cabsHighways: { status: "NH-66 & NH-85 Munnar Gap Road Open", expressway: "Kochi-Munnar Scenic Highway", tollStatus: "Clear" },
    },
  },

  udaipur: {
    cityId: "udaipur",
    cityName: "Udaipur",
    state: "Rajasthan",
    weather: {
      temp: 25,
      tempUnit: "°C",
      condition: "Sparkling Lake Sun & Breeze",
      iconType: "sun",
      aqi: 48,
      aqiCategory: "Good",
      humidity: "42%",
      visibility: "9 km",
      windSpeed: "10 km/h WSW",
    },
    overallStatus: "Clear Blue Skies",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: "udr-alt-1",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "LAKE PICHOLA",
        headline: "Lake Pichola & Fateh Sagar Solar Boat Cruises Operating Smoothly",
        details: "City Palace and Jagmandir Island boat crossings running on full 15-minute scheduled intervals.",
        impact: "Breathtaking views of heritage palaces and Aravalli hills.",
        timestamp: "Updated 10m ago",
        helpline: "0294-2411535",
      },
      {
        id: "udr-alt-2",
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "MAHARANA PRATAP AIRPORT",
        headline: "Dabok Airport (UDR) On-Time Flights from DEL, BOM, BLR & JAI",
        details: "Scenic airport road through Debari Ghat clear with smooth taxi availability.",
        impact: "Effortless arrival for palace destination weddings & romantic vacations.",
        timestamp: "Updated 24m ago",
      },
    ],
    emergencyContacts: [
      { service: "Rajasthan Tourism Udaipur", number: "0294-2411535" },
      { service: "Udaipur Police Control", number: "112 / 0294-2414600" },
      { service: "Maharana Pratap Airport", number: "0294-2655950" },
    ],
    transitSummary: {
      flights: { status: "All Scheduled", onTimeRate: "98.9%", gateQueue: "3 mins" },
      trains: { status: "Vande Bharat to Jaipur & Delhi Active", majorHub: "Udaipur City (UDZ) / Ranapratapnagar", punctuality: "99.1%" },
      cabsHighways: { status: "NH-48 & NH-27 Clear", expressway: "Udaipur-Ahmedabad 6-Lane Corridor", tollStatus: "FASTag Instant" },
    },
  },
};

/**
 * Fallback generator for dynamically returning a rich status profile for ANY city/location
 */
export function getCityStatusProfile(location: CityLocation): CityStatusProfile {
  const normalizedId = location.id?.toLowerCase().trim();
  if (CITY_STATUS_DATABASE[normalizedId]) {
    return CITY_STATUS_DATABASE[normalizedId];
  }

  // Fallback dynamic profile based on location type
  const isHill = location.type === "hillstation";
  const isBeach = location.type === "beach";
  const isSpiritual = location.type === "spiritual";
  const isMetro = location.type === "metro" || location.type === "business";

  const defaultTemp = isHill ? 14 : isBeach ? 28 : isSpiritual ? 22 : 25;
  const defaultCondition = isHill
    ? "Pleasant Mountain Weather"
    : isBeach
    ? "Sunny Coastal Breeze"
    : isSpiritual
    ? "Clear & Serene"
    : "Clear Skies";
  const defaultIcon: CityWeatherAlert["iconType"] = isHill ? "cloud-sun" : "sun";

  return {
    cityId: location.id,
    cityName: location.name,
    state: location.state,
    weather: {
      temp: defaultTemp,
      tempUnit: "°C",
      condition: defaultCondition,
      iconType: defaultIcon,
      aqi: isMetro ? 88 : 45,
      aqiCategory: isMetro ? "Moderate" : "Good",
      humidity: isBeach ? "70%" : "45%",
      visibility: "8.5 km",
      windSpeed: "11 km/h",
    },
    overallStatus: "Normal Operations",
    overallStatusColor: "emerald",
    alerts: [
      {
        id: `gen-${location.id}-1`,
        category: "TRANSIT_ONTIME",
        severity: "normal",
        badgeText: "TRANSIT RADAR",
        headline: `${location.name} Travel & Mobility Ecosystem Operating Normally`,
        details: `Airport (${location.airportCode || "Local"}), Railway (${location.railwayCode || "Station"}), and Highway corridors are clear with zero major delays reported.`,
        impact: "All local cabs, hotels, and scheduled tours operating on time.",
        timestamp: "Updated just now",
        helpline: "1363 (Tourist Helpline)",
      },
      {
        id: `gen-${location.id}-2`,
        category: isSpiritual ? "PILGRIMAGE_UPDATE" : "WEATHER_WARNING",
        severity: "info",
        badgeText: isSpiritual ? "DARSHAN RADAR" : "WEATHER NOTICE",
        headline: isSpiritual
          ? `VIP Darshan Passes & Fast-Track Entry Running at ${location.name}`
          : `Pleasant ${defaultTemp}°C Climate at ${location.name} — Ideal for Sightseeing`,
        details: isSpiritual
          ? "Local temple management and prasad facilitation counters are fully operational with queue tracking."
          : `Enjoy comfortable visibility (${location.state}) for local sightseeing, outstation road trips, and verified stays.`,
        impact: "Seamless travel experience guaranteed.",
        timestamp: "Updated 10m ago",
      },
      {
        id: `gen-${location.id}-3`,
        category: "TRAFFIC_ALERT",
        severity: "normal",
        badgeText: "HIGHWAY FLOW",
        headline: `NH Corridors & Outstation Cab Routes Clear into ${location.name}`,
        details: "FASTag automated toll barrier lanes are clearing traffic seamlessly. Safe driving conditions.",
        impact: "100% on-time cab and bus dispatches.",
        timestamp: "Updated 25m ago",
      },
    ],
    emergencyContacts: [
      { service: "National Tourist Helpline (24x7)", number: "1363" },
      { service: "All-India Emergency SOS", number: "112" },
      { service: "Indian Railways SOS", number: "139" },
      { service: "National Highway Emergency", number: "1033" },
    ],
    transitSummary: {
      flights: { status: "Regular Schedule", onTimeRate: "98.8%", gateQueue: "4 mins" },
      trains: { status: "On-Time Service", majorHub: location.railwayCode || `${location.name} Central`, punctuality: "99.0%" },
      cabsHighways: { status: "Normal Speeds", expressway: `Connecting Corridors (${location.state})`, tollStatus: "Instant FASTag" },
    },
  };
}
