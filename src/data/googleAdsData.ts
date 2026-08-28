export type GoogleCampaignType = "Search" | "Display" | "YouTube Video" | "Performance Max (PMax)";
export type GoogleBidStrategy = "Maximize Conversions" | "Target CPA" | "Target ROAS" | "Manual CPC";
export type GoogleCampaignStatus = "Active" | "Paused" | "Under Review" | "Draft" | "Ended";

export interface GoogleAdGroup {
  id: string;
  name: string;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  displayPath1: string;
  displayPath2: string;
  keywordsCount: number;
  status: "Enabled" | "Paused";
}

export interface GoogleKeyword {
  id: string;
  keyword: string;
  matchType: "Exact [keyword]" | "Phrase \"keyword\"" | "Broad keyword";
  avgCpcINR: number;
  monthlySearches: number;
  qualityScore: number; // 1-10
  clicks: number;
  conversions: number;
  costINR: number;
  status: "Active" | "Paused" | "Negative";
}

export interface GoogleAdsCampaign {
  id: string;
  campaignId: string;
  name: string;
  type: GoogleCampaignType;
  status: GoogleCampaignStatus;
  dailyBudgetINR: number;
  monthlyBudgetINR: number;
  spendToDateINR: number;
  bidStrategy: GoogleBidStrategy;
  targetCpaINR?: number;
  targetRoasMultiplier?: number;
  locations: string[];
  excludedLocations?: string[];
  languages: string[];
  audiences: string[];
  landingPageUrl: string;
  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  schedule: string;
  startDate: string;
  endDate: string;
  adGroups: GoogleAdGroup[];
  keywords: GoogleKeyword[];
  negativeKeywords: string[];
  impressions: number;
  clicks: number;
  ctr: number; // Percentage
  avgCpcINR: number;
  conversions: number;
  costPerLeadINR: number;
  costPerBookingINR: number;
  roas: number;
  revenueAttributedINR: number;
}

export const INITIAL_GOOGLE_ADS_CAMPAIGNS: GoogleAdsCampaign[] = [
  {
    id: "GCAMP-001",
    campaignId: "GADS-9810284",
    name: "Search_Flights_Metro_Diwali_Advance_Booking",
    type: "Search",
    status: "Active",
    dailyBudgetINR: 25000,
    monthlyBudgetINR: 750000,
    spendToDateINR: 420000,
    bidStrategy: "Target CPA",
    targetCpaINR: 280,
    targetRoasMultiplier: 8.5,
    locations: ["New Delhi (DEL)", "Mumbai (BOM)", "Bengaluru (BLR)", "Hyderabad (HYD)", "Kolkata (CCU)"],
    excludedLocations: ["Tier-3 Remote Areas"],
    languages: ["English", "Hindi"],
    audiences: ["In-Market: Domestic Air Travel", "Frequent Business Travelers", "Diwali Holiday Seekers"],
    landingPageUrl: "https://bharatyatra.ai/flights?source=gads_diwali",
    utmCampaign: "diwali_advance_flights_q3",
    utmSource: "google",
    utmMedium: "cpc",
    schedule: "Mon-Sun 06:00 - 23:59 (Peak bid +20% 19:00-22:00)",
    startDate: "2026-08-01",
    endDate: "2026-11-15",
    adGroups: [
      {
        id: "GAG-01",
        name: "Delhi-Goa & Mumbai-Goa Direct Non-Stop",
        headlines: [
          "Book Lowest Airfare Flights 2026",
          "Zero Convenience Fee Flight Booking",
          "Compare 600+ Airlines on BharatYatra",
        ],
        descriptions: [
          "Get instant ₹800 cashback on flight bookings today with instant GST invoice reconciliation.",
          "24/7 dedicated traveler support. Instant web check-in and luggage tags on WhatsApp.",
        ],
        finalUrl: "https://bharatyatra.ai/flights/delhi-to-goa",
        displayPath1: "Flights",
        displayPath2: "Deals",
        keywordsCount: 18,
        status: "Enabled",
      },
    ],
    keywords: [
      {
        id: "GKW-01",
        keyword: "delhi to goa flights lowest fare",
        matchType: 'Phrase "keyword"',
        avgCpcINR: 14.5,
        monthlySearches: 185000,
        qualityScore: 9,
        clicks: 4850,
        conversions: 412,
        costINR: 70325,
        status: "Active",
      },
      {
        id: "GKW-02",
        keyword: "mumbai to kashmir flight booking",
        matchType: 'Phrase "keyword"',
        avgCpcINR: 18.2,
        monthlySearches: 94000,
        qualityScore: 9,
        clicks: 3120,
        conversions: 289,
        costINR: 56784,
        status: "Active",
      },
      {
        id: "GKW-03",
        keyword: "flight booking app zero convenience fee",
        matchType: "Exact [keyword]",
        avgCpcINR: 22.4,
        monthlySearches: 45000,
        qualityScore: 10,
        clicks: 2190,
        conversions: 295,
        costINR: 49056,
        status: "Active",
      },
      {
        id: "GKW-04",
        keyword: "cheap flight ticket",
        matchType: "Broad keyword",
        avgCpcINR: 11.0,
        monthlySearches: 320000,
        qualityScore: 7,
        clicks: 8400,
        conversions: 490,
        costINR: 92400,
        status: "Active",
      },
    ],
    negativeKeywords: ["free", "pilot jobs", "flight radar free live", "cabin crew vacancy", "torrent", "pdf hack"],
    impressions: 485200,
    clicks: 38400,
    ctr: 7.91,
    avgCpcINR: 10.93,
    conversions: 3120,
    costPerLeadINR: 134.61,
    costPerBookingINR: 168.26,
    roas: 8.82,
    revenueAttributedINR: 3704400,
  },
  {
    id: "GCAMP-002",
    campaignId: "GADS-9810285",
    name: "PMax_Kedarnath_Char_Dham_VIP_Helicopter_Yatra",
    type: "Performance Max (PMax)",
    status: "Active",
    dailyBudgetINR: 15000,
    monthlyBudgetINR: 450000,
    spendToDateINR: 275000,
    bidStrategy: "Target ROAS",
    targetRoasMultiplier: 9.2,
    locations: ["All India (Priority: Gujarat, Maharashtra, Delhi NCR, UP, Karnataka)"],
    languages: ["Hindi", "Gujarati", "Marathi", "English"],
    audiences: ["Custom Intent: Kedarnath VIP Darshan Pass", "Spiritual Pilgrims 45+ Age", "Luxury Temple Tours"],
    landingPageUrl: "https://bharatyatra.ai/yatra/kedarnath-vip-helicopter",
    utmCampaign: "pmax_kedarnath_helicopter_yatra",
    utmSource: "google",
    utmMedium: "pmax",
    schedule: "All Days 07:00 - 22:30",
    startDate: "2026-07-15",
    endDate: "2026-11-30",
    adGroups: [
      {
        id: "GAG-02",
        name: "Kedarnath Helipad Priority Slot & Heated Cottage",
        headlines: [
          "Kedarnath VIP Helicopter Booking 2026",
          "Direct Helipad Priority Darshan Pass",
          "Safe Registered Char Dham Yatra",
        ],
        descriptions: [
          "Complete VIP Package: Phata/Guptkashi Heli tickets, heated cottage stay, biometric registration & guide.",
          "Authorized state booking partner. 100% verified helicopter operator slots.",
        ],
        finalUrl: "https://bharatyatra.ai/yatra/kedarnath",
        displayPath1: "Yatra",
        displayPath2: "Kedarnath",
        keywordsCount: 14,
        status: "Enabled",
      },
    ],
    keywords: [
      {
        id: "GKW-05",
        keyword: "kedarnath helicopter booking 2026 online",
        matchType: "Exact [keyword]",
        avgCpcINR: 28.5,
        monthlySearches: 160000,
        qualityScore: 10,
        clicks: 3450,
        conversions: 480,
        costINR: 98325,
        status: "Active",
      },
      {
        id: "GKW-06",
        keyword: "char dham yatra vip tour package",
        matchType: 'Phrase "keyword"',
        avgCpcINR: 24.0,
        monthlySearches: 82000,
        qualityScore: 9,
        clicks: 2900,
        conversions: 340,
        costINR: 69600,
        status: "Active",
      },
    ],
    negativeKeywords: ["free prasad delivery", "fake ticket complaint", "helicopter accident 2018", "yatra rules 2012"],
    impressions: 320400,
    clicks: 19800,
    ctr: 6.17,
    avgCpcINR: 13.88,
    conversions: 1840,
    costPerLeadINR: 149.45,
    costPerBookingINR: 198.55,
    roas: 10.4,
    revenueAttributedINR: 2860000,
  },
  {
    id: "GCAMP-003",
    campaignId: "GADS-9810286",
    name: "YouTube_Video_Incredible_India_Luxury_Stays",
    type: "YouTube Video",
    status: "Active",
    dailyBudgetINR: 10000,
    monthlyBudgetINR: 300000,
    spendToDateINR: 150000,
    bidStrategy: "Maximize Conversions",
    locations: ["Tier-1 Metros (Top 10 Cities)"],
    languages: ["English", "Hindi"],
    audiences: ["Affinity: Luxury Travelers & Foodies", "Travel Show Viewers", "Resort Stay Seekers"],
    landingPageUrl: "https://bharatyatra.ai/resorts",
    utmCampaign: "yt_luxury_resorts_showcase",
    utmSource: "youtube",
    utmMedium: "video_cpc",
    schedule: "All Days 12:00 - 23:59",
    startDate: "2026-08-10",
    endDate: "2026-10-31",
    adGroups: [
      {
        id: "GAG-03",
        name: "Kerala Houseboats & Udaipur Palaces Video Reel Ad",
        headlines: ["Experience Royal Heritage Stays", "Private Plunge Pool Villas", "Book Direct on BharatYatra"],
        descriptions: ["Watch our handpicked luxury villas with private butler and Ayurvedic spa."],
        finalUrl: "https://bharatyatra.ai/resorts",
        displayPath1: "Luxury",
        displayPath2: "Stays",
        keywordsCount: 8,
        status: "Enabled",
      },
    ],
    keywords: [],
    negativeKeywords: ["budget dharamsala", "cheap hostel dorm"],
    impressions: 680000,
    clicks: 22400,
    ctr: 3.29,
    avgCpcINR: 6.69,
    conversions: 940,
    costPerLeadINR: 159.57,
    costPerBookingINR: 215.0,
    roas: 6.8,
    revenueAttributedINR: 1020000,
  },
];
