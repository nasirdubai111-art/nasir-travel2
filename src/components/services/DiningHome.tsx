import React, { useState } from "react";
import {
  UtensilsCrossed,
  Train,
  Star,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  ShieldCheck,
  Zap,
  Coffee,
  Heart,
  Navigation,
  Car,
  Gift,
  Check,
  Compass,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_DINING, DetailedDiningItem, DINING_OFFERS_GLOBAL } from "../../data/diningData";
import { HighwayDiningModal } from "../dining/HighwayDiningModal";

interface DiningHomeProps {
  currentLocation: CityLocation;
  onBookDining: (dining: any) => void;
  onOpenAIDrawer: () => void;
}

export function DiningHome({
  currentLocation,
  onBookDining,
  onOpenAIDrawer,
}: DiningHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDietary, setSelectedDietary] = useState<string>("all");
  const [trainPnr, setTrainPnr] = useState("");
  const [selectedDining, setSelectedDining] = useState<DetailedDiningItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialPnrForModal, setInitialPnrForModal] = useState<string | undefined>(undefined);
  const [showMapView, setShowMapView] = useState(false);

  const highwayCorridors = [
    { id: "all", name: "All India Corridors" },
    { id: "NH-44", name: "NH-44 (Delhi - Murthal - Chandigarh)" },
    { id: "Yamuna Expressway", name: "Yamuna Expressway (Noida - Agra)" },
    { id: "Mumbai - Pune", name: "Mumbai - Pune Expressway (NH-48)" },
    { id: "NH-45", name: "NH-45 (Chennai - Trichy / Madurai)" },
  ];

  const filteredDining = DETAILED_DINING.filter((item) => {
    // Search
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.highwayCorridor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Corridor
    if (selectedCorridor !== "all" && !item.highwayCorridor.includes(selectedCorridor)) {
      return false;
    }
    // Type
    if (selectedType !== "all" && item.type !== selectedType) {
      return false;
    }
    // Dietary
    if (selectedDietary !== "all") {
      if (selectedDietary === "pure_veg" && !item.dietaryTags.includes("100% Pure Veg")) return false;
      if (selectedDietary === "jain" && !item.dietaryTags.includes("Jain Food Available")) return false;
      if (selectedDietary === "satvik" && !item.dietaryTags.includes("Satvik Food")) return false;
      if (selectedDietary === "gluten_free" && !item.dietaryTags.includes("Gluten Free Friendly")) return false;
    }
    return true;
  });

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trainPartner = DETAILED_DINING.find((d) => d.deliveryToTrainStations.length > 0) || DETAILED_DINING[0];
    setSelectedDining(trainPartner);
    setInitialPnrForModal(trainPnr || "284-9104821");
    setIsModalOpen(true);
  };

  const handleOpenReserve = (dining: DetailedDiningItem) => {
    setSelectedDining(dining);
    setInitialPnrForModal(undefined);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = (booking: BookingItem) => {
    onBookDining(booking);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dining Hero Banner */}
      <div className="bg-gradient-to-br from-orange-950 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-orange-900/40">
        <div className="max-w-5xl space-y-4 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-300 border border-orange-400/30">
              <UtensilsCrossed className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Highway Dhabas, Restaurants &amp; IRCTC Train Berth Delivery
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-400 text-slate-950 text-[10px] font-black uppercase">
                  IRCTC e-Catering &amp; Highway Food Partner
                </span>
              </div>
              <p className="text-xs text-orange-200 mt-1">
                Discover iconic 24/7 Dhabas with clean washrooms and EV chargers along NH-44, Yamuna Expressway &amp; order hot food directly to your train coach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Train Seat Food Delivery Quick Search Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-base font-extrabold flex items-center gap-2 text-amber-300">
            <Train className="w-5 h-5 text-orange-400" />
            Order Hot Restaurant Food Delivered to Your Train Berth
          </h3>
          <p className="text-xs text-slate-300">
            Enter your 10-digit train PNR to get Domino&apos;s, Haldiram&apos;s, Saravana Bhavan &amp; local Thalis delivered to your seat on upcoming stations.
          </p>
        </div>

        <form onSubmit={handlePnrSearch} className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={trainPnr}
              onChange={(e) => setTrainPnr(e.target.value)}
              placeholder="Enter 10-Digit PNR (e.g. 284-9104821)"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              maxLength={12}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Find Meals on Train</span>
          </button>
        </form>
      </div>

      {/* Global Dining Offers Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DINING_OFFERS_GLOBAL.map((offer) => (
          <div
            key={offer.id}
            className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-orange-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-[11px] px-2 py-0.5 rounded-md bg-orange-100 text-orange-900">
                  {offer.code}
                </span>
                <span className="text-xs font-black text-emerald-600">{offer.discount}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs mt-2">{offer.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{offer.terms}</p>
            </div>
            <span className="text-[10px] text-slate-400 block mt-3 font-semibold">Valid till {offer.validTill}</span>
          </div>
        ))}
      </div>

      {/* Discovery Filters & Highway Milestone Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Dhaba name, Highway, Dish (Paratha, Dosa, Thali)..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>

          {/* Toggle Map vs List */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMapView(!showMapView)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                showMapView ? "bg-orange-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{showMapView ? "Show Grid View" : "Corridor Highway Map"}</span>
            </button>

            <button
              onClick={onOpenAIDrawer}
              className="px-3.5 py-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Maya for Best Pitstops</span>
            </button>
          </div>
        </div>

        {/* Highway Corridor Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {highwayCorridors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCorridor(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                selectedCorridor === c.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Dietary & Type Filter Chips */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" /> Dietary:
            </span>
            <button
              onClick={() => setSelectedDietary("all")}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                selectedDietary === "all" ? "bg-orange-100 text-orange-900 font-bold" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Diets
            </button>
            <button
              onClick={() => setSelectedDietary("pure_veg")}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 ${
                selectedDietary === "pure_veg" ? "bg-emerald-600 text-white font-bold" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% Pure Veg
            </button>
            <button
              onClick={() => setSelectedDietary("jain")}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                selectedDietary === "jain" ? "bg-amber-500 text-white font-bold" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Jain (No Onion/Garlic)
            </button>
            <button
              onClick={() => setSelectedDietary("satvik")}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                selectedDietary === "satvik" ? "bg-purple-600 text-white font-bold" : "bg-purple-50 text-purple-800 hover:bg-purple-100"
              }`}
            >
              Satvik Food
            </button>
          </div>

          <span className="text-xs text-slate-500 font-bold">
            Showing {filteredDining.length} Verified Outlets
          </span>
        </div>
      </div>

      {/* Map Corridor View or Outlet Grid */}
      {showMapView ? (
        <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-400" />
              Interactive Highway Milestone Pitstop Corridor
            </h3>
            <span className="text-xs text-slate-400">Real-time Verified Restroom Hygiene &amp; EV Charger Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredDining.map((din) => (
              <div
                key={din.id}
                className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3 hover:border-orange-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500 text-slate-950 font-black text-[10px]">
                    {din.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{din.rating}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-sm">{din.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{din.highwayCorridor}</p>
                  <p className="text-[11px] text-amber-300 mt-1 font-semibold">{din.location}</p>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-2 border-t border-slate-700">
                  {din.features.cleanWashroomCertified && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3 h-3" /> Clean Washrooms
                    </span>
                  )}
                  {din.features.evFastChargingOnSite && (
                    <span className="flex items-center gap-1 text-sky-400 font-bold">
                      <Zap className="w-3 h-3" /> EV Fast Charger
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleOpenReserve(din)}
                  className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs transition-colors"
                >
                  Reserve Table / View Menu
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Outlet Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDining.map((din) => (
            <div
              key={din.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-orange-400 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={din.featuredImage}
                  alt={din.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold">
                    {din.type}
                  </span>
                  {din.tableBookingAvailable && (
                    <span className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-[10px] font-black">
                      {din.tableDiscountPercent}% OFF Table
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{din.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({din.reviewCount})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="font-semibold truncate">{din.location}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{din.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{din.highwayCorridor}</p>

                  {/* Dietary tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {din.dietaryTags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-800 text-[10px] font-bold border border-orange-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Key Highlights (Clean Restrooms, EV) */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    {din.features.cleanWashroomCertified && (
                      <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                        <ShieldCheck className="w-3 h-3" /> Clean Washrooms
                      </span>
                    )}
                    {din.features.evFastChargingOnSite && (
                      <span className="flex items-center gap-0.5 text-sky-600 font-bold">
                        <Zap className="w-3 h-3" /> EV Fast Charger
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Section */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg. for Two</span>
                    <span className="text-base font-black text-slate-900">₹{din.priceForTwo}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReserve(din)}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Reserve / Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Highway Dining & Train Delivery Modal */}
      <HighwayDiningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diningItem={selectedDining}
        initialPnr={initialPnrForModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
