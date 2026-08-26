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
  BadgeCheck,
  Receipt,
  Copy,
  Loader2,
  Eye,
  CalendarDays,
  List,
  FileSpreadsheet,
  ArrowDownToLine,
} from "lucide-react";
import { BookingItem, ServiceCategory, UserProfile } from "../types";
import { downloadBookingInvoicePDF, computeBookingTaxBreakdown } from "../utils/invoicePdfGenerator";
import { downloadCorporateExpenseCSV } from "../utils/csvExpenseExporter";
import { DynamicQRCode } from "./DynamicQRCode";
import { TripsCalendarView } from "./TripsCalendarView";
import { ExpenseReconciliationModal } from "./ExpenseReconciliationModal";
import { QRScannerModal } from "./QRScannerModal";

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
    const listToExport = activeTab === "all" ? bookings : filteredBookings;
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

        {/* Tab Selection & View Switcher */}
        <div className="flex flex-wrap items-center justify-between px-6 border-b border-slate-200 bg-slate-50 gap-2">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto py-1 sm:py-0">
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
              bookings={activeTab === "all" ? bookings : filteredBookings}
              userProfile={userProfile}
              onSelectPass={(b) => setSelectedBookingForPass(b)}
              onSelectInvoice={(b) => setSelectedBookingForInvoice(b)}
              onDownloadInvoice={(b) => handleDownloadInvoice(b)}
              generatingInvoiceId={generatingInvoiceId}
              onSimulateWebCheckIn={(id) => handleSimulateWebCheckIn(id)}
              onOpenAIDrawer={onOpenAIDrawer}
              onOpenExpenseExport={() => setIsExpenseModalOpen(true)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
            />
          ) : filteredBookings.length === 0 ? (
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
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
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
                      <button
                        onClick={() => setSelectedBookingForInvoice(booking)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        title="Open read-only tax invoice preview"
                      >
                        <Eye className="w-3 h-3 text-indigo-600" />
                        <span>Preview Invoice</span>
                      </button>

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

      {/* Structured Tax Invoice & Booking Summary Modal (Read-Only Preview) */}
      {selectedBookingForInvoice && (() => {
        const breakdown = computeBookingTaxBreakdown(selectedBookingForInvoice);
        const pnrDisplay = selectedBookingForInvoice.pnr || `BY-${selectedBookingForInvoice.id.slice(-6).toUpperCase()}`;
        const invoiceNumDisplay = selectedBookingForInvoice.invoiceNumber || `INV-2026-${selectedBookingForInvoice.id.slice(-4).toUpperCase()}`;
        const issueDate = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div id="tax-invoice-preview-container" className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header (Hidden during print) */}
              <div className="no-print bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-indigo-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base">Tax Invoice Preview</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 uppercase tracking-wide">
                        Read-Only
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Official GST Compliance Document • SAC {breakdown.sacCode} • Review before downloading or printing
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBookingForInvoice(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close invoice preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Read-Only Notice Callout (Hidden during print) */}
              <div className="no-print bg-indigo-50/90 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between gap-2 text-xs text-indigo-900">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-[11px] font-medium">
                    <strong>Invoice Preview Mode:</strong> Review rendered billing, passenger profile, and tax breakdown before generating the final PDF.
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700 shrink-0">
                  PNR: {pnrDisplay}
                </span>
              </div>

              {/* Invoice Structured Content Container (Printable sheet) */}
              <div className="printable-invoice-sheet p-6 overflow-y-auto space-y-4 text-slate-900 text-xs">
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
                      CIN: U63040DL2024PTC129481 • State: Haryana (06)
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                      PAID &amp; SETTLED
                    </div>
                    <p className="text-xs font-mono font-bold text-indigo-700">
                      Invoice #{invoiceNumDisplay}
                    </p>
                    <p className="text-[11px] text-slate-700 font-mono">
                      PNR: <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">{pnrDisplay}</strong>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Issued: {issueDate}
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

                {/* Itemized Fare Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-200">
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">SAC Code</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-medium text-slate-800">
                          {selectedBookingForInvoice.title} (Base Fare)
                        </td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">{selectedBookingForInvoice.passengers} Pax</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ₹{breakdown.baseAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">Central GST (CGST @ {breakdown.gstRatePercent / 2}%)</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">Statutory</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">
                          ₹{breakdown.cgst.toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">State GST (SGST @ {breakdown.gstRatePercent / 2}%)</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">{breakdown.sacCode}</td>
                        <td className="p-2.5 text-center text-slate-600">Statutory</td>
                        <td className="p-2.5 text-right font-medium text-slate-700">
                          ₹{breakdown.sgst.toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-600">IRDAI Travel &amp; Luggage Protection</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">997132</td>
                        <td className="p-2.5 text-center text-slate-600">Included</td>
                        <td className="p-2.5 text-right font-medium text-emerald-700">₹0 (Free)</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-200 font-extrabold text-slate-900">
                        <td colSpan={3} className="p-3 text-right">Total Fare (Inclusive of All Taxes):</td>
                        <td className="p-3 text-right text-indigo-700 text-sm font-black">
                          ₹{breakdown.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Financial Summary Calculation Card & Dynamic QR Gate Pass */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Payment Settlement & QR Authenticity Stamp */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-2 text-[11px]">
                    <div className="space-y-1">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        Payment Method: Verified Gateway (RBI RRN: 623849182391)
                      </span>
                      <p className="text-emerald-800 text-[10px]">
                        Status: Settled &amp; Secured • Token: AUTH-BY-{pnrDisplay}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded bg-white border border-emerald-300 font-mono text-[9px] font-bold text-emerald-800 inline-block">
                          ITC ELIGIBLE • GST SEC 31
                        </span>
                        <p className="text-[10px] text-slate-600 font-medium">
                          Gate Pass Token: <span className="font-mono text-indigo-700 font-bold">GP-{pnrDisplay}</span>
                        </p>
                      </div>

                      {/* Dynamic QR Code in Invoice Preview */}
                      <div className="shrink-0">
                        <DynamicQRCode
                          booking={selectedBookingForInvoice}
                          userProfile={userProfile}
                          size={70}
                          showDetails={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown Totals */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Net Amount:</span>
                      <span className="font-semibold text-slate-900">₹{breakdown.baseAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Total Applicable Tax (GST {breakdown.gstRatePercent}%):</span>
                      <span className="font-semibold text-slate-900">₹{(breakdown.cgst + breakdown.sgst).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Convenience &amp; Platform Fees:</span>
                      <span className="font-semibold text-emerald-700">₹0.00 (Zero Fee)</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 text-xs font-black text-slate-900">
                      <span>Grand Total:</span>
                      <span className="text-indigo-700 font-mono">₹{breakdown.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Download PDF Button (Hidden during print) */}
              <div className="no-print bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(invoiceNumDisplay);
                      setCopiedInvoiceId(true);
                      setTimeout(() => setCopiedInvoiceId(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedInvoiceId ? "Copied!" : "Copy Invoice #"}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForInvoice(null)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(selectedBookingForInvoice)}
                    disabled={generatingInvoiceId === selectedBookingForInvoice.id}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    title="Download rendered invoice as PDF"
                  >
                    {generatingInvoiceId === selectedBookingForInvoice.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Invoice (PDF)</span>
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

              {/* Dynamic QR Code & Gate Verification Box */}
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50/40 text-center flex flex-col items-center">
                <DynamicQRCode
                  booking={selectedBookingForPass}
                  userProfile={userProfile}
                  size={140}
                  showDetails={true}
                />
                <div className="w-full mt-3 h-6 bg-slate-200/80 rounded flex items-center justify-center font-mono text-[10px] text-slate-700 tracking-widest select-none">
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
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
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
    </div>
  );
}
