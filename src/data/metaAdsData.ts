export interface MetaAdCampaign {
  id: string;
  name: string;
  objective: "CONVERSIONS" | "CATALOG_SALES" | "LEAD_GENERATION" | "TRAFFIC";
  status: "ACTIVE" | "PAUSED" | "LEARNING";
  budgetPerDay: number;
  spendToDate: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpa: number;
  roas: number;
  conversions: number;
  targetCategory: string;
  adCreative: {
    headline: string;
    description: string;
    ctaText: string;
    imageUrl: string;
  };
}

export interface CapiEventLog {
  eventId: string;
  eventName: "Purchase" | "InitiateCheckout" | "ViewContent" | "Lead" | "Search";
  timestamp: string;
  leadId: string;
  value: number;
  currency: string;
  serverMatchQuality: number; // 0-100%
  status: "SUCCESS_DEDUPLICATED" | "SENT_REALTIME" | "BATCHED";
}

export const META_CAMPAIGNS_DATA: MetaAdCampaign[] = [
  {
    id: "CAMP-FB-01",
    name: "Winter Kashmir Snowfall Retargeting (CAPI Pixel)",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    budgetPerDay: 25000,
    spendToDate: 485000,
    impressions: 642000,
    clicks: 34100,
    ctr: 5.31,
    cpa: 820,
    roas: 9.4,
    conversions: 591,
    targetCategory: "Resorts & Flights",
    adCreative: {
      headline: "Live Snowfall in Gulmarg: Stay at Luxury Chalets from ₹8,999/night",
      description: "Direct Gondola Phase-1 access, heated wooden chalets & complimentary breakfast.",
      ctaText: "Book Now on WhatsApp",
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "CAMP-FB-02",
    name: "Kerala Monsoon & Luxury Houseboat Escapes",
    objective: "LEAD_GENERATION",
    status: "ACTIVE",
    budgetPerDay: 18000,
    spendToDate: 310000,
    impressions: 480000,
    clicks: 22800,
    ctr: 4.75,
    cpa: 640,
    roas: 8.2,
    conversions: 484,
    targetCategory: "Houseboats",
    adCreative: {
      headline: "Private Jacuzzi Houseboat in Alleppey with Personal Chef",
      description: "Cruise the emerald palm canals. Real-time availability & instant voucher.",
      ctaText: "Chat with Destination Expert",
      imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "CAMP-FB-03",
    name: "Char Dham Yatra 2026 VIP Helicopter Passes",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    budgetPerDay: 35000,
    spendToDate: 840000,
    impressions: 980000,
    clicks: 56000,
    ctr: 5.71,
    cpa: 1450,
    roas: 12.8,
    conversions: 579,
    targetCategory: "Pilgrimage / Yatra",
    adCreative: {
      headline: "Fly to Kedarnath & Badrinath in 2 Days — Dehradun Departure",
      description: "VIP Darshan, luxury mountain stays, oxygen concierge & doctor-on-call.",
      ctaText: "Claim VIP Seat",
      imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
    },
  },
];

export const CAPI_EVENT_STREAM: CapiEventLog[] = [
  {
    eventId: "CAPI-EVT-9041",
    eventName: "Purchase",
    timestamp: "Just now",
    leadId: "LEAD-905",
    value: 64000,
    currency: "INR",
    serverMatchQuality: 98,
    status: "SUCCESS_DEDUPLICATED",
  },
  {
    eventId: "CAPI-EVT-9042",
    eventName: "InitiateCheckout",
    timestamp: "2 mins ago",
    leadId: "LEAD-901",
    value: 245000,
    currency: "INR",
    serverMatchQuality: 94,
    status: "SENT_REALTIME",
  },
  {
    eventId: "CAPI-EVT-9043",
    eventName: "Lead",
    timestamp: "6 mins ago",
    leadId: "LEAD-902",
    value: 180000,
    currency: "INR",
    serverMatchQuality: 96,
    status: "SUCCESS_DEDUPLICATED",
  },
];
