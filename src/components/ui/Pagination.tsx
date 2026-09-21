import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center justify-between gap-4 py-3 text-xs text-[#4B5563]", className)}>
      <span>
        Page <strong className="text-[#111827]">{currentPage}</strong> of <strong className="text-[#111827]">{totalPages}</strong>
      </span>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="h-8 px-2.5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 rounded-[8px] text-xs font-semibold transition-all flex items-center justify-center cursor-pointer",
              p === currentPage
                ? "bg-[#1B4332] text-white shadow-xs"
                : "bg-white text-[#4B5563] hover:bg-emerald-50 hover:text-[#1B4332] border border-[#E8E5DD]"
            )}
          >
            {p}
          </button>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="h-8 px-2.5"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
