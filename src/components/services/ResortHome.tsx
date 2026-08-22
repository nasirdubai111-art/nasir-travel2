import React, { useState, useMemo } from "react";
import {
  Palmtree,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sun,
  ShieldCheck,
  Calendar,
  Users,
  Building2,
  Search,
  Filter,
  SlidersHorizontal,
  Waves,
  Heart,
  Compass,
  Utensils,
  Camera,
  Coins,
} from "lucide-react";
import { CityLocation, BookingItem, UnifiedResortItem } from "../../types";
import { RESORTS_DATABASE } from "../../data/resortData";
import { UnifiedResortDetailModal } from "../resorts/UnifiedResortDetailModal";
import { ResortOperatorDashboardModal } from "../resorts/ResortOperatorDashboardModal";

interface ResortHomeProps {
  currentLocation: CityLocation;
  onBookResort: (resort: any) => void;
  onOpenAIDrawer: () => void;
}

export function ResortHome({
  currentLocation,
  onBookResort,
  onOpenAIDrawer,
}: ResortHomeProps) {
  // Modal states
  const [selectedResort, setSelectedResort] = useState<UnifiedResortItem | null>(null);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [hasPrivatePoolOnly, setHasPrivatePoolOnly] = useState(false);
  const [hasSpaOnly, setHasSpaOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");

  // Dates & Guests
  const [checkInDate, setCheckInDate] = useState("2026-09-15");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-18");
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);

  // Filtered & Sorted Resorts
  const filteredResorts = useMemo(() => {
    return RESORTS_DATABASE.filter((r) => {
      // Search query
      if (
        searchQuery &&
        !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.state.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.resortStyle.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Resort style filter
      if (selectedStyle !== "ALL" && r.resortStyle !== selectedStyle) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "ALL" && r.city !== selectedLocation) {
        return false;
      }

      // Private pool
      if (hasPrivatePoolOnly && !r.privatePoolAvailable) {
        return false;
      }

      // Spa & Ayurveda
      if (hasSpaOnly && (!r.wellnessSpaRating || r.wellnessSpaRating < 4.8)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.priceStart - b.priceStart;
      if (sortBy === "price_desc") return b.priceStart - a.priceStart;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [searchQuery, selectedStyle, selectedLocation, hasPrivatePoolOnly, hasSpaOnly, sortBy]);

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookResort(selectedResort);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HERO BANNER & OPERATOR QUICK ACCESS
          ========================================================================= */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <Palmtree className="w-7 h-7" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Luxury Resorts &amp; Experiential Retreats
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    5-Star Luxury
                  </span>
                </div>
                <p className="text-xs text-teal-200 mt-0.5">
                  Kerala Backwater Villas • Coorg Coffee Estates • Goa Private Beachfront • Kabini Safaris • Shimla Himalayas
                </p>
              </div>
            </div>

            {/* Operator Portal Quick Button */}
            <button
              id="btn-open-resort-operator-portal"
              onClick={() => setIsOperatorModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Operator PMS Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ADVANCED RESORT SEARCH & BOOKING BAR
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Destination / Resort Search */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Search Resort or Destination
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Kumarakom, Coorg, Goa, Safari, Villa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Check-in Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
            />
          </div>

          {/* Guests & Rooms */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Guests &amp; Rooms
            </label>
            <select
              value={`${guestsCount}-${roomsCount}`}
              onChange={(e) => {
                const [g, r] = e.target.value.split("-").map(Number);
                setGuestsCount(g);
                setRoomsCount(r);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="2-1">2 Guests • 1 Villa</option>
              <option value="3-1">3 Guests • 1 Villa</option>
              <option value="4-2">4 Guests • 2 Villas</option>
              <option value="6-3">6 Guests • 3 Villas</option>
            </select>
          </div>
        </div>

        {/* Style Filter Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "All Styles" },
              { id: "Backwaters & Heritage", label: "Backwaters & Heritage" },
              { id: "Plantation & Hill Retreat", label: "Coffee Plantation" },
              { id: "Luxury Beachfront", label: "Beachfront Resort" },
              { id: "Wildlife & Safari Sanctuary", label: "Jungle Safari" },
              { id: "Himalayan Mountain Resort", label: "Himalayan Retreat" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStyle === style.id
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPrivatePoolOnly}
                onChange={(e) => setHasPrivatePoolOnly(e.target.checked)}
                className="rounded text-teal-600"
              />
              <span>Private Pool Villas</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-slate-700"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Guest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RESORTS LISTING GRID
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Verified Luxury Resorts</span>
            <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">
              {filteredResorts.length} Available
            </span>
          </h2>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Free Cancellation • Direct Concierge Guarantee
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResorts.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-teal-400 hover:shadow-2xl transition-all flex flex-col group"
            >
              {/* Image & Quick Badges */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={resort.featuredImage}
                  alt={resort.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 text-xs font-bold border border-teal-500/30">
                    {resort.resortStyle}
                  </span>
                  {resort.privatePoolAvailable && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                      <Waves className="w-3 h-3" /> Private Pool
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{resort.rating}</span>
                  <span className="text-slate-400 text-[10px]">({resort.reviewCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-semibold">{resort.landmark || `${resort.city}, ${resort.state}`}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{resort.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{resort.description}</p>

                  {/* Curated Package Highlights */}
                  <div className="mt-3 bg-teal-50/70 p-3 rounded-2xl border border-teal-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Signature Packages Available:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {resort.curatedPackages.map((pkg) => (
                        <span
                          key={pkg.id}
                          className="px-2 py-0.5 rounded bg-white text-teal-800 border border-teal-200 text-[10px] font-bold"
                        >
                          {pkg.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {resort.facilitiesList.flatMap((f) => f.items).slice(0, 4).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{h.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Pricing & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{resort.priceStart.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-slate-500 block">/ Night (With Breakfast &amp; Spa)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedResort(resort)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>View Profile &amp; Book</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          UNIFIED RESORT DETAIL & BOOKING MODAL
          ========================================================================= */}
      {selectedResort && (
        <UnifiedResortDetailModal
          resort={selectedResort}
          isOpen={!!selectedResort}
          onClose={() => setSelectedResort(null)}
          onBookingComplete={handleBookingSuccess}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
          initialGuests={guestsCount}
          initialRooms={roomsCount}
        />
      )}

      {/* =========================================================================
          RESORT OPERATOR MANAGEMENT DASHBOARD MODAL
          ========================================================================= */}
      <ResortOperatorDashboardModal
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
      />
    </div>
  );
}
