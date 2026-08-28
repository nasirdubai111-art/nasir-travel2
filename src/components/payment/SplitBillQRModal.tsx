import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, QrCode, CheckCircle2, Copy, Check, ExternalLink, Share2, Smartphone, Send } from "lucide-react";
import { SplitBillConfig, SplitBillMember } from "../../types";
import { SplitBillService } from "../../services/SplitBillService";

interface SplitBillQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SplitBillConfig;
  member: SplitBillMember;
  onStatusChange?: (newStatus: "paid" | "pending") => void;
}

export const SplitBillQRModal: React.FC<SplitBillQRModalProps> = ({
  isOpen,
  onClose,
  config,
  member,
  onStatusChange,
}) => {
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !member) return;
    let isMounted = true;

    QRCode.toDataURL(member.upiDeepLink, {
      width: 240,
      margin: 1.5,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) setQrUrl(url);
      })
      .catch((err) => {
        console.error("QR Code Error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(member.paymentLink);
      setCopiedLink(true);
      showToast("Payment link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(member.upiDeepLink);
      setCopiedUpi(true);
      showToast("UPI Deep link copied!");
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = SplitBillService.formatMemberWhatsAppMessage(config, member);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    showToast(`WhatsApp share opened for ${member.name}!`);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {member.name}'s Share QR
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Scan with any UPI app to pay ₹{member.shareAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center space-y-4 overflow-y-auto max-h-[80vh]">
          {toastMessage && (
            <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg animate-in fade-in shadow-xs">
              {toastMessage}
            </div>
          )}

          {/* Amount Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 inline-block w-full">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Amount Due
            </span>
            <div className="text-2xl font-black text-indigo-700">
              ₹{member.shareAmount.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {config.title} {config.pnr ? `(PNR: ${config.pnr})` : ""}
            </span>
          </div>

          {/* QR Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-sm inline-flex flex-col items-center justify-center relative mx-auto">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="UPI Payment QR Code"
                className="w-48 h-48 rounded-lg shadow-2xs"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-lg text-xs text-slate-400">
                Generating QR...
              </div>
            )}

            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span>Payee UPI:</span>
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono">
                {config.primaryBookerUpiId || member.upiId || "yatri@bharatyatra.in"}
              </code>
            </div>
          </div>

          {/* Supported UPI Apps Row */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Supported Instant Payment Apps
            </span>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 flex-wrap">
              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                Google Pay
              </span>
              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                PhonePe
              </span>
              <span className="px-2 py-1 bg-sky-50 text-sky-700 rounded-md border border-sky-200">
                Paytm
              </span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                BHIM UPI
              </span>
              <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                Cred
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share Payment Link on WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Web Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyUpi}
                className="py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-200 transition-colors cursor-pointer"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>UPI Copied</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Copy UPI Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Status Toggle */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const nextStatus = member.paymentStatus === "paid" ? "pending" : "paid";
                  onStatusChange?.(nextStatus);
                  showToast(
                    nextStatus === "paid"
                      ? `Marked ${member.name}'s share as Received!`
                      : `Marked ${member.name}'s share as Pending.`
                  );
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  member.paymentStatus === "paid"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    member.paymentStatus === "paid" ? "text-emerald-600 fill-emerald-100" : "text-slate-400"
                  }`}
                />
                <span>
                  {member.paymentStatus === "paid"
                    ? "Status: Paid (Click to Mark Pending)"
                    : "Mark as Received / Paid"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
