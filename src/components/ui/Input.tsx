import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      isRequired = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hasError = !!errorMessage;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#111827] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {isRequired && <span className="text-[#DC2626] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#6B7280] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3.5 text-sm bg-white text-[#1B4332] placeholder:text-[#7A8A7E] border rounded-xl transition-all duration-150 outline-none",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              hasError
                ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-red-100"
                : "border-[#E8E5DD] hover:border-[#2D6A4F] focus:border-[#1B4332] focus:ring-2 focus:ring-[#D8F3DC]",
              disabled ? "bg-[#F4F1EA] text-[#9CA3AF] cursor-not-allowed" : "",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-[#6B7280] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {hasError ? (
          <span id={`${inputId}-error`} className="text-xs text-[#DC2626] font-medium animate-in fade-in duration-100">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={`${inputId}-helper`} className="text-xs text-[#6B7280]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
