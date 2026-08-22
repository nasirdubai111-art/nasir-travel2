import React, { useState } from "react";
import {
  X,
  Bus,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  User,
  Zap,
  Info,
  Clock,
  Sparkles,
  Heart,
} from "lucide-react";
import { DetailedBusItem, BusSeat, BusBoardingPoint } from "../../data/busData";
import { BookingItem } from "../../types";

interface BusSeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: DetailedBusItem | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function BusSeatMapModal({
  isOpen,
  onClose,
  bus,
  onBookingSuccess,
}: BusSeatMapModalProps) {
  if (!isOpen || !bus) return null;

  const [selectedSeats, setSelectedSeats] = useState<BusSeat[]>([]);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<BusBoardingPoint>(bus.boardingPoints[0]);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<BusBoardingPoint>(bus.droppingPoints[0]);
  const [passengerName, setPassengerName] = useState("Rohit Varma");
  const [passengerAge, setPassengerAge] = useState("29");
  const [passengerGender, setPassengerGender] = useState("Male");
  const [isFemaleOnlyRowOpted, setIsFemaleOnlyRowOpted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const toggleSeat = (seat: BusSeat) => {
    if (seat.isBooked) return;
    if (selectedSeats.some((s) => s.seatNumber === seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 4) {
        alert("Maximum 4 seats can be booked in a single transaction.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalBaseFare = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const gstAmount = Math.round(totalBaseFare * 0.05);
  const finalTotal = totalBaseFare + gstAmount;

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least 1 seat to proceed.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const generatedTicket = `BUS-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: BookingItem = {
        id: `BB-${Date.now()}`,
        serviceCategory: "buses",
        title: `${bus.operator} (${bus.busType})`,
        provider: bus.operator,
        fromLocation: `${bus.fromCity} - ${selectedBoardingPoint.locationName}`,
        toLocation: `${bus.toCity} - ${selectedDroppingPoint.locationName}`,
        date: "2026-08-29",
        time: bus.departureTime,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedTicket,
        passengersCount: selectedSeats.length,
        seatOrRoomInfo: `Seat(s): ${selectedSeats.map((s) => s.seatNumber).join(", ")} (${selectedSeats[0].deck === "upper" ? "Upper Deck" : "Lower Deck"})`,
      };

      setConfirmedBookingData({
        ...newBooking,
        bus,
        selectedSeats,
        selectedBoardingPoint,
        selectedDroppingPoint,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold">{bus.operator}</h2>
              {bus.isPrimo && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Primo 5★
                </span>
              )}
            </div>
            <p className="text-xs text-rose-100 mt-0.5">
              {bus.busType} • {bus.fromCity} ➔ {bus.toCity}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Seat Map Layout Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                  <span className="text-slate-600 text-[11px]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-rose-500 bg-rose-500" />
                  <span className="text-slate-600 text-[11px] font-bold">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-pink-400 bg-pink-100" />
                  <span className="text-pink-700 text-[11px] font-semibold">Ladies Reserved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-slate-300 bg-slate-300" />
                  <span className="text-slate-400 text-[11px]">Occupied</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-600">Max 4 Seats</span>
            </div>

            {/* Interactive Seat Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lower Deck */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lower Deck</span>
                  <span className="text-[11px] text-slate-400">Driver ➔ Front</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {bus.seatMap.lowerDeck.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                    return (
                      <button
                        key={seat.seatNumber}
                        type="button"
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.isBooked}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          seat.isBooked
                            ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-rose-600 border-rose-700 text-white font-bold shadow-md scale-105"
                            : seat.isLadiesReserved
                            ? "bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:border-rose-400 hover:bg-rose-50/50"
                        }`}
                      >
                        <div className="text-xs font-mono font-bold">{seat.seatNumber}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">₹{seat.price}</div>
                        <div className="text-[9px] uppercase tracking-tighter opacity-70">
                          {seat.type === "sleeper" ? "Sleeper" : "Seater"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upper Deck */}
              {bus.seatMap.upperDeck.length > 0 && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upper Deck (Berths)</span>
                    <span className="text-[11px] text-slate-400">Panoramic High View</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {bus.seatMap.upperDeck.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                      return (
                        <button
                          key={seat.seatNumber}
                          type="button"
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.isBooked}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            seat.isBooked
                              ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-rose-600 border-rose-700 text-white font-bold shadow-md scale-105"
                              : seat.isLadiesReserved
                              ? "bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100"
                              : "bg-slate-50 border-slate-200 text-slate-800 hover:border-rose-400 hover:bg-rose-50/50"
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">{seat.seatNumber}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">₹{seat.price}</div>
                          <div className="text-[9px] uppercase tracking-tighter opacity-70">Sleeper</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Boarding & Dropping Points Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Boarding Point */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Select Boarding Point
                </label>
                <select
                  value={selectedBoardingPoint.id}
                  onChange={(e) => {
                    const bp = bus.boardingPoints.find((b) => b.id === e.target.value);
                    if (bp) setSelectedBoardingPoint(bp);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {bus.boardingPoints.map((bp) => (
                    <option key={bp.id} value={bp.id}>
                      {bp.time} - {bp.locationName} ({bp.landmark})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">Boarding Helpline: {selectedBoardingPoint.contactPhone}</p>
              </div>

              {/* Dropping Point */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Select Dropping Point
                </label>
                <select
                  value={selectedDroppingPoint.id}
                  onChange={(e) => {
                    const dp = bus.droppingPoints.find((d) => d.id === e.target.value);
                    if (dp) setSelectedDroppingPoint(dp);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {bus.droppingPoints.map((dp) => (
                    <option key={dp.id} value={dp.id}>
                      {dp.time} - {dp.locationName}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">Destination Landmark: {selectedDroppingPoint.landmark}</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Primary Passenger Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Gender</label>
                  <select
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Seats: {selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}</span>
                <span>₹{totalBaseFare}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST &amp; Operator Insurance</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-rose-600">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmed View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Bus Ticket Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your bus reservation has been sent to your registered mobile number with live GPS tracking link.
              </p>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-3xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-rose-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-800">Booking Ticket ID:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-rose-800">Operator:</span>
                  <div className="text-xs font-bold text-slate-900">{bus.operator}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Boarding Location &amp; Time</span>
                  <span className="font-bold text-slate-900 block">{selectedBoardingPoint.locationName} ({selectedBoardingPoint.time})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Allocated Seat(s)</span>
                  <span className="font-bold text-rose-700 block">{selectedSeats.map((s) => s.seatNumber).join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing || selectedSeats.length === 0}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Confirming Seats..." : `Pay ₹${finalTotal} & Book ${selectedSeats.length} Seat(s)`}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
