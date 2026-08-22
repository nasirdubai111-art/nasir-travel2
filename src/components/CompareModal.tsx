import React, { useState } from "react";
import {
  X,
  ArrowRight,
  Plane,
  Train,
  Bus,
  Car,
  Clock,
  IndianRupee,
  Leaf,
  Briefcase,
  ShieldCheck,
  Zap,
  TrendingDown,
  Sparkles,
  Search,
} from "lucide-react";
import { ServiceCategory } from "../types";
import { ROUTE_COMPARISONS, RouteComparison } from "../data/travelExperienceData";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
  onOpenAIDrawer: () => void;
}

export function CompareModal({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenAIDrawer,
}: CompareModalProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("del-jai");
  const currentRoute = ROUTE_COMPARISONS.find((r) => r.id === selectedRouteId) || ROUTE_COMPARISONS[0];

  if (!isOpen) return null;

  const getModeIcon = (cat: string) => {
    switch (cat) {
      case "flights": return <Plane className="w-5 h-5 text-sky-600" />;
      case "trains": return <Train className="w-5 h-5 text-amber-600" />;
      case "buses": return <Bus className="w-5 h-5 text-red-600" />;
      case "cabs": return <Car className="w-5 h-5 text-cyan-600" />;
      default: return <Zap className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "flights": return "border-sky-300 bg-sky-50/50 hover:border-sky-500";
      case "trains": return "border-amber-300 bg-amber-50/50 hover:border-amber-500";
      case "buses": return "border-red-300 bg-red-50/50 hover:border-red-500";
      case "cabs": return "border-cyan-300 bg-cyan-50/50 hover:border-cyan-500";
      default: return "border-slate-300 bg-slate-50";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Multi-Modal Travel Comparison Engine</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  Flight vs Train vs Bus vs Cab
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Compare travel time, fare, comfort, carbon footprint & luggage across all 4 modes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Selector Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Select Corridor:</span>
            {ROUTE_COMPARISONS.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRouteId === route.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {route.fromCity} ➔ {route.toCity}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAIDrawer}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Corridor Advice</span>
          </button>
        </div>

        {/* Corridor Summary Banner */}
        <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {currentRoute.fromCity} ➔ {currentRoute.toCity}
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                  Approx. {currentRoute.distanceKm} km
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {currentRoute.overview}
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-indigo-200 shadow-2xs shrink-0 text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-indigo-600">BharatYatra Recommendation</span>
              <p className="text-sm font-extrabold text-slate-900 capitalize flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                {getModeIcon(currentRoute.recommendedMode)}
                <span>{currentRoute.recommendedMode} Mode</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Mode Comparison Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRoute.modes.map((mode) => (
              <div
                key={mode.category}
                className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all relative ${getCategoryColor(
                  mode.category
                )}`}
              >
                {mode.badge && (
                  <div className="absolute -top-3 left-4 bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs border border-amber-400">
                    {mode.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center">
                        {getModeIcon(mode.category)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{mode.serviceName}</h4>
                        <p className="text-[10px] text-slate-500">{mode.subTitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 my-3 text-xs">
                    {/* Time */}
                    <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Taken
                      </span>
                      <strong className="text-slate-900">{mode.duration}</strong>
                    </div>

                    {/* Fare */}
                    <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Approx. Fare
                      </span>
                      <strong className="text-indigo-700 text-sm">
                        ₹{mode.price.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    {/* Punctuality */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Punctuality:</span>
                      <span className="font-bold text-emerald-700">{mode.punctualityScore}</span>
                    </div>

                    {/* Luggage */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Luggage Limit:</span>
                      <span className="font-semibold text-slate-800">{mode.luggageLimit}</span>
                    </div>

                    {/* Carbon footprint */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-600" /> Emission:
                      </span>
                      <span className="font-semibold text-slate-700 text-[10px]">{mode.carbonFootprint}</span>
                    </div>

                    {/* Frequency */}
                    <div className="text-[11px] text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-200/60">
                      <strong>Frequency:</strong> {mode.scheduleFrequency}
                    </div>

                    <p className="text-[11px] text-slate-600 italic bg-white/80 p-2 rounded-xl border border-slate-200">
                      "{mode.bestFor}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectCategory(mode.category as ServiceCategory);
                  }}
                  className="w-full mt-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Book {mode.category.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Decision Helper */}
          <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <p className="text-slate-700">
                <strong>BharatYatra Best Price Guarantee:</strong> Lowest fares on Flights, zero tatkal booking fee on IRCTC Vande Bharat trains, and GPS-tracked Sleeper buses.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0"
            >
              Done Comparing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
