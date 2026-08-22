import React from "react";
import {
  Palmtree,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sun,
  ShieldCheck,
} from "lucide-react";
import { CityLocation, ResortItem } from "../../types";
import { MOCK_RESORTS } from "../../data/mockTravelData";

interface ResortHomeProps {
  currentLocation: CityLocation;
  onBookResort: (resort: ResortItem) => void;
  onOpenAIDrawer: () => void;
}

export function ResortHome({
  currentLocation,
  onBookResort,
  onOpenAIDrawer,
}: ResortHomeProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Resort Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Palmtree className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Luxury Resorts &amp; Wellness Retreats
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  5-Star Luxury
                </span>
              </div>
              <p className="text-xs text-emerald-200">Ayurveda Healing in Kerala • Coorg Plantation Homestays • Beachfront Private Villas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resorts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Handpicked Experiential Retreats</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_RESORTS.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={resort.image}
                  alt={resort.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {resort.theme}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{resort.rating}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{resort.destination}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{resort.name}</h3>

                  {/* Highlights List */}
                  <div className="mt-3 space-y-1.5">
                    {resort.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Included Experiences */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Complimentary Experiences:</span>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      {resort.includedExperiences.join(" • ")}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{resort.pricePerNight.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-slate-500 block">/ Night ({resort.mealPlan})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookResort(resort)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>Book Retreat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
