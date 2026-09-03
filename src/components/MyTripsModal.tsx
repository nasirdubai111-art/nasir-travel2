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
  Check,
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
  BadgeCheck,
  Receipt,
  Copy,
  Loader2,
  Eye,
  CalendarDays,
  List,
  FileSpreadsheet,
  ArrowDownToLine,
  Luggage,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { BookingItem, ServiceCategory, UserProfile } from "../types";
import { downloadBookingInvoicePDF, computeBookingTaxBreakdown } from "../utils/invoicePdfGenerator";
import { downloadCorporateExpenseCSV } from "../utils/csvExpenseExporter";
import { DynamicQRCode } from "./DynamicQRCode";
import { ETicketQRCodeGenerator } from "./tickets/ETicketQRCodeGenerator";
import { TripsCalendarView, parseBookingDate } from "./TripsCalendarView";
import { ExpenseReconciliationModal } from "./ExpenseReconciliationModal";
import { QRScannerModal } from "./QRScannerModal";
import { PackingChecklistModal } from "./PackingChecklistModal";

export type TripSortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

/**
 * Derives a deterministic unique Transaction ID for a booking for audit and compliance.
 */
export function getBookingTransactionId(b: BookingItem): string {
  if (b.paymentSummary?.transactionId) return b.paymentSummary.transactionId;
  if (b.paymentSummary?.transactionRef) return b.paymentSummary.transactionRef;
  const hash = Math.abs(
    b.id.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(36).toUpperCase().padStart(6, "0");
  const suffix = b.id.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();
  return `TXN-BY26-${hash.slice(0, 4)}-${suffix || "8821"}`;
}

/**
 * Derives a unique RBI Reference Number (RRN) for digital payment settlement.
 */
export function getBookingRbiRrn(b: BookingItem): string {
  if (b.paymentSummary?.rbiRrn) return b.paymentSummary.rbiRrn;
  const numHash = Math.abs(
    b.id.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 100000000, 48291047)
  );
  return `6238${numHash.toString().padStart(8, "0")}`;
}

/**
 * Converts Indian Rupee amounts into formalized words for official GST tax invoice compliance.
 */
export function formatRupeesInWords(amount: number): string {
  if (amount <= 0) return "Zero Rupees Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const numToWords = (n: number): string => {
    let out = "";
    if (n >= 100) {
      out += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      out += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      out += ones[n] + " ";
    }
    return out.trim();
  };

  let num = Math.floor(amount);
  let words = "";

  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    words += numToWords(crore) + " Crore ";
    num %= 10000000;
  }
  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    words += numToWords(lakh) + " Lakh ";
    num %= 100000;
  }
  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    words += numToWords(thousand) + " Thousand ";
    num %= 1000;
  }
  if (num > 0) {
    words += numToWords(num) + " ";
  }

  return words.trim() + " Rupees Only";
}

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
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<BookingItem | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<BookingItem | null>(null);
  const [selectedBookingForChecklist, setSelectedBookingForChecklist] = useState<BookingItem | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("Change of travel plans");
  const [showCancellationSuccess, setShowCancellationSuccess] = useState<string | null>(null);
  const [showWebCheckInSuccess, setShowWebCheckInSuccess] = useState<string | null>(null);
  const [showInvoiceDownloadSuccess, setShowInvoiceDownloadSuccess] = useState<string | null>(null);
  const [showCsvExportSuccess, setShowCsvExportSuccess] = useState<string | null>(null);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null);
  const [copiedInvoiceId, setCopiedInvoiceId] = useState(false);
  const [copiedTxnId, setCopiedTxnId] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<TripSortOption>("date-desc");

  if (!isOpen) return null;

  const handleStatusFilterChange = (val: string) => {
    setSelectedStatusFilter(val);
    if (val === "cancelled") {
      setActiveTab("cancelled");
    } else if (val === "completed") {
      setActiveTab("completed");
    } else if (val === "upcoming" || val === "confirmed") {
      setActiveTab("upcoming");
    } else if (val === "all") {
      setActiveTab("all");
    }
  };

  // Filter bookings by status, service type, and PNR / destination city / route / provider
  const searchFilteredBookings = bookings.filter((b) => {
    // 1. Status dropdown filter
    if (selectedStatusFilter !== "all") {
      if (selectedStatusFilter === "confirmed" && b.status !== "confirmed") return false;
      if (selectedStatusFilter === "upcoming" && b.status !== "upcoming") return false;
      if (selectedStatusFilter === "completed" && b.status !== "completed") return false;
      if (selectedStatusFilter === "cancelled" && b.status !== "cancelled") return false;
    }

    // 2. Service Type dropdown filter
    if (selectedServiceFilter !== "all") {
      const matchService =
        b.serviceType === selectedServiceFilter ||
        b.serviceCategory === selectedServiceFilter ||
        (selectedServiceFilter === "hotels" && ["hotels", "resorts", "lodges"].includes(b.serviceType || ""));
      if (!matchService) return false;
    }

    // 3. Text Search Query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();

    // Check PNR / Booking ID / Invoice Number
    const pnrStr = (b.pnr || "").toLowerCase();
    const idStr = (b.id || "").toLowerCase();
    const invoiceStr = (b.invoiceNumber || "").toLowerCase();
    if (pnrStr.includes(q) || idStr.includes(q) || invoiceStr.includes(q)) {
      return true;
    }

    // Check Service Type & Category & natural synonyms
    const sType = (b.serviceType || "").toLowerCase();
    const sCat = (b.serviceCategory || "").toLowerCase();
    if (sType.includes(q) || sCat.includes(q)) {
      return true;
    }
    if (q.includes("flight") || q.includes("plane") || q.includes("air") || q.includes("indigo") || q.includes("air india")) {
      if (sType === "flights" || sCat === "flights") return true;
    }
    if (q.includes("train") || q.includes("rail") || q.includes("irctc") || q.includes("vande bharat")) {
      if (sType === "trains" || sCat === "trains") return true;
    }
    if (q.includes("bus") || q.includes("volvo") || q.includes("coach") || q.includes("ksrtc") || q.includes("redbus")) {
      if (sType === "buses" || sCat === "buses") return true;
    }
    if (q.includes("hotel") || q.includes("stay") || q.includes("resort") || q.includes("lodge") || q.includes("room") || q.includes("haveli")) {
      if (["hotels", "resorts", "lodges"].includes(sType) || ["hotels", "resorts", "lodges"].includes(sCat)) return true;
    }
    if (q.includes("houseboat") || q.includes("boat") || q.includes("cruise") || q.includes("shikara")) {
      if (sType === "houseboats" || sCat === "houseboats") return true;
    }
    if (q.includes("yatra") || q.includes("pilgrim") || q.includes("darshan") || q.includes("temple")) {
      if (sType === "pilgrimage" || sCat === "pilgrimage") return true;
    }
    if (q.includes("tour") || q.includes("sightseeing") || q.includes("package")) {
      if (sType === "tours" || sCat === "tours") return true;
    }
    if (q.includes("cab") || q.includes("taxi") || q.includes("car")) {
      if (sType === "cabs" || sCat === "cabs") return true;
    }

    // Check Destination City / Origin / Route / Title / Subtitle / Provider
    const toLoc = (b.toLocation || "").toLowerCase();
    const fromLoc = (b.fromLocation || "").toLowerCase();
    const route = (b.route || "").toLowerCase();
    const title = (b.title || "").toLowerCase();
    const subtitle = (b.subtitle || "").toLowerCase();
    const provider = (b.provider || "").toLowerCase();

    if (
      toLoc.includes(q) ||
      fromLoc.includes(q) ||
      route.includes(q) ||
      title.includes(q) ||
      subtitle.includes(q) ||
      provider.includes(q)
    ) {
      return true;
    }

    return false;
  });

  const filteredBookings = searchFilteredBookings.filter((b) => {
    if (selectedStatusFilter !== "all") {
      return true;
    }
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return b.status === "upcoming" || b.status === "confirmed";
    return b.status === activeTab;
  });

  // Accurate timestamp resolution including departure/service time
  const getBookingTimestamp = (b: BookingItem): number => {
    const d = parseBookingDate(b.date);
    if (!d) return 0;
    let timeMs = d.getTime();
    if (b.time) {
      const timeMatch = b.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = timeMatch[3]?.toUpperCase();
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        timeMs += (hours * 3600 + minutes * 60) * 1000;
      }
    }
    return timeMs;
  };

  const getBookingAmount = (b: BookingItem): number => {
    return Number(b.amount ?? b.amountPaid ?? 0);
  };

  // Sort list by date (newest/oldest) or amount (high to low / low to high)
  const sortBookingsList = (list: BookingItem[]): BookingItem[] => {
    return [...list].sort((a, b) => {
      if (sortBy === "date-desc") {
        const diff = getBookingTimestamp(b) - getBookingTimestamp(a);
        if (diff !== 0) return diff;
        return getBookingAmount(b) - getBookingAmount(a);
      }
      if (sortBy === "date-asc") {
        const diff = getBookingTimestamp(a) - getBookingTimestamp(b);
        if (diff !== 0) return diff;
        return getBookingAmount(a) - getBookingAmount(b);
      }
      if (sortBy === "amount-desc") {
        const diff = getBookingAmount(b) - getBookingAmount(a);
        if (diff !== 0) return diff;
        return getBookingTimestamp(b) - getBookingTimestamp(a);
      }
      if (sortBy === "amount-asc") {
        const diff = getBookingAmount(a) - getBookingAmount(b);
        if (diff !== 0) return diff;
        return getBookingTimestamp(b) - getBookingTimestamp(a);
      }
      return 0;
    });
  };

  const sortedBookings = sortBookingsList(filteredBookings);
  const sortedSearchFilteredBookings = sortBookingsList(searchFilteredBookings);

  // Quick filter suggestion tags
  const quickFilterSuggestions: Array<{
    label: string;
    value: string;
    kind: "service" | "status" | "city" | "sort";
  }> = [
    { label: "✈️ Flights", value: "flights", kind: "service" },
    { label: "🚆 Trains", value: "trains", kind: "service" },
    { label: "🏨 Hotels", value: "hotels", kind: "service" },
    { label: "🟢 Confirmed", value: "confirmed", kind: "status" },
    { label: "🔵 Upcoming", value: "upcoming", kind: "status" },
    { label: "🔴 Cancelled", value: "cancelled", kind: "status" },
    { label: "💰 High to Low", value: "amount-desc", kind: "sort" },
    { label: "📍 Mumbai", value: "Mumbai", kind: "city" },
    { label: "📍 Varanasi", value: "Varanasi", kind: "city" },
  ];

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

  const handleDownloadInvoice = async (booking: BookingItem) => {
    const pnr = booking.pnr || "BY-" + booking.id.slice(-6).toUpperCase();
    const invoiceNum = booking.invoiceNumber || `INV-2026-${booking.id.slice(-4).toUpperCase()}`;
    
    try {
      setGeneratingInvoiceId(booking.id);
      const filename = await downloadBookingInvoicePDF(booking, userProfile);
      setShowInvoiceDownloadSuccess(`Official Tax Invoice PDF (${filename}) downloaded successfully for PNR ${pnr}.`);
      setTimeout(() => {
        setShowInvoiceDownloadSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("PDF generation via canvas error, executing fallback formatted download:", err);
      handleDownloadStructuredPDF(booking);
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  const handleDownloadStructuredPDF = (booking: BookingItem) => {
    const pnr = booking.pnr || "BY-" + booking.id.slice(-6);
    const invoiceNum = booking.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseTariff = Math.round((booking.amount || 0) * 0.88);
    const cgst = Math.round((booking.amount || 0) * 0.06);
    const sgst = Math.round((booking.amount || 0) * 0.06);
    const dateIssued = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tax Invoice & Booking Summary - ${pnr}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      padding: 30px;
    }
    .invoice-wrapper {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      line-height: 1.5;
    }
    .invoice-tag {
      text-align: right;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: 800;
      color: #4338ca;
      letter-spacing: -0.5px;
    }
    .invoice-subline {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
      font-family: ui-monospace, monospace;
    }
    .section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .card-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      font-size: 12px;
      line-height: 1.6;
    }
    .card-heading {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .data-table th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .totals-box {
      margin-left: auto;
      width: 340px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px;
      font-size: 12px;
      margin-bottom: 24px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      color: #475569;
    }
    .totals-grand {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      border-top: 2px solid #0f172a;
      padding-top: 10px;
      margin-top: 10px;
    }
    .stamp-box {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 12px;
      color: #166534;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .verified-seal {
      font-weight: 800;
      border: 2px dashed #16a34a;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 11px;
      background: #dcfce7;
      text-transform: uppercase;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 18px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1.5;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .invoice-wrapper { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="header">
      <div>
        <div class="brand-title">🇮🇳 BharatYatra SuperApp</div>
        <div class="brand-meta">
          <strong>BharatYatra Travel & Mobility Technologies Private Limited</strong><br />
          Corporate HQ: Level 7, DLF Cyber City, Gurugram, Haryana - 122002<br />
          GSTIN: <strong>07AAACB4410R1ZP</strong> • CIN: U63040DL2024PTC129481<br />
          SAC Code: <strong>996411</strong> (Passenger Road / Rail / Air Mobility)
        </div>
      </div>
      <div class="invoice-tag">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-subline"><strong>Invoice No:</strong> ${invoiceNum}</div>
        <div class="invoice-subline"><strong>Date of Issue:</strong> ${dateIssued}</div>
        <div class="invoice-subline"><strong>PNR / Ref:</strong> ${pnr}</div>
      </div>
    </div>

    <div class="section-grid">
      <div class="card-box">
        <div class="card-heading">Billed To (Passenger / Customer)</div>
        <div><strong>Name:</strong> ${userProfile.name}</div>
        <div><strong>Mobile:</strong> ${userProfile.phone}</div>
        <div><strong>Email:</strong> ${userProfile.email}</div>
        <div><strong>KYC Status:</strong> Aadhaar / DigiLocker Verified Profile</div>
        <div><strong>Place of Supply:</strong> India (State Code: 07)</div>
      </div>

      <div class="card-box">
        <div class="card-heading">Booking & Itinerary Summary</div>
        <div><strong>Category:</strong> ${(booking.serviceType || "").toUpperCase()}</div>
        <div><strong>Service / Item:</strong> ${booking.title}</div>
        <div><strong>Details:</strong> ${booking.subtitle || ""}</div>
        <div><strong>Date & Time:</strong> ${booking.date} ${booking.time ? `• ${booking.time}` : ""}</div>
        <div><strong>Berth / Seat:</strong> ${booking.seatInfo || "Confirmed"} (${booking.passengers || 1} Passenger${(booking.passengers || 1) > 1 ? "s" : ""})</div>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Service Item & Description</th>
          <th>SAC / HSN</th>
          <th>Units</th>
          <th style="text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${booking.title}</strong><br />
            <span style="font-size: 11px; color: #64748b;">${booking.subtitle || ""} • PNR: ${pnr}</span>
          </td>
          <td>996411</td>
          <td>${booking.passengers || 1} Pax</td>
          <td style="text-align: right; font-weight: 700;">₹${baseTariff.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td>
            <strong>Passenger Insurance & IRDAI Safety Surcharge</strong><br />
            <span style="font-size: 11px; color: #64748b;">Comprehensive travel & baggage protection</span>
          </td>
          <td>997132</td>
          <td>${booking.passengers || 1} Pax</td>
          <td style="text-align: right; font-weight: 700;">₹0 (Complimentary)</td>
        </tr>
        <tr>
          <td>
            <strong>Platform Facilitation & UPI Processing</strong><br />
            <span style="font-size: 11px; color: #64748b;">Escrow security & 24/7 AI helpline guarantee</span>
          </td>
          <td>998311</td>
          <td>1 Session</td>
          <td style="text-align: right; font-weight: 700;">₹0 (Zero Fee)</td>
        </tr>
      </tbody>
    </table>

    <div class="totals-box">
      <div class="totals-row">
        <span>Taxable Value:</span>
        <strong style="color: #0f172a;">₹${baseTariff.toLocaleString("en-IN")}</strong>
      </div>
      <div class="totals-row">
        <span>Central GST (CGST @ 6%):</span>
        <strong style="color: #0f172a;">₹${cgst.toLocaleString("en-IN")}</strong>
      </div>
      <div class="totals-row">
        <span>State GST (SGST @ 6%):</span>
        <strong style="color: #0f172a;">₹${sgst.toLocaleString("en-IN")}</strong>
      </div>
      <div class="totals-grand">
        <span>Total Gross Paid:</span>
        <span style="color: #15803d;">₹${(booking.amount || 0).toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div class="stamp-box">
      <div>
        <strong>Payment Status:</strong> 100% VERIFIED &amp; SETTLED<br />
        <span style="font-size: 11px; color: #15803d;">
          RBI RRN: 623849182391 • Payment Gateway: Escrow Secured • Auth Stamp: AUTH-${pnr}
        </span>
      </div>
      <div class="verified-seal">✓ DIGITALLY AUTHENTICATED</div>
    </div>

    <div class="footer">
      <div>
        This is an official computer-generated document under Section 31 of CGST Act, 2017.<br />
        No physical signature required. Valid for statutory input tax credit (ITC).
      </div>
      <div style="text-align: right;">
        <strong>BharatYatra 24x7 Support</strong><br />
        support@bharatyatra.in • Helpline: 1800-200-YATRA
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tax_Invoice_${pnr}_BharatYatra.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

  const handleQuickCsvExport = () => {
    const listToExport = activeTab === "all" ? sortedSearchFilteredBookings : sortedBookings;
    const res = downloadCorporateExpenseCSV(listToExport, userProfile, {
      filterName: activeTab !== "all" ? activeTab : undefined,
    });
    setShowCsvExportSuccess(
      `Exported ${res.count} transactions (₹${res.totalAmount.toLocaleString("en-IN")}) to ${res.filename} for corporate reconciliation.`
    );
    setTimeout(() => {
      setShowCsvExportSuccess(null);
    }, 5000);
  };

  const handleDownloadPrintTicket = (booking: BookingItem) => {
    setSelectedBookingForPass(booking);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className={`${selectedBookingForPass || selectedBookingForInvoice ? "no-print" : ""} fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200`}>
      <div className={`${selectedBookingForPass || selectedBookingForInvoice ? "no-print" : ""} bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]`}>
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

        {/* Top Search Input Filter: PNR, Status, Service Type, or Destination City */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-3 text-white">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="my-trips-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookings by PNR (e.g. 6E-NX98Q2), service type, or destination city..."
                className="w-full pl-10 pr-9 py-2 bg-slate-800 text-white placeholder-slate-400 rounded-xl text-xs sm:text-sm border border-slate-700/80 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filters Group: Status & Service */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Status Dropdown Filter */}
              <div className="relative">
                <select
                  id="my-trips-status-dropdown"
                  value={selectedStatusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  aria-label="Filter by booking status"
                  className="appearance-none bg-slate-800 text-white border border-slate-700/80 rounded-xl px-3 py-2 pr-8 text-xs font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-inner hover:border-slate-600 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">🟢 Confirmed</option>
                  <option value="upcoming">🔵 Upcoming</option>
                  <option value="completed">🟣 Completed</option>
                  <option value="cancelled">🔴 Cancelled</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Service Type Dropdown Selector */}
              <div className="relative">
                <select
                  id="my-trips-service-dropdown"
                  value={selectedServiceFilter}
                  onChange={(e) => setSelectedServiceFilter(e.target.value)}
                  aria-label="Filter by service type"
                  className="appearance-none bg-slate-800 text-white border border-slate-700/80 rounded-xl px-3 py-2 pr-8 text-xs font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-inner hover:border-slate-600 transition-colors"
                >
                  <option value="all">All Services</option>
                  <option value="flights">✈️ Flights</option>
                  <option value="trains">🚆 Trains</option>
                  <option value="buses">🚌 Buses</option>
                  <option value="hotels">🏨 Hotels & Stays</option>
                  <option value="houseboats">🛥️ Houseboats</option>
                  <option value="pilgrimage">🛕 Pilgrimages & Yatras</option>
                  <option value="tours">🗺️ Tours & Activities</option>
                  <option value="cabs">🚕 Cabs & Transfers</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By Dropdown Selector */}
              <div className="relative">
                <select
                  id="my-trips-sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as TripSortOption)}
                  aria-label="Sort bookings by date or amount"
                  className="appearance-none bg-slate-800 text-white border border-slate-700/80 rounded-xl px-3 py-2 pr-8 text-xs font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer shadow-inner hover:border-slate-600 transition-colors"
                >
                  <option value="date-desc">📅 Date: Newest first</option>
                  <option value="date-asc">📅 Date: Oldest first</option>
                  <option value="amount-desc">💰 Amount: High to Low</option>
                  <option value="amount-asc">💰 Amount: Low to High</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {(searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc") && (
                <button
                  id="my-trips-reset-filters-btn"
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedServiceFilter("all");
                    setSelectedStatusFilter("all");
                    setSortBy("date-desc");
                    setActiveTab("all");
                  }}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                  title="Reset all search, status, service filters and sorting"
                >
                  <X className="w-3 h-3 text-slate-400" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Suggestion Chips & Match Count */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-slate-400">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Filter className="w-3 h-3 text-indigo-400" />
              <span>Quick filters:</span>
            </span>

            {quickFilterSuggestions.map((tag) => {
              const isSelected =
                (tag.kind === "service" && selectedServiceFilter === tag.value) ||
                (tag.kind === "status" && selectedStatusFilter === tag.value) ||
                (tag.kind === "sort" && sortBy === tag.value) ||
                (tag.kind === "city" && searchQuery.toLowerCase() === tag.value.toLowerCase());

              return (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => {
                    if (tag.kind === "service") {
                      setSelectedServiceFilter(selectedServiceFilter === tag.value ? "all" : tag.value);
                    } else if (tag.kind === "status") {
                      if (selectedStatusFilter === tag.value) {
                        handleStatusFilterChange("all");
                      } else {
                        handleStatusFilterChange(tag.value);
                      }
                    } else if (tag.kind === "sort") {
                      setSortBy(sortBy === tag.value ? "date-desc" : (tag.value as TripSortOption));
                    } else {
                      setSearchQuery(searchQuery.toLowerCase() === tag.value.toLowerCase() ? "" : tag.value);
                    }
                  }}
                  className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-xs"
                      : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600"
                  }`}
                >
                  <span>{tag.label}</span>
                </button>
              );
            })}

            {(searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc") && (
              <div className="ml-auto flex items-center gap-1.5">
                {sortBy !== "date-desc" && (
                  <span className="text-amber-300 font-semibold bg-amber-950/80 border border-amber-800/70 px-2 py-0.5 rounded-md text-[10px] tracking-wide flex items-center gap-1">
                    <ArrowUpDown className="w-2.5 h-2.5" />
                    <span>
                      {sortBy === "date-asc"
                        ? "Oldest First"
                        : sortBy === "amount-desc"
                        ? "Amount: High to Low"
                        : "Amount: Low to High"}
                    </span>
                  </span>
                )}
                <span className="text-indigo-300 font-semibold bg-indigo-950/80 border border-indigo-800/70 px-2.5 py-0.5 rounded-md text-[10px] tracking-wide">
                  {sortedBookings.length} matching {sortedBookings.length === 1 ? "booking" : "bookings"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection & View Switcher */}
        <div className="flex flex-wrap items-center justify-between px-6 border-b border-slate-200 bg-slate-50 gap-2">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto py-1 sm:py-0">
            {(
              [
                { id: "upcoming", label: "Upcoming & Active", count: searchFilteredBookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length },
                { id: "completed", label: "Completed", count: searchFilteredBookings.filter((b) => b.status === "completed").length },
                { id: "cancelled", label: "Cancelled & Refunds", count: searchFilteredBookings.filter((b) => b.status === "cancelled").length },
                { id: "all", label: "All Bookings", count: searchFilteredBookings.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (selectedStatusFilter !== "all") {
                    if (tab.id === "cancelled" && selectedStatusFilter !== "cancelled") {
                      setSelectedStatusFilter("all");
                    } else if (tab.id === "completed" && selectedStatusFilter !== "completed") {
                      setSelectedStatusFilter("all");
                    } else if (tab.id === "upcoming" && selectedStatusFilter !== "upcoming" && selectedStatusFilter !== "confirmed") {
                      setSelectedStatusFilter("all");
                    } else if (tab.id === "all") {
                      setSelectedStatusFilter("all");
                    }
                  }
                }}
                className={`py-3 px-2 sm:px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
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

          <div className="flex items-center gap-2 py-2">
            {/* Travel Packing Checklist Hub Button */}
            <button
              onClick={() => {
                const upcoming = bookings.find((b) => b.status === "upcoming" || b.status === "confirmed") || bookings[0];
                if (upcoming) {
                  setSelectedBookingForChecklist(upcoming);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300/80 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Interactive Category-Based Travel Packing Checklist for upcoming confirmed bookings"
            >
              <Luggage className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Packing Checklist</span>
              <span className="sm:hidden">Pack</span>
            </button>

            {/* Terminal QR Code Ticket Scanner & Validator Button */}
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300/80 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Scan and validate e-tickets or boarding passes at terminal gates using live camera, photo, or manual PNR"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Scan Ticket QR</span>
              <span className="sm:hidden">Scan QR</span>
            </button>

            {/* Corporate Expense Reconciliation & CSV Export Button */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Export booking history to CSV with statutory GST, SAC codes & cost centers for expense reconciliation"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Export Expense CSV</span>
              <span className="sm:hidden">Expense CSV</span>
            </button>

            {/* View Mode Toggle: List vs Calendar */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/60 shadow-2xs">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Calendar & Chronological Travel Schedule"
              >
                <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                <span>Calendar &amp; Schedule</span>
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Standard Card List View"
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>

            <button
              onClick={onOpenAIDrawer}
              className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline px-2 py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Trip Support</span>
            </button>
          </div>
        </div>

        {/* Toast / Banner Messages */}
        {showCsvExportSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-2 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{showCsvExportSuccess}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
              CSV Ready
            </span>
          </div>
        )}

        {showInvoiceDownloadSuccess && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between gap-2 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{showInvoiceDownloadSuccess}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-800 text-[10px] font-bold">PDF Ready</span>
          </div>
        )}

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

        {/* Modal Main Body: Calendar Schedule vs List View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {viewMode === "calendar" ? (
            <TripsCalendarView
              bookings={activeTab === "all" ? sortedSearchFilteredBookings : sortedBookings}
              userProfile={userProfile}
              onSelectPass={(b) => setSelectedBookingForPass(b)}
              onSelectInvoice={(b) => setSelectedBookingForInvoice(b)}
              onDownloadInvoice={(b) => handleDownloadInvoice(b)}
              generatingInvoiceId={generatingInvoiceId}
              onSimulateWebCheckIn={(id) => handleSimulateWebCheckIn(id)}
              onOpenAIDrawer={onOpenAIDrawer}
              onOpenExpenseExport={() => setIsExpenseModalOpen(true)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onOpenPackingChecklist={(b) => setSelectedBookingForChecklist(b)}
            />
          ) : sortedBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-3">
                {searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc" ? (
                  <Search className="w-7 h-7" />
                ) : (
                  <Ticket className="w-7 h-7" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc"
                  ? "No matching bookings found"
                  : `No ${activeTab} bookings found`}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc" ? (
                  <>
                    No trips found matching{" "}
                    <span className="font-semibold text-slate-800">
                      {[
                        searchQuery ? `"${searchQuery}"` : null,
                        selectedStatusFilter !== "all" ? `status: ${selectedStatusFilter}` : null,
                        selectedServiceFilter !== "all" ? `service: ${selectedServiceFilter}` : null,
                        sortBy !== "date-desc" ? `sorted: ${sortBy}` : null,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                    {activeTab !== "all" && selectedStatusFilter === "all" ? ` under ${activeTab}` : ""}. Try adjusting your status, service category, sorting, or search query.
                  </>
                ) : (
                  "You do not have any trips in this category yet. Explore Flights, Vande Bharat trains, and divine Yatra packages."
                )}
              </p>

              {searchQuery || selectedServiceFilter !== "all" || selectedStatusFilter !== "all" || sortBy !== "date-desc" ? (
                <button
                  id="my-trips-empty-clear-filters-btn"
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedServiceFilter("all");
                    setSelectedStatusFilter("all");
                    setSortBy("date-desc");
                    setActiveTab("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters & Reset</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onSelectCategory("flights");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Travel Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            sortedBookings.map((booking) => (
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
                      {searchQuery && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold ml-2 inline-flex items-center gap-1">
                          <Search className="w-2.5 h-2.5 text-indigo-500" />
                          Match
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
                      onClick={() => handleDownloadPrintTicket(booking)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                      title="Select booking and trigger browser's native print dialog for E-Ticket"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Download/Print Ticket</span>
                    </button>

                    <button
                      onClick={() => setSelectedBookingForPass(booking)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                      title="Open interactive Digital Ticket & Dynamic QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Digital Ticket &amp; QR</span>
                    </button>

                    {(booking.status === "upcoming" || booking.status === "confirmed") && (
                      <button
                        onClick={() => setSelectedBookingForChecklist(booking)}
                        className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/90 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                        title="Interactive Category-Based Travel Packing Checklist"
                      >
                        <Luggage className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Travel Packing Checklist</span>
                      </button>
                    )}

                    {/* Download Receipt button for every confirmed booking (toggles print-friendly invoice view) */}
                    {(booking.status === "confirmed" || booking.status === "upcoming" || booking.status === "completed") && (
                      <button
                        id={`download-receipt-btn-${booking.id}`}
                        onClick={() => setSelectedBookingForInvoice(selectedBookingForInvoice?.id === booking.id ? null : booking)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98 ${
                          selectedBookingForInvoice?.id === booking.id
                            ? "bg-indigo-600 text-white border border-indigo-700 shadow-sm"
                            : "bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-900 border border-indigo-200/80 hover:border-indigo-300"
                        }`}
                        title="Download Receipt & toggle print-friendly invoice view with transaction ID and summary table"
                      >
                        <Receipt className={`w-3.5 h-3.5 shrink-0 ${selectedBookingForInvoice?.id === booking.id ? "text-white" : "text-indigo-600"}`} />
                        <span>Download Receipt</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ml-auto flex items-center gap-1 ${
                          selectedBookingForInvoice?.id === booking.id
                            ? "bg-indigo-700 text-indigo-100 border border-indigo-500"
                            : "bg-white text-indigo-700 border border-indigo-200"
                        }`}>
                          <Printer className="w-3 h-3" />
                          <span>{selectedBookingForInvoice?.id === booking.id ? "Close View" : "Print-Ready"}</span>
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBookingForInvoice(booking)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                        title="Preview rendered Tax Invoice before downloading"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownloadInvoice(booking)}
                        disabled={generatingInvoiceId === booking.id}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-indigo-600 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                        title="Download formatted Tax Invoice as PDF document"
                      >
                        {generatingInvoiceId === booking.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>

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

                {/* Structured Invoice & Live Status Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-4 -mb-4 p-3.5 rounded-b-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-700 mb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-mono text-slate-900">
                        Invoice #{booking.invoiceNumber || `INV-2026-${booking.id.slice(-4)}`}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                        GST Registered (07AAACB4410R1ZP)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {(booking.status === "confirmed" || booking.status === "upcoming" || booking.status === "completed") ? (
                        <button
                          id={`download-receipt-bottom-btn-${booking.id}`}
                          onClick={() => setSelectedBookingForInvoice(selectedBookingForInvoice?.id === booking.id ? null : booking)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors ${
                            selectedBookingForInvoice?.id === booking.id
                              ? "bg-indigo-600 text-white border border-indigo-700"
                              : "bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                          }`}
                          title="Download Receipt & toggle print-friendly invoice view"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{selectedBookingForInvoice?.id === booking.id ? "Close Receipt" : "Download Receipt"}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedBookingForInvoice(selectedBookingForInvoice?.id === booking.id ? null : booking)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                          title="Toggle print-friendly invoice preview"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                          <span>Preview Invoice</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadInvoice(booking)}
                        disabled={generatingInvoiceId === booking.id}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        title="Download official PDF invoice"
                      >
                        {generatingInvoiceId === booking.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Invoice (PDF)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {(booking.status === "upcoming" || booking.status === "confirmed") && (
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] pt-1">
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
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>IRCTC &amp; DGCA 100% Instant Refund Protection • Verified GST Tax Invoices</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              title="Scan and validate e-tickets or boarding passes at terminal gates with live camera"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Ticket QR</span>
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              title="Open Corporate Travel Expense Reconciliation &amp; CSV Export Center"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Reconcile &amp; Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Structured Tax Invoice & Payment Receipt Modal (Print-Friendly View) */}
      {selectedBookingForInvoice && (() => {
        const breakdown = computeBookingTaxBreakdown(selectedBookingForInvoice);
        const pnrDisplay = selectedBookingForInvoice.pnr || `BY-${selectedBookingForInvoice.id.slice(-6).toUpperCase()}`;
        const invoiceNumDisplay = selectedBookingForInvoice.invoiceNumber || `INV-2026-${selectedBookingForInvoice.id.slice(-4).toUpperCase()}`;
        const transactionId = getBookingTransactionId(selectedBookingForInvoice);
        const rbiRrn = getBookingRbiRrn(selectedBookingForInvoice);
        const issueDate = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const paymentTime = selectedBookingForInvoice.time || "10:30 AM";
        const paymentMethod =
          selectedBookingForInvoice.paymentSummary?.method ||
          selectedBookingForInvoice.paymentSummary?.gateway ||
          "UPI • Verified Gateway (BHIM/RuPay/NetBanking)";

        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 print:static print:p-0 print:bg-transparent print:block print:inset-auto print:z-auto print:overflow-visible">
            <div id="tax-invoice-preview-container" className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:overflow-visible">
              {/* Modal Header (Hidden during print) */}
              <div className="no-print bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-indigo-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base">Booking Receipt &amp; Tax Invoice</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 uppercase tracking-wide">
                        Print-Ready
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        GST Compliant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Official Payment Receipt &amp; Tax Invoice • SAC {breakdown.sacCode} • Rule 46 CGST Compliance
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Print Receipt or Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setSelectedBookingForInvoice(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Close receipt view"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Read-Only Notice Callout (Hidden during print) */}
              <div className="no-print bg-indigo-50/90 border-b border-indigo-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-[11px] font-medium">
                    <strong>Print-Friendly Receipt View:</strong> Review verified payment settlement, unique transaction ID, and summary table below.
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                  <span className="bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-800">
                    TXN: {transactionId}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700">
                    PNR: {pnrDisplay}
                  </span>
                </div>
              </div>

              {/* Invoice Structured Content Container (Printable sheet) */}
              <div className="printable-invoice-sheet printable-document p-6 overflow-y-auto space-y-4 text-slate-900 text-xs print:p-2 print:overflow-visible print:space-y-3">
                {/* Company & Invoice Meta */}
                <div className="flex flex-wrap items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 print:bg-slate-50 print:border-slate-300">
                  <div>
                    <span className="text-base font-black text-slate-900 flex items-center gap-1.5">
                      🇮🇳 BharatYatra SuperApp
                    </span>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      BharatYatra Travel &amp; Mobility Technologies Pvt. Ltd.<br />
                      Level 7, DLF Cyber City, Sector 24, Gurugram, Haryana - 122002<br />
                      GSTIN: <strong className="font-mono text-slate-800">07AAACB4410R1ZP</strong><br />
                      CIN: U63040DL2024PTC129481 • State: Haryana (06)<br />
                      Helpline: 1800-2026-BHARAT • support@bharatyatra.gov.in
                    </p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                      PAID &amp; CONFIRMED
                    </div>

                    {/* Prominent Unique Transaction ID Badge */}
                    <div className="bg-indigo-50 border border-indigo-200/90 rounded-xl p-2.5 text-left max-w-xs ml-auto">
                      <div className="flex items-center justify-between gap-1 text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                        <span>Unique Transaction ID</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(transactionId);
                            setCopiedTxnId(true);
                            setTimeout(() => setCopiedTxnId(false), 2000);
                          }}
                          className="no-print text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer ml-1"
                          title="Copy Transaction ID to clipboard"
                        >
                          {copiedTxnId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span className="text-[9px] font-semibold">{copiedTxnId ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="font-mono text-xs font-black text-indigo-950 tracking-wide select-all mt-0.5">
                        {transactionId}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                        RBI RRN: {rbiRrn}
                      </p>
                    </div>

                    <p className="text-xs font-mono font-bold text-indigo-700 pt-0.5">
                      Invoice #{invoiceNumDisplay}
                    </p>
                    <p className="text-[11px] text-slate-700 font-mono">
                      PNR: <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">{pnrDisplay}</strong>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Issued: {issueDate} • {paymentTime} IST
                    </p>
                  </div>
                </div>

                {/* Billed To and Booking Detail Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Billed To (Passenger Profile)
                    </p>
                    <p className="text-sm font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-[11px] text-slate-600">Mobile: {userProfile.phone}</p>
                    <p className="text-[11px] text-slate-600">Email: {userProfile.email}</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold pt-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>Aadhaar / DigiLocker Verified Profile</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Itinerary &amp; Service Details
                    </p>
                    <p className="text-sm font-bold text-slate-900">{selectedBookingForInvoice.title}</p>
                    <p className="text-[11px] text-slate-600">{selectedBookingForInvoice.subtitle}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-700">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {selectedBookingForInvoice.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {selectedBookingForInvoice.time || "06:00 AM"}
                      </span>
                    </div>
                    <p className="text-[10px] text-indigo-700 font-semibold pt-0.5">
                      Seat/Unit: {selectedBookingForInvoice.seatInfo || "Confirmed"} • {selectedBookingForInvoice.passengers} Passenger(s)
                    </p>
                  </div>
                </div>

                {/* Summary Table 1: Itemized Fare & Statutory Tax Breakdown */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      1. Booking &amp; Fare Summary Table
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      SAC {breakdown.sacCode} • 12% GST
                    </span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold text-[11px] border-b border-slate-200">
                        <th className="p-2.5">Item / Service Description</th>
                        <th className="p-2.5">SAC Code</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Taxable Net (₹)</th>
                        <th className="p-2.5 text-right">CGST (6%)</th>
                        <th className="p-2.5 text-right">SGST (6%)</th>
                        <th className="p-2.5 text-right">Total Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">
                          {selectedBookingForInvoice.title} (Base Fare)
                        </td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">{selectedBookingForInvoice.passengers} Pax</td>
                        <td className="p-2.5 text-right font-medium text-slate-900">
                          ₹{breakdown.baseAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 text-right text-slate-600 font-mono">
                          ₹{breakdown.cgst.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 text-right text-slate-600 font-mono">
                          ₹{breakdown.sgst.toLocaleString("en-IN")}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ₹{breakdown.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">Central GST (CGST @ {breakdown.gstRatePercent / 2}%)</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">Statutory</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">₹{breakdown.cgst.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">₹{breakdown.cgst.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">State GST (SGST @ {breakdown.gstRatePercent / 2}%)</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">Statutory</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">₹{breakdown.sgst.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">₹{breakdown.sgst.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">IRDAI Travel &amp; Luggage Protection</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">997132</td>
                        <td className="p-2.5 text-center text-slate-600">Included</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right font-medium text-emerald-700">₹0 (Free)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">Platform Convenience &amp; Booking Charges</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">998599</td>
                        <td className="p-2.5 text-center text-slate-600">1 Order</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right text-slate-400">₹0</td>
                        <td className="p-2.5 text-right font-medium text-emerald-700">₹0 (Waived)</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-300 font-extrabold text-slate-900">
                        <td colSpan={6} className="p-3 text-right">
                          <div>
                            <span>Grand Total Paid (Inclusive of All Taxes):</span>
                            <p className="text-[10px] font-normal text-slate-600 mt-0.5">
                              In Words: <strong className="text-slate-800">{formatRupeesInWords(breakdown.totalAmount)}</strong>
                            </p>
                          </div>
                        </td>
                        <td className="p-3 text-right text-indigo-700 text-sm font-black whitespace-nowrap align-top">
                          ₹{breakdown.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Summary Table 2: Payment & Transaction Settlement Summary Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      2. Payment &amp; Transaction Settlement Summary Table
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold border border-emerald-300">
                      SETTLED • 100% SECURE
                    </span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-white">
                        <td className="p-2.5 font-semibold text-slate-600 w-2/5">Unique Transaction ID</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-900 flex items-center justify-between">
                          <span>{transactionId}</span>
                          <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Verified</span>
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-600">Payment Gateway &amp; Mode</td>
                        <td className="p-2.5 text-slate-800 font-medium">{paymentMethod}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 font-semibold text-slate-600">Bank Reference Number (RBI RRN)</td>
                        <td className="p-2.5 font-mono text-slate-800">{rbiRrn}</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-600">Transaction Date &amp; Timestamp</td>
                        <td className="p-2.5 text-slate-800">{issueDate}, {paymentTime} IST</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 font-semibold text-slate-600">Input Tax Credit (ITC) Status</td>
                        <td className="p-2.5 text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Eligible for Full ITC (CGST Act 2017 Section 31)</span>
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-600">Digital Authentication Token</td>
                        <td className="p-2.5 font-mono text-slate-700">AUTH-BY-{pnrDisplay} • Gate Pass: GP-{pnrDisplay}</td>
                      </tr>
                      <tr className="bg-indigo-50/70 font-bold text-slate-900 border-t border-indigo-100">
                        <td className="p-2.5 text-indigo-950">Net Amount Paid &amp; Settled</td>
                        <td className="p-2.5 text-indigo-700 font-mono text-sm font-black">
                          ₹{breakdown.totalAmount.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] font-normal text-slate-600">
                            (Zero Outstanding Balance)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verification Stamp & QR Code */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-[11px]">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      Digital Verification &amp; Boarding Gate Pass
                    </span>
                    <p className="text-slate-600 text-[10px] leading-relaxed">
                      This digitally certified receipt confirms full settlement for PNR <strong className="font-mono text-slate-900">{pnrDisplay}</strong>. Scan QR code at terminal gates or hotel check-in desks for instant verification.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[9px] font-bold text-slate-700">
                        GATE PASS: GP-{pnrDisplay}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[9px] font-bold text-emerald-800">
                        100% RECONCILED
                      </span>
                    </div>
                  </div>

                  {/* Dynamic QR Code in Invoice Preview */}
                  <div className="shrink-0 bg-white p-1 rounded-lg border border-slate-200">
                    <DynamicQRCode
                      booking={selectedBookingForInvoice}
                      userProfile={userProfile}
                      size={72}
                      showDetails={false}
                    />
                  </div>
                </div>

                {/* Official Statutory GST & Digital Authorization Stamp */}
                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 print-break-inside-avoid">
                  <div>
                    <p className="font-semibold text-slate-700">
                      BharatYatra Technologies Pvt. Ltd. • Registered Office: Level 7, DLF Cyber City, Gurugram - 122002
                    </p>
                    <p className="text-[9px] text-slate-500">
                      This is a computer-generated tax invoice and payment receipt issued under Rule 46 of CGST Rules 2017. Physical signature not required.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono text-[9px] font-bold text-slate-700">
                      GST COMPLIANT • DIGITAL RECEIPT
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer with Actions (Hidden during print) */}
              <div className="no-print bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transactionId);
                      setCopiedTxnId(true);
                      setTimeout(() => setCopiedTxnId(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Copy unique transaction ID"
                  >
                    {copiedTxnId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTxnId ? "Copied TXN ID!" : "Copy Transaction ID"}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(invoiceNumDisplay);
                      setCopiedInvoiceId(true);
                      setTimeout(() => setCopiedInvoiceId(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Copy invoice number"
                  >
                    {copiedInvoiceId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedInvoiceId ? "Copied INV!" : "Copy Invoice #"}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-white border border-indigo-300 text-indigo-800 text-xs font-bold hover:bg-indigo-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Print Receipt or save as official PDF using browser print dialog"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForInvoice(null)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(selectedBookingForInvoice)}
                    disabled={generatingInvoiceId === selectedBookingForInvoice.id}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    title="Download rendered invoice as PDF document"
                  >
                    {generatingInvoiceId === selectedBookingForInvoice.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Digital Boarding Pass / E-Ticket Popup */}
      {selectedBookingForPass && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="printable-eticket-sheet printable-document bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
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
                className="no-print p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Close ticket"
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

              {/* Dynamic QR Code & Gate Verification Box */}
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50/40 text-center flex flex-col items-center">
                <ETicketQRCodeGenerator
                  booking={selectedBookingForPass}
                  userProfile={userProfile}
                  size={140}
                  showDetails={true}
                  showQuickVerifyButton={true}
                />
                <div className="w-full mt-3 h-6 bg-slate-200/80 rounded flex items-center justify-center font-mono text-[10px] text-slate-700 tracking-widest select-none">
                  ||||| | |||| |||||| || | |||| |||||| ||||
                </div>
              </div>

              {/* Official Electronic Boarding Pass Advisory */}
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed space-y-0.5 print-break-inside-avoid">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>Official Carrier E-Pass</span>
                  <span>DGCA &amp; Ministry Compliant</span>
                </div>
                <p>
                  • Please present this electronic document along with a valid Government Photo ID (Aadhaar / Passport / Voter ID) at check-in &amp; security gates.
                </p>
                <p>
                  • Boarding gates close 25 minutes prior to scheduled departure. 24x7 Helpline: 1800-102-8747.
                </p>
              </div>
            </div>

            {/* Ticket Actions */}
            <div className="no-print bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-98"
                title="Download as PDF or print official E-Ticket via browser print dialog"
              >
                <Printer className="w-4 h-4" />
                <span>Download/Print Ticket</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const bookingToPreview = selectedBookingForPass;
                    setSelectedBookingForPass(null);
                    setSelectedBookingForInvoice(bookingToPreview);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Open read-only tax invoice preview"
                >
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Preview Invoice</span>
                </button>

                <button
                  onClick={() => handleDownloadInvoice(selectedBookingForPass)}
                  disabled={generatingInvoiceId === selectedBookingForPass.id}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Download formatted Tax Invoice as PDF document"
                >
                  {generatingInvoiceId === selectedBookingForPass.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Invoice</span>
                    </>
                  )}
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

      {/* Corporate Travel Expense Reconciliation & Statutory CSV Export Modal */}
      {isExpenseModalOpen && (
        <ExpenseReconciliationModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          bookings={bookings}
          userProfile={userProfile}
        />
      )}

      {/* Terminal QR Code Ticket Scanner & Validator Modal */}
      {isQRScannerOpen && (
        <QRScannerModal
          isOpen={isQRScannerOpen}
          onClose={() => setIsQRScannerOpen(false)}
          bookings={bookings}
          userProfile={userProfile}
          onSelectBookingForPass={(b) => {
            setIsQRScannerOpen(false);
            setSelectedBookingForPass(b);
          }}
          onSelectBookingForInvoice={(b) => {
            setIsQRScannerOpen(false);
            setSelectedBookingForInvoice(b);
          }}
          onDownloadInvoice={(b) => handleDownloadInvoice(b)}
        />
      )}
      {/* Interactive Travel Packing Checklist Modal */}
      {selectedBookingForChecklist && (
        <PackingChecklistModal
          isOpen={!!selectedBookingForChecklist}
          onClose={() => setSelectedBookingForChecklist(null)}
          booking={selectedBookingForChecklist}
          allBookings={bookings}
          userProfile={userProfile}
          onSelectAnotherBooking={(b) => setSelectedBookingForChecklist(b)}
        />
      )}
    </div>
  );
}
