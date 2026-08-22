import React, { useState } from "react";
import { X, MapPin, Search, Navigation, Building, Trees, Sparkles, Sun, Check } from "lucide-react";
import { CityLocation } from "../types";
import { CITIES_DATABASE } from "../data/mockTravelData";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: CityLocation;
  onSelectLocation: (city: CityLocation) => void;
}

export function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const filteredCities = CITIES_DATABASE.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (city.airportCode && city.airportCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (city.railwayCode && city.railwayCode.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && city.type === activeFilter;
  });

  const handleUseCurrentLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      // Simulate geolocation resolution to New Delhi
      const delhi = CITIES_DATABASE.find((c) => c.id === "delhi") || CITIES_DATABASE[0];
      onSelectLocation(delhi);
      setIsDetecting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              Select Your Origin or Destination Hub
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalizes travel deals, local cabs, trains, and flight departure hubs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Auto-Detect */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Mumbai, Varanasi, Goa, DEL, BOM)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? "animate-spin" : ""}`} />
              <span>{isDetecting ? "Detecting GPS Location..." : "Use My Current GPS Location"}</span>
            </button>

            <span className="text-[11px] text-slate-400">50+ Hubs Across India</span>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: "All Cities", icon: <Building className="w-3.5 h-3.5" /> },
              { id: "metro", label: "Metros", icon: <Building className="w-3.5 h-3.5" /> },
              { id: "spiritual", label: "Spiritual & Yatra", icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: "heritage", label: "Royal Heritage", icon: <Building className="w-3.5 h-3.5" /> },
              { id: "hillstation", label: "Hills & Mountains", icon: <Trees className="w-3.5 h-3.5" /> },
              { id: "beach", label: "Beaches & Coastal", icon: <Sun className="w-3.5 h-3.5" /> },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeFilter === f.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cities Grid List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredCities.map((city) => {
              const isSelected = selectedLocation.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectLocation(city);
                    onClose();
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all group ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 shadow-2xs"
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{city.name}</h4>
                      {isSelected && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{city.state}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {city.airportCode && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold">
                          ✈️ {city.airportCode}
                        </span>
                      )}
                      {city.railwayCode && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-mono font-semibold">
                          🚆 {city.railwayCode}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">No destinations found matching &quot;{searchQuery}&quot;.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-indigo-600 font-semibold hover:underline"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
