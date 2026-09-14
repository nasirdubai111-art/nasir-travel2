import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost" | "link" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles: 8px radius, medium/semibold typography, focus ring, transition
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-[8px] transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]";

    // Size variants conforming to the 8px spacing system
    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    // Variant color definitions based on design tokens
    const variantStyles = {
      primary:
        "bg-[#0B5ED7] hover:bg-[#084298] active:bg-[#06357A] text-white shadow-sm focus-visible:ring-[#0B5ED7]",
      secondary:
        "bg-white hover:bg-[#E7F1FF] text-[#0B5ED7] border border-[#0B5ED7] shadow-xs focus-visible:ring-[#0B5ED7]",
      accent:
        "bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-white shadow-sm focus-visible:ring-[#F59E0B]",
      success:
        "bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534] text-white shadow-sm focus-visible:ring-[#16A34A]",
      danger:
        "bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-sm focus-visible:ring-[#DC2626]",
      ghost:
        "bg-transparent hover:bg-slate-100 text-[#4B5563] hover:text-[#111827] focus-visible:ring-slate-400",
      link:
        "bg-transparent text-[#0B5ED7] hover:underline p-0 h-auto font-medium focus-visible:ring-[#0B5ED7]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          isFullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
