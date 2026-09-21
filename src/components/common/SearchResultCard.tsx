import React from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Star,
  MapPin,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ServiceCategory } from "../../types";

export interface SearchResultCardProps {
  id: string;
  category: ServiceCategory;
  title: string;
  subtitle?: string;
  badge?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  operator?: string;
  rating?: number;
  amenities?: string[];
  price: number;
  originalPrice?: number;
  seatsLeft?: number;
  onSelect: () => void;
  actionLabel?: string;
}

export function SearchResultCard({
  id,
  category,
  title,
  subtitle,
  badge,
  origin,
  destination,
  departureTime,
  arrivalTime,
  duration,
  operator,
  rating,
  amenities = [],
  price,
  originalPrice,
  seatsLeft,
  onSelect,
  actionLabel = "Select",
}: SearchResultCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DD] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Main Details */}
      <div className="space-y-3 flex-1">
        {/* Badges & Operator */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {operator && (
            <span className="font-bold text-[#1B4332] bg-[#E8F5E9] px-2.5 py-0.5 rounded-lg border border-[#C8E6C9]">
              {operator}
            </span>
          )}
          {badge && (
            <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#2D6A4F] font-semibold border border-[#E8E5DD]">
              {badge}
            </span>
          )}
          {rating && (
            <div className="flex items-center gap-1 text-[#2D6A4F] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#2D6A4F] text-[#2D6A4F]" />
              <span>{rating}</span>
            </div>
          )}
          {seatsLeft !== undefined && seatsLeft <= 5 && (
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Only {seatsLeft} left!
            </span>
          )}
        </div>

        {/* Title / Route */}
        <div>
          <h4 className="font-bold text-base text-[#1B4332]">{title}</h4>
          {subtitle && <p className="text-xs text-[#526356] mt-0.5">{subtitle}</p>}
        </div>

        {/* Schedule Strip (if origin/dest & timings provided) */}
        {departureTime && arrivalTime ? (
          <div className="flex items-center gap-3 text-xs text-[#2D3A30] bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E8E5DD] max-w-md">
            <div>
              <span className="font-extrabold text-sm text-[#1B4332]">{departureTime}</span>
              {origin && <span className="block text-[11px] text-[#6A786E]">{origin}</span>}
            </div>

            <div className="flex-1 flex flex-col items-center px-2">
              {duration && <span className="text-[10px] text-[#6A786E] font-medium">{duration}</span>}
              <div className="w-full h-0.5 bg-[#CBD5E1] relative my-1">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
              </div>
            </div>

            <div className="text-right">
              <span className="font-extrabold text-sm text-[#1B4332]">{arrivalTime}</span>
              {destination && <span className="block text-[11px] text-[#6A786E]">{destination}</span>}
            </div>
          </div>
        ) : null}

        {/* Amenities Highlights */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] text-[#4B584E] bg-[#F4F1EA] px-2 py-0.5 rounded font-medium flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-[#2D6A4F]" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pricing & Booking CTA */}
      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0EDE6] gap-3 shrink-0">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#6A786E] font-semibold block">
            Per Passenger
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#1B4332]">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-xs text-[#8A94A6] line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium block">Taxes & GST included</span>
        </div>

        <button
          type="button"
          onClick={onSelect}
          className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
