import React, { useState } from "react";
import {
  Bus,
  Search,
  Star,
  Zap,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Wifi,
  Coffee,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_BUSES, DetailedBusItem } from "../../data/busData";
import { BusSeatMapModal } from "../buses/BusSeatMapModal";
import { BusLiveTrackingModal } from "../buses/BusLiveTrackingModal";

interface BusHomeProps {
  currentLocation: CityLocation;
  onBookBus: (bus: any) => void;
  onOpenAIDrawer: () => void;
  onOpenBusOperatorPortal?: () => void;
}

export function BusHome({
  currentLocation,
  onBookBus,
  onOpenAIDrawer,
  onOpenBusOperatorPortal,
}: BusHomeProps) {
  const [filterType, setFilterType] = useState<"all" | "electric" | "volvo" | "primo">("all");
  const [selectedBusForSeatMap, setSelectedBusForSeatMap] = useState<DetailedBusItem | null>(null);
  const [selectedBusForTracking, setSelectedBusForTracking] = useState<DetailedBusItem | null>(null);

  const filteredBuses = DETAILED_BUSES.filter((bus) => {
    if (filterType === "electric") return bus.isElectric;
    if (filterType === "volvo") return bus.busType.toLowerCase().includes("volvo");
    if (filterType === "primo") return bus.isPrimo;
    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookBus(selectedBusForSeatMap);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Bus Banner */}
      <div className="bg-gradient-to-br from-rose-900 via-red-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30">
              <Bus className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Intercity Volvo &amp; Electric Bus Hub
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Live GPS Tracking
                </span>
              </div>
              <p className="text-xs text-rose-200">10,000+ AC Sleeper &amp; Seater Routes • On-time Guarantee • Female Passenger Safe Rows</p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: "all", label: "All Intercity Buses" },
              { id: "electric", label: "🌱 100% Electric Intercity (NueGo)" },
              { id: "volvo", label: "🚌 Volvo 9600 Multi-Axle AC Sleeper" },
              { id: "primo", label: "⭐ Primo Certified (Top Rated)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                  filterType === f.id
                    ? "bg-rose-500 text-white border-rose-400 shadow-xs"
                    : "bg-white/10 text-rose-200 border-white/10 hover:bg-white/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {onOpenBusOperatorPortal && (
          <div className="shrink-0 relative z-10">
            <button
              onClick={onOpenBusOperatorPortal}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Bus className="w-4 h-4 text-rose-300" />
              <span>Bus Operator Portal</span>
            </button>
          </div>
        )}
      </div>

      {/* Bus Listing */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
          <span>Available Intercity Buses ({filteredBuses.length})</span>
          <span className="text-xs text-slate-400 font-normal">₹500 Delay Refund Guarantee</span>
        </h2>

        <div className="space-y-4">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:border-rose-300 hover:shadow-md transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{bus.operator}</h3>
                  <div className="flex items-center gap-0.5 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{bus.rating}</span>
                  </div>
                  {bus.isPrimo && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase border border-amber-300">
                      Primo 5★
                    </span>
                  )}
                  {bus.isElectric && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-300 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-600" /> Zero Emission
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium">{bus.busType}</p>

                {/* Route & Times */}
                <div className="flex items-center gap-4 text-xs pt-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{bus.departureTime}</span>
                    <span className="text-[11px] text-slate-400 block">{bus.fromCity}</span>
                  </div>
                  <div className="text-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {bus.duration}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{bus.arrivalTime}</span>
                    <span className="text-[11px] text-slate-400 block">{bus.toCity}</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {bus.amenities.map((am, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      {am.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="text-xl font-black text-slate-900">
                    ₹{bus.price.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold block">
                    {bus.availableSeatsCount} Seats Left
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBusForTracking(bus)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Live GPS Bus Location"
                  >
                    <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span className="hidden sm:inline">Track Bus</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBusForSeatMap(bus)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Select Seats</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Seat Map & Booking Modal */}
      <BusSeatMapModal
        isOpen={!!selectedBusForSeatMap}
        onClose={() => setSelectedBusForSeatMap(null)}
        bus={selectedBusForSeatMap}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Live GPS Telemetry Modal */}
      <BusLiveTrackingModal
        isOpen={!!selectedBusForTracking}
        onClose={() => setSelectedBusForTracking(null)}
        bus={selectedBusForTracking}
      />
    </div>
  );
}

