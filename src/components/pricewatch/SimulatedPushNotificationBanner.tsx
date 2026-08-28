import React, { useEffect, useState } from "react";
import {
  Bell,
  X,
  TrendingDown,
  Plane,
  Train,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
} from "lucide-react";
import { PriceDropAlertEvent } from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";

interface SimulatedPushNotificationBannerProps {
  onOpenPriceWatchModal?: () => void;
  onOpenWatchModal?: () => void;
  onBookRoute?: (alert: PriceDropAlertEvent) => void;
}

export function SimulatedPushNotificationBanner({
  onOpenPriceWatchModal,
  onOpenWatchModal,
  onBookRoute,
}: SimulatedPushNotificationBannerProps) {
  const handleOpenModal = () => {
    if (onOpenPriceWatchModal) onOpenPriceWatchModal();
    else if (onOpenWatchModal) onOpenWatchModal();
  };
  const [activeAlert, setActiveAlert] = useState<PriceDropAlertEvent | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [dismissTimer, setDismissTimer] = useState<number>(100);

  useEffect(() => {
    const handlePriceDrop = (e: Event) => {
      const customEvent = e as CustomEvent<PriceDropAlertEvent>;
      if (customEvent.detail) {
        setActiveAlert(customEvent.detail);
        setDismissTimer(100);
      }
    };

    window.addEventListener("bharatyatra:price-drop", handlePriceDrop);
    return () => {
      window.removeEventListener("bharatyatra:price-drop", handlePriceDrop);
    };
  }, []);

  // Auto-dismiss progress timer (8 seconds total)
  useEffect(() => {
    if (!activeAlert) return;
    const interval = setInterval(() => {
      setDismissTimer((prev) => {
        if (prev <= 0) {
          setActiveAlert(null);
          return 100;
        }
        return prev - 1.25;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeAlert]);

  if (!activeAlert) return null;

  const isFlight = activeAlert.routeType === "flight";

  return (
    <div className="fixed top-5 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-6 fade-in duration-300">
      <div className="bg-[#172033]/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-white/20 relative overflow-hidden ring-4 ring-[#0B5ED7]/30">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0B5ED7] flex items-center justify-center text-white shadow-xs">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#38BDF8]">
              Push Notification • Price Drop Alert
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSoundMuted(!isSoundMuted);
                if (isSoundMuted) PriceWatchService.playNotificationChime();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
              title={isSoundMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={() => setActiveAlert(null)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="pt-3 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-[#38BDF8] border border-white/15">
                {isFlight ? <Plane className="w-5 h-5" /> : <Train className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">
                    {activeAlert.originCode} ➔ {activeAlert.destinationCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-black flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>-{activeAlert.dropPercent}% OFF</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {activeAlert.carrierName} • {activeAlert.journeyDate}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 line-through block">
                ₹{activeAlert.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-base font-black text-emerald-400">
                ₹{activeAlert.currentPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 bg-white/5 p-2.5 rounded-xl border border-white/10 leading-relaxed">
            {activeAlert.message}
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (onBookRoute) {
                  onBookRoute(activeAlert);
                } else {
                  handleOpenModal();
                }
                setActiveAlert(null);
              }}
              className="flex-1 h-10 px-3 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Instant Book at ₹{activeAlert.currentPrice.toLocaleString("en-IN")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleOpenModal();
                setActiveAlert(null);
              }}
              className="h-10 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              View Alert
            </button>
          </div>
        </div>

        {/* Dismiss Countdown Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#0B5ED7] to-[#16A34A] transition-all duration-100 ease-linear"
            style={{ width: `${dismissTimer}%` }}
          />
        </div>
      </div>
    </div>
  );
}
