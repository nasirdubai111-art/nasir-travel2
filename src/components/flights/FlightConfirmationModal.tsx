import React from "react";
import {
  X,
  CheckCircle2,
  Download,
  Share2,
  Plane,
  Calendar,
  Clock,
  Luggage,
  QrCode,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { FlightExtendedDeal } from "../../data/flightData";
import { FlightTraveller } from "../../types";
import { ETicketQRCodeGenerator } from "../tickets/ETicketQRCodeGenerator";

interface FlightConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal;
  pnr: string;
  ticketNumber: string;
  bookingDate: string;
  travellers: Array<{
    name: string;
    type: string;
    seat: string;
    meal: string;
    baggage: string;
  }>;
  fareTier: string;
  totalPaid: number;
  paymentMode: string;
  onTrackStatus?: () => void;
}

export function FlightConfirmationModal({
  isOpen,
  onClose,
  flight,
  pnr,
  ticketNumber,
  bookingDate,
  travellers,
  fareTier,
  totalPaid,
  paymentMode,
  onTrackStatus,
}: FlightConfirmationModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="printable-eticket-sheet printable-document bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
        {/* Header Success Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-6 text-white text-center relative overflow-hidden shrink-0">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/30">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-xs uppercase tracking-widest font-black text-emerald-100 block">
            Booking Confirmed &amp; E-Ticket Issued
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Have a Wonderful Flight!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Official airline PNR generated and digital boarding pass dispatched to your email &amp; WhatsApp.
          </p>

          <button
            onClick={onClose}
            className="no-print absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close e-ticket modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* E-Ticket Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Flight Pass */}
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-slate-50 relative overflow-hidden space-y-6 shadow-inner">
            {/* Airline and PNR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2">
                  <Plane className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-lg">{flight.airline}</h3>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Aircraft: {flight.aircraft}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Official PNR</span>
                <span className="text-2xl font-black font-mono text-sky-700 tracking-widest">{pnr}</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Status: Confirmed / GDS Ticketed</span>
              </div>
            </div>

            {/* Origin & Destination Schedule */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center text-center">
              <div className="text-left space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900">{flight.fromCode}</span>
                <div className="text-xs sm:text-sm font-bold text-slate-700">{flight.fromCity}</div>
                <div className="text-xs font-mono text-slate-500">{flight.departTime} • {flight.terminalDep}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{flight.duration}</span>
                <div className="w-full h-0.5 bg-slate-300 relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-sky-600 absolute" />
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block">{flight.stops}</span>
              </div>

              <div className="text-right space-y-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900">{flight.toCode}</span>
                <div className="text-xs sm:text-sm font-bold text-slate-700">{flight.toCity}</div>
                <div className="text-xs font-mono text-slate-500">{flight.arriveTime} • {flight.terminalArr}</div>
              </div>
            </div>

            {/* Flight Operational Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Date of Travel</span>
                <span className="font-extrabold text-slate-900">{bookingDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure Terminal</span>
                <span className="font-extrabold text-slate-900">{flight.terminalDep}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fare Class</span>
                <span className="font-extrabold text-sky-700 capitalize">{fareTier}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">E-Ticket No.</span>
                <span className="font-extrabold font-mono text-slate-900">{ticketNumber}</span>
              </div>
            </div>

            {/* Passenger Manifest Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirmed Passengers ({travellers.length})
              </span>
              <div className="space-y-2">
                {travellers.map((traveller, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{traveller.name}</span>
                      <span className="text-slate-400 ml-2">({traveller.type})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono font-bold">
                        Seat: {traveller.seat || "Auto-assigned"}
                      </span>
                      <span className="text-slate-600">{traveller.meal || "No special meal"}</span>
                      <span className="text-emerald-700 font-bold">{traveller.baggage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encoded E-Ticket QR Code & Security Stamp */}
            <div className="pt-4 border-t border-slate-200 text-xs">
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 bg-indigo-50/40 text-center flex flex-col items-center">
                <ETicketQRCodeGenerator
                  pnr={pnr}
                  ticketNumber={ticketNumber}
                  serviceTitle={`${flight.airline} ${flight.flightNumber}`}
                  serviceType="flights"
                  route={`${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})`}
                  passengerName={travellers[0]?.name || "Lead Passenger"}
                  date={bookingDate}
                  time={flight.departTime}
                  seatInfo={travellers.map(t => `${t.name}: ${t.seat || "Auto"}`).join(", ") || "Confirmed"}
                  terminal={flight.terminalDep}
                  gateOrPlatform={`${flight.terminalDep} • DigiYatra Gate`}
                  size={140}
                  showDetails={true}
                  showQuickVerifyButton={true}
                />
                <div className="w-full mt-3 h-6 bg-slate-200/80 rounded flex items-center justify-center font-mono text-[10px] text-slate-700 tracking-widest select-none">
                  ||||| | |||| |||||| || | |||| |||||| ||||
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono">
                  <span>BCBP STANDARD • IATA ENCODED • AIRLINE PNR: <strong>{pnr}</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-xs">Total Paid: </span>
                  <span className="text-base font-black text-slate-900">₹{totalPaid.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-slate-400 block">via {paymentMode}</span>
                </div>
              </div>
            </div>

            {/* Travel Advisory & Passenger Guidelines (Rendered cleanly on printed e-ticket) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-200 text-[10px] text-slate-600 print-break-inside-avoid">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block uppercase text-[9px]">Airport Reporting</span>
                <span>Reach airport 2h prior for domestic, 3h for international. Gates close 25m prior to departure.</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block uppercase text-[9px]">Govt Photo ID</span>
                <span>Carry original Govt Photo ID (Aadhaar / Passport / Voter ID) for terminal check-in.</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block uppercase text-[9px]">Support & Helpline</span>
                <span>24x7 BharatYatra: 1800-102-8747 • DGCA AirSewa Compliant Carrier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="no-print bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onTrackStatus}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Plane className="w-4 h-4 text-sky-600" />
            <span>Track Flight Status</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
