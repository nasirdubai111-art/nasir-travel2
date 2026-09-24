import React, { useState } from "react";
import {
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Palmtree,
  Landmark,
  Compass,
  ArrowRight,
  ShieldCheck,
  Tag,
  Star,
  Clock,
  Calendar,
  Heart,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Flame,
  HelpCircle,
  Zap,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  Users,
  CreditCard,
  Layers,
  Award,
} from "lucide-react";
import { ServiceCategory } from "../../types";
import { AiTravelSearch } from "../search/AiTravelSearch";
import { TravelCategoryCard } from "../common/TravelCategoryCard";
import { DestinationCard } from "../common/DestinationCard";
import { OfferCard } from "../common/OfferCard";
import { ParsedTravelIntent } from "../../utils/aiIntentParser";

interface LandingPageMasterViewProps {
  currentLocation: string;
  onSelectCategory: (category: ServiceCategory) => void;
  onInitiateBooking: (item: any, category: ServiceCategory) => void;
  onOpenSearchModal: () => void;
  onOpenOffersModal: () => void;
  onOpenPriceWatch: () => void;
  onOpenAIDrawer?: (initialPrompt?: string) => void;
  onExecuteIntent?: (intent: ParsedTravelIntent) => void;
  onOpenPartnerSubscription?: () => void;
}

export function LandingPageMasterView({
  currentLocation,
  onSelectCategory,
  onInitiateBooking,
  onOpenSearchModal,
  onOpenOffersModal,
  onOpenPriceWatch,
  onOpenAIDrawer = () => {},
  onExecuteIntent,
  onOpenPartnerSubscription = () => {},
}: LandingPageMasterViewProps) {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState<string>("hotels");

  // Core Travel Category Shortcuts
  const travelCategories: Array<{
    id: ServiceCategory;
    name: string;
    hindiName: string;
    tagline: string;
    iconName: string;
    badge?: string;
    highlightText: string;
  }> = [
    {
      id: "flights",
      name: "Flights",
      hindiName: "उड़ानें",
      tagline: "Domestic & global airlines with zero convenience fee deals",
      iconName: "Plane",
      badge: "Instant E-Ticket",
      highlightText: "Compare 150+ routes",
    },
    {
      id: "trains",
      name: "Trains",
      hindiName: "रेलवे",
      tagline: "IRCTC Vande Bharat, Tatkal availability & PNR status tracking",
      iconName: "Train",
      badge: "Authorized IRCTC",
      highlightText: "Confirmed seat predictor",
    },
    {
      id: "buses",
      name: "Buses",
      hindiName: "बसें",
      tagline: "Luxury AC multi-axle sleepers & government RTC state networks",
      iconName: "Bus",
      badge: "Live GPS Track",
      highlightText: "50,000+ daily routes",
    },
    {
      id: "hotels",
      name: "Hotels",
      hindiName: "होटल",
      tagline: "Verified city stays, business hotels & heritage havelis",
      iconName: "Building2",
      badge: "Free Cancellation",
      highlightText: "Verified reviews & photos",
    },
    {
      id: "resorts",
      name: "Resorts",
      hindiName: "रिसॉर्ट्स",
      tagline: "Private pool villas, wellness retreats & plantation hideaways",
      iconName: "Palmtree",
      badge: "Luxury Handpicked",
      highlightText: "Exclusive weekend deals",
    },
    {
      id: "lodges",
      name: "Safari Lodges",
      hindiName: "जंगल लॉज",
      tagline: "National park tiger reserves & rainforest eco-cabins",
      iconName: "TreePine",
      badge: "Naturalist Guided",
      highlightText: "Corbett, Ranthambore, Kabini",
    },
    {
      id: "tours",
      name: "Tours & Trips",
      hindiName: "पर्यटन",
      tagline: "Curated all-inclusive holiday itineraries across India",
      iconName: "Compass",
      badge: "Best Seller",
      highlightText: "Customizable circuits",
    },
    {
      id: "pilgrimage",
      name: "Pilgrimage",
      hindiName: "तीर्थ यात्रा",
      tagline: "Sacred darshan passes, temple accommodations & satvik dining",
      iconName: "Landmark",
      badge: "VIP Darshan",
      highlightText: "Tirupati, Kashi, Chardham",
    },
  ];

  // Popular Destinations (Goa, Varanasi, Jaipur, Kerala, Manali, Kashmir, Tirupati)
  const popularDestinations = [
    {
      id: "dest-goa",
      name: "Goa",
      state: "Goa",
      tagline: "Sun-drenched beaches, Portuguese villas & coastal sunsets",
      coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 3420,
      idealDuration: "4-5 Days",
      bestTimeToVisit: "Nov - Feb",
      startingPrice: 5999,
      tags: ["Beaches", "Nightlife", "Water Sports"],
      category: "tours" as ServiceCategory,
    },
    {
      id: "dest-varanasi",
      name: "Varanasi (Kashi)",
      state: "Uttar Pradesh",
      tagline: "Sacred Ganga evening aarti, ancient ghats & spiritual aura",
      coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2890,
      idealDuration: "3 Days",
      bestTimeToVisit: "Oct - Mar",
      startingPrice: 4299,
      tags: ["Spiritual", "Heritage", "Ganga Aarti"],
      category: "pilgrimage" as ServiceCategory,
    },
    {
      id: "dest-kerala",
      name: "Kerala Backwaters",
      state: "Kerala",
      tagline: "Tranquil Alleppey houseboats, Munnar tea hills & spice groves",
      coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 4120,
      idealDuration: "5-6 Days",
      bestTimeToVisit: "Sep - Mar",
      startingPrice: 8499,
      tags: ["Backwaters", "Nature", "Ayurveda"],
      category: "tours" as ServiceCategory,
    },
    {
      id: "dest-jaipur",
      name: "Jaipur (Pink City)",
      state: "Rajasthan",
      tagline: "Amer Fort, royal havelis, rich bazaars & regal hospitality",
      coverImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: 2150,
      idealDuration: "3 Days",
      bestTimeToVisit: "Oct - Mar",
      startingPrice: 3899,
      tags: ["Royal Heritage", "Forts", "Palaces"],
      category: "hotels" as ServiceCategory,
    },
    {
      id: "dest-kashmir",
      name: "Kashmir Valley",
      state: "Jammu & Kashmir",
      tagline: "Snow peaks, Dal Lake shikara rides & Gulmarg alpine meadows",
      coverImage: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 3890,
      idealDuration: "6-7 Days",
      bestTimeToVisit: "All Year",
      startingPrice: 11999,
      tags: ["Himalayas", "Shikara", "Snow"],
      category: "tours" as ServiceCategory,
    },
    {
      id: "dest-manali",
      name: "Manali & Rohtang",
      state: "Himachal Pradesh",
      tagline: "Pine forests, Solang Valley adventure & Rohtang glacier pass",
      coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 2980,
      idealDuration: "4-5 Days",
      bestTimeToVisit: "Oct - Jun",
      startingPrice: 6499,
      tags: ["Mountains", "Adventure", "River Rafting"],
      category: "tours" as ServiceCategory,
    },
    {
      id: "dest-tirupati",
      name: "Tirupati Balaji",
      state: "Andhra Pradesh",
      tagline: "Lord Venkateswara Temple, divine seven hills & sacred laddu prasadam",
      coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 5200,
      idealDuration: "2 Days",
      bestTimeToVisit: "All Year",
      startingPrice: 3499,
      tags: ["VIP Darshan", "Temple", "Sacred Hills"],
      category: "pilgrimage" as ServiceCategory,
    },
  ];

  // Recommended Nature & Heritage Escapes
  const recommendedDestinations = [
    {
      id: "rec-coorg",
      name: "Coorg (Kodagu)",
      state: "Karnataka",
      tagline: "Scotland of India with mist-wrapped coffee plantations & waterfalls",
      coverImage: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 1650,
      idealDuration: "3 Days",
      bestTimeToVisit: "Oct - May",
      startingPrice: 4799,
      tags: ["Plantation", "Mist", "Coffee"],
      category: "resorts" as ServiceCategory,
    },
    {
      id: "rec-ladakh",
      name: "Leh Ladakh",
      state: "Ladakh",
      tagline: "Pangong Tso blue waters, ancient gompas & Khardung La pass",
      coverImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2780,
      idealDuration: "7-8 Days",
      bestTimeToVisit: "May - Sep",
      startingPrice: 14999,
      tags: ["High Passes", "Monasteries", "Lakes"],
      category: "tours" as ServiceCategory,
    },
    {
      id: "rec-rishikesh",
      name: "Rishikesh & Haridwar",
      state: "Uttarakhand",
      tagline: "World yoga capital, white-water river rafting & Ganga aarti",
      coverImage: "https://images.unsplash.com/photo-1600100397608-f010f443b593?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 3100,
      idealDuration: "3-4 Days",
      bestTimeToVisit: "Sep - Apr",
      startingPrice: 3999,
      tags: ["Yoga", "River Rafting", "Camp"],
      category: "pilgrimage" as ServiceCategory,
    },
    {
      id: "rec-andaman",
      name: "Andaman & Nicobar",
      state: "Andaman Islands",
      tagline: "Radhanagar turquoise beach, coral scuba diving & tropical breezes",
      coverImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2240,
      idealDuration: "5-6 Days",
      bestTimeToVisit: "Oct - May",
      startingPrice: 12499,
      tags: ["Islands", "Scuba", "Coral"],
      category: "tours" as ServiceCategory,
    },
  ];

  // Verified Promo Offers
  const promoOffers = [
    {
      id: "off-1",
      code: "BHARAT1500",
      title: "Flat ₹1,500 Instant Discount on Domestic Flights & Stays",
      description: "Valid on all domestic flights and premium heritage havelis with HDFC Bank cards.",
      discount: "Flat ₹1500 OFF",
      bankPartner: "HDFC BANK",
      validTill: "31 March 2026",
      minBooking: 5000,
    },
    {
      id: "off-2",
      code: "VANDEBHARAT",
      title: "IRCTC Vande Bharat Special Cashback Pass",
      description: "Get ₹350 instant cashback + 100 bonus YatraCoins on confirmed railway bookings.",
      discount: "₹350 CASHBACK",
      bankPartner: "SBI CARD",
      validTill: "15 April 2026",
      minBooking: 1200,
    },
    {
      id: "off-3",
      code: "YATRAPASS",
      title: "15% OFF on State Roadways & AC Sleeper Buses",
      description: "Travel smoothly across interstate routes with instant m-ticket and GPS tracking.",
      discount: "15% OFF",
      bankPartner: "ICICI BANK",
      validTill: "Ongoing",
      minBooking: 800,
    },
    {
      id: "off-4",
      code: "DARSHANVIP",
      title: "Sacred Yatra & Temple Package Subsidy",
      description: "Flat ₹1,000 subsidy on all verified pilgrimage circuits including Tirupati & Kashi.",
      discount: "Flat ₹1000 OFF",
      bankPartner: "AXIS BANK",
      validTill: "Ongoing",
      minBooking: 4000,
    },
  ];

  // Travel Experiences Collections
  const travelExperiences = [
    {
      title: "Wildlife & Tiger Safari Lodges",
      description: "Naturalist-led 4x4 open jeep safaris in Corbett, Ranthambore, and Kabini reserves.",
      tag: "Jungle Safaris",
      image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80",
      startingPrice: 7999,
      category: "lodges" as ServiceCategory,
    },
    {
      title: "Backwater Houseboats & Shikaras",
      description: "Handcrafted traditional wooden kettuvallams floating along Kerala's tranquil canals.",
      tag: "Backwaters",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
      startingPrice: 6499,
      category: "houseboats" as ServiceCategory,
    },
    {
      title: "Royal Heritage Havelis & Forts",
      description: "Restored Rajput palaces with courtyard dining, jharokhas, and royal polo grounds.",
      tag: "Heritage Stays",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      startingPrice: 5499,
      category: "hotels" as ServiceCategory,
    },
    {
      title: "Sacred Temple Yatras & Chardham",
      description: "All-inclusive spiritual journeys with verified priest coordination and satvik meals.",
      tag: "Sacred Yatras",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      startingPrice: 4999,
      category: "pilgrimage" as ServiceCategory,
    },
  ];

  // FAQs
  const travelFaqs = [
    {
      question: "How does the Travel Search work?",
      answer:
        "Our search understands natural Indian language phrasing like 'Find a bus from Bangalore to Chennai' or 'Plan a 5-day Kerala trip'. It instantly extracts your origin, destination, preferred dates, and category, and automatically routes you to live bookings with verified operator schedules.",
    },
    {
      question: "Is BharatYatra an authorized IRCTC Rail booking partner?",
      answer:
        "Yes, BharatYatra operates with direct authorized IRCTC ticketing protocols, enabling tatkal availability verification, live PNR status updates, confirmed seat predictors, and 100% instant refunds upon authorized cancellation.",
    },
    {
      question: "Can I cancel my trip and get an instant refund?",
      answer:
        "All bookings marked with 'YatraShield Protected' are eligible for automated instant refund processing directly to your original payment method or BharatYatra Wallet without administrative hold-ups.",
    },
    {
      question: "What is included in Pilgrimage & Darshan packages?",
      answer:
        "Our sacred yatra packages include verified temple accommodation, priority darshan token coordination where permissible, satvik vegetarian meals, sanitized temple shuttle cabs, and on-ground devotee assistance.",
    },
  ];

  // Handle Natural Language Search Submission
  const handleExecuteIntent = (intent: ParsedTravelIntent) => {
    if (onExecuteIntent) {
      onExecuteIntent(intent);
      return;
    }

    if (intent.action === "open_offers") {
      onOpenOffersModal();
    } else if (intent.action === "open_ai") {
      onOpenAIDrawer(intent.originalQuery);
    } else if (intent.category) {
      onSelectCategory(intent.category);
    }
  };

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* ============================================================
          1. HERO BANNER WITH NATURE PHOTOGRAPHY & AI SEARCH BOX
          ============================================================ */}
      <section className="relative rounded-3xl overflow-hidden bg-[#081C15] text-white p-6 sm:p-12 shadow-xl border border-[#1B4332]">
        {/* Background Nature Photography with Warm Green Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=80"
            alt="Kerala Backwaters & Western Ghats"
            className="w-full h-full object-cover opacity-35 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081C15] via-[#081C15]/75 to-[#081C15]/50" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B4332]/90 backdrop-blur-md border border-[#2D6A4F] text-xs text-emerald-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="font-semibold">AI-Powered Travel Across Incredible India</span>
            <span className="text-[#A3B18A]">•</span>
            <span className="text-white font-medium">IRCTC &amp; DGCA Verified</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Where will your journey take you?
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
              Book flights, Vande Bharat trains, luxury sleeper buses, jungle safari lodges, and sacred yatras with natural-language simplicity.
            </p>
          </div>

          {/* Prominent AI Travel Search Box */}
          <div className="pt-2">
            <AiTravelSearch
              onExecuteIntent={handleExecuteIntent}
              onOpenAIDrawer={onOpenAIDrawer}
              currentLocationName={currentLocation}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          2. TRAVEL CATEGORY SHORTCUTS
          ============================================================ */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E5DD] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
              <Compass className="w-4 h-4 text-[#2D6A4F]" />
              <span>Multi-Modal Mobility Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
              Explore By Travel Category
            </h2>
          </div>
          <p className="text-xs text-[#526356] max-w-md">
            Seamlessly switch between railways, air routes, luxury coaches, verified stays, and spiritual yatras.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {travelCategories.map((category) => (
            <TravelCategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              hindiName={category.hindiName}
              tagline={category.tagline}
              iconName={category.iconName}
              badge={category.badge}
              isActive={false}
              highlightText={category.highlightText}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
          3. POPULAR DESTINATIONS ACROSS INDIA
          ============================================================ */}
      <section id="explore-destinations-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E5DD] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
              <Star className="w-4 h-4 fill-[#2D6A4F] text-[#2D6A4F]" />
              <span>India&apos;s Iconic Wonders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
              Popular Destinations
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onSelectCategory("tours")}
              className="font-bold text-[#1B4332] hover:text-[#2D6A4F] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularDestinations.map((dest) => {
            return (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                state={dest.state}
                tagline={dest.tagline}
                coverImage={dest.coverImage}
                rating={dest.rating}
                reviewsCount={dest.reviewsCount}
                idealDuration={dest.idealDuration}
                bestTimeToVisit={dest.bestTimeToVisit}
                startingPrice={dest.startingPrice}
                tags={dest.tags}
                onSelect={() => onSelectCategory(dest.category)}
                onBook={() =>
                  onInitiateBooking(
                    {
                      title: `${dest.name} Signature Tour`,
                      amount: dest.startingPrice,
                      destination: dest.name,
                      category: dest.category,
                    },
                    dest.category
                  )
                }
              />
            );
          })}
        </div>
      </section>

      {/* ============================================================
          4. RECOMMENDED DESTINATIONS (Nature & Heritage Escapes)
          ============================================================ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E5DD] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
              <TreePine className="w-4 h-4 text-[#2D6A4F]" />
              <span>Hand-Picked By Travel Curators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
              Recommended Nature &amp; Serene Escapes
            </h2>
          </div>
          <p className="text-xs text-[#526356] max-w-sm">
            Escape the bustling metropolis with scenic hill stations, mist-clad tea plantations, and pristine beaches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommendedDestinations.map((dest) => {
            return (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                state={dest.state}
                tagline={dest.tagline}
                coverImage={dest.coverImage}
                rating={dest.rating}
                reviewsCount={dest.reviewsCount}
                idealDuration={dest.idealDuration}
                bestTimeToVisit={dest.bestTimeToVisit}
                startingPrice={dest.startingPrice}
                tags={dest.tags}
                onSelect={() => onSelectCategory(dest.category)}
                onBook={() =>
                  onInitiateBooking(
                    {
                      title: `${dest.name} Nature Package`,
                      amount: dest.startingPrice,
                      destination: dest.name,
                      category: dest.category,
                    },
                    dest.category
                  )
                }
              />
            );
          })}
        </div>
      </section>

      {/* ============================================================
          5. VERIFIED OFFERS & PROMO CODES
          ============================================================ */}
      <section className="space-y-6 bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E8E5DD]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E5DD] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
              <Tag className="w-4 h-4 text-[#2D6A4F]" />
              <span>Exclusive Partner Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
              Verified Offers &amp; Promo Coupons
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenOffersModal}
            className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <span>View All Promo Codes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              id={offer.id}
              code={offer.code}
              title={offer.title}
              description={offer.description}
              discount={offer.discount}
              bankPartner={offer.bankPartner}
              validTill={offer.validTill}
              minBooking={offer.minBooking}
            />
          ))}
        </div>
      </section>

      {/* ============================================================
          6. CURATED TRAVEL EXPERIENCES ACROSS INDIA
          ============================================================ */}
      <section className="space-y-6">
        <div className="border-b border-[#E8E5DD] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
            <span>Curated Circuits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
            Immersive Travel Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {travelExperiences.map((exp, i) => (
            <div
              key={i}
              onClick={() => onSelectCategory(exp.category)}
              className="group bg-white rounded-2xl border border-[#E8E5DD] overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-[#E8E5DD]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081C15]/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#1B4332] text-white text-[10px] font-bold uppercase tracking-wider">
                  {exp.tag}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors leading-snug">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-[#526356] mt-1 line-clamp-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EDE6] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1B4332]">
                    From ₹{exp.startingPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          PARTNER PORTAL & B2B OPERATOR NETWORK (Curated Homepage Experience)
          ============================================================ */}
      <section id="partner-portal-section" className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E5DD] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-[#2D6A4F]" />
              <span>B2B Travel Commerce &amp; Operator Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
              BharatYatra Partner Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenPartnerSubscription}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Open Partner Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-emerald-300" />
            </button>
          </div>
        </div>

        {/* Partner Value Banner */}
        <div className="bg-gradient-to-br from-[#0D2818] via-[#1B4332] to-[#2D6A4F] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-[#2D6A4F]/50">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Onboarding Fee • First 30 Days 0% Commission</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug">
                Expand Your Travel Operations Across 28 Indian States
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Connect your bus fleet, boutique hotel, heritage haveli, luxury safari lodge, or travel agency with 2.4M+ high-intent Indian travelers. Benefit from automated escrow payouts, live seat inventory distribution, and unified GST invoicing.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 lg:w-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">15,000+</span>
                <span className="text-[10px] text-emerald-200/80 uppercase font-semibold">Verified Partners</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
                <span className="block text-lg sm:text-xl font-black text-white">T+0 / T+1</span>
                <span className="text-[10px] text-emerald-200/80 uppercase font-semibold">Instant Escrow</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="block text-lg sm:text-xl font-black text-white">₹180+ Cr</span>
                <span className="text-[10px] text-emerald-200/80 uppercase font-semibold">Annual Partner GMV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Partner Category Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#526356]">
              Select Partner Segment:
            </h4>
            <span className="text-[11px] text-[#2D6A4F] font-semibold">
              Live API Sync &amp; Multi-Channel Distribution
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {[
              { id: "hotels", name: "Hotels & Havelis", icon: Building2, tag: "8.5% Commission" },
              { id: "buses", name: "Bus Operators", icon: Bus, tag: "Seat Chart Sync" },
              { id: "agents", name: "Travel Agents", icon: Briefcase, tag: "B2B Credit Desk" },
              { id: "resorts", name: "Safari & Resorts", icon: Palmtree, tag: "High Ticket" },
              { id: "pilgrimage", name: "Spiritual Yatras", icon: Landmark, tag: "VIP Darshan" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedPartnerCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPartnerCategory(tab.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                      : "bg-white text-[#2D3A30] border-[#E8E5DD] hover:bg-[#FAF9F5] hover:border-[#D0CBBF]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-[#2D6A4F]"}`} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-white/20 text-emerald-100" : "bg-[#E8F5E9] text-[#1B4332]"
                    }`}>
                      {tab.tag}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Category Feature Spotlight Card */}
          <div className="bg-white rounded-3xl border border-[#E8E5DD] p-6 shadow-xs">
            {selectedPartnerCategory === "hotels" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Hospitality &amp; Heritage Stays</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1B4332]">
                    Boutique Hotels, Heritage Havelis &amp; Homestays
                  </h3>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Direct integration with your Property Management System (PMS) or free BharatYatra Room Manager. Manage room categories, EP/CP/MAP meal plans, festival surge pricing, and instant guest check-in via QR codes.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D3A30] pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Zero double-booking guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Instant UPI / Card escrow payouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Guest WhatsApp confirmation &amp; directions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Section 194-O compliant GST reconciliation</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DD] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Standard Commission</span>
                    <span className="font-bold text-[#1B4332]">8.5% (Lowest in OTA)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Payout Frequency</span>
                    <span className="font-bold text-[#1B4332]">T+1 Daily NEFT</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Channel Manager</span>
                    <span className="font-bold text-[#2D6A4F]">Free Cloud PMS Included</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>List Hotel on BharatYatra</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {selectedPartnerCategory === "buses" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs font-bold">
                    <Bus className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Intercity Bus &amp; Sleeper Fleets</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1B4332]">
                    Private Fleet Owners &amp; Stage Carriage Operators
                  </h3>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Interactive seat layout builder (2+1 sleeper, 2+2 seater), dynamic boarding and drop point management with Google Maps geo-coordinates, real-time driver GPS tracking, and automatic passenger SMS/WhatsApp alerts.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D3A30] pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Live seat chart locking with 0 clash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Driver Android app &amp; manifest scanner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Dynamic festival surge &amp; return discount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Highway dhaba meal tie-in bookings</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DD] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Standard Commission</span>
                    <span className="font-bold text-[#1B4332]">7.0% Flat</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Seat Sync Latency</span>
                    <span className="font-bold text-[#2D6A4F]">&lt; 150 milliseconds</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Passenger Manifest</span>
                    <span className="font-bold text-[#1B4332]">Instant PDF &amp; WhatsApp</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Connect Bus Fleet</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {selectedPartnerCategory === "agents" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs font-bold">
                    <Briefcase className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Travel Agents &amp; Corporate B2B Desks</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1B4332]">
                    B2B Ticketing, Wholesale Quotas &amp; Corporate Portals
                  </h3>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Exclusive wholesale net fares for domestic flights, bulk IRCTC train bookings, custom agent markups, white-labeled PDF e-tickets with your agency branding, and flexible rolling credit limits.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D3A30] pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Custom agency logo on passenger tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Sub-agent logins &amp; staff permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Instant ticket cancellation &amp; agent wallet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Corporate GST input credit pass-through</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DD] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Wholesale Rebate</span>
                    <span className="font-bold text-[#2D6A4F]">Up to 4.5% Cashback</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Credit Limit</span>
                    <span className="font-bold text-[#1B4332]">Up to ₹10 Lakhs (Post KYC)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Agent Support Desk</span>
                    <span className="font-bold text-[#1B4332]">24x7 Dedicated WhatsApp</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Register B2B Travel Agency</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {selectedPartnerCategory === "resorts" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs font-bold">
                    <Palmtree className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Luxury Resorts &amp; Wilderness Safari Lodges</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1B4332]">
                    High-Ticket Stays, Forest Safari Lodges &amp; Houseboats
                  </h3>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Showcase private plunge pools, Ayurvedic rejuvenation packages, Corbett/Ranthambore safari jeep allotments, and Alleppey backwater cruises to verified luxury vacationers with average bookings over ₹15,000.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D3A30] pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Naturalist &amp; Safari jeep bundle builder</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Weekend minimum-stay policy controls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Direct video tours &amp; culinary showcases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Corporate retreat &amp; wedding lead desk</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DD] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Avg Ticket Size</span>
                    <span className="font-bold text-[#1B4332]">₹16,800 / Booking</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Preferred Placement</span>
                    <span className="font-bold text-[#2D6A4F]">Hero Luxury Spotlight</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Settlement Model</span>
                    <span className="font-bold text-[#1B4332]">T+0 on Check-in</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>List Luxury Stay / Lodge</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {selectedPartnerCategory === "pilgrimage" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B4332] text-xs font-bold">
                    <Landmark className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>Spiritual Pilgrimage Trusts &amp; Yatra Operators</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1B4332]">
                    Temple Trusts, Darshan Pass Desks &amp; Dhaba Networks
                  </h3>
                  <p className="text-xs text-[#526356] leading-relaxed">
                    Facilitate seamless devotee experiences with timed queue tokens, special VIP seva passes, helicopter shuttle tickets for Kedarnath/Vaishno Devi, Satvik culinary stops, and elderly wheelchair escort support.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D3A30] pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Official trust verification badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Biometric &amp; QR token verification desk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Satvik highway dhaba delivery tie-ins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>Zero cancellation fees for senior citizens</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DD] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Trust Onboarding</span>
                    <span className="font-bold text-[#2D6A4F]">Zero Setup Cost</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Pilgrim Footfall</span>
                    <span className="font-bold text-[#1B4332]">850,000+ Annual Yatri</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#526356]">Donation / Seva Gateway</span>
                    <span className="font-bold text-[#1B4332]">Direct 80G Compliant</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPartnerSubscription}
                    className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Register Temple / Yatra Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. TRAVEL GUIDES & FREQUENTLY ASKED QUESTIONS
          ============================================================ */}
      <section className="space-y-6">
        <div className="border-b border-[#E8E5DD] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#2D6A4F]" />
            <span>Traveller Insights &amp; Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] tracking-tight mt-1">
            Travel Guides &amp; Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guide Card: Vande Bharat & Train Travel */}
          <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-[#E8E5DD] space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#1B4332]">
              <Train className="w-5 h-5 text-[#2D6A4F]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1B4332]">
                IRCTC Vande Bharat Network Guide
              </h3>
              <p className="text-xs text-[#526356] mt-1 leading-relaxed">
                Connect between major metropolitan hubs with semi-high-speed comfortable executive seating, onboard Wi-Fi, bio-vacuum toilets, and hot catering.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-[#2D3A30]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                <span>Delhi ➔ Varanasi in under 8 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                <span>Bangalore ➔ Chennai in 4 hours 15 mins</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                <span>Mumbai ➔ Goa scenic coastal Konkan route</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => onSelectCategory("trains")}
              className="w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all text-center block cursor-pointer"
            >
              Search Trains
            </button>
          </div>

          {/* Accordion FAQs */}
          <div className="lg:col-span-2 space-y-3">
            {travelFaqs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#E8E5DD] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#1B4332] hover:text-[#2D6A4F] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#6A786E] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-[#4B584E] leading-relaxed border-t border-[#F0EDE6] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. AI CONCIERGE BANNER
          ============================================================ */}
      <section className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Meet Maya • 24x7 India Travel Guide</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Need personalized trip advice or instant bookings?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Ask Maya anything—from Vande Bharat Tatkal quotas to packing for high-altitude Leh Ladakh or finding pure Satvik temple dining.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenAIDrawer()}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-[#FAF9F5] text-[#1B4332] font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
          <span>Talk with Maya AI</span>
        </button>
      </section>
    </div>
  );
}
