export type ReelPlatform = "Instagram" | "Facebook" | "Both (Cross-Post)";
export type ReelStatus = "Draft" | "In Review" | "Approved" | "Scheduled" | "Published";
export type ReelCategory =
  | "Destination Highlights"
  | "Flash Deals & Offers"
  | "Luxury Hotels & Resorts"
  | "Spiritual Pilgrimage (Yatra)"
  | "Flights & Train Secrets"
  | "Food & Dining Guides"
  | "Adventure & Trekking";

export interface ReelConceptScript {
  hook0to3s: string;
  problemBody3to20s: string;
  solutionClimax20to45s: string;
  callToAction45to60s: string;
  soundAudioSuggestion: string;
  visualSceneDirections: string[];
}

export interface TravelReel {
  id: string;
  title: string;
  platform: ReelPlatform;
  category: ReelCategory;
  status: ReelStatus;
  scheduledDate: string; // e.g. "2026-08-30 19:30"
  publishedDate?: string;
  targetAudience: string;
  destination: string;
  thumbnailUrl: string;
  videoDurationSec: number;
  aiConcept: string;
  script: ReelConceptScript;
  caption: string;
  hashtags: string[];
  ctaButtonText: string;
  landingPageUrl: string;
  // Performance metrics
  views: number;
  reach: number;
  engagementRate: number; // %
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  leadsGenerated: number;
  bookingConversions: number;
  revenueAttributedINR: number;
  author: string;
  approvedBy?: string;
}

export interface ReelTemplatePreset {
  id: string;
  name: string;
  category: ReelCategory;
  description: string;
  typicalDuration: string;
  suggestedBpmMusic: string;
  exampleHook: string;
  tags: string[];
  thumbnail: string;
}

export const REEL_TEMPLATE_PRESETS: ReelTemplatePreset[] = [
  {
    id: "TPL-01",
    name: "5 Hidden Places You Didn't Know Existed in [Destination]",
    category: "Destination Highlights",
    description: "High-curiosity viral retention format with fast cuts, drone zooms, and map pin callouts.",
    typicalDuration: "45-55 sec",
    suggestedBpmMusic: "128 BPM Chill Electronic / Indian Instrumental Fusion",
    exampleHook: "Stop going to the same 3 spots in Goa! Here are 5 secret cliffside beaches...",
    tags: ["Viral Hook", "High Saves", "Explore Page Target"],
    thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "TPL-02",
    name: "How to Do Kedarnath VIP Helicopter Yatra Without Waiting 8 Hours",
    category: "Spiritual Pilgrimage (Yatra)",
    description: "Educational authority guide answering top pilgrim pain-points with step-by-step booking walkthrough.",
    typicalDuration: "50-60 sec",
    suggestedBpmMusic: "Spiritual Drone / Sitar Ambient Reverberation",
    exampleHook: "Save this reel before your 2026 Char Dham Yatra or you might get stuck in line!",
    tags: ["High Shareability", "Direct Lead Magnet", "Yatra VIP"],
    thumbnail: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "TPL-03",
    name: "Private Plunge Pool Luxury Resort Under ₹8,999/Night",
    category: "Luxury Hotels & Resorts",
    description: "Aesthetic lifestyle reveal showcasing room tour, floating breakfast, and bathroom tub view.",
    typicalDuration: "35-45 sec",
    suggestedBpmMusic: "Acoustic Lo-Fi Chill / Upbeat Tropical House",
    exampleHook: "We found the most aesthetic private villa in Kerala with its own infinity plunge pool...",
    tags: ["High Bookings", "Couple Travel", "Luxury Bargain"],
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "TPL-04",
    name: "Flight Ticket Secret Hack: How to Avoid High Weekend Fares",
    category: "Flights & Train Secrets",
    description: "Insider booking tip comparing fare calendar charts, price drop alerts, and zero convenience fees.",
    typicalDuration: "40-50 sec",
    suggestedBpmMusic: "Punchy Synthwave / Tech Explainer Beat",
    exampleHook: "Airlines don't want you to know this 48-hour flight fare loophole...",
    tags: ["Mass Reach", "App Installs", "Utility Value"],
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "TPL-05",
    name: "Vande Bharat Sleeper: Everything You Need to Know in 60 Seconds",
    category: "Flights & Train Secrets",
    description: "Fast-paced cabin walkthrough showing berths, automated doors, pantry meals, and live speed ticker.",
    typicalDuration: "55-60 sec",
    suggestedBpmMusic: "Train Rhythm Trap / Fast Percussion",
    exampleHook: "Is the new Vande Bharat Sleeper actually worth the hype? Let's check inside...",
    tags: ["Trending News", "Train Fans", "Viral Tech"],
    thumbnail: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=400&q=80",
  },
];

export const INITIAL_REELS: TravelReel[] = [
  {
    id: "REEL-01",
    title: "5 Secret Cliffside Cafes in North Goa with Sunset Views",
    platform: "Both (Cross-Post)",
    category: "Destination Highlights",
    status: "Published",
    scheduledDate: "2026-08-25 18:30",
    publishedDate: "2026-08-25 18:30",
    targetAudience: "Young Travelers, Couple Getaways, Goa Lovers (Age 20-36)",
    destination: "Goa, India",
    thumbnailUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
    videoDurationSec: 48,
    aiConcept: "Showcase 5 uncrowded sunset viewpoints and secret cliffside shacks in Vagator & Anjuna with approximate meal costs and exact GPS coordinates in caption.",
    script: {
      hook0to3s: "Stop going to crowded Baga beach! Save these 5 secret sunset cliff spots in Goa right now 🌊",
      problemBody3to20s: "Spot #1: A hidden wooden deck tucked behind Ozran rocks where you can watch dolphins at 5:30 PM. Spot #2: An Italian woodfire pizzeria hanging over the cliff edge.",
      solutionClimax20to45s: "Spot #3 & #4 are completely quiet with no loud speakers—just the sound of Arabian sea waves. And Spot #5 has complimentary sunset mocktails when you book your stay via BharatYatra.",
      callToAction45to60s: "Comment 'GOA' and we will DM you the complete Google Maps list + ₹1,000 hotel voucher! Link in bio to book direct on BharatYatra App.",
      soundAudioSuggestion: "Trending Audio: 'Sunset in Anjuna' (Original Audio by BharatYatra)",
      visualSceneDirections: [
        "0-3s: Drone zoom drop over red laterite cliff into crashing turquoise waves.",
        "3-15s: Fast snappy pans of cold artisan cocktails & sunset glow.",
        "15-35s: Table POV looking out at the horizon with golden hour light.",
        "35-48s: BharatYatra App screen showing instant hotel confirmation with zero booking fees.",
      ],
    },
    caption: "Save this for your next Goa trip! 🌴✈️\n\nHere are 5 hidden cliffside spots in Goa that 90% of tourists miss:\n1. Secret Ozran Lookout Deck (Free entry, dolphin spotting)\n2. Cliffside Pizzeria & Sunset Lounge\n3. Morjim Hidden Lagoon Shack\n4. Ashvem Quiet Cove\n5. Vagator Heritage Fort Walk\n\n💡 Pro tip: Book your Goa flights & beachfront stays on the BharatYatra SuperApp to get guaranteed ₹1,200 cashback + free airport transfers! Link in bio 📲",
    hashtags: ["#GoaReels", "#BharatYatra", "#IncredibleIndia", "#GoaDiaries", "#TravelHacks", "#HiddenGoa", "#GoaSunset", "#ExploreIndia"],
    ctaButtonText: "Book Goa Stays on BharatYatra",
    landingPageUrl: "https://bharatyatra.ai/hotels/goa?utm_source=ig_reels&utm_campaign=secret_cliff_cafes",
    views: 482000,
    reach: 395000,
    engagementRate: 9.4,
    likes: 38400,
    comments: 2940,
    shares: 14500,
    saves: 28900,
    leadsGenerated: 1840,
    bookingConversions: 320,
    revenueAttributedINR: 1440000,
    author: "Rhea Sen",
    approvedBy: "Ananya Sharma",
  },
  {
    id: "REEL-02",
    title: "Kedarnath VIP Helicopter Booking: Avoid Fake Fraud Scams",
    platform: "Instagram",
    category: "Spiritual Pilgrimage (Yatra)",
    status: "Scheduled",
    scheduledDate: "2026-08-30 08:00",
    targetAudience: "Pilgrims, Senior Citizen Families, Gujarat & Maharashtra Travelers",
    destination: "Kedarnath Dham, Uttarakhand",
    thumbnailUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    videoDurationSec: 54,
    aiConcept: "Educational PSA on identifying authorized IRCTC/UCADA helicopter tickets vs counterfeit WhatsApp scams, followed by the seamless 1-click VIP booking process on BharatYatra.",
    script: {
      hook0to3s: "⚠️ DON'T book Kedarnath Helicopter tickets on random WhatsApp numbers! Here is the ONLY verified way in 2026.",
      problemBody3to20s: "Every year over 20,000 pilgrims get duped by fake QR codes and unverified agents claiming to give same-day Phata helipad tickets.",
      solutionClimax20to45s: "Always verify the 16-digit biometric UCADA barcode. On BharatYatra, every helicopter pass is directly linked with Uttarakhand Tourism Board with live helipad boarding counters.",
      callToAction45to60s: "Tap the link in bio to check official September & October helicopter slots before registrations close for the season! Jai Bholenath 🙏",
      soundAudioSuggestion: "Devotional Instrumental Sitar & Flute Reverberation",
      visualSceneDirections: [
        "0-4s: Red warning icon overlay on snowy Kedarnath temple backdrop.",
        "4-20s: Split screen comparison between fake WhatsApp slip vs authentic digital QR ticket.",
        "20-40s: Helicopter taking off from Phata helipad over green Himalayan valleys.",
        "40-54s: BharatYatra app interface showing verified booking stamp & medical escort add-on.",
      ],
    },
    caption: "Save this immediately if you or your parents are planning Kedarnath Yatra in 2026! 🙏🏔️\n\nOfficial Helpline & Verified Helicopter Checklist:\n✅ Always verify 16-digit Gov biometric registration\n✅ Never transfer UPI to personal savings accounts\n✅ Book through official authorized partners like BharatYatra\n\nCheck official September/October slots on BharatYatra App now! Link in bio. 🕉️✨",
    hashtags: ["#Kedarnath", "#CharDhamYatra", "#KedarnathTemple", "#BharatYatra", "#HarHarMahadev", "#PilgrimageIndia", "#UttarakhandTourism"],
    ctaButtonText: "Check Helicopter Slots",
    landingPageUrl: "https://bharatyatra.ai/yatra/kedarnath?utm_source=ig_reels&utm_campaign=heli_fraud_psa",
    views: 0,
    reach: 0,
    engagementRate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    leadsGenerated: 0,
    bookingConversions: 0,
    revenueAttributedINR: 0,
    author: "Rhea Sen",
    approvedBy: "Vikram Malhotra",
  },
  {
    id: "REEL-03",
    title: "Alleppey Luxury Houseboat with Private Jacuzzi & Chef",
    platform: "Facebook",
    category: "Luxury Hotels & Resorts",
    status: "Published",
    scheduledDate: "2026-08-22 19:00",
    publishedDate: "2026-08-22 19:00",
    targetAudience: "Family Vacations, Honeymooners, Kerala Enthusiasts",
    destination: "Alleppey Backwaters, Kerala",
    thumbnailUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    videoDurationSec: 42,
    aiConcept: "Sensory ASMR morning boat cruise with Kerala filter coffee, sizzling Karimeen Pollichathu, and glass-front jacuzzi overlooking palm lagoons.",
    script: {
      hook0to3s: "Waking up in the middle of Kerala backwaters inside a glass jacuzzi houseboat... 🥥🌴",
      problemBody3to20s: "Forget ordinary tourist boats. This 5-star private cruiser comes with your own master bedroom, air conditioning 24/7, and a personal chef.",
      solutionClimax20to45s: "Fresh tender coconut at sunrise, traditional Ayurvedic oil massage on board, and freshly caught backwater fish cooked to your spice preference.",
      callToAction45to60s: "Book direct on BharatYatra to get flat 20% early bird monsoon discount. Tap Learn More below to reserve your dates!",
      soundAudioSuggestion: "Kerala Traditional Water Ripples & Soft Acoustic Guitar",
      visualSceneDirections: [
        "0-3s: Morning mist lifting from palm trees as boat glides across mirror-still water.",
        "3-18s: Pouring hot steaming South Indian filter coffee in traditional brass davara.",
        "18-32s: Bedroom window panning out to lush lotus ponds.",
        "32-42s: BharatYatra app verified partner badge & direct booking button.",
      ],
    },
    caption: "Is this the most peaceful vacation in India? 🛶🌴\n\nExperience the legendary Alleppey backwaters in complete luxury:\n✨ Glass-front AC Master Suite\n✨ Upper deck sunset lounge\n✨ Fresh authentic Kerala seafood & vegetarian banquets\n✨ Zero hidden docking fees\n\nBook your private luxury cruise on BharatYatra with instant WhatsApp concierge! Tap Book Now below.",
    hashtags: ["#KeralaTourism", "#AlleppeyHouseboat", "#BharatYatra", "#KeralaBackwaters", "#LuxuryTravelIndia", "#IncredibleIndia", "#KeralaDiaries"],
    ctaButtonText: "Reserve Houseboat Today",
    landingPageUrl: "https://bharatyatra.ai/houseboats/alleppey?utm_source=fb_reels&utm_campaign=luxury_jacuzzi_houseboat",
    views: 310000,
    reach: 245000,
    engagementRate: 8.1,
    likes: 21500,
    comments: 1480,
    shares: 8900,
    saves: 16200,
    leadsGenerated: 1120,
    bookingConversions: 195,
    revenueAttributedINR: 975000,
    author: "Ananya Sharma",
    approvedBy: "Vikram Malhotra",
  },
];
