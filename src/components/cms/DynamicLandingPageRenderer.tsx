import React, { useState } from "react";
import {
  Compass,
  Tag,
  Search,
  Sparkles,
  Plane,
  Train,
  Bus,
  Building,
  Car,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Smartphone,
  Gift,
  Clock,
  Heart,
  Users,
  Flame,
  Globe,
  Sliders,
  Layers,
  Award,
  Calendar,
  CreditCard,
  Percent,
} from "lucide-react";
import {
  CMSLandingPage,
  ExploreCMSItem,
  CMSOfferRecord,
  CMSSectionType,
} from "../../types/travelCmsTypes";
import { landingPageService } from "../../services/landingPageService";

interface DynamicLandingPageRendererProps {
  page: CMSLandingPage;
  onNavigateSlug?: (slug: string) => void;
  onOpenBookingTab?: (tab: string) => void;
  onApplyOfferCode?: (code: string) => void;
  onOpenAdminCms?: () => void;
}

export function DynamicLandingPageRenderer({
  page,
  onNavigateSlug,
  onOpenBookingTab,
  onApplyOfferCode,
  onOpenAdminCms,
}: DynamicLandingPageRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [exploreTab, setExploreTab] = useState<"ALL" | "Destinations" | "Experiences" | "Special Travel">("ALL");

  // Dynamic Explore and Offers items from CMS service
  const exploreItems = landingPageService.getExploreItems();
  const offersList = landingPageService.getOffers();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const visibleSections = [...page.sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const filteredExplore = exploreItems.filter(
    (item) => exploreTab === "ALL" || item.categoryGroup === exploreTab
  );

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* CMS Page Indicator Bar (Top Sticky Preview Ribbon) */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold uppercase border border-indigo-500/30">
            CMS Managed Route: /{page.slug || "home"}
          </span>
          <span className="text-slate-400 font-medium hidden sm:inline">
            Status: <strong className="text-emerald-400">{page.status}</strong> • {visibleSections.length} Active Blocks
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Route Switcher */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-500">Jump to:</span>
            {[
              { slug: "", label: "Home" },
              { slug: "travel", label: "Travel" },
              { slug: "flights", label: "Flights" },
              { slug: "hotels", label: "Hotels" },
              { slug: "pilgrimage", label: "Pilgrimage" },
              { slug: "destinations/goa", label: "Goa" },
            ].map((route) => (
              <button
                key={route.slug}
                onClick={() => onNavigateSlug && onNavigateSlug(route.slug)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  page.slug === route.slug
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {route.label}
              </button>
            ))}
          </div>

          {onOpenAdminCms && (
            <button
              onClick={onOpenAdminCms}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black flex items-center gap-1 hover:brightness-110 cursor-pointer shadow-sm"
            >
              <Sliders className="w-3 h-3" />
              <span>Edit Page CMS</span>
            </button>
          )}
        </div>
      </div>

      {/* Render all visible sections in configured order */}
      <div className="space-y-12 pb-16">
        {visibleSections.map((sec) => {
          switch (sec.type) {
            // ----------------------------------------------------
            // 1. HERO BANNER
            // ----------------------------------------------------
            case "HERO_BANNER":
              return (
                <section
                  key={sec.id}
                  className="relative min-h-[460px] flex items-center justify-center text-center px-4 overflow-hidden border-b border-slate-800"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={page.heroImageUrl}
                      alt={page.title}
                      className="w-full h-full object-cover brightness-[0.35]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>

                  <div className="relative z-10 max-w-4xl mx-auto py-12 space-y-4">
                    {page.badgeTag && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {page.badgeTag}
                      </span>
                    )}

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                      {page.heroHeadline}
                    </h1>

                    <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                      {page.heroSubheadline}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => onOpenBookingTab && onOpenBookingTab("flights")}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <span>Start Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const el = document.getElementById("cms-explore-section");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Compass className="w-4 h-4 text-indigo-400" />
                        <span>Explore Categories</span>
                      </button>
                    </div>
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 2. TRAVEL CATEGORIES (GRID)
            // ----------------------------------------------------
            case "TRAVEL_CATEGORIES":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Unified Indian Travel Services
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Choose from our complete catalog of travel & stay solutions with zero convenience fees.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {[
                      { tab: "flights", label: "Flights", icon: Plane, count: "450+ Airlines", color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400" },
                      { tab: "trains", label: "Trains (IRCTC)", icon: Train, count: "12,000+ Trains", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400" },
                      { tab: "buses", label: "Intercity Buses", icon: Bus, count: "80,000+ Routes", color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400" },
                      { tab: "hotels", label: "Hotels & Resorts", icon: Building, count: "500k+ Properties", color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400" },
                      { tab: "cabs", label: "Airport Cabs", icon: Car, count: "Pan-India Outstation", color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400" },
                      { tab: "pilgrimage", label: "Sacred Yatra", icon: Sparkles, count: "35+ Holy Circuits", color: "from-orange-500/20 to-rose-500/10 border-orange-500/30 text-orange-400" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => onOpenBookingTab && onOpenBookingTab(item.tab)}
                          className={`p-4 rounded-2xl bg-gradient-to-b ${item.color} border bg-slate-900/60 hover:bg-slate-800/80 transition-all text-left flex flex-col justify-between h-32 group cursor-pointer hover:scale-105 shadow-md`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.count}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 3. EXPLORE SECTION (INDEPENDENT & REUSABLE MODULE)
            // ----------------------------------------------------
            case "EXPLORE_SECTION":
              return (
                <section id="cms-explore-section" key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                          Explore CMS Module
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                        Handcrafted Journeys & Experiences
                      </h2>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                      {(["ALL", "Destinations", "Experiences", "Special Travel"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setExploreTab(tab)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                            exploreTab === tab
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredExplore.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-lg"
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {item.badge && (
                              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-500/30">
                                {item.badge}
                              </span>
                            )}
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-200 text-[10px] font-mono">
                              {item.subCategory}
                            </span>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                                {item.destinationName}
                              </span>
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {item.rating} ({item.reviewCount})
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {item.title}
                            </h3>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 mt-2 border-t border-slate-900 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Starting from</span>
                            <span className="text-sm font-black text-white font-mono">
                              ₹{item.packagePriceStarting?.toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => onNavigateSlug && onNavigateSlug(item.ctaUrl.replace(/^\//, ""))}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <span>{item.ctaText}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 4. OFFERS & DEALS CMS MODULE
            // ----------------------------------------------------
            case "OFFERS_DEALS":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                          Offers CMS Module
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                        Exclusive Deals & Promo Codes
                      </h2>
                    </div>

                    <span className="text-xs text-slate-400 hidden sm:inline">
                      Auto-applied at checkout for verified accounts
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {offersList.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black tracking-wider uppercase border border-amber-500/30">
                              {offer.offerType} OFFER
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              {offer.discountType === "PERCENTAGE"
                                ? `${offer.discountValue}% OFF`
                                : `FLAT ₹${offer.discountValue} OFF`}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {offer.title}
                          </h3>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {offer.description}
                          </p>

                          <div className="text-[11px] text-slate-500 font-medium">
                            Min spend: ₹{offer.minimumBookingValue.toLocaleString()} • Valid till{" "}
                            {offer.validUntil}
                          </div>
                        </div>

                        {/* Promo Code & Action Box */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-dashed border-amber-500/40 text-amber-300 font-mono font-black text-xs">
                            {offer.promoCode}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopy(offer.promoCode)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                              title="Copy Code"
                            >
                              {copiedCode === offer.promoCode ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {onApplyOfferCode && (
                              <button
                                onClick={() => onApplyOfferCode(offer.promoCode)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-sm"
                              >
                                Apply Code
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 5. PROMOTIONAL BANNERS
            // ----------------------------------------------------
            case "PROMOTIONAL_BANNERS":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-indigo-900/40 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase">
                        Exclusive HDFC & ICICI Card Deal
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Get Flat ₹2,500 Instant Cashback on All Luxury Stays
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                        Use card checkout with code <strong className="text-amber-300 font-mono">BHARATCARD</strong>. Zero cancellation fees & free room upgrade subject to availability.
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenBookingTab && onOpenBookingTab("hotels")}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all cursor-pointer shrink-0 shadow-lg"
                    >
                      Claim Cashback Now
                    </button>
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 6. TESTIMONIALS & TRUST REVIEWS
            // ----------------------------------------------------
            case "TESTIMONIALS_REVIEWS":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Loved by 4.2 Million Travelers
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Real stories from verified travelers booking flights, trains, and pilgrimages across India.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      {
                        name: "Ananya Sharma",
                        location: "Mumbai",
                        trip: "Goa Beachfront Villa",
                        review: "The instant refund and zero convenience fee policy is a game changer. The South Goa villa booking was seamless and check-in was 100% smooth.",
                        rating: 5,
                      },
                      {
                        name: "Col. Rajesh Verma (Retd.)",
                        location: "New Delhi",
                        trip: "Char Dham Yatra Package",
                        review: "Our Kedarnath helicopter and VIP Darshan coordination was flawlessly handled. The elderly care and sattvic meal arrangements exceeded expectations.",
                        rating: 5,
                      },
                      {
                        name: "Siddharth Menon",
                        location: "Bengaluru",
                        trip: "Alleppey Houseboat Cruise",
                        review: "Authentic Kerala cuisine prepared by a private onboard chef, serene backwater views, and prompt WhatsApp support throughout.",
                        rating: 5,
                      },
                    ].map((t, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md"
                      >
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          &quot;{t.review}&quot;
                        </p>
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                          <div>
                            <strong className="text-white font-bold block">{t.name}</strong>
                            <span className="text-slate-500 text-[11px]">{t.location}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono">
                            {t.trip}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 7. APP DOWNLOAD BANNER
            // ----------------------------------------------------
            case "APP_DOWNLOAD":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4">
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2 text-center md:text-left">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase border border-emerald-500/30">
                        📱 Download BharatYatra Mobile App
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Get ₹500 Welcome YatraCash + Live Train GPS Radar
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                        Track live train platform numbers, offline gate alerts, gate boarding passes, and 1-click UPI cancellations.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span>Google Play</span>
                      </button>
                      <button className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                        <Smartphone className="w-4 h-4 text-indigo-400" />
                        <span>Apple App Store</span>
                      </button>
                    </div>
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 8. FAQ ACCORDION (CMS SCHEMA FAQ)
            // ----------------------------------------------------
            case "FAQ_ACCORDION":
              return (
                <section key={sec.id} className="max-w-4xl mx-auto px-4">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Everything you need to know about booking, cancellations, and yatra passes.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        q: "Is there really zero convenience fee on flight & train bookings?",
                        a: "Yes! When paying via UPI or select partner credit cards (HDFC, ICICI, SBI), you enjoy 100% waiver of convenience fees with zero hidden gateway surcharges.",
                      },
                      {
                        q: "How does the VIP Darshan pilgrimage coordination work?",
                        a: "We partner directly with authorized temple trusts and certified Vedic purohits. Passes, queue bypass authorizations, and wheelchair assistance are pre-issued digitally before arrival.",
                      },
                      {
                        q: "Can I manage multiple CMS landing pages from Admin?",
                        a: "Yes. Admin users can create, reorder sections, update SEO meta, and schedule landing pages across any slug (/travel, /hotels, /destinations/kashmir) with zero frontend code changes.",
                      },
                      {
                        q: "How fast are cancellation refunds credited?",
                        a: "UPI and YatraCash wallet refunds are processed instantly within 15 seconds. Card refunds take 1 to 3 banking days.",
                      },
                    ].map((faq, idx) => {
                      const isOpen = activeFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                            className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                          >
                            <span>{faq.q}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-2 ${
                                isOpen ? "rotate-180 text-indigo-400" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

            // ----------------------------------------------------
            // 9. PARTNER SECTION
            // ----------------------------------------------------
            case "PARTNER_SECTION":
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4 text-center">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Authorized Travel & Hospitality Partners
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold opacity-70">
                    <span>IRCTC Official Partner</span>
                    <span>•</span>
                    <span>IndiGo</span>
                    <span>•</span>
                    <span>Air India</span>
                    <span>•</span>
                    <span>Taj Hotels & Palaces</span>
                    <span>•</span>
                    <span>ITC Hotels</span>
                    <span>•</span>
                    <span>Zingbus</span>
                    <span>•</span>
                    <span>Shree Kashi Vishwanath Trust</span>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
