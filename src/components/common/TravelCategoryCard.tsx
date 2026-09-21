import React from "react";
import {
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Sparkles,
  Palmtree,
  Ship,
  Compass,
  Landmark,
  Car,
  UtensilsCrossed,
  Briefcase,
  LucideIcon,
} from "lucide-react";
import { ServiceCategory } from "../../types";

const ICON_MAP: Record<string, LucideIcon> = {
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Sparkles,
  Palmtree,
  Ship,
  Compass,
  Landmark,
  Car,
  UtensilsCrossed,
  Briefcase,
};

export interface TravelCategoryCardProps {
  id: ServiceCategory;
  name: string;
  hindiName?: string;
  tagline?: string;
  iconName: string;
  badge?: string;
  isActive: boolean;
  highlightText?: string;
  onClick: () => void;
  variant?: "hero" | "grid" | "compact";
}

export function TravelCategoryCard({
  id,
  name,
  hindiName,
  tagline,
  iconName,
  badge,
  isActive,
  highlightText,
  onClick,
  variant = "grid",
}: TravelCategoryCardProps) {
  const IconComponent = ICON_MAP[iconName] || Sparkles;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
          isActive
            ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm shadow-[#1B4332]/20 font-bold"
            : "bg-[#FCFBF7] text-[#2D3A30] border-[#E8E5DD] hover:border-[#2D6A4F] hover:bg-[#F2EFE9]"
        }`}
      >
        <IconComponent className={`w-4 h-4 ${isActive ? "text-emerald-300" : "text-[#2D6A4F]"}`} />
        <span>{name}</span>
        {badge && (
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
              isActive ? "bg-white/20 text-white" : "bg-[#E8F5E9] text-[#1B4332]"
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border select-none flex flex-col justify-between ${
        isActive
          ? "bg-[#1B4332] text-white border-[#1B4332] shadow-lg shadow-[#1B4332]/20 translate-y-[-2px]"
          : "bg-white text-[#1F2922] border-[#E8E5DD] hover:border-[#2D6A4F] hover:shadow-md hover:translate-y-[-2px]"
      }`}
    >
      {badge && (
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isActive
              ? "bg-white/20 text-emerald-200 border border-white/20"
              : "bg-[#E8F5E9] text-[#1B4332] border border-[#C8E6C9]"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            isActive
              ? "bg-white/15 text-white"
              : "bg-[#F0F7F2] text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white"
          }`}
        >
          <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </div>

        <div>
          <h3 className={`font-bold text-sm leading-tight ${isActive ? "text-white" : "text-[#1B4332]"}`}>
            {name}
          </h3>
          {hindiName && (
            <p className={`text-[11px] font-medium mt-0.5 ${isActive ? "text-emerald-200/80" : "text-[#6A786E]"}`}>
              {hindiName}
            </p>
          )}
        </div>
      </div>

      {tagline && (
        <p
          className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
            isActive ? "text-slate-100/90" : "text-[#4B584E]"
          }`}
        >
          {tagline}
        </p>
      )}

      {highlightText && (
        <div
          className={`mt-3 pt-2.5 border-t text-[11px] font-medium flex items-center justify-between ${
            isActive
              ? "border-white/15 text-emerald-200"
              : "border-[#F0EDE6] text-[#2D6A4F]"
          }`}
        >
          <span>{highlightText}</span>
          <span className="font-bold opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
            ➔
          </span>
        </div>
      )}
    </div>
  );
}
