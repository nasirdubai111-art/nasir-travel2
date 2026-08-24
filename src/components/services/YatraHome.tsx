import React, { useState } from "react";
import {
  Landmark,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRight,
  Sun,
  Flame,
  Clock,
  Shirt,
  Calendar,
  Briefcase,
  Users,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { MOCK_YATRAS } from "../../data/mockTravelData";
import { DETAILED_TEMPLES, DetailedTempleItem } from "../../data/yatraData";
import { TempleDarshanModal } from "../yatra/TempleDarshanModal";
import { PilgrimageOperatorProfileView } from "../yatra/PilgrimageOperatorProfileView";

interface YatraHomeProps {
  currentLocation: CityLocation;
  onBookYatra: (yatra: any) => void;
  onOpenAIDrawer: () => void;
  onOpenPilgrimageOperatorBackend?: () => void;
  onAddBookingToState?: (booking: BookingItem) => void;
}

export function YatraHome({
  currentLocation,
  onBookYatra,
  onOpenAIDrawer,
  onOpenPilgrimageOperatorBackend,
  onAddBookingToState,
}: YatraHomeProps) {
  const [selectedTemple, setSelectedTemple] = useState<DetailedTempleItem | null>(null);
  const [activeTab, setActiveTab] = useState<"operators" | "temples" | "circuits">("operators");

  const handleBookingSuccess = (newBooking: BookingItem) => {
    if (onAddBookingToState) {
      onAddBookingToState(newBooking);
    }
    onBookYatra(newBooking);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Yatra Hero Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Sacred Pilgrimage &amp; Divya Yatra Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  VIP Sugam Darshan &amp; Heli Yatras
                </span>
              </div>
              <p className="text-xs text-amber-200">
                Govt Empanelled Pilgrimage Operators • Temple Board Priority Passes • 100% Satvik Food • Senior Citizen Oxygen Care
              </p>
            </div>
          </div>

          {/* Navigation Toggle & Operator Backend Link */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex bg-white/10 p-1 rounded-2xl text-xs font-semibold overflow-x-auto gap-1 border border-white/10">
              <button
                onClick={() => setActiveTab("operators")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "operators"
                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                    : "text-amber-200 hover:text-white hover:bg-white/5"
                }`}
              >
                🕉️ Pilgrimage Operators &amp; Profiles
              </button>
              <button
                onClick={() => setActiveTab("temples")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "temples"
                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                    : "text-amber-200 hover:text-white hover:bg-white/5"
                }`}
              >
                🪔 Temple Darshan &amp; Rituals ({DETAILED_TEMPLES.length})
              </button>
              <button
                onClick={() => setActiveTab("circuits")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "circuits"
                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                    : "text-amber-200 hover:text-white hover:bg-white/5"
                }`}
              >
                🚩 Sacred Circuits ({MOCK_YATRAS.length})
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onOpenPilgrimageOperatorBackend && (
                <button
                  type="button"
                  onClick={onOpenPilgrimageOperatorBackend}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                  title="Pilgrimage Operator Enterprise Backoffice, Helicopter Manifests & Passes"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Operator Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View 1: Pilgrimage Operator Public Profile View */}
      {activeTab === "operators" && (
        <PilgrimageOperatorProfileView
          onInitiateBooking={handleBookingSuccess}
          onOpenOperatorBackend={onOpenPilgrimageOperatorBackend}
          onOpenAIDrawer={onOpenAIDrawer}
        />
      )}

      {/* View 2: Temples Database & Live Aarti/Darshan Booking */}
      {activeTab === "temples" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Sacred Sanatan Temples &amp; Dhams</span>
              <span className="text-xs text-slate-400 font-normal">Direct Shrine Trust VIP Slot Booking</span>
            </h2>
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold">
              ✓ Prasad Home Delivery Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILED_TEMPLES.map((temple) => (
              <div
                key={temple.id}
                className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold uppercase">
                      {temple.circuit}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-xs">
                    {temple.deity}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{temple.name}</h3>
                    <p className="text-xs text-amber-700 font-semibold">{temple.location}, {temple.state}</p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {temple.significance}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px] font-semibold">
                          {temple.darshanTimings.morning} • {temple.darshanTimings.evening}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px] text-slate-500 line-clamp-1">{temple.dressCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Sugam VIP Darshan</span>
                      <span className="text-base font-black text-slate-900">₹300</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedTemple(temple)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Book Darshan &amp; Puja</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Full Yatra Packages Grid */}
      {activeTab === "circuits" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Sanatan Sacred Pilgrimage Circuits</span>
            <span className="text-xs text-slate-400 font-normal">All-inclusive Satvik packages</span>
          </h2>

          <div className="space-y-6">
            {MOCK_YATRAS.map((yatra) => (
              <div
                key={yatra.id}
                className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all flex flex-col lg:flex-row"
              >
                {/* Image */}
                <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={yatra.image}
                    alt={yatra.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/30">
                      {yatra.circuit}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 lg:w-2/3 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Presiding Deity: {yatra.sacredDeity}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">{yatra.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{yatra.duration}</p>

                    {/* Route Summary */}
                    <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700">
                      <span className="font-bold text-amber-900 block text-[11px] uppercase">Route Circuit:</span>
                      <p className="mt-0.5 leading-relaxed">{yatra.itinerarySummary}</p>
                    </div>

                    {/* Badges / Inclusions */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">VIP Darshan</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">Satvik Bhojan</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="text-[11px]">Senior Care</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">Purohit Puja</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-2xl font-black text-slate-900">
                        ₹{yatra.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-slate-400 block">/ Yatri (All Stays, Meals &amp; Darshan Included)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onBookYatra(yatra)}
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-slate-950 font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <span>Book Yatra Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Temple Darshan & Ritual Booking Modal */}
      <TempleDarshanModal
        isOpen={!!selectedTemple}
        onClose={() => setSelectedTemple(null)}
        temple={selectedTemple}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

