import React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  startingPrice?: number | string;
  offerBadge?: string;
  ctaText?: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  imageUrl,
  startingPrice,
  offerBadge,
  ctaText = "Explore",
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] rounded-[12px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden text-left",
        className
      )}
    >
      {/* Top section: Icon/Image + Offer Badge */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          {imageUrl ? (
            <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-slate-100 shrink-0">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ) : icon ? (
            <div className="w-11 h-11 rounded-[8px] bg-[#E7F1FF] text-[#0B5ED7] flex items-center justify-center shrink-0 group-hover:bg-[#0B5ED7] group-hover:text-white transition-colors duration-200">
              {icon}
            </div>
          ) : null}

          {offerBadge && (
            <Badge variant="offer" size="sm">
              {offerBadge}
            </Badge>
          )}
        </div>

        {/* Title and description */}
        <h4 className="text-sm sm:text-base font-bold text-[#111827] group-hover:text-[#0B5ED7] transition-colors line-clamp-1">
          {title}
        </h4>
        <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom section: Price & CTA */}
      <div className="pt-4 mt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-2 text-xs">
        {startingPrice ? (
          <div>
            <span className="text-[10px] text-[#6B7280] block">Starting from</span>
            <span className="text-sm font-extrabold text-[#111827]">
              {typeof startingPrice === "number" ? `₹${startingPrice.toLocaleString("en-IN")}` : startingPrice}
            </span>
          </div>
        ) : (
          <span className="text-xs text-[#6B7280] font-medium">All verified routes</span>
        )}

        <div className="flex items-center gap-1 font-bold text-[#0B5ED7] group-hover:translate-x-0.5 transition-transform">
          <span>{ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
