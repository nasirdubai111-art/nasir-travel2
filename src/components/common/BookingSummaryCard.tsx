import React from "react";
import { ShieldCheck, Sparkles, Tag, CheckCircle, Calendar, Users, MapPin } from "lucide-react";
import { ServiceCategory } from "../../types";

export interface BookingSummaryCardProps {
  item: {
    title?: string;
    name?: string;
    from?: string;
    to?: string;
    date?: string;
    travellers?: number;
    amount?: number;
    price?: number;
    category?: ServiceCategory;
    operator?: string;
    pnr?: string;
  };
  appliedCouponCode?: string;
  discountAmount?: number;
  convenienceFee?: number;
  gstAmount?: number;
  className?: string;
}

export function BookingSummaryCard({
  item,
  appliedCouponCode,
  discountAmount = 0,
  convenienceFee = 0,
  gstAmount,
  className = "",
}: BookingSummaryCardProps) {
  const title = item.title || item.name || `${item.from || "Origin"} ➔ ${item.to || "Destination"}`;
  const rawPrice = item.amount || item.price || 1999;
  const computedGst = gstAmount !== undefined ? gstAmount : Math.round(rawPrice * 0.05);
  const totalPayable = Math.max(0, rawPrice + computedGst + convenienceFee - discountAmount);
  const yatraCoinsEarned = Math.round(totalPayable * 0.05);

  return (
    <div className={`bg-white rounded-2xl border border-[#E8E5DD] p-5 shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-[#F0EDE6] flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9]">
            {item.category ? item.category.toUpperCase() : "TRAVEL BOOKING"}
          </span>
          <h4 className="font-bold text-base text-[#1B4332] mt-1.5">{title}</h4>
          {item.operator && (
            <p className="text-xs text-[#526356] font-medium">{item.operator}</p>
          )}
        </div>

        {item.date && (
          <div className="text-right text-xs text-[#6A786E]">
            <span className="flex items-center gap-1 font-medium justify-end">
              <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
              {item.date}
            </span>
          </div>
        )}
      </div>

      {/* Trust Guarantee */}
      <div className="flex items-center gap-2 text-xs text-[#1B4332] bg-[#E8F5E9]/60 p-2.5 rounded-xl border border-[#C8E6C9]">
        <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
        <span className="font-medium">
          <strong>YatraShield Protected:</strong> 100% Instant Refund on authorized cancellation.
        </span>
      </div>

      {/* Fare Breakdown */}
      <div className="space-y-2 text-xs text-[#4B584E]">
        <div className="flex items-center justify-between">
          <span>Base Fare / Stays</span>
          <span className="font-semibold text-[#1B4332]">₹{rawPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>GST &amp; Government Taxes</span>
          <span className="font-semibold text-[#1B4332]">₹{computedGst.toLocaleString()}</span>
        </div>

        {convenienceFee > 0 ? (
          <div className="flex items-center justify-between">
            <span>IRCTC / GDS Convenience Fee</span>
            <span className="font-semibold text-[#1B4332]">₹{convenienceFee.toLocaleString()}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[#2D6A4F]">
            <span>Convenience Fee</span>
            <span className="font-bold">FREE (₹0)</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[#2D6A4F] font-bold">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Promo Discount ({appliedCouponCode})
            </span>
            <span>-₹{discountAmount.toLocaleString()}</span>
          </div>
        )}

        {/* Total Strip */}
        <div className="pt-3 border-t border-[#F0EDE6] flex items-center justify-between text-sm">
          <div>
            <span className="font-extrabold text-[#1B4332]">Total Amount Payable</span>
            <span className="text-[10px] text-[#6A786E] block font-normal">All taxes included</span>
          </div>
          <span className="text-xl font-black text-[#1B4332]">
            ₹{totalPayable.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Reward Coin Feedback */}
      <div className="pt-2 border-t border-dashed border-[#E8E5DD] flex items-center justify-between text-[11px] text-[#7A5816]">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          YatraCoins to be earned
        </span>
        <span className="font-bold text-amber-700">+{yatraCoinsEarned} Coins</span>
      </div>
    </div>
  );
}
