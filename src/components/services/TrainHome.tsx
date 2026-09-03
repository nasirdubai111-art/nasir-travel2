import React, { useState } from "react";
import {
  Train,
  ArrowRightLeft,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Radio,
  RotateCcw,
  Navigation,
  Info,
  SlidersHorizontal,
  Coffee,
  Bell,
  TrendingDown,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_TRAINS, DetailedTrainItem, TrainCoachClass } from "../../data/trainData";
import { CITIES_DATABASE } from "../../data/mockTravelData";
import { PriceWatchService } from "../../services/PriceWatchService";
import { TrainLiveStatusModal } from "../trains/TrainLiveStatusModal";
import { TrainSeatBookingModal } from "../trains/TrainSeatBookingModal";
import { TrainCancellationModal } from "../trains/TrainCancellationModal";
import { TravelCheckbox } from "../common/TravelCheckbox";
import { SmartAlternativeDatesBar } from "../pricewatch/SmartAlternativeDatesBar";

interface TrainHomeProps {
  currentLocation: CityLocation;
  onBookTrain: (train: any, selectedClass: any) => void;
  onOpenAIDrawer: () => void;
  onOpenPriceWatch?: () => void;
}

export function TrainHome({
  currentLocation,
  onBookTrain,
  onOpenAIDrawer,
  onOpenPriceWatch,
}: TrainHomeProps) {
  const [fromStation, setFromStation] = useState(currentLocation.railwayCode || "NDLS");
  const [toStation, setToStation] = useState("BSB");
  const [journeyDate, setJourneyDate] = useState("2026-09-02");
  const [quota, setQuota] = useState("GENERAL");
  const [pnrInput, setPnrInput] = useState("");
  const [pnrResult, setPnrResult] = useState<any>(null);
  const [isCheckingPnr, setIsCheckingPnr] = useState(false);

  // Train Filter Checkboxes
  const [filterVandeBharatOnly, setFilterVandeBharatOnly] = useState(false);
  const [filterPantryOnly, setFilterPantryOnly] = useState(false);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  // Modal States
  const [liveStatusTrain, setLiveStatusTrain] = useState<DetailedTrainItem | null>(null);
  const [bookingTrain, setBookingTrain] = useState<DetailedTrainItem | null>(null);
  const [bookingClass, setBookingClass] = useState<TrainCoachClass | null>(null);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);

  const handleCheckPnr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;

    setIsCheckingPnr(true);
    try {
      const res = await fetch("/api/pnr-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr: pnrInput }),
      });
      const data = await res.json();
      if (data.success) {
        setPnrResult(data.data);
      }
    } catch {
      setPnrResult({
        pnr: pnrInput,
        trainName: "Vande Bharat Express (22436)",
        dateOfJourney: "28 Aug 2026",
        passengers: [{ number: 1, currentStatus: "CNF / C4 / 23 (Window)" }],
        expectedArrival: "14:00 PM (On Time)",
      });
    } finally {
      setIsCheckingPnr(false);
    }
  };

  const handleOpenBooking = (train: DetailedTrainItem, cls: TrainCoachClass) => {
    setBookingTrain(train);
    setBookingClass(cls);
  };

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookTrain(bookingTrain, bookingClass);
  };

  // Automatically record train searches for Smart Route Alert engine
  React.useEffect(() => {
    const fromCity = CITIES_DATABASE.find((c) => c.railwayCode === fromStation)?.name || fromStation;
    const toCity = CITIES_DATABASE.find((c) => c.railwayCode === toStation)?.name || toStation;
    const basePrice = filteredTrains[0]?.classes[0]?.price || 1850;

    PriceWatchService.recordSearch({
      type: "train",
      originCode: fromStation,
      originCity: fromCity,
      destinationCode: toStation,
      destinationCity: toCity,
      searchedDate: journeyDate,
      currentPrice: basePrice,
      carrierName: filteredTrains[0]?.trainName || "Vande Bharat Express (22436)",
    });
  }, [fromStation, toStation, journeyDate]);

  // Listen for applied alternative dates from Smart Route Alerts
  React.useEffect(() => {
    const handleApplyDate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type: string;
        date: string;
        origin: string;
        dest: string;
      }>;
      if (customEvent.detail && customEvent.detail.type === "train") {
        if (customEvent.detail.date) setJourneyDate(customEvent.detail.date);
        if (customEvent.detail.origin) setFromStation(customEvent.detail.origin);
        if (customEvent.detail.dest) setToStation(customEvent.detail.dest);
      }
    };

    window.addEventListener("bharatyatra:apply-alternative-date", handleApplyDate);
    return () => {
      window.removeEventListener("bharatyatra:apply-alternative-date", handleApplyDate);
    };
  }, []);

  const filteredTrains = DETAILED_TRAINS.filter((train) => {
    if (filterVandeBharatOnly && !train.isVandeBharat) return false;
    if (filterPantryOnly && !train.isPantryAvailable) return false;
    if (filterAvailableOnly) {
      const hasAvailable = train.classes.some((c) => c.status.startsWith("AVAILABLE"));
      if (!hasAvailable) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Train Hero Search Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Train className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    IRCTC Train Booking &amp; Tatkal Hub
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-xs font-bold border border-[#16A34A]/40 uppercase bg-white">
                    Official IRCTC Partner
                  </span>
                </div>
                <p className="text-sm text-slate-200 mt-0.5">
                  Zero Gateway Charges • 100% Refund on Waitlist • Instant Tatkal Assistance
                </p>
              </div>
            </div>

            {/* Quota Selector & Partner Hub */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-white/15 p-1 rounded-xl text-xs font-semibold overflow-x-auto border border-white/20">
                {["GENERAL", "TATKAL", "PREMIUM TATKAL", "LADIES", "SENIOR CITIZEN"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuota(q)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      quota === q ? "bg-white text-[#0B5ED7] font-bold shadow-xs" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Inputs (Height 48-52px) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
            {/* From Station */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">From Station</label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              >
                {CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                  <option key={c.id} value={c.railwayCode}>
                    {c.name} ({c.railwayCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex items-end justify-center pb-0.5">
              <button
                type="button"
                onClick={() => {
                  const temp = fromStation;
                  setFromStation(toStation);
                  setToStation(temp);
                }}
                className="w-11 h-11 rounded-xl bg-white text-[#0B5ED7] hover:bg-[#F0F7FF] flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">To Destination</label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              >
                {CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                  <option key={c.id} value={c.railwayCode}>
                    {c.name} ({c.railwayCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Date of Journey</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            {/* Search Trigger */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Rail: Live Status, PNR & Cancellation Refund Tool */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PNR Tool */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#0B5ED7]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">Live PNR Status</h3>
          </div>
          <form onSubmit={handleCheckPnr} className="flex gap-2">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="10-Digit PNR..."
              className="flex-1 h-11 px-3.5 rounded-xl bg-[#F5F9FC] border border-[#E2E8F0] text-sm text-[#172033] placeholder:text-[#64748B] font-mono"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={isCheckingPnr || !pnrInput.trim()}
              className="h-11 px-4 rounded-xl bg-[#0B5ED7] text-white font-semibold text-xs hover:bg-[#094eb3] transition-colors cursor-pointer"
            >
              Check
            </button>
          </form>
        </div>

        {/* Live Running GPS Shortcut */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#16A34A] animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">Live Train Running GPS</h3>
            </div>
            <span className="text-[11px] text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2 py-0.5 rounded">GPS Active</span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">Track exact delays, platform numbers, and next upcoming station.</p>
          <button
            type="button"
            onClick={() => setLiveStatusTrain(DETAILED_TRAINS[0])}
            className="mt-3 h-10 px-3 rounded-xl bg-[#F0F7FF] hover:bg-[#0B5ED7]/10 text-[#0B5ED7] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#0B5ED7]/20 cursor-pointer"
          >
            <span>Track Vande Bharat (22436) Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Free Cancellation Assistance */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">Free Cancel &amp; Refund</h3>
            </div>
            <span className="text-[11px] text-[#16A34A] font-semibold">100% Refund</span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">Get instant refund back to your UPI/bank on waitlist or train cancellation.</p>
          <button
            type="button"
            onClick={() => setIsCancellationModalOpen(true)}
            className="mt-3 h-10 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#172033] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E2E8F0] cursor-pointer"
          >
            <span>View IRCTC Refund Rules</span>
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PNR Search Results Banner */}
      {pnrResult && (
        <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#16A34A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              <span className="font-bold text-sm text-[#172033]">PNR #{pnrResult.pnr} Status Found:</span>
              <span className="text-xs text-[#64748B] font-mono">({pnrResult.trainName})</span>
            </div>
            <p className="text-xs text-[#172033] mt-1">
              Date: <strong>{pnrResult.dateOfJourney}</strong> •{" "}
              Passenger 1 Status: <strong>{pnrResult.passengers?.[0]?.currentStatus || "CNF / Confirmed"}</strong>
            </p>
          </div>
          <span className="text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-3 py-1.5 rounded-xl border border-[#16A34A]/30 w-fit">
            Expected Arrival: {pnrResult.expectedArrival}
          </span>
        </div>
      )}

      {/* Smart Route Alert Alternative Dates Bar */}
      <SmartAlternativeDatesBar
        originCode={fromStation}
        originCity={CITIES_DATABASE.find((c) => c.railwayCode === fromStation)?.name || fromStation}
        destinationCode={toStation}
        destinationCity={CITIES_DATABASE.find((c) => c.railwayCode === toStation)?.name || toStation}
        selectedDate={journeyDate}
        currentPrice={filteredTrains[0]?.classes[0]?.price || 1850}
        transportType="train"
        carrierName={filteredTrains[0]?.trainName}
        onSelectDate={(newDate) => setJourneyDate(newDate)}
        onOpenPriceWatch={() => onOpenPriceWatch?.()}
      />

      {/* Main 2-Column Section (240-260px Filter Sidebar + Train Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Train Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Train Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredTrains.length} trains</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Train Type</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="train-filter-vb"
                checked={filterVandeBharatOnly}
                onChange={setFilterVandeBharatOnly}
                label="⚡ Vande Bharat Only"
                count="160 km/h"
              />
              <TravelCheckbox
                id="train-filter-pantry"
                checked={filterPantryOnly}
                onChange={setFilterPantryOnly}
                label="🍽️ Pantry / Meals Included"
              />
              <TravelCheckbox
                id="train-filter-avail"
                checked={filterAvailableOnly}
                onChange={setFilterAvailableOnly}
                label="✅ Confirmed Seats Only"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Journey Class</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="train-cls-ec"
                checked={true}
                onChange={() => {}}
                label="Executive Chair Car (EC)"
              />
              <TravelCheckbox
                id="train-cls-cc"
                checked={true}
                onChange={() => {}}
                label="AC Chair Car (CC)"
              />
              <TravelCheckbox
                id="train-cls-3a"
                checked={true}
                onChange={() => {}}
                label="AC 3 Tier (3A / 3E)"
              />
              <TravelCheckbox
                id="train-cls-2a"
                checked={true}
                onChange={() => {}}
                label="AC 2 Tier (2A)"
              />
              <TravelCheckbox
                id="train-cls-1a"
                checked={true}
                onChange={() => {}}
                label="AC First Class (1A)"
              />
            </div>
          </div>
        </aside>

        {/* Available Trains Listing */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
                  <span>Available Trains ({filteredTrains.length})</span>
                  <span className="text-xs text-[#64748B] font-normal font-mono bg-[#F5F9FC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {fromStation} ➔ {toStation}
                  </span>
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    const origC = CITIES_DATABASE.find((c) => c.railwayCode === fromStation);
                    const destC = CITIES_DATABASE.find((c) => c.railwayCode === toStation);
                    PriceWatchService.addWatchedRoute({
                      type: "train",
                      originCode: fromStation,
                      originName: origC ? `${origC.name} Station` : `${fromStation} Station`,
                      originCity: origC ? origC.name : fromStation,
                      destinationCode: toStation,
                      destinationName: destC ? `${destC.name} Station` : `${toStation} Station`,
                      destinationCity: destC ? destC.name : toStation,
                      journeyDate: journeyDate,
                      carrierName: "All Express & Vande Bharat Trains",
                      basePrice: filteredTrains[0]?.classes[0]?.price || 2450,
                      targetDropPercent: 10,
                      notificationChannels: ["push", "whatsapp"],
                    });
                    if (onOpenPriceWatch) onOpenPriceWatch();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#F0F7FF] text-[#0B5ED7] hover:bg-[#E0EFFF] border border-[#0B5ED7]/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Watch Train Route for ≥ 10% Price Drop Alert"
                >
                  <Bell className="w-3.5 h-3.5 text-[#0B5ED7] animate-bounce" />
                  <span>Watch Route (≥10% Drop Alert)</span>
                </button>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">Quota: {quota} • IRCTC Authorized Direct Gateway</p>
            </div>

            <span className="text-xs text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#16A34A]/20 self-start sm:self-auto">
              ✓ Tatkal Booking Active
            </span>
          </div>

          <div className="space-y-4">
            {filteredTrains.map((train) => (
              <div
                key={train.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  train.isVandeBharat
                    ? "bg-white border-[#38BDF8] shadow-xs hover:border-[#0B5ED7]"
                    : "bg-white border-[#E2E8F0] hover:border-[#0B5ED7] shadow-xs"
                }`}
              >
                {/* Train Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#F0F7FF] text-[#0B5ED7] flex items-center justify-center font-bold text-lg shrink-0 border border-[#0B5ED7]/20">
                      🚆
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#172033] text-[16px]">{train.trainName}</h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F5F9FC] text-[#64748B] font-bold border border-[#E2E8F0]">
                          #{train.trainNumber}
                        </span>
                        {train.isVandeBharat && (
                          <span className="px-2 py-0.5 rounded bg-[#0B5ED7] text-white text-[10px] font-bold uppercase tracking-wider">
                            High Speed 160 km/h
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Runs On: {train.runningDays.join(" • ")} • Pantry: {train.isPantryAvailable ? "Available 🍽️" : "No Pantry"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs flex-wrap">
                    <div className="text-left sm:text-right">
                      <span className="font-bold text-[#172033] text-sm">{train.departureTime}</span>
                      <span className="text-[11px] text-[#64748B] block">{train.fromStationName} ({train.fromStationCode})</span>
                    </div>
                    <div className="text-center px-2.5 py-1 rounded-lg bg-[#F5F9FC] text-[#64748B] text-[11px] font-bold border border-[#E2E8F0]">
                      {train.duration}
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-[#172033] text-sm">{train.arrivalTime}</span>
                      <span className="text-[11px] text-[#64748B] block">{train.toStationName} ({train.toStationCode})</span>
                    </div>

                    {/* Price Watch Button */}
                    <button
                      type="button"
                      onClick={() => {
                        PriceWatchService.addWatchedRoute({
                          type: "train",
                          originCode: train.fromStationCode,
                          originName: `${train.fromStationName} Station`,
                          originCity: train.fromStationName,
                          destinationCode: train.toStationCode,
                          destinationName: `${train.toStationName} Station`,
                          destinationCity: train.toStationName,
                          journeyDate: journeyDate,
                          carrierName: `${train.trainName} (${train.trainNumber})`,
                          serviceNumber: train.trainNumber,
                          basePrice: train.classes[0]?.price || 2450,
                          targetDropPercent: 10,
                          notificationChannels: ["push", "whatsapp"],
                        });
                        if (onOpenPriceWatch) onOpenPriceWatch();
                      }}
                      className="p-2 rounded-xl border border-[#E2E8F0] hover:border-[#0B5ED7] hover:bg-[#F0F7FF] text-[#64748B] hover:text-[#0B5ED7] transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
                      title="Watch Train Fare for ≥ 10% Price Drop Alert"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#0B5ED7]" />
                      <span className="hidden sm:inline">Watch Price</span>
                    </button>

                    {/* Live Track Trigger */}
                    <button
                      type="button"
                      onClick={() => setLiveStatusTrain(train)}
                      className="p-2 rounded-xl bg-[#F0F7FF] text-[#0B5ED7] hover:bg-[#0B5ED7] hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
                      title="Live Running Status"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span className="hidden md:inline">Live GPS</span>
                    </button>
                  </div>
                </div>

                {/* Class & Seat Availability Cards */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {train.classes.map((cls) => {
                    const displayFare = quota === "TATKAL" ? cls.tatkalPrice : cls.price;
                    return (
                      <div
                        key={cls.classCode}
                        className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F5F9FC] hover:bg-[#F0F7FF] hover:border-[#0B5ED7] transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#172033] text-xs">{cls.className} ({cls.classCode})</span>
                            <span className="font-bold text-[#172033] text-sm">₹{displayFare}</span>
                          </div>
                          <div className="mt-1.5">
                            <span
                              className={`text-xs font-bold ${
                                cls.status.startsWith("AVAILABLE")
                                  ? "text-[#16A34A]"
                                  : cls.status.startsWith("RAC")
                                  ? "text-[#FF8A00]"
                                  : "text-[#DC2626]"
                              }`}
                            >
                              {cls.status}
                            </span>
                            {cls.confirmProbability > 0 && (
                              <span className="text-[11px] text-[#64748B] block">
                                {cls.confirmProbability}% Confirm Chance
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBooking(train, cls)}
                          className="mt-3 w-full h-10 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
                        >
                          Book {cls.classCode}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Train Modals */}
      {liveStatusTrain && (
        <TrainLiveStatusModal
          isOpen={!!liveStatusTrain}
          onClose={() => setLiveStatusTrain(null)}
          train={liveStatusTrain}
        />
      )}

      {bookingTrain && bookingClass && (
        <TrainSeatBookingModal
          isOpen={!!bookingTrain && !!bookingClass}
          onClose={() => {
            setBookingTrain(null);
            setBookingClass(null);
          }}
          train={bookingTrain}
          selectedClass={bookingClass}
          quota={quota}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      <TrainCancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => setIsCancellationModalOpen(false)}
      />
    </div>
  );
}
