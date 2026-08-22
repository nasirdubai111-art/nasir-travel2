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
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_HOTELS, DetailedHotelItem } from "../../data/hotelData";
import { HotelDetailsModal } from "../hotels/HotelDetailsModal";
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
  const [filterCoupleFriendly, setFilterCoupleFriendly] = useState(false);
  const [filterFreeBreakfast, setFilterFreeBreakfast] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<DetailedHotelItem | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const filteredHotels = DETAILED_HOTELS.filter((h) => {
    if (filterCoupleFriendly && !h.isCoupleFriendly) return false;
    if (filterFreeBreakfast && !h.freeBreakfast) return false;
    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookHotel(selectedHotel);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hotel Hero Search Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-violet-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Hotels, Heritage Havelis &amp; Luxury Resorts
                </h1>
                <p className="text-xs text-indigo-200">80,000+ Verified Properties • Pay at Hotel • 100% Free Cancellation</p>
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

          {/* Filter Toggles */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setFilterCoupleFriendly(!filterCoupleFriendly)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                filterCoupleFriendly
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-xs"
                  : "bg-white/10 text-indigo-200 border-white/10 hover:bg-white/20"
              }`}
            >
              ❤️ Couple Friendly (Local IDs Accepted)
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
              <div className="relative h-52 overflow-hidden">
                <img
                  src={hotel.featuredImage}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    {hotel.amenitiesList.flatMap((a) => a.items).slice(0, 3).map((am, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 line-through">₹{hotel.originalPriceStart}</span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{hotel.priceStart.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block">100% Free Cancellation</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedHotel(hotel)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-1"
                  >
                    <span>View Rooms</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Room Selection & Details Modal */}
      <HotelDetailsModal
        isOpen={!!selectedHotel}
        onClose={() => setSelectedHotel(null)}
        hotel={selectedHotel}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Hotel Partner Onboarding Modal */}
      <PropertyOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}

