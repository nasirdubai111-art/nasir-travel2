import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Copy,
  Check,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code,
  Eye,
  Lock,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { BookingItem, UserProfile } from "../../types";

export interface PNRQRPayloadData {
  app: string;
  protocol: string;
  pnr: string;
  subPnr?: string;
  passenger: string;
  phone?: string;
  service: string;
  category: string;
  route?: string;
  date: string;
  time: string;
  seat: string;
  status: string;
  gateToken: string;
  securityHash: string;
  verifiedTimestamp: string;
  verificationUrl: string;
}

export interface PNRQRCodeProps {
  pnr: string;
  passengerName?: string;
  passengerPhone?: string;
  serviceTitle?: string;
  serviceCategory?: string;
  route?: string;
  travelDate?: string;
  departureTime?: string;
  seatInfo?: string;
  booking?: BookingItem;
  userProfile?: UserProfile;
  size?: number; // width & height in px
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  colorDark?: string;
  colorLight?: string;
  showPayloadPreview?: boolean;
  showControls?: boolean;
  onScanTest?: () => void;
  className?: string;
}

export function buildPNRPayload(props: PNRQRCodeProps): PNRQRPayloadData {
  const pnr = (props.pnr || props.booking?.pnr || "BY-984210").trim().toUpperCase();
  const passenger = props.passengerName || props.userProfile?.name || "Valued Traveller";
  const phone = props.passengerPhone || props.userProfile?.phone || "+91 98765 43210";
  const service = props.serviceTitle || props.booking?.title || "National Travel Service";
  const category = (props.serviceCategory || props.booking?.serviceType || "flights").toUpperCase();
  const date = props.travelDate || props.booking?.date || new Date().toISOString().slice(0, 10);
  const time = props.departureTime || props.booking?.time || "06:30 AM";
  const seat = props.seatInfo || props.booking?.seatInfo || "Confirmed Class";
  const route = props.route || props.booking?.subtitle || "Origin ➔ Destination";
  const gateToken = `GT-${pnr}-${Math.abs(pnr.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 9000 + 1000)}`;

  const hashSeed = `${pnr}:${passenger}:${date}:${category}:BHARATYATRA_SECURE_2026`;
  const securityHash = `SHA256-${Math.abs(hashSeed.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, "0")}`;

  return {
    app: "BharatYatra SuperApp",
    protocol: "IRCTC_DGCA_DIGIYATRA_V2",
    pnr,
    passenger,
    phone,
    service,
    category,
    route,
    date,
    time,
    seat,
    status: "CONFIRMED",
    gateToken,
    securityHash,
    verifiedTimestamp: new Date().toISOString(),
    verificationUrl: `https://bharatyatra.gov.in/verify/pnr?id=${encodeURIComponent(pnr)}&hash=${securityHash.slice(-8)}`,
  };
}

export const PNRQRCode: React.FC<PNRQRCodeProps> = (props) => {
  const {
    size = 140,
    errorCorrectionLevel = "H",
    colorDark = "#111827",
    colorLight = "#FFFFFF",
    showPayloadPreview = false,
    showControls = false,
    onScanTest,
    className,
  } = props;

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
  const [activeColor, setActiveColor] = useState(colorDark);
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">(errorCorrectionLevel);

  const payload = React.useMemo(() => buildPNRPayload(props), [
    props.pnr,
    props.passengerName,
    props.serviceTitle,
    props.travelDate,
    props.seatInfo,
    props.booking,
  ]);

  const rawPayloadString = React.useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(rawPayloadString, {
      width: size * 2, // 2x for sharp retina rendering
      margin: 1,
      errorCorrectionLevel: ecc,
      color: {
        dark: activeColor,
        light: colorLight,
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [rawPayloadString, size, ecc, activeColor, colorLight]);

  const handleCopyPnr = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload.pnr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyJson = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rawPayloadString);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `QR-${payload.pnr}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-[12px] bg-white border border-[#E5E7EB] shadow-2xs text-left",
        className
      )}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-2 pb-2 mb-1.5 border-b border-[#F3F4F6] text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#111827]">
          <QrCode className="w-4 h-4 text-[#1B4332]" />
          <span>Dynamic Gate QR</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#DCFCE7] text-[#16A34A] font-semibold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5" />
            Signed
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyPnr}
            className="p-1 rounded-[6px] hover:bg-slate-100 text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
            title="Copy PNR"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#16A34A]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleDownloadPNG}
            className="p-1 rounded-[6px] hover:bg-slate-100 text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
            title="Download QR Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QR Visual Canvas */}
      <div className="relative p-2 bg-white rounded-[8px] border border-[#E5E7EB] flex items-center justify-center my-1 group">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR Code for PNR ${payload.pnr}`}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="object-contain select-none"
          />
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="bg-slate-50 flex items-center justify-center text-xs text-[#6B7280] animate-pulse"
          >
            Rendering QR...
          </div>
        )}

        {/* Center Logo Overlay */}
        <div className="absolute inset-0 m-auto w-7 h-7 rounded-[6px] bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black text-[#1B4332]">BY</span>
        </div>
      </div>

      {/* Security Gate Seal */}
      <div className="flex items-center gap-1 text-[10px] text-[#16A34A] font-semibold mt-1">
        <ShieldCheck className="w-3 h-3" />
        <span>Gate Token: <strong className="font-mono text-[#111827]">{payload.gateToken}</strong></span>
      </div>

      {/* Optional Payload Details & Action Tools */}
      {showControls && (
        <div className="w-full mt-2.5 pt-2 border-t border-[#F3F4F6] space-y-2 text-xs">
          {/* Color Presets & ECC */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-[#6B7280] text-[10px]">Theme:</span>
              {[
                { name: "Slate", color: "#111827" },
                { name: "Forest", color: "#1B4332" },
                { name: "Emerald", color: "#16A34A" },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => setActiveColor(c.color)}
                  style={{ backgroundColor: c.color }}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full cursor-pointer transition-transform",
                    activeColor === c.color ? "ring-2 ring-offset-1 ring-[#1B4332] scale-110" : ""
                  )}
                  title={c.name}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[#6B7280] text-[10px]">ECC:</span>
              {(["M", "Q", "H"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setEcc(level)}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer",
                    ecc === level ? "bg-[#1B4332] text-white" : "bg-slate-100 text-[#4B5563]"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsJsonDrawerOpen(!isJsonDrawerOpen)}
              className="flex-1 py-1 px-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#4B5563] text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Code className="w-3 h-3 text-[#1B4332]" />
              <span>{isJsonDrawerOpen ? "Hide Payload" : "View Payload"}</span>
            </button>

            {onScanTest && (
              <button
                onClick={onScanTest}
                className="py-1 px-2 rounded-[6px] bg-emerald-50 hover:bg-emerald-100 text-[#1B4332] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>Test Scan</span>
              </button>
            )}
          </div>

          {/* Collapsible JSON View */}
          {isJsonDrawerOpen && (
            <div className="p-2 bg-slate-900 text-slate-100 rounded-[8px] font-mono text-[9px] relative mt-1 max-h-36 overflow-y-auto">
              <button
                onClick={handleCopyJson}
                className="absolute top-1.5 right-1.5 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy raw JSON"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <pre className="whitespace-pre-wrap">{rawPayloadString}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
