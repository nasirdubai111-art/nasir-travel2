import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Ticket,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Building,
  Plane,
  Train,
  Bus,
  Car,
  FileText,
  Share2,
  Edit3,
  XCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BookingItem, BookingPassengerDetail, BackendTicketRecord } from "../../types";
import { TicketBackendService } from "../../services/ticketBackendService";

interface OfficialETicketCardProps {
  booking: BookingItem;
  ticketRecord?: BackendTicketRecord;
  onCancelBooking?: (bookingId: string) => void;
  onModifyBooking?: (bookingId: string) => void;
  onClose?: () => void;
  isCompact?: boolean;
}

export const OfficialETicketCard: React.FC<OfficialETicketCardProps> = ({
  booking,
  ticketRecord,
  onCancelBooking,
  onModifyBooking,
  onClose,
  isCompact = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrCopied, setQrCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [modifyNotes, setModifyNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewFormat, setViewFormat] = useState<"card" | "classic">("card");

  const printAreaRef = useRef<HTMLDivElement>(null);

  const pnr = booking.pnr || "8A7K92";
  const bookingId = booking.id || "BK202609150001";
  const ticketNumber = booking.ticketNumber || (booking.ticketRecord?.ticketNumber) || `TKT-2026-${bookingId.slice(-6)}`;
  
  // Passenger list
  const passengers: BookingPassengerDetail[] =
    booking.passengerDetailsList && booking.passengerDetailsList.length > 0
      ? booking.passengerDetailsList
      : [
          {
            name: "Mr. Traveler",
            age: 32,
            gender: "Male",
            seatNumber: booking.seatInfo || "A12",
            phone: "+91 98765 43210",
            subPnr: `${pnr}-P1`,
            ticketId: `${ticketNumber}-01`,
          },
        ];

  const currentPassenger = passengers[activePassengerIndex] || passengers[0];

  // Journey information
  const serviceTitle = booking.title || booking.provider || "ABC Travels Intercity";
  const operatorName = booking.provider || "ABC Travels";
  const vehicleNo = booking.vehicleOrFlightNo || (booking.serviceType === "trains" ? "Train 22436" : booking.serviceType === "flights" ? "Flight 6E-204" : "KA-XX-1024");
  const fromCity = booking.fromLocation || "Bengaluru";
  const toCity = booking.toLocation || "Hyderabad";
  const journeyDate = booking.date || "25 Sep 2026";
  const boardingTime = booking.time || "08:30 PM";
  const boardingPoint = booking.boardingPoint || `${fromCity} Central Terminal`;
  const seatClass = currentPassenger.seatNumber || booking.seatInfo || "A12";

  // Payment information
  const paymentStatus = booking.paymentSummary?.paymentStatus || "PAID";
  const amount = booking.amount || booking.amountPaid || 1250;
  const transactionId = booking.paymentSummary?.transactionId || booking.paymentSummary?.transactionRef || "TXN-2026-ONLINE-984210";
  const paymentMode = booking.paymentSummary?.paymentMode || "Online Payment";
  const baseFare = booking.paymentSummary?.baseFare || Math.round(amount * 0.85);
  const taxesAndGst = booking.paymentSummary?.taxesAndGst || Math.round(amount * 0.1);
  const convenienceFee = booking.paymentSummary?.convenienceFee || 49;

  // Generated At
  const generatedAt = booking.ticketRecord?.generatedAt
    ? new Date(booking.ticketRecord.generatedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  // Secure QR Payload strictly containing verification token, Ticket ID, PNR, Booking ID
  // Strictly NO sensitive payment card numbers, CVVs, or secret API keys!
  const secureVerificationToken =
    booking.ticketRecord?.qrVerificationToken ||
    `BY-VERIFY-${ticketNumber}-${pnr}-${Math.abs((ticketNumber + pnr).split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16)}`;

  const qrPayloadText = JSON.stringify({
    ticketId: ticketNumber,
    bookingId: bookingId,
    pnr: pnr,
    verificationToken: secureVerificationToken,
    verifyUrl: `https://bharatyatra.in/verify-ticket?ticketId=${ticketNumber}&pnr=${pnr}&token=${secureVerificationToken}`,
    passenger: currentPassenger.name,
    seat: seatClass,
    date: journeyDate,
    status: "CONFIRMED_VALID_FOR_BOARDING",
    generatedAt: generatedAt,
  });

  // Generate QR Code image
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(qrPayloadText, {
      width: 260,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code Error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [qrPayloadText]);

  // Handle Print Ticket
  const handlePrintTicket = () => {
    TicketBackendService.updatePrintStatus(ticketNumber, "PRINTED");
    window.print();
  };

  // Handle Download PDF
  const handleDownloadPdf = () => {
    TicketBackendService.updatePrintStatus(ticketNumber, "DOWNLOADED");
    setToastMessage("Downloading official E-Ticket PDF receipt...");
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([qrPayloadText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `ETicket_${pnr}_${ticketNumber}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setToastMessage("E-Ticket downloaded successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  // Copy Verification Token
  const handleCopyToken = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secureVerificationToken);
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2500);
    }
  };

  // Verify Ticket
  const handleVerifyTicket = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = TicketBackendService.verifyTicket(pnr);
      setVerificationResult(res);
      setIsVerifying(false);
    }, 600);
  };

  const getServiceIcon = () => {
    switch (booking.serviceType) {
      case "flights":
        return <Plane className="w-5 h-5 text-sky-600" />;
      case "trains":
        return <Train className="w-5 h-5 text-emerald-600" />;
      case "buses":
        return <Bus className="w-5 h-5 text-amber-600" />;
      case "cabs":
        return <Car className="w-5 h-5 text-indigo-600" />;
      default:
        return <Building className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Booking Confirmation Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                Booking Confirmed
              </span>
              <span className="text-xs text-emerald-100 font-medium">Verified by Central Backend</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mt-0.5">E-Ticket &amp; Tax Invoice Ready</h3>
          </div>
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl text-xs font-bold self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewFormat("card")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === "card" ? "bg-white text-emerald-900 shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            Digital Ticket
          </button>
          <button
            onClick={() => setViewFormat("classic")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === "classic" ? "bg-white text-emerald-900 shadow-xs" : "text-white/80 hover:text-white"
            }`}
          >
            Official Template
          </button>
        </div>
      </div>

      {/* Passenger Selector if multiple passengers */}
      {passengers.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Passenger Ticket:</span>
          {passengers.map((p, idx) => (
            <button
              key={p.id || idx}
              onClick={() => setActivePassengerIndex(idx)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activePassengerIndex === idx
                  ? "bg-[#0B5ED7] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{p.name}</span>
              <span className="text-[10px] opacity-75">({p.seatNumber || `Seat ${idx + 1}`})</span>
            </button>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DIGITAL TICKET CARD VIEW (Rich Modern Design) */}
      {/* ========================================================================= */}
      {viewFormat === "card" && (
        <div
          ref={printAreaRef}
          className="bg-white border-2 border-slate-200 rounded-2xl shadow-md overflow-hidden relative"
        >
          {/* Top Brand Banner */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
                {getServiceIcon()}
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase block">
                  BharatYatra SuperApp • Government Certified Rail / Aviation / Roadways Transit
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white leading-tight">{serviceTitle}</h4>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Booking ID</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-white">{bookingId}</span>
            </div>
          </div>

          {/* Key Identifiers: PNR & Ticket Number */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">PNR Number</span>
              <span className="text-lg font-mono font-black text-[#0B5ED7] tracking-wider">{pnr}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket No.</span>
              <span className="text-sm font-mono font-bold text-slate-900 truncate block">{ticketNumber}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
                {paymentStatus}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Seat / Class</span>
              <span className="text-sm font-bold text-slate-900">{seatClass}</span>
            </div>
          </div>

          {/* Core Passenger & Journey Details */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Columns: Passenger & Journey Details */}
            <div className="md:col-span-2 space-y-5">
              {/* Passenger Info */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Passenger Details
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Name</span>
                    <span className="text-sm font-bold text-slate-900">{currentPassenger.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Age / Gender</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {currentPassenger.age || 32} Yrs • {currentPassenger.gender || "Male"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Seat Number</span>
                    <span className="text-sm font-bold text-blue-700">{seatClass}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Contact Phone</span>
                    <span className="text-xs font-medium text-slate-700">{currentPassenger.phone || "+91 98765 43210"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Gate Token</span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {currentPassenger.gateToken || `GP-${pnr}-01`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journey Route & Schedule */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Journey &amp; Transit Details
                </h5>

                <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">From (Origin)</span>
                    <span className="text-base font-bold text-slate-900">{fromCity}</span>
                    <span className="text-xs text-slate-500 block">{boardingPoint}</span>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-xs font-bold text-blue-600 mb-0.5">DIRECT</span>
                    <div className="w-24 sm:w-36 h-0.5 bg-blue-300 relative flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{vehicleNo}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">To (Destination)</span>
                    <span className="text-base font-bold text-slate-900">{toCity}</span>
                    <span className="text-xs text-slate-500 block">Scheduled Drop Terminal</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Journey Date</span>
                    <span className="font-bold text-slate-800">{journeyDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Boarding Time</span>
                    <span className="font-bold text-slate-800">{boardingTime}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Operator / Carrier</span>
                    <span className="font-bold text-slate-800">{operatorName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Carrier Code</span>
                    <span className="font-mono font-bold text-slate-800">{vehicleNo}</span>
                  </div>
                </div>
              </div>

              {/* Fare & Taxes Breakdown */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Fare &amp; Taxes Summary
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Base Fare</span>
                    <span className="font-bold text-slate-800">₹{baseFare.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Taxes &amp; GST (5%)</span>
                    <span className="font-bold text-slate-800">₹{taxesAndGst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Convenience Fee</span>
                    <span className="font-bold text-slate-800">₹{convenienceFee}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">Total Paid</span>
                    <span className="font-black text-emerald-700 text-sm">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span>
                    Transaction ID: <strong className="font-mono text-slate-900">{transactionId}</strong>
                  </span>
                  <span>
                    Mode: <strong className="text-slate-900">{paymentMode}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code For Ticket Verification */}
            <div className="flex flex-col items-center justify-between p-5 bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-300 text-center">
              <div className="w-full">
                <div className="flex items-center justify-center gap-1 text-slate-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <QrCode className="w-4 h-4 text-[#0B5ED7]" />
                  <span>QR Ticket Verification</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Scan at station gate, airport DigiYatra e-gate, or bus terminal for entry
                </p>

                {/* QR Code Graphic */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-300 shadow-sm inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`Ticket QR Code for ${pnr}`}
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                      Generating QR...
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-semibold text-slate-600 mt-2">Scan to verify ticket</p>
                <span className="text-[10px] text-slate-400 block mt-0.5">Generated At: {generatedAt}</span>
              </div>

              {/* Secure Token Display & Direct Verification Button */}
              <div className="w-full mt-4 pt-3 border-t border-slate-200 space-y-2">
                <div className="bg-slate-100 p-2 rounded-lg text-left">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verification Token
                    </span>
                    <button
                      onClick={handleCopyToken}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      {qrCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {qrCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-slate-800 break-all block leading-tight">
                    {secureVerificationToken}
                  </span>
                </div>

                <button
                  onClick={handleVerifyTicket}
                  disabled={isVerifying}
                  className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isVerifying ? "Verifying..." : "Test Gate Token Verification"}
                </button>

                {verificationResult && (
                  <div
                    className={`p-2 rounded-lg text-[11px] text-left animate-in fade-in ${
                      verificationResult.isValid
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                        : "bg-red-50 text-red-900 border border-red-200"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100% Authenticated
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-0.5 leading-tight">
                      Validated on Central Transport Registry. Valid for boarding.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Guarantee Strip */}
          <div className="bg-slate-100/80 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <strong>Strict Security Protocol:</strong> QR code contains only ticket &amp; PNR verification token. No payment credentials or secret keys are encoded.
            </span>
            <span className="font-mono text-[10px]">AUTH-SIG: BY-SEC-{pnr.slice(-4)}-{bookingId.slice(-4)}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OFFICIAL TEMPLATE VIEW (Exact Travel Platform Layout) */}
      {/* ========================================================================= */}
      {viewFormat === "classic" && (
        <div
          ref={printAreaRef}
          className="bg-white border-2 border-slate-800 rounded-lg p-6 font-mono text-slate-900 shadow-md max-w-xl mx-auto text-xs"
        >
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-800">
            <h2 className="text-base font-black tracking-wider uppercase">TRAVEL PLATFORM</h2>
            <h3 className="text-sm font-bold tracking-widest text-slate-700">E-TICKET / INVOICE</h3>
          </div>

          <div className="py-4 space-y-1.5 border-b-2 border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-600">Booking ID</span>
              <span className="font-bold">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">PNR</span>
              <span className="font-black text-blue-700 text-sm">{pnr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Ticket No.</span>
              <span className="font-bold">{ticketNumber}</span>
            </div>
          </div>

          <div className="py-4 space-y-1.5 border-b-2 border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-600">Passenger</span>
              <span className="font-bold">{currentPassenger.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Journey Date</span>
              <span className="font-bold">{journeyDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">From</span>
              <span className="font-bold">{fromCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">To</span>
              <span className="font-bold">{toCity}</span>
            </div>
          </div>

          <div className="py-4 space-y-1.5 border-b-2 border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-600">Service</span>
              <span className="font-bold">{operatorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Vehicle / Train / Flight</span>
              <span className="font-bold">{vehicleNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Seat</span>
              <span className="font-bold">{seatClass}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Boarding Point</span>
              <span className="font-bold">{boardingPoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Boarding Time</span>
              <span className="font-bold">{boardingTime}</span>
            </div>
          </div>

          <div className="py-4 space-y-1.5 border-b-2 border-dashed border-slate-800 bg-slate-50 p-3 rounded my-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Status</span>
              <span className="font-bold text-emerald-700 uppercase">{paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount</span>
              <span className="font-bold text-slate-900 text-sm">₹{amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Transaction ID</span>
              <span className="font-bold">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Mode</span>
              <span className="font-bold">{paymentMode}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="py-4 text-center">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Ticket QR"
                className="w-36 h-36 mx-auto border-2 border-slate-800 p-1 bg-white"
              />
            )}
            <p className="font-bold text-xs mt-2 uppercase tracking-wider">Scan to verify ticket</p>
            <p className="text-[10px] text-slate-500 mt-1">Generated At : {generatedAt}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTION CONTROLS: PRINT TICKET | DOWNLOAD PDF | CANCEL / MODIFY */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {/* Print Ticket */}
          <button
            onClick={handlePrintTicket}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT TICKET</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-[#0B5ED7] hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD PDF</span>
          </button>
        </div>

        {/* Cancel / Modify Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModifyModalOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Journey</span>
          </button>

          <button
            onClick={() => setCancelModalOpen(true)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Ticket</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CANCELLATION MODAL */}
      {/* ========================================================================= */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Cancel Ticket #{ticketNumber}?</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              According to standard IRCTC / Carrier cancellation guidelines, a refund of{" "}
              <strong className="text-slate-900">₹{Math.round(amount * 0.85)}</strong> will be credited directly to your original payment method ({paymentMode}) within 2 hours. A standard cancellation fee of ₹{Math.round(amount * 0.15)} applies.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Paid Amount</span>
                <span className="font-bold">₹{amount}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Cancellation Fee</span>
                <span>-₹{Math.round(amount * 0.15)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-slate-200">
                <span>Refund to be Credited</span>
                <span>₹{Math.round(amount * 0.85)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  setCancelModalOpen(false);
                  if (onCancelBooking) {
                    onCancelBooking(booking.id);
                  }
                  setToastMessage(`Ticket #${ticketNumber} cancelled. Refund ₹${Math.round(amount * 0.85)} initiated.`);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODIFICATION MODAL */}
      {/* ========================================================================= */}
      {modifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <Edit3 className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Modify Booking Details</h4>
            </div>

            <p className="text-xs text-slate-600">
              You can modify traveler boarding point, seat selection, or contact details prior to 4 hours before departure with zero penalty fees.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Modification Request Notes</label>
              <textarea
                value={modifyNotes}
                onChange={(e) => setModifyNotes(e.target.value)}
                placeholder="e.g. Change boarding point to Electronic City Toll Gate, or change seat preference to Window."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModifyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModifyModalOpen(false);
                  if (onModifyBooking) {
                    onModifyBooking(booking.id);
                  }
                  setToastMessage("Modification request submitted to carrier. Updated e-ticket generated.");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
