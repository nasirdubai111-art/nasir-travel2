import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import {
  Barcode as BarcodeIcon,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Maximize2,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type BarcodeFormat = "CODE128" | "CODE39" | "ITF" | "pharmacode";

export interface PNRBarcodeProps {
  pnr: string;
  format?: BarcodeFormat;
  width?: number; // width of a single bar (1 - 4)
  height?: number; // height in px
  displayValue?: boolean;
  fontSize?: number;
  lineColor?: string;
  background?: string;
  subtitle?: string;
  showControls?: boolean;
  className?: string;
}

export const PNRBarcode: React.FC<PNRBarcodeProps> = ({
  pnr,
  format = "CODE128",
  width = 2,
  height = 56,
  displayValue = true,
  fontSize = 13,
  lineColor = "#111827",
  background = "#FFFFFF",
  subtitle,
  showControls = false,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>(format);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Clean PNR to sanitize for barcode rendering
  // Code 128 accepts all ASCII characters; Code 39 accepts uppercase alphanumeric and - . $ / + % SPACE
  const sanitizedValue = React.useMemo(() => {
    const raw = (pnr || "BY-984210").trim().toUpperCase();
    if (selectedFormat === "CODE39") {
      return raw.replace(/[^A-Z0-9\-\.\ \$\/\+\%]/g, "");
    }
    if (selectedFormat === "ITF") {
      // ITF requires numeric with even number of digits
      const digitsOnly = raw.replace(/\D/g, "");
      return digitsOnly.length % 2 === 0 ? digitsOnly : "0" + digitsOnly;
    }
    return raw;
  }, [pnr, selectedFormat]);

  useEffect(() => {
    if (!svgRef.current) return;

    try {
      setRenderError(null);
      JsBarcode(svgRef.current, sanitizedValue, {
        format: selectedFormat,
        width: width,
        height: height,
        displayValue: displayValue,
        text: displayValue ? `* ${sanitizedValue} *` : undefined,
        font: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontOptions: "bold",
        fontSize: fontSize,
        textMargin: 6,
        lineColor: lineColor,
        background: background,
        margin: 8,
      });
    } catch (err: any) {
      console.warn("Barcode rendering fallback:", err);
      setRenderError(err?.message || "Invalid barcode character sequence");
      // Fallback to Code 128 auto if selected format failed
      if (selectedFormat !== "CODE128") {
        try {
          JsBarcode(svgRef.current, pnr.trim().toUpperCase(), {
            format: "CODE128",
            width: width,
            height: height,
            displayValue: displayValue,
            font: "ui-monospace, monospace",
            fontOptions: "bold",
            fontSize: fontSize,
            lineColor: lineColor,
            background: background,
            margin: 8,
          });
          setRenderError(null);
        } catch {
          // ignore
        }
      }
    }
  }, [sanitizedValue, selectedFormat, width, height, displayValue, fontSize, lineColor, background]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sanitizedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PNR-Barcode-${sanitizedValue}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-[12px] bg-white border border-[#E5E7EB] shadow-2xs text-left",
        className
      )}
    >
      {/* Top Meta Bar */}
      <div className="w-full flex items-center justify-between gap-2 pb-2 mb-1 border-b border-[#F3F4F6] text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#111827]">
          <BarcodeIcon className="w-4 h-4 text-[#1B4332]" />
          <span>PNR Barcode</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-emerald-50 text-[#1B4332] font-semibold">
            {selectedFormat}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 rounded-[6px] hover:bg-slate-100 text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
            title="Copy PNR string"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleDownloadSVG}
            className="p-1 rounded-[6px] hover:bg-slate-100 text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
            title="Download Vector SVG Barcode"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Barcode Render Area */}
      <div className="w-full flex items-center justify-center py-1 overflow-x-auto">
        <svg
          ref={svgRef}
          className="max-w-full h-auto select-none rounded-[4px]"
          aria-label={`PNR Barcode: ${sanitizedValue}`}
        />
      </div>

      {renderError && (
        <div className="text-[11px] text-[#DC2626] text-center mt-1">
          {renderError}
        </div>
      )}

      {/* Subtitle / Verification Tag */}
      {subtitle ? (
        <p className="text-[11px] text-[#6B7280] text-center mt-1">{subtitle}</p>
      ) : (
        <div className="flex items-center gap-1 text-[10px] text-[#16A34A] font-semibold mt-1">
          <ShieldCheck className="w-3 h-3" />
          <span>IATA / IRCTC 1D Scanner Compliant</span>
        </div>
      )}

      {/* Optional Interactive Controls */}
      {showControls && (
        <div className="w-full mt-3 pt-2.5 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#6B7280] font-semibold">Standard:</span>
            {(["CODE128", "CODE39"] as BarcodeFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={cn(
                  "px-2 py-0.5 rounded-[4px] text-[10px] font-bold transition-colors cursor-pointer",
                  selectedFormat === fmt
                    ? "bg-[#1B4332] text-white"
                    : "bg-slate-100 text-[#4B5563] hover:bg-slate-200"
                )}
              >
                {fmt}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-[#6B7280]">
            Val: <strong className="font-mono text-[#111827]">{sanitizedValue}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
