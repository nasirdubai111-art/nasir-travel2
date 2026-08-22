import React, { useState } from "react";
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
    onAskAI(query);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleAIPlanSubmit} className="p-4 border-b border-slate-100 flex items-center gap-3">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Maya</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Service Category Jump */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
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
                  onSelectCategory(s.id);
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-slate-800 transition-all text-left"
              >
                {s.icon}
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Searches */}
        <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Trending India Travel Searches</span>
          </div>

          <div className="space-y-1.5">
            {quickSearchShortcuts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectCategory(q.category);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs text-slate-700 hover:text-indigo-600 group transition-colors"
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
  );
}
