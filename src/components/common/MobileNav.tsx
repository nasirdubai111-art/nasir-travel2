import React from "react";
import { Home, Search, Sparkles } from "lucide-react";
import { ServiceCategory } from "../../types";

export interface MobileNavProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenSearchModal: () => void;
  onOpenAIDrawer: () => void;
  onOpenProfileModal?: () => void;
  bookingCount?: number;
}

export function MobileNav({
  activeCategory,
  onSelectCategory,
  onOpenSearchModal,
  onOpenAIDrawer,
}: MobileNavProps) {
  return (
    <nav aria-label="Mobile Navigation" className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFBF7]/95 backdrop-blur-md border-t border-[#E8E5DD] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 items-center text-center">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
            activeCategory === "all" ? "text-[#1B4332] font-bold" : "text-[#6A786E] hover:text-[#1B4332]"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* 2. Search */}
        <button
          type="button"
          onClick={onOpenSearchModal}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#6A786E] hover:text-[#1B4332] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Search</span>
        </button>

        {/* 3. AI Guru */}
        <button
          type="button"
          onClick={onOpenAIDrawer}
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-[#2D6A4F] hover:text-[#1B4332] transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">AI Guru</span>
        </button>
      </div>
    </nav>
  );
}
