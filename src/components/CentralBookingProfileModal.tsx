import React, { useState } from "react";
import {
  X,
  Plane,
  Train,
  Bus,
  Building2,
  Tent,
  Palmtree,
  Ship,
  Map,
  Landmark,
  Car,
  UtensilsCrossed,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  FileText,
  AlertCircle,
  Star,
  Phone,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Check,
} from "lucide-react";
import { COMPREHENSIVE_CENTRAL_BOOKINGS } from "../data/centralBookingsData";
import { BookingItem, TravelServiceType } from "../types";
import { ETicketQRCodeGenerator } from "./tickets/ETicketQRCodeGenerator";

interface CentralBookingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (service: TravelServiceType) => void;
}

export const CentralBookingProfileModal: React.FC<CentralBookingProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const [bookings, setBookings] = useState<BookingItem[]>(COMPREHENSIVE_CENTRAL_BOOKINGS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeStatusTab, setActiveStatusTab] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingItem | null>(null);

  // Sub-modals for rich actions
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<BookingItem | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingItem | null>(null);
  const [reviewModalBooking, setReviewModalBooking] = useState<BookingItem | null>(null);
  const [ticketModalBooking, setTicketModalBooking] = useState<BookingItem | null>(null);
  const [supportModalBooking, setSupportModalBooking] = useState<BookingItem | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  
  // Support form state
  const [supportIssue, setSupportIssue] = useState<string>("Boarding & Navigation Assistance");
  const [supportDesc, setSupportDesc] = useState<string>("");

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  if (!isOpen) return null;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesCat = activeCategory === "all" || b.serviceType === activeCategory;
    const matchesStatus =
      activeStatusTab === "all" ||
      (activeStatusTab === "confirmed" && (b.status === "confirmed" || b.status === "upcoming")) ||
      (activeStatusTab === "completed" && b.status === "completed") ||
      (activeStatusTab === "cancelled" && b.status === "cancelled");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      (b.pnr && b.pnr.toLowerCase().includes(query)) ||
      (b.bookingRef && b.bookingRef.toLowerCase().includes(query)) ||
      (b.provider && b.provider.toLowerCase().includes(query)) ||
      (b.fromLocation && b.fromLocation.toLowerCase().includes(query)) ||
      (b.toLocation && b.toLocation.toLowerCase().includes(query));

    return matchesCat && matchesStatus && matchesSearch;
  });

  const getServiceIcon = (service: TravelServiceType) => {
    switch (service) {
      case "flights": return <Plane className="w-4 h-4 text-sky-600" />;
      case "trains": return <Train className="w-4 h-4 text-emerald-600" />;
      case "buses": return <Bus className="w-4 h-4 text-orange-600" />;
      case "hotels": return <Building2 className="w-4 h-4 text-amber-600" />;
      case "lodges": return <Tent className="w-4 h-4 text-teal-600" />;
      case "resorts": return <Palmtree className="w-4 h-4 text-emerald-500" />;
      case "houseboats": return <Ship className="w-4 h-4 text-cyan-600" />;
      case "tours": return <Map className="w-4 h-4 text-indigo-600" />;
      case "pilgrimage": return <Landmark className="w-4 h-4 text-amber-700" />;
      case "cabs": return <Car className="w-4 h-4 text-yellow-600" />;
      case "dining": return <UtensilsCrossed className="w-4 h-4 text-rose-600" />;
      default: return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCancelBooking = (booking: BookingItem) => {
    const refundAmount = booking.cancellationDetails?.refundableAmount || booking.amount;
    const updated = bookings.map((b) =>
      b.id === booking.id
        ? {
            ...b,
            status: "cancelled" as const,
            cancellationDetails: {
              ...(b.cancellationDetails || {
                isEligible: true,
                cancellationPolicyRule: "Standard Policy",
                cancellationFee: 0,
                refundableAmount: booking.amount,
                refundStatus: "REFUND_PROCESSED_WALLET",
              }),
              refundStatus: "REFUND_PROCESSED_WALLET" as const,
              refundReference: `WAL-RFD-${Date.now().toString().slice(-6)}`,
            },
          }
        : b
    );

    setBookings(updated);
    setCancelModalBooking(null);
    setToastMessage({
      text: `Booking ${booking.pnr || booking.id} cancelled. ₹${refundAmount.toLocaleString("en-IN")} credited instantly to BharatYatra Wallet.`,
      type: "success",
    });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    setToastMessage({
      text: `Thank you for rating ${reviewModalBooking.provider}! 50 YatraCoins added to your wallet.`,
      type: "success",
    });
    setReviewModalBooking(null);
    setReviewRating(5);
    setReviewText("");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportModalBooking) return;

    const tktId = `SOS-${Date.now().toString().slice(-5)}`;
    setToastMessage({
      text: `Emergency ticket ${tktId} assigned to 24x7 Duty Officer. SLA response: <5 mins.`,
      type: "success",
    });
    setSupportModalBooking(null);
    setSupportDesc("");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-400 font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Central Booking Profile
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-400 text-slate-900">
                  <ShieldCheck className="w-3 h-3" /> Unified Travel Gateway
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Single customer record across all 11 travel, stay, yatra, cab & dining services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-medium text-slate-200 border border-white/10">
              <span>Customer:</span>
              <strong className="text-white">Aditya Sharma (+91 98765 43210)</strong>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {toastMessage && (
          <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-medium flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Global Universal Search Bar & Status Tabs */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Universal PNR, Booking ID, Route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveStatusTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusTab === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              All Records ({bookings.length})
            </button>
            <button
              onClick={() => setActiveStatusTab("confirmed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusTab === "confirmed"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Upcoming & Confirmed
            </button>
            <button
              onClick={() => setActiveStatusTab("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusTab === "completed"
                  ? "bg-slate-700 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveStatusTab("cancelled")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStatusTab === "cancelled"
                  ? "bg-red-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Cancelled & Refunded
            </button>
          </div>
        </div>

        {/* 11-Category Service Filter Chips */}
        <div className="px-6 py-2.5 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === "all"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Services ({bookings.length})
          </button>
          {[
            { id: "flights", label: "Flights", icon: Plane },
            { id: "trains", label: "Trains (IRCTC)", icon: Train },
            { id: "buses", label: "Buses", icon: Bus },
            { id: "hotels", label: "Hotels", icon: Building2 },
            { id: "lodges", label: "Lodges", icon: Tent },
            { id: "resorts", label: "Resorts", icon: Palmtree },
            { id: "houseboats", label: "Houseboats", icon: Ship },
            { id: "tours", label: "Tours", icon: Map },
            { id: "pilgrimage", label: "Yatras", icon: Landmark },
            { id: "cabs", label: "Cabs", icon: Car },
            { id: "dining", label: "Dining", icon: UtensilsCrossed },
          ].map((cat) => {
            const count = bookings.filter((b) => b.serviceType === cat.id).length;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Bookings List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No bookings found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching the category filter or searching for another PNR / booking reference.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isUpcoming = booking.status === "confirmed" || booking.status === "upcoming";
              const isCancelled = booking.status === "cancelled";

              return (
                <div
                  key={booking.id}
                  className={`p-5 rounded-2xl bg-white border transition-all space-y-4 shadow-sm hover:shadow-md ${
                    isCancelled
                      ? "border-red-200 bg-red-50/10"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        {getServiceIcon(booking.serviceType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">
                            {booking.title}
                          </span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            PNR: {booking.pnr || booking.bookingRef}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-orange-100 text-orange-800">
                            {booking.serviceType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {booking.provider} • {booking.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCancelled
                            ? "bg-red-100 text-red-800"
                            : isUpcoming
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        ₹{(booking.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Core Travel Manifest & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-medium uppercase">
                        Travel / Check-in Date
                      </span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        {booking.date} {booking.returnDate ? `➔ ${booking.returnDate}` : ""}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Time: {booking.time}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-medium uppercase">
                        Passenger & Berth / Room Info
                      </span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        {booking.passengers || 1} Traveler(s)
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                        {booking.seatInfo || booking.seatOrRoomInfo || "Assigned"}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-medium uppercase">
                        Boarding Station / Pickup
                      </span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{booking.fromLocation || booking.pickupAddress || "Terminal Desk"}</span>
                      </div>
                      {booking.terminalOrPlatformOrJetty && (
                        <div className="text-[11px] text-orange-600 font-medium truncate mt-0.5">
                          {booking.terminalOrPlatformOrJetty}
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-medium uppercase">
                        Payment & Invoice
                      </span>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                        {booking.paymentSummary?.paymentMode || "UPI"} • PAID
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {booking.invoiceNumber || "INV-2026"}
                      </div>
                    </div>
                  </div>

                  {/* Passenger Names List */}
                  {booking.passengerDetailsList && booking.passengerDetailsList.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Traveler Manifest ({booking.passengerDetailsList.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {booking.passengerDetailsList.map((pax, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-medium flex items-center gap-1.5"
                          >
                            <strong>{pax.name}</strong> ({pax.gender}, {pax.age}y)
                            {pax.seatNumber && (
                              <span className="text-orange-600 font-semibold">• {pax.seatNumber}</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Operational Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* View Boarding Pass & QR */}
                      <button
                        onClick={() => setTicketModalBooking(booking)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Digital Boarding Pass
                      </button>

                      {/* GST Tax Invoice */}
                      <button
                        onClick={() => setInvoiceModalBooking(booking)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        GST Tax Invoice
                      </button>

                      {/* Review & Feedback */}
                      <button
                        onClick={() => setReviewModalBooking(booking)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        Rate Experience
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Emergency Helpdesk */}
                      <button
                        onClick={() => setSupportModalBooking(booking)}
                        className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                        24x7 Help
                      </button>

                      {/* Self-Service Cancellation */}
                      {isUpcoming && (
                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Cancel & Instant Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SUB-MODAL 1: DIGITAL BOARDING PASS & QR VOUCHER */}
        {ticketModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-orange-100 text-orange-700">
                    {getServiceIcon(ticketModalBooking.serviceType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Digital Travel Boarding Pass
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      PNR: {ticketModalBooking.pnr}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setTicketModalBooking(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <ETicketQRCodeGenerator
                  booking={ticketModalBooking}
                  size={140}
                  showDetails={true}
                  showQuickVerifyButton={true}
                />
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Service / Carrier:</span>
                  <strong className="text-slate-900">{ticketModalBooking.provider}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Route:</span>
                  <strong className="text-slate-900">{ticketModalBooking.title}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Travel Date & Time:</span>
                  <strong className="text-slate-900">{ticketModalBooking.date} at {ticketModalBooking.time}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Seat / Berth / Cabin:</span>
                  <strong className="text-orange-600">{ticketModalBooking.seatInfo || "Assigned"}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setTicketModalBooking(null);
                  setToastMessage({ text: "E-Ticket saved to device wallet.", type: "success" });
                }}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF Boarding Pass
              </button>
            </div>
          </div>
        )}

        {/* SUB-MODAL 2: DIGITAL GST TAX INVOICE */}
        {invoiceModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Tax Invoice (GST Reg: 07AAACB4410R1ZP)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Invoice #{invoiceModalBooking.invoiceNumber || "INV-2026-001"}
                  </span>
                </div>
                <button
                  onClick={() => setInvoiceModalBooking(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between">
                    <span>Legal Entity:</span>
                    <strong className="text-slate-900">
                      {invoiceModalBooking.gstInvoice?.legalEntity || "BharatYatra Travel & Mobility Technologies Ltd"}
                    </strong>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>GST SAC Classification:</span>
                    <span className="font-mono text-slate-800">
                      {invoiceModalBooking.gstInvoice?.sacCode || "996411 (Passenger Road Transport)"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxable Service Value:</span>
                    <span className="font-semibold">
                      ₹{(invoiceModalBooking.gstInvoice?.taxableAmount || Math.round(invoiceModalBooking.amount * 0.88)).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGST (2.5%):</span>
                    <span className="font-semibold">
                      ₹{(invoiceModalBooking.gstInvoice?.cgst || Math.round(invoiceModalBooking.amount * 0.025)).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SGST (2.5%):</span>
                    <span className="font-semibold">
                      ₹{(invoiceModalBooking.gstInvoice?.sgst || Math.round(invoiceModalBooking.amount * 0.025)).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platform Convenience Fee:</span>
                    <span className="font-semibold">₹49</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                    <span>Total Amount Paid:</span>
                    <span className="text-emerald-700">
                      ₹{invoiceModalBooking.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setInvoiceModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setInvoiceModalBooking(null);
                    setToastMessage({ text: "GST Invoice PDF downloaded successfully.", type: "success" });
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download GST Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL 3: INSTANT CANCELLATION & WALLET REFUND */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-sm text-slate-900">
                  Cancel Booking & Instant Refund
                </h3>
              </div>

              <p className="text-xs text-slate-600">
                Are you sure you want to cancel booking <strong className="text-slate-900">{cancelModalBooking.pnr}</strong> ({cancelModalBooking.title})?
              </p>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Total Booking Amount:</span>
                  <span className="font-semibold">₹{cancelModalBooking.amount}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Cancellation Fee:</span>
                  <span className="font-semibold text-red-700">
                    ₹{cancelModalBooking.cancellationDetails?.cancellationFee || 0}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-emerald-800 pt-2 border-t border-red-200">
                  <span>Instant Wallet Refund:</span>
                  <span>
                    ₹{(cancelModalBooking.cancellationDetails?.refundableAmount || cancelModalBooking.amount).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Policy: {cancelModalBooking.cancellationDetails?.cancellationPolicyRule || "100% full refund eligible."}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(cancelModalBooking)}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL 4: RATING & SERVICE REVIEW */}
        {reviewModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <form
              onSubmit={handleSubmitReview}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">
                  Rate your trip with {reviewModalBooking.provider}
                </h3>
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Star Selector */}
              <div className="text-center space-y-2">
                <span className="text-xs text-slate-500">Overall Rating</span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl transition-all hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Share your experience (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Punctuality, seat cleanliness, driver courteousness..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Submit Review (+50 Coins)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SUB-MODAL 5: 24x7 GRIEVANCE & EMERGENCY HELP */}
        {supportModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <form
              onSubmit={handleSubmitSupport}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    24x7 Travel Command Desk
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSupportModalBooking(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-950">
                Direct Operator Helpline:{" "}
                <strong className="font-bold text-orange-900">
                  {supportModalBooking.supportContactPhone || "1800 102 9988"}
                </strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nature of Assistance
                </label>
                <select
                  value={supportIssue}
                  onChange={(e) => setSupportIssue(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900"
                >
                  <option value="Boarding & Navigation Assistance">Boarding & Navigation Assistance</option>
                  <option value="Delay & Live Tracking Query">Delay & Live Tracking Query</option>
                  <option value="Driver / Staff Escalation">Driver / Staff Escalation</option>
                  <option value="Luggage & Lost Property">Luggage & Lost Property</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  value={supportDesc}
                  onChange={(e) => setSupportDesc(e.target.value)}
                  placeholder="Describe your query..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSupportModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Dispatch Priority Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              All booking transactions are escrow-secured under BharatYatra Unified Passenger Protection
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer transition-all"
          >
            Close Booking Profile
          </button>
        </div>
      </div>
    </div>
  );
};
