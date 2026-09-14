import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "left" | "right";
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "left",
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer surface */}
      <div
        className={cn(
          "relative z-10 w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between text-[#111827] animate-in duration-200",
          position === "left"
            ? "slide-in-from-left mr-auto"
            : "slide-in-from-right ml-auto",
          className
        )}
      >
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#6B7280] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
