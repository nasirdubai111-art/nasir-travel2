import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Clock,
  Sparkles,
  Train,
  Plane,
  Bus,
  Car,
  Compass,
  ArrowRight,
  TrendingUp,
  History,
  X,
  Zap,
  Tag,
  Star,
  Check,
  Building2,
  TreePine,
  Search,
} from "lucide-react";
import { ServiceCategory } from "../../types";
import { RecentSearchItem, formatTimeAgo } from "../SearchHistory";
import {
  DestinationSuggestion,
  PredictiveSearchResult,
  getPredictiveSuggestions,
} from "../../utils/predictiveSearchEngine";

interface PredictiveDestinationDropdownProps {
  isOpen: boolean;
  query: string;
  currentCity: string;
  recentSearches: RecentSearchItem[];
  activeCategory?: ServiceCategory;
  onSelectDestination: (destination: DestinationSuggestion, categoryHint?: ServiceCategory) => void;
  onSelectHistoryItem: (query: string, category?: ServiceCategory) => void;
  onClearHistory?: () => void;
  onRemoveHistoryItem?: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
}

export function PredictiveDestinationDropdown({
  isOpen,
  query,
  currentCity,
  recentSearches,
  activeCategory,
  onSelectDestination,
  onSelectHistoryItem,
  onClearHistory,
  onRemoveHistoryItem,
  onClose,
}: PredictiveDestinationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Compute predictive suggestions based on query, current city, and history
  const suggestions: PredictiveSearchResult = getPredictiveSuggestions(
    query,
    currentCity,
    recentSearches,
    activeCategory
  );

  // Flatten selectable items for arrow key navigation
  const selectableItems = [
    ...suggestions.historySuggestions.map((h) => ({ type: "history" as const, data: h })),
    ...suggestions.currentCityRecommendations.map((c) => ({ type: "city" as const, data: c })),
    ...suggestions.queryMatches.map((q) => ({ type: "query" as const, data: q })),
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < selectableItems.length) {
        e.preventDefault();
        const selected = selectableItems[selectedIndex];
        if (selected.type === "history") {
          onSelectHistoryItem(selected.data.item.query, selected.data.item.category);
        } else if (selected.type === "city") {
          onSelectDestination(selected.data.destination, selected.data.destination.categoryHint);
        } else if (selected.type === "query") {
          onSelectDestination(selected.data.destination, selected.data.destination.categoryHint);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, selectableItems, onSelectHistoryItem, onSelectDestination, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasHistory = suggestions.historySuggestions.length > 0;
  const hasCityRecs = suggestions.currentCityRecommendations.length > 0;
  const hasQueryMatches = suggestions.queryMatches.length > 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-slate-900 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[500px] overflow-y-auto no-scrollbar"
    >
      {/* Dropdown Header with Context Summary */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-black tracking-wide">Predictive Destination Radar</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-400/30">
            From {currentCity}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Use ↑↓ to navigate • ↵ Enter to select</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close suggestions"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* 1. SEARCH HISTORY & PAST USER INTENT */}
        {hasHistory && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <History className="w-3.5 h-3.5 text-indigo-600" />
                <span>Your Recent Searches &amp; History</span>
              </div>
              {onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.historySuggestions.map((h, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={h.item.id || idx}
                    onClick={() => onSelectHistoryItem(h.item.query, h.item.category)}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-300 shadow-sm"
                        : "bg-slate-50/70 border-slate-200/80 hover:bg-indigo-50/50 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                        {h.item.category === "trains" ? (
                          <Train className="w-3.5 h-3.5" />
                        ) : h.item.category === "flights" ? (
                          <Plane className="w-3.5 h-3.5" />
                        ) : h.item.category === "buses" ? (
                          <Bus className="w-3.5 h-3.5" />
                        ) : h.item.category === "hotels" ? (
                          <Building2 className="w-3.5 h-3.5" />
                        ) : (
                          <Compass className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {h.item.query}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimeAgo(h.item.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-600 text-[9px] font-bold uppercase">
                        {h.item.category || "Search"}
                      </span>
                      {onRemoveHistoryItem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveHistoryItem(h.item.id, e);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Remove item"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DIRECT & HIGH-SPEED CORRIDORS FROM USER'S CURRENT CITY */}
        {hasCityRecs && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-700">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Recommended from {currentCity} • High-Speed &amp; Non-stop</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">
                Direct Routes Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.currentCityRecommendations.map((rec, idx) => {
                const globalIndex = suggestions.historySuggestions.length + idx;
                const isSelected = selectedIndex === globalIndex;
                const isHighSpeed = rec.hubConnection.isHighSpeed;

                return (
                  <div
                    key={rec.destination.id}
                    onClick={() => onSelectDestination(rec.destination, rec.destination.categoryHint)}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-amber-50/80 border-amber-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={rec.destination.image}
                          alt={rec.destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {isHighSpeed && (
                          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-500 rounded-bl-md flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                            {rec.destination.name}
                          </span>
                          {isHighSpeed && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px] border border-amber-300">
                              Vande Bharat
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] font-semibold text-indigo-700 mt-0.5 flex items-center gap-1">
                          <span>{rec.hubConnection.mode}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">{rec.hubConnection.duration}</span>
                        </p>

                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {rec.hubConnection.routeNote}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">From</span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{rec.hubConnection.startingFare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. LIVE QUERY MATCHES (When typing) */}
        {hasQueryMatches && query && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-600">
                <Search className="w-3.5 h-3.5 text-indigo-600" />
                <span>Matching Destinations &amp; Hubs</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {suggestions.queryMatches.map((match, idx) => {
                const globalIndex =
                  suggestions.historySuggestions.length +
                  suggestions.currentCityRecommendations.length +
                  idx;
                const isSelected = selectedIndex === globalIndex;

                return (
                  <div
                    key={match.destination.id}
                    onClick={() => onSelectDestination(match.destination, match.destination.categoryHint)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-300"
                        : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={match.destination.image}
                          alt={match.destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                            {match.destination.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {match.destination.state}
                          </span>
                          {match.destination.airportCode && (
                            <span className="font-mono text-[9px] text-blue-600 font-bold bg-blue-50 px-1 py-0.5 rounded">
                              ✈️ {match.destination.airportCode}
                            </span>
                          )}
                          {match.destination.railwayCode && (
                            <span className="font-mono text-[9px] text-amber-700 font-bold bg-amber-50 px-1 py-0.5 rounded">
                              🚆 {match.destination.railwayCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {match.destination.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                        {match.matchedField}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. QUICK TRAVEL THEME SHORTCUTS */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Themes:
          </span>
          {[
            { label: "⚡ Vande Bharat Corridors", query: "Vande Bharat", cat: "trains" as ServiceCategory },
            { label: "🏖️ Goa & Coastal", query: "Goa", cat: "flights" as ServiceCategory },
            { label: "🛕 Kashi & Ayodhya Yatra", query: "Varanasi", cat: "pilgrimage" as ServiceCategory },
            { label: "⛰️ Manali & Himachal", query: "Manali", cat: "buses" as ServiceCategory },
            { label: "🏛️ Rajasthan Havelis", query: "Jaipur", cat: "hotels" as ServiceCategory },
            { label: "☕ Coorg & Nilgiris", query: "Coorg", cat: "resorts" as ServiceCategory },
          ].map((theme, i) => (
            <button
              key={i}
              onClick={() => onSelectHistoryItem(theme.query, theme.cat)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[10px] font-bold transition-all border border-slate-200/80 cursor-pointer"
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
