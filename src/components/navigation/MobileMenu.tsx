import React from "react";
import { Home, Search, Tag, User } from "lucide-react";
import { cn } from "../../lib/utils";

export interface MobileMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "offers", label: "Offers", icon: Tag },
  ];

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] shadow-lg flex items-center justify-around px-2 py-1.5",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-[8px] transition-colors cursor-pointer select-none",
              isActive ? "text-[#0B5ED7]" : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
            <span
              className={cn(
                "text-[10px] mt-0.5 whitespace-nowrap",
                isActive ? "font-bold text-[#0B5ED7]" : "font-medium"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
