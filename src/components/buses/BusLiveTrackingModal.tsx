import React from "react";
import {
  X,
  Bus,
  Navigation,
  Phone,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Radio,
} from "lucide-react";
import { DetailedBusItem } from "../../data/busData";

interface BusLiveTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: DetailedBusItem | null;
}

export function BusLiveTrackingModal({
  isOpen,
  onClose,
  bus,
}: BusLiveTrackingModalProps) {
  if (!isOpen || !bus) return null;

  const tracking = bus.liveTracking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-red-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold">{bus.operator}</h2>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 text-[10px] font-bold font-mono">
                  {tracking.vehicleRegNo}
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">{bus.fromCity} ➔ {bus.toCity}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Telemetry Status Strip */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">Live Highway GPS Stream</span>
          </div>

          <div className="flex items-center gap-2 text-rose-300 font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Speed: {tracking.speedKmh} km/h</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Simulated Map Visual Box */}
          <div className="relative h-44 rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col justify-between p-4 text-white">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Route Highway</span>
                <span className="font-bold text-white">{tracking.routeHighway}</span>
              </div>

              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Signal Strong</span>
              </div>
            </div>

            {/* Moving Bus Pin */}
            <div className="relative z-10 flex items-center gap-2 animate-pulse self-center">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white text-slate-900 px-3 py-1 rounded-xl text-xs font-bold shadow-lg">
                📍 {tracking.currentLocation}
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-end text-xs text-slate-400">
              <span>Origin: {bus.fromCity.split(" ")[0]}</span>
              <span>Next Halt: {tracking.nextStopEta}</span>
              <span>Destination: {bus.toCity.split(" ")[0]}</span>
            </div>
          </div>

          {/* Next Halt Card */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-900">Upcoming Scheduled Stoppage:</span>
              <h4 className="text-sm font-extrabold text-slate-900">{tracking.nextStop}</h4>
              <p className="text-xs text-slate-600">
                Estimated Arrival Time: <strong className="text-rose-700">{tracking.nextStopEta}</strong>
              </p>
            </div>
          </div>

          {/* Pilot / Chauffeur Contact */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                👨‍✈️
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Captain</span>
                <span className="text-xs font-bold text-slate-900 block">{tracking.driverName}</span>
                <span className="text-[11px] text-slate-500">{tracking.driverPhone}</span>
              </div>
            </div>

            <a
              href={`tel:${tracking.driverPhone}`}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Pilot</span>
            </a>
          </div>

          {/* Amenities on this bus */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bus Amenities &amp; Safety:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {bus.amenities.map((a, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-700">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800">
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
}
