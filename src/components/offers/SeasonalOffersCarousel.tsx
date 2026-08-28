import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Tag,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  Clock,
  ShieldCheck,
  Percent,
  Plane,
  Train,
  Building2,
  Landmark,
  Car,
  Briefcase,
  Flame,
  Zap,
  Gift,
  ExternalLink,
} from "lucide-react";
import { TravelOffer, ServiceCategory } from "../../types";
import { PROMO_OFFERS } from "../../data/mockTravelData";

interface SeasonalOffersCarouselProps {
  offers?: TravelOffer[];
  onSelectCategory: (category: ServiceCategory) => void;
  onOpenOffers: () => void;
  onSelectOffer?: (offer: TravelOffer) => void;
}

export function SeasonalOffersCarousel({
  offers = PROMO_OFFERS,
  onSelectCategory,
  onOpenOffers,
  onSelectOffer,
}: SeasonalOffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeOffers = offers.length > 0 ? offers : PROMO_OFFERS;
  const currentOffer = activeOffers[currentIndex] || activeOffers[0];

  // Auto-play interval: 5 seconds
  const SLIDE_DURATION = 5000;

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeOffers.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleApplyOffer = (offer: TravelOffer) => {
    if (onSelectOffer) {
      onSelectOffer(offer);
    }
    if (offer.category !== "all") {
      onSelectCategory(offer.category as ServiceCategory);
    } else {
      onOpenOffers();
    }
  };

  // Touch Swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Helper for Category Icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flights":
        return <Plane className="w-4 h-4" />;
      case "trains":
        return <Train className="w-4 h-4" />;
      case "hotels":
      case "resorts":
        return <Building2 className="w-4 h-4" />;
      case "pilgrimage":
        return <Landmark className="w-4 h-4" />;
      case "cabs":
        return <Car className="w-4 h-4" />;
      case "corporate":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  // Seasonal Badges & Highlights
  const getSeasonalMeta = (index: number, category: string) => {
    switch (index % 6) {
      case 0:
        return {
          seasonTag: "Monsoon & Festive Travel Sale",
          seasonIcon: <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />,
          accentGlow: "from-blue-600/30 to-indigo-900/40",
          cardBg: "from-[#0F2856] via-[#153E75] to-[#0A1A3A]",
          badgeBg: "bg-amber-400 text-slate-950",
          borderAccent: "border-sky-400/30",
        };
      case 1:
        return {
          seasonTag: "IRCTC Vande Bharat Special",
          seasonIcon: <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />,
          accentGlow: "from-amber-600/30 to-orange-950/40",
          cardBg: "from-[#451A03] via-[#78350F] to-[#2E1004]",
          badgeBg: "bg-orange-400 text-slate-950",
          borderAccent: "border-amber-400/30",
        };
      case 2:
        return {
          seasonTag: "Grand Heritage & Luxury Getaways",
          seasonIcon: <Gift className="w-3.5 h-3.5 text-violet-300" />,
          accentGlow: "from-purple-600/30 to-indigo-950/40",
          cardBg: "from-[#2E1065] via-[#4C1D95] to-[#1E0A3C]",
          badgeBg: "bg-violet-300 text-slate-950",
          borderAccent: "border-purple-400/30",
        };
      case 3:
        return {
          seasonTag: "Auspicious Yatra & Darshan Blessing",
          seasonIcon: <Sparkles className="w-3.5 h-3.5 text-yellow-300" />,
          accentGlow: "from-amber-600/30 to-yellow-950/40",
          cardBg: "from-[#451A03] via-[#854D0E] to-[#2B1304]",
          badgeBg: "bg-yellow-400 text-slate-950",
          borderAccent: "border-yellow-400/30",
        };
      case 4:
        return {
          seasonTag: "Highway Intercity Roadtrip Pass",
          seasonIcon: <Tag className="w-3.5 h-3.5 text-teal-300" />,
          accentGlow: "from-teal-600/30 to-emerald-950/40",
          cardBg: "from-[#064E3B] via-[#047857] to-[#022C22]",
          badgeBg: "bg-emerald-300 text-slate-950",
          borderAccent: "border-teal-400/30",
        };
      default:
        return {
          seasonTag: "Corporate GST Input Tax Savings",
          seasonIcon: <Briefcase className="w-3.5 h-3.5 text-sky-300" />,
          accentGlow: "from-slate-700/30 to-slate-950/40",
          cardBg: "from-[#0F172A] via-[#1E293B] to-[#0B0F19]",
          badgeBg: "bg-sky-300 text-slate-950",
          borderAccent: "border-slate-500/30",
        };
    }
  };

  const meta = getSeasonalMeta(currentIndex, currentOffer.category);

  return (
    <section
      id="seasonal-offers-carousel"
      aria-label="Seasonal Travel Offers"
      className="relative rounded-3xl overflow-hidden border border-slate-700/30 bg-slate-950 text-white shadow-xl group/carousel"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${meta.cardBg} transition-all duration-700 opacity-95`}
      />

      {/* Decorative ambient background mesh & glowing orbs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      {/* Top Banner Bar: Seasonal Title, Counter & Controls */}
      <div className="relative z-10 px-5 pt-4 pb-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black text-amber-300 tracking-wide shadow-2xs">
            {meta.seasonIcon}
            <span>{meta.seasonTag}</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-black/30 px-2.5 py-0.5 rounded-md border border-white/5">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Limited Time Offers</span>
          </span>
        </div>

        {/* Action Controls & Pagination */}
        <div className="flex items-center gap-2 text-xs">
          {/* Slide Indicator Badge */}
          <span className="font-mono text-[11px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-white font-black">{String(currentIndex + 1).padStart(2, "0")}</span> /{" "}
            {String(activeOffers.length).padStart(2, "0")}
          </span>

          {/* Auto-Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isPlaying ? "Pause auto-play" : "Resume auto-play"}
            aria-label={isPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Previous Slide */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Previous Offer"
            aria-label="Previous Offer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Next Slide */}
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Next Offer"
            aria-label="Next Offer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* All Offers Modal Trigger */}
          <button
            type="button"
            onClick={onOpenOffers}
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-xs cursor-pointer ml-1"
          >
            <span>All Offers</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Active Offer Display */}
      <div className="relative z-10 p-5 sm:p-7 transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Offer Details & Value Proposition */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white capitalize">
                {getCategoryIcon(currentOffer.category)}
                <span>{currentOffer.category === "all" ? "All Travel" : currentOffer.category}</span>
              </span>

              {/* Bank / Partner Pill */}
              {currentOffer.bank && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 text-amber-300 border border-amber-400/30 text-xs font-bold font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentOffer.bank}</span>
                </span>
              )}

              {/* Discount Highlight Pill */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide shadow-md ${meta.badgeBg}`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>{currentOffer.discount}</span>
              </span>
            </div>

            {/* Offer Title */}
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-xs tracking-tight">
                {currentOffer.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed max-w-2xl font-normal">
                {currentOffer.subtitle}
              </p>
            </div>

            {/* Terms & Validity Footer */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Valid till: <strong className="text-white font-bold">{currentOffer.validTill}</strong>
                </span>
              </span>

              {currentOffer.minBooking > 0 && (
                <>
                  <span className="text-white/30">•</span>
                  <span>
                    Min Booking:{" "}
                    <strong className="text-white font-bold">
                      ₹{currentOffer.minBooking.toLocaleString("en-IN")}
                    </strong>
                  </span>
                </>
              )}

              <span className="text-white/30">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>✓</span> Instant Checkout Deduction
              </span>
            </div>
          </div>

          {/* Right Column: Promo Code Box & Action Button */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3 bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 shadow-inner">
            {/* Promo Code Box */}
            <div className="flex-1">
              <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between">
                <span>Promo Code</span>
                <span className="text-[10px] text-amber-400 font-normal">Tap to copy</span>
              </div>
              <div
                onClick={(e) => handleCopyCode(e, currentOffer.code)}
                className="flex items-center justify-between bg-white/10 hover:bg-white/15 border border-dashed border-amber-400/60 hover:border-amber-400 rounded-xl px-3.5 py-2.5 cursor-pointer transition-all group/code"
                title="Copy promo code"
              >
                <div className="font-mono text-base font-black text-amber-300 tracking-widest flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>{currentOffer.code}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopyCode(e, currentOffer.code)}
                  className="flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-2.5 py-1 rounded-lg hover:bg-amber-300 transition-colors shrink-0 shadow-2xs"
                >
                  {copiedCode === currentOffer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-700" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <button
              type="button"
              onClick={() => handleApplyOffer(currentOffer)}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <span>Apply &amp; Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Dots / Progress Bar Navigation */}
      <div className="relative z-10 px-5 pb-4 pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 bg-black/20">
        {/* Thumbnails / Pills for all offers */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
          {activeOffers.map((offer, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={offer.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-md font-black scale-102"
                    : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                }`}
                title={offer.title}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-amber-500 animate-pulse" : "bg-white/40"
                  }`}
                />
                <span className="font-mono text-[11px]">{offer.code}</span>
                <span className="text-[10px] opacity-75 hidden md:inline">• {offer.discount}</span>

                {/* Auto-Play Active Progress Bar inside active button */}
                {isActive && isPlaying && (
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-amber-500 rounded-full animate-[progress_5s_linear_infinite]"
                    style={{
                      width: "100%",
                      animationDuration: `${SLIDE_DURATION}ms`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* View All Mobile link */}
        <button
          type="button"
          onClick={onOpenOffers}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors self-end sm:self-auto shrink-0"
        >
          <span>Explore All 20+ Coupons &amp; Deals</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
