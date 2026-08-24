import React, { useState } from "react";
import {
  Tent,
  Search,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Flame,
  PlusCircle,
  Sparkles,
  TreePine,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import { CityLocation, BookingItem, LodgeItem } from "../../types";
import { DETAILED_LODGES } from "../../data/lodgeData";
import { LodgeDetailsModal } from "../lodges/LodgeDetailsModal";
import { LodgeOnboardingModal } from "../lodges/LodgeOnboardingModal";

interface LodgeHomeProps {
  currentLocation: CityLocation;
  onBookLodge: (lodge: LodgeItem) => void;
  onOpenAIDrawer: () => void;
}

export function LodgeHome({
  currentLocation,
  onBookLodge,
  onOpenAIDrawer,
}: LodgeHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [filterSafari, setFilterSafari] = useState(false);
  const [filterBonfire, setFilterBonfire] = useState(false);
  const [filterPetFriendly, setFilterPetFriendly] = useState(false);
  const [selectedLodge, setSelectedLodge] = useState<LodgeItem | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Search and filter logic
  const filteredLodges = DETAILED_LODGES.filter((lodge) => {
    if (selectedType !== "ALL" && lodge.lodgeType !== selectedType) return false;
    if (filterSafari && !lodge.safariAssistance) return false;
    if (filterBonfire && !lodge.bonfireAvailable) return false;
    if (filterPetFriendly && !lodge.petFriendly) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDest = lodge.destination.toLowerCase().includes(q);
      const matchName = lodge.name.toLowerCase().includes(q);
      const matchState = lodge.state.toLowerCase().includes(q);
      const matchRegion = lodge.region.toLowerCase().includes(q);
      if (!matchDest && !matchName && !matchState && !matchRegion) return false;
    }
    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    if (selectedLodge) {
      onBookLodge(selectedLodge);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Lodge Hero Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Tent className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Wildlife, Himalayan &amp; Heritage Eco Lodges
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
                    Curated Eco Stays
                  </span>
                </div>
                <p className="text-xs text-amber-200">
                  Forest Safaris • River Chalets • Mountain Mud Cabins • 100% Free Cancellation
                </p>
              </div>
            </div>

            {/* Actions: Partner Console & List Lodge */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* List Lodge / Onboarding Button */}
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs hover:scale-105"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>List Your Eco Lodge</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-wrap gap-2 text-xs">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
              <Search className="w-4 h-4 text-amber-300 shrink-0" />
              <input
                type="text"
                placeholder="Search Corbett, Spiti, Kabini, Kaziranga, Munnar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-amber-200/60 text-xs font-medium focus:outline-none w-full"
              />
            </div>

            <button
              onClick={() => setFilterSafari(!filterSafari)}
              className={`px-3 py-2 rounded-xl font-semibold border transition-all flex items-center gap-1.5 ${
                filterSafari
                  ? "bg-amber-600 text-white border-amber-500 shadow-xs"
                  : "bg-white/10 text-amber-200 border-white/10 hover:bg-white/20"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Wildlife Safari Desk</span>
            </button>

            <button
              onClick={() => setFilterBonfire(!filterBonfire)}
              className={`px-3 py-2 rounded-xl font-semibold border transition-all flex items-center gap-1.5 ${
                filterBonfire
                  ? "bg-amber-600 text-white border-amber-500 shadow-xs"
                  : "bg-white/10 text-amber-200 border-white/10 hover:bg-white/20"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Bonfire &amp; Stargazing</span>
            </button>

            <button
              onClick={() => setFilterPetFriendly(!filterPetFriendly)}
              className={`px-3 py-2 rounded-xl font-semibold border transition-all flex items-center gap-1.5 ${
                filterPetFriendly
                  ? "bg-amber-600 text-white border-amber-500 shadow-xs"
                  : "bg-white/10 text-amber-200 border-white/10 hover:bg-white/20"
              }`}
            >
              <span>🐾 Pet Friendly</span>
            </button>
          </div>

          {/* Lodge Type Pill Filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: "ALL", label: "All Lodges" },
              { id: "Jungle Wildlife Lodge", label: "🐅 Jungle Wildlife Safari" },
              { id: "Himalayan Eco Lodge", label: "🏔️ Himalayan Mud & Stone" },
              { id: "Tea Estate Heritage Lodge", label: "☕ Tea Estate Bungalows" },
              { id: "Desert Camp Lodge", label: "🌌 Desert Swiss Tents" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedType === type.id
                    ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                    : "bg-white/10 text-amber-200 hover:bg-white/20"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Lodge Matcher Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-teal-700/50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Unsure which wildlife zone or eco lodge to pick?</h4>
            <p className="text-xs text-teal-200">
              Maya AI analyzes forest safari opening seasons, tiger sighting probabilities &amp; weather.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenAIDrawer}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
        >
          <span>Ask Maya AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lodge Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Verified Eco &amp; Wildlife Lodges ({filteredLodges.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Direct host rates • No hidden resort fees</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLodges.map((lodge) => (
            <div
              key={lodge.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={lodge.image}
                  alt={lodge.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/70 text-amber-300 text-[10px] font-black backdrop-blur-xs border border-amber-500/30 uppercase">
                    {lodge.lodgeType}
                  </span>
                  {lodge.isSuperHost && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-xs">
                      ⭐ Superhost
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-amber-200">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                    <span className="line-clamp-1">{lodge.region}, {lodge.destination}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white line-clamp-1 mt-0.5">
                    {lodge.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{lodge.rating}</span>
                      <span className="text-slate-400 font-normal">({lodge.reviewsCount})</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Host: {lodge.hostName.split("&")[0]}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lodge.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold flex items-center gap-1"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 flex items-center justify-between">
                    <span>🛏️ {lodge.roomTypes.length} Cottage Types</span>
                    <span className="font-bold text-emerald-700">Free Cancellation</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-400 line-through">₹{lodge.originalPrice.toLocaleString()}</span>
                      <span className="text-lg font-black text-slate-900">₹{lodge.startingPricePerNight.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">per night + taxes</span>
                  </div>

                  <button
                    onClick={() => setSelectedLodge(lodge)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-1"
                  >
                    <span>View Cottages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lodge Details & Booking Modal */}
      <LodgeDetailsModal
        isOpen={!!selectedLodge}
        onClose={() => setSelectedLodge(null)}
        lodge={selectedLodge}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Lodge Onboarding Modal */}
      <LodgeOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
