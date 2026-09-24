import React, { useState } from "react";
import {
  MapPin,
  Search,
  Sparkles,
  User,
  Bell,
  Compass,
  Tag,
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Palmtree,
  Landmark,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ServiceCategory, CityLocation, UserProfile } from "../types";
import { StatusTicker } from "./StatusTicker";

interface NavbarProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  currentLocation: CityLocation;
  onOpenLocationModal: () => void;
  onOpenSearchModal: () => void;
  onOpenProfileModal?: () => void;
  onOpenAIDrawer: () => void;
  onOpenOffers: () => void;
  onOpenNotifications: () => void;
  onOpenPriceWatch?: () => void;
  onOpenAdminPlatform?: () => void;
  onOpenPilgrimageCustomer?: () => void;
  onOpenPilgrimageAdmin?: () => void;
  onOpenSuperDashboard?: (operatorId?: string, subView?: string) => void;
  onOpenPartnerSubscription?: () => void;
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
  onOpenOffers,
  onOpenNotifications,
  onOpenPriceWatch,
  onOpenPartnerSubscription,
  userProfile,
  bookingCount,
  unreadNotificationsCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Desktop Navigation Items:
  // Logo Home Explore Flights Trains Buses Hotels Tours Pilgrimage Offers Account
  const primaryNavItems = [
    { id: "all" as ServiceCategory, label: "Home", icon: Compass },
    { id: "explore" as any, label: "Explore", icon: Compass, isExploreAction: true },
    { id: "flights" as ServiceCategory, label: "Flights", icon: Plane },
    { id: "trains" as ServiceCategory, label: "Trains", icon: Train },
    { id: "buses" as ServiceCategory, label: "Buses", icon: Bus },
    { id: "hotels" as ServiceCategory, label: "Hotels", icon: Building2 },
    { id: "tours" as ServiceCategory, label: "Tours", icon: Compass },
    { id: "pilgrimage" as ServiceCategory, label: "Pilgrimage", icon: Landmark },
    { id: "offers" as any, label: "Offers", icon: Tag, isOffersAction: true },
  ];

  const handleNavClick = (item: typeof primaryNavItems[0]) => {
    if (item.isExploreAction) {
      onSelectCategory("all");
      const el = document.getElementById("explore-destinations-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (item.isOffersAction) {
      onOpenOffers();
    } else {
      onSelectCategory(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E8E5DD] shadow-xs">
      {/* Real-time Status & Weather Warning Ticker for Current Location */}
      <StatusTicker
        currentLocation={currentLocation}
        onOpenLocationModal={onOpenLocationModal}
      />

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* 1. BRAND LOGO & LOCATION */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-black text-base shadow-sm group-hover:bg-[#143225] transition-all">
                BY
              </div>
              <div>
                <span className="font-black text-lg text-[#1B4332] tracking-tight block leading-tight">
                  Bharat<span className="text-[#2D6A4F]">Yatra</span>
                </span>
                <span className="text-[10px] font-bold text-[#526356] uppercase tracking-wider block">
                  Incredible India
                </span>
              </div>
            </button>

            {/* Location selector button */}
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] hover:bg-[#E8F5E9] text-[#2D3A30] hover:text-[#1B4332] border border-[#E8E5DD] hover:border-[#2D6A4F] text-xs font-semibold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="truncate max-w-[110px]">{currentLocation.name}</span>
              <ChevronDown className="w-3 h-3 text-[#6A786E]" />
            </button>
          </div>

          {/* 2. DESKTOP PRIMARY NAVIGATION */}
          {/* Logo Home Explore Flights Trains Buses Hotels Tours Pilgrimage Offers Account */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeCategory === item.id;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#1B4332] text-white shadow-2xs font-extrabold"
                      : "text-[#2D3A30] hover:text-[#1B4332] hover:bg-[#FAF9F5]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? "text-emerald-300" : "text-[#526356]"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick dropdown for Resorts & Lodges */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeCategory === "resorts" || activeCategory === "lodges" || activeCategory === "houseboats"
                    ? "text-[#1B4332] bg-[#FAF9F5] font-extrabold"
                    : "text-[#526356] hover:text-[#1B4332]"
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {moreDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-1.5 w-48 bg-white rounded-2xl border border-[#E8E5DD] shadow-xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory("resorts");
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#2D3A30] hover:bg-[#FAF9F5] hover:text-[#1B4332] flex items-center gap-2"
                  >
                    <Palmtree className="w-4 h-4 text-[#2D6A4F]" />
                    <span>Luxury Resorts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory("lodges");
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#2D3A30] hover:bg-[#FAF9F5] hover:text-[#1B4332] flex items-center gap-2"
                  >
                    <TreePine className="w-4 h-4 text-[#2D6A4F]" />
                    <span>Wildlife Safari Lodges</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory("houseboats");
                      setMoreDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#2D3A30] hover:bg-[#FAF9F5] hover:text-[#1B4332] flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-[#2D6A4F]" />
                    <span>Backwater Houseboats</span>
                  </button>

                  {onOpenPartnerSubscription && (
                    <>
                      <div className="border-t border-[#F0EDE6] my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPartnerSubscription();
                          setMoreDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1B4332] bg-[#E8F5E9]/60 hover:bg-[#E8F5E9] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#2D6A4F]" />
                          <span>Open Partner Portal</span>
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#2D6A4F] text-white">
                          B2B
                        </span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* 3. RIGHT UTILITY CONTROLS (Account) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger (Desktop quick icon) */}
            <button
              type="button"
              onClick={onOpenSearchModal}
              className="p-2 rounded-xl text-[#2D3A30] hover:text-[#1B4332] hover:bg-[#FAF9F5] border border-transparent hover:border-[#E8E5DD] transition-all cursor-pointer"
              title="Search Travel"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#2D6A4F]" />
            </button>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-[#2D3A30] hover:text-[#1B4332] hover:bg-[#FAF9F5] border border-transparent hover:border-[#E8E5DD] transition-all cursor-pointer"
              title="Notifications & Updates"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#2D6A4F]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E63946] ring-2 ring-white" />
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-[#2D3A30] hover:bg-[#FAF9F5] border border-[#E8E5DD]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu for Categories & Services */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FCFBF7] border-b border-[#E8E5DD] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeCategory === item.id;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all text-left cursor-pointer ${
                    isSelected
                      ? "bg-[#1B4332] text-white border-[#1B4332]"
                      : "bg-white text-[#2D3A30] border-[#E8E5DD] hover:border-[#2D6A4F]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : "text-[#2D6A4F]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E8E5DD] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationModal();
              }}
              className="flex items-center gap-1.5 text-[#2D3A30] font-semibold"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>Location: {currentLocation.name}</span>
            </button>

            {onOpenPartnerSubscription && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPartnerSubscription();
                }}
                className="flex items-center gap-1.5 text-[#1B4332] font-bold bg-[#E8F5E9] px-2.5 py-1 rounded-lg hover:bg-[#D8EEDC] transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Open Partner Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
