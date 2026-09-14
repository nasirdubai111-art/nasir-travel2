import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  timeRanges?: string[];
  onTimeRangeChange?: (range: string) => void;
  onExport?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  timeRanges = ["7D", "30D", "90D", "1Y"],
  onTimeRangeChange,
  onExport,
  children,
  className,
}) => {
  const [selectedRange, setSelectedRange] = useState(timeRanges[1] || "30D");

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    if (onTimeRangeChange) onTimeRangeChange(range);
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-[12px] p-4 sm:p-5 shadow-xs text-left",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F3F4F6]">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-[#111827]">{title}</h4>
          {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {/* Time range buttons */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleRangeSelect(range)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-all cursor-pointer",
                  selectedRange === range
                    ? "bg-white text-[#0B5ED7] shadow-2xs font-bold"
                    : "text-[#6B7280] hover:text-[#111827]"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {onExport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              className="h-7 px-2 text-xs"
              title="Export Report"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="pt-4 min-h-[220px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
