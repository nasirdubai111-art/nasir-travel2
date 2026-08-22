import React, { useState } from "react";
import { X, Check, Armchair, AlertCircle, Info, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { FlightSeatItem, GENERATE_AIRCRAFT_SEATS, FlightExtendedDeal } from "../../data/flightData";

interface FlightSeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal;
  passengerNames: string[];
  selectedSeats: Record<number, string>; // passenger index -> seat id
  onConfirmSeats: (seats: Record<number, string>, totalSeatCost: number) => void;
}

export function FlightSeatSelectionModal({
  isOpen,
  onClose,
  flight,
  passengerNames,
  selectedSeats: initialSeats,
  onConfirmSeats,
}: FlightSeatSelectionModalProps) {
  const [activePassengerIdx, setActivePassengerIdx] = useState(0);
  const [currentSelectedSeats, setCurrentSelectedSeats] = useState<Record<number, string>>(initialSeats || {});
  const [seatsList] = useState<FlightSeatItem[]>(() => GENERATE_AIRCRAFT_SEATS());

  if (!isOpen) return null;

  const getSeatById = (id: string) => seatsList.find((s) => s.id === id);

  const handleSeatClick = (seat: FlightSeatItem) => {
    if (!seat.isAvailable) return;

    // Check if this seat is already picked by another passenger
    const existingPassengerForSeat = Object.entries(currentSelectedSeats).find(
      ([idx, sId]) => sId === seat.id && Number(idx) !== activePassengerIdx
    );

    if (existingPassengerForSeat) {
      // Remove from that passenger and assign to current
      const updated = { ...currentSelectedSeats, [activePassengerIdx]: seat.id };
      delete updated[Number(existingPassengerForSeat[0])];
      setCurrentSelectedSeats(updated);
    } else {
      // Toggle or set
      if (currentSelectedSeats[activePassengerIdx] === seat.id) {
        const updated = { ...currentSelectedSeats };
        delete updated[activePassengerIdx];
        setCurrentSelectedSeats(updated);
      } else {
        setCurrentSelectedSeats({ ...currentSelectedSeats, [activePassengerIdx]: seat.id });
        // Automatically switch to next passenger if unassigned
        if (activePassengerIdx < passengerNames.length - 1) {
          setActivePassengerIdx(activePassengerIdx + 1);
        }
      }
    }
  };

  const handleAutoAssign = () => {
    const availableStandardSeats = seatsList.filter((s) => s.isAvailable && s.price === 0);
    const updated: Record<number, string> = { ...currentSelectedSeats };
    let pointer = 0;
    passengerNames.forEach((_, idx) => {
      if (!updated[idx] && availableStandardSeats[pointer]) {
        updated[idx] = availableStandardSeats[pointer].id;
        pointer++;
      }
    });
    setCurrentSelectedSeats(updated);
  };

  // Calculate seat cost
  const totalSeatCost = Object.values(currentSelectedSeats).reduce((acc, seatId) => {
    const s = getSeatById(seatId);
    return acc + (s ? s.price : 0);
  }, 0);

  // Group seats by rows
  const rowsMap: Record<number, FlightSeatItem[]> = {};
  seatsList.forEach((s) => {
    if (!rowsMap[s.row]) rowsMap[s.row] = [];
    rowsMap[s.row].push(s);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold">
                {flight.airline} • {flight.flightNumber}
              </span>
              <span className="text-xs text-sky-200 font-semibold">{flight.aircraft}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Armchair className="w-5 h-5 text-sky-400" />
              <span>Select Your Flight Seats</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Passenger Selector Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Travellers:</span>
              {passengerNames.map((name, idx) => {
                const assignedSeat = currentSelectedSeats[idx];
                const seatDetails = assignedSeat ? getSeatById(assignedSeat) : null;
                const isSelected = activePassengerIdx === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePassengerIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>{name || `Passenger ${idx + 1}`}</span>
                    {assignedSeat ? (
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-mono text-[11px] font-black">
                        {assignedSeat} {seatDetails?.price ? `(₹${seatDetails.price})` : "(Free)"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-500 font-semibold">• Not Selected</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAutoAssign}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Auto-Assign Free Seats (₹0)
            </button>
          </div>

          {/* Seat Color Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs bg-slate-100/70 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-400" />
              <span className="text-slate-700">Free Seat (₹0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-sky-100 border border-sky-400" />
              <span className="text-slate-700">Standard / Window (₹200 - ₹450)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-400" />
              <span className="text-slate-700">XL Extra Legroom (₹850)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-purple-100 border border-purple-400" />
              <span className="text-slate-700">Front / Business (₹1,200)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-slate-300 border border-slate-400 opacity-60" />
              <span className="text-slate-400">Occupied</span>
            </div>
          </div>

          {/* Aircraft Fuselage Layout */}
          <div className="max-w-md mx-auto bg-slate-50 border-2 border-slate-300 rounded-[48px] p-6 shadow-inner relative">
            {/* Cockpit nose indicator */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-black uppercase">
                <Zap className="w-3.5 h-3.5 text-sky-600" />
                <span>Front of Aircraft (Cockpit)</span>
              </div>
            </div>

            {/* Column Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono font-bold text-slate-400 mb-2">
              <span>A</span>
              <span>B</span>
              <span>C</span>
              <span className="text-[10px] text-slate-300">AISLE</span>
              <span>D</span>
              <span>E</span>
              <span>F</span>
            </div>

            {/* Rows list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto px-1">
              {Object.entries(rowsMap).map(([rowStr, seatsInRow]) => {
                const rowNum = Number(rowStr);
                const isExitRow = rowNum === 12 || rowNum === 13;

                return (
                  <div key={rowNum} className="space-y-1">
                    {isExitRow && rowNum === 12 && (
                      <div className="my-2 py-1 bg-amber-100/70 border border-amber-300 rounded-lg text-center text-[10px] font-bold text-amber-900 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Emergency Exit Row • 34" XL Extra Legroom</span>
                      </div>
                    )}

                    <div className="grid grid-cols-7 gap-1 items-center">
                      {/* Seats A, B, C */}
                      {seatsInRow.slice(0, 3).map((seat) => {
                        const isAssignedToActive = currentSelectedSeats[activePassengerIdx] === seat.id;
                        const isAssignedToOther = Object.values(currentSelectedSeats).includes(seat.id) && !isAssignedToActive;

                        let bgClass = "bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100";
                        if (!seat.isAvailable) {
                          bgClass = "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-50";
                        } else if (isAssignedToActive) {
                          bgClass = "bg-sky-600 border-sky-600 text-white font-bold shadow-md scale-105";
                        } else if (isAssignedToOther) {
                          bgClass = "bg-indigo-500 border-indigo-500 text-white font-bold opacity-80";
                        } else if (seat.category === "extra_legroom") {
                          bgClass = "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100";
                        } else if (seat.category === "business") {
                          bgClass = "bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100";
                        } else if (seat.price === 0) {
                          bgClass = "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100";
                        }

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!seat.isAvailable}
                            onClick={() => handleSeatClick(seat)}
                            title={`${seat.id} • ${seat.category} • ${seat.price === 0 ? "Free" : `₹${seat.price}`}`}
                            className={`h-9 rounded-lg border text-[11px] font-mono font-bold flex flex-col items-center justify-center transition-all ${bgClass}`}
                          >
                            <span>{seat.id}</span>
                            <span className="text-[9px] opacity-80">{seat.price === 0 ? "Free" : `₹${seat.price}`}</span>
                          </button>
                        );
                      })}

                      {/* Aisle Row Number */}
                      <div className="text-center font-mono text-[11px] font-extrabold text-slate-400">
                        {rowNum}
                      </div>

                      {/* Seats D, E, F */}
                      {seatsInRow.slice(3, 6).map((seat) => {
                        const isAssignedToActive = currentSelectedSeats[activePassengerIdx] === seat.id;
                        const isAssignedToOther = Object.values(currentSelectedSeats).includes(seat.id) && !isAssignedToActive;

                        let bgClass = "bg-sky-50 border-sky-300 text-sky-900 hover:bg-sky-100";
                        if (!seat.isAvailable) {
                          bgClass = "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-50";
                        } else if (isAssignedToActive) {
                          bgClass = "bg-sky-600 border-sky-600 text-white font-bold shadow-md scale-105";
                        } else if (isAssignedToOther) {
                          bgClass = "bg-indigo-500 border-indigo-500 text-white font-bold opacity-80";
                        } else if (seat.category === "extra_legroom") {
                          bgClass = "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100";
                        } else if (seat.category === "business") {
                          bgClass = "bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100";
                        } else if (seat.price === 0) {
                          bgClass = "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100";
                        }

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            disabled={!seat.isAvailable}
                            onClick={() => handleSeatClick(seat)}
                            title={`${seat.id} • ${seat.category} • ${seat.price === 0 ? "Free" : `₹${seat.price}`}`}
                            className={`h-9 rounded-lg border text-[11px] font-mono font-bold flex flex-col items-center justify-center transition-all ${bgClass}`}
                          >
                            <span>{seat.id}</span>
                            <span className="text-[9px] opacity-80">{seat.price === 0 ? "Free" : `₹${seat.price}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Summary & Confirm */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-500 font-medium">Selected Seats Summary</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                {Object.values(currentSelectedSeats).join(", ") || "None selected (Auto-assigned free at check-in)"}
              </span>
              {totalSeatCost > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                  +₹{totalSeatCost.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Skip / Auto-Assign
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmSeats(currentSelectedSeats, totalSeatCost);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Seats (₹{totalSeatCost})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
