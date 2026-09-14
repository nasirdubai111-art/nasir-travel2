import React from "react";
import { Calendar, Users, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export interface BookingSummaryProps {
  category: string;
  providerName: string;
  providerCode?: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  passengersCount: number;
  travelClass?: string;
  cancellationPolicy?: string;
  className?: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  category,
  providerName,
  providerCode,
  origin,
  destination,
  departureDate,
  returnDate,
  departureTime,
  arrivalTime,
  duration,
  passengersCount,
  travelClass,
  cancellationPolicy = "Free Cancellation available up to 24h prior",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-[12px] p-4 sm:p-5 shadow-xs text-left",
        className
      )}
    >
      {/* Header: Provider & Category */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
        <div>
          <span className="text-[11px] font-bold text-[#0B5ED7] uppercase tracking-wider block">
            {category}
          </span>
          <h4 className="text-sm font-bold text-[#111827] mt-0.5">
            {providerName} {providerCode ? `(${providerCode})` : ""}
          </h4>
        </div>
        <Badge variant="confirmed">Verified Service</Badge>
      </div>

      {/* Itinerary Row: Origin -> Destination */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Origin */}
          <div className="flex-1">
            {departureTime && (
              <span className="text-base font-extrabold text-[#111827] block">
                {departureTime}
              </span>
            )}
            <span className="text-xs font-semibold text-[#4B5563] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#0B5ED7]" />
              {origin}
            </span>
          </div>

          {/* Route Arrow / Duration */}
          {duration && (
            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] text-[#6B7280] font-medium">{duration}</span>
              <div className="w-16 h-px bg-[#0B5ED7] relative my-1">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0B5ED7]" />
              </div>
              <span className="text-[9px] text-[#16A34A] font-semibold">Direct</span>
            </div>
          )}

          {/* Destination */}
          <div className="flex-1 text-right">
            {arrivalTime && (
              <span className="text-base font-extrabold text-[#111827] block">
                {arrivalTime}
              </span>
            )}
            <span className="text-xs font-semibold text-[#4B5563] flex items-center justify-end gap-1 mt-0.5">
              {destination}
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
            </span>
          </div>
        </div>

        {/* Travel Info Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-[6px] border border-[#E5E7EB]">
            <Calendar className="w-3.5 h-3.5 text-[#0B5ED7]" />
            <span>{departureDate} {returnDate ? `- ${returnDate}` : ""}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-[6px] border border-[#E5E7EB]">
            <Users className="w-3.5 h-3.5 text-[#0B5ED7]" />
            <span>{passengersCount} {passengersCount === 1 ? "Traveller" : "Travellers"}</span>
          </div>

          {travelClass && (
            <div className="bg-[#E7F1FF] text-[#0B5ED7] font-semibold px-2.5 py-1 rounded-[6px]">
              {travelClass}
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Policy Footer */}
      {cancellationPolicy && (
        <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-2 text-[11px] text-[#16A34A] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{cancellationPolicy}</span>
        </div>
      )}
    </div>
  );
};
