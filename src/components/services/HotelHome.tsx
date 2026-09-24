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

const CURATED_THEMES = [
  { id: "all", label: "All Verified Stays", icon: "✨" },
  { id: "kerala", label: "Kerala Backwaters", icon: "🛶", query: "kerala" },
  { id: "himalayan", label: "Himalayan Valleys", icon: "🏔️", query: "shimla" },
  { id: "rajasthan", label: "Rajasthani Forts", icon: "🏰", query: "rajasthan" },
  { id: "ghats", label: "Sacred Temple Ghats", icon: "🪔", query: "varanasi" },
];

export function HotelHome({
  currentLocation,
  onBookHotel,
  onOpenAIDrawer,
}: HotelHomeProps) {
  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [checkInDate, setCheckInDate] = useState("2026-08-28");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-30");
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<UnifiedPropertyItem | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TravelFilterState>(INITIAL_TRAVEL_FILTERS);

  const hotelProperties = UNIFIED_PROPERTIES_DATABASE.filter((p) => p.categoryTag === "hotels");

  const filteredHotels = hotelProperties.filter((h) => {
    // Check Theme selection
    if (selectedTheme === "kerala" && !h.state.toLowerCase().includes("kerala") && !h.name.toLowerCase().includes("kerala") && !h.city.toLowerCase().includes("kumarakom")) {
      return false;
    }
    if (selectedTheme === "himalayan" && !h.state.toLowerCase().includes("himachal") && !h.state.toLowerCase().includes("kashmir") && !h.city.toLowerCase().includes("shimla") && !h.city.toLowerCase().includes("gulmarg")) {
      return false;
    }
    if (selectedTheme === "rajasthan" && !h.state.toLowerCase().includes("rajasthan") && !h.city.toLowerCase().includes("jaipur") && !h.city.toLowerCase().includes("udaipur") && !h.city.toLowerCase().includes("jodhpur")) {
      return false;
    }
    if (selectedTheme === "ghats" && !h.city.toLowerCase().includes("varanasi") && !h.city.toLowerCase().includes("rishikesh") && !h.landmark.toLowerCase().includes("ghat")) {
      return false;
    }

    // Check destination query
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
      <div className="bg-gradient-to-br from-[#1B4332] via-[#0F291E] to-[#2D6A4F] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Building2 className="w-6 h-6 text-emerald-300" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  Hotels, Heritage Havelis &amp; Nature Stays
                </h1>
                <p className="text-sm text-emerald-100 mt-0.5">
                  80,000+ Verified Stays • Kerala Backwaters • Himalayan Valleys • Rajasthani Forts • Sacred River Ghats
                </p>
              </div>
            </div>

            {/* Operator & Onboarding Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="h-11 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>List Your Property</span>
              </button>
            </div>
          </div>

          {/* Search Box: Destination, Check-in, Check-out, Guests, Rooms */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" /> Destination / City:
              </label>
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="E.g. Udaipur, Shimla, Varanasi, Kerala"
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm placeholder:text-[#64748B] shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Check-In:
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Check-Out:
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-300" /> Guests:
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm shadow-xs cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-300" /> Rooms:
              </label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3.5 rounded-xl focus:outline-hidden text-sm shadow-xs cursor-pointer"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Curated Theme Quick-Pills (Forest Green & Warm White System) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-emerald-200 mr-1">Curated Escapes:</span>
            {CURATED_THEMES.map((theme) => {
              const isActive = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    if (theme.id === "all") setDestinationQuery("");
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-white text-[#1B4332] shadow-sm font-black"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                  }`}
                >
                  <span>{theme.icon}</span>
                  <span>{theme.label}</span>
                </button>
              );
            })}
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
          onResetFilters={() => {
            setActiveFilters(INITIAL_TRAVEL_FILTERS);
            setSelectedTheme("all");
            setDestinationQuery("");
          }}
          resultCount={filteredHotels.length}
        />

        {/* Hotel Cards Grid Area */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between pb-1 border-b border-[#E8E5DD]">
            <div>
              <h2 className="text-xl font-extrabold text-[#1B4332] font-['Plus_Jakarta_Sans',sans-serif]">
                Verified Properties ({filteredHotels.length})
              </h2>
              <p className="text-xs text-[#526356] mt-0.5">
                Direct verified partner rates • 100% Free Cancellation on all properties
              </p>
            </div>
            <span className="text-xs font-medium text-[#526356] bg-[#FAF9F5] px-3 py-1 rounded-lg border border-[#E8E5DD]">
              Per room / night (Excl. taxes)
            </span>
          </div>

          {filteredHotels.length === 0 ? (
            <div className="bg-[#FAF9F5] rounded-2xl border border-[#E8E5DD] p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-[#526356] mx-auto opacity-40" />
              <h3 className="text-lg font-bold text-[#1B4332]">No matching stays found</h3>
              <p className="text-sm text-[#526356] max-w-sm mx-auto">
                Try adjusting your filters or switching collections to view available verified hotels and heritage stays.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilters(INITIAL_TRAVEL_FILTERS);
                  setSelectedTheme("all");
                  setDestinationQuery("");
                }}
                className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#143225] text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl border border-[#E8E5DD] overflow-hidden hover:border-[#2D6A4F] hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Hotel Image with Badges */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={hotel.featuredImage}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#1B4332]/90 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                        {hotel.badge || hotel.propertyType}
                      </span>
                      {hotel.freeBreakfast && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs">
                          Free Breakfast
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[#172033] text-xs font-bold flex items-center gap-1 shadow-xs border border-[#E8E5DD]">
                      <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                      <span>{hotel.rating}</span>
                      <span className="text-[11px] text-[#526356] font-normal">({hotel.reviewCount})</span>
                    </div>
                  </div>

                  {/* Hotel Details Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1 text-[#526356] text-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                        <span className="font-medium truncate">{hotel.landmark || `${hotel.city}, ${hotel.state}`}</span>
                      </div>
                      <h3 className="font-bold text-[#172033] text-[16px] mt-1 line-clamp-1 group-hover:text-[#1B4332] transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                        {hotel.name}
                      </h3>

                      <p className="text-xs text-[#526356] line-clamp-2 mt-1.5 leading-relaxed">
                        {hotel.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {hotel.roomTypes.map((rt) => (
                          <span key={rt.id} className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#1B4332] text-[11px] font-semibold border border-[#2D6A4F]/20">
                            {rt.category} ({rt.availableInventory} Left)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E5DD] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-[#64748B] line-through">₹{hotel.originalPriceStart.toLocaleString("en-IN")}</span>
                          <span className="text-lg font-black text-[#1B4332]">
                            ₹{hotel.priceStart.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          100% Free Cancellation
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProperty(hotel)}
                        className="h-10 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View &amp; Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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


