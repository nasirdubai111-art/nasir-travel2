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
} from "lucide-react";
import { ServiceCategory } from "../types";
import { SearchHistory, RecentSearchItem } from "./SearchHistory";

const SEARCH_HISTORY_STORAGE_KEY = "bharatyatra_recent_searches";

const INITIAL_DEFAULT_SEARCHES: RecentSearchItem[] = [
  {
    id: "search-1",
    query: "Delhi to Varanasi Vande Bharat Express",
    category: "trains",
    timestamp: Date.now() - 1000 * 60 * 20, // 20 mins ago
  },
  {
    id: "search-2",
    query: "Direct Flights to Goa this weekend",
    category: "flights",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
  },
  {
    id: "search-3",
    query: "Luxury Heritage Havelis in Jaipur",
    category: "hotels",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: "search-4",
    query: "Chardham Yatra 2026 Registration & Package",
    category: "pilgrimage",
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
  },
  {
    id: "search-5",
    query: "Volvo AC Sleeper Delhi to Manali",
    category: "buses",
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
  },
];

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
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectCategory,
  onAskAI,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch {
      // ignore storage parsing error
    }
    return INITIAL_DEFAULT_SEARCHES;
  });

  // Keep state synced with localStorage
  const saveRecentSearches = (items: RecentSearchItem[]) => {
    const capped = items.slice(0, 5);
    setRecentSearches(capped);
    try {
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(capped));
    } catch {
      // ignore storage error
    }
  };

  const addSearchToHistory = (searchQuery: string, explicitCategory?: ServiceCategory) => {
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) return;

    const detected = explicitCategory || detectCategoryFromQuery(cleanQuery);
    const existingIndex = recentSearches.findIndex(
      (item) => item.query.toLowerCase() === cleanQuery.toLowerCase()
    );

    let updated: RecentSearchItem[];
    if (existingIndex >= 0) {
      const existing = recentSearches[existingIndex];
      const rest = recentSearches.filter((_, idx) => idx !== existingIndex);
      updated = [
        {
          ...existing,
          query: cleanQuery,
          category: detected || existing.category,
          timestamp: Date.now(),
        },
        ...rest,
      ];
    } else {
      const newItem: RecentSearchItem = {
        id: `search-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        query: cleanQuery,
        category: detected,
        timestamp: Date.now(),
      };
      updated = [newItem, ...recentSearches];
    }

    saveRecentSearches(updated);
  };

  const handleRemoveHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item.id !== id);
    saveRecentSearches(updated);
  };

  const handleClearAllHistory = () => {
    saveRecentSearches([]);
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
          {/* User's 5 Recent Search Queries History Component */}
          <SearchHistory
            recentSearches={recentSearches}
            onSelectQuery={handleSelectRecentQuery}
            onAskAIQuery={handleAskAIQuery}
            onRemoveItem={handleRemoveHistoryItem}
            onClearAll={handleClearAllHistory}
          />

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

