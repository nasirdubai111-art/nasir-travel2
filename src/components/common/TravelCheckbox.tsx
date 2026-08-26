import React from "react";
import { Check } from "lucide-react";

export interface TravelCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  subLabel?: React.ReactNode;
  count?: number | string;
  disabled?: boolean;
  className?: string;
  name?: string;
  value?: string;
}

/**
 * TravelCheckbox Component
 * Conforms to the Travel Platform UI specifications:
 * - Size: 20 × 20 px
 * - Border radius: 5 px
 * - Border: 1.5 px (#CBD5E1)
 * - Checked state: Travel Blue (#0B5ED7) with white check icon
 * - Hover state: light-blue background (#F0F7FF)
 * - Disabled: Gray state (#F1F5F9)
 */
export const TravelCheckbox: React.FC<TravelCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  subLabel,
  count,
  disabled = false,
  className = "",
  name,
  value,
}) => {
  const generatedId = id || (name && value ? `${name}-${value}` : undefined);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={generatedId}
      onClick={handleClick}
      className={`group flex items-start gap-2.5 select-none transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div
        id={generatedId ? `${generatedId}-box` : undefined}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150 mt-0.5 ${
          checked
            ? "bg-[#0B5ED7] border-[#0B5ED7] text-white shadow-xs"
            : disabled
            ? "bg-[#F1F5F9] border-[#E2E8F0]"
            : "bg-white border-[#CBD5E1] group-hover:bg-[#F0F7FF] group-hover:border-[#0B5ED7]"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>

      {(label || subLabel || count !== undefined) && (
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between gap-2">
            {label && (
              <span
                className={`text-[14px] leading-tight font-medium ${
                  checked ? "text-[#0B5ED7] font-semibold" : "text-[#172033]"
                } ${disabled ? "text-[#94A3B8]" : ""}`}
              >
                {label}
              </span>
            )}
            {count !== undefined && (
              <span className="text-[12px] font-normal text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded-[4px]">
                {count}
              </span>
            )}
          </div>
          {subLabel && (
            <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">{subLabel}</p>
          )}
        </div>
      )}
    </label>
  );
};
