import React, { useState, useEffect } from "react";
import {
  Train,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  Server,
  Database,
  Key,
  Cpu,
  Download,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  Sliders,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
  RefreshCw,
  Award,
  Sparkles,
  Phone,
  Mail,
  Building,
  Radio,
  Wifi,
  Coffee,
  Tv,
  AirVent,
  Printer,
  Copy,
  Layers,
  ArrowUpDown,
  Ticket,
  Terminal,
} from "lucide-react";
import { trainApi, trainApiService, TrainItem, TrainPnrStatus } from "../../services/trainApi";
import { SUPABASE_URL, TRAIN_API_FUNCTION } from "../../utils/supabase/client";

type TrainSubView =
  | "train_booking_frontend"
  | "irctc_info_frontend"
  | "backend_modules"
  | "admin_console"
  | "integration_architecture";

export function TrainEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<TrainSubView>("train_booking_frontend");

  // Train Search States
  const [fromStation, setFromStation] = useState("NDLS - New Delhi");
  const [toStation, setToStation] = useState("MMCT - Mumbai Central");
  const [journeyDate, setJourneyDate] = useState("2026-08-29");
  const [selectedQuota, setSelectedQuota] = useState("GENERAL");
  const [selectedClass, setSelectedClass] = useState("3A");
  const [pnrInput, setPnrInput] = useState("2849104821");
  const [pnrTracked, setPnrTracked] = useState(false);

  // Live Edge API State
  const [isSearchingTrains, setIsSearchingTrains] = useState(false);
  const [isTrackingPnr, setIsTrackingPnr] = useState(false);
  const [trainResults, setTrainResults] = useState<TrainItem[]>([]);
  const [pnrResult, setPnrResult] = useState<TrainPnrStatus | null>(null);
  const [lastApiLatency, setLastApiLatency] = useState<number | null>(null);
  const [lastApiSource, setLastApiSource] = useState<string | null>(null);

  // Booking Simulation State
  const [passengerName, setPassengerName] = useState("Priya Mukherjee");
  const [passengerAge, setPassengerAge] = useState("31");
  const [passengerGender, setPassengerGender] = useState("Female");
  const [berthPreference, setBerthPreference] = useState("Lower Berth");
  const [isTatkalConfirmed, setIsTatkalConfirmed] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    handleSearchTrains();
  }, []);

  const handleSearchTrains = async () => {
    setIsSearchingTrains(true);
    try {
      const res = await trainApiService.searchTrains({
        fromStation,
        toStation,
        date: journeyDate,
        quota: selectedQuota,
        travelClass: selectedClass,
      });
      if (res.data) {
        setTrainResults(res.data);
      }
      setLastApiLatency(res.latency_ms);
      setLastApiSource(res.source);
    } catch (_err) {
      // Handled gracefully in trainApiService
    } finally {
      setIsSearchingTrains(false);
    }
  };

  const handleTrackPnr = async () => {
    if (!pnrInput.trim()) return;
    setIsTrackingPnr(true);
    try {
      const res = await trainApiService.checkPnr(pnrInput);
      if (res.data) {
        setPnrResult(res.data);
        setPnrTracked(true);
      }
      setLastApiLatency(res.latency_ms);
      setLastApiSource(res.source);
    } catch (_err) {
      // Handled
    } finally {
      setIsTrackingPnr(false);
    }
  };

  // Endpoint Sandbox Tester for all 7 Train API Routes
  const [selectedEndpointTest, setSelectedEndpointTest] = useState<string>("/trains");
  const [endpointResponse, setEndpointResponse] = useState<any>(null);
  const [isExecutingEndpoint, setIsExecutingEndpoint] = useState<boolean>(false);

  const runEndpointTest = async (endpoint: string) => {
    setSelectedEndpointTest(endpoint);
    setIsExecutingEndpoint(true);
    try {
      let res: any;
      if (endpoint === "/trains") {
        res = await trainApi.getTrains();
      } else if (endpoint === "/trains/search") {
        res = await trainApi.searchTrains({ fromStation: "NDLS", toStation: "MMCT", date: "2026-08-29", quota: "GENERAL" });
      } else if (endpoint === "/trains/details/:trainNumber") {
        res = await trainApi.getTrainDetails("12952");
      } else if (endpoint === "/trains/availability") {
        res = await trainApi.checkAvailability({ trainNumber: "12952", date: "2026-08-29", travelClass: "3A", quota: "GENERAL" });
      } else if (endpoint === "/trains/fare") {
        res = await trainApi.calculateFare({ trainNumber: "12952", travelClass: "3A", quota: "GENERAL" });
      } else if (endpoint === "/trains/pnr") {
        res = await trainApi.checkPnr("2849104821");
      } else if (endpoint === "/trains/live-status") {
        res = await trainApi.getLiveStatus("12952");
      }
      setEndpointResponse(res);
    } catch (e: any) {
      setEndpointResponse({ error: e?.message || "Failed to execute endpoint call" });
    } finally {
      setIsExecutingEndpoint(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon for Train Vertical */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("train_booking_frontend")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "train_booking_frontend"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>1. Train Booking (Frontend)</span>
          </button>

          <button
            onClick={() => setActiveSubView("irctc_info_frontend")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "irctc_info_frontend"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>2. Train / IRCTC Info (Frontend)</span>
          </button>

          <button
            onClick={() => setActiveSubView("backend_modules")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "backend_modules"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>3. Backend Rail Modules (Never Displayed)</span>
          </button>

          <button
            onClick={() => setActiveSubView("admin_console")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "admin_console"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Separate Secure Admin Login</span>
          </button>

          <button
            onClick={() => setActiveSubView("integration_architecture")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "integration_architecture"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Integration Architecture</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-3xs font-mono px-2 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Edge Function: <strong>{TRAIN_API_FUNCTION}</strong></span>
          </span>
          <span className="text-3xs font-mono px-2 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
            Vertical: IRCTC Rail
          </span>
        </div>
      </div>

      {/* Supabase Edge Function Live Connection Banner */}
      <div className="p-3 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Supabase Edge Function: </span>
            <code className="text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded font-mono text-2xs border border-indigo-500/30">
              {TRAIN_API_FUNCTION}
            </code>
            <span className="text-slate-400 text-2xs ml-2 hidden md:inline">
              (Configured via <code className="text-slate-300">VITE_TRAIN_API_FUNCTION</code> &amp; <code className="text-slate-300">VITE_SUPABASE_URL</code>)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-2xs">
          {lastApiLatency !== null && (
            <span className="text-slate-400 font-mono">
              Latency: <strong className="text-emerald-400">{lastApiLatency}ms</strong>
            </span>
          )}
          {lastApiSource && (
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-mono text-3xs uppercase">
              {lastApiSource.replace(/_/g, " ")}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
            Active
          </span>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 1. TRAIN BOOKING — FRONTEND MODULES */}
      {/* ======================================================================= */}
      {activeSubView === "train_booking_frontend" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  IRCTC Authorized Partner Booking
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Train Search, Real-Time Berths &amp; E-Ticket Confirmation
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  ✓ ₹0 IRCTC Agent Gateway Fee
                </span>
              </div>
            </div>

            {/* Train Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">From Station</label>
                <input
                  type="text"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">To Station</label>
                <input
                  type="text"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Journey Date</label>
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quota Selection</label>
                <select
                  value={selectedQuota}
                  onChange={(e) => setSelectedQuota(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                >
                  <option value="GENERAL">General Quota (GN)</option>
                  <option value="TATKAL">Tatkal Quota (TQ)</option>
                  <option value="PREMIUM_TATKAL">Premium Tatkal (PT)</option>
                  <option value="LADIES">Ladies Quota (LD)</option>
                  <option value="SENIOR_CITIZEN">Senior Citizen (SS)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearchTrains}
                  disabled={isSearchingTrains}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Search className={`w-3.5 h-3.5 ${isSearchingTrains ? "animate-spin" : ""}`} />
                  <span>{isSearchingTrains ? "Querying..." : "Search Trains"}</span>
                </button>
              </div>
            </div>

            {/* Train List Item */}
            <div className="space-y-4">
              {(trainResults.length > 0 ? trainResults : [
                {
                  trainNumber: "12952",
                  trainName: "Mumbai Rajdhani Express",
                  trainType: "Rajdhani Express" as const,
                  departureTime: "16:55",
                  arrivalTime: "08:35",
                  departureStation: "NDLS",
                  arrivalStation: "MMCT",
                  duration: "15h 40m",
                  runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  foodIncluded: true,
                  pantryAvailable: true,
                  onTimeRating: 97,
                  classes: [
                    { code: "1A", name: "AC First Class", fare: 4850, baseFare: 4850, tatkalFare: 5500, availableSeats: 4, status: "AVAILABLE" as const, lastUpdated: "Just now" },
                    { code: "2A", name: "AC 2 Tier", fare: 2950, baseFare: 2950, tatkalFare: 3560, availableSeats: 18, status: "AVAILABLE" as const, lastUpdated: "Just now" },
                    { code: "3A", name: "AC 3 Tier", fare: 2150, baseFare: 2150, tatkalFare: 2540, availableSeats: 42, status: "AVAILABLE" as const, lastUpdated: "Just now" },
                    { code: "3E", name: "3 AC Economy", fare: 1950, baseFare: 1950, tatkalFare: 2300, availableSeats: 0, status: "RAC" as const, waitlistCount: 4, lastUpdated: "Just now" },
                  ],
                }
              ]).map((train, idx) => (
                <div key={train.trainNumber + idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">{train.trainNumber} &bull; {train.trainName}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-3xs font-extrabold border border-amber-500/30">
                          {train.trainType}
                        </span>
                        <span className="text-3xs text-slate-400 font-mono">
                          Runs: {train.runsOn.join(", ")}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400">
                        {train.duration} &bull; On-Time: {train.onTimeRating}% &bull; {train.foodIncluded ? "Onboard Catering Included" : "Pantry Available"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xs text-slate-400 block">Departure &ndash; Arrival</span>
                      <span className="text-sm font-black text-white">
                        {train.departureTime} ({train.departureStation}) &rarr; {train.arrivalTime} ({train.arrivalStation})
                      </span>
                    </div>
                  </div>

                  {/* Class Availability Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {train.classes.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => setSelectedClass(item.code)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedClass === item.code
                            ? "bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-md"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{item.code} ({item.name})</span>
                          <span className="text-white">₹{selectedQuota === "TATKAL" ? item.tatkalFare : item.baseFare}</span>
                        </div>
                        <div className={`text-3xs font-mono font-bold mt-1 ${item.status === "AVAILABLE" ? "text-emerald-400" : "text-amber-300"}`}>
                          {item.status === "AVAILABLE" ? `AVAILABLE - ${item.availableSeats}` : `${item.status} ${item.waitlistCount || ""}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

              {/* Passenger & Berth Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passenger Full Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Age &amp; Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={passengerAge}
                      onChange={(e) => setPassengerAge(e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                    />
                    <select
                      value={passengerGender}
                      onChange={(e) => setPassengerGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Transgender</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Berth Preference</label>
                  <select
                    value={berthPreference}
                    onChange={(e) => setBerthPreference(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                  >
                    <option>No Preference</option>
                    <option>Lower Berth (LB)</option>
                    <option>Middle Berth (MB)</option>
                    <option>Upper Berth (UB)</option>
                    <option>Side Lower (SL)</option>
                    <option>Side Upper (SU)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setBookingConfirmed(true);
                      alert(`IRCTC Train Ticket Confirmed! 10-Digit PNR: 2849104821. Coach: B3, Berth: 21 (LB).`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹2,150 &amp; Book Ticket</span>
                  </button>
                </div>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      IRCTC E-Ticket Confirmed &bull; PNR: 2849104821
                    </span>
                    <p className="text-2xs text-emerald-300">
                      Train: 12952 Mumbai Rajdhani &bull; Coach: B3, Berth: 21 (Lower Berth) &bull; Passenger: {passengerName} (31, F) &bull; Quota: {selectedQuota} &bull; Catering: Included
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-2xs flex items-center gap-1.5 shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download E-Ticket PDF</span>
                  </button>
                </div>
              )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. TRAIN / IRCTC INFORMATION — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "irctc_info_frontend" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Real-Time Rail Intelligence
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Train Schedule, Station Halts &amp; Live PNR Confirmation Predictor
                </h3>
              </div>

              {/* PNR Search Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter 10-Digit PNR"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
                <button
                  onClick={handleTrackPnr}
                  disabled={isTrackingPnr}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Search className={`w-3.5 h-3.5 ${isTrackingPnr ? "animate-spin" : ""}`} />
                  <span>{isTrackingPnr ? "Verifying..." : "Track PNR"}</span>
                </button>
              </div>
            </div>

            {/* PNR Status Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">10-Digit PNR</span>
                <span className="text-sm font-black font-mono text-amber-400">
                  {pnrResult?.pnrNumber || pnrInput || "2849104821"}
                </span>
                <span className="text-3xs text-emerald-400 block">
                  ✓ {pnrResult?.chartStatus === "CHART_NOT_PREPARED" ? "Chart in Preparation" : "Chart Prepared"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Train Number &amp; Name</span>
                <span className="text-xs font-bold text-white">
                  {pnrResult ? `${pnrResult.trainNumber} / ${pnrResult.trainName}` : "12952 / Mumbai Rajdhani"}
                </span>
                <span className="text-3xs text-slate-400 block">
                  Class: {pnrResult?.travelClass || "3A (AC 3 Tier)"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Booking Status &rarr; Current Status</span>
                <span className="text-xs font-bold text-emerald-400">
                  {pnrResult?.passengers?.[0]
                    ? `${pnrResult.passengers[0].bookingStatus} \u2192 ${pnrResult.passengers[0].currentStatus}`
                    : "CNF \u2192 Coach B3, Berth 21 (LB)"}
                </span>
                <span className="text-3xs text-slate-400 block">
                  Confirmation Probability: {pnrResult?.confirmationProbability || 100}%
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-3xs text-slate-400 block font-semibold">Boarding Point</span>
                <span className="text-xs font-bold text-white">
                  {pnrResult?.boardingPoint || "New Delhi (NDLS) - Platform 16"}
                </span>
                <span className="text-3xs text-amber-300 block">Departure: 16:55 IST</span>
              </div>
            </div>

            {/* Intermediate Station Halts Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Complete Station Schedule &amp; Halts (Train 12952):</span>
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800 text-3xs uppercase">
                      <th className="p-3">#</th>
                      <th className="p-3">Station Code &amp; Name</th>
                      <th className="p-3">Arrive</th>
                      <th className="p-3">Depart</th>
                      <th className="p-3">Halt</th>
                      <th className="p-3">Distance</th>
                      <th className="p-3 text-right">Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950 font-medium">
                    <tr>
                      <td className="p-3 font-mono text-amber-400">01</td>
                      <td className="p-3 font-bold text-white">NDLS - New Delhi</td>
                      <td className="p-3 text-slate-400">Source</td>
                      <td className="p-3 text-emerald-400 font-bold">16:55</td>
                      <td className="p-3 text-slate-400">-</td>
                      <td className="p-3 text-slate-400">0 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">02</td>
                      <td className="p-3 font-bold text-white">KOTA - Kota Junction</td>
                      <td className="p-3 text-white">21:30</td>
                      <td className="p-3 text-emerald-400 font-bold">21:40</td>
                      <td className="p-3 text-slate-300 font-mono">10 min</td>
                      <td className="p-3 text-slate-400">465 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 02</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">03</td>
                      <td className="p-3 font-bold text-white">RTM - Ratlam Junction</td>
                      <td className="p-3 text-white">00:25</td>
                      <td className="p-3 text-emerald-400 font-bold">00:30</td>
                      <td className="p-3 text-slate-300 font-mono">05 min</td>
                      <td className="p-3 text-slate-400">731 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 04</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">04</td>
                      <td className="p-3 font-bold text-white">BRC - Vadodara Junction</td>
                      <td className="p-3 text-white">03:50</td>
                      <td className="p-3 text-emerald-400 font-bold">04:00</td>
                      <td className="p-3 text-slate-300 font-mono">10 min</td>
                      <td className="p-3 text-slate-400">992 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 01</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">05</td>
                      <td className="p-3 font-bold text-white">ST - Surat</td>
                      <td className="p-3 text-white">05:33</td>
                      <td className="p-3 text-emerald-400 font-bold">05:38</td>
                      <td className="p-3 text-slate-300 font-mono">05 min</td>
                      <td className="p-3 text-slate-400">1122 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 02</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-amber-400">06</td>
                      <td className="p-3 font-bold text-white">MMCT - Mumbai Central</td>
                      <td className="p-3 text-emerald-400 font-bold">08:35</td>
                      <td className="p-3 text-slate-400">Destination</td>
                      <td className="p-3 text-slate-400">-</td>
                      <td className="p-3 text-slate-400">1386 km</td>
                      <td className="p-3 text-right font-mono text-amber-400">PF 01</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. BACKEND MODULES (NEVER DISPLAYED ON FRONTEND) */}
      {/* ======================================================================= */}
      {activeSubView === "backend_modules" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  IRCTC Core Integration Security
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Backend Rail API &amp; Server-Side Processing
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              IRCTC proxy gateways, token authorization, passenger data compliance (DPDP Act 2023), and CRIS backend integrations execute exclusively on secure private servers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "IRCTC Authorized Rail API Integration",
                desc: "Direct cryptographic integration with CRIS & IRCTC partner endpoints with rate-limiting and quota sync.",
                icon: Key,
              },
              {
                title: "Real-Time Train Search & Fare API",
                desc: "High-throughput cache backed by Redis clusters for instant schedule, route, and dynamic fare computation.",
                icon: Cpu,
              },
              {
                title: "Seat & Berth Inventory Allocation Engine",
                desc: "Direct berth preference matching (LB, MB, UB, SL, SU) and quota segregation (General, Tatkal, Premium).",
                icon: Database,
              },
              {
                title: "PNR Status & Waitlist Probability Service",
                desc: "Historical ML predictive model calculating confirmation probability for RAC and Waitlisted (WL) tickets.",
                icon: TrendingUp,
              },
              {
                title: "Instant Cancellation & TDR Refund Service",
                desc: "Automated Ticket Deposit Receipt (TDR) filing with Indian Railways and instant UPI reimbursement.",
                icon: CreditCard,
              },
              {
                title: "Passenger Data Encryption (DPDP Compliant)",
                desc: "Zero-knowledge AES-256-GCM encryption for passenger IDs, Aadhaar numbers, and travel itineraries.",
                icon: ShieldCheck,
              },
            ].map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-white text-xs">{mod.title}</span>
                  </div>
                  <p className="text-2xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  <div className="pt-2 border-t border-slate-900 text-3xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Status: CRIS Verified Backend</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 7 Core Train API Endpoints Sandbox */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    src/services/trainApi.ts
                  </span>
                  <span className="text-3xs font-mono text-emerald-400">REST &amp; Edge Function Ready</span>
                </div>
                <h4 className="text-base font-black text-white mt-1">
                  Indian Railways Core Microservice Endpoints
                </h4>
              </div>
              <span className="text-2xs text-slate-400 font-mono">
                Active Client: trainApi.ts
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Endpoint Selector List */}
              <div className="lg:col-span-6 space-y-2.5">
                {[
                  { path: "/trains", method: "GET", desc: "List all scheduled & special trains with route metadata" },
                  { path: "/trains/search", method: "POST", desc: "Search timetable, trains between stations, journey date & quota" },
                  { path: "/trains/details/:trainNumber", method: "GET", desc: "Detailed route timetable, halts, rake composition & coach layout" },
                  { path: "/trains/availability", method: "POST", desc: "Live seat/berth availability matrix across classes & quotas" },
                  { path: "/trains/fare", method: "POST", desc: "Telescopic distance fare calculator with GST, Tatkal & dynamic pricing" },
                  { path: "/trains/pnr", method: "POST", desc: "10-digit PNR status, coach/berth allotment & chart prep status" },
                  { path: "/trains/live-status", method: "POST", desc: "Real-time GPS running status, delay minutes & next station halt" },
                ].map((ep) => {
                  const isSelected = selectedEndpointTest === ep.path;
                  return (
                    <div
                      key={ep.path}
                      onClick={() => runEndpointTest(ep.path)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/30"
                          : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-3xs font-mono font-black ${
                              ep.method === "GET"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-white truncate">
                            {ep.path}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-400 leading-tight">
                          {ep.desc}
                        </p>
                      </div>

                      <button
                        disabled={isExecutingEndpoint}
                        onClick={(e) => {
                          e.stopPropagation();
                          runEndpointTest(ep.path);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold font-mono transition-all shrink-0 ${
                          isSelected
                            ? "bg-rose-500 text-white shadow"
                            : "bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white"
                        }`}
                      >
                        {isExecutingEndpoint && isSelected ? "Calling..." : "Test Call"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Live JSON Response Terminal */}
              <div className="lg:col-span-6 flex flex-col">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse"></span>
                      <span className="text-2xs font-mono font-bold text-slate-300">
                        {selectedEndpointTest} Response
                      </span>
                    </div>
                    {endpointResponse?.latency_ms !== undefined && (
                      <span className="text-3xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        {endpointResponse.latency_ms}ms • {endpointResponse.source || "trainApi"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-auto max-h-[360px] bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-3xs text-emerald-400">
                    {endpointResponse ? (
                      <pre className="whitespace-pre-wrap break-all leading-relaxed">
                        {JSON.stringify(endpointResponse, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                        <Terminal className="w-8 h-8 opacity-40" />
                        <p className="text-xs">Click "Test Call" on any endpoint on the left to inspect the live response structure from trainApi.ts.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. SEPARATE SECURE ADMIN LOGIN */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Admin Rail Operations
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  CRIS / IRCTC Gateway Health &amp; Reconciliation Logs
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: railway_superadmin@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">IRCTC API Gateway Health</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 99.98% Uptime (18ms Latency)
                </span>
                <span className="text-3xs text-slate-400 block">Tatkal Throughput: 4,800 req/min</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Today's Rail GMV</span>
                <span className="text-sm font-black text-white">₹4,82,900</span>
                <span className="text-3xs text-emerald-400 block">100% Bank Reconciled</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">TDR / Instant Refunds Cleared</span>
                <span className="text-sm font-black text-amber-400">14 TDRs Processed</span>
                <span className="text-3xs text-slate-400 block">Avg Settlement: 14 minutes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. INTEGRATION ARCHITECTURE */}
      {/* ======================================================================= */}
      {activeSubView === "integration_architecture" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                End-to-End System Pipeline
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                Train Integration Architecture &amp; Data Pipeline Flow
              </h3>
            </div>

            {/* Architecture Diagram Steps */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
              {[
                { step: "01", name: "Customer Web / App", desc: "User inputs Station, Date, Quota, Berth Preference." },
                { step: "02", name: "Frontend Client", desc: "Validates input parameters, checks local cache." },
                { step: "03", name: `Supabase Edge: ${TRAIN_API_FUNCTION}`, desc: "Edge function invoking CRIS proxy with server fallback." },
                { step: "04", name: "CRIS / IRCTC API", desc: "Authorized Rail Gateway query with quota locks." },
                { step: "05", name: "Razorpay / Bank", desc: "HMAC signed payment execution & auto escrow." },
                { step: "06", name: "PNR & E-Ticket", desc: "CRIS Confirmation + SAC 996411 PDF Invoice dispatch." },
              ].map((flow, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 relative">
                  <div className="text-3xs font-mono text-emerald-400 font-extrabold">STEP {flow.step}</div>
                  <div className="font-black text-white text-xs">{flow.name}</div>
                  <p className="text-3xs text-slate-400 leading-tight">{flow.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
