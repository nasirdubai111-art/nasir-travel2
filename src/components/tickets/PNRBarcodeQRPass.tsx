import React, { useState } from "react";
import {
  Ticket,
  Printer,
  Download,
  Share2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  Copy,
  ScanLine,
  Plane,
  Train,
  Bus,
  Building2,
  User,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";
import { PNRBarcode } from "./PNRBarcode";
import { PNRQRCode } from "./PNRQRCode";
import { BookingItem, UserProfile, BookingPassengerDetail } from "../../types";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export interface PNRBarcodeQRPassProps {
  booking: BookingItem;
  userProfile?: UserProfile;
  onPrint?: () => void;
  onOpenScanner?: () => void;
  className?: string;
}

export const PNRBarcodeQRPass: React.FC<PNRBarcodeQRPassProps> = ({
  booking,
  userProfile,
  onPrint,
  onOpenScanner,
  className,
}) => {
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState<number>(0);
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<"pass" | "barcode_only" | "qr_only">("pass");

  const pnr = booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;

  // Multi-passenger support
  const passengers: BookingPassengerDetail[] =
    booking.passengerDetailsList && booking.passengerDetailsList.length > 0
      ? booking.passengerDetailsList
      : [
          {
            id: "p1",
            name: userProfile?.name || "Primary Traveller",
            age: 30,
            gender: "Male",
            seatNumber: booking.seatInfo || "Seat 12A / Coach B3",
            subPnr: `${pnr}-P1`,
            gateToken: `GP-${pnr}-P1`,
            fareShare: booking.amount,
          },
        ];

  const currentPassenger = passengers[selectedPassengerIndex] || passengers[0];
  const activePassengerPnr = currentPassenger.subPnr || pnr;

  const handleCopyPnr = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activePassengerPnr);
      setCopiedPnr(true);
      setTimeout(() => setCopiedPnr(false), 2000);
    }
  };

  const getServiceIcon = () => {
    switch (booking.serviceType) {
      case "flights":
        return <Plane className="w-5 h-5 text-sky-400" />;
      case "trains":
        return <Train className="w-5 h-5 text-amber-400" />;
      case "buses":
        return <Bus className="w-5 h-5 text-emerald-400" />;
      default:
        return <Ticket className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-[16px] border border-[#E5E7EB] shadow-md overflow-hidden text-left flex flex-col",
        className
      )}
    >
      {/* 1. Ticket Header (Airline / Carrier Strip) */}
      <div className="bg-[#111827] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-slate-800 flex items-center justify-center border border-slate-700">
            {getServiceIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B5ED7] bg-[#E7F1FF] px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                {booking.serviceType}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Authorized Boarding Pass
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5 tracking-tight">
              {booking.title}
            </h3>
          </div>
        </div>

        {/* PNR Badge */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-[10px] px-3 py-1.5 self-start sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              {passengers.length > 1 ? "Selected Sub-PNR" : "Booking PNR"}
            </span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-white tracking-wider">
              {activePassengerPnr}
            </span>
          </div>
          <button
            onClick={handleCopyPnr}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Copy PNR"
          >
            {copiedPnr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Passenger Switcher (for Group Bookings) */}
      {passengers.length > 1 && (
        <div className="bg-[#F8FAFC] px-4 py-2.5 border-b border-[#E5E7EB] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap">
            Traveller:
          </span>
          {passengers.map((pass, idx) => (
            <button
              key={pass.id || idx}
              onClick={() => setSelectedPassengerIndex(idx)}
              className={cn(
                "px-2.5 py-1 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5",
                selectedPassengerIndex === idx
                  ? "bg-[#0B5ED7] text-white shadow-2xs font-bold"
                  : "bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-slate-50"
              )}
            >
              <User className="w-3 h-3" />
              <span>{pass.name}</span>
              <span className="text-[10px] opacity-80">({pass.seatNumber || `P${idx + 1}`})</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Journey Details Grid */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Passenger
          </span>
          <span className="text-sm font-bold text-[#111827] block mt-0.5 truncate">
            {currentPassenger.name}
          </span>
          <span className="text-[11px] text-[#6B7280]">
            Age: {currentPassenger.age || 32} • {currentPassenger.gender || "Adult"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Date &amp; Departure
          </span>
          <span className="text-sm font-bold text-[#111827] block mt-0.5">
            {booking.date}
          </span>
          <span className="text-[11px] text-[#0B5ED7] font-semibold">
            {booking.time || "Scheduled"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Seat / Berth
          </span>
          <span className="text-sm font-extrabold text-[#0B5ED7] block mt-0.5">
            {currentPassenger.seatNumber || booking.seatInfo || "Confirmed"}
          </span>
          <span className="text-[11px] text-[#16A34A] font-semibold">Class Confirmed</span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Gate / Platform
          </span>
          <span className="text-sm font-bold text-[#111827] block mt-0.5">
            {booking.serviceType === "flights" ? "Gate T3-14B" : booking.serviceType === "trains" ? "Platform 1" : "Bay 4"}
          </span>
          <span className="text-[11px] text-[#6B7280]">Token: {currentPassenger.gateToken || `GP-${activePassengerPnr}`}</span>
        </div>
      </div>

      {/* 4. Dual Barcode & QR Code Section */}
      <div className="p-4 sm:p-6 bg-[#F8FAFC] space-y-4">
        {/* View Switcher Pills */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-[8px] p-0.5">
            <button
              onClick={() => setActiveViewTab("pass")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer",
                activeViewTab === "pass" ? "bg-[#0B5ED7] text-white" : "text-[#4B5563] hover:text-[#111827]"
              )}
            >
              Unified Pass (Both)
            </button>
            <button
              onClick={() => setActiveViewTab("barcode_only")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer",
                activeViewTab === "barcode_only" ? "bg-[#0B5ED7] text-white" : "text-[#4B5563] hover:text-[#111827]"
              )}
            >
              1D Barcode
            </button>
            <button
              onClick={() => setActiveViewTab("qr_only")}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-colors cursor-pointer",
                activeViewTab === "qr_only" ? "bg-[#0B5ED7] text-white" : "text-[#4B5563] hover:text-[#111827]"
              )}
            >
              2D Gate QR
            </button>
          </div>

          {onOpenScanner && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenScanner}
              leftIcon={<ScanLine className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Live Scanner
            </Button>
          )}
        </div>

        {/* Dynamic Display Area */}
        {activeViewTab === "pass" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* 1D Barcode Box */}
            <div className="flex flex-col justify-between">
              <PNRBarcode
                pnr={activePassengerPnr}
                format="CODE128"
                width={2}
                height={62}
                displayValue={true}
                showControls={true}
                subtitle="High-density Code 128 for automated optical gate scanners"
              />
            </div>

            {/* 2D QR Code Box */}
            <div className="flex flex-col justify-between">
              <PNRQRCode
                pnr={activePassengerPnr}
                passengerName={currentPassenger.name}
                passengerPhone={currentPassenger.phone}
                serviceTitle={booking.title}
                serviceCategory={booking.serviceType}
                route={booking.subtitle}
                travelDate={booking.date}
                departureTime={booking.time}
                seatInfo={currentPassenger.seatNumber}
                booking={booking}
                userProfile={userProfile}
                size={130}
                showControls={true}
                onScanTest={onOpenScanner}
              />
            </div>
          </div>
        )}

        {activeViewTab === "barcode_only" && (
          <div className="max-w-md mx-auto">
            <PNRBarcode
              pnr={activePassengerPnr}
              format="CODE128"
              width={2.2}
              height={80}
              displayValue={true}
              showControls={true}
              subtitle="Full-width Code 128 laser barcode for railway turnstiles & airport kiosks"
            />
          </div>
        )}

        {activeViewTab === "qr_only" && (
          <div className="max-w-md mx-auto">
            <PNRQRCode
              pnr={activePassengerPnr}
              passengerName={currentPassenger.name}
              passengerPhone={currentPassenger.phone}
              serviceTitle={booking.title}
              serviceCategory={booking.serviceType}
              route={booking.subtitle}
              travelDate={booking.date}
              departureTime={booking.time}
              seatInfo={currentPassenger.seatNumber}
              booking={booking}
              userProfile={userProfile}
              size={180}
              showControls={true}
              onScanTest={onOpenScanner}
            />
          </div>
        )}
      </div>

      {/* 5. Advisory & Actions Footer */}
      <div className="p-4 sm:p-5 bg-white border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>IRCTC PRS &amp; DGCA DigiYatra Validated • Government ID Required at Gate</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onPrint && (
            <Button
              variant="primary"
              size="sm"
              onClick={onPrint}
              leftIcon={<Printer className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Print Boarding Pass
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
