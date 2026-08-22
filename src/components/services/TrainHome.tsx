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
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_TRAINS, DetailedTrainItem, TrainCoachClass } from "../../data/trainData";
import { CITIES_DATABASE } from "../../data/mockTravelData";
import { TrainLiveStatusModal } from "../trains/TrainLiveStatusModal";
import { TrainSeatBookingModal } from "../trains/TrainSeatBookingModal";
import { TrainCancellationModal } from "../trains/TrainCancellationModal";

interface TrainHomeProps {
  currentLocation: CityLocation;
  onBookTrain: (train: any, selectedClass: any) => void;
  onOpenAIDrawer: () => void;
}

export function TrainHome({
  currentLocation,
  onBookTrain,
  onOpenAIDrawer,
}: TrainHomeProps) {
  const [fromStation, setFromStation] = useState(currentLocation.railwayCode || "NDLS");
  const [toStation, setToStation] = useState("BSB");
  const [journeyDate, setJourneyDate] = useState("2026-08-28");
  const [quota, setQuota] = useState("GENERAL");
  const [pnrInput, setPnrInput] = useState("");
  const [pnrResult, setPnrResult] = useState<any>(null);
  const [isCheckingPnr, setIsCheckingPnr] = useState(false);

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
    // Notify parent
    onBookTrain(bookingTrain, bookingClass);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Train Hero Search Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-orange-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Train className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    IRCTC Train Booking &amp; Tatkal Hub
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
                    Official IRCTC Partner
                  </span>
                </div>
                <p className="text-xs text-amber-200">Zero Gateway Charges • 100% Refund on Waitlist • Instant Tatkal Assistance</p>
              </div>
            </div>

            {/* Quota Selector */}
            <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              {["GENERAL", "TATKAL", "PREMIUM TATKAL", "LADIES", "SENIOR CITIZEN"].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuota(q)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    quota === q ? "bg-amber-500 text-slate-950 font-bold shadow-xs" : "text-amber-200 hover:text-white"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Inputs */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 grid grid-cols-1 md:grid-cols-12 gap-3 shadow-lg">
            {/* From Station */}
            <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">From Station</label>
              <select
                value={fromStation}
                onChange={(e) => setFromStation(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer mt-0.5"
              >
                {CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                  <option key={c.id} value={c.railwayCode}>
                    {c.name} ({c.railwayCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex items-center justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={() => {
                  const temp = fromStation;
                  setFromStation(toStation);
                  setToStation(temp);
                }}
                className="p-2 rounded-full border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-600 hover:text-amber-600 shadow-2xs"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">To Destination</label>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer mt-0.5"
              >
                {CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                  <option key={c.id} value={c.railwayCode}>
                    {c.name} ({c.railwayCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Date of Journey</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none mt-0.5"
              />
            </div>

            {/* Search Trigger */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="button"
                className="w-full h-full min-h-[48px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search Trains</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Rail: Live Status, PNR & Cancellation Refund Tool */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PNR Tool */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Live PNR Status</h3>
          </div>
          <form onSubmit={handleCheckPnr} className="flex gap-2">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="10-Digit PNR..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={isCheckingPnr || !pnrInput.trim()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Check
            </button>
          </form>
        </div>

        {/* Live Running GPS Shortcut */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Live Train Running Status</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">GPS Active</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Track exact delays, platform numbers, and next upcoming station.</p>
          <button
            type="button"
            onClick={() => setLiveStatusTrain(DETAILED_TRAINS[0])}
            className="mt-3 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Track Vande Bharat (22436) Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Refund & Cancellation Rules */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Instant Refund Calculator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Calculate exact IRCTC cancellation charges &amp; instant bank refunds.</p>
          <button
            type="button"
            onClick={() => setIsCancellationModalOpen(true)}
            className="mt-3 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>Open Refund Rules &amp; Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PNR Lookup Result Display */}
      {pnrResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-xs">
                PNR: {pnrResult.pnr}
              </span>
              <span className="text-xs font-bold text-emerald-900">{pnrResult.trainName}</span>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              Passenger 1 Status: <strong>{pnrResult.passengers?.[0]?.currentStatus || "CNF / Confirmed"}</strong>
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-300 w-fit">
            Expected Arrival: {pnrResult.expectedArrival}
          </span>
        </div>
      )}

      {/* Available Trains Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Available Trains ({DETAILED_TRAINS.length})</span>
            <span className="text-xs text-slate-400 font-normal">Quota: {quota}</span>
          </h2>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✓ Tatkal Booking Active
          </span>
        </div>

        <div className="space-y-4">
          {DETAILED_TRAINS.map((train) => (
            <div
              key={train.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all ${
                train.isVandeBharat
                  ? "bg-gradient-to-r from-amber-50/40 via-white to-white border-amber-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              {/* Train Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
                    🚆
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{train.trainName}</h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        #{train.trainNumber}
                      </span>
                      {train.isVandeBharat && (
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          High Speed 160 km/h
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Runs On: {train.runningDays.join(" • ")} • Pantry: {train.isPantryAvailable ? "Available 🍽️" : "No Pantry"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-slate-900 text-sm">{train.departureTime}</span>
                    <span className="text-[11px] text-slate-400 block">{train.fromStationName} ({train.fromStationCode})</span>
                  </div>
                  <div className="text-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {train.duration}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 text-sm">{train.arrivalTime}</span>
                    <span className="text-[11px] text-slate-400 block">{train.toStationName} ({train.toStationCode})</span>
                  </div>

                  {/* Live Track Trigger */}
                  <button
                    type="button"
                    onClick={() => setLiveStatusTrain(train)}
                    className="p-2 rounded-xl bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0"
                    title="Live Running Status"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span className="hidden md:inline">Live Status</span>
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
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/40 hover:border-amber-400 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-xs">{cls.className} ({cls.classCode})</span>
                          <span className="font-bold text-slate-900 text-sm">₹{displayFare}</span>
                        </div>
                        <div className="mt-1.5">
                          <span
                            className={`text-xs font-bold ${
                              cls.status.startsWith("AVAILABLE")
                                ? "text-emerald-600"
                                : cls.status.startsWith("RAC")
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {cls.status}
                          </span>
                          {cls.confirmProbability > 0 && (
                            <span className="text-[10px] text-slate-400 block">
                              {cls.confirmProbability}% Confirmation Chance
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(train, cls)}
                        className="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 text-xs font-bold transition-colors"
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

      {/* Interactive Modals */}
      <TrainLiveStatusModal
        isOpen={!!liveStatusTrain}
        onClose={() => setLiveStatusTrain(null)}
        train={liveStatusTrain}
      />

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

      <TrainCancellationModal
        isOpen={isCancellationModalOpen}
        onClose={() => setIsCancellationModalOpen(false)}
      />
    </div>
  );
}
