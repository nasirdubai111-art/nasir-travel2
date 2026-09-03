import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Landmark,
  Car,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  Zap,
  MapPin,
  Calendar,
} from "lucide-react";
import { ServiceCategory, CityLocation, UserProfile } from "../types";
import { SearchHistory, RecentSearchItem } from "./SearchHistory";
import {
  getStoredSearchHistory,
  saveSearchToHistory,
  clearStoredSearchHistory,
  removeStoredHistoryItem,
  getPredictiveSuggestions,
} from "../utils/predictiveSearchEngine";

function detectCategoryFromQuery(q: string): ServiceCategory | undefined {
  const lower = q.toLowerCase();
  if (
    lower.includes("flight") ||
    lower.includes("air") ||
    lower.includes("fly") ||
    lower.includes("indigo") ||
    lower.includes("vistara")
  ) {
    return "flights";
  }
  if (
    lower.includes("vande bharat") ||
    lower.includes("train") ||
    lower.includes("irctc") ||
    lower.includes("rail") ||
    lower.includes("tatkal") ||
    lower.includes("rajdhani")
  ) {
    return "trains";
  }
  if (
    lower.includes("bus") ||
    lower.includes("volvo") ||
    lower.includes("sleeper") ||
    lower.includes("redbus")
  ) {
    return "buses";
  }
  if (
    lower.includes("hotel") ||
    lower.includes("haveli") ||
    lower.includes("stay") ||
    lower.includes("room") ||
    lower.includes("resort")
  ) {
    return "hotels";
  }
  if (
    lower.includes("resort") ||
    lower.includes("villa") ||
    lower.includes("cottage")
  ) {
    return "resorts";
  }
  if (
    lower.includes("yatra") ||
    lower.includes("chardham") ||
    lower.includes("temple") ||
    lower.includes("pilgrim") ||
    lower.includes("kedarnath") ||
    lower.includes("darshan") ||
    lower.includes("kashi")
  ) {
    return "pilgrimage";
  }
  if (
    lower.includes("cab") ||
    lower.includes("taxi") ||
    lower.includes("car") ||
    lower.includes("innova") ||
    lower.includes("outstation")
  ) {
    return "cabs";
  }
  if (
    lower.includes("dhaba") ||
    lower.includes("food") ||
    lower.includes("dining") ||
    lower.includes("restaurant") ||
    lower.includes("pitstop")
  ) {
    return "dining";
  }
  return undefined;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
  onAskAI: (prompt: string) => void;
  currentLocation?: CityLocation | string;
  userProfile?: UserProfile;
  onUpdateRecentSearches?: (searches: string[]) => void;
  onOpenCalendarTimings?: (category?: ServiceCategory) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectCategory,
  onAskAI,
  currentLocation = "New Delhi",
  userProfile,
  onUpdateRecentSearches,
  onOpenCalendarTimings,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  const getInitialRecentSearches = (): RecentSearchItem[] => {
    if (userProfile?.recentSearches && userProfile.recentSearches.length > 0) {
      return userProfile.recentSearches.map((searchStr, idx) => ({
        id: `profile-search-${idx}`,
        query: searchStr,
        category: detectCategoryFromQuery(searchStr) || "flights",
        timestamp: Date.now() - (idx + 1) * 1000 * 60 * 30,
      }));
    }
    return getStoredSearchHistory();
  };

  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(getInitialRecentSearches);

  useEffect(() => {
    if (userProfile?.recentSearches && userProfile.recentSearches.length > 0) {
      const mapped = userProfile.recentSearches.map((searchStr, idx) => ({
        id: `profile-search-${idx}-${searchStr}`,
        query: searchStr,
        category: detectCategoryFromQuery(searchStr) || "flights",
        timestamp: Date.now() - (idx + 1) * 1000 * 60 * 30,
      }));
      setRecentSearches(mapped);
    }
  }, [userProfile?.recentSearches]);

  const currentCityName = typeof currentLocation === "string" ? currentLocation : currentLocation.name;

  // Real-time predictive search suggestions
  const suggestions = getPredictiveSuggestions(query, currentCityName, recentSearches);

  const addSearchToHistory = (searchQuery: string, explicitCategory?: ServiceCategory) => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;
    const detected = explicitCategory || detectCategoryFromQuery(cleanQuery);
    const updated = saveSearchToHistory(cleanQuery, detected);
    setRecentSearches(updated);

    // Persist up to 5 last queries in userProfile state
    if (onUpdateRecentSearches) {
      const top5 = updated.slice(0, 5).map((item) => item.query);
      onUpdateRecentSearches(top5);
    }
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeStoredHistoryItem(id);
    setRecentSearches(updated);

    if (onUpdateRecentSearches) {
      const top5 = updated.slice(0, 5).map((item) => item.query);
      onUpdateRecentSearches(top5);
    }
  };

  const handleClearAllHistory = () => {
    const empty = clearStoredSearchHistory();
    setRecentSearches(empty);

    if (onUpdateRecentSearches) {
      onUpdateRecentSearches([]);
    }
  };

  const handleSelectRecentQuery = (searchQuery: string, category?: ServiceCategory) => {
    addSearchToHistory(searchQuery, category);
    if (category) {
      onSelectCategory(category);
      onClose();
    } else {
      onAskAI(searchQuery);
      onClose();
    }
  };

  const handleAskAIQuery = (searchQuery: string) => {
    addSearchToHistory(searchQuery);
    onAskAI(searchQuery);
    onClose();
  };

  if (!isOpen) return null;

  const quickSearchShortcuts = [
    { label: "Vande Bharat New Delhi to Varanasi", category: "trains" as ServiceCategory },
    { label: "Direct Flights to Goa this weekend", category: "flights" as ServiceCategory },
    { label: "Luxury Heritage Havelis in Jaipur", category: "hotels" as ServiceCategory },
    { label: "Chardham Yatra 2026 Registration & Package", category: "pilgrimage" as ServiceCategory },
    { label: "Volvo AC Sleeper Delhi to Manali", category: "buses" as ServiceCategory },
    { label: "Outstation Innova Crysta Cab Booking", category: "cabs" as ServiceCategory },
    { label: "Murthal Highway Dhabas & Pitstops", category: "dining" as ServiceCategory },
  ];

  const handleAIPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const clean = query.trim();
    addSearchToHistory(clean);
    onAskAI(clean);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <form onSubmit={handleAIPlanSubmit} className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flights, Vande Bharat, stays, yatras, or ask AI (e.g. 3-day Goa trip)..."
            className="flex-1 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query.trim() && (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Maya</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {/* Real-time Predictive Suggestions (if query entered or matches available) */}
          {suggestions.queryMatches.length > 0 && (
            <div className="p-4 bg-amber-50/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Predictive Destinations Matching "{query}"</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.queryMatches.slice(0, 6).map((match) => {
                  const dest = match.destination;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        addSearchToHistory(`${dest.name} (${dest.state})`, dest.categoryHint);
                        if (dest.categoryHint) onSelectCategory(dest.categoryHint);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xs text-left transition-all group cursor-pointer"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate group-hover:text-amber-700">
                          {dest.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{dest.state} • {dest.tagline}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* User's 5 Recent Search Queries History Component */}
          <SearchHistory
            recentSearches={recentSearches}
            onSelectQuery={handleSelectRecentQuery}
            onAskAIQuery={handleAskAIQuery}
            onRemoveItem={handleRemoveHistoryItem}
            onClearAll={handleClearAllHistory}
          />

          {/* Direct & High-Speed Routes from Current City */}
          {suggestions.currentCityRecommendations.length > 0 && (
            <div className="p-4 bg-slate-50/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Top Destinations from {currentCityName}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Predictive Recommendations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.currentCityRecommendations.slice(0, 4).map((rec) => {
                  const dest = rec.destination;
                  return (
                    <button
                      key={dest.id}
                      onClick={() => {
                        addSearchToHistory(`${currentCityName} to ${dest.shortName || dest.name}`, dest.categoryHint);
                        if (dest.categoryHint) onSelectCategory(dest.categoryHint);
                        onClose();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs text-left transition-all group cursor-pointer"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                          {dest.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {dest.state} • {dest.themeTags.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Service Category Jump */}
          <div className="p-4 bg-white">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant Service Jump
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "flights" as ServiceCategory, name: "Flights", icon: <Plane className="w-3.5 h-3.5 text-sky-600" /> },
                { id: "trains" as ServiceCategory, name: "IRCTC Trains", icon: <Train className="w-3.5 h-3.5 text-amber-600" /> },
                { id: "buses" as ServiceCategory, name: "Buses", icon: <Bus className="w-3.5 h-3.5 text-rose-600" /> },
                { id: "hotels" as ServiceCategory, name: "Hotels & Stays", icon: <Building2 className="w-3.5 h-3.5 text-indigo-600" /> },
                { id: "resorts" as ServiceCategory, name: "Resorts & Villas", icon: <Palmtree className="w-3.5 h-3.5 text-emerald-600" /> },
                { id: "pilgrimage" as ServiceCategory, name: "Pilgrimage Yatra", icon: <Landmark className="w-3.5 h-3.5 text-amber-700" /> },
                { id: "cabs" as ServiceCategory, name: "Outstation Cabs", icon: <Car className="w-3.5 h-3.5 text-cyan-600" /> },
                { id: "dining" as ServiceCategory, name: "Highway Dining", icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" /> },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    addSearchToHistory(s.name, s.id);
                    onSelectCategory(s.id);
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition-all text-left"
                >
                  {s.icon}
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>

            {/* Universal Calendar & Timings Engine Banner */}
            {onOpenCalendarTimings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCalendarTimings("flights");
                }}
                className="mt-3 w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1.5">
                      <span>Calendar &amp; Timings Engine</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold">Central Engine</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Live date availability, dynamic prices, slot management &amp; departure times
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Trending Searches */}
          <div className="p-4 space-y-2 bg-white">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Trending India Travel Searches</span>
            </div>

            <div className="space-y-1.5">
              {quickSearchShortcuts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    addSearchToHistory(q.label, q.category);
                    onSelectCategory(q.category);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs text-slate-700 hover:text-indigo-600 group transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    <span className="font-medium">{q.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

