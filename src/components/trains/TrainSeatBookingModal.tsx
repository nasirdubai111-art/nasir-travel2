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
} from "lucide-react";
import { DetailedTrainItem, TrainCoachClass } from "../../data/trainData";
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
    { name: "Rahul Sharma", age: "32", gender: "Male", berthPreference: "Lower", seniorCitizenConcession: false },
  ]);
  const [irctcUsername, setIrctcUsername] = useState("rahul_irctc26");
  const [isIrctcVerified, setIsIrctcVerified] = useState(true);
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [contactMobile, setContactMobile] = useState("+91 98765 43210");
  const [contactEmail, setContactEmail] = useState("rahul.sharma@example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers([
      ...passengers,
      { name: "", age: "", gender: "Male", berthPreference: "No Preference", seniorCitizenConcession: false },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
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
      const newBooking: BookingItem = {
        id: `TB-${Date.now()}`,
        serviceCategory: "trains",
        title: `${train.trainName} (${train.trainNumber})`,
        provider: "Indian Railways (IRCTC)",
        fromLocation: `${train.fromStationName} (${train.fromStationCode})`,
        toLocation: `${train.toStationName} (${train.toStationCode})`,
        date: "2026-08-28",
        time: train.departureTime,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedPnr,
        passengersCount: passengers.length,
        seatOrRoomInfo: `${selectedClass.classCode} • Coach C4 / Berths 23, 24`,
      };

      setConfirmedBookingData({
        ...newBooking,
        train,
        selectedClass,
        passengers,
        quota,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                {quota} QUOTA
              </span>
              <h2 className="text-xl font-extrabold">{train.trainName}</h2>
            </div>
            <p className="text-xs text-amber-100 mt-1">
              {train.trainNumber} • {train.fromStationName} ➔ {train.toStationName} • {train.departureTime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Selected Class Summary Card */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Selected Coach &amp; Class:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold text-slate-900 text-base">{selectedClass.className} ({selectedClass.classCode})</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                    {selectedClass.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Fare per passenger</span>
                <span className="text-lg font-black text-amber-700">₹{baseTicketPrice}</span>
              </div>
            </div>

            {/* IRCTC ID Verification Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  IRCTC User ID (Mandatory for Indian Railways E-Ticketing)
                </label>
                {isIrctcVerified && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified ID
                  </span>
                )}
              </div>
              <input
                type="text"
                value={irctcUsername}
                onChange={(e) => setIrctcUsername(e.target.value)}
                placeholder="Enter your IRCTC ID (e.g., user123)"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Passenger List Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Traveller Details ({passengers.length} of 6)
                </h3>
                {passengers.length < 6 && (
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                  >
                    + Add Another Passenger
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {passengers.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-800">Passenger #{idx + 1}</span>
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
                    <span>{i + 1}. {p.name} ({p.gender}, {p.age}y)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px]">
                      CNF / Coach C4 / {23 + i} ({p.berthPreference === "Lower" ? "Lower" : "Window"})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
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
