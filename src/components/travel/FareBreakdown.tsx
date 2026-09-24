import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FareBreakdownProps {
  baseFare: number;
  taxes: number;
  serviceFee?: number;
  discount?: number;
  discountCode?: string;
  totalPassengers?: number;
  currency?: string;
  className?: string;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({
  baseFare,
  taxes,
  serviceFee = 0,
  discount = 0,
  discountCode,
  totalPassengers = 1,
  currency = "₹",
  className,
}) => {
  const totalAmount = Math.max(0, baseFare + taxes + serviceFee - discount);

  return (
    <div
      className={cn(
        "bg-white border border-[#E8E5DD] rounded-[12px] p-4 sm:p-5 shadow-xs text-left",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DD]">
        <h4 className="text-sm font-bold text-[#111827]">Fare Breakdown</h4>
        <span className="text-xs text-[#6B7280]">
          {totalPassengers} {totalPassengers === 1 ? "Traveller" : "Travellers"}
        </span>
      </div>

      <div className="space-y-2.5 pt-3 text-xs">
        {/* Base Fare */}
        <div className="flex items-center justify-between text-[#4B5563]">
          <span>Base Fare</span>
          <span className="font-semibold text-[#111827]">
            {currency}{baseFare.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Taxes & GST */}
        <div className="flex items-center justify-between text-[#4B5563]">
          <span className="flex items-center gap-1">
            <span>Taxes &amp; Gov Fees</span>
            <Info className="w-3 h-3 text-[#9CA3AF]" />
          </span>
          <span className="font-semibold text-[#111827]">
            {currency}{taxes.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Platform / Service Fee */}
        {serviceFee > 0 && (
          <div className="flex items-center justify-between text-[#4B5563]">
            <span>Convenience &amp; Gateway Fee</span>
            <span className="font-semibold text-[#111827]">
              {currency}{serviceFee.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Discount (if any) */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-[#16A34A] font-medium bg-[#DCFCE7]/40 px-2 py-1 rounded-[6px]">
            <span>Discount {discountCode ? `(${discountCode})` : ""}</span>
            <span>-{currency}{discount.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      {/* Total Due */}
      <div className="pt-3 mt-3 border-t border-[#E8E5DD] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#111827] block">Total Amount</span>
          <span className="text-[10px] text-[#6B7280]">Inclusive of all taxes</span>
        </div>
        <div className="text-right">
          <span className="text-lg sm:text-xl font-extrabold text-[#1B4332]">
            {currency}{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Trust & Guarantee badge */}
      <div className="mt-3 pt-3 border-t border-[#E8E5DD] flex items-center gap-2 text-[11px] text-[#16A34A] font-semibold">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#16A34A]" />
        <span>Best Price &amp; Instant Refund Guarantee</span>
      </div>
    </div>
  );
};
