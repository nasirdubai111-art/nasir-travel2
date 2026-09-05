import React from "react";
import {
  MapPin,
  Search,
  Sparkles,
  User,
  Wallet,
  Coins,
  ChevronDown,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Map,
  Landmark,
  Car,
  UtensilsCrossed,
  Briefcase,
  Ticket,
  Bell,
  Compass,
  Tag,
  Gift,
  Handshake,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Building,
  Flame,
  Layers,
  Zap,
  Sliders,
  Terminal,
  Bot,
  TrendingDown,
} from "lucide-react";
import { ServiceCategory, CityLocation, UserProfile } from "../types";
import { SERVICE_CATEGORIES } from "../data/mockTravelData";
import { StatusTicker } from "./StatusTicker";

interface NavbarProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  currentLocation: CityLocation;
  onOpenLocationModal: () => void;
  onOpenSearchModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAIDrawer: () => void;
  onOpenMyTrips: () => void;
  onOpenOffers: () => void;
  onOpenNotifications: () => void;
  onOpenPriceWatch?: () => void;
  onOpenAdminPlatform?: () => void;
  onOpenSuperDashboard?: (operatorId?: string) => void;
  onOpenRazorpayDashboard?: () => void;
  onOpenPartnerSubscription?: () => void;
  onOpenApiArchitectureExplorer?: () => void;
  onOpenAiCrmMarketingSuite?: () => void;
  userProfile: UserProfile;
  bookingCount: number;
  unreadNotificationsCount: number;
}

export function Navbar({
  activeCategory,
  onSelectCategory,
  currentLocation,
  onOpenLocationModal,
  onOpenSearchModal,
  onOpenProfileModal,
  onOpenAIDrawer,
  onOpenMyTrips,
  onOpenOffers,
  onOpenNotifications,
  onOpenPriceWatch,
  onOpenAdminPlatform,
  onOpenSuperDashboard,
  onOpenRazorpayDashboard,
  onOpenPartnerSubscription,
  onOpenApiArchitectureExplorer,
  onOpenAiCrmMarketingSuite,
  userProfile,
  bookingCount,
  unreadNotificationsCount,
}: NavbarProps) {
  // Map icon strings to Lucide components
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass": return <Compass className="w-4 h-4" />;
      case "Plane": return <Plane className="w-4 h-4" />;
      case "Train": return <Train className="w-4 h-4" />;
      case "Bus": return <Bus className="w-4 h-4" />;
      case "Building2": return <Building2 className="w-4 h-4" />;
      case "Palmtree": return <Palmtree className="w-4 h-4" />;
      case "Map": return <Map className="w-4 h-4" />;
      case "Landmark": return <Landmark className="w-4 h-4" />;
      case "Car": return <Car className="w-4 h-4" />;
      case "UtensilsCrossed": return <UtensilsCrossed className="w-4 h-4" />;
      case "Briefcase": return <Briefcase className="w-4 h-4" />;
      case "UserCheck": return <UserCheck className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Real-time Status & Weather Warning Ticker for Current Location */}
      <StatusTicker
        currentLocation={currentLocation}
        onOpenLocationModal={onOpenLocationModal}
      />

      {/* Top Banner / Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-end overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px]">
            {/* My Trips */}
            <button
              onClick={onOpenMyTrips}
              className="hover:text-white flex items-center gap-1 font-bold text-indigo-300 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-indigo-400" />
              <span>My Trips ({bookingCount})</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Offers */}
            <button
              onClick={onOpenOffers}
              className="hidden sm:flex hover:text-white items-center gap-1 text-slate-300 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              <span>Offers</span>
            </button>

            <span className="hidden sm:inline-block text-slate-700">|</span>

            {/* Partner Subscription & Commercial Plans */}
            {onOpenPartnerSubscription && (
              <>
                <button
                  onClick={onOpenPartnerSubscription}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/25 to-indigo-600/25 text-amber-300 hover:text-white border border-amber-500/40 font-extrabold tracking-tight transition-all shadow-xs cursor-pointer"
                  title="Partner Subscription Plans (Free, Standard, Pro, Enterprise) & Commission Models (A/B/C/D)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Partner Plans</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Super Dashboard (11 Operator Modules & Backend Isolation) */}
            {onOpenSuperDashboard && (
              <>
                <button
                  onClick={() => onOpenSuperDashboard()}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-600/40 to-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 font-extrabold tracking-tight transition-all shadow-xs"
                  title="Super Dashboard: 11 Operator Profile Modules & Strict Backend Isolation"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Super Dashboard</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Admin Console */}
            {onOpenAdminPlatform && (
              <>
                <button
                  onClick={onOpenAdminPlatform}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold transition-all"
                  title="Master Operations, Agent KYC & Partner Inventory Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Console</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Razorpay Gateway Operations */}
            {onOpenRazorpayDashboard && (
              <>
                <button
                  onClick={onOpenRazorpayDashboard}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/40 font-bold transition-all"
                  title="Razorpay Multi-Rail Gateway, Webhook Inspector & Live Refunds"
                >
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Razorpay PG</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* AI Automation, WhatsApp CRM & Growth Suite */}
            {onOpenAiCrmMarketingSuite && (
              <>
                <button
                  onClick={onOpenAiCrmMarketingSuite}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-indigo-200 hover:text-white border border-indigo-400/40 font-black tracking-tight transition-all shadow-xs cursor-pointer"
                  title="AI Automation, Email & WhatsApp CRM, SEO Tracker, Paid Ads & CSV Studio"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI CRM &amp; Growth Hub</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* API Gateway Explorer */}
            {onOpenApiArchitectureExplorer && (
              <>
                <button
                  onClick={onOpenApiArchitectureExplorer}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-600/25 text-purple-300 hover:bg-purple-600/40 hover:text-white border border-purple-500/40 font-black tracking-tight transition-all shadow-xs cursor-pointer"
                  title="Enterprise API Gateway: 10 Isolated REST API Tiers & Live Playground"
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>API Gateway</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative text-slate-300 hover:text-white p-1"
              title="Travel Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Location Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onSelectCategory("all")}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white font-black text-lg tracking-tighter">
                  BY
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-950">
                    Bharat<span className="text-[#0B5ED7]">Yatra</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-amber-500/15 text-amber-700 border border-amber-500/30 uppercase tracking-wide">
                    Super App
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold -mt-0.5">India Travel &amp; Mobility Ecosystem</p>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              id="btn-location-selector"
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate max-w-[140px]">{currentLocation.name}, {currentLocation.state}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Center Search Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              id="btn-global-search"
              onClick={onOpenSearchModal}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/5 text-xs text-slate-500 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="text-slate-600 font-medium truncate">Search Flights, Vande Bharat, Resorts, Yatras...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-200/80 rounded border border-slate-300">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wallet & Coins Pill */}
            <button
              onClick={onOpenProfileModal}
              className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-amber-400 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
              title="BharatYatra Wallet & YatraCoins"
            >
              <div className="flex items-center gap-1 text-emerald-700">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>₹{userProfile.walletBalance.toLocaleString()}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-amber-700">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{userProfile.yatraCoins}</span>
              </div>
            </button>

            {/* Price Watch Button */}
            {onOpenPriceWatch && (
              <button
                onClick={onOpenPriceWatch}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold text-sky-900 hover:bg-sky-100 transition-colors cursor-pointer"
                title="Price Watch (≥10% Drop Alerts)"
              >
                <TrendingDown className="w-3.5 h-3.5 text-sky-600" />
                <span>Price Watch</span>
              </button>
            )}

            {/* Location Mobile Trigger */}
            <button
              onClick={onOpenLocationModal}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              title="Change Location"
            >
              <MapPin className="w-4 h-4 text-rose-600" />
            </button>

            {/* Search Mobile Trigger */}
            <button
              onClick={onOpenSearchModal}
              className="md:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Ask Maya AI Concierge Button */}
            <button
              id="btn-ask-maya-ai"
              onClick={onOpenAIDrawer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:brightness-105 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Ask Maya AI</span>
              <span className="sm:hidden">Maya</span>
            </button>

            {/* Profile / Account Button */}
            <button
              id="btn-user-profile"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <span className="hidden xl:inline-block">{userProfile.name.split(" ")[0]}</span>
              <ChevronDown className="hidden sm:inline-block w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Swiggy-Style Multiple Service Entry Tabs */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-1 sm:gap-1.5 pb-0.5">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`nav-tab-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `bg-[#0B5ED7] text-white shadow-md shadow-blue-600/25`
                    : `text-slate-600 hover:bg-slate-100 hover:text-slate-950`
                }`}
              >
                {getIcon(cat.icon)}
                <span>{cat.name}</span>
                {cat.badge && (
                  <span
                    className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-wide ${
                      isActive ? "bg-white/20 text-white" : "bg-amber-500/15 text-amber-700 border border-amber-500/20"
                    }`}
                  >
                    {cat.badge.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
