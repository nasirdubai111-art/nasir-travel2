import React, { useState } from "react";
import {
  X,
  Landmark,
  Sparkles,
  Flame,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Clock,
  Heart,
} from "lucide-react";
import { TempleDetail, DetailedYatraPackage } from "../../data/yatraData";
import { BookingItem } from "../../types";

interface TempleDarshanModalProps {
  isOpen: boolean;
  onClose: () => void;
  temple: TempleDetail | null;
  yatraPackage?: DetailedYatraPackage | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function TempleDarshanModal({
  isOpen,
  onClose,
  temple,
  yatraPackage,
  onBookingSuccess,
}: TempleDarshanModalProps) {
  if (!isOpen || (!temple && !yatraPackage)) return null;

  const activeTemple = temple;
  const [darshanDate, setDarshanDate] = useState("2026-09-15");
  const [selectedSlot, setSelectedSlot] = useState(activeTemple?.darshanTimings.vipDarshanSlots[0] || "06:00 AM (VIP Abhishek)");
  const [pilgrimsCount, setPilgrimsCount] = useState(2);
  const [includeSpecialPooja, setIncludeSpecialPooja] = useState(true);
  const [needSeniorAssistance, setNeedSeniorAssistance] = useState(true);
  const [leadDevoteeName, setLeadDevoteeName] = useState("Suresh Chandra Shastri");
  const [leadDevoteeGotra, setLeadDevoteeGotra] = useState("Kashyap Gotra");
  const [contactPhone, setContactPhone] = useState("+91 94500 88991");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Price calculations
  const vipPassPerPerson = 500;
  const poojaCharge = includeSpecialPooja ? 1100 : 0;
  const seniorAssistanceFee = needSeniorAssistance ? 750 : 0;
  const totalBase = (vipPassPerPerson * pilgrimsCount) + poojaCharge + seniorAssistanceFee;
  const finalTotal = totalBase;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPass = `DARSHAN-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: BookingItem = {
        id: `YB-${Date.now()}`,
        serviceCategory: "pilgrimage",
        title: `${activeTemple?.name || yatraPackage?.title} (VIP Sugam Darshan)`,
        provider: `${activeTemple?.name || "Sanatan Shrine Board"}`,
        fromLocation: activeTemple?.location || "Dehradun Helipad",
        toLocation: activeTemple?.state || "Uttarakhand",
        date: darshanDate,
        time: selectedSlot,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedPass,
        passengersCount: pilgrimsCount,
        seatOrRoomInfo: `${pilgrimsCount} Devotees • VIP Pass (${selectedSlot})`,
      };

      setConfirmedBookingData({
        ...newBooking,
        temple: activeTemple,
        selectedSlot,
        leadDevoteeName,
        leadDevoteeGotra,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-yellow-900 to-amber-950 p-6 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">{activeTemple?.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  {activeTemple?.circuit}
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-0.5">
                Presiding Deity: <strong>{activeTemple?.deity}</strong> • {activeTemple?.location}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Temple Significance */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider">Sacred Mahatmya &amp; Significance:</span>
              <p className="text-slate-700 leading-relaxed">{activeTemple?.significance}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 text-[11px]">
                <div>🥻 <strong>Dress Code:</strong> {activeTemple?.dressCode}</div>
                <div>🥥 <strong>Maha Prasad:</strong> {activeTemple?.prasadSpecialty}</div>
              </div>
            </div>

            {/* Darshan Slot & Date Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select Darshan Date</label>
                <input
                  type="date"
                  value={darshanDate}
                  onChange={(e) => setDarshanDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">VIP Darshan Slot Time</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  {activeTemple?.darshanTimings.vipDarshanSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pilgrims Count */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Number of Pilgrims (Devotees)</label>
              <select
                value={pilgrimsCount}
                onChange={(e) => setPilgrimsCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Pilgrim(s) (₹{vipPassPerPerson * num})
                  </option>
                ))}
              </select>
            </div>

            {/* Special Rituals & Senior Citizen Assistance Add-ons */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Pooja &amp; Assistance Add-ons:</h4>

              <label className="flex items-center justify-between cursor-pointer pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSpecialPooja}
                    onChange={(e) => setIncludeSpecialPooja(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Special Archana &amp; Personalized Sankalp Pooja (+ ₹1,100)</span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={needSeniorAssistance}
                    onChange={(e) => setNeedSeniorAssistance(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Senior Citizen Wheelchair / Fast-track Sugam Escort (+ ₹750)</span>
                </div>
                <Heart className="w-4 h-4 text-rose-500" />
              </label>
            </div>

            {/* Devotee Info */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Devotee Sankalp Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Lead Devotee Name</label>
                  <input
                    type="text"
                    value={leadDevoteeName}
                    onChange={(e) => setLeadDevoteeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Family Gotra</label>
                  <input
                    type="text"
                    value={leadDevoteeGotra}
                    onChange={(e) => setLeadDevoteeGotra(e.target.value)}
                    placeholder="e.g. Kashyap / Bharadwaj"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Mobile (SMS Token)</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Total Pricing */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>VIP Sugam Darshan Passes ({pilgrimsCount} Devotees × ₹{vipPassPerPerson})</span>
                <span>₹{vipPassPerPerson * pilgrimsCount}</span>
              </div>
              {includeSpecialPooja && (
                <div className="flex justify-between text-slate-600">
                  <span>Special Archana &amp; Purohit Sankalp</span>
                  <span>₹{poojaCharge}</span>
                </div>
              )}
              {needSeniorAssistance && (
                <div className="flex justify-between text-slate-600">
                  <span>Senior Citizen Sugam Ramp &amp; Wheelchair Escort</span>
                  <span>₹{seniorAssistanceFee}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount (Includes Temple Trust Seva)</span>
                <span className="text-amber-700">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmed View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">VIP Darshan Pass Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your blessed Seeghra Darshan e-Token has been confirmed. Show this digital pass at Temple Gate #1.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">Darshan Token ID:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-amber-800">Temple:</span>
                  <div className="text-xs font-bold text-slate-900">{activeTemple?.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Devotee &amp; Gotra</span>
                  <span className="font-bold text-slate-900 block">{leadDevoteeName} ({leadDevoteeGotra})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date &amp; Slot</span>
                  <span className="font-bold text-amber-900 block">{darshanDate} • {selectedSlot}</span>
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
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Generating Pass..." : `Pay ₹${finalTotal} & Book VIP Darshan`}
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
