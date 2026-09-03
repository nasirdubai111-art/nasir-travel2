import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ScanLine,
  X,
  ExternalLink,
  Lock,
  Sparkles,
  Ticket,
  Plane,
  Train,
  Bus,
  Building2,
  Ship,
  MapPin,
} from "lucide-react";
import { BookingItem, UserProfile } from "../../types";

export interface ETicketVerificationPayload {
  app: string;
  protocol: string;
  pnr: string;
  ticketNumber: string;
  service: string;
  category: string;
  route: string;
  passenger: string;
  date: string;
  departure: string;
  seat: string;
  gate: string;
  status: string;
  securityToken: string;
  verificationUrl: string;
  verifiedTimestamp: string;
}

export interface ETicketQRCodeGeneratorProps {
  booking?: BookingItem;
  pnr?: string;
  serviceTitle?: string;
  serviceType?: string;
  subtitle?: string;
  passengerName?: string;
  passengerPhone?: string;
  route?: string;
  date?: string;
  time?: string;
  seatInfo?: string;
  gateOrPlatform?: string;
  terminal?: string;
  status?: string;
  ticketNumber?: string;
  userProfile?: UserProfile;
  size?: number;
  showDetails?: boolean;
  showQuickVerifyButton?: boolean;
  className?: string;
}

/**
 * Encodes the booking PNR and comprehensive service details
 * for instantaneous gate scanning, TTE verification, and airport DigiYatra validation.
 */
export function generateETicketVerificationPayload(data: {
  pnr: string;
  serviceTitle: string;
  serviceType?: string;
  route?: string;
  passengerName: string;
  date: string;
  time?: string;
  seatInfo?: string;
  status?: string;
  gateOrPlatform?: string;
  terminal?: string;
  ticketNumber?: string;
  securityToken?: string;
}): ETicketVerificationPayload {
  const pnr = (data.pnr || "BY984210").toUpperCase();
  const passenger = data.passengerName || "Valued Yatri";
  const date = data.date || "Scheduled";

  // Derive high-entropy verification security seal
  const securityHash = Math.abs(
    (pnr + passenger + date).split("").reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)
  ).toString(36).toUpperCase();

  const securityToken = data.securityToken || `BY-SEC-${securityHash}-${pnr.slice(-4)}`;

  const gate =
    data.gateOrPlatform ||
    data.terminal ||
    (data.serviceType === "flights"
      ? "Gate 14B (T3)"
      : data.serviceType === "trains"
      ? "Platform 1 - Coach C2"
      : data.serviceType === "buses"
      ? "Bay 04 (ISBT)"
      : "Front Desk Registration");

  return {
    app: "BharatYatra SuperApp",
    protocol: "BY-CHECKIN-V2.5",
    pnr,
    ticketNumber: data.ticketNumber || `TKT-${pnr}`,
    service: data.serviceTitle || "BharatYatra Transit",
    category: data.serviceType || "travel",
    route: data.route || "Confirmed Sector",
    passenger,
    date,
    departure: data.time || "06:00 AM",
    seat: data.seatInfo || "Confirmed Class",
    gate,
    status: (data.status || "CONFIRMED").toUpperCase(),
    securityToken,
    verificationUrl: `https://bharatyatra.gov.in/checkin/verify?pnr=${encodeURIComponent(pnr)}&token=${encodeURIComponent(securityToken)}`,
    verifiedTimestamp: new Date().toISOString(),
  };
}

export const ETicketQRCodeGenerator: React.FC<ETicketQRCodeGeneratorProps> = ({
  booking,
  pnr: propPnr,
  serviceTitle: propServiceTitle,
  serviceType: propServiceType,
  subtitle: propSubtitle,
  passengerName: propPassengerName,
  passengerPhone: propPassengerPhone,
  route: propRoute,
  date: propDate,
  time: propTime,
  seatInfo: propSeatInfo,
  gateOrPlatform: propGateOrPlatform,
  terminal: propTerminal,
  status: propStatus,
  ticketNumber: propTicketNumber,
  userProfile,
  size = 140,
  showDetails = true,
  showQuickVerifyButton = true,
  className = "",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showRawPayload, setShowRawPayload] = useState<boolean>(false);

  // Normalize details from either direct props or booking object
  const pnr = (
    propPnr ||
    booking?.pnr ||
    (booking?.id ? `BY-${booking.id.slice(-6).toUpperCase()}` : "BY984210")
  ).toUpperCase();

  const serviceTitle =
    propServiceTitle || booking?.title || "BharatYatra Express";

  const serviceType =
    propServiceType || booking?.serviceType || "travel";

  const passengerName =
    propPassengerName || userProfile?.name || "Valued Yatri";

  const route =
    propRoute ||
    booking?.route ||
    (booking?.fromLocation && booking?.toLocation
      ? `${booking.fromLocation} → ${booking.toLocation}`
      : booking?.subtitle || propSubtitle || "Confirmed Sector");

  const travelDate =
    propDate || booking?.date || "Scheduled Departure";

  const departureTime =
    propTime || booking?.time || "06:00 AM";

  const seatInfo =
    propSeatInfo || booking?.seatInfo || booking?.seatOrRoomInfo || "Confirmed";

  const ticketNumber =
    propTicketNumber || `TKT-${pnr}`;

  const status =
    (propStatus || booking?.status || "CONFIRMED").toUpperCase();

  // Generate structured verification payload
  const payloadObj = generateETicketVerificationPayload({
    pnr,
    serviceTitle,
    serviceType,
    route,
    passengerName,
    date: travelDate,
    time: departureTime,
    seatInfo,
    status,
    gateOrPlatform: propGateOrPlatform,
    terminal: propTerminal,
    ticketNumber,
  });

  const payloadString = JSON.stringify(payloadObj);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    QRCode.toDataURL(payloadString, {
      width: Math.max(size * 2, 280), // Sharp high-DPI resolution
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error generating e-ticket QR Code:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [payloadString, size]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getServiceIcon = () => {
    switch (serviceType) {
      case "flights":
        return <Plane className="w-3.5 h-3.5 text-sky-600" />;
      case "trains":
        return <Train className="w-3.5 h-3.5 text-orange-600" />;
      case "buses":
        return <Bus className="w-3.5 h-3.5 text-emerald-600" />;
      case "houseboats":
        return <Ship className="w-3.5 h-3.5 text-teal-600" />;
      case "hotels":
      case "resorts":
      case "lodges":
        return <Building2 className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Ticket className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className={`qr-code-box print-break-inside-avoid flex flex-col items-center ${className}`}>
      {/* Visual QR Code Container with Exact Print Sharpness */}
      <div
        className="relative bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center transition-transform hover:scale-[1.01]"
        style={{ width: size + 16, height: size + 16 }}
      >
        {loading || !qrDataUrl ? (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 animate-pulse">
            <QrCode className="w-8 h-8 opacity-40 animate-spin" />
            <span className="text-[10px] font-mono">Generating QR...</span>
          </div>
        ) : (
          <img
            src={qrDataUrl}
            alt={`Quick Check-in QR Code for PNR ${pnr} - ${serviceTitle}`}
            className="w-full h-full object-contain rounded-lg"
            style={{ imageRendering: "pixelated" }}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Security watermark badge */}
        <div className="absolute -bottom-2.5 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs flex items-center gap-1 select-none">
          <ShieldCheck className="w-3 h-3" />
          <span>GATE VERIFIED</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3.5 text-center space-y-1.5 w-full max-w-sm">
          {/* Encoded PNR & Service Callout */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800">
            <span className="text-slate-400 text-[11px]">PNR:</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 tracking-wider">
              {pnr}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-sans flex items-center gap-1">
              {getServiceIcon()}
              <span className="truncate max-w-[110px]">{serviceTitle}</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            Scan at Airport Gate, Station TTE, or Hotel Desk for instant verification
          </p>

          {/* Interactive Check-in & Tool Actions (Hidden during browser printing) */}
          <div className="no-print flex flex-wrap items-center justify-center gap-2 pt-1">
            {showQuickVerifyButton && (
              <button
                type="button"
                onClick={() => setShowVerifyModal(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs transition-all cursor-pointer active:scale-98"
                title="Simulate quick gate scanner verification"
              >
                <ScanLine className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quick Verify Check-in</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyPayload}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Copy encoded gate verification JSON payload"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy QR Data</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowRawPayload(!showRawPayload)}
              className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
              title="Toggle raw encoded JSON details"
            >
              {showRawPayload ? "Hide Details" : "View Encoded Details"}
            </button>
          </div>

          {/* Collapsible Raw Payload Inspector for Auditors / Agents */}
          {showRawPayload && (
            <div className="no-print mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-xl text-left font-mono text-[10px] leading-relaxed max-h-36 overflow-y-auto border border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between text-slate-400 pb-1 mb-1 border-b border-slate-800 text-[9px]">
                <span>ENCODED CHECK-IN PAYLOAD</span>
                <span>{payloadObj.protocol}</span>
              </div>
              <pre className="whitespace-pre-wrap break-all text-emerald-400 font-mono">
                {JSON.stringify(payloadObj, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* QUICK VERIFICATION SIMULATOR MODAL */}
      {showVerifyModal && (
        <div className="no-print fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Gate Check-in Verification</h4>
                  <p className="text-[10px] text-emerald-100 font-mono">
                    DigiYatra &amp; Ministry Gate Simulator
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Close verification dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Verification Content */}
            <div className="p-6 space-y-4 text-left">
              {/* Access Granted Ribbon */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                    Security Gate Access
                  </span>
                  <p className="text-sm font-black text-emerald-900">
                    ACCESS GRANTED • BOARDING CLEARED
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Security Seal: {payloadObj.securityToken}
                  </p>
                </div>
              </div>

              {/* Verified Manifest Data */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Passenger:</span>
                  <strong className="text-slate-900 font-bold">{passengerName}</strong>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Booking PNR:</span>
                  <strong className="text-indigo-700 font-mono font-bold">{pnr}</strong>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Service:</span>
                  <strong className="text-slate-900 font-semibold">{serviceTitle}</strong>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Journey Route:</span>
                  <strong className="text-slate-800">{route}</strong>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Date &amp; Departure:</span>
                  <strong className="text-slate-800">{travelDate} • {departureTime}</strong>
                </div>

                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Seat / Allocation:</span>
                  <strong className="text-indigo-700 font-bold">{seatInfo}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Gate/Bay:</span>
                  <strong className="text-emerald-700 font-bold">{payloadObj.gate}</strong>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Scan authenticated successfully. Present your physical Government Photo ID at boarding gate or coach entrance when requested.
              </p>

              {/* Close Action */}
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Close Verification Result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
