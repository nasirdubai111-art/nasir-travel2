import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export type BookingStep = "search" | "select" | "details" | "review" | "payment" | "confirmed";

export interface BookingStepsProps {
  currentStep: BookingStep;
  className?: string;
  onStepClick?: (step: BookingStep) => void;
}

const STEPS: { id: BookingStep; label: string; number: number }[] = [
  { id: "search", label: "Search", number: 1 },
  { id: "select", label: "Select", number: 2 },
  { id: "details", label: "Traveller Details", number: 3 },
  { id: "review", label: "Review", number: 4 },
  { id: "payment", label: "Payment", number: 5 },
  { id: "confirmed", label: "Confirmed", number: 6 },
];

export const BookingSteps: React.FC<BookingStepsProps> = ({
  currentStep,
  className,
  onStepClick,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn("w-full py-4 overflow-x-auto no-scrollbar", className)}>
      <div className="min-w-[500px] flex items-center justify-between relative px-2">
        {/* Background track line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E5DD] -z-0" />

        {/* Active progress bar line */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#1B4332] transition-all duration-300 -z-0"
          style={{
            width: `${Math.max(0, (currentIndex / (STEPS.length - 1)) * 100)}%`,
          }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div
              key={step.id}
              onClick={() => {
                if (isCompleted && onStepClick) {
                  onStepClick(step.id);
                }
              }}
              className={cn(
                "relative z-10 flex flex-col items-center gap-1.5 transition-colors select-none",
                isCompleted && onStepClick ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-xs",
                  isCompleted
                    ? "bg-[#16A34A] text-white"
                    : isCurrent
                    ? "bg-[#1B4332] text-white ring-4 ring-emerald-100"
                    : "bg-white text-[#6B7280] border border-[#E8E5DD]"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>

              <span
                className={cn(
                  "text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors",
                  isCurrent
                    ? "text-[#1B4332] font-bold"
                    : isCompleted
                    ? "text-[#16A34A]"
                    : "text-[#6B7280]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
