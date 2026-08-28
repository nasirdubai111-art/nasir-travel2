import React, { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  Calendar,
  ArrowRight,
  TrendingDown,
  Plane,
  Train,
  Volume2,
  VolumeX,
  Check,
  Zap,
} from "lucide-react";
import { SmartRouteAlert } from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";

interface SmartRouteAlertBannerProps {
  onOpenSmartAlertsModal?: () => void;
  onApplyAlternativeDate?: (routeType: "flight" | "train", date: string, originCode: string, destCode: string) => void;
}

export function SmartRouteAlertBanner({
  onOpenSmartAlertsModal,
  onApplyAlternativeDate,
}: SmartRouteAlertBannerProps) {
  const [activeAlert, setActiveAlert] = useState<SmartRouteAlert | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [dismissTimer, setDismissTimer] = useState<number>(100);

  useEffect(() => {
    const handleSmartAlert = (e: Event) => {
      const customEvent = e as CustomEvent<SmartRouteAlert>;
      if (customEvent.detail) {
        setActiveAlert(customEvent.detail);
        setDismissTimer(100);
      }
    };

    window.addEventListener("bharatyatra:smart-route-alert", handleSmartAlert);
    return () => {
      window.removeEventListener("bharatyatra:smart-route-alert", handleSmartAlert);
    };
  }, []);

  // Auto-dismiss timer (10 seconds total)
  useEffect(() => {
    if (!activeAlert) return;
    const interval = setInterval(() => {
      setDismissTimer((prev) => {
        if (prev <= 0) {
          setActiveAlert(null);
          return 100;
        }
        return prev - 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeAlert]);

  if (!activeAlert) return null;

  const isFlight = activeAlert.routeType === "flight";
  const best = activeAlert.bestAlternativeDate;

  return (
    <div
      id="smart-route-alert-banner"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300"
    >
      <div className="bg-[#0A1628]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-indigo-400/30 relative overflow-hidden ring-4 ring-indigo-500/20">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="font-extrabold uppercase tracking-wider text-[10px] text-sky-400 flex items-center gap-1">
              <span>Smart Route Alert</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-400">Search History AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsSoundMuted(!isSoundMuted);
                if (isSoundMuted) PriceWatchService.playNotificationChime();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isSoundMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isSoundMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                PriceWatchService.dismissSmartAlert(activeAlert.id);
                setActiveAlert(null);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="pt-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-sky-400 border border-white/15 shrink-0 mt-0.5">
                {isFlight ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-white">
                    {activeAlert.originCode} ➔ {activeAlert.destinationCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-0.5 shadow-xs">
                    <TrendingDown className="w-3 h-3" />
                    <span>{activeAlert.alertBadge}</span>
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-medium leading-snug">
                  {activeAlert.alertTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Price comparison card */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[10px] block">Searched Date:</span>
                <span className="font-semibold text-slate-300 line-through">
                  {activeAlert.searchedFormattedDate} (₹{activeAlert.searchedPrice.toLocaleString("en-IN")})
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-2" />
              <div className="space-y-0.5 text-right">
                <span className="text-emerald-400 font-bold text-[10px] block">Cheaper Alternative:</span>
                <span className="font-black text-white text-xs bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  {best.formattedDate} (₹{best.price.toLocaleString("en-IN")})
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1 border-t border-white/5">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{best.reason}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onApplyAlternativeDate) {
                  onApplyAlternativeDate(
                    activeAlert.routeType,
                    best.date,
                    activeAlert.originCode,
                    activeAlert.destinationCode
                  );
                }
                setActiveAlert(null);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Switch to {best.formattedDate}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveAlert(null);
                if (onOpenSmartAlertsModal) onOpenSmartAlertsModal();
              }}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold text-xs border border-white/15 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>All Dates</span>
            </button>
          </div>
        </div>

        {/* Dismiss Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all ease-linear duration-100"
            style={{ width: `${dismissTimer}%` }}
          />
        </div>
      </div>
    </div>
  );
}
