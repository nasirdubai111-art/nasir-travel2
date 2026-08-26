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
  PlusCircle,
  Waves,
  Sun,
  BedDouble,
  Anchor,
  Compass,
  SlidersHorizontal,
} from "lucide-react";
import { CityLocation, HouseboatItem, BookingItem } from "../../types";
import { DETAILED_HOUSEBOATS } from "../../data/houseboatData";
import { UnifiedHouseboatDetailModal } from "../houseboats/UnifiedHouseboatDetailModal";
import { HouseboatOperatorDashboardModal } from "../houseboats/HouseboatOperatorDashboardModal";
import { HouseboatOnboardingModal } from "../houseboats/HouseboatOnboardingModal";
import { TravelCheckbox } from "../common/TravelCheckbox";

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

  // Checkbox filters
  const [filterMealsIncluded, setFilterMealsIncluded] = useState(true);
  const [filterJacuzzi, setFilterJacuzzi] = useState(false);
  const [filterAc24x7, setFilterAc24x7] = useState(false);
  const [filterSundeck, setFilterSundeck] = useState(false);

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Ship className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Kerala, Kashmir &amp; Goa Luxury Houseboats
                </h1>
                <p className="text-sm text-slate-200 mt-0.5">
                  Private Backwater Charters • In-House Master Chef • Karimeen &amp; Wazwan Feasts • Port Certified Fleets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsOperatorDashboardOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Operator Fleet PMS</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOnboardingModalOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Your Houseboat</span>
              </button>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> Destination / Lake
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm cursor-pointer"
              >
                <option value="All">All Water Destinations (India)</option>
                <option value="Alleppey">Alleppey (Alappuzha) Kerala</option>
                <option value="Kumarakom">Kumarakom (Vembanad Lake)</option>
                <option value="Dal Lake">Srinagar (Dal Lake Kashmir)</option>
                <option value="Nigeen Lake">Srinagar (Nigeen Lake Kashmir)</option>
                <option value="Goa">Goa (Chapora &amp; Mandovi River)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-[#38BDF8]" /> Luxury Tier
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm cursor-pointer"
              >
                <option value="All">All Categories (Deluxe / Premium / Luxury)</option>
                <option value="Luxury">Luxury Charters (Jacuzzi / Glass Suite)</option>
                <option value="Premium">Premium AC Houseboats</option>
                <option value="Deluxe">Deluxe Heritage Wooden Boats</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" /> Cruise Type
              </label>
              <select
                value={selectedStayType}
                onChange={(e) => setSelectedStayType(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm cursor-pointer"
              >
                <option value="All">All Cruise Durations</option>
                <option value="Overnight Stay">Overnight Stay (Full Board 4-Meals)</option>
                <option value="Day Cruise">Day Cruise (5-6 Hours + Lunch)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={onOpenAIDrawer}
                className="w-full h-11 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                <span>AI Itinerary</span>
              </button>
            </div>
          </div>

          {/* Quick Destination Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 scrollbar-none">
            <span className="text-slate-200 font-semibold shrink-0">Popular Waterways:</span>
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
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-medium transition-all cursor-pointer ${
                  selectedDestination === p.id
                    ? "bg-white text-[#0B5ED7] font-bold shadow-xs"
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (240-260px Filter Sidebar + Houseboat Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Houseboat Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Boat Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredHouseboats.length} boats</span>
          </div>

          {/* Amenities Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">On-Board Inclusions</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="hb-filter-meals"
                checked={filterMealsIncluded}
                onChange={setFilterMealsIncluded}
                label="🍽️ Master Chef & 4 Meals"
                count="Included"
              />
              <TravelCheckbox
                id="hb-filter-ac"
                checked={filterAc24x7}
                onChange={setFilterAc24x7}
                label="❄️ 24x7 AC Bedrooms"
              />
              <TravelCheckbox
                id="hb-filter-jacuzzi"
                checked={filterJacuzzi}
                onChange={setFilterJacuzzi}
                label="🛁 Private Jacuzzi Suite"
              />
              <TravelCheckbox
                id="hb-filter-sundeck"
                checked={filterSundeck}
                onChange={setFilterSundeck}
                label="☀️ Glass Upper Sundeck"
              />
            </div>
          </div>

          {/* Bedrooms Filter */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Bedrooms</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="hb-bed-1"
                checked={true}
                onChange={() => {}}
                label="1 Bedroom (Couples / Honeymoon)"
              />
              <TravelCheckbox
                id="hb-bed-2"
                checked={true}
                onChange={() => {}}
                label="2-3 Bedrooms (Family)"
              />
              <TravelCheckbox
                id="hb-bed-4"
                checked={true}
                onChange={() => {}}
                label="4-6 Bedrooms (Group Charter)"
              />
            </div>
          </div>
        </aside>

        {/* Houseboat Listings Section */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">Verified Houseboat Charters &amp; Stays</h2>
              <p className="text-xs text-[#64748B]">
                Government port registered • 100% Private chef &amp; butler on board • Traditional local cuisine
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0B5ED7] bg-[#F0F7FF] px-3 py-1 rounded-xl border border-[#0B5ED7]/20">
              {filteredHouseboats.length} Vessels Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHouseboats.map((hb) => (
              <div
                key={hb.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#0B5ED7] transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img
                    src={hb.image}
                    alt={hb.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#172033]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                      {hb.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#0B5ED7] text-white text-[10px] font-bold">
                      {hb.charterType}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#172033] text-xs font-bold shadow-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                    <span>{hb.rating}</span>
                    <span className="text-[10px] text-[#64748B] font-normal">({hb.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div>
                      <h3 className="font-bold text-[#172033] text-base group-hover:text-[#0B5ED7] transition-colors line-clamp-1">
                        {hb.name}
                      </h3>
                      <p className="text-xs text-[#64748B] font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0B5ED7] shrink-0" />
                        <span>
                          {hb.destination} • <span className="text-[#172033] font-semibold">{hb.waterbody}</span>
                        </span>
                      </p>
                    </div>

                    {/* Highlights Pill Row */}
                    <div className="flex items-center gap-3 text-xs text-[#64748B] py-2 border-y border-[#E2E8F0]">
                      <span className="flex items-center gap-1 font-semibold text-[#172033]">
                        <BedDouble className="w-3.5 h-3.5 text-[#0B5ED7]" /> {hb.totalBedrooms} Bedrooms
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#172033]">
                        <Users className="w-3.5 h-3.5 text-[#0B5ED7]" /> {hb.crewCount} Dedicated Crew
                      </span>
                      <span className="text-[11px] text-[#16A34A] font-bold ml-auto">
                        ✓ All Meals Included
                      </span>
                    </div>

                    {/* Dining Feature */}
                    <div className="p-2.5 rounded-xl bg-[#F5F9FC] border border-[#E2E8F0] space-y-0.5">
                      <span className="text-[11px] font-bold uppercase text-[#0B5ED7] block flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-[#0B5ED7]" /> Chef Specialty:
                      </span>
                      <p className="text-xs text-[#64748B] font-medium line-clamp-1">
                        {hb.diningHighlights[1] || hb.diningHighlights[0]}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Starting From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#172033]">
                          ₹{hb.startingPricePerNight.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#64748B]">/night</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveHouseboatForDetails(hb)}
                      className="h-10 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View &amp; Reserve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unified Houseboat Details Modal */}
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
