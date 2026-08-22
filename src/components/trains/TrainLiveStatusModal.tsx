import React from "react";
import {
  X,
  Train,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  Sparkles,
  Zap,
  Radio,
  Calendar,
} from "lucide-react";
import { DetailedTrainItem } from "../../data/trainData";

interface TrainLiveStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: DetailedTrainItem | null;
}

export function TrainLiveStatusModal({
  isOpen,
  onClose,
  train,
}: TrainLiveStatusModalProps) {
  if (!isOpen || !train) return null;

  const status = train.currentRunningStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl border border-white/30">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{train.trainName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-950 text-xs font-mono font-bold">
                  #{train.trainNumber}
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                {train.fromStationName} ({train.fromStationCode}) ➔ {train.toStationName} ({train.toStationCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Running Badge Strip */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Live Satellite GPS Tracking
            </span>
            <span className="text-[11px] text-slate-400 font-mono">({status.lastUpdated})</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Speed: {status.currentSpeedKmh} km/h</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border ${
              status.delayMinutes === 0
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-300 border-rose-500/20"
            }`}>
              {status.delayMinutes === 0 ? "Right On Time" : `Delayed by ${status.delayMinutes}m`}
            </div>
          </div>
        </div>

        {/* Real-time Status Card */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <Radio className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Current Running Broadcast:</h4>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{status.statusText}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-amber-800">
                <span>Next Station: <strong>{status.nextStation}</strong></span>
                <span>•</span>
                <span>Expected Platform: <strong>{status.nextStationPlatform}</strong></span>
                <span>•</span>
                <span>ETA: <strong>{status.estimatedArrival}</strong></span>
              </div>
            </div>
          </div>

          {/* Stoppages Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Complete Route Schedule &amp; Live Arrival Status</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {train.routeStops.map((stop, idx) => {
                const isDeparted = stop.currentStatus === "departed";
                const isCurrent = stop.currentStatus === "current";
                const isUpcoming = stop.currentStatus === "upcoming";

                return (
                  <div
                    key={stop.stationCode}
                    className={`p-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCurrent
                        ? "bg-amber-100/70 border-l-4 border-l-amber-600 font-medium"
                        : isDeparted
                        ? "bg-slate-50/70 text-slate-500"
                        : "bg-white hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isDeparted
                          ? "bg-emerald-100 text-emerald-700"
                          : isCurrent
                          ? "bg-amber-500 text-white animate-bounce"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {isDeparted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{stop.stationName}</span>
                          <span className="font-mono text-slate-400 text-[10px]">({stop.stationCode})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Dist: {stop.distanceKm} km</span>
                          <span>•</span>
                          <span>Halt: {stop.haltMinutes}m</span>
                          <span>•</span>
                          <span className="font-bold text-slate-600">Platform #{stop.platform}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900">
                        {stop.arrivalTime !== "--" ? stop.arrivalTime : stop.departureTime}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {isDeparted && <span className="text-emerald-600 font-semibold">Departed</span>}
                        {isCurrent && <span className="text-amber-700 font-bold">Arrived / Next Stop</span>}
                        {isUpcoming && <span className="text-slate-400">Scheduled</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coach Position Guide */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Standard Rake &amp; Coach Layout (Engine ➔ Rear):
            </h4>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[10px] font-mono font-bold text-slate-700">
              <span className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white shrink-0">ENG (WAP-7)</span>
              <span className="px-2 py-1.5 rounded-lg bg-slate-200 shrink-0">EOG</span>
              <span className="px-2 py-1.5 rounded-lg bg-blue-100 border border-blue-300 shrink-0">C1</span>
              <span className="px-2 py-1.5 rounded-lg bg-blue-100 border border-blue-300 shrink-0">C2</span>
              <span className="px-2 py-1.5 rounded-lg bg-blue-100 border border-blue-300 shrink-0">C3</span>
              <span className="px-2 py-1.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-800 shrink-0">E1 (Exec)</span>
              <span className="px-2 py-1.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-800 shrink-0">E2 (Exec)</span>
              <span className="px-2 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 shrink-0">Pantry</span>
              <span className="px-2 py-1.5 rounded-lg bg-blue-100 border border-blue-300 shrink-0">C4</span>
              <span className="px-2 py-1.5 rounded-lg bg-blue-100 border border-blue-300 shrink-0">C5</span>
              <span className="px-2 py-1.5 rounded-lg bg-slate-200 shrink-0">SLR</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Status
          </button>
        </div>
      </div>
    </div>
  );
}
