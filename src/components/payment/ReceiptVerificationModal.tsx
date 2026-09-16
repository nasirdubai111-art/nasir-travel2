import React from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  CreditCard,
  QrCode,
  FileCheck,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { SubscriptionPaymentReceipt } from "../../data/subscriptionPaymentData";

interface ReceiptVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: SubscriptionPaymentReceipt;
}

export function ReceiptVerificationModal({
  isOpen,
  onClose,
  receipt,
}: ReceiptVerificationModalProps) {
  const [copiedTxn, setCopiedTxn] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(receipt.transactionId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const paymentDateOnly = receipt.paymentDateTime.split(",")[0];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Verification Status Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  QR Scan Result
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-[10px] font-black">
                  Official Verification
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Payment Status:</span>
                <span className="bg-white text-emerald-800 px-2 py-0.5 rounded-md text-xs font-black shadow-xs">
                  VERIFIED ✓
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Data Body matching the user's exact specification */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="leading-snug">
              Authentic record validated against BharatYatra Central Gateway. Cryptographic checksum matches banking authorization ledger.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden bg-slate-50/50">
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Receipt No:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {receipt.receiptNumber}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Transaction ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                  {receipt.transactionId}
                </span>
                <button
                  onClick={handleCopyTxn}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    copiedTxn
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200"
                  }`}
                  title="Copy Transaction ID"
                >
                  {copiedTxn ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Subscription:</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {receipt.subscriptionPlan}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Amount Paid:</span>
              <span className="font-mono font-black text-sm text-emerald-700">
                ₹{receipt.totalPaid.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Payment Date:</span>
              <span className="font-bold text-slate-800">
                {paymentDateOnly}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Partner / Customer:</span>
              <span className="font-semibold text-slate-900">
                {receipt.partnerOrCustomerName} ({receipt.userOrPartnerId})
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 font-medium">Next Renewal:</span>
              <span className="font-semibold text-slate-700">
                {receipt.nextRenewalDate}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span>Verification Token:</span>
              <span className="text-slate-700 font-bold">{receipt.verificationCode}</span>
            </div>
            <p className="text-[10px] text-slate-400">
              * Note: In compliance with RBI data localization and PCI-DSS standards, the QR verification payload contains only cryptographic transaction metadata, strictly omitting credit/debit card numbers or UPI PINs.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
