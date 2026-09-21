import React from "react";
import {
  Compass,
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Sparkles,
  Palmtree,
  Landmark,
  Tag,
  User,
  Bot,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { ServiceCategory } from "../../types";

export interface MainNavProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenAIDrawer: () => void;
  onOpenProfileModal?: () => void;
  onOpenOffersModal: () => void;
  onOpenLocationModal: () => void;
  currentLocationName: string;
  bookingCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
}

export function MainNav({
  activeCategory,
  onSelectCategory,
  onOpenAIDrawer,
  onOpenOffersModal,
  onOpenLocationModal,
  currentLocationName,
  bookingCount = 0,
  isLoggedIn = false,
  userName = "Traveller",
}: MainNavProps) {
  // Desktop navigation items:
  // Logo Home Explore Flights Trains Buses Hotels Tours Pilgrimage Offers Account
  const navItems = [
    { id: "all" as ServiceCategory, label: "Home", icon: Compass },
    { id: "explore" as any, label: "Explore", icon: Compass, isAction: true },
    { id: "flights" as ServiceCategory, label: "Flights", icon: Plane },
    { id: "trains" as ServiceCategory, label: "Trains", icon: Train },
    { id: "buses" as ServiceCategory, label: "Buses", icon: Bus },
    { id: "hotels" as ServiceCategory, label: "Hotels", icon: Building2 },
    { id: "tours" as ServiceCategory, label: "Tours", icon: Compass },
    { id: "pilgrimage" as ServiceCategory, label: "Pilgrimage", icon: Landmark },
    { id: "offers" as any, label: "Offers", icon: Tag, isAction: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#E8E5DD] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* 1. BRAND LOGO */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-black text-base shadow-sm group-hover:bg-[#143225] transition-all">
                BY
              </div>
              <div className="text-left">
                <span className="font-extrabold text-lg text-[#1B4332] tracking-tight block leading-tight">
                  Bharat<span className="text-[#2D6A4F]">Yatra</span>
                </span>
                <span className="text-[10px] font-semibold text-[#6A786E] tracking-wider uppercase block">
                  Incredible India
                </span>
              </div>
            </button>

            {/* Location selector pill */}
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#E8F5E9] text-[#2D3A30] hover:text-[#1B4332] border border-[#E8E5DD] hover:border-[#2D6A4F] text-xs font-medium transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="font-semibold">{currentLocationName}</span>
              <ChevronDown className="w-3 h-3 text-[#6A786E]" />
            </button>
          </div>

          {/* 2. DESKTOP PRIMARY NAVIGATION */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeCategory === item.id;

              const handleClick = () => {
                if (item.id === "explore") {
                  onSelectCategory("all");
                  // Smooth scroll to explore section if on home
                  const exploreEl = document.getElementById("explore-destinations-section");
                  if (exploreEl) {
                    exploreEl.scrollIntoView({ behavior: "smooth" });
                  }
                } else if (item.id === "offers") {
                  onOpenOffersModal();
                } else if (item.id === "ai_travel") {
                  onOpenAIDrawer();
                } else {
                  onSelectCategory(item.id);
                }
              };

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleClick}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#1B4332] text-white shadow-2xs font-extrabold"
                      : "text-[#2D3A30] hover:text-[#1B4332] hover:bg-[#FAF9F5]"
                  } ${item.id === "ai_travel" ? "text-[#1B4332] font-extrabold" : ""}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected
                        ? "text-emerald-300"
                        : item.id === "ai_travel"
                        ? "text-[#2D6A4F] animate-pulse"
                        : "text-[#6A786E]"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.id === "ai_travel" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT UTILITY ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
          </div>
        </div>
      </div>
    </header>
  );
}
