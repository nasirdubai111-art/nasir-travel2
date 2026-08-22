import React, { useState } from "react";
import {
  X,
  Search,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  XCircle,
  Clock,
  CheckCircle2,
  Receipt,
  Plane,
  CreditCard,
  Luggage,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { INITIAL_PNR_DATABASE, MockPNRRecord } from "../../data/flightData";

interface FlightManagePNRModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPNR?: string;
}

export function FlightManagePNRModal({
  isOpen,
  onClose,
  initialPNR = "BY7K92",
}: FlightManagePNRModalProps) {
  const [searchPnr, setSearchPnr] = useState(initialPNR);
  const [activeTab, setActiveTab] = useState<"details" | "cancel" | "reschedule" | "refunds">("details");
  const [pnrList, setPnrList] = useState<MockPNRRecord[]>(INITIAL_PNR_DATABASE);
  const [currentPnr, setCurrentPnr] = useState<MockPNRRecord | null>(
    () => pnrList.find((p) => p.pnr.toUpperCase() === initialPNR.toUpperCase()) || pnrList[0]
  );

  // Cancellation State
  const [cancellationReason, setCancellationReason] = useState("Change of travel plans");
  const [refundDestination, setRefundDestination] = useState<"wallet" | "source">("source");
  const [isCancelProcessing, setIsCancelProcessing] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Reschedule State
  const [newTravelDate, setNewTravelDate] = useState("2026-09-02");
  const [isRescheduleProcessing, setIsRescheduleProcessing] = useState(false);
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = pnrList.find((p) => p.pnr.toUpperCase() === searchPnr.trim().toUpperCase());
    if (found) {
      setCurrentPnr(found);
      setCancelSuccessMsg(null);
      setRescheduleSuccessMsg(null);
    } else {
      // Create dynamic fallback record for demonstration
      const dummy: MockPNRRecord = {
        pnr: searchPnr.toUpperCase(),
        bookingRef: `BY-FL-${Math.floor(1000 + Math.random() * 9000)}`,
        airlinePnr: `6E-${searchPnr.toUpperCase()}`,
        airline: "IndiGo",
        flightNumber: "6E-2041",
        airlineLogo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
        fromCode: "DEL",
        fromCity: "New Delhi",
        fromTerminal: "Terminal 2",
        toCode: "BOM",
        toCity: "Mumbai",
        toTerminal: "Terminal 2",
        departDate: "2026-08-30",
        departTime: "06:15",
        arriveTime: "08:30",
        duration: "2h 15m",
        status: "CONFIRMED",
        fareTier: "Saver Lite",
        passengers: [
          {
            name: "Guest Traveller",
            type: "Adult",
            seat: "14B",
            meal: "Standard Meal",
            baggage: "15 kg",
            ticketNumber: "6E-99023411",
          },
        ],
        gate: "Gate 12",
        boardingTime: "05:35",
        baseFare: 3899,
        taxesAndGst: 195,
        addonsCost: 0,
        totalPaid: 4094,
        paymentMode: "Net Banking (SBI)",
      };
      setPnrList([dummy, ...pnrList]);
      setCurrentPnr(dummy);
    }
  };

  // Process Cancellation
  const handleExecuteCancel = () => {
    if (!currentPnr) return;
    setIsCancelProcessing(true);

    const airlineFee = currentPnr.fareTier.includes("SuperFlex") || currentPnr.fareTier.includes("Business") ? 0 : 1500;
    const refundAmt = Math.max(0, currentPnr.totalPaid - airlineFee);

    setTimeout(() => {
      const updated: MockPNRRecord = {
        ...currentPnr,
        status: "CANCELLED",
        cancellationRefund: {
          refundId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          originalPaid: currentPnr.totalPaid,
          airlineFee,
          convenienceRetained: 0,
          refundAmount: refundAmt,
          status: "INITIATED",
          rrnNumber: `RRN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          estimatedCreditDate: "2 Business Days (Instant for UPI)",
        },
      };

      setPnrList(pnrList.map((p) => (p.pnr === currentPnr.pnr ? updated : p)));
      setCurrentPnr(updated);
      setIsCancelProcessing(false);
      setCancelSuccessMsg(`Flight successfully cancelled. ₹${refundAmt.toLocaleString("en-IN")} refund has been initiated to your ${refundDestination === "wallet" ? "BharatYatra Wallet" : "Original Payment Method"}.`);
      setActiveTab("refunds");
    }, 900);
  };

  // Process Rescheduling
  const handleExecuteReschedule = () => {
    if (!currentPnr) return;
    setIsRescheduleProcessing(true);

    setTimeout(() => {
      const updated: MockPNRRecord = {
        ...currentPnr,
        departDate: newTravelDate,
        status: "RESCHEDULED",
      };

      setPnrList(pnrList.map((p) => (p.pnr === currentPnr.pnr ? updated : p)));
      setCurrentPnr(updated);
      setIsRescheduleProcessing(false);
      setRescheduleSuccessMsg(`Flight departure successfully rescheduled to ${newTravelDate}. Updated E-Ticket has been dispatched to your email and SMS.`);
      setActiveTab("details");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-blue-900 to-indigo-950 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/30 text-sky-200 text-xs font-mono font-bold">
                Self-Service Travel Desk
              </span>
              <span className="text-xs text-sky-200">Instant Modifications &amp; Refunds</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-sky-400" />
              <span>Manage Booking, PNR, Cancellation &amp; Refunds</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PNR Search Input */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchPnr}
                onChange={(e) => setSearchPnr(e.target.value.toUpperCase())}
                placeholder="Enter 6-Character Airline / BharatYatra PNR (e.g. BY7K92, AI4R2P)..."
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono font-bold text-sm bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Retrieve Booking</span>
            </button>
          </form>

          {/* Quick PNR Switcher */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 overflow-x-auto">
            <span className="font-bold">Sample PNRs:</span>
            {pnrList.map((item) => (
              <button
                key={item.pnr}
                type="button"
                onClick={() => {
                  setSearchPnr(item.pnr);
                  setCurrentPnr(item);
                  setCancelSuccessMsg(null);
                  setRescheduleSuccessMsg(null);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold border transition-colors ${
                  currentPnr?.pnr === item.pnr
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {item.pnr} ({item.airline} • {item.fromCode}➔{item.toCode})
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-3 shrink-0">
          {[
            { id: "details", label: "Booking & E-Ticket Details", icon: FileText },
            { id: "cancel", label: "Cancel Flight & Instant Refund", icon: XCircle },
            { id: "reschedule", label: "Reschedule / Change Date", icon: ArrowRightLeft },
            { id: "refunds", label: "Refunds Status Tracker", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? "border-sky-600 text-sky-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cancelSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
          )}

          {rescheduleSuccessMsg && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span>{rescheduleSuccessMsg}</span>
            </div>
          )}

          {currentPnr ? (
            <>
              {/* TAB 1: DETAILS */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Digital Ticket Card */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 text-white border border-slate-700 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-white">{currentPnr.airline}</span>
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">
                            {currentPnr.flightNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Booking Ref: {currentPnr.bookingRef}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">PNR Number</span>
                          <span className="text-xl font-black font-mono text-sky-400 tracking-wider">
                            {currentPnr.pnr}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            currentPnr.status === "CONFIRMED"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : currentPnr.status === "RESCHEDULED"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {currentPnr.status}
                        </span>
                      </div>
                    </div>

                    {/* Route Schedule */}
                    <div className="grid grid-cols-3 gap-4 text-center items-center">
                      <div className="text-left space-y-0.5">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">{currentPnr.fromCode}</span>
                        <div className="text-xs font-bold text-sky-300">{currentPnr.fromCity}</div>
                        <div className="text-xs text-slate-400 font-mono">{currentPnr.departTime} • {currentPnr.fromTerminal}</div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{currentPnr.duration}</span>
                        <div className="w-full h-0.5 bg-slate-700 relative flex items-center justify-center">
                          <Plane className="w-4 h-4 text-sky-400 absolute" />
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold block">Non-stop Direct</span>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="text-2xl sm:text-3xl font-black font-mono text-white">{currentPnr.toCode}</span>
                        <div className="text-xs font-bold text-sky-300">{currentPnr.toCity}</div>
                        <div className="text-xs text-slate-400 font-mono">{currentPnr.arriveTime} • {currentPnr.toTerminal}</div>
                      </div>
                    </div>

                    {/* Operational Bar: Gate, Boarding, Fare */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Departure Date</span>
                        <span className="text-xs font-bold text-white">{currentPnr.departDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Boarding Gate</span>
                        <span className="text-xs font-bold text-sky-300">{currentPnr.gate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Boarding Time</span>
                        <span className="text-xs font-bold text-emerald-400">{currentPnr.boardingTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Fare Bundle</span>
                        <span className="text-xs font-bold text-white">{currentPnr.fareTier}</span>
                      </div>
                    </div>

                    {/* Passenger Manifest */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Passenger Manifest ({currentPnr.passengers.length})
                      </span>
                      <div className="space-y-2">
                        {currentPnr.passengers.map((p, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-bold text-white">{p.name}</span>
                              <span className="text-slate-400 ml-2 font-mono">E-Ticket: {p.ticketNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded font-mono font-bold">
                                Seat: {p.seat}
                              </span>
                              <span className="text-[11px]">{p.meal}</span>
                              <span className="text-[11px] text-emerald-400">{p.baggage}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Invoice */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-700 text-xs">
                      <div>
                        <span className="text-slate-400">Total Paid: </span>
                        <span className="font-extrabold text-white text-sm">
                          ₹{currentPnr.totalPaid.toLocaleString("en-IN")}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2">via {currentPnr.paymentMode}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading official Tax Invoice for PNR ${currentPnr.pnr}...`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-colors"
                        >
                          Download Tax Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CANCELLATION */}
              {activeTab === "cancel" && (
                <div className="space-y-6">
                  {currentPnr.status === "CANCELLED" ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center space-y-3">
                      <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
                      <h3 className="text-base font-extrabold text-amber-900">This Flight is Already Cancelled</h3>
                      <p className="text-xs text-amber-800 max-w-md mx-auto">
                        A full refund of ₹{currentPnr.cancellationRefund?.refundAmount.toLocaleString("en-IN")} has been initiated under reference {currentPnr.cancellationRefund?.refundId}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("refunds")}
                        className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs"
                      >
                        Check Refund Status
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-6 space-y-4">
                        <div className="flex items-center gap-3 text-rose-900">
                          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                          <div>
                            <h3 className="font-extrabold text-base">Instant Flight Cancellation Desk</h3>
                            <p className="text-xs text-rose-700">
                              Review refundable amounts and deductions before confirming.
                            </p>
                          </div>
                        </div>

                        {/* Refund Breakdown Calculator */}
                        <div className="bg-white rounded-2xl p-4 border border-rose-200 space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Total Booking Amount Paid</span>
                            <span className="font-bold text-slate-900">₹{currentPnr.totalPaid.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                            <span>Airline Cancellation Penalty</span>
                            <span>-₹{currentPnr.fareTier.includes("SuperFlex") ? "0 (SuperFlex Waiver)" : "1,500"}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                            <span>Airport Tax (UDF + PSF) 100% Refund</span>
                            <span>+₹{currentPnr.taxesAndGst}</span>
                          </div>
                          <div className="flex justify-between py-2 font-black text-sm text-slate-900">
                            <span>Net Estimated Refund Amount</span>
                            <span className="text-emerald-600 text-base">
                              ₹{(currentPnr.totalPaid - (currentPnr.fareTier.includes("SuperFlex") ? 0 : 1500)).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Cancellation Reason */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Reason for Cancellation</label>
                          <select
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                          >
                            <option value="Change of travel plans">Change of travel plans</option>
                            <option value="Medical emergency">Medical emergency</option>
                            <option value="Personal emergency">Personal emergency</option>
                            <option value="Flight timing mismatch">Flight timing mismatch</option>
                            <option value="Booked alternative airline">Booked alternative airline</option>
                          </select>
                        </div>

                        {/* Refund Payout Mode */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">Select Payout Destination</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setRefundDestination("source")}
                              className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                                refundDestination === "source"
                                  ? "border-rose-500 bg-white ring-2 ring-rose-500/20 font-bold"
                                  : "border-slate-200 bg-white/70"
                              }`}
                            >
                              <div className="font-extrabold text-slate-900">Original Payment Source</div>
                              <span className="text-[11px] text-slate-500">Card / UPI / Netbanking (2-4 business days)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setRefundDestination("wallet")}
                              className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                                refundDestination === "wallet"
                                  ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 font-bold"
                                  : "border-slate-200 bg-white/70"
                              }`}
                            >
                              <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                                <span>BharatYatra Wallet</span>
                                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px]">Instant + 5% Coins</span>
                              </div>
                              <span className="text-[11px] text-slate-500">Instant credit for future flights</span>
                            </button>
                          </div>
                        </div>

                        {/* Confirmation Trigger */}
                        <button
                          type="button"
                          disabled={isCancelProcessing}
                          onClick={handleExecuteCancel}
                          className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          {isCancelProcessing ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              <span>Submitting Airline Cancellation to GDS...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Confirm Cancellation &amp; Process Refund</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RESCHEDULING */}
              {activeTab === "reschedule" && (
                <div className="space-y-6">
                  <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sky-900">
                      <ArrowRightLeft className="w-6 h-6 text-sky-600 shrink-0" />
                      <div>
                        <h3 className="font-extrabold text-base">Reschedule Your Flight Date &amp; Time</h3>
                        <p className="text-xs text-sky-700">
                          {currentPnr.fareTier.includes("Flexi") || currentPnr.fareTier.includes("SuperFlex")
                            ? "Your fare tier qualifies for ₹0 Free Date Change fee! Only airline fare difference applies if any."
                            : "Saver Lite date change fee is ₹2,999 + any fare difference."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Current Departure</span>
                        <div className="text-sm font-extrabold text-slate-900">{currentPnr.departDate} at {currentPnr.departTime}</div>
                        <span className="text-xs text-slate-500 font-mono">{currentPnr.fromCode} ➔ {currentPnr.toCode}</span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-sky-300 space-y-1.5">
                        <span className="text-[10px] text-sky-700 uppercase font-bold">Select New Departure Date</span>
                        <input
                          type="date"
                          value={newTravelDate}
                          onChange={(e) => setNewTravelDate(e.target.value)}
                          className="w-full font-bold text-xs text-slate-900 border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    {/* Reschedule Cost Summary */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Rescheduling Fee</span>
                        <span className="font-bold text-emerald-600">
                          {currentPnr.fareTier.includes("Flexi") || currentPnr.fareTier.includes("SuperFlex")
                            ? "₹0 (Zero Fee Waiver)"
                            : "₹2,999"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-600">Estimated Fare Difference</span>
                        <span className="font-bold text-slate-900">₹0 (Same fare bucket available)</span>
                      </div>
                      <div className="flex justify-between py-2 font-black text-sm text-slate-900">
                        <span>Total Payable for Date Change</span>
                        <span className="text-sky-600 text-base">
                          {currentPnr.fareTier.includes("Flexi") || currentPnr.fareTier.includes("SuperFlex") ? "₹0" : "₹2,999"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isRescheduleProcessing}
                      onClick={handleExecuteReschedule}
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isRescheduleProcessing ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Re-issuing E-Ticket with Airline...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Date Change to {newTravelDate}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: REFUNDS */}
              {activeTab === "refunds" && (
                <div className="space-y-6">
                  {currentPnr.cancellationRefund ? (
                    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            REFUND ID: {currentPnr.cancellationRefund.refundId}
                          </span>
                          <h3 className="text-lg font-black text-white">Refund Progress &amp; Audit Trail</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400">Total Refund:</span>
                          <span className="text-xl font-black text-emerald-400 ml-1.5">
                            ₹{currentPnr.cancellationRefund.refundAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* 4-Step Refund Timeline */}
                      <div className="space-y-4">
                        {[
                          {
                            step: 1,
                            title: "Refund Request Initiated",
                            subtitle: "GDS cancellation confirmation generated & ticket voided.",
                            completed: true,
                            time: "Immediate",
                          },
                          {
                            step: 2,
                            title: "Airline Settlement Clearance",
                            subtitle: `${currentPnr.airline} authorized refund voucher and credited platform gateway.`,
                            completed: true,
                            time: "Authorized",
                          },
                          {
                            step: 3,
                            title: "Payment Gateway Dispatch",
                            subtitle: `Transferred to banking partner via Razorpay / NPCI UPI network. (Ref: ${currentPnr.cancellationRefund.rrnNumber})`,
                            completed: true,
                            time: "In Progress",
                          },
                          {
                            step: 4,
                            title: "Credited to Bank / UPI Account",
                            subtitle: "Amount will reflect in bank statement or BharatYatra Wallet.",
                            completed: false,
                            time: currentPnr.cancellationRefund.estimatedCreditDate,
                          },
                        ].map((s) => (
                          <div key={s.step} className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                s.completed ? "bg-emerald-500 text-slate-950 font-black" : "bg-slate-800 text-slate-500 border border-slate-700"
                              }`}
                            >
                              {s.completed ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                                <span className="text-xs font-mono text-emerald-400 font-bold">{s.time}</span>
                              </div>
                              <p className="text-xs text-slate-400">{s.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">Bank RRN Reference:</span>
                          <span className="font-mono text-sky-400 ml-1.5">{currentPnr.cancellationRefund.rrnNumber}</span>
                        </div>
                        <span className="text-slate-400">NPCI Fast Refund Network</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-3">
                      <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
                      <h3 className="text-base font-extrabold text-slate-900">No Active Refund on this PNR</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        This flight booking is currently active and confirmed. If you cancel, your refund audit trail will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
