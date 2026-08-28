export type MetaObjective = "CONVERSIONS" | "LEAD_GENERATION" | "TRAFFIC" | "CATALOG_SALES" | "VIDEO_VIEWS";
export type MetaPlacement = "Facebook Feed" | "Instagram Feed" | "Instagram Reels" | "Facebook Reels" | "Instagram Stories" | "Audience Network";

export interface MetaCustomAudience {
  id: string;
  name: string;
  type: "WEBSITE_CUSTOM_AUDIENCE" | "CUSTOMER_CRM_LIST" | "LOOKALIKE_AUDIENCE" | "ENGAGEMENT_REELS";
  size: number;
  matchRatePercent: number;
  lookalikeRatio?: string; // "1% Top Spenders", "2% Travel Seekers"
  source: string;
  lastUpdated: string;
}

export interface MetaAdCreative {
  id: string;
  headline: string;
  primaryText: string;
  callToAction: "BOOK_NOW" | "GET_OFFER" | "SIGN_UP" | "LEARN_MORE" | "CONTACT_US";
  format: "Single Image" | "Carousel (5 Cards)" | "Reel Video (9:16)" | "Instant Experience";
  assetUrl: string;
  previewUrl: string;
  leadsCaptured: number;
  bookingsAttributed: number;
}

export interface MetaAdSet {
  id: string;
  name: string;
  dailyBudgetINR: number;
  placements: MetaPlacement[];
  locations: string[];
  ageRange: string;
  gender: "All" | "Men" | "Women";
  interests: string[];
  customAudienceId?: string;
  bidStrategy: "LOWEST_COST" | "COST_CAP" | "ROAS_GOAL";
  costCapINR?: number;
  status: "ACTIVE" | "PAUSED";
  creatives: MetaAdCreative[];
  impressions: number;
  clicks: number;
  conversions: number;
  cpaINR: number;
}

export interface MetaCampaign {
  id: string;
  name: string;
  businessAccountId: string;
  adAccountId: string;
  objective: MetaObjective;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "DRAFT";
  budgetType: "CBO (Campaign Budget Optimization)" | "ABO (Ad Set Budget)";
  totalBudgetINR: number;
  spendINR: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpcINR: number;
  leadsCount: number;
  bookingsCount: number;
  costPerLeadINR: number;
  costPerBookingINR: number;
  roas: number;
  revenueAttributedINR: number;
  startDate: string;
  endDate: string;
  pixelId: string;
  capiStatus: "HEALTHY (Server-Side 100%)" | "DEGRADED" | "DISCONNECTED";
  adSets: MetaAdSet[];
}

export const INITIAL_META_AUDIENCES: MetaCustomAudience[] = [
  {
    id: "AUD-01",
    name: "Past Bookers & High LTV Customers (12 Months)",
    type: "CUSTOMER_CRM_LIST",
    size: 425000,
    matchRatePercent: 88,
    source: "BharatYatra Enterprise CRM SHA256 Sync",
    lastUpdated: "2026-08-27",
  },
  {
    id: "AUD-02",
    name: "Lookalike (1% India) - Top 5% Travel Spenders",
    type: "LOOKALIKE_AUDIENCE",
    size: 2800000,
    matchRatePercent: 94,
    lookalikeRatio: "1% Top Spenders",
    source: "High LTV Seed (₹50k+ booking value)",
    lastUpdated: "2026-08-25",
  },
  {
    id: "AUD-03",
    name: "Website Visitors - Flight & Yatra Search Dropoffs (7 Days)",
    type: "WEBSITE_CUSTOM_AUDIENCE",
    size: 310000,
    matchRatePercent: 91,
    source: "Meta Conversions API (CAPI) & Pixel",
    lastUpdated: "Real-Time (Hourly Sync)",
  },
  {
    id: "AUD-04",
    name: "Instagram & FB Reels Engagers (Watched 95% of video)",
    type: "ENGAGEMENT_REELS",
    size: 890000,
    matchRatePercent: 99,
    source: "BharatYatra Official IG & FB Reels",
    lastUpdated: "2026-08-28",
  },
];

export const INITIAL_META_CAMPAIGNS: MetaCampaign[] = [
  {
    id: "MCAMP-001",
    name: "Meta_Advantage_Leads_Goa_And_Kerala_Luxury_Getaways",
    businessAccountId: "ACT-BIZ-7719284",
    adAccountId: "act_884910283749",
    objective: "LEAD_GENERATION",
    status: "ACTIVE",
    budgetType: "CBO (Campaign Budget Optimization)",
    totalBudgetINR: 450000,
    spendINR: 280000,
    impressions: 610000,
    reach: 412000,
    frequency: 1.48,
    clicks: 29400,
    ctr: 4.82,
    cpcINR: 9.52,
    leadsCount: 1950,
    bookingsCount: 680,
    costPerLeadINR: 143.58,
    costPerBookingINR: 411.76,
    roas: 7.6,
    revenueAttributedINR: 2128000,
    startDate: "2026-08-05",
    endDate: "2026-10-31",
    pixelId: "PIXEL-8849102847",
    capiStatus: "HEALTHY (Server-Side 100%)",
    adSets: [
      {
        id: "MAS-01",
        name: "IG Reels & Stories - Luxury Villa & Private Pool Getaways",
        dailyBudgetINR: 12000,
        placements: ["Instagram Reels", "Instagram Stories", "Facebook Reels"],
        locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Pune", "Hyderabad"],
        ageRange: "24 - 52",
        gender: "All",
        interests: ["Luxury Travel", "Boutique Hotels", "Scuba Diving", "Private Plunge Pools"],
        customAudienceId: "AUD-02",
        bidStrategy: "LOWEST_COST",
        status: "ACTIVE",
        impressions: 390000,
        clicks: 19800,
        conversions: 1320,
        cpaINR: 136.0,
        creatives: [
          {
            id: "CR-01",
            headline: "Escape to Luxury: Private Plunge Pool Villas in Goa & Kerala",
            primaryText: "Direct beach access, private chef on call & complimentary airport pickup. Reserve on BharatYatra with instant zero-cost cancellation.",
            callToAction: "BOOK_NOW",
            format: "Reel Video (9:16)",
            assetUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
            previewUrl: "https://bharatyatra.ai/resorts/goa-luxury",
            leadsCaptured: 1240,
            bookingsAttributed: 440,
          },
        ],
      },
    ],
  },
  {
    id: "MCAMP-002",
    name: "FB_Instant_Forms_Char_Dham_And_Kedarnath_Pilgrim_Inquiries",
    businessAccountId: "ACT-BIZ-7719284",
    adAccountId: "act_884910283749",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    budgetType: "CBO (Campaign Budget Optimization)",
    totalBudgetINR: 320000,
    spendINR: 195000,
    impressions: 480000,
    reach: 320000,
    frequency: 1.5,
    clicks: 18500,
    ctr: 3.85,
    cpcINR: 10.54,
    leadsCount: 1420,
    bookingsCount: 410,
    costPerLeadINR: 137.32,
    costPerBookingINR: 475.6,
    roas: 8.9,
    revenueAttributedINR: 1735500,
    startDate: "2026-07-20",
    endDate: "2026-11-20",
    pixelId: "PIXEL-8849102847",
    capiStatus: "HEALTHY (Server-Side 100%)",
    adSets: [
      {
        id: "MAS-02",
        name: "Facebook Feed & In-Stream - Senior Pilgrimage VIP Groups",
        dailyBudgetINR: 10000,
        placements: ["Facebook Feed", "Instagram Feed"],
        locations: ["Gujarat", "Maharashtra", "Uttar Pradesh", "Rajasthan", "Madhya Pradesh"],
        ageRange: "35 - 65+",
        gender: "All",
        interests: ["Hindu Temple", "Char Dham", "Kedarnath Temple", "Varanasi Ganga Aarti"],
        customAudienceId: "AUD-01",
        bidStrategy: "COST_CAP",
        costCapINR: 160,
        status: "ACTIVE",
        impressions: 480000,
        clicks: 18500,
        conversions: 1420,
        cpaINR: 137.32,
        creatives: [
          {
            id: "CR-02",
            headline: "Kedarnath & Badrinath VIP Yatra 2026 - Government Authorized",
            primaryText: "Helicopter priority tickets, oxygen-equipped heated cottages & medical escort for senior family members. Download complete itinerary booklet.",
            callToAction: "GET_OFFER",
            format: "Carousel (5 Cards)",
            assetUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
            previewUrl: "https://bharatyatra.ai/yatra/kedarnath",
            leadsCaptured: 1420,
            bookingsAttributed: 410,
          },
        ],
      },
    ],
  },
];
