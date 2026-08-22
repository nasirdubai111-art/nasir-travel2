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
} from "lucide-react";
import { DetailedTourPackage } from "../../data/tourData";
import { BookingItem } from "../../types";

interface TourItineraryBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: DetailedTourPackage | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function TourItineraryBuilderModal({
  isOpen,
  onClose,
  tour,
  onBookingSuccess,
}: TourItineraryBuilderModalProps) {
  if (!isOpen || !tour) return null;

  const [selectedDate, setSelectedDate] = useState(tour.datesAvailable[0] || "2026-09-10");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [leadTravellerName, setLeadTravellerName] = useState("Vikram Malhotra");
  const [leadTravellerPhone, setLeadTravellerPhone] = useState("+91 98111 22334");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const pricePerAdult = tour.pricePerAdult;
  const totalBasePrice = pricePerAdult * adultsCount + (pricePerAdult * 0.6) * childrenCount;
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
        provider: "BharatYatra Curated Holidays",
        fromLocation: "Ex-Delhi / Direct Joining",
        toLocation: tour.destination,
        date: selectedDate,
        time: "09:00 AM Departure",
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedConfirmation,
        passengersCount: adultsCount + childrenCount,
        seatOrRoomInfo: `${adultsCount} Adults, ${childrenCount} Kids (${tour.duration})`,
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
                {tour.circuitType} Circuit • {tour.theme}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {tour.duration}
              </span>
            </div>
            <h2 className="text-xl font-extrabold mt-1">{tour.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Highlights Box */}
            <div className="p-4 rounded-2xl bg-fuchsia-50/70 border border-fuchsia-200/80 space-y-2">
              <h4 className="font-bold text-fuchsia-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-fuchsia-600" />
                Package Key Inclusions &amp; Highlights:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Date & Travellers Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Departure Batch Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {tour.datesAvailable.map((d) => (
                    <option key={d} value={d}>
                      {d} (Confirmed Departure)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Adults (12+ yrs)</label>
                <select
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} Adult(s)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Children (2 - 11 yrs)</label>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {[0, 1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num} Child(ren) (40% Off)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Day-by-Day Interactive Itinerary */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Day-by-Day Itinerary Schedule:
              </h3>

              <div className="space-y-2">
                {tour.itinerary.map((day) => {
                  const isExpanded = expandedDay === day.dayNumber;
                  return (
                    <div
                      key={day.dayNumber}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                    >
                      <div
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-fuchsia-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            D{day.dayNumber}
                          </span>
                          <span className="font-bold text-slate-900">{day.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                            Stay: {day.stayHotel.split(" ")[0]}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 bg-white space-y-3 border-t border-slate-100">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Activities &amp; Visits:</span>
                            {day.activities.map((act, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                                <span className="text-fuchsia-600 font-bold">•</span>
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <div>
                              🏨 <strong>Stay:</strong> {day.stayHotel}
                            </div>
                            <div>
                              🍽️ <strong>Meals:</strong> {day.mealsIncluded.join(", ") || "Self"}
                            </div>
                            <div>
                              🚗 <strong>Transit:</strong> {day.transferType}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lead Passenger Details */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lead Traveller Contact:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={leadTravellerName}
                    onChange={(e) => setLeadTravellerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    value={leadTravellerPhone}
                    onChange={(e) => setLeadTravellerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* EMI & Cancellation Policy */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 block">Flexible No-Cost EMI Available</span>
                <span className="text-[10px] text-slate-500">Starting at ₹{tour.emiPerMonth} / month on all major credit cards</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px]">
                0% Interest
              </span>
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>{adultsCount} Adult(s) + {childrenCount} Child(ren)</span>
                <span>₹{totalBasePrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST &amp; Travel Insurance (5%)</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Tour Price</span>
                <span className="text-fuchsia-700">₹{finalTotal}</span>
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
              <h3 className="text-xl font-extrabold text-slate-900">Holiday Package Booked!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your holiday voucher, hotel vouchers, and day-by-day trip concierge guide have been confirmed.
              </p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-fuchsia-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-fuchsia-800">Booking Reference:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-fuchsia-800">Duration:</span>
                  <div className="text-xs font-bold text-slate-900">{tour.duration}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Holiday Circuit</span>
                  <span className="font-bold text-slate-900 block">{tour.destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure Date</span>
                  <span className="font-bold text-slate-900 block">{selectedDate}</span>
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
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Securing Slots..." : `Pay ₹${finalTotal} & Book Holiday`}
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
