import React, { useState } from "react";
import {
  Plane,
  Train,
  Bus,
  Building2,
  Compass,
  Tag,
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
    <header className={cn("sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E5DD] shadow-xs select-none", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectCategory("all")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              BY
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#1B4332] tracking-tight block leading-tight">
                Bharat<span className="text-[#2D6A4F]">Yatra</span>
              </span>
              <span className="text-[10px] text-[#526658] block font-medium">
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
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? "bg-[#1B4332] text-white shadow-xs font-bold"
                      : "text-[#2D3A30] hover:bg-[#E8F5E9] hover:text-[#1B4332]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#2D6A4F]")} />
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
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FCFBF7] border border-[#E8E5DD] text-xs text-[#526658] transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Search routes...</span>
                <kbd className="text-[10px] bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-[#E8E5DD]">⌘K</kbd>
              </button>
            )}

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5E9] hover:bg-[#D8F3DC] border border-[#B7E4C7] text-[#1B4332] text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#2D6A4F]" />
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
              className="lg:hidden p-2 rounded-xl hover:bg-[#E8F5E9] text-[#1B4332] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#E8E5DD] space-y-1">
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#F0EDE6]">
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
                      "flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-semibold",
                      isActive
                        ? "bg-[#1B4332] text-white font-bold"
                        : "bg-white border border-[#E8E5DD] text-[#2D3A30]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-1">
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
