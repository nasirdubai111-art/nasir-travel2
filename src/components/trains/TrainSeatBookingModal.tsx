import React, { useState } from "react";
import {
  X,
  Train,
  CheckCircle2,
  User,
  ShieldCheck,
  Zap,
  Info,
  CreditCard,
  QrCode,
  Download,
  Calendar,
  Clock,
  MapPin,
  Armchair,
  Layers,
} from "lucide-react";
import {
  DetailedTrainItem,
  TrainCoachClass,
  GENERATE_TRAIN_COACH_MATRIX,
  TrainBerthSeatItem,
} from "../../data/trainData";
import { BookingItem } from "../../types";

interface TrainSeatBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: DetailedTrainItem | null;
  selectedClass: TrainCoachClass | null;
  quota: string;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function TrainSeatBookingModal({
  isOpen,
  onClose,
  train,
  selectedClass,
  quota,
  onBookingSuccess,
}: TrainSeatBookingModalProps) {
  if (!isOpen || !train || !selectedClass) return null;

  // Passenger state
  const [passengers, setPassengers] = useState([
    { name: "Rahul Sharma", age: "32", gender: "Male", berthPreference: "Lower", seniorCitizenConcession: false, assignedSeat: "" },
  ]);
  const [activePassengerIdx, setActivePassengerIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"passengers" | "seatMatrix">("passengers");

  // Coach selection state
  const coachOptions =
    selectedClass.classCode === "CC"
      ? ["C1", "C2", "C3", "C4"]
      : selectedClass.classCode === "EC" || selectedClass.classCode === "EA"
      ? ["EC1", "EC2"]
      : selectedClass.classCode === "3A" || selectedClass.classCode === "3E"
      ? ["B1", "B2", "B3", "B4"]
      : selectedClass.classCode === "2A"
      ? ["A1", "A2"]
      : selectedClass.classCode === "1A"
      ? ["H1"]
      : ["S1", "S2", "S3"];

  const [selectedCoach, setSelectedCoach] = useState(coachOptions[0]);
  const [coachSeats, setCoachSeats] = useState<TrainBerthSeatItem[]>(() =>
    GENERATE_TRAIN_COACH_MATRIX(selectedClass.classCode, coachOptions[0])
  );

  const [irctcUsername, setIrctcUsername] = useState("rahul_irctc26");
  const [isIrctcVerified, setIsIrctcVerified] = useState(true);
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [contactMobile, setContactMobile] = useState("+91 98765 43210");
  const [contactEmail, setContactEmail] = useState("rahul.sharma@example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Switch coach and reload seats matrix
  const handleSelectCoach = (coachId: string) => {
    setSelectedCoach(coachId);
    setCoachSeats(GENERATE_TRAIN_COACH_MATRIX(selectedClass.classCode, coachId));
  };

  const handleSeatClick = (seat: TrainBerthSeatItem) => {
    if (!seat.isAvailable) return;

    const updated = [...passengers];
    const currentAssigned = updated[activePassengerIdx].assignedSeat;

    if (currentAssigned === seat.id) {
      updated[activePassengerIdx].assignedSeat = "";
    } else {
      // Clear if assigned to another passenger
      updated.forEach((p, idx) => {
        if (p.assignedSeat === seat.id && idx !== activePassengerIdx) {
          p.assignedSeat = "";
        }
      });
      updated[activePassengerIdx].assignedSeat = seat.id;
      // Auto move to next passenger if unset
      if (activePassengerIdx < passengers.length - 1) {
        setActivePassengerIdx(activePassengerIdx + 1);
      }
    }
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers([
      ...passengers,
      { name: "", age: "", gender: "Male", berthPreference: "No Preference", seniorCitizenConcession: false, assignedSeat: "" },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
    if (activePassengerIdx >= passengers.length - 1) {
      setActivePassengerIdx(Math.max(0, passengers.length - 2));
    }
  };

  const updatePassenger = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    (updated[index] as any)[field] = value;
    setPassengers(updated);
  };

  // Pricing calculations
  const baseTicketPrice = quota === "TATKAL" ? selectedClass.tatkalPrice : selectedClass.price;
  const totalBaseFare = baseTicketPrice * passengers.length;
  const irctcServiceFee = 15;
  const insuranceFee = travelInsurance ? passengers.length * 0.45 : 0;
  const gstAmount = Math.round(totalBaseFare * 0.05);
  const finalTotal = Math.round(totalBaseFare + irctcServiceFee + insuranceFee + gstAmount);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPnr = `284-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const assignedBerthsText = passengers
        .map((p, idx) => p.assignedSeat || `${selectedCoach}-${20 + idx}`)
        .join(", ");

      const newBooking: BookingItem = {
        id: `TB-${Date.now()}`,
        serviceCategory: "trains",
        title: `${train.trainName} (${train.trainNumber})`,
        provider: "Indian Railways (IRCTC)",
        fromLocation: `${train.fromStationName} (${train.fromStationCode})`,
        toLocation: `${train.toStationName} (${train.toStationCode})`,
        date: "2026-09-02",
        time: train.departureTime,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedPnr,
        passengersCount: passengers.length,
        seatOrRoomInfo: `${selectedClass.classCode} • Coach ${selectedCoach} / Berths ${assignedBerthsText}`,
      };

      setConfirmedBookingData({
        ...newBooking,
        train,
        selectedClass,
        selectedCoach,
        passengers,
        quota,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                {quota} QUOTA
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/20 text-amber-100 text-xs font-mono font-bold">
                {train.trainNumber}
              </span>
              <h2 className="text-lg sm:text-xl font-black">{train.trainName}</h2>
            </div>
            {/* Live Schedule Timings Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-100 mt-2">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-200" />
                <span>Dep: {train.departureTime} ({train.fromStationCode})</span>
              </span>
              <span>➔</span>
              <span className="flex items-center gap-1 font-semibold">
                <span>Arr: {train.arrivalTime} ({train.toStationCode})</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                Duration: {train.duration} • {train.distanceKm} km
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Navigation Tabs between Passenger Info & Seat Matrix */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("passengers")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "passengers"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>1. Traveller Details ({passengers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seatMatrix")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "seatMatrix"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Armchair className="w-3.5 h-3.5" />
                  <span>2. Coach &amp; Berth Matrix ({selectedCoach})</span>
                </button>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-slate-400 block font-semibold">Total Fare</span>
                <span className="text-base font-black text-amber-700">₹{finalTotal}</span>
              </div>
            </div>

            {/* Tab 1: Traveller Details */}
            {activeTab === "passengers" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Selected Class Summary Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Class &amp; Coach Class:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-extrabold text-slate-900 text-base">
                        {selectedClass.className} ({selectedClass.classCode})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {selectedClass.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        • {selectedClass.foodIncluded ? "Complimentary Meals Included" : "Pantry/E-Catering Available"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Fare per traveller</span>
                    <span className="text-lg font-black text-amber-700">₹{baseTicketPrice}</span>
                  </div>
                </div>

                {/* IRCTC ID Verification Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      IRCTC User ID (Mandatory for Indian Railways Reservation)
                    </label>
                    {isIrctcVerified && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Account
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={irctcUsername}
                    onChange={(e) => setIrctcUsername(e.target.value)}
                    placeholder="Enter your IRCTC ID"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Passenger List Form */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Traveller List ({passengers.length} of 6)
                    </h3>
                    {passengers.length < 6 && (
                      <button
                        type="button"
                        onClick={addPassenger}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                      >
                        + Add Another Traveller
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {passengers.map((p, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span>Passenger #{idx + 1}</span>
                            {p.assignedSeat ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                                Berth: {p.assignedSeat}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-normal">
                                (Auto-allot or choose in Seat Matrix tab)
                              </span>
                            )}
                          </span>
                          {passengers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePassenger(idx)}
                              className="text-[11px] text-rose-500 font-semibold hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold mb-1">Full Name (As per Govt ID)</label>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                              placeholder="e.g. Ramesh Kumar"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold mb-1">Age</label>
                            <input
                              type="number"
                              value={p.age}
                              onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                              placeholder="Age in Yrs"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold mb-1">Gender</label>
                            <select
                              value={p.gender}
                              onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Transgender">Transgender</option>
                            </select>
                          </div>
                        </div>

                        {/* Berth Preference */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div>
                            <label className="text-[10px] text-slate-400 block font-bold mb-1">Berth Preference</label>
                            <select
                              value={p.berthPreference}
                              onChange={(e) => updatePassenger(idx, "berthPreference", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
                            >
                              <option value="No Preference">No Preference</option>
                              <option value="Lower">Lower Berth (Senior friendly)</option>
                              <option value="Middle">Middle Berth</option>
                              <option value="Upper">Upper Berth</option>
                              <option value="Side Lower">Side Lower</option>
                              <option value="Side Upper">Side Upper</option>
                              <option value="Window">Window Seat (CC/EC)</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id={`senior-${idx}`}
                              checked={p.seniorCitizenConcession}
                              onChange={(e) => updatePassenger(idx, "seniorCitizenConcession", e.target.checked)}
                              className="w-4 h-4 text-amber-600 rounded border-slate-300"
                            />
                            <label htmlFor={`senior-${idx}`} className="text-xs text-slate-600 cursor-pointer">
                              Senior Citizen Lower Berth Priority (Age 60+)
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Preferences & Upgradation */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={autoUpgrade}
                      onChange={(e) => setAutoUpgrade(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Consider for Free IRCTC Auto-Upgradation to Higher AC Class</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={travelInsurance}
                      onChange={(e) => setTravelInsurance(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span>Add Travel Insurance with ₹10 Lakh cover (@ ₹0.45 / person)</span>
                  </label>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mobile Number (For SMS Ticket)</label>
                    <input
                      type="text"
                      value={contactMobile}
                      onChange={(e) => setContactMobile(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email ID (For E-Ticket PDF)</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Coach & Berth/Seat Matrix */}
            {activeTab === "seatMatrix" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Active Passenger Assignment Pill Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-slate-500 mr-1">Assign Seat For:</span>
                    {passengers.map((p, idx) => {
                      const isSelected = activePassengerIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePassengerIdx(idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-amber-600 text-white shadow-xs scale-105"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <User className="w-3 h-3" />
                          <span>{p.name || `Passenger ${idx + 1}`}</span>
                          {p.assignedSeat && (
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              isSelected ? "bg-amber-800 text-amber-100" : "bg-amber-100 text-amber-800"
                            }`}>
                              {p.assignedSeat}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Coach Switcher Bar */}
                <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-900">Select Coach:</span>
                    <div className="flex items-center gap-1.5">
                      {coachOptions.map((cId) => (
                        <button
                          key={cId}
                          type="button"
                          onClick={() => handleSelectCoach(cId)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all ${
                            selectedCoach === cId
                              ? "bg-amber-600 text-white shadow-xs"
                              : "bg-white border border-amber-200 text-slate-700 hover:bg-amber-100"
                          }`}
                        >
                          Coach {cId}
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-xs text-amber-800 font-semibold hidden sm:inline">
                    {selectedClass.className} Layout ({coachSeats.filter((s) => s.isAvailable).length} Seats Available)
                  </span>
                </div>

                {/* Berth / Seat Matrix Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 py-1 bg-white border border-slate-200 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md border border-slate-300 bg-white" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-amber-600 text-white" />
                    <span>Selected ({passengers[activePassengerIdx]?.name || "Active"})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-slate-300 text-slate-500" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md border-2 border-pink-400 bg-pink-50" />
                    <span>Ladies Priority</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md border-2 border-indigo-400 bg-indigo-50" />
                    <span>Senior Priority</span>
                  </div>
                </div>

                {/* Graphical Train Coach Layout */}
                <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl text-white shadow-inner overflow-x-auto">
                  <div className="min-w-[540px]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs font-mono text-slate-400">
                      <span>❮ DIRECTION OF TRAVEL • ENGINE</span>
                      <span>COACH {selectedCoach} • {selectedClass.classCode}</span>
                      <span>ENTRY / VESTIBULE ❯</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
                      {coachSeats.map((seat) => {
                        const isAssignedToCurrent = passengers[activePassengerIdx]?.assignedSeat === seat.id;
                        const isAssignedToOther = passengers.some(
                          (p, idx) => p.assignedSeat === seat.id && idx !== activePassengerIdx
                        );

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!seat.isAvailable}
                            onClick={() => handleSeatClick(seat)}
                            className={`p-2.5 rounded-xl border text-center transition-all relative flex flex-col items-center justify-between min-h-[70px] ${
                              isAssignedToCurrent
                                ? "bg-amber-500 border-amber-300 text-slate-950 font-black shadow-lg scale-105"
                                : isAssignedToOther
                                ? "bg-amber-900/60 border-amber-600/80 text-amber-200 font-bold"
                                : !seat.isAvailable
                                ? "bg-slate-800/60 border-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                                : seat.isLadiesReserved
                                ? "bg-slate-800 border-pink-500/50 text-white hover:border-pink-400 hover:bg-slate-700"
                                : seat.isSeniorCitizenPriority
                                ? "bg-slate-800 border-indigo-500/50 text-white hover:border-indigo-400 hover:bg-slate-700"
                                : "bg-slate-800 border-slate-700 text-white hover:border-amber-400 hover:bg-slate-700"
                            }`}
                          >
                            <span className="text-[10px] font-mono opacity-80">{seat.coach}</span>
                            <span className="text-sm font-black">{seat.seatNumber}</span>
                            <span className="text-[9px] uppercase font-bold tracking-tight opacity-75">
                              {seat.berthType.replace("_", " ")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fare Breakdown Summary */}
            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({passengers.length} Traveller × ₹{baseTicketPrice})</span>
                <span>₹{totalBaseFare}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IRCTC Agent Service Charge + GST</span>
                <span>₹{irctcServiceFee + gstAmount}</span>
              </div>
              {travelInsurance && (
                <div className="flex justify-between text-slate-600">
                  <span>Travel Insurance</span>
                  <span>₹{insuranceFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable</span>
                <span className="text-amber-600">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmed Ticket Receipt View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">E-Ticket Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your IRCTC electronic reservation slip has been generated and sent to {contactMobile}.
              </p>
            </div>

            {/* Digital Ticket Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-300 rounded-3xl p-6 text-left space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-amber-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">PNR Number:</span>
                  <div className="text-lg font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Class &amp; Quota:</span>
                  <div className="text-xs font-bold text-slate-900">{selectedClass.classCode} • {quota}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Train Info</span>
                  <span className="font-bold text-slate-900 block">{train.trainName} ({train.trainNumber})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Journey</span>
                  <span className="font-bold text-slate-900 block">{confirmedBookingData.date} • {train.departureTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Boarding Station</span>
                  <span className="font-bold text-slate-900 block">{train.fromStationName} ({train.fromStationCode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                  <span className="font-bold text-slate-900 block">{train.toStationName} ({train.toStationCode})</span>
                </div>
              </div>

              {/* Passenger Seat Allocation */}
              <div className="bg-white/80 rounded-2xl p-3 border border-amber-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Allocated Berth Status:</span>
                {passengers.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>{i + 1}. {p.name || `Passenger ${i + 1}`} ({p.gender}, {p.age}y)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px]">
                      CNF / Coach {selectedCoach} / {p.assignedSeat ? p.assignedSeat.split("-")[1] : 23 + i} ({p.berthPreference})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center shrink-0">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Processing IRCTC Gateway..." : `Pay ₹${finalTotal} & Book Ticket`}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              View in My Trips &amp; Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
