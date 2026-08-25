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
  Scale,
  Compass,
  Tag,
  Gift,
  Handshake,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Building,
  Star,
  Headphones,
  Flame,
  Layers,
  Zap,
  Terminal,
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
  onOpenCompare: () => void;
  onOpenTripPlanner: () => void;
  onOpenRewards: () => void;
  onOpenOffers: () => void;
  onOpenNotifications: () => void;
  onOpenBusOperatorPortal?: () => void;
  onOpenTourOperatorPortal?: () => void;
  onOpenPilgrimageOperatorBackend?: () => void;
  onOpenCentralBookingProfile?: () => void;
  onOpenAdminPlatform?: () => void;
  onOpenDestinationGuides?: () => void;
  onOpenCustomerReviews?: () => void;
  onOpenHelpSupport?: () => void;
  onOpenTelesalesPortal?: () => void;
  onOpenLodgePartnerPortal?: () => void;
  onOpenMalhotraB2BDesk?: () => void;
  onOpenSuperDashboard?: (operatorId?: string) => void;
  onOpenRazorpayDashboard?: () => void;
  onOpenPartnerSubscription?: () => void;
  onOpenApiArchitectureExplorer?: () => void;
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
  onOpenCompare,
  onOpenTripPlanner,
  onOpenRewards,
  onOpenOffers,
  onOpenNotifications,
  onOpenBusOperatorPortal,
  onOpenTourOperatorPortal,
  onOpenPilgrimageOperatorBackend,
  onOpenCentralBookingProfile,
  onOpenAdminPlatform,
  onOpenDestinationGuides,
  onOpenCustomerReviews,
  onOpenHelpSupport,
  onOpenTelesalesPortal,
  onOpenLodgePartnerPortal,
  onOpenMalhotraB2BDesk,
  onOpenSuperDashboard,
  onOpenRazorpayDashboard,
  onOpenPartnerSubscription,
  onOpenApiArchitectureExplorer,
  userProfile,
  bookingCount,
  unreadNotificationsCount,
}: NavbarProps) {
  // Map icon strings to Lucide components
  const getIcon = (name: string) => {
    switch (name) {
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
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Chardham Yatra 2026 & Vande Bharat Express Bookings Open
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <button
              onClick={onOpenCompare}
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Scale className="w-3 h-3 text-indigo-400" />
              <span>Compare Modes</span>
            </button>
            <span className="hidden lg:inline-block text-slate-500">|</span>
            <button
              onClick={onOpenTripPlanner}
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Compass className="w-3 h-3 text-amber-400" />
              <span>Plan Journey</span>
            </button>
          </div>

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

            {/* Customer Reviews */}
            {onOpenCustomerReviews && (
              <>
                <button
                  onClick={onOpenCustomerReviews}
                  className="hidden sm:flex hover:text-white items-center gap-1 text-amber-300 transition-colors"
                  title="100% PNR-Verified Traveler Reviews"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Reviews</span>
                </button>
                <span className="hidden sm:inline-block text-slate-700">|</span>
              </>
            )}

            {/* Help & Support */}
            {onOpenHelpSupport && (
              <>
                <button
                  onClick={onOpenHelpSupport}
                  className="hidden sm:flex hover:text-white items-center gap-1 text-slate-300 transition-colors"
                  title="24x7 Help, Refunds & SOS"
                >
                  <Headphones className="w-3.5 h-3.5 text-sky-400" />
                  <span>Support</span>
                </button>
                <span className="hidden sm:inline-block text-slate-700">|</span>
              </>
            )}

            {/* Offers */}
            <button
              onClick={onOpenOffers}
              className="hidden sm:flex hover:text-white items-center gap-1 text-slate-300 transition-colors"
            >
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              <span>Offers</span>
            </button>

            <span className="hidden sm:inline-block text-slate-700">|</span>

            {/* Destination Guides */}
            {onOpenDestinationGuides && (
              <>
                <button
                  onClick={onOpenDestinationGuides}
                  className="flex hover:text-white items-center gap-1 text-amber-300 font-bold transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guides</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

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

            {/* Central Booking Profile */}
            {onOpenCentralBookingProfile && (
              <>
                <button
                  onClick={onOpenCentralBookingProfile}
                  className="flex items-center gap-1 font-bold text-orange-300 hover:text-orange-200 transition-colors"
                  title="Central Customer Booking Profile across all 11 Travel Services"
                >
                  <Ticket className="w-3.5 h-3.5 text-orange-400" />
                  <span>Central Bookings</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Bus Operator Portal Button */}
            {onOpenBusOperatorPortal && (
              <>
                <button
                  onClick={onOpenBusOperatorPortal}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-bold transition-all"
                  title="Bus Operator Fleet, KYC, Schedule & Settlement Management"
                >
                  <Bus className="w-3.5 h-3.5 text-rose-400" />
                  <span>Bus Operator</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Tour Operator Portal Button */}
            {onOpenTourOperatorPortal && (
              <>
                <button
                  onClick={onOpenTourOperatorPortal}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30 border border-fuchsia-500/30 font-bold transition-all"
                  title="Tour Operator Backend, Packages, Itineraries & Settlement Console"
                >
                  <Compass className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Tour Operator</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Pilgrimage Operator Portal Button */}
            {onOpenPilgrimageOperatorBackend && (
              <>
                <button
                  onClick={onOpenPilgrimageOperatorBackend}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold transition-all"
                  title="Pilgrimage Operator Backend, Sacred Batches & Sugam VIP Passes"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Yatra Operator</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Lodge Host PMS Portal Button */}
            {onOpenLodgePartnerPortal && (
              <>
                <button
                  onClick={onOpenLodgePartnerPortal}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-bold transition-all"
                  title="Lodge Host PMS, Seasonal Tariffs, KYC & Settlement Invoices"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lodge PMS</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Telesales WFH Portal Button */}
            {onOpenTelesalesPortal && (
              <>
                <button
                  onClick={onOpenTelesalesPortal}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 font-bold transition-all"
                  title="Telesales Executive & Work-From-Home CRM & Incentive Hub"
                >
                  <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Telesales CRM</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Malhotra World Travels & B2B Desk Button */}
            {onOpenMalhotraB2BDesk && (
              <>
                <button
                  onClick={onOpenMalhotraB2BDesk}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 hover:text-white border border-amber-400/40 font-black tracking-tight transition-all shadow-2xs"
                  title="Malhotra World Travels & B2B Desk (11 Operator Profiles & Invoices)"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                  <span>Malhotra B2B Desk (11 Profiles)</span>
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}

            {/* Wallet & Rewards */}
            <button
              onClick={onOpenRewards}
              className="flex items-center gap-1 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>₹{userProfile.walletBalance.toLocaleString("en-IN")}</span>
            </button>

            <button
              onClick={onOpenRewards}
              className="hidden sm:flex items-center gap-1 text-amber-400 font-bold hover:text-amber-300 transition-colors"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{userProfile.yatraCoins}</span>
            </button>

            <span className="text-slate-700">|</span>

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
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-indigo-600 to-emerald-600 p-0.5 shadow-xs">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-black text-lg tracking-tighter">
                  BY
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#172033]">
                    Bharat<span className="text-[#0B5ED7]">Yatra</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/30 uppercase">
                    Super App
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5">India Travel &amp; Mobility Ecosystem</p>
              </div>
            </button>

            {/* Location Selector Pill */}
            <button
              id="btn-location-selector"
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all hover:border-slate-300"
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
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-xs text-xs text-slate-500 transition-all text-left group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>Search Flights, Vande Bharat, Resorts, Yatras...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/70 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Quick Button */}
            <button
              onClick={onOpenCompare}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
              title="Compare Modes"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compare</span>
            </button>

            {/* Plan Journey Button */}
            <button
              onClick={onOpenTripPlanner}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
              title="Plan Journey"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Plan Trip</span>
            </button>

            {/* Location Mobile Trigger */}
            <button
              onClick={onOpenLocationModal}
              className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200"
              title="Change Location"
            >
              <MapPin className="w-4 h-4 text-rose-600" />
            </button>

            {/* Search Mobile Trigger */}
            <button
              onClick={onOpenSearchModal}
              className="md:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Ask Maya AI Concierge Button */}
            <button
              id="btn-ask-maya-ai"
              onClick={onOpenAIDrawer}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:brightness-105 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Ask Maya AI</span>
              <span className="sm:hidden">Maya</span>
            </button>

            {/* Profile / Account Button */}
            <button
              id="btn-user-profile"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800"
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
        <div className="mt-3 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-all"
            onClick={() => onSelectCategory("all")}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCategory === "all"
                ? "bg-[#172033] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#172033]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>Master Home</span>
          </button>

          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`nav-tab-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-[#0B5ED7] text-white shadow-xs font-bold`
                    : `text-slate-600 hover:bg-slate-100 hover:text-[#172033]`
                }`}
              >
                {getIcon(cat.icon)}
                <span>{cat.name}</span>
                {cat.badge && (
                  <span
                    className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? "bg-white/20 text-white" : "bg-[#FF8A00]/15 text-[#FF8A00]"
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
