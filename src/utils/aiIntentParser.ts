import { ServiceCategory } from "../types";

export interface ParsedTravelIntent {
  originalQuery: string;
  category?: ServiceCategory;
  action: "navigate_category" | "open_offers" | "open_profile" | "open_ai" | "open_partner";
  origin?: string;
  destination?: string;
  durationDays?: number;
  displayText: string;
  confidence: number;
}

// Popular Indian cities & destinations dictionary for intent extraction
const KNOWN_DESTINATIONS = [
  { name: "Bangalore", aliases: ["bangalore", "bengaluru", "blr"] },
  { name: "Chennai", aliases: ["chennai", "madras", "maa"] },
  { name: "Goa", aliases: ["goa", "panaji", "madgaon", "calangute", "anjuana", "gox", "goi"] },
  { name: "Kerala", aliases: ["kerala", "munnar", "alleppey", "wayanad", "kochi", "cochin", "kovalam"] },
  { name: "Tirupati", aliases: ["tirupati", "tirumala", "balaji"] },
  { name: "New Delhi", aliases: ["delhi", "new delhi", "ndls", "del"] },
  { name: "Mumbai", aliases: ["mumbai", "bombay", "bom"] },
  { name: "Varanasi", aliases: ["varanasi", "kashi", "banaras", "bsb"] },
  { name: "Jaipur", aliases: ["jaipur", "pink city", "jpr"] },
  { name: "Manali", aliases: ["manali", "kullu", "solang"] },
  { name: "Shimla", aliases: ["shimla", "kufri"] },
  { name: "Kashmir", aliases: ["kashmir", "srinagar", "gulmarg", "pahalgam"] },
  { name: "Rishikesh", aliases: ["rishikesh", "haridwar", "ganga"] },
  { name: "Coorg", aliases: ["coorg", "kodagu", "madikeri"] },
  { name: "Ooty", aliases: ["ooty", "udhagamandalam"] },
  { name: "Mysuru", aliases: ["mysuru", "mysore"] },
  { name: "Agra", aliases: ["agra", "taj mahal"] },
  { name: "Udaipur", aliases: ["udaipur", "city of lakes"] },
  { name: "Amritsar", aliases: ["amritsar", "golden temple"] },
  { name: "Puri", aliases: ["puri", "jagannath"] },
  { name: "Shirdi", aliases: ["shirdi", "sai baba"] },
  { name: "Ayodhya", aliases: ["ayodhya", "ram mandir"] },
  { name: "Kolkata", aliases: ["kolkata", "calcutta", "ccu"] },
  { name: "Hyderabad", aliases: ["hyderabad", "hyd"] },
  { name: "Pune", aliases: ["pune", "pnq"] },
  { name: "Ahmedabad", aliases: ["ahmedabad", "amdavad", "adi"] },
  { name: "Leh Ladakh", aliases: ["leh", "ladakh", "pangong"] },
  { name: "Andaman", aliases: ["andaman", "havelock", "port blair"] },
  { name: "Darjeeling", aliases: ["darjeeling"] },
  { name: "Hampi", aliases: ["hampi", "vijayanagara"] },
  { name: "Jim Corbett", aliases: ["corbett", "jim corbett", "ramnagar"] },
  { name: "Ranthambore", aliases: ["ranthambore", "sawai madhopur"] },
  { name: "Kabini", aliases: ["kabini", "nagarhole"] }
];

export function parseNaturalLanguageTravelQuery(query: string): ParsedTravelIntent {
  const clean = query.trim();
  const lower = clean.toLowerCase();

  // 1. Check for Direct Action Intents (Offers, Profile)
  if (
    lower.includes("offer") ||
    lower.includes("coupon") ||
    lower.includes("discount") ||
    lower.includes("promo") ||
    lower.includes("deal") ||
    lower.includes("cashback")
  ) {
    return {
      originalQuery: clean,
      action: "open_offers",
      displayText: "Opening Verified Bank Deals & Seasonal Promo Coupons",
      confidence: 0.95,
    };
  }

  if (
    lower.includes("profile") ||
    lower.includes("wallet") ||
    lower.includes("coins") ||
    lower.includes("my account")
  ) {
    return {
      originalQuery: clean,
      action: "open_profile",
      displayText: "Opening Account & BharatYatra Wallet",
      confidence: 0.92,
    };
  }

  if (
    lower.includes("partner") ||
    lower.includes("vendor") ||
    lower.includes("list hotel") ||
    lower.includes("list property") ||
    lower.includes("operator portal") ||
    lower.includes("b2b desk") ||
    lower.includes("partner portal") ||
    lower.includes("commission")
  ) {
    return {
      originalQuery: clean,
      action: "open_partner",
      displayText: "Opening BharatYatra Partner Portal & Operator Hub",
      confidence: 0.96,
    };
  }

  // 2. Identify Category
  let category: ServiceCategory = "tours";
  let confidence = 0.85;

  if (
    lower.includes("bus") ||
    lower.includes("volvo") ||
    lower.includes("sleeper bus") ||
    lower.includes("ksrtc") ||
    lower.includes("redbus") ||
    lower.includes("chalo")
  ) {
    category = "buses";
  } else if (
    lower.includes("train") ||
    lower.includes("rail") ||
    lower.includes("irctc") ||
    lower.includes("vande bharat") ||
    lower.includes("tatkal") ||
    lower.includes("berth") ||
    lower.includes("shatabdi") ||
    lower.includes("rajdhani")
  ) {
    category = "trains";
  } else if (
    lower.includes("flight") ||
    lower.includes("plane") ||
    lower.includes("fly") ||
    lower.includes("air ticket") ||
    lower.includes("indigo") ||
    lower.includes("air india") ||
    lower.includes("spicejet")
  ) {
    category = "flights";
  } else if (
    lower.includes("resort") ||
    lower.includes("villa") ||
    lower.includes("pool villa") ||
    lower.includes("luxury stay")
  ) {
    category = "resorts";
  } else if (
    lower.includes("lodge") ||
    lower.includes("safari lodge") ||
    lower.includes("treehouse") ||
    lower.includes("jungle")
  ) {
    category = "lodges";
  } else if (
    lower.includes("hotel") ||
    lower.includes("stay") ||
    lower.includes("homestay") ||
    lower.includes("haveli") ||
    lower.includes("room") ||
    lower.includes("guest house")
  ) {
    category = "hotels";
  } else if (
    lower.includes("pilgrimage") ||
    lower.includes("yatra") ||
    lower.includes("darshan") ||
    lower.includes("temple") ||
    lower.includes("mandir") ||
    lower.includes("tirupati") ||
    lower.includes("chardham") ||
    lower.includes("vaishno") ||
    lower.includes("kashi") ||
    lower.includes("shirdi") ||
    lower.includes("ayodhya")
  ) {
    category = "pilgrimage";
  } else if (
    lower.includes("houseboat") ||
    lower.includes("shikara") ||
    lower.includes("backwaters")
  ) {
    category = "houseboats";
  } else if (
    lower.includes("cab") ||
    lower.includes("taxi") ||
    lower.includes("outstation cab") ||
    lower.includes("rental car")
  ) {
    category = "cabs";
  } else if (
    lower.includes("plan") ||
    lower.includes("trip") ||
    lower.includes("tour") ||
    lower.includes("holiday") ||
    lower.includes("package") ||
    lower.includes("itinerary") ||
    lower.includes("explore")
  ) {
    category = "tours";
  }

  // 3. Extract Duration (e.g., "5-day", "3 days", "weekend")
  let durationDays: number | undefined;
  const dayMatch = lower.match(/(\d+)\s*(?:-| )*(?:day|days|night|nights)/);
  if (dayMatch) {
    durationDays = parseInt(dayMatch[1], 10);
  } else if (lower.includes("weekend")) {
    durationDays = 2;
  }

  // 4. Extract Origin and Destination
  let origin: string | undefined;
  let destination: string | undefined;

  // Pattern A: "from [origin] to [destination]"
  const fromToMatch = lower.match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\.|$|,|\b(?:for|on|in|under|with)\b)/);
  if (fromToMatch) {
    const rawOrigin = fromToMatch[1].trim();
    const rawDest = fromToMatch[2].trim();

    const matchedOrigin = KNOWN_DESTINATIONS.find((d) =>
      d.aliases.some((a) => rawOrigin.includes(a))
    );
    const matchedDest = KNOWN_DESTINATIONS.find((d) =>
      d.aliases.some((a) => rawDest.includes(a))
    );

    origin = matchedOrigin ? matchedOrigin.name : rawOrigin.charAt(0).toUpperCase() + rawOrigin.slice(1);
    destination = matchedDest ? matchedDest.name : rawDest.charAt(0).toUpperCase() + rawDest.slice(1);
  } else {
    // Pattern B: "[City A] to [City B]"
    const cityToCityMatch = lower.match(/([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\.|$|,|\b(?:for|on|in|under|with)\b)/);
    if (cityToCityMatch && !cityToCityMatch[1].includes("how") && !cityToCityMatch[1].includes("want")) {
      const rawOrigin = cityToCityMatch[1].trim();
      const rawDest = cityToCityMatch[2].trim();

      const matchedOrigin = KNOWN_DESTINATIONS.find((d) =>
        d.aliases.some((a) => rawOrigin.includes(a))
      );
      const matchedDest = KNOWN_DESTINATIONS.find((d) =>
        d.aliases.some((a) => rawDest.includes(a))
      );

      if (matchedOrigin || matchedDest) {
        origin = matchedOrigin ? matchedOrigin.name : rawOrigin;
        destination = matchedDest ? matchedDest.name : rawDest;
      }
    }
  }

  // If no destination found yet, check for "in [City]" or "to [City]" or standalone city mention
  if (!destination) {
    const inMatch = lower.match(/(?:in|to|at|for)\s+([a-z\s]+?)(?:\.|$|,|\b(?:hotels?|resorts?|cabs?|trains?|buses?|trip|yatra)\b)/);
    if (inMatch) {
      const candidate = inMatch[1].trim();
      const matched = KNOWN_DESTINATIONS.find((d) =>
        d.aliases.some((a) => candidate.includes(a))
      );
      if (matched) {
        destination = matched.name;
      }
    }

    if (!destination) {
      for (const dest of KNOWN_DESTINATIONS) {
        if (dest.aliases.some((a) => lower.includes(a))) {
          destination = dest.name;
          break;
        }
      }
    }
  }

  // Format display text
  let summary = `Searching ${category.toUpperCase()}`;
  if (origin && destination) {
    summary = `${category.toUpperCase()}: ${origin} ➔ ${destination}`;
  } else if (destination) {
    summary = `${category.toUpperCase()} in ${destination}`;
  }
  if (durationDays) {
    summary += ` (${durationDays} Days)`;
  }

  // If complex planning request, might also trigger AI Travel Concierge
  const isComplexPlan = lower.startsWith("plan") || lower.includes("itinerary") || lower.includes("suggest");
  const action = isComplexPlan ? "open_ai" : "navigate_category";

  return {
    originalQuery: clean,
    category,
    action,
    origin,
    destination,
    durationDays,
    displayText: summary,
    confidence,
  };
}

export const SAMPLE_AI_QUERIES = [
  "Find a bus from Bangalore to Chennai.",
  "Find hotels in Goa.",
  "Plan a 5-day Kerala trip.",
  "Find a pilgrimage trip to Tirupati.",
  "Show my bookings.",
  "Check flights from Delhi to Mumbai.",
  "Luxury resorts in Coorg.",
  "IRCTC Vande Bharat to Varanasi.",
];
