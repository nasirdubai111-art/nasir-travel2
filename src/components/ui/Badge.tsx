import React from "react";
import { CheckCircle2, Clock, XCircle, Check, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "failed"
  | "refunded"
  | "active"
  | "inactive"
  | "available"
  | "soldout"
  | "offer"
  | "new"
  | "primary"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  showIcon = true,
  className,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantConfigs: Record<
    BadgeVariant,
    { styles: string; defaultText: string; icon?: React.ReactNode }
  > = {
    confirmed: {
      styles: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20 font-bold",
      defaultText: "Confirmed",
      icon: <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />,
    },
    completed: {
      styles: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20 font-bold",
      defaultText: "Completed",
      icon: <Check className="w-3 h-3 text-[#16A34A]" />,
    },
    available: {
      styles: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20 font-semibold",
      defaultText: "Available",
      icon: <Check className="w-3 h-3 text-[#16A34A]" />,
    },
    active: {
      styles: "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20 font-semibold",
      defaultText: "Active",
      icon: <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />,
    },
    pending: {
      styles: "bg-[#FEF3C7] text-[#D97706] border border-[#F59E0B]/20 font-bold",
      defaultText: "Pending",
      icon: <Clock className="w-3 h-3 text-[#D97706]" />,
    },
    cancelled: {
      styles: "bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20 font-bold",
      defaultText: "Cancelled",
      icon: <XCircle className="w-3 h-3 text-[#DC2626]" />,
    },
    failed: {
      styles: "bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20 font-bold",
      defaultText: "Failed",
      icon: <AlertCircle className="w-3 h-3 text-[#DC2626]" />,
    },
    soldout: {
      styles: "bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/20 font-bold",
      defaultText: "Sold Out",
      icon: <XCircle className="w-3 h-3 text-[#DC2626]" />,
    },
    refunded: {
      styles: "bg-[#DBEAFE] text-[#2563EB] border border-[#2563EB]/20 font-bold",
      defaultText: "Refunded",
      icon: <RefreshCw className="w-3 h-3 text-[#2563EB]" />,
    },
    inactive: {
      styles: "bg-slate-100 text-[#6B7280] border border-slate-200 font-medium",
      defaultText: "Inactive",
      icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />,
    },
    offer: {
      styles: "bg-[#FFF3E0] text-[#B45309] border border-[#F59E0B]/30 font-extrabold",
      defaultText: "Offer",
      icon: <Zap className="w-3 h-3 text-[#F59E0B]" />,
    },
    new: {
      styles: "bg-[#E8F5E9] text-[#1B4332] border border-[#2D6A4F]/20 font-bold",
      defaultText: "New",
      icon: <Zap className="w-3 h-3 text-[#2D6A4F]" />,
    },
    primary: {
      styles: "bg-[#1B4332] text-white font-bold",
      defaultText: "Primary",
    },
    neutral: {
      styles: "bg-[#F1F5F9] text-[#4B5563] border border-[#E5E7EB] font-medium",
      defaultText: "",
    },
  };

  const config = variantConfigs[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full select-none whitespace-nowrap transition-colors",
        sizeStyles[size],
        config.styles,
        className
      )}
      {...props}
    >
      {showIcon && config.icon && <span className="shrink-0">{config.icon}</span>}
      <span>{children || config.defaultText}</span>
    </span>
  );
};
