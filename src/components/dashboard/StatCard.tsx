import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. +12.5% or -4%
  changePeriod?: string; // e.g. "vs last month"
  icon?: React.ReactNode;
  subtitle?: string;
  colorVariant?: "primary" | "secondary" | "accent" | "success" | "warning";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePeriod = "vs last month",
  icon,
  subtitle,
  colorVariant = "primary",
  className,
}) => {
  const iconBackgrounds = {
    primary: "bg-[#E7F1FF] text-[#0B5ED7]",
    secondary: "bg-[#CCFBF1] text-[#14B8A6]",
    accent: "bg-[#FEF3C7] text-[#F59E0B]",
    success: "bg-[#DCFCE7] text-[#16A34A]",
    warning: "bg-[#FEF3C7] text-[#D97706]",
  };

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] rounded-[12px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-1 tracking-tight">
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className={cn(
              "w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0",
              iconBackgrounds[colorVariant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between gap-2 text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5 font-semibold">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] text-[11px]",
                isPositive
                  ? "bg-[#DCFCE7] text-[#16A34A]"
                  : isNegative
                  ? "bg-[#FEE2E2] text-[#DC2626]"
                  : "bg-slate-100 text-[#6B7280]"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : isNegative ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-[#6B7280]">{changePeriod}</span>
          </div>
        ) : subtitle ? (
          <span className="text-[#6B7280]">{subtitle}</span>
        ) : (
          <span className="text-[#16A34A] font-semibold">Real-time sync</span>
        )}
      </div>
    </div>
  );
};
