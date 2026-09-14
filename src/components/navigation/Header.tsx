import React, { useState } from "react";
import {
  Plane,
  Train,
  Bus,
  Building2,
  Compass,
  Tag,
  Briefcase,
  User,
  Menu,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenSearch?: () => void;
  onOpenMyTrips?: () => void;
  onOpenOffers?: () => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenMyTrips,
  onOpenOffers,
  onOpenProfile,
  onOpenAdmin,
  isLoggedIn = false,
  userName = "Traveller",
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainCategories = [
    { id: "flights", label: "Flights", icon: Plane },
    { id: "trains", label: "Trains", icon: Train },
    { id: "buses", label: "Buses", icon: Bus },
    { id: "hotels", label: "Hotels", icon: Building2 },
    { id: "tours", label: "Tours", icon: Compass },
    { id: "offers", label: "Offers", icon: Tag },
  ];

  return (
    <header className={cn("sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs select-none", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectCategory("all")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#0B5ED7] flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              BY
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#111827] tracking-tight block leading-tight">
                Bharat<span className="text-[#0B5ED7]">Yatra</span>
              </span>
              <span className="text-[10px] text-[#6B7280] block font-medium">
                National Mobility Grid
              </span>
            </div>
          </div>

          {/* Desktop Categories Navigation */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {mainCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === "offers" && onOpenOffers) {
                      onOpenOffers();
                    } else {
                      onSelectCategory(cat.id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? "bg-[#0B5ED7] text-white shadow-xs font-bold"
                      : "text-[#4B5563] hover:bg-[#E7F1FF] hover:text-[#0B5ED7]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#0B5ED7]")} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-xs text-[#6B7280] transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#0B5ED7]" />
                <span>Search routes...</span>
                <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">⌘K</kbd>
              </button>
            )}

            {onOpenMyTrips && (
              <button
                onClick={onOpenMyTrips}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold text-[#4B5563] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-[#0B5ED7]" />
                <span>My Trips</span>
              </button>
            )}

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#B45309] text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>Admin</span>
              </button>
            )}

            {/* Profile / Auth Button */}
            {onOpenProfile && (
              <Button
                variant={isLoggedIn ? "secondary" : "primary"}
                size="sm"
                onClick={onOpenProfile}
                leftIcon={<User className="w-3.5 h-3.5" />}
              >
                {isLoggedIn ? userName : "Sign In"}
              </Button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-[8px] hover:bg-slate-100 text-[#4B5563] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#E5E7EB] space-y-1">
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#F3F4F6]">
              {mainCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-[8px] text-xs font-semibold",
                      isActive
                        ? "bg-[#0B5ED7] text-white font-bold"
                        : "bg-slate-50 text-[#4B5563]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-1">
              {onOpenMyTrips && (
                <button
                  onClick={() => {
                    onOpenMyTrips();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#4B5563] hover:bg-slate-50"
                >
                  <Briefcase className="w-4 h-4 text-[#0B5ED7]" />
                  <span>My Bookings &amp; Split Tickets</span>
                </button>
              )}

              {onOpenOffers && (
                <button
                  onClick={() => {
                    onOpenOffers();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#4B5563] hover:bg-slate-50"
                >
                  <Tag className="w-4 h-4 text-[#F59E0B]" />
                  <span>Exclusive Offers &amp; Promo Passes</span>
                </button>
              )}

              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-semibold text-[#B45309] hover:bg-amber-50"
                >
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Admin &amp; Partner Platform</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
