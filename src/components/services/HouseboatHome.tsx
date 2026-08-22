import React, { useState } from "react";
import {
  Ship,
  Search,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Utensils,
  Sparkles,
  ArrowRight,
  Filter,
  PlusCircle,
  Waves,
  Sun,
  BedDouble,
  Anchor,
  Compass,
  DollarSign,
  Heart,
} from "lucide-react";
import { CityLocation, HouseboatItem, BookingItem } from "../../types";
import { DETAILED_HOUSEBOATS } from "../../data/houseboatData";
import { UnifiedHouseboatDetailModal } from "../houseboats/UnifiedHouseboatDetailModal";
import { HouseboatOperatorDashboardModal } from "../houseboats/HouseboatOperatorDashboardModal";
import { HouseboatOnboardingModal } from "../houseboats/HouseboatOnboardingModal";

interface HouseboatHomeProps {
  currentLocation: CityLocation;
  onBookHouseboat: (houseboat: any) => void;
  onOpenAIDrawer: () => void;
  onAddBookingToState?: (booking: BookingItem) => void;
}

export function HouseboatHome({
  currentLocation,
  onBookHouseboat,
  onOpenAIDrawer,
  onAddBookingToState,
}: HouseboatHomeProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStayType, setSelectedStayType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHouseboatForDetails, setActiveHouseboatForDetails] = useState<HouseboatItem | null>(null);
  const [isOperatorDashboardOpen, setIsOperatorDashboardOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Filter logic
  const filteredHouseboats = DETAILED_HOUSEBOATS.filter((hb) => {
    const matchesDest =
      selectedDestination === "All" ||
      hb.destination.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      hb.state.toLowerCase().includes(selectedDestination.toLowerCase());

    const matchesCategory = selectedCategory === "All" || hb.category === selectedCategory;
    const matchesStayType =
      selectedStayType === "All" ||
      hb.stayType === selectedStayType ||
      hb.stayType === "Both Available";
    const matchesSearch =
      searchQuery === "" ||
      hb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hb.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hb.waterbody.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDest && matchesCategory && matchesStayType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-cyan-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Ship className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Kerala, Kashmir &amp; Goa Luxury Houseboats
                </h1>
                <p className="text-xs text-cyan-200">
                  Private Backwater Charters • In-House Master Chef • Karimeen &amp; Wazwan Feasts • Port Certified Fleets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOperatorDashboardOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Operator Fleet PMS</span>
              </button>

              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Your Houseboat</span>
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-xl">
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600" /> Destination / Lake
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5 cursor-pointer"
              >
                <option value="All">All Water Destinations (India)</option>
                <option value="Alleppey">Alleppey (Alappuzha) Kerala</option>
                <option value="Kumarakom">Kumarakom (Vembanad Lake)</option>
                <option value="Dal Lake">Srinagar (Dal Lake Kashmir)</option>
                <option value="Nigeen Lake">Srinagar (Nigeen Lake Kashmir)</option>
                <option value="Goa">Goa (Chapora &amp; Mandovi River)</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <Anchor className="w-3 h-3 text-cyan-600" /> Luxury Tier
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5 cursor-pointer"
              >
                <option value="All">All Categories (Deluxe / Premium / Luxury)</option>
                <option value="Luxury">Luxury Charters (Jacuzzi / Glass Suite)</option>
                <option value="Premium">Premium AC Houseboats</option>
                <option value="Deluxe">Deluxe Heritage Wooden Boats</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-600" /> Cruise Type
              </label>
              <select
                value={selectedStayType}
                onChange={(e) => setSelectedStayType(e.target.value)}
                className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5 cursor-pointer"
              >
                <option value="All">All Cruise Durations</option>
                <option value="Overnight Stay">Overnight Stay (Full Board 4-Meals)</option>
                <option value="Day Cruise">Day Cruise (5-6 Hours + Lunch)</option>
              </select>
            </div>

            <div className="flex items-center">
              <button
                onClick={onOpenAIDrawer}
                className="w-full h-full min-h-[50px] rounded-2xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Backwater Itinerary</span>
              </button>
            </div>
          </div>

          {/* Quick Destination Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 scrollbar-none">
            <span className="text-cyan-300 font-bold shrink-0">Popular Waterways:</span>
            {[
              { id: "All", label: "All Houseboats" },
              { id: "Alleppey", label: "🌴 Alleppey Punnamada" },
              { id: "Kumarakom", label: "🪶 Kumarakom Sanctuary" },
              { id: "Dal Lake", label: "🏔️ Srinagar Dal Lake" },
              { id: "Goa", label: "🐬 Goa Chapora River" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedDestination(p.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-semibold transition-all ${
                  selectedDestination === p.id
                    ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                    : "bg-white/10 text-cyan-200 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Houseboat Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Verified Houseboat Charters &amp; Stays</h2>
            <p className="text-xs text-slate-500">
              Government port registered • 100% Private chef &amp; butler on board • Traditional local cuisine
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
            {filteredHouseboats.length} Vessels Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouseboats.map((hb) => (
            <div
              key={hb.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="h-52 relative overflow-hidden bg-slate-100">
                <img
                  src={hb.image}
                  alt={hb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black uppercase">
                    {hb.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-black">
                    {hb.charterType}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-black shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hb.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({hb.reviewsCount})</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-cyan-800 transition-colors line-clamp-1">
                      {hb.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                      <span>
                        {hb.destination} • <span className="text-cyan-800 font-semibold">{hb.waterbody}</span>
                      </span>
                    </p>
                  </div>

                  {/* Highlights Pill Row */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 py-1.5 border-y border-slate-100">
                    <span className="flex items-center gap-1 font-semibold">
                      <BedDouble className="w-3.5 h-3.5 text-cyan-600" /> {hb.totalBedrooms} Bedrooms
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-cyan-600" /> {hb.crewCount} Dedicated Crew
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                      ✓ All Meals Included
                    </span>
                  </div>

                  {/* Dining Feature */}
                  <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-cyan-900 block flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-cyan-700" /> In-House Chef Specialty:
                    </span>
                    <p className="text-[11px] text-slate-700 font-medium line-clamp-1">
                      {hb.diningHighlights[1] || hb.diningHighlights[0]}
                    </p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-cyan-900">
                        ₹{hb.startingPricePerNight.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400">/night</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveHouseboatForDetails(hb)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Cabins &amp; Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Houseboat Details & 7-Step Booking Modal */}
      {activeHouseboatForDetails && (
        <UnifiedHouseboatDetailModal
          isOpen={!!activeHouseboatForDetails}
          onClose={() => setActiveHouseboatForDetails(null)}
          houseboat={activeHouseboatForDetails}
          onBookSuccess={(booking) => {
            if (onAddBookingToState) {
              onAddBookingToState(booking);
            }
            onBookHouseboat(activeHouseboatForDetails);
          }}
          onOpenOperatorPortal={() => {
            setActiveHouseboatForDetails(null);
            setIsOperatorDashboardOpen(true);
          }}
        />
      )}

      {/* Houseboat Operator Fleet PMS Modal */}
      {isOperatorDashboardOpen && (
        <HouseboatOperatorDashboardModal
          isOpen={isOperatorDashboardOpen}
          onClose={() => setIsOperatorDashboardOpen(false)}
        />
      )}

      {/* Onboarding Modal for Boat Owners */}
      {isOnboardingModalOpen && (
        <HouseboatOnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
      )}
    </div>
  );
}
