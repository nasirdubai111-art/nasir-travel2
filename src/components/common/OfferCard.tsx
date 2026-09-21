import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles, Clock } from "lucide-react";

export interface OfferCardProps {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  bankPartner?: string;
  category?: string;
  validTill?: string;
  minBooking?: number;
  onApply?: (code: string) => void;
}

export function OfferCard({
  id,
  code,
  title,
  description,
  discount,
  bankPartner,
  category = "All Travel",
  validTill = "Ongoing",
  minBooking,
  onApply,
}: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopied(true);
    if (onApply) {
      onApply(code);
    }
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-[#E8E5DD] p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3 group overflow-hidden">
      {/* Subtle nature accent badge */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#1B4332] font-bold text-[10px] uppercase tracking-wider border border-[#C8E6C9]">
          {bankPartner || "PROMO OFFER"}
        </span>
        <span className="text-xs font-black text-[#2D6A4F] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E8E5DD]">
          {discount}
        </span>
      </div>

      <div>
        <h4 className="font-bold text-sm text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors leading-snug">
          {title}
        </h4>
        <p className="text-xs text-[#526356] line-clamp-2 mt-1 leading-relaxed">
          {description}
        </p>

        {minBooking && (
          <p className="text-[10px] text-[#7A8A7E] mt-1.5 flex items-center gap-1">
            <span>Min. booking: ₹{minBooking.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Coupon Code Strip */}
      <div className="pt-3 border-t border-dashed border-[#E8E5DD] flex items-center justify-between gap-2">
        <div className="bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E8E5DD] font-mono text-xs font-bold text-[#1B4332] tracking-wider">
          {code}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            copied
              ? "bg-[#2D6A4F] text-white"
              : "bg-[#1B4332] hover:bg-[#143225] text-white shadow-2xs"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
