import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";
import { BookingItem, BookingPassengerDetail, UserProfile } from "../types";

interface DynamicQRCodeProps {
  booking: BookingItem;
  userProfile?: UserProfile;
  passenger?: BookingPassengerDetail;
  size?: number;
  showDetails?: boolean;
  className?: string;
}

export function generateBookingQRPayload(
  booking: BookingItem,
  userProfile?: UserProfile,
  passenger?: BookingPassengerDetail
) {
  const masterPnr = booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;
  const pnr = passenger?.subPnr || masterPnr;
  const passengerName = passenger?.name || userProfile?.name || "Valued Yatri";
  const passengerPhone = passenger?.phone || userProfile?.phone || "+91 98765 43210";
  const seatInfo = passenger?.seatNumber || booking.seatInfo || booking.seatOrRoomInfo || "Confirmed Class";
  const travelDate = booking.date || "Scheduled Departure";
  const time = booking.time || "06:00 AM";
  const gateToken = passenger?.gateToken || `GP-${pnr}-${booking.id.slice(-4).toUpperCase()}`;

  // Form structured VCard / AAI / IRCTC compliant gate check-in payload
  return JSON.stringify({
    app: "BharatYatra SuperApp",
    version: "2.4",
    ticketType: passenger ? "INDIVIDUAL_PASSENGER_TICKET" : "MASTER_BOOKING_VOUCHER",
    masterPnr,
    pnr,
    ticketId: passenger?.ticketId || `TKT-${pnr}`,
    passenger: passengerName,
    age: passenger?.age,
    gender: passenger?.gender,
    phone: passengerPhone,
    service: booking.title,
    category: booking.serviceType,
    date: travelDate,
    departure: time,
    seat: seatInfo,
    status: "CONFIRMED",
    amount: passenger?.fareShare || booking.amount,
    gateToken,
    authSignature: `BY-VERIFIED-${Math.abs((pnr + passengerName).split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
    verifiedTimestamp: new Date().toISOString(),
  });
}

export const DynamicQRCode: React.FC<DynamicQRCodeProps> = ({
  booking,
  userProfile,
  passenger,
  size = 140,
  showDetails = false,
  className = "",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const payload = generateBookingQRPayload(booking, userProfile, passenger);
  const displayPnr = passenger?.subPnr || booking.pnr || `BY-${booking.id.slice(-6).toUpperCase()}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    QRCode.toDataURL(payload, {
      width: size * 2, // High DPI
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
        console.error("Error generating QR Code:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [payload, size]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center transition-transform hover:scale-[1.02]"
        style={{ width: size + 20, height: size + 20 }}
      >
        {loading || !qrDataUrl ? (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 animate-pulse">
            <QrCode className="w-8 h-8 opacity-40 animate-spin" />
            <span className="text-[10px] font-mono">Generating QR...</span>
          </div>
        ) : (
          <img
            src={qrDataUrl}
            alt={`QR Code for PNR ${displayPnr}`}
            className="w-full h-full object-contain rounded-lg"
            style={{ imageRendering: "pixelated" }}
          />
        )}

        {/* Security watermark badge */}
        <div className="absolute -bottom-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>BY-SECURE</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3.5 text-center space-y-1 w-full max-w-xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-800">
            <span className="text-slate-400">PNR:</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              {displayPnr}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Scan at Airport Gate, Train TTE or Hotel Reception for instant check-in
          </p>

          <button
            onClick={handleCopyPayload}
            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            title="Copy raw gate verification payload"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Payload Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy QR Data Payload</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
