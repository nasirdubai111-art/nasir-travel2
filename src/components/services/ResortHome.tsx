import React, { useState, useMemo } from "react";
import {
  Palmtree,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Search,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { CityLocation, BookingItem, UnifiedResortItem } from "../../types";
import { RESORTS_DATABASE } from "../../data/resortData";
import { UnifiedResortDetailModal } from "../resorts/UnifiedResortDetailModal";
import { ResortOperatorDashboardModal } from "../resorts/ResortOperatorDashboardModal";
import { TravelCheckbox } from "../common/TravelCheckbox";

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
  const [hasPrivatePoolOnly, setHasPrivatePoolOnly] = useState(false);
  const [hasSpaOnly, setHasSpaOnly] = useState(false);
  const [hasBreakfastIncluded, setHasBreakfastIncluded] = useState(true);
  const [hasFreeCancel, setHasFreeCancel] = useState(true);
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
      return 0;
    });
  }, [searchQuery, selectedStyle, hasPrivatePoolOnly, hasSpaOnly, sortBy]);

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookResort(selectedResort);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Palmtree className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Luxury Resorts &amp; Experiential Retreats
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#0B5ED7] text-xs font-bold uppercase">
                    5-Star Luxury
                  </span>
                </div>
                <p className="text-sm text-slate-200 mt-0.5">
                  Kerala Backwater Villas • Coorg Coffee Estates • Goa Private Beachfront • Kabini Safaris • Shimla Himalayas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-open-resort-operator-portal"
                type="button"
                onClick={() => setIsOperatorModalOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                title="Resort Operator PMS & Inventory Console"
              >
                <Building2 className="w-4 h-4 text-[#38BDF8]" />
                <span>Operator PMS</span>
              </button>

              <button
                type="button"
                onClick={onOpenAIDrawer}
                className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>Ask AI Curator</span>
              </button>
            </div>
          </div>

          {/* Search Inputs (Height 48-52px) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
            {/* Search Input */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Destination or Resort Name</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Kumarakom, Coorg, Goa, Safari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-white text-[#172033] font-medium pl-9 pr-3 rounded-xl focus:outline-hidden text-sm"
                />
              </div>
            </div>

            {/* Check-In */}
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Check-In</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            {/* Check-Out */}
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Check-Out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            {/* Guests */}
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Guests &amp; Rooms</label>
              <select
                value={`${guestsCount}-${roomsCount}`}
                onChange={(e) => {
                  const [g, r] = e.target.value.split("-").map(Number);
                  setGuestsCount(g);
                  setRoomsCount(r);
                }}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm cursor-pointer"
              >
                <option value="2-1">2 Guests • 1 Villa</option>
                <option value="3-1">3 Guests • 1 Villa</option>
                <option value="4-2">4 Guests • 2 Villas</option>
                <option value="6-3">6 Guests • 3 Villas</option>
              </select>
            </div>
          </div>

          {/* Quick Style Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 scrollbar-none">
            <span className="text-slate-200 font-semibold shrink-0">Resort Theme:</span>
            {[
              { id: "ALL", label: "All Styles" },
              { id: "Backwaters & Heritage", label: "🌴 Backwaters & Heritage" },
              { id: "Plantation & Hill Retreat", label: "☕ Coffee Plantation" },
              { id: "Luxury Beachfront", label: "🌊 Beachfront Resort" },
              { id: "Wildlife & Safari Sanctuary", label: "🐅 Jungle Safari" },
              { id: "Himalayan Mountain Resort", label: "🏔️ Himalayan Retreat" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-medium transition-all cursor-pointer ${
                  selectedStyle === style.id
                    ? "bg-white text-[#0B5ED7] font-bold shadow-xs"
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (240-260px Filter Sidebar + Resort Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Resort Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Resort Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredResorts.length} properties</span>
          </div>

          {/* Villa Amenities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Amenities</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="resort-filter-pool"
                checked={hasPrivatePoolOnly}
                onChange={setHasPrivatePoolOnly}
                label="🏊 Private Plunge Pool"
                count="Luxury"
              />
              <TravelCheckbox
                id="resort-filter-spa"
                checked={hasSpaOnly}
                onChange={setHasSpaOnly}
                label="🌿 Ayurvedic Wellness Spa"
              />
              <TravelCheckbox
                id="resort-filter-bfast"
                checked={hasBreakfastIncluded}
                onChange={setHasBreakfastIncluded}
                label="🥐 Gourmet Breakfast Included"
              />
              <TravelCheckbox
                id="resort-filter-cancel"
                checked={hasFreeCancel}
                onChange={setHasFreeCancel}
                label="✓ 100% Free Cancellation"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-10 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl px-3 text-xs font-medium text-[#172033] cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Guest Rating (Highest)</option>
            </select>
          </div>
        </aside>

        {/* Resorts Listing Grid */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <span>Verified Luxury Resorts</span>
              <span className="text-xs bg-[#F0F7FF] text-[#0B5ED7] px-2.5 py-0.5 rounded-full font-bold border border-[#0B5ED7]/20">
                {filteredResorts.length} Available
              </span>
            </h2>
            <span className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Concierge Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredResorts.map((resort) => (
              <div
                key={resort.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#0B5ED7] shadow-xs transition-all flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={resort.featuredImage}
                    alt={resort.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#172033]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {resort.resortStyle}
                    </span>
                    {resort.privatePoolAvailable && (
                      <span className="px-2.5 py-1 rounded-md bg-[#16A34A] text-white text-[10px] font-bold flex items-center gap-1">
                        <Waves className="w-3 h-3" /> Private Pool
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#172033] text-xs font-bold flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                    <span>{resort.rating}</span>
                    <span className="text-[#64748B] text-[10px]">({resort.reviewCount})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-[#64748B] text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#0B5ED7]" />
                      <span className="font-semibold text-[#172033]">{resort.landmark || `${resort.city}, ${resort.state}`}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#172033] mt-1 group-hover:text-[#0B5ED7] transition-colors">{resort.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{resort.description}</p>

                    {/* Curated Package Highlights */}
                    <div className="mt-3 bg-[#F5F9FC] p-2.5 rounded-xl border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B5ED7]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Signature Inclusions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resort.curatedPackages.map((pkg) => (
                          <span
                            key={pkg.id}
                            className="px-2 py-0.5 rounded-md bg-white text-[#172033] border border-[#E2E8F0] text-[10px] font-medium"
                          >
                            {pkg.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {resort.facilitiesList.flatMap((f) => f.items).slice(0, 4).map((h, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span className="line-clamp-1">{h.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Pricing & Action */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#172033]">
                        ₹{resort.priceStart.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-[#64748B] block">/ Night with Breakfast</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedResort(resort)}
                      className="h-10 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View &amp; Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Resort Detail Modal */}
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

      {/* Resort Operator Management Dashboard Modal */}
      <ResortOperatorDashboardModal
        isOpen={isOperatorModalOpen}
        onClose={() => setIsOperatorModalOpen(false)}
      />
    </div>
  );
}
