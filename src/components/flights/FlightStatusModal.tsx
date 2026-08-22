import React, { useState } from "react";
import {
  X,
  Search,
  Plane,
  Clock,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Luggage,
  Navigation,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { LIVE_FLIGHTS_TRACKER, LiveFlightStatusItem, AIRPORTS_DATABASE } from "../../data/flightData";

interface FlightStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlightStatusModal({ isOpen, onClose }: FlightStatusModalProps) {
  const [searchMode, setSearchMode] = useState<"flight" | "route">("flight");
  const [flightNumberQuery, setFlightNumberQuery] = useState("6E-2041");
  const [fromAirport, setFromAirport] = useState("DEL");
  const [toAirport, setToAirport] = useState("BOM");
  const [statusResults, setStatusResults] = useState<LiveFlightStatusItem[]>(LIVE_FLIGHTS_TRACKER);
  const [selectedFlight, setSelectedFlight] = useState<LiveFlightStatusItem>(LIVE_FLIGHTS_TRACKER[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRefreshing(true);
    setTimeout(() => {
      if (searchMode === "flight") {
        const found = LIVE_FLIGHTS_TRACKER.filter((f) =>
          f.flightNumber.toLowerCase().includes(flightNumberQuery.trim().toLowerCase())
        );
        setStatusResults(found.length > 0 ? found : LIVE_FLIGHTS_TRACKER);
        if (found.length > 0) setSelectedFlight(found[0]);
      } else {
        const found = LIVE_FLIGHTS_TRACKER.filter(
          (f) => f.fromCode === fromAirport && f.toCode === toAirport
        );
        setStatusResults(found.length > 0 ? found : LIVE_FLIGHTS_TRACKER);
        if (found.length > 0) setSelectedFlight(found[0]);
      }
      setIsRefreshing(false);
    }, 400);
  };

  const getStatusBadge = (status: LiveFlightStatusItem["status"]) => {
    switch (status) {
      case "ON_TIME":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">ON TIME</span>;
      case "BOARDING":
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black animate-pulse">BOARDING NOW</span>;
      case "DEPARTED":
        return <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black">IN FLIGHT</span>;
      case "LANDED":
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black">ARRIVED / LANDED</span>;
      case "DELAYED":
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">DELAYED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black">SCHEDULED</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-blue-900 to-indigo-950 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Radar &amp; ADS-B Network
              </span>
              <span className="text-xs text-sky-200">Real-time DGCA &amp; Airline Feeds</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" />
              <span>Live Flight Status &amp; Airport Gates</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Panel */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setSearchMode("flight")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  searchMode === "flight" ? "bg-sky-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                By Flight Number (e.g. 6E-2041)
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("route")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  searchMode === "route" ? "bg-sky-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                By Route (From / To)
              </button>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="text-xs text-slate-500 hover:text-sky-600 font-bold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {searchMode === "flight" ? (
              <div className="sm:col-span-9 relative">
                <input
                  type="text"
                  value={flightNumberQuery}
                  onChange={(e) => setFlightNumberQuery(e.target.value.toUpperCase())}
                  placeholder="Enter Airline & Flight Number (e.g. 6E-2041, AI-887, UK-945, EK-512)..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-sm bg-white"
                />
              </div>
            ) : (
              <>
                <div className="sm:col-span-4">
                  <select
                    value={fromAirport}
                    onChange={(e) => setFromAirport(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none font-bold text-xs bg-white"
                  >
                    {AIRPORTS_DATABASE.map((a) => (
                      <option key={a.id} value={a.code}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-5">
                  <select
                    value={toAirport}
                    onChange={(e) => setToAirport(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none font-bold text-xs bg-white"
                  >
                    {AIRPORTS_DATABASE.map((a) => (
                      <option key={a.id} value={a.code}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[44px] rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Track Flight</span>
              </button>
            </div>
          </form>
        </div>

        {/* Status Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active Flight Detail Card */}
          {selectedFlight && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6">
              {/* Flight Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/10">
                    <Plane className="w-7 h-7 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black">{selectedFlight.airline}</h3>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
                        {selectedFlight.flightNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{selectedFlight.aircraft}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedFlight.status)}
                </div>
              </div>

              {/* Origin -> Progress -> Destination */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-center">
                {/* Origin */}
                <div className="md:col-span-4 text-left space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Departure Airport</span>
                  <div className="text-3xl font-black font-mono text-white">{selectedFlight.fromCode}</div>
                  <div className="text-sm font-bold text-sky-300">{selectedFlight.fromCity}</div>
                  <p className="text-xs text-slate-400">{selectedFlight.fromAirport}</p>
                  <div className="pt-2">
                    <span className="text-xs text-slate-400">Sched: </span>
                    <span className="text-xs font-mono font-bold text-white">{selectedFlight.scheduledDep}</span>
                    <span className="mx-1 text-slate-600">|</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">Est: {selectedFlight.estimatedDep}</span>
                  </div>
                </div>

                {/* Radar Track Visual */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{selectedFlight.altitude}</span>
                    <span>{selectedFlight.speed}</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${selectedFlight.progressPercent}%` }}
                    />
                  </div>

                  <p className="text-xs font-bold text-sky-200 animate-pulse">{selectedFlight.statusText}</p>
                </div>

                {/* Destination */}
                <div className="md:col-span-4 text-right space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Arrival Airport</span>
                  <div className="text-3xl font-black font-mono text-white">{selectedFlight.toCode}</div>
                  <div className="text-sm font-bold text-sky-300">{selectedFlight.toCity}</div>
                  <p className="text-xs text-slate-400">{selectedFlight.toAirport}</p>
                  <div className="pt-2">
                    <span className="text-xs text-slate-400">Sched: </span>
                    <span className="text-xs font-mono font-bold text-white">{selectedFlight.scheduledArr}</span>
                    <span className="mx-1 text-slate-600">|</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">Est: {selectedFlight.estimatedArr}</span>
                  </div>
                </div>
              </div>

              {/* Airport Operational Data: Terminal, Gate, Baggage Carousel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure Terminal</span>
                  <span className="text-sm font-black text-white">{selectedFlight.fromTerminal}</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Boarding Gate</span>
                  <span className="text-sm font-black text-sky-400">{selectedFlight.gate}</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Arrival Terminal</span>
                  <span className="text-sm font-black text-white">{selectedFlight.toTerminal}</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Baggage Carousel</span>
                  <span className="text-sm font-black text-emerald-400">{selectedFlight.baggageBelt}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Select other live tracked flights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Other Active Flights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statusResults.map((fl) => (
                <button
                  key={fl.flightNumber}
                  type="button"
                  onClick={() => setSelectedFlight(fl)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedFlight?.flightNumber === fl.flightNumber
                      ? "border-sky-500 bg-sky-50 shadow-xs ring-1 ring-sky-500"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{fl.flightNumber}</span>
                      <span className="text-xs text-slate-500">({fl.airline})</span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-600">
                      {fl.fromCode} ➔ {fl.toCode} • Gate {fl.gate}
                    </div>
                  </div>
                  <div>{getStatusBadge(fl.status)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
