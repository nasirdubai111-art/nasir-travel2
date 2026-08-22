import React, { useState } from "react";
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  Filter,
  Globe,
  Plus,
  Trash2,
  Armchair,
  Luggage,
  UtensilsCrossed,
  Receipt,
  RotateCcw,
  Navigation,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { CityLocation, FlightDeal } from "../../types";
import {
  AIRPORTS_DATABASE,
  DETAILED_FLIGHTS_DATABASE,
  FLIGHT_FARE_TIERS,
  FlightExtendedDeal,
  FlightAirport,
} from "../../data/flightData";
import { FlightBookingCheckoutModal } from "../flights/FlightBookingCheckoutModal";
import { FlightStatusModal } from "../flights/FlightStatusModal";
import { FlightManagePNRModal } from "../flights/FlightManagePNRModal";
import { FlightFareRulesModal } from "../flights/FlightFareRulesModal";

interface FlightHomeProps {
  currentLocation: CityLocation;
  onBookFlight?: (flight: FlightDeal) => void;
  onOpenAIDrawer: () => void;
}

export function FlightHome({
  currentLocation,
  onBookFlight,
  onOpenAIDrawer,
}: FlightHomeProps) {
  // Flight Scope: Domestic vs International
  const [flightScope, setFlightScope] = useState<"domestic" | "international">("domestic");

  // Trip Type: One-Way, Round-Trip, Multi-City
  const [tripType, setTripType] = useState<"oneway" | "round" | "multi">("oneway");

  // Route Selections
  const [fromCode, setFromCode] = useState(currentLocation.airportCode || "DEL");
  const [toCode, setToCode] = useState(flightScope === "domestic" ? "BOM" : "DXB");
  const [departDate, setDepartDate] = useState("2026-08-28");
  const [returnDate, setReturnDate] = useState("2026-09-04");
  const [travelerCount, setTravelerCount] = useState(1);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business">("Economy");
  const [specialFare, setSpecialFare] = useState("regular");

  // Multi-City Legs
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{ from: string; to: string; date: string }>>([
    { from: "DEL", to: "BOM", date: "2026-08-28" },
    { from: "BOM", to: "DXB", date: "2026-09-01" },
    { from: "DXB", to: "DEL", date: "2026-09-08" },
  ]);

  // Filters & Sorting
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState("all");
  const [stopsFilter, setStopsFilter] = useState<"all" | "nonstop" | "1stop">("all");
  const [sortBy, setSortBy] = useState<"cheapest" | "fastest" | "earliest">("cheapest");
  const [expandedFareFlightId, setExpandedFareFlightId] = useState<string | null>(null);

  // Modals
  const [selectedFlightForCheckout, setSelectedFlightForCheckout] = useState<FlightExtendedDeal | null>(null);
  const [selectedTierForCheckout, setSelectedTierForCheckout] = useState<"saver" | "flexi" | "superflex" | "business">("saver");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isManagePnrModalOpen, setIsManagePnrModalOpen] = useState(false);
  const [isFareRulesModalOpen, setIsFareRulesModalOpen] = useState(false);
  const [rulesModalFlight, setRulesModalFlight] = useState<FlightExtendedDeal | null>(null);

  // Swap Airports
  const handleSwapAirports = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Switch Scope
  const handleScopeChange = (scope: "domestic" | "international") => {
    setFlightScope(scope);
    if (scope === "international") {
      setFromCode("DEL");
      setToCode("DXB");
    } else {
      setFromCode("DEL");
      setToCode("BOM");
    }
  };

  // Add Multi City Leg
  const handleAddLeg = () => {
    if (multiCityLegs.length >= 5) return;
    const lastLeg = multiCityLegs[multiCityLegs.length - 1];
    setMultiCityLegs([
      ...multiCityLegs,
      { from: lastLeg ? lastLeg.to : "BOM", to: "BLR", date: "2026-09-12" },
    ]);
  };

  const handleRemoveLeg = (idx: number) => {
    if (multiCityLegs.length <= 2) return;
    setMultiCityLegs(multiCityLegs.filter((_, i) => i !== idx));
  };

  // Filtered Flights List
  const availableAirports = AIRPORTS_DATABASE.filter((a) =>
    flightScope === "domestic" ? a.isDomestic : true
  );

  let flightList = DETAILED_FLIGHTS_DATABASE.filter((fl) => {
    // Scope filter
    if (flightScope === "domestic" && fl.isInternational) return false;
    if (flightScope === "international" && !fl.isInternational) return false;

    // Airline filter
    if (selectedAirlineFilter !== "all" && !fl.airline.toLowerCase().includes(selectedAirlineFilter.toLowerCase())) {
      return false;
    }

    // Stops filter
    if (stopsFilter === "nonstop" && fl.stops !== "Non-stop") return false;
    if (stopsFilter === "1stop" && fl.stops === "Non-stop") return false;

    return true;
  });

  // If no exact match, fallback to scope list for rich demonstration
  if (flightList.length === 0) {
    flightList = DETAILED_FLIGHTS_DATABASE.filter((fl) =>
      flightScope === "domestic" ? !fl.isInternational : fl.isInternational
    );
  }

  // Sorting
  flightList.sort((a, b) => {
    if (sortBy === "cheapest") return a.price - b.price;
    if (sortBy === "fastest") return a.duration.localeCompare(b.duration);
    if (sortBy === "earliest") return a.departTime.localeCompare(b.departTime);
    return 0;
  });

  const handleOpenBooking = (flight: FlightExtendedDeal, tierId: "saver" | "flexi" | "superflex" | "business" = "saver") => {
    setSelectedFlightForCheckout(flight);
    setSelectedTierForCheckout(tierId);
    if (onBookFlight) onBookFlight(flight);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Quick Access Action Bar: Status Tracker, PNR Lookup, AI Travel Assistant */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setIsStatusModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 transition-all shadow-2xs"
          >
            <Plane className="w-4 h-4 text-sky-400" />
            <span>Live Flight Status &amp; Radar</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManagePnrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold flex items-center gap-2 transition-all shadow-2xs"
          >
            <Receipt className="w-4 h-4 text-sky-600" />
            <span>Manage Booking / PNR Lookup</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManagePnrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-800 font-bold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Cancellation &amp; Refunds Tracker</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenAIDrawer}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all ml-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Flight Deals</span>
        </button>
      </div>

      {/* 2. Primary Flight Search Card */}
      <div className="bg-gradient-to-br from-sky-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl space-y-6 relative z-10">
          {/* Header Controls: Domestic/International & Trip Types */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Domestic vs International Switch */}
            <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/10 text-xs font-extrabold backdrop-blur-xs">
              <button
                type="button"
                onClick={() => handleScopeChange("domestic")}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  flightScope === "domestic"
                    ? "bg-sky-500 text-white shadow-md font-black"
                    : "text-sky-200 hover:text-white"
                }`}
              >
                <Plane className="w-4 h-4" />
                <span>Domestic Flights</span>
              </button>
              <button
                type="button"
                onClick={() => handleScopeChange("international")}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  flightScope === "international"
                    ? "bg-sky-500 text-white shadow-md font-black"
                    : "text-sky-200 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>International Flights</span>
              </button>
            </div>

            {/* Trip Type Selector: One Way, Round Trip, Multi-City */}
            <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold">
              {(["oneway", "round", "multi"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTripType(t)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    tripType === t ? "bg-white text-slate-900 shadow-xs font-bold" : "text-sky-200 hover:text-white"
                  }`}
                >
                  {t === "oneway" ? "One Way" : t === "round" ? "Round Trip" : "Multi-City"}
                </button>
              ))}
            </div>
          </div>

          {/* Search Inputs Layout */}
          {tripType !== "multi" ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 grid grid-cols-1 md:grid-cols-12 gap-3 shadow-lg">
              {/* From Airport */}
              <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">From Origin</label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer mt-0.5"
                >
                  {availableAirports.map((a) => (
                    <option key={a.id} value={a.code}>
                      {a.city} ({a.code}) - {a.country}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 truncate block">Direct airport hub</span>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-center justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-600 hover:text-sky-600 shadow-xs transition-transform active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To Airport */}
              <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">To Destination</label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer mt-0.5"
                >
                  {AIRPORTS_DATABASE.map((a) => (
                    <option key={a.id} value={a.code}>
                      {a.city} ({a.code}) - {a.country}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 truncate block">Fastest flights available</span>
              </div>

              {/* Departure & Return Dates */}
              <div className={`${tripType === "round" ? "md:col-span-3" : "md:col-span-3"} grid ${tripType === "round" ? "grid-cols-2 gap-2" : "grid-cols-1"}`}>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Departure</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none mt-0.5"
                  />
                  <span className="text-[10px] text-emerald-600 font-bold block">Lowest fare</span>
                </div>

                {tripType === "round" && (
                  <div className="p-3 rounded-xl border border-sky-300 bg-sky-50/50 transition-colors">
                    <label className="text-[10px] uppercase font-bold text-sky-700 block">Return</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none mt-0.5"
                    />
                    <span className="text-[10px] text-sky-600 font-bold block">Save ₹800 Combo</span>
                  </div>
                )}
              </div>

              {/* Search Trigger */}
              <div className="md:col-span-2 flex items-center">
                <button
                  type="button"
                  onClick={() => alert(`Searching guaranteed lowest fares for ${fromCode} ➔ ${toCode}...`)}
                  className="w-full h-full min-h-[48px] rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Flights</span>
                </button>
              </div>
            </div>
          ) : (
            /* Multi-City Leg Builder */
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900">Multi-City Itinerary Planner</h3>
                <span className="text-xs text-slate-500">Plan up to 5 flight legs in a single booking</span>
              </div>

              <div className="space-y-3">
                {multiCityLegs.map((leg, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center">
                    <div className="md:col-span-1 text-xs font-mono font-bold text-slate-500">
                      Leg {idx + 1}
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[9px] uppercase font-bold text-slate-400 block">From</label>
                      <select
                        value={leg.from}
                        onChange={(e) => {
                          const updated = [...multiCityLegs];
                          updated[idx].from = e.target.value;
                          setMultiCityLegs(updated);
                        }}
                        className="w-full font-bold text-xs bg-transparent"
                      >
                        {AIRPORTS_DATABASE.map((a) => (
                          <option key={a.id} value={a.code}>
                            {a.city} ({a.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-[9px] uppercase font-bold text-slate-400 block">To</label>
                      <select
                        value={leg.to}
                        onChange={(e) => {
                          const updated = [...multiCityLegs];
                          updated[idx].to = e.target.value;
                          setMultiCityLegs(updated);
                        }}
                        className="w-full font-bold text-xs bg-transparent"
                      >
                        {AIRPORTS_DATABASE.map((a) => (
                          <option key={a.id} value={a.code}>
                            {a.city} ({a.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-[9px] uppercase font-bold text-slate-400 block">Date</label>
                      <input
                        type="date"
                        value={leg.date}
                        onChange={(e) => {
                          const updated = [...multiCityLegs];
                          updated[idx].date = e.target.value;
                          setMultiCityLegs(updated);
                        }}
                        className="w-full font-bold text-xs bg-transparent"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      {multiCityLegs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(idx)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Flight Leg</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Searching multi-city routes for ${multiCityLegs.length} legs...`)}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Multi-City Flights</span>
                </button>
              </div>
            </div>
          )}

          {/* Special Fares & Cabin Class */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sky-200 text-xs font-semibold">Special Concessions:</span>
              {[
                { id: "regular", label: "Regular Fares" },
                { id: "armed", label: "Armed Forces (₹600 Off)" },
                { id: "student", label: "Student (Extra 10kg Bag)" },
                { id: "senior", label: "Senior Citizen (Flat 6% Off)" },
                { id: "doctor", label: "Doctors & Nurses" },
              ].map((fare) => (
                <button
                  key={fare.id}
                  onClick={() => setSpecialFare(fare.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    specialFare === fare.id
                      ? "bg-sky-400 text-slate-950 font-bold border-sky-300 shadow-2xs"
                      : "bg-white/10 text-sky-100 border-white/10 hover:bg-white/20"
                  }`}
                >
                  {fare.label}
                </button>
              ))}
            </div>

            {/* Cabin Class Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sky-200">Cabin:</span>
              {(["Economy", "Premium Economy", "Business"] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setCabinClass(cls)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    cabinClass === cls ? "bg-white text-slate-950" : "text-sky-200 hover:text-white"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fare Comparison, Airline Filter, & Flight Listings */}
      <div className="space-y-4">
        {/* Results Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Available Flights &amp; Fares ({flightList.length})</span>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold font-mono">
                {fromCode} ➔ {toCode}
              </span>
            </h2>
            <p className="text-xs text-slate-500">Live prices from Airline GDS • Guaranteed Lowest Price</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Stops Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStopsFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  stopsFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStopsFilter("nonstop")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  stopsFilter === "nonstop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                Non-Stop Only
              </button>
            </div>

            {/* Airline Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold text-[11px]">Airline:</span>
              <select
                value={selectedAirlineFilter}
                onChange={(e) => setSelectedAirlineFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50"
              >
                <option value="all">All Airlines</option>
                <option value="IndiGo">IndiGo</option>
                <option value="Air India">Air India</option>
                <option value="Vistara">Vistara</option>
                <option value="Akasa">Akasa Air</option>
                <option value="Emirates">Emirates</option>
                <option value="Singapore">Singapore Airlines</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50"
              >
                <option value="cheapest">Cheapest First</option>
                <option value="fastest">Fastest Duration</option>
                <option value="earliest">Earliest Departure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flight Cards Grid */}
        <div className="space-y-4">
          {flightList.map((flight) => {
            const isFareExpanded = expandedFareFlightId === flight.id;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                {/* Main Card Strip */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  {/* Airline Brand & Aircraft Info */}
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center p-2 shrink-0">
                      <Plane className="w-7 h-7 text-sky-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{flight.airline}</h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                          {flight.flightNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {flight.aircraft} • {flight.onTimePerformance}
                      </p>
                    </div>
                  </div>

                  {/* Flight Schedule */}
                  <div className="flex items-center gap-6 sm:gap-10 text-center flex-1 justify-center">
                    <div>
                      <div className="text-2xl font-black text-slate-900 font-mono">{flight.departTime}</div>
                      <div className="text-xs font-bold text-slate-700 font-mono">{flight.fromCode}</div>
                      <span className="text-[10px] text-slate-400 block">{flight.terminalDep}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{flight.duration}</span>
                      <div className="w-24 sm:w-36 h-0.5 bg-slate-200 relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-500 absolute" />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">{flight.stops}</span>
                    </div>

                    <div>
                      <div className="text-2xl font-black text-slate-900 font-mono">{flight.arriveTime}</div>
                      <div className="text-xs font-bold text-slate-700 font-mono">{flight.toCode}</div>
                      <span className="text-[10px] text-slate-400 block">{flight.terminalArr}</span>
                    </div>
                  </div>

                  {/* Perks Tags */}
                  <div className="hidden xl:flex flex-col gap-1 text-xs text-slate-500 min-w-[180px]">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <Luggage className="w-3.5 h-3.5" />
                      <span>{flight.checkInBaggageKg}kg Check-in + 7kg Cabin</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                      <span>{flight.mealsIncluded ? "Complimentary Hot Meals" : "In-flight Food on Demand"}</span>
                    </span>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 line-through">₹{flight.originalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">
                          ₹{flight.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">Use HDFCFLY for ₹1,500 off</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedFareFlightId(isFareExpanded ? null : flight.id)}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Compare Fares</span>
                        {isFareExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(flight, "saver")}
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-98"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Round Trip Return Option preview if round-trip selected */}
                {tripType === "round" && flight.returnFlight && (
                  <div className="bg-sky-50/60 border-t border-sky-100 px-6 py-3 flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold font-mono">
                        RETURN FLIGHT
                      </span>
                      <span className="font-bold">{flight.returnFlight.airline} {flight.returnFlight.flightNumber}</span>
                      <span className="text-slate-500 font-mono">
                        ({flight.toCode} ➔ {flight.fromCode} • {flight.returnFlight.departTime} - {flight.returnFlight.arriveTime})
                      </span>
                    </div>
                    <div className="font-bold text-sky-800">
                      Combo Total: ₹{(flight.price + flight.returnFlight.price - 800).toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] text-emerald-600 font-black">(Saved ₹800)</span>
                    </div>
                  </div>
                )}

                {/* Expandable Fare Families Comparison Grid */}
                {isFareExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-5 sm:p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          Select Fare Bundle for {flight.airline} {flight.flightNumber}
                        </h4>
                        <p className="text-xs text-slate-500">Pick the flexibility and baggage tier that fits your itinerary</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRulesModalFlight(flight);
                          setIsFareRulesModalOpen(true);
                        }}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Fare Rules Breakdown</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {FLIGHT_FARE_TIERS.map((tier) => {
                        const tierTotalPrice = flight.price + tier.priceDelta;

                        return (
                          <div
                            key={tier.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-sky-500 hover:shadow-md transition-all space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="font-black text-slate-900 text-sm">{tier.name}</h5>
                                {tier.badge && (
                                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-black">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500">{tier.tagline}</p>

                              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center gap-1.5">
                                  <Luggage className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-[11px]">{tier.checkInBaggage}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Armchair className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-[11px]">{tier.seatSelection}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-[11px]">{tier.dateChangeFee}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="text-[11px]">{tier.mealBenefit}</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div>
                                <span className="text-base font-black text-slate-900">
                                  ₹{tierTotalPrice.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenBooking(flight, tier.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-2xs transition-all"
                              >
                                Select Tier
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedFlightForCheckout && (
        <FlightBookingCheckoutModal
          isOpen={!!selectedFlightForCheckout}
          onClose={() => setSelectedFlightForCheckout(null)}
          flight={selectedFlightForCheckout}
          selectedTierId={selectedTierForCheckout}
          initialPassengerCount={travelerCount}
        />
      )}

      {/* Flight Status Tracker Modal */}
      {isStatusModalOpen && (
        <FlightStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
        />
      )}

      {/* Manage PNR, Cancellation & Refunds Modal */}
      {isManagePnrModalOpen && (
        <FlightManagePNRModal
          isOpen={isManagePnrModalOpen}
          onClose={() => setIsManagePnrModalOpen(false)}
        />
      )}

      {/* Standalone Fare Rules Modal */}
      {isFareRulesModalOpen && rulesModalFlight && (
        <FlightFareRulesModal
          isOpen={isFareRulesModalOpen}
          onClose={() => setIsFareRulesModalOpen(false)}
          flight={rulesModalFlight}
          selectedTier="saver"
        />
      )}
    </div>
  );
}
