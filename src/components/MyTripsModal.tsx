import React, { useState } from "react";
import {
  X,
  Ticket,
  QrCode,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plane,
  Train,
  Bus,
  Building2,
  Car,
  UtensilsCrossed,
  Palmtree,
  Map,
  Landmark,
  FileText,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BookingItem, ServiceCategory, UserProfile } from "../types";

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  userProfile: UserProfile;
  onCancelBooking: (id: string) => void;
  onOpenAIDrawer: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
}

export function MyTripsModal({
  isOpen,
  onClose,
  bookings,
  userProfile,
  onCancelBooking,
  onOpenAIDrawer,
  onSelectCategory,
}: MyTripsModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed" | "cancelled">("upcoming");
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<BookingItem | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("Change of travel plans");
  const [showCancellationSuccess, setShowCancellationSuccess] = useState<string | null>(null);
  const [showWebCheckInSuccess, setShowWebCheckInSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.status === activeTab;
  });

  const getServiceIcon = (category: ServiceCategory) => {
    switch (category) {
      case "flights": return <Plane className="w-4 h-4 text-sky-600" />;
      case "trains": return <Train className="w-4 h-4 text-amber-600" />;
      case "buses": return <Bus className="w-4 h-4 text-red-600" />;
      case "hotels": return <Building2 className="w-4 h-4 text-indigo-600" />;
      case "resorts": return <Palmtree className="w-4 h-4 text-emerald-600" />;
      case "tours": return <Map className="w-4 h-4 text-fuchsia-600" />;
      case "pilgrimage": return <Landmark className="w-4 h-4 text-amber-700" />;
      case "cabs": return <Car className="w-4 h-4 text-cyan-600" />;
      case "dining": return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      default: return <Ticket className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: BookingItem["status"]) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled & Refunded
          </span>
        );
    }
  };

  const handleConfirmCancel = (id: string, amount: number) => {
    onCancelBooking(id);
    setCancellingBookingId(null);
    setShowCancellationSuccess(`Trip cancelled successfully. 100% refund of ₹${amount.toLocaleString("en-IN")} has been instantly credited to your BharatYatra Wallet.`);
    setTimeout(() => {
      setShowCancellationSuccess(null);
    }, 5000);
  };

  const handleSimulateWebCheckIn = (id: string) => {
    setShowWebCheckInSuccess(id);
    setTimeout(() => {
      setShowWebCheckInSuccess(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Unified My Trips & Vouchers</h2>
              <p className="text-xs text-slate-300">
                Manage all your Flights, Trains, Buses, Stays, and Yatra tickets in one place
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-slate-50">
          <div className="flex gap-2">
            {(
              [
                { id: "upcoming", label: "Upcoming & Active", count: bookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length },
                { id: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length },
                { id: "cancelled", label: "Cancelled & Refunds", count: bookings.filter((b) => b.status === "cancelled").length },
                { id: "all", label: "All Bookings", count: bookings.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAIDrawer}
            className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Trip Support</span>
          </button>
        </div>

        {/* Toast / Banner Messages */}
        {showCancellationSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{showCancellationSuccess}</span>
          </div>
        )}

        {showWebCheckInSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Web Check-in Successful! Boarding Pass barcode and seat assigned. E-ticket updated.</span>
          </div>
        )}

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No {activeTab} bookings found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You do not have any trips in this category yet. Explore Flights, Vande Bharat trains, and divine Yatra packages.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onSelectCategory("flights");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Explore Travel Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-indigo-300 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100">
                      {getServiceIcon(booking.serviceType)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {booking.serviceType}
                      </span>
                      {booking.pnr && (
                        <span className="text-xs text-slate-500 ml-2 font-mono">
                          PNR / Booking ID: <strong className="text-indigo-700">{booking.pnr}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs font-bold text-slate-900">
                      ₹{booking.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {booking.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{booking.subtitle}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.date}</span>
                      </div>
                      {booking.time && (
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{booking.time}</span>
                        </div>
                      )}
                      {booking.seatInfo && (
                        <div className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                          <span>{booking.seatInfo}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>{booking.passengers} Passenger{booking.passengers > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                    <button
                      onClick={() => setSelectedBookingForPass(booking)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Digital Ticket & QR</span>
                    </button>

                    {booking.status !== "cancelled" && (
                      <div className="flex items-center gap-2">
                        {booking.serviceType === "flights" && (
                          <button
                            onClick={() => handleSimulateWebCheckIn(booking.id)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-800 text-[11px] font-bold hover:bg-sky-100 transition-colors"
                          >
                            Web Check-in
                          </button>
                        )}
                        <button
                          onClick={() => setCancellingBookingId(booking.id)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-bold hover:bg-rose-100 transition-colors"
                        >
                          Cancel / Refund
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Trip Timeline (for upcoming) */}
                {(booking.status === "upcoming" || booking.status === "confirmed") && (
                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-3 rounded-b-2xl">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Trip Status: On Schedule
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">Invoice: {booking.invoiceNumber}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                      <div className="p-1 rounded bg-white border border-emerald-200 text-emerald-800 font-bold">
                        1. Confirmed
                      </div>
                      <div className="p-1 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                        2. Web Check-in
                      </div>
                      <div className="p-1 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                        3. Gate/Platform
                      </div>
                      <div className="p-1 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                        4. Completed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>IRCTC & DGCA 100% Instant Refund Protection Enabled</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>

      {/* Digital Boarding Pass / E-Ticket Popup */}
      {selectedBookingForPass && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 font-black">
                  BY
                </div>
                <div>
                  <h3 className="font-extrabold text-base">BharatYatra Digital Boarding Pass</h3>
                  <p className="text-[11px] text-slate-300 uppercase tracking-widest">
                    Authorized E-Ticket • {selectedBookingForPass.serviceType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForPass(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Details */}
            <div className="p-6 space-y-4 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Passenger Name</p>
                  <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">PNR / Reference</p>
                  <p className="text-sm font-mono font-extrabold text-indigo-700">
                    {selectedBookingForPass.pnr || "BY984210"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Service / Journey</p>
                <p className="text-base font-extrabold text-slate-900">{selectedBookingForPass.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{selectedBookingForPass.subtitle}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Date</p>
                  <p className="font-bold text-slate-800">{selectedBookingForPass.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Departure</p>
                  <p className="font-bold text-slate-800">{selectedBookingForPass.time || "06:00 AM"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Seat / Room</p>
                  <p className="font-bold text-indigo-700">{selectedBookingForPass.seatInfo || "Confirmed"}</p>
                </div>
              </div>

              {/* QR Code and Barcode Box */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 text-center flex flex-col items-center">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=BHARATYATRA_VERIFIED_PASS_PNR"
                    alt="Ticket QR Code"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-600 mt-2">
                  Scan at Airport Gate / Train TTE / Hotel Desk
                </p>
                <div className="w-full mt-2 h-6 bg-slate-200 rounded flex items-center justify-center font-mono text-[10px] text-slate-700 tracking-widest">
                  ||||| | |||| |||||| || | |||| |||||| ||||
                </div>
              </div>
            </div>

            {/* Ticket Actions */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    alert("Ticket PDF downloaded to your device.");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Cancel Booking & Instant Refund</h3>
                <p className="text-xs text-slate-500">100% Refund credited to BharatYatra Wallet</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Reason for cancellation</label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              >
                <option value="Change of travel plans">Change of travel plans</option>
                <option value="Medical emergency">Medical emergency</option>
                <option value="Found alternative train/flight">Found alternative train/flight</option>
                <option value="Incorrect date selected">Incorrect date selected</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex justify-between font-medium">
                <span>Original Fare:</span>
                <span>₹{bookings.find((b) => b.id === cancellingBookingId)?.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-medium text-emerald-700">
                <span>Cancellation Charges:</span>
                <span>₹0 (BharatYatra Free Cancel Policy)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-amber-200">
                <span>Total Refund Amount:</span>
                <span className="text-emerald-700">
                  ₹{bookings.find((b) => b.id === cancellingBookingId)?.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  const b = bookings.find((b) => b.id === cancellingBookingId);
                  if (b) handleConfirmCancel(b.id, b.amount);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
