import React, { useState } from "react";
import { Copy, Check, Calendar, Tag } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface OfferCardProps {
  id: string;
  title: string;
  subtitle?: string;
  discount: string;
  code: string;
  validTill: string;
  partnerName?: string;
  terms?: string;
  imageUrl?: string;
  category?: string;
  onApplyCode?: (code: string) => void;
  className?: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  title,
  subtitle,
  discount,
  code,
  validTill,
  partnerName = "BharatYatra Official",
  terms = "Valid on all verified domestic & international bookings.",
  imageUrl,
  category,
  onApplyCode,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onApplyCode) onApplyCode(code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] rounded-[12px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left",
        className
      )}
    >
      {/* Top Banner / Image (if available) */}
      {imageUrl && (
        <div className="h-32 w-full bg-slate-100 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="offer">{discount}</Badge>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
              {partnerName}
            </span>
            {!imageUrl && <Badge variant="offer">{discount}</Badge>}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-[#111827] line-clamp-1">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}

          {category && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#0B5ED7] font-semibold bg-[#E7F1FF] px-2 py-0.5 rounded-full">
              <Tag className="w-3 h-3" />
              <span>{category.toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-[#F3F4F6]">
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Coupon Code Pill */}
            <div
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F8FAFC] border border-dashed border-[#0B5ED7] text-[#0B5ED7] font-mono text-xs font-bold cursor-pointer hover:bg-[#E7F1FF] transition-colors"
              title="Click to copy code"
            >
              <span>{code}</span>
              {copied ? (
                <Check className="w-3 h-3 text-[#16A34A]" />
              ) : (
                <Copy className="w-3 h-3 text-[#6B7280]" />
              )}
            </div>

            {/* Validity date */}
            <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
              <Calendar className="w-3 h-3" />
              <span>Till {validTill}</span>
            </div>
          </div>

          {terms && (
            <p className="text-[10px] text-[#9CA3AF] mb-3 line-clamp-1">
              * {terms}
            </p>
          )}

          <Button
            variant="primary"
            size="sm"
            isFullWidth
            onClick={() => {
              if (onApplyCode) onApplyCode(code);
            }}
          >
            {copied ? "Code Copied!" : "Book with Offer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
