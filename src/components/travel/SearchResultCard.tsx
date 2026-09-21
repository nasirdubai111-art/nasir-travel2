import React from "react";
import { Star, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface SearchResultCardProps {
  id: string;
  providerLogo?: string;
  providerName: string;
  serviceNumber?: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  duration: string;
  stops?: string;
  amenities?: string[];
  rating?: number;
  reviewsCount?: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  seatsAvailable?: number;
  cancellationText?: string;
  onBookNow: () => void;
  ctaLabel?: string;
  className?: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  providerLogo,
  providerName,
  serviceNumber,
  departureTime,
  arrivalTime,
  origin,
  destination,
  duration,
  stops = "Direct",
  amenities = [],
  rating,
  reviewsCount,
  price,
  originalPrice,
  discountPercentage,
  seatsAvailable,
  cancellationText = "Free Cancellation till 24h before departure",
  onBookNow,
  ctaLabel = "Book Now",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#E8E5DD] hover:border-[#2D6A4F] rounded-[12px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 text-left",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Provider & Identification Column */}
        <div className="lg:col-span-3 flex items-center gap-3">
          {providerLogo ? (
            <div className="w-10 h-10 rounded-[8px] bg-slate-50 border border-[#E8E5DD] overflow-hidden flex items-center justify-center p-1 shrink-0">
              <img src={providerLogo} alt={providerName} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-[8px] bg-emerald-50 text-[#1B4332] font-bold text-xs flex items-center justify-center shrink-0">
              {providerName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-[#111827] line-clamp-1">{providerName}</h4>
            {serviceNumber && (
              <span className="text-[11px] text-[#6B7280] font-mono">{serviceNumber}</span>
            )}
            {rating && (
              <div className="flex items-center gap-1 mt-0.5 text-xs">
                <span className="flex items-center gap-0.5 bg-[#DCFCE7] text-[#16A34A] font-bold px-1.5 py-0.2 rounded text-[11px]">
                  <Star className="w-3 h-3 fill-current" />
                  {rating.toFixed(1)}
                </span>
                {reviewsCount && (
                  <span className="text-[10px] text-[#6B7280]">({reviewsCount})</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Route Column */}
        <div className="lg:col-span-5 flex items-center justify-between gap-2 sm:gap-4 px-0 sm:px-2">
          {/* Departure */}
          <div>
            <span className="text-base sm:text-lg font-extrabold text-[#111827] block">
              {departureTime}
            </span>
            <span className="text-xs text-[#4B5563] font-medium">{origin}</span>
          </div>

          {/* Duration Graphic */}
          <div className="flex flex-col items-center flex-1 max-w-[120px]">
            <span className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#9CA3AF]" />
              {duration}
            </span>
            <div className="w-full h-px bg-[#CBD5E1] relative my-1.5">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
            </div>
            <span className="text-[10px] text-[#16A34A] font-semibold">{stops}</span>
          </div>

          {/* Arrival */}
          <div className="text-right">
            <span className="text-base sm:text-lg font-extrabold text-[#111827] block">
              {arrivalTime}
            </span>
            <span className="text-xs text-[#4B5563] font-medium">{destination}</span>
          </div>
        </div>

        {/* Pricing & CTA Column */}
        <div className="lg:col-span-4 flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F3F4F6]">
          <div className="text-left lg:text-right">
            <div className="flex items-baseline gap-1.5 lg:justify-end">
              <span className="text-lg sm:text-xl font-extrabold text-[#111827]">
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-[#9CA3AF] line-through">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {discountPercentage && (
              <Badge variant="offer" size="sm" className="mt-0.5">
                {discountPercentage}% OFF
              </Badge>
            )}

            {seatsAvailable !== undefined && (
              <span className="text-[10px] text-[#D97706] font-medium block mt-1">
                {seatsAvailable <= 5 ? `Only ${seatsAvailable} seats left!` : `${seatsAvailable} seats available`}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onBookNow}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>

      {/* Footer Features & Amenities */}
      <div className="pt-3 mt-3 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="text-[11px] text-[#4B5563]">{cancellationText}</span>
        </div>

        {amenities.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            {amenities.slice(0, 4).map((amenity, idx) => (
              <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-[4px]">
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
