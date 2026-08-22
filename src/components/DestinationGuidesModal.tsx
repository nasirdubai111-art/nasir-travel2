import React, { useState } from "react";
import {
  X,
  MapPin,
  Star,
  Compass,
  Calendar,
  Clock,
  Car,
  Plane,
  Train,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  Layers,
  ChevronRight,
} from "lucide-react";
import { DESTINATIONS_CATALOG, DestinationGuide } from "../data/destinationData";
import { ServiceCategory } from "../types";

interface DestinationGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookBundle: (item: any, category: ServiceCategory) => void;
}

type DestinationFilter = "all" | "Spiritual & Temples" | "Heritage & Forts" | "Hill Stations" | "Beaches & Coastal";

export function DestinationGuidesModal({
  isOpen,
  onClose,
  onBookBundle,
}: DestinationGuidesModalProps) {
  const [activeCategory, setActiveCategory] = useState<DestinationFilter>("all");
  const [selectedDestination, setSelectedDestination] = useState<DestinationGuide>(DESTINATIONS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "darshan" | "culinary">("overview");

  if (!isOpen) return null;

  const filteredDestinations =
    activeCategory === "all"
      ? DESTINATIONS_CATALOG
      : DESTINATIONS_CATALOG.filter((d) => d.category === activeCategory);

  const handleBookSelectedPackage = () => {
    const packageItem = {
      name: `${selectedDestination.name} Complete Travel Experience (${selectedDestination.idealDuration})`,
      title: `${selectedDestination.name} Guided Tour Package`,
      subtitle: `${selectedDestination.state} • ${selectedDestination.idealDuration}`,
      price: selectedDestination.suggestedPackagePrice,
      rating: selectedDestination.rating,
      category: "pilgrimage",
    };
    onBookBundle(packageItem, "pilgrimage");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-700 via-amber-800 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Incredible India Destinations & Spiritual Guides</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  500+ Curated Circuits
                </span>
              </div>
              <p className="text-xs text-amber-200">
                Temples, Heritage Forts, Hill Retreats, Pristine Coastlines, Darshan Protocols & Local Delicacies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {(["all", "Spiritual & Temples", "Heritage & Forts", "Hill Stations", "Beaches & Coastal"] as DestinationFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat === "all" ? "All Top Destinations" : cat}
            </button>
          ))}
        </div>

        {/* Main Body: Left Master List + Right Full Guide Details */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Destination Cards */}
          <aside className="w-72 sm:w-80 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto space-y-3 shrink-0">
            {filteredDestinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className={`w-full text-left rounded-2xl overflow-hidden border transition-all ${
                  selectedDestination.id === dest.id
                    ? "border-amber-500 ring-2 ring-amber-400 shadow-md bg-white"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    {dest.state}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-950" /> {dest.rating}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-slate-900 text-sm">{dest.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{dest.tagline}</p>
                  <p className="text-[11px] font-bold text-amber-700 mt-1">
                    From ₹{dest.suggestedPackagePrice.toLocaleString("en-IN")} • {dest.idealDuration}
                  </p>
                </div>
              </button>
            ))}
          </aside>

          {/* Right Column: Full Deep Dive Guide & 1-Click Booking */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Destination Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg h-56 w-full">
              <img
                src={selectedDestination.coverImage}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase w-fit mb-1">
                  {selectedDestination.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">{selectedDestination.name}</h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mt-0.5">{selectedDestination.tagline}</p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Best Season</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedDestination.bestSeason}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Ideal Duration</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedDestination.idealDuration}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Nearest Airport</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedDestination.nearestAirport}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Nearest Railway</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{selectedDestination.nearestRailway}</p>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "overview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Key Highlights & Heritage
              </button>
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "itinerary" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Suggested Itinerary
              </button>
              {selectedDestination.darshanTimings && (
                <button
                  onClick={() => setActiveTab("darshan")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "darshan" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Darshan Timings & Dress Code
                </button>
              )}
              <button
                onClick={() => setActiveTab("culinary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "culinary" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Must-Try Local Food
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 uppercase mb-1">Curated Travel Insight</h4>
                  <p className="text-xs text-amber-950 leading-relaxed italic">{selectedDestination.blogSnippet}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">Must-See Attractions & Holy Spots</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDestination.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Itinerary */}
            {activeTab === "itinerary" && (
              <div className="space-y-3">
                {selectedDestination.sampleItinerary.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-black text-[10px] uppercase">
                        {item.day}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1">{item.activities}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Darshan & Protocol */}
            {activeTab === "darshan" && (
              <div className="space-y-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs space-y-3">
                <div>
                  <h4 className="font-bold text-amber-950 uppercase text-[11px]">Temple Timings & Aarti Schedule:</h4>
                  <p className="text-slate-800 mt-1">{selectedDestination.darshanTimings}</p>
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 uppercase text-[11px]">Mandatory Dress Code:</h4>
                  <p className="text-slate-800 mt-1">{selectedDestination.dressCode}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Culinary */}
            {activeTab === "culinary" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  Iconic Local Street Delicacies & Dhabas
                </h4>
                <p className="text-slate-700 leading-relaxed">{selectedDestination.mustTryDelicacy}</p>
              </div>
            )}

            {/* 1-Click All-Inclusive Booking Bundle Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  1-Click Complete Journey Bundle
                </span>
                <h4 className="text-base font-extrabold">{selectedDestination.name} Travel Bundle</h4>
                <p className="text-xs text-slate-300">
                  {selectedDestination.serviceBundle.flight} + {selectedDestination.serviceBundle.hotel} + {selectedDestination.serviceBundle.cab}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Package Price</p>
                  <p className="text-xl font-black text-amber-400">₹{selectedDestination.suggestedPackagePrice.toLocaleString("en-IN")}</p>
                </div>
                <button
                  onClick={handleBookSelectedPackage}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <span>Book Complete Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
