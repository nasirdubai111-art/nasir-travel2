import React, { useMemo } from "react";
import {
  Calendar,
  Sparkles,
  TrendingDown,
  ChevronRight,
  Info,
  Check,
  Zap,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { PriceWatchTransportType, AlternativeDateOption } from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";

interface SmartAlternativeDatesBarProps {
  originCode: string;
  originCity?: string;
  destinationCode: string;
  destinationCity?: string;
  selectedDate: string; // YYYY-MM-DD
  currentPrice: number;
  transportType?: PriceWatchTransportType;
  carrierName?: string;
  onSelectDate: (newDate: string) => void;
  onOpenPriceWatch?: () => void;
  className?: string;
}

export function SmartAlternativeDatesBar({
  originCode,
  originCity,
  destinationCode,
  destinationCity,
  selectedDate,
  currentPrice,
  transportType = "flight",
  carrierName,
  onSelectDate,
  onOpenPriceWatch,
  className = "",
}: SmartAlternativeDatesBarProps) {
  // Generate the flexible alternative dates matrix (+/- 3 days)
  const alternativeDates = useMemo(() => {
    return PriceWatchService.generateAlternativeDates(
      originCode,
      destinationCode,
      selectedDate,
      currentPrice,
      transportType,
      carrierName
    );
  }, [originCode, destinationCode, selectedDate, currentPrice, transportType, carrierName]);

  // Find the cheapest date
  const bestDate = useMemo(() => {
    if (!alternativeDates || alternativeDates.length === 0) return null;
    const sorted = [...alternativeDates].sort((a, b) => b.savingsAmount - a.savingsAmount);
    return sorted[0]?.savingsAmount > 0 ? sorted[0] : null;
  }, [alternativeDates]);

  if (!alternativeDates || alternativeDates.length === 0) {
    return null;
  }

  return (
    <div
      id="smart-alternative-dates-bar"
      className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 ${className}`}
    >
      {/* Top Banner / Insight Heading */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black text-slate-800">
              Flexible Dates Fare Tracker
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              (±3 Days Alternative Fares)
            </span>
          </div>
        </div>

        {bestDate && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200/60 shadow-xs">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Save up to ₹{bestDate.savingsAmount.toLocaleString("en-IN")} (-{bestDate.savingsPercent}%) on {bestDate.formattedDate}
            </span>
          </div>
        )}
      </div>

      {/* Date Options Matrix Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {alternativeDates.map((opt) => {
          const isSelected = opt.date === selectedDate;
          const isBest = opt.status === "cheapest";
          const isPeak = opt.status === "peak";

          let cardStyle = "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300";
          let badgeStyle = "bg-slate-200 text-slate-700";

          if (isSelected) {
            cardStyle = "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20";
            badgeStyle = "bg-indigo-600 text-white";
          } else if (isBest) {
            cardStyle = "border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-600";
            badgeStyle = "bg-emerald-600 text-white animate-pulse";
          } else if (opt.savingsPercent >= 10) {
            cardStyle = "border-teal-300 bg-teal-50/30 hover:bg-teal-50";
            badgeStyle = "bg-teal-600 text-white";
          } else if (isPeak) {
            cardStyle = "border-rose-200 bg-rose-50/20 hover:bg-rose-50/40";
            badgeStyle = "bg-rose-100 text-rose-700";
          }

          return (
            <button
              key={opt.date}
              type="button"
              onClick={() => onSelectDate(opt.date)}
              className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${cardStyle}`}
            >
              {/* Top Row: Day & Date */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {opt.dayOfWeek.substring(0, 3)}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {opt.formattedDate.split(", ")[1] || opt.date}
                  </span>
                </div>

                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Price & Savings */}
              <div className="space-y-0.5 mt-auto">
                <div className="text-sm font-black text-slate-900">
                  ₹{opt.price.toLocaleString("en-IN")}
                </div>

                {isBest ? (
                  <div className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5" />
                    <span>Best Fare (-{opt.savingsPercent}%)</span>
                  </div>
                ) : opt.savingsAmount > 0 ? (
                  <div className="text-[9px] font-bold text-teal-600">
                    Save ₹{opt.savingsAmount.toLocaleString("en-IN")}
                  </div>
                ) : isPeak ? (
                  <div className="text-[9px] font-medium text-rose-600">
                    Peak Fare (+{Math.abs(opt.savingsPercent)}%)
                  </div>
                ) : isSelected ? (
                  <div className="text-[9px] font-semibold text-indigo-600">
                    Active Search
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-400">Regular Tariff</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Notes & Price Watch CTA */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>
            {bestDate
              ? `Alternative date recommendation: ${bestDate.dayOfWeek} departures typically yield off-peak airline seat buckets.`
              : "Prices reflect live fare projections based on historical seat yield and weekday demand."}
          </span>
        </div>

        {onOpenPriceWatch && (
          <button
            type="button"
            onClick={onOpenPriceWatch}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Price Watch</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
