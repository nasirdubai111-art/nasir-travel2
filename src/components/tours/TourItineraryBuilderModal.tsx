import React, { useState } from "react";
import {
  X,
  Map,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Clock,
  ShieldCheck,
  Building2,
  Bus,
  UtensilsCrossed,
} from "lucide-react";
import { UnifiedTourPackage } from "../../types";
import { BookingItem } from "../../types";

interface TourItineraryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: UnifiedTourPackage | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function TourItineraryBuilderModal({
  isOpen,
  onClose,
  tour,
  onBookingSuccess,
}: TourItineraryBuilderModalProps) {
  if (!isOpen || !tour) return null;

  const defaultDate = tour.departureBatches?.[0]?.departureDate || "2026-09-12";
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [leadTravellerName, setLeadTravellerName] = useState("Vikram Malhotra");
  const [leadTravellerPhone, setLeadTravellerPhone] = useState("+91 98111 22334");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const pricePerAdult = tour.pricePerAdult;
  const totalBasePrice = pricePerAdult * adultsCount + Math.round(pricePerAdult * 0.6) * childrenCount;
  const gstAmount = Math.round(totalBasePrice * 0.05);
  const finalTotal = Math.round(totalBasePrice + gstAmount);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedConfirmation = `TOUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: BookingItem = {
        id: `TB-${Date.now()}`,
        serviceCategory: "tours",
        title: tour.title,
        provider: tour.operatorName || "BharatYatra Curated Holidays",
        fromLocation: "Ex-Delhi / Direct Joining",
        toLocation: tour.destination,
        date: selectedDate,
        time: "09:00 AM Departure",
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedConfirmation,
        passengersCount: adultsCount + childrenCount,
        seatOrRoomInfo: `${adultsCount} Adults, ${childrenCount} Kids (${tour.durationText})`,
      };

      setConfirmedBookingData({
        ...newBooking,
        tour,
        selectedDate,
        adultsCount,
        childrenCount,
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
        <div className="bg-gradient-to-r from-fuchsia-800 via-purple-900 to-pink-900 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase">
                {tour.category} Circuit
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {tour.durationText}
              </span>
            </div>
            <h2 className="text-xl font-extrabold mt-1">{tour.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isConfirmed ? (
            <>
              {/* Day-Wise Plan */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Day-by-Day Travel Plan</h3>
                {tour.itinerary.map((day) => (
                  <div key={day.dayNumber} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(expandedDay === day.dayNumber ? null : day.dayNumber)}
                      className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-fuchsia-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">{day.title}</h4>
                          <span className="text-[11px] text-slate-500">{day.activities.length} activities scheduled</span>
                        </div>
                      </div>
                      {expandedDay === day.dayNumber ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedDay === day.dayNumber && (
                      <div className="p-4 bg-white border-t border-slate-200 text-xs space-y-2">
                        <ul className="space-y-1">
                          {day.activities.map((act, i) => (
                            <li key={i} className="flex items-center gap-2 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                        {day.stayHotel && (
                          <div className="pt-2 flex items-center gap-2 text-slate-500 text-[11px]">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Stay: <strong>{day.stayHotel}</strong></span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Date & Guest Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Departure Batch Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-fuchsia-500 bg-white"
                  >
                    {tour.departureBatches?.map((batch) => (
                      <option key={batch.id} value={batch.departureDate}>
                        {batch.departureDate} ({batch.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Adults (12+)</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={adultsCount}
                      onChange={(e) => setAdultsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kids (5-11)</label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Confirmation Screen */
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tour Booking Confirmed!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your reservation for <strong>{tour.title}</strong> has been registered. PNR: <strong>{confirmedBookingData?.pnr}</strong>.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-600 text-white text-xs font-bold hover:bg-fuchsia-700"
              >
                Close Window
              </button>
            </div>
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {!isConfirmed && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">Total Amount Payable</span>
              <div className="text-xl font-black text-slate-900">₹{finalTotal.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-slate-500">Includes 5% GST &amp; Chauffeur Allowance</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="px-8 py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? "Processing Reservation..." : "Confirm & Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
