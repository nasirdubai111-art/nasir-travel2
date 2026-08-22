import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
} from "lucide-react";
import { IRCTC_REFUND_RULES } from "../../data/trainData";

interface TrainCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrainCancellationModal({
  isOpen,
  onClose,
}: TrainCancellationModalProps) {
  if (!isOpen) return null;

  const [pnrNumber, setPnrNumber] = useState("284-9104821");
  const [ticketFare, setTicketFare] = useState("1750");
  const [ticketClass, setTicketClass] = useState("3A");
  const [timeBeforeDeparture, setTimeBeforeDeparture] = useState("more_than_48h");
  const [calculatedRefund, setCalculatedRefund] = useState<{
    deduction: number;
    refundAmount: number;
    reason: string;
  } | null>(null);

  const handleCalculateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const fare = parseFloat(ticketFare) || 0;
    let deduction = 0;
    let reason = "";

    if (timeBeforeDeparture === "more_than_48h") {
      deduction = ticketClass === "1A" || ticketClass === "EC" ? 240 : ticketClass === "2A" ? 200 : 180;
      reason = "Standard clerkage deduction (> 48h before train departure).";
    } else if (timeBeforeDeparture === "12h_to_48h") {
      deduction = Math.max(fare * 0.25, 180);
      reason = "25% fare deduction (between 12h and 48h before departure).";
    } else if (timeBeforeDeparture === "4h_to_12h") {
      deduction = Math.max(fare * 0.5, 180);
      reason = "50% fare deduction (between 4h and 12h before departure / charting).";
    } else {
      deduction = fare;
      reason = "No refund after chart preparation / less than 4h before departure (File TDR).";
    }

    const refund = Math.max(0, fare - deduction);
    setCalculatedRefund({
      deduction,
      refundAmount: refund,
      reason,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-amber-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">IRCTC Cancellation &amp; Instant Refund Calculator</h2>
              <p className="text-xs text-rose-100">Calculate exact bank/wallet refund per official Railway Board rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleCalculateRefund} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PNR Number (Optional)</label>
                <input
                  type="text"
                  value={pnrNumber}
                  onChange={(e) => setPnrNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Ticket Fare (₹)</label>
                <input
                  type="number"
                  value={ticketFare}
                  onChange={(e) => setTicketFare(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Travel Class</label>
                <select
                  value={ticketClass}
                  onChange={(e) => setTicketClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="1A">1A / Executive Class (EC)</option>
                  <option value="2A">2A (2-Tier AC)</option>
                  <option value="3A">3A / 3E (3-Tier AC / Economy)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="SL">Sleeper Class (SL)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cancellation Timing</label>
                <select
                  value={timeBeforeDeparture}
                  onChange={(e) => setTimeBeforeDeparture(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="more_than_48h">&gt; 48 Hours before departure</option>
                  <option value="12h_to_48h">Between 12 to 48 Hours before departure</option>
                  <option value="4h_to_12h">Between 4 to 12 Hours before departure</option>
                  <option value="less_than_4h">&lt; 4 Hours (Post Charting)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Calculate Refund Amount</span>
            </button>
          </form>

          {/* Refund Calculation Result */}
          {calculatedRefund && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase">Estimated Refund to Wallet / Bank:</span>
                <span className="text-xl font-black text-emerald-700">₹{calculatedRefund.refundAmount}</span>
              </div>
              <div className="text-xs text-emerald-800 flex justify-between border-t border-emerald-200/60 pt-2">
                <span>IRCTC Cancellation Fee:</span>
                <span className="font-bold text-rose-600">- ₹{calculatedRefund.deduction}</span>
              </div>
              <p className="text-[11px] text-emerald-700 italic">{calculatedRefund.reason}</p>
              <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>BharatYatra guarantees instant refund credit to UPI / Wallet in under 15 minutes.</span>
              </div>
            </div>
          )}

          {/* Official Rule Sheet */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Railway Board Refund Guidelines (Quick Reference):
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-[11px]">
              {IRCTC_REFUND_RULES.map((rule, idx) => (
                <div key={idx} className="p-3 bg-slate-50/50 flex justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block">{rule.ticketType}</span>
                    <span className="text-slate-500 text-[10px]">{rule.cancellationWindow}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">{rule.refundPercentage}</span>
                    <span className="text-slate-400 text-[10px]">{rule.deduction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
