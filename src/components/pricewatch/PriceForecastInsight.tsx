import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  Calendar,
  Ticket,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Zap,
  Plane,
  Train,
  ChevronRight,
  BarChart3,
  Info,
  Layers,
} from "lucide-react";
import { WatchedRoute, RoutePriceForecast, DayForecastPoint } from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";

interface PriceForecastInsightProps {
  route: WatchedRoute;
  allRoutes?: WatchedRoute[];
  onSelectRoute?: (route: WatchedRoute) => void;
  onBookRoute?: (route: WatchedRoute) => void;
  onSetTargetAlert?: (route: WatchedRoute, targetPrice: number) => void;
  compact?: boolean;
}

export function PriceForecastInsight({
  route,
  allRoutes,
  onSelectRoute,
  onBookRoute,
  onSetTargetAlert,
  compact = false,
}: PriceForecastInsightProps) {
  const forecast: RoutePriceForecast = PriceWatchService.getRouteForecast(route);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1);
  const [showSignalDetails, setShowSignalDetails] = useState<boolean>(false);

  const isBuyNow = forecast.recommendation === "buy_now";
  const isWait = forecast.recommendation === "wait_for_drop";
  const isFair = forecast.recommendation === "fair_price";

  const selectedDay =
    forecast.dailyTrajectory.find((d) => d.dayOffset === selectedDayOffset) ||
    forecast.dailyTrajectory[0];

  // Helper for signal icon
  const getSignalIcon = (iconType?: string) => {
    switch (iconType) {
      case "flame":
        return <Flame className="w-4 h-4 text-amber-500" />;
      case "clock":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "calendar":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case "ticket":
        return <Ticket className="w-4 h-4 text-emerald-500" />;
      case "shield":
        return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
  };

  // Compact card view for embedding directly in list items
  if (compact) {
    return (
      <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-xl border border-[#E2E8F0] space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#0B5ED7]/10 text-[#0B5ED7] flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B5ED7] block">
                7-Day Price Forecast
              </span>
              <span className="text-xs font-bold text-[#172033]">
                {forecast.recommendationTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${
                isBuyNow
                  ? "bg-emerald-50 text-[#16A34A] border-emerald-200"
                  : isWait
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-[#0B5ED7] border-blue-200"
              }`}
            >
              {isBuyNow && "⚡ Strong Buy"}
              {isWait && "⏳ Wait for Drop"}
              {isFair && "✓ Fair Value"}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
              {forecast.confidenceScore}% Confidence
            </span>
          </div>
        </div>

        {/* Micro 7-day sparkline / day pill strip */}
        <div className="grid grid-cols-7 gap-1 pt-1">
          {forecast.dailyTrajectory.map((point) => {
            const isRising = point.trend === "up";
            const isDropping = point.trend === "down";
            return (
              <div
                key={point.dayOffset}
                className={`p-1.5 rounded-lg text-center border transition-all ${
                  point.dayOffset === 1
                    ? "bg-white border-[#0B5ED7] shadow-2xs"
                    : "bg-white/80 border-[#E2E8F0]"
                }`}
                title={`Day +${point.dayOffset} (${point.dayLabel}): ₹${point.predictedPrice.toLocaleString("en-IN")} • ${point.note}`}
              >
                <span className="text-[9px] font-bold text-[#64748B] block truncate">
                  +{point.dayOffset}d
                </span>
                <span className="text-[11px] font-extrabold text-[#172033] block">
                  ₹{Math.round(point.predictedPrice / 100) * 100 >= 1000 ? `${Math.round(point.predictedPrice / 1000)}k` : point.predictedPrice}
                </span>
                <span
                  className={`text-[9px] font-bold flex items-center justify-center ${
                    isRising ? "text-rose-600" : isDropping ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {isRising ? "▲" : isDropping ? "▼" : "•"}
                  {Math.abs(point.changePercent)}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
          <span className="truncate max-w-[280px]">
            <strong>Advice:</strong> {forecast.bestBookingWindowSummary}
          </span>
          <span className="font-bold text-[#172033] shrink-0">
            7d Exp: ₹{forecast.expected7DayRange.min.toLocaleString("en-IN")} - ₹{forecast.expected7DayRange.max.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    );
  }

  // Full Rich Forecast Insight View
  return (
    <div className="space-y-4">
      {/* Route Switcher Pills if allRoutes is provided */}
      {allRoutes && allRoutes.length > 1 && onSelectRoute && (
        <div className="bg-white p-2 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-[#64748B] px-2 shrink-0">
            Select Route:
          </span>
          {allRoutes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectRoute(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 cursor-pointer ${
                r.id === route.id
                  ? "bg-[#0B5ED7] text-white border-[#0B5ED7] shadow-xs"
                  : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
              }`}
            >
              {r.type === "flight" ? <Plane className="w-3.5 h-3.5" /> : <Train className="w-3.5 h-3.5" />}
              <span>
                {r.originCode} ➔ {r.destinationCode}
              </span>
              <span className="text-[10px] opacity-80">
                (₹{r.currentPrice.toLocaleString("en-IN")})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Recommendation Banner Card */}
      <div
        className={`p-5 rounded-3xl border shadow-xs transition-all relative overflow-hidden ${
          isBuyNow
            ? "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200"
            : isWait
            ? "bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border-amber-200"
            : "bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white border-blue-200"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-2xs ${
                  isBuyNow
                    ? "bg-[#16A34A] text-white"
                    : isWait
                    ? "bg-[#EA580C] text-white"
                    : "bg-[#0B5ED7] text-white"
                }`}
              >
                {isBuyNow && <TrendingUp className="w-3.5 h-3.5" />}
                {isWait && <TrendingDown className="w-3.5 h-3.5" />}
                {isFair && <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{forecast.recommendationBadge}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#172033] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{forecast.confidenceScore}% Algorithm Confidence</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-[#64748B]">
                Volatility: <strong className="text-[#172033]">{forecast.volatilityLevel}</strong>
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-[#172033]">
              {forecast.recommendationTitle}
            </h3>

            <p className="text-xs text-[#64748B] max-w-xl">
              {forecast.bestBookingWindowSummary}
            </p>
          </div>

          {/* Quick Price Summary Box */}
          <div className="bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs text-right space-y-1 shrink-0 w-full md:w-auto">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Current Live Fare
            </span>
            <span className="text-2xl font-black text-[#172033] block">
              ₹{forecast.currentPrice.toLocaleString("en-IN")}
            </span>
            <div className="flex items-center justify-end gap-1.5 text-[11px] font-semibold text-[#64748B]">
              <span>7d Projected Range:</span>
              <strong className="text-[#172033]">
                ₹{forecast.expected7DayRange.min.toLocaleString("en-IN")} – ₹{forecast.expected7DayRange.max.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>

        {/* Call to action bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#172033] font-medium">
            <Info className="w-4 h-4 text-[#0B5ED7] shrink-0" />
            <span>
              {isBuyNow
                ? "Prices expected to jump as departure approaches. Lock now to secure current fare."
                : isWait
                ? "Airlines or railways frequently release tactical off-peak pricing in mid-week."
                : "Standard base fare applies with minimum price fluctuation expected."}
            </span>
          </div>

          {onBookRoute && (
            <button
              type="button"
              onClick={() => onBookRoute(route)}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isBuyNow
                  ? "bg-[#16A34A] hover:bg-[#13833b] text-white"
                  : "bg-[#0B5ED7] hover:bg-[#094eb3] text-white"
              }`}
            >
              <span>Book at ₹{forecast.currentPrice.toLocaleString("en-IN")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7-DAY DAY-BY-DAY TRAJECTORY PROJECTION (Interactive Chart & Cards) */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#0B5ED7]" />
              <span>Next 7-Day Projected Fare Trajectory</span>
            </h4>
            <p className="text-xs text-[#64748B]">
              Calculated using historical booking velocity, fare tier steps, and advance purchase curves.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Expected Drop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expected Surge
            </span>
          </div>
        </div>

        {/* 7-Day Interactive Visual Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {forecast.dailyTrajectory.map((point) => {
            const isSelected = point.dayOffset === selectedDayOffset;
            const isRising = point.trend === "up";
            const isDropping = point.trend === "down";
            const isLowestInWindow =
              point.predictedPrice === forecast.expected7DayRange.min;

            return (
              <button
                key={point.dayOffset}
                type="button"
                onClick={() => setSelectedDayOffset(point.dayOffset)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? "bg-[#0B5ED7]/5 border-[#0B5ED7] ring-2 ring-[#0B5ED7]/20 shadow-xs"
                    : "bg-[#F5F9FC] border-[#E2E8F0] hover:bg-slate-100/70"
                }`}
              >
                {isLowestInWindow && (
                  <span className="absolute -top-2 left-2 px-1.5 py-0.2 bg-[#16A34A] text-white text-[9px] font-black rounded-md shadow-2xs">
                    BEST FARE
                  </span>
                )}

                <div>
                  <span className="text-[10px] font-bold text-[#64748B] block truncate">
                    {point.dayLabel.split(",")[0]} (+{point.dayOffset}d)
                  </span>
                  <span className="text-[9px] text-[#64748B] block">
                    {point.dayLabel.split(",")[1]?.trim() || ""}
                  </span>
                </div>

                <div className="my-1">
                  <span className="text-sm font-extrabold text-[#172033] block">
                    ₹{point.predictedPrice.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`text-[10px] font-bold flex items-center gap-0.5 ${
                      isRising
                        ? "text-rose-600"
                        : isDropping
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  >
                    {isRising ? <TrendingUp className="w-3 h-3" /> : isDropping ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    <span>
                      {point.changePercent > 0 ? `+${point.changePercent}%` : `${point.changePercent}%`}
                    </span>
                  </span>
                </div>

                <span className="text-[9px] text-[#64748B] truncate block border-t border-slate-200/60 pt-1">
                  {point.note}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Day Expanded Detail Card */}
        {selectedDay && (
          <div className="p-3.5 bg-[#F5F9FC] rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#172033]">
                  Selected: {selectedDay.dayLabel} (+{selectedDay.dayOffset} Days Ahead)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    selectedDay.trend === "up"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : selectedDay.trend === "down"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Projected {selectedDay.trend === "up" ? "Surge" : selectedDay.trend === "down" ? "Discount" : "Steady"} (
                  {selectedDay.changePercent > 0 ? `+${selectedDay.changePercent}%` : `${selectedDay.changePercent}%`})
                </span>
              </div>
              <p className="text-[#64748B]">
                {selectedDay.note} • Estimated Confidence Range: ₹{selectedDay.minRange.toLocaleString("en-IN")} to ₹{selectedDay.maxRange.toLocaleString("en-IN")}
              </p>
            </div>

            {onSetTargetAlert && (
              <button
                type="button"
                onClick={() => onSetTargetAlert(route, selectedDay.predictedPrice)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-[#0B5ED7] hover:bg-blue-50 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Watch this Target (₹{selectedDay.predictedPrice.toLocaleString("en-IN")})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* HISTORICAL MARKET DRIVERS & SIGNALS MATRIX */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#172033] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#0B5ED7]" />
            <span>Key Historical Drivers & Market Signals</span>
          </h4>
          <span className="text-[11px] text-[#64748B]">
            Route Data: {route.originCode} ➔ {route.destinationCode}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forecast.keyHistoricalSignals.map((signal, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                signal.impact === "warning"
                  ? "bg-amber-50/40 border-amber-200"
                  : signal.impact === "positive"
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-[#F5F9FC] border-[#E2E8F0]"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                {getSignalIcon(signal.iconType)}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-xs text-[#172033]">{signal.title}</h5>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      signal.impact === "warning"
                        ? "bg-amber-500"
                        : signal.impact === "positive"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  {signal.description}
                </p>
              </div>
            </div>
          ))}

          {/* Historical Range Benchmark Card */}
          <div className="p-3.5 rounded-2xl border bg-[#F5F9FC] border-[#E2E8F0] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#0B5ED7]" />
            </div>
            <div className="space-y-1 w-full">
              <h5 className="font-bold text-xs text-[#172033]">30-Day Historical Range</h5>
              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Low: ₹{forecast.historicalLowestPrice.toLocaleString("en-IN")}</span>
                <span>Avg: ₹{forecast.historicalAveragePrice.toLocaleString("en-IN")}</span>
                <span>High: ₹{forecast.historicalHighestPrice.toLocaleString("en-IN")}</span>
              </div>
              {/* Progress bar visual */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#0B5ED7] rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        10,
                        ((forecast.currentPrice - forecast.historicalLowestPrice) /
                          (forecast.historicalHighestPrice - forecast.historicalLowestPrice || 1)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
