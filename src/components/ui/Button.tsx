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
    // Base styles: rounded cards/buttons (12px), bold typography, focus ring, transition
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]";

    // Size variants conforming to the 8px spacing system
    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    // Variant color definitions based on design tokens
    const variantStyles = {
      primary:
        "bg-[#1B4332] hover:bg-[#143225] active:bg-[#0E231A] text-white shadow-sm focus-visible:ring-[#1B4332]",
      secondary:
        "bg-[#FCFBF7] hover:bg-[#E8F5E9] text-[#1B4332] border border-[#2D6A4F]/40 hover:border-[#2D6A4F] shadow-xs focus-visible:ring-[#1B4332]",
      accent:
        "bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#143225] text-white shadow-sm focus-visible:ring-[#2D6A4F]",
      success:
        "bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#143225] text-white shadow-sm focus-visible:ring-[#2D6A4F]",
      danger:
        "bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-sm focus-visible:ring-[#DC2626]",
      ghost:
        "bg-transparent hover:bg-[#E8F5E9] text-[#2D3A30] hover:text-[#1B4332] focus-visible:ring-[#2D6A4F]",
      link:
        "bg-transparent text-[#1B4332] hover:text-[#2D6A4F] hover:underline p-0 h-auto font-bold focus-visible:ring-[#1B4332]",
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
