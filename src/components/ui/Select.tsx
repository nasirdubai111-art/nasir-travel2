import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  options?: SelectOption[];
  isRequired?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      options = [],
      isRequired = false,
      disabled,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();
    const hasError = !!errorMessage;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#111827] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {isRequired && <span className="text-[#DC2626] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full h-11 pl-3.5 pr-10 text-sm bg-white text-[#111827] border rounded-[12px] appearance-none transition-all duration-150 outline-none cursor-pointer",
              hasError
                ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-red-100"
                : "border-[#E5E7EB] hover:border-[#CBD5E1] focus:border-[#0B5ED7] focus:ring-2 focus:ring-blue-100",
              disabled ? "bg-[#F1F5F9] text-[#9CA3AF] cursor-not-allowed" : "",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        {hasError ? (
          <span id={`${selectId}-error`} className="text-xs text-[#DC2626] font-medium">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={`${selectId}-helper`} className="text-xs text-[#6B7280]">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
