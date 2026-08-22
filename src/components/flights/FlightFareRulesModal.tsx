import React from "react";
import { X, ShieldAlert, Clock, AlertTriangle, Luggage, ArrowRightLeft, FileCheck, CheckCircle2 } from "lucide-react";
import { FlightExtendedDeal } from "../../data/flightData";

interface FlightFareRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal | null;
  selectedTier: "saver" | "flexi" | "superflex" | "business";
}

export function FlightFareRulesModal({
  isOpen,
  onClose,
  flight,
  selectedTier,
}: FlightFareRulesModalProps) {
  if (!isOpen || !flight) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold">
                {flight.airline} • {flight.flightNumber}
              </span>
              <span className="text-xs text-sky-200 font-semibold">
                {flight.fromCode} ➔ {flight.toCode}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>Fare Rules &amp; Cancellation Policy</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Tier Summary */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Selected Fare Category</span>
              <h3 className="font-extrabold text-slate-900 text-base capitalize">
                {selectedTier === "saver" ? "Saver Lite" : selectedTier === "flexi" ? "Flexi Plus" : selectedTier === "superflex" ? "SuperFlex Corporate" : "Business Class"}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-600 text-white font-bold text-xs">
              {flight.refundable ? "Refundable Fare" : "Non-Refundable"}
            </span>
          </div>

          {/* 1. Cancellation Charges Timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Cancellation Penalties (Before Departure)</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-100 p-3 font-bold text-slate-700 grid grid-cols-12 gap-2">
                <span className="col-span-6">Time Window Prior to Flight</span>
                <span className="col-span-6 text-right">Airline Deduction / Penalty</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-3 grid grid-cols-12 gap-2 text-slate-700 bg-white">
                  <span className="col-span-6 font-medium">&gt; 72 hours before flight</span>
                  <span className="col-span-6 text-right font-bold text-slate-900">
                    {selectedTier === "superflex" || selectedTier === "business" ? "₹0 (100% Full Refund)" : selectedTier === "flexi" ? "₹1,500 per passenger" : "₹3,499 per passenger"}
                  </span>
                </div>
                <div className="p-3 grid grid-cols-12 gap-2 text-slate-700 bg-slate-50/50">
                  <span className="col-span-6 font-medium">72 hours to 24 hours</span>
                  <span className="col-span-6 text-right font-bold text-slate-900">
                    {selectedTier === "superflex" || selectedTier === "business" ? "₹0 (100% Full Refund)" : "₹3,750 or Base Fare"}
                  </span>
                </div>
                <div className="p-3 grid grid-cols-12 gap-2 text-slate-700 bg-white">
                  <span className="col-span-6 font-medium">24 hours to 2 hours</span>
                  <span className="col-span-6 text-right font-bold text-amber-700">
                    {selectedTier === "business" ? "₹0 (100% Full Refund)" : "₹4,250 (Statutory taxes fully refunded)"}
                  </span>
                </div>
                <div className="p-3 grid grid-cols-12 gap-2 text-rose-700 bg-rose-50/40">
                  <span className="col-span-6 font-bold">Within 2 hours / No-Show</span>
                  <span className="col-span-6 text-right font-black">
                    Non-Refundable (Only Airport Taxes (PSF/UDF) refunded)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Rescheduling / Date Change Charges */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
              <span>Rescheduling &amp; Date Change Charges</span>
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-semibold">Reschedule Fee (Flexi / SuperFlex)</span>
                <span className="font-bold text-emerald-600">₹0 (Zero Free Date Changes)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-semibold">Reschedule Fee (Saver Lite)</span>
                <span className="font-bold text-slate-900">₹2,999 per passenger + Fare Diff</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold">Cut-off Time for Changes</span>
                <span className="font-bold text-slate-900">Up to 2 hours before scheduled departure</span>
              </div>
            </div>
          </div>

          {/* 3. Baggage & Dimensions Policy */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Luggage className="w-4 h-4 text-sky-600" />
              <span>Baggage Dimensions &amp; Weight Limits</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5 bg-slate-50">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cabin / Hand Baggage</span>
                </div>
                <p className="text-slate-600 font-medium">1 Handbag / Laptop Bag up to <strong>7 kg</strong></p>
                <p className="text-slate-400 text-[11px]">Dimensions max 55cm x 35cm x 25cm (L+W+H max 115cm)</p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1.5 bg-slate-50">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Check-In Baggage</span>
                </div>
                <p className="text-slate-600 font-medium">
                  {flight.isInternational ? "25 kg - 30 kg (1 or 2 pieces)" : "15 kg (1 Piece) per passenger"}
                </p>
                <p className="text-slate-400 text-[11px]">Dimensions max 158cm (62 inches) total</p>
              </div>
            </div>
          </div>

          {/* International Notice if applicable */}
          {flight.isInternational && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold">International Travel &amp; Visa Advisory</h4>
                <p className="text-amber-800">
                  Passport must have at least 6 months validity from the date of travel. Please verify transit visa &amp; destination entry requirements before completing booking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
