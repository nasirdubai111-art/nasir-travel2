export interface AiContentPromptInput {
  destination: string;
  category: "Pilgrimage" | "Hotels" | "Resorts" | "Flights" | "Trains" | "Tours" | "Houseboats" | "Cabs" | "Dining" | "General";
  productName: string;
  offerDetails: string;
  targetAudience: string;
  tone: "Luxury & Exclusive" | "Spiritual & Devotional" | "Adventurous & Thrilling" | "Family & Friendly" | "Budget & Value" | "Urgent & High-Converting";
  campaignGoal: "Lead Generation" | "Direct Booking" | "Brand Awareness" | "Festival Flash Sale" | "Weekend Getaway";
}

export type ContentToolType =
  | "campaign_ideas"
  | "travel_content"
  | "ad_copy"
  | "reel_scripts"
  | "captions"
  | "hashtags"
  | "seo_titles"
  | "meta_descriptions"
  | "blog_articles"
  | "cta_generator"
  | "promo_content"
  | "audience_recs"
  | "content_repurposer";

export interface GeneratedContentItem {
  id: string;
  toolType: ContentToolType;
  title: string;
  content: string;
  metadata?: {
    characterCount?: number;
    targetKeywords?: string[];
    recommendedChannels?: string[];
    estimatedEngagementScore?: number;
    suggestedHookTime?: string;
    hookStyle?: string;
  };
  createdAt: string;
  isFavorite?: boolean;
}

export interface AiCampaignRecommendation {
  id: string;
  campaignId: string;
  campaignName: string;
  platform: "Google Ads" | "Meta Ads" | "SEO" | "Reels";
  type: "budget_optimization" | "underperforming_alert" | "high_performing_audience" | "keyword_recommendation" | "ab_test_variant" | "anomaly_detection" | "posting_time";
  title: string;
  description: string;
  currentMetric: string;
  projectedImprovement: string;
  requiresAdminApproval: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  actionPayload?: {
    actionType: "INCREASE_BUDGET" | "DECREASE_BUDGET" | "PAUSE_AD" | "ADD_KEYWORDS" | "SCALE_AUDIENCE";
    suggestedBudgetChange?: number;
    recommendedKeywords?: string[];
  };
}

export interface PredictiveCampaignForecast {
  campaignName: string;
  predictedLeadsMin: number;
  predictedLeadsMax: number;
  conversionProbabilityPercent: number;
  estimatedCplINR: number;
  recommendedBestTime: string;
  recommendedChannels: string[];
}

export const SAMPLE_PROMPT_INPUTS: AiContentPromptInput[] = [
  {
    destination: "Varanasi & Kashi Vishwanath",
    category: "Pilgrimage",
    productName: "Divine Ganga Aarti & Kashi Temple VIP Package",
    offerDetails: "Flat 25% Off + Complimentary Boat Cruise with Vedic Priest Guide",
    targetAudience: "Families, Senior Citizens & Spiritual Seekers (Ages 32–68)",
    tone: "Spiritual & Devotional",
    campaignGoal: "Lead Generation",
  },
  {
    destination: "Goa & Candolim Beach",
    category: "Resorts",
    productName: "Taj Holiday Village Beachfront Villa",
    offerDetails: "Stay 3 Nights Pay for 2 + Free Sunset Cruise & Champagne Dinner",
    targetAudience: "Couples, Honeymooners, High Net-Worth Individuals (Ages 24–45)",
    tone: "Luxury & Exclusive",
    campaignGoal: "Direct Booking",
  },
  {
    destination: "Kashmir (Gulmarg & Srinagar)",
    category: "Houseboats",
    productName: "Luxury Dal Lake Houseboat & Gulmarg Gondola Tour",
    offerDetails: "Book 45 Days in Advance & Get Free Shikara Ride + Kahwa Tasting",
    targetAudience: "Family Vacationers & Nature Enthusiasts (Pan India)",
    tone: "Family & Friendly",
    campaignGoal: "Festival Flash Sale",
  },
  {
    destination: "Manali & Solang Valley",
    category: "Tours",
    productName: "Snow Adventure & Rohtang Pass 4N/5D Expedition",
    offerDetails: "Instant ₹3,500 Cash Discount on Early Bird Group Bookings (4+ Pax)",
    targetAudience: "Youth, College Groups & Adventure Enthusiasts (Ages 18–34)",
    tone: "Adventurous & Thrilling",
    campaignGoal: "Weekend Getaway",
  },
];

export const INITIAL_AI_RECOMMENDATIONS: AiCampaignRecommendation[] = [
  {
    id: "REC-AI-901",
    campaignId: "CAMP-GOOG-01",
    campaignName: "Google Search - Chardham Yatra 2026",
    platform: "Google Ads",
    type: "budget_optimization",
    title: "Scale Daily Budget: High Search Intent & 8.4x ROAS",
    description: "Search impression share is capped at 64% due to daily budget ceiling of ₹3,500. Quality Score is 9/10 with CPA ₹280 vs target ₹450.",
    currentMetric: "ROAS: 8.4x | Lost IS (Budget): 36%",
    projectedImprovement: "+42 Qualified Leads/week (+₹3.8L Booking GMV)",
    requiresAdminApproval: true,
    approvalStatus: "pending",
    actionPayload: {
      actionType: "INCREASE_BUDGET",
      suggestedBudgetChange: 2000,
    },
  },
  {
    id: "REC-AI-902",
    campaignId: "CAMP-META-02",
    campaignName: "Meta Feed - Goa Luxury Resorts Flash Sale",
    platform: "Meta Ads",
    type: "underperforming_alert",
    title: "Ad Fatigue Detected on Creative Variant B (Video)",
    description: "Frequency has reached 4.2 in Metro Cities cohort. CTR dropped from 3.8% to 1.1% over past 72 hours, causing CPL to increase by 48%.",
    currentMetric: "CTR: 1.1% (Down 71%) | CPL: ₹480",
    projectedImprovement: "Reduce wasted ad spend by ₹14,200 & restore CPL to ₹240",
    requiresAdminApproval: false,
    approvalStatus: "approved",
    actionPayload: {
      actionType: "PAUSE_AD",
    },
  },
  {
    id: "REC-AI-903",
    campaignId: "CAMP-REEL-04",
    campaignName: "Instagram Reels - Kerala Backwaters Houseboat",
    platform: "Reels",
    type: "high_performing_audience",
    title: "High-Intent Lookalike 1% (South India Couples) Spiking",
    description: "Engagement rate is 14.8% with 1,280 saves and 38 direct WhatsApp lead inquiries within 24 hours of reel launch.",
    currentMetric: "Engagement Rate: 14.8% | Saves: 1,280",
    projectedImprovement: "Expand targeting to Tier-1 Pan India lookalike (+1.4M Reach)",
    requiresAdminApproval: false,
    approvalStatus: "pending",
    actionPayload: {
      actionType: "SCALE_AUDIENCE",
    },
  },
  {
    id: "REC-AI-904",
    campaignId: "CAMP-SEO-05",
    campaignName: "SEO Cluster - Kedarnath Helicopter Booking Guide",
    platform: "SEO",
    type: "keyword_recommendation",
    title: "High Search Surge Keyword: 'IRCTC Kedarnath Heli Booking 2026 Date'",
    description: "Zero competition currently on long-tail intent keyword with 49.5k monthly search volume surge starting this week.",
    currentMetric: "Search Volume: 49.5k/mo | KD: 18 (Easy)",
    projectedImprovement: "Capture Rank #1 within 5 days & drive 12k organic visitors",
    requiresAdminApproval: false,
    approvalStatus: "pending",
    actionPayload: {
      actionType: "ADD_KEYWORDS",
      recommendedKeywords: [
        "IRCTC Kedarnath Heli Booking 2026 Date",
        "Helicopter fare Phata to Kedarnath 2026",
        "Same day Kedarnath Darshan chopper ticket",
      ],
    },
  },
  {
    id: "REC-AI-905",
    campaignId: "CAMP-GOOG-03",
    campaignName: "Google PMax - Kashmir Family Packages",
    platform: "Google Ads",
    type: "ab_test_variant",
    title: "Deploy Dynamic Price-Anchor Headline Variant",
    description: "AI recommends testing headline: 'Starting ₹14,999 with Free Shikara Ride' vs generic 'Best Kashmir Tour Packages 2026'.",
    currentMetric: "Baseline CTR: 2.9%",
    projectedImprovement: "Expected +34% Click-to-Lead conversion rate",
    requiresAdminApproval: false,
    approvalStatus: "approved",
  },
];

export const PREDICTIVE_FORECASTS: PredictiveCampaignForecast[] = [
  {
    campaignName: "Chardham Yatra Pilgrimage VIP",
    predictedLeadsMin: 140,
    predictedLeadsMax: 195,
    conversionProbabilityPercent: 28.5,
    estimatedCplINR: 280,
    recommendedBestTime: "Daily 07:00 AM – 10:30 AM & 07:00 PM – 09:30 PM",
    recommendedChannels: ["Google Search (PMax)", "Meta Lead Gen Form", "WhatsApp Broadcast"],
  },
  {
    campaignName: "Goa Luxury Beachfront Villas",
    predictedLeadsMin: 85,
    predictedLeadsMax: 130,
    conversionProbabilityPercent: 22.0,
    estimatedCplINR: 340,
    recommendedBestTime: "Thursdays & Fridays 06:00 PM – 11:30 PM",
    recommendedChannels: ["Instagram Reels", "Meta Feed Carousel", "Google Display Remarketing"],
  },
  {
    campaignName: "Kashmir Houseboat & Gondola",
    predictedLeadsMin: 110,
    predictedLeadsMax: 160,
    conversionProbabilityPercent: 24.8,
    estimatedCplINR: 310,
    recommendedBestTime: "Saturdays & Sundays 11:00 AM – 04:00 PM",
    recommendedChannels: ["Facebook Reels", "Google Search", "YouTube Shorts"],
  },
];
