import React from "react";
import {
  Ticket,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Share2,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { BookingItem } from "../../types";

export interface TripCardProps {
  booking: BookingItem;
  onViewTicket?: (booking: BookingItem) => void;
  onCancelBooking?: (bookingId: string) => void;
  onSplitBill?: (booking: BookingItem) => void;
}

export function TripCard({
  booking,
  onViewTicket,
  onCancelBooking,
  onSplitBill,
}: TripCardProps) {
  const isConfirmed = booking.status === "confirmed";
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DD] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-[#E8F5E9] text-[#1B4332] text-xs font-bold uppercase tracking-wider border border-[#C8E6C9]">
              {booking.category.toUpperCase()}
            </span>

            {isConfirmed && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Confirmed</span>
              </span>
            )}

            {isCancelled && (
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[11px] font-bold flex items-center gap-1 border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" />
                <span>Cancelled &amp; Refunded</span>
              </span>
            )}
          </div>

          <h4 className="font-bold text-base text-[#1B4332] pt-1">{booking.title}</h4>
          {booking.pnr && (
            <p className="text-xs text-[#526356] font-mono font-medium">
              PNR / Ref: <span className="font-bold text-[#1B4332]">{booking.pnr}</span>
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#6A786E] block font-medium">
            Paid Amount
          </span>
          <span className="text-base font-black text-[#1B4332]">
            ₹{booking.amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Date & Details */}
      <div className="flex items-center justify-between text-xs text-[#4B584E] bg-[#FAF9F5] p-3 rounded-xl border border-[#F0EDE6]">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>Date: {booking.date}</span>
        </div>
        <div className="text-[#6A786E]">
          <span>Booking #{booking.id.slice(-6)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onViewTicket && (
            <button
              type="button"
              onClick={() => onViewTicket(booking)}
              className="px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-300" />
              <span>Digital Ticket</span>
            </button>
          )}

          {onSplitBill && isConfirmed && (
            <button
              type="button"
              onClick={() => onSplitBill(booking)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E8F5E9] text-[#1B4332] border border-[#E8E5DD] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-[#2D6A4F]" />
              <span>Split Bill</span>
            </button>
          )}
        </div>

        {isConfirmed && onCancelBooking && (
          <button
            type="button"
            onClick={() => onCancelBooking(booking.id)}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Cancel Trip
          </button>
        )}
      </div>
    </div>
  );
}
