export type CMSPageStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "SCHEDULED"
  | "EXPIRED"
  | "ARCHIVED";

export type CMSSectionType =
  | "HEADER_NAV"
  | "HERO_BANNER"
  | "SEARCH_WIDGET"
  | "TRAVEL_CATEGORIES"
  | "EXPLORE_SECTION"
  | "POPULAR_DESTINATIONS"
  | "FEATURED_PROPERTIES"
  | "TOUR_PACKAGES"
  | "OFFERS_DEALS"
  | "PROMOTIONAL_BANNERS"
  | "TESTIMONIALS_REVIEWS"
  | "BLOG_CONTENT"
  | "APP_DOWNLOAD"
  | "PARTNER_SECTION"
  | "FAQ_ACCORDION"
  | "FOOTER_SECTION";

export interface CMSSectionConfig {
  id: string;
  type: CMSSectionType;
  title?: string;
  subtitle?: string;
  displayOrder: number;
  isVisible: boolean;
  customData?: Record<string, any>;
}

export interface CMSSEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredSchemaType: "TouristDestination" | "TravelAgency" | "Product" | "OfferCatalog" | "FAQPage";
}

export interface CMSLandingPage {
  id: string;
  title: string;
  slug: string; // e.g. "travel", "flights", "hotels", "destinations/goa", "pilgrimage"
  pageType: "HOME" | "SERVICE" | "DESTINATION" | "OFFER" | "CAMPAIGN" | "SPECIAL_TRAVEL";
  description: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  badgeTag?: string;
  themeAccentColor?: string;
  status: CMSPageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  sections: CMSSectionConfig[];
  seo: CMSSEOData;
  createdBy: string;
  updatedAt: string;
}

// ----------------------------------------------------
// 2. EXPLORE CMS DATA MODELS
// ----------------------------------------------------
export type ExploreCategoryGroup =
  | "Destinations"
  | "Experiences"
  | "Travel Services"
  | "Special Travel";

export type ExploreSubCategory =
  // Destinations
  | "Cities"
  | "States"
  | "Beaches"
  | "Mountains"
  | "Heritage"
  // Experiences
  | "Adventure"
  | "Family"
  | "Honeymoon"
  | "Weekend"
  | "Luxury"
  // Travel Services
  | "Flights"
  | "Trains"
  | "Buses"
  | "Hotels"
  | "Cabs"
  | "Tours"
  // Special Travel
  | "Pilgrimage"
  | "Corporate"
  | "Group Tours"
  | "Holiday Packages";

export interface ExploreCMSItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryGroup: ExploreCategoryGroup;
  subCategory: ExploreSubCategory;
  destinationName: string;
  stateOrRegion?: string;
  packagePriceStarting?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  status: CMSPageStatus;
  startDate?: string;
  endDate?: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
}

// ----------------------------------------------------
// 3. OFFERS CMS DATA MODELS
// ----------------------------------------------------
export type CMSOfferType =
  | "FLIGHT"
  | "TRAIN"
  | "BUS"
  | "HOTEL"
  | "RESORT"
  | "TOUR"
  | "PILGRIMAGE"
  | "CAB"
  | "RESTAURANT"
  | "FESTIVAL_SEASONAL";

export interface CMSOfferRecord {
  id: string;
  title: string;
  description: string;
  offerType: CMSOfferType;
  promoCode: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minimumBookingValue: number;
  maximumDiscountCap: number;
  validFrom: string;
  validUntil: string;
  targetCustomer: "ALL" | "FIRST_TIME_USER" | "REPEAT_TRAVELER" | "VIP_MEMBER" | "CORPORATE";
  partner?: string;
  bannerImage: string;
  termsAndConditions: string[];
  displayPriority: number; // 1-10
  status: CMSPageStatus;
  claimedCount: number;
  maxUsageLimit: number;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// ----------------------------------------------------
// 4. RBAC ROLES
// ----------------------------------------------------
export type AdminRole =
  | "SUPER_ADMIN"
  | "CMS_ADMIN"
  | "OFFER_MANAGER"
  | "CONTENT_EDITOR"
  | "REVIEWER";
