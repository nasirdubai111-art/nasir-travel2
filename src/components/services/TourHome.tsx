import React, { useState } from "react";
import {
  Map,
  Calendar,
  Users,
  CheckCircle2,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Compass,
  Heart,
  Camera,
  Search,
  Building2,
  Award,
  Clock,
  Phone,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import { CityLocation, BookingItem, UnifiedTourPackage, TourOperatorProfile } from "../../types";
import { UNIFIED_TOUR_PACKAGES, TOUR_OPERATORS_DATABASE } from "../../data/tourData";
import { TourOperatorProfileModal } from "../tours/TourOperatorProfileModal";
import { TourPackageDetailModal } from "../tours/TourPackageDetailModal";
import { UnifiedTourBookingModal } from "../tours/UnifiedTourBookingModal";
import { TourOperatorPortalModal } from "../tours/TourOperatorPortalModal";

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

  // Modals state
  const [selectedTourForDetail, setSelectedTourForDetail] = useState<UnifiedTourPackage | null>(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<UnifiedTourPackage | null>(null);
  const [selectedOperatorForProfile, setSelectedOperatorForProfile] = useState<TourOperatorProfile | null>(null);
  const [isOperatorPortalOpen, setIsOperatorPortalOpen] = useState<boolean>(false);

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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Frontend vs Operator Backend Switcher */}
      <div className="bg-gradient-to-r from-fuchsia-950 via-purple-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-widest font-black text-fuchsia-400">
                Accredited Tour Packages &amp; Operator Directory
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Curated Holiday Circuits by Govt-Verified Tour Operators
            </h1>
            <p className="text-xs sm:text-sm text-fuchsia-200 leading-relaxed">
              Explore 100% transparent holiday packages with dedicated AC transport, verified 4-Star stays, govt-licensed historian guides, and flexible departure schedules.
            </p>
          </div>

          {/* Dedicated Tour Operator Portal Trigger */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 flex flex-col justify-between gap-3 text-white lg:max-w-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Operator Admin &amp; Backoffice</span>
              <h3 className="text-xs sm:text-sm font-black text-white">Registered Tour Operator?</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Manage itineraries, seat allocations, passenger manifests, and daily bank payouts.
              </p>
            </div>

            <button
              onClick={() => setIsOperatorPortalOpen(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Open Operator Console</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination (Jaipur, Alleppey, Varanasi, Goa) or operator..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-fuchsia-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl font-bold border transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-fuchsia-500 text-white border-fuchsia-400 shadow-xs"
                    : "bg-white/10 text-fuchsia-200 border-white/10 hover:bg-white/20"
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
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Featured Verified Tour Operators
            </h2>
            <p className="text-xs text-slate-500">
              Click any operator to inspect their certifications, fleet, and safety record.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:block">
            {TOUR_OPERATORS_DATABASE.length} Operators Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TOUR_OPERATORS_DATABASE.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedOperatorForProfile(op)}
              className="bg-white border border-slate-200 rounded-2xl p-3.5 hover:border-fuchsia-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={op.logo}
                  alt={op.brandName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-900 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-slate-900 group-hover:text-fuchsia-600 transition-colors truncate">
                      {op.brandName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {op.destinationsCovered.cities[0]} • {op.yearsInBusiness} yrs exp
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{op.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({op.reviewsCount})</span>
                </div>
                <span className="text-[10px] text-fuchsia-600 font-bold group-hover:underline">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Tour Packages Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Curated Tour Packages ({filteredTours.length})
            </h2>
            <p className="text-xs text-slate-500">
              Includes 4-Star Stays, AC Transfers, Sightseeing Passes &amp; Meals.
            </p>
          </div>

          {selectedOperatorFilter !== "all" && (
            <button
              onClick={() => setSelectedOperatorFilter("all")}
              className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-800"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => {
            const operator = TOUR_OPERATORS_DATABASE.find((o) => o.id === tour.operatorId);

            return (
              <div
                key={tour.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-fuchsia-400 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Tour Image with Badges */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={tour.featuredImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black">
                        {tour.durationText}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-fuchsia-600 text-white text-[10px] font-bold">
                        {tour.category} Circuit
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-extrabold text-slate-900 flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tour.rating}</span>
                    </div>

                    {/* Operator Badge overlay */}
                    {operator && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOperatorForProfile(operator);
                        }}
                        className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 hover:bg-slate-900"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold truncate max-w-[180px]">
                          {operator.brandName}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-fuchsia-600 uppercase tracking-wider block">
                        {tour.destination}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-2 mt-0.5 group-hover:text-fuchsia-600 transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {tour.subtitle}
                      </p>
                    </div>

                    {/* Highlights bullets */}
                    <div className="space-y-1.5 pt-1">
                      {tour.highlights.slice(0, 3).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Inclusions summary pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        🏨 {tour.accommodation.tier}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        🚗 {tour.transport.primaryMode}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        🍽️ {tour.meals.mealPlan.split("(")[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price & Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 line-through block">
                      ₹{tour.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900">
                        ₹{tour.pricePerAdult.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-500">/ person</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTourForDetail(tour)}
                      className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTourForBooking(tour)}
                      className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Operator & Admin Backend Console Modal */}
      <TourOperatorPortalModal
        isOpen={isOperatorPortalOpen}
        onClose={() => setIsOperatorPortalOpen(false)}
      />
    </div>
  );
}
