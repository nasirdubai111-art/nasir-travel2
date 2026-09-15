import React, { useState } from "react";
import {
  Search,
  Barcode,
  QrCode,
  ScanLine,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import { PNRBarcode } from "./PNRBarcode";
import { PNRQRCode } from "./PNRQRCode";
import { PNRBarcodeQRPass } from "./PNRBarcodeQRPass";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { BookingItem, UserProfile } from "../../types";

export interface PNRLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  userProfile?: UserProfile;
  onOpenScanner?: () => void;
}

export const PNRLookupModal: React.FC<PNRLookupModalProps> = ({
  isOpen,
  onClose,
  bookings,
  userProfile,
  onOpenScanner,
}) => {
  const [searchPnr, setSearchPnr] = useState<string>("");
  const [activeBooking, setActiveBooking] = useState<BookingItem | null>(
    bookings[0] || null
  );

  const demoPnrs = [
    { pnr: "BY-FL-2041", title: "IndiGo 6E-2041 (DEL ➔ BOM)", type: "flights" },
    { pnr: "BY-TR-22436", title: "Vande Bharat Express (NDLS ➔ BSB)", type: "trains" },
    { pnr: "BY-BS-9600", title: "Volvo 9600 AC Sleeper (DEL ➔ MANALI)", type: "buses" },
    { pnr: "BY-HT-8841", title: "Taj Lake Palace Udaipur Luxury Suite", type: "hotels" },
  ];

  const handleLookup = () => {
    const term = searchPnr.trim().toUpperCase();
    if (!term) return;

    // Check if matches an existing booking
    const found = bookings.find(
      (b) =>
        b.pnr?.toUpperCase() === term ||
        b.id.toUpperCase().includes(term) ||
        b.title.toUpperCase().includes(term)
    );

    if (found) {
      setActiveBooking(found);
    } else {
      // Create a virtual verified booking representation
      const virtual: BookingItem = {
        id: `BK-VIRTUAL-${term}`,
        pnr: term,
        serviceType: term.includes("FL") ? "flights" : term.includes("TR") ? "trains" : "buses",
        title: `National Rail / Air Reservation (${term})`,
        subtitle: "Verified Indian PRS Transit Booking",
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        time: "07:30 AM",
        seatInfo: "Coach B4 • Berth 28 (Side Lower)",
        passengers: 1,
        amount: 2450,
        status: "confirmed",
      };
      setActiveBooking(virtual);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PNR Barcode & QR Digital Pass Center"
      description="Instant 1D Barcode & 2D Gate QR verification for IRCTC, Airline, and Roadway passes."
      maxWidth="xl"
    >
      <div className="space-y-5 text-left">
        {/* Search Bar & Scanner Launch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter 10-digit PNR, Booking ID, or Sub-PNR (e.g. BY-TR-22436)..."
              value={searchPnr}
              onChange={(e) => setSearchPnr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Button
            variant="primary"
            onClick={handleLookup}
            className="sm:w-auto font-bold"
          >
            Lookup Pass
          </Button>

          {onOpenScanner && (
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                onOpenScanner();
              }}
              leftIcon={<ScanLine className="w-4 h-4 text-[#0B5ED7]" />}
            >
              Scan Ticket
            </Button>
          )}
        </div>

        {/* Quick Demo PNR Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#6B7280] whitespace-nowrap">
            Recent / Samples:
          </span>
          {demoPnrs.map((item) => (
            <button
              key={item.pnr}
              onClick={() => {
                setSearchPnr(item.pnr);
                const found = bookings.find((b) => b.pnr === item.pnr);
                if (found) {
                  setActiveBooking(found);
                } else {
                  setActiveBooking({
                    id: `BK-${item.pnr}`,
                    pnr: item.pnr,
                    serviceType: item.type as any,
                    title: item.title,
                    subtitle: "Confirmed Multi-Modal Reservation",
                    date: "18 Oct 2026",
                    time: "06:45 AM",
                    seatInfo: "Seat 14A • Window",
                    passengers: 1,
                    amount: 3200,
                    status: "confirmed",
                  });
                }
              }}
              className="px-2.5 py-1 rounded-[6px] bg-slate-100 hover:bg-[#E7F1FF] hover:text-[#0B5ED7] border border-[#E5E7EB] text-[#4B5563] text-[11px] font-mono font-bold whitespace-nowrap transition-colors cursor-pointer"
            >
              {item.pnr}
            </button>
          ))}
        </div>

        {/* Active Boarding Pass Preview */}
        {activeBooking && (
          <div className="pt-2">
            <PNRBarcodeQRPass
              booking={activeBooking}
              userProfile={userProfile}
              onPrint={() => window.print()}
              onOpenScanner={onOpenScanner}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
