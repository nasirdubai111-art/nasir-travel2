export type ThumbnailCategory =
  | "Destination"
  | "Hotel"
  | "Resort"
  | "Tour Package"
  | "Pilgrimage"
  | "Flight Offer"
  | "Train Offer"
  | "Bus Offer"
  | "Festival Creative"
  | "Facebook Reel Cover"
  | "Instagram Reel Cover"
  | "Blog Thumbnail"
  | "Advertisement Creative";

export type AspectRatioType = "1:1" | "9:16" | "16:9" | "4:5" | "1.91:1";

export interface ThumbnailCreativeItem {
  id: string;
  category: ThumbnailCategory;
  title: string;
  destination: string;
  subtitle: string;
  priceTagText?: string;
  discountBadgeText?: string;
  ctaText: string;
  imageUrl: string;
  aspectRatio: AspectRatioType;
  themeStyle: "gradient_dark" | "luxury_gold" | "vibrant_festival" | "minimal_clean" | "spiritual_saffron" | "adventure_neon";
  brandLogoVisible: boolean;
  brandLogoPosition: "top_left" | "top_right" | "bottom_left" | "bottom_right";
  status: "Draft" | "Pending_Approval" | "Approved" | "Rejected";
  versionsCount: number;
  tags: string[];
  dimensions: string;
  createdAt: string;
}

export interface ThumbnailTemplatePreset {
  id: string;
  name: string;
  category: ThumbnailCategory;
  recommendedAspectRatio: AspectRatioType;
  defaultBadge: string;
  defaultCta: string;
  defaultTheme: "gradient_dark" | "luxury_gold" | "vibrant_festival" | "minimal_clean" | "spiritual_saffron" | "adventure_neon";
  sampleImage: string;
  headlinePattern: string;
}

export const THUMBNAIL_TEMPLATES: ThumbnailTemplatePreset[] = [
  {
    id: "TMPL-01",
    name: "Divine Pilgrimage VIP Yatra",
    category: "Pilgrimage",
    recommendedAspectRatio: "16:9",
    defaultBadge: "VIP HELICOPTER & PUJA",
    defaultCta: "Book Sacred Darshan",
    defaultTheme: "spiritual_saffron",
    sampleImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Chardham Yatra 2026 Registration Open",
  },
  {
    id: "TMPL-02",
    name: "Luxury 5-Star Beach Resort",
    category: "Resort",
    recommendedAspectRatio: "4:5",
    defaultBadge: "FLAT 35% OFF • ALL-INCLUSIVE",
    defaultCta: "Reserve Luxury Suite",
    defaultTheme: "luxury_gold",
    sampleImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Candolim Oceanfront Villa Staycation",
  },
  {
    id: "TMPL-03",
    name: "Viral Vertical Instagram Reel Cover",
    category: "Instagram Reel Cover",
    recommendedAspectRatio: "9:16",
    defaultBadge: "TOP 5 SECRET SPOTS",
    defaultCta: "Watch Reel",
    defaultTheme: "adventure_neon",
    sampleImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Hidden Waterfall Paradise in Meghalaya",
  },
  {
    id: "TMPL-04",
    name: "Kashmir Houseboat & Gondola Tour",
    category: "Tour Package",
    recommendedAspectRatio: "1:1",
    defaultBadge: "COMPLIMENTARY SHIKARA RIDE",
    defaultCta: "Claim Tour Voucher",
    defaultTheme: "gradient_dark",
    sampleImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Srinagar & Gulmarg 5D/4N Dream Yatra",
  },
  {
    id: "TMPL-05",
    name: "Diwali & Festival Mega Flight Sale",
    category: "Flight Offer",
    recommendedAspectRatio: "1.91:1",
    defaultBadge: "FLIGHTS FROM ₹1,499",
    defaultCta: "Search Flights",
    defaultTheme: "vibrant_festival",
    sampleImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Domestic Festive Airfare Dhamaka",
  },
  {
    id: "TMPL-06",
    name: "Vande Bharat Express Premium Train",
    category: "Train Offer",
    recommendedAspectRatio: "16:9",
    defaultBadge: "0% PAYMENT CONVENIENCE FEE",
    defaultCta: "Book Train Ticket",
    defaultTheme: "minimal_clean",
    sampleImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    headlinePattern: "Confirm Tatkal Seat Guarantee",
  },
];

export const INITIAL_CREATIVE_ITEMS: ThumbnailCreativeItem[] = [
  {
    id: "THUMB-101",
    category: "Pilgrimage",
    title: "Kedarnath & Badrinath VIP Yatra 2026",
    destination: "Kedarnath, Uttarakhand",
    subtitle: "Helicopter Darshan • 4-Star Stay • Vedic Priest",
    priceTagText: "₹24,999 / person",
    discountBadgeText: "EARLY BIRD ₹3,000 OFF",
    ctaText: "Book Yatra Now",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "16:9",
    themeStyle: "spiritual_saffron",
    brandLogoVisible: true,
    brandLogoPosition: "top_left",
    status: "Approved",
    versionsCount: 3,
    tags: ["Chardham", "Pilgrimage", "Helicopter", "Google PMax"],
    dimensions: "1920 x 1080 px",
    createdAt: "2026-08-27",
  },
  {
    id: "THUMB-102",
    category: "Instagram Reel Cover",
    title: "5 Things You MUST NOT Do in Manali",
    destination: "Manali, Himachal Pradesh",
    subtitle: "Avoid Tourist Scams & Traffic Jams",
    priceTagText: "Free Guide",
    discountBadgeText: "VIRAL REEL #1",
    ctaText: "Watch Video",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "9:16",
    themeStyle: "adventure_neon",
    brandLogoVisible: true,
    brandLogoPosition: "top_right",
    status: "Approved",
    versionsCount: 2,
    tags: ["Manali", "Reels Cover", "Travel Tips", "Organic Viral"],
    dimensions: "1080 x 1920 px",
    createdAt: "2026-08-26",
  },
  {
    id: "THUMB-103",
    category: "Resort",
    title: "Goa Luxury Beachside Escape",
    destination: "Goa (North & South)",
    subtitle: "Private Infinity Pool • Candlelight Dinners",
    priceTagText: "₹8,499 / night",
    discountBadgeText: "STAY 3 PAY 2",
    ctaText: "Check Availability",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "4:5",
    themeStyle: "luxury_gold",
    brandLogoVisible: true,
    brandLogoPosition: "bottom_right",
    status: "Pending_Approval",
    versionsCount: 1,
    tags: ["Goa", "Meta Feed", "Luxury", "Couple Getaway"],
    dimensions: "1080 x 1350 px",
    createdAt: "2026-08-28",
  },
  {
    id: "THUMB-104",
    category: "Tour Package",
    title: "Dal Lake Houseboat & Shikara Magic",
    destination: "Srinagar, Kashmir",
    subtitle: "Cedarwood Heritage Suite • Fresh Wazwan Meal",
    priceTagText: "₹18,500 all-incl",
    discountBadgeText: "FREE GONDOLA TICKET",
    ctaText: "Explore Package",
    imageUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "1:1",
    themeStyle: "gradient_dark",
    brandLogoVisible: true,
    brandLogoPosition: "top_left",
    status: "Approved",
    versionsCount: 4,
    tags: ["Kashmir", "Houseboat", "Instagram Ad", "Family Tour"],
    dimensions: "1080 x 1080 px",
    createdAt: "2026-08-25",
  },
  {
    id: "THUMB-105",
    category: "Flight Offer",
    title: "Mega Airfare Sale: Mumbai ⇄ Goa",
    destination: "Pan-India Airports",
    subtitle: "Baggage Included • Free Date Reschedule",
    priceTagText: "Fares ₹1,899*",
    discountBadgeText: "LIMITED 200 SEATS",
    ctaText: "Book Cheap Flight",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "1.91:1",
    themeStyle: "vibrant_festival",
    brandLogoVisible: true,
    brandLogoPosition: "top_right",
    status: "Draft",
    versionsCount: 1,
    tags: ["Flights", "Meta Link Ad", "Flash Sale"],
    dimensions: "1200 x 628 px",
    createdAt: "2026-08-28",
  },
];
