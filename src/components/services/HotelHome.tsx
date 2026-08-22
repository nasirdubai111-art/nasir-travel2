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
  const [filterCoupleFriendly, setFilterCoupleFriendly] = useState(false);
  const [filterFreeBreakfast, setFilterFreeBreakfast] = useState(false);
  const [filterSwimmingPool, setFilterSwimmingPool] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<UnifiedPropertyItem | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const hotelProperties = UNIFIED_PROPERTIES_DATABASE.filter((p) => p.categoryTag === "hotels");

  const filteredHotels = hotelProperties.filter((h) => {
    if (filterCoupleFriendly && !h.isCoupleFriendly) return false;
    if (filterFreeBreakfast && !h.freeBreakfast) return false;
    if (filterSwimmingPool && !h.swimmingPool) return false;
    if (destinationQuery.trim()) {
      const q = destinationQuery.toLowerCase();
      const matchCity = h.city.toLowerCase().includes(q);
      const matchName = h.name.toLowerCase().includes(q);
      const matchState = h.state.toLowerCase().includes(q);
      const matchLandmark = h.landmark.toLowerCase().includes(q);
      if (!matchCity && !matchName && !matchState && !matchLandmark) return false;
    }
    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookHotel(selectedProperty);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hotel Hero & Dynamic Search Bar */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Building2 className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Hotels, Heritage Havelis &amp; Luxury Stays
                </h1>
                <p className="text-xs text-indigo-200">
                  80,000+ Verified Properties • Pay at Hotel • 100% Free Cancellation • Instant GST Invoice
                </p>
              </div>
            </div>

            {/* List Property / Host Onboarding Trigger */}
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-300" />
              <span>List Your Property / Hotel</span>
            </button>
          </div>

          {/* Search Box: Destination, Check-in, Check-out, Guests, Rooms */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-indigo-200 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Destination / City:
              </label>
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="E.g. Udaipur, Jaipur, Varanasi"
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-indigo-200 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-In:
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-indigo-200 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Check-Out:
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-xl focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-indigo-200 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Guests:
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-xl focus:outline-hidden"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-indigo-200 font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Rooms:
              </label>
              <select
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full bg-white text-slate-900 font-bold px-3 py-2 rounded-xl focus:outline-hidden"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Toggles */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setFilterCoupleFriendly(!filterCoupleFriendly)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                filterCoupleFriendly
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-xs"
                  : "bg-white/10 text-indigo-200 border-white/10 hover:bg-white/20"
              }`}
            >
              ❤️ Couple Friendly (Local IDs Welcomed)
            </button>
            <button
              onClick={() => setFilterFreeBreakfast(!filterFreeBreakfast)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                filterFreeBreakfast
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-xs"
                  : "bg-white/10 text-indigo-200 border-white/10 hover:bg-white/20"
              }`}
            >
              ☕ Free Breakfast Included
            </button>
            <button
              onClick={() => setFilterSwimmingPool(!filterSwimmingPool)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                filterSwimmingPool
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-xs"
                  : "bg-white/10 text-indigo-200 border-white/10 hover:bg-white/20"
              }`}
            >
              🏊 Swimming Pool
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
          <span>Featured Stays in Top Indian Destinations ({filteredHotels.length})</span>
          <span className="text-xs text-slate-400 font-normal">Prices per room / night (Excl. taxes)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col group"
            >
              {/* Hotel Image with Badges */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={hotel.featuredImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {hotel.badge || hotel.propertyType}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({hotel.reviewCount})</span>
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold">{hotel.landmark || `${hotel.city}, ${hotel.state}`}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1 line-clamp-1">{hotel.name}</h3>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {hotel.roomTypes.map((rt) => (
                      <span key={rt.id} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {rt.category} ({rt.availableInventory} Left)
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 line-through">₹{hotel.originalPriceStart.toLocaleString("en-IN")}</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{hotel.priceStart.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block">100% Free Cancellation</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProperty(hotel)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-1"
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

