export type TravelSeoCategory =
  | "India destinations"
  | "Cities"
  | "Hotels"
  | "Resorts"
  | "Pilgrimage"
  | "Tours"
  | "Flights"
  | "Trains"
  | "Buses"
  | "Cabs"
  | "Restaurants"
  | "Houseboats"
  | "Travel packages";

export interface DestinationSeoRecord {
  id: string;
  category: TravelSeoCategory;
  destination: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  currentRank: number;
  rankChange7d: number;
  monthlySearchVolume: number;
  cpcValueINR: number;
  keywordDifficulty: "Easy" | "Medium" | "Hard";
  searchIntent: "Transactional" | "Commercial" | "Informational" | "Navigational";
  targetUrl: string;
  metaTitle: string;
  metaDescription: string;
  h1Tag: string;
  h2Tags: string[];
  canonicalUrl: string;
  competitorRanks: {
    makeMyTripRank: number;
    yatraRank: number;
    easeMyTripRank: number;
  };
  schemaType: "TouristDestination" | "Hotel" | "Trip" | "FAQPage" | "LodgingBusiness";
  structuredDataJsonLd: string;
  internalLinksCount: number;
  imageAltTagsCount: number;
  coreWebVitalsScore: number; // 0 - 100
  mobileFriendlyStatus: "PASSED" | "WARNING" | "FAILED";
  lastCrawledDate: string;
}

export interface TechnicalSeoAudit {
  indexedPages: number;
  pagesWithSchema: number;
  sitemapXmlUrlsCount: number;
  canonicalErrors: number;
  brokenLinks404: number;
  mobileUsabilityPercent: number;
  averageLcpSeconds: number;
  averageClsScore: number;
  robotsTxtStatus: "HEALTHY" | "BLOCKED";
}

export const INITIAL_TECHNICAL_SEO_AUDIT: TechnicalSeoAudit = {
  indexedPages: 14850,
  pagesWithSchema: 14200,
  sitemapXmlUrlsCount: 15120,
  canonicalErrors: 0,
  brokenLinks404: 3,
  mobileUsabilityPercent: 99.4,
  averageLcpSeconds: 1.4,
  averageClsScore: 0.02,
  robotsTxtStatus: "HEALTHY",
};

export const INITIAL_SEO_RECORDS: DestinationSeoRecord[] = [
  {
    id: "SEO-DEST-01",
    category: "Pilgrimage",
    destination: "Kedarnath Dham, Uttarakhand",
    primaryKeyword: "kedarnath helicopter booking 2026",
    secondaryKeywords: ["char dham yatra vip pass", "phata to kedarnath heli ticket", "kedarnath temple packages"],
    currentRank: 1,
    rankChange7d: 0,
    monthlySearchVolume: 245000,
    cpcValueINR: 28.5,
    keywordDifficulty: "Medium",
    searchIntent: "Transactional",
    targetUrl: "https://bharatyatra.ai/yatra/kedarnath",
    metaTitle: "Kedarnath Helicopter Booking 2026 | Verified UCADA Slots & VIP Packages - BharatYatra",
    metaDescription: "Book authorized 2026 Kedarnath helicopter tickets from Phata, Sirsi & Guptkashi. Government approved booking partner with heated cottage stay & priority darshan pass.",
    h1Tag: "Official Kedarnath Helicopter & VIP Pilgrimage Booking 2026",
    h2Tags: [
      "Helicopter Routes & Phata/Sirsi Helipad Schedule",
      "UCADA Barcode & Biometric Registration Verification",
      "Heated Cottages & Medical Assistance Facilities",
      "Frequently Asked Questions (FAQ)",
    ],
    canonicalUrl: "https://bharatyatra.ai/yatra/kedarnath",
    competitorRanks: {
      makeMyTripRank: 3,
      yatraRank: 4,
      easeMyTripRank: 6,
    },
    schemaType: "TouristDestination",
    structuredDataJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: "Kedarnath Temple VIP Pilgrimage",
        description: "Official authorized booking portal for Kedarnath helicopter tickets and VIP darshan yatra.",
        touristType: ["Spiritual Pilgrims", "Religious Heritage", "Himalayan Trekking"],
        provider: {
          "@type": "TravelAgency",
          name: "BharatYatra SuperApp",
          url: "https://bharatyatra.ai",
          priceRange: "₹₹₹",
        },
      },
      null,
      2
    ),
    internalLinksCount: 42,
    imageAltTagsCount: 16,
    coreWebVitalsScore: 98,
    mobileFriendlyStatus: "PASSED",
    lastCrawledDate: "2026-08-28 04:12:00",
  },
  {
    id: "SEO-DEST-02",
    category: "Flights",
    destination: "Delhi to Goa Air Route",
    primaryKeyword: "delhi to goa flight ticket lowest price",
    secondaryKeywords: ["cheap flights to goa from delhi", "non stop delhi goa airfare", "delhi goa flight deals"],
    currentRank: 2,
    rankChange7d: 1,
    monthlySearchVolume: 380000,
    cpcValueINR: 16.2,
    keywordDifficulty: "Hard",
    searchIntent: "Transactional",
    targetUrl: "https://bharatyatra.ai/flights/delhi-to-goa",
    metaTitle: "Delhi to Goa Flights from ₹3,499 | Zero Convenience Fee - BharatYatra",
    metaDescription: "Search & compare all airlines flying from Delhi (DEL) to Goa (GOI/GOX). Instant ₹800 cashback, free seat selection & 100% GST invoice reconciliation.",
    h1Tag: "Delhi to Goa Flights - Lowest Airfare Guaranteed",
    h2Tags: [
      "Delhi to Goa Flight Schedule & Duration",
      "Direct Non-Stop Airlines (IndiGo, Air India, Akasa, Vistara)",
      "Zero Convenience Fee & Corporate GST Benefits",
    ],
    canonicalUrl: "https://bharatyatra.ai/flights/delhi-to-goa",
    competitorRanks: {
      makeMyTripRank: 1,
      yatraRank: 3,
      easeMyTripRank: 4,
    },
    schemaType: "Trip",
    structuredDataJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Trip",
        name: "Delhi to Goa Flight Route",
        arrivalTime: "2h 35m Non-Stop",
        provider: {
          "@type": "TravelAgency",
          name: "BharatYatra Flights",
        },
      },
      null,
      2
    ),
    internalLinksCount: 68,
    imageAltTagsCount: 12,
    coreWebVitalsScore: 96,
    mobileFriendlyStatus: "PASSED",
    lastCrawledDate: "2026-08-28 05:30:00",
  },
  {
    id: "SEO-DEST-03",
    category: "Houseboats",
    destination: "Alleppey Backwaters, Kerala",
    primaryKeyword: "luxury houseboat in alleppey with jacuzzi",
    secondaryKeywords: ["alleppey boat house private pool", "kerala backwater cruise booking", "5 star houseboat alleppey tariff"],
    currentRank: 1,
    rankChange7d: 0,
    monthlySearchVolume: 92000,
    cpcValueINR: 22.0,
    keywordDifficulty: "Easy",
    searchIntent: "Commercial",
    targetUrl: "https://bharatyatra.ai/houseboats/alleppey",
    metaTitle: "Luxury Alleppey Houseboats with Jacuzzi | Private Chef & AC - BharatYatra",
    metaDescription: "Experience 5-star Kerala backwaters in ultra-luxury houseboats featuring glass jacuzzis, upper sunset decks, and traditional Kerala seafood banquets. Book verified cruises.",
    h1Tag: "Ultra Luxury Alleppey Houseboats & Private Backwater Cruises",
    h2Tags: [
      "1, 2, 3 & 4 Bedroom Premium Glass Jacuzzi Houseboats",
      "Traditional Kerala Cuisine Onboard Menu",
      "Overnight Cruise Route (Punnamada Lake & Kuttanad Lagoons)",
    ],
    canonicalUrl: "https://bharatyatra.ai/houseboats/alleppey",
    competitorRanks: {
      makeMyTripRank: 4,
      yatraRank: 5,
      easeMyTripRank: 7,
    },
    schemaType: "Hotel",
    structuredDataJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: "Alleppey Luxury Houseboat Fleet",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Alleppey",
          addressRegion: "Kerala",
          addressCountry: "India",
        },
        starRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
      },
      null,
      2
    ),
    internalLinksCount: 35,
    imageAltTagsCount: 20,
    coreWebVitalsScore: 99,
    mobileFriendlyStatus: "PASSED",
    lastCrawledDate: "2026-08-27 22:15:00",
  },
  {
    id: "SEO-DEST-04",
    category: "Hotels",
    destination: "Udaipur, Rajasthan",
    primaryKeyword: "lake view heritage hotels in udaipur",
    secondaryKeywords: ["udaipur palace hotels with lake pichola view", "5 star luxury haveli udaipur", "udaipur boutique resorts"],
    currentRank: 2,
    rankChange7d: 0,
    monthlySearchVolume: 140000,
    cpcValueINR: 24.5,
    keywordDifficulty: "Medium",
    searchIntent: "Commercial",
    targetUrl: "https://bharatyatra.ai/hotels/udaipur",
    metaTitle: "Lake View Heritage Hotels in Udaipur | Direct Lake Pichola - BharatYatra",
    metaDescription: "Discover royal heritage palace stays and boutique havelis in Udaipur with panoramic Lake Pichola views, candlelit rooftop dining & authentic Rajasthani hospitality.",
    h1Tag: "Lake View Heritage Hotels & Royal Palaces in Udaipur",
    h2Tags: [
      "Top Heritage Havelis Overlooking Lake Pichola",
      "Rooftop Sunset Restaurants & Cultural Folk Shows",
      "Exclusive BharatYatra VIP Guest Benefits",
    ],
    canonicalUrl: "https://bharatyatra.ai/hotels/udaipur",
    competitorRanks: {
      makeMyTripRank: 1,
      yatraRank: 2,
      easeMyTripRank: 5,
    },
    schemaType: "Hotel",
    structuredDataJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: "Udaipur Lake View Heritage Hotels",
      },
      null,
      2
    ),
    internalLinksCount: 54,
    imageAltTagsCount: 18,
    coreWebVitalsScore: 97,
    mobileFriendlyStatus: "PASSED",
    lastCrawledDate: "2026-08-28 01:00:00",
  },
  {
    id: "SEO-DEST-05",
    category: "Trains",
    destination: "Vande Bharat Express Routes",
    primaryKeyword: "vande bharat sleeper train booking online",
    secondaryKeywords: ["vande bharat express ticket fare", "vande bharat route map 2026", "irctc vande bharat tatkal booking"],
    currentRank: 1,
    rankChange7d: 0,
    monthlySearchVolume: 520000,
    cpcValueINR: 12.0,
    keywordDifficulty: "Medium",
    searchIntent: "Transactional",
    targetUrl: "https://bharatyatra.ai/trains/vande-bharat",
    metaTitle: "Vande Bharat Sleeper & Chair Car Train Booking | Live Seat Availability - BharatYatra",
    metaDescription: "Book Vande Bharat Express tickets with confirmed seat prediction, zero gateway charges, live train running status, and instant IRCTC PNR confirmation.",
    h1Tag: "Vande Bharat Train Booking & Live Running Status 2026",
    h2Tags: [
      "Vande Bharat Sleeper & Chair Car Routes & Timetables",
      "Confirmed Seat Guarantee & Smart Waitlist Predictor",
      "Executive AC Chair Car & Sleeper Cabin Amenities",
    ],
    canonicalUrl: "https://bharatyatra.ai/trains/vande-bharat",
    competitorRanks: {
      makeMyTripRank: 2,
      yatraRank: 4,
      easeMyTripRank: 3,
    },
    schemaType: "Trip",
    structuredDataJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Trip",
        name: "Vande Bharat Express High Speed Network",
      },
      null,
      2
    ),
    internalLinksCount: 82,
    imageAltTagsCount: 14,
    coreWebVitalsScore: 98,
    mobileFriendlyStatus: "PASSED",
    lastCrawledDate: "2026-08-28 03:45:00",
  },
];
