import React, { useState } from "react";
import {
  Building2,
  Search,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Wifi,
  SlidersHorizontal,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Calendar,
  Users,
  Percent,
} from "lucide-react";
import { CityLocation, BookingItem, UnifiedPropertyItem } from "../../types";
import { UNIFIED_PROPERTIES_DATABASE } from "../../data/unifiedPropertyData";
import { UnifiedHotelDetailModal } from "../hotels/UnifiedHotelDetailModal";
import { PropertyOnboardingModal } from "../hotels/PropertyOnboardingModal";
import { TravelFilterSidebar, TravelFilterState, INITIAL_TRAVEL_FILTERS } from "../common/TravelFilterSidebar";

interface HotelHomeProps {
  currentLocation: CityLocation;
  onBookHotel: (hotel: any) => void;
  onOpenAIDrawer: () => void;
}

export function HotelHome({
  currentLocation,
  onBookHotel,
  onOpenAIDrawer,
}: HotelHomeProps) {
  const [destinationQuery, setDestinationQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("2026-08-28");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-30");
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<UnifiedPropertyItem | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TravelFilterState>(INITIAL_TRAVEL_FILTERS);

  const hotelProperties = UNIFIED_PROPERTIES_DATABASE.filter((p) => p.categoryTag === "hotels");

  const filteredHotels = hotelProperties.filter((h) => {
    // Check destination
    if (destinationQuery.trim()) {
      const q = destinationQuery.toLowerCase();
      const matchCity = h.city.toLowerCase().includes(q);
      const matchName = h.name.toLowerCase().includes(q);
      const matchState = h.state.toLowerCase().includes(q);
      const matchLandmark = h.landmark.toLowerCase().includes(q);
      if (!matchCity && !matchName && !matchState && !matchLandmark) return false;
    }

    // Check amenities filters
    if (activeFilters.amenities.includes("couple") && !h.isCoupleFriendly) return false;
    if (activeFilters.amenities.includes("pool") && !h.swimmingPool) return false;
    if (activeFilters.amenities.includes("pet") && !h.petFriendly) return false;
    if (activeFilters.amenities.includes("payAtHotel") && !h.payAtHotel) return false;

    // Check meal filters
    if (activeFilters.mealOptions.includes("breakfast") && !h.freeBreakfast) return false;

    // Check ratings
    if (activeFilters.ratings.length > 0) {
      const matchRating = activeFilters.ratings.some((r) => h.rating >= parseFloat(r));
      if (!matchRating) return false;
    }

    // Check price range
    if (activeFilters.priceRanges.length > 0) {
      const matchPrice = activeFilters.priceRanges.some((p) => {
        if (p === "under_2000") return h.priceStart < 2000;
        if (p === "2000_5000") return h.priceStart >= 2000 && h.priceStart <= 5000;
        if (p === "5000_10000") return h.priceStart > 5000 && h.priceStart <= 10000;
        if (p === "above_10000") return h.priceStart > 10000;
        return true;
      });
      if (!matchPrice) return false;
    }

    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookHotel(selectedProperty);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hotel Hero & Dynamic Search Bar */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Building2 className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Hotels, Heritage Havelis &amp; Luxury Stays
                </h1>
                <p className="text-sm text-slate-200 mt-0.5">
                  80,000+ Verified Properties • Pay at Hotel • 100% Free Cancellation • Instant GST Invoice
                </p>
              </div>
            </div>

            {/* Operator & Onboarding Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="h-11 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
                <span>List Your Property</span>
              </button>
            </div>
          </div>

          {/* Search Box: Destination, Check-in, Check-out, Guests, Rooms (Height: 48-52px) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> Destination / City:
              </label>
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="E.g. Udaipur, Jaipur, Varanasi"
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" /> Check-In:
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" /> Check-Out:
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" /> Guests:
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" /> Rooms:
              </label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout (240-260px Sidebar + Main Content Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Unified 256px Travel Filter Sidebar with 20x20px Checkboxes */}
        <TravelFilterSidebar
          currentCategory="hotels"
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          onResetFilters={() => setActiveFilters(INITIAL_TRAVEL_FILTERS)}
          resultCount={filteredHotels.length}
        />

        {/* Hotel Cards Grid Area */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#172033]">
              Available Properties ({filteredHotels.length})
            </h2>
            <span className="text-xs text-[#64748B]">Prices per room / night (Excl. taxes)</span>
          </div>

          {filteredHotels.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-[#64748B] mx-auto opacity-40" />
              <h3 className="text-lg font-bold text-[#172033]">No matching stays found</h3>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                Try adjusting your filters or destination keywords to view available verified hotels and heritage stays.
              </p>
              <button
                onClick={() => {
                  setActiveFilters(INITIAL_TRAVEL_FILTERS);
                  setDestinationQuery("");
                }}
                className="px-4 py-2 bg-[#0B5ED7] text-white text-sm font-semibold rounded-xl hover:bg-[#094eb3] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#0B5ED7] hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Hotel Image with Badges */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={hotel.featuredImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 rounded-md bg-[#172033]/90 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
                        {hotel.badge || hotel.propertyType}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[#172033] text-xs font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                      <span>{hotel.rating}</span>
                      <span className="text-[11px] text-[#64748B] font-normal">({hotel.reviewCount})</span>
                    </div>
                  </div>

                  {/* Hotel Details Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1 text-[#64748B] text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#0B5ED7]" />
                        <span className="font-medium">{hotel.landmark || `${hotel.city}, ${hotel.state}`}</span>
                      </div>
                      <h3 className="font-bold text-[#172033] text-[16px] mt-1 line-clamp-1 group-hover:text-[#0B5ED7] transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {hotel.roomTypes.map((rt) => (
                          <span key={rt.id} className="px-2 py-0.5 rounded-[4px] bg-[#F0F7FF] text-[#0B5ED7] text-[11px] font-medium border border-[#0B5ED7]/20">
                            {rt.category} ({rt.availableInventory} Left)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#64748B] line-through">₹{hotel.originalPriceStart.toLocaleString("en-IN")}</span>
                          <span className="text-lg font-bold text-[#172033]">
                            ₹{hotel.priceStart.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#16A34A] font-semibold block">100% Free Cancellation</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProperty(hotel)}
                        className="h-11 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <span>View &amp; Book</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Unified Hotel Detail & Booking Profile Modal */}
      <UnifiedHotelDetailModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        onBookingSuccess={handleBookingSuccess}
        initialCheckIn={checkInDate}
        initialCheckOut={checkOutDate}
        initialGuests={guestsCount}
        initialRooms={roomsCount}
      />

      {/* Hotel Partner Onboarding Modal */}
      <PropertyOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}


