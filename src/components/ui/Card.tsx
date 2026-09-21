import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isHoverable = false, padding = "md", children, ...props }, ref) => {
    const paddingStyles = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-5 md:p-6",
      lg: "p-6 sm:p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border border-[#E8E5DD] rounded-2xl shadow-xs text-[#1B4332] transition-all duration-200",
          isHoverable
            ? "hover:border-[#2D6A4F] hover:shadow-lg hover:shadow-[#1B4332]/5 cursor-pointer active:scale-[0.99]"
            : "",
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-col gap-1 pb-3 sm:pb-4 border-b border-[#F0EDE6]", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn("text-base sm:text-lg font-bold text-[#1B4332] tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn("text-xs sm:text-sm text-[#526658] leading-relaxed", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => <div className={cn("pt-3 sm:pt-4", className)} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[#F0EDE6] text-xs text-[#526658]",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
