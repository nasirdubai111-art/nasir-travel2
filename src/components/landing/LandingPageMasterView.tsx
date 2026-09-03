import React, { useState } from "react";
import {
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Info,
  CheckCircle2,
  Star,
  ChevronRight,
  ChevronDown,
  Percent,
  Clock,
  Compass,
  Copy,
  Check,
  HelpCircle,
  Award,
  Zap,
  Globe,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  HeartHandshake,
  Luggage,
  X,
} from "lucide-react";
import { ServiceCategory } from "../../types";
import { DYNAMIC_CMS_PAGES, CmsPageConfig } from "../../data/landingPageCmsData";
import {
  EXPLORE_CATEGORIES_CATALOG,
  FULL_DESTINATIONS_CATALOG,
  TOURS_PACKAGES_CATALOG,
  CURATED_COLLECTIONS_CATALOG,
} from "../../data/exploreEngineData";
import { PROMOTION_COUPONS, CouponRule } from "../../data/loyaltyOffersData";
import { PredictiveDestinationDropdown } from "../search/PredictiveDestinationDropdown";
import {
  DestinationSuggestion,
  getStoredSearchHistory,
  saveSearchToHistory,
  clearStoredSearchHistory,
  removeStoredHistoryItem,
} from "../../utils/predictiveSearchEngine";
import { RecentSearchItem } from "../SearchHistory";

interface LandingPageMasterViewProps {
  currentLocation: string;
  onSelectCategory: (category: ServiceCategory) => void;
  onInitiateBooking: (item: any, category: ServiceCategory) => void;
  onOpenSearchModal: () => void;
  onOpenOffersModal: () => void;
  onOpenPriceWatch: () => void;
  onOpenCustomerReviews: () => void;
  onOpenHelpSupport: () => void;
  onOpenTripPlanner: () => void;
}

export function LandingPageMasterView({
  currentLocation,
  onSelectCategory,
  onInitiateBooking,
  onOpenSearchModal,
  onOpenOffersModal,
  onOpenPriceWatch,
  onOpenCustomerReviews,
  onOpenHelpSupport,
  onOpenTripPlanner,
}: LandingPageMasterViewProps) {
  // Current active CMS dynamic route
  const [activeRoute, setActiveRoute] = useState<string>("/");
  const [activeCategoryTab, setActiveCategoryTab] = useState<ServiceCategory>("flights");
  const [originInput, setOriginInput] = useState<string>(currentLocation || "New Delhi (DEL)");
  const [destinationInput, setDestinationInput] = useState<string>("Goa (GOX / GOI)");
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<string>("all");
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedExploreCategory, setSelectedExploreCategory] = useState<string>("All");

  // Predictive Filtering & Search History State
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => getStoredSearchHistory());

  const handleSelectPredictiveDestination = (
    dest: DestinationSuggestion,
    categoryHint?: ServiceCategory
  ) => {
    const formattedName = `${dest.name} (${dest.state})`;
    setDestinationInput(formattedName);
    if (categoryHint) {
      setActiveCategoryTab(categoryHint);
    }
    const updated = saveSearchToHistory(
      `${originInput.split(" ")[0]} to ${dest.shortName || dest.name}`,
      categoryHint || activeCategoryTab
    );
    setRecentSearches(updated);
    setIsDestinationDropdownOpen(false);
  };

  const handleSelectHistoryItem = (historyQuery: string, category?: ServiceCategory) => {
    setDestinationInput(historyQuery);
    if (category) {
      setActiveCategoryTab(category);
    }
    const updated = saveSearchToHistory(historyQuery, category || activeCategoryTab);
    setRecentSearches(updated);
    setIsDestinationDropdownOpen(false);
  };

  const handleClearHistory = () => {
    const empty = clearStoredSearchHistory();
    setRecentSearches(empty);
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeStoredHistoryItem(id);
    setRecentSearches(updated);
  };

  const handleExecuteSearch = () => {
    if (destinationInput.trim()) {
      const updated = saveSearchToHistory(
        `${originInput.split(" ")[0]} to ${destinationInput.trim()}`,
        activeCategoryTab
      );
      setRecentSearches(updated);
    }
    onSelectCategory(activeCategoryTab);
    onOpenSearchModal();
  };

  const cmsConfig: CmsPageConfig = DYNAMIC_CMS_PAGES[activeRoute] || DYNAMIC_CMS_PAGES["/"];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => setCopiedCouponCode(null), 2500);
  };

  const filteredOffers = PROMOTION_COUPONS.filter((c) => {
    if (selectedOfferCategory === "all") return true;
    return c.category === selectedOfferCategory;
  });

  const popularRoutes = [
    {
      id: "RT-01",
      from: "New Delhi (NDLS)",
      to: "Varanasi Jn (BSB)",
      mode: "Vande Bharat 2.0 (22436)",
      duration: "8h 00m",
      price: 1750,
      originalPrice: 2200,
      category: "trains" as ServiceCategory,
      tag: "Fastest Train",
      speed: "130 km/h Peak",
    },
    {
      id: "RT-02",
      from: "Delhi (DEL)",
      to: "Mumbai (BOM)",
      mode: "IndiGo 6E-2041 Direct",
      duration: "2h 15m",
      price: 4399,
      originalPrice: 5800,
      category: "flights" as ServiceCategory,
      tag: "Frequent Shuttle",
      speed: "Non-stop",
    },
    {
      id: "RT-03",
      from: "Delhi (ISBT Kashmiri Gate)",
      to: "Manali (Mall Road)",
      mode: "Volvo 9600 Multi-Axle AC Sleeper",
      duration: "11h 30m",
      price: 1399,
      originalPrice: 1800,
      category: "buses" as ServiceCategory,
      tag: "Overnight Sleeper",
      speed: "Washroom Onboard",
    },
    {
      id: "RT-04",
      from: "KSR Bengaluru (SBC)",
      to: "Mysuru Jn (MYS)",
      mode: "Vande Bharat Express (20607)",
      duration: "1h 45m",
      price: 495,
      originalPrice: 650,
      category: "trains" as ServiceCategory,
      tag: "10-Lane Corridor",
      speed: "Express",
    },
  ];

  const travelFaqs = [
    {
      q: "How does the Unified BharatYatra Booking Engine work?",
      a: "BharatYatra integrates direct PRS gateways with Indian Railways (IRCTC), DGCA/IATA verified airline GDS networks, state roadway fleets, and 45,000+ audited hotels. You can search, compare, book, split bills, and manage tickets in one seamless platform with zero hidden fees.",
    },
    {
      q: "Are IRCTC train tickets booked here officially confirmed?",
      a: "Yes! All train bookings are generated through authorized Indian Railways PRS channels with real 10-digit PNRs, live coach positioning, berth allocation, and automatic Tatkal refund handling.",
    },
    {
      q: "What is YatraShield & Instant Cancellation Refund?",
      a: "YatraShield offers 100% full refunds on cancellations without deduction of platform penalties. Once approved, the refund is instantly credited back to your BharatYatra Wallet or original UPI account in seconds.",
    },
    {
      q: "Can I earn and redeem YatraCoins across multiple services?",
      a: "Absolutely. Every rupee spent across Flights, Trains, Buses, Hotels, Houseboats, and Cabs earns high-value YatraCoins (up to 5x on Platinum/Kohinoor tiers), which can be directly redeemed for instant booking deductions.",
    },
    {
      q: "How do dynamic landing pages and route filters work?",
      a: "Our CMS and Explore Engines dynamically render tailored content, flight/rail schedules, bank offers, and regional travel advisories based on the destination or state route you choose.",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* 1. DYNAMIC LANDING PAGE ROUTE SELECTOR (CMS Powered Engine) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center font-black text-xs shadow-md">
              CMS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-100">Dynamic Landing Page Switcher</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Reusable Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore tailored landing pages powered by our headless CMS, Explore, Offers, and Alerts engines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] text-indigo-300 bg-slate-800 px-2 py-1 rounded">
              Route: {activeRoute}
            </span>
          </div>
        </div>

        {/* Route Pills */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar">
          {Object.entries(DYNAMIC_CMS_PAGES).map(([route, config]) => (
            <button
              key={route}
              onClick={() => {
                setActiveRoute(route);
                if (config.targetCategory) {
                  setActiveCategoryTab(config.targetCategory as ServiceCategory);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeRoute === route
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span>{route === "/" ? "🏠 Home (Super Hub)" : route}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. HERO BANNER & SEARCH MODULE (Landing Page Engine) */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 text-white min-h-[500px] flex flex-col justify-between">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={cmsConfig.heroBackgroundImage}
            alt={cmsConfig.pageTitle}
            className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${cmsConfig.themeColor} opacity-90 backdrop-blur-[2px]`} />
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90" />
        </div>

        {/* Hero Header & Trust Badges */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 space-y-5 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{cmsConfig.badge}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>IRCTC &amp; DGCA Authorized</span>
            </div>

            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-sky-200 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>100% Instant Refund</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {cmsConfig.heroHeadline}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-medium">
            {cmsConfig.heroSubheadline}
          </p>
        </div>

        {/* Universal Search Card */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-2xl border-t border-white/60 shadow-2xl rounded-b-3xl text-slate-900">
          {/* Quick Service Switcher Tabs */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-slate-200/80">
            {[
              { id: "flights" as ServiceCategory, label: "Flights", icon: Plane, color: "text-blue-600" },
              { id: "trains" as ServiceCategory, label: "IRCTC Trains", icon: Train, color: "text-amber-600" },
              { id: "buses" as ServiceCategory, label: "Buses", icon: Bus, color: "text-emerald-600" },
              { id: "hotels" as ServiceCategory, label: "Hotels", icon: Building2, color: "text-purple-600" },
              { id: "resorts" as ServiceCategory, label: "Resorts", icon: Sparkles, color: "text-pink-600" },
              { id: "lodges" as ServiceCategory, label: "Safari Lodges", icon: TreePine, color: "text-green-600" },
              { id: "tours" as ServiceCategory, label: "Holidays", icon: Compass, color: "text-cyan-600" },
              { id: "pilgrimage" as ServiceCategory, label: "Sacred Yatras", icon: Sparkles, color: "text-orange-600" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeCategoryTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategoryTab(tab.id);
                    onSelectCategory(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#0B5ED7] text-white shadow-md shadow-blue-600/30 font-extrabold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
            {/* Origin */}
            <div className="md:col-span-3.5 bg-slate-50/80 border border-slate-300/80 rounded-2xl p-3.5 hover:border-indigo-500 focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-2xs">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                From / Origin
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => setOriginInput(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-950 focus:outline-none"
                  placeholder="Enter origin city / station"
                />
              </div>
            </div>

            {/* Destination with Predictive Dropdown */}
            <div className="relative md:col-span-3.5 bg-slate-50/80 border border-slate-300/80 rounded-2xl p-3.5 hover:border-indigo-500 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  To / Destination
                </label>
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-black bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  <span>Predictive Radar</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 relative">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="text"
                  value={destinationInput}
                  onFocus={() => setIsDestinationDropdownOpen(true)}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setIsDestinationDropdownOpen(true);
                  }}
                  className="w-full bg-transparent text-xs font-bold text-slate-950 focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                  placeholder="Type city, temple, beach, station..."
                />
                {destinationInput && (
                  <button
                    onClick={() => {
                      setDestinationInput("");
                      setIsDestinationDropdownOpen(true);
                    }}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                    title="Clear destination"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Interactive Predictive Dropdown */}
              <PredictiveDestinationDropdown
                isOpen={isDestinationDropdownOpen}
                query={destinationInput}
                currentCity={currentLocation || "New Delhi"}
                recentSearches={recentSearches}
                activeCategory={activeCategoryTab}
                onSelectDestination={handleSelectPredictiveDestination}
                onSelectHistoryItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
                onRemoveHistoryItem={handleRemoveHistoryItem}
                onClose={() => setIsDestinationDropdownOpen(false)}
              />
            </div>

            {/* Date & Travellers */}
            <div className="md:col-span-3 bg-slate-50/80 border border-slate-300/80 rounded-2xl p-3.5 hover:border-slate-400 transition-colors shadow-2xs">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Departure &amp; Travellers
              </label>
              <div className="flex items-center justify-between mt-1 text-xs font-bold text-slate-900">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Tomorrow</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>1 Adult</span>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                onClick={handleExecuteSearch}
                className="w-full h-full min-h-[54px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Search {activeCategoryTab.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE ALERTS & NOTIFICATIONS RIBBON (Alert Engine) */}
      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Live Travel Radar &amp; Smart Alerts
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Vande Bharat 2.0 speeds upgraded on Delhi ➔ Varanasi and Bangalore ➔ Mysuru corridors. Fares dropped by 18% for Goa winter holidays!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenPriceWatch}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Track Price Radar</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE ENGINE: 15 TRAVEL CATEGORIES & CURATED HIGHLIGHTS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Explore Engine Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Discover Incredible India by Theme
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Filter through 15 specialized travel categories, royal heritage circuits, hill stations, and spiritual sanctuaries.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory("tours")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View all 420+ Curated Places</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Horizontal Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {EXPLORE_CATEGORIES_CATALOG.slice(0, 10).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedExploreCategory(cat.name);
                if (cat.name.includes("Beach")) onSelectCategory("hotels");
                else if (cat.name.includes("Pilgrimage")) onSelectCategory("pilgrimage");
                else if (cat.name.includes("Wildlife")) onSelectCategory("lodges");
                else onSelectCategory("tours");
              }}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                  {cat.destinationsCount} Spots
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cat.hindiName}</p>
                <div className="mt-2 text-[10px] text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
                  <span>{cat.highlightTag}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR DESTINATIONS DOSSIER (Explore Engine) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Trending Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Destination Spotlights
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FULL_DESTINATIONS_CATALOG.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                  <span className="text-slate-300 font-normal">({dest.reviewsCount.toLocaleString()})</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-[10px] font-bold uppercase tracking-wide">
                    {dest.state}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1 drop-shadow-sm">{dest.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-800 block">Ideal Duration</span>
                      <span>{dest.idealDuration}</span>
                    </div>
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-800 block">Best Season</span>
                      <span>{dest.bestTimeToVisit.split("(")[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      Starting Package
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900">₹{dest.packagePrice.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500">/ person</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onInitiateBooking(dest, "tours")}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    View Packages
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. OFFERS ENGINE: TODAY'S ACTIVE PROMOTIONS & BANK DEALS */}
      <section className="bg-gradient-to-br from-amber-500/10 via-indigo-50/50 to-slate-100 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Tag className="w-4 h-4" />
              <span>Offers &amp; Promotion Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Verified Discount Coupons &amp; Bank Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct discounts on Flights, IRCTC Vande Bharat, Luxury Resorts &amp; Outstation Cabs.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["all", "flights", "trains", "hotels", "dining"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedOfferCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedOfferCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOffers.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black text-[10px] uppercase tracking-wider border border-amber-300">
                    {coupon.bankPartner || "PROMO"}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT`}
                  </span>
                </div>

                <h3 className="text-xs font-black text-slate-900 mt-2">{coupon.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{coupon.description}</p>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
                <div className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs font-black text-slate-800 tracking-wider">
                  {coupon.code}
                </div>

                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {copiedCouponCode === coupon.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. POPULAR HIGH-SPEED CORRIDORS & ROUTES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <Train className="w-4 h-4" />
              <span>High-Speed Corridors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Express Travel Routes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    {route.tag}
                  </span>
                  <span className="text-slate-500 font-medium">{route.speed}</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <span>{route.from.split("(")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{route.to.split("(")[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{route.mode}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fares From</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900">₹{route.price.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 line-through">₹{route.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory(route.category)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Book Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. RECOMMENDED COMPLETE HOLIDAY PACKAGES (Tour Engine) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider">
              <Luggage className="w-4 h-4" />
              <span>Curated Holiday Itineraries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Recommended All-Inclusive Trips
            </h2>
          </div>

          <button
            onClick={onOpenTripPlanner}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Custom Trip AI Planner</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOURS_PACKAGES_CATALOG.slice(0, 4).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 relative min-h-[200px] overflow-hidden">
                <img
                  src={pkg.coverImage}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/20">
                  {pkg.duration}
                </span>
              </div>

              <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{pkg.destination}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mt-1 line-clamp-1">{pkg.title}</h3>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pkg.highlights.slice(0, 3).map((hl, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">All-Inclusive Total</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onInitiateBooking(pkg, "tours")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    Book Journey
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FEATURED VERIFIED PARTNERS (IRCTC, Airlines, Taj, Zingbus) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Authorized &amp; Regulatory Compliant</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Official Partners &amp; Hospitality Alliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Seamlessly integrated with Indian Railway PRS (IRCTC), DGCA certified airline networks, state roadway fleets, and luxury hotel chains.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4">
          {[
            { name: "IRCTC Railways", tag: "Authorized Partner", color: "from-amber-500/20 to-orange-500/20" },
            { name: "IndiGo Aviation", tag: "Direct GDS Sync", color: "from-blue-500/20 to-sky-500/20" },
            { name: "Taj Hotels & Palaces", tag: "Luxury Consortium", color: "from-purple-500/20 to-pink-500/20" },
            { name: "Zingbus Electric", tag: "Intercity Fleet", color: "from-emerald-500/20 to-teal-500/20" },
            { name: "Air India", tag: "Star Alliance", color: "from-rose-500/20 to-red-500/20" },
            { name: "KSTDC & State Tourism", tag: "Govt Certified", color: "from-amber-500/20 to-yellow-500/20" },
          ].map((partner, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-b ${partner.color} border border-slate-700/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-1 hover:border-slate-500 transition-colors`}
            >
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black text-white">{partner.name}</span>
              <span className="text-[9px] text-slate-400">{partner.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 10. TESTIMONIALS & VERIFIED REVIEWS CAROUSEL */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Verified Traveler Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Loved by Millions of Indian Travelers
            </h2>
          </div>

          <button
            onClick={onOpenCustomerReviews}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Read all 48,000+ Reviews</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              name: "Siddharth Hegde",
              city: "Bengaluru",
              route: "Bangalore ➔ Mysuru Vande Bharat",
              review:
                "Booked executive chair car tickets in 30 seconds. Real-time platform notifications alerted me before arrival at KSR Bengaluru. Zero convenience fee saved us ₹120!",
              rating: 5,
              date: "2 days ago",
            },
            {
              name: "Dr. Meenakshi Iyer",
              city: "Chennai",
              route: "Kashi Vishwanath Sugam Darshan",
              review:
                "The pilgrimage package for my elderly parents was flawless. VIP Darshan passes and pure Sattvic meals at the hotel made their spiritual journey memorable.",
              rating: 5,
              date: "1 week ago",
            },
            {
              name: "Rohan & Tanya Sen",
              city: "Kolkata",
              route: "Kerala Backwaters & Munnar Honeymoon",
              review:
                "Private Kettuvallam houseboat in Alleppey had an incredible private chef. The instant wallet refund when our flight schedule shifted gave us complete peace of mind.",
              rating: 5,
              date: "3 weeks ago",
            },
          ].map((rev, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">"{rev.review}"</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-slate-900 block">{rev.name}</span>
                  <span className="text-[11px] text-slate-500">{rev.city}</span>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {rev.route}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {travelFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                    openFaqIndex === idx ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
