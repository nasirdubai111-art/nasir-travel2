import React from "react";
import {
  History,
  X,
  Trash2,
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Landmark,
  Car,
  UtensilsCrossed,
  Compass,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { ServiceCategory } from "../types";

export interface RecentSearchItem {
  id: string;
  query: string;
  category?: ServiceCategory;
  timestamp: number;
}

interface SearchHistoryProps {
  recentSearches: RecentSearchItem[];
  onSelectQuery: (query: string, category?: ServiceCategory) => void;
  onAskAIQuery: (query: string) => void;
  onRemoveItem: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function getCategoryIcon(category?: ServiceCategory) {
  switch (category) {
    case "flights":
      return <Plane className="w-3.5 h-3.5 text-sky-500" />;
    case "trains":
      return <Train className="w-3.5 h-3.5 text-amber-500" />;
    case "buses":
      return <Bus className="w-3.5 h-3.5 text-rose-500" />;
    case "hotels":
      return <Building2 className="w-3.5 h-3.5 text-indigo-500" />;
    case "resorts":
      return <Palmtree className="w-3.5 h-3.5 text-emerald-500" />;
    case "pilgrimage":
      return <Landmark className="w-3.5 h-3.5 text-amber-600" />;
    case "cabs":
      return <Car className="w-3.5 h-3.5 text-cyan-500" />;
    case "dining":
      return <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />;
    default:
      return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
  }
}

export function getCategoryBadgeLabel(category?: ServiceCategory): string {
  switch (category) {
    case "flights":
      return "Flights";
    case "trains":
      return "IRCTC";
    case "buses":
      return "Buses";
    case "hotels":
      return "Hotels";
    case "resorts":
      return "Resorts";
    case "pilgrimage":
      return "Yatra";
    case "cabs":
      return "Cabs";
    case "dining":
      return "Dining";
    default:
      return "AI Plan";
  }
}

export function SearchHistory({
  recentSearches,
  onSelectQuery,
  onAskAIQuery,
  onRemoveItem,
  onClearAll,
}: SearchHistoryProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  // Display only the 5 most recent items
  const displayItems = recentSearches.slice(0, 5);

  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/70">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <History className="w-3.5 h-3.5 text-indigo-600" />
          <span>Recent Search History</span>
          <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
            {displayItems.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors"
          title="Clear search history"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-2xs"
          >
            {/* Clickable search query info */}
            <button
              type="button"
              onClick={() => onSelectQuery(item.query, item.category)}
              className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
              title={`Search for "${item.query}"`}
            >
              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-100/70 transition-colors shrink-0">
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 truncate">
                  {item.query}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  <span>•</span>
                  <span className="text-indigo-600 font-medium font-mono">
                    {getCategoryBadgeLabel(item.category)}
                  </span>
                </div>
              </div>
            </button>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => onAskAIQuery(item.query)}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-[11px] font-bold transition-colors"
                title="Ask AI Maya with this query"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectQuery(item.query, item.category)}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                title="Quick Fill"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => onRemoveItem(item.id, e)}
                className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                title="Remove from history"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
