import React, { useState } from "react";
import {
  Map,
  Calendar,
  Users,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { CityLocation, BookingItem, UnifiedTourPackage, TourOperatorProfile } from "../../types";
import { UNIFIED_TOUR_PACKAGES, TOUR_OPERATORS_DATABASE } from "../../data/tourData";
import { TourOperatorProfileModal } from "../tours/TourOperatorProfileModal";
import { TourPackageDetailModal } from "../tours/TourPackageDetailModal";
import { UnifiedTourBookingModal } from "../tours/UnifiedTourBookingModal";
import { TravelCheckbox } from "../common/TravelCheckbox";

interface TourHomeProps {
  currentLocation: CityLocation;
  onBookTour: (tour: any) => void;
  onOpenAIDrawer: () => void;
}

export function TourHome({
  currentLocation,
  onBookTour,
  onOpenAIDrawer,
}: TourHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOperatorFilter, setSelectedOperatorFilter] = useState<string>("all");

  // Checkbox Filters
  const [filter4StarHotel, setFilter4StarHotel] = useState(true);
  const [filterAcVehicle, setFilterAcVehicle] = useState(true);
  const [filterMealsIncluded, setFilterMealsIncluded] = useState(true);
  const [filterGovtGuide, setFilterGovtGuide] = useState(true);

  // Modals state
  const [selectedTourForDetail, setSelectedTourForDetail] = useState<UnifiedTourPackage | null>(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<UnifiedTourPackage | null>(null);
  const [selectedOperatorForProfile, setSelectedOperatorForProfile] = useState<TourOperatorProfile | null>(null);

  const categories = [
    { id: "all", label: "All Circuits" },
    { id: "Heritage", label: "🏰 Heritage & Forts" },
    { id: "Nature", label: "🌴 Backwaters & Nature" },
    { id: "Adventure", label: "🏔️ Himalayan Adventure" },
    { id: "Spiritual", label: "🪔 Spiritual & Ganga" },
    { id: "Coastal", label: "🏖️ Beach & Coastal" },
  ];

  const filteredTours = UNIFIED_TOUR_PACKAGES.filter((t) => {
    if (selectedCategory !== "all" && t.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedOperatorFilter !== "all" && t.operatorId !== selectedOperatorFilter) {
      return false;
    }
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.destination.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleBookingConfirmed = (newBooking: BookingItem) => {
    onBookTour(newBooking);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
                <Compass className="w-5 h-5 text-[#38BDF8]" />
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-[#38BDF8]">
                Govt-Verified Holiday Circuits &amp; Tour Operators
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Curated Holiday Circuits by Accredited Tour Specialists
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Explore transparent holiday packages with dedicated AC transport, verified 4-Star stays, govt-licensed historian guides, and flexible departures.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAIDrawer}
            className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span>AI Tour Customizer</span>
          </button>
        </div>

        {/* Search & Category Filter Row (Height 48-52px) */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination (Jaipur, Alleppey, Varanasi, Goa) or operator..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-[#172033] placeholder:text-[#64748B] text-sm font-medium focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-11 px-3.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-white text-[#0B5ED7] font-bold shadow-xs"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operator Spotlight Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#172033]">
              Featured Verified Tour Operators
            </h2>
            <p className="text-xs text-[#64748B]">
              Click any operator to inspect their certifications, fleet, and safety record.
            </p>
          </div>
          <span className="text-xs text-[#64748B] font-semibold hidden sm:block">
            {TOUR_OPERATORS_DATABASE.length} Operators Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TOUR_OPERATORS_DATABASE.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedOperatorForProfile(op)}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 hover:border-[#0B5ED7] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={op.logo}
                  alt={op.brandName}
                  className="w-11 h-11 rounded-xl object-cover border border-[#E2E8F0] bg-slate-900 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#172033] group-hover:text-[#0B5ED7] transition-colors truncate">
                      {op.brandName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#64748B] block truncate">
                    {op.destinationsCovered.cities[0]} • {op.yearsInBusiness} yrs exp
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-[#FF8A00]">
                  <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                  <span>{op.rating}</span>
                  <span className="text-[10px] text-[#64748B] font-normal">({op.reviewsCount})</span>
                </div>
                <span className="text-[11px] text-[#0B5ED7] font-semibold group-hover:underline">
                  Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Section (240-260px Filter Sidebar + Tour Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Tour Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Tour Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredTours.length} circuits</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Package Inclusions</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="tour-filter-hotel"
                checked={filter4StarHotel}
                onChange={setFilter4StarHotel}
                label="🏨 Verified 4-Star Stays"
              />
              <TravelCheckbox
                id="tour-filter-vehicle"
                checked={filterAcVehicle}
                onChange={setFilterAcVehicle}
                label="🚗 Private AC Transport"
              />
              <TravelCheckbox
                id="tour-filter-meals"
                checked={filterMealsIncluded}
                onChange={setFilterMealsIncluded}
                label="🍽️ Breakfast & Dinner"
              />
              <TravelCheckbox
                id="tour-filter-guide"
                checked={filterGovtGuide}
                onChange={setFilterGovtGuide}
                label="🏛️ Govt-Licensed Guides"
              />
            </div>
          </div>
        </aside>

        {/* Curated Tour Packages Listing */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">
                Curated Holiday Circuits ({filteredTours.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Includes 4-Star Stays, AC Transfers, Sightseeing Passes &amp; Meals.
              </p>
            </div>

            {selectedOperatorFilter !== "all" && (
              <button
                onClick={() => setSelectedOperatorFilter("all")}
                className="text-xs font-semibold text-[#0B5ED7] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTours.map((tour) => {
              const operator = TOUR_OPERATORS_DATABASE.find((o) => o.id === tour.operatorId);

              return (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#0B5ED7] shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Tour Image with Badges */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={tour.featuredImage}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#172033]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          {tour.durationText}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0B5ED7] text-white text-[10px] font-bold">
                          {tour.category} Circuit
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg text-xs font-bold text-[#172033] flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                        <span>{tour.rating}</span>
                      </div>

                      {/* Operator Badge overlay */}
                      {operator && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOperatorForProfile(operator);
                          }}
                          className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-[#172033]/80 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 hover:bg-[#172033] cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span className="text-[11px] font-bold truncate max-w-[180px]">
                            {operator.brandName}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#0B5ED7] uppercase tracking-wider block">
                          {tour.destination}
                        </span>
                        <h3 className="text-base font-bold text-[#172033] line-clamp-2 mt-0.5 group-hover:text-[#0B5ED7] transition-colors">
                          {tour.title}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 mt-1">
                          {tour.subtitle}
                        </p>
                      </div>

                      {/* Highlights bullets */}
                      <div className="space-y-1.5 pt-1">
                        {tour.highlights.slice(0, 3).map((hl, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#64748B]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                            <span className="truncate">{hl}</span>
                          </div>
                        ))}
                      </div>

                      {/* Inclusions summary pills */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#F5F9FC] text-[#64748B] border border-[#E2E8F0] text-[10px] font-medium">
                          🏨 {tour.accommodation.tier}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#F5F9FC] text-[#64748B] border border-[#E2E8F0] text-[10px] font-medium">
                          🚗 {tour.transport.primaryMode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#F5F9FC] text-[#64748B] border border-[#E2E8F0] text-[10px] font-medium">
                          🍽️ {tour.meals.mealPlan.split("(")[0].trim()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Price & Actions */}
                  <div className="p-5 pt-0 border-t border-[#E2E8F0] flex items-center justify-between gap-2 mt-3">
                    <div>
                      <span className="text-[10px] text-[#64748B] line-through block">
                        ₹{tour.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#172033]">
                          ₹{tour.pricePerAdult.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#64748B]">/ person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTourForDetail(tour)}
                        className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F5F9FC] text-xs font-semibold text-[#172033] transition-colors cursor-pointer"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTourForBooking(tour)}
                        className="h-10 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer-Facing Tour Package Detail Modal */}
      <TourPackageDetailModal
        isOpen={!!selectedTourForDetail}
        onClose={() => setSelectedTourForDetail(null)}
        tour={selectedTourForDetail}
        operator={
          selectedTourForDetail
            ? TOUR_OPERATORS_DATABASE.find((o) => o.id === selectedTourForDetail.operatorId) || null
            : null
        }
        onStartBooking={(t) => {
          setSelectedTourForDetail(null);
          setSelectedTourForBooking(t);
        }}
        onViewOperator={(op) => {
          setSelectedTourForDetail(null);
          setSelectedOperatorForProfile(op);
        }}
      />

      {/* Customer-Facing Tour Operator Profile Modal */}
      <TourOperatorProfileModal
        isOpen={!!selectedOperatorForProfile}
        onClose={() => setSelectedOperatorForProfile(null)}
        operator={selectedOperatorForProfile}
        packages={UNIFIED_TOUR_PACKAGES}
        onSelectPackage={(t) => {
          setSelectedOperatorForProfile(null);
          setSelectedTourForDetail(t);
        }}
      />

      {/* Complete 7-Step Unified Tour Booking Engine Modal */}
      <UnifiedTourBookingModal
        isOpen={!!selectedTourForBooking}
        onClose={() => setSelectedTourForBooking(null)}
        tour={selectedTourForBooking}
        onBookingConfirmed={handleBookingConfirmed}
      />
    </div>
  );
}
