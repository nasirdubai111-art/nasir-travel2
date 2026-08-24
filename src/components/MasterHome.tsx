import React, { useState } from "react";
import {
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  Hotel,
  Palmtree,
  Map,
  Landmark,
  Car,
  UtensilsCrossed,
  Briefcase,
  Compass,
  Handshake,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Tag,
  Clock,
  CheckCircle2,
  Copy,
  ChevronRight,
  TrendingUp,
  Flame,
  Tent,
  Ship,
  MapPin,
  Calendar,
  Check,
  ArrowUpRight,
  Filter,
  Users,
} from "lucide-react";
import { ServiceCategory, CityLocation, TravelOffer, UserProfile, PartnerCategory } from "../types";
import {
  SERVICE_CATEGORIES,
  PROMO_OFFERS,
  CITIES_DATABASE,
  MOCK_HOTELS,
  MOCK_RESORTS,
  MOCK_TOURS,
  MOCK_YATRAS,
} from "../data/mockTravelData";

interface MasterHomeProps {
  currentLocation: CityLocation;
  onSelectCategory: (category: ServiceCategory) => void;
  onOpenLocationModal?: () => void;
  onOpenSearchModal: () => void;
  onOpenAIDrawer: () => void;
  onOpenCompare: () => void;
  onOpenTripPlanner: () => void;
  onOpenRewards: () => void;
  onOpenMyTrips?: () => void;
  onOpenOffers: () => void;
  onSelectOffer?: (offer: TravelOffer) => void;
  onQuickBookItem?: (item: any, category: ServiceCategory) => void;
  onInitiateBooking?: (item: any, category: ServiceCategory) => void;
  onOpenAdminPlatform?: (tab?: any) => void;
  onOpenDestinationGuides?: () => void;
  onOpenCustomerReviews?: () => void;
  onOpenHelpSupport?: () => void;
  onOpenSuperDashboard?: (operatorId?: string) => void;
  userProfile?: UserProfile;
}

export function MasterHome({
  currentLocation,
  onSelectCategory,
  onOpenLocationModal,
  onOpenSearchModal,
  onOpenAIDrawer,
  onOpenCompare,
  onOpenTripPlanner,
  onOpenRewards,
  onOpenMyTrips,
  onOpenOffers,
  onSelectOffer,
  onQuickBookItem,
  onInitiateBooking,
  onOpenAdminPlatform,
  onOpenDestinationGuides,
  onOpenCustomerReviews,
  onOpenHelpSupport,
  onOpenSuperDashboard,
  userProfile,
}: MasterHomeProps) {
  const [selectedPersona, setSelectedPersona] = useState<"family" | "spiritual" | "solo" | "corporate" | "luxury">("family");
  const [destinationFilter, setDestinationFilter] = useState<"all" | "spiritual" | "heritage" | "beach" | "hillstation" | "business">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Quick service icon mapper
  const getServiceIcon = (name: string, className = "w-6 h-6") => {
    switch (name) {
      case "Plane": return <Plane className={className} />;
      case "Train": return <Train className={className} />;
      case "Bus": return <Bus className={className} />;
      case "Building2": return <Building2 className={className} />;
      case "Palmtree": return <Palmtree className={className} />;
      case "Map": return <Map className={className} />;
      case "Landmark": return <Landmark className={className} />;
      case "Car": return <Car className={className} />;
      case "UtensilsCrossed": return <UtensilsCrossed className={className} />;
      case "Briefcase": return <Briefcase className={className} />;
      case "Tent": return <Tent className={className} />;
      case "Ship": return <Ship className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered destinations based on user location & category
  const filteredDestinations = CITIES_DATABASE.filter((city) => {
    if (destinationFilter === "all") return true;
    return city.type === destinationFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. FRONT BACKGROUND FEATURE & HERO LANDING SECTION */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/20">
        {/* Full-width India Travel Photography Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85')`, // Iconic Taj Mahal at dawn / Indian wonder
          }}
        />

        {/* Dark-to-transparent Gradient Overlay for Crystal Clear Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/95 via-[#172033]/85 to-[#172033]/60 backdrop-blur-[1px]" />

        {/* Ambient Subtle Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B5ED7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FF8A00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white space-y-8 max-w-6xl mx-auto">
          {/* Top Pill / Departure City Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#FF8A00] text-xs font-black border border-white/20 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>India&apos;s #1 All-in-One Travel &amp; Mobility Super App</span>
              </span>
            </div>

            <button
              onClick={onOpenLocationModal}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs text-white font-semibold flex items-center gap-1.5 transition-all"
              title="Change Departure City"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Departing from <strong className="text-white font-bold underline decoration-[#FF8A00]">{currentLocation.name}</strong> ({currentLocation.airportCode})</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/70" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-sm">
              Where to in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-amber-300 to-[#00A6A6]">
                Bharat
              </span>{" "}
              today?
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-medium">
              Seamlessly book Flights, IRCTC Vande Bharat Trains, Sleeper Buses, Luxury Stays, Sacred Pilgrimages, Houseboats, and Outstation Cabs in one unified booking ecosystem.
            </p>
          </div>

          {/* Prominent Search Journey Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/40 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={onOpenSearchModal}
                className="w-full flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-[#0B5ED7]/10 text-[#0B5ED7] group-hover:bg-[#0B5ED7] group-hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-[#172033] block truncate">
                    Search destinations, Vande Bharat trains, hotels, or Yatra packages...
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block truncate">
                    Try &quot;Vande Bharat Delhi to Varanasi&quot; • &quot;Goa Luxury Beach Villa&quot; • &quot;Chardham 2026&quot;
                  </span>
                </div>
              </button>

              <button
                onClick={onOpenSearchModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0B5ED7] hover:bg-[#094bb0] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search Your Journey</span>
              </button>
            </div>

            {/* Quick search suggestion tags */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <span className="text-slate-500 font-bold shrink-0">Popular:</span>
              {[
                { label: "⚡ Vande Bharat Trains", action: () => onSelectCategory("trains") },
                { label: "🛕 Chardham VIP Yatra", action: () => onSelectCategory("pilgrimage") },
                { label: "🌴 Goa Beach Resorts", action: () => onSelectCategory("resorts") },
                { label: "✈️ Mumbai ⇄ Delhi Flights", action: () => onSelectCategory("flights") },
                { label: "🚢 Alleppey Houseboats", action: () => onSelectCategory("houseboats") },
              ].map((sug, sIdx) => (
                <button
                  key={sIdx}
                  onClick={sug.action}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B5ED7]/10 hover:text-[#0B5ED7] text-[#172033] font-semibold transition-colors shrink-0 whitespace-nowrap"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN FEATURE CARDS: EXPLORE INDIA */}
          {/* ========================================================================= */}
          <div className="bg-[#172033]/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/15">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF8A00]">
                  EXPLORE INDIA
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Travel • Discover • Experience
                </h2>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Direct booking access across all 11 dedicated travel verticals
              </p>
            </div>

            {/* 9 Core Quick Access Cards + 2 Specialized Verticals */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5 sm:gap-3">
              {[
                { id: "flights", name: "Flights", hindi: "उड़ानें", icon: "Plane", color: "from-sky-500 to-blue-600", badge: "Flat ₹1500" },
                { id: "trains", name: "Trains", hindi: "ट्रेन", icon: "Train", color: "from-amber-500 to-orange-600", badge: "₹0 Fee" },
                { id: "buses", name: "Buses", hindi: "बस", icon: "Bus", color: "from-red-500 to-rose-600", badge: "Primo" },
                { id: "hotels", name: "Hotels", hindi: "होटल", icon: "Building2", color: "from-indigo-500 to-violet-600", badge: "Free Cancel" },
                { id: "resorts", name: "Resorts", hindi: "रिसॉर्ट", icon: "Palmtree", color: "from-emerald-500 to-teal-600", badge: "5-Star" },
                { id: "tours", name: "Tours", hindi: "हॉलिडे", icon: "Map", color: "from-fuchsia-500 to-pink-600", badge: "All-Inc" },
                { id: "pilgrimage", name: "Pilgrimage", hindi: "तीर्थ", icon: "Landmark", color: "from-amber-600 to-yellow-600", badge: "VIP Darshan" },
                { id: "cabs", name: "Cabs", hindi: "कैब", icon: "Car", color: "from-blue-600 to-cyan-600", badge: "Doorstep" },
                { id: "houseboats", name: "Houseboats", hindi: "हाउसबोट", icon: "Ship", color: "from-cyan-600 to-blue-700", badge: "Private" },
              ].map((service) => (
                <button
                  key={service.id}
                  id={`hero-card-${service.id}`}
                  onClick={() => onSelectCategory(service.id as ServiceCategory)}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 hover:border-[#FF8A00] rounded-xl p-3 text-center flex flex-col items-center justify-between transition-all hover:scale-105 group relative overflow-hidden"
                >
                  <span className="text-[8px] font-black uppercase text-[#FF8A00] bg-black/40 px-1.5 py-0.2 rounded mb-1">
                    {service.badge}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${service.color} flex items-center justify-center text-white shadow-md group-hover:rotate-3 transition-transform my-1`}>
                    {getServiceIcon(service.icon, "w-5 h-5")}
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block group-hover:text-amber-300 transition-colors">
                      {service.name}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium block">
                      {service.hindi}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Link Footer for Lodges, Dining, Corporate, Agent */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 font-medium">Also explore:</span>
                <button
                  onClick={() => onSelectCategory("lodges")}
                  className="hover:text-white font-bold underline decoration-amber-400"
                >
                  Wildlife Lodges
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectCategory("dining")}
                  className="hover:text-white font-bold underline decoration-orange-400"
                >
                  Highway Dining &amp; Train Meals
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectCategory("corporate")}
                  className="hover:text-white font-bold underline decoration-indigo-400"
                >
                  Corporate GST Desk
                </button>
              </div>

              <button
                onClick={onOpenTripPlanner}
                className="text-xs font-black text-[#FF8A00] hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <span>Launch Multi-City Trip Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LOCATION-BASED DESTINATION DISCOVERY */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#0B5ED7]/10 text-[#0B5ED7] text-[10px] font-black uppercase tracking-wider">
                Departing from {currentLocation.name}
              </span>
              <h2 className="text-xl font-black text-[#172033]">
                Location-Based Destination Discovery
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top curated getaways and direct transport connections from {currentLocation.name}
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All Getaways" },
              { id: "spiritual", label: "🛕 Spiritual" },
              { id: "heritage", label: "🏰 Heritage" },
              { id: "beach", label: "🏖️ Beach" },
              { id: "hillstation", label: "⛰️ Hill Station" },
              { id: "business", label: "💼 Metro" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDestinationFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  destinationFilter === f.id
                    ? "bg-[#0B5ED7] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDestinations.slice(0, 8).map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#0B5ED7] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#172033] text-[10px] font-black uppercase">
                  {dest.state}
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="font-black text-base leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <p className="text-[11px] text-slate-200 line-clamp-1">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-[#0B5ED7]" />
                    <span>{dest.airportCode}</span>
                    <span>•</span>
                    <Train className="w-3.5 h-3.5 text-[#FF8A00]" />
                    <span>{dest.railwayCode}</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#16A34A]">Fast Connections</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                    <span className="text-sm font-black text-[#172033]">₹1,499</span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectCategory("flights");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0B5ED7] hover:bg-[#094bb0] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. OFFERS & DEALS (Vibrant Bank Offers & Instant Promo Codes) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00]">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">
                Exclusive Bank Offers &amp; Promo Deals
              </h2>
              <p className="text-xs text-slate-500">Instant discounts, zero gateway fees, and airport perks</p>
            </div>
          </div>
          <button
            onClick={onOpenOffers}
            className="text-xs font-bold text-[#0B5ED7] hover:underline flex items-center gap-1"
          >
            <span>View All Offers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMO_OFFERS.slice(0, 3).map((offer) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-br ${offer.bgGradient} rounded-2xl p-5 text-white shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md font-bold uppercase tracking-wider">
                    {offer.bank || "Special Offer"}
                  </span>
                  <span className="text-white/80 font-mono text-[11px]">Valid: {offer.validTill}</span>
                </div>

                <div className="mt-3">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FF8A00] text-[#172033] font-black text-[10px] uppercase mb-1 shadow-sm">
                    {offer.discount}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug">{offer.title}</h3>
                  <p className="text-xs text-white/85 mt-1 line-clamp-2">{offer.subtitle}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                <div className="font-mono text-sm font-black bg-black/30 px-3 py-1 rounded-lg border border-white/30 tracking-wider">
                  {offer.code}
                </div>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="flex items-center gap-1.5 text-xs font-black bg-white text-[#172033] px-3.5 py-1.5 rounded-xl hover:bg-amber-100 transition-colors shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5 text-[#0B5ED7]" />
                  <span>{copiedCode === offer.code ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FEATURED HOTELS & LUXURY RESORTS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#00A6A6]/10 text-[#00A6A6] text-[10px] font-black uppercase">
                Handpicked Stays
              </span>
              <h2 className="text-xl font-black text-[#172033]">
                Featured Heritage Havelis &amp; Luxury Resorts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top rated 5★ properties with pay-at-hotel, free breakfast &amp; Ayurvedic wellness
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectCategory("hotels")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#172033] transition-colors"
            >
              Browse Hotels
            </button>
            <button
              onClick={() => onSelectCategory("resorts")}
              className="px-3.5 py-1.5 rounded-xl bg-[#00A6A6] hover:bg-[#008f8f] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Luxury Resorts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_HOTELS.slice(0, 3).map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#0B5ED7] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#172033] text-[10px] font-black uppercase">
                  {hotel.tag || "5-Star Luxury"}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 text-amber-300 text-xs font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-black text-base text-[#172033] leading-snug group-hover:text-[#0B5ED7] transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{hotel.location}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {hotel.amenities.slice(0, 3).map((am, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {am}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Per Night</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-[#172033]">₹{hotel.pricePerNight.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-slate-400 line-through">₹{hotel.originalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onInitiateBooking) onInitiateBooking(hotel, "hotels");
                      else onSelectCategory("hotels");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B5ED7] hover:bg-[#094bb0] text-white text-xs font-black transition-colors shadow-sm"
                  >
                    Book Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. TOUR PACKAGES & ALL-INCLUSIVE ITINERARIES */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-fuchsia-100 text-fuchsia-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">
                Handcrafted Tour &amp; Holiday Packages
              </h2>
              <p className="text-xs text-slate-500">All-inclusive guided family vacations, hill getaways &amp; private cabs</p>
            </div>
          </div>
          <button
            onClick={() => onSelectCategory("tours")}
            className="text-xs font-bold text-[#0B5ED7] hover:underline flex items-center gap-1"
          >
            <span>View All Packages</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_TOURS.slice(0, 2).map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-3xl border border-[#E5E7EB] hover:border-fuchsia-400 hover:shadow-lg transition-all overflow-hidden flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 relative h-48 sm:h-auto overflow-hidden shrink-0">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#172033] text-[10px] font-black uppercase">
                  {tour.duration}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/75 text-amber-300 text-[11px] font-black flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{tour.rating} ({tour.reviews})</span>
                </span>
              </div>

              <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-base text-[#172033] leading-snug group-hover:text-fuchsia-700 transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-fuchsia-600 shrink-0" />
                    <span className="truncate">{tour.destination}</span>
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {tour.highlights.slice(0, 2).map((hl, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Starting per person</span>
                    <span className="text-base font-black text-[#172033]">₹{tour.pricePerPerson.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onInitiateBooking) onInitiateBooking(tour, "tours");
                      else onSelectCategory("tours");
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. SACRED PILGRIMAGE JOURNEYS (CHARDHAM & YATRA) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF8A00] text-white text-[10px] font-black uppercase">
                Sacred Bharat
              </span>
              <h2 className="text-xl font-black text-[#172033]">
                Pilgrimage Journeys &amp; Sugam VIP Darshan
              </h2>
            </div>
            <p className="text-xs text-amber-900/80 mt-1">
              Guaranteed VIP Darshan, Satvik bhojan, Senior citizen assistance, and helicopter options
            </p>
          </div>

          <button
            onClick={() => onSelectCategory("pilgrimage")}
            className="px-4 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#e07a00] text-white text-xs font-black transition-colors shadow-sm flex items-center gap-1"
          >
            <span>Explore All Yatras</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_YATRAS.slice(0, 2).map((yatra) => (
            <div
              key={yatra.id}
              className="bg-white rounded-2xl border border-amber-200 hover:border-[#FF8A00] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={yatra.image}
                  alt={yatra.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-black uppercase shadow-sm">
                  {yatra.circuit} Circuit
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/80 text-amber-300 text-xs font-bold">
                  {yatra.duration}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-black text-base text-[#172033] leading-snug group-hover:text-amber-700 transition-colors">
                    {yatra.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Deity: <strong className="text-slate-800">{yatra.sacredDeity}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px]">
                  {yatra.vipDarshanIncluded && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                      ✓ VIP Darshan Pass
                    </span>
                  )}
                  {yatra.pureSatvikFood && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                      ✓ 100% Satvik Meals
                    </span>
                  )}
                  {yatra.purohitService && (
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold border border-orange-200">
                      ✓ Vedic Purohit
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">All-Inclusive Package</span>
                    <span className="text-base font-black text-[#172033]">₹{yatra.price.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onInitiateBooking) onInitiateBooking(yatra, "pilgrimage");
                      else onSelectCategory("pilgrimage");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#FF8A00] hover:bg-[#e07a00] text-white text-xs font-black transition-colors shadow-sm"
                  >
                    Book Darshan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. TRUST & SECURITY BADGES */}
      {/* ========================================================================= */}
      <div className="bg-white text-[#172033] rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B5ED7]/10 text-[#0B5ED7] flex items-center justify-center shrink-0 border border-[#0B5ED7]/20">
            <ShieldCheck className="w-6 h-6 text-[#0B5ED7]" />
          </div>
          <div>
            <h3 className="text-base font-black">Why 4.2 Million Travelers Trust BharatYatra</h3>
            <p className="text-xs text-slate-500 mt-0.5">IRCTC Authorized Rail Partner • DGCA Airline Certified • 100% Refund Insurance</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>₹0 IRCTC Gateway Fee</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FF8A00] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>24x7 Airport Concierge</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#0B5ED7] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Instant Tatkal Pass</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. SUPER DASHBOARD & 11 OPERATOR MODULES BANNER */}
      {/* ========================================================================= */}
      {onOpenSuperDashboard && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Super Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                11 Profile Modules
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Multi-Operator Hub &amp; Backend Security Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Inspect all 11 operator profile modules (Bus, Train, Hotel, Lodge, Resort, Pilgrimage, Tour, Corporate, Cab, Dining, Houseboat) with strict separation between public frontend displays and hidden backend database credentials, APIs &amp; internal settlement engines.
            </p>
          </div>

          <button
            onClick={() => onOpenSuperDashboard()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
          >
            <span>Launch Super Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
