import React from "react";
import { Star, MapPin, Clock, Calendar, ArrowRight } from "lucide-react";

export interface DestinationCardProps {
  id: string;
  name: string;
  state: string;
  tagline?: string;
  coverImage: string;
  rating?: number;
  reviewsCount?: number;
  idealDuration?: string;
  bestTimeToVisit?: string;
  startingPrice?: number;
  tags?: string[];
  onSelect?: () => void;
  onBook?: () => void;
}

export function DestinationCard({
  id,
  name,
  state,
  tagline,
  coverImage,
  rating = 4.8,
  reviewsCount = 1240,
  idealDuration = "3-4 Days",
  bestTimeToVisit = "Oct - Mar",
  startingPrice = 4999,
  tags = [],
  onSelect,
  onBook,
}: DestinationCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-[#E8E5DD] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#2D6A4F]/40 transition-all duration-300 flex flex-col justify-between">
      {/* Visual Image Header & Rating */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#E8E5DD]">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Soft natural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081C15]/80 via-[#081C15]/20 to-transparent" />

        {/* State / Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-[#1B4332]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
            {state}
          </span>
        </div>

        {/* Rating and Destination Name overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">
              {name}
            </h3>
            {tagline && (
              <p className="text-xs text-white/90 line-clamp-1 font-medium mt-0.5">
                {tagline}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-[10px] text-white/80 font-normal">({reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2 text-xs text-[#4B584E] bg-[#FAF9F5] p-2.5 rounded-xl border border-[#F0EDE6]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
            <span className="truncate">{idealDuration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
            <span className="truncate">{bestTimeToVisit}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B4332] text-[10px] font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#F0EDE6] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-[#6A786E] uppercase tracking-wider block">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#1B4332]">
                ₹{startingPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#6A786E]">/ person</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBook || onSelect}
            className="px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
