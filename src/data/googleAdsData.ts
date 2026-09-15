export interface GoogleAdsPMaxCampaign {
  id: string;
  name: string;
  type: "PERFORMANCE_MAX" | "SEARCH_HIGH_INTENT" | "YOUTUBE_IN_STREAM";
  status: "ENABLED" | "PAUSED";
  dailyBudget: number;
  monthlySpend: number;
  targetRoas: number;
  currentRoas: number;
  searchImpressions: number;
  clicks: number;
  avgCpc: number;
  conversions: number;
  costPerConversion: number;
  highIntentKeywords: string[];
  negativeKeywords: string[];
}

export const GOOGLE_ADS_DATA: GoogleAdsPMaxCampaign[] = [
  {
    id: "G-PMAX-01",
    name: "India Travel PMax — Flights & 5-Star Hotels Omnipresence",
    type: "PERFORMANCE_MAX",
    status: "ENABLED",
    dailyBudget: 45000,
    monthlySpend: 1120000,
    targetRoas: 750,
    currentRoas: 890,
    searchImpressions: 1450000,
    clicks: 89000,
    avgCpc: 12.58,
    conversions: 2490,
    costPerConversion: 449,
    highIntentKeywords: [
      "delhi to goa flights lowest fare",
      "best 5 star resort in gulmarg",
      "luxury kerala houseboat booking online",
      "irctc train ticket confirmed tatkal guarantee",
      "char dham helicopter booking 2026",
    ],
    negativeKeywords: ["free travel jobs", "pirate train route map", "complaint helpline gov"],
  },
  {
    id: "G-SEARCH-02",
    name: "Emergency Cab & Outstation Taxi Search Bidding",
    type: "SEARCH_HIGH_INTENT",
    status: "ENABLED",
    dailyBudget: 15000,
    monthlySpend: 420000,
    targetRoas: 600,
    currentRoas: 740,
    searchImpressions: 560000,
    clicks: 41000,
    avgCpc: 10.24,
    conversions: 1820,
    costPerConversion: 230,
    highIntentKeywords: [
      "one way cab mumbai to pune emergency",
      "bangalore airport taxi zero surge",
      "delhi to agra cab with toll included",
    ],
    negativeKeywords: ["used taxi car for sale", "uber driver registration app"],
  },
];
